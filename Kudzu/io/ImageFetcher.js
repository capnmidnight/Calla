import { once } from "../events/once";
import { renderCanvasFace, renderCanvasFaces, renderImageBitmapFace, renderImageBitmapFaces } from "../graphics2d/renderFace";
import { sliceCubeMap } from "../graphics2d/sliceCubeMap";
import { createUtilityCanvas, createUtilityCanvasFromImage, createUtilityCanvasFromImageBitmap, hasImageBitmap } from "../html/canvas";
import { splitProgress } from "../tasks/splitProgress";
import { using, usingAsync } from "../using";
import { Fetcher } from "./Fetcher";
export class ImageFetcher extends Fetcher {
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
    async readFileImage(file) {
        const img = new Image();
        img.src = file;
        if (!img.complete) {
            await once(img, "load", "error");
        }
        return img;
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
//# sourceMappingURL=ImageFetcher.js.map