import { createWorker } from "./createWorker.js";
import { BaseTimer } from "./BaseTimer.js";

export class WorkerTimer extends BaseTimer {

    constructor(targetFrameRate) {
        super(targetFrameRate);

        this._running = false;
        this._timer = createWorker(function () {
            let lt = 0,
                dt = null,
                running = false;
            onmessage = function (e) {
                if (e.data === "stop") {
                    running = false;
                } else {
                    const fps = parseFloat(e.data);
                    if (fps === Math.floor(fps)) {
                        dt = 1000 / fps;
                        if (!running) {
                            running = true;
                            loop();
                        }
                    }
                }
            };

            function loop() {
                while (running) {
                    var t = performance.now();
                    if (t - lt >= dt) {
                        postMessage("ok");
                        lt = t;
                    }
                }
            }
        });

        this._timer.onmessage = () => this._onTick(performance.now());
    }

    get targetFrameRate() {
        return super.targetFrameRate;
    }

    set targetFrameRate(fps) {
        super.targetFrameRate = fps;
        if (this.isRunning) {
            this._timer.postMessage(fps);
        }
    }

    start() {
        this._timer.postMessage(this.targetFrameRate);
    }

    stop() {
        if (this.isRunning) {
            this._timer.postMessage("stop");
        }
    }

    get isRunning() {
        return this._running;
    }
}