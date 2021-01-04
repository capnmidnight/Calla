import type { progressCallback } from "../tasks/progressCallback";
export declare function loadScript(path: string, test: () => boolean, onProgress?: progressCallback): Promise<void>;
