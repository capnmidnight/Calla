import type { CanvasImageTypes } from "../html/canvas";
import type { progressCallback } from "../tasks/progressCallback";
import type { BufferAndContentType } from "./BufferAndContentType";

export interface IFetcher {
    getBlob(path: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<Blob>;
    getBuffer(path: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<BufferAndContentType>;
    getFile(path: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<string>;
    getText(path: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<string>;
    getObject<T>(path: string, headers?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<T>;
    getXml(path: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<HTMLElement>;
    getImageBitmap(path: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<ImageBitmap>;
    getCanvasImage(path: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<CanvasImageTypes>;

    postObjectForBlob(path: string, obj: any, contentType: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<Blob>;
    postObjectForBuffer(path: string, obj: any, contentType: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<BufferAndContentType>;
    postObjectForFile(path: string, obj: any, contentType: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<string>;
    postObjectForText(path: string, obj: any, contentType: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<string>;
    postObject(path: string, obj: any, contentType: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<void>;
    postObjectForObject<T>(path: string, obj: any, contentType: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<T>;
    postObjectForXml(path: string, obj: any, contentType: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<HTMLElement>;
    postObjectForImageBitmap(path: string, obj: any, contentType: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<ImageBitmap>;
    postObjectForCanvasImage(path: string, obj: any, contentType: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<CanvasImageTypes>;

    loadScript(path: string, test: () => boolean, onProgress?: progressCallback): Promise<void>;

    getWASM<T>(path: string, imports: Record<string, Record<string, WebAssembly.ImportValue>>, onProgress?: progressCallback): Promise<T>;
}