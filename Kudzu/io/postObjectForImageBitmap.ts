import { progressCallback } from "./progressCallback";
import { postObjectForBlob } from "./postObjectForBlob";

export async function postObjectForImageBitmap<T>(path: string, obj: T, onProgress?: progressCallback): Promise<ImageBitmap> {
    const blob = await postObjectForBlob(path, obj, onProgress);
    return await createImageBitmap(blob);
}