import type { progressCallback } from "../tasks/progressCallback";
import { postObjectForBuffer } from "./postObjectForBuffer";

export async function postObjectForBlob<T>(path: string, obj: T, onProgress?: progressCallback): Promise<Blob> {
    const { buffer, contentType } = await postObjectForBuffer(path, obj, onProgress);
    const blob = new Blob([buffer], { type: contentType });
    return blob;
}