import { InterpolatedPosition } from "./InterpolatedPosition.js";
import "../../../lib/resonance-audio.js";

export class GoogleResonanceAudioScene extends InterpolatedPosition {
    /**
     *
     * @param {AudioContext} audioContext
     */
    constructor(audioContext) {
        super();

        this.scene = new ResonanceAudio(audioContext, {
            ambisonicOrder: 3
        });
        this.scene.output.connect(audioContext.destination);

        this.position = new InterpolatedPosition();

        this.scene.setRoomProperties({
            width: 10,
            height: 5,
            depth: 10,
        }, {
            left: "transparent",
            right: "transparent",
            front: "transparent",
            back: "transparent",
            down: "grass",
            up: "transparent",
        });
    }

    update(t) {
        super.update(t);
        this.scene.setListenerPosition(this.x, 0, this.y);
    }
}
