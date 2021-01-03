import { postObjectForBuffer } from "./postObjectForBuffer";
export async function postObjectForBlob(path, obj, onProgress) {
    const { buffer, contentType } = await postObjectForBuffer(path, obj, onProgress);
    const blob = new Blob([buffer], { type: contentType });
    return blob;
}
//# sourceMappingURL=postObjectForBlob.js.map