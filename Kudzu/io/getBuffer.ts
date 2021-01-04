import type { progressCallback } from "../tasks/progressCallback";
import { getResponse } from "./getResponse";
import type { getPartsReturnType } from "./readResponseBuffer";
import { readResponseBuffer } from "./readResponseBuffer";

export async function getBuffer(path: string, onProgress?: progressCallback): Promise<getPartsReturnType> {
    if (onProgress) {
        onProgress(0, 1, path);
    }
    const response = await getResponse(path);

    return await readResponseBuffer(response, path, onProgress);
}