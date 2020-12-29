/**
 * Voice activity detection reporting service. The service create TrackVADEmitters for the provided devices and
 * publishes an average of their VAD score over the specified interval via EventEmitter.
 * The service is not reusable if destroyed a new one needs to be created, i.e. when a new device is added to the system
 * a new service needs to be created and the old discarded.
 */
export default class VADReportingService {
    /**
     * Factory methods that creates the TrackVADEmitters for the associated array of devices and instantiates
     * a VADReportingService.
     *
     * @param {Array<MediaDeviceInfo>} micDeviceList - Device list that is monitored inside the service.
     * @param {number} intervalDelay - Delay at which to publish VAD score for monitored devices.
     * @param {Object} createVADProcessor - Function that creates a Voice activity detection processor. The processor
     * needs to implement the following functions:
     * - <tt>getSampleLength()</tt> - Returns the sample size accepted by getSampleLength.
     * - <tt>getRequiredPCMFrequency()</tt> - Returns the PCM frequency at which the processor operates.
     * - <tt>calculateAudioFrameVAD(pcmSample)</tt> - Process a 32 float pcm sample of getSampleLength size.
     *
     * @returns {Promise<VADReportingService>}
     */
    static create(micDeviceList: Array<any>, intervalDelay: number, createVADProcessor: any): Promise<VADReportingService>;
    /**
     *
     * @param {number} intervalDelay - Delay at which to publish VAD score for monitored devices.
     *
     * @constructor
     */
    constructor(intervalDelay: number);
    /**
     * Destroy the VADReportingService, stops the setInterval reporting, destroys the emitters and clears the map.
     * After this call the instance is no longer usable.
     *
     * @returns {void}.
     */
    destroy(): void;
}
