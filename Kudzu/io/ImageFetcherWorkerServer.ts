import { hasImageBitmap } from "../html/canvas";
import type { progressCallback } from "../tasks/progressCallback";
import { WorkerServer } from "../workers/WorkerServer";
import { addFetcherMethods } from "./FetcherWorkerServer";
import { ImageFetcher } from "./ImageFetcher";

export class ImageFetcherWorkerServer extends WorkerServer {
    constructor(self: DedicatedWorkerGlobalScope) {
        super(self);

        const fetcher = new ImageFetcher();
        addFetcherMethods(this, fetcher);
        addImageFetcherMethods(this, fetcher);
    }
}

export function addImageFetcherMethods(server: WorkerServer, fetcher: ImageFetcher) {
    if (hasImageBitmap) {
        server.add(
            "getImageBitmap",
            (path: string, headers: Map<string, string>, onProgress: progressCallback) => fetcher.getImageBitmap(path, headers, onProgress),
            (imgBmp: ImageBitmap) => [imgBmp]);

        server.add(
            "postObjectForImageBitmap",
            (path: string, obj: any, contentType: string, headers: Map<string, string>, onProgress: progressCallback) => fetcher.postObjectForImageBitmap(path, obj, contentType, headers, onProgress),
            (imgBmp: ImageBitmap) => [imgBmp]);
    }
}
