import { TypedEventBase } from "../events/EventBase";
import { ITimer, TimerEvents } from "./ITimer";
export declare abstract class BaseTimer<TimerT> extends TypedEventBase<TimerEvents> implements ITimer {
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
