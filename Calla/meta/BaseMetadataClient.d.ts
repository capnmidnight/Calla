import { TypedEventBase } from "kudzu/events/EventBase";
import type { CallaMetadataEvents } from "../CallaEvents";
import { ConnectionState } from "../ConnectionState";
import type { IMetadataClientExt } from "./IMetadataClient";
export declare abstract class BaseMetadataClient extends TypedEventBase<CallaMetadataEvents> implements IMetadataClientExt {
    getNext<T extends keyof CallaMetadataEvents>(evtName: T, userID: string): Promise<CallaMetadataEvents[T]>;
    abstract get metadataState(): ConnectionState;
    get isConnected(): boolean;
    abstract setLocalPose(px: number, py: number, pz: number, fx: number, fy: number, fz: number, ux: number, uy: number, uz: number): void;
    abstract tellLocalPose(toUserID: string, px: number, py: number, pz: number, fx: number, fy: number, fz: number, ux: number, uy: number, uz: number): void;
    abstract setLocalPointer(name: string, px: number, py: number, pz: number, fx: number, fy: number, fz: number, ux: number, uy: number, uz: number): void;
    abstract setAvatarEmoji(toUserID: string, emoji: string): void;
    abstract setAvatarURL(toUserID: string, url: string): void;
    abstract emote(emoji: string): void;
    abstract chat(text: string): void;
    abstract connect(): Promise<void>;
    abstract join(roomName: string): Promise<void>;
    abstract identify(userNameOrID: string): Promise<void>;
    abstract leave(): Promise<void>;
    abstract disconnect(): Promise<void>;
}
