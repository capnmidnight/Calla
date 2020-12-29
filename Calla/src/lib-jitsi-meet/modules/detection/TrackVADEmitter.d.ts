/**
 * Connects an audio JitsiLocalTrack to a vadProcessor using WebAudio ScriptProcessorNode.
 * Once an object is created audio from the local track flows through the ScriptProcessorNode as raw PCM.
 * The PCM is processed by the injected vad module and a voice activity detection score is obtained, the
 * score is published to consumers via an EventEmitter.
 * After work is done with this service the destroy method needs to be called for a proper cleanup.
 *
 * @fires VAD_SCORE_PUBLISHED
 */
export default class TrackVADEmitter {
    /**
     * Factory method that sets up all the necessary components for the creation of the TrackVADEmitter.
     *
     * @param {string} micDeviceId - Target microphone device id.
     * @param {number} procNodeSampleRate - Sample rate of the proc node.
     * @param {Object} vadProcessor -Module that calculates the voice activity score for a certain audio PCM sample.
     * The processor needs to implement the following functions:
     * - <tt>getSampleLength()</tt> - Returns the sample size accepted by getSampleLength.
     * - <tt>getRequiredPCMFrequency()</tt> - Returns the PCM frequency at which the processor operates.
     * - <tt>calculateAudioFrameVAD(pcmSample)</tt> - Process a 32 float pcm sample of getSampleLength size.
     * @returns {Promise<TrackVADEmitter>} - Promise resolving in a new instance of TrackVADEmitter.
     */
    static create(micDeviceId: string, procNodeSampleRate: number, vadProcessor: any): Promise<TrackVADEmitter>;
    /**
     * Constructor.
     *
     * @param {number} procNodeSampleRate - Sample rate of the ScriptProcessorNode. Possible values  256, 512, 1024,
     *  2048, 4096, 8192, 16384. Passing other values will default to closes neighbor.
     * @param {Object} vadProcessor - VAD processor that allows us to calculate VAD score for PCM samples.
     * @param {JitsiLocalTrack} jitsiLocalTrack - JitsiLocalTrack corresponding to micDeviceId.
     */
    constructor(procNodeSampleRate: number, vadProcessor: any, jitsiLocalTrack: any);
    /**
     * Get the associated track device ID.
     *
     * @returns {string}
     */
    getDeviceId(): string;
    /**
     * Get the associated track label.
     *
     * @returns {string}
     */
    getTrackLabel(): string;
    /**
     * Start the emitter by connecting the audio graph.
     *
     * @returns {void}
     */
    start(): void;
    /**
     * Stops the emitter by disconnecting the audio graph.
     *
     * @returns {void}
     */
    stop(): void;
    /**
     * Destroy TrackVADEmitter instance (release resources and stop callbacks).
     *
     * @returns {void}
     */
    destroy(): void;
}
