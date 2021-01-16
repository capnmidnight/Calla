import { hasImageBitmap, hasOffscreenCanvasRenderingContext2D } from "../html/canvas";
import { progressCallback } from "../tasks/progressCallback";
import { WorkerServer } from "../workers/WorkerServer";
import { getPartsReturnType } from "./getPartsReturnType";
import { ImageFetcher } from "./ImageFetcher";

export class ImageFetcherWorkerServer extends WorkerServer {
    constructor(self: DedicatedWorkerGlobalScope) {
        super(self);

        const fetcher = new ImageFetcher();

        this.add(
            "getBuffer",
            (path: string, headerMap: Map<string, string>, onProgress: progressCallback) =>
                fetcher.getBuffer(path, headerMap, onProgress),
            (parts: getPartsReturnType) => [parts.buffer]);

        this.add(
            "postObjectForBuffer",
            (path: string, obj: any, headerMap: Map<string, string>, onProgress: progressCallback) =>
                fetcher.postObjectForBuffer(path, obj, headerMap, onProgress),
            (parts: getPartsReturnType) => [parts.buffer]);

        this.add(
            "getObject",
            (path: string, headerMap: Map<string, string>, onProgress: progressCallback) =>
                fetcher.getObject(path, headerMap, onProgress));

        this.add(
            "postObjectForObject",
            (path: string, obj: any, headerMap: Map<string, string>, onProgress: progressCallback) =>
                fetcher.postObjectForObject(path, obj, headerMap, onProgress));

        this.add(
            "getFile",
            (path: string, headerMap: Map<string, string>, onProgress: progressCallback) =>
                fetcher.getFile(path, headerMap, onProgress));

        this.add(
            "postObjectForFile",
            (path: string, obj: any, headerMap: Map<string, string>, onProgress: progressCallback) =>
                fetcher.postObjectForFile(path, obj, headerMap, onProgress));

        if (hasImageBitmap) {
            this.add(
                "getImageBitmap",
                (path: string, headerMap: Map<string, string>, onProgress: progressCallback) =>
                    fetcher.getImageBitmap(path, headerMap, onProgress),
                (imgBmp: ImageBitmap) => [imgBmp]);

            this.add(
                "postObjectForImageBitmap",
                (path: string, obj: any, headerMap: Map<string, string>, onProgress: progressCallback) =>
                    fetcher.postObjectForImageBitmap(path, obj, headerMap, onProgress),
                (imgBmp: ImageBitmap) => [imgBmp]);

            if (hasOffscreenCanvasRenderingContext2D) {
                this.add(
                    "getCubes",
                    (path: string, headerMap: Map<string, string>, onProgress: progressCallback) =>
                        fetcher._getCubesViaImageBitmaps(path, headerMap, onProgress),
                    (imgBmps: ImageBitmap[]) => imgBmps);

                this.add(
                    "renderFace",
                    fetcher.renderImageBitmapFace,
                    (imgBmp: ImageBitmap) => [imgBmp]);
            }
        }
    }
}