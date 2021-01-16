import { once } from "../events/once";
import { waitFor } from "../events/waitFor";
import { CubeMapFace } from "../graphics2d/CubeMapFace";
import type { InterpolationType } from "../graphics2d/InterpolationType";
import {
    renderCanvasFace,
    renderCanvasFaces,
    renderImageBitmapFace,
    renderImageBitmapFaces
} from "../graphics2d/renderFace";
import { sliceCubeMap } from "../graphics2d/sliceCubeMap";
import {
    CanvasTypes,
    createUtilityCanvas,
    createUtilityCanvasFromImage,
    createUtilityCanvasFromImageBitmap,
    hasImageBitmap,
    MemoryImageTypes
} from "../html/canvas";
import { createScript } from "../html/script";
import type { progressCallback } from "../tasks/progressCallback";
import { splitProgress } from "../tasks/splitProgress";
import { isGoodNumber, isNullOrUndefined } from "../typeChecks";
import { using, usingAsync } from "../using";
import { getPartsReturnType } from "./getPartsReturnType";
import { IFetcher } from "./IFetcher";

export class Fetcher implements IFetcher {
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

    private async getResponse(path: string, headerMap?: Map<string, string> | progressCallback): Promise<Response> {
        const headers = {};

        if (headerMap instanceof Map) {
            for (const pair of headerMap.entries()) {
                (headers as any)[pair[0]] = pair[1];
            }
        }
        return await this.readRequestResponse(path, fetch(path, {
            headers
        }));
    }

