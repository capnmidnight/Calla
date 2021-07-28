import { arrayClear } from "kudzu/arrays/arrayClear";
import { arrayRemove } from "kudzu/arrays/arrayRemove";
import { once } from "kudzu/events/once";
import { nameVertex } from "../GraphVisualizer";
import { AudioBufferSource } from "./AudioBufferSource";
import { BaseAudioBufferSource } from "./BaseAudioBufferSource";
export class AudioBufferSpawningSource extends BaseAudioBufferSource {
    counter = 0;
    playingSources = new Array();
    constructor(id, audioContext, source, spatializer) {
        super(id, audioContext, source, spatializer);
    }
    connectSpatializer() {
        // do nothing, this node doesn't play on its own
    }
    disconnectSpatializer() {
        // do nothing, this node doesn't play on its own
    }
    get isPlaying() {
        for (const source of this.playingSources) {
            if (source.isPlaying) {
                return true;
            }
        }
        return false;
    }
    async play() {
        const newBuffer = nameVertex("buffer-source-" + this.id, this.source.context.createBufferSource());
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
    stop() {
        for (const source of this.playingSources) {
            source.dispose();
        }
        arrayClear(this.playingSources);
    }
    disposed3 = false;
    dispose() {
        if (!this.disposed3) {
            this.stop();
            super.dispose();
            this.disposed3 = true;
        }
    }
}
//# sourceMappingURL=AudioBufferSpawningSource.js.map