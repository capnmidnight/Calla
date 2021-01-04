import { once } from "../events/once";
import type { progressCallback } from "../tasks/progressCallback";
import { postObjectForFile } from "./postObjectForFile";

export async function postObjectForImage<T>(path: string, obj: T, onProgress?: progressCallback): Promise<HTMLImageElement> {
    const img = new Image();
    img.src = await postObjectForFile(path, obj, onProgress);
    if (!img.complete) {
        await once(img, "load", "error");
    }
    return img;
}