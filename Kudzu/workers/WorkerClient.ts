import type { progressCallback } from "../tasks/progressCallback";
import { assertNever, isFunction, isNullOrUndefined, isNumber, isString } from "../typeChecks";
import type { WorkerMethodMessages } from "./WorkerServer";
import { WorkerMethodMessageType } from "./WorkerServer";

export type workerClientCallback<T> = (...params: any[]) => Promise<T>;

export class WorkerClient {
    static isSupported = "Worker" in globalThis;

    private taskCounter: number = 0;
    private workers: Worker[];
    private _script: string;

    /**
     * Creates a new pooled worker method executor.
     * @param scriptPath - the path to the unminified script to use for the worker
     * @param minScriptPath - the path to the minified script to use for the worker (optional)
     * @param workerPoolSize - the number of worker threads to create for the pool (defaults to 1)
     */
    constructor(scriptPath: string);
    constructor(scriptPath: string, minScriptPath: string);
    constructor(scriptPath: string, workerPoolSize: number);
    constructor(scriptPath: string, minScriptPath: string, workerPoolSize: number);
    constructor(scriptPath: string, minScriptPath?: number | string, workerPoolSize?: number) {

        if (!WorkerClient.isSupported) {
            console.warn("Workers are not supported on this system.");
        }

        // Normalize constructor parameters.
        if (isNumber(minScriptPath)) {
            workerPoolSize = minScriptPath;
            minScriptPath = undefined;
        }

        if (isNullOrUndefined(workerPoolSize)) {
            workerPoolSize = 1;
        }

        // Validate parameters
        if (workerPoolSize < 1) {
            throw new Error("Worker pool size must be a postive integer greater than 0");
        }

        // Choose which version of the script we're going to load.
        if (process.env.NODE_ENV === "development"
            || !isString(minScriptPath)) {
            this._script = scriptPath;
        }
        else {
            this._script = minScriptPath;
        }

        this.workers = new Array(workerPoolSize);
        for (let i = 0; i < workerPoolSize; ++i) {
            this.workers[i] = new Worker(this._script);
        }
    }

    get scriptPath() {
        return this._script;
    }

    private executeOnWorker<T>(worker: Worker, taskID: number, methodName: string, params: any[], transferables: any, onProgress: progressCallback): Promise<T> {
        return new Promise((resolve, reject) => {
            // When the invocation is complete, we want to stop listening to the worker
            // message channel so we don't eat up processing messages that have no chance
            // over pertaining to the invocation.
            const cleanup = () => {
                worker.removeEventListener("message", dispatchMessageResponse);
            };

            const dispatchMessageResponse = (evt: MessageEvent<WorkerMethodMessages>) => {
                const data = evt.data;

                // Did this response message match the current invocation?
                if (data.taskID === taskID) {
                    switch (data.methodName) {
                        case WorkerMethodMessageType.Progress:
                            if (isFunction(onProgress)) {
                                onProgress(data.soFar, data.total, data.msg);
                            }
                            break;
                        case WorkerMethodMessageType.Return:
                            cleanup();
                            resolve(undefined);
                            break;
                        case WorkerMethodMessageType.ReturnValue:
                            cleanup();
                            resolve(data.returnValue);
                            break;
                        case WorkerMethodMessageType.Error:
                            cleanup();
                            reject(new Error(`${methodName} failed. Reason: ${data.errorMessage}`));
                            break;
                        default: assertNever(data);
                    }
                }
            };

            worker.addEventListener("message", dispatchMessageResponse);

            if (params) {
                if (transferables) {
                    worker.postMessage({
                        taskID,
                        methodName,
                        params
                    }, transferables);
                }
                else {
                    worker.postMessage({
                        taskID,
                        methodName,
                        params
                    });
                }
            }
            else {
                if (transferables) {
                    worker.postMessage({
                        taskID,
                        methodName
                    }, transferables);
                }
                else {
                    worker.postMessage({
                        taskID,
                        methodName
                    });
                }
            }
        });
    }

    /**
     * Execute a method on the worker thread.
     * @param methodName - the name of the method to execute.
     */
    execute<T>(methodName: string): Promise<T>;

    /**
     * Execute a method on the worker thread.
     * @param methodName - the name of the method to execute.
     * @param params - the parameters to pass to the method.
     */
    execute<T>(methodName: string, params: any[]): Promise<T>;

    /**
     * Execute a method on the worker thread.
     * @param methodName - the name of the method to execute.
     * @param params - the parameters to pass to the method.
     * @param transferables - any values in any of the parameters that should be transfered instead of copied to the worker thread.
     */
    execute<T>(methodName: string, params: any[], transferables: Transferable[]): Promise<T>;

    /**
     * Execute a method on the worker thread.
     * @param methodName - the name of the method to execute.
     * @param params - the parameters to pass to the method.
     * @param onProgress - a callback for receiving progress reports on long-running invocations.
     */
    execute<T>(methodName: string, params: any[], onProgress?: progressCallback): Promise<T>;

    /**
     * Execute a method on the worker thread.
     * @param methodName - the name of the method to execute.
     * @param params - the parameters to pass to the method.
     * @param transferables - any values in any of the parameters that should be transfered instead of copied to the worker thread.
     * @param onProgress - a callback for receiving progress reports on long-running invocations.
     */
    execute<T>(methodName: string, params: any[] = null, transferables: any = null, onProgress: progressCallback = null): Promise<T | undefined> {
        if (!WorkerClient.isSupported) {
            return Promise.reject(new Error("Workers are not supported on this system."));
        }

        // Normalize method parameters.
        if (isFunction(transferables)
            && !onProgress) {
            onProgress = transferables;
            transferables = null;
        }

        // taskIDs help us keep track of return values.
        const taskID = this.taskCounter++;

        // Workers are pooled, so the modulus selects them in a round-robin fashion.
        const workerID = taskID % this.workers.length;

        const worker = this.workers[workerID];

        return this.executeOnWorker<T>(worker, taskID, methodName, params, transferables, onProgress);
    }
}