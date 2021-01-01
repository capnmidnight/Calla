/**
 * Collects the average audio levels per participant from the local stats and the stats received by every remote
 * participant and compares them to detect potential audio problem for a participant.
 */
export default class AudioOutputProblemDetector {
    /**
     * Creates new <tt>AudioOutputProblemDetector</tt> instance.
     *
     * @param {JitsiCofnerence} conference - The conference instance to be monitored.
     */
    constructor(conference: any);
    /**
     * Disposes the allocated resources.
     *
     * @returns {void}
     */
    dispose(): void;
}
