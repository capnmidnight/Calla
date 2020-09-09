import { BaseSource } from "./BaseSource";


export class DirectSource extends BaseSource {
    /**
     * Creates a new "spatializer" that performs no panning. An anti-spatializer.
     * @param {string} id
     * @param {MediaStream|HTMLAudioElement} stream
     * @param {AudioContext} audioContext
     */
    constructor(id, stream, audioContext) {
        super(id, stream, audioContext, (source) => {
            source.connect(audioContext.destination);
        });
    }
}
