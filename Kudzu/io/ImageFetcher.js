import { once } from "../events/once";
import { sliceCubeMap, sliceCubeMapToImageBitmaps } from "../graphics2d/sliceCubeMap";
import { createUtilityCanvasFromImage, createUtilityCanvasFromImageBitmap, hasImageBitmap } from "../html/canvas";
import { splitProgress } from "../tasks/splitProgress";
import { using, usingAsync } from "../using";
import { equirectangularToCubemap } from "../webgl/equirectangularToCubemap";
import { Fetcher } from "./Fetcher";
export class ImageFetcher extends Fetcher {
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
    async readFileImage(file) {
        const img = new Image();
        img.src = file;
        if (!img.complete) {
            await once(img, "load", "error");
        }
        return img;
    }
    async _getImageBitmap(path, headerMap, onProgress) {
        onProgress = this.normalizeOnProgress(headerMap, onProgress);
        headerMap = this.normalizeHeaderMap(headerMap);
        const blob = await this._getBlob(path, headerMap, onProgress);
        return await createImageBitmap(blob);
    }
    async getImageBitmap(path, headerMap, onProgress) {
        return await this._getImageBitmap(path, headerMap, onProgress);
    }
    async _getImage(path, headerMap, onProgress) {
        onProgress = this.normalizeOnProgress(headerMap, onProgress);
        headerMap = this.normalizeHeaderMap(headerMap);
        const file = await this._getFile(path, headerMap, onProgress);
        return await this.readFileImage(file);
    }
    async getImage(path, headerMap, onProgress) {
        return await this._getImage(path, headerMap, onProgress);
    }
    async _postObjectForImageBitmap(path, obj, headerMap, onProgress) {
        onProgress = this.normalizeOnProgress(headerMap, onProgress);
        headerMap = this.normalizeHeaderMap(headerMap);
        const blob = await this._postObjectForBlob(path, obj, headerMap, onProgress);
        return await createImageBitmap(blob);
    }
    async postObjectForImageBitmap(path, obj, headerMap, onProgress) {
        return await this._postObjectForImageBitmap(path, obj, headerMap, onProgress);
    }
    async _postObjectForImage(path, obj, headerMap, onProgress) {
        onProgress = this.normalizeOnProgress(headerMap, onProgress);
        headerMap = this.normalizeHeaderMap(headerMap);
        const file = await this._postObjectForFile(path, obj, headerMap, onProgress);
        return await this.readFileImage(file);
    }
    async postObjectForImage(path, obj, headerMap, onProgress) {
        return await this._postObjectForImage(path, obj, headerMap, onProgress);
    }
    async _getCanvasViaImageBitmap(path, headerMap, onProgress) {
        onProgress = this.normalizeOnProgress(headerMap, onProgress);
        headerMap = this.normalizeHeaderMap(headerMap);
        return using(await this._getImageBitmap(path, headerMap, onProgress), (img) => {
            return createUtilityCanvasFromImageBitmap(img);
        });
    }
    async _getCanvasViaImage(path, headerMap, onProgress) {
        onProgress = this.normalizeOnProgress(headerMap, onProgress);
        headerMap = this.normalizeHeaderMap(headerMap);
        const img = await this._getImage(path, headerMap, onProgress);
        return createUtilityCanvasFromImage(img);
    }
    async _getCubesViaImageBitmaps(path, headerMap, onProgress) {
        onProgress = this.normalizeOnProgress(headerMap, onProgress);
        headerMap = this.normalizeHeaderMap(headerMap);
        return await usingAsync(await this._getImageBitmap(path, headerMap, onProgress), sliceCubeMapToImageBitmaps);
    }
    async _getCubesViaImage(path, headerMap, onProgress) {
        onProgress = this.normalizeOnProgress(headerMap, onProgress);
        headerMap = this.normalizeHeaderMap(headerMap);
        const img = await this._getImage(path, headerMap, onProgress);
        return sliceCubeMap(img);
    }
    async _getEquiMapViaImageBitmaps(path, maxWidth, headerMap, onProgress) {
        onProgress = this.normalizeOnProgress(headerMap, onProgress);
        headerMap = this.normalizeHeaderMap(headerMap);
        const splits = splitProgress(onProgress, [10, 1]);
        return await usingAsync(await this._getImageBitmap(path, headerMap, splits.shift()), async (img) => {
            const canv = await equirectangularToCubemap(img, maxWidth, splits.shift());
            return sliceCubeMapToImageBitmaps(canv);
        });
    }
    async _getEquiMapViaImage(path, maxWidth, headerMap, onProgress) {
        onProgress = this.normalizeOnProgress(headerMap, onProgress);
        headerMap = this.normalizeHeaderMap(headerMap);
        const splits = splitProgress(onProgress, [10, 1]);
        const img = await this._getImage(path, headerMap, splits.shift());
        const canv = await equirectangularToCubemap(img, maxWidth, splits.shift());
        return sliceCubeMap(canv);
    }
    async _getCanvas(path, headerMap, onProgress) {
        onProgress = this.normalizeOnProgress(headerMap, onProgress);
        headerMap = this.normalizeHeaderMap(headerMap);
        return await this.__getCanvas(path, headerMap, onProgress);
    }
    async getCanvas(path, headerMap, onProgress) {
        return await this._getCanvas(path, headerMap, onProgress);
    }
    async _getCubes(path, headerMap, onProgress) {
        onProgress = this.normalizeOnProgress(headerMap, onProgress);
        headerMap = this.normalizeHeaderMap(headerMap);
        return await this.__getCubes(path, headerMap, onProgress);
    }
    async getCubes(path, headerMap, onProgress) {
        return await this._getCubes(path, headerMap, onProgress);
    }
    async _getEquiMaps(path, maxWidth, headerMap, onProgress) {
        onProgress = this.normalizeOnProgress(headerMap, onProgress);
        headerMap = this.normalizeHeaderMap(headerMap);
        return await this.__getEquiMaps(path, maxWidth, headerMap, onProgress);
    }
    async getEquiMaps(path, maxWidth, headerMap, onProgress) {
        return await this._getEquiMaps(path, maxWidth, headerMap, onProgress);
    }
}
//# sourceMappingURL=ImageFetcher.js.map