import { once } from "../events/once";
import { waitFor } from "../events/waitFor";
import { renderCanvasFace, renderCanvasFaces, renderImageBitmapFace, renderImageBitmapFaces } from "../graphics2d/renderFace";
import { sliceCubeMap } from "../graphics2d/sliceCubeMap";
import { createUtilityCanvas, createUtilityCanvasFromImage, createUtilityCanvasFromImageBitmap, hasImageBitmap } from "../html/canvas";
import { createScript } from "../html/script";
import { splitProgress } from "../tasks/splitProgress";
import { isGoodNumber } from "../typeChecks";
import { using } from "../using";
export class Fetcher {
    constructor() {
        this._getCanvas = hasImageBitmap
            ? this.getCanvasViaImageBitmap
            : this.getCanvasViaImage;
        this._getImageData = hasImageBitmap
            ? this.getImageDataViaImageBitmap
            : this.getImageDataViaImage;
        this._getCubes = hasImageBitmap
            ? this.getCubesViaImageBitmaps
            : this.getCubesViaImage;
        this._getEquiMaps = hasImageBitmap
            ? this.getEquiMapViaImageBitmaps
            : this.getEquiMapViaImage;
    }
    async getCanvas(path, onProgress) {
        return await this._getCanvas(path, onProgress);
    }
    async getImageData(path, onProgress) {
        return await this._getImageData(path, onProgress);
    }
    async getCubes(path, onProgress) {
        return await this._getCubes(path, onProgress);
    }
    async getEquiMaps(path, interpolation, maxWidth, onProgress) {
        return await this._getEquiMaps(path, interpolation, maxWidth, onProgress);
    }
    async readRequestResponse(path, request) {
        const response = await request;
        if (!response.ok) {
            throw new Error(`[${response.status}] - ${response.statusText}. Path ${path}`);
        }
        return response;
    }
    async getResponse(path) {
        return await this.readRequestResponse(path, fetch(path));
    }
    async postObjectForResponse(path, obj) {
        return await this.readRequestResponse(path, fetch(path, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(obj)
        }));
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
    async getBuffer(path, onProgress) {
        const response = await this.getResponse(path);
        return await this.readResponseBuffer(path, response, onProgress);
    }
    async postObjectForBuffer(path, obj, onProgress) {
        const response = await this.postObjectForResponse(path, obj);
        return await this.readResponseBuffer(path, response, onProgress);
    }
    async getBlob(path, onProgress) {
        const { buffer, contentType } = await this.getBuffer(path, onProgress);
        return new Blob([buffer], { type: contentType });
    }
    async postObjectForBlob(path, obj, onProgress) {
        const { buffer, contentType } = await this.postObjectForBuffer(path, obj, onProgress);
        return new Blob([buffer], { type: contentType });
    }
    async getFile(path, onProgress) {
        const blob = await this.getBlob(path, onProgress);
        return URL.createObjectURL(blob);
    }
    async postObjectForFile(path, obj, onProgress) {
        const blob = await this.postObjectForBlob(path, obj, onProgress);
        return URL.createObjectURL(blob);
    }
    async readFileImage(file) {
        const img = new Image();
        img.src = file;
        if (!img.complete) {
            await once(img, "load", "error");
        }
        return img;
    }
    async getImageBitmap(path, onProgress) {
        const blob = await this.getBlob(path, onProgress);
        return await createImageBitmap(blob);
    }
    async getImage(path, onProgress) {
        const file = await this.getFile(path, onProgress);
        return await this.readFileImage(file);
    }
    async postObjectForImageBitmap(path, obj, onProgress) {
        const blob = await this.postObjectForBlob(path, obj, onProgress);
        return await createImageBitmap(blob);
    }
    async postObjectForImage(path, obj, onProgress) {
        const file = await this.postObjectForFile(path, obj, onProgress);
        return await this.readFileImage(file);
    }
    async getCanvasViaImageBitmap(path, onProgress) {
        return using(await this.getImageBitmap(path, onProgress), (img) => {
            return createUtilityCanvasFromImageBitmap(img);
        });
    }
    async getCanvasViaImage(path, onProgress) {
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
    async getImageDataViaImageBitmap(path, onProgress) {
        return using(await this.getImageBitmap(path, onProgress), (img) => {
            return this.readImageData(img);
        });
    }
    async getImageDataViaImage(path, onProgress) {
        const img = await this.getImage(path, onProgress);
        return this.readImageData(img);
    }
    async getCubesViaImageBitmaps(path, onProgress) {
        const img = await this.getImageBitmap(path, onProgress);
        const canvs = sliceCubeMap(img);
        return await Promise.all(canvs.map((canv) => createImageBitmap(canv)));
    }
    async getCubesViaImage(path, onProgress) {
        const img = await this.getImage(path, onProgress);
        return sliceCubeMap(img);
    }
    async getEquiMapViaImageBitmaps(path, interpolation, maxWidth, onProgress) {
        const splits = splitProgress(onProgress, [1, 6]);
        const imgData = await this.getImageDataViaImageBitmap(path, splits.shift());
        return await renderImageBitmapFaces(renderImageBitmapFace, imgData, interpolation, maxWidth, splits.shift());
    }
    async getEquiMapViaImage(path, interpolation, maxWidth, onProgress) {
        const splits = splitProgress(onProgress, [1, 6]);
        const imgData = await this.getImageDataViaImage(path, splits.shift());
        return await renderCanvasFaces(renderCanvasFace, imgData, interpolation, maxWidth, splits.shift());
    }
    readBufferText(buffer) {
        const decoder = new TextDecoder("utf-8");
        const text = decoder.decode(buffer);
        return text;
    }
    async getText(path, onProgress) {
        const { buffer } = await this.getBuffer(path, onProgress);
        return this.readBufferText(buffer);
    }
    async postObjectForText(path, obj, onProgress) {
        const { buffer } = await this.postObjectForBuffer(path, obj, onProgress);
        return this.readBufferText(buffer);
    }
    async getObject(path, onProgress) {
        const text = await this.getText(path, onProgress);
        return JSON.parse(text);
    }
    async postObjectForObject(path, obj, onProgress) {
        const text = await this.postObjectForText(path, obj, onProgress);
        return JSON.parse(text);
    }
    async postObject(path, obj) {
        await this.postObjectForResponse(path, obj);
    }
    readTextXml(text) {
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, "text/xml");
        return xml.documentElement;
    }
    async getXml(path, onProgress) {
        const text = await this.getText(path, onProgress);
        return this.readTextXml(text);
    }
    async postObjectForXml(path, obj, onProgress) {
        const text = await this.postObjectForText(path, obj, onProgress);
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
    async renderImageBitmapFace(readData, faceName, interpolation, maxWidth, onProgress) {
        return await renderImageBitmapFace(readData, faceName, interpolation, maxWidth, onProgress);
    }
}
//# sourceMappingURL=Fetcher.js.map