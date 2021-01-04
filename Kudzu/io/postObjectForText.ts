import type { progressCallback } from "../tasks/progressCallback";
import { postObjectForBuffer } from "./postObjectForBuffer";
import { readBufferText } from "./readBufferText";

export async function postObjectForText<T>(path: string, obj: T, onProgress?: progressCallback): Promise<string> {
    const { buffer } = await postObjectForBuffer(path, obj, onProgress);
    return readBufferText(buffer);
}