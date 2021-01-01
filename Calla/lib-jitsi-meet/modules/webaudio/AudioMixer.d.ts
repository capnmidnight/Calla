/**
 * The AudioMixer, as the name implies, mixes a number of MediaStreams containing audio tracks into a single
 * MediaStream.
 */
export default class AudioMixer {
    /**
     * Add audio MediaStream to be mixed, if the stream doesn't contain any audio tracks it will be ignored.
     *
     * @param {MediaStream} stream - MediaStream to be mixed.
     */
    addMediaStream(stream: any): void;
    /**
     * At this point a WebAudio ChannelMergerNode is created and and the two associated MediaStreams are connected to
     * it; the resulting mixed MediaStream is returned.
     *
     * @returns {MediaStream} - MediaStream containing added streams mixed together, or null if no MediaStream
     * is added.
     */
    start(): any;
    /**
     * Disconnect MediaStreamAudioSourceNode and clear references.
     *
     * @returns {void}
     */
    reset(): void;
}
