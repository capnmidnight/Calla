import type { progressCallback } from "../tasks/progressCallback";
import { getBlob } from "./getBlob";

export async function getImageBitmap(path: string, onProgress?: progressCallback) {
    const blob = await getBlob(path, onProgress);
    return await createImageBitmap(blob);
}
