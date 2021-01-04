import type { progressCallback } from "../tasks/progressCallback";
import type { getPartsReturnType } from "./readResponseBuffer";
export declare function getBuffer(path: string, onProgress?: progressCallback): Promise<getPartsReturnType>;
