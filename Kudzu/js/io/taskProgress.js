import { splitProgress } from "./splitProgress";
export async function taskProgress(onProgress, taskDefs) {
    const weights = new Array(taskDefs.length);
    const callbacks = new Array(taskDefs.length);
    for (let i = 0; i < taskDefs.length; ++i) {
        const taskDef = taskDefs[i];
        weights[i] = taskDef[0];
        callbacks[i] = taskDef[1];
    }
    const progs = splitProgress(onProgress, weights);
    const tasks = new Array(taskDefs.length);
    for (let i = 0; i < taskDefs.length; ++i) {
        tasks[i] = callbacks[i](progs[i]);
    }
    return await Promise.all(tasks);
}
//# sourceMappingURL=taskProgress.js.map