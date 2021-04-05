import { WorkerServer } from "../workers/WorkerServer";
import { Fetcher } from "./Fetcher";
export class FetcherWorkerServer extends WorkerServer {
    constructor(self) {
        super(self);
        const fetcher = new Fetcher();
        addFetcherMethods(this, fetcher);
        this.onReady();
    }
}
export function addFetcherMethods(server, fetcher) {
    server.addMethod("getBuffer", (path, headers, onProgress) => fetcher.getBuffer(path, headers, onProgress), (parts) => [parts.buffer]);
    server.addMethod("getObject", (path, headers, onProgress) => fetcher.getObject(path, headers, onProgress));
    server.addMethod("getFile", (path, headers, onProgress) => fetcher.getFile(path, headers, onProgress));
    server.addMethod("getText", (path, headers, onProgress) => fetcher.getText(path, headers, onProgress));
    server.addMethod("getImageBitmap", (path, headers, onProgress) => fetcher.getImageBitmap(path, headers, onProgress), (imgBmp) => [imgBmp]);
    server.addMethod("postObject", (path, obj, contentType, headers, onProgress) => fetcher.postObject(path, obj, contentType, headers, onProgress));
    server.addMethod("postObjectForBuffer", (path, obj, contentType, headers, onProgress) => fetcher.postObjectForBuffer(path, obj, contentType, headers, onProgress), (parts) => [parts.buffer]);
    server.addMethod("postObjectForObject", (path, obj, contentType, headers, onProgress) => fetcher.postObjectForObject(path, obj, contentType, headers, onProgress));
    server.addMethod("postObjectForFile", (path, obj, contentType, headers, onProgress) => fetcher.postObjectForFile(path, obj, contentType, headers, onProgress));
    server.addMethod("postObjectForText", (path, obj, contentType, headers, onProgress) => fetcher.postObjectForText(path, obj, contentType, headers, onProgress));
    server.addMethod("postObjectForImageBitmap", (path, obj, contentType, headers, onProgress) => fetcher.postObjectForImageBitmap(path, obj, contentType, headers, onProgress), (imgBmp) => [imgBmp]);
}
//# sourceMappingURL=FetcherWorkerServer.js.map