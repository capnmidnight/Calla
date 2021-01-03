import { once } from "../events/once";
import { postObjectForFile } from "./postObjectForFile";
export async function postObjectForImage(path, obj, onProgress) {
    const img = new Image();
    img.src = await postObjectForFile(path, obj, onProgress);
    if (!img.complete) {
        await once(img, "load", "error");
    }
    return img;
}
//# sourceMappingURL=postObjectForImage.js.map