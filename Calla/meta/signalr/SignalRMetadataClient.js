import { HubConnectionState } from "../../signalr/HubConnection";
import { HubConnectionBuilder } from "../../signalr/HubConnectionBuilder";
import { HttpTransportType } from "../../signalr/ITransport";
import { waitFor } from "kudzu/events/waitFor";
import { assertNever } from "kudzu/typeChecks";
import { CallaAvatarChangedEvent, CallaChatEvent, CallaEmojiAvatarEvent, CallaEmoteEvent, CallaUserPointerEvent, CallaUserPosedEvent } from "../../CallaEvents";
import { ConnectionState } from "../../ConnectionState";
import { BaseMetadataClient } from "../BaseMetadataClient";
export class SignalRMetadataClient extends BaseMetadataClient {
    constructor(signalRPath) {
        super(50);
        this.lastRoom = null;
        this.lastUserID = null;
        this.currentRoom = null;
        this.currentUserID = null;
        this.hub = new HubConnectionBuilder()
            .withUrl(signalRPath, HttpTransportType.WebSockets)
            .build();
        this.hub.onclose(() => {
            this.lastRoom = null;
            this.lastUserID = null;
        });
        this.hub.on("userPosed", (fromUserID, px, py, pz, fx, fy, fz, ux, uy, uz) => {
            this.dispatchEvent(new CallaUserPosedEvent(fromUserID, px, py, pz, fx, fy, fz, ux, uy, uz));
        });
        this.hub.on("userPointer", (fromUserID, name, px, py, pz, fx, fy, fz, ux, uy, uz) => {
            this.dispatchEvent(new CallaUserPointerEvent(fromUserID, name, px, py, pz, fx, fy, fz, ux, uy, uz));
        });
        this.hub.on("avatarChanged", (fromUserID, url) => {
            this.dispatchEvent(new CallaAvatarChangedEvent(fromUserID, url));
        });
        this.hub.on("emote", (fromUserID, emoji) => {
            this.dispatchEvent(new CallaEmoteEvent(fromUserID, emoji));
        });
        this.hub.on("setAvatarEmoji", (fromUserID, emoji) => {
            this.dispatchEvent(new CallaEmojiAvatarEvent(fromUserID, emoji));
        });
        this.hub.on("chat", (fromUserID, text) => {
            this.dispatchEvent(new CallaChatEvent(fromUserID, text));
        });
    }
    get metadataState() {
        switch (this.hub.state) {
            case HubConnectionState.Connected: return ConnectionState.Connected;
            case HubConnectionState.Connecting:
            case HubConnectionState.Reconnecting: return ConnectionState.Connecting;
            case HubConnectionState.Disconnected: return ConnectionState.Disconnected;
            case HubConnectionState.Disconnecting: return ConnectionState.Disconnecting;
            default: assertNever(this.hub.state);
        }
    }
    async maybeStart() {
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