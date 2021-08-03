import { TypedEventBase } from "../events/EventBase";
import { lerp } from "../math/lerp";

export class TimerTickEvent extends Event {
    t = 0;
    dt = 0;
    sdt = 0;
    constructor() {
        super("tick");
        Object.seal(this);
    }

    copy(evt: TimerTickEvent) {
        this.t = evt.t;
        this.dt = evt.dt;
        this.sdt = evt.sdt;
    }

    set(t: number, dt: number) {
        this.t = t;
        this.dt = dt;
        this.sdt = lerp(this.sdt, dt, 0.01);
    }
}

export interface TimerEvents {
    stopped: Event,
    tick: TimerTickEvent;
}

export interface ITimer extends TypedEventBase<TimerEvents> {
    isRunning: boolean;
    targetFrameRate: number;
    start(): void;
    stop(): void;
    restart(): void;
}
