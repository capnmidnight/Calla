import { connect } from "kudzu/audio";
import type { AttenuationRolloff } from "../../../resonance-audio/AttenuationRolloff";
import type { ResonanceAudio } from "../../../resonance-audio/resonance-audio";
import type { Source } from "../../../resonance-audio/source";
import type { Pose } from "../../positions/Pose";
import { BaseEmitter } from "./BaseEmitter";

/**
 * A spatializer that uses Google's Resonance Audio library.
 **/
export class ResonanceAudioNode extends BaseEmitter {
    resScene: ResonanceAudio;
    resNode: Source;

    /**
     * Creates a new spatializer that uses Google's Resonance Audio library.
     */
    constructor(destination: AudioNode, res: ResonanceAudio) {
        super(destination);
        this.resScene = res;
        this.resNode = res.createSource(undefined);
        this.input = this.resNode.input;
        this.output = this.resNode.output;

        connect(this, this.destination);

        Object.seal(this);
    }

    protected createNew(): ResonanceAudioNode {
        return new ResonanceAudioNode(this.destination, this.resScene);
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