    private async postObjectForResponse<T>(path: string, obj: T, headerMap?: Map<string, string> | progressCallback): Promise<Response> {
        const headers = {
            "Content-Type": obj instanceof FormData
                ? "multipart/form-data"
                : "application/json"
        };

        if (headerMap instanceof Map) {
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
            throw new Error(`[${response.status}] - ${response.statusText}. Path ${path}`);
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

    private async readFileImage(file: string): Promise<HTMLImageElement> {
        const img = new Image();
        img.src = file;
        if (!img.complete) {
            await once(img, "load", "error");
        }
        return img;
    }

    protected async _getBuffer(path: string, headerMap?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<getPartsReturnType> {
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
        if (!isNullOrUndefined(headerMap)
            && !(headerMap instanceof Map)) {
            onProgress = headerMap;
            headerMap = undefined;
        }

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
        if (!isNullOrUndefined(headerMap)
            && !(headerMap instanceof Map)) {
            onProgress = headerMap;
            headerMap = undefined;
        }

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
        if (!isNullOrUndefined(headerMap)
            && !(headerMap instanceof Map)) {
            onProgress = headerMap;
            headerMap = undefined;
        }

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

    protected async _getImageBitmap(path: string, headerMap?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<ImageBitmap> {
        const blob = await this._getBlob(path, headerMap, onProgress);
        return await createImageBitmap(blob);
    }

    async getImageBitmap(path: string): Promise<ImageBitmap>;
    async getImageBitmap(path: string, onProgress?: progressCallback): Promise<ImageBitmap>;
    async getImageBitmap(path: string, headerMap?: Map<string, string>): Promise<ImageBitmap>;
    async getImageBitmap(path: string, headerMap?: Map<string, string>, onProgress?: progressCallback): Promise<ImageBitmap>;
    async getImageBitmap(path: string, headerMap?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<ImageBitmap> {
        return await this._getImageBitmap(path, headerMap, onProgress);
    }

    protected async _getImage(path: string, headerMap?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<HTMLImageElement> {
        const file = await this._getFile(path, headerMap, onProgress);
        return await this.readFileImage(file);
    }

    async getImage(path: string): Promise<HTMLImageElement>;
    async getImage(path: string, onProgress?: progressCallback): Promise<HTMLImageElement>;
    async getImage(path: string, headerMap?: Map<string, string>): Promise<HTMLImageElement>;
    async getImage(path: string, headerMap?: Map<string, string>, onProgress?: progressCallback): Promise<HTMLImageElement>;
    async getImage(path: string, headerMap?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<HTMLImageElement> {
        return await this._getImage(path, headerMap, onProgress);
    }

    protected async _postObjectForImageBitmap<T>(path: string, obj: T, headerMap?: progressCallback | Map<string, string>, onProgress?: progressCallback): Promise<ImageBitmap> {
        const blob = await this._postObjectForBlob(path, obj, headerMap, onProgress);
        return await createImageBitmap(blob);
    }

    async postObjectForImageBitmap<T>(path: string, obj: T): Promise<ImageBitmap>;
    async postObjectForImageBitmap<T>(path: string, obj: T, onProgress?: progressCallback): Promise<ImageBitmap>;
    async postObjectForImageBitmap<T>(path: string, obj: T, headerMap?: Map<string, string>): Promise<ImageBitmap>;
    async postObjectForImageBitmap<T>(path: string, obj: T, headerMap?: Map<string, string>, onProgress?: progressCallback): Promise<ImageBitmap>;
    async postObjectForImageBitmap<T>(path: string, obj: T, headerMap?: progressCallback | Map<string, string>, onProgress?: progressCallback): Promise<ImageBitmap> {
        return await this._postObjectForImageBitmap(path, obj, headerMap, onProgress);
    }

    protected async _postObjectForImage<T>(path: string, obj: T, headerMap?: progressCallback | Map<string, string>, onProgress?: progressCallback): Promise<HTMLImageElement> {
        const file = await this._postObjectForFile(path, obj, headerMap, onProgress);
        return await this.readFileImage(file);
    }

    async postObjectForImage<T>(path: string, obj: T): Promise<HTMLImageElement>;
    async postObjectForImage<T>(path: string, obj: T, onProgress?: progressCallback): Promise<HTMLImageElement>;
    async postObjectForImage<T>(path: string, obj: T, headerMap?: Map<string, string>): Promise<HTMLImageElement>;
    async postObjectForImage<T>(path: string, obj: T, headerMap?: Map<string, string>, onProgress?: progressCallback): Promise<HTMLImageElement>;
    async postObjectForImage<T>(path: string, obj: T, headerMap?: progressCallback | Map<string, string>, onProgress?: progressCallback): Promise<HTMLImageElement> {
        return await this._postObjectForImage(path, obj, headerMap, onProgress);
    }

    private async _getCanvasViaImageBitmap(path: string, headerMap?: progressCallback | Map<string, string>, onProgress?: progressCallback): Promise<CanvasTypes> {
        return using(await this._getImageBitmap(path, headerMap, onProgress), (img: ImageBitmap) => {
            return createUtilityCanvasFromImageBitmap(img);
        });
    }

    private async _getCanvasViaImage(path: string, onProgress?: progressCallback): Promise<CanvasTypes> {
        const img = await this.getImage(path, onProgress);
        return createUtilityCanvasFromImage(img);
    }

    private readImageData(img: HTMLImageElement | ImageBitmap): ImageData {
        const canv = createUtilityCanvas(img.width, img.height);
        const g = canv.getContext("2d");
        if (!g) {
            throw new Error("Couldn't create a 2D canvas context");
        }
        g.drawImage(img, 0, 0);
        return g.getImageData(0, 0, canv.width, canv.height);
    }

    private async _getImageDataViaImageBitmap(path: string, headerMap?: progressCallback | Map<string, string>, onProgress?: progressCallback): Promise<ImageData> {
        return using(await this._getImageBitmap(path, headerMap, onProgress), (img: ImageBitmap) => {
            return this.readImageData(img);
        });
    }

    private async _getImageDataViaImage(path: string, headerMap?: progressCallback | Map<string, string>, onProgress?: progressCallback): Promise<ImageData> {
        const img = await this._getImage(path, headerMap, onProgress);
        return this.readImageData(img);
    }

    async _getCubesViaImageBitmaps(path: string, headerMap?: progressCallback | Map<string, string>, onProgress?: progressCallback): Promise<ImageBitmap[]> {
        return await usingAsync(await this._getImageBitmap(path, headerMap, onProgress), async (img: ImageBitmap) => {
            const canvs = sliceCubeMap(img);
            return await Promise.all(canvs.map((canv) => createImageBitmap(canv)));
        });
    }

    private async _getCubesViaImage(path: string, headerMap?: progressCallback | Map<string, string>, onProgress?: progressCallback): Promise<CanvasTypes[]> {
        const img = await this._getImage(path, headerMap, onProgress);
        return sliceCubeMap(img);
    }

    private async _getEquiMapViaImageBitmaps(path: string, interpolation: InterpolationType, maxWidth: number, headerMap?: progressCallback | Map<string, string>, onProgress?: progressCallback): Promise<ImageBitmap[]> {
        const splits = splitProgress(onProgress, [1, 6]);
        const imgData = await this._getImageDataViaImageBitmap(path, headerMap, splits.shift());
        return await renderImageBitmapFaces(renderImageBitmapFace, imgData, interpolation, maxWidth, splits.shift());
    }

    private async _getEquiMapViaImage(path: string, interpolation: InterpolationType, maxWidth: number, headerMap?: progressCallback | Map<string, string>, onProgress?: progressCallback): Promise<CanvasTypes[]> {
        const splits = splitProgress(onProgress, [1, 6]);
        const imgData = await this._getImageDataViaImage(path, headerMap, splits.shift());
        return await renderCanvasFaces(renderCanvasFace, imgData, interpolation, maxWidth, splits.shift());
    }

    private readBufferText(buffer: ArrayBuffer): string {
        const decoder = new TextDecoder("utf-8");
        const text = decoder.decode(buffer);
        return text;
    }

    protected async _getText(path: string, headerMap?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<string> {
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

    protected async _getObject<T>(path: string, headerMap?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<T> {
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

    private __getCanvas: (path: string, headerMap?: Map<string, string> | progressCallback, onProgress?: progressCallback) => Promise<CanvasTypes>;
    protected async _getCanvas(path: string, headerMap?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<CanvasTypes>{
        return await this.__getCanvas(path, headerMap, onProgress);
    }

    async getCanvas(path: string): Promise<CanvasTypes>;
    async getCanvas(path: string, onProgress?: progressCallback): Promise<CanvasTypes>;
    async getCanvas(path: string, headerMap?: Map<string, string>): Promise<CanvasTypes>;
    async getCanvas(path: string, headerMap?: Map<string, string>, onProgress?: progressCallback): Promise<CanvasTypes>;
    async getCanvas(path: string, headerMap?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<CanvasTypes> {
        return await this._getCanvas(path, headerMap, onProgress);
    }

    private __getImageData: (path: string, headerMap?: Map<string, string> | progressCallback, onProgress?: progressCallback) => Promise<ImageData>;
    protected async _getImageData(path: string, headerMap?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<ImageData> {
        return await this.__getImageData(path, headerMap, onProgress);
    }

    async getImageData(path: string): Promise<ImageData>;
    async getImageData(path: string, onProgress?: progressCallback): Promise<ImageData>;
    async getImageData(path: string, headerMap?: Map<string, string>): Promise<ImageData>;
    async getImageData(path: string, headerMap?: Map<string, string>, onProgress?: progressCallback): Promise<ImageData>;
    async getImageData(path: string, headerMap?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<ImageData> {
        return await this._getImageData(path, headerMap, onProgress);
    }

    private __getCubes: (path: string, headerMap?: Map<string, string> | progressCallback, onProgress?: progressCallback) => Promise<MemoryImageTypes[]>;
    protected async _getCubes(path: string, headerMap?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<MemoryImageTypes[]> {
        return await this.__getCubes(path, headerMap, onProgress);
    }

    async getCubes(path: string): Promise<MemoryImageTypes[]>;
    async getCubes(path: string, onProgress?: progressCallback): Promise<MemoryImageTypes[]>;
    async getCubes(path: string, headerMap?: Map<string, string>): Promise<MemoryImageTypes[]>;
    async getCubes(path: string, headerMap?: Map<string, string>, onProgress?: progressCallback): Promise<MemoryImageTypes[]>;
    async getCubes(path: string, headerMap?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<MemoryImageTypes[]> {
        return await this._getCubes(path, headerMap, onProgress);
    }

    private __getEquiMaps: (path: string, interpolation: InterpolationType, maxWidth: number, headerMap?: Map<string, string> | progressCallback, onProgress?: progressCallback) => Promise<MemoryImageTypes[]>;
    protected async _getEquiMaps(path: string, interpolation: InterpolationType, maxWidth: number, headerMap?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<MemoryImageTypes[]> {
        return await this.__getEquiMaps(path, interpolation, maxWidth, headerMap, onProgress);
    }

    async getEquiMaps(path: string, interpolation: InterpolationType, maxWidth: number): Promise<MemoryImageTypes[]>;
    async getEquiMaps(path: string, interpolation: InterpolationType, maxWidth: number, onProgress?: progressCallback): Promise<MemoryImageTypes[]>;
    async getEquiMaps(path: string, interpolation: InterpolationType, maxWidth: number, headerMap?: Map<string, string>): Promise<MemoryImageTypes[]>;
    async getEquiMaps(path: string, interpolation: InterpolationType, maxWidth: number, headerMap?: Map<string, string>, onProgress?: progressCallback): Promise<MemoryImageTypes[]>;
    async getEquiMaps(path: string, interpolation: InterpolationType, maxWidth: number, headerMap?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<MemoryImageTypes[]> {
        return await this._getEquiMaps(path, interpolation, maxWidth, headerMap, onProgress);
    }

    async renderImageBitmapFace(readData: ImageData, faceName: CubeMapFace, interpolation: InterpolationType, maxWidth: number, onProgress?: progressCallback): Promise<ImageBitmap> {
        return await renderImageBitmapFace(readData, faceName, interpolation, maxWidth, onProgress);
    }
}