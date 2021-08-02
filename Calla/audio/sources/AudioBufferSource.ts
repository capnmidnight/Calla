import { once } from "kudzu/events/once";
import { BaseAudioBufferSource } from "./BaseAudioBufferSource";
import { BaseEmitter } from "./spatializers/BaseEmitter";

export class AudioBufferSource extends BaseAudioBufferSource {
    public isPlaying = false;

    constructor(id: string, source: AudioBufferSourceNode, spatializer: BaseEmitter) {
        super(id, source, spatializer);
    }


    async play(): Promise<void> {
        this.source.start();
        await once(this.source, "ended");
        this.isPlaying = false;
    }

    stop(): void {
        this.source.stop();
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


