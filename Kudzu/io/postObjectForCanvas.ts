import { progressCallback } from "./progressCallback";
import { CanvasTypes } from "../html/canvas";
import {
    createUtilityCanvasFromImage,
    createUtilityCanvasFromImageBitmap,
    hasImageBitmap
} from "../html/canvas";
import { using } from "../using";
import { postObjectForImageBitmap } from "./postObjectForImageBitmap";
import { postObjectForImage } from "./postObjectForImage";

export async function postObjectForCanvasViaImageBitmap<T>(path: string, obj: T, onProgress?: progressCallback): Promise<CanvasTypes> {
    return using(await postObjectForImageBitmap(path, obj, onProgress), (img: ImageBitmap) => {
        return createUtilityCanvasFromImageBitmap(img);
    });
}

export async function postObjectForCanvasViaImage<T>(path: string, obj: T, onProgress?: progressCallback): Promise<CanvasTypes> {
    const img = await postObjectForImage(path, obj, onProgress);
    return createUtilityCanvasFromImage(img);
}

export const postObjectForCanvas = hasImageBitmap
    ? postObjectForCanvasViaImageBitmap
    : postObjectForCanvasViaImage;
