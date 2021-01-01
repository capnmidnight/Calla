import type { progressCallback } from "./progressCallback";
export declare function readResponseBuffer(path: string, response: Response, contentLength: number, onProgress?: progressCallback): Promise<ArrayBuffer>;
