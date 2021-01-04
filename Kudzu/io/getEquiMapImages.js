import { renderCanvasFace, renderCanvasFaces, renderImageBitmapFace, renderImageBitmapFaces } from "../graphics2d/renderFace";
import { hasImageBitmap } from "../html/canvas";
import { getImageData } from "./getImageData";
import { splitProgress } from "./splitProgress";
export async function getEquiMapCanvases(path, interpolation, maxWidth, onProgress) {
    const splits = splitProgress(onProgress, [1, 6]);
    const imgData = await getImageData(path, splits.shift());
    console.log(imgData);
    return await renderCanvasFaces(renderCanvasFace, imgData, interpolation, maxWidth, splits.shift());
}
export async function getEquiMapImageBitmaps(path, interpolation, maxWidth, onProgress) {
    const splits = splitProgress(onProgress, [1, 6]);
    const imgData = await getImageData(path, splits.shift());
    return await renderImageBitmapFaces(renderImageBitmapFace, imgData, interpolation, maxWidth, splits.shift());
}
export const getEquipMaps = hasImageBitmap
    ? getEquiMapImageBitmaps
    : getEquiMapCanvases;
//# sourceMappingURL=getEquiMapImages.js.map