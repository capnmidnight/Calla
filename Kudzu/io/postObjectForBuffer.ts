import type { progressCallback } from "../tasks/progressCallback";
import { postObjectForResponse } from "./postObjectForResponse";
import type { getPartsReturnType } from "./readResponseBuffer";
import { readResponseBuffer } from "./readResponseBuffer";

export async function postObjectForBuffer<T>(path: string, obj: T, onProgress?: progressCallback): Promise<getPartsReturnType> {
    const response = await postObjectForResponse(path, obj);
    return await readResponseBuffer(response, path, onProgress);
}