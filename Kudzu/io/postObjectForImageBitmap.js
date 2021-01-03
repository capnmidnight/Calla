import { postObjectForBlob } from "./postObjectForBlob";
export async function postObjectForImageBitmap(path, obj, onProgress) {
    const blob = await postObjectForBlob(path, obj, onProgress);
    return await createImageBitmap(blob);
}
//# sourceMappingURL=postObjectForImageBitmap.js.map