/**
 * Creates new instance of 'TraceablePeerConnection'.
 *
 * @param {RTC} rtc the instance of <tt>RTC</tt> service
 * @param {number} id the peer connection id assigned by the parent RTC module.
 * @param {SignalingLayer} signalingLayer the signaling layer instance
 * @param {object} iceConfig WebRTC 'PeerConnection' ICE config
 * @param {object} constraints WebRTC 'PeerConnection' constraints
 * @param {boolean} isP2P indicates whether or not the new instance will be used
 * in a peer to peer connection
 * @param {object} options <tt>TracablePeerConnection</tt> config options.
 * @param {boolean} options.disableSimulcast if set to 'true' will disable
 * the simulcast.
 * @param {boolean} options.disableRtx if set to 'true' will disable the RTX
 * @param {boolean} options.capScreenshareBitrate if set to 'true' simulcast will
 * be disabled for screenshare and a max bitrate of 500Kbps will applied on the
 * stream.
 * @param {string} options.disabledCodec the mime type of the code that should
 * not be negotiated on the peerconnection.
 * @param {boolean} options.disableH264 If set to 'true' H264 will be
 *      disabled by removing it from the SDP (deprecated)
 * @param {boolean} options.preferH264 if set to 'true' H264 will be preferred
 * over other video codecs. (deprecated)
 * @param {string} options.preferredCodec the mime type of the codec that needs
 * to be made the preferred codec for the connection.
 * @param {boolean} options.startSilent If set to 'true' no audio will be sent or received.
 *
 * FIXME: initially the purpose of TraceablePeerConnection was to be able to
 * debug the peer connection. Since many other responsibilities have been added
 * it would make sense to extract a separate class from it and come up with
 * a more suitable name.
 *
 * @constructor
 */
