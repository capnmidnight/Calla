import type { progressCallback } from "../tasks/progressCallback";
export declare function postObjectForXml<T>(path: string, obj: T, onProgress?: progressCallback): Promise<HTMLElement>;
