import { once } from "../events/once";
import { getFile } from "./getFile";
import type { progressCallback } from "./progressCallback";


export async function getImage(path: string, onProgress?: progressCallback): Promise<HTMLImageElement> {
    const img = new Image();
    img.src = await getFile(path, onProgress);
    if (!img.complete) {
        await once(img, "load", "error");
    }
    return img;
}
