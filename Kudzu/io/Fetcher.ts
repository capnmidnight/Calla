import { waitFor } from "../events/waitFor";
import { borderInlineStartColor } from "../html/attrs";
import { createScript } from "../html/script";
import { dumpProgress, progressCallback } from "../tasks/progressCallback";
import { splitProgress } from "../tasks/splitProgress";
import { isDefined, isFunction, isNullOrUndefined, isXHRBodyInit } from "../typeChecks";
import type { BufferAndContentType } from "./BufferAndContentType";
import type { IFetcher } from "./IFetcher";

function normalizeMap<KeyT, ValueT>(map: Map<KeyT, ValueT>, key: KeyT, value: ValueT) {
    if (isNullOrUndefined(map)) {
        map = new Map<KeyT, ValueT>();
    }
    if (!map.has(key)) {
        map.set(key, value);
    }
    return map;
}

function trackXHRProgress(name: string, xhr: XMLHttpRequest, target: (XMLHttpRequest | XMLHttpRequestUpload), onProgress: progressCallback, skipLoading: boolean, prevTask: Promise<void>): Promise<void> {
    return new Promise((resolve: () => void, reject: (status: number) => void) => {
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

        target.addEventListener("progress", async (ev: Event) => {
            const evt = ev as ProgressEvent<XMLHttpRequestEventTarget>;
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

function setXHRHeaders(xhr: XMLHttpRequest, method: string, path: string, xhrType: XMLHttpRequestResponseType, headers?: Map<string, string>): void {
    xhr.open(method, path);
    xhr.responseType = xhrType;

    if (headers) {
        for (const [key, value] of headers) {
            xhr.setRequestHeader(key, value);
        }
    }
}

async function blobToBuffer(blob: Blob): Promise<BufferAndContentType> {
    const buffer = await blob.arrayBuffer();
    return {
        buffer,
        contentType: blob.type
    };
}

export class Fetcher implements IFetcher {

    protected normalizeOnProgress(headers?: Map<string, string> | progressCallback, onProgress?: progressCallback): progressCallback | undefined {
        if (isNullOrUndefined(onProgress)
            && isFunction(headers)) {
            onProgress = headers;
        }

        if (!isFunction(onProgress)) {
            onProgress = dumpProgress;
        }

        return onProgress;
    }

    protected normalizeHeaders(headers?: Map<string, string> | progressCallback): Map<string, string> | undefined {
        if (headers instanceof Map) {
            return headers;
        }

        return undefined;
    }

    private async getXHR<T>(path: string, xhrType: XMLHttpRequestResponseType, headers?: Map<string, string>, onProgress?: progressCallback): Promise<T> {
        const xhr = new XMLHttpRequest();

        const download = trackXHRProgress("downloading", xhr, xhr, onProgress, true, Promise.resolve());

        setXHRHeaders(xhr, "GET", path, xhrType, headers);

        xhr.send();

        await download;

        return xhr.response as T;
    }

    private async postXHR<T, U>(path: string, xhrType: XMLHttpRequestResponseType, obj: T, headers?: Map<string, string>, onProgress?: progressCallback): Promise<U> {
        const [upProg, downProg] = splitProgress(onProgress, [1, 1]);
        const xhr = new XMLHttpRequest();

        const upload = trackXHRProgress("uploading", xhr, xhr.upload, upProg, false, Promise.resolve());
        const download = trackXHRProgress("saving", xhr, xhr, downProg, true, upload);

        let body: BodyInit = null;

        if (isXHRBodyInit(obj)) {
            body = obj;
            if (obj instanceof Document) {
                headers = normalizeMap(headers, "Content-Type", "text/xml;charset=UTF-8");
            }
            else if (!(obj instanceof FormData)) {
                headers = normalizeMap(headers, "Content-Type", "application/octet-stream");
            }
        }
        else if (isDefined(obj)) {
            body = JSON.stringify(obj);
            headers = normalizeMap(headers, "Content-Type", "application/json;charset=UTF-8");
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

        return xhr.response as U;
    }

    protected async _getBuffer(path: string, headers?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<BufferAndContentType> {
        onProgress = this.normalizeOnProgress(headers, onProgress);
        headers = this.normalizeHeaders(headers);

        const blob = await this.getXHR<Blob>(path, "blob", headers, onProgress);
        return await blobToBuffer(blob);
    }

    async getBuffer(path: string): Promise<BufferAndContentType>;
    async getBuffer(path: string, onProgress?: progressCallback): Promise<BufferAndContentType>;
    async getBuffer(path: string, headers?: Map<string, string>): Promise<BufferAndContentType>;
    async getBuffer(path: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<BufferAndContentType>;
    async getBuffer(path: string, headers?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<BufferAndContentType> {
        return await this._getBuffer(path, headers, onProgress);
    }

    protected async _postObjectForBuffer<T>(path: string, obj: T, headers?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<BufferAndContentType> {
        onProgress = this.normalizeOnProgress(headers, onProgress);
        headers = this.normalizeHeaders(headers);

        const blob = await this.postXHR<T, Blob>(path, "blob", obj, headers, onProgress);
        return await blobToBuffer(blob);
    }

    async postObjectForBuffer<T>(path: string, obj: T): Promise<BufferAndContentType>;
    async postObjectForBuffer<T>(path: string, obj: T, onProgress?: progressCallback): Promise<BufferAndContentType>;
    async postObjectForBuffer<T>(path: string, obj: T, headers?: Map<string, string>): Promise<BufferAndContentType>;
    async postObjectForBuffer<T>(path: string, obj: T, headers?: Map<string, string>, onProgress?: progressCallback): Promise<BufferAndContentType>;
    async postObjectForBuffer<T>(path: string, obj: T, headers?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<BufferAndContentType> {
        return await this._postObjectForBuffer(path, obj, headers, onProgress);
    }

    protected async _getBlob(path: string, headers?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<Blob> {
        onProgress = this.normalizeOnProgress(headers, onProgress);
        headers = this.normalizeHeaders(headers);

        return await this.getXHR<Blob>(path, "blob", headers, onProgress);
    }

    async getBlob(path: string): Promise<Blob>;
    async getBlob(path: string, onProgress?: progressCallback): Promise<Blob>;
    async getBlob(path: string, headers?: Map<string, string>): Promise<Blob>;
    async getBlob(path: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<Blob>;
    async getBlob(path: string, headers?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<Blob> {
        return this._getBlob(path, headers, onProgress);
    }

    protected async _postObjectForBlob<T>(path: string, obj: T, headers?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<Blob> {
        onProgress = this.normalizeOnProgress(headers, onProgress);
        headers = this.normalizeHeaders(headers);

        return await this.postXHR<T, Blob>(path, "blob", obj, headers, onProgress);
    }

    async postObjectForBlob<T>(path: string, obj: T): Promise<Blob>;
    async postObjectForBlob<T>(path: string, obj: T, onProgress?: progressCallback): Promise<Blob>;
    async postObjectForBlob<T>(path: string, obj: T, headers?: Map<string, string>): Promise<Blob>;
    async postObjectForBlob<T>(path: string, obj: T, headers?: Map<string, string>, onProgress?: progressCallback): Promise<Blob>;
    async postObjectForBlob<T>(path: string, obj: T, headers?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<Blob> {
        return this._postObjectForBlob(path, obj, headers, onProgress);
    }

    protected async _getFile(path: string, headers?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<string> {
        onProgress = this.normalizeOnProgress(headers, onProgress);
        headers = this.normalizeHeaders(headers);

        const blob = await this._getBlob(path, headers, onProgress);
        return URL.createObjectURL(blob);
    }

    async getFile(path: string): Promise<string>;
    async getFile(path: string, onProgress?: progressCallback): Promise<string>;
    async getFile(path: string, headers?: Map<string, string>): Promise<string>;
    async getFile(path: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<string>;
    async getFile(path: string, headers?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<string> {
        return await this._getFile(path, headers, onProgress);
    }

    protected async _postObjectForFile<T>(path: string, obj: T, headers?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<string> {
        onProgress = this.normalizeOnProgress(headers, onProgress);
        headers = this.normalizeHeaders(headers);

        const blob = await this._postObjectForBlob(path, obj, headers, onProgress);
        return URL.createObjectURL(blob);
    }

    async postObjectForFile<T>(path: string, obj: T): Promise<string>;
    async postObjectForFile<T>(path: string, obj: T, onProgress?: progressCallback): Promise<string>;
    async postObjectForFile<T>(path: string, obj: T, headers?: Map<string, string>): Promise<string>;
    async postObjectForFile<T>(path: string, obj: T, headers?: Map<string, string>, onProgress?: progressCallback): Promise<string>;
    async postObjectForFile<T>(path: string, obj: T, headers?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<string> {
        return await this._postObjectForFile(path, obj, headers, onProgress);
    }

    protected async _getText(path: string, headers?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<string> {
        onProgress = this.normalizeOnProgress(headers, onProgress);
        headers = this.normalizeHeaders(headers);

        return await this.getXHR<string>(path, "text", headers, onProgress);
    }

    async getText(path: string): Promise<string>;
    async getText(path: string, onProgress?: progressCallback): Promise<string>;
    async getText(path: string, headers?: Map<string, string>): Promise<string>;
    async getText(path: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<string>;
    async getText(path: string, headers?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<string> {
        return await this._getText(path, headers, onProgress);
    }

    private async _postObjectForText<T>(path: string, obj: T, headers?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<string> {
        onProgress = this.normalizeOnProgress(headers, onProgress);
        headers = this.normalizeHeaders(headers);

        return this.postXHR<T, string>(path, "text", obj, headers, onProgress);
    }

    async postObjectForText<T>(path: string, obj: T): Promise<string>;
    async postObjectForText<T>(path: string, obj: T, onProgress?: progressCallback): Promise<string>;
    async postObjectForText<T>(path: string, obj: T, headers?: Map<string, string>): Promise<string>;
    async postObjectForText<T>(path: string, obj: T, headers?: Map<string, string>, onProgress?: progressCallback): Promise<string>;
    async postObjectForText<T>(path: string, obj: T, headers?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<string> {
        return await this._postObjectForText(path, obj, headers, onProgress);
    }

    private setDefaultAcceptType(headers: Map<string, string> | undefined, type: string): Map<string, string> {
        if (!headers) {
            headers = new Map<string, string>();
        }

        if (!headers.has("Accept")) {
            headers.set("Accept", type);
        }

        return headers;
    }
    protected async _getObject<T>(path: string, headers?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<T> {
        onProgress = this.normalizeOnProgress(headers, onProgress);
        headers = this.normalizeHeaders(headers);

        headers = this.setDefaultAcceptType(headers, "application/json");

        return await this.getXHR<T>(path, "json", headers, onProgress);
    }

    async getObject<T>(path: string): Promise<T>;
    async getObject<T>(path: string, onProgress?: progressCallback): Promise<T>;
    async getObject<T>(path: string, headers?: Map<string, string>): Promise<T>;
    async getObject<T>(path: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<T>;
    async getObject<T>(path: string, headers?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<T> {
        return await this._getObject<T>(path, headers, onProgress);
    }

    protected async _postObjectForObject<T, U>(path: string, obj: T, headers?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<U> {
        onProgress = this.normalizeOnProgress(headers, onProgress);
        headers = this.normalizeHeaders(headers);

        return await this.postXHR<T, U>(path, "json", obj, headers, onProgress);
    }

    async postObjectForObject<T, U>(path: string, obj: T): Promise<U>;
    async postObjectForObject<T, U>(path: string, obj: T, onProgress?: progressCallback): Promise<U>;
    async postObjectForObject<T, U>(path: string, obj: T, headers?: Map<string, string>): Promise<U>;
    async postObjectForObject<T, U>(path: string, obj: T, headers?: Map<string, string>, onProgress?: progressCallback): Promise<U>;
    async postObjectForObject<T, U>(path: string, obj: T, headers?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<U> {
        return await this._postObjectForObject<T, U>(path, obj, headers, onProgress);
    }

    protected async _postObject<T>(path: string, obj: T, headers?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<void> {
        onProgress = this.normalizeOnProgress(headers, onProgress);
        headers = this.normalizeHeaders(headers);

        await this.postXHR<T, void>(path, "", obj, headers, onProgress);
    }

    async postObject<T>(path: string, obj: T): Promise<void>;
    async postObject<T>(path: string, obj: T, headers?: Map<string, string>): Promise<void>;
    async postObject<T>(path: string, obj: T, onProgress?: progressCallback): Promise<void>;
    async postObject<T>(path: string, obj: T, headers?: Map<string, string>, onProgress?: progressCallback): Promise<void>;
    async postObject<T>(path: string, obj: T, headers?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<void> {
        return await this._postObject(path, obj, headers, onProgress);
    }

    protected async _getXml(path: string, headers?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<HTMLElement> {
        onProgress = this.normalizeOnProgress(headers, onProgress);
        headers = this.normalizeHeaders(headers);

        const doc = await this.getXHR<Document>(path, "document", headers, onProgress);
        return doc.documentElement;
    }

    async getXml(path: string): Promise<HTMLElement>;
    async getXml(path: string, onProgress?: progressCallback): Promise<HTMLElement>;
    async getXml(path: string, headers?: Map<string, string>): Promise<HTMLElement>;
    async getXml(path: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<HTMLElement>;
    async getXml(path: string, headers?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<HTMLElement> {
        return await this._getXml(path, headers, onProgress);
    }

    protected async _postObjectForXml<T>(path: string, obj: T, headers?: Map<string, string> | progressCallback, onProgress?: progressCallback) {
        onProgress = this.normalizeOnProgress(headers, onProgress);
        headers = this.normalizeHeaders(headers);

        const doc = await this.postXHR<T, Document>(path, "document", obj, headers, onProgress);
        return doc.documentElement;
    }

    async postObjectForXml<T>(path: string, obj: T): Promise<HTMLElement>;
    async postObjectForXml<T>(path: string, obj: T, onProgress?: progressCallback): Promise<HTMLElement>;
    async postObjectForXml<T>(path: string, obj: T, headers?: Map<string, string>): Promise<HTMLElement>;
    async postObjectForXml<T>(path: string, obj: T, headers?: Map<string, string>, onProgress?: progressCallback): Promise<HTMLElement>;
    async postObjectForXml<T>(path: string, obj: T, headers?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<HTMLElement> {
        return await this._postObjectForXml<T>(path, obj, headers, onProgress);
    }

    async loadScript(path: string, test: () => boolean, onProgress?: progressCallback): Promise<void> {
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

    async getWASM<T>(path: string, imports: Record<string, Record<string, WebAssembly.ImportValue>>, onProgress?: progressCallback): Promise<T> {
        const wasmBuffer = await this.getBuffer(path, onProgress);
        if (wasmBuffer.contentType !== "application/wasm") {
            throw new Error("Server did not respond with WASM file. Was: " + wasmBuffer.contentType);
        }
        const wasmModule = await WebAssembly.instantiate(wasmBuffer.buffer, imports);
        return (wasmModule.instance.exports as any) as T;
    }
}
