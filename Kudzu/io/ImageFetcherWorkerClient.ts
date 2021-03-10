import { hasImageBitmap } from "../html/canvas";
import type { progressCallback } from "../tasks/progressCallback";
import { isNullOrUndefined, isNumber, isString } from "../typeChecks";
import { WorkerClient } from "../workers/WorkerClient";
import type { BufferAndContentType } from "./BufferAndContentType";
import { ImageFetcher } from "./ImageFetcher";

export class ImageFetcherWorkerClient extends ImageFetcher {

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

    protected async _getBuffer(path: string, headers?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<BufferAndContentType> {
        onProgress = this.normalizeOnProgress(headers, onProgress);
        headers = this.normalizeHeaders(headers);

        if (this.worker.enabled) {
            return await this.worker.execute("getBuffer", [path, headers], onProgress);
        }
        else {
            return await super._getBuffer(path, headers, onProgress);
        }
    }

    protected async _postObjectForBuffer<T>(path: string, obj: T, contentType: string, headers?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<BufferAndContentType> {
        onProgress = this.normalizeOnProgress(headers, onProgress);
        headers = this.normalizeHeaders(headers);

        if (this.worker.enabled && !(obj instanceof FormData)) {
            return await this.worker.execute("postObjectForBuffer", [path, obj, contentType, headers], onProgress);
        }
        else {
            return await super._postObjectForBuffer(path, obj, contentType, headers, onProgress);
        }
    }

    protected async _getObject<T>(path: string, headers?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<T> {
        onProgress = this.normalizeOnProgress(headers, onProgress);
        headers = this.normalizeHeaders(headers);

        if (this.worker.enabled) {
            return await this.worker.execute("getObject", [path, headers], onProgress);
        }
        else {
            return await super._getObject(path, headers, onProgress);
        }
    }

    protected async _postObjectForObject<T, U>(path: string, obj: T, contentType: string, headers?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<U> {
        onProgress = this.normalizeOnProgress(headers, onProgress);
        headers = this.normalizeHeaders(headers);

        if (this.worker.enabled && !(obj instanceof FormData)) {
            return await this.worker.execute("postObjectForObject", [path, obj, contentType, headers], onProgress);
        }
        else {
            return await super._postObjectForObject(path, obj, contentType, headers, onProgress);
        }
    }

    protected async _getFile(path: string, headers?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<string> {
        onProgress = this.normalizeOnProgress(headers, onProgress);
        headers = this.normalizeHeaders(headers);

        if (this.worker.enabled) {
            return await this.worker.execute("getFile", [path, headers], onProgress);
        }
        else {
            return await super._getFile(path, headers, onProgress);
        }
    }

    protected async _postObjectForFile<T>(path: string, obj: T, contentType: string, headers?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<string> {
        onProgress = this.normalizeOnProgress(headers, onProgress);
        headers = this.normalizeHeaders(headers);

        if (this.worker.enabled && !(obj instanceof FormData)) {
            return await this.worker.execute("postObjectForFile", [path, obj, contentType, headers], onProgress);
        }
        else {
            return await super._postObjectForFile(path, obj, contentType, headers, onProgress);
        }
    }

    protected async _getImageBitmap(path: string, headers?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<ImageBitmap> {
        onProgress = this.normalizeOnProgress(headers, onProgress);
        headers = this.normalizeHeaders(headers);

        if (this.worker.enabled) {
            return await this.worker.execute("getImageBitmap", [path, headers], onProgress);
        }
        else {
            return await super._getImageBitmap(path, headers, onProgress);
        }
    }

    protected async _postObjectForImageBitmap<T>(path: string, obj: T, contentType: string, headers?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<ImageBitmap> {
        onProgress = this.normalizeOnProgress(headers, onProgress);
        headers = this.normalizeHeaders(headers);

        if (this.worker.enabled && hasImageBitmap && !(obj instanceof FormData)) {
            return await this.worker.execute("postObjectForImageBitmap", [path, obj, contentType, headers], onProgress);
        }
        else {
            return await super._postObjectForImageBitmap(path, obj, contentType, headers, onProgress);
        }
    }
}