import { once } from "kudzu/events/once";
import { BaseAudioSource } from "./BaseAudioSource";
import { IPlayableSource } from "./IPlayableSource";
import { BaseEmitter } from "./spatializers/BaseEmitter";


export class AudioElementSource
    extends BaseAudioSource<MediaElementAudioSourceNode>
    implements IPlayableSource {

    constructor(id: string, source: MediaElementAudioSourceNode, spatializer: BaseEmitter) {
        super(id);

        this.source = source;
        this.spatializer = spatializer;
    }

    isPlaying = false;

    async play(): Promise<void> {
        this.isPlaying = true;
        await this.source.mediaElement.play();

        if (!this.source.mediaElement.loop) {
            await once(this.source.mediaElement, "ended");
            this.isPlaying = false;
        }
    }

    stop(): void {
        this.source.mediaElement.pause();
        this.source.mediaElement.currentTime = 0;
        this.isPlaying = false;
    }

    private disposed3 = false;
    dispose(): void {
        if (!this.disposed3) {
            if (this.source.mediaElement.parentElement) {
                this.source.mediaElement.parentElement.removeChild(this.source.mediaElement);
            }

            super.dispose();
            this.disposed3 = false;
        }
    }
}
