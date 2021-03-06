import type { progressCallback } from "../tasks/progressCallback";
import type { BufferAndContentType } from "./BufferAndContentType";

export interface IFetcher {
    getBuffer(path: string): Promise<BufferAndContentType>;
    getBuffer(path: string, onProgress?: progressCallback): Promise<BufferAndContentType>;
    getBuffer(path: string, headers?: Map<string, string>): Promise<BufferAndContentType>;
    getBuffer(path: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<BufferAndContentType>;

    postObjectForBuffer<T>(path: string, obj: T, contentType: string): Promise<BufferAndContentType>;
    postObjectForBuffer<T>(path: string, obj: T, contentType: string, onProgress?: progressCallback): Promise<BufferAndContentType>;
    postObjectForBuffer<T>(path: string, obj: T, contentType: string, headers?: Map<string, string>): Promise<BufferAndContentType>;
    postObjectForBuffer<T>(path: string, obj: T, contentType: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<BufferAndContentType>;

    getBlob(path: string): Promise<Blob>;
    getBlob(path: string, onProgress?: progressCallback): Promise<Blob>;
    getBlob(path: string, headers?: Map<string, string>): Promise<Blob>;
    getBlob(path: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<Blob>;

    postObjectForBlob<T>(path: string, obj: T, contentType: string): Promise<Blob>;
    postObjectForBlob<T>(path: string, obj: T, contentType: string, onProgress?: progressCallback): Promise<Blob>;
    postObjectForBlob<T>(path: string, obj: T, contentType: string, headers?: Map<string, string>): Promise<Blob>;
    postObjectForBlob<T>(path: string, obj: T, contentType: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<Blob>;

    getFile(path: string): Promise<string>;
    getFile(path: string, onProgress?: progressCallback): Promise<string>;
    getFile(path: string, headers?: Map<string, string>): Promise<string>;
    getFile(path: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<string>;

    postObjectForFile<T>(path: string, obj: T, contentType: string): Promise<string>;
    postObjectForFile<T>(path: string, obj: T, contentType: string, onProgress?: progressCallback): Promise<string>;
    postObjectForFile<T>(path: string, obj: T, contentType: string, headers?: Map<string, string>): Promise<string>;
    postObjectForFile<T>(path: string, obj: T, contentType: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<string>;

    getText(path: string): Promise<string>;
    getText(path: string, onProgress?: progressCallback): Promise<string>;
    getText(path: string, headers?: Map<string, string>): Promise<string>;
    getText(path: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<string>;

    postObjectForText<T>(path: string, obj: T, contentType: string): Promise<string>;
    postObjectForText<T>(path: string, obj: T, contentType: string, onProgress?: progressCallback): Promise<string>;
    postObjectForText<T>(path: string, obj: T, contentType: string, headers?: Map<string, string>): Promise<string>;
    postObjectForText<T>(path: string, obj: T, contentType: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<string>;

    getObject<T>(path: string): Promise<T>;
    getObject<T>(path: string, onProgress?: progressCallback): Promise<T>;
    getObject<T>(path: string, headers?: Map<string, string>): Promise<T>;
    getObject<T>(path: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<T>;

    postObject<T>(path: string, obj: T, contentType: string): Promise<void>;
    postObject<T>(path: string, obj: T, contentType: string, headers?: Map<string, string>): Promise<void>;
    postObject<T>(path: string, obj: T, contentType: string, onProgress?: progressCallback): Promise<void>;
    postObject<T>(path: string, obj: T, contentType: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<void>;

    postObjectForObject<T, U>(path: string, obj: T, contentType: string): Promise<U>;
    postObjectForObject<T, U>(path: string, obj: T, contentType: string, onProgress?: progressCallback): Promise<U>;
    postObjectForObject<T, U>(path: string, obj: T, contentType: string, headers?: Map<string, string>): Promise<U>;
    postObjectForObject<T, U>(path: string, obj: T, contentType: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<U>;

    getXml(path: string): Promise<HTMLElement>;
    getXml(path: string, onProgress?: progressCallback): Promise<HTMLElement>;
    getXml(path: string, headers?: Map<string, string>): Promise<HTMLElement>;
    getXml(path: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<HTMLElement>;

    postObjectForXml<T>(path: string, obj: T, contentType: string): Promise<HTMLElement>;
    postObjectForXml<T>(path: string, obj: T, contentType: string, onProgress?: progressCallback): Promise<HTMLElement>;
    postObjectForXml<T>(path: string, obj: T, contentType: string, headers?: Map<string, string>): Promise<HTMLElement>;
    postObjectForXml<T>(path: string, obj: T, contentType: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<HTMLElement>;

    loadScript(path: string, test: () => boolean, onProgress?: progressCallback): Promise<void>;

    getWASM<T>(path: string, imports: Record<string, Record<string, WebAssembly.ImportValue>>, onProgress?: progressCallback): Promise<T>;
}