/**
 * Instantiates a new ProxyConnectionPC and ensures only one exists at a given
 * time. Currently it assumes ProxyConnectionPC is used only for screensharing
 * and assumes IQs to be used for communication.
 */
export default class ProxyConnectionService {
    /**
     * Initializes a new {@code ProxyConnectionService} instance.
     *
     * @param {Object} options - Values to initialize the instance with.
     * @param {boolean} [options.convertVideoToDesktop] - Whether or not proxied
     * video should be returned as a desktop stream. Defaults to false.
     * @param {Object} [options.iceConfig] - The {@code RTCConfiguration} to use
     * for the peer connection.
     * @param {JitsiConnection} [options.jitsiConnection] - The
     * {@code JitsiConnection} which will be used to fetch TURN credentials for
     * the P2P connection.
     * @param {Function} options.onRemoteStream - Callback to invoke when a
     * remote video stream has been received and converted to a
     * {@code JitsiLocakTrack}. The {@code JitsiLocakTrack} will be passed in.
     * @param {Function} options.onSendMessage - Callback to invoke when a
     * message has to be sent (signaled) out. The arguments passed in are the
     * jid to send the message to and the message
     */
    constructor(options?: {
        convertVideoToDesktop: boolean;
        iceConfig: any;
    });
    /**
     * Parses a message object regarding a proxy connection to create a new
     * proxy connection or update and existing connection.
     *
     * @param {Object} message - A message object regarding establishing or
     * updating a proxy connection.
     * @param {Object} message.data - An object containing additional message
     * details.
     * @param {string} message.data.iq - The stringified iq which explains how
     * and what to update regarding the proxy connection.
     * @param {string} message.from - The message sender's full jid. Used for
     * sending replies.
     * @returns {void}
     */
    processMessage(message: {
        data: {
            iq: string;
        };
        from: string;
    }): void;
    /**
     * Instantiates and initiates a proxy peer connection.
     *
     * @param {string} peerJid - The jid of the remote client that should
     * receive messages.
     * @param {Array<JitsiLocalTrack>} localTracks - Initial media tracks to
     * send through to the peer.
     * @returns {void}
     */
    start(peerJid: string, localTracks?: Array<any>): void;
    /**
     * Terminates any active proxy peer connection.
     *
     * @returns {void}
     */
    stop(): void;
}
import ProxyConnectionPC from "./ProxyConnectionPC";
