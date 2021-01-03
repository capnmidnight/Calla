import { readBufferText } from "./readBufferText";
import { postObjectForBuffer } from "./postObjectForBuffer";
export async function postObjectForText(path, obj, onProgress) {
    const { buffer } = await postObjectForBuffer(path, obj, onProgress);
    return readBufferText(buffer);
}
//# sourceMappingURL=postObjectForText.js.map