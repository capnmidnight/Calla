import { arrayClear } from "kudzu/arrays/arrayClear";
import { Logger } from "kudzu/debugging/Logger";
import { once } from "kudzu/events/once";
import { sleep } from "kudzu/events/sleep";
import { isDefined, isNullOrUndefined } from "kudzu/typeChecks";
import { using } from "kudzu/using";
import { CallaAudioStreamAddedEvent, CallaAudioStreamRemovedEvent, CallaConferenceFailedEvent, CallaConferenceJoinedEvent, CallaConferenceLeftEvent, CallaParticipantJoinedEvent, CallaParticipantLeftEvent, CallaParticipantNameChangeEvent, CallaTeleconferenceServerConnectedEvent, CallaTeleconferenceServerDisconnectedEvent, CallaTeleconferenceServerFailedEvent, CallaUserAudioMutedEvent, CallaUserVideoMutedEvent, CallaVideoStreamAddedEvent, CallaVideoStreamRemovedEvent, StreamType } from "../../CallaEvents";
import { ConnectionState } from "../../ConnectionState";
import { addLogger, BaseTeleconferenceClient, DEFAULT_LOCAL_USER_ID } from "../BaseTeleconferenceClient";
function encodeUserName(v) {
    try {
        return encodeURIComponent(v);
    }
    catch (exp) {
        return v;
    }
}
function decodeUserName(v) {
    if (isNullOrUndefined(v)) {
        return "unknown";
    }
    else {
        try {
            return decodeURIComponent(v);
        }
        catch (exp) {
            return v;
        }
    }
}
const logger = new Logger();
export class JitsiTeleconferenceClient extends BaseTeleconferenceClient {
    host;
    bridgeHost;
    bridgeMUC;
    useDefaultMetadataClient = false;
    enableTeleconference = true;
    connection = null;
    conference = null;
    tracks = new Map();
    listenersForObjs = new Map();
    constructor(fetcher, audio, host, bridgeHost, bridgeMUC) {
        super(fetcher, audio);
        this.host = host;
        this.bridgeHost = bridgeHost;
        this.bridgeMUC = bridgeMUC;
    }
    _on(obj, evtName, handler) {
        let objListeners = this.listenersForObjs.get(obj);
        if (!objListeners) {
            this.listenersForObjs.set(obj, objListeners = new Map());
        }
        let evtListeners = objListeners.get(evtName);
        if (!evtListeners) {
            objListeners.set(evtName, evtListeners = new Array());
        }
        evtListeners.push(handler);
        obj.addEventListener(evtName, handler);
    }
    _off(obj) {
        const objListeners = this.listenersForObjs.get(obj);
        if (objListeners) {
            this.listenersForObjs.delete(obj);
            for (const [evtName, handlers] of objListeners.entries()) {
                for (const handler of handlers) {
                    obj.removeEventListener(evtName, handler);
                }
                arrayClear(handlers);
            }
            objListeners.clear();
        }
    }
    async connect() {
        this.setConnectionState(ConnectionState.Connecting);
        const connectionEvents = JitsiMeetJS.events.connection;
        this.connection = new JitsiMeetJS.JitsiConnection(null, null, {
            hosts: {
                domain: this.bridgeHost,
                muc: this.bridgeMUC
            },
            serviceUrl: `https://${this.host}/http-bind`
        });
        for (const evtName of Object.values(connectionEvents)) {
            addLogger(this.connection, evtName);
        }
        const onDisconnect = () => {
            if (this.connection) {
                this._off(this.connection);
                this.connection = null;
            }
        };
        const fwd = (evtName, EvtClass, extra) => {
            this._on(this.connection, evtName, () => {
                this.dispatchEvent(new EvtClass());
                if (extra) {
                    extra();
                }
            });
        };
        fwd(connectionEvents.CONNECTION_ESTABLISHED, CallaTeleconferenceServerConnectedEvent);
        fwd(connectionEvents.CONNECTION_DISCONNECTED, CallaTeleconferenceServerDisconnectedEvent, onDisconnect);
        fwd(connectionEvents.CONNECTION_FAILED, CallaTeleconferenceServerFailedEvent, onDisconnect);
        const connectTask = once(this.connection, connectionEvents.CONNECTION_ESTABLISHED);
        this.connection.connect();
        await connectTask;
        this.setConnectionState(ConnectionState.Connected);
    }
    async join(roomName, enableTeleconference) {
        this.setConferenceState(ConnectionState.Connecting);
        this.enableTeleconference = enableTeleconference;
        const isoRoomName = roomName.toLocaleLowerCase();
        if (isoRoomName !== this.roomName) {
            if (this.conference) {
                await this.leave();
            }
            this.roomName = isoRoomName;
            this.conference = this.connection.initJitsiConference(this.roomName, {
                openBridgeChannel: this.useDefaultMetadataClient,
                p2p: { enabled: false },
                startVideoMuted: true,
            });
            const conferenceEvents = JitsiMeetJS.events.conference;
            this.conference.addEventListener(conferenceEvents.DATA_CHANNEL_OPENED, (...params) => {
                logger.log("DataChannel", ...params);
            });
            for (const evtName of Object.values(conferenceEvents)) {
                if (evtName !== "conference.audioLevelsChanged") {
                    addLogger(this.conference, evtName);
                }
            }
            const fwd = (evtName, EvtClass, extra) => {
                this._on(this.conference, evtName, () => {
                    this.dispatchEvent(new EvtClass());
                    if (extra) {
                        extra(evtName);
                    }
                });
            };
            const onLeft = async (evtName) => {
                this.localUserID = DEFAULT_LOCAL_USER_ID;
                if (this.tracks.size > 0) {
                    console.warn("><> CALLA <>< ---- there are leftover conference tracks");
                    for (const userID of this.tracks.keys()) {
                        await this.tryRemoveTrack(userID, StreamType.Video);
                        await this.tryRemoveTrack(userID, StreamType.Audio);
                        this.dispatchEvent(new CallaParticipantLeftEvent(userID));
                    }
                }
                this.dispatchEvent(new CallaConferenceLeftEvent(this.localUserID));
                if (this.conference) {
                    this._off(this.conference);
                    this.conference = null;
                }
                console.info(`Left room '${roomName}'. Reason: ${evtName}.`);
            };
            fwd(conferenceEvents.CONFERENCE_ERROR, CallaConferenceFailedEvent, onLeft);
            fwd(conferenceEvents.CONFERENCE_FAILED, CallaConferenceFailedEvent, onLeft);
            fwd(conferenceEvents.CONNECTION_INTERRUPTED, CallaConferenceFailedEvent, onLeft);
            this._on(this.conference, conferenceEvents.CONFERENCE_JOINED, async () => {
                const userID = this.conference.myUserId();
                if (userID) {
                    this.localUserID = userID;
                    this.setConferenceState(ConnectionState.Connected);
                    this.dispatchEvent(new CallaConferenceJoinedEvent(userID, null));
                }
            });
            this._on(this.conference, conferenceEvents.CONFERENCE_LEFT, () => onLeft(conferenceEvents.CONFERENCE_LEFT));
            this._on(this.conference, conferenceEvents.USER_JOINED, (id, jitsiUser) => {
                const displayName = jitsiUser.getDisplayName();
                const decodedUserName = decodeUserName(displayName);
                logger.log(`${conferenceEvents.USER_JOINED}:${id}`, displayName, decodedUserName);
                this.dispatchEvent(new CallaParticipantJoinedEvent(id, decodedUserName, null));
            });
            this._on(this.conference, conferenceEvents.USER_LEFT, (id) => {
                this.dispatchEvent(new CallaParticipantLeftEvent(id));
            });
            this._on(this.conference, conferenceEvents.DISPLAY_NAME_CHANGED, (id, displayName) => {
                const decodedUserName = decodeUserName(displayName);
                logger.log(`${conferenceEvents.DISPLAY_NAME_CHANGED}:${id}`, displayName, decodedUserName);
                this.dispatchEvent(new CallaParticipantNameChangeEvent(id, decodedUserName));
            });
            const onTrackMuteChanged = (track, muted) => {
                const userID = track.getParticipantId() || this.localUserID, trackKind = track.getType(), evt = trackKind === StreamType.Audio
                    ? new CallaUserAudioMutedEvent(userID, muted)
                    : new CallaUserVideoMutedEvent(userID, muted);
                this.dispatchEvent(evt);
            };
            this._on(this.conference, conferenceEvents.TRACK_ADDED, (track) => {
                const userID = track.getParticipantId() || this.localUserID, trackKind = track.getType(), trackAddedEvt = trackKind === StreamType.Audio
                    ? new CallaAudioStreamAddedEvent(userID, track.stream)
                    : new CallaVideoStreamAddedEvent(userID, track.stream);
                let userTracks = this.tracks.get(userID);
                if (!userTracks) {
                    userTracks = new Map();
                    this.tracks.set(userID, userTracks);
                }
                const curTrack = userTracks.get(trackKind);
                if (curTrack) {
                    const trackRemovedEvt = StreamType.Audio
                        ? new CallaAudioStreamRemovedEvent(userID, curTrack.stream)
                        : new CallaVideoStreamRemovedEvent(userID, curTrack.stream);
                    this.dispatchEvent(trackRemovedEvt);
                    curTrack.dispose();
                }
                userTracks.set(trackKind, track);
                this.dispatchEvent(trackAddedEvt);
                track.addEventListener(JitsiMeetJS.events.track.TRACK_MUTE_CHANGED, (track) => {
                    onTrackMuteChanged(track, track.isMuted());
                });
                onTrackMuteChanged(track, false);
            });
            this._on(this.conference, conferenceEvents.TRACK_REMOVED, (track) => {
                using(track, (_) => {
                    const userID = track.getParticipantId() || this.localUserID, trackKind = track.getType(), trackRemovedEvt = StreamType.Audio
                        ? new CallaAudioStreamRemovedEvent(userID, track.stream)
                        : new CallaVideoStreamRemovedEvent(userID, track.stream);
                    onTrackMuteChanged(track, true);
                    this.dispatchEvent(trackRemovedEvt);
                    const userTracks = this.tracks.get(userID);
                    if (userTracks) {
                        const curTrack = userTracks.get(trackKind);
                        if (curTrack) {
                            userTracks.delete(trackKind);
                            if (userTracks.size === 0) {
                                this.tracks.delete(userID);
                            }
                            if (curTrack !== track) {
                                curTrack.dispose();
                            }
                        }
                    }
                });
            });
            const joinTask = once(this, "conferenceJoined");
            this.conference.join(null);
            await joinTask;
        }
    }
    async identify(userName) {
        this.localUserName = userName;
        const encodedUserName = encodeUserName(userName);
        await sleep(350);
        const logger = new Logger();
        logger.log("identify:" + this.localUserID, userName, encodedUserName);
        this.conference.setDisplayName(encodedUserName);
    }
    async tryRemoveTrack(userID, kind) {
        const userTracks = this.tracks.get(userID);
        const EvtClass = kind === StreamType.Video
            ? CallaVideoStreamRemovedEvent
            : CallaAudioStreamRemovedEvent;
        if (userTracks) {
            const track = userTracks.get(kind);
            if (track) {
                this.dispatchEvent(new EvtClass(userID, track.stream));
                userTracks.delete(kind);
                try {
                    if (this.conference && track.isLocal) {
                        this.conference.removeTrack(track);
                    }
                }
                catch (exp) {
                    console.warn(exp);
                }
                finally {
                    track.dispose();
                }
            }
            if (userTracks.size === 0) {
                this.tracks.delete(userID);
            }
        }
    }
    async leave() {
        this.setConferenceState(ConnectionState.Disconnecting);
        try {
            await this.tryRemoveTrack(this.localUserID, StreamType.Video);
            await this.tryRemoveTrack(this.localUserID, StreamType.Audio);
            const leaveTask = once(this, "conferenceLeft");
            this.conference.leave();
            await leaveTask;
            this.setConferenceState(ConnectionState.Disconnected);
        }
        catch (exp) {
            console.warn("><> CALLA <>< ---- Failed to leave teleconference.", exp);
        }
        finally {
            this.conference = null;
            this.roomName = null;
        }
    }
    async disconnect() {
        this.setConnectionState(ConnectionState.Disconnecting);
        if (this.conferenceState === ConnectionState.Connected) {
            await this.leave();
        }
        try {
            const disconnectTask = once(this, "serverDisconnected");
            this.connection.disconnect();
            await disconnectTask;
            this.setConnectionState(ConnectionState.Disconnected);
        }
        catch (exp) {
            console.warn("><> CALLA <>< ---- Failed to disconnect from teleconference server.", exp);
        }
        finally {
            this.connection = null;
        }
    }
    userExists(id) {
        return this.conference
            && this.conference.participants
            && id in this.conference.participants;
    }
    getUserNames() {
        if (this.conference) {
            return Object.keys(this.conference.participants)
                .map(k => [k, decodeUserName(this.conference.participants[k].getDisplayName())]);
        }
        else {
            return [];
        }
    }
    getCurrentMediaTrack(type) {
        if (this.localUserID === DEFAULT_LOCAL_USER_ID) {
            return null;
        }
        const userTracks = this.tracks.get(this.localUserID);
        if (!userTracks) {
            return null;
        }
        return userTracks.get(type);
    }
    async onInputsChanged(evt) {
        const curAudio = this.getCurrentMediaTrack(StreamType.Audio);
        if (curAudio) {
            const removeTask = this.getNext("audioRemoved", this.localUserID);
            this.conference.removeTrack(curAudio);
            await removeTask;
        }
        const curVideo = this.getCurrentMediaTrack(StreamType.Video);
        if (curVideo) {
            const removeTask = this.getNext("videoRemoved", this.localUserID);
            this.conference.removeTrack(curVideo);
            await removeTask;
        }
        if (isDefined(this.conference)
            && isDefined(evt.audio)
            && this.enableTeleconference) {
            const addTask = this.getNext("audioAdded", this.localUserID);
            const opts = {
                devices: ["audio"],
                micDeviceId: evt.audio.deviceId,
                constraints: {
                    autoGainControl: true,
                    echoCancellation: true,
                    noiseSuppression: true
                }
            };
            if (isDefined(evt.video)) {
                opts.devices.push("video");
                opts.cameraDeviceId = evt.video.deviceId;
            }
            const tracks = await JitsiMeetJS.createLocalTracks(opts);
            for (const track of tracks) {
                const stream = track.getOriginalStream();
                this.devices.currentStream = stream;
                this.conference.addTrack(track);
            }
            await addTask;
        }
    }
    get startDevicesImmediately() {
        return false;
    }
    async toggleAudioMuted() {
        const changeTask = this.getNext("audioMuteStatusChanged", this.localUserID);
        const cur = this.getCurrentMediaTrack(StreamType.Audio);
        if (cur) {
            const muted = cur.isMuted();
            if (muted) {
                await cur.unmute();
            }
            else {
                await cur.mute();
            }
        }
        else {
            await this.devices.enablePreferredAudioInput();
        }
        const evt = await changeTask;
        return evt.muted;
    }
    async toggleVideoMuted() {
        const changeTask = this.getNext("videoMuteStatusChanged", this.localUserID);
        const cur = this.getCurrentMediaTrack(StreamType.Video);
        if (cur) {
            await this.devices.setVideoInputDevice(null);
        }
        else {
            this.devices.needsVideoDevice = true;
            await this.devices.enablePreferredVideoInput();
        }
        const evt = await changeTask;
        return evt.muted;
    }
    isMediaMuted(type) {
        const cur = this.getCurrentMediaTrack(type);
        return cur == null
            || cur.isMuted();
    }
    async getAudioMuted() {
        return this.isMediaMuted(StreamType.Audio);
    }
    async getVideoMuted() {
        return this.isMediaMuted(StreamType.Video);
    }
    get localAudioInput() {
        return null;
    }
    get useHalfDuplex() {
        return false;
    }
    set useHalfDuplex(_v) {
        console.info("Half-duplex is not available on Jitsi");
    }
    get halfDuplexMin() {
        return 0;
    }
    set halfDuplexMin(_v) {
        console.info("Half-duplex is not available on Jitsi");
    }
    get halfDuplexMax() {
        return 1;
    }
    set halfDuplexMax(_v) {
        console.info("Half-duplex is not available on Jitsi");
    }
    get halfDuplexThreshold() {
        return Number.POSITIVE_INFINITY;
    }
    set halfDuplexThreshold(_v) {
        console.info("Half-duplex is not available on Jitsi");
    }
    get halfDuplexAttack() {
        return 0;
    }
    set halfDuplexAttack(_v) {
        console.info("Half-duplex is not available on Jitsi");
    }
    get halfDuplexDecay() {
        return 0;
    }
    set halfDuplexDecay(_v) {
        console.info("Half-duplex is not available on Jitsi");
    }
    get halfDuplexSustain() {
        return 0;
    }
    set halfDuplexSustain(_v) {
        console.info("Half-duplex is not available on Jitsi");
    }
    get halfDuplexHold() {
        return 0;
    }
    set halfDuplexHold(_v) {
        console.info("Half-duplex is not available on Jitsi");
    }
    get halfDuplexRelease() {
        return 0;
    }
    set halfDuplexRelease(_v) {
        console.info("Half-duplex is not available on Jitsi");
    }
    get halfDuplexLevel() {
        return 0;
    }
    get remoteActivityLevel() {
        return 0;
    }
}
//# sourceMappingURL=JitsiTeleconferenceClient.js.map