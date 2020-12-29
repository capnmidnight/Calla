/**
 * A collection for tracking speaker stats. Attaches listeners
 * to the conference to automatically update on tracked events.
 */
export default class SpeakerStatsCollector {
    /**
     * Initializes a new SpeakerStatsCollector instance.
     *
     * @constructor
     * @param {JitsiConference} conference - The conference to track.
     * @returns {void}
     */
    constructor(conference: any);
    stats: {
        users: {};
        dominantSpeakerId: any;
    };
    conference: any;
}
