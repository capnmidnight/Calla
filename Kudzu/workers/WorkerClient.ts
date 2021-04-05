import { TypedEvent, TypedEventBase } from "../events/EventBase";
import { arrayProgress } from "../tasks/arrayProgress";
import type { progressCallback } from "../tasks/progressCallback";
import { assertNever, isArray, isDefined, isFunction, isNullOrUndefined, isNumber, isString } from "../typeChecks";
import {
    GET_PROPERTY_VALUES_METHOD,
    WorkerClientMethodCallMessage,
    WorkerClientPropertySetMessage,
    WorkerServerMessages
} from "./WorkerMessages";
import {
    WorkerClientMessageType,
    WorkerServerMessageType
} from "./WorkerMessages";

export type workerClientCallback<T> = (...params: any[]) => Promise<T>;

interface WorkerClientMessageHandler {
    onProgress: progressCallback;
    resolve: (value: any) => void;
    reject: (reason?: any) => void;
    methodName: string;
}

export class WorkerClient<EventsT> extends TypedEventBase<EventsT> {
    static isSupported = "Worker" in globalThis;

    private _script: string;
    private workers: Worker[];
    private taskCounter: number = 0;
    private messageHandlers = new Map<number, WorkerClientMessageHandler>();
    private dispatchMessageResponse: (evt: MessageEvent<WorkerServerMessages>) => void;
    private propertyValues = new Map<string, any>();
    private _ready: Promise<void>;

    /**
     * Creates a new pooled worker method executor.
     * @param scriptPath - the path to the unminified script to use for the worker
     */
    constructor(scriptPath: string);

    /**
     * Creates a new pooled worker method executor.
     * @param scriptPath - the path to the unminified script to use for the worker
     * @param workers - a set of workers that are already running.
     */
    constructor(scriptPath: string, workers: Worker[]);

    /**
     * Creates a new pooled worker method executor.
     * @param scriptPath - the path to the unminified script to use for the worker
     * @param minScriptPath - the path to the minified script to use for the worker
     */
    constructor(scriptPath: string, minScriptPath: string);

    /**
     * Creates a new pooled worker method executor.
     * @param scriptPath - the path to the unminified script to use for the worker
     * @param workerPoolSize - the number of worker threads to create for the pool (defaults to 1)
     */
    constructor(scriptPath: string, workerPoolSize: number);

