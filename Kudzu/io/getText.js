import { getBuffer } from "./getBuffer";
import { readBufferText } from "./readBufferText";
export async function getText(path, onProgress) {
    const { buffer } = await getBuffer(path, onProgress);
    return readBufferText(buffer);
}
//# sourceMappingURL=getText.js.map