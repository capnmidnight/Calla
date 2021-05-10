import { Logger } from "kudzu/debugging/Logger";
import { TypedEventBase } from "kudzu/events/EventBase";
import type { IFetcher } from "kudzu/io/IFetcher";
import type { IDisposable } from "kudzu/using";
import { AudioActivityEvent } from "./audio/AudioActivityEvent";
import type { AudioManager } from "./audio/AudioManager";
import { canChangeAudioOutput } from "./audio/canChangeAudioOutput";
import type {
    CallaAudioStreamAddedEvent,
    CallaAudioStreamRemovedEvent,
    CallaClientEvents,
    CallaConferenceJoinedEvent,
    CallaConferenceLeftEvent,
    CallaParticipantJoinedEvent,
    CallaParticipantLeftEvent,
    CallaUserPointerEvent,
    CallaUserPosedEvent
} from "./CallaEvents";
import { ConnectionState } from "./ConnectionState";
import type { ICombinedClient } from "./ICombinedClient";
import type { IMetadataClient, IMetadataClientExt } from "./meta/IMetadataClient";
import type { ITeleconferenceClient, ITeleconferenceClientExt } from "./tele/ITeleconferenceClient";

export interface MediaPermissionSet {
    audio: boolean;
    video: boolean;
}

export interface MediaDeviceSet {
    audioInput: MediaDeviceInfo[];
    videoInput: MediaDeviceInfo[];
    audioOutput: MediaDeviceInfo[];
}

export enum ClientState {
    InConference = "in-conference",
    JoiningConference = "joining-conference",
    Connected = "connected",
    Connecting = "connecting",
    Prepaired = "prepaired",
    Prepairing = "prepairing",
    Unprepared = "unprepaired"
}

const audioActivityEvt = new AudioActivityEvent();

