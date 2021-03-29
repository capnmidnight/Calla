import type { CanvasImageTypes } from "../html/canvas";
import type { progressCallback } from "../tasks/progressCallback";
import { WorkerClient } from "../workers/WorkerClient";
import type { BufferAndContentType } from "./BufferAndContentType";
import { IFetcher } from "./IFetcher";
export declare class FetcherWorkerClient extends WorkerClient implements IFetcher {
    getBuffer(path: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<BufferAndContentType>;
    getBlob(path: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<Blob>;
    getText(path: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<string>;
    getXml(path: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<HTMLElement>;
    getObject<T>(path: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<T>;
    getFile(path: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<string>;
    getImageBitmap(path: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<ImageBitmap>;
    getCanvasImage(path: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<CanvasImageTypes>;
    postObject(path: string, obj: any, contentType: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<void>;
    postObjectForBuffer(path: string, obj: any, contentType: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<BufferAndContentType>;
    postObjectForBlob(path: string, obj: any, contentType: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<Blob>;
    postObjectForText(path: string, obj: any, contentType: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<string>;
    postObjectForXml(path: string, obj: any, contentType: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<HTMLElement>;
    postObjectForObject<T>(path: string, obj: any, contentType: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<T>;
    postObjectForFile(path: string, obj: any, contentType: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<string>;
    postObjectForImageBitmap(path: string, obj: any, contentType: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<ImageBitmap>;
    postObjectForCanvasImage(path: string, obj: any, contentType: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<CanvasImageTypes>;
    loadScript(path: string, test: () => boolean, onProgress?: progressCallback): Promise<void>;
    getWASM<T>(path: string, imports: Record<string, Record<string, WebAssembly.ImportValue>>, onProgress?: progressCallback): Promise<T>;
}
