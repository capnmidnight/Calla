import type { progressCallback } from "../tasks/progressCallback";
export declare function postObjectForImageBitmap<T>(path: string, obj: T, onProgress?: progressCallback): Promise<ImageBitmap>;
