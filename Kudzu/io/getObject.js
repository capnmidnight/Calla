import { getBuffer } from "./getBuffer";
import { readBufferObject } from "./readBufferObject";
export async function getObject(path, onProgress) {
    const { buffer } = await getBuffer(path, onProgress);
    return readBufferObject(buffer);
}
//# sourceMappingURL=getObject.js.map