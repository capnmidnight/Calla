import { BaseAudioSource } from "./BaseAudioSource";
export class AudioStreamSource extends BaseAudioSource {
    streams = new Map();
    constructor(id, audioContext) {
        super(id, audioContext);
    }
}
//# sourceMappingURL=AudioStreamSource.js.map