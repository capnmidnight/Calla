/// <reference types="node" />
import { BaseTimer } from "./BaseTimer";
export declare class SetTimeoutTimer extends BaseTimer<NodeJS.Timeout> {
    constructor(targetFrameRate: number);
    start(): void;
    stop(): void;
}
