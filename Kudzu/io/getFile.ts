import type { progressCallback } from "../tasks/progressCallback";
import { getBlob } from "./getBlob";

export async function getFile(path: string, onProgress?: progressCallback) {
    const blob = await getBlob(path, onProgress);
    const blobUrl = URL.createObjectURL(blob);
    return blobUrl;
}