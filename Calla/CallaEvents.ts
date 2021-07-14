import type { AudioActivityEvent } from "./audio/AudioActivityEvent";
import type { InterpolatedPose } from "./audio/positions/InterpolatedPose";
import { AudioStreamSource } from "./audio/sources/AudioStreamSource";

export type CallaTeleconferenceEventType = "serverConnected"
    | "serverDisconnected"
    | "serverFailed"
    | "conferenceConnected"
    | "conferenceJoined"
    | "conferenceFailed"
    | "conferenceRestored"
    | "conferenceLeft"
    | "participantJoined"
    | "participantLeft"
    | "userNameChanged"
    | "audioMuteStatusChanged"
    | "videoMuteStatusChanged"
    | "audioActivity"
    | "audioAdded"
    | "audioRemoved"
    | "videoAdded"
    | "videoRemoved";

export type CallaMetadataEventType = "userJoined"
    | "userLeft"
    | "userPosed"
    | "userPointer"
    | "setAvatarEmoji"
    | "setAvatarURL"
    | "emote"
    | "chat";

export type CallaEventType = CallaTeleconferenceEventType | CallaMetadataEventType;

export class CallaEvent<T extends CallaEventType> extends Event {
    constructor(public eventType: T) {
        super(eventType);
    }
}

export class CallaTeleconferenceServerConnectedEvent
    extends CallaEvent<"serverConnected"> {
    constructor() {
        super("serverConnected");
    }
}

export class CallaTeleconferenceServerDisconnectedEvent
    extends CallaEvent<"serverDisconnected"> {
    constructor() {
        super("serverDisconnected");
    }
}

export class CallaTeleconferenceServerFailedEvent
    extends CallaEvent<"serverFailed"> {
    constructor() {
        super("serverFailed");
    }
}

export class CallaUserEvent<T extends CallaEventType> extends CallaEvent<T> {
    constructor(type: T, public id: string) {
        super(type);
    }
}

export class CallaUserJoinedEvent extends CallaUserEvent<"userJoined"> {
    constructor(id: string) {
        super("userJoined", id);
    }
}

export class CallaUserLeftEvent extends CallaUserEvent<"userLeft"> {
    constructor(id: string) {
        super("userLeft", id);
    }
}

export class CallaParticipantEvent<T extends CallaTeleconferenceEventType> extends CallaUserEvent<T> {
    constructor(type: T, id: string, public displayName: string) {
        super(type, id);
    }
}

export class CallaUserNameChangedEvent extends CallaUserEvent<"userNameChanged"> {
    constructor(id: string, public displayName: string) {
        super("userNameChanged", id);
    }
}

export class CallaConferenceJoinedEvent extends CallaUserEvent<"conferenceJoined"> {
    constructor(id: string, public pose: InterpolatedPose) {
        super("conferenceJoined", id);
    }
}

export class CallaConferenceLeftEvent extends CallaUserEvent<"conferenceLeft"> {
    constructor(id: string) {
        super("conferenceLeft", id);
    }
}

export class CallaConferenceConnectedEvent extends CallaEvent<"conferenceConnected"> {
    constructor() {
        super("conferenceConnected");
    }
}

export class CallaConferenceFailedEvent extends CallaEvent<"conferenceFailed">{
    constructor() {
        super("conferenceFailed");
    }
}

export class CallaConferenceRestoredEvent extends CallaEvent<"conferenceRestored">{
    constructor() {
        super("conferenceRestored");
    }
}

export class CallaParticipantJoinedEvent extends CallaParticipantEvent<"participantJoined"> {
    constructor(id: string, displayName: string, public source: AudioStreamSource) {
        super("participantJoined", id, displayName);
    }
}

export class CallaParticipantLeftEvent extends CallaUserEvent<"participantLeft"> {
    constructor(id: string) {
        super("participantLeft", id);
    }
}

export class CallaParticipantNameChangeEvent extends CallaParticipantEvent<"userNameChanged"> {
    constructor(id: string, displayName: string) {
        super("userNameChanged", id, displayName);
    }
}

export class CallaUserMutedEvent<T extends CallaTeleconferenceEventType> extends CallaUserEvent<T> {
    constructor(type: T, id: string, public muted: boolean) {
        super(type, id);
    }
}

export class CallaUserAudioMutedEvent extends CallaUserMutedEvent<"audioMuteStatusChanged"> {
    constructor(id: string, muted: boolean) {
        super("audioMuteStatusChanged", id, muted);
    }
}

