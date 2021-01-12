import { CubeMapFace } from "../graphics2d/CubeMapFace";
import { InterpolationType } from "../graphics2d/InterpolationType";
import { renderImageBitmapFaces } from "../graphics2d/renderFace";
import { hasImageBitmap, hasOffscreenCanvasRenderingContext2D, MemoryImageTypes } from "../html/canvas";
import { progressCallback } from "../tasks/progressCallback";
import { splitProgress } from "../tasks/splitProgress";
import { isNullOrUndefined, isNumber, isString } from "../typeChecks";
import { WorkerClient } from "../workers/WorkerClient";
import { Fetcher } from "./Fetcher";
import { getPartsReturnType } from "./getPartsReturnType";

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

    async getBuffer(path: string, onProgress?: progressCallback): Promise<getPartsReturnType> {
        if (this.worker.enabled) {
            return await this.worker.execute("getBuffer", [path], onProgress);
        }
        else {
            return await super.getBuffer(path, onProgress);
        }
    }

    async postObjectForBuffer<T>(path: string, obj: T, onProgress?: progressCallback): Promise<getPartsReturnType> {
        if (this.worker.enabled) {
            return await this.worker.execute("postObjectForBuffer", [path, obj], onProgress);
        }
        else {
            return await super.postObjectForBuffer(path, obj, onProgress);
        }
    }

    async getObject<T>(path: string, onProgress?: progressCallback): Promise<T> {
        if (this.worker.enabled) {
            return await this.worker.execute("getObject", [path], onProgress);
        }
        else {
            return await super.getObject(path, onProgress);
        }
    }

    async postObjectForObject<T, U>(path: string, obj: T, onProgress?: progressCallback): Promise<U> {
        if (this.worker.enabled) {
            return await this.worker.execute("postObjectForObject", [path, obj], onProgress);
        }
        else {
            return await super.postObjectForObject(path, obj, onProgress);
        }
    }

    async getFile(path: string, onProgress?: progressCallback): Promise<string> {
        if (this.worker.enabled) {
            return await this.worker.execute("getFile", [path], onProgress);
        }
        else {
            return await super.getFile(path, onProgress);
        }
    }

    async postObjectForFile<T>(path: string, obj: T, onProgress?: progressCallback): Promise<string> {
        if (this.worker.enabled) {
            return await this.worker.execute("postObjectForFile", [path, obj], onProgress);
        }
        else {
            return await super.postObjectForFile(path, obj, onProgress);
        }
    }

    async getImageBitmap(path: string, onProgress?: progressCallback): Promise<ImageBitmap> {
        if (this.worker.enabled) {
            return await this.worker.execute("getImageBitmap", [path], onProgress);
        }
        else {
            return await super.getImageBitmap(path, onProgress);
        }
    }

    async postObjectForImageBitmap<T>(path: string, obj: T, onProgress?: progressCallback): Promise<ImageBitmap> {
        if (this.worker.enabled && hasImageBitmap) {
            return await this.worker.execute("postObjectForImageBitmap", [path, obj], onProgress);
        }
        else {
            return await super.postObjectForImageBitmap(path, obj, onProgress);
        }
    }

    async getCubes(path: string, onProgress?: progressCallback): Promise<MemoryImageTypes[]> {
        if (this.worker.enabled
            && hasImageBitmap
            && hasOffscreenCanvasRenderingContext2D) {
            return await this.worker.execute("getCubes", [path], onProgress);
        }
        else {
            return await super.getCubes(path, onProgress);
        }
    }

    async getEquiMaps(path: string, interpolation: InterpolationType, maxWidth: number, onProgress?: progressCallback): Promise<MemoryImageTypes[]> {
        if (this.worker.enabled
            && hasImageBitmap
            && hasOffscreenCanvasRenderingContext2D) {
            const splits = splitProgress(onProgress, [1, 6]);
            const imgData = await this.getImageData(path, splits.shift());
            return await renderImageBitmapFaces(
                (readData: ImageData, faceName: CubeMapFace, interpolation: InterpolationType, maxWidth: number, onProgress?: progressCallback) =>
                    this.worker.execute("renderFace", [readData, faceName, interpolation, maxWidth], onProgress),
                imgData, interpolation, maxWidth, splits.shift());
        }
        else {
            return await super.getEquiMaps(path, interpolation, maxWidth, onProgress);
        }
    }
}