import { waitFor } from "../events/waitFor";
import { createScript } from "../html/script";
import { dumpProgress } from "../tasks/progressCallback";
import { splitProgress } from "../tasks/splitProgress";
import { isDefined, isNullOrUndefined, isString, isXHRBodyInit } from "../typeChecks";
function normalizeMap(map, key, value) {
    if (isNullOrUndefined(map)) {
        map = new Map();
    }
    if (!map.has(key)) {
        map.set(key, value);
    }
    return map;
}
function trackXHRProgress(name, xhr, target, onProgress, skipLoading, prevTask) {
    return new Promise((resolve, reject) => {
        let done = false;
        let loaded = skipLoading;
        function maybeResolve() {
            if (loaded && done) {
                resolve();
            }
        }
        async function onError() {
            await prevTask;
            reject(xhr.status);
        }
        target.addEventListener("loadstart", async () => {
            await prevTask;
            onProgress(0, 1, name);
        });
        target.addEventListener("progress", async (ev) => {
            const evt = ev;
            await prevTask;
            onProgress(evt.loaded, Math.max(evt.loaded, evt.total), name);
            if (evt.loaded === evt.total) {
                loaded = true;
                maybeResolve();
            }
        });
        target.addEventListener("load", async () => {
            await prevTask;
            onProgress(1, 1, name);
            done = true;
            maybeResolve();
        });
        target.addEventListener("error", onError);
        target.addEventListener("abort", onError);
    });
}
function setXHRHeaders(xhr, method, path, xhrType, headers) {
    xhr.open(method, path);
    xhr.responseType = xhrType;
    if (headers) {
        for (const [key, value] of headers) {
            xhr.setRequestHeader(key, value);
        }
    }
}
async function blobToBuffer(blob) {
    const buffer = await blob.arrayBuffer();
    return {
        buffer,
        contentType: blob.type
    };
}
export class Fetcher {
    async getXHR(path, xhrType, headers, onProgress) {
        const xhr = new XMLHttpRequest();
        const download = trackXHRProgress("downloading", xhr, xhr, onProgress, true, Promise.resolve());
        setXHRHeaders(xhr, "GET", path, xhrType, headers);
        xhr.send();
        await download;
        return xhr.response;
    }
    async postXHR(path, xhrType, obj, contentType, headers, onProgress) {
        onProgress = onProgress || dumpProgress;
        const [upProg, downProg] = splitProgress(onProgress, [1, 1]);
        const xhr = new XMLHttpRequest();
        const upload = trackXHRProgress("uploading", xhr, xhr.upload, upProg, false, Promise.resolve());
        const download = trackXHRProgress("saving", xhr, xhr, downProg, true, upload);
        let body = null;
        if (!(obj instanceof FormData)
            && isDefined(contentType)) {
            headers = normalizeMap(headers, "Content-Type", contentType);
        }
        if (isXHRBodyInit(obj) && !isString(obj)) {
            body = obj;
        }
        else if (isDefined(obj)) {
            body = JSON.stringify(obj);
        }
        setXHRHeaders(xhr, "POST", path, xhrType, headers);
        if (isDefined(body)) {
            xhr.send(body);
        }
        else {
            xhr.send();
        }
        await upload;
        await download;
        return xhr.response;
    }
    async getBlob(path, headers, onProgress) {
        return await this.getXHR(path, "blob", headers, onProgress);
    }
    async postObjectForBlob(path, obj, contentType, headers, onProgress) {
        return await this.postXHR(path, "blob", obj, contentType, headers, onProgress);
    }
    async getBuffer(path, headers, onProgress) {
        const blob = await this.getBlob(path, headers, onProgress);
        return await blobToBuffer(blob);
    }
    async postObjectForBuffer(path, obj, contentType, headers, onProgress) {
        const blob = await this.postObjectForBlob(path, obj, contentType, headers, onProgress);
        return await blobToBuffer(blob);
    }
    async getFile(path, headers, onProgress) {
        const blob = await this.getBlob(path, headers, onProgress);
        return URL.createObjectURL(blob);
    }
    async postObjectForFile(path, obj, contentType, headers, onProgress) {
        const blob = await this.postObjectForBlob(path, obj, contentType, headers, onProgress);
        return URL.createObjectURL(blob);
    }
    async getText(path, headers, onProgress) {
        return await this.getXHR(path, "text", headers, onProgress);
    }
    async postObjectForText(path, obj, contentType, headers, onProgress) {
        return this.postXHR(path, "text", obj, contentType, headers, onProgress);
    }
    async getObject(path, headers, onProgress) {
        if (!headers) {
            headers = new Map();
        }
        if (!headers.has("Accept")) {
            headers.set("Accept", "application/json");
        }
        return await this.getXHR(path, "json", headers, onProgress);
    }
    async postObjectForObject(path, obj, contentType, headers, onProgress) {
        return await this.postXHR(path, "json", obj, contentType, headers, onProgress);
    }
    async postObject(path, obj, contentType, headers, onProgress) {
        await this.postXHR(path, "", obj, contentType, headers, onProgress);
    }
    async getXml(path, headers, onProgress) {
        const doc = await this.getXHR(path, "document", headers, onProgress);
        return doc.documentElement;
    }
    async postObjectForXml(path, obj, contentType, headers, onProgress) {
        const doc = await this.postXHR(path, "document", obj, contentType, headers, onProgress);
        return doc.documentElement;
    }
    async getImageBitmap(path, headers, onProgress) {
        const blob = await this.getBlob(path, headers, onProgress);
        return await createImageBitmap(blob);
    }
    async postObjectForImageBitmap(path, obj, contentType, headers, onProgress) {
        const blob = await this.postObjectForBlob(path, obj, contentType, headers, onProgress);
        return await createImageBitmap(blob);
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
//# sourceMappingURL=Fetcher.js.map