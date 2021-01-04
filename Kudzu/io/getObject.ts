import type { progressCallback } from "../tasks/progressCallback";
import { getBuffer } from "./getBuffer";
import { readBufferObject } from "./readBufferObject";

export async function getObject<T>(path: string, onProgress?: progressCallback): Promise<T> {
    const { buffer } = await getBuffer(path, onProgress);
    return readBufferObject<T>(buffer);
}