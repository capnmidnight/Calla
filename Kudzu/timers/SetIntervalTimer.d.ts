import { BaseTimer } from "./BaseTimer";
export declare class SetIntervalTimer extends BaseTimer<number> {
    constructor(targetFrameRate: number);
    start(): void;
    stop(): void;
    get targetFrameRate(): number;
    set targetFrameRate(fps: number);
}
