import { progressCallback } from "./progressCallback";
export declare function postObjectForImageBitmap<T>(path: string, obj: T, onProgress?: progressCallback): Promise<ImageBitmap>;
