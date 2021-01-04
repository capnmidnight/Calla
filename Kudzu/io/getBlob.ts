import type { progressCallback } from "../tasks/progressCallback";
import { getBuffer } from "./getBuffer";

export async function getBlob(path: string, onProgress?: progressCallback) {
    const { buffer, contentType } = await getBuffer(path, onProgress);
    const blob = new Blob([buffer], { type: contentType });
    return blob;
}