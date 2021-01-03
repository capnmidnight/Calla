import { getResponse } from "./getResponse";
import { readResponseBuffer } from "./readResponseBuffer";
export async function getBuffer(path, onProgress) {
    if (onProgress) {
        onProgress(0, 1, path);
    }
    const response = await getResponse(path);
    return await readResponseBuffer(response, path, onProgress);
}
//# sourceMappingURL=getBuffer.js.map