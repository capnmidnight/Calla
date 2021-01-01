/**
 * Connects a TrackVADEmitter to the target conference local audio track and manages various services that use
 * the data to produce audio analytics (VADTalkMutedDetection and VADNoiseDetection).
 */
export default class VADAudioAnalyser {
    /**
     * Creates <tt>VADAudioAnalyser</tt>
     * @param {JitsiConference} conference - JitsiConference instance that created us.
     * @param {Object} createVADProcessor - Function that creates a Voice activity detection processor. The processor
     * needs to implement the following functions:
     * - <tt>getSampleLength()</tt> - Returns the sample size accepted by getSampleLength.
     * - <tt>getRequiredPCMFrequency()</tt> - Returns the PCM frequency at which the processor operates.
     * - <tt>calculateAudioFrameVAD(pcmSample)</tt> - Process a 32 float pcm sample of getSampleLength size.
     * @constructor
     */
    constructor(conference: any, createVADProcessor: any);
    /**
     * Attach a VAD detector service to the analyser and handle it's state changes.
     *
     * @param {Object} vadTMDetector
     */
    addVADDetectionService(vadService: any): void;
}
import TrackVADEmitter from "./TrackVADEmitter";