export class Calla
    extends TypedEventBase<CallaClientEvents>
    implements ICombinedClient, IDisposable {

    isAudioMuted: boolean = null;
    isVideoMuted: boolean = null;

    constructor(
        private _fetcher: IFetcher,
        private _tele: ITeleconferenceClientExt,
        private _meta: IMetadataClientExt) {
        super();

        const fwd = this.dispatchEvent.bind(this);

        this._tele.addEventListener("serverConnected", fwd);
        this._tele.addEventListener("serverDisconnected", fwd);
        this._tele.addEventListener("serverFailed", fwd);
        this._tele.addEventListener("conferenceFailed", fwd);
        this._tele.addEventListener("conferenceRestored", fwd);

        this._tele.addEventListener("audioMuteStatusChanged", fwd);
        this._tele.addEventListener("videoMuteStatusChanged", fwd);

        this._tele.addEventListener("conferenceJoined", async (evt: CallaConferenceJoinedEvent) => {
            const user = this.audio.setLocalUserID(evt.id);
            evt.pose = user.pose;
            this.dispatchEvent(evt);
            await this.setPreferredDevices();
        });

        this._tele.addEventListener("conferenceLeft", (evt: CallaConferenceLeftEvent) => {
            this.audio.setLocalUserID(evt.id);
            this.dispatchEvent(evt);
        });

        this._tele.addEventListener("participantJoined", async (joinEvt: CallaParticipantJoinedEvent) => {
            joinEvt.source = this.audio.createUser(joinEvt.id);
            this.dispatchEvent(joinEvt);
        });

        this._tele.addEventListener("participantLeft", (evt: CallaParticipantLeftEvent) => {
            this.dispatchEvent(evt);
            this.audio.removeUser(evt.id);
        });

        this._tele.addEventListener("userNameChanged", fwd);
        this._tele.addEventListener("videoAdded", fwd);
        this._tele.addEventListener("videoRemoved", fwd);

        this._tele.addEventListener("audioAdded", (evt: CallaAudioStreamAddedEvent) => {
            const user = this.audio.getUser(evt.id);
            if (user) {
                let stream = user.streams.get(evt.kind);
                if (stream) {
                    user.streams.delete(evt.kind);
                }

                stream = evt.stream;
                user.streams.set(evt.kind, stream);

                if (evt.id !== this._tele.localUserID) {
                    this.audio.setUserStream(evt.id, stream);
                }

                this.dispatchEvent(evt);
            }
        });

        this._tele.addEventListener("audioRemoved", (evt: CallaAudioStreamRemovedEvent) => {
            const user = this.audio.getUser(evt.id);
            if (user && user.streams.has(evt.kind)) {
                user.streams.delete(evt.kind);
            }

            if (evt.id !== this._tele.localUserID) {
                this.audio.setUserStream(evt.id, null);
            }

            this.dispatchEvent(evt);
        });

        this._meta.addEventListener("avatarChanged", fwd);
        this._meta.addEventListener("chat", fwd);
        this._meta.addEventListener("emote", fwd);
        this._meta.addEventListener("setAvatarEmoji", fwd);

        const offsetEvt = (poseEvt: CallaUserPointerEvent | CallaUserPosedEvent): void => {
            const O = this.audio.getUserOffset(poseEvt.id);
            if (O) {
                poseEvt.px += O[0];
                poseEvt.py += O[1];
                poseEvt.pz += O[2];
            }
            this.dispatchEvent(poseEvt);
        };

        this._meta.addEventListener("userPointer", offsetEvt);

        this._meta.addEventListener("userPosed", (evt: CallaUserPosedEvent) => {
            this.audio.setUserPose(
                evt.id,
                evt.px, evt.py, evt.pz,
                evt.fx, evt.fy, evt.fz,
                evt.ux, evt.uy, evt.uz);
            offsetEvt(evt);
        });

        this.audio.addEventListener("audioActivity", (evt: AudioActivityEvent) => {
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

    get connectionState(): ConnectionState {
        return this._tele.connectionState;
    }

    get conferenceState(): ConnectionState {
        return this._tele.conferenceState;
    }

    get fetcher(): IFetcher {
        return this._fetcher;
    }

    get tele(): ITeleconferenceClient {
        return this._tele;
    }

    get meta(): IMetadataClient {
        return this._meta;
    }

    get audio(): AudioManager {
        return this._tele.audio;
    }

    get preferredAudioOutputID(): string {
        return this._tele.preferredAudioOutputID;
    }

    set preferredAudioOutputID(v: string) {
        this._tele.preferredAudioOutputID = v;
    }

    get preferredAudioInputID(): string {
        return this._tele.preferredAudioInputID;
    }

    set preferredAudioInputID(v: string) {
        this._tele.preferredAudioInputID = v;
    }

    get preferredVideoInputID(): string {
        return this._tele.preferredVideoInputID;
    }

    set preferredVideoInputID(v: string) {
        this._tele.preferredVideoInputID = v;
    }

    async getCurrentAudioOutputDevice(): Promise<MediaDeviceInfo> {
        return await this._tele.getCurrentAudioOutputDevice();
    }

    async getMediaPermissions(): Promise<MediaPermissionSet> {
        return await this._tele.getMediaPermissions();
    }

    async getAudioOutputDevices(filterDuplicates: boolean): Promise<MediaDeviceInfo[]> {
        return await this._tele.getAudioOutputDevices(filterDuplicates);
    }

    async getAudioInputDevices(filterDuplicates: boolean): Promise<MediaDeviceInfo[]> {
        return await this._tele.getAudioInputDevices(filterDuplicates);
    }

    async getVideoInputDevices(filterDuplicates: boolean): Promise<MediaDeviceInfo[]> {
        return await this._tele.getVideoInputDevices(filterDuplicates);
    }

    private disposed = false;
    dispose(): void {
        if (!this.disposed) {
            this.leave();
            this.disconnect();
            this.disposed = true;
        }
    }

    get offsetRadius(): number {
        return this.audio.offsetRadius;
    }

    set offsetRadius(v: number) {
        this.audio.offsetRadius = v;
    }

    setLocalPose(px: number, py: number, pz: number, fx: number, fy: number, fz: number, ux: number, uy: number, uz: number): void {
        this.audio.setUserPose(this.localUserID, px, py, pz, fx, fy, fz, ux, uy, uz);
        this._meta.setLocalPose(px, py, pz, fx, fy, fz, ux, uy, uz);
    }

    setLocalPoseImmediate(px: number, py: number, pz: number, fx: number, fy: number, fz: number, ux: number, uy: number, uz: number): void {
        this.audio.setUserPose(this.localUserID, px, py, pz, fx, fy, fz, ux, uy, uz);
        this._meta.setLocalPoseImmediate(px, py, pz, fx, fy, fz, ux, uy, uz);
    }

    setLocalPointer(name: string, px: number, py: number, pz: number, fx: number, fy: number, fz: number, ux: number, uy: number, uz: number): void {
        this._meta.setLocalPointer(name, px, py, pz, fx, fy, fz, ux, uy, uz);
    }

    setAvatarEmoji(emoji: string): void {
        this._meta.setAvatarEmoji(emoji);
    }

    tellAvatarEmoji(userid: string, emoji: string): void {
        this._meta.tellAvatarEmoji(userid, emoji);
    }

    setAvatarURL(url: string): void {
        this._meta.setAvatarURL(url);
    }

    emote(emoji: string): void {
        this._meta.emote(emoji);
    }

    chat(text: string): void {
        this._meta.chat(text);
    }

    async setPreferredDevices(): Promise<void> {
        await this._tele.setPreferredDevices();
    }

    async setAudioInputDevice(device: MediaDeviceInfo): Promise<void> {
        await this._tele.setAudioInputDevice(device);
    }

    async setVideoInputDevice(device: MediaDeviceInfo): Promise<void> {
        await this._tele.setVideoInputDevice(device);
    }

    async getCurrentAudioInputDevice(): Promise<MediaDeviceInfo> {
        return await this._tele.getCurrentAudioInputDevice();
    }

    async getCurrentVideoInputDevice(): Promise<MediaDeviceInfo> {
        return await this._tele.getCurrentVideoInputDevice();
    }

    async toggleAudioMuted(): Promise<boolean> {
        return await this._tele.toggleAudioMuted();
    }

    async toggleVideoMuted(): Promise<boolean> {
        return await this._tele.toggleVideoMuted();
    }

    async getAudioMuted(): Promise<boolean> {
        return await this._tele.getAudioMuted();
    }

    async getVideoMuted(): Promise<boolean> {
        return await this._tele.getVideoMuted();
    }

    get metadataState(): ConnectionState {
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

    userExists(id: string): boolean {
        return this._tele.userExists(id);
    }

    getUserNames(): string[][] {
        return this._tele.getUserNames();
    }

    async connect(): Promise<void> {
        await this._tele.connect();
        if (this._tele.connectionState === ConnectionState.Connected) {
            await this._meta.connect();
        }
    }

    async join(roomName: string): Promise<void> {
        const logger = new Logger();
        logger.log("Calla.join:tele", roomName);
        await this._tele.join(roomName);
        if (this._tele.conferenceState === ConnectionState.Connected) {
            logger.log("Calla.join:meta", roomName);
            await this._meta.join(roomName);
        }
        logger.log("Calla.joined");
    }

    async identify(userName: string): Promise<void> {
        await this._tele.identify(userName);
        await this._meta.identify(this.localUserID);
    }

    async leave(): Promise<void> {
        await this._meta.leave();
        await this._tele.leave();
    }

    async disconnect(): Promise<void> {
        await this._meta.disconnect();
        await this._tele.disconnect();
    }

    async setAudioOutputDevice(device: MediaDeviceInfo) {
        this._tele.setAudioOutputDevice(device);
        if (canChangeAudioOutput) {
            await this.audio.setAudioOutputDeviceID(this._tele.preferredAudioOutputID);
        }
    }

    async setAudioMuted(muted: boolean) {
        let isMuted = this.isAudioMuted;
        if (muted !== isMuted) {
            isMuted = await this.toggleAudioMuted();
        }
        return isMuted;
    }

    async setVideoMuted(muted: boolean) {
        let isMuted = this.isVideoMuted;
        if (muted !== isMuted) {
            isMuted = await this.toggleVideoMuted();
        }
        return isMuted;
    }

}