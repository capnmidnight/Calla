const tickEvt = Object.assign(new Event("tick"), {
    dt: 0
});

export class BaseTimer extends EventTarget {

    /**
     * 
     * @param {number} targetFrameRate
     */
    constructor(targetFrameRate) {
        super();
        this._lt = 0;
        this._timer = null;
        this.targetFrameRate = targetFrameRate;
    }

    /**
     * 
     * @param {number} dt
     */
    _onTick(dt) {
        tickEvt.dt = dt;
        this.dispatchEvent(tickEvt);
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