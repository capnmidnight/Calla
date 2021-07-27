import { Logger } from "kudzu/debugging/Logger";
import { TypedEventBase } from "kudzu/events/EventBase";
import { AudioActivityEvent } from "./audio/AudioActivityEvent";
import { ConnectionState } from "./ConnectionState";
export var ClientState;
(function (ClientState) {
    ClientState["InConference"] = "in-conference";
    ClientState["JoiningConference"] = "joining-conference";
    ClientState["Connected"] = "connected";
    ClientState["Connecting"] = "connecting";
    ClientState["Prepaired"] = "prepaired";
    ClientState["Prepairing"] = "prepairing";
    ClientState["Unprepared"] = "unprepaired";
})(ClientState || (ClientState = {}));
const audioActivityEvt = new AudioActivityEvent();
export class Calla extends TypedEventBase {
    _fetcher;
    _tele;
    _meta;
    isAudioMuted = null;
    isVideoMuted = null;
    constructor(_fetcher, _tele, _meta) {
        super();
        this._fetcher = _fetcher;
        this._tele = _tele;
        this._meta = _meta;
        const fwd = this.dispatchEvent.bind(this);
        this._tele.addEventListener("serverConnected", fwd);
        this._tele.addEventListener("serverDisconnected", fwd);
        this._tele.addEventListener("serverFailed", fwd);
        this._tele.addEventListener("conferenceFailed", fwd);
        this._tele.addEventListener("conferenceRestored", fwd);
        this._tele.addEventListener("audioMuteStatusChanged", fwd);
        this._tele.addEventListener("videoMuteStatusChanged", fwd);
        this._tele.addEventListener("conferenceJoined", async (evt) => {
            const user = this.audio.setLocalUserID(evt.userID);
            evt.pose = user.pose;
            this.dispatchEvent(evt);
            await this.devices.start();
        });
        this._tele.addEventListener("conferenceLeft", (evt) => {
            this.audio.setLocalUserID(evt.userID);
            this.dispatchEvent(evt);
        });
        this._tele.addEventListener("participantJoined", async (joinEvt) => {
            joinEvt.source = this.audio.createUser(joinEvt.userID);
            this.dispatchEvent(joinEvt);
        });
        this._tele.addEventListener("participantLeft", (evt) => {
            this.dispatchEvent(evt);
            this.audio.removeUser(evt.userID);
        });
        this._tele.addEventListener("userNameChanged", fwd);
        this._tele.addEventListener("videoAdded", fwd);
        this._tele.addEventListener("videoRemoved", fwd);
        this._tele.addEventListener("audioAdded", (evt) => {
            const user = this.audio.getUser(evt.userID);
            if (user) {
                let stream = user.streams.get(evt.kind);
                if (stream) {
                    user.streams.delete(evt.kind);
                }
                stream = evt.stream;
                user.streams.set(evt.kind, stream);
                if (evt.userID !== this._tele.localUserID) {
                    this.audio.setUserStream(evt.userID, stream);
                }
                this.dispatchEvent(evt);
            }
        });
        this._tele.addEventListener("audioRemoved", (evt) => {
            const user = this.audio.getUser(evt.userID);
            if (user && user.streams.has(evt.kind)) {
                user.streams.delete(evt.kind);
            }
            if (evt.userID !== this._tele.localUserID) {
                this.audio.setUserStream(evt.userID, null);
            }
            this.dispatchEvent(evt);
        });
        this._meta.addEventListener("chat", fwd);
        this._meta.addEventListener("emote", fwd);
        this._meta.addEventListener("setAvatarEmoji", fwd);
        this._meta.addEventListener("setAvatarURL", fwd);
        const offsetEvt = (poseEvt) => {
            const O = this.audio.getUserOffset(poseEvt.userID);
            if (O) {
                poseEvt.px += O[0];
                poseEvt.py += O[1];
                poseEvt.pz += O[2];
            }
            this.dispatchEvent(poseEvt);
        };
        this._meta.addEventListener("userPointer", offsetEvt);
        this._meta.addEventListener("userPosed", (evt) => {
            this.audio.setUserPose(evt.userID, evt.px, evt.py, evt.pz, evt.fx, evt.fy, evt.fz, evt.ux, evt.uy, evt.uz);
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
        return this._tele.connectionState;
    }
    get conferenceState() {
        return this._tele.conferenceState;
    }
    get fetcher() {
        return this._fetcher;
    }
    get tele() {
        return this._tele;
    }
    get meta() {
        return this._meta;
    }
    get audio() {
        return this._tele.audio;
    }
    get devices() {
        return this._tele.audio.devices;
    }
    disposed = false;
    dispose() {
        if (!this.disposed) {
            this.leave();
            this.disconnect();
            this.disposed = true;
        }
    }
    get offsetRadius() {
        return this.audio.offsetRadius;
    }
    set offsetRadius(v) {
        this.audio.offsetRadius = v;
    }
    setLocalPose(px, py, pz, fx, fy, fz, ux, uy, uz) {
        this.audio.setUserPose(this.localUserID, px, py, pz, fx, fy, fz, ux, uy, uz);
        this._meta.setLocalPose(px, py, pz, fx, fy, fz, ux, uy, uz);
    }
    tellLocalPose(toUserID, px, py, pz, fx, fy, fz, ux, uy, uz) {
        this._meta.tellLocalPose(toUserID, px, py, pz, fx, fy, fz, ux, uy, uz);
    }
    setLocalPointer(name, px, py, pz, fx, fy, fz, ux, uy, uz) {
        this._meta.setLocalPointer(name, px, py, pz, fx, fy, fz, ux, uy, uz);
    }
    setAvatarEmoji(toUserID, emoji) {
        this._meta.setAvatarEmoji(toUserID, emoji);
    }
    setAvatarURL(toUserID, url) {
        this._meta.setAvatarURL(toUserID, url);
    }
    emote(emoji) {
        this._meta.emote(emoji);
    }
    chat(text) {
        this._meta.chat(text);
    }
    async toggleAudioMuted() {
        return await this._tele.toggleAudioMuted();
    }
    async toggleVideoMuted() {
        return await this._tele.toggleVideoMuted();
    }
    async getAudioMuted() {
        return await this._tele.getAudioMuted();
    }
    async getVideoMuted() {
        return await this._tele.getVideoMuted();
    }
    get metadataState() {
        return this._meta.metadataState;
    }
    get localUserID() {
        return this._tele.localUserID;
    }
    get localUserName() {
        return this._tele.localUserName;
    }
    get roomName() {
        return this._tele.roomName;
    }
    userExists(id) {
        return this._tele.userExists(id);
    }
    getUserNames() {
        return this._tele.getUserNames();
    }
    async connect() {
        await this._tele.connect();
        if (this._tele.connectionState === ConnectionState.Connected) {
            await this._meta.connect();
        }
    }
    async join(roomName, enableTeleconference) {
        const logger = new Logger();
        logger.log("Calla.join:tele", roomName);
        await this._tele.join(roomName, enableTeleconference);
        if (this._tele.conferenceState === ConnectionState.Connected) {
            logger.log("Calla.join:meta", roomName);
            await this._meta.join(roomName, enableTeleconference);
        }
        logger.log("Calla.joined");
    }
    async identify(userName) {
        await this._tele.identify(userName);
        await this._meta.identify(this.localUserID);
    }
    async leave() {
        await this._meta.leave();
        await this._tele.leave();
    }
    async disconnect() {
        await this._meta.disconnect();
        await this._tele.disconnect();
    }
    async setAudioOutputDevice(device) {
        this.audio.devices.setAudioOutputDevice(device);
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
    get localAudioInput() {
        return this._tele.localAudioInput;
    }
    get useHalfDuplex() {
        return this._tele.useHalfDuplex;
    }
    set useHalfDuplex(v) {
        this._tele.useHalfDuplex = v;
    }
    get halfDuplexMin() {
        return this._tele.halfDuplexMin;
    }
    set halfDuplexMin(v) {
        this._tele.halfDuplexMin = v;
    }
    get halfDuplexMax() {
        return this._tele.halfDuplexMax;
    }
    set halfDuplexMax(v) {
        this._tele.halfDuplexMax = v;
    }
    get halfDuplexThreshold() {
        return this._tele.halfDuplexThreshold;
    }
    set halfDuplexThreshold(v) {
        this._tele.halfDuplexThreshold = v;
    }
    get halfDuplexDelay() {
        return this._tele.halfDuplexDelay;
    }
    set halfDuplexDelay(v) {
        this._tele.halfDuplexDelay = v;
    }
    get halfDuplexSustain() {
        return this._tele.halfDuplexSustain;
    }
    set halfDuplexSustain(v) {
        this._tele.halfDuplexSustain = v;
    }
    get halfDuplexLevel() {
        return this._tele.halfDuplexLevel;
    }
}
//# sourceMappingURL=Calla.js.map