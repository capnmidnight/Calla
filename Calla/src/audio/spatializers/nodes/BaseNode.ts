import { arrayClear, arrayRemove, once } from "kudzu";
import { BaseSpatializer } from "../BaseSpatializer";

/**
 * Base class providing functionality for audio sources.
 **/
export abstract class BaseNode extends BaseSpatializer {
    private playingSources: Array<AudioBufferSourceNode>;

    /**
     * Creates a spatializer that keeps track of the relative position
     * of an audio element to the listener destination.
     * @param id
     * @param stream
     * @param audioContext - the output WebAudio context
     * @param node - this node out to which to pipe the stream
     */
    constructor(public id: string, public source: AudioNode, audioContext: AudioContext) {
        super(audioContext);

        if (this.source instanceof AudioBufferSourceNode) {
            this.playingSources = new Array<AudioBufferSourceNode>();
        }
        else {
            this.source.connect(this.gain);
        }
    }

    /**
     * Discard values and make this instance useless.
     */
    dispose(): void {
        if (this.source) {
            this.source.disconnect();
            this.source = null;
        }

        super.dispose();
    }

    get isPlaying(): boolean {
        return this.playingSources.length > 0;
    }

    async play(): Promise<void> {
        if (this.source instanceof AudioBufferSourceNode) {
            const newSource = this.source.context.createBufferSource();
            this.playingSources.push(newSource);
            newSource.buffer = this.source.buffer;
            newSource.loop = this.source.loop;
            newSource.connect(this.gain);
            newSource.start();

            if (!this.source.loop) {
                await once(newSource, "ended");
                if (this.playingSources.indexOf(newSource) >= 0) {
                    newSource.stop();
                    newSource.disconnect(this.gain);
                    arrayRemove(this.playingSources, newSource);
                }
            }
        }
    }

    stop(): void {
        if (this.source instanceof AudioBufferSourceNode) {
            for (const source of this.playingSources) {
                source.stop();
                source.disconnect(this.gain);
            }

            arrayClear(this.playingSources);
        }
    }
}

