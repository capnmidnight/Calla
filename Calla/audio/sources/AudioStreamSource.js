import { BaseAudioSource } from "./BaseAudioSource";
export class AudioStreamSource extends BaseAudioSource {
    constructor(id, audioContext) {
        super(id, audioContext);
        this.streams = new Map();
    }
}
//# sourceMappingURL=AudioStreamSource.js.map