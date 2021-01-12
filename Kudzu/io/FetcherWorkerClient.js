import { renderImageBitmapFaces } from "../graphics2d/renderFace";
import { hasImageBitmap, hasOffscreenCanvasRenderingContext2D } from "../html/canvas";
import { splitProgress } from "../tasks/splitProgress";
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
    async getBuffer(path, onProgress) {
        if (this.worker.enabled) {
            return await this.worker.execute("getBuffer", [path], onProgress);
        }
        else {
            return await super.getBuffer(path, onProgress);
        }
    }
    async postObjectForBuffer(path, obj, onProgress) {
        if (this.worker.enabled) {
            return await this.worker.execute("postObjectForBuffer", [path, obj], onProgress);
        }
        else {
            return await super.postObjectForBuffer(path, obj, onProgress);
        }
    }
    async getObject(path, onProgress) {
        if (this.worker.enabled) {
            return await this.worker.execute("getObject", [path], onProgress);
        }
        else {
            return await super.getObject(path, onProgress);
        }
    }
    async postObjectForObject(path, obj, onProgress) {
        if (this.worker.enabled) {
            return await this.worker.execute("postObjectForObject", [path, obj], onProgress);
        }
        else {
            return await super.postObjectForObject(path, obj, onProgress);
        }
    }
    async getFile(path, onProgress) {
        if (this.worker.enabled) {
            return await this.worker.execute("getFile", [path], onProgress);
        }
        else {
            return await super.getFile(path, onProgress);
        }
    }
    async postObjectForFile(path, obj, onProgress) {
        if (this.worker.enabled) {
            return await this.worker.execute("postObjectForFile", [path, obj], onProgress);
        }
        else {
            return await super.postObjectForFile(path, obj, onProgress);
        }
    }
    async getImageBitmap(path, onProgress) {
        if (this.worker.enabled) {
            return await this.worker.execute("getImageBitmap", [path], onProgress);
        }
        else {
            return await super.getImageBitmap(path, onProgress);
        }
    }
    async postObjectForImageBitmap(path, obj, onProgress) {
        if (this.worker.enabled && hasImageBitmap) {
            return await this.worker.execute("postObjectForImageBitmap", [path, obj], onProgress);
        }
        else {
            return await super.postObjectForImageBitmap(path, obj, onProgress);
        }
    }
    async getCubes(path, onProgress) {
        if (this.worker.enabled
            && hasImageBitmap
            && hasOffscreenCanvasRenderingContext2D) {
            return await this.worker.execute("getCubes", [path], onProgress);
        }
        else {
            return await super.getCubes(path, onProgress);
        }
    }
    async getEquiMaps(path, interpolation, maxWidth, onProgress) {
        if (this.worker.enabled
            && hasImageBitmap
            && hasOffscreenCanvasRenderingContext2D) {
            const splits = splitProgress(onProgress, [1, 6]);
            const imgData = await this.getImageData(path, splits.shift());
            return await renderImageBitmapFaces((readData, faceName, interpolation, maxWidth, onProgress) => this.worker.execute("renderFace", [readData, faceName, interpolation, maxWidth], onProgress), imgData, interpolation, maxWidth, splits.shift());
        }
        else {
            return await super.getEquiMaps(path, interpolation, maxWidth, onProgress);
        }
    }
}
//# sourceMappingURL=FetcherWorkerClient.js.map