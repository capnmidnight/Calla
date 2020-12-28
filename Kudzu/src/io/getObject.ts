import { getBuffer } from "./getBuffer";
import type { progressCallback } from "./progressCallback";
import { readBufferObject } from "./readBufferObject";

export async function getObject<T>(path: string, onProgress?: progressCallback) {
    const { buffer } = await getBuffer(path, onProgress);
    return readBufferObject<T>(buffer);
}
