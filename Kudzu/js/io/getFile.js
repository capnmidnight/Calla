import { getBlob } from "./getBlob";
export async function getFile(path, onProgress) {
    const blob = await getBlob(path, onProgress);
    const blobUrl = URL.createObjectURL(blob);
    return blobUrl;
}
//# sourceMappingURL=getFile.js.map