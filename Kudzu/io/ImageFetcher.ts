import { once } from "../events/once";
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
import type { progressCallback } from "../tasks/progressCallback";
import { splitProgress } from "../tasks/splitProgress";
import { using, usingAsync } from "../using";
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

    private async readFileImage(file: string): Promise<HTMLImageElement> {
        const img = new Image();
        img.src = file;
        if (!img.complete) {
            await once(img, "load", "error");
        }
        return img;
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