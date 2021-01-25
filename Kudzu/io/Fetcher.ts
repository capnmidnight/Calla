import { waitFor } from "../events/waitFor";
import { createScript } from "../html/script";
import type { progressCallback } from "../tasks/progressCallback";
import { isGoodNumber, isNullOrUndefined } from "../typeChecks";
import { getPartsReturnType } from "./getPartsReturnType";
import { IFetcher } from "./IFetcher";

export class Fetcher implements IFetcher {

    protected normalizeOnProgress(headerMap?: Map<string, string> | progressCallback, onProgress?: progressCallback): progressCallback | undefined {
        if (isNullOrUndefined(onProgress)
            && headerMap instanceof Function) {
            onProgress = headerMap;
        }

        return onProgress;
    }

    protected normalizeHeaderMap(headerMap?: Map<string, string> | progressCallback): Map<string, string> | undefined {
        if (headerMap instanceof Map) {
            return headerMap;
        }

        return undefined;
    }

    private async getResponse(path: string, headerMap?: Map<string, string>): Promise<Response> {
        const headers = {};

        if (headerMap) {
            for (const pair of headerMap.entries()) {
                (headers as any)[pair[0]] = pair[1];
            }
        }

        return await this.readRequestResponse(path, fetch(path, {
            headers
        }));
    }

    private async postObjectForResponse<T>(path: string, obj: T, headerMap?: Map<string, string>): Promise<Response> {
        const headers = {
            "Content-Type": obj instanceof FormData
                ? "multipart/form-data"
                : "application/json"
        };

        if (headerMap) {
            for (const pair of headerMap.entries()) {
                (headers as any)[pair[0]] = pair[1];
            }
        }

        const body = obj instanceof FormData
            ? obj
            : JSON.stringify(obj);

        return await this.readRequestResponse(path, fetch(path, {
            method: "POST",
            headers,
            body
        }));
    }

    private async readRequestResponse(path: string, request: Promise<Response>): Promise<Response> {
        const response = await request;

        if (!response.ok) {
            let message = response.statusText;
            if (response.body) {
                message += " ";
                message += await response.text();
                message = message.trim();
            }

            throw new Error(`[${response.status}] - ${message} . Path ${path}`);
        }

        return response;
    }

    private async readResponseBuffer(path: string, response: Response, onProgress?: progressCallback): Promise<getPartsReturnType> {
        const contentType = response.headers.get("Content-Type");
        if (!contentType) {
            throw new Error("Server did not provide a content type");
        }

        let contentLength = 1;
        const contentLengthStr = response.headers.get("Content-Length");
        if (!contentLengthStr) {
            console.warn(`Server did not provide a content length header. Path: ${path}`);
        }
        else {
            contentLength = parseInt(contentLengthStr, 10);
            if (!isGoodNumber(contentLength)) {
                console.warn(`Server did not provide a valid content length header. Value: ${contentLengthStr}, Path: ${path}`);
                contentLength = 1;
            }
        }

        const hasContentLength = isGoodNumber(contentLength);
        if (!hasContentLength) {
            contentLength = 1;
        }

        if (!response.body) {
            throw new Error("No response body!");
        }

        const reader = response.body.getReader();
        const values = [];
        let receivedLength = 0;
        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                break;
            }

