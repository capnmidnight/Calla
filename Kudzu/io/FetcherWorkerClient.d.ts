import { InterpolationType } from "../graphics2d/InterpolationType";
import { MemoryImageTypes } from "../html/canvas";
import { progressCallback } from "../tasks/progressCallback";
import { WorkerClient } from "../workers/WorkerClient";
import { Fetcher } from "./Fetcher";
import { getPartsReturnType } from "./getPartsReturnType";
export declare class FetcherWorkerClient extends Fetcher {
    worker: WorkerClient;
    constructor(scriptPath: string, minScriptPath: string, workerPoolSize?: number);
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
