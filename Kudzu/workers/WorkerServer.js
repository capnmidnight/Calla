import { assertNever, isArray, isDefined, isFunction, isNullOrUndefined } from "../typeChecks";
import { GET_PROPERTY_VALUES_METHOD, WorkerClientMessageType, WorkerServerMessageType } from "./WorkerMessages";
export class WorkerServer {
    self;
    methods = new Map();
    properties = new Map();
    /**
     * Creates a new worker thread method call listener.
     * @param self - the worker scope in which to listen.
     */
    constructor(self) {
        this.self = self;
        this.addMethodInternal(GET_PROPERTY_VALUES_METHOD, () => {
            for (const [name, prop] of this.properties) {
                this.onPropertyInitialized(name, prop.get());
            }
            return Promise.resolve();
        });
        this.self.onmessage = (evt) => {
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
    setProperty(data) {
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
    callMethod(data) {
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
    postMessage(message, transferables) {
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
    onError(taskID, errorMessage) {
        const message = {
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
    onProgress(taskID, soFar, total, msg) {
        const message = {
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
    onReturn(taskID, returnValue, transferReturnValue) {
        let message = null;
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
    onEvent(eventName, evt, makePayload, transferReturnValue) {
        let message = null;
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
    onPropertyInitialized(propertyName, value) {
        const message = {
            type: WorkerServerMessageType.PropertyInit,
            propertyName,
            value
        };
        this.postMessage(message);
    }
    onPropertyChanged(propertyName, value) {
        const message = {
            type: WorkerServerMessageType.Property,
            propertyName,
            value
        };
        this.postMessage(message);
    }
    addMethodInternal(methodName, asyncFunc, transferReturnValue) {
        if (this.methods.has(methodName)) {
            throw new Error(`${methodName} method has already been mapped.`);
        }
        this.methods.set(methodName, async (taskID, ...params) => {
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
    addProperty(obj, name) {
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
            set: (v) => {
                prop.set(v);
                this.onPropertyChanged(name, v);
            }
        });
    }
    addMethod(methodName, asyncFuncOrObject, transferReturnValue) {
        if (methodName === GET_PROPERTY_VALUES_METHOD) {
            throw new Error(`"${GET_PROPERTY_VALUES_METHOD}" is the name of an internal method for WorkerServers and cannot be overridden.`);
        }
        let method = null;
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
        this.addMethodInternal(methodName, method, transferReturnValue);
    }
    addEvent(object, type, makePayload, transferReturnValue) {
        object.addEventListener(type, (evt) => this.onEvent(type, evt, makePayload, transferReturnValue));
    }
}
//# sourceMappingURL=WorkerServer.js.map