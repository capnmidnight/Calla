import { CanvasTypes } from "../html/canvas";
import { progressCallback } from "../tasks/progressCallback";
export declare function equirectangularToCubemap(image: TexImageSource, size: number, onProgress?: progressCallback): Promise<CanvasTypes>;
