import { EventBase } from "../events/EventBase";
import { isArray, isDefined } from "../typeChecks";

export type workerServerMethod = (taskID: number, ...params: any[]) => Promise<void>;

export type createTransferableCallback<T> = (returnValue: T) => Transferable[];

export enum WorkerServerMessageType {
    Error = "error",
    Progress = "progress",
    Return = "return",
    Event = "event"
}

interface WorkerServerMessage<T extends WorkerServerMessageType> {
    methodName: T;
}

export interface WorkerServerEventMessage
    extends WorkerServerMessage<WorkerServerMessageType.Event> {
    type: string;
    data?: any;
}

export interface WorkerServerTaskMessage<T extends WorkerServerMessageType>
    extends WorkerServerMessage<T> {
    taskID: number;
}

export interface WorkerServerErrorMessage
    extends WorkerServerTaskMessage<WorkerServerMessageType.Error> {
    errorMessage: string;
}

export interface WorkerServerProgressMessage
    extends WorkerServerTaskMessage<WorkerServerMessageType.Progress> {
    soFar: number;
    total: number;
    msg: string;
}

export interface WorkerServerReturnMessage
    extends WorkerServerTaskMessage<WorkerServerMessageType.Return> {
    returnValue?: any;
}

export type WorkerServerMessages = WorkerServerErrorMessage
    | WorkerServerProgressMessage
    | WorkerServerReturnMessage
    | WorkerServerEventMessage;

export interface WorkerMethodCallMessage {
    taskID: number;
    methodName: string;
    params?: any[];
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
                    if (isArray(data.params)) {
                        method(data.taskID, ...data.params);
                    }
                    else if (isDefined(data.params)) {
                        method(data.taskID, data.params);
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

    private postMessage<T extends WorkerServerMessageType>(message: WorkerServerMessage<T>, transferables?: Transferable[]) {
        if (isDefined(transferables)) {
            this.self.postMessage(message, transferables);
        }
        else {
            this.self.postMessage(message);
        }
    }

    /**
     * Report an error back to the calling thread.
     * @param taskID - the invocation ID of the method that errored.
     * @param errorMessage - what happened?
     */
    private onError(taskID: number, errorMessage: string): void {
        const message: WorkerServerErrorMessage = {
            taskID,
            methodName: WorkerServerMessageType.Error,
            errorMessage
        };
        this.postMessage(message);
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
        const message: WorkerServerProgressMessage = {
            taskID,
            methodName: WorkerServerMessageType.Progress,
            soFar,
            total,
            msg
        };
        this.postMessage(message);
    }

    private onReturn<T>(taskID: number, returnValue: T, transferReturnValue: createTransferableCallback<T>) {
        let message: WorkerServerReturnMessage = null;
        if (returnValue === undefined) {
            message = {
                taskID,
                methodName: WorkerServerMessageType.Return
            };
        }
        else {
            message = {
                taskID,
                methodName: WorkerServerMessageType.Return,
                returnValue
            };
        }

        if (isDefined(transferReturnValue)) {
            const transferables = transferReturnValue(returnValue);
            this.postMessage(message, transferables);
        }
        else {
            this.postMessage(message);
        }
    }

    private onEvent<T>(type: string, evt: Event, makePayload: (evt: Event) => T, transferReturnValue: createTransferableCallback<T>) {
        let message: WorkerServerEventMessage = null;
        if (isDefined(makePayload)) {
            message = {
                methodName: WorkerServerMessageType.Event,
                type,
                data: makePayload(evt)
            };
        }
        else {
            message = {
                methodName: WorkerServerMessageType.Event,
                type
            };
        }

        if (message.data !== undefined
            && isDefined(transferReturnValue)) {
            const transferables = transferReturnValue(message.data);
            this.postMessage(message, transferables);
        }
        else {
            this.postMessage(message);
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
                this.onReturn(taskID, returnValue, transferReturnValue);
            }
            catch (exp) {
                console.error(exp);
                this.onError(taskID, exp.message);
            }
        });
    }

    handle<U extends EventBase, T>(object: U, type: string, makePayload?: (evt: Event) => T, transferReturnValue?: createTransferableCallback<T>) {
        object.addEventListener(type, (evt: Event) =>
            this.onEvent(type, evt, makePayload, transferReturnValue));
    }
}