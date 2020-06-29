import { BaseTimer } from "./BaseTimer.js";

export class SetIntervalTimer extends BaseTimer {

    constructor(targetFrameRate) {
        super(targetFrameRate);
    }

    start() {
        this._lt = performance.now();
        this._timer = setInterval(() => {
            const t = performance.now(), dt = t - this._lt;
            this._lt = t;
            this._onTick(dt);
        }, this._frameTime);
    }

    stop() {
        if (this.isRunning) {
            this.clearInterval(this._timer);
            super.stop();
        }
    }

    get targetFrameRate() {
        return super.targetFrameRate;
    }

    set targetFrameRate(fps) {
        super.targetFrameRate = fps;
        if (this.isRunning) {
            this.restart();
        }
    }
}

