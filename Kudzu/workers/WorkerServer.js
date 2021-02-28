export var WorkerMethodMessageType;
(function (WorkerMethodMessageType) {
    WorkerMethodMessageType["Error"] = "error";
    WorkerMethodMessageType["Progress"] = "progress";
    WorkerMethodMessageType["Return"] = "return";
    WorkerMethodMessageType["ReturnValue"] = "returnValue";
})(WorkerMethodMessageType || (WorkerMethodMessageType = {}));
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
                method(data.taskID, ...data.params);
            }
            else {
                this.onError(data.taskID, "method not found: " + data.methodName);
            }
        };
        this.add("methodExists", async (methodName) => this.methods.has(methodName));
    }
    /**
     * Report an error back to the calling thread.
     * @param taskID - the invocation ID of the method that errored.
     * @param errorMessage - what happened?
     */
    onError(taskID, errorMessage) {
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
    onProgress(taskID, soFar, total, msg) {
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
    onReturn(taskID, returnValue, transferables) {
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
    add(methodName, asyncFunc, transferReturnValue) {
        this.methods.set(methodName, async (taskID, ...params) => {
            // If your invocable functions don't report progress, this can be safely ignored.
            const onProgress = (soFar, total, msg) => {
                this.onProgress(taskID, soFar, total, msg);
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
                console.error(exp);
                this.onError(taskID, exp.message);
            }
        });
    }
}
//# sourceMappingURL=WorkerServer.js.map