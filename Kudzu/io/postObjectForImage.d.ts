import type { progressCallback } from "../tasks/progressCallback";
export declare function postObjectForImage<T>(path: string, obj: T, onProgress?: progressCallback): Promise<HTMLImageElement>;
