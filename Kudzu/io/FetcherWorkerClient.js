import { isNullOrUndefined, isNumber, isString } from "../typeChecks";
import { WorkerClient } from "../workers/WorkerClient";
import { Fetcher } from "./Fetcher";
export class FetcherWorkerClient extends Fetcher {
    constructor(scriptPath, minScriptPath, workerPoolSize = 1) {
        super();
        if (isNumber(minScriptPath)) {
            workerPoolSize = minScriptPath;
            minScriptPath = undefined;
        }
        if (isNullOrUndefined(workerPoolSize)) {
            workerPoolSize = 1;
        }
        if (isString(minScriptPath)) {
            this.worker = new WorkerClient(scriptPath, minScriptPath, workerPoolSize);
        }
        else {
            this.worker = new WorkerClient(scriptPath, workerPoolSize);
        }
    }
    async _getBuffer(path, headerMap, onProgress) {
        if (!isNullOrUndefined(headerMap)
            && !(headerMap instanceof Map)) {
            onProgress = headerMap;
            headerMap = undefined;
        }
        if (this.worker.enabled) {
            return await this.worker.execute("getBuffer", [path, headerMap], onProgress);
        }
        else {
            return await super._getBuffer(path, headerMap, onProgress);
        }
    }
    async _postObjectForBuffer(path, obj, headerMap, onProgress) {
        if (!isNullOrUndefined(headerMap)
            && !(headerMap instanceof Map)) {
            onProgress = headerMap;
            headerMap = undefined;
        }
        if (this.worker.enabled) {
            return await this.worker.execute("postObjectForBuffer", [path, obj, headerMap], onProgress);
        }
        else {
            return await super._postObjectForBuffer(path, obj, headerMap, onProgress);
        }
    }
    async _getObject(path, headerMap, onProgress) {
        if (!isNullOrUndefined(headerMap)
            && !(headerMap instanceof Map)) {
            onProgress = headerMap;
            headerMap = undefined;
        }
        if (this.worker.enabled) {
            return await this.worker.execute("getObject", [path, headerMap], onProgress);
        }
        else {
            return await super._getObject(path, headerMap, onProgress);
        }
    }
    async _postObjectForObject(path, obj, headerMap, onProgress) {
        if (!isNullOrUndefined(headerMap)
            && !(headerMap instanceof Map)) {
            onProgress = headerMap;
            headerMap = undefined;
        }
        if (this.worker.enabled) {
            return await this.worker.execute("postObjectForObject", [path, headerMap, obj], onProgress);
        }
        else {
            return await super._postObjectForObject(path, obj, headerMap, onProgress);
        }
    }
    async _getFile(path, headerMap, onProgress) {
        if (!isNullOrUndefined(headerMap)
            && !(headerMap instanceof Map)) {
            onProgress = headerMap;
            headerMap = undefined;
        }
        if (this.worker.enabled) {
            return await this.worker.execute("getFile", [path, headerMap], onProgress);
        }
        else {
            return await super._getFile(path, headerMap, onProgress);
        }
    }
    async _postObjectForFile(path, obj, headerMap, onProgress) {
        if (!isNullOrUndefined(headerMap)
            && !(headerMap instanceof Map)) {
            onProgress = headerMap;
            headerMap = undefined;
        }
        if (this.worker.enabled) {
            return await this.worker.execute("postObjectForFile", [path, headerMap, obj], onProgress);
        }
        else {
            return await super._postObjectForFile(path, obj, headerMap, onProgress);
        }
    }
}
//# sourceMappingURL=FetcherWorkerClient.js.map