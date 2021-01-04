import type { InterpolationType } from "../graphics2d/InterpolationType";
import type { CanvasTypes } from "../html/canvas";
import type { progressCallback } from "./progressCallback";

export type fetchingCallback<T> = (path: string, progress?: progressCallback) => Promise<T>;

export type blobFetchingCallback = fetchingCallback<Blob>;
export type canvasFetchingCallback = fetchingCallback<CanvasTypes>;
export type cubeCanvasFetchingCallback = fetchingCallback<(ImageBitmap | CanvasTypes)[]>;
export type equiCanvasFetchingCallback = (path: string, interpolation: InterpolationType, maxWidth: number, progress?: progressCallback) => Promise<(ImageBitmap | CanvasTypes)[]>;

export type scriptLoadingCallback = (path: string, test: () => boolean, onProgress?: progressCallback) => Promise<void>;