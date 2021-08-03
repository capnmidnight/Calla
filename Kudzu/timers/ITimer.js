import { lerp } from "../math/lerp";
export class TimerTickEvent extends Event {
    t = 0;
    dt = 0;
    sdt = 0;
    constructor() {
        super("tick");
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
//# sourceMappingURL=ITimer.js.map