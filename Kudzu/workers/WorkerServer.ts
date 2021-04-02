import { EventBase } from "../events/EventBase";

export type workerServerMethod = (taskID: number, ...params: any[]) => Promise<void>;

export type createTransferableCallback<T> = (returnValue: T) => Transferable[];

export enum WorkerServerMessageType {
    Error = "error",
    Progress = "progress",
    Return = "return",
    ReturnValue = "returnValue",
    Event = "event"
}

interface WorkerServerMessage<T extends WorkerServerMessageType> {
    methodName: T;
}

export interface WorkerServerErrorMessage
    extends WorkerServerMessage<WorkerServerMessageType.Error> {
    taskID: number;
    errorMessage: string;
}

export interface WorkerServerProgressMessage
    extends WorkerServerMessage<WorkerServerMessageType.Progress> {
    taskID: number;
    soFar: number;
    total: number;
    msg: string;
}

export interface WorkerServerReturnMessage
    extends WorkerServerMessage<WorkerServerMessageType.Return> {
    taskID: number;
}

export interface WorkerServerReturnValueMessage
    extends WorkerServerMessage<WorkerServerMessageType.ReturnValue> {
    taskID: number;
    returnValue: any;
}

export interface WorkerServerEventMessage
    extends WorkerServerMessage<WorkerServerMessageType.Event> {
    type: string;
    data: any;
}

export type WorkerServerMessages = WorkerServerErrorMessage
    | WorkerServerProgressMessage
    | WorkerServerReturnMessage
    | WorkerServerReturnValueMessage
    | WorkerServerEventMessage;

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
                try {
                    if (data.params) {
                        method(data.taskID, ...data.params);
                    }
                    else {
                        method(data.taskID);
                    }
                }
                catch (exp) {
                    this.onError(data.taskID, `method invocation error: ${data.methodName}(${exp.message})`);
                }
            }
            else {
                this.onError(data.taskID, "method not found: " + data.methodName);
            }
        };
    }

    handle<U extends EventBase, T>(object: U, type: string, makePayload?: (evt: Event) => T, transferReturnValue?: createTransferableCallback<T>) {
        object.addEventListener(type, (evt: Event) => {
            if (!makePayload) {
                this.self.postMessage({
                    type,
                    methodName: WorkerServerMessageType.Event
                });
            }
            else {
                const data = makePayload(evt);
                if (transferReturnValue) {
                    const transferables = transferReturnValue(data);
                    this.self.postMessage({
                        type,
                        methodName: WorkerServerMessageType.Event,
                        data
                    }, transferables);
                }
                else {
                    this.self.postMessage({
                        type,
                        methodName: WorkerServerMessageType.Event,
                        data
                    });
                }
            }
        });
    }

    /**
     * Report an error back to the calling thread.
     * @param taskID - the invocation ID of the method that errored.
     * @param errorMessage - what happened?
     */
    private onError(taskID: number, errorMessage: string): void {
        this.self.postMessage({
            taskID,
            methodName: WorkerServerMessageType.Error,
            errorMessage
        });
    }

    /**
     * Report progress through long-running invocations. If your invocable
     * functions don't report progress, this can be safely ignored.
     * @param taskID - the invocation ID of the method that is updating.
     * @param soFar - how much of the process we've gone through.
     * @param total - the total amount we need to go through.
     * @param msg - an optional message to include as part of the progress update.
     */
    private onProgress(taskID: number, soFar: number, total: number, msg?: string): void {
        this.self.postMessage({
            taskID,
            methodName: WorkerServerMessageType.Progress,
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
                methodName: WorkerServerMessageType.Return
            });
        }
        else if (transferables === undefined) {
            this.self.postMessage({
                taskID,
                methodName: WorkerServerMessageType.ReturnValue,
                returnValue
            });
        }
        else {
            this.self.postMessage({
                taskID,
                methodName: WorkerServerMessageType.ReturnValue,
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
    add<T>(methodName: string, asyncFunc: (...args: any[]) => Promise<T>, transferReturnValue?: createTransferableCallback<T>) {
        this.methods.set(methodName, async (taskID: number, ...params: any[]) => {
            const onProgress = this.onProgress.bind(this, taskID);

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
                console.error(exp);
                this.onError(taskID, exp.message);
            }
        });
    }
}