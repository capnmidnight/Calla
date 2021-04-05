import { isArray, isDefined } from "../typeChecks";
export var WorkerServerMessageType;
(function (WorkerServerMessageType) {
    WorkerServerMessageType["Error"] = "error";
    WorkerServerMessageType["Progress"] = "progress";
    WorkerServerMessageType["Return"] = "return";
    WorkerServerMessageType["Event"] = "event";
})(WorkerServerMessageType || (WorkerServerMessageType = {}));
export class WorkerServer {
    /**
     * Creates a new worker thread method call listener.
     * @param self - the worker scope in which to listen.
     */
    constructor(self) {
        this.self = self;
        this.methods = new Map();
        this.self.onmessage = (evt) => {
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
    onProgress(taskID, soFar, total, msg) {
        const message = {
            taskID,
            methodName: WorkerServerMessageType.Progress,
            soFar,
            total,
            msg
        };
        this.postMessage(message);
    }
    onReturn(taskID, returnValue, transferReturnValue) {
        let message = null;
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
    onEvent(type, evt, makePayload, transferReturnValue) {
        let message = null;
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
    add(methodName, asyncFunc, transferReturnValue) {
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
    handle(object, type, makePayload, transferReturnValue) {
        object.addEventListener(type, (evt) => this.onEvent(type, evt, makePayload, transferReturnValue));
    }
}
//# sourceMappingURL=WorkerServer.js.map