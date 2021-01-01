import type { progressCallback } from "../io/progressCallback";

export type workerServerMethod = (taskID: number, ...params: any[]) => Promise<void>;

export type workerServerCreateTransferableCallback<T> = (returnValue: T) => Transferable[];

export enum WorkerMethodMessageType {
    Error = "error",
    Progress = "progress",
    Return = "return",
    ReturnValue = "returnValue"
}

interface WorkerMethodMessage<T extends WorkerMethodMessageType> {
    taskID: number;
    methodName: T;
}

export interface WorkerMethodErrorMessage
    extends WorkerMethodMessage<WorkerMethodMessageType.Error> {
    errorMessage: string;
}

export interface WorkerMethodProgressMessage
    extends WorkerMethodMessage<WorkerMethodMessageType.Progress> {
    soFar: number;
    total: number;
    msg: number;
}

export interface WorkerMethodReturnMessage
    extends WorkerMethodMessage<WorkerMethodMessageType.Return> {
}

export interface WorkerMethodReturnValueMessage
    extends WorkerMethodMessage<WorkerMethodMessageType.ReturnValue> {
    returnValue: any
}

export type WorkerMethodMessages = WorkerMethodErrorMessage
    | WorkerMethodProgressMessage
    | WorkerMethodReturnMessage
    | WorkerMethodReturnValueMessage;

export interface WorkerMethodCallMessage {
    taskID: number;
    methodName: string;
    params: any[];
}

export class WorkerServer {
    private methods = new Map<string, workerServerMethod>();

    /**
     * Creates a new worker thread method call listener.
     * @param self - the worker scope in which to listen.
     */
    constructor(private self: DedicatedWorkerGlobalScope) {
        this.self.onmessage = (evt: MessageEvent<WorkerMethodCallMessage>): void => {
            const data = evt.data;
            const method = this.methods.get(data.methodName);
            if (method) {
                method(data.taskID, ...data.params);
            }
            else {
                this.onError(data.taskID, "method not found: " + data.methodName);
            }
        };

        this.add("methodExists", async (methodName: string) => this.methods.has(methodName));
    }

    /**
     * Report an error back to the calling thread.
     * @param taskID - the invocation ID of the method that errored.
     * @param errorMessage - what happened?
     */
    private onError(taskID: number, errorMessage: string): void {
        this.self.postMessage({
            taskID,
            methodName: WorkerMethodMessageType.Error,
            errorMessage
        });
    }

    /**
     * Report progress through long-running invocations.
     * @param taskID - the invocation ID of the method that is updating.
     * @param soFar - how much of the process we've gone through.
     * @param total - the total amount we need to go through.
     * @param msg - an optional message to include as part of the progress update.
     */
    private onProgress(taskID: number, soFar: number, total: number, msg?: string): void {
        this.self.postMessage({
            taskID,
            methodName: WorkerMethodMessageType.Progress,
            soFar,
            total,
            msg
        });
    }

    /**
     * Return the results back to the invoker.
     * @param taskID - the invocation ID of the method that has completed.
     * @param returnValue - the (optional) value that is being returned.
     * @param transferables - an (optional) array of values that appear in the return value that should be transfered back to the calling thread, rather than copied.
     */
    private onReturn(taskID: number, returnValue?: any, transferables?: Transferable[]): void {
        if (returnValue === undefined) {
            this.self.postMessage({
                taskID,
                methodName: WorkerMethodMessageType.Return
            });
        }
        else if (transferables === undefined) {
            this.self.postMessage({
                taskID,
                methodName: WorkerMethodMessageType.ReturnValue,
                returnValue
            });
        }
        else {
            this.self.postMessage({
                taskID,
                methodName: WorkerMethodMessageType.ReturnValue,
                returnValue
            }, transferables);
        }
    }

    /**
     * Registers a function call for cross-thread invocation.
     * @param methodName - the name of the method to use during invocations.
     * @param asyncFunc - the function to execute when the method is invoked.
     * @param transferReturnValue - an (optional) function that reports on which values in the `returnValue` should be transfered instead of copied.
     */
    add<T>(methodName: string, asyncFunc: (...args: any[]) => Promise<T>, transferReturnValue?: workerServerCreateTransferableCallback<T>) {
        this.methods.set(methodName, async (taskID: number, ...params: any[]) => {

            // If your invocable functions don't report progress, this can be safely ignored.
            const onProgress: progressCallback = (soFar: number, total: number, msg?: string) => {
                this.onProgress(
                    taskID,
                    soFar,
                    total,
                    msg
                );
            };

            try {
                // Even functions returning void and functions returning bare, unPromised values, can be awaited.
                // This creates a convenient fallback where we don't have to consider the exact return type of the function.
                const returnValue = await asyncFunc(...params, onProgress);
                if (returnValue === undefined) {
                    this.onReturn(taskID);
                }
                else {
                    if (transferReturnValue) {
                        const transferables = transferReturnValue(returnValue);
                        this.onReturn(taskID, returnValue, transferables);
                    }
                    else {
                        this.onReturn(taskID, returnValue);
                    }
                }
            }
            catch (exp) {
                this.onError(taskID, exp.message);
            }
        });
    }
}