import { WorkerServer } from "../workers/WorkerServer";
import { BufferAndContentType } from "./BufferAndContentType";
import { Fetcher } from "./Fetcher";

export class FetcherWorkerServer extends WorkerServer {

    constructor(self: DedicatedWorkerGlobalScope) {
        super(self);

        const fetcher = new Fetcher();
        addFetcherMethods(this, fetcher);
    }
}

export function addFetcherMethods(server: WorkerServer, fetcher: Fetcher) {
    server.addMethod("getBuffer", fetcher,
        (parts: BufferAndContentType) => [parts.buffer]);

    server.addMethod("postObjectForBuffer", fetcher,
        (parts: BufferAndContentType) => [parts.buffer]);

    server.addMethod("getImageBitmap", fetcher,
        (imgBmp: ImageBitmap) => [imgBmp]);

    server.addMethod("postObjectForImageBitmap", fetcher,
        (imgBmp: ImageBitmap) => [imgBmp]);

    server.addMethod("getObject", fetcher);
    server.addMethod("getFile", fetcher);
    server.addMethod("getText", fetcher);
    server.addMethod("postObject", fetcher);
    server.addMethod("postObjectForObject", fetcher);
    server.addMethod("postObjectForFile", fetcher);
    server.addMethod("postObjectForText", fetcher);
}