    /**
     * Creates a new pooled worker method executor.
     * @param scriptPath - the path to the unminified script to use for the worker
     * @param minScriptPath - the path to the minified script to use for the worker (optional)
     * @param workerPoolSize - the number of worker threads to create for the pool (defaults to 1)
     */
    constructor(scriptPath: string, minScriptPath: string, workerPoolSize: number);
    constructor(scriptPath: string, minScriptPathOrWorkers?: number | string | Worker[], workerPoolSize?: number);
    constructor(scriptPath: string, minScriptPathOrWorkers?: number | string | Worker[], workerPoolSize?: number) {
        super();

        if (!WorkerClient.isSupported) {
            console.warn("Workers are not supported on this system.");
        }

        // Normalize constructor parameters.
        if (isNumber(minScriptPathOrWorkers)) {
            workerPoolSize = minScriptPathOrWorkers;
            minScriptPathOrWorkers = undefined;
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
            || !isString(minScriptPathOrWorkers)) {
            this._script = scriptPath;
        }
        else {
            this._script = minScriptPathOrWorkers;
        }

        this.dispatchMessageResponse = (evt: MessageEvent<WorkerServerMessages>) => {
            const data = evt.data;

            // Did this response message match the current invocation?
            if (data.methodName === WorkerServerMessageType.Event) {
                const evt = new TypedEvent(data.type);
                this.dispatchEvent(Object.assign(evt, data.data));
            }
            else if (data.methodName === WorkerServerMessageType.PropertyInit) {
                if (this.propertyValues.has(data.propertyName)) {
                    this.setProperty(
                        data.propertyName,
                        this.propertyValues.get(data.propertyName));
                }
                else {
                    this.propertyValues.set(data.propertyName, data.value);
                }
            }
            else if (data.methodName === WorkerServerMessageType.Property) {
                this.propertyValues.set(data.propertyName, data.value);
            }
            else {
                const messageHandler = this.messageHandlers.get(data.taskID);
                const { onProgress, resolve, reject, methodName } = messageHandler;

                if (data.methodName === WorkerServerMessageType.Progress) {
                    if (isFunction(onProgress)) {
                        onProgress(data.soFar, data.total, data.msg);
                    }
                }
                else {
                    // When the invocation is complete, we want to stop listening to the worker
                    // message channel so we don't eat up processing messages that have no chance
                    // over pertaining to the invocation.
                    this.messageHandlers.delete(data.taskID);

                    if (data.methodName === WorkerServerMessageType.Return) {
                        resolve(data.returnValue);
                    }
                    else if (data.methodName === WorkerServerMessageType.Error) {
                        reject(new Error(`${methodName} failed. Reason: ${data.errorMessage}`));
                    }
                    else {
                        assertNever(data);
                    }
                }
            }
        };

        if (isArray(minScriptPathOrWorkers)) {
            this.workers = minScriptPathOrWorkers;
        }
        else {
            this.workers = new Array(workerPoolSize);
            for (let i = 0; i < workerPoolSize; ++i) {
                this.workers[i] = new Worker(this._script);
            }
        }

        for (const worker of this.workers) {
            worker.addEventListener("message", this.dispatchMessageResponse);
        }

        const firstWorker = this.workers[0];
        this._ready = this.callMethodOnWorker(firstWorker, this.taskCounter++, GET_PROPERTY_VALUES_METHOD);
    }

    get ready() {
        return this._ready;
    }

    get isDedicated() {
        return this.workers.length === 1;
    }

    popWorker() {
        if (this.isDedicated) {
            throw new Error("Can't create a dedicated fetcher from a dedicated fetcher.");
        }

        const worker = this.workers.pop();
        worker.removeEventListener("message", this.dispatchMessageResponse);
        return worker;
    }

    get scriptPath() {
        return this._script;
    }

    /**
     * Set a property value on all of the worker threads.
     * @param propertyName - the name of the property to set.
     * @param value - the value to which to set the property.
     */
    protected setProperty<T>(propertyName: string, value: T): void {
        if (!WorkerClient.isSupported) {
            throw new Error("Workers are not supported on this system.");
        }

        this.propertyValues.set(propertyName, value);

        const message: WorkerClientPropertySetMessage = {
            type: WorkerClientMessageType.PropertySet,
            taskID: this.taskCounter++,
            propertyName,
            value
        };

        for (const worker of this.workers) {
            worker.postMessage(message);
        }
    }

    protected getProperty<T>(propertyName: string): T {
        return this.propertyValues.get(propertyName) as T;
    }

    private callMethodOnWorker<T>(worker: Worker, taskID: number, methodName: string, params?: any[], transferables?: Transferable[], onProgress?: progressCallback): Promise<T> {
        return new Promise((resolve, reject) => {
            this.messageHandlers.set(taskID, {
                onProgress,
                resolve,
                reject,
                methodName
            });

            let message: WorkerClientMethodCallMessage = null;
            if (isDefined(params)) {
                message = {
                    type: WorkerClientMessageType.MethodCall,
                    taskID,
                    methodName,
                    params
                };
            }
            else {
                message = {
                    type: WorkerClientMessageType.MethodCall,
                    taskID,
                    methodName
                };
            }

            if (isDefined(transferables)) {
                worker.postMessage(message, transferables);
            }
            else {
                worker.postMessage(message);
            }
        });
    }

    /**
     * Execute a method on a round-robin selected worker thread.
     * @param methodName - the name of the method to execute.
     * @param onProgress - a callback for receiving progress reports on long-running invocations.
     */
    protected callMethod<T>(methodName: string, onProgress?: progressCallback): Promise<T>;

