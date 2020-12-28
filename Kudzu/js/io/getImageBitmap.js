import { getBlob } from "./getBlob";
export async function getImageBitmap(path, onProgress) {
    const blob = await getBlob(path, onProgress);
    return await createImageBitmap(blob);
}
//# sourceMappingURL=getImageBitmap.js.map