import { getBuffer } from "./getBuffer";
import { readBufferXml } from "./readBufferXml";
export async function getXml(path, onProgress) {
    const { buffer } = await getBuffer(path, onProgress);
    return readBufferXml(buffer);
}
//# sourceMappingURL=getXml.js.map