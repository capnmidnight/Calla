import { BaseTimer } from "./BaseTimer.js";

export class SetTimeoutTimer extends BaseTimer {

    constructor(targetFrameRate) {
        super(targetFrameRate);
    }

    start() {
        this._lt = performance.now();
        const updater = () => {
            this._timer = setTimeout(updater, this._frameTime);
            this._onTick(performance.now());
        };
        this._timer = setTimeout(updater, this._frameTime);
    }

    stop() {
        if (this.isRunning) {
            clearTimeout(this._timer);
            super.stop();
        }
    }
}
