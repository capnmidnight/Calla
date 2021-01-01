/**
 * Reports average RTP statistics values (arithmetic mean) to the analytics
 * module for things like bit rate, bandwidth, packet loss etc. It keeps track
 * of the P2P vs JVB conference modes and submits the values under different
 * namespaces (the events for P2P mode have 'p2p.' prefix). Every switch between
 * P2P mode resets the data collected so far and averages are calculated from
 * scratch.
 */
export default class AvgRTPStatsReporter {
    /**
     * Creates new instance of <tt>AvgRTPStatsReporter</tt>
     * @param {JitsiConference} conference
     * @param {number} n the number of samples, before arithmetic mean is to be
     * calculated and values submitted to the analytics module.
     */
    constructor(conference: any, n: number);
    jvbStatsMonitor: ConnectionAvgStats;
    p2pStatsMonitor: ConnectionAvgStats;
    /**
     * Unregisters all event listeners and stops working.
     */
    dispose(): void;
}
/**
 * Class gathers the stats that are calculated and reported for a
 * {@link TraceablePeerConnection} even if it's not currently active. For
 * example we want to monitor RTT for the JVB connection while in P2P mode.
 */
declare class ConnectionAvgStats {
    /**
     * Creates new <tt>ConnectionAvgStats</tt>
     * @param {AvgRTPStatsReporter} avgRtpStatsReporter
     * @param {boolean} isP2P
     * @param {number} n the number of samples, before arithmetic mean is to be
     * calculated and values submitted to the analytics module.
     */
    constructor(avgRtpStatsReporter: AvgRTPStatsReporter, isP2P: boolean, n: number);
    /**
     * Is this instance for JVB or P2P connection ?
     * @type {boolean}
     */
    isP2P: boolean;
    /**
     *
     */
    dispose(): void;
}
/**
 * This will calculate an average for one, named stat and submit it to
 * the analytics module when requested. It automatically counts the samples.
 */
declare class AverageStatReport {
    /**
     * Creates new <tt>AverageStatReport</tt> for given name.
     * @param {string} name that's the name of the event that will be reported
     * to the analytics module.
     */
    constructor(name: string);
    name: string;
    count: number;
    sum: number;
    samples: any[];
    /**
     * Adds the next value that will be included in the average when
     * {@link calculate} is called.
     * @param {number} nextValue
     */
    addNext(nextValue: number): void;
    /**
     * Calculates an average for the samples collected using {@link addNext}.
     * @return {number|NaN} an average of all collected samples or <tt>NaN</tt>
     * if no samples were collected.
     */
    calculate(): number | number;
    /**
     * Appends the report to the analytics "data" object. The object will be
     * set under <tt>prefix</tt> + {@link this.name} key.
     * @param {Object} report the analytics "data" object
     */
    appendReport(report: any): void;
    /**
     * Clears all memory of any samples collected, so that new average can be
     * calculated using this instance.
     */
    reset(): void;
}
export {};
