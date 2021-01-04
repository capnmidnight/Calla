import type { progressCallback } from "../tasks/progressCallback";
import { getBuffer } from "./getBuffer";
import { readBufferText } from "./readBufferText";

export async function getText(path: string, onProgress?: progressCallback): Promise<string> {
    const { buffer } = await getBuffer(path, onProgress);
    return readBufferText(buffer);
}