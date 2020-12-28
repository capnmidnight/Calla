import { once } from "../events/once";
import { getFile } from "./getFile";
export async function getImage(path, onProgress) {
    const img = new Image();
    img.src = await getFile(path, onProgress);
    if (!img.complete) {
        await once(img, "load", "error");
    }
    return img;
}
//# sourceMappingURL=getImage.js.map