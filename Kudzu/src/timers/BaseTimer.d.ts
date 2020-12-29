import { TypedEventBase } from "../events/EventBase";
export declare class TimerTickEvent extends Event {
    t: number;
    dt: number;
    sdt: number;
    constructor();
    copy(evt: TimerTickEvent): void;
    set(t: number, dt: number): void;
}
interface TimerEvents {
    stopped: Event;
    tick: TimerTickEvent;
}
export declare abstract class BaseTimer<TimerT> extends TypedEventBase<TimerEvents> {
    protected _timer: TimerT | null;
    protected _onTick: (t: number) => void;
    protected _frameTime: number;
    private _targetFPS;
    constructor(targetFrameRate: number);
    restart(): void;
    get isRunning(): boolean;
    abstract start(): void;
    stop(): void;
    get targetFrameRate(): number;
    set targetFrameRate(fps: number);
}
export {};
