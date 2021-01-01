import { getBlob } from "./getBlob";
import type { progressCallback } from "./progressCallback";

export async function getFile(path: string, onProgress?: progressCallback) {
    const blob = await getBlob(path, onProgress);
    const blobUrl = URL.createObjectURL(blob);
    return blobUrl;
}