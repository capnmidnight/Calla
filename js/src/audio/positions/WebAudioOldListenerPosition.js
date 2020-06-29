import { InterpolatedPosition } from "./InterpolatedPosition.js";

export class WebAudioOldListenerPosition extends InterpolatedPosition {

    /**
     * 
     * @param {AudioListener} listener
     */
    constructor(listener) {
        super();
        
        this.listener = listener;
        this.listener.setPosition(0, 0, 0);
        this.listener.setOrientation(0, 0, -1, 0, 1, 0);
    }

    /**
     * 
     * @param {number} t
     */
    update(t) {
        super.update(t);
        this.listener.setPosition(this.x, 0, this.y);
    }
}
