import { arrayClear } from "kudzu/arrays/arrayClear";
import { ErsatzEventTarget } from "kudzu/events/ErsatzEventTarget";
import { once } from "kudzu/events/once";
import { IFetcher } from "kudzu/io/IFetcher";
import { using } from "kudzu/using";
import { AudioManager } from "../../audio/AudioManager";
import type { CallaTeleconferenceEvents } from "../../CallaEvents";
import {
    CallaAudioStreamAddedEvent,
    CallaAudioStreamRemovedEvent,
    CallaConferenceFailedEvent,
    CallaConferenceJoinedEvent,
    CallaConferenceLeftEvent,
    CallaParticipantJoinedEvent,
    CallaParticipantLeftEvent,
    CallaParticipantNameChangeEvent,
    CallaTeleconferenceServerConnectedEvent,
    CallaTeleconferenceServerDisconnectedEvent,
    CallaTeleconferenceServerFailedEvent,
    CallaUserAudioMutedEvent,
    CallaUserVideoMutedEvent,
    CallaVideoStreamAddedEvent,
    CallaVideoStreamRemovedEvent,
    StreamType
} from "../../CallaEvents";
import { ConnectionState } from "../../ConnectionState";
import type JitsiConference from "../../lib-jitsi-meet/JitsiConference";
import type { JitsiConnection } from "../../lib-jitsi-meet/JitsiMeetJS";
import type JitsiParticipant from "../../lib-jitsi-meet/JitsiParticipant";
import type JitsiLocalTrack from "../../lib-jitsi-meet/modules/RTC/JitsiLocalTrack";
import type JitsiRemoteTrack from "../../lib-jitsi-meet/modules/RTC/JitsiRemoteTrack";
import type { IMetadataClientExt } from "../../meta/IMetadataClient";
import { JitsiMetadataClient } from "../../meta/jitsi/JitsiMetadataClient";
import {
    addLogger,
    BaseTeleconferenceClient,
    DEFAULT_LOCAL_USER_ID
} from "../BaseTeleconferenceClient";


function encodeUserName(v: string) {
    try {
        return encodeURIComponent(v);
    }
    catch (exp) {
        return v;
    }
}

function decodeUserName(v: string) {
    try {
        return decodeURIComponent(v);
    }
    catch (exp) {
        return v;
    }
}

