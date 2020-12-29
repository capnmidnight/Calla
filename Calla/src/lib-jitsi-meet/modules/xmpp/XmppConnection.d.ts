/**
 * The lib-jitsi-meet layer for {@link Strophe.Connection}.
 */
export default class XmppConnection extends Listenable {
    /**
     * The list of {@link XmppConnection} events.
     *
     * @returns {Object}
     */
    static get Events(): any;
    /**
     * The list of Xmpp connection statuses.
     *
     * @returns {Strophe.Status}
     */
    static get Status(): any;
    /**
     * Initializes new connection instance.
     *
     * @param {Object} options
     * @param {String} options.serviceUrl - The BOSH or WebSocket service URL.
     * @param {String} [options.enableWebsocketResume=true] - True/false to control the stream resumption functionality.
     * It will enable automatically by default if supported by the XMPP server.
     * @param {Number} [options.websocketKeepAlive=240000] - The websocket keep alive interval. It's 4 minutes by
     * default with jitter. Pass -1 to disable. The actual interval equation is:
     * jitterDelay = (interval * 0.2) + (0.8 * interval * Math.random())
     * The keep alive is HTTP GET request to the {@link options.serviceUrl}.
     * @param {Object} [options.xmppPing] - The xmpp ping settings.
     */
    constructor({ enableWebsocketResume, websocketKeepAlive, serviceUrl, xmppPing }: {
        serviceUrl: string;
        enableWebsocketResume: string;
        websocketKeepAlive: number;
        xmppPing: any;
    });
    /**
     * A getter for the connected state.
     *
     * @returns {boolean}
     */
    get connected(): boolean;
    /**
     * Retrieves the feature discovery plugin instance.
     *
     * @returns {Strophe.Connection.disco}
     */
    get disco(): any;
    /**
     * A getter for the disconnecting state.
     *
     * @returns {boolean}
     */
    get disconnecting(): boolean;
    /**
     * A getter for the domain.
     *
     * @returns {string|null}
     */
    get domain(): string;
    /**
     * Tells if Websocket is used as the transport for the current XMPP connection. Returns true for Websocket or false
     * for BOSH.
     * @returns {boolean}
     */
    get isUsingWebSocket(): boolean;
    /**
     * A getter for the JID.
     *
     * @returns {string|null}
     */
    get jid(): string;
    /**
     * Returns headers for the last BOSH response received.
     *
     * @returns {string}
     */
    get lastResponseHeaders(): string;
    /**
     * A getter for the logger plugin instance.
     *
     * @returns {*}
     */
    get logger(): any;
    /**
     * A getter for the connection options.
     *
     * @returns {*}
     */
    get options(): any;
    /**
     * A getter for the service URL.
     *
     * @returns {string}
     */
    get service(): string;
    /**
     * Returns the current connection status.
     *
     * @returns {Strophe.Status}
     */
    get status(): any;
    /**
     * Adds a connection plugin to this instance.
     *
     * @param {string} name - The name of the plugin or rather a key under which it will be stored on this connection
     * instance.
     * @param {ConnectionPluginListenable} plugin - The plugin to add.
     */
    addConnectionPlugin(name: string, plugin: any): void;
    /**
     * See {@link Strophe.Connection.addHandler}
     *
     * @returns {void}
     */
    addHandler(...args: any[]): void;
    /**
     * Wraps {@link Strophe.Connection.attach} method in order to intercept the connection status updates.
     * See {@link Strophe.Connection.attach} for the params description.
     *
     * @returns {void}
     */
    attach(jid: any, sid: any, rid: any, callback: any, ...args: any[]): void;
    /**
     * Wraps Strophe.Connection.connect method in order to intercept the connection status updates.
     * See {@link Strophe.Connection.connect} for the params description.
     *
     * @returns {void}
     */
    connect(jid: any, pass: any, callback: any, ...args: any[]): void;
    /**
     * The method is meant to be used for testing. It's a shortcut for closing the WebSocket.
     *
     * @returns {void}
     */
    closeWebsocket(): void;
    /**
     * See {@link Strophe.Connection.disconnect}.
     *
     * @returns {void}
     */
    disconnect(...args: any[]): void;
    /**
     * See {@link Strophe.Connection.flush}.
     *
     * @returns {void}
     */
    flush(...args: any[]): void;
    /**
     * See {@link LastRequestTracker.getTimeSinceLastSuccess}.
     *
     * @returns {number|null}
     */
    getTimeSinceLastSuccess(): number | null;
    /**
     * Send a stanza. This function is called to push data onto the send queue to go out over the wire.
     *
     * @param {Element|Strophe.Builder} stanza - The stanza to send.
     * @returns {void}
     */
    send(stanza: any | any): void;
    /**
     * Helper function to send IQ stanzas.
     *
     * @param {Element} elem - The stanza to send.
     * @param {Function} callback - The callback function for a successful request.
     * @param {Function} errback - The callback function for a failed or timed out request.  On timeout, the stanza will
     * be null.
     * @param {number} timeout - The time specified in milliseconds for a timeout to occur.
     * @returns {number} - The id used to send the IQ.
     */
    sendIQ(elem: any, callback: Function, errback: Function, timeout: number): number;
    /**
     * Sends an IQ immediately if connected or puts it on the send queue otherwise(in contrary to other send methods
     * which would fail immediately if disconnected).
     *
     * @param {Element} iq - The IQ to send.
     * @param {number} timeout - How long to wait for the response. The time when the connection is reconnecting is
     * included, which means that the IQ may never be sent and still fail with a timeout.
     */
    sendIQ2(iq: any, timeout: number): Promise<any>;
    /**
     *  Helper function to send presence stanzas. The main benefit is for sending presence stanzas for which you expect
     *  a responding presence stanza with the same id (for example when leaving a chat room).
     *
     * @param {Element} elem - The stanza to send.
     * @param {Function} callback - The callback function for a successful request.
     * @param {Function} errback - The callback function for a failed or timed out request. On timeout, the stanza will
     * be null.
     * @param {number} timeout - The time specified in milliseconds for a timeout to occur.
     * @returns {number} - The id used to send the presence.
     */
    sendPresence(elem: any, callback: Function, errback: Function, timeout: number): number;
    /**
     * The method gracefully closes the BOSH connection by using 'navigator.sendBeacon'.
     *
     * @returns {boolean} - true if the beacon was sent.
     */
    sendUnavailableBeacon(): boolean;
}
import Listenable from "../util/Listenable";
import LastSuccessTracker from "./StropheLastSuccess";
import ResumeTask from "./ResumeTask";
