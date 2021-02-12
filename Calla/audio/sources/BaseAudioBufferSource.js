import { BaseAudioSource } from "./BaseAudioSource";
export class BaseAudioBufferSource extends BaseAudioSource {
    constructor(id, audioContext, source, spatializer) {
        super(id, audioContext);
        this.source = source;
        this.spatializer = spatializer;
    }
}
//# sourceMappingURL=BaseAudioBufferSource.js.map