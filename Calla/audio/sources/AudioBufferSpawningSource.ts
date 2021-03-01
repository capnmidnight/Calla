import { arrayClear } from "kudzu/arrays/arrayClear";
import { arrayRemove } from "kudzu/arrays/arrayRemove";
import { once } from "kudzu/events/once";
import { AudioBufferSource } from "./AudioBufferSource";
import { BaseAudioBufferSource } from "./BaseAudioBufferSource";
import { BaseEmitter } from "./spatializers/BaseEmitter";

export class AudioBufferSpawningSource extends BaseAudioBufferSource {
    private counter = 0;
    private playingSources = new Array<AudioBufferSource>();

    constructor(id: string, audioContext: BaseAudioContext, source: AudioBufferSourceNode, spatializer: BaseEmitter) {
        super(id, audioContext, source, spatializer);
    }

    protected connectSpatializer() {
        // do nothing, this node doesn't play on its own
    }

    protected disconnectSpatializer() {
        // do nothing, this node doesn't play on its own
    }

    get isPlaying(): boolean {
        for (const source of this.playingSources) {
            if (source.isPlaying) {
                return true;
            }
        }

        return false;
    }

    async play(): Promise<void> {
        const newBuffer = this.source.context.createBufferSource();
        newBuffer.buffer = this.source.buffer;
        newBuffer.loop = this.source.loop;

        const newSpatializer = this.spatializer.clone();

        const newSource = new AudioBufferSource(`${this.id}-${this.counter++}`, this.audioContext, newBuffer, newSpatializer);
        newSource.spatializer = newSpatializer;

        this.playingSources.push(newSource);

        newSource.play();

        if (!this.source.loop) {
            await once(newBuffer, "ended");
            if (this.playingSources.indexOf(newSource) >= 0) {
                newSource.dispose();
                arrayRemove(this.playingSources, newSource);
            }
        }
    }

    stop(): void {
        for (const source of this.playingSources) {
            source.dispose();
        }

        arrayClear(this.playingSources);
    }

    private disposed3 = false;
    dispose(): void {
        if (!this.disposed3) {
            this.stop();
            super.dispose();
            this.disposed3 = true;
        }
    }
}
