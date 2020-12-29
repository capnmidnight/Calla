/**
 * Creates a JitsiConference object with the given name and properties.
 * Note: this constructor is not a part of the public API (objects should be
 * created using JitsiConnection.createConference).
 * @param options.config properties / settings related to the conference that
 * will be created.
 * @param options.name the name of the conference
 * @param options.connection the JitsiConnection object for this
 * JitsiConference.
 * @param {number} [options.config.avgRtpStatsN=15] how many samples are to be
 * collected by {@link AvgRTPStatsReporter}, before arithmetic mean is
 * calculated and submitted to the analytics module.
 * @param {boolean} [options.config.enableIceRestart=false] - enables the ICE
 * restart logic.
 * @param {boolean} [options.config.p2p.enabled] when set to <tt>true</tt>
 * the peer to peer mode will be enabled. It means that when there are only 2
 * participants in the conference an attempt to make direct connection will be
 * made. If the connection succeeds the conference will stop sending data
 * through the JVB connection and will use the direct one instead.
 * @param {number} [options.config.p2p.backToP2PDelay=5] a delay given in
 * seconds, before the conference switches back to P2P, after the 3rd
 * participant has left the room.
 * @param {number} [options.config.channelLastN=-1] The requested amount of
 * videos are going to be delivered after the value is in effect. Set to -1 for
 * unlimited or all available videos.
 * @param {number} [options.config.forceJVB121Ratio]
 * "Math.random() < forceJVB121Ratio" will determine whether a 2 people
 * conference should be moved to the JVB instead of P2P. The decision is made on
 * the responder side, after ICE succeeds on the P2P connection.
 * @param {*} [options.config.openBridgeChannel] Which kind of communication to
 * open with the videobridge. Values can be "datachannel", "websocket", true
 * (treat it as "datachannel"), undefined (treat it as "datachannel") and false
 * (don't open any channel).
 * @constructor
 *
 * FIXME Make all methods which are called from lib-internal classes
 *       to non-public (use _). To name a few:
 *       {@link JitsiConference.onLocalRoleChanged}
 *       {@link JitsiConference.onUserRoleChanged}
 *       {@link JitsiConference.onMemberLeft}
 *       and so on...
 */
