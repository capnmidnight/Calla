import { hasImageBitmap, hasOffscreenCanvasRenderingContext2D } from "../html/canvas";
import { progressCallback } from "../tasks/progressCallback";
import { WorkerServer } from "../workers/WorkerServer";
import { Fetcher } from "./Fetcher";
import { getPartsReturnType } from "./getPartsReturnType";

export class FetcherWorkerServer extends WorkerServer {

    constructor(self: DedicatedWorkerGlobalScope) {
        super(self);

        const fetcher = new Fetcher();

        this.add(
            "getBuffer",
            (path: string, onProgress: progressCallback) =>
                fetcher.getBuffer(path, onProgress),
            (parts: getPartsReturnType) => [parts.buffer]);

        this.add(
            "postObjectForBuffer",
            (path: string, obj: any, onProgress: progressCallback) =>
                fetcher.postObjectForBuffer(path, obj, onProgress),
            (parts: getPartsReturnType) => [parts.buffer]);

        this.add(
            "getObject",
            (path: string, onProgress: progressCallback) =>
                fetcher.getObject(path, onProgress));

        this.add(
            "postObjectForObject",
            (path: string, obj: any, onProgress: progressCallback) =>
                fetcher.postObjectForObject(path, obj, onProgress));

        this.add(
            "getFile",
            (path: string, onProgress: progressCallback) =>
                fetcher.getFile(path, onProgress));

        this.add(
            "postObjectForFile",
            (path: string, obj: any, onProgress: progressCallback) =>
                fetcher.postObjectForFile(path, obj, onProgress));

        if (hasImageBitmap) {
            this.add(
                "getImageBitmap",
                (path: string, onProgress: progressCallback) =>
                    fetcher.getImageBitmap(path, onProgress),
                (imgBmp: ImageBitmap) => [imgBmp]);

            this.add(
                "postObjectForImageBitmap",
                (path: string, obj: any, onProgress: progressCallback) =>
                    fetcher.postObjectForImageBitmap(path, obj, onProgress),
                (imgBmp: ImageBitmap) => [imgBmp]);

            if (hasOffscreenCanvasRenderingContext2D) {
                this.add(
                    "getCubes",
                    (path: string, onProgress: progressCallback) =>
                        fetcher.getCubesViaImageBitmaps(path, onProgress),
                    (imgBmps: ImageBitmap[]) => imgBmps);

                this.add(
                    "renderFace", fetcher.renderImageBitmapFace, (imgBmp: ImageBitmap) => [imgBmp]);
            }
        };
    };
};