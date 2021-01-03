import { postObjectForBuffer } from "./postObjectForBuffer";
import { readBufferXml } from "./readBufferXml";
export async function postObjectForXml(path, obj, onProgress) {
    const { buffer } = await postObjectForBuffer(path, obj, onProgress);
    return readBufferXml(buffer);
}
//# sourceMappingURL=postObjectForXml.js.map