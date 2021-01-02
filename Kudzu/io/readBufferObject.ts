import { readBufferText } from "./readBufferText";

export function readBufferObject<T>(buffer: ArrayBuffer): T {
    const text = readBufferText(buffer);
    const obj = JSON.parse(text);
    return obj as T;
}