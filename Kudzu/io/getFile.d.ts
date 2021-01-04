import type { progressCallback } from "../tasks/progressCallback";
export declare function getFile(path: string, onProgress?: progressCallback): Promise<string>;
