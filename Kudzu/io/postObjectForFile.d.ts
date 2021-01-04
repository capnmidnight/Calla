import type { progressCallback } from "../tasks/progressCallback";
export declare function postObjectForFile<T>(path: string, obj: T, onProgress?: progressCallback): Promise<string>;
