import type { progressCallback } from "./progressCallback";
import { splitProgress } from "./splitProgress";

export type subProgressCallback = (onProgress: progressCallback) => Promise<any>;

export type TaskDef = [weight: number, task: subProgressCallback];

export async function taskProgress(onProgress: progressCallback, taskDefs: TaskDef[]) {
    const weights = new Array<number>(taskDefs.length);
    const callbacks = new Array<subProgressCallback>(taskDefs.length);
    for (let i = 0; i < taskDefs.length; ++i) {
        const taskDef = taskDefs[i];
        weights[i] = taskDef[0];
        callbacks[i] = taskDef[1];
    }

    const progs = splitProgress(onProgress, weights);
    const tasks = new Array<Promise<any>>(taskDefs.length);
    for (let i = 0; i < taskDefs.length; ++i) {
        tasks[i] = callbacks[i](progs[i]);
    }

    return await Promise.all(tasks);
}

