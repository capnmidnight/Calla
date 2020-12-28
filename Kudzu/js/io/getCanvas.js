import { createUtilityCanvasFromImage, createUtilityCanvasFromImageBitmap, hasImageBitmap } from "../html/canvas";
import { using } from "../using";
import { getImage } from "./getImage";
import { getImageBitmap } from "./getImageBitmap";
export async function getCanvasViaImageBitmap(path, onProgress) {
    return using(await getImageBitmap(path, onProgress), (img) => {
        return createUtilityCanvasFromImageBitmap(img);
    });
}
export async function getCanvasViaImage(path, onProgress) {
    const img = await getImage(path, onProgress);
    return createUtilityCanvasFromImage(img);
}
export const getCanvas = hasImageBitmap
    ? getCanvasViaImageBitmap
    : getCanvasViaImage;
//# sourceMappingURL=getCanvas.js.map