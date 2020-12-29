import { HubConnectionState } from "@microsoft/signalr";
import { arrayRemove, arraySortedInsert, once, waitFor } from "kudzu";
import { BaseMetadataClient } from "./BaseMetadataClient";
import { CallaAvatarChangedEvent, CallaChatEvent, CallaEmojiAvatarEvent, CallaEmoteEvent, CallaMetadataEventType, CallaTeleconferenceEventType, CallaUserPointerEvent, CallaUserPosedEvent } from "./CallaEvents";
const JITSI_HAX_FINGERPRINT = "Calla";
export class JitsiMetadataClient extends BaseMetadataClient {
    constructor(tele) {
        super(250);
        this.tele = tele;
        this._status = HubConnectionState.Disconnected;
        this.remoteUserIDs = new Array();
        this.tele.addEventListener(CallaTeleconferenceEventType.ParticipantJoined, (evt) => {
            arraySortedInsert(this.remoteUserIDs, evt.id, false);
        });
        this.tele.addEventListener(CallaTeleconferenceEventType.ParticipantLeft, (evt) => {
            arrayRemove(this.remoteUserIDs, evt.id);
        });
    }
    get metadataState() {
        return this._status;
    }
    async connect() {
        await this.tele.connect();
    }
    async join(roomName) {
        this._status = HubConnectionState.Connecting;
        const joinTask = await once(this.tele.conference, JitsiMeetJS.events.conference.DATA_CHANNEL_OPENED);
        this.tele.conference.addEventListener(JitsiMeetJS.events.conference.ENDPOINT_MESSAGE_RECEIVED, (user, data) => {
            if (data.hax === JITSI_HAX_FINGERPRINT) {
                const fromUserID = user.getId();
                const command = data.command;
                const values = data.values;
                switch (command) {
                    case CallaMetadataEventType.AvatarChanged:
                        this.dispatchEvent(new CallaAvatarChangedEvent(fromUserID, values[0]));
                        break;
                    case CallaMetadataEventType.Emote:
                        this.dispatchEvent(new CallaEmoteEvent(fromUserID, values[0]));
                        break;
                    case CallaMetadataEventType.SetAvatarEmoji:
                        this.dispatchEvent(new CallaEmojiAvatarEvent(fromUserID, values[0]));
                        break;
                    case CallaMetadataEventType.UserPosed:
                        this.dispatchEvent(new CallaUserPosedEvent(fromUserID, values[0], values[1], values[2], values[3], values[4], values[5], values[6], values[7], values[8]));
                        break;
                    case CallaMetadataEventType.UserPointer:
                        this.dispatchEvent(new CallaUserPointerEvent(fromUserID, values[0], values[1], values[2], values[3], values[4], values[5], values[6], values[7], values[8], values[9]));
                        break;
                    case CallaMetadataEventType.Chat:
                        this.dispatchEvent(new CallaChatEvent(fromUserID, values[0]));
                        break;
                    default:
                        console.warn("Unknown message type:", command, "from user:", fromUserID, "values:", values);
                        break;
                }
            }
        });
        await this.tele.join(roomName);
        await joinTask;
        this._status = HubConnectionState.Connected;
    }
    async leave() {
        this._status = HubConnectionState.Disconnecting;
        await this.tele.leave();
        this._status = HubConnectionState.Disconnected;
    }
    async identify(userName) {
        await this.tele.identify(userName);
    }
    async disconnect() {
        await this.tele.disconnect();
    }
    sendJitsiHax(toUserID, command, ...values) {
        this.tele.conference.sendMessage({
            hax: JITSI_HAX_FINGERPRINT,
            command,
            values
        }, toUserID);
    }
    callInternal(command, ...values) {
        for (const toUserID of this.remoteUserIDs) {
            this.sendJitsiHax(toUserID, command, ...values);
        }
        return Promise.resolve();
    }
    async stopInternal() {
        this._status = HubConnectionState.Disconnecting;
        await waitFor(() => this.metadataState === HubConnectionState.Disconnected);
    }
}
//# sourceMappingURL=JitsiMetadataClient.js.map