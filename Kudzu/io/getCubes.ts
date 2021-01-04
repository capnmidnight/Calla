import { sliceCubeMap } from "../graphics2d/sliceCubeMap";
import type { CanvasTypes } from "../html/canvas";
import { hasImageBitmap } from "../html/canvas";
import type { progressCallback } from "../tasks/progressCallback";
import { usingAsync } from "../using";
import { getImage } from "./getImage";
import { getImageBitmap } from "./getImageBitmap";


export async function getCubeImageBitmaps(path: string, onProgress?: progressCallback) {
    return await usingAsync(await getImageBitmap(path, onProgress), async (img: ImageBitmap) => {
        const canvs = sliceCubeMap(img);
        return await Promise.all(canvs.map((canv) => createImageBitmap(canv)));
    });
}

export async function getCubeCanvases(path: string, onProgress?: progressCallback): Promise<CanvasTypes[]> {
    const img = await getImage(path, onProgress);
    return sliceCubeMap(img);
}

export const getCubes = hasImageBitmap
    ? getCubeImageBitmaps
    : getCubeCanvases;
