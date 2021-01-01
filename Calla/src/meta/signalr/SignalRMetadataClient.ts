import { HubConnection, HubConnectionState } from "@microsoft/signalr";
import {
    HttpTransportType,
    HubConnectionBuilder
} from "@microsoft/signalr";
import type { Emoji } from "kudzu/emoji/Emoji";
import { waitFor } from "kudzu/events/waitFor";
import type { CallaEventType } from "../../CallaEvents";
import {
    CallaAvatarChangedEvent,
    CallaChatEvent,
    CallaEmojiAvatarEvent,
    CallaEmoteEvent,
    CallaMetadataEventType,
    CallaUserPointerEvent,
    CallaUserPosedEvent
} from "../../CallaEvents";
import { ConnectionState } from "../../ConnectionState";
import { BaseMetadataClient } from "../BaseMetadataClient";

export class SignalRMetadataClient
    extends BaseMetadataClient {

    private hub: HubConnection;
    private lastRoom: string = null;
    private lastUserID: string = null;
    private currentRoom: string = null;
    private currentUserID: string = null;

    constructor() {
        super(50);

        this.hub = new HubConnectionBuilder()
            .withUrl("/calla", HttpTransportType.WebSockets)
            .build();

        this.hub.onclose(() => {
            this.lastRoom = null;
            this.lastUserID = null;
        });

        this.hub.on(CallaMetadataEventType.UserPosed,
            (fromUserID: string, px: number, py: number, pz: number, fx: number, fy: number, fz: number, ux: number, uy: number, uz: number) => {
                this.dispatchEvent(new CallaUserPosedEvent(fromUserID, px, py, pz, fx, fy, fz, ux, uy, uz));
            });

        this.hub.on(CallaMetadataEventType.UserPointer,
            (fromUserID: string, name: string, px: number, py: number, pz: number, fx: number, fy: number, fz: number, ux: number, uy: number, uz: number) => {
                this.dispatchEvent(new CallaUserPointerEvent(fromUserID, name, px, py, pz, fx, fy, fz, ux, uy, uz));
            });

        this.hub.on(CallaMetadataEventType.AvatarChanged,
            (fromUserID: string, url: string) => {
                this.dispatchEvent(new CallaAvatarChangedEvent(fromUserID, url));
            });

        this.hub.on(CallaMetadataEventType.Emote,
            (fromUserID: string, emoji: Emoji) => {
                this.dispatchEvent(new CallaEmoteEvent(fromUserID, emoji));
            });

        this.hub.on(CallaMetadataEventType.SetAvatarEmoji,
            (fromUserID: string, emoji: Emoji) => {
                this.dispatchEvent(new CallaEmojiAvatarEvent(fromUserID, emoji));
            });

        this.hub.on(CallaMetadataEventType.Chat,
            (fromUserID: string, text: string) => {
                this.dispatchEvent(new CallaChatEvent(fromUserID, text));
            });
    }

    get metadataState() {
        switch (this.hub.state) {
            case HubConnectionState.Connected: return ConnectionState.Connected;
            case HubConnectionState.Connecting: case HubConnectionState.Reconnecting: return ConnectionState.Connecting;
            case HubConnectionState.Disconnected: return ConnectionState.Disconnected;
            case HubConnectionState.Disconnecting: return ConnectionState.Disconnecting;
        }
    }

    private async maybeStart(): Promise<void> {
        if (this.metadataState === ConnectionState.Connecting) {
            await waitFor(() => this.metadataState === ConnectionState.Connected);
        }
        else {
            if (this.metadataState === ConnectionState.Disconnecting) {
                await waitFor(() => this.metadataState === ConnectionState.Disconnected);
            }

            if (this.metadataState === ConnectionState.Disconnected) {
                await this.hub.start();
            }
        }
    }

    private async maybeJoin(): Promise<void> {
        await this.maybeStart();

        if (this.currentRoom !== this.lastRoom) {
            await this.maybeLeave();

            if (this.currentRoom && this.isConnected) {
                this.lastRoom = this.currentRoom;
                await this.hub.invoke("join", this.currentRoom);
            }
        }
    }

    private async maybeIdentify(): Promise<void> {
        await this.maybeJoin();

        if (this.currentUserID
            && this.currentUserID !== this.lastUserID
            && this.isConnected) {
            this.lastUserID = this.currentUserID;
            await this.hub.invoke("identify", this.currentUserID);
        }
    }

    private async maybeLeave(): Promise<void> {
        if (this.isConnected) {
            await this.hub.invoke("leave");
        }
    }

    private async maybeDisconnect() {
        if (this.metadataState === ConnectionState.Disconnecting) {
            await waitFor(() => this.metadataState === ConnectionState.Disconnected);
        }
        else {
            if (this.metadataState === ConnectionState.Connecting) {
                await waitFor(() => this.metadataState === ConnectionState.Connected);
            }

            if (this.metadataState === ConnectionState.Connected) {
                await this.hub.stop();
            }
        }
    }

    async connect(): Promise<void> {
        await this.maybeStart();
    }

    async join(roomName: string): Promise<void> {
        this.currentRoom = roomName;
        await this.maybeJoin();
    }

    async identify(userID: string): Promise<void> {
        this.currentUserID = userID;
        await this.maybeJoin();
        await this.maybeIdentify();
    }

    async leave(): Promise<void> {
        await this.maybeLeave();
        this.currentUserID
            = this.lastUserID
            = this.currentRoom
            = this.lastRoom
            = null;
    }

    async disconnect(): Promise<void> {
        await this.maybeDisconnect();
        this.currentUserID
            = this.lastUserID
            = this.currentRoom
            = this.lastRoom
            = null;
    }

    protected async callInternal(command: CallaEventType, toUserID: string, ...args: any[]): Promise<void> {
        await this.maybeIdentify();
        if (this.isConnected) {
            await this.hub.invoke(command, toUserID, ...args);
        }
    }
}
