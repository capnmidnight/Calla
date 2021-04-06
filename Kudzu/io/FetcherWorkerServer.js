import { WorkerServer } from "../workers/WorkerServer";
import { Fetcher } from "./Fetcher";
export class FetcherWorkerServer extends WorkerServer {
    constructor(self) {
        super(self);
        const fetcher = new Fetcher();
        addFetcherMethods(this, fetcher);
    }
}
export function addFetcherMethods(server, fetcher) {
    server.addMethod("getBuffer", fetcher, (parts) => [parts.buffer]);
    server.addMethod("postObjectForBuffer", fetcher, (parts) => [parts.buffer]);
    server.addMethod("getImageBitmap", fetcher, (imgBmp) => [imgBmp]);
    server.addMethod("postObjectForImageBitmap", fetcher, (imgBmp) => [imgBmp]);
    server.addMethod("getObject", fetcher);
    server.addMethod("getFile", fetcher);
    server.addMethod("getText", fetcher);
    server.addMethod("postObject", fetcher);
    server.addMethod("postObjectForObject", fetcher);
    server.addMethod("postObjectForFile", fetcher);
    server.addMethod("postObjectForText", fetcher);
}
//# sourceMappingURL=FetcherWorkerServer.js.map