import type { TypedEventBase } from "kudzu/events/EventBase";
import type { AudioManager } from "../audio/AudioManager";
import type { CallaTeleconferenceEvents } from "../CallaEvents";
import type { ConnectionState } from "../ConnectionState";
import type { IClient } from "../IClient";

export interface ITeleconferenceClient
    extends TypedEventBase<CallaTeleconferenceEvents>, IClient {

    audio: AudioManager;
    localUserID: string;
    localUserName: string;
    roomName: string;
    startDevicesImmediately: boolean;

    localAudioInput: GainNode;
    useHalfDuplex: boolean;
    halfDuplexMin: number;
    halfDuplexMax: number;
    halfDuplexThreshold: number;
    halfDuplexAttack: number;
    halfDuplexDecay: number;
    halfDuplexSustain: number;
    halfDuplexHold: number;
    halfDuplexRelease: number;
    halfDuplexLevel: number;
    remoteActivityLevel: number;

    userExists(id: string): boolean;

    getUserNames(): string[][];

    connectionState: ConnectionState;
    conferenceState: ConnectionState;

    toggleAudioMuted(): Promise<boolean>;
    toggleVideoMuted(): Promise<boolean>;

    getAudioMuted(): Promise<boolean>;
    getVideoMuted(): Promise<boolean>;
}

export interface ITeleconferenceClientExt extends ITeleconferenceClient {
    getNext<T extends keyof CallaTeleconferenceEvents>(evtName: T, userID: string): Promise<CallaTeleconferenceEvents[T]>;
}
