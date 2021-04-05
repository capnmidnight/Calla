import type { progressCallback } from "./progressCallback";
export declare function arrayProgress<T, U>(onProgress: progressCallback | undefined, items: T[], callback: (val: T, prog: progressCallback, i?: number) => Promise<U>): Promise<U[]>;
