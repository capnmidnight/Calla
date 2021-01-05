import type { Emoji } from "kudzu/emoji/Emoji";
import { TypedEventBase } from "kudzu/events/EventBase";
import { IFetcher } from "kudzu/io/IFetcher";
import { Fetcher } from "kudzu/io/Fetcher";
import type { progressCallback } from "kudzu/tasks/progressCallback";
import { isNullOrUndefined } from "kudzu/typeChecks";
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
import {
    CallaMetadataEventType,
    CallaTeleconferenceEventType
} from "./CallaEvents";
import { ConnectionState } from "./ConnectionState";
import type { ICombinedClient } from "./ICombinedClient";
import type { IMetadataClientExt } from "./meta/IMetadataClient";
import type { ITeleconferenceClient, ITeleconferenceClientExt } from "./tele/ITeleconferenceClient";
import { JitsiTeleconferenceClient } from "./tele/jitsi/JitsiTeleconferenceClient";

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

    tele: ITeleconferenceClientExt;
    meta: IMetadataClientExt;

    constructor(
        fetcher?: IFetcher,
        TeleClientType?: new (fetcher?: IFetcher) => ITeleconferenceClientExt,
        MetaClientType?: new (tele: ITeleconferenceClient) => IMetadataClientExt) {
        super();

        if (isNullOrUndefined(fetcher)) {
            fetcher = new Fetcher();
        }

        if (isNullOrUndefined(TeleClientType)) {
            TeleClientType = JitsiTeleconferenceClient;
        }

        this.tele = new TeleClientType(fetcher);

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

        this.tele.addEventListener(CallaTeleconferenceEventType.AudioMuteStatusChanged, fwd);
        this.tele.addEventListener(CallaTeleconferenceEventType.VideoMuteStatusChanged, fwd);

        this.tele.addEventListener(CallaTeleconferenceEventType.ConferenceJoined, async (evt: CallaConferenceJoinedEvent) => {
            const user = this.audio.createLocalUser(evt.id);
            evt.pose = user.pose;
            this.dispatchEvent(evt);
            await this.setPreferredDevices();
        });

        this.tele.addEventListener(CallaTeleconferenceEventType.ConferenceLeft, (evt: CallaConferenceLeftEvent) => {
            this.audio.createLocalUser(evt.id);
            this.dispatchEvent(evt);
        });

        this.tele.addEventListener(CallaTeleconferenceEventType.ParticipantJoined, async (joinEvt: CallaParticipantJoinedEvent) => {
            joinEvt.source = this.audio.createUser(joinEvt.id);
            this.dispatchEvent(joinEvt);
        });

        this.tele.addEventListener(CallaTeleconferenceEventType.ParticipantLeft, (evt: CallaParticipantLeftEvent) => {
            this.dispatchEvent(evt);
            this.audio.removeUser(evt.id);
        });

        this.tele.addEventListener(CallaTeleconferenceEventType.UserNameChanged, fwd);
        this.tele.addEventListener(CallaTeleconferenceEventType.VideoAdded, fwd);
        this.tele.addEventListener(CallaTeleconferenceEventType.VideoRemoved, fwd);

        this.tele.addEventListener(CallaTeleconferenceEventType.AudioAdded, (evt: CallaAudioStreamAddedEvent) => {
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

        this.tele.addEventListener(CallaTeleconferenceEventType.AudioRemoved, (evt: CallaAudioStreamRemovedEvent) => {
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

        const offsetEvt = (poseEvt: CallaUserPointerEvent | CallaUserPosedEvent): void => {
            const O = this.audio.getUserOffset(poseEvt.id);
            if (O) {
                poseEvt.px += O[0];
                poseEvt.py += O[1];
                poseEvt.pz += O[2];
            }
            this.dispatchEvent(poseEvt);
        };

        this.meta.addEventListener(CallaMetadataEventType.UserPointer, offsetEvt);

        this.meta.addEventListener(CallaMetadataEventType.UserPosed, (evt: CallaUserPosedEvent) => {
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
        return this.tele.connectionState;
    }

    get conferenceState(): ConnectionState {
        return this.tele.conferenceState;
    }

    get audio(): AudioManager {
        return this.tele.audio;
    }

    get preferredAudioOutputID(): string {
        return this.tele.preferredAudioOutputID;
    }

    set preferredAudioOutputID(v: string) {
        this.tele.preferredAudioOutputID = v;
    }

    get preferredAudioInputID(): string {
        return this.tele.preferredAudioInputID;
    }

    set preferredAudioInputID(v: string) {
        this.tele.preferredAudioInputID = v;
    }

    get preferredVideoInputID(): string {
        return this.tele.preferredVideoInputID;
    }

    set preferredVideoInputID(v: string) {
        this.tele.preferredVideoInputID = v;
    }

    async getCurrentAudioOutputDevice(): Promise<MediaDeviceInfo> {
        return await this.tele.getCurrentAudioOutputDevice();
    }

    async getMediaPermissions(): Promise<MediaPermissionSet> {
        return await this.tele.getMediaPermissions();
    }

    async getAudioOutputDevices(filterDuplicates: boolean): Promise<MediaDeviceInfo[]> {
        return await this.tele.getAudioOutputDevices(filterDuplicates);
    }

    async getAudioInputDevices(filterDuplicates: boolean): Promise<MediaDeviceInfo[]> {
        return await this.tele.getAudioInputDevices(filterDuplicates);
    }

    async getVideoInputDevices(filterDuplicates: boolean): Promise<MediaDeviceInfo[]> {
        return await this.tele.getVideoInputDevices(filterDuplicates);
    }

    dispose(): void {
        this.leave();
        this.disconnect();
    }

    get offsetRadius(): number {
        return this.audio.offsetRadius;
    }

    set offsetRadius(v: number) {
        this.audio.offsetRadius = v;
    }

    setLocalPose(px: number, py: number, pz: number, fx: number, fy: number, fz: number, ux: number, uy: number, uz: number): void {
        this.audio.setUserPose(this.localUserID, px, py, pz, fx, fy, fz, ux, uy, uz, 0);
        this.meta.setLocalPose(px, py, pz, fx, fy, fz, ux, uy, uz);
    }

    setLocalPoseImmediate(px: number, py: number, pz: number, fx: number, fy: number, fz: number, ux: number, uy: number, uz: number): void {
        this.audio.setUserPose(this.localUserID, px, py, pz, fx, fy, fz, ux, uy, uz, 0);
        this.meta.setLocalPoseImmediate(px, py, pz, fx, fy, fz, ux, uy, uz);
    }

    setLocalPointer(name: string, px: number, py: number, pz: number, fx: number, fy: number, fz: number, ux: number, uy: number, uz: number): void {
        this.meta.setLocalPointer(name, px, py, pz, fx, fy, fz, ux, uy, uz);
    }

    setAvatarEmoji(emoji: Emoji): void {
        this.meta.setAvatarEmoji(emoji);
    }

    setAvatarURL(url: string): void {
        this.meta.setAvatarURL(url);
    }

    emote(emoji: Emoji): void {
        this.meta.emote(emoji);
    }

    chat(text: string): void {
        this.meta.chat(text);
    }

    async setPreferredDevices(): Promise<void> {
        await this.tele.setPreferredDevices();
    }

    async setAudioInputDevice(device: MediaDeviceInfo): Promise<void> {
        await this.tele.setAudioInputDevice(device);
    }

    async setVideoInputDevice(device: MediaDeviceInfo): Promise<void> {
        await this.tele.setVideoInputDevice(device);
    }

    async getCurrentAudioInputDevice(): Promise<MediaDeviceInfo> {
        return await this.tele.getCurrentAudioInputDevice();
    }

    async getCurrentVideoInputDevice(): Promise<MediaDeviceInfo> {
        return await this.tele.getCurrentVideoInputDevice();
    }

    async toggleAudioMuted(): Promise<boolean> {
        return await this.tele.toggleAudioMuted();
    }

    async toggleVideoMuted(): Promise<boolean> {
        return await this.tele.toggleVideoMuted();
    }

    async getAudioMuted(): Promise<boolean> {
        return await this.tele.getAudioMuted();
    }

    async getVideoMuted(): Promise<boolean> {
        return await this.tele.getVideoMuted();
    }

    get metadataState(): ConnectionState {
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

    userExists(id: string): boolean {
        return this.tele.userExists(id);
    }

    getUserNames(): string[][] {
        return this.tele.getUserNames();
    }

    async prepare(JITSI_HOST: string, JVB_HOST: string, JVB_MUC: string, onProgress?: progressCallback): Promise<void> {
        await this.tele.prepare(JITSI_HOST, JVB_HOST, JVB_MUC, onProgress);
    }

    async connect(): Promise<void> {
        await this.tele.connect();
        if (this.tele.connectionState === ConnectionState.Connected) {
            await this.meta.connect();
        }
    }

    async join(roomName: string): Promise<void> {
        await this.tele.join(roomName);
        if (this.tele.conferenceState === ConnectionState.Connected) {
            await this.meta.join(roomName);
        }
    }

    async identify(userName: string): Promise<void> {
        await this.tele.identify(userName);
        await this.meta.identify(this.localUserID);
    }

    async leave(): Promise<void> {
        await this.meta.leave();
        await this.tele.leave();
    }

    async disconnect(): Promise<void> {
        await this.meta.disconnect();
        await this.tele.disconnect();
    }

    update(): void {
        this.audio.update();
    }

    async setAudioOutputDevice(device: MediaDeviceInfo) {
        this.tele.setAudioOutputDevice(device);
        if (canChangeAudioOutput) {
            await this.audio.setAudioOutputDeviceID(this.tele.preferredAudioOutputID);
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