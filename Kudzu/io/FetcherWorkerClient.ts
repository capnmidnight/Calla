import { waitFor } from "../events/waitFor";
import type { CanvasImageTypes } from "../html/canvas";
import { hasImageBitmap } from "../html/canvas";
import { createScript } from "../html/script";
import type { progressCallback } from "../tasks/progressCallback";
import { WorkerClient } from "../workers/WorkerClient";
import type { BufferAndContentType } from "./BufferAndContentType";
import { fileToImage } from "./Fetcher";
import { IFetcher } from "./IFetcher";

function isDOMParsersSupportedType(type: string): type is DOMParserSupportedType {
    return type === "application/xhtml+xml"
        || type === "application/xml"
        || type === "image/svg+xml"
        || type === "text/html"
        || type === "text/xml";
}

function bufferToXml(buffer: BufferAndContentType) {
    if (!isDOMParsersSupportedType(buffer.contentType)) {
        throw new Error(`Content-Type ${buffer.contentType} is not one supported by the DOM parser.`);
    }

    const decoder = new TextDecoder();
    const text = decoder.decode(buffer.buffer);
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, buffer.contentType);
    return doc.documentElement;
}

export class FetcherWorkerClient
    extends WorkerClient
    implements IFetcher {

    async getBuffer(path: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<BufferAndContentType> {
        return await this.execute("getBuffer", [path, headers], onProgress);
    }

    async getBlob(path: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<Blob> {
        const buffer = await this.getBuffer(path, headers, onProgress);
        const blob = new Blob([buffer.buffer], {
            type: buffer.contentType
        });
        return blob;
    }

    async getText(path: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<string> {
        return await this.execute("getText", [path, headers], onProgress);
    }

    async getXml(path: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<HTMLElement> {
        const buffer = await this.getBuffer(path, headers, onProgress);
        return bufferToXml(buffer);
    }

    async getObject<T>(path: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<T> {
        return await this.execute("getObject", [path, headers], onProgress);
    }

    async getFile(path: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<string> {
        return await this.execute("getFile", [path, headers], onProgress);
    }

    async getImageBitmap(path: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<ImageBitmap> {
        return await this.execute("getImageBitmap", [path, headers], onProgress);
    }

    async getCanvasImage(path: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<CanvasImageTypes> {
        if (hasImageBitmap) {
            return await this.getImageBitmap(path, headers, onProgress);
        }
        else {
            const file = await this.getFile(path, headers, onProgress);
            return await fileToImage(file);
        }
    }

    async postObject(path: string, obj: any, contentType: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<void> {
        await this.execute("postObject", [path, obj, contentType, headers], onProgress);
    }

    async postObjectForBuffer(path: string, obj: any, contentType: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<BufferAndContentType> {
        return await this.execute("postObjectForBuffer", [path, obj, contentType, headers], onProgress);
    }

    async postObjectForBlob(path: string, obj: any, contentType: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<Blob> {
        const buffer = await this.postObjectForBuffer(path, obj, contentType, headers, onProgress);
        const blob = new Blob([buffer.buffer], {
            type: buffer.contentType
        });
        return blob;
    }

    async postObjectForText(path: string, obj: any, contentType: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<string> {
        return await this.execute("postObjectForText", [path, obj, contentType, headers], onProgress);
    }

    async postObjectForXml(path: string, obj: any, contentType: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<HTMLElement> {
        const buffer = await this.postObjectForBuffer(path, obj, contentType, headers, onProgress);
        return bufferToXml(buffer);
    }

    async postObjectForObject<T>(path: string, obj: any, contentType: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<T> {
        return await this.execute("postObjectForObject", [path, obj, contentType, headers], onProgress);
    }

    async postObjectForFile(path: string, obj: any, contentType: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<string> {
        return await this.execute("postObjectForFile", [path, obj, contentType, headers], onProgress);
    }

    async postObjectForImageBitmap(path: string, obj: any, contentType: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<ImageBitmap> {
        return await this.execute("postObjectForImageBitmap", [path, obj, contentType, headers], onProgress);
    }

    async postObjectForCanvasImage(path: string, obj: any, contentType: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<CanvasImageTypes> {
        if (hasImageBitmap) {
            return await this.postObjectForImageBitmap(path, obj, contentType, headers, onProgress);
        }
        else {
            const file = await this.postObjectForFile(path, obj, contentType, headers, onProgress);
            return await fileToImage(file);
        }
    }

    async loadScript(path: string, test: () => boolean, onProgress?: progressCallback): Promise<void> {
        if (!test()) {
            const scriptLoadTask = waitFor(test);
            const file = await this.getFile(path, null, onProgress);
            createScript(file);
            await scriptLoadTask;
        }
        else if (onProgress) {
            onProgress(1, 1, "skip");
        }
    }

    async getWASM<T>(path: string, imports: Record<string, Record<string, WebAssembly.ImportValue>>, onProgress?: progressCallback): Promise<T> {
        const wasmBuffer = await this.getBuffer(path, null, onProgress);
        if (wasmBuffer.contentType !== "application/wasm") {
            throw new Error("Server did not respond with WASM file. Was: " + wasmBuffer.contentType);
        }
        const wasmModule = await WebAssembly.instantiate(wasmBuffer.buffer, imports);
        return (wasmModule.instance.exports as any) as T;
    }
}
