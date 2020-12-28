/// <reference types="node" />
import { BaseTimer } from "./BaseTimer";
export declare class SetIntervalTimer extends BaseTimer<NodeJS.Timeout> {
    constructor(targetFrameRate: number);
    start(): void;
    stop(): void;
    get targetFrameRate(): number;
    set targetFrameRate(fps: number);
}
