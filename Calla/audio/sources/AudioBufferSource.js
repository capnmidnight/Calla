import { once } from "kudzu/events/once";
import { BaseAudioBufferSource } from "./BaseAudioBufferSource";
export class AudioBufferSource extends BaseAudioBufferSource {
    constructor(id, audioContext, source, spatializer) {
        super(id, audioContext, source, spatializer);
        this.isPlaying = false;
    }
    async play() {
        this.source.start();
        await once(this.source, "ended");
        this.isPlaying = false;
    }
    stop() {
        this.source.stop();
    }
    dispose() {
        this.stop();
        super.dispose();
    }
}
//# sourceMappingURL=AudioBufferSource.js.map