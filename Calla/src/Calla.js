import { HubConnectionState } from "@microsoft/signalr";
import { getBlob as _getBlob, isNullOrUndefined, loadScript as _loadScript, TypedEventBase } from "kudzu";
import { AudioActivityEvent } from "./audio/AudioActivityEvent";
import { canChangeAudioOutput } from "./audio/canChangeAudioOutput";
import { CallaMetadataEventType, CallaTeleconferenceEventType } from "./CallaEvents";
import { JitsiTeleconferenceClient } from "./JitsiTeleconferenceClient";
export var ConnectionState;
(function (ConnectionState) {
    ConnectionState["InConference"] = "in-conference";
    ConnectionState["JoiningConference"] = "joining-conference";
    ConnectionState["Connected"] = "connected";
    ConnectionState["Connecting"] = "connecting";
    ConnectionState["Prepaired"] = "prepaired";
    ConnectionState["Prepairing"] = "prepairing";
    ConnectionState["Unprepared"] = "unprepaired";
})(ConnectionState || (ConnectionState = {}));
const audioActivityEvt = new AudioActivityEvent();
export class Calla extends TypedEventBase {
    constructor(getBlob, loadScript, TeleClientType, MetaClientType) {
        super();
        this.isAudioMuted = null;
        this.isVideoMuted = null;
        if (isNullOrUndefined(getBlob)) {
            getBlob = _getBlob;
        }
        if (isNullOrUndefined(loadScript)) {
            loadScript = _loadScript;
        }
        if (isNullOrUndefined(TeleClientType)) {
            TeleClientType = JitsiTeleconferenceClient;
        }
        this.tele = new TeleClientType(getBlob, loadScript);
        if (isNullOrUndefined(MetaClientType)) {
            this.meta = this.tele.getDefaultMetadataClient();
        }
        else {
            this.meta = new MetaClientType(this.tele);
        }
        const fwd = this.dispatchEvent.bind(this);
        this.tele.addEventListener(CallaTeleconferenceEventType.ServerConnected, fwd);
        this.tele.addEventListener(CallaTeleconferenceEventType.ServerDisconnected, fwd);
        this.tele.addEventListener(CallaTeleconferenceEventType.ServerFailed, fwd);
        this.tele.addEventListener(CallaTeleconferenceEventType.ConferenceFailed, fwd);
        this.tele.addEventListener(CallaTeleconferenceEventType.ConferenceRestored, fwd);
        this.tele.addEventListener(CallaTeleconferenceEventType.UserNameChanged, fwd);
        this.tele.addEventListener(CallaTeleconferenceEventType.AudioMuteStatusChanged, fwd);
        this.tele.addEventListener(CallaTeleconferenceEventType.VideoMuteStatusChanged, fwd);
        this.tele.addEventListener(CallaTeleconferenceEventType.ConferenceJoined, async (evt) => {
            const user = this.audio.createLocalUser(evt.id);
            evt.pose = user.pose;
            await this.setPreferredDevices();
            this.dispatchEvent(evt);
        });
        this.tele.addEventListener(CallaTeleconferenceEventType.ConferenceLeft, (evt) => {
            this.audio.createLocalUser(evt.id);
            this.dispatchEvent(evt);
        });
        this.tele.addEventListener(CallaTeleconferenceEventType.ParticipantJoined, async (joinEvt) => {
            const poseEvt = await this.meta.getNext(CallaMetadataEventType.UserPosed, joinEvt.id);
            joinEvt.source = this.audio.createUser(joinEvt.id);
            this.audio.setUserPose(poseEvt.id, poseEvt.px, poseEvt.py, poseEvt.pz, poseEvt.fx, poseEvt.fy, poseEvt.fz, poseEvt.ux, poseEvt.uy, poseEvt.uz, 0);
            const O = this.audio.getUserOffset(poseEvt.id);
            poseEvt.px += O[0];
            poseEvt.py += O[1];
            poseEvt.pz += O[2];
            this.dispatchEvent(joinEvt);
        });
        this.tele.addEventListener(CallaTeleconferenceEventType.ParticipantLeft, (evt) => {
            this.dispatchEvent(evt);
            this.audio.removeUser(evt.id);
        });
        this.tele.addEventListener(CallaTeleconferenceEventType.AudioAdded, (evt) => {
            const user = this.audio.getUser(evt.id);
            if (user) {
                let stream = user.streams.get(evt.kind);
                if (stream) {
                    user.streams.delete(evt.kind);
                }
                stream = evt.stream;
                user.streams.set(evt.kind, stream);
                if (evt.id !== this.tele.localUserID) {
                    this.audio.setUserStream(evt.id, stream);
                }
                this.dispatchEvent(evt);
            }
        });
        this.tele.addEventListener(CallaTeleconferenceEventType.AudioRemoved, (evt) => {
            const user = this.audio.getUser(evt.id);
            if (user && user.streams.has(evt.kind)) {
                user.streams.delete(evt.kind);
            }
            if (evt.id !== this.tele.localUserID) {
                this.audio.setUserStream(evt.id, null);
            }
            this.dispatchEvent(evt);
        });
        this.meta.addEventListener(CallaMetadataEventType.AvatarChanged, fwd);
        this.meta.addEventListener(CallaMetadataEventType.Chat, fwd);
        this.meta.addEventListener(CallaMetadataEventType.Emote, fwd);
        this.meta.addEventListener(CallaMetadataEventType.SetAvatarEmoji, fwd);
        const offsetEvt = (poseEvt) => {
            const O = this.audio.getUserOffset(poseEvt.id);
            if (O) {
                poseEvt.px += O[0];
                poseEvt.py += O[1];
                poseEvt.pz += O[2];
            }
            this.dispatchEvent(poseEvt);
        };
        this.meta.addEventListener(CallaMetadataEventType.UserPointer, offsetEvt);
        this.meta.addEventListener(CallaMetadataEventType.UserPosed, (evt) => {
            this.audio.setUserPose(evt.id, evt.px, evt.py, evt.pz, evt.fx, evt.fy, evt.fz, evt.ux, evt.uy, evt.uz);
            offsetEvt(evt);
        });
        this.audio.addEventListener("audioActivity", (evt) => {
            audioActivityEvt.id = evt.id;
            audioActivityEvt.isActive = evt.isActive;
            this.dispatchEvent(audioActivityEvt);
        });
        const dispose = this.dispose.bind(this);
        window.addEventListener("beforeunload", dispose);
        window.addEventListener("unload", dispose);
        window.addEventListener("pagehide", dispose);
        Object.seal(this);
    }
    get connectionState() {
        return this.tele.connectionState;
    }
    get conferenceState() {
        return this.tele.conferenceState;
    }
    get audio() {
        return this.tele.audio;
    }
    get preferredAudioOutputID() {
        return this.tele.preferredAudioOutputID;
    }
    set preferredAudioOutputID(v) {
        this.tele.preferredAudioOutputID = v;
    }
    get preferredAudioInputID() {
        return this.tele.preferredAudioInputID;
    }
    set preferredAudioInputID(v) {
        this.tele.preferredAudioInputID = v;
    }
    get preferredVideoInputID() {
        return this.tele.preferredVideoInputID;
    }
    set preferredVideoInputID(v) {
        this.tele.preferredVideoInputID = v;
    }
    async getCurrentAudioOutputDevice() {
        return await this.tele.getCurrentAudioOutputDevice();
    }
    async getMediaPermissions() {
        return await this.tele.getMediaPermissions();
    }
    async getAudioOutputDevices(filterDuplicates) {
        return await this.tele.getAudioOutputDevices(filterDuplicates);
    }
    async getAudioInputDevices(filterDuplicates) {
        return await this.tele.getAudioInputDevices(filterDuplicates);
    }
    async getVideoInputDevices(filterDuplicates) {
        return await this.tele.getVideoInputDevices(filterDuplicates);
    }
    dispose() {
        this.leave();
        this.disconnect();
    }
    get offsetRadius() {
        return this.audio.offsetRadius;
    }
    set offsetRadius(v) {
        this.audio.offsetRadius = v;
    }
    setLocalPose(px, py, pz, fx, fy, fz, ux, uy, uz) {
        this.audio.setUserPose(this.localUserID, px, py, pz, fx, fy, fz, ux, uy, uz, 0);
        this.meta.setLocalPose(px, py, pz, fx, fy, fz, ux, uy, uz);
    }
    setLocalPointer(name, px, py, pz, fx, fy, fz, ux, uy, uz) {
        this.meta.setLocalPointer(name, px, py, pz, fx, fy, fz, ux, uy, uz);
    }
    setAvatarEmoji(emoji) {
        this.meta.setAvatarEmoji(emoji);
    }
    setAvatarURL(url) {
        this.meta.setAvatarURL(url);
    }
    emote(emoji) {
        this.meta.emote(emoji);
    }
    chat(text) {
        this.meta.chat(text);
    }
    async setPreferredDevices() {
        await this.tele.setPreferredDevices();
    }
    async setAudioInputDevice(device) {
        await this.tele.setAudioInputDevice(device);
    }
    async setVideoInputDevice(device) {
        await this.tele.setVideoInputDevice(device);
    }
    async getCurrentAudioInputDevice() {
        return await this.tele.getCurrentAudioInputDevice();
    }
    async getCurrentVideoInputDevice() {
        return await this.tele.getCurrentVideoInputDevice();
    }
    async toggleAudioMuted() {
        return await this.tele.toggleAudioMuted();
    }
    async toggleVideoMuted() {
        return await this.tele.toggleVideoMuted();
    }
    async getAudioMuted() {
        return await this.tele.getAudioMuted();
    }
    async getVideoMuted() {
        return await this.tele.getVideoMuted();
    }
    get metadataState() {
        return this.meta.metadataState;
    }
    get localUserID() {
        return this.tele.localUserID;
    }
    get localUserName() {
        return this.tele.localUserName;
    }
    get roomName() {
        return this.tele.roomName;
    }
    userExists(id) {
        return this.tele.userExists(id);
    }
    getUserNames() {
        return this.tele.getUserNames();
    }
    async prepare(JITSI_HOST, JVB_HOST, JVB_MUC, onProgress) {
        await this.tele.prepare(JITSI_HOST, JVB_HOST, JVB_MUC, onProgress);
    }
    async connect() {
        await this.tele.connect();
        if (this.tele.connectionState === HubConnectionState.Connected) {
            await this.meta.connect();
        }
    }
    async join(roomName) {
        await this.tele.join(roomName);
        if (this.tele.conferenceState === HubConnectionState.Connected) {
            await this.meta.join(roomName);
        }
    }
    async identify(userName) {
        await this.tele.identify(userName);
        await this.meta.identify(this.localUserID);
    }
    async leave() {
        await this.meta.leave();
        await this.tele.leave();
    }
    async disconnect() {
        await this.meta.disconnect();
        await this.tele.disconnect();
    }
    update() {
        this.audio.update();
    }
    async setAudioOutputDevice(device) {
        this.tele.setAudioOutputDevice(device);
        if (canChangeAudioOutput) {
            await this.audio.setAudioOutputDeviceID(this.tele.preferredAudioOutputID);
        }
    }
    async setAudioMuted(muted) {
        let isMuted = this.isAudioMuted;
        if (muted !== isMuted) {
            isMuted = await this.toggleAudioMuted();
        }
        return isMuted;
    }
    async setVideoMuted(muted) {
        let isMuted = this.isVideoMuted;
        if (muted !== isMuted) {
            isMuted = await this.toggleVideoMuted();
        }
        return isMuted;
    }
}
//# sourceMappingURL=Calla.js.map