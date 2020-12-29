import { Emoji } from "kudzu";
import type { AudioActivityEvent } from "./audio/AudioActivityEvent";
import type { AudioSource } from "./audio/AudioSource";
import type { InterpolatedPose } from "./audio/positions/InterpolatedPose";

export enum CallaTeleconferenceEventType {
    ServerConnected = "serverConnected",
    ServerDisconnected = "serverDisconnected",
    ServerFailed = "serverFailed",
    ConferenceConnected = "conferenceConnected",
    ConferenceJoined = "conferenceJoined",
    ConferenceFailed = "conferenceFailed",
    ConferenceRestored = "conferenceRestored",
    ConferenceLeft = "conferenceLeft",
    ParticipantJoined = "participantJoined",
    ParticipantLeft = "participantLeft",
    UserNameChanged = "userNameChanged",
    AudioMuteStatusChanged = "audioMuteStatucChanged",
    VideoMuteStatusChanged = "videoMuteStatucChanged",
    AudioActivity = "audioActivity",
    AudioAdded = "audioAdded",
    AudioRemoved = "audioRemoved",
    VideoAdded = "videoAdded",
    VideoRemoved = "videoRemoved"
}

export enum CallaMetadataEventType {
    UserPosed = "userPosed",
    UserPointer = "userPointer",
    SetAvatarEmoji = "setAvatarEmoji",
    AvatarChanged = "avatarChanged",
    Emote = "emote",
    Chat = "chat"
}

export type CallaEventType = CallaTeleconferenceEventType | CallaMetadataEventType;

export class CallaEvent<T extends CallaEventType> extends Event {
    constructor(public eventType: T) {
        super(eventType);
    }
}

export class CallaTeleconferenceServerConnectedEvent
    extends CallaEvent<CallaTeleconferenceEventType.ServerConnected> {
    constructor() {
        super(CallaTeleconferenceEventType.ServerConnected);
    }
}

export class CallaTeleconferenceServerDisconnectedEvent
    extends CallaEvent<CallaTeleconferenceEventType.ServerDisconnected> {
    constructor() {
        super(CallaTeleconferenceEventType.ServerDisconnected);
    }
}

export class CallaTeleconferenceServerFailedEvent
    extends CallaEvent<CallaTeleconferenceEventType.ServerFailed> {
    constructor() {
        super(CallaTeleconferenceEventType.ServerFailed);
    }
}

export class CallaUserEvent<T extends CallaEventType> extends CallaEvent<T> {
    constructor(type: T, public id: string) {
        super(type);
    }
}

export class CallaParticipantEvent<T extends CallaTeleconferenceEventType> extends CallaUserEvent<T> {
    constructor(type: T, id: string, public displayName: string) {
        super(type, id);
    }
}

export class CallaUserNameChangedEvent extends CallaUserEvent<CallaTeleconferenceEventType.UserNameChanged> {
    constructor(id: string, public displayName: string) {
        super(CallaTeleconferenceEventType.UserNameChanged, id);
    }
}

export class CallaConferenceJoinedEvent extends CallaUserEvent<CallaTeleconferenceEventType.ConferenceJoined> {
    constructor(id: string, public pose: InterpolatedPose) {
        super(CallaTeleconferenceEventType.ConferenceJoined, id);
    }
}

export class CallaConferenceLeftEvent extends CallaUserEvent<CallaTeleconferenceEventType.ConferenceLeft> {
    constructor(id: string) {
        super(CallaTeleconferenceEventType.ConferenceLeft, id);
    }
}

export class CallaConferenceConnectedEvent extends CallaEvent<CallaTeleconferenceEventType.ConferenceConnected> {
    constructor() {
        super(CallaTeleconferenceEventType.ConferenceConnected);
    }
}

export class CallaConferenceFailedEvent extends CallaEvent<CallaTeleconferenceEventType.ConferenceFailed>{
    constructor() {
        super(CallaTeleconferenceEventType.ConferenceFailed);
    }
}

export class CallaConferenceRestoredEvent extends CallaEvent<CallaTeleconferenceEventType.ConferenceRestored>{
    constructor() {
        super(CallaTeleconferenceEventType.ConferenceRestored);
    }
}

export class CallaParticipantJoinedEvent extends CallaParticipantEvent<CallaTeleconferenceEventType.ParticipantJoined> {
    constructor(id: string, displayName: string, public source: AudioSource) {
        super(CallaTeleconferenceEventType.ParticipantJoined, id, displayName);
    }
}

