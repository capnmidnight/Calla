import { progressCallback } from "./progressCallback";
export declare function postObjectForBlob<T>(path: string, obj: T, onProgress?: progressCallback): Promise<Blob>;
