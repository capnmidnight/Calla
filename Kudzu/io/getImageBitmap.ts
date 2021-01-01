import { getBlob } from "./getBlob";
import type { progressCallback } from "./progressCallback";

export async function getImageBitmap(path: string, onProgress?: progressCallback) {
    const blob = await getBlob(path, onProgress);
    return await createImageBitmap(blob);
}
