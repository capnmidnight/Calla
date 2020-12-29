/**
 * @typedef {Object} JingleSessionPCOptions
 * @property {Object} abTesting - A/B testing related options (ask George).
 * @property {boolean} abTesting.enableSuspendVideoTest - enables the suspend
 * video test ?(ask George).
 * @property {boolean} disableH264 - Described in the config.js[1].
 * @property {boolean} disableRtx - Described in the config.js[1].
 * @property {boolean} disableSimulcast - Described in the config.js[1].
 * @property {boolean} enableInsertableStreams - Set to true when the insertable streams constraints is to be enabled
 * on the PeerConnection.
 * @property {boolean} enableLayerSuspension - Described in the config.js[1].
 * @property {boolean} failICE - it's an option used in the tests. Set to
 * <tt>true</tt> to block any real candidates and make the ICE fail.
 * @property {boolean} gatherStats - Described in the config.js[1].
 * @property {object} p2p - Peer to peer related options (FIXME those could be
 * fetched from config.p2p on the upper level).
 * @property {boolean} p2p.disableH264 - Described in the config.js[1].
 * @property {boolean} p2p.preferH264 - Described in the config.js[1].
 * @property {boolean} preferH264 - Described in the config.js[1].
 * @property {Object} testing - Testing and/or experimental options.
 * @property {boolean} webrtcIceUdpDisable - Described in the config.js[1].
 * @property {boolean} webrtcIceTcpDisable - Described in the config.js[1].
 *
 * [1]: https://github.com/jitsi/jitsi-meet/blob/master/config.js
 */
/**
 *
 */
