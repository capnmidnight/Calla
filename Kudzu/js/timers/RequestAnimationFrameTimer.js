import { BaseTimer } from "./BaseTimer";
export class RequestAnimationFrameTimer extends BaseTimer {
    constructor() {
        super(120);
    }
    start() {
        const updater = (t) => {
            this._timer = requestAnimationFrame(updater);
            this._onTick(t);
        };
        this._timer = requestAnimationFrame(updater);
    }
    stop() {
        if (this._timer) {
            cancelAnimationFrame(this._timer);
            super.stop();
        }
    }
}
//# sourceMappingURL=RequestAnimationFrameTimer.js.map