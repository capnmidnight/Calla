import { hasImageBitmap } from "../html/canvas";
import { WorkerServer } from "../workers/WorkerServer";
import { addFetcherMethods } from "./FetcherWorkerServer";
import { ImageFetcher } from "./ImageFetcher";
export class ImageFetcherWorkerServer extends WorkerServer {
    constructor(self) {
        super(self);
        const fetcher = new ImageFetcher();
        addFetcherMethods(this, fetcher);
        addImageFetcherMethods(this, fetcher);
    }
}
export function addImageFetcherMethods(server, fetcher) {
    if (hasImageBitmap) {
        server.add("getImageBitmap", (path, headers, onProgress) => fetcher.getImageBitmap(path, headers, onProgress), (imgBmp) => [imgBmp]);
        server.add("postObjectForImageBitmap", (path, obj, contentType, headers, onProgress) => fetcher.postObjectForImageBitmap(path, obj, contentType, headers, onProgress), (imgBmp) => [imgBmp]);
    }
}
//# sourceMappingURL=ImageFetcherWorkerServer.js.map