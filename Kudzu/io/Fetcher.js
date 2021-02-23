import { waitFor } from "../events/waitFor";
import { createScript } from "../html/script";
import { dumpProgress } from "../tasks/progressCallback";
import { splitProgress } from "../tasks/splitProgress";
import { isDefined, isFunction, isNullOrUndefined, isXHRBodyInit } from "../typeChecks";
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
    normalizeOnProgress(headerMap, onProgress) {
        if (isNullOrUndefined(onProgress)
            && isFunction(headerMap)) {
            onProgress = headerMap;
        }
        if (!isFunction(onProgress)) {
            onProgress = dumpProgress;
        }
        return onProgress;
    }
    normalizeHeaderMap(headerMap) {
        if (headerMap instanceof Map) {
            return headerMap;
        }
        return undefined;
    }
    async getXHR(path, xhrType, headers, onProgress) {
        const xhr = new XMLHttpRequest();
        const download = trackXHRProgress("downloading", xhr, xhr, onProgress, true, Promise.resolve());
        setXHRHeaders(xhr, "GET", path, xhrType, headers);
        xhr.send();
        await download;
        return xhr.response;
    }
    async postXHR(path, xhrType, obj, headerMap, onProgress) {
        const [upProg, downProg] = splitProgress(onProgress, [1, 1]);
        const xhr = new XMLHttpRequest();
        const upload = trackXHRProgress("uploading", xhr, xhr.upload, upProg, false, Promise.resolve());
        const download = trackXHRProgress("saving", xhr, xhr, downProg, true, upload);
        let body = null;
        if (isXHRBodyInit(obj)) {
            body = obj;
        }
        else if (isDefined(obj)) {
            body = JSON.stringify(obj);
            headerMap.set("Content-Type", "application/json;charset=UTF-8");
        }
        setXHRHeaders(xhr, "POST", path, xhrType, headerMap);
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
    async _getBuffer(path, headerMap, onProgress) {
        onProgress = this.normalizeOnProgress(headerMap, onProgress);
        headerMap = this.normalizeHeaderMap(headerMap);
        const blob = await this.getXHR(path, "blob", headerMap, onProgress);
        return await blobToBuffer(blob);
    }
    async getBuffer(path, headerMap, onProgress) {
        return await this._getBuffer(path, headerMap, onProgress);
    }
    async _postObjectForBuffer(path, obj, headerMap, onProgress) {
        onProgress = this.normalizeOnProgress(headerMap, onProgress);
        headerMap = this.normalizeHeaderMap(headerMap);
        const blob = await this.postXHR(path, "blob", obj, headerMap, onProgress);
        return await blobToBuffer(blob);
    }
    async postObjectForBuffer(path, obj, headerMap, onProgress) {
        return await this._postObjectForBuffer(path, obj, headerMap, onProgress);
    }
    async _getBlob(path, headerMap, onProgress) {
        onProgress = this.normalizeOnProgress(headerMap, onProgress);
        headerMap = this.normalizeHeaderMap(headerMap);
        return await this.getXHR(path, "blob", headerMap, onProgress);
    }
    async getBlob(path, headerMap, onProgress) {
        return this._getBlob(path, headerMap, onProgress);
    }
    async _postObjectForBlob(path, obj, headerMap, onProgress) {
        onProgress = this.normalizeOnProgress(headerMap, onProgress);
        headerMap = this.normalizeHeaderMap(headerMap);
        return await this.postXHR(path, "blob", obj, headerMap, onProgress);
    }
    async postObjectForBlob(path, obj, headerMap, onProgress) {
        return this._postObjectForBlob(path, obj, headerMap, onProgress);
    }
    async _getFile(path, headerMap, onProgress) {
        onProgress = this.normalizeOnProgress(headerMap, onProgress);
        headerMap = this.normalizeHeaderMap(headerMap);
        const blob = await this._getBlob(path, headerMap, onProgress);
        return URL.createObjectURL(blob);
    }
    async getFile(path, headerMap, onProgress) {
        return await this._getFile(path, headerMap, onProgress);
    }
    async _postObjectForFile(path, obj, headerMap, onProgress) {
        onProgress = this.normalizeOnProgress(headerMap, onProgress);
        headerMap = this.normalizeHeaderMap(headerMap);
        const blob = await this._postObjectForBlob(path, obj, headerMap, onProgress);
        return URL.createObjectURL(blob);
    }
    async postObjectForFile(path, obj, headerMap, onProgress) {
        return await this._postObjectForFile(path, obj, headerMap, onProgress);
    }
    async _getText(path, headerMap, onProgress) {
        onProgress = this.normalizeOnProgress(headerMap, onProgress);
        headerMap = this.normalizeHeaderMap(headerMap);
        return await this.getXHR(path, "text", headerMap, onProgress);
    }
    async getText(path, headerMap, onProgress) {
        return await this._getText(path, headerMap, onProgress);
    }
    async _postObjectForText(path, obj, headerMap, onProgress) {
        onProgress = this.normalizeOnProgress(headerMap, onProgress);
        headerMap = this.normalizeHeaderMap(headerMap);
        return this.postXHR(path, "text", obj, headerMap, onProgress);
    }
    async postObjectForText(path, obj, headerMap, onProgress) {
        return await this._postObjectForText(path, obj, headerMap, onProgress);
    }
    setDefaultAcceptType(headerMap, type) {
        if (!headerMap) {
            headerMap = new Map();
        }
        if (!headerMap.has("Accept")) {
            headerMap.set("Accept", type);
        }
        return headerMap;
    }
    async _getObject(path, headerMap, onProgress) {
        onProgress = this.normalizeOnProgress(headerMap, onProgress);
        headerMap = this.normalizeHeaderMap(headerMap);
        headerMap = this.setDefaultAcceptType(headerMap, "application/json");
        return await this.getXHR(path, "json", headerMap, onProgress);
    }
    async getObject(path, headerMap, onProgress) {
        return await this._getObject(path, headerMap, onProgress);
    }
    async _postObjectForObject(path, obj, headerMap, onProgress) {
        onProgress = this.normalizeOnProgress(headerMap, onProgress);
        headerMap = this.normalizeHeaderMap(headerMap);
        return await this.postXHR(path, "json", obj, headerMap, onProgress);
    }
    async postObjectForObject(path, obj, headerMap, onProgress) {
        return await this._postObjectForObject(path, obj, headerMap, onProgress);
    }
    async _postObject(path, obj, headerMap, onProgress) {
        onProgress = this.normalizeOnProgress(headerMap, onProgress);
        headerMap = this.normalizeHeaderMap(headerMap);
        await this.postXHR(path, "", obj, headerMap, onProgress);
    }
    async postObject(path, obj, headerMap, onProgress) {
        return await this._postObject(path, obj, headerMap, onProgress);
    }
    async _getXml(path, headerMap, onProgress) {
        onProgress = this.normalizeOnProgress(headerMap, onProgress);
        headerMap = this.normalizeHeaderMap(headerMap);
        const doc = await this.getXHR(path, "document", headerMap, onProgress);
        return doc.documentElement;
    }
    async getXml(path, headerMap, onProgress) {
        return await this._getXml(path, headerMap, onProgress);
    }
    async _postObjectForXml(path, obj, headerMap, onProgress) {
        onProgress = this.normalizeOnProgress(headerMap, onProgress);
        headerMap = this.normalizeHeaderMap(headerMap);
        const doc = await this.postXHR(path, "document", obj, headerMap, onProgress);
        return doc.documentElement;
    }
    async postObjectForXml(path, obj, headerMap, onProgress) {
        return await this._postObjectForXml(path, obj, headerMap, onProgress);
    }
    async loadScript(path, test, onProgress) {
        if (!test()) {
            const scriptLoadTask = waitFor(test);
            const file = await this.getFile(path, onProgress);
            createScript(file);
            await scriptLoadTask;
        }
        else if (onProgress) {
            onProgress(1, 1, "skip");
        }
    }
    async getWASM(path, imports, onProgress) {
        const wasmBuffer = await this.getBuffer(path, onProgress);
        if (wasmBuffer.contentType !== "application/wasm") {
            throw new Error("Server did not respond with WASM file. Was: " + wasmBuffer.contentType);
        }
        const wasmModule = await WebAssembly.instantiate(wasmBuffer.buffer, imports);
        return wasmModule.instance.exports;
    }
}
//# sourceMappingURL=Fetcher.js.map