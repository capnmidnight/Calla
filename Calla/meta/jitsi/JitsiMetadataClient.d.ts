import { C } from "../../CallaEvents";
import { ConnectionState } from "../../ConnectionState";
import type { JitsiTeleconferenceClient } from "../../tele/jitsi/JitsiTeleconferenceClient";
import { BaseMetadataClient } from "../BaseMetadataClient";
export interface JitsiHaxCommand {
    hax: string;
    command: C;
    values: any[];
}
export declare class JitsiMetadataClient extends BaseMetadataClient {
    private tele;
    private _status;
    private remoteUserIDs;
    constructor(tele: JitsiTeleconferenceClient);
    get metadataState(): ConnectionState;
    connect(): Promise<void>;
    join(_roomName: string): Promise<void>;
    leave(): Promise<void>;
    identify(_userName: string): Promise<void>;
    disconnect(): Promise<void>;
    private toRoom;
    private toUser;
    setLocalPose(px: number, py: number, pz: number, fx: number, fy: number, fz: number, ux: number, uy: number, uz: number): void;
    tellLocalPose(toUserID: string, px: number, py: number, pz: number, fx: number, fy: number, fz: number, ux: number, uy: number, uz: number): void;
    setLocalPointer(name: string, px: number, py: number, pz: number, fx: number, fy: number, fz: number, ux: number, uy: number, uz: number): void;
    setAvatarEmoji(toUserID: string, emoji: string): void;
    setAvatarURL(toUserID: string, url: string): void;
    emote(emoji: string): void;
    chat(text: string): void;
    protected stopInternal(): Promise<void>;
}
