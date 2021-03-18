export declare type workerServerMethod = (taskID: number, ...params: any[]) => Promise<void>;
export declare type workerServerCreateTransferableCallback<T> = (returnValue: T) => Transferable[];
export declare enum WorkerMethodMessageType {
    Error = "error",
    Progress = "progress",
    Return = "return",
    ReturnValue = "returnValue"
}
interface WorkerMethodMessage<T extends WorkerMethodMessageType> {
    taskID: number;
    methodName: T;
}
export interface WorkerMethodErrorMessage extends WorkerMethodMessage<WorkerMethodMessageType.Error> {
    errorMessage: string;
}
export interface WorkerMethodProgressMessage extends WorkerMethodMessage<WorkerMethodMessageType.Progress> {
    soFar: number;
    total: number;
    msg: string;
}
export interface WorkerMethodReturnMessage extends WorkerMethodMessage<WorkerMethodMessageType.Return> {
}
export interface WorkerMethodReturnValueMessage extends WorkerMethodMessage<WorkerMethodMessageType.ReturnValue> {
    returnValue: any;
}
export declare type WorkerMethodMessages = WorkerMethodErrorMessage | WorkerMethodProgressMessage | WorkerMethodReturnMessage | WorkerMethodReturnValueMessage;
export interface WorkerMethodCallMessage {
    taskID: number;
    methodName: string;
    params: any[];
}
export declare class WorkerServer {
    private self;
    private methods;
    /**
     * Creates a new worker thread method call listener.
     * @param self - the worker scope in which to listen.
     */
    constructor(self: DedicatedWorkerGlobalScope);
    /**
     * Report an error back to the calling thread.
     * @param taskID - the invocation ID of the method that errored.
     * @param errorMessage - what happened?
     */
    private onError;
    /**
     * Report progress through long-running invocations.
     * @param taskID - the invocation ID of the method that is updating.
     * @param soFar - how much of the process we've gone through.
     * @param total - the total amount we need to go through.
     * @param msg - an optional message to include as part of the progress update.
     */
    private onProgress;
    /**
     * Return the results back to the invoker.
     * @param taskID - the invocation ID of the method that has completed.
     * @param returnValue - the (optional) value that is being returned.
     * @param transferables - an (optional) array of values that appear in the return value that should be transfered back to the calling thread, rather than copied.
     */
    private onReturn;
    /**
     * Registers a function call for cross-thread invocation.
     * @param methodName - the name of the method to use during invocations.
     * @param asyncFunc - the function to execute when the method is invoked.
     * @param transferReturnValue - an (optional) function that reports on which values in the `returnValue` should be transfered instead of copied.
     */
    add<T>(methodName: string, asyncFunc: (...args: any[]) => any, transferReturnValue?: workerServerCreateTransferableCallback<T>): void;
}
export {};