    /**
     * Execute a method on a round-robin selected worker thread.
     * @param methodName - the name of the method to execute.
     * @param params - the parameters to pass to the method.
     * @param onProgress - a callback for receiving progress reports on long-running invocations.
     */
    protected callMethod<T>(methodName: string, params: any[], onProgress?: progressCallback): Promise<T>;

    /**
     * Execute a method on a round-robin selected worker thread.
     * @param methodName - the name of the method to execute.
     * @param params - the parameters to pass to the method.
     * @param transferables - any values in any of the parameters that should be transfered instead of copied to the worker thread.
     * @param onProgress - a callback for receiving progress reports on long-running invocations.
     */
    protected callMethod<T>(methodName: string, params: any[], transferables: Transferable[], onProgress?: progressCallback): Promise<T>;

    /**
     * Execute a method on a round-robin selected worker thread.
     * @param methodName - the name of the method to execute.
     * @param params - the parameters to pass to the method.
     * @param transferables - any values in any of the parameters that should be transfered instead of copied to the worker thread.
     * @param onProgress - a callback for receiving progress reports on long-running invocations.
     */
    protected callMethod<T>(methodName: string, params?: any[] | progressCallback, transferables?: Transferable[] | progressCallback, onProgress?: progressCallback): Promise<T | undefined> {
        if (!WorkerClient.isSupported) {
            return Promise.reject(new Error("Workers are not supported on this system."));
        }

        // Normalize method parameters.
        let parameters: any[] = null;
        let tfers: Transferable[] = null;

        if (isFunction(params)) {
            onProgress = params;
            params = null;
            transferables = null;
        }

        if (isFunction(transferables)
            && !onProgress) {
            onProgress = transferables;
            transferables = null;
        }

        if (isArray(params)) {
            parameters = params;
        }

        if (isArray(transferables)) {
            tfers = transferables;
        }

        // taskIDs help us keep track of return values.
        const taskID = this.taskCounter++;

        // Workers are pooled, so the modulus selects them in a round-robin fashion.
        const workerID = taskID % this.workers.length;

        const worker = this.workers[workerID];

        return this.callMethodOnWorker<T>(
            worker,
            taskID,
            methodName,
            parameters,
            tfers,
            onProgress);
    }

    /**
     * Execute a method on all of the worker threads.
     * @param methodName - the name of the method to execute.
     * @param onProgress - a callback for receiving progress reports on long-running invocations.
     */
    protected callMethodOnAll<T>(methodName: string, onProgress?: progressCallback): Promise<T[]>;

    /**
     * Execute a method on all of the worker threads.
     * @param methodName - the name of the method to execute.
     * @param params - the parameters to pass to the method.
     * @param onProgress - a callback for receiving progress reports on long-running invocations.
     */
    protected callMethodOnAll<T>(methodName: string, params: any[], onProgress?: progressCallback): Promise<T[]>;

    /**
     * Execute a method on all of the worker threads.
     * @param methodName - the name of the method to execute.
     * @param params - the parameters to pass to the method.
     * @param onProgress - a callback for receiving progress reports on long-running invocations.
     */
    protected async callMethodOnAll<T>(methodName: string, params?: any[] | progressCallback, onProgress?: progressCallback): Promise<T[]> {
        if (!WorkerClient.isSupported) {
            return Promise.reject(new Error("Workers are not supported on this system."));
        }

        if (isFunction(params)) {
            onProgress = params;
            params = null;
        }

        let parameters: any[] = null;
        if (isArray(params)) {
            parameters = params;
        }

        const rootTaskID = this.taskCounter;
        this.taskCounter += this.workers.length;

        return await arrayProgress(
            onProgress,
            this.workers,
            (worker, subProgress, i) =>
                this.callMethodOnWorker<T>(
                    worker,
                    rootTaskID + i,
                    methodName,
                    parameters,
                    null,
                    subProgress));
    }
}