export class CallaUserVideoMutedEvent extends CallaUserMutedEvent<"videoMuteStatusChanged"> {
    constructor(id: string, muted: boolean) {
        super("videoMuteStatusChanged", id, muted);
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

export class CallaAudioStreamAddedEvent extends CallaStreamAddedEvent<"audioAdded"> {
    constructor(id: string, stream: MediaStream) {
        super("audioAdded", StreamType.Audio, id, stream);
    }
}

export class CallaAudioStreamRemovedEvent extends CallaStreamRemovedEvent<"audioRemoved"> {
    constructor(id: string, stream: MediaStream) {
        super("audioRemoved", StreamType.Audio, id, stream);
    }
}

export class CallaVideoStreamAddedEvent extends CallaStreamAddedEvent<"videoAdded"> {
    constructor(id: string, stream: MediaStream) {
        super("videoAdded", StreamType.Video, id, stream);
    }
}

export class CallaVideoStreamRemovedEvent extends CallaStreamRemovedEvent<"videoRemoved"> {
    constructor(id: string, stream: MediaStream) {
        super("videoRemoved", StreamType.Video, id, stream);
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

export class CallaUserPosedEvent extends CallaPoseEvent<"userPosed"> {
    constructor(id: string, px: number, py: number, pz: number, fx: number, fy: number, fz: number, ux: number, uy: number, uz: number) {
        super("userPosed", id, px, py, pz, fx, fy, fz, ux, uy, uz);
    }
}

export class CallaUserPointerEvent extends CallaPoseEvent<"userPointer"> {
    constructor(id: string, public name: string, px: number, py: number, pz: number, fx: number, fy: number, fz: number, ux: number, uy: number, uz: number) {
        super("userPointer", id, px, py, pz, fx, fy, fz, ux, uy, uz);
    }
}

export class CallaEmojiEvent<T extends CallaMetadataEventType> extends CallaUserEvent<T> {
    constructor(type: T, id: string, public readonly emoji: string) {
        super(type, id);
    }
}

export class CallaEmoteEvent extends CallaEmojiEvent<"emote"> {
    constructor(id: string, emoji: string) {
        super("emote", id, emoji);
    }
}

export class CallaEmojiAvatarEvent extends CallaEmojiEvent<"setAvatarEmoji"> {
    constructor(id: string, emoji: string) {
        super("setAvatarEmoji", id, emoji);
    }
}

export class CallaPhotoAvatarEvent extends CallaUserEvent<"setAvatarURL"> {
    constructor(id: string, public readonly url: string) {
        super("setAvatarURL", id);
    }
}

export class CallaChatEvent extends CallaUserEvent<"chat"> {
    constructor(id: string, public text: string) {
        super("chat", id);
    }
}

export interface CallaTeleconferenceEvents {
    serverConnected: CallaTeleconferenceServerConnectedEvent;
    serverDisconnected: CallaTeleconferenceServerDisconnectedEvent;
    serverFailed: CallaTeleconferenceServerFailedEvent;
    audioMuteStatusChanged: CallaUserAudioMutedEvent;
    videoMuteStatusChanged: CallaUserVideoMutedEvent;
    conferenceConnected: CallaConferenceConnectedEvent;
    conferenceJoined: CallaConferenceJoinedEvent;
    conferenceLeft: CallaConferenceLeftEvent;
    conferenceFailed: CallaConferenceFailedEvent;
    conferenceRestored: CallaConferenceRestoredEvent;
    participantJoined: CallaParticipantJoinedEvent;
    participantLeft: CallaParticipantLeftEvent;
    userNameChanged: CallaUserNameChangedEvent;
    audioActivity: AudioActivityEvent;
    audioAdded: CallaAudioStreamAddedEvent;
    videoAdded: CallaVideoStreamAddedEvent;
    audioRemoved: CallaAudioStreamRemovedEvent;
    videoRemoved: CallaVideoStreamRemovedEvent;
}

export interface CallaMetadataEvents {
    userJoined: CallaUserJoinedEvent;
    userLeft: CallaUserLeftEvent;
    userPosed: CallaUserPosedEvent;
    userPointer: CallaUserPointerEvent;
    emote: CallaEmoteEvent;
    setAvatarEmoji: CallaEmojiAvatarEvent;
    setAvatarURL: CallaPhotoAvatarEvent;
    chat: CallaChatEvent;
}

export interface CallaClientEvents extends CallaTeleconferenceEvents, CallaMetadataEvents { }