import type { progressCallback } from "../tasks/progressCallback";
import { isGoodNumber } from "../typeChecks";

export type getPartsReturnType = {
    buffer: ArrayBuffer;
    contentType: string;
};

export async function readResponseBuffer(response: Response, path: string, onProgress?: progressCallback): Promise<getPartsReturnType> {
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

    if (onProgress) {
        onProgress(0, 1, path);
    }

    const hasContentLength = isGoodNumber(contentLength);
    if (!hasContentLength) {
        contentLength = 1;
    }

    if (!response.body) {
        throw new Error("No response body!");
    }

    const reader = response.body.getReader();
    const values = [];
    let receivedLength = 0;
    while (true) {
        const { done, value } = await reader.read();
        if (done) {
            break;
        }

        if (value) {
            values.push(value);
            receivedLength += value.length;
            if (onProgress) {
                onProgress(receivedLength, Math.max(receivedLength, contentLength), path);
            }
        }
    }

    const buffer = new ArrayBuffer(receivedLength);
    const array = new Uint8Array(buffer);
    receivedLength = 0;
    for (const value of values) {
        array.set(value, receivedLength);
        receivedLength += value.length;
    }

    if (onProgress) {
        onProgress(1, 1, path);
    }

    return { buffer, contentType };
}