export class CallaParticipantLeftEvent extends CallaUserEvent<CallaTeleconferenceEventType.ParticipantLeft> {
    constructor(id: string) {
        super(CallaTeleconferenceEventType.ParticipantLeft, id);
    }
}

export class CallaParticipantNameChangeEvent extends CallaParticipantEvent<CallaTeleconferenceEventType.UserNameChanged> {
    constructor(id: string, displayName: string) {
        super(CallaTeleconferenceEventType.UserNameChanged, id, displayName);
    }
}

export class CallaUserMutedEvent<T extends CallaTeleconferenceEventType> extends CallaUserEvent<T> {
    constructor(type: T, id: string, public muted: boolean) {
        super(type, id);
    }
}

export class CallaUserAudioMutedEvent extends CallaUserMutedEvent<CallaTeleconferenceEventType.AudioMuteStatusChanged> {
    constructor(id: string, muted: boolean) {
        super(CallaTeleconferenceEventType.AudioMuteStatusChanged, id, muted);
    }
}

export class CallaUserVideoMutedEvent extends CallaUserMutedEvent<CallaTeleconferenceEventType.VideoMuteStatusChanged> {
    constructor(id: string, muted: boolean) {
        super(CallaTeleconferenceEventType.VideoMuteStatusChanged, id, muted);
    }
}

export enum StreamType {
    Audio = "audio",
    Video = "video"
}

export enum StreamOpType {
    Added = "added",
    Removed = "removed",
    Changed = "changed"
}

export class CallaStreamEvent<T extends CallaTeleconferenceEventType> extends CallaUserEvent<T> {
    constructor(type: T, public kind: StreamType, public op: StreamOpType, id: string, public stream: MediaStream) {
        super(type, id);
    }
}

export class CallaStreamAddedEvent<T extends CallaTeleconferenceEventType> extends CallaStreamEvent<T> {
    constructor(type: T, kind: StreamType, id: string, stream: MediaStream) {
        super(type, kind, StreamOpType.Added, id, stream);
    }
}

export class CallaStreamRemovedEvent<T extends CallaTeleconferenceEventType> extends CallaStreamEvent<T> {
    constructor(type: T, kind: StreamType, id: string, stream: MediaStream) {
        super(type, kind, StreamOpType.Removed, id, stream);
    }
}

export class CallaStreamChangedEvent<T extends CallaTeleconferenceEventType> extends CallaStreamEvent<T> {
    constructor(type: T, kind: StreamType, id: string, stream: MediaStream) {
        super(type, kind, StreamOpType.Changed, id, stream);
    }
}

export class CallaAudioStreamAddedEvent extends CallaStreamAddedEvent<CallaTeleconferenceEventType.AudioAdded> {
    constructor(id: string, stream: MediaStream) {
        super(CallaTeleconferenceEventType.AudioAdded, StreamType.Audio, id, stream);
    }
}

export class CallaAudioStreamRemovedEvent extends CallaStreamRemovedEvent<CallaTeleconferenceEventType.AudioRemoved> {
    constructor(id: string, stream: MediaStream) {
        super(CallaTeleconferenceEventType.AudioRemoved, StreamType.Audio, id, stream);
    }
}

export class CallaVideoStreamAddedEvent extends CallaStreamAddedEvent<CallaTeleconferenceEventType.VideoAdded> {
    constructor(id: string, stream: MediaStream) {
        super(CallaTeleconferenceEventType.VideoAdded, StreamType.Video, id, stream);
    }
}

export class CallaVideoStreamRemovedEvent extends CallaStreamRemovedEvent<CallaTeleconferenceEventType.VideoRemoved> {
    constructor(id: string, stream: MediaStream) {
        super(CallaTeleconferenceEventType.VideoRemoved, StreamType.Video, id, stream);
    }
}

export class CallaPoseEvent<T extends CallaMetadataEventType> extends CallaUserEvent<T> {
    constructor(type: T, id: string, public px: number, public py: number, public pz: number, public fx: number, public fy: number, public fz: number, public ux: number, public uy: number, public uz: number) {
        super(type, id);
    }

    set(px: number, py: number, pz: number, fx: number, fy: number, fz: number, ux: number, uy: number, uz: number) {
        this.px = px;
        this.py = py;
        this.pz = pz;
        this.fx = fx;
        this.fy = fy;
        this.fz = fz;
        this.ux = ux;
        this.uy = uy;
        this.uz = uz;
    }
}

