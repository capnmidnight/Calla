import { sliceCubeMap } from "../graphics2d/sliceCubeMap";
import { hasImageBitmap } from "../html/canvas";
import { usingAsync } from "../using";
import { getImage } from "./getImage";
import { getImageBitmap } from "./getImageBitmap";
export async function getCubeImageBitmaps(path, onProgress) {
    return await usingAsync(await getImageBitmap(path, onProgress), async (img) => {
        const canvs = sliceCubeMap(img);
        return await Promise.all(canvs.map((canv) => createImageBitmap(canv)));
    });
}
export async function getCubeCanvases(path, onProgress) {
    const img = await getImage(path, onProgress);
    return sliceCubeMap(img);
}
export const getCubes = hasImageBitmap
    ? getCubeImageBitmaps
    : getCubeCanvases;
//# sourceMappingURL=getCubes.js.map