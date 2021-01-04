import type { progressCallback } from "../tasks/progressCallback";
import { postObjectForBuffer } from "./postObjectForBuffer";
import { readBufferObject } from "./readBufferObject";

export async function postObjectForObject<T, U>(path: string, obj: T, onProgress?: progressCallback): Promise<U> {
    const { buffer } = await postObjectForBuffer(path, obj, onProgress);
    return readBufferObject<U>(buffer);
}