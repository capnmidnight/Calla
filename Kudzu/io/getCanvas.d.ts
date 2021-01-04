import type { CanvasTypes } from "../html/canvas";
import type { progressCallback } from "../tasks/progressCallback";
export declare function getCanvasViaImageBitmap(path: string, onProgress?: progressCallback): Promise<CanvasTypes>;
export declare function getCanvasViaImage(path: string, onProgress?: progressCallback): Promise<CanvasTypes>;
export declare const getCanvas: typeof getCanvasViaImageBitmap;
