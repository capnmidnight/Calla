declare namespace _default {
    /**
     * Parses the presence update of the focus and returns an object with the
     * statuses related to recording.
     *
     * @param {Node} presence - An XMPP presence update.
     * @returns {Object} The current presence values related to recording.
     */
    export function getFocusRecordingUpdate(presence: any): any;
    /**
     * Parses the presence update of the focus and returns an object with the
     * statuses related to recording.
     *
     * @param {Node} presence - An XMPP presence update.
     * @returns {Object} The current presence values related to recording.
     */
    export function getFocusRecordingUpdate(presence: any): any;
    /**
     * Parses the presence update from a hidden domain participant and returns
     * an object with the statuses related to recording.
     *
     * @param {Node} presence - An XMPP presence update.
     * @returns {Object} The current presence values related to recording.
     */
    export function getHiddenDomainUpdate(presence: any): any;
    /**
     * Parses the presence update from a hidden domain participant and returns
     * an object with the statuses related to recording.
     *
     * @param {Node} presence - An XMPP presence update.
     * @returns {Object} The current presence values related to recording.
     */
    export function getHiddenDomainUpdate(presence: any): any;
    /**
     * Returns the recording session ID from a successful IQ.
     *
     * @param {Node} response - The response from the IQ.
     * @returns {string} The session ID of the recording session.
     */
    export function getSessionIdFromIq(response: any): string;
    /**
     * Returns the recording session ID from a successful IQ.
     *
     * @param {Node} response - The response from the IQ.
     * @returns {string} The session ID of the recording session.
     */
    export function getSessionIdFromIq(response: any): string;
    /**
     * Returns the recording session ID from a presence, if it exists.
     *
     * @param {Node} presence - An XMPP presence update.
     * @returns {string|undefined} The session ID of the recording session.
     */
    export function getSessionId(presence: any): string;
    /**
     * Returns the recording session ID from a presence, if it exists.
     *
     * @param {Node} presence - An XMPP presence update.
     * @returns {string|undefined} The session ID of the recording session.
     */
    export function getSessionId(presence: any): string;
    /**
     * Returns whether or not a presence is from the focus.
     *
     * @param {Node} presence - An XMPP presence update.
     * @returns {boolean} True if the presence is from the focus.
     */
    export function isFromFocus(presence: any): boolean;
    /**
     * Returns whether or not a presence is from the focus.
     *
     * @param {Node} presence - An XMPP presence update.
     * @returns {boolean} True if the presence is from the focus.
     */
    export function isFromFocus(presence: any): boolean;
}
export default _default;
