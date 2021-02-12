import { BaseAudioSource } from "./BaseAudioSource";
import { IPlayableSource } from "./IPlayableSource";
import { BaseEmitter } from "./spatializers/BaseEmitter";


export class AudioElementSource
    extends BaseAudioSource<MediaElementAudioSourceNode>
    implements IPlayableSource {

    constructor(id: string, audioContext: BaseAudioContext, source: MediaElementAudioSourceNode, spatializer: BaseEmitter) {
        super(id, audioContext);

        this.source = source;
        this.spatializer = spatializer;
    }

    isPlaying = false;

    async play(): Promise<void> {
        this.isPlaying = true;
        await this.source.mediaElement.play();
        this.isPlaying = false;
    }

    stop(): void {
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
