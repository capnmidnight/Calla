import { TypedEvent, TypedEventBase } from "../events/EventBase";
import { arrayProgress } from "../tasks/arrayProgress";
import { assertNever, isArray, isDefined, isFunction, isNullOrUndefined, isNumber, isString } from "../typeChecks";
import { GET_PROPERTY_VALUES_METHOD, WorkerClientMessageType, WorkerServerMessageType } from "./WorkerMessages";
export class WorkerClient extends TypedEventBase {
    static isSupported = "Worker" in globalThis;
    scriptPath;
    taskCounter;
    workers;
    invocations = new Map();
    dispatchMessageResponse;
    propertyValues = new Map();
    ready;
    constructor(scriptPath, minScriptPathOrWorkers, workerPoolSizeOrCurTaskCounter) {
        super();
        if (!WorkerClient.isSupported) {
            console.warn("Workers are not supported on this system.");
        }
        // Normalize constructor parameters.
        if (isNumber(minScriptPathOrWorkers)) {
            workerPoolSizeOrCurTaskCounter = minScriptPathOrWorkers;
            minScriptPathOrWorkers = undefined;
        }
        if (isNullOrUndefined(workerPoolSizeOrCurTaskCounter)) {
            workerPoolSizeOrCurTaskCounter = navigator.hardwareConcurrency || 4;
        }
        // Validate parameters
        if (workerPoolSizeOrCurTaskCounter < 1) {
            throw new Error("Worker pool size must be a postive integer greater than 0");
        }
        // Choose which version of the script we're going to load.
        if (process.env.NODE_ENV === "development"
            || !isString(minScriptPathOrWorkers)) {
            this.scriptPath = scriptPath;
        }
        else {
            this.scriptPath = minScriptPathOrWorkers;
        }
        this.dispatchMessageResponse = (evt) => {
            const data = evt.data;
            switch (data.type) {
                case WorkerServerMessageType.Event:
                    this.propogateEvent(data);
                    break;
                case WorkerServerMessageType.PropertyInit:
                    this.propertyInit(data);
                    break;
                case WorkerServerMessageType.Property:
                    this.propertyChanged(data);
                    break;
                case WorkerServerMessageType.Progress:
                    this.progressReport(data);
                    break;
                case WorkerServerMessageType.Return:
                    this.methodReturned(data);
                    break;
                case WorkerServerMessageType.Error:
                    this.invocationError(data);
                    break;
                default:
                    assertNever(data);
            }
        };
        if (isArray(minScriptPathOrWorkers)) {
            this.taskCounter = workerPoolSizeOrCurTaskCounter;
            this.workers = minScriptPathOrWorkers;
        }
        else {
            this.taskCounter = 0;
            this.workers = new Array(workerPoolSizeOrCurTaskCounter);
            for (let i = 0; i < workerPoolSizeOrCurTaskCounter; ++i) {
                this.workers[i] = new Worker(this.scriptPath);
            }
        }
        for (const worker of this.workers) {
            worker.addEventListener("message", this.dispatchMessageResponse);
        }
        this.ready = this.callMethodOnAll(GET_PROPERTY_VALUES_METHOD);
    }
    propogateEvent(data) {
        const evt = new TypedEvent(data.eventName);
        this.dispatchEvent(Object.assign(evt, data.data));
    }
    propertyInit(data) {
        if (this.propertyValues.has(data.propertyName)) {
            this.setProperty(data.propertyName, this.propertyValues.get(data.propertyName));
        }
        else {
            this.propertyValues.set(data.propertyName, data.value);
        }
    }
    propertyChanged(data) {
        this.propertyValues.set(data.propertyName, data.value);
    }
    progressReport(data) {
        const invocation = this.invocations.get(data.taskID);
        const { onProgress } = invocation;
        if (isFunction(onProgress)) {
            onProgress(data.soFar, data.total, data.msg);
        }
    }
    methodReturned(data) {
        const messageHandler = this.removeInvocation(data.taskID);
        const { resolve } = messageHandler;
        resolve(data.returnValue);
    }
    invocationError(data) {
        const messageHandler = this.removeInvocation(data.taskID);
        const { reject, methodName } = messageHandler;
        reject(new Error(`${methodName} failed. Reason: ${data.errorMessage}`));
    }
    /**
     * When the invocation has errored, we want to stop listening to the worker
     * message channel so we don't eat up processing messages that have no chance
     * ever pertaining to the invocation.
     **/
    removeInvocation(taskID) {
        const invocation = this.invocations.get(taskID);
        this.invocations.delete(taskID);
        return invocation;
    }
    /**
     * Invokes the given method on one particular worker thread.
     * @param worker
     * @param taskID
     * @param methodName
     * @param params
     * @param transferables
     * @param onProgress
     */
    callMethodOnWorker(worker, taskID, methodName, params, transferables, onProgress) {
        return new Promise((resolve, reject) => {
            const invocation = {
                onProgress,
                resolve,
                reject,
                methodName
            };
            this.invocations.set(taskID, invocation);
            let message = null;
            if (isDefined(params)) {
                message = {
                    type: WorkerClientMessageType.MethodCall,
                    taskID,
                    methodName,
                    params
                };
            }
            else {
                message = {
                    type: WorkerClientMessageType.MethodCall,
                    taskID,
                    methodName
                };
            }
            this.postMessage(worker, message, transferables);
        });
    }
    postMessage(worker, message, transferables) {
        if (isDefined(transferables)) {
            worker.postMessage(message, transferables);
        }
        else {
            worker.postMessage(message);
        }
    }
    /**
     * Set a property value on all of the worker threads.
     * @param propertyName - the name of the property to set.
     * @param value - the value to which to set the property.
     */
    setProperty(propertyName, value) {
        if (!WorkerClient.isSupported) {
            throw new Error("Workers are not supported on this system.");
        }
        this.propertyValues.set(propertyName, value);
        const message = {
            type: WorkerClientMessageType.PropertySet,
            taskID: this.taskCounter++,
            propertyName,
            value
        };
        for (const worker of this.workers) {
            this.postMessage(worker, message);
        }
    }
    /**
     * Retrieve the most recently cached value for a given property.
     * @param propertyName - the name of the property to get.
     */
    getProperty(propertyName) {
        return this.propertyValues.get(propertyName);
    }
    /**
     * Execute a method on a round-robin selected worker thread.
     * @param methodName - the name of the method to execute.
     * @param params - the parameters to pass to the method.
     * @param transferables - any values in any of the parameters that should be transfered instead of copied to the worker thread.
     * @param onProgress - a callback for receiving progress reports on long-running invocations.
     */
    callMethod(methodName, params, transferables, onProgress) {
        if (!WorkerClient.isSupported) {
            return Promise.reject(new Error("Workers are not supported on this system."));
        }
        // Normalize method parameters.
        let parameters = null;
        let tfers = null;
        if (isFunction(params)) {
            onProgress = params;
            params = null;
            transferables = null;
        }
        if (isFunction(transferables)
            && !onProgress) {
            onProgress = transferables;
            transferables = null;
        }
        if (isArray(params)) {
            parameters = params;
        }
        if (isArray(transferables)) {
            tfers = transferables;
        }
        // taskIDs help us keep track of return values.
        const taskID = this.taskCounter++;
        // Workers are pooled, so the modulus selects them in a round-robin fashion.
        const workerID = taskID % this.workers.length;
        const worker = this.workers[workerID];
        return this.callMethodOnWorker(worker, taskID, methodName, parameters, tfers, onProgress);
    }
    /**
     * Execute a method on all of the worker threads.
     * @param methodName - the name of the method to execute.
     * @param params - the parameters to pass to the method.
     * @param onProgress - a callback for receiving progress reports on long-running invocations.
     */
    async callMethodOnAll(methodName, params, onProgress) {
        if (!WorkerClient.isSupported) {
            return Promise.reject(new Error("Workers are not supported on this system."));
        }
        if (isFunction(params)) {
            onProgress = params;
            params = null;
        }
        let parameters = null;
        if (isArray(params)) {
            parameters = params;
        }
        const rootTaskID = this.taskCounter;
        this.taskCounter += this.workers.length;
        return await arrayProgress(onProgress, this.workers, (worker, subProgress, i) => this.callMethodOnWorker(worker, rootTaskID + i, methodName, parameters, null, subProgress));
    }
    /**
     * Remove one of the workers from the worker pool and create a new instance
     * of the workerized object for just that worker. This is useful for creating
     * workers that cache network requests in memory.
     **/
    getDedicatedClient() {
        if (this.workers.length === 1) {
            throw new Error("Can't create a dedicated fetcher from a dedicated fetcher.");
        }
        const Class = Object.getPrototypeOf(this).constructor;
        const worker = this.workers.pop();
        worker.removeEventListener("message", this.dispatchMessageResponse);
        return new Class(this.scriptPath, [worker], this.taskCounter + 1);
    }
}
//# sourceMappingURL=WorkerClient.js.map