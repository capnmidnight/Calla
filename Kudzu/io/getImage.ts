import { once } from "../events/once";
import type { progressCallback } from "../tasks/progressCallback";
import { getFile } from "./getFile";


export async function getImage(path: string, onProgress?: progressCallback): Promise<HTMLImageElement> {
    const img = new Image();
    img.src = await getFile(path, onProgress);
    if (!img.complete) {
        await once(img, "load", "error");
    }
    return img;
}
