/**
 * Detect if provided VAD score which is generated on a muted device is voice and fires an event.
 */
export default class VADTalkMutedDetection {
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
     * Listens for {@link TrackVADEmitter} events and processes them.
     *
     * @param {Object} vadScore -VAD score emitted by {@link TrackVADEmitter}
     * @param {Date}   vadScore.timestamp - Exact time at which processed PCM sample was generated.
     * @param {number} vadScore.score - VAD score on a scale from 0 to 1 (i.e. 0.7)
     * @param {string} vadScore.deviceId - Device id of the associated track.
     * @listens VAD_SCORE_PUBLISHED
     */
    processVADScore(vadScore: {
        timestamp: Date;
        score: number;
        deviceId: string;
    }): void;
    /**
     * Reset the processing context, clear buffer, cancel the timeout trigger.
     *
     * @returns {void}
     */
    reset(): void;
}
