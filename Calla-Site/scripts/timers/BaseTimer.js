import { EventBase, lerp } from "../lib/calla";

export class TimerTickEvent extends Event {
    constructor() {
        super("tick");
        this.t = 0;
        this.dt = 0;
        this.sdt = 0;
        Object.seal(this);
    }

    /**
     * @param {TimerTickEvent} evt
     */
    copy(evt) {
        this.t = evt.t;
        this.dt = evt.dt;
        this.sdt = evt.sdt;
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
                if (t > lt) {
                    tickEvt.t = t;
                    tickEvt.dt = t - lt;
                    tickEvt.sdt = tickEvt.dt;
                    lt = t;
                    /**
                     * @param {number} t
                     */
                    this._onTick = (t) => {
                        const dt = t - lt;
                        if (dt > 0 && dt >= this._frameTime) {
                            tickEvt.t = t;
                            tickEvt.dt = dt;
                            tickEvt.sdt = lerp(tickEvt.sdt, tickEvt.dt, 0.01);
                            lt = t;
                            this.dispatchEvent(tickEvt);
                        }
                    }
                }
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