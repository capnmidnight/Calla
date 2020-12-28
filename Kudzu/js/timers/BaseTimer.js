import { TypedEventBase } from "../events/EventBase";
import { lerp } from "../math/lerp";
export class TimerTickEvent extends Event {
    constructor() {
        super("tick");
        this.t = 0;
        this.dt = 0;
        this.sdt = 0;
        Object.seal(this);
    }
    copy(evt) {
        this.t = evt.t;
        this.dt = evt.dt;
        this.sdt = evt.sdt;
    }
    set(t, dt) {
        this.t = t;
        this.dt = dt;
        this.sdt = lerp(this.sdt, dt, 0.01);
    }
}
export class BaseTimer extends TypedEventBase {
    constructor(targetFrameRate) {
        super();
        this._timer = null;
        this._frameTime = Number.MAX_VALUE;
        this._targetFPS = 0;
        this.targetFrameRate = targetFrameRate;
        this._onTick = (t) => {
            const tickEvt = new TimerTickEvent();
            let lt = t;
            this._onTick = (t) => {
                if (t > lt) {
                    tickEvt.t = t;
                    tickEvt.dt = t - lt;
                    tickEvt.sdt = tickEvt.dt;
                    lt = t;
                    this._onTick = (t) => {
                        let dt = t - lt;
                        if (dt < -1000) {
                            lt = t - this._frameTime;
                            dt = this._frameTime;
                        }
                        if (dt > 0 && dt >= this._frameTime) {
                            tickEvt.set(t, dt);
                            lt = t;
                            this.dispatchEvent(tickEvt);
                        }
                    };
                }
            };
        };
    }
    restart() {
        this.stop();
        this.start();
    }
    get isRunning() {
        return this._timer != null;
    }
    stop() {
        this._timer = null;
        this.dispatchEvent(new Event("stopped"));
    }
    get targetFrameRate() {
        return this._targetFPS;
    }
    set targetFrameRate(fps) {
        this._targetFPS = fps;
        this._frameTime = 1000 / fps;
    }
}
//# sourceMappingURL=BaseTimer.js.map