export class JitsiTeleconferenceClient
    extends BaseTeleconferenceClient {

    private usingDefaultMetadataClient = false;
    private connection: JitsiConnection = null;
    conference: JitsiConference = null;

    private tracks = new Map<string, Map<StreamType, JitsiLocalTrack | JitsiRemoteTrack>>();
    private listenersForObjs = new Map<ErsatzEventTarget, Map<string, Function[]>>();

    constructor(fetcher: IFetcher, audio: AudioManager, private host: string, private bridgeHost: string, private bridgeMUC: string) {
        super(fetcher, audio);
    }

    private _on(obj: ErsatzEventTarget, evtName: string, handler: Function): void {
        let objListeners = this.listenersForObjs.get(obj);
        if (!objListeners) {
            this.listenersForObjs.set(obj, objListeners = new Map<string, Function[]>());
        }

        let evtListeners = objListeners.get(evtName);
        if (!evtListeners) {
            objListeners.set(evtName, evtListeners = new Array<Function>());
        }

        evtListeners.push(handler);
        obj.addEventListener(evtName, handler);
    }

    private _off(obj: ErsatzEventTarget) {
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

    getDefaultMetadataClient(): IMetadataClientExt {
        this.usingDefaultMetadataClient = true;
        return new JitsiMetadataClient(this);
    }

    async connect(): Promise<void> {
        await super.connect();

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

        const fwd = (evtName: string, EvtClass: new () => CallaTeleconferenceEvents[keyof CallaTeleconferenceEvents], extra?: () => void): void => {
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
    }

    async join(roomName: string, password?: string): Promise<void> {
        await super.join(roomName, password);

        const isoRoomName = roomName.toLocaleLowerCase();
        if (isoRoomName !== this.roomName) {
            if (this.conference) {
                await this.leave();
            }

            this.roomName = isoRoomName;

            this.conference = this.connection.initJitsiConference(this.roomName, {
                openBridgeChannel: this.usingDefaultMetadataClient,
                p2p: { enabled: false },
                startVideoMuted: true
            });

            const conferenceEvents = JitsiMeetJS.events.conference;
            for (const evtName of Object.values(conferenceEvents)) {
                if (evtName !== "conference.audioLevelsChanged") {
                    addLogger(this.conference, evtName);
                }
            }

            const fwd = (evtName: string, EvtClass: new () => CallaTeleconferenceEvents[keyof CallaTeleconferenceEvents], extra?: (evtName: string) => void): void => {
                this._on(this.conference, evtName, () => {
                    this.dispatchEvent(new EvtClass());
                    if (extra) {
                        extra(evtName);
                    }
                });
            };

            const onLeft = async (evtName: string) => {
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
                    this.dispatchEvent(new CallaConferenceJoinedEvent(userID, null));
                }
            });

            this._on(this.conference, conferenceEvents.CONFERENCE_LEFT, () => onLeft(conferenceEvents.CONFERENCE_LEFT));

            this._on(this.conference, conferenceEvents.USER_JOINED, (id: string, jitsiUser: JitsiParticipant) => {
                this.dispatchEvent(new CallaParticipantJoinedEvent(
                    id,
                    decodeUserName(jitsiUser.getDisplayName()),
                    null));
            });

            this._on(this.conference, conferenceEvents.USER_LEFT, (id: string) => {
                this.dispatchEvent(new CallaParticipantLeftEvent(id));
            });

            this._on(this.conference, conferenceEvents.DISPLAY_NAME_CHANGED, (id: string, displayName: string) => {
                this.dispatchEvent(new CallaParticipantNameChangeEvent(id, decodeUserName(displayName)));
            });

            const onTrackMuteChanged = (track: JitsiLocalTrack | JitsiRemoteTrack, muted: boolean) => {
                const userID = track.getParticipantId() || this.localUserID,
                    trackKind = track.getType() as StreamType,
                    evt = trackKind === StreamType.Audio
                        ? new CallaUserAudioMutedEvent(userID, muted)
                        : new CallaUserVideoMutedEvent(userID, muted);

                this.dispatchEvent(evt);
            };

            this._on(this.conference, conferenceEvents.TRACK_ADDED, (track: JitsiLocalTrack | JitsiRemoteTrack) => {
                const userID = track.getParticipantId() || this.localUserID,
                    trackKind = track.getType() as StreamType,
                    trackAddedEvt = trackKind === StreamType.Audio
                        ? new CallaAudioStreamAddedEvent(userID, track.stream)
                        : new CallaVideoStreamAddedEvent(userID, track.stream);

                let userTracks = this.tracks.get(userID);
                if (!userTracks) {
                    userTracks = new Map<StreamType, JitsiLocalTrack | JitsiRemoteTrack>();
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

                track.addEventListener(JitsiMeetJS.events.track.TRACK_MUTE_CHANGED, (track: JitsiLocalTrack | JitsiRemoteTrack) => {
                    onTrackMuteChanged(track, track.isMuted());
                });

                onTrackMuteChanged(track, false);
            });

            this._on(this.conference, conferenceEvents.TRACK_REMOVED, (track: JitsiLocalTrack | JitsiRemoteTrack) => {
                using(track, (_) => {
                    const userID = track.getParticipantId() || this.localUserID,
                        trackKind = track.getType() as StreamType,
                        trackRemovedEvt = StreamType.Audio
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
            this.conference.join(password);
            await joinTask;
        }
    }

    async identify(userName: string): Promise<void> {
        this.localUserName = userName;
        this.conference.setDisplayName(encodeUserName(userName));
    }

    private async tryRemoveTrack(userID: string, kind: StreamType) {
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
                        this.conference.removeTrack(track as JitsiLocalTrack);
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

    async leave(): Promise<void> {
        await super.leave();

        try {
            await this.tryRemoveTrack(this.localUserID, StreamType.Video);
            await this.tryRemoveTrack(this.localUserID, StreamType.Audio);
            const leaveTask = once(this, "conferenceLeft");
            this.conference.leave();
            await leaveTask;
        }
        catch (exp) {
            console.warn("><> CALLA <>< ---- Failed to leave teleconference.", exp);
        }
    }

    async disconnect(): Promise<void> {
        await super.disconnect();
        if (this.conferenceState === ConnectionState.Connected) {
            await this.leave();
        }

        const disconnectTask = once(this, "serverDisconnected");
        this.connection.disconnect();
        await disconnectTask;
    }

    userExists(id: string): boolean {
        return this.conference
            && this.conference.participants
            && id in this.conference.participants;
    }

    getUserNames(): string[][] {
        if (this.conference) {
            return Object.keys(this.conference.participants)
                .map(k => [k, decodeUserName(this.conference.participants[k].getDisplayName())]);
        }
        else {
            return [];
        }
    }

    private getCurrentMediaTrack(type: StreamType): JitsiLocalTrack {
        if (this.localUserID === DEFAULT_LOCAL_USER_ID) {
            return null;
        }

        const userTracks = this.tracks.get(this.localUserID);
        if (!userTracks) {
            return null;
        }

        return userTracks.get(type) as JitsiLocalTrack;
    }

    async setAudioInputDevice(device: MediaDeviceInfo): Promise<void> {
        await super.setAudioInputDevice(device);

        const cur = this.getCurrentMediaTrack(StreamType.Audio);
        if (cur) {
            const removeTask = this.getNext("audioRemoved", this.localUserID);
            this.conference.removeTrack(cur);
            await removeTask;
        }

        if (this.conference && this.preferredAudioInputID) {
            const addTask = this.getNext("audioAdded", this.localUserID);
            const tracks = await JitsiMeetJS.createLocalTracks({
                devices: ["audio"],
                micDeviceId: this.preferredAudioInputID,
                constraints: {
                    autoGainControl: true,
                    echoCancellation: true,
                    noiseSuppression: true
                }
            });

            for (const track of tracks) {
                this.conference.addTrack(track);
            }

            await addTask;
        }
    }

    async setVideoInputDevice(device: MediaDeviceInfo) {
        await super.setVideoInputDevice(device);

        const cur = this.getCurrentMediaTrack(StreamType.Video);
        if (cur) {
            const removeTask = this.getNext("videoRemoved", this.localUserID);
            this.conference.removeTrack(cur);
            await removeTask;
        }

        if (this.conference && this.preferredVideoInputID) {
            const addTask = this.getNext("videoAdded", this.localUserID);
            const tracks = await JitsiMeetJS.createLocalTracks({
                devices: ["video"],
                cameraDeviceId: this.preferredVideoInputID
            });

            for (const track of tracks) {
                this.conference.addTrack(track);
            }

            await addTask;
        }
    }

    async getCurrentAudioInputDevice(): Promise<MediaDeviceInfo> {
        const cur = this.getCurrentMediaTrack(StreamType.Audio),
            devices = await this.getAudioInputDevices(),
            device = devices.filter((d) =>
                cur != null && d.deviceId === cur.getDeviceId()
                || cur == null && d.deviceId === this.preferredAudioInputID);
        if (device.length === 0) {
            return null;
        }
        else {
            return device[0];
        }
    }

    async getCurrentVideoInputDevice(): Promise<MediaDeviceInfo> {
        const cur = this.getCurrentMediaTrack(StreamType.Video),
            devices = await this.getVideoInputDevices(),
            device = devices.filter((d) =>
                cur != null && d.deviceId === cur.getDeviceId()
                || cur == null && d.deviceId === this.preferredVideoInputID);
        if (device.length === 0) {
            return null;
        }
        else {
            return device[0];
        }
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
            await this.setPreferredAudioInput(true);
        }

        const evt = await changeTask;
        return evt.muted;
    }

    async toggleVideoMuted() {
        const changeTask = this.getNext("videoMuteStatusChanged", this.localUserID);
        const cur = this.getCurrentMediaTrack(StreamType.Video);
        if (cur) {
            await this.setVideoInputDevice(null);
        }
        else {
            await this.setPreferredVideoInput(true);
        }

        const evt = await changeTask;
        return evt.muted;
    }

    private isMediaMuted(type: StreamType) {
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
}
