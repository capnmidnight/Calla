import { InterpolatedPosition } from "./InterpolatedPosition.js";

export class GoogleResonanceAudioScene extends InterpolatedPosition {
    /**
     *
     * @param {AudioContext} audioContext
     */
    constructor(audioContext) {
        super();

        this.scene = new ResonanceAudio(audioContext);
        this.scene.output.connect(audioContext.destination);

        this.position = new InterpolatedPosition();

        this.scene.setRoomProperties({
            width: 3.1,
            height: 2.5,
            depth: 3.4,
        }, {
            left: 'brick-bare',
            right: 'curtain-heavy',
            front: 'marble',
            back: 'glass-thin',
            down: 'grass',
            up: 'transparent',
        });
    }

    update(t) {
        super.update(t);
        this.scene.setListenerPosition(this.x, 0, this.y);
    }
}
