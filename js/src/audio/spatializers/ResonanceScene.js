/* global ResonanceAudio */

import "../../../lib/resonance-audio.js";
import { Destination } from "../Destination.js";
import { InterpolatedPose } from "../positions/InterpolatedPose.js";
import { BaseListener } from "./BaseListener.js";
import { ResonanceSource } from "./ResonanceSource.js";

/**
 * An audio positioner that uses Google's Resonance Audio library
 **/
export class ResonanceScene extends BaseListener {
    /**
     * Creates a new audio positioner that uses Google's Resonance Audio library
     * @param {Destination} destination
     */
    constructor(destination) {
        super(destination);

        this.scene = new ResonanceAudio(destination.audioContext, {
            ambisonicOrder: 3
        });
        this.scene.output.connect(destination.audioContext.destination);

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

    /**
     * @param {InterpolatedPose} pose
     */
    update(pose) {
        super.update(pose);
        const { p, f, u } = pose.current;
        this.scene.setListenerPosition(p.x, p.y, p.z);
        this.scene.setListenerOrientation(f.x, f.y, f.z, u.x, u.y, u.z);
    }

    /**
     * Creates a spatialzer for an audio source.
     * @private
     * @param {MediaStream|HTMLAudioElement} stream - the audio element that is being spatialized.
     * @param {number} bufferSize - the size of the analysis buffer to use for audio activity detection
     * @return {BaseSource}
     */
    createSource(stream, bufferSize) {
        return new ResonanceSource(this.destination, stream, bufferSize);
    }
}
