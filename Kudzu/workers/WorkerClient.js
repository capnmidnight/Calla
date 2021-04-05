import { TypedEvent, TypedEventBase } from "../events/EventBase";
import { arrayProgress } from "../tasks/arrayProgress";
import { assertNever, isArray, isDefined, isFunction, isNullOrUndefined, isNumber, isString } from "../typeChecks";
import { GET_PROPERTY_VALUES_METHOD, WorkerClientMessageType, WorkerServerMessageType } from "./WorkerMessages";
export class WorkerClient extends TypedEventBase {
    constructor(scriptPath, minScriptPathOrWorkers, workerPoolSize) {
        super();
        this.taskCounter = 0;
        this.messageHandlers = new Map();
        this.propertyValues = new Map();
        if (!WorkerClient.isSupported) {
            console.warn("Workers are not supported on this system.");
        }
        // Normalize constructor parameters.
        if (isNumber(minScriptPathOrWorkers)) {
            workerPoolSize = minScriptPathOrWorkers;
            minScriptPathOrWorkers = undefined;
        }
        if (isNullOrUndefined(workerPoolSize)) {
            workerPoolSize = 1;
        }
        // Validate parameters
        if (workerPoolSize < 1) {
            throw new Error("Worker pool size must be a postive integer greater than 0");
        }
        // Choose which version of the script we're going to load.
        if (process.env.NODE_ENV === "development"
            || !isString(minScriptPathOrWorkers)) {
            this._script = scriptPath;
        }
        else {
            this._script = minScriptPathOrWorkers;
        }
        this.dispatchMessageResponse = (evt) => {
            const data = evt.data;
            if (data.methodName === WorkerServerMessageType.Event) {
                this.propogateEvent(data);
            }
            else if (data.methodName === WorkerServerMessageType.PropertyInit) {
                this.propertyInit(data);
            }
            else if (data.methodName === WorkerServerMessageType.Property) {
                this.propertyChanged(data);
            }
            else if (data.methodName === WorkerServerMessageType.Progress) {
                this.progressReport(data);
            }
            else if (data.methodName === WorkerServerMessageType.Return) {
                this.methodReturned(data);
            }
            else if (data.methodName === WorkerServerMessageType.Error) {
                this.invocationError(data);
            }
            else {
                assertNever(data);
            }
        };
        if (isArray(minScriptPathOrWorkers)) {
            this.workers = minScriptPathOrWorkers;
        }
        else {
            this.workers = new Array(workerPoolSize);
            for (let i = 0; i < workerPoolSize; ++i) {
                this.workers[i] = new Worker(this._script);
            }
        }
        for (const worker of this.workers) {
            worker.addEventListener("message", this.dispatchMessageResponse);
        }
        const firstWorker = this.workers[0];
        this._ready = this.callMethodOnWorker(firstWorker, this.taskCounter++, GET_PROPERTY_VALUES_METHOD);
    }
    propogateEvent(data) {
        const evt = new TypedEvent(data.type);
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
        const messageHandler = this.messageHandlers.get(data.taskID);
        const { onProgress } = messageHandler;
        if (isFunction(onProgress)) {
            onProgress(data.soFar, data.total, data.msg);
        }
    }
    methodReturned(data) {
        // When the invocation is complete, we want to stop listening to the worker
        // message channel so we don't eat up processing messages that have no chance
        // over pertaining to the invocation.
        const messageHandler = this.messageHandlers.get(data.taskID);
        const { resolve } = messageHandler;
        this.messageHandlers.delete(data.taskID);
        resolve(data.returnValue);
    }
    invocationError(data) {
        // When the invocation has errored, we want to stop listening to the worker
        // message channel so we don't eat up processing messages that have no chance
        // over pertaining to the invocation.
        const messageHandler = this.messageHandlers.get(data.taskID);
        const { reject, methodName } = messageHandler;
        this.messageHandlers.delete(data.taskID);
        reject(new Error(`${methodName} failed. Reason: ${data.errorMessage}`));
    }
    get ready() {
        return this._ready;
    }
    get isDedicated() {
        return this.workers.length === 1;
    }
    popWorker() {
        if (this.isDedicated) {
            throw new Error("Can't create a dedicated fetcher from a dedicated fetcher.");
        }
        const worker = this.workers.pop();
        worker.removeEventListener("message", this.dispatchMessageResponse);
        return worker;
    }
    get scriptPath() {
        return this._script;
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
    getProperty(propertyName) {
        return this.propertyValues.get(propertyName);
    }
    callMethodOnWorker(worker, taskID, methodName, params, transferables, onProgress) {
        return new Promise((resolve, reject) => {
            this.messageHandlers.set(taskID, {
                onProgress,
                resolve,
                reject,
                methodName
            });
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
}
WorkerClient.isSupported = "Worker" in globalThis;
//# sourceMappingURL=WorkerClient.js.map