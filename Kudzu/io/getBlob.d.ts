import type { progressCallback } from "../tasks/progressCallback";
export declare function getBlob(path: string, onProgress?: progressCallback): Promise<Blob>;
