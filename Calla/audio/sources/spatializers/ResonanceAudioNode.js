import { connect } from "../../GraphVisualizer";
import { BaseEmitter } from "./BaseEmitter";
/**
 * A spatializer that uses Google's Resonance Audio library.
 **/
export class ResonanceAudioNode extends BaseEmitter {
    /**
     * Creates a new spatializer that uses Google's Resonance Audio library.
     */
    constructor(audioContext, destination, res) {
        super(audioContext, destination);
        this.resScene = res;
        this.resNode = res.createSource(undefined);
        this.input = this.resNode.input;
        this.output = this.resNode.output;
        connect(this.output, this.destination);
        Object.seal(this);
    }
    createNew() {
        return new ResonanceAudioNode(this.audioContext, this.destination, this.resScene);
    }
    /**
     * Performs the spatialization operation for the audio source's latest location.
     */
    update(loc, _t) {
        const { p, f, u } = loc;
        this.resNode.setPosition(p);
        this.resNode.setOrientation(f, u);
    }
    /**
     * Sets parameters that alter spatialization.
     **/
    setAudioProperties(minDistance, maxDistance, rolloff, algorithm, transitionTime) {
        super.setAudioProperties(minDistance, maxDistance, rolloff, algorithm, transitionTime);
        this.resNode.setMinDistance(this.minDistance);
        this.resNode.setMaxDistance(this.maxDistance);
        this.resNode.setGain(1 / this.rolloff);
        this.resNode.setRolloff(this.algorithm);
    }
    /**
     * Discard values and make this instance useless.
     */
    dispose() {
        this.resScene.removeSource(this.resNode);
        this.resNode = null;
        super.dispose();
    }
}
//# sourceMappingURL=ResonanceAudioNode.js.map