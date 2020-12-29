import { RenderingMode } from "../../../omnitone/rendering-mode";
import { ResonanceAudio } from "../../../resonance-audio/resonance-audio";
import { Material } from "../../../resonance-audio/utils";
import { Direction } from "../../../resonance-audio/Direction";
import { ResonanceAudioNode } from "../nodes/ResonanceAudioNode";
import { BaseListener } from "./BaseListener";
/**
 * An audio positioner that uses Google's Resonance Audio library
 **/
export class ResonanceAudioListener extends BaseListener {
    /**
     * Creates a new audio positioner that uses Google's Resonance Audio library
     */
    constructor(audioContext, destination) {
        super(audioContext, destination);
        this.scene = new ResonanceAudio(audioContext, {
            ambisonicOrder: 1,
            renderingMode: RenderingMode.Bypass
        });
        this.scene.output.connect(this.gain);
        this.scene.setRoomProperties({
            width: 10,
            height: 5,
            depth: 10,
        }, {
            [Direction.Left]: Material.Transparent,
            [Direction.Right]: Material.Transparent,
            [Direction.Front]: Material.Transparent,
            [Direction.Back]: Material.Transparent,
            [Direction.Down]: Material.Grass,
            [Direction.Up]: Material.Transparent,
        });
        Object.seal(this);
    }
    /**
     * Performs the spatialization operation for the audio source's latest location.
     */
    update(loc, _t) {
        const { p, f, u } = loc;
        this.scene.setListenerPosition(p);
        this.scene.setListenerOrientation(f, u);
    }
    /**
     * Creates a spatialzer for an audio source.
     */
    createSpatializer(id, source, spatialize, audioContext) {
        if (spatialize) {
            return new ResonanceAudioNode(id, source, audioContext, this.scene);
        }
        else {
            return super.createSpatializer(id, source, spatialize, audioContext);
        }
    }
}
//# sourceMappingURL=ResonanceAudioListener.js.map