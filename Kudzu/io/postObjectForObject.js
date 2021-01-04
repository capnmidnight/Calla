import { postObjectForBuffer } from "./postObjectForBuffer";
import { readBufferObject } from "./readBufferObject";
export async function postObjectForObject(path, obj, onProgress) {
    const { buffer } = await postObjectForBuffer(path, obj, onProgress);
    return readBufferObject(buffer);
}
//# sourceMappingURL=postObjectForObject.js.map