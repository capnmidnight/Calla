import { progressCallback } from "../tasks/progressCallback";
import { WorkerServer } from "../workers/WorkerServer";
import { Fetcher } from "./Fetcher";
import { BufferAndContentType } from "./BufferAndContentType";

export class FetcherWorkerServer extends WorkerServer {

    constructor(self: DedicatedWorkerGlobalScope) {
        super(self);

        const fetcher = new Fetcher();
        addFetcherMethods(this, fetcher);
    }
}

export function addFetcherMethods(server: WorkerServer, fetcher: Fetcher) {
    server.add(
        "getBuffer",
        (path: string, headers: Map<string, string>, onProgress: progressCallback) => fetcher.getBuffer(path, headers, onProgress),
        (parts: BufferAndContentType) => [parts.buffer]);

    server.add(
        "postObjectForBuffer",
        (path: string, obj: any, contentType: string, headers: Map<string, string>, onProgress: progressCallback) => fetcher.postObjectForBuffer(path, obj, contentType, headers, onProgress),
        (parts: BufferAndContentType) => [parts.buffer]);

    server.add(
        "getObject",
        (path: string, headers: Map<string, string>, onProgress: progressCallback) => fetcher.getObject(path, headers, onProgress));

    server.add(
        "postObjectForObject",
        (path: string, obj: any, contentType: string, headers: Map<string, string>, onProgress: progressCallback) => fetcher.postObjectForObject(path, obj, contentType, headers, onProgress));

    server.add(
        "getFile",
        (path: string, headers: Map<string, string>, onProgress: progressCallback) => fetcher.getFile(path, headers, onProgress));

    server.add(
        "postObjectForFile",
        (path: string, obj: any, contentType: string, headers: Map<string, string>, onProgress: progressCallback) => fetcher.postObjectForFile(path, obj, contentType, headers, onProgress));
}
