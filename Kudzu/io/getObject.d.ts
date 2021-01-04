import type { progressCallback } from "../tasks/progressCallback";
export declare function getObject<T>(path: string, onProgress?: progressCallback): Promise<T>;
