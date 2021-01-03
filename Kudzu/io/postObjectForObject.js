import { readBufferObject } from "./readBufferObject";
import { postObjectForBuffer } from "./postObjectForBuffer";
export async function postObjectForObject(path, obj, onProgress) {
    const { buffer } = await postObjectForBuffer(path, obj, onProgress);
    return readBufferObject(buffer);
}
//# sourceMappingURL=postObjectForObject.js.map