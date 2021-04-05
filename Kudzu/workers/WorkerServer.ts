import { EventBase, TypedEvent } from "../events/EventBase";
import { isArray, isDefined } from "../typeChecks";
import {
    GET_PROPERTY_VALUES_METHOD,
    WorkerClientMessages,
    WorkerServerErrorMessage,
    WorkerServerEventMessage,
    WorkerServerMessages,
    WorkerServerProgressMessage,
    WorkerServerPropertyChangedMessage,
    WorkerServerPropertyInitializedMessage,
    WorkerServerReturnMessage
} from "./WorkerMessages";
import {
    WorkerClientMessageType,
    WorkerServerMessageType
} from "./WorkerMessages";

export type workerServerMethod = (taskID: number, ...params: any[]) => Promise<void>;

export type createTransferableCallback<T> = (returnValue: T) => Transferable[];

export class WorkerServer {
    private methods = new Map<string, workerServerMethod>();
    private properties = new Map<string, PropertyDescriptor>();

    /**
     * Creates a new worker thread method call listener.
     * @param self - the worker scope in which to listen.
     */
    constructor(private self: DedicatedWorkerGlobalScope) {
        this.addMethodInternal(GET_PROPERTY_VALUES_METHOD, () => {
            for (const [name, prop] of this.properties) {
                this.onPropertyInitialized(name, prop.get());
            }
            return Promise.resolve();
        });

        this.self.onmessage = (evt: MessageEvent<WorkerClientMessages>): void => {
            const data = evt.data;

            if (data.type === WorkerClientMessageType.PropertySet) {
                const prop = this.properties.get(data.propertyName);
                prop.set(data.value);
            }
            else {
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
            }
        };
    }

    private postMessage(message: WorkerServerMessages, transferables?: Transferable[]): void {
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
            methodName: WorkerServerMessageType.Error,
            taskID,
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
            methodName: WorkerServerMessageType.Progress,
            taskID,
            soFar,
            total,
            msg
        };
        this.postMessage(message);
    }

    private onReturn<T>(taskID: number, returnValue: T, transferReturnValue: createTransferableCallback<T>): void {
        let message: WorkerServerReturnMessage = null;
        if (returnValue === undefined) {
            message = {
                methodName: WorkerServerMessageType.Return,
                taskID
            };
        }
        else {
            message = {
                methodName: WorkerServerMessageType.Return,
                taskID,
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

    private onEvent<T>(type: string, evt: Event, makePayload?: (evt: Event) => T, transferReturnValue?: createTransferableCallback<T>): void {
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

    private onPropertyInitialized(propertyName: string, value: any): void {
        const message: WorkerServerPropertyInitializedMessage = {
            methodName: WorkerServerMessageType.PropertyInit,
            propertyName,
            value
        };
        this.postMessage(message);
    }

    private onPropertyChanged(propertyName: string, value: any): void {
        const message: WorkerServerPropertyChangedMessage = {
            methodName: WorkerServerMessageType.Property,
            propertyName,
            value
        };
        this.postMessage(message);
    }

    protected onReady(): void {
        this.onEvent("workerserverready", new TypedEvent("workerserverready"));
    }

    addProperty(obj: any, name: string): void {
        const proto = Object.getPrototypeOf(obj);
        const protoProp = Object.getOwnPropertyDescriptor(proto, name);
        const prop = {
            get: protoProp.get.bind(obj),
            set: protoProp.set.bind(obj)
        };
        this.properties.set(name, prop);

        Object.defineProperty(obj, name, {
            get: () => prop.get(),
            set: (v: string) => {
                prop.set(v);
                this.onPropertyChanged(name, v);
            }
        });
    }

    /**
     * Registers a function call for cross-thread invocation.
     * @param methodName - the name of the method to use during invocations.
     * @param asyncFunc - the function to execute when the method is invoked.
     * @param transferReturnValue - an (optional) function that reports on which values in the `returnValue` should be transfered instead of copied.
     */
    addMethod<T>(methodName: string, asyncFunc: (...args: any[]) => Promise<T>, transferReturnValue?: createTransferableCallback<T>): void {
        if (methodName === GET_PROPERTY_VALUES_METHOD) {
            console.warn(`"${GET_PROPERTY_VALUES_METHOD}" is the name of an internal method for WorkerServers and cannot be overridden.`);
        }
        else {
            this.addMethodInternal<T>(methodName, asyncFunc, transferReturnValue);
        }
    }

    private addMethodInternal<T>(methodName: string, asyncFunc: (...args: any[]) => Promise<T>, transferReturnValue?: createTransferableCallback<T>) {
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

    addEvent<U extends EventBase, T>(object: U, type: string, makePayload?: (evt: Event) => T, transferReturnValue?: createTransferableCallback<T>): void {
        object.addEventListener(type, (evt: Event) =>
            this.onEvent(type, evt, makePayload, transferReturnValue));
    }
}