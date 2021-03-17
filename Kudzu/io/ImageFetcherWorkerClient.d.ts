import type { progressCallback } from "../tasks/progressCallback";
import { WorkerClient } from "../workers/WorkerClient";
import type { BufferAndContentType } from "./BufferAndContentType";
import { ImageFetcher } from "./ImageFetcher";
export declare class ImageFetcherWorkerClient extends ImageFetcher {
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
    protected _getBuffer(path: string, headers?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<BufferAndContentType>;
    protected _postObjectForBuffer(path: string, obj: any, contentType: string, headers?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<BufferAndContentType>;
    protected _getObject<T>(path: string, headers?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<T>;
    protected _postObjectForObject<T>(path: string, obj: any, contentType: string, headers?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<T>;
    protected _getFile(path: string, headers?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<string>;
    protected _postObjectForFile(path: string, obj: any, contentType: string, headers?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<string>;
    protected _getImageBitmap(path: string, headers?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<ImageBitmap>;
    protected _postObjectForImageBitmap(path: string, obj: any, contentType: string, headers?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<ImageBitmap>;
}
