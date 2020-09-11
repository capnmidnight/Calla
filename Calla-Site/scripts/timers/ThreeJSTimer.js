import { BaseTimer } from "./BaseTimer";

/** @type {WeakMap<ThreeJSTimer,import("three").WebGLRenderer>} */
const renderers = new WeakMap();

export class ThreeJSTimer extends BaseTimer {
    /**
     * @param {import("three").WebGLRenderer} renderer
     */
    constructor(renderer) {
        super(120);
        renderers.set(this, renderer);
    }

    start() {
        const renderer = renderers.get(this);
        const updater = (t) => {
            this._onTick(t);
        };
        this._timer = renderer.setAnimationLoop(updater);
    }

    stop() {
        if (this.isRunning) {
            const renderer = renderers.get(this);
            renderer.setAnimationLoop(null);
            super.stop();
        }
    }
}
