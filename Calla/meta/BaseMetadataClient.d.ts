import { TypedEventBase } from "kudzu/events/EventBase";
import type { CallaEventType, CallaMetadataEvents } from "../CallaEvents";
import { ConnectionState } from "../ConnectionState";
import type { IMetadataClientExt } from "./IMetadataClient";
export declare abstract class BaseMetadataClient extends TypedEventBase<CallaMetadataEvents> implements IMetadataClientExt {
    getNext<T extends keyof CallaMetadataEvents>(evtName: T, userID: string): Promise<CallaMetadataEvents[T]>;
    abstract get metadataState(): ConnectionState;
    get isConnected(): boolean;
    protected abstract callInternal(command: CallaEventType, ...args: any[]): Promise<void>;
    protected abstract callInternalSingle(userid: string, command: CallaEventType, ...args: any[]): Promise<void>;
    setLocalPose(px: number, py: number, pz: number, fx: number, fy: number, fz: number, ux: number, uy: number, uz: number): void;
    tellLocalPose(userid: string, px: number, py: number, pz: number, fx: number, fy: number, fz: number, ux: number, uy: number, uz: number): void;
    setLocalPointer(name: string, px: number, py: number, pz: number, fx: number, fy: number, fz: number, ux: number, uy: number, uz: number): void;
    setAvatarEmoji(emoji: string): void;
    tellAvatarEmoji(userid: string, emoji: string): void;
    setAvatarURL(url: string): void;
    tellAvatarURL(userid: string, url: string): void;
    emote(emoji: string): void;
    chat(text: string): void;
    abstract connect(): Promise<void>;
    abstract join(roomName: string): Promise<void>;
    abstract identify(userNameOrID: string): Promise<void>;
    abstract leave(): Promise<void>;
    abstract disconnect(): Promise<void>;
}
