import { once } from "../events/once";
import { waitFor } from "../events/waitFor";
import { src } from "../html/attrs";
import { hasImageBitmap } from "../html/canvas";
import { isWorker } from "../html/flags";
import { createScript } from "../html/script";
import { Img } from "../html/tags";
import { dumpProgress } from "../tasks/progressCallback";
import { splitProgress } from "../tasks/splitProgress";
import { isDefined, isString, isXHRBodyInit } from "../typeChecks";
function normalizeMap(map, key, value) {
    const newMap = new Map();
    if (isDefined(map)) {
        for (const [key, value] of map) {
            newMap.set(key, value);
        }
        if (!newMap.has(key)) {
            newMap.set(key, value);
        }
    }
    return newMap;
}
export async function fileToImage(file) {
    const img = Img(src(file));
    await once(img, "loaded");
    return img;
}
function trackXHRProgress(name, xhr, target, onProgress, skipLoading, prevTask) {
    return new Promise((resolve, reject) => {
        let prevDone = !prevTask;
        if (prevTask) {
            prevTask.then(() => prevDone = true);
        }
        let done = false;
        let loaded = skipLoading;
        function maybeResolve() {
            if (loaded && done) {
                resolve();
            }
        }
        async function onError() {
            if (prevDone) {
                reject(xhr.status);
            }
        }
        target.addEventListener("loadstart", () => {
            if (prevDone && !done) {
                onProgress(0, 1, name);
            }
        });
        target.addEventListener("progress", (ev) => {
            if (prevDone && !done) {
                const evt = ev;
                onProgress(evt.loaded, Math.max(evt.loaded, evt.total), name);
                if (evt.loaded === evt.total) {
                    loaded = true;
                    maybeResolve();
                }
            }
        });
        target.addEventListener("load", () => {
            if (prevDone && !done) {
                onProgress(1, 1, name);
                done = true;
                maybeResolve();
            }
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
        onProgress = onProgress || dumpProgress;
        const xhr = new XMLHttpRequest();
        const download = trackXHRProgress("downloading: " + path, xhr, xhr, onProgress, true);
        setXHRHeaders(xhr, "GET", path, xhrType, headers);
        xhr.send();
        await download;
        return xhr.response;
    }
    async postXHR(path, xhrType, obj, contentType, headers, onProgress) {
        onProgress = onProgress || dumpProgress;
        const [upProg, downProg] = splitProgress(onProgress, [1, 1]);
        const xhr = new XMLHttpRequest();
        const upload = trackXHRProgress("uploading", xhr, xhr.upload, upProg, false);
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
    async getCanvasImage(path, headers, onProgress) {
        if (hasImageBitmap) {
            return await this.getImageBitmap(path, headers, onProgress);
        }
        else if (isWorker) {
            return null;
        }
        else {
            const file = await this.getFile(path, headers, onProgress);
            return await fileToImage(file);
        }
    }
    async postObjectForImageBitmap(path, obj, contentType, headers, onProgress) {
        const blob = await this.postObjectForBlob(path, obj, contentType, headers, onProgress);
        return await createImageBitmap(blob);
    }
    async postObjectForCanvasImage(path, obj, contentType, headers, onProgress) {
        if (hasImageBitmap) {
            return await this.postObjectForImageBitmap(path, obj, contentType, headers, onProgress);
        }
        else if (isWorker) {
            return null;
        }
        else {
            const file = await this.postObjectForFile(path, obj, contentType, headers, onProgress);
            return await fileToImage(file);
        }
    }
    async loadScript(path, test, onProgress) {
        if (isWorker) {
            return;
        }
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