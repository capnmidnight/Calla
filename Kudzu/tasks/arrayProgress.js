import { splitProgress } from "./splitProgress";
export async function arrayProgress(onProgress, items, callback) {
    const weights = items.map(() => 1);
    const progs = splitProgress(onProgress, weights);
    const tasks = items.map((item, i) => callback(item, progs[i], i));
    return await Promise.all(tasks);
}
//# sourceMappingURL=arrayProgress.js.map