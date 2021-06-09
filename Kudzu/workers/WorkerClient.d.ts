import { TypedEventBase } from "../events/EventBase";
import type { progressCallback } from "../tasks/progressCallback";
export declare class WorkerClient<EventsT> extends TypedEventBase<EventsT> {
    static isSupported: boolean;
    private scriptPath;
    private taskCounter;
    private workers;
    private invocations;
    private dispatchMessageResponse;
    private propertyValues;
    readonly ready: Promise<unknown>;
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
    private propogateEvent;
    private propertyInit;
    private propertyChanged;
    private progressReport;
    private methodReturned;
    private invocationError;
    /**
     * When the invocation has errored, we want to stop listening to the worker
     * message channel so we don't eat up processing messages that have no chance
     * ever pertaining to the invocation.
     **/
    private removeInvocation;
    /**
     * Invokes the given method on one particular worker thread.
     * @param worker
     * @param taskID
     * @param methodName
     * @param params
     * @param transferables
     * @param onProgress
     */
    private callMethodOnWorker;
    private postMessage;
    /**
     * Set a property value on all of the worker threads.
     * @param propertyName - the name of the property to set.
     * @param value - the value to which to set the property.
     */
    protected setProperty<T>(propertyName: string, value: T): void;
    /**
     * Retrieve the most recently cached value for a given property.
     * @param propertyName - the name of the property to get.
     */
    protected getProperty<T>(propertyName: string): T;
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
    /**
     * Remove one of the workers from the worker pool and create a new instance
     * of the workerized object for just that worker. This is useful for creating
     * workers that cache network requests in memory.
     **/
    getDedicatedClient(): any;
}
