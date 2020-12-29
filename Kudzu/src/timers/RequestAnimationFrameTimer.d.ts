import { BaseTimer } from "./BaseTimer";
export declare class RequestAnimationFrameTimer extends BaseTimer<number> {
    constructor();
    start(): void;
    stop(): void;
}
