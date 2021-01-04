import type { progressCallback } from "../tasks/progressCallback";
import { postObjectForBlob } from "./postObjectForBlob";

export async function postObjectForFile<T>(path: string, obj: T, onProgress?: progressCallback) {
    const blob = await postObjectForBlob(path, obj, onProgress);
    const blobUrl = URL.createObjectURL(blob);
    return blobUrl;
}