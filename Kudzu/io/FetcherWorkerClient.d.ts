import { InterpolationType } from "../graphics2d/InterpolationType";
import { MemoryImageTypes } from "../html/canvas";
import { progressCallback } from "../tasks/progressCallback";
import { WorkerClient } from "../workers/WorkerClient";
import { Fetcher } from "./Fetcher";
import { getPartsReturnType } from "./getPartsReturnType";
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
    protected _getBuffer(path: string, headerMap?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<getPartsReturnType>;
    protected _postObjectForBuffer<T>(path: string, obj: T, headerMap?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<getPartsReturnType>;
    protected _getObject<T>(path: string, headerMap?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<T>;
    protected _postObjectForObject<T, U>(path: string, obj: T, headerMap?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<U>;
    protected _getFile(path: string, headerMap?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<string>;
    protected _postObjectForFile<T>(path: string, obj: T, headerMap?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<string>;
    protected _getImageBitmap(path: string, headerMap?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<ImageBitmap>;
    protected _postObjectForImageBitmap<T>(path: string, obj: T, headerMap?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<ImageBitmap>;
    protected _getCubes(path: string, headerMap?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<MemoryImageTypes[]>;
    protected _getEquiMaps(path: string, interpolation: InterpolationType, maxWidth: number, headerMap?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<MemoryImageTypes[]>;
}
