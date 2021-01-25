import { waitFor } from "../events/waitFor";
import { createScript } from "../html/script";
import { isGoodNumber, isNullOrUndefined } from "../typeChecks";
export class Fetcher {
    normalizeOnProgress(headerMap, onProgress) {
        if (isNullOrUndefined(onProgress)
            && headerMap instanceof Function) {
            onProgress = headerMap;
        }
        return onProgress;
    }
    normalizeHeaderMap(headerMap) {
        if (headerMap instanceof Map) {
            return headerMap;
        }
        return undefined;
    }
    async getResponse(path, headerMap) {
        const headers = {};
        if (headerMap) {
            for (const pair of headerMap.entries()) {
                headers[pair[0]] = pair[1];
            }
        }
        return await this.readRequestResponse(path, fetch(path, {
            headers
        }));
    }
    async postObjectForResponse(path, obj, headerMap) {
        const headers = {
            "Content-Type": obj instanceof FormData
                ? "multipart/form-data"
                : "application/json"
        };
        if (headerMap) {
            for (const pair of headerMap.entries()) {
                headers[pair[0]] = pair[1];
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
    async readRequestResponse(path, request) {
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
    async readResponseBuffer(path, response, onProgress) {
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
    async _getBuffer(path, headerMap, onProgress) {
        onProgress = this.normalizeOnProgress(headerMap, onProgress);
        headerMap = this.normalizeHeaderMap(headerMap);
        const response = await this.getResponse(path, headerMap);
        return await this.readResponseBuffer(path, response, onProgress);
    }
    async getBuffer(path, headerMap, onProgress) {
        return await this._getBuffer(path, headerMap, onProgress);
    }
    async _postObjectForBuffer(path, obj, headerMap, onProgress) {
        onProgress = this.normalizeOnProgress(headerMap, onProgress);
        headerMap = this.normalizeHeaderMap(headerMap);
        const response = await this.postObjectForResponse(path, obj, headerMap);
        return await this.readResponseBuffer(path, response, onProgress);
    }
    async postObjectForBuffer(path, obj, headerMap, onProgress) {
        return await this._postObjectForBuffer(path, obj, headerMap, onProgress);
    }
    async _getBlob(path, headerMap, onProgress) {
        onProgress = this.normalizeOnProgress(headerMap, onProgress);
        headerMap = this.normalizeHeaderMap(headerMap);
        const { buffer, contentType } = await this._getBuffer(path, headerMap, onProgress);
        return new Blob([buffer], { type: contentType });
    }
    async getBlob(path, headerMap, onProgress) {
        return this._getBlob(path, headerMap, onProgress);
    }
    async _postObjectForBlob(path, obj, headerMap, onProgress) {
        onProgress = this.normalizeOnProgress(headerMap, onProgress);
        headerMap = this.normalizeHeaderMap(headerMap);
        const { buffer, contentType } = await this._postObjectForBuffer(path, obj, headerMap, onProgress);
        return new Blob([buffer], { type: contentType });
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
    readBufferText(buffer) {
        const decoder = new TextDecoder("utf-8");
        const text = decoder.decode(buffer);
        return text;
    }
    async _getText(path, headerMap, onProgress) {
        onProgress = this.normalizeOnProgress(headerMap, onProgress);
        headerMap = this.normalizeHeaderMap(headerMap);
        const { buffer } = await this._getBuffer(path, headerMap, onProgress);
        return this.readBufferText(buffer);
    }
    async getText(path, headerMap, onProgress) {
        return await this._getText(path, headerMap, onProgress);
    }
    async _postObjectForText(path, obj, headerMap, onProgress) {
        onProgress = this.normalizeOnProgress(headerMap, onProgress);
        headerMap = this.normalizeHeaderMap(headerMap);
        const { buffer } = await this._postObjectForBuffer(path, obj, headerMap, onProgress);
        return this.readBufferText(buffer);
    }
    async postObjectForText(path, obj, headerMap, onProgress) {
        return await this._postObjectForText(path, obj, headerMap, onProgress);
    }
    async _getObject(path, headerMap, onProgress) {
        onProgress = this.normalizeOnProgress(headerMap, onProgress);
        headerMap = this.normalizeHeaderMap(headerMap);
        }
        const text = await this._getText(path, headerMap, onProgress);
        return JSON.parse(text);
    }
    async getObject(path, headerMap, onProgress) {
        return await this._getObject(path, headerMap, onProgress);
    }
    async _postObjectForObject(path, obj, headerMap, onProgress) {
        onProgress = this.normalizeOnProgress(headerMap, onProgress);
        headerMap = this.normalizeHeaderMap(headerMap);
        const text = await this._postObjectForText(path, obj, headerMap, onProgress);
        return JSON.parse(text);
    }
    async postObjectForObject(path, obj, headerMap, onProgress) {
        return await this._postObjectForObject(path, obj, headerMap, onProgress);
    }
    async postObject(path, obj, headerMap) {
        await this.postObjectForResponse(path, obj, headerMap);
    }
    readTextXml(text) {
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, "text/xml");
        return xml.documentElement;
    }
    async _getXml(path, headerMap, onProgress) {
        onProgress = this.normalizeOnProgress(headerMap, onProgress);
        headerMap = this.normalizeHeaderMap(headerMap);
        const text = await this._getText(path, headerMap, onProgress);
        return this.readTextXml(text);
    }
    async getXml(path, headerMap, onProgress) {
        return await this._getXml(path, headerMap, onProgress);
    }
    async postObjectForXml(path, obj, headerMap, onProgress) {
        const text = await this._postObjectForText(path, obj, headerMap, onProgress);
        return this.readTextXml(text);
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
}
//# sourceMappingURL=Fetcher.js.map