import { Emoji } from "kudzu/emoji/Emoji";
import type { AudioActivityEvent } from "./audio/AudioActivityEvent";
import type { AudioSource } from "./audio/AudioSource";
import type { InterpolatedPose } from "./audio/positions/InterpolatedPose";
export declare enum CallaTeleconferenceEventType {
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
export declare enum CallaMetadataEventType {
    UserPosed = "userPosed",
    UserPointer = "userPointer",
    SetAvatarEmoji = "setAvatarEmoji",
    AvatarChanged = "avatarChanged",
    Emote = "emote",
    Chat = "chat"
}
export declare type CallaEventType = CallaTeleconferenceEventType | CallaMetadataEventType;
export declare class CallaEvent<T extends CallaEventType> extends Event {
    eventType: T;
    constructor(eventType: T);
}
export declare class CallaTeleconferenceServerConnectedEvent extends CallaEvent<CallaTeleconferenceEventType.ServerConnected> {
    constructor();
}
export declare class CallaTeleconferenceServerDisconnectedEvent extends CallaEvent<CallaTeleconferenceEventType.ServerDisconnected> {
    constructor();
}
export declare class CallaTeleconferenceServerFailedEvent extends CallaEvent<CallaTeleconferenceEventType.ServerFailed> {
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
export declare class CallaUserNameChangedEvent extends CallaUserEvent<CallaTeleconferenceEventType.UserNameChanged> {
    displayName: string;
    constructor(id: string, displayName: string);
}
export declare class CallaConferenceJoinedEvent extends CallaUserEvent<CallaTeleconferenceEventType.ConferenceJoined> {
    pose: InterpolatedPose;
    constructor(id: string, pose: InterpolatedPose);
}
export declare class CallaConferenceLeftEvent extends CallaUserEvent<CallaTeleconferenceEventType.ConferenceLeft> {
    constructor(id: string);
}
export declare class CallaConferenceConnectedEvent extends CallaEvent<CallaTeleconferenceEventType.ConferenceConnected> {
    constructor();
}
export declare class CallaConferenceFailedEvent extends CallaEvent<CallaTeleconferenceEventType.ConferenceFailed> {
    constructor();
}
export declare class CallaConferenceRestoredEvent extends CallaEvent<CallaTeleconferenceEventType.ConferenceRestored> {
    constructor();
}
export declare class CallaParticipantJoinedEvent extends CallaParticipantEvent<CallaTeleconferenceEventType.ParticipantJoined> {
    source: AudioSource;
    constructor(id: string, displayName: string, source: AudioSource);
}
export declare class CallaParticipantLeftEvent extends CallaUserEvent<CallaTeleconferenceEventType.ParticipantLeft> {
    constructor(id: string);
}
export declare class CallaParticipantNameChangeEvent extends CallaParticipantEvent<CallaTeleconferenceEventType.UserNameChanged> {
    constructor(id: string, displayName: string);
}
export declare class CallaUserMutedEvent<T extends CallaTeleconferenceEventType> extends CallaUserEvent<T> {
    muted: boolean;
    constructor(type: T, id: string, muted: boolean);
}
export declare class CallaUserAudioMutedEvent extends CallaUserMutedEvent<CallaTeleconferenceEventType.AudioMuteStatusChanged> {
    constructor(id: string, muted: boolean);
}
export declare class CallaUserVideoMutedEvent extends CallaUserMutedEvent<CallaTeleconferenceEventType.VideoMuteStatusChanged> {
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
export declare class CallaAudioStreamAddedEvent extends CallaStreamAddedEvent<CallaTeleconferenceEventType.AudioAdded> {
    constructor(id: string, stream: MediaStream);
}
export declare class CallaAudioStreamRemovedEvent extends CallaStreamRemovedEvent<CallaTeleconferenceEventType.AudioRemoved> {
    constructor(id: string, stream: MediaStream);
}
export declare class CallaVideoStreamAddedEvent extends CallaStreamAddedEvent<CallaTeleconferenceEventType.VideoAdded> {
    constructor(id: string, stream: MediaStream);
}
export declare class CallaVideoStreamRemovedEvent extends CallaStreamRemovedEvent<CallaTeleconferenceEventType.VideoRemoved> {
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
export declare class CallaUserPosedEvent extends CallaPoseEvent<CallaMetadataEventType.UserPosed> {
    constructor(id: string, px: number, py: number, pz: number, fx: number, fy: number, fz: number, ux: number, uy: number, uz: number);
}
export declare class CallaUserPointerEvent extends CallaPoseEvent<CallaMetadataEventType.UserPointer> {
    name: string;
    constructor(id: string, name: string, px: number, py: number, pz: number, fx: number, fy: number, fz: number, ux: number, uy: number, uz: number);
}
export declare class CallaEmojiEvent<T extends CallaMetadataEventType> extends CallaUserEvent<T> {
    emoji: string;
    constructor(type: T, id: string, emoji: Emoji | string);
}
export declare class CallaEmoteEvent extends CallaEmojiEvent<CallaMetadataEventType.Emote> {
    constructor(id: string, emoji: Emoji | string);
}
export declare class CallaEmojiAvatarEvent extends CallaEmojiEvent<CallaMetadataEventType.SetAvatarEmoji> {
    constructor(id: string, emoji: Emoji | string);
}
export declare class CallaAvatarChangedEvent extends CallaUserEvent<CallaMetadataEventType.AvatarChanged> {
    url: string;
    constructor(id: string, url: string);
}
export declare class CallaChatEvent extends CallaUserEvent<CallaMetadataEventType.Chat> {
    text: string;
    constructor(id: string, text: string);
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
export interface CallaClientEvents extends CallaTeleconferenceEvents, CallaMetadataEvents {
}
