import { EventBase } from "../../lib/Calla.js";

class TimerTickEvent extends Event {
    constructor() {
        super("tick");
        this.dt = 0;
        this.t = 0;
        Object.seal(this);
    }
}

export class BaseTimer extends EventBase {

    /**
     * 
     * @param {number} targetFrameRate
     */
    constructor(targetFrameRate) {
        super();

        this._timer = null;
        this.targetFrameRate = targetFrameRate;

        /**
         * @param {number} t
         */
        this._onTick = (t) => {
            const tickEvt = new TimerTickEvent();
            let lt = t;
            /**
             * @param {number} t
             */
            this._onTick = (t) => {
                tickEvt.t = t;
                tickEvt.dt = t - lt;
                lt = t;
                this.dispatchEvent(tickEvt);
            }
        };
    }

    restart() {
        this.stop();
        this.start();
    }

    get isRunning() {
        return this._timer !== null;
    }

    start() {
        throw new Error("Not implemented in base class");
    }

    stop() {
        this._timer = null;
    }

    /** @type {number} */
    get targetFrameRate() {
        return this._targetFPS;
    }

    set targetFrameRate(fps) {
        this._targetFPS = fps;
        this._frameTime = 1000 / fps;
    }
}