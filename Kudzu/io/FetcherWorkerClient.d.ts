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
    getBuffer(path: string, onProgress?: progressCallback): Promise<getPartsReturnType>;
    postObjectForBuffer<T>(path: string, obj: T, onProgress?: progressCallback): Promise<getPartsReturnType>;
    getObject<T>(path: string, onProgress?: progressCallback): Promise<T>;
    postObjectForObject<T, U>(path: string, obj: T, onProgress?: progressCallback): Promise<U>;
    getFile(path: string, onProgress?: progressCallback): Promise<string>;
    postObjectForFile<T>(path: string, obj: T, onProgress?: progressCallback): Promise<string>;
    getImageBitmap(path: string, onProgress?: progressCallback): Promise<ImageBitmap>;
    postObjectForImageBitmap<T>(path: string, obj: T, onProgress?: progressCallback): Promise<ImageBitmap>;
    getCubes(path: string, onProgress?: progressCallback): Promise<MemoryImageTypes[]>;
    getEquiMaps(path: string, interpolation: InterpolationType, maxWidth: number, onProgress?: progressCallback): Promise<MemoryImageTypes[]>;
}
