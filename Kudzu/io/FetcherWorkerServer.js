import { hasImageBitmap, hasOffscreenCanvasRenderingContext2D } from "../html/canvas";
import { WorkerServer } from "../workers/WorkerServer";
import { Fetcher } from "./Fetcher";
export class FetcherWorkerServer extends WorkerServer {
    constructor(self) {
        super(self);
        const fetcher = new Fetcher();
        this.add("getBuffer", (path, onProgress) => fetcher.getBuffer(path, onProgress), (parts) => [parts.buffer]);
        this.add("postObjectForBuffer", (path, obj, onProgress) => fetcher.postObjectForBuffer(path, obj, onProgress), (parts) => [parts.buffer]);
        this.add("getObject", (path, onProgress) => fetcher.getObject(path, onProgress));
        this.add("postObjectForObject", (path, obj, onProgress) => fetcher.postObjectForObject(path, obj, onProgress));
        this.add("getFile", (path, onProgress) => fetcher.getFile(path, onProgress));
        this.add("postObjectForFile", (path, obj, onProgress) => fetcher.postObjectForFile(path, obj, onProgress));
        if (hasImageBitmap) {
            this.add("getImageBitmap", (path, onProgress) => fetcher.getImageBitmap(path, onProgress), (imgBmp) => [imgBmp]);
            this.add("postObjectForImageBitmap", (path, obj, onProgress) => fetcher.postObjectForImageBitmap(path, obj, onProgress), (imgBmp) => [imgBmp]);
            if (hasOffscreenCanvasRenderingContext2D) {
                this.add("getCubes", (path, onProgress) => fetcher.getCubesViaImageBitmaps(path, onProgress), (imgBmps) => imgBmps);
                this.add("renderFace", fetcher.renderImageBitmapFace, (imgBmp) => [imgBmp]);
            }
        }
        ;
    }
    ;
}
;
//# sourceMappingURL=FetcherWorkerServer.js.map