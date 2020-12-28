import { isGoodNumber } from "../typeChecks";
import type { progressCallback } from "./progressCallback";

export async function readResponseBuffer(path: string, response: Response, contentLength: number, onProgress?: progressCallback) {
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

    return buffer;
}
