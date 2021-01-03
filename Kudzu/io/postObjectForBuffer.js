import { postObjectForResponse } from "./postObjectForResponse";
import { readResponseBuffer } from "./readResponseBuffer";
export async function postObjectForBuffer(path, obj, onProgress) {
    const response = await postObjectForResponse(path, obj);
    return await readResponseBuffer(response, path, onProgress);
}
//# sourceMappingURL=postObjectForBuffer.js.map