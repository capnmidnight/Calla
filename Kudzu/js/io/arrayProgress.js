import { splitProgress } from "./splitProgress";
export async function arrayProgress(onProgress, items, callback) {
    const progs = splitProgress(onProgress, items.length);
    const tasks = items.map((item, i) => callback(item, progs[i]));
    return await Promise.all(tasks);
}
//# sourceMappingURL=arrayProgress.js.map