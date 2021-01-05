import type { InterpolationType } from "../graphics2d/InterpolationType";
import type { CanvasTypes, MemoryImageTypes } from "../html/canvas";
import type { progressCallback } from "../tasks/progressCallback";
import type { getPartsReturnType } from "./getPartsReturnType";

export interface IFetcher {
    getCanvas: (path: string, onProgress?: progressCallback) => Promise<CanvasTypes>;
    getImageData: (path: string, onProgress?: progressCallback) => Promise<ImageData>;
    getCubes: (path: string, onProgress?: progressCallback) => Promise<MemoryImageTypes[]>;
    getEquiMaps: (path: string, interpolation: InterpolationType, maxWidth: number, onProgress?: progressCallback) => Promise<MemoryImageTypes[]>;
    getBuffer(path: string, onProgress?: progressCallback): Promise<getPartsReturnType>;
    postObjectForBuffer<T>(path: string, obj: T, onProgress?: progressCallback): Promise<getPartsReturnType>;
    getBlob(path: string, onProgress?: progressCallback): Promise<Blob>;
    postObjectForBlob<T>(path: string, obj: T, onProgress?: progressCallback): Promise<Blob>;
    getFile(path: string, onProgress?: progressCallback): Promise<string>;
    postObjectForFile<T>(path: string, obj: T, onProgress?: progressCallback): Promise<string>;
    getImageBitmap(path: string, onProgress?: progressCallback): Promise<ImageBitmap>;
    getImage(path: string, onProgress?: progressCallback): Promise<HTMLImageElement>;
    postObjectForImageBitmap<T>(path: string, obj: T, onProgress?: progressCallback): Promise<ImageBitmap>;
    postObjectForImage<T>(path: string, obj: T, onProgress?: progressCallback): Promise<HTMLImageElement>;
    getText(path: string, onProgress?: progressCallback): Promise<string>;
    postObjectForText<T>(path: string, obj: T, onProgress?: progressCallback): Promise<string>;
    getObject<T>(path: string, onProgress?: progressCallback): Promise<T>;
    postObject<T>(path: string, obj: T): Promise<void>;
    postObjectForObject<T, U>(path: string, obj: T, onProgress?: progressCallback): Promise<U>;
    getXml(path: string, onProgress?: progressCallback): Promise<HTMLElement>;
    postObjectForXml<T>(path: string, obj: T, onProgress?: progressCallback): Promise<HTMLElement>;
    loadScript(path: string, test: () => boolean, onProgress?: progressCallback): Promise<void>;
}