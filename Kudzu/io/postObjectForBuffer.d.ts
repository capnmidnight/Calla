import type { progressCallback } from "../tasks/progressCallback";
import type { getPartsReturnType } from "./readResponseBuffer";
export declare function postObjectForBuffer<T>(path: string, obj: T, onProgress?: progressCallback): Promise<getPartsReturnType>;
