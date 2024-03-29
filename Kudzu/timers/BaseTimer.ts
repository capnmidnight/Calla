import { TypedEventBase } from "../events/EventBase";
import { ITimer, TimerEvents, TimerTickEvent } from "./ITimer";

export abstract class BaseTimer<TimerT>
    extends TypedEventBase<TimerEvents>
    implements ITimer {
    protected _timer: TimerT | null = null;
    protected _onTick: (t: number) => void;
    protected _frameTime = Number.MAX_VALUE;
    private _targetFPS = 0;

    constructor(targetFrameRate: number) {
        super();

        this.targetFrameRate = targetFrameRate;
        const tickEvt = new TimerTickEvent();
        let lt = -1;
        let dt = 0;
        this._onTick = (t: number) => {
            if (lt > 0) {
                tickEvt.t = t;
                tickEvt.dt = t - lt;
                tickEvt.sdt = tickEvt.dt;
                dt = t - lt;

                tickEvt.set(t, dt);
                this.dispatchEvent(tickEvt);
            }

            lt = t;
        };
    }

    restart() {
        this.stop();
        this.start();
    }

    get isRunning() {
        return this._timer != null;
    }

    abstract start(): void;

    stop() {
        this._timer = null;
        this.dispatchEvent(new Event("stopped"));
    }

    get targetFrameRate() {
        return this._targetFPS;
    }

    set targetFrameRate(fps: number) {
        this._targetFPS = fps;
        this._frameTime = 1000 / fps;
    }
}