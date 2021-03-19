import type { progressCallback } from "../tasks/progressCallback";
import { WorkerClient } from "../workers/WorkerClient";
import type { BufferAndContentType } from "./BufferAndContentType";
import { Fetcher } from "./Fetcher";
export declare class FetcherWorkerClient extends Fetcher {
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
    prefetch(path: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<void>;
    clear(): void;
    isCached(path: string): Promise<boolean>;
    protected _getBuffer(path: string, headers?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<BufferAndContentType>;
    protected _postObjectForBuffer(path: string, obj: any, contentType: string, headers?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<BufferAndContentType>;
    protected _getObject<T>(path: string, headers?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<T>;
    protected _postObjectForObject<T>(path: string, obj: any, contentType: string, headers?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<T>;
    protected _getFile(path: string, headers?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<string>;
    protected _postObjectForFile(path: string, obj: any, contentType: string, headers?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<string>;
}
