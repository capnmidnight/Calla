import type { progressCallback } from "../tasks/progressCallback";
export declare type workerClientCallback<T> = (...params: any[]) => Promise<T>;
export declare class WorkerClient {
    static isSupported: boolean;
    private taskCounter;
    private workers;
    private script;
    private methodExists;
    enabled: boolean;
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
     * Creates a function that can optionally choose to invoke either the provided
     * worker method, or a UI-thread fallback, if this worker dispatcher is not enabled.
     * @param workerCall
     * @param localCall
     */
    createExecutor<T>(methodName: string, workerCall: workerClientCallback<T>, localCall: workerClientCallback<T>): workerClientCallback<T>;
}
