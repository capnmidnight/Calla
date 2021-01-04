import type { InterpolationType } from "../graphics2d/InterpolationType";
import type { CanvasTypes } from "../html/canvas";
import type { progressCallback } from "./progressCallback";
export declare type fetchingCallback<T> = (path: string, progress?: progressCallback) => Promise<T>;
export declare type blobFetchingCallback = fetchingCallback<Blob>;
export declare type canvasFetchingCallback = fetchingCallback<CanvasTypes>;
export declare type cubeCanvasFetchingCallback = fetchingCallback<(ImageBitmap | CanvasTypes)[]>;
export declare type equiCanvasFetchingCallback = (path: string, interpolation: InterpolationType, maxWidth: number, progress?: progressCallback) => Promise<(ImageBitmap | CanvasTypes)[]>;
export declare type scriptLoadingCallback = (path: string, test: () => boolean, onProgress?: progressCallback) => Promise<void>;
