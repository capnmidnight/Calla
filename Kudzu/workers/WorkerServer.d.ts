import { EventBase } from "../events/EventBase";
declare type createTransferableCallback<T> = (returnValue: T) => Transferable[];
export declare class WorkerServer {
    private self;
    private methods;
    private properties;
    /**
     * Creates a new worker thread method call listener.
     * @param self - the worker scope in which to listen.
     */
    constructor(self: DedicatedWorkerGlobalScope);
    private setProperty;
    private callMethod;
    private postMessage;
    /**
     * Report an error back to the calling thread.
     * @param taskID - the invocation ID of the method that errored.
     * @param errorMessage - what happened?
     */
    private onError;
    /**
     * Report progress through long-running invocations. If your invocable
     * functions don't report progress, this can be safely ignored.
     * @param taskID - the invocation ID of the method that is updating.
     * @param soFar - how much of the process we've gone through.
     * @param total - the total amount we need to go through.
     * @param msg - an optional message to include as part of the progress update.
     */
    private onProgress;
    /**
     * Return back to the client.
     * @param taskID - the invocation ID of the method that is returning.
     * @param returnValue - the (optional) value to return.
     * @param transferReturnValue - a mapping function to extract any Transferable objects from the return value.
     */
    private onReturn;
    private onEvent;
    private onPropertyInitialized;
    private onPropertyChanged;
    addProperty(obj: any, name: string): void;
    /**
     * Registers a function call for cross-thread invocation.
     * @param methodName - the name of the method to use during invocations.
     * @param obj - the object on which to find the method.
     * @param transferReturnValue - an (optional) function that reports on which values in the `returnValue` should be transfered instead of copied.
     */
    addMethod<T>(methodName: string, obj: any, transferReturnValue?: createTransferableCallback<T>): void;
    /**
     * Registers a function call for cross-thread invocation.
     * @param methodName - the name of the method to use during invocations.
     * @param asyncFuncOrObject - the function to execute when the method is invoked.
     * @param transferReturnValue - an (optional) function that reports on which values in the `returnValue` should be transfered instead of copied.
     */
    addMethod<T>(methodName: string, asyncFunc: (...args: any[]) => Promise<T>, transferReturnValue?: createTransferableCallback<T>): void;
    private addMethodInternal;
    addEvent<U extends EventBase, T>(object: U, type: string, makePayload?: (evt: Event) => T, transferReturnValue?: createTransferableCallback<T>): void;
}
export {};
