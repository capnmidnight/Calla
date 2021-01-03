import { createUtilityCanvasFromImage, createUtilityCanvasFromImageBitmap, hasImageBitmap } from "../html/canvas";
import { using } from "../using";
import { postObjectForImageBitmap } from "./postObjectForImageBitmap";
import { postObjectForImage } from "./postObjectForImage";
export async function postObjectForCanvasViaImageBitmap(path, obj, onProgress) {
    return using(await postObjectForImageBitmap(path, obj, onProgress), (img) => {
        return createUtilityCanvasFromImageBitmap(img);
    });
}
export async function postObjectForCanvasViaImage(path, obj, onProgress) {
    const img = await postObjectForImage(path, obj, onProgress);
    return createUtilityCanvasFromImage(img);
}
export const postObjectForCanvas = hasImageBitmap
    ? postObjectForCanvasViaImageBitmap
    : postObjectForCanvasViaImage;
//# sourceMappingURL=postObjectForCanvas.js.map