export default function TraceablePeerConnection(rtc: RTC, id: number, signalingLayer: any, iceConfig: object, constraints: object, isP2P: boolean, options: {
    disableSimulcast: boolean;
    disableRtx: boolean;
    capScreenshareBitrate: boolean;
    disabledCodec: string;
    disableH264: boolean;
    preferH264: boolean;
    preferredCodec: string;
    startSilent: boolean;
}): void;
export default class TraceablePeerConnection {
    /**
     * Creates new instance of 'TraceablePeerConnection'.
     *
     * @param {RTC} rtc the instance of <tt>RTC</tt> service
     * @param {number} id the peer connection id assigned by the parent RTC module.
     * @param {SignalingLayer} signalingLayer the signaling layer instance
     * @param {object} iceConfig WebRTC 'PeerConnection' ICE config
     * @param {object} constraints WebRTC 'PeerConnection' constraints
     * @param {boolean} isP2P indicates whether or not the new instance will be used
     * in a peer to peer connection
     * @param {object} options <tt>TracablePeerConnection</tt> config options.
     * @param {boolean} options.disableSimulcast if set to 'true' will disable
     * the simulcast.
     * @param {boolean} options.disableRtx if set to 'true' will disable the RTX
     * @param {boolean} options.capScreenshareBitrate if set to 'true' simulcast will
     * be disabled for screenshare and a max bitrate of 500Kbps will applied on the
     * stream.
     * @param {string} options.disabledCodec the mime type of the code that should
     * not be negotiated on the peerconnection.
     * @param {boolean} options.disableH264 If set to 'true' H264 will be
     *      disabled by removing it from the SDP (deprecated)
     * @param {boolean} options.preferH264 if set to 'true' H264 will be preferred
     * over other video codecs. (deprecated)
     * @param {string} options.preferredCodec the mime type of the codec that needs
     * to be made the preferred codec for the connection.
     * @param {boolean} options.startSilent If set to 'true' no audio will be sent or received.
     *
     * FIXME: initially the purpose of TraceablePeerConnection was to be able to
     * debug the peer connection. Since many other responsibilities have been added
     * it would make sense to extract a separate class from it and come up with
     * a more suitable name.
     *
     * @constructor
     */
    constructor(rtc: RTC, id: number, signalingLayer: any, iceConfig: object, constraints: object, isP2P: boolean, options: {
        disableSimulcast: boolean;
        disableRtx: boolean;
        capScreenshareBitrate: boolean;
        disabledCodec: string;
        disableH264: boolean;
        preferH264: boolean;
        preferredCodec: string;
        startSilent: boolean;
    });
    /**
     * The parent instance of RTC service which created this
     * <tt>TracablePeerConnection</tt>.
     * @type {RTC}
     */
    rtc: RTC;
    /**
     * The peer connection identifier assigned by the RTC module.
     * @type {number}
     */
    id: number;
    /**
     * Indicates whether or not this instance is used in a peer to peer
     * connection.
     * @type {boolean}
     */
    isP2P: boolean;
    /**
     * The map holds remote tracks associated with this peer connection.
     * It maps user's JID to media type and remote track
     * (one track per media type per user's JID).
     * @type {Map<string, Map<MediaType, JitsiRemoteTrack>>}
     */
    remoteTracks: Map<string, Map<typeof MediaType, JitsiRemoteTrack>>;
    /**
     * A map which stores local tracks mapped by {@link JitsiLocalTrack.rtcId}
     * @type {Map<number, JitsiLocalTrack>}
     */
    localTracks: Map<number, any>;
    /**
     * @typedef {Object} TPCGroupInfo
     * @property {string} semantics the SSRC groups semantics
     * @property {Array<number>} ssrcs group's SSRCs in order where the first
     * one is group's primary SSRC, the second one is secondary (RTX) and so
     * on...
     */
    /**
     * @typedef {Object} TPCSSRCInfo
     * @property {Array<number>} ssrcs an array which holds all track's SSRCs
     * @property {Array<TPCGroupInfo>} groups an array stores all track's SSRC
     * groups
     */
    /**
     * Holds the info about local track's SSRCs mapped per their
     * {@link JitsiLocalTrack.rtcId}
     * @type {Map<number, TPCSSRCInfo>}
     */
    localSSRCs: Map<number, {
        /**
         * an array which holds all track's SSRCs
         */
        ssrcs: Array<number>;
        /**
         * an array stores all track's SSRC
         * groups
         */
        groups: {
            /**
             * the SSRC groups semantics
             */
            semantics: string;
            /**
             * group's SSRCs in order where the first
             * one is group's primary SSRC, the second one is secondary (RTX) and so
             * on...
             */
            ssrcs: Array<number>;
        }[];
    }>;
    /**
     * The local ICE username fragment for this session.
     */
    localUfrag: any;
    /**
     * The remote ICE username fragment for this session.
     */
    remoteUfrag: any;
    /**
     * The signaling layer which operates this peer connection.
     * @type {SignalingLayer}
     */
    signalingLayer: any;
    options: {
        disableSimulcast: boolean;
        disableRtx: boolean;
        capScreenshareBitrate: boolean;
        disabledCodec: string;
        disableH264: boolean;
        preferH264: boolean;
        preferredCodec: string;
        startSilent: boolean;
    };
    peerconnection: any;
    videoBitrates: any;
    tpcUtils: TPCUtils;
    updateLog: any[];
    stats: {};
    statsinterval: any;
    /**
     * @type {number} The max number of stats to keep in this.stats. Limit to
     * 300 values, i.e. 5 minutes; set to 0 to disable
     */
    maxstats: number;
    interop: any;
    simulcast: any;
    sdpConsistency: SdpConsistency;
    /**
     * Munges local SDP provided to the Jingle Session in order to prevent from
     * sending SSRC updates on attach/detach and mute/unmute (for video).
     * @type {LocalSdpMunger}
     */
    localSdpMunger: LocalSdpMunger;
    /**
     * TracablePeerConnection uses RTC's eventEmitter
     * @type {EventEmitter}
     */
    eventEmitter: EventEmitter;
    rtxModifier: RtxModifier;
    /**
     * The height constraint applied on the video sender.
     */
    senderVideoMaxHeight: any;
    codecPreference: {
        enable: boolean;
        mediaType: string;
        mimeType: any;
    };
    trace: (what: any, info: any) => void;
    onicecandidate: any;
    onsignalingstatechange: any;
    oniceconnectionstatechange: any;
    onnegotiationneeded: any;
    ondatachannel: any;
    getConnectionState(): string;
    isSimulcastOn(): boolean;
    getAudioLevels(): any;
    getLocalTracks(mediaType?: typeof MediaType): Array<any>;
    getLocalVideoTrack(): any | undefined;
    hasAnyTracksOfType(mediaType: typeof MediaType): boolean;
    getRemoteTracks(endpointId?: string, mediaType?: typeof MediaType): Array<JitsiRemoteTrack>;
    getTrackBySSRC(ssrc: number): any | null;
    getSsrcByTrackId(id: string): number | null;
    removeRemoteTracks(owner: string): JitsiRemoteTrack[];
    getLocalSSRC(localTrack: any): number;
    containsTrack(track: any | JitsiRemoteTrack): boolean;
    addTrack(track: any, isInitiator?: boolean): Promise<void>;
    addTrackUnmute(track: any): Promise<boolean>;
    isMediaStreamInPc(mediaStream: any): boolean;
    removeTrack(localTrack: any): void;
    findSenderByKind(mediaType: any): any | undefined;
    findReceiverForTrack(track: any): any | undefined;
    findSenderForTrack(track: any): any | undefined;
    replaceTrack(oldTrack: any | null, newTrack: any | null): Promise<boolean>;
    removeTrackMute(localTrack: any): Promise<boolean>;
    createDataChannel(label: any, opts: any): any;
    setLocalDescription(description: any): Promise<any>;
    public setAudioTransferActive(active: boolean): boolean;
    setSenderVideoDegradationPreference(): Promise<void>;
    setMaxBitRate(): Promise<void>;
    setRemoteDescription(description: any): Promise<any>;
    setSenderVideoConstraint(frameHeight?: number): Promise<any>;
    public setVideoTransferActive(active: boolean): boolean;
    sendTones(tones: string, duration?: number, interToneGap?: number): void;
    generateRecvonlySsrc(): void;
    clearRecvonlySsrc(): void;
    close(): void;
    createAnswer(constraints: any): Promise<any>;
    createOffer(constraints: any): Promise<any>;
    addIceCandidate(candidate: any): any;
    getStats(callback: Function, errback: Function): void;
    generateNewStreamSSRCInfo(track: any): {
        /**
         * an array which holds all track's SSRCs
         */
        ssrcs: Array<number>;
        /**
         * an array stores all track's SSRC
         * groups
         */
        groups: {
            /**
             * the SSRC groups semantics
             */
            semantics: string;
            /**
             * group's SSRCs in order where the first
             * one is group's primary SSRC, the second one is secondary (RTX) and so
             * on...
             */
            ssrcs: Array<number>;
        }[];
    };
    toString(): string;
}
export type SSRCGroupInfo = {
    /**
     * group's SSRCs
     */
    ssrcs: Array<number>;
    semantics: string;
};
export type TrackSSRCInfo = {
    /**
     * track's SSRCs
     */
    ssrcs: Array<number>;
    /**
     * track's SSRC groups
     */
    groups: Array<SSRCGroupInfo>;
};
import RTC from "./RTC";
import * as MediaType from "../../service/RTC/MediaType";
import JitsiRemoteTrack from "./JitsiRemoteTrack";
import { TPCUtils } from "./TPCUtils";
import SdpConsistency from "../xmpp/SdpConsistency";
import LocalSdpMunger from "./LocalSdpMunger";
import RtxModifier from "../xmpp/RtxModifier";
import { EventEmitter } from "events";
