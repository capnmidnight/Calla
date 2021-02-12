import { BaseAudioSource } from "./BaseAudioSource";
export class AudioElementSource extends BaseAudioSource {
    constructor(id, audioContext, source, spatializer) {
        super(id, audioContext);
        this.isPlaying = false;
        this.source = source;
        this.spatializer = spatializer;
    }
    async play() {
        this.isPlaying = true;
        await this.source.mediaElement.play();
        this.isPlaying = false;
    }
    stop() {
        this.source.mediaElement.pause();
        this.source.mediaElement.currentTime = 0;
        this.isPlaying = false;
    }
    dispose() {
        if (this.source.mediaElement.parentElement) {
            this.source.mediaElement.parentElement.removeChild(this.source.mediaElement);
        }
        super.dispose();
    }
}
//# sourceMappingURL=AudioElementSource.js.map