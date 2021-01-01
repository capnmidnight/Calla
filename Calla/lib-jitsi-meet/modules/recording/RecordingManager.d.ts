export default RecordingManager;
/**
 * A class responsible for starting and stopping recording sessions and emitting
 * state updates for them.
 */
declare class RecordingManager {
    /**
     * Initialize {@code RecordingManager} with other objects that are necessary
     * for starting a recording.
     *
     * @param {ChatRoom} chatRoom - The chat room to handle.
     * @returns {void}
     */
    constructor(chatRoom: any);
    /**
     * Callback to invoke to parse through a presence update to find recording
     * related updates (from Jibri participant doing the recording and the
     * focus which controls recording).
     *
     * @param {Object} event - The presence data from the pubsub event.
     * @param {Node} event.presence - An XMPP presence update.
     * @param {boolean} event.fromHiddenDomain - Whether or not the update comes
     * from a participant that is trusted but not visible, as would be the case
     * with the Jibri recorder participant.
     * @returns {void}
     */
    onPresence({ fromHiddenDomain, presence }: {
        presence: any;
        fromHiddenDomain: boolean;
    }): void;
    /**
     * Finds an existing recording session by session ID.
     *
     * @param {string} sessionID - The session ID associated with the recording.
     * @returns {JibriSession|undefined}
     */
    getSession(sessionID: string): JibriSession | undefined;
    /**
     * Start a recording session.
     *
     * @param {Object} options - Configuration for the recording.
     * @param {string} [options.appData] - Data specific to the app/service that
     * the result file will be uploaded.
     * @param {string} [optional] options.broadcastId - The channel on which a
     * live stream will occur.
     * @param {string} options.mode - The mode in which recording should be
     * started. Recognized values are "file" and "stream".
     * @param {string} [optional] options.streamId - The stream key to be used
     * for live stream broadcasting. Required for live streaming.
     * @returns {Promise} A promise for starting a recording, which will pass
     * back the session on success. The promise resolves after receiving an
     * acknowledgment of the start request success or fail.
     */
    startRecording(options: {
        appData: string;
    }): Promise<any>;
    /**
     * Stop a recording session.
     *
     * @param {string} sessionID - The ID associated with the recording session
     * to be stopped.
     * @returns {Promise} The promise resolves after receiving an
     * acknowledgment of the stop request success or fail.
     */
    stopRecording(sessionID: string): Promise<any>;
}
import JibriSession from "./JibriSession";
