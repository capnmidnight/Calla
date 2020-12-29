import { EventEmitter } from "events";

/**
 * Handles a WebRTC RTCPeerConnection or a WebSocket instance to communicate
 * with the videobridge.
 */
export default class BridgeChannel {
    /**
     * Binds "ondatachannel" event listener on the given RTCPeerConnection
     * instance, or creates a WebSocket connection with the videobridge.
     * At least one of both, peerconnection or wsUrl parameters, must be
     * given.
     * @param {RTCPeerConnection} [peerconnection] WebRTC peer connection
     * instance.
     * @param {string} [wsUrl] WebSocket URL.
     * @param {EventEmitter} emitter the EventEmitter instance to use for event emission.
     * @param {function} senderVideoConstraintsChanged callback to call when the sender video constraints change.
     */
    constructor(peerconnection?: any, wsUrl?: string, emitter?: EventEmitter, senderVideoConstraintsChanged?: Function);
    /**
     * The channel mode.
     * @return {string} "datachannel" or "websocket" (or null if not yet set).
     */
    get mode(): string;
    /**
     * Closes the currently opened channel.
     */
    close(): void;
    /**
     * Whether there is an underlying RTCDataChannel or WebSocket and it's
     * open.
     * @return {boolean}
     */
    isOpen(): boolean;
    /**
     * Sends message via the channel.
     * @param {string} to The id of the endpoint that should receive the
     * message. If "" the message will be sent to all participants.
     * @param  {object} payload The payload of the message.
     * @throws NetworkError or InvalidStateError from RTCDataChannel#send (@see
     * {@link https://developer.mozilla.org/docs/Web/API/RTCDataChannel/send})
     * or from WebSocket#send or Error with "No opened channel" message.
     */
    sendMessage(to: string, payload: object): void;
    /**
     * Sends a "lastN value changed" message via the channel.
     * @param {number} value The new value for lastN. -1 means unlimited.
     */
    sendSetLastNMessage(value: number): void;
    /**
     * Sends a "pinned endpoint changed" message via the channel.
     * @param {string} endpointId The id of the pinned endpoint.
     * @throws NetworkError or InvalidStateError from RTCDataChannel#send (@see
     * {@link https://developer.mozilla.org/docs/Web/API/RTCDataChannel/send})
     * or from WebSocket#send or Error with "No opened channel" message.
     */
    sendPinnedEndpointMessage(endpointId: string): void;
    /**
     * Sends a "selected endpoints changed" message via the channel.
     *
     * @param {Array<string>} endpointIds - The ids of the selected endpoints.
     * @throws NetworkError or InvalidStateError from RTCDataChannel#send (@see
     * {@link https://developer.mozilla.org/docs/Web/API/RTCDataChannel/send})
     * or from WebSocket#send or Error with "No opened channel" message.
     */
    sendSelectedEndpointsMessage(endpointIds: Array<string>): void;
    /**
     * Sends a "receiver video constraint" message via the channel.
     * @param {Number} maxFrameHeightPixels the maximum frame height,
     * in pixels, this receiver is willing to receive
     */
    sendReceiverVideoConstraintMessage(maxFrameHeightPixels: number): void;
}
