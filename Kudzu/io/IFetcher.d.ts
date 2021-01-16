import type { progressCallback } from "../tasks/progressCallback";
import type { getPartsReturnType } from "./getPartsReturnType";
export interface IFetcher {
    getBuffer(path: string, onProgress?: progressCallback): Promise<getPartsReturnType>;
    postObjectForBuffer<T>(path: string, obj: T, onProgress?: progressCallback): Promise<getPartsReturnType>;
    getBlob(path: string, onProgress?: progressCallback): Promise<Blob>;
    postObjectForBlob<T>(path: string, obj: T, onProgress?: progressCallback): Promise<Blob>;
    getFile(path: string, onProgress?: progressCallback): Promise<string>;
    postObjectForFile<T>(path: string, obj: T, onProgress?: progressCallback): Promise<string>;
    getText(path: string, onProgress?: progressCallback): Promise<string>;
    postObjectForText<T>(path: string, obj: T, onProgress?: progressCallback): Promise<string>;
    getObject<T>(path: string, onProgress?: progressCallback): Promise<T>;
    postObject<T>(path: string, obj: T): Promise<void>;
    postObjectForObject<T, U>(path: string, obj: T, onProgress?: progressCallback): Promise<U>;
    getXml(path: string, onProgress?: progressCallback): Promise<HTMLElement>;
    postObjectForXml<T>(path: string, obj: T, onProgress?: progressCallback): Promise<HTMLElement>;
    loadScript(path: string, test: () => boolean, onProgress?: progressCallback): Promise<void>;
}
