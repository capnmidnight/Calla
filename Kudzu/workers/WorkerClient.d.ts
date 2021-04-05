import { TypedEventBase } from "../events/EventBase";
import type { progressCallback } from "../tasks/progressCallback";
export declare class WorkerClient<EventsT> extends TypedEventBase<EventsT> {
    static isSupported: boolean;
    private _script;
    private workers;
    private taskCounter;
    private messageHandlers;
    private dispatchMessageResponse;
    private propertyValues;
    private _ready;
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
    private propogateEvent;
    private propertyInit;
    private propertyChanged;
    private progressReport;
    private methodReturned;
    private invocationError;
    get ready(): Promise<void>;
    get isDedicated(): boolean;
    popWorker(): Worker;
    get scriptPath(): string;
    /**
     * Set a property value on all of the worker threads.
     * @param propertyName - the name of the property to set.
     * @param value - the value to which to set the property.
     */
    protected setProperty<T>(propertyName: string, value: T): void;
    protected getProperty<T>(propertyName: string): T;
    private callMethodOnWorker;
    private postMessage;
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
}
