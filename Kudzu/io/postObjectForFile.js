import { postObjectForBlob } from "./postObjectForBlob";
export async function postObjectForFile(path, obj, onProgress) {
    const blob = await postObjectForBlob(path, obj, onProgress);
    const blobUrl = URL.createObjectURL(blob);
    return blobUrl;
}
//# sourceMappingURL=postObjectForFile.js.map