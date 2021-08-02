import { once } from "kudzu/events/once";
import { BaseAudioSource } from "./BaseAudioSource";
export class AudioElementSource extends BaseAudioSource {
    constructor(id, source, spatializer) {
        super(id);
        this.source = source;
        this.spatializer = spatializer;
    }
    isPlaying = false;
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
    disposed3 = false;
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