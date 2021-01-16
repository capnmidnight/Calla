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
import { isGoodNumber } from "../typeChecks";
import { using } from "../using";
import { getPartsReturnType } from "./getPartsReturnType";
import { IFetcher } from "./IFetcher";

export class Fetcher implements IFetcher {
    private _getCanvas: (path: string, onProgress?: progressCallback) => Promise<CanvasTypes>;
    private _getImageData: (path: string, onProgress?: progressCallback) => Promise<ImageData>;
    private _getCubes: (path: string, onProgress?: progressCallback) => Promise<MemoryImageTypes[]>;
    private _getEquiMaps: (path: string, interpolation: InterpolationType, maxWidth: number, onProgress?: progressCallback) => Promise<MemoryImageTypes[]>;

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

    async getCanvas(path: string, onProgress?: progressCallback): Promise<CanvasTypes> {
        return await this._getCanvas(path, onProgress);
    }

    async getImageData(path: string, onProgress?: progressCallback): Promise<ImageData> {
        return await this._getImageData(path, onProgress);
    }

    async getCubes(path: string, onProgress?: progressCallback): Promise<MemoryImageTypes[]> {
        return await this._getCubes(path, onProgress);
    }

    async getEquiMaps(path: string, interpolation: InterpolationType, maxWidth: number, onProgress?: progressCallback): Promise<MemoryImageTypes[]> {
        return await this._getEquiMaps(path, interpolation, maxWidth, onProgress);
    }

    private async readRequestResponse(path: string, request: Promise<Response>): Promise<Response> {
        const response = await request;

        if (!response.ok) {
            throw new Error(`[${response.status}] - ${response.statusText}. Path ${path}`);
        }

        return response;
    }

    private async getResponse(path: string): Promise<Response> {
        return await this.readRequestResponse(path, fetch(path));
    }

    private async postObjectForResponse<T>(path: string, obj: T): Promise<Response> {
        return await this.readRequestResponse(path, fetch(path, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(obj)
        }));
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

    async getBuffer(path: string, onProgress?: progressCallback): Promise<getPartsReturnType> {
        const response = await this.getResponse(path);
        return await this.readResponseBuffer(path, response, onProgress);
    }

    async postObjectForBuffer<T>(path: string, obj: T, onProgress?: progressCallback): Promise<getPartsReturnType> {
        const response = await this.postObjectForResponse(path, obj);
        return await this.readResponseBuffer(path, response, onProgress);
    }

    async getBlob(path: string, onProgress?: progressCallback): Promise<Blob> {
        const { buffer, contentType } = await this.getBuffer(path, onProgress);
        return new Blob([buffer], { type: contentType });
    }

    async postObjectForBlob<T>(path: string, obj: T, onProgress?: progressCallback): Promise<Blob> {
        const { buffer, contentType } = await this.postObjectForBuffer(path, obj, onProgress);
        return new Blob([buffer], { type: contentType });
    }

    async getFile(path: string, onProgress?: progressCallback): Promise<string> {
        const blob = await this.getBlob(path, onProgress);
        return URL.createObjectURL(blob);
    }

    async postObjectForFile<T>(path: string, obj: T, onProgress?: progressCallback): Promise<string> {
        const blob = await this.postObjectForBlob(path, obj, onProgress);
        return URL.createObjectURL(blob);
    }

    private async readFileImage(file: string): Promise<HTMLImageElement> {
        const img = new Image();
        img.src = file;
        if (!img.complete) {
            await once(img, "load", "error");
        }
        return img;
    }

    async getImageBitmap(path: string, onProgress?: progressCallback): Promise<ImageBitmap> {
        const blob = await this.getBlob(path, onProgress);
        return await createImageBitmap(blob);
    }

    async getImage(path: string, onProgress?: progressCallback): Promise<HTMLImageElement> {
        const file = await this.getFile(path, onProgress);
        return await this.readFileImage(file);
    }

    async postObjectForImageBitmap<T>(path: string, obj: T, onProgress?: progressCallback): Promise<ImageBitmap> {
        const blob = await this.postObjectForBlob(path, obj, onProgress);
        return await createImageBitmap(blob);
    }

