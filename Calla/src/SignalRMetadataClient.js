import { HttpTransportType, HubConnectionBuilder, HubConnectionState } from "@microsoft/signalr";
import { waitFor } from "kudzu";
import { BaseMetadataClient } from "./BaseMetadataClient";
import { CallaAvatarChangedEvent, CallaChatEvent, CallaEmojiAvatarEvent, CallaEmoteEvent, CallaMetadataEventType, CallaUserPointerEvent, CallaUserPosedEvent } from "./CallaEvents";
export class SignalRMetadataClient extends BaseMetadataClient {
    constructor() {
        super(50);
        this.lastRoom = null;
        this.lastUserID = null;
        this.currentRoom = null;
        this.currentUserID = null;
        this.hub = new HubConnectionBuilder()
            .withUrl("/calla", HttpTransportType.WebSockets)
            .build();
        this.hub.onclose(() => {
            this.lastRoom = null;
            this.lastUserID = null;
        });
        this.hub.on(CallaMetadataEventType.UserPosed, (fromUserID, px, py, pz, fx, fy, fz, ux, uy, uz) => {
            this.dispatchEvent(new CallaUserPosedEvent(fromUserID, px, py, pz, fx, fy, fz, ux, uy, uz));
        });
        this.hub.on(CallaMetadataEventType.UserPointer, (fromUserID, name, px, py, pz, fx, fy, fz, ux, uy, uz) => {
            this.dispatchEvent(new CallaUserPointerEvent(fromUserID, name, px, py, pz, fx, fy, fz, ux, uy, uz));
        });
        this.hub.on(CallaMetadataEventType.AvatarChanged, (fromUserID, url) => {
            this.dispatchEvent(new CallaAvatarChangedEvent(fromUserID, url));
        });
        this.hub.on(CallaMetadataEventType.Emote, (fromUserID, emoji) => {
            this.dispatchEvent(new CallaEmoteEvent(fromUserID, emoji));
        });
        this.hub.on(CallaMetadataEventType.SetAvatarEmoji, (fromUserID, emoji) => {
            this.dispatchEvent(new CallaEmojiAvatarEvent(fromUserID, emoji));
        });
        this.hub.on(CallaMetadataEventType.Chat, (fromUserID, text) => {
            this.dispatchEvent(new CallaChatEvent(fromUserID, text));
        });
    }
    get metadataState() {
        return this.hub.state;
    }
    async maybeStart() {
        if (this.metadataState === HubConnectionState.Connecting) {
            await waitFor(() => this.metadataState === HubConnectionState.Connected);
        }
        else {
            if (this.metadataState === HubConnectionState.Disconnecting) {
                await waitFor(() => this.metadataState === HubConnectionState.Disconnected);
            }
            if (this.metadataState === HubConnectionState.Disconnected) {
                await this.hub.start();
            }
        }
    }
    async maybeJoin() {
        await this.maybeStart();
        if (this.currentRoom !== this.lastRoom) {
            await this.maybeLeave();
            if (this.currentRoom && this.isConnected) {
                this.lastRoom = this.currentRoom;
                await this.hub.invoke("join", this.currentRoom);
            }
        }
    }
    async maybeIdentify() {
        await this.maybeJoin();
        if (this.currentUserID
            && this.currentUserID !== this.lastUserID
            && this.isConnected) {
            this.lastUserID = this.currentUserID;
            await this.hub.invoke("identify", this.currentUserID);
        }
    }
    async maybeLeave() {
        if (this.isConnected) {
            await this.hub.invoke("leave");
        }
    }
    async maybeDisconnect() {
        if (this.metadataState === HubConnectionState.Disconnecting) {
            await waitFor(() => this.metadataState === HubConnectionState.Disconnected);
        }
        else {
            if (this.metadataState === HubConnectionState.Connecting) {
                await waitFor(() => this.metadataState === HubConnectionState.Connected);
            }
            if (this.metadataState === HubConnectionState.Connected) {
                await this.hub.stop();
            }
        }
    }
    async connect() {
        await this.maybeStart();
    }
    async join(roomName) {
        this.currentRoom = roomName;
        await this.maybeJoin();
    }
    async identify(userID) {
        this.currentUserID = userID;
        await this.maybeJoin();
        await this.maybeIdentify();
    }
    async leave() {
        await this.maybeLeave();
        this.currentUserID
            = this.lastUserID
                = this.currentRoom
                    = this.lastRoom
                        = null;
    }
    async disconnect() {
        await this.maybeDisconnect();
        this.currentUserID
            = this.lastUserID
                = this.currentRoom
                    = this.lastRoom
                        = null;
    }
    async callInternal(command, toUserID, ...args) {
        await this.maybeIdentify();
        if (this.isConnected) {
            await this.hub.invoke(command, toUserID, ...args);
        }
    }
}
//# sourceMappingURL=SignalRMetadataClient.js.map