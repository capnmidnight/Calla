import type { AttenuationRolloff } from "../../../resonance-audio/AttenuationRolloff";
import type { ResonanceAudio } from "../../../resonance-audio/resonance-audio";
import type { Source } from "../../../resonance-audio/source";
import type { Pose } from "../../positions/Pose";
import { BaseWebAudioNode } from "./BaseWebAudioNode";

/**
 * A spatializer that uses Google's Resonance Audio library.
 **/
export class ResonanceAudioNode extends BaseWebAudioNode<GainNode> {
    resScene: ResonanceAudio;
    resNode: Source;

    /**
     * Creates a new spatializer that uses Google's Resonance Audio library.
     */
    constructor(id: string, source: AudioNode, audioContext: AudioContext, res: ResonanceAudio) {
        const resNode = res.createSource(undefined);
        super(id, source, audioContext, resNode.input);

        this.resScene = res;
        this.resNode = resNode;
        Object.seal(this);
    }

    /**
     * Performs the spatialization operation for the audio source's latest location.
     */
    update(loc: Pose, _t: number): void {
        const { p, f, u } = loc;
        this.resNode.setPosition(p);
        this.resNode.setOrientation(f, u);
    }

    /**
     * Sets parameters that alter spatialization.
     **/
    setAudioProperties(minDistance: number, maxDistance: number, rolloff: number, algorithm: DistanceModelType, transitionTime: number): void {
        super.setAudioProperties(minDistance, maxDistance, rolloff, algorithm, transitionTime);
        this.resNode.setMinDistance(this.minDistance);
        this.resNode.setMaxDistance(this.maxDistance);
        this.resNode.setGain(1 / this.rolloff);
        this.resNode.setRolloff(this.algorithm as AttenuationRolloff);
    }

    /**
     * Discard values and make this instance useless.
     */
    dispose(): void {
        this.resScene.removeSource(this.resNode);
        this.resNode = null;
        super.dispose();
    }
}