import { CallaEventType, CallaMetadataEventType } from "../../CallaEvents";
import { ConnectionState } from "../../ConnectionState";
import type { JitsiTeleconferenceClient } from "../../tele/jitsi/JitsiTeleconferenceClient";
import { BaseMetadataClient } from "../BaseMetadataClient";
export interface JitsiHaxCommand {
    hax: string;
    command: CallaMetadataEventType;
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
    protected callInternal(command: CallaEventType, ...values: any[]): Promise<void>;
    protected callInternalSingle(toUserID: string, command: CallaEventType, values: any[]): Promise<void>;
    private sendJitsiHax;
    protected stopInternal(): Promise<void>;
}
