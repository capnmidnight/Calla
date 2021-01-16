import { hasImageBitmap, hasOffscreenCanvasRenderingContext2D } from "../html/canvas";
import { WorkerServer } from "../workers/WorkerServer";
import { ImageFetcher } from "./ImageFetcher";
export class ImageFetcherWorkerServer extends WorkerServer {
    constructor(self) {
        super(self);
        const fetcher = new ImageFetcher();
        this.add("getBuffer", (path, headerMap, onProgress) => fetcher.getBuffer(path, headerMap, onProgress), (parts) => [parts.buffer]);
        this.add("postObjectForBuffer", (path, obj, headerMap, onProgress) => fetcher.postObjectForBuffer(path, obj, headerMap, onProgress), (parts) => [parts.buffer]);
        this.add("getObject", (path, headerMap, onProgress) => fetcher.getObject(path, headerMap, onProgress));
        this.add("postObjectForObject", (path, obj, headerMap, onProgress) => fetcher.postObjectForObject(path, obj, headerMap, onProgress));
        this.add("getFile", (path, headerMap, onProgress) => fetcher.getFile(path, headerMap, onProgress));
        this.add("postObjectForFile", (path, obj, headerMap, onProgress) => fetcher.postObjectForFile(path, obj, headerMap, onProgress));
        if (hasImageBitmap) {
            this.add("getImageBitmap", (path, headerMap, onProgress) => fetcher.getImageBitmap(path, headerMap, onProgress), (imgBmp) => [imgBmp]);
            this.add("postObjectForImageBitmap", (path, obj, headerMap, onProgress) => fetcher.postObjectForImageBitmap(path, obj, headerMap, onProgress), (imgBmp) => [imgBmp]);
            if (hasOffscreenCanvasRenderingContext2D) {
                this.add("getCubes", (path, headerMap, onProgress) => fetcher._getCubesViaImageBitmaps(path, headerMap, onProgress), (imgBmps) => imgBmps);
                this.add("renderFace", fetcher.renderImageBitmapFace, (imgBmp) => [imgBmp]);
            }
        }
    }
}
//# sourceMappingURL=ImageFetcherWorkerServer.js.map