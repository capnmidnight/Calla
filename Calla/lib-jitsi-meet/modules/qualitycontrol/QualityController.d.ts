/**
 * The class manages send and receive video constraints across media sessions({@link JingleSessionPC}) which belong to
 * {@link JitsiConference}. It finds the lowest common value, between the local user's send preference and
 * the remote party's receive preference. Also this module will consider only the active session's receive value,
 * because local tracks are shared and while JVB may have no preference, the remote p2p may have and they may be totally
 * different.
 */
export class QualityController {
    /**
     * Creates new instance for a given conference.
     *
     * @param {JitsiConference} conference - the conference instance for which the new instance will be managing
     * the quality constraints.
     */
    constructor(conference: any);
    conference: any;
    /**
     * Selects the lowest common value for the local video send constraint by looking at local user's preference and
     * the active media session's receive preference set by the remote party.
     *
     * @returns {number|undefined}
     */
    selectSendMaxFrameHeight(): number | undefined;
    /**
     * Sets local preference for max receive video frame height.
     * @param {number|undefined} maxFrameHeight - the new value.
     */
    setPreferredReceiveMaxFrameHeight(maxFrameHeight: number | undefined): void;
    preferredReceiveMaxFrameHeight: number;
    /**
     * Sets local preference for max send video frame height.
     *
     * @param {number} maxFrameHeight - the new value to set.
     * @returns {Promise<void[]>} - resolved when the operation is complete.
     */
    setPreferredSendMaxFrameHeight(maxFrameHeight: number): Promise<void[]>;
    preferredSendMaxFrameHeight: number;
}
