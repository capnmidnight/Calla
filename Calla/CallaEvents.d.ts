import { Emoji } from "kudzu/emoji/Emoji";
import type { AudioActivityEvent } from "./audio/AudioActivityEvent";
import type { InterpolatedPose } from "./audio/positions/InterpolatedPose";
import { AudioStreamSource } from "./audio/sources/AudioStreamSource";
export declare type CallaTeleconferenceEventType = "serverConnected" | "serverDisconnected" | "serverFailed" | "conferenceConnected" | "conferenceJoined" | "conferenceFailed" | "conferenceRestored" | "conferenceLeft" | "participantJoined" | "participantLeft" | "userNameChanged" | "audioMuteStatusChanged" | "videoMuteStatusChanged" | "audioActivity" | "audioAdded" | "audioRemoved" | "videoAdded" | "videoRemoved";
export declare type CallaMetadataEventType = "userPosed" | "userPointer" | "setAvatarEmoji" | "avatarChanged" | "emote" | "chat";
export declare type CallaEventType = CallaTeleconferenceEventType | CallaMetadataEventType;
export declare class CallaEvent<T extends CallaEventType> extends Event {
    eventType: T;
    constructor(eventType: T);
}
export declare class CallaTeleconferenceServerConnectedEvent extends CallaEvent<"serverConnected"> {
    constructor();
}
export declare class CallaTeleconferenceServerDisconnectedEvent extends CallaEvent<"serverDisconnected"> {
    constructor();
}
export declare class CallaTeleconferenceServerFailedEvent extends CallaEvent<"serverFailed"> {
    constructor();
}
export declare class CallaUserEvent<T extends CallaEventType> extends CallaEvent<T> {
    id: string;
    constructor(type: T, id: string);
}
export declare class CallaParticipantEvent<T extends CallaTeleconferenceEventType> extends CallaUserEvent<T> {
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
export declare class CallaUserMutedEvent<T extends CallaTeleconferenceEventType> extends CallaUserEvent<T> {
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
export declare class CallaStreamEvent<T extends CallaTeleconferenceEventType> extends CallaUserEvent<T> {
    kind: StreamType;
    op: StreamOpType;
    stream: MediaStream;
    constructor(type: T, kind: StreamType, op: StreamOpType, id: string, stream: MediaStream);
}
export declare class CallaStreamAddedEvent<T extends CallaTeleconferenceEventType> extends CallaStreamEvent<T> {
    constructor(type: T, kind: StreamType, id: string, stream: MediaStream);
}
export declare class CallaStreamRemovedEvent<T extends CallaTeleconferenceEventType> extends CallaStreamEvent<T> {
    constructor(type: T, kind: StreamType, id: string, stream: MediaStream);
}
export declare class CallaStreamChangedEvent<T extends CallaTeleconferenceEventType> extends CallaStreamEvent<T> {
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
export declare class CallaPoseEvent<T extends CallaMetadataEventType> extends CallaUserEvent<T> {
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
export declare class CallaEmojiEvent<T extends CallaMetadataEventType> extends CallaUserEvent<T> {
    emoji: string;
    constructor(type: T, id: string, emoji: Emoji | string);
}
export declare class CallaEmoteEvent extends CallaEmojiEvent<"emote"> {
    constructor(id: string, emoji: string);
}
export declare class CallaEmojiAvatarEvent extends CallaEmojiEvent<"setAvatarEmoji"> {
    constructor(id: string, emoji: string);
}
export declare class CallaAvatarChangedEvent extends CallaUserEvent<"avatarChanged"> {
    url: string;
    constructor(id: string, url: string);
}
export declare class CallaChatEvent extends CallaUserEvent<"chat"> {
    text: string;
    constructor(id: string, text: string);
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
    userPosed: CallaUserPosedEvent;
    userPointer: CallaUserPointerEvent;
    emote: CallaEmoteEvent;
    setAvatarEmoji: CallaEmojiAvatarEvent;
    avatarChanged: CallaAvatarChangedEvent;
    chat: CallaChatEvent;
}
export interface CallaClientEvents extends CallaTeleconferenceEvents, CallaMetadataEvents {
}
