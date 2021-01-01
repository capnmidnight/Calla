import type { CanvasTypes } from "../html/canvas";
import { hasImageBitmap } from "../html/canvas";
import { getImageData } from "./getImageData";
import type { InterpolationType } from "./InterpolationType";
import type { progressCallback } from "./progressCallback";
import {
    renderCanvasFace,
    renderCanvasFaces,
    renderImageBitmapFace,
    renderImageBitmapFaces
} from "./renderFace";
import { splitProgress } from "./splitProgress";

export async function getEquiMapCanvases(path: string, interpolation: InterpolationType, maxWidth: number, onProgress?: progressCallback): Promise<CanvasTypes[]> {
    const splits = splitProgress(onProgress, [1, 6]);
    const imgData = await getImageData(path, splits.shift());
    console.log(imgData);
    return await renderCanvasFaces(renderCanvasFace, imgData, interpolation, maxWidth, splits.shift());
}

export async function getEquiMapImageBitmaps(path: string, interpolation: InterpolationType, maxWidth: number, onProgress?: progressCallback): Promise<ImageBitmap[]> {
    const splits = splitProgress(onProgress, [1, 6]);
    const imgData = await getImageData(path, splits.shift());
    return await renderImageBitmapFaces(renderImageBitmapFace, imgData, interpolation, maxWidth, splits.shift());
}

export const getEquipMaps = hasImageBitmap
    ? getEquiMapImageBitmaps
    : getEquiMapCanvases;