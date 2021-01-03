import { progressCallback } from "./progressCallback";
import { postObjectForBuffer } from "./postObjectForBuffer";
import { readBufferXml } from "./readBufferXml";

export async function postObjectForXml<T>(path: string, obj: T, onProgress?: progressCallback): Promise<HTMLElement> {
    const { buffer } = await postObjectForBuffer(path, obj, onProgress);
    return readBufferXml(buffer);
}