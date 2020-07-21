import { BaseTimer } from "./BaseTimer.js";

export class RequestAnimationFrameTimer extends BaseTimer {
    constructor() {
        super(60);
    }

    start() {
        const updater = (t) => {
            const dt = t - this._lt;
            this._lt = t;
            this._timer = requestAnimationFrame(updater);
            this._onTick(dt);
        };
        this._lt = performance.now();
        this._timer = requestAnimationFrame(updater);
    }

    stop() {
        if (this.isRunning) {
            cancelAnimationFrame(this._timer);
            super.stop();
        }
    }

    get targetFrameRate() {
        return super.targetFrameRate;
    }

    set targetFrameRate(fps) {
    }
}
