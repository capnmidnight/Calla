import type { InterpolationType } from "../graphics2d/InterpolationType";
import type { CanvasTypes, MemoryImageTypes } from "../html/canvas";
import type { progressCallback } from "../tasks/progressCallback";
import { IFetcher } from "./IFetcher";
export interface IImageFetcher extends IFetcher {
    getCanvas: (path: string, onProgress?: progressCallback) => Promise<CanvasTypes>;
    getImageData: (path: string, onProgress?: progressCallback) => Promise<ImageData>;
    getCubes: (path: string, onProgress?: progressCallback) => Promise<MemoryImageTypes[]>;
    getEquiMaps: (path: string, interpolation: InterpolationType, maxWidth: number, onProgress?: progressCallback) => Promise<MemoryImageTypes[]>;
    getImageBitmap(path: string, onProgress?: progressCallback): Promise<ImageBitmap>;
    getImage(path: string, onProgress?: progressCallback): Promise<HTMLImageElement>;
    postObjectForImageBitmap<T>(path: string, obj: T, onProgress?: progressCallback): Promise<ImageBitmap>;
    postObjectForImage<T>(path: string, obj: T, onProgress?: progressCallback): Promise<HTMLImageElement>;
}
