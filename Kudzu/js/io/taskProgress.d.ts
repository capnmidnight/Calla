import type { progressCallback } from "./progressCallback";
export declare type subProgressCallback = (onProgress: progressCallback) => Promise<any>;
export declare type TaskDef = [weight: number, task: subProgressCallback];
export declare function taskProgress(onProgress: progressCallback, taskDefs: TaskDef[]): Promise<any[]>;
