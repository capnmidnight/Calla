import { progressCallback } from "../tasks/progressCallback";
import { WorkerServer } from "../workers/WorkerServer";
import { BufferAndContentType } from "./BufferAndContentType";
import { Fetcher } from "./Fetcher";

export class FetcherWorkerServer extends WorkerServer {

    constructor(self: DedicatedWorkerGlobalScope) {
        super(self);

        const fetcher = new Fetcher();
        addFetcherMethods(this, fetcher);

        this.onReady();
    }
}

export function addFetcherMethods(server: WorkerServer, fetcher: Fetcher) {
    server.addMethod(
        "getBuffer",
        (path: string, headers: Map<string, string>, onProgress: progressCallback) =>
            fetcher.getBuffer(path, headers, onProgress),
        (parts: BufferAndContentType) => [parts.buffer]);

    server.addMethod(
        "getObject",
        (path: string, headers: Map<string, string>, onProgress: progressCallback) =>
            fetcher.getObject(path, headers, onProgress));

    server.addMethod(
        "getFile",
        (path: string, headers: Map<string, string>, onProgress: progressCallback) =>
            fetcher.getFile(path, headers, onProgress));

    server.addMethod(
        "getText",
        (path: string, headers: Map<string, string>, onProgress: progressCallback) =>
            fetcher.getText(path, headers, onProgress));

    server.addMethod(
        "getImageBitmap",
        (path: string, headers: Map<string, string>, onProgress: progressCallback) =>
            fetcher.getImageBitmap(path, headers, onProgress),
        (imgBmp: ImageBitmap) => [imgBmp]);

    server.addMethod(
        "postObject",
        (path: string, obj: any, contentType: string, headers: Map<string, string>, onProgress: progressCallback) =>
            fetcher.postObject(path, obj, contentType, headers, onProgress));

    server.addMethod(
        "postObjectForBuffer",
        (path: string, obj: any, contentType: string, headers: Map<string, string>, onProgress: progressCallback) =>
            fetcher.postObjectForBuffer(path, obj, contentType, headers, onProgress),
        (parts: BufferAndContentType) => [parts.buffer]);

    server.addMethod(
        "postObjectForObject",
        (path: string, obj: any, contentType: string, headers: Map<string, string>, onProgress: progressCallback) =>
            fetcher.postObjectForObject(path, obj, contentType, headers, onProgress));

    server.addMethod(
        "postObjectForFile",
        (path: string, obj: any, contentType: string, headers: Map<string, string>, onProgress: progressCallback) =>
            fetcher.postObjectForFile(path, obj, contentType, headers, onProgress));

    server.addMethod(
        "postObjectForText",
        (path: string, obj: any, contentType: string, headers: Map<string, string>, onProgress: progressCallback) =>
            fetcher.postObjectForText(path, obj, contentType, headers, onProgress));

    server.addMethod(
        "postObjectForImageBitmap",
        (path: string, obj: any, contentType: string, headers: Map<string, string>, onProgress: progressCallback) =>
            fetcher.postObjectForImageBitmap(path, obj, contentType, headers, onProgress),
        (imgBmp: ImageBitmap) => [imgBmp]);
}
