import type { progressCallback } from "./progressCallback";
export declare function getObject<T>(path: string, onProgress?: progressCallback): Promise<T>;
