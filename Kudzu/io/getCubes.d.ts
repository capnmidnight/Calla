import type { CanvasTypes } from "../html/canvas";
import type { progressCallback } from "../tasks/progressCallback";
export declare function getCubeImageBitmaps(path: string, onProgress?: progressCallback): Promise<ImageBitmap[]>;
export declare function getCubeCanvases(path: string, onProgress?: progressCallback): Promise<CanvasTypes[]>;
export declare const getCubes: typeof getCubeImageBitmaps | typeof getCubeCanvases;
