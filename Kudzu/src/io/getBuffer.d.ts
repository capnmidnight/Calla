import type { progressCallback } from "./progressCallback";
export declare type getPartsReturnType = {
    buffer: ArrayBuffer;
    contentType: string;
};
export declare function getBuffer(path: string, onProgress?: progressCallback): Promise<getPartsReturnType>;
