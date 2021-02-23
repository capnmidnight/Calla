import type { progressCallback } from "./progressCallback";
import { splitProgress } from "./splitProgress";

export async function arrayProgress<T, U>(onProgress: progressCallback | undefined, items: T[], callback: (val: T, prog: progressCallback) => Promise<U>) {
    const weights = items.map(() => 1);
    const progs = splitProgress(onProgress, weights);
    const tasks = items.map((item, i) => callback(item, progs[i]));
    return await Promise.all(tasks);
}
