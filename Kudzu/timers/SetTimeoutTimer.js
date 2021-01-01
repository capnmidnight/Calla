import { BaseTimer } from "./BaseTimer";
export class SetTimeoutTimer extends BaseTimer {
    constructor(targetFrameRate) {
        super(targetFrameRate);
    }
    start() {
        const updater = () => {
            this._timer = setTimeout(updater, this._frameTime);
            this._onTick(performance.now());
        };
        this._timer = setTimeout(updater, this._frameTime);
    }
    stop() {
        if (this._timer) {
            clearTimeout(this._timer);
            super.stop();
        }
    }
}
//# sourceMappingURL=SetTimeoutTimer.js.map