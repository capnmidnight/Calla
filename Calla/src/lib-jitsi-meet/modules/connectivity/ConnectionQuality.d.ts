import { EventEmitter } from "events";

/**
 * A class which monitors the local statistics coming from the RTC modules, and
 * calculates a "connection quality" value, in percent, for the media
 * connection. A value of 100% indicates a very good network connection, and a
 * value of 0% indicates a poor connection.
 */
export default class ConnectionQuality {
    /**
     *
     * @param conference
     * @param eventEmitter
     * @param options
     */
    constructor(conference: any, eventEmitter: EventEmitter, options: any);
    eventEmitter: EventEmitter;
    /**
     * The owning JitsiConference.
     */
    
    /**
     * Returns the local statistics.
     * Exported only for use in jitsi-meet-torture.
     */
    getStats(): {
        connectionQuality: number;
        jvbRTT: any;
    };
}
