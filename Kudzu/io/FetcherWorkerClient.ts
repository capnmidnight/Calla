import { progressCallback } from "../tasks/progressCallback";
import { isNullOrUndefined, isNumber, isString } from "../typeChecks";
import { WorkerClient } from "../workers/WorkerClient";
import { Fetcher } from "./Fetcher";
import { BufferAndContentType } from "./BufferAndContentType";

export class FetcherWorkerClient extends Fetcher {

    worker: WorkerClient;

    /**
     * Creates a new pooled worker method executor.
     * @param scriptPath - the path to the unminified script to use for the worker
     * @param minScriptPath - the path to the minified script to use for the worker (optional)
     * @param workerPoolSize - the number of worker threads to create for the pool (defaults to 1)
     */
    constructor(scriptPath: string);
    constructor(scriptPath: string, minScriptPath: string);
    constructor(scriptPath: string, workerPoolSize: number);
    constructor(scriptPath: string, minScriptPath: string, workerPoolSize: number);
    constructor(scriptPath: string, minScriptPath?: number | string, workerPoolSize: number = 1) {
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

    protected async _getBuffer(path: string, headerMap?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<BufferAndContentType> {
        onProgress = this.normalizeOnProgress(headerMap, onProgress);
        headerMap = this.normalizeHeaderMap(headerMap);

        if (this.worker.enabled) {
            return await this.worker.execute("getBuffer", [path, headerMap], onProgress);
        }
        else {
            return await super._getBuffer(path, headerMap, onProgress);
        }
    }

    protected async _postObjectForBuffer<T>(path: string, obj: T, headerMap?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<BufferAndContentType> {
        onProgress = this.normalizeOnProgress(headerMap, onProgress);
        headerMap = this.normalizeHeaderMap(headerMap);

        if (this.worker.enabled) {
            return await this.worker.execute("postObjectForBuffer", [path, obj, headerMap], onProgress);
        }
        else {
            return await super._postObjectForBuffer(path, obj, headerMap, onProgress);
        }
    }

    protected async _getObject<T>(path: string, headerMap?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<T> {
        onProgress = this.normalizeOnProgress(headerMap, onProgress);
        headerMap = this.normalizeHeaderMap(headerMap);

        if (this.worker.enabled) {
            return await this.worker.execute("getObject", [path, headerMap], onProgress);
        }
        else {
            return await super._getObject(path, headerMap, onProgress);
        }
    }

    protected async _postObjectForObject<T, U>(path: string, obj: T, headerMap?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<U> {
        onProgress = this.normalizeOnProgress(headerMap, onProgress);
        headerMap = this.normalizeHeaderMap(headerMap);

        if (this.worker.enabled) {
            return await this.worker.execute("postObjectForObject", [path, headerMap, obj], onProgress);
        }
        else {
            return await super._postObjectForObject(path, obj, headerMap, onProgress);
        }
    }

    protected async _getFile(path: string, headerMap?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<string> {
        onProgress = this.normalizeOnProgress(headerMap, onProgress);
        headerMap = this.normalizeHeaderMap(headerMap);

        if (this.worker.enabled) {
            return await this.worker.execute("getFile", [path, headerMap], onProgress);
        }
        else {
            return await super._getFile(path, headerMap, onProgress);
        }
    }

    protected async _postObjectForFile<T>(path: string, obj: T, headerMap?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<string> {
        onProgress = this.normalizeOnProgress(headerMap, onProgress);
        headerMap = this.normalizeHeaderMap(headerMap);

        if (this.worker.enabled) {
            return await this.worker.execute("postObjectForFile", [path, headerMap, obj], onProgress);
        }
        else {
            return await super._postObjectForFile(path, obj, headerMap, onProgress);
        }
    }
}