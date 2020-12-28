import { getBuffer } from "./getBuffer";
export async function getBlob(path, onProgress) {
    const { buffer, contentType } = await getBuffer(path, onProgress);
    const blob = new Blob([buffer], { type: contentType });
    return blob;
}
//# sourceMappingURL=getBlob.js.map