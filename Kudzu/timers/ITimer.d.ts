import { TypedEventBase } from "../events/EventBase";
export declare class TimerTickEvent extends Event {
    t: number;
    dt: number;
    sdt: number;
    constructor();
    copy(evt: TimerTickEvent): void;
    set(t: number, dt: number): void;
}
export interface TimerEvents {
    stopped: Event;
    tick: TimerTickEvent;
}
export interface ITimer extends TypedEventBase<TimerEvents> {
    isRunning: boolean;
    targetFrameRate: number;
    start(): void;
    stop(): void;
    restart(): void;
}
