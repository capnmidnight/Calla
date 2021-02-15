import { BaseTimer } from "./BaseTimer";
export declare class SetTimeoutTimer extends BaseTimer<number> {
    constructor(targetFrameRate: number);
    start(): void;
    stop(): void;
}
