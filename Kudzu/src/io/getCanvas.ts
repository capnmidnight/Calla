import type { CanvasTypes } from "../html/canvas";
import {
    createUtilityCanvasFromImage,
    createUtilityCanvasFromImageBitmap,
    hasImageBitmap
} from "../html/canvas";
import { using } from "../using";
import { getImage } from "./getImage";
import { getImageBitmap } from "./getImageBitmap";
import type { progressCallback } from "./progressCallback";


export async function getCanvasViaImageBitmap(path: string, onProgress?: progressCallback): Promise<CanvasTypes> {
    return using(await getImageBitmap(path, onProgress), (img: ImageBitmap) => {
        return createUtilityCanvasFromImageBitmap(img);
    });
}

export async function getCanvasViaImage(path: string, onProgress?: progressCallback): Promise<CanvasTypes> {
    const img = await getImage(path, onProgress);
    return createUtilityCanvasFromImage(img);
}

export const getCanvas = hasImageBitmap
    ? getCanvasViaImageBitmap
    : getCanvasViaImage;
