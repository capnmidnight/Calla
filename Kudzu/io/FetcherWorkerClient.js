import { waitFor } from "../events/waitFor";
import { hasImageBitmap } from "../html/canvas";
import { createScript } from "../html/script";
import { WorkerClient } from "../workers/WorkerClient";
import { fileToImage } from "./Fetcher";
function isDOMParsersSupportedType(type) {
    return type === "application/xhtml+xml"
        || type === "application/xml"
        || type === "image/svg+xml"
        || type === "text/html"
        || type === "text/xml";
}
function bufferToXml(buffer) {
    if (!isDOMParsersSupportedType(buffer.contentType)) {
        throw new Error(`Content-Type ${buffer.contentType} is not one supported by the DOM parser.`);
    }
    const decoder = new TextDecoder();
    const text = decoder.decode(buffer.buffer);
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, buffer.contentType);
    return doc.documentElement;
}
export class BaseFetcherWorkerClient extends WorkerClient {
    async getBuffer(path, headers, onProgress) {
        return await this.callMethod("getBuffer", [path, headers], onProgress);
    }
    async getBlob(path, headers, onProgress) {
        const buffer = await this.getBuffer(path, headers, onProgress);
        const blob = new Blob([buffer.buffer], {
            type: buffer.contentType
        });
        return blob;
    }
    async getText(path, headers, onProgress) {
        return await this.callMethod("getText", [path, headers], onProgress);
    }
    async getXml(path, headers, onProgress) {
        const buffer = await this.getBuffer(path, headers, onProgress);
        return bufferToXml(buffer);
    }
    async getObject(path, headers, onProgress) {
        return await this.callMethod("getObject", [path, headers], onProgress);
    }
    async getFile(path, headers, onProgress) {
        return await this.callMethod("getFile", [path, headers], onProgress);
    }
    async getImageBitmap(path, headers, onProgress) {
        return await this.callMethod("getImageBitmap", [path, headers], onProgress);
    }
    async getCanvasImage(path, headers, onProgress) {
        if (hasImageBitmap) {
            return await this.getImageBitmap(path, headers, onProgress);
        }
        else {
            const file = await this.getFile(path, headers, onProgress);
            return await fileToImage(file);
        }
    }
    async postObject(path, obj, contentType, headers, onProgress) {
        await this.callMethod("postObject", [path, obj, contentType, headers], onProgress);
    }
    async postObjectForBuffer(path, obj, contentType, headers, onProgress) {
        return await this.callMethod("postObjectForBuffer", [path, obj, contentType, headers], onProgress);
    }
    async postObjectForBlob(path, obj, contentType, headers, onProgress) {
        const buffer = await this.postObjectForBuffer(path, obj, contentType, headers, onProgress);
        const blob = new Blob([buffer.buffer], {
            type: buffer.contentType
        });
        return blob;
    }
    async postObjectForText(path, obj, contentType, headers, onProgress) {
        return await this.callMethod("postObjectForText", [path, obj, contentType, headers], onProgress);
    }
    async postObjectForXml(path, obj, contentType, headers, onProgress) {
        const buffer = await this.postObjectForBuffer(path, obj, contentType, headers, onProgress);
        return bufferToXml(buffer);
    }
    async postObjectForObject(path, obj, contentType, headers, onProgress) {
        return await this.callMethod("postObjectForObject", [path, obj, contentType, headers], onProgress);
    }
    async postObjectForFile(path, obj, contentType, headers, onProgress) {
        return await this.callMethod("postObjectForFile", [path, obj, contentType, headers], onProgress);
    }
    async postObjectForImageBitmap(path, obj, contentType, headers, onProgress) {
        return await this.callMethod("postObjectForImageBitmap", [path, obj, contentType, headers], onProgress);
    }
    async postObjectForCanvasImage(path, obj, contentType, headers, onProgress) {
        if (hasImageBitmap) {
            return await this.postObjectForImageBitmap(path, obj, contentType, headers, onProgress);
        }
        else {
            const file = await this.postObjectForFile(path, obj, contentType, headers, onProgress);
            return await fileToImage(file);
        }
    }
    async loadScript(path, test, onProgress) {
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
    async getWASM(path, imports, onProgress) {
        const wasmBuffer = await this.getBuffer(path, null, onProgress);
        if (wasmBuffer.contentType !== "application/wasm") {
            throw new Error("Server did not respond with WASM file. Was: " + wasmBuffer.contentType);
        }
        const wasmModule = await WebAssembly.instantiate(wasmBuffer.buffer, imports);
        return wasmModule.instance.exports;
    }
}
export class FetcherWorkerClient extends BaseFetcherWorkerClient {
}
//# sourceMappingURL=FetcherWorkerClient.js.map