export default class JingleSessionPC extends JingleSession {
    /**
     * Parses 'senders' attribute of the video content.
     * @param {jQuery} jingleContents
     * @return {string|null} one of the values of content "senders" attribute
     * defined by Jingle. If there is no "senders" attribute or if the value is
     * invalid then <tt>null</tt> will be returned.
     * @private
     */
    private static parseVideoSenders;
    /**
     * Parses the video max frame height value out of the 'content-modify' IQ.
     *
     * @param {jQuery} jingleContents - A jQuery selector pointing to the '>jingle' element.
     * @returns {Number|null}
     */
    static parseMaxFrameHeight(jingleContents: any): number | null;
    /**
     * Creates new <tt>JingleSessionPC</tt>
     * @param {string} sid the Jingle Session ID - random string which
     * identifies the session
     * @param {string} localJid our JID
     * @param {string} remoteJid remote peer JID
     * @param {XmppConnection} connection - The XMPP connection instance.
     * @param mediaConstraints the media constraints object passed to
     * createOffer/Answer, as defined by the WebRTC standard
     * @param iceConfig the ICE servers config object as defined by the WebRTC
     * standard.
     * @param {boolean} isP2P indicates whether this instance is
     * meant to be used in a direct, peer to peer connection or <tt>false</tt>
     * if it's a JVB connection.
     * @param {boolean} isInitiator indicates if it will be the side which
     * initiates the session.
     * @constructor
     *
     * @implements {SignalingLayer}
     */
    constructor(sid: string, localJid: string, remoteJid: string, connection: XmppConnection, mediaConstraints: any, iceConfig: any, isP2P: boolean, isInitiator: boolean);
    /**
     * Local preference for the receive video max frame height.
     *
     * @type {Number|undefined}
     */
    localRecvMaxFrameHeight: number | undefined;
    lasticecandidate: boolean;
    closed: boolean;
    /**
     * Indicates whether or not this <tt>JingleSessionPC</tt> is used in
     * a peer to peer type of session.
     * @type {boolean} <tt>true</tt> if it's a peer to peer
     * session or <tt>false</tt> if it's a JVB session
     */
    isP2P: boolean;
    /**
     * Remote preference for the receive video max frame height.
     *
     * @type {Number|undefined}
     */
    remoteRecvMaxFrameHeight: number | undefined;
    /**
     * The signaling layer implementation.
     * @type {SignalingLayerImpl}
     */
    signalingLayer: SignalingLayerImpl;
    /**
     * The queue used to serialize operations done on the peerconnection.
     *
     * @type {AsyncQueue}
     */
    modificationQueue: AsyncQueue;
    /**
     * Flag used to guarantee that the connection established event is
     * triggered just once.
     * @type {boolean}
     */
    wasConnected: boolean;
    /**
     * Keeps track of how long (in ms) it took from ICE start to ICE
     * connect.
     *
     * @type {number}
     */
    establishmentDuration: number;
    failICE: boolean;
    options: JingleSessionPCOptions;
    /**
     * {@code true} if reconnect is in progress.
     * @type {boolean}
     */
    isReconnect: boolean;
    /**
     * Set to {@code true} if the connection was ever stable
     * @type {boolean}
     */
    wasstable: boolean;
    webrtcIceUdpDisable: boolean;
    webrtcIceTcpDisable: boolean;
    peerconnection: any;
    /**
     * Remote preference for receive video max frame height.
     *
     * @returns {Number|undefined}
     */
    getRemoteRecvMaxFrameHeight(): number | undefined;
    /**
     * Sends given candidate in Jingle 'transport-info' message.
     * @param {RTCIceCandidate} candidate the WebRTC ICE candidate instance
     * @private
     */
    private sendIceCandidate;
    /**
     * Sends given candidates in Jingle 'transport-info' message.
     * @param {Array<RTCIceCandidate>} candidates an array of the WebRTC ICE
     * candidate instances
     * @private
     */
    private sendIceCandidates;
    /**
     * Sends Jingle 'session-info' message which includes custom Jitsi Meet
     * 'ice-state' element with the text value 'failed' to let Jicofo know
     * that the ICE connection has entered the failed state. It can then
     * choose to re-create JVB channels and send 'transport-replace' to
     * retry the connection.
     */
    sendIceFailedNotification(): void;
    /**
     *
     * @param contents
     */
    readSsrcInfo(contents: any): void;
    /**
     * Makes the underlying TraceablePeerConnection generate new SSRC for
     * the recvonly video stream.
     * @deprecated
     */
    generateRecvonlySsrc(): void;
    /**
     * Creates an offer and sends Jingle 'session-initiate' to the remote peer.
     * @param {Array<JitsiLocalTrack>} localTracks the local tracks that will be
     * added, before the offer/answer cycle executes (for the local track
     * addition to be an atomic operation together with the offer/answer).
     */
    invite(localTracks?: Array<any>): void;
    /**
     * Sends 'session-initiate' to the remote peer.
     *
     * NOTE this method is synchronous and we're not waiting for the RESULT
     * response which would delay the startup process.
     *
     * @param {string} offerSdp  - The local session description which will be
     * used to generate an offer.
     * @private
     */
    private sendSessionInitiate;
    /**
     * Sets the answer received from the remote peer.
     * @param jingleAnswer
     */
    setAnswer(jingleAnswer: any): void;
    /**
     * This is a setRemoteDescription/setLocalDescription cycle which starts at
     * converting Strophe Jingle IQ into remote offer SDP. Once converted
     * setRemoteDescription, createAnswer and setLocalDescription calls follow.
     * @param jingleOfferAnswerIq jQuery selector pointing to the jingle element
     *        of the offer (or answer) IQ
     * @param success callback called when sRD/sLD cycle finishes successfully.
     * @param failure callback called with an error object as an argument if we
     *        fail at any point during setRD, createAnswer, setLD.
     * @param {Array<JitsiLocalTrack>} [localTracks] the optional list of
     * the local tracks that will be added, before the offer/answer cycle
     * executes (for the local track addition to be an atomic operation together
     * with the offer/answer).
     */
    setOfferAnswerCycle(jingleOfferAnswerIq: any, success: any, failure: any, localTracks?: Array<any>): void;
    /**
     * Although it states "replace transport" it does accept full Jingle offer
     * which should contain new ICE transport details.
     * @param jingleOfferElem an element Jingle IQ that contains new offer and
     *        transport info.
     * @param success callback called when we succeed to accept new offer.
     * @param failure function(error) called when we fail to accept new offer.
     */
    replaceTransport(jingleOfferElem: any, success: any, failure: any): void;
    /**
     * Sends Jingle 'session-accept' message.
     * @param {function()} success callback called when we receive 'RESULT'
     *        packet for the 'session-accept'
     * @param {function(error)} failure called when we receive an error response
     *        or when the request has timed out.
     * @private
     */
    private sendSessionAccept;
    /**
     * Will send 'content-modify' IQ in order to ask the remote peer to
     * either stop or resume sending video media or to adjust sender's video constraints.
     * @private
     */
    private sendContentModify;
    /**
     * Adjust the preference for max video frame height that the local party is willing to receive. Signals
     * the remote party.
     *
     * @param {Number} maxFrameHeight - the new value to set.
     */
    setReceiverVideoConstraint(maxFrameHeight: number): void;
    /**
     * Sends Jingle 'transport-accept' message which is a response to
     * 'transport-replace'.
     * @param localSDP the 'SDP' object with local session description
     * @param success callback called when we receive 'RESULT' packet for
     *        'transport-replace'
     * @param failure function(error) called when we receive an error response
     *        or when the request has timed out.
     * @private
     */
    private sendTransportAccept;
    /**
     * Sends Jingle 'transport-reject' message which is a response to
     * 'transport-replace'.
     * @param success callback called when we receive 'RESULT' packet for
     *        'transport-replace'
     * @param failure function(error) called when we receive an error response
     *        or when the request has timed out.
     *
     * FIXME method should be marked as private, but there's some spaghetti that
     *       needs to be fixed prior doing that
     */
    sendTransportReject(success: any, failure: any): void;
    /**
     * Sets the maximum bitrates on the local video track. Bitrate values from
     * videoQuality settings in config.js will be used for configuring the sender.
     * @returns {Promise<void>} promise that will be resolved when the operation is
     * successful and rejected otherwise.
     */
    setSenderMaxBitrates(): Promise<void>;
    /**
     * Sets the resolution constraint on the local camera track.
     * @param {number} maxFrameHeight - The user preferred max frame height.
     * @returns {Promise} promise that will be resolved when the operation is
     * successful and rejected otherwise.
     */
    setSenderVideoConstraint(maxFrameHeight: number): Promise<any>;
    /**
     * Sets the degradation preference on the video sender. This setting determines if
     * resolution or framerate will be preferred when bandwidth or cpu is constrained.
     * @returns {Promise<void>} promise that will be resolved when the operation is
     * successful and rejected otherwise.
     */
    setSenderVideoDegradationPreference(): Promise<void>;
    /**
     *
     * @param reasonCondition
     * @param reasonText
     */
    onTerminated(reasonCondition: any, reasonText: any): void;
    /**
     * Handles XMPP connection state changes.
     *
     * @param {XmppConnection.Status} status - The new status.
     */
    onXmppStatusChanged(status: any): void;
    /**
     * Handles a Jingle source-add message for this Jingle session.
     * @param elem An array of Jingle "content" elements.
     */
    addRemoteStream(elem: any): void;
    /**
     * Handles a Jingle source-remove message for this Jingle session.
     * @param elem An array of Jingle "content" elements.
     */
    removeRemoteStream(elem: any): void;
    /**
     * Replaces <tt>oldTrack</tt> with <tt>newTrack</tt> and performs a single
     * offer/answer cycle after both operations are done. Either
     * <tt>oldTrack</tt> or <tt>newTrack</tt> can be null; replacing a valid
     * <tt>oldTrack</tt> with a null <tt>newTrack</tt> effectively just removes
     * <tt>oldTrack</tt>
     * @param {JitsiLocalTrack|null} oldTrack the current track in use to be
     * replaced
     * @param {JitsiLocalTrack|null} newTrack the new track to use
     * @returns {Promise} which resolves once the replacement is complete
     *  with no arguments or rejects with an error {string}
     */
    replaceTrack(oldTrack: any | null, newTrack: any | null): Promise<any>;
    /**
     * Adds local track back to this session, as part of the unmute operation.
     * @param {JitsiLocalTrack} track
     * @return {Promise} a promise that will resolve once the local track is
     * added back to this session and renegotiation succeeds. Will be rejected
     * with a <tt>string</tt> that provides some error details in case something
     * goes wrong.
     */
    addTrackAsUnmute(track: any): Promise<any>;
    /**
     * Remove local track as part of the mute operation.
     * @param {JitsiLocalTrack} track the local track to be removed
     * @return {Promise} a promise which will be resolved once the local track
     * is removed from this session and the renegotiation is performed.
     * The promise will be rejected with a <tt>string</tt> that the describes
     * the error if anything goes wrong.
     */
    removeTrackAsMute(track: any): Promise<any>;
    /**
     * Resumes or suspends media transfer over the underlying peer connection.
     * @param {boolean} audioActive <tt>true</tt> to enable audio media
     * transfer or <tt>false</tt> to suspend audio media transmission.
     * @param {boolean} videoActive <tt>true</tt> to enable video media
     * transfer or <tt>false</tt> to suspend video media transmission.
     * @return {Promise} a <tt>Promise</tt> which will resolve once
     * the operation is done. It will be rejected with an error description as
     * a string in case anything goes wrong.
     */
    setMediaTransferActive(audioActive: boolean, videoActive: boolean): Promise<any>;
    /**
     * Will put and execute on the queue a session modify task. Currently it
     * only checks the senders attribute of the video content in order to figure
     * out if the remote peer has video in the inactive state (stored locally
     * in {@link _remoteVideoActive} - see field description for more info).
     * @param {jQuery} jingleContents jQuery selector pointing to the jingle
     * element of the session modify IQ.
     * @see {@link _remoteVideoActive}
     * @see {@link _localVideoActive}
     */
    modifyContents(jingleContents: any): void;
    /**
     * Figures out added/removed ssrcs and send update IQs.
     * @param oldSDP SDP object for old description.
     * @param newSDP SDP object for new description.
     */
    notifyMySSRCUpdate(oldSDP: any, newSDP: any): void;
    /**
     * Method returns function(errorResponse) which is a callback to be passed
     * to Strophe connection.sendIQ method. An 'error' structure is created that
     * is passed as 1st argument to given <tt>failureCb</tt>. The format of this
     * structure is as follows:
     * {
     *  code: {XMPP error response code}
     *  reason: {the name of XMPP error reason element or 'timeout' if the
      *          request has timed out within <tt>IQ_TIMEOUT</tt> milliseconds}
     *  source: {request.tree() that provides original request}
     *  session: {this JingleSessionPC.toString()}
     * }
     * @param request Strophe IQ instance which is the request to be dumped into
     *        the error structure
     * @param failureCb function(error) called when error response was returned
     *        or when a timeout has occurred.
     * @returns {function(this:JingleSessionPC)}
     */
    newJingleErrorHandler(request: any, failureCb: any): (args: JingleSessionPC) => void;
    /**
     * Returns the ice connection state for the peer connection.
     * @returns the ice connection state for the peer connection.
     */
    getIceConnectionState(): any;
    /**
     * Closes the peerconnection.
     */
    close(): void;
}
export type JingleSessionPCOptions = {
    /**
     * - A/B testing related options (ask George).
     */
    abTesting: {
        enableSuspendVideoTest: boolean;
    };
    /**
     * - Described in the config.js[1].
     */
    disableH264: boolean;
    /**
     * - Described in the config.js[1].
     */
    disableRtx: boolean;
    /**
     * - Described in the config.js[1].
     */
    disableSimulcast: boolean;
    /**
     * - Set to true when the insertable streams constraints is to be enabled
     * on the PeerConnection.
     */
    enableInsertableStreams: boolean;
    /**
     * - Described in the config.js[1].
     */
    enableLayerSuspension: boolean;
    /**
     * - it's an option used in the tests. Set to
     * <tt>true</tt> to block any real candidates and make the ICE fail.
     */
    failICE: boolean;
    /**
     * - Described in the config.js[1].
     */
    gatherStats: boolean;
    /**
     * - Peer to peer related options (FIXME those could be
     * fetched from config.p2p on the upper level).
     */
    p2p: {
        disableH264: boolean;
        preferH264: boolean;
    };
    /**
     * - Described in the config.js[1].
     */
    preferH264: boolean;
    /**
     * - Testing and/or experimental options.
     */
    testing: any;
    /**
     * - Described in the config.js[1].
     */
    webrtcIceUdpDisable: boolean;
    /**
     * - Described in the config.js[1].
     *
     * [1]: https://github.com/jitsi/jitsi-meet/blob/master/config.js
     */
    webrtcIceTcpDisable: boolean;
};
import JingleSession from "./JingleSession";
import SignalingLayerImpl from "./SignalingLayerImpl";
import AsyncQueue from "../util/AsyncQueue";
import SDP from "./SDP";
import XmppConnection from "./XmppConnection";