            if (value) {
                values.push(value);
                receivedLength += value.length;
                if (onProgress) {
                    onProgress(receivedLength, Math.max(receivedLength, contentLength), path);
                }
            }
        }

        const buffer = new ArrayBuffer(receivedLength);
        const array = new Uint8Array(buffer);
        receivedLength = 0;
        for (const value of values) {
            array.set(value, receivedLength);
            receivedLength += value.length;
        }

        if (onProgress) {
            onProgress(1, 1, path);
        }

        return { buffer, contentType };
    }

    protected async _getBuffer(path: string, headerMap?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<getPartsReturnType> {
        onProgress = this.normalizeOnProgress(headerMap, onProgress);
        headerMap = this.normalizeHeaderMap(headerMap);

        const response = await this.getResponse(path, headerMap);
        return await this.readResponseBuffer(path, response, onProgress);
    }

    async getBuffer(path: string): Promise<getPartsReturnType>;
    async getBuffer(path: string, onProgress?: progressCallback): Promise<getPartsReturnType>;
    async getBuffer(path: string, headerMap?: Map<string, string>): Promise<getPartsReturnType>;
    async getBuffer(path: string, headerMap?: Map<string, string>, onProgress?: progressCallback): Promise<getPartsReturnType>;
    async getBuffer(path: string, headerMap?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<getPartsReturnType> {
        return await this._getBuffer(path, headerMap, onProgress);
    }

    protected async _postObjectForBuffer<T>(path: string, obj: T, headerMap?: progressCallback | Map<string, string>, onProgress?: progressCallback): Promise<getPartsReturnType> {
        onProgress = this.normalizeOnProgress(headerMap, onProgress);
        headerMap = this.normalizeHeaderMap(headerMap);

        const response = await this.postObjectForResponse(path, obj, headerMap);
        return await this.readResponseBuffer(path, response, onProgress);
    }

    async postObjectForBuffer<T>(path: string, obj: T): Promise<getPartsReturnType>;
    async postObjectForBuffer<T>(path: string, obj: T, onProgress?: progressCallback): Promise<getPartsReturnType>;
    async postObjectForBuffer<T>(path: string, obj: T, headerMap?: Map<string, string>): Promise<getPartsReturnType>;
    async postObjectForBuffer<T>(path: string, obj: T, headerMap?: Map<string, string>, onProgress?: progressCallback): Promise<getPartsReturnType>;
    async postObjectForBuffer<T>(path: string, obj: T, headerMap?: progressCallback | Map<string, string>, onProgress?: progressCallback): Promise<getPartsReturnType> {
        return await this._postObjectForBuffer(path, obj, headerMap, onProgress);
    }

    protected async _getBlob(path: string, headerMap?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<Blob> {
        onProgress = this.normalizeOnProgress(headerMap, onProgress);
        headerMap = this.normalizeHeaderMap(headerMap);

        const { buffer, contentType } = await this._getBuffer(path, headerMap, onProgress);
        return new Blob([buffer], { type: contentType });
    }

    async getBlob(path: string): Promise<Blob>;
    async getBlob(path: string, onProgress?: progressCallback): Promise<Blob>;
    async getBlob(path: string, headerMap?: Map<string, string>): Promise<Blob>;
    async getBlob(path: string, headerMap?: Map<string, string>, onProgress?: progressCallback): Promise<Blob>;
    async getBlob(path: string, headerMap?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<Blob> {
        return this._getBlob(path, headerMap, onProgress);
    }

    protected async _postObjectForBlob<T>(path: string, obj: T, headerMap?: progressCallback | Map<string, string>, onProgress?: progressCallback) {
        onProgress = this.normalizeOnProgress(headerMap, onProgress);
        headerMap = this.normalizeHeaderMap(headerMap);

        const { buffer, contentType } = await this._postObjectForBuffer(path, obj, headerMap, onProgress);
        return new Blob([buffer], { type: contentType });
    }

    async postObjectForBlob<T>(path: string, obj: T): Promise<Blob>;
    async postObjectForBlob<T>(path: string, obj: T, onProgress?: progressCallback): Promise<Blob>;
    async postObjectForBlob<T>(path: string, obj: T, headerMap?: Map<string, string>): Promise<Blob>;
    async postObjectForBlob<T>(path: string, obj: T, headerMap?: Map<string, string>, onProgress?: progressCallback): Promise<Blob>;
    async postObjectForBlob<T>(path: string, obj: T, headerMap?: progressCallback | Map<string, string>, onProgress?: progressCallback) {
        return this._postObjectForBlob(path, obj, headerMap, onProgress);
    }

    protected async _getFile(path: string, headerMap?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<string> {
        onProgress = this.normalizeOnProgress(headerMap, onProgress);
        headerMap = this.normalizeHeaderMap(headerMap);

        const blob = await this._getBlob(path, headerMap, onProgress);
        return URL.createObjectURL(blob);
    }

    async getFile(path: string): Promise<string>;
    async getFile(path: string, onProgress?: progressCallback): Promise<string>;
    async getFile(path: string, headerMap?: Map<string, string>): Promise<string>;
    async getFile(path: string, headerMap?: Map<string, string>, onProgress?: progressCallback): Promise<string>;
    async getFile(path: string, headerMap?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<string> {
        return await this._getFile(path, headerMap, onProgress);
    }

    protected async _postObjectForFile<T>(path: string, obj: T, headerMap?: progressCallback | Map<string, string>, onProgress?: progressCallback): Promise<string> {
        onProgress = this.normalizeOnProgress(headerMap, onProgress);
        headerMap = this.normalizeHeaderMap(headerMap);

        const blob = await this._postObjectForBlob(path, obj, headerMap, onProgress);
        return URL.createObjectURL(blob);
    }

    async postObjectForFile<T>(path: string, obj: T): Promise<string>;
    async postObjectForFile<T>(path: string, obj: T, onProgress?: progressCallback): Promise<string>;
    async postObjectForFile<T>(path: string, obj: T, headerMap?: Map<string, string>): Promise<string>;
    async postObjectForFile<T>(path: string, obj: T, headerMap?: Map<string, string>, onProgress?: progressCallback): Promise<string>;
    async postObjectForFile<T>(path: string, obj: T, headerMap?: progressCallback | Map<string, string>, onProgress?: progressCallback): Promise<string> {
        return await this._postObjectForFile(path, obj, headerMap, onProgress);
    }

    private readBufferText(buffer: ArrayBuffer): string {
        const decoder = new TextDecoder("utf-8");
        const text = decoder.decode(buffer);
        return text;
    }

    protected async _getText(path: string, headerMap?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<string> {
        onProgress = this.normalizeOnProgress(headerMap, onProgress);
        headerMap = this.normalizeHeaderMap(headerMap);

        const { buffer } = await this._getBuffer(path, headerMap, onProgress);
        return this.readBufferText(buffer);
    }

    async getText(path: string): Promise<string>;
    async getText(path: string, onProgress?: progressCallback): Promise<string>;
    async getText(path: string, headerMap?: Map<string, string>): Promise<string>;
    async getText(path: string, headerMap?: Map<string, string>, onProgress?: progressCallback): Promise<string>;
    async getText(path: string, headerMap?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<string> {
        return await this._getText(path, headerMap, onProgress);
    }

    private async _postObjectForText<T>(path: string, obj: T, headerMap?: progressCallback | Map<string, string>, onProgress?: progressCallback): Promise<string> {
        onProgress = this.normalizeOnProgress(headerMap, onProgress);
        headerMap = this.normalizeHeaderMap(headerMap);

        const { buffer } = await this._postObjectForBuffer(path, obj, headerMap, onProgress);
        return this.readBufferText(buffer);
    }

    async postObjectForText<T>(path: string, obj: T): Promise<string>;
    async postObjectForText<T>(path: string, obj: T, onProgress?: progressCallback): Promise<string>;
    async postObjectForText<T>(path: string, obj: T, headerMap?: Map<string, string>): Promise<string>;
    async postObjectForText<T>(path: string, obj: T, headerMap?: Map<string, string>, onProgress?: progressCallback): Promise<string>;
    async postObjectForText<T>(path: string, obj: T, headerMap?: progressCallback | Map<string, string>, onProgress?: progressCallback): Promise<string> {
        return await this._postObjectForText(path, obj, headerMap, onProgress);
    }

    private setDefaultAcceptType(headerMap: Map<string, string>, type: string): Map<string, string> {
        if (!headerMap) {
            headerMap = new Map<string, string>();
        }

        if (!headerMap.has("Accept")) {
            headerMap.set("Accept", type);
        }

        return headerMap;
    }
    protected async _getObject<T>(path: string, headerMap?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<T> {
        onProgress = this.normalizeOnProgress(headerMap, onProgress);
        headerMap = this.normalizeHeaderMap(headerMap);
        headerMap = this.setDefaultAcceptType(headerMap, "application/json");
        const text = await this._getText(path, headerMap, onProgress);
        return JSON.parse(text) as T;
    }

    async getObject<T>(path: string): Promise<T>;
    async getObject<T>(path: string, onProgress?: progressCallback): Promise<T>;
    async getObject<T>(path: string, headerMap?: Map<string, string>): Promise<T>;
    async getObject<T>(path: string, headerMap?: Map<string, string>, onProgress?: progressCallback): Promise<T>;
    async getObject<T>(path: string, headerMap?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<T> {
        return await this._getObject<T>(path, headerMap, onProgress);
    }

    protected async _postObjectForObject<T, U>(path: string, obj: T, headerMap?: progressCallback | Map<string, string>, onProgress?: progressCallback): Promise<U> {
        onProgress = this.normalizeOnProgress(headerMap, onProgress);
        headerMap = this.normalizeHeaderMap(headerMap);
        headerMap = this.setDefaultAcceptType(headerMap, "application/json");
        const text = await this._postObjectForText(path, obj, headerMap, onProgress);
        return JSON.parse(text) as U;
    }

    async postObjectForObject<T, U>(path: string, obj: T): Promise<U>;
    async postObjectForObject<T, U>(path: string, obj: T, onProgress?: progressCallback): Promise<U>;
    async postObjectForObject<T, U>(path: string, obj: T, headerMap?: Map<string, string>): Promise<U>;
    async postObjectForObject<T, U>(path: string, obj: T, headerMap?: Map<string, string>, onProgress?: progressCallback): Promise<U>;
    async postObjectForObject<T, U>(path: string, obj: T, headerMap?: progressCallback | Map<string, string>, onProgress?: progressCallback): Promise<U> {
        return await this._postObjectForObject<T, U>(path, obj, headerMap, onProgress);
    }

    async postObject<T>(path: string, obj: T, headerMap?: Map<string, string>): Promise<void> {
        await this.postObjectForResponse(path, obj, headerMap);
    }

    private readTextXml(text: string): HTMLElement {
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, "text/xml");
        return xml.documentElement;
    }

    protected async _getXml(path: string, headerMap?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<HTMLElement> {
        onProgress = this.normalizeOnProgress(headerMap, onProgress);
        headerMap = this.normalizeHeaderMap(headerMap);

        const text = await this._getText(path, headerMap, onProgress);
        return this.readTextXml(text);
    }

    async getXml(path: string): Promise<HTMLElement>;
    async getXml(path: string, onProgress?: progressCallback): Promise<HTMLElement>;
    async getXml(path: string, headerMap?: Map<string, string>): Promise<HTMLElement>;
    async getXml(path: string, headerMap?: Map<string, string>, onProgress?: progressCallback): Promise<HTMLElement>;
    async getXml(path: string, headerMap?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<HTMLElement> {
        return await this._getXml(path, headerMap, onProgress);
    }

    async postObjectForXml<T>(path: string, obj: T): Promise<HTMLElement>;
    async postObjectForXml<T>(path: string, obj: T, onProgress?: progressCallback): Promise<HTMLElement>;
    async postObjectForXml<T>(path: string, obj: T, headerMap?: Map<string, string>): Promise<HTMLElement>;
    async postObjectForXml<T>(path: string, obj: T, headerMap?: Map<string, string>, onProgress?: progressCallback): Promise<HTMLElement>;
    async postObjectForXml<T>(path: string, obj: T, headerMap?: progressCallback | Map<string, string>, onProgress?: progressCallback): Promise<HTMLElement> {
        const text = await this._postObjectForText(path, obj, headerMap, onProgress);
        return this.readTextXml(text);
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
}