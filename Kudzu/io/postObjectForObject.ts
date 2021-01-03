import { progressCallback } from "./progressCallback";
import { readBufferObject } from "./readBufferObject";
import { postObjectForBuffer } from "./postObjectForBuffer";

export async function postObjectForObject<T, U>(path: string, obj: T, onProgress?: progressCallback): Promise<U> {
    const { buffer } = await postObjectForBuffer(path, obj, onProgress);
    return readBufferObject<U>(buffer);
}