import type { progressCallback } from "./progressCallback";
export declare function arrayProgress<T, U>(onProgress: progressCallback | undefined, items: T[], callback: (val: T, prog: progressCallback) => Promise<U>): Promise<U[]>;
