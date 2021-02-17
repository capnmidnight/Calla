import { once } from "../events/once";
import { sliceCubeMap, sliceCubeMapToImageBitmaps } from "../graphics2d/sliceCubeMap";
import {
    CanvasTypes,
    createUtilityCanvasFromImage,
    createUtilityCanvasFromImageBitmap,
    hasImageBitmap,
    MemoryImageTypes
} from "../html/canvas";
import type { progressCallback } from "../tasks/progressCallback";
import { splitProgress } from "../tasks/splitProgress";
import { using, usingAsync } from "../using";
import { equirectangularToCubemap } from "../webgl/equirectangularToCubemap";
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

        this.__getCubes = hasImageBitmap
            ? this._getCubesViaImageBitmaps
            : this._getCubesViaImage;

        this.__getEquiMaps = hasImageBitmap
            ? this._getEquiMapViaImageBitmaps
            : this._getEquiMapViaImage;
    }

    private async readFileImage(file: string): Promise<HTMLImageElement> {
        const img = new Image();
        img.src = file;
        if (!img.complete) {
            await once(img, "load", "error");
        }
        return img;
    }

    protected async _getImageBitmap(path: string, headerMap?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<ImageBitmap> {
        onProgress = this.normalizeOnProgress(headerMap, onProgress);
        headerMap = this.normalizeHeaderMap(headerMap);

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
        onProgress = this.normalizeOnProgress(headerMap, onProgress);
        headerMap = this.normalizeHeaderMap(headerMap);

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
        onProgress = this.normalizeOnProgress(headerMap, onProgress);
        headerMap = this.normalizeHeaderMap(headerMap);

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
        onProgress = this.normalizeOnProgress(headerMap, onProgress);
        headerMap = this.normalizeHeaderMap(headerMap);

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
        onProgress = this.normalizeOnProgress(headerMap, onProgress);
        headerMap = this.normalizeHeaderMap(headerMap);

        return using(await this._getImageBitmap(path, headerMap, onProgress), (img: ImageBitmap) => {
            return createUtilityCanvasFromImageBitmap(img);
        });
    }

    private async _getCanvasViaImage(path: string, headerMap?: progressCallback | Map<string, string>, onProgress?: progressCallback): Promise<CanvasTypes> {
        onProgress = this.normalizeOnProgress(headerMap, onProgress);
        headerMap = this.normalizeHeaderMap(headerMap);

        const img = await this._getImage(path, headerMap, onProgress);
        return createUtilityCanvasFromImage(img);
    }

    async _getCubesViaImageBitmaps(path: string, headerMap?: progressCallback | Map<string, string>, onProgress?: progressCallback): Promise<ImageBitmap[]> {
        onProgress = this.normalizeOnProgress(headerMap, onProgress);
        headerMap = this.normalizeHeaderMap(headerMap);

        return await usingAsync(await this._getImageBitmap(path, headerMap, onProgress), sliceCubeMapToImageBitmaps);
    }

    private async _getCubesViaImage(path: string, headerMap?: progressCallback | Map<string, string>, onProgress?: progressCallback): Promise<CanvasTypes[]> {
        onProgress = this.normalizeOnProgress(headerMap, onProgress);
        headerMap = this.normalizeHeaderMap(headerMap);

        const img = await this._getImage(path, headerMap, onProgress);
        return sliceCubeMap(img);
    }

    async _getEquiMapViaImageBitmaps(path: string, maxWidth: number, headerMap?: progressCallback | Map<string, string>, onProgress?: progressCallback): Promise<ImageBitmap[]> {
        onProgress = this.normalizeOnProgress(headerMap, onProgress);
        headerMap = this.normalizeHeaderMap(headerMap);

        const splits = splitProgress(onProgress, [10, 1]);
        return await usingAsync(await this._getImageBitmap(path, headerMap, splits.shift()), async (img: ImageBitmap) => {
            const canv = await equirectangularToCubemap(img, maxWidth, splits.shift());
            return sliceCubeMapToImageBitmaps(canv);
        });
    }

    private async _getEquiMapViaImage(path: string, maxWidth: number, headerMap?: progressCallback | Map<string, string>, onProgress?: progressCallback): Promise<CanvasTypes[]> {
        onProgress = this.normalizeOnProgress(headerMap, onProgress);
        headerMap = this.normalizeHeaderMap(headerMap);

        const splits = splitProgress(onProgress, [10, 1]);
        const img = await this._getImage(path, headerMap, splits.shift());
        const canv = await equirectangularToCubemap(img, maxWidth, splits.shift());
        return sliceCubeMap(canv);
    }

    private __getCanvas: (path: string, headerMap?: Map<string, string> | progressCallback, onProgress?: progressCallback) => Promise<CanvasTypes>;
    protected async _getCanvas(path: string, headerMap?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<CanvasTypes> {
        onProgress = this.normalizeOnProgress(headerMap, onProgress);
        headerMap = this.normalizeHeaderMap(headerMap);

        return await this.__getCanvas(path, headerMap, onProgress);
    }

    async getCanvas(path: string): Promise<CanvasTypes>;
    async getCanvas(path: string, onProgress?: progressCallback): Promise<CanvasTypes>;
    async getCanvas(path: string, headerMap?: Map<string, string>): Promise<CanvasTypes>;
    async getCanvas(path: string, headerMap?: Map<string, string>, onProgress?: progressCallback): Promise<CanvasTypes>;
    async getCanvas(path: string, headerMap?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<CanvasTypes> {
        return await this._getCanvas(path, headerMap, onProgress);
    }

    private __getCubes: (path: string, headerMap?: Map<string, string> | progressCallback, onProgress?: progressCallback) => Promise<MemoryImageTypes[]>;
    protected async _getCubes(path: string, headerMap?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<MemoryImageTypes[]> {
        onProgress = this.normalizeOnProgress(headerMap, onProgress);
        headerMap = this.normalizeHeaderMap(headerMap);

        return await this.__getCubes(path, headerMap, onProgress);
    }

    async getCubes(path: string): Promise<MemoryImageTypes[]>;
    async getCubes(path: string, onProgress?: progressCallback): Promise<MemoryImageTypes[]>;
    async getCubes(path: string, headerMap?: Map<string, string>): Promise<MemoryImageTypes[]>;
    async getCubes(path: string, headerMap?: Map<string, string>, onProgress?: progressCallback): Promise<MemoryImageTypes[]>;
    async getCubes(path: string, headerMap?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<MemoryImageTypes[]> {
        return await this._getCubes(path, headerMap, onProgress);
    }

    private __getEquiMaps: (path: string, maxWidth: number, headerMap?: Map<string, string> | progressCallback, onProgress?: progressCallback) => Promise<MemoryImageTypes[]>;
    protected async _getEquiMaps(path: string, maxWidth: number, headerMap?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<MemoryImageTypes[]> {
        onProgress = this.normalizeOnProgress(headerMap, onProgress);
        headerMap = this.normalizeHeaderMap(headerMap);

        return await this.__getEquiMaps(path, maxWidth, headerMap, onProgress);
    }

    async getEquiMaps(path: string, maxWidth: number): Promise<MemoryImageTypes[]>;
    async getEquiMaps(path: string, maxWidth: number, onProgress?: progressCallback): Promise<MemoryImageTypes[]>;
    async getEquiMaps(path: string, maxWidth: number, headerMap?: Map<string, string>): Promise<MemoryImageTypes[]>;
    async getEquiMaps(path: string, maxWidth: number, headerMap?: Map<string, string>, onProgress?: progressCallback): Promise<MemoryImageTypes[]>;
    async getEquiMaps(path: string, maxWidth: number, headerMap?: Map<string, string> | progressCallback, onProgress?: progressCallback): Promise<MemoryImageTypes[]> {
        return await this._getEquiMaps(path, maxWidth, headerMap, onProgress);
    }
}