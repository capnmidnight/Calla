import { WorkerServer } from "../workers/WorkerServer";
import { Fetcher } from "./Fetcher";
export class FetcherWorkerServer extends WorkerServer {
    constructor(self) {
        super(self);
        const fetcher = new Fetcher();
        this.add("getBuffer", (path, headerMap, onProgress) => fetcher.getBuffer(path, headerMap, onProgress), (parts) => [parts.buffer]);
        this.add("postObjectForBuffer", (path, obj, headerMap, onProgress) => fetcher.postObjectForBuffer(path, obj, headerMap, onProgress), (parts) => [parts.buffer]);
        this.add("getObject", (path, headerMap, onProgress) => fetcher.getObject(path, headerMap, onProgress));
        this.add("postObjectForObject", (path, obj, headerMap, onProgress) => fetcher.postObjectForObject(path, obj, headerMap, onProgress));
        this.add("getFile", (path, headerMap, onProgress) => fetcher.getFile(path, headerMap, onProgress));
        this.add("postObjectForFile", (path, obj, headerMap, onProgress) => fetcher.postObjectForFile(path, obj, headerMap, onProgress));
    }
}
//# sourceMappingURL=FetcherWorkerServer.js.map