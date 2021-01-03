import { progressCallback } from "./progressCallback";
import { readBufferText } from "./readBufferText";
import { postObjectForBuffer } from "./postObjectForBuffer";

export async function postObjectForText<T>(path: string, obj: T, onProgress?: progressCallback): Promise<string> {
    const { buffer } = await postObjectForBuffer(path, obj, onProgress);
    return readBufferText(buffer);
}