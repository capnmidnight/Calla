/**
 * An adapter around {@code JingleSessionPC} so its logic can be re-used without
 * an XMPP connection. It is being re-used for consistency with the rest of the
 * codebase and to leverage existing peer connection event handling. Also
 * this class provides a facade to hide most of the API for
 * {@code JingleSessionPC}.
 */
export default class ProxyConnectionPC {
    /**
     * Initializes a new {@code ProxyConnectionPC} instance.
     *
     * @param {Object} options - Values to initialize the instance with.
     * @param {Object} [options.iceConfig] - The {@code RTCConfiguration} to use
     * for the peer connection.
     * @param {boolean} [options.isInitiator] - If true, the local client should
     * send offers. If false, the local client should send answers. Defaults to
     * false.
     * @param {Function} options.onRemoteStream - Callback to invoke when a
     * remote media stream has been received through the peer connection.
     * @param {string} options.peerJid - The jid of the remote client with which
     * the peer connection is being establish and which should receive direct
     * messages regarding peer connection updates.
     * @param {boolean} [options.receiveVideo] - Whether or not the peer
     * connection should accept incoming video streams. Defaults to false.
     * @param {Function} options.onSendMessage - Callback to invoke when a
     * message has to be sent (signaled) out.
     */
    constructor(options?: {
        iceConfig: any;
    });
    /**
     * Returns the jid of the remote peer with which this peer connection should
     * be established with.
     *
     * @returns {string}
     */
    getPeerJid(): string;
    /**
     * Updates the peer connection based on the passed in jingle.
     *
     * @param {Object} $jingle - An XML jingle element, wrapped in query,
     * describing how the peer connection should be updated.
     * @returns {void}
     */
    processMessage($jingle: any): void;
    /**
     * Instantiates a peer connection and starts the offer/answer cycle to
     * establish a connection with a remote peer.
     *
     * @param {Array<JitsiLocalTrack>} localTracks - Initial local tracks to add
     * to add to the peer connection.
     * @returns {void}
     */
    start(localTracks?: Array<any>): void;
    /**
     * Begins the process of disconnecting from a remote peer and cleaning up
     * the peer connection.
     *
     * @returns {void}
     */
    stop(): void;
}
import JingleSessionPC from "../xmpp/JingleSessionPC";
import RTC from "../RTC/RTC";
