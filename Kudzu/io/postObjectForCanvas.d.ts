import { CanvasTypes } from "../html/canvas";
import type { progressCallback } from "../tasks/progressCallback";
export declare function postObjectForCanvasViaImageBitmap<T>(path: string, obj: T, onProgress?: progressCallback): Promise<CanvasTypes>;
export declare function postObjectForCanvasViaImage<T>(path: string, obj: T, onProgress?: progressCallback): Promise<CanvasTypes>;
export declare const postObjectForCanvas: typeof postObjectForCanvasViaImageBitmap;
