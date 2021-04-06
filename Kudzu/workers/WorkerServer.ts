import { EventBase } from "../events/EventBase";
import { assertNever, isArray, isDefined, isFunction, isNullOrUndefined } from "../typeChecks";
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

type workerServerMethod = (taskID: number, ...params: any[]) => Promise<void>;

type createTransferableCallback<T> = (returnValue: T) => Transferable[];

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
            switch (data.type) {
                case WorkerClientMessageType.PropertySet:
                    this.setProperty(data);
                    break;
                case WorkerClientMessageType.MethodCall:
                    this.callMethod(data);
                    break;
                default:
                    assertNever(data);
            }
        };
    }

    private setProperty(data: WorkerClientPropertySetMessage) {
        const prop = this.properties.get(data.propertyName);
        if (prop) {
            try {
                prop.set(data.value);
            }
            catch (exp) {
                this.onError(data.taskID, `property invocation error: ${data.propertyName}(${exp.message})`);
            }
        }
        else {
            this.onError(data.taskID, "property not found: " + data.propertyName);
        }
    }

    private callMethod(data: WorkerClientMethodCallMessage) {
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
            type: WorkerServerMessageType.Error,
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
            type: WorkerServerMessageType.Progress,
            taskID,
            soFar,
            total,
            msg
        };
        this.postMessage(message);
    }

    /**
     * Return back to the client.
     * @param taskID - the invocation ID of the method that is returning.
     * @param returnValue - the (optional) value to return.
     * @param transferReturnValue - a mapping function to extract any Transferable objects from the return value.
     */
    private onReturn<T>(taskID: number, returnValue: T, transferReturnValue: createTransferableCallback<T>): void {
        let message: WorkerServerReturnMessage = null;
        if (returnValue === undefined) {
            message = {
                type: WorkerServerMessageType.Return,
                taskID
            };
        }
        else {
            message = {
                type: WorkerServerMessageType.Return,
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

    private onEvent<T>(eventName: string, evt: Event, makePayload?: (evt: Event) => T, transferReturnValue?: createTransferableCallback<T>): void {
        let message: WorkerServerEventMessage = null;
        if (isDefined(makePayload)) {
            message = {
                type: WorkerServerMessageType.Event,
                eventName,
                data: makePayload(evt)
            };
        }
        else {
            message = {
                type: WorkerServerMessageType.Event,
                eventName
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
            type: WorkerServerMessageType.PropertyInit,
            propertyName,
            value
        };
        this.postMessage(message);
    }

    private onPropertyChanged(propertyName: string, value: any): void {
        const message: WorkerServerPropertyChangedMessage = {
            type: WorkerServerMessageType.Property,
            propertyName,
            value
        };
        this.postMessage(message);
    }

    private addMethodInternal<T>(methodName: string, asyncFunc: Function, transferReturnValue?: createTransferableCallback<T>) {
        if (this.methods.has(methodName)) {
            throw new Error(`${methodName} method has already been mapped.`);
        }

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

    addProperty(obj: any, name: string): void {
        if (this.properties.has(name)) {
            throw new Error(`${name} property has already been mapped.`);
        }

        let prop = Object.getOwnPropertyDescriptor(obj, name);
        if (isNullOrUndefined(prop)) {
            const proto = Object.getPrototypeOf(obj);
            const protoProp = Object.getOwnPropertyDescriptor(proto, name);
            prop = {
                get: protoProp.get.bind(obj),
                set: protoProp.set.bind(obj)
            };
        }

        this.properties.set(name, prop);

        Object.defineProperty(obj, name, {
            get: prop.get.bind(prop),
            set: (v: string) => {
                prop.set(v);
                this.onPropertyChanged(name, v);
            }
        });
    }


    /**
     * Registers a function call for cross-thread invocation.
     * @param methodName - the name of the method to use during invocations.
     * @param obj - the object on which to find the method.
     */
    addMethod<T>(methodName: string, obj: any): void;
    /**
     * Registers a function call for cross-thread invocation.
     * @param methodName - the name of the method to use during invocations.
     * @param obj - the object on which to find the method.
     * @param transferReturnValue - an (optional) function that reports on which values in the `returnValue` should be transfered instead of copied.
     */
    addMethod<T>(methodName: string, obj: any, transferReturnValue: createTransferableCallback<T>): void;
    /**
     * Registers a function call for cross-thread invocation.
     * @param methodName - the name of the method to use during invocations.
     * @param asyncFuncOrObject - the function to execute when the method is invoked.
     */
    addMethod<T>(methodName: string, asyncFunc: (...args: any[]) => Promise<T>): void;
    /**
     * Registers a function call for cross-thread invocation.
     * @param methodName - the name of the method to use during invocations.
     * @param asyncFuncOrObject - the function to execute when the method is invoked.
     * @param transferReturnValue - an (optional) function that reports on which values in the `returnValue` should be transfered instead of copied.
     */
    addMethod<T>(methodName: string, asyncFunc: (...args: any[]) => Promise<T>, transferReturnValue: createTransferableCallback<T>): void;
    addMethod<T>(methodName: string, asyncFuncOrObject: (...args: any[]) => Promise<T> | object, transferReturnValue?: createTransferableCallback<T>): void {
        if (methodName === GET_PROPERTY_VALUES_METHOD) {
            throw new Error(`"${GET_PROPERTY_VALUES_METHOD}" is the name of an internal method for WorkerServers and cannot be overridden.`);
        }

        let method: Function = null;
        if (isFunction(asyncFuncOrObject)) {
            method = asyncFuncOrObject;
        }
        else {
            method = asyncFuncOrObject[methodName];
            if (!isFunction(method)) {
                throw new Error(`${methodName} is not a method in the given object.`);
            }

            method = method.bind(asyncFuncOrObject);
        }

        this.addMethodInternal<T>(methodName, method, transferReturnValue);
    }

    addEvent<U extends EventBase, T>(object: U, type: string): void;
    addEvent<U extends EventBase, T>(object: U, type: string, makePayload: (evt: Event) => T): void;
    addEvent<U extends EventBase, T>(object: U, type: string, makePayload: (evt: Event) => T, transferReturnValue: createTransferableCallback<T>): void;
    addEvent<U extends EventBase, T>(object: U, type: string, makePayload?: (evt: Event) => T, transferReturnValue?: createTransferableCallback<T>): void {
        object.addEventListener(type, (evt: Event) =>
            this.onEvent(type, evt, makePayload, transferReturnValue));
    }
}