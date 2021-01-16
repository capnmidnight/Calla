import { once } from "../events/once";
import { waitFor } from "../events/waitFor";
import { renderCanvasFace, renderCanvasFaces, renderImageBitmapFace, renderImageBitmapFaces } from "../graphics2d/renderFace";
import { sliceCubeMap } from "../graphics2d/sliceCubeMap";
import { createUtilityCanvas, createUtilityCanvasFromImage, createUtilityCanvasFromImageBitmap, hasImageBitmap } from "../html/canvas";
import { createScript } from "../html/script";
import { splitProgress } from "../tasks/splitProgress";
import { isGoodNumber, isNullOrUndefined } from "../typeChecks";
import { using, usingAsync } from "../using";
export class Fetcher {
    constructor() {
        this.__getCanvas = hasImageBitmap
            ? this._getCanvasViaImageBitmap
            : this._getCanvasViaImage;
        this.__getImageData = hasImageBitmap
            ? this._getImageDataViaImageBitmap
            : this._getImageDataViaImage;
        this.__getCubes = hasImageBitmap
            ? this._getCubesViaImageBitmaps
            : this._getCubesViaImage;
        this.__getEquiMaps = hasImageBitmap
            ? this._getEquiMapViaImageBitmaps
            : this._getEquiMapViaImage;
    }
    async getResponse(path, headerMap) {
        const headers = {};
        if (headerMap instanceof Map) {
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
        if (headerMap instanceof Map) {
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
            throw new Error(`[${response.status}] - ${response.statusText}. Path ${path}`);
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
    async readFileImage(file) {
        const img = new Image();
        img.src = file;
        if (!img.complete) {
            await once(img, "load", "error");
        }
        return img;
    }
    async _getBuffer(path, headerMap, onProgress) {
        const response = await this.getResponse(path, headerMap);
        return await this.readResponseBuffer(path, response, onProgress);
    }
    async getBuffer(path, headerMap, onProgress) {
        return await this._getBuffer(path, headerMap, onProgress);
    }
    async _postObjectForBuffer(path, obj, headerMap, onProgress) {
        if (!isNullOrUndefined(headerMap)
            && !(headerMap instanceof Map)) {
            onProgress = headerMap;
            headerMap = undefined;
        }
        const response = await this.postObjectForResponse(path, obj, headerMap);
        return await this.readResponseBuffer(path, response, onProgress);
    }
    async postObjectForBuffer(path, obj, headerMap, onProgress) {
        return await this._postObjectForBuffer(path, obj, headerMap, onProgress);
    }
    async _getBlob(path, headerMap, onProgress) {
        const { buffer, contentType } = await this._getBuffer(path, headerMap, onProgress);
        return new Blob([buffer], { type: contentType });
    }
    async getBlob(path, headerMap, onProgress) {
        return this._getBlob(path, headerMap, onProgress);
    }
    async _postObjectForBlob(path, obj, headerMap, onProgress) {
        if (!isNullOrUndefined(headerMap)
            && !(headerMap instanceof Map)) {
            onProgress = headerMap;
            headerMap = undefined;
        }
        const { buffer, contentType } = await this._postObjectForBuffer(path, obj, headerMap, onProgress);
        return new Blob([buffer], { type: contentType });
    }
    async postObjectForBlob(path, obj, headerMap, onProgress) {
        return this._postObjectForBlob(path, obj, headerMap, onProgress);
    }
    async _getFile(path, headerMap, onProgress) {
        const blob = await this._getBlob(path, headerMap, onProgress);
        return URL.createObjectURL(blob);
    }
    async getFile(path, headerMap, onProgress) {
        return await this._getFile(path, headerMap, onProgress);
    }
    async _postObjectForFile(path, obj, headerMap, onProgress) {
        if (!isNullOrUndefined(headerMap)
            && !(headerMap instanceof Map)) {
            onProgress = headerMap;
            headerMap = undefined;
        }
        const blob = await this._postObjectForBlob(path, obj, headerMap, onProgress);
        return URL.createObjectURL(blob);
    }
    async postObjectForFile(path, obj, headerMap, onProgress) {
        return await this._postObjectForFile(path, obj, headerMap, onProgress);
    }
    async _getImageBitmap(path, headerMap, onProgress) {
        const blob = await this._getBlob(path, headerMap, onProgress);
        return await createImageBitmap(blob);
    }
    async getImageBitmap(path, headerMap, onProgress) {
        return await this._getImageBitmap(path, headerMap, onProgress);
    }
    async _getImage(path, headerMap, onProgress) {
        const file = await this._getFile(path, headerMap, onProgress);
        return await this.readFileImage(file);
    }
    async getImage(path, headerMap, onProgress) {
        return await this._getImage(path, headerMap, onProgress);
    }
    async _postObjectForImageBitmap(path, obj, headerMap, onProgress) {
        const blob = await this._postObjectForBlob(path, obj, headerMap, onProgress);
        return await createImageBitmap(blob);
    }
    async postObjectForImageBitmap(path, obj, headerMap, onProgress) {
        return await this._postObjectForImageBitmap(path, obj, headerMap, onProgress);
    }
    async _postObjectForImage(path, obj, headerMap, onProgress) {
        const file = await this._postObjectForFile(path, obj, headerMap, onProgress);
        return await this.readFileImage(file);
    }
    async postObjectForImage(path, obj, headerMap, onProgress) {
        return await this._postObjectForImage(path, obj, headerMap, onProgress);
    }
    async _getCanvasViaImageBitmap(path, headerMap, onProgress) {
        return using(await this._getImageBitmap(path, headerMap, onProgress), (img) => {
            return createUtilityCanvasFromImageBitmap(img);
        });
    }
    async _getCanvasViaImage(path, onProgress) {
        const img = await this.getImage(path, onProgress);
        return createUtilityCanvasFromImage(img);
    }
    readImageData(img) {
        const canv = createUtilityCanvas(img.width, img.height);
        const g = canv.getContext("2d");
        if (!g) {
            throw new Error("Couldn't create a 2D canvas context");
        }
        g.drawImage(img, 0, 0);
        return g.getImageData(0, 0, canv.width, canv.height);
    }
    async _getImageDataViaImageBitmap(path, headerMap, onProgress) {
        return using(await this._getImageBitmap(path, headerMap, onProgress), (img) => {
            return this.readImageData(img);
        });
    }
    async _getImageDataViaImage(path, headerMap, onProgress) {
        const img = await this._getImage(path, headerMap, onProgress);
        return this.readImageData(img);
    }
    async _getCubesViaImageBitmaps(path, headerMap, onProgress) {
        return await usingAsync(await this._getImageBitmap(path, headerMap, onProgress), async (img) => {
            const canvs = sliceCubeMap(img);
            return await Promise.all(canvs.map((canv) => createImageBitmap(canv)));
        });
    }
    async _getCubesViaImage(path, headerMap, onProgress) {
        const img = await this._getImage(path, headerMap, onProgress);
        return sliceCubeMap(img);
    }
    async _getEquiMapViaImageBitmaps(path, interpolation, maxWidth, headerMap, onProgress) {
        const splits = splitProgress(onProgress, [1, 6]);
        const imgData = await this._getImageDataViaImageBitmap(path, headerMap, splits.shift());
        return await renderImageBitmapFaces(renderImageBitmapFace, imgData, interpolation, maxWidth, splits.shift());
    }
    async _getEquiMapViaImage(path, interpolation, maxWidth, headerMap, onProgress) {
        const splits = splitProgress(onProgress, [1, 6]);
        const imgData = await this._getImageDataViaImage(path, headerMap, splits.shift());
        return await renderCanvasFaces(renderCanvasFace, imgData, interpolation, maxWidth, splits.shift());
    }
    readBufferText(buffer) {
        const decoder = new TextDecoder("utf-8");
        const text = decoder.decode(buffer);
        return text;
    }
    async _getText(path, headerMap, onProgress) {
        const { buffer } = await this._getBuffer(path, headerMap, onProgress);
        return this.readBufferText(buffer);
    }
    async getText(path, headerMap, onProgress) {
        return await this._getText(path, headerMap, onProgress);
    }
    async _postObjectForText(path, obj, headerMap, onProgress) {
        const { buffer } = await this._postObjectForBuffer(path, obj, headerMap, onProgress);
        return this.readBufferText(buffer);
    }
    async postObjectForText(path, obj, headerMap, onProgress) {
        return await this._postObjectForText(path, obj, headerMap, onProgress);
    }
    async _getObject(path, headerMap, onProgress) {
        const text = await this._getText(path, headerMap, onProgress);
        return JSON.parse(text);
    }
    async getObject(path, headerMap, onProgress) {
        return await this._getObject(path, headerMap, onProgress);
    }
    async _postObjectForObject(path, obj, headerMap, onProgress) {
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
    async _getCanvas(path, headerMap, onProgress) {
        return await this.__getCanvas(path, headerMap, onProgress);
    }
    async getCanvas(path, headerMap, onProgress) {
        return await this._getCanvas(path, headerMap, onProgress);
    }
    async _getImageData(path, headerMap, onProgress) {
        return await this.__getImageData(path, headerMap, onProgress);
    }
    async getImageData(path, headerMap, onProgress) {
        return await this._getImageData(path, headerMap, onProgress);
    }
    async _getCubes(path, headerMap, onProgress) {
        return await this.__getCubes(path, headerMap, onProgress);
    }
    async getCubes(path, headerMap, onProgress) {
        return await this._getCubes(path, headerMap, onProgress);
    }
    async _getEquiMaps(path, interpolation, maxWidth, headerMap, onProgress) {
        return await this.__getEquiMaps(path, interpolation, maxWidth, headerMap, onProgress);
    }
    async getEquiMaps(path, interpolation, maxWidth, headerMap, onProgress) {
        return await this._getEquiMaps(path, interpolation, maxWidth, headerMap, onProgress);
    }
    async renderImageBitmapFace(readData, faceName, interpolation, maxWidth, onProgress) {
        return await renderImageBitmapFace(readData, faceName, interpolation, maxWidth, onProgress);
    }
}
//# sourceMappingURL=Fetcher.js.map