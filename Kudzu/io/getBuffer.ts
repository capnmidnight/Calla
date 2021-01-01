import { isGoodNumber } from "../typeChecks";
import { getResponse } from "./getResponse";
import type { progressCallback } from "./progressCallback";
import { readResponseBuffer } from "./readResponseBuffer";

export type getPartsReturnType = {
    buffer: ArrayBuffer;
    contentType: string;
};

export async function getBuffer(path: string, onProgress?: progressCallback): Promise<getPartsReturnType> {
    if (onProgress) {
        onProgress(0, 1, path);
    }
    const response = await getResponse(path);

    const contentType = response.headers.get("Content-Type");
    if (!contentType) {
        throw new Error("Server did not provide a content type");
    }

    let contentLength = 1;
    const contentLengthStr = response.headers.get("Content-Length");
    if (!contentLengthStr) {
        console.warn(`Server did not provide a content length header. Path: ${path}`);
    }
    else {
        contentLength = parseInt(contentLengthStr, 10);
        if (!isGoodNumber(contentLength)) {
            console.warn(`Server did not provide a valid content length header. Value: ${contentLengthStr}, Path: ${path}`);
            contentLength = 1;
        }
    }

    const buffer = await readResponseBuffer(path, response, contentLength, onProgress);
    if (onProgress) {
        onProgress(1, 1, path);
    }

    return { buffer, contentType };
}