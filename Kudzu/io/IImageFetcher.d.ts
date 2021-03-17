import type { CanvasTypes } from "../html/canvas";
import type { progressCallback } from "../tasks/progressCallback";
import type { IFetcher } from "./IFetcher";
export interface IImageFetcher extends IFetcher {
    getImageBitmap(path: string): Promise<ImageBitmap>;
    getImageBitmap(path: string, onProgress?: progressCallback): Promise<ImageBitmap>;
    getImageBitmap(path: string, headers?: Map<string, string>): Promise<ImageBitmap>;
    getImageBitmap(path: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<ImageBitmap>;
    getImage(path: string): Promise<HTMLImageElement>;
    getImage(path: string, onProgress?: progressCallback): Promise<HTMLImageElement>;
    getImage(path: string, headers?: Map<string, string>): Promise<HTMLImageElement>;
    getImage(path: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<HTMLImageElement>;
    postObjectForImageBitmap(path: string, obj: any, contentType: string): Promise<ImageBitmap>;
    postObjectForImageBitmap(path: string, obj: any, contentType: string, onProgress?: progressCallback): Promise<ImageBitmap>;
    postObjectForImageBitmap(path: string, obj: any, contentType: string, headers?: Map<string, string>): Promise<ImageBitmap>;
    postObjectForImageBitmap(path: string, obj: any, contentType: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<ImageBitmap>;
    postObjectForImage(path: string, obj: any, contentType: string): Promise<HTMLImageElement>;
    postObjectForImage(path: string, obj: any, contentType: string, onProgress?: progressCallback): Promise<HTMLImageElement>;
    postObjectForImage(path: string, obj: any, contentType: string, headers?: Map<string, string>): Promise<HTMLImageElement>;
    postObjectForImage(path: string, obj: any, contentType: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<HTMLImageElement>;
    getCanvas(path: string): Promise<CanvasTypes>;
    getCanvas(path: string, onProgress?: progressCallback): Promise<CanvasTypes>;
    getCanvas(path: string, headers?: Map<string, string>): Promise<CanvasTypes>;
    getCanvas(path: string, headers?: Map<string, string>, onProgress?: progressCallback): Promise<CanvasTypes>;
}
