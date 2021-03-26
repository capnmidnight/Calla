import { waitFor } from "../events/waitFor";
import { createScript } from "../html/script";
import { isNullOrUndefined, isNumber, isString } from "../typeChecks";
import { WorkerClient } from "../workers/WorkerClient";
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
export class FetcherWorkerClient {
    constructor(scriptPath, minScriptPath, workerPoolSize = 1) {
        if (isNumber(minScriptPath)) {
            workerPoolSize = minScriptPath;
            minScriptPath = undefined;
        }
        if (isNullOrUndefined(workerPoolSize)) {
            workerPoolSize = 1;
        }
        if (isString(minScriptPath)) {
            this.worker = new WorkerClient(scriptPath, minScriptPath, workerPoolSize);
        }
        else {
            this.worker = new WorkerClient(scriptPath, workerPoolSize);
        }
    }
    async getBuffer(path, headers, onProgress) {
        return await this.worker.execute("getBuffer", [path, headers], onProgress);
    }
    async getBlob(path, headers, onProgress) {
        const buffer = await this.getBuffer(path, headers, onProgress);
        const blob = new Blob([buffer.buffer], {
            type: buffer.contentType
        });
        return blob;
    }
    async getText(path, headers, onProgress) {
        return await this.worker.execute("getText", [path, headers], onProgress);
    }
    async getXml(path, headers, onProgress) {
        const buffer = await this.getBuffer(path, headers, onProgress);
        return bufferToXml(buffer);
    }
    async getObject(path, headers, onProgress) {
        return await this.worker.execute("getObject", [path, headers], onProgress);
    }
    async getFile(path, headers, onProgress) {
        return await this.worker.execute("getFile", [path, headers], onProgress);
    }
    async getImageBitmap(path, headers, onProgress) {
        return await this.worker.execute("getImageBitmap", [path, headers], onProgress);
    }
    async postObject(path, obj, contentType, headers, onProgress) {
        await this.worker.execute("postObject", [path, obj, contentType, headers], onProgress);
    }
    async postObjectForBuffer(path, obj, contentType, headers, onProgress) {
        return await this.worker.execute("postObjectForBuffer", [path, obj, contentType, headers], onProgress);
    }
    async postObjectForBlob(path, obj, contentType, headers, onProgress) {
        const buffer = await this.postObjectForBuffer(path, obj, contentType, headers, onProgress);
        const blob = new Blob([buffer.buffer], {
            type: buffer.contentType
        });
        return blob;
    }
    async postObjectForText(path, obj, contentType, headers, onProgress) {
        return await this.worker.execute("postObjectForText", [path, obj, contentType, headers], onProgress);
    }
    async postObjectForXml(path, obj, contentType, headers, onProgress) {
        const buffer = await this.postObjectForBuffer(path, obj, contentType, headers, onProgress);
        return bufferToXml(buffer);
    }
    async postObjectForObject(path, obj, contentType, headers, onProgress) {
        return await this.worker.execute("postObjectForObject", [path, obj, contentType, headers], onProgress);
    }
    async postObjectForFile(path, obj, contentType, headers, onProgress) {
        return await this.worker.execute("postObjectForFile", [path, obj, contentType, headers], onProgress);
    }
    async postObjectForImageBitmap(path, obj, contentType, headers, onProgress) {
        return await this.worker.execute("postObjectForImageBitmap", [path, obj, contentType, headers], onProgress);
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
//# sourceMappingURL=FetcherWorkerClient.js.map