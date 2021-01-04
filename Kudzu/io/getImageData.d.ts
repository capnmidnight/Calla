import type { progressCallback } from "../tasks/progressCallback";
export declare function getImageDataViaImageBitmap(path: string, onProgress?: progressCallback): Promise<ImageData>;
export declare function getImageDataViaImage(path: string, onProgress?: progressCallback): Promise<ImageData>;
export declare const getImageData: typeof getImageDataViaImageBitmap;
