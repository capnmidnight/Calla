import { HubConnectionState } from "@microsoft/signalr";
import { BaseMetadataClient } from "./BaseMetadataClient";
import type { CallaEventType } from "./CallaEvents";
import type { JitsiTeleconferenceClient } from "./JitsiTeleconferenceClient";
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
    join(roomName: string): Promise<void>;
    leave(): Promise<void>;
    identify(userName: string): Promise<void>;
    disconnect(): Promise<void>;
    private sendJitsiHax;
    protected callInternal(command: CallaEventType, ...values: any[]): Promise<void>;
    protected stopInternal(): Promise<void>;
}