declare function JitsiConference(options: any): void;
declare class JitsiConference {
    /**
     * Creates a JitsiConference object with the given name and properties.
     * Note: this constructor is not a part of the public API (objects should be
     * created using JitsiConnection.createConference).
     * @param options.config properties / settings related to the conference that
     * will be created.
     * @param options.name the name of the conference
     * @param options.connection the JitsiConnection object for this
     * JitsiConference.
     * @param {number} [options.config.avgRtpStatsN=15] how many samples are to be
     * collected by {@link AvgRTPStatsReporter}, before arithmetic mean is
     * calculated and submitted to the analytics module.
     * @param {boolean} [options.config.enableIceRestart=false] - enables the ICE
     * restart logic.
     * @param {boolean} [options.config.p2p.enabled] when set to <tt>true</tt>
     * the peer to peer mode will be enabled. It means that when there are only 2
     * participants in the conference an attempt to make direct connection will be
     * made. If the connection succeeds the conference will stop sending data
     * through the JVB connection and will use the direct one instead.
     * @param {number} [options.config.p2p.backToP2PDelay=5] a delay given in
     * seconds, before the conference switches back to P2P, after the 3rd
     * participant has left the room.
     * @param {number} [options.config.channelLastN=-1] The requested amount of
     * videos are going to be delivered after the value is in effect. Set to -1 for
     * unlimited or all available videos.
     * @param {number} [options.config.forceJVB121Ratio]
     * "Math.random() < forceJVB121Ratio" will determine whether a 2 people
     * conference should be moved to the JVB instead of P2P. The decision is made on
     * the responder side, after ICE succeeds on the P2P connection.
     * @param {*} [options.config.openBridgeChannel] Which kind of communication to
     * open with the videobridge. Values can be "datachannel", "websocket", true
     * (treat it as "datachannel"), undefined (treat it as "datachannel") and false
     * (don't open any channel).
     * @constructor
     *
     * FIXME Make all methods which are called from lib-internal classes
     *       to non-public (use _). To name a few:
     *       {@link JitsiConference.onLocalRoleChanged}
     *       {@link JitsiConference.onUserRoleChanged}
     *       {@link JitsiConference.onMemberLeft}
     *       and so on...
     */
    constructor(options: any);
    eventEmitter: EventEmitter;
    options: any;
    eventManager: JitsiConferenceEventManager;
    participants: {[key:string]:JitsiParticipant};
    componentsVersions: ComponentsVersions;
    /**
     * Jingle session instance for the JVB connection.
     */
    jvbJingleSession: JingleSessionPC;
    lastDominantSpeaker: any;
    dtmfManager: any;
    somebodySupportsDTMF: boolean;
    authEnabled: boolean;
    startAudioMuted: boolean;
    startVideoMuted: boolean;
    startMutedPolicy: {
        audio: boolean;
        video: boolean;
    };
    isMutedByFocus: boolean;
    mutedByFocusActor: any;
    wasStopped: boolean;
    properties: {};
    /**
     * The object which monitors local and remote connection statistics (e.g.
     * sending bitrate) and calculates a number which represents the connection
     * quality.
     */
    connectionQuality: ConnectionQuality;
    /**
     * Reports average RTP statistics to the analytics module.
     * @type {AvgRTPStatsReporter}
     */
    avgRtpStatsReporter: AvgRTPStatsReporter;
    /**
     * Indicates whether the connection is interrupted or not.
     */
    isJvbConnectionInterrupted: boolean;
    /**
     * The object which tracks active speaker times
     */
    speakerStatsCollector: SpeakerStatsCollector;
    /**
     * Stores reference to deferred start P2P task. It's created when 3rd
     * participant leaves the room in order to avoid ping pong effect (it
     * could be just a page reload).
     * @type {number|null}
     */
    deferredStartP2PTask: number | null;
    /**
     * A delay given in seconds, before the conference switches back to P2P
     * after the 3rd participant has left.
     * @type {number}
     */
    backToP2PDelay: number;
    /**
     * If set to <tt>true</tt> it means the P2P ICE is no longer connected.
     * When <tt>false</tt> it means that P2P ICE (media) connection is up
     * and running.
     * @type {boolean}
     */
    isP2PConnectionInterrupted: boolean;
    /**
     * Flag set to <tt>true</tt> when P2P session has been established
     * (ICE has been connected) and this conference is currently in the peer to
     * peer mode (P2P connection is the active one).
     * @type {boolean}
     */
    p2p: boolean;
    /**
     * A JingleSession for the direct peer to peer connection.
     */
    p2pJingleSession: JingleSessionPC;
    videoSIPGWHandler: VideoSIPGW;
    recordingManager: RecordingManager;
    /**
     * If the conference.joined event has been sent this will store the timestamp when it happened.
     *
     * @type {undefined|number}
     * @private
     */
    connection: JitsiConnection;
    xmpp: XMPP;
    room: ChatRoom;
    e2eping: E2ePing;
    rtc: RTC;
    qualityController: QualityController;
    participantConnectionStatus: ParticipantConnectionStatusHandler;
//    statistics: Statistics;
    /**
     * Emits {@link JitsiConferenceEvents.JVB121_STATUS}.
     * @type {Jvb121EventGenerator}
     */
    jvb121Status: Jvb121EventGenerator;
    p2pDominantSpeakerDetection: P2PDominantSpeakerDetection;
    join(password: string): void;
    authenticateAndUpgradeRole(options: any): any;
    isJoined(): boolean;
    isP2PEnabled(): boolean;
    isP2PTestModeEnabled(): boolean;
    leave(): Promise<any>;
    getName(): any;
    getConnection(): JitsiConnection;
    isAuthEnabled(): boolean;
    isLoggedIn(): boolean;
    getAuthLogin(): any;
    isExternalAuthEnabled(): boolean;
    getExternalAuthUrl(urlForPopup?: boolean): Promise<any>;
    getLocalTracks(mediaType?: typeof MediaType): JitsiLocalTrack[];
    getLocalAudioTrack(): JitsiLocalTrack | null;
    getLocalVideoTrack(): JitsiLocalTrack | null;
    getPerformanceStats(): any | null;
    on(eventId: string, handler: Function): void;
    off(eventId: string, handler?: Function): void;
    addEventListener(eventId: string, handler: Function): void;
    removeEventListener(eventId: string, handler?: Function): void;
    addCommandListener(command: string, handler: Function): void;
    removeCommandListener(command: string, handler: Function): void;
    sendTextMessage(message: any, elementName?: string): void;
    sendPrivateTextMessage(id: any, message: any, elementName?: string): void;
    sendCommand(name: string, values: any): void;
    sendCommandOnce(name: string, values: any): void;
    removeCommand(name: string): void;
    setDisplayName(name: string): void;
    setSubject(subject: string): void;
    getTranscriber(): Transcriber;
    transcriber: Transcriber;
    getTranscriptionStatus(): string;
    addTrack(track: JitsiLocalTrack): Promise<any>;
    onLocalTrackRemoved(track: JitsiLocalTrack): void;
    removeTrack(track: JitsiLocalTrack): Promise<any>;
    replaceTrack(oldTrack: JitsiLocalTrack, newTrack: JitsiLocalTrack): Promise<any>;
    getRole(): string;
    isHidden(): boolean | null;
    isModerator(): boolean | null;
    lock(password: string): Promise<any>;
    unlock(): Promise<any>;
    selectParticipant(participantId: string): void;
    selectParticipants(participantIds: string[]): void;
    pinParticipant(participantId: string): void;
    getLastN(): number;
    setLastN(lastN: number): void;
    isInLastN(participantId: string): boolean;
    getParticipants(): JitsiParticipant[];
    getParticipantCount(countHidden?: boolean): number;
    getParticipantById(id: any): JitsiParticipant;
    grantOwner(id: string): void;
    kickParticipant(id: string): void;
    muteParticipant(id: string): void;
    onMemberJoined(jid: any, nick: any, role: any, isHidden: any, statsID: any, status: any, identity: any, botType: any): void;
    onMemberLeft(jid: any): void;
    onMemberKicked(isSelfPresence: boolean, actorId: string, kickedParticipantId: string | null): void;
    onLocalRoleChanged(role: string): void;
    onUserRoleChanged(jid: any, role: any): void;
    onDisplayNameChanged(jid: any, displayName: any): void;
    onRemoteTrackAdded(track: any): void;
    onCallAccepted(session: any, answer: any): void;
    onTransportInfo(session: any, transportInfo: any): void;
    onRemoteTrackRemoved(removedTrack: any): void;
    onIncomingCall(jingleSession: any, jingleOffer: any, now: any): void;
    onCallEnded(jingleSession: any, reasonCondition: string, reasonText: string | null): void;
    onSuspendDetected(jingleSession: any): void;
    updateDTMFSupport(): void;
    isDTMFSupported(): boolean;
    myUserId(): string;
    sendTones(tones: any, duration: any, pause: any): void;
    startRecording(options: any): Promise<any>;
    stopRecording(sessionID: string): Promise<any>;
    isSIPCallingSupported(): any;
    dial(number: any): any;
    hangup(): any;
    startTranscriber(): any;
    /**
     * Stops the transcription service.
     */
    stopTranscriber: any;
    getPhoneNumber(): any;
    getPhonePin(): any;
    getMeetingUniqueId(): string | undefined;
    getActivePeerConnection(): any | null;
    getConnectionState(): RTCIceConnectionState | null;
    setStartMutedPolicy(policy: any): void;
    getStartMutedPolicy(): any;
    isStartAudioMuted(): boolean;
    isStartVideoMuted(): boolean;
    getConnectionTimes(): any;
    setLocalParticipantProperty(name: any, value: any): void;
    removeLocalParticipantProperty(name: any): void;
    getLocalParticipantProperty(name: any): any;
    sendFeedback(overallFeedback: any, detailedFeedback: any): Promise<any>;
    isCallstatsEnabled(): boolean;
    getSsrcByTrack(track: any): number | undefined;
    sendApplicationLog(message: string): void;
    sendEndpointMessage(to: string, payload: object): void;
    broadcastEndpointMessage(payload: object): void;
    sendMessage(message: string | object, to?: string, sendThroughVideobridge?: boolean): void;
    isConnectionInterrupted(): boolean;
    p2pEstablishmentDuration: number | undefined;
    jvbEstablishmentDuration: number;
    getProperty(key: string): any;
    isP2PActive(): boolean;
    getP2PConnectionState(): string | null;
    startP2PSession(): void;
    stopP2PSession(): void;
    getSpeakerStats(): object;
    setReceiverVideoConstraint(maxFrameHeight: number): void;
    setSenderVideoConstraint(maxFrameHeight: number): Promise<any>;
    createVideoSIPGWSession(sipAddress: string, displayName: string): any | Error;
    isE2EESupported(): boolean;
    toggleE2EE(enabled: boolean): void;
    isLobbySupported(): boolean;
    isMembersOnly(): boolean;
    enableLobby(): Promise<any>;
    disableLobby(): void;
    joinLobby(displayName: string, email: string): Promise<never>;
    lobbyDenyAccess(id: string): void;
    lobbyApproveAccess(id: string): void;
}
declare namespace JitsiConference {
    export function resourceCreator(jid: string, isAuthenticatedUser: boolean): string;
}
export default JitsiConference;
import JitsiConferenceEventManager from "./JitsiConferenceEventManager";
import ComponentsVersions from "./modules/version/ComponentsVersions";
import ConnectionQuality from "./modules/connectivity/ConnectionQuality";
import AvgRTPStatsReporter from "./modules/statistics/AvgRTPStatsReporter";
import AudioOutputProblemDetector from "./modules/statistics/AudioOutputProblemDetector";
import SpeakerStatsCollector from "./modules/statistics/SpeakerStatsCollector";
import VideoSIPGW from "./modules/videosipgw/VideoSIPGW";
import RecordingManager from "./modules/recording/RecordingManager";
import { E2EEncryption } from "./modules/e2ee/E2EEncryption";
import E2ePing from "./modules/e2eping/e2eping";
import RTC from "./modules/RTC/RTC";
import { QualityController } from "./modules/qualitycontrol/QualityController";
import ParticipantConnectionStatusHandler from "./modules/connectivity/ParticipantConnectionStatus";
import Statistics from "./modules/statistics/statistics";
import VADAudioAnalyser from "./modules/detection/VADAudioAnalyser";
import NoAudioSignalDetection from "./modules/detection/NoAudioSignalDetection";
import Jvb121EventGenerator from "./modules/event/Jvb121EventGenerator";
import P2PDominantSpeakerDetection from "./modules/detection/P2PDominantSpeakerDetection";
import * as MediaType from "./service/RTC/MediaType";
import Transcriber from "./modules/transcription/transcriber";
import JitsiParticipant from "./JitsiParticipant";
import IceFailedHandling from "./modules/connectivity/IceFailedHandling";
import { EventEmitter } from "events";
import JingleSessionPC from "./modules/xmpp/JingleSessionPC";
import JitsiConnection from "./JitsiConnection";
import XMPP from "./modules/xmpp/xmpp";
import ChatRoom from "./modules/xmpp/ChatRoom";
import JitsiLocalTrack from "./modules/RTC/JitsiLocalTrack";
import JitsiRemoteTrack from "./modules/RTC/JitsiRemoteTrack";
