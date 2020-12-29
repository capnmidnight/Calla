import { BaseWebAudioNode } from "./BaseWebAudioNode";
/**
 * A spatializer that uses Google's Resonance Audio library.
 **/
export class ResonanceAudioNode extends BaseWebAudioNode {
    /**
     * Creates a new spatializer that uses Google's Resonance Audio library.
     */
    constructor(id, source, audioContext, res) {
        const resNode = res.createSource(undefined);
        super(id, source, audioContext, resNode.input);
        this.resScene = res;
        this.resNode = resNode;
        Object.seal(this);
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