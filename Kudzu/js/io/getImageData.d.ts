import type { progressCallback } from "./progressCallback";
export declare function getImageDataViaImageBitmap(path: string, onProgress?: progressCallback): Promise<ImageData>;
export declare function getImageDataViaImage(path: string, onProgress?: progressCallback): Promise<ImageData>;
export declare const getImageData: typeof getImageDataViaImageBitmap;
