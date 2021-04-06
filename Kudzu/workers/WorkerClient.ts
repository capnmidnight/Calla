import { TypedEvent, TypedEventBase } from "../events/EventBase";
import { arrayProgress } from "../tasks/arrayProgress";
import type { progressCallback } from "../tasks/progressCallback";
import { assertNever, isArray, isDefined, isFunction, isNullOrUndefined, isNumber, isString } from "../typeChecks";
import type {
    WorkerClientMessages,
    WorkerClientMethodCallMessage,
    WorkerClientPropertySetMessage,
    WorkerServerErrorMessage,
    WorkerServerEventMessage,
    WorkerServerMessages,
    WorkerServerProgressMessage,
    WorkerServerPropertyChangedMessage,
    WorkerServerPropertyInitializedMessage,
    WorkerServerReturnMessage
} from "./WorkerMessages";
import {
    GET_PROPERTY_VALUES_METHOD,
    WorkerClientMessageType,
    WorkerServerMessageType
} from "./WorkerMessages";

interface WorkerInvocation {
    onProgress: progressCallback;
    resolve: (value: any) => void;
    reject: (reason?: any) => void;
    methodName: string;
}

export class WorkerClient<EventsT> extends TypedEventBase<EventsT> {
    static isSupported = "Worker" in globalThis;

    private _script: string;
    private taskCounter: number;
    private workers: Worker[];
    private invocations = new Map<number, WorkerInvocation>();
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
     * @param startTaskCounter - the next task ID that the worker should use.
     */
    constructor(scriptPath: string, workers: Worker[], startTaskCounter: number);

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
    constructor(scriptPath: string, minScriptPathOrWorkers?: number | string | Worker[], workerPoolSizeOrCurTaskCounter?: number) {
        super();

        if (!WorkerClient.isSupported) {
            console.warn("Workers are not supported on this system.");
        }

        // Normalize constructor parameters.
        if (isNumber(minScriptPathOrWorkers)) {
            workerPoolSizeOrCurTaskCounter = minScriptPathOrWorkers;
            minScriptPathOrWorkers = undefined;
        }

        if (isNullOrUndefined(workerPoolSizeOrCurTaskCounter)) {
            workerPoolSizeOrCurTaskCounter = 1;
        }

        // Validate parameters
        if (workerPoolSizeOrCurTaskCounter < 1) {
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
            switch (data.type) {
                case WorkerServerMessageType.Event:
                    this.propogateEvent(data);
                    break;
                case WorkerServerMessageType.PropertyInit:
                    this.propertyInit(data);
                    break;
                case WorkerServerMessageType.Property:
                    this.propertyChanged(data);
                    break;
                case WorkerServerMessageType.Progress:
                    this.progressReport(data);
                    break;
                case WorkerServerMessageType.Return:
                    this.methodReturned(data);
                    break;
                case WorkerServerMessageType.Error:
                    this.invocationError(data);
                    break;
                default:
                    assertNever(data);
            }
        };

        if (isArray(minScriptPathOrWorkers)) {
            this.taskCounter = workerPoolSizeOrCurTaskCounter;
            this.workers = minScriptPathOrWorkers;
        }
        else {
            this.taskCounter = 0;
            this.workers = new Array(workerPoolSizeOrCurTaskCounter);
            for (let i = 0; i < workerPoolSizeOrCurTaskCounter; ++i) {
                this.workers[i] = new Worker(this._script);
            }
        }

        for (const worker of this.workers) {
            worker.addEventListener("message", this.dispatchMessageResponse);
        }

        this._ready = (async () => {
            await this.callMethodOnAll(GET_PROPERTY_VALUES_METHOD);
        })();
    }

    private propogateEvent(data: WorkerServerEventMessage) {
        const evt = new TypedEvent(data.eventName);
        this.dispatchEvent(Object.assign(evt, data.data));
    }

    private propertyInit(data: WorkerServerPropertyInitializedMessage) {
        if (this.propertyValues.has(data.propertyName)) {
            this.setProperty(
                data.propertyName,
                this.propertyValues.get(data.propertyName));
        }
        else {
            this.propertyValues.set(data.propertyName, data.value);
        }
    }

    private propertyChanged(data: WorkerServerPropertyChangedMessage) {
        this.propertyValues.set(data.propertyName, data.value);
    }

    private progressReport(data: WorkerServerProgressMessage) {
        const invocation = this.invocations.get(data.taskID);
        const { onProgress } = invocation;
        if (isFunction(onProgress)) {
            onProgress(data.soFar, data.total, data.msg);
        }
    }

    private methodReturned(data: WorkerServerReturnMessage) {
        const messageHandler = this.removeInvocation(data.taskID);
        const { resolve } = messageHandler;
        resolve(data.returnValue);
    }

    private invocationError(data: WorkerServerErrorMessage) {
        const messageHandler = this.removeInvocation(data.taskID);
        const { reject, methodName } = messageHandler;
        reject(new Error(`${methodName} failed. Reason: ${data.errorMessage}`));
    }

    /**
     * When the invocation has errored, we want to stop listening to the worker
     * message channel so we don't eat up processing messages that have no chance
     * ever pertaining to the invocation.
     **/
    private removeInvocation(taskID: number) {
        const invocation = this.invocations.get(taskID);
        this.invocations.delete(taskID);
        return invocation;
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
            this.postMessage(worker, message);
        }
    }

    protected getProperty<T>(propertyName: string): T {
        return this.propertyValues.get(propertyName) as T;
    }

    private callMethodOnWorker<T>(worker: Worker, taskID: number, methodName: string, params?: any[], transferables?: Transferable[], onProgress?: progressCallback): Promise<T> {
        return new Promise((resolve, reject) => {
            const invocation: WorkerInvocation = {
                onProgress,
                resolve,
                reject,
                methodName
            };

            this.invocations.set(taskID, invocation);

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

            this.postMessage(worker, message, transferables);
        });
    }

    private postMessage(worker: Worker, message: WorkerClientMessages, transferables?: Transferable[]) {
        if (isDefined(transferables)) {
            worker.postMessage(message, transferables);
        }
        else {
            worker.postMessage(message);
        }
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

    getDedicatedClient() {
        const Class = Object.getPrototypeOf(this).constructor;
        return new Class(this.scriptPath, [this.popWorker()], this.taskCounter + 1);
    }
}