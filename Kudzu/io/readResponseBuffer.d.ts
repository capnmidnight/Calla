import type { progressCallback } from "../tasks/progressCallback";
export declare type getPartsReturnType = {
    buffer: ArrayBuffer;
    contentType: string;
};
export declare function readResponseBuffer(response: Response, path: string, onProgress?: progressCallback): Promise<getPartsReturnType>;