export class CallaUserPosedEvent extends CallaPoseEvent<CallaMetadataEventType.UserPosed> {
    constructor(id: string, px: number, py: number, pz: number, fx: number, fy: number, fz: number, ux: number, uy: number, uz: number) {
        super(CallaMetadataEventType.UserPosed, id, px, py, pz, fx, fy, fz, ux, uy, uz);
    }
}

export class CallaUserPointerEvent extends CallaPoseEvent<CallaMetadataEventType.UserPointer> {
    constructor(id: string, public name: string, px: number, py: number, pz: number, fx: number, fy: number, fz: number, ux: number, uy: number, uz: number) {
        super(CallaMetadataEventType.UserPointer, id, px, py, pz, fx, fy, fz, ux, uy, uz);
    }
}

export class CallaEmojiEvent<T extends CallaMetadataEventType> extends CallaUserEvent<T> {
    emoji: string;
    constructor(type: T, id: string, emoji: Emoji | string) {
        super(type, id);
        if (emoji instanceof Emoji) {
            this.emoji = emoji.value;
        }
        else {
            this.emoji = emoji;
        }
    }
}

export class CallaEmoteEvent extends CallaEmojiEvent<CallaMetadataEventType.Emote> {
    constructor(id: string, emoji: Emoji | string) {
        super(CallaMetadataEventType.Emote, id, emoji);
    }
}

export class CallaEmojiAvatarEvent extends CallaEmojiEvent<CallaMetadataEventType.SetAvatarEmoji> {
    constructor(id: string, emoji: Emoji | string) {
        super(CallaMetadataEventType.SetAvatarEmoji, id, emoji);
    }
}

export class CallaAvatarChangedEvent extends CallaUserEvent<CallaMetadataEventType.AvatarChanged> {
    constructor(id: string, public url: string) {
        super(CallaMetadataEventType.AvatarChanged, id);
    }
}

export class CallaChatEvent extends CallaUserEvent<CallaMetadataEventType.Chat> {
    constructor(id: string, public text: string) {
        super(CallaMetadataEventType.Chat, id);
    }
}

export interface CallaTeleconferenceEvents {
    [CallaTeleconferenceEventType.ServerConnected]: CallaTeleconferenceServerConnectedEvent;
    [CallaTeleconferenceEventType.ServerDisconnected]: CallaTeleconferenceServerDisconnectedEvent;
    [CallaTeleconferenceEventType.ServerFailed]: CallaTeleconferenceServerFailedEvent;
    [CallaTeleconferenceEventType.AudioMuteStatusChanged]: CallaUserAudioMutedEvent;
    [CallaTeleconferenceEventType.VideoMuteStatusChanged]: CallaUserVideoMutedEvent;
    [CallaTeleconferenceEventType.ConferenceConnected]: CallaConferenceConnectedEvent;
    [CallaTeleconferenceEventType.ConferenceJoined]: CallaConferenceJoinedEvent;
    [CallaTeleconferenceEventType.ConferenceLeft]: CallaConferenceLeftEvent;
    [CallaTeleconferenceEventType.ConferenceFailed]: CallaConferenceFailedEvent;
    [CallaTeleconferenceEventType.ConferenceRestored]: CallaConferenceRestoredEvent;
    [CallaTeleconferenceEventType.ParticipantJoined]: CallaParticipantJoinedEvent;
    [CallaTeleconferenceEventType.ParticipantLeft]: CallaParticipantLeftEvent;
    [CallaTeleconferenceEventType.UserNameChanged]: CallaUserNameChangedEvent;
    [CallaTeleconferenceEventType.AudioActivity]: AudioActivityEvent;
    [CallaTeleconferenceEventType.AudioAdded]: CallaAudioStreamAddedEvent;
    [CallaTeleconferenceEventType.VideoAdded]: CallaVideoStreamAddedEvent;
    [CallaTeleconferenceEventType.AudioRemoved]: CallaAudioStreamRemovedEvent;
    [CallaTeleconferenceEventType.VideoRemoved]: CallaVideoStreamRemovedEvent;
}

export interface CallaMetadataEvents {
    [CallaMetadataEventType.UserPosed]: CallaUserPosedEvent;
    [CallaMetadataEventType.UserPointer]: CallaUserPointerEvent;
    [CallaMetadataEventType.Emote]: CallaEmoteEvent;
    [CallaMetadataEventType.SetAvatarEmoji]: CallaEmojiAvatarEvent;
    [CallaMetadataEventType.AvatarChanged]: CallaAvatarChangedEvent;
    [CallaMetadataEventType.Chat]: CallaChatEvent;
}

export interface CallaClientEvents extends CallaTeleconferenceEvents, CallaMetadataEvents { }