import type { AudioActivityEvent } from "./audio/AudioActivityEvent";
import type { InterpolatedPose } from "./audio/positions/InterpolatedPose";
import { AudioStreamSource } from "./audio/sources/AudioStreamSource";
export declare type CallaEventType = "error" | "info" | "serverConnected" | "serverDisconnected" | "serverFailed" | "conferenceConnected" | "conferenceJoined" | "conferenceFailed" | "conferenceRestored" | "conferenceLeft" | "participantJoined" | "participantLeft" | "userNameChanged" | "audioMuteStatusChanged" | "videoMuteStatusChanged" | "audioActivity" | "audioAdded" | "audioRemoved" | "videoAdded" | "videoRemoved" | "userPosed" | "userPointer" | "setAvatarEmoji" | "setAvatarURL" | "emote" | "chat";
export declare class CallaEvent<T extends CallaEventType> extends Event {
    eventType: T;
    constructor(eventType: T);
}
export declare class CallaErrorEvent extends CallaEvent<"error"> {
    readonly error: Error;
    constructor(error: Error);
}
export declare class CallaInfoEvent extends CallaEvent<"info"> {
    readonly message: string;
    constructor(message: string);
}
export declare class CallaServerConnectedEvent extends CallaEvent<"serverConnected"> {
    constructor();
}
export declare class CallaServerDisconnectedEvent extends CallaEvent<"serverDisconnected"> {
    constructor();
}
export declare class CallaServerFailedEvent extends CallaEvent<"serverFailed"> {
    constructor();
}
export declare class CallaUserEvent<T extends CallaEventType> extends CallaEvent<T> {
    userID: string;
    constructor(type: T, userID: string);
}
export declare class CallaParticipantEvent<T extends CallaEventType> extends CallaUserEvent<T> {
    displayName: string;
    constructor(type: T, id: string, displayName: string);
}
export declare class CallaUserNameChangedEvent extends CallaUserEvent<"userNameChanged"> {
    displayName: string;
    constructor(id: string, displayName: string);
}
export declare class CallaConferenceJoinedEvent extends CallaUserEvent<"conferenceJoined"> {
    pose: InterpolatedPose;
    constructor(id: string, pose: InterpolatedPose);
}
export declare class CallaConferenceLeftEvent extends CallaUserEvent<"conferenceLeft"> {
    constructor(id: string);
}
export declare class CallaConferenceConnectedEvent extends CallaEvent<"conferenceConnected"> {
    constructor();
}
export declare class CallaConferenceFailedEvent extends CallaEvent<"conferenceFailed"> {
    constructor();
}
export declare class CallaConferenceRestoredEvent extends CallaEvent<"conferenceRestored"> {
    constructor();
}
export declare class CallaParticipantJoinedEvent extends CallaParticipantEvent<"participantJoined"> {
    source: AudioStreamSource;
    constructor(id: string, displayName: string, source: AudioStreamSource);
}
export declare class CallaParticipantLeftEvent extends CallaUserEvent<"participantLeft"> {
    constructor(id: string);
}
export declare class CallaParticipantNameChangeEvent extends CallaParticipantEvent<"userNameChanged"> {
    constructor(id: string, displayName: string);
}
export declare class CallaUserMutedEvent<T extends CallaEventType> extends CallaUserEvent<T> {
    muted: boolean;
    constructor(type: T, id: string, muted: boolean);
}
export declare class CallaUserAudioMutedEvent extends CallaUserMutedEvent<"audioMuteStatusChanged"> {
    constructor(id: string, muted: boolean);
}
export declare class CallaUserVideoMutedEvent extends CallaUserMutedEvent<"videoMuteStatusChanged"> {
    constructor(id: string, muted: boolean);
}
export declare enum StreamType {
    Audio = "audio",
    Video = "video"
}
export declare enum StreamOpType {
    Added = "added",
    Removed = "removed",
    Changed = "changed"
}
export declare class CallaStreamEvent<T extends CallaEventType> extends CallaUserEvent<T> {
    kind: StreamType;
    op: StreamOpType;
    stream: MediaStream;
    constructor(type: T, kind: StreamType, op: StreamOpType, id: string, stream: MediaStream);
}
export declare class CallaStreamAddedEvent<T extends CallaEventType> extends CallaStreamEvent<T> {
    constructor(type: T, kind: StreamType, id: string, stream: MediaStream);
}
export declare class CallaStreamRemovedEvent<T extends CallaEventType> extends CallaStreamEvent<T> {
    constructor(type: T, kind: StreamType, id: string, stream: MediaStream);
}
export declare class CallaStreamChangedEvent<T extends CallaEventType> extends CallaStreamEvent<T> {
    constructor(type: T, kind: StreamType, id: string, stream: MediaStream);
}
export declare class CallaAudioStreamAddedEvent extends CallaStreamAddedEvent<"audioAdded"> {
    constructor(id: string, stream: MediaStream);
}
export declare class CallaAudioStreamRemovedEvent extends CallaStreamRemovedEvent<"audioRemoved"> {
    constructor(id: string, stream: MediaStream);
}
export declare class CallaVideoStreamAddedEvent extends CallaStreamAddedEvent<"videoAdded"> {
    constructor(id: string, stream: MediaStream);
}
export declare class CallaVideoStreamRemovedEvent extends CallaStreamRemovedEvent<"videoRemoved"> {
    constructor(id: string, stream: MediaStream);
}
export declare class CallaPoseEvent<T extends CallaEventType> extends CallaUserEvent<T> {
    px: number;
    py: number;
    pz: number;
    fx: number;
    fy: number;
    fz: number;
    ux: number;
    uy: number;
    uz: number;
    constructor(type: T, id: string, px: number, py: number, pz: number, fx: number, fy: number, fz: number, ux: number, uy: number, uz: number);
    set(px: number, py: number, pz: number, fx: number, fy: number, fz: number, ux: number, uy: number, uz: number): void;
}
export declare class CallaUserPosedEvent extends CallaPoseEvent<"userPosed"> {
    constructor(id: string, px: number, py: number, pz: number, fx: number, fy: number, fz: number, ux: number, uy: number, uz: number);
}
export declare class CallaUserPointerEvent extends CallaPoseEvent<"userPointer"> {
    name: string;
    constructor(id: string, name: string, px: number, py: number, pz: number, fx: number, fy: number, fz: number, ux: number, uy: number, uz: number);
}
export declare class CallaEmojiEvent<T extends CallaEventType> extends CallaUserEvent<T> {
    readonly emoji: string;
    constructor(type: T, id: string, emoji: string);
}
export declare class CallaEmoteEvent extends CallaEmojiEvent<"emote"> {
    constructor(id: string, emoji: string);
}
export declare class CallaEmojiAvatarEvent extends CallaEmojiEvent<"setAvatarEmoji"> {
    constructor(id: string, emoji: string);
}
export declare class CallaPhotoAvatarEvent extends CallaUserEvent<"setAvatarURL"> {
    readonly url: string;
    constructor(id: string, url: string);
}
export declare class CallaChatEvent extends CallaUserEvent<"chat"> {
    text: string;
    constructor(id: string, text: string);
}
export interface CallaClientEvents {
    error: CallaErrorEvent;
    info: CallaInfoEvent;
    serverConnected: CallaServerConnectedEvent;
    serverDisconnected: CallaServerDisconnectedEvent;
    serverFailed: CallaServerFailedEvent;
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
    userPosed: CallaUserPosedEvent;
    userPointer: CallaUserPointerEvent;
    emote: CallaEmoteEvent;
    setAvatarEmoji: CallaEmojiAvatarEvent;
    setAvatarURL: CallaPhotoAvatarEvent;
    chat: CallaChatEvent;
}
