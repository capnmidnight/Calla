import { once } from "../events/once";
import {
    CanvasTypes,
    createUtilityCanvasFromImage,
    createUtilityCanvasFromImageBitmap,
    hasImageBitmap
} from "../html/canvas";
import type { progressCallback } from "../tasks/progressCallback";
import { using } from "../using";
import { Fetcher } from "./Fetcher";
import { IImageFetcher } from "./IImageFetcher";

export class ImageFetcher
    extends Fetcher
    implements IImageFetcher {
    constructor() {
        super();

        this.__getCanvas = hasImageBitmap
            ? this._getCanvasViaImageBitmap
            : this._getCanvasViaImage;
    }

    private async readFileImage(file: string): Promise<HTMLImageElement> {
        const img = new Image();
        img.src = file;
        if (!img.complete) {
            await once(img, "load", "error");
        }
        return img;
    }

    protected async _getImageBitmap(path: string, headers?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<ImageBitmap> {
        onProgress = this.normalizeOnProgress(headers, onProgress);
        headers = this.normalizeHeaders(headers);

        const blob = await this._getBlob(path, headers, onProgress);
        return await createImageBitmap(blob);
    }

    async getImageBitmap(path: string): Promise<ImageBitmap>;
    async getImageBitmap(path: string, onProgress?: progressCallback): Promise<ImageBitmap>;
    async getImageBitmap(path: string, headers?: Map<string, string>): Promise<ImageBitmap>;
    async getImageBitmap(path: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<ImageBitmap>;
    async getImageBitmap(path: string, headers?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<ImageBitmap> {
        return await this._getImageBitmap(path, headers, onProgress);
    }

    protected async _getImage(path: string, headers?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<HTMLImageElement> {
        onProgress = this.normalizeOnProgress(headers, onProgress);
        headers = this.normalizeHeaders(headers);

        const file = await this._getFile(path, headers, onProgress);
        return await this.readFileImage(file);
    }

    async getImage(path: string): Promise<HTMLImageElement>;
    async getImage(path: string, onProgress?: progressCallback): Promise<HTMLImageElement>;
    async getImage(path: string, headers?: Map<string, string>): Promise<HTMLImageElement>;
    async getImage(path: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<HTMLImageElement>;
    async getImage(path: string, headers?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<HTMLImageElement> {
        return await this._getImage(path, headers, onProgress);
    }

    protected async _postObjectForImageBitmap<T>(path: string, obj: T, contentType: string, headers?: progressCallback | Map<string, string>, onProgress?: progressCallback): Promise<ImageBitmap> {
        onProgress = this.normalizeOnProgress(headers, onProgress);
        headers = this.normalizeHeaders(headers);

        const blob = await this._postObjectForBlob(path, obj, contentType, headers, onProgress);
        return await createImageBitmap(blob);
    }

    async postObjectForImageBitmap<T>(path: string, obj: T, contentType: string): Promise<ImageBitmap>;
    async postObjectForImageBitmap<T>(path: string, obj: T, contentType: string, onProgress?: progressCallback): Promise<ImageBitmap>;
    async postObjectForImageBitmap<T>(path: string, obj: T, contentType: string, headers?: Map<string, string>): Promise<ImageBitmap>;
    async postObjectForImageBitmap<T>(path: string, obj: T, contentType: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<ImageBitmap>;
    async postObjectForImageBitmap<T>(path: string, obj: T, contentType: string, headers?: progressCallback | Map<string, string>, onProgress?: progressCallback): Promise<ImageBitmap> {
        return await this._postObjectForImageBitmap(path, obj, contentType, headers, onProgress);
    }

    protected async _postObjectForImage<T>(path: string, obj: T, contentType: string, headers?: progressCallback | Map<string, string>, onProgress?: progressCallback): Promise<HTMLImageElement> {
        onProgress = this.normalizeOnProgress(headers, onProgress);
        headers = this.normalizeHeaders(headers);

        const file = await this._postObjectForFile(path, obj, contentType, headers, onProgress);
        return await this.readFileImage(file);
    }

    async postObjectForImage<T>(path: string, obj: T, contentType: string): Promise<HTMLImageElement>;
    async postObjectForImage<T>(path: string, obj: T, contentType: string, onProgress?: progressCallback): Promise<HTMLImageElement>;
    async postObjectForImage<T>(path: string, obj: T, contentType: string, headers?: Map<string, string>): Promise<HTMLImageElement>;
    async postObjectForImage<T>(path: string, obj: T, contentType: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<HTMLImageElement>;
    async postObjectForImage<T>(path: string, obj: T, contentType: string, headers?: progressCallback | Map<string, string>, onProgress?: progressCallback): Promise<HTMLImageElement> {
        return await this._postObjectForImage(path, obj, contentType, headers, onProgress);
    }

    private async _getCanvasViaImageBitmap(path: string, headers?: progressCallback | Map<string, string>, onProgress?: progressCallback): Promise<CanvasTypes> {
        onProgress = this.normalizeOnProgress(headers, onProgress);
        headers = this.normalizeHeaders(headers);

        return using(await this._getImageBitmap(path, headers, onProgress), (img: ImageBitmap) => {
            return createUtilityCanvasFromImageBitmap(img);
        });
    }

    private async _getCanvasViaImage(path: string, headers?: progressCallback | Map<string, string>, onProgress?: progressCallback): Promise<CanvasTypes> {
        onProgress = this.normalizeOnProgress(headers, onProgress);
        headers = this.normalizeHeaders(headers);

        const img = await this._getImage(path, headers, onProgress);
        return createUtilityCanvasFromImage(img);
    }

    private __getCanvas: (path: string, headers?: Map<string, string> | progressCallback, onProgress?: progressCallback) => Promise<CanvasTypes>;
    protected async _getCanvas(path: string, headers?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<CanvasTypes> {
        onProgress = this.normalizeOnProgress(headers, onProgress);
        headers = this.normalizeHeaders(headers);

        return await this.__getCanvas(path, headers, onProgress);
    }

    async getCanvas(path: string): Promise<CanvasTypes>;
    async getCanvas(path: string, onProgress?: progressCallback): Promise<CanvasTypes>;
    async getCanvas(path: string, headers?: Map<string, string>): Promise<CanvasTypes>;
    async getCanvas(path: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<CanvasTypes>;
    async getCanvas(path: string, headers?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<CanvasTypes> {
        return await this._getCanvas(path, headers, onProgress);
    }
}