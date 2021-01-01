import type { progressCallback } from "./progressCallback";
export declare function loadScript(path: string, test: () => boolean, onProgress?: progressCallback): Promise<void>;
