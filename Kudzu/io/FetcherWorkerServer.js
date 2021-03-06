import { WorkerServer } from "../workers/WorkerServer";
import { Fetcher } from "./Fetcher";
export class FetcherWorkerServer extends WorkerServer {
    constructor(self) {
        super(self);
        const fetcher = new Fetcher();
        this.add("getBuffer", (path, headers, onProgress) => fetcher.getBuffer(path, headers, onProgress), (parts) => [parts.buffer]);
        this.add("postObjectForBuffer", (path, obj, contentType, headers, onProgress) => fetcher.postObjectForBuffer(path, obj, contentType, headers, onProgress), (parts) => [parts.buffer]);
        this.add("getObject", (path, headers, onProgress) => fetcher.getObject(path, headers, onProgress));
        this.add("postObjectForObject", (path, obj, contentType, headers, onProgress) => fetcher.postObjectForObject(path, obj, contentType, headers, onProgress));
        this.add("getFile", (path, headers, onProgress) => fetcher.getFile(path, headers, onProgress));
        this.add("postObjectForFile", (path, obj, contentType, headers, onProgress) => fetcher.postObjectForFile(path, obj, contentType, headers, onProgress));
    }
}
//# sourceMappingURL=FetcherWorkerServer.js.map