import { ResonanceAudio } from "../../../../lib/resonance-audio/src/resonance-audio";
import { ResonanceSource } from "../sources/ResonanceSource";
import { BaseListener } from "./BaseListener";

/**
 * An audio positioner that uses Google's Resonance Audio library
 **/
export class ResonanceScene extends BaseListener {
    /**
     * Creates a new audio positioner that uses Google's Resonance Audio library
     * @param {AudioContext} audioContext
     */
    constructor(audioContext) {
        super();

        this.scene = new ResonanceAudio(audioContext, {
            ambisonicOrder: 1,
            renderingMode: "bypass"
        });
        
        this.scene.output.connect(audioContext.destination);

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

        Object.seal(this);
    }

    /**
     * Performs the spatialization operation for the audio source's latest location.
     * @param {import("../../positions/Pose").Pose} loc
     */
    update(loc) {
        super.update(loc);
        const { p, f, u } = loc;
        this.scene.setListenerPosition(p.x, p.y, p.z);
        this.scene.setListenerOrientation(f.x, f.y, f.z, u.x, u.y, u.z);
    }

    /**
     * Creates a spatialzer for an audio source.
     * @private
     * @param {string} id
     * @param {MediaStream|HTMLAudioElement} stream - the audio element that is being spatialized.
     * @param {boolean} spatialize - whether or not the audio stream should be spatialized. Stereo audio streams that are spatialized will get down-mixed to a single channel.
     * @param {AudioContext} audioContext
     * @return {import("../sources/BaseSource").BaseSource}
     */
    createSource(id, stream, spatialize, audioContext) {
        if (spatialize) {
            return new ResonanceSource(id, stream, audioContext, this.scene);
        }
        else {
            return super.createSource(id, stream, spatialize, audioContext);
        }
    }
}
