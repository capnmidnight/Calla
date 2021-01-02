import { readBufferText } from "./readBufferText";
export function readBufferObject(buffer) {
    const text = readBufferText(buffer);
    const obj = JSON.parse(text);
    return obj;
}
//# sourceMappingURL=readBufferObject.js.map