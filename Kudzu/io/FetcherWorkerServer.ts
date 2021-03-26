import { progressCallback } from "../tasks/progressCallback";
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
    server.add(
        "getBuffer",
        (path: string, headers: Map<string, string>, onProgress: progressCallback) => fetcher.getBuffer(path, headers, onProgress),
        (parts: BufferAndContentType) => [parts.buffer]);

    server.add(
        "getObject",
        (path: string, headers: Map<string, string>, onProgress: progressCallback) => fetcher.getObject(path, headers, onProgress));

    server.add(
        "getFile",
        (path: string, headers: Map<string, string>, onProgress: progressCallback) => fetcher.getFile(path, headers, onProgress));

    server.add(
        "getText",
        (path: string, headers: Map<string, string>, onProgress: progressCallback) => fetcher.getText(path, headers, onProgress));

    server.add(
        "getImageBitmap",
        (path: string, headers: Map<string, string>, onProgress: progressCallback) => fetcher.getImageBitmap(path, headers, onProgress),
        (imgBmp: ImageBitmap) => [imgBmp]);

    server.add(
        "postObject",
        (path: string, obj: any, contentType: string, headers: Map<string, string>, onProgress: progressCallback) => fetcher.postObject(path, obj, contentType, headers, onProgress));

    server.add(
        "postObjectForBuffer",
        (path: string, obj: any, contentType: string, headers: Map<string, string>, onProgress: progressCallback) => fetcher.postObjectForBuffer(path, obj, contentType, headers, onProgress),
        (parts: BufferAndContentType) => [parts.buffer]);

    server.add(
        "postObjectForObject",
        (path: string, obj: any, contentType: string, headers: Map<string, string>, onProgress: progressCallback) => fetcher.postObjectForObject(path, obj, contentType, headers, onProgress));

    server.add(
        "postObjectForFile",
        (path: string, obj: any, contentType: string, headers: Map<string, string>, onProgress: progressCallback) => fetcher.postObjectForFile(path, obj, contentType, headers, onProgress));

    server.add(
        "postObjectForText",
        (path: string, obj: any, contentType: string, headers: Map<string, string>, onProgress: progressCallback) => fetcher.postObjectForText(path, obj, contentType, headers, onProgress));

    server.add(
        "postObjectForImageBitmap",
        (path: string, obj: any, contentType: string, headers: Map<string, string>, onProgress: progressCallback) => fetcher.postObjectForImageBitmap(path, obj, contentType, headers, onProgress),
        (imgBmp: ImageBitmap) => [imgBmp]);
}
