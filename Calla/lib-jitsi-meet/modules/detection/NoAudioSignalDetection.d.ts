/**
 * Detect if there is no audio input on the current TraceAblePeerConnection selected track. The no audio
 * state must be constant for a configured amount of time in order for the event to be triggered.
 * @fires DetectionEvents.AUDIO_INPUT_STATE_CHANGE
 * @fires DetectionEvents.NO_AUDIO_INPUT
 */
export default class NoAudioSignalDetection {
    /**
     * Creates new NoAudioSignalDetection.
     *
     * @param conference the JitsiConference instance that created us.
     * @constructor
     */
    constructor(conference: any);
}
