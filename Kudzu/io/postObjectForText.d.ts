import { progressCallback } from "./progressCallback";
export declare function postObjectForText<T>(path: string, obj: T, onProgress?: progressCallback): Promise<string>;
