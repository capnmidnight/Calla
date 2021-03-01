import { once } from "kudzu/events/once";
import { BaseAudioSource } from "./BaseAudioSource";
export class AudioElementSource extends BaseAudioSource {
    constructor(id, audioContext, source, spatializer) {
        super(id, audioContext);
        this.isPlaying = false;
        this.disposed3 = false;
        this.source = source;
        this.spatializer = spatializer;
    }
    async play() {
        this.isPlaying = true;
        await this.source.mediaElement.play();
        if (!this.source.mediaElement.loop) {
            await once(this.source.mediaElement, "ended");
            this.isPlaying = false;
        }
    }
    stop() {
        this.source.mediaElement.pause();
        this.source.mediaElement.currentTime = 0;
        this.isPlaying = false;
    }
    dispose() {
        if (!this.disposed3) {
            if (this.source.mediaElement.parentElement) {
                this.source.mediaElement.parentElement.removeChild(this.source.mediaElement);
            }
            super.dispose();
            this.disposed3 = false;
        }
    }
}
//# sourceMappingURL=AudioElementSource.js.map