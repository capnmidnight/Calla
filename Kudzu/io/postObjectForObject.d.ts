import type { progressCallback } from "../tasks/progressCallback";
export declare function postObjectForObject<T, U>(path: string, obj: T, onProgress?: progressCallback): Promise<U>;
