import { once } from "../events/once";
import { waitFor } from "../events/waitFor";
import { src } from "../html/attrs";
import { CanvasImageTypes, hasImageBitmap } from "../html/canvas";
import { createScript } from "../html/script";
import { Img } from "../html/tags";
import { dumpProgress, progressCallback } from "../tasks/progressCallback";
import { splitProgress } from "../tasks/splitProgress";
import { isDefined, isNullOrUndefined, isString, isXHRBodyInit } from "../typeChecks";
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

export async function fileToImage(file: string) {
    const img = Img(src(file));
    await once(img, "loaded");
    return img;
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

    private async getXHR<T>(path: string, xhrType: XMLHttpRequestResponseType, headers?: Map<string, string>, onProgress?: progressCallback): Promise<T> {
        onProgress = onProgress || dumpProgress;

        const xhr = new XMLHttpRequest();

        const download = trackXHRProgress("downloading", xhr, xhr, onProgress, true, Promise.resolve());

        setXHRHeaders(xhr, "GET", path, xhrType, headers);

        xhr.send();

        await download;

        return xhr.response as T;
    }

    private async postXHR<T>(path: string, xhrType: XMLHttpRequestResponseType, obj: any, contentType: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<T> {
        onProgress = onProgress || dumpProgress;

        const [upProg, downProg] = splitProgress(onProgress, [1, 1]);
        const xhr = new XMLHttpRequest();

        const upload = trackXHRProgress("uploading", xhr, xhr.upload, upProg, false, Promise.resolve());
        const download = trackXHRProgress("saving", xhr, xhr, downProg, true, upload);

        let body: BodyInit = null;

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

        return xhr.response as T;
    }

    async getBlob(path: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<Blob> {
        return await this.getXHR<Blob>(path, "blob", headers, onProgress);
    }

    async postObjectForBlob(path: string, obj: any, contentType: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<Blob> {
        return await this.postXHR<Blob>(path, "blob", obj, contentType, headers, onProgress);
    }

    async getBuffer(path: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<BufferAndContentType> {
        const blob = await this.getBlob(path, headers, onProgress);
        return await blobToBuffer(blob);
    }

    async postObjectForBuffer(path: string, obj: any, contentType: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<BufferAndContentType> {
        const blob = await this.postObjectForBlob(path, obj, contentType, headers, onProgress);
        return await blobToBuffer(blob);
    }

    async getFile(path: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<string> {
        const blob = await this.getBlob(path, headers, onProgress);
        return URL.createObjectURL(blob);
    }

    async postObjectForFile(path: string, obj: any, contentType: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<string> {
        const blob = await this.postObjectForBlob(path, obj, contentType, headers, onProgress);
        return URL.createObjectURL(blob);
    }

    async getText(path: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<string> {
        return await this.getXHR<string>(path, "text", headers, onProgress);
    }

    async postObjectForText(path: string, obj: any, contentType: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<string> {
        return this.postXHR<string>(path, "text", obj, contentType, headers, onProgress);
    }

    async getObject<T>(path: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<T> {
        if (!headers) {
            headers = new Map<string, string>();
        }

        if (!headers.has("Accept")) {
            headers.set("Accept", "application/json");
        }

        return await this.getXHR<T>(path, "json", headers, onProgress);
    }

    async postObjectForObject<T>(path: string, obj: any, contentType: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<T> {
        return await this.postXHR<T>(path, "json", obj, contentType, headers, onProgress);
    }

    async postObject(path: string, obj: any, contentType: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<void> {
        await this.postXHR<void>(path, "", obj, contentType, headers, onProgress);
    }

    async getXml(path: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<HTMLElement> {
        const doc = await this.getXHR<Document>(path, "document", headers, onProgress);
        return doc.documentElement;
    }

    async postObjectForXml(path: string, obj: any, contentType: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<HTMLElement> {
        const doc = await this.postXHR<Document>(path, "document", obj, contentType, headers, onProgress);
        return doc.documentElement;
    }

    async getImageBitmap(path: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<ImageBitmap> {
        const blob = await this.getBlob(path, headers, onProgress);
        return await createImageBitmap(blob);
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

    async postObjectForImageBitmap(path: string, obj: any, contentType: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<ImageBitmap> {
        const blob = await this.postObjectForBlob(path, obj, contentType, headers, onProgress);
        return await createImageBitmap(blob);
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
