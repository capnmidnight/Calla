import type { CallaEventType } from "../../CallaEvents";
import { ConnectionState } from "../../ConnectionState";
import { BaseMetadataClient } from "../BaseMetadataClient";
export declare class SignalRMetadataClient extends BaseMetadataClient {
    private hub;
    private lastRoom;
    private lastUserID;
    private currentRoom;
    private currentUserID;
    constructor();
    get metadataState(): ConnectionState;
    private maybeStart;
    private maybeJoin;
    private maybeIdentify;
    private maybeLeave;
    private maybeDisconnect;
    connect(): Promise<void>;
    join(roomName: string): Promise<void>;
    identify(userID: string): Promise<void>;
    leave(): Promise<void>;
    disconnect(): Promise<void>;
    protected callInternal(command: CallaEventType, toUserID: string, ...args: any[]): Promise<void>;
}
