import { HubConnectionState } from "@microsoft/signalr";
import { CallaEventType } from "../../CallaEvents";
import type { JitsiTeleconferenceClient } from "../../tele/jitsi/JitsiTeleconferenceClient";
import { BaseMetadataClient } from "../BaseMetadataClient";
export interface JitsiHaxCommand {
    hax: string;
    command: CallaEventType;
    values: any[];
}
export declare class JitsiMetadataClient extends BaseMetadataClient {
    private tele;
    private _status;
    private remoteUserIDs;
    constructor(tele: JitsiTeleconferenceClient);
    get metadataState(): HubConnectionState;
    connect(): Promise<void>;
    join(_roomName: string): Promise<void>;
    leave(): Promise<void>;
    identify(_userName: string): Promise<void>;
    disconnect(): Promise<void>;
    private sendJitsiHax;
    protected callInternal(command: CallaEventType, ...values: any[]): Promise<void>;
    protected stopInternal(): Promise<void>;
}