    async postObjectForImage<T>(path: string, obj: T, onProgress?: progressCallback): Promise<HTMLImageElement> {
        const file = await this.postObjectForFile(path, obj, onProgress);
        return await this.readFileImage(file);
    }

    private async getCanvasViaImageBitmap(path: string, onProgress?: progressCallback): Promise<CanvasTypes> {
        return using(await this.getImageBitmap(path, onProgress), (img: ImageBitmap) => {
            return createUtilityCanvasFromImageBitmap(img);
        });
    }

    private async getCanvasViaImage(path: string, onProgress?: progressCallback): Promise<CanvasTypes> {
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

    private async getImageDataViaImageBitmap(path: string, onProgress?: progressCallback): Promise<ImageData> {
        return using(await this.getImageBitmap(path, onProgress), (img: ImageBitmap) => {
            return this.readImageData(img);
        });
    }

    private async getImageDataViaImage(path: string, onProgress?: progressCallback): Promise<ImageData> {
        const img = await this.getImage(path, onProgress);
        return this.readImageData(img);
    }

    async getCubesViaImageBitmaps(path: string, onProgress?: progressCallback): Promise<ImageBitmap[]> {
        return await usingAsync(await this._getImageBitmap(path, headerMap, onProgress), async (img: ImageBitmap) => {
            const canvs = sliceCubeMap(img);
            return await Promise.all(canvs.map((canv) => createImageBitmap(canv)));
        });
    }

    private async getCubesViaImage(path: string, onProgress?: progressCallback): Promise<CanvasTypes[]> {
        const img = await this.getImage(path, onProgress);
        return sliceCubeMap(img);
    }

    async getEquiMapViaImageBitmaps(path: string, interpolation: InterpolationType, maxWidth: number, onProgress?: progressCallback): Promise<ImageBitmap[]> {
        const splits = splitProgress(onProgress, [1, 6]);
        const imgData = await this.getImageDataViaImageBitmap(path, splits.shift());
        return await renderImageBitmapFaces(renderImageBitmapFace, imgData, interpolation, maxWidth, splits.shift());
    }

    private async getEquiMapViaImage(path: string, interpolation: InterpolationType, maxWidth: number, onProgress?: progressCallback): Promise<CanvasTypes[]> {
        const splits = splitProgress(onProgress, [1, 6]);
        const imgData = await this.getImageDataViaImage(path, splits.shift());
        return await renderCanvasFaces(renderCanvasFace, imgData, interpolation, maxWidth, splits.shift());
    }

    private readBufferText(buffer: ArrayBuffer): string {
        const decoder = new TextDecoder("utf-8");
        const text = decoder.decode(buffer);
        return text;
    }

    async getText(path: string, onProgress?: progressCallback): Promise<string> {
        const { buffer } = await this.getBuffer(path, onProgress);
        return this.readBufferText(buffer);
    }

    async postObjectForText<T>(path: string, obj: T, onProgress?: progressCallback): Promise<string> {
        const { buffer } = await this.postObjectForBuffer(path, obj, onProgress);
        return this.readBufferText(buffer);
    }

    async getObject<T>(path: string, onProgress?: progressCallback): Promise<T> {
        const text = await this.getText(path, onProgress);
        return JSON.parse(text) as T;
    }

    async postObjectForObject<T, U>(path: string, obj: T, onProgress?: progressCallback): Promise<U> {
        const text = await this.postObjectForText(path, obj, onProgress);
        return JSON.parse(text) as U;
    }

    async postObject<T>(path: string, obj: T): Promise<void> {
        await this.postObjectForResponse(path, obj);
    }

    private readTextXml(text: string): HTMLElement {
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, "text/xml");
        return xml.documentElement;
    }

    async getXml(path: string, onProgress?: progressCallback): Promise<HTMLElement> {
        const text = await this.getText(path, onProgress);
        return this.readTextXml(text);
    }

    async postObjectForXml<T>(path: string, obj: T, onProgress?: progressCallback): Promise<HTMLElement> {
        const text = await this.postObjectForText(path, obj, onProgress);
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

    async renderImageBitmapFace(readData: ImageData, faceName: CubeMapFace, interpolation: InterpolationType, maxWidth: number, onProgress?: progressCallback): Promise<ImageBitmap> {
        return await renderImageBitmapFace(readData, faceName, interpolation, maxWidth, onProgress);
    }
}