import type { progressCallback } from "./progressCallback";
export declare function getFile(path: string, onProgress?: progressCallback): Promise<string>;
