import { createUtilityCanvas, hasImageBitmap } from "../html/canvas";
import { using } from "../using";
import { getImage } from "./getImage";
import { getImageBitmap } from "./getImageBitmap";
export async function getImageDataViaImageBitmap(path, onProgress) {
    return using(await getImageBitmap(path, onProgress), (img) => {
        const canv = createUtilityCanvas(img.width, img.height);
        const g = canv.getContext("2d");
        if (!g) {
            throw new Error("Couldn't create a 2D canvas context.");
        }
        g.drawImage(img, 0, 0);
        return g.getImageData(0, 0, canv.width, canv.height);
    });
}
export async function getImageDataViaImage(path, onProgress) {
    const img = await getImage(path, onProgress);
    const canv = createUtilityCanvas(img.width, img.height);
    const g = canv.getContext("2d");
    if (!g) {
        throw new Error("Couldn't create a 2D canvas context");
    }
    g.drawImage(img, 0, 0);
    return g.getImageData(0, 0, canv.width, canv.height);
}
export const getImageData = hasImageBitmap
    ? getImageDataViaImageBitmap
    : getImageDataViaImage;
//# sourceMappingURL=getImageData.js.map