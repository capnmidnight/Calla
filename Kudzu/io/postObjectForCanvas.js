import { createUtilityCanvasFromImage, createUtilityCanvasFromImageBitmap, hasImageBitmap } from "../html/canvas";
import { using } from "../using";
import { postObjectForImage } from "./postObjectForImage";
import { postObjectForImageBitmap } from "./postObjectForImageBitmap";
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