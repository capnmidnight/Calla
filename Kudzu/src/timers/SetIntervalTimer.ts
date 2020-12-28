import { BaseTimer } from "./BaseTimer";

export class SetIntervalTimer extends BaseTimer<NodeJS.Timeout> {

    constructor(targetFrameRate: number) {
        super(targetFrameRate);
    }

    start() {
        this._timer = setInterval(
            () => this._onTick(performance.now()),
            this._frameTime);
    }

    stop() {
        if (this._timer) {
            clearInterval(this._timer);
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

