/**
 * Detect if provided VAD score and PCM data is considered noise.
 */
export default class VADNoiseDetection {
    /**
     * Change the state according to the muted status of the tracked device.
     *
     * @param {boolean} isMuted - Is the device muted or not.
     */
    changeMuteState(isMuted: boolean): void;
    /**
     * Check whether or not the service is active or not.
     *
     * @returns {boolean}
     */
    isActive(): boolean;
    /**
     * Reset the processing context, clear buffers, cancel the timeout trigger.
     *
     * @returns {void}
     */
    reset(): void;
    /**
     * Listens for {@link TrackVADEmitter} events and processes them.
     *
     * @param {Object} vadScore -VAD score emitted by {@link TrackVADEmitter}
     * @param {Date}   vadScore.timestamp - Exact time at which processed PCM sample was generated.
     * @param {number} vadScore.score - VAD score on a scale from 0 to 1 (i.e. 0.7)
     * @param {Float32Array} vadScore.pcmData - Raw PCM Data associated with the VAD score.
     * @param {string} vadScore.deviceId - Device id of the associated track.
     * @listens VAD_SCORE_PUBLISHED
     */
    processVADScore(vadScore: {
        timestamp: Date;
        score: number;
        pcmData: Float32Array;
        deviceId: string;
    }): void;
}
