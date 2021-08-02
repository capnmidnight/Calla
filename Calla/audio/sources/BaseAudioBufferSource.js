import { BaseAudioSource } from "./BaseAudioSource";
export class BaseAudioBufferSource extends BaseAudioSource {
    constructor(id, source, spatializer) {
        super(id);
        this.source = source;
        this.spatializer = spatializer;
    }
}
//# sourceMappingURL=BaseAudioBufferSource.js.map