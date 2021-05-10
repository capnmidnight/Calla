import { arrayRemove } from "kudzu/arrays/arrayRemove";
import { arraySortedInsert } from "kudzu/arrays/arraySortedInsert";
import { sleep } from "kudzu/events/sleep";
import { waitFor } from "kudzu/events/waitFor";
import { assertNever } from "kudzu/typeChecks";
import { CallaAvatarChangedEvent, CallaChatEvent, CallaEmojiAvatarEvent, CallaEmoteEvent, CallaUserPointerEvent, CallaUserPosedEvent } from "../../CallaEvents";
import { ConnectionState } from "../../ConnectionState";
import { BaseMetadataClient } from "../BaseMetadataClient";
const JITSI_HAX_FINGERPRINT = "Calla";
export class JitsiMetadataClient extends BaseMetadataClient {
    constructor(tele) {
        super(250);
        this.tele = tele;
        this._status = ConnectionState.Disconnected;
        this.remoteUserIDs = new Array();
        this.tele.addEventListener("participantJoined", (evt) => {
            arraySortedInsert(this.remoteUserIDs, evt.id, false);
        });
        this.tele.addEventListener("participantLeft", (evt) => {
            arrayRemove(this.remoteUserIDs, evt.id);
        });
    }
    get metadataState() {
        return this._status;
    }
    async connect() {
        // JitsiTeleconferenceClient will already connect
    }
    async join(_roomName) {
        // JitsiTeleconferenceClient will already join
        this._status = ConnectionState.Connecting;
        this.tele.conference.addEventListener(JitsiMeetJS.events.conference.ENDPOINT_MESSAGE_RECEIVED, (user, data) => {
            if (data.hax === JITSI_HAX_FINGERPRINT) {
                const fromUserID = user.getId();
                const command = data.command;
                const values = data.values;
                switch (command) {
                    case "avatarChanged":
                        this.dispatchEvent(new CallaAvatarChangedEvent(fromUserID, values[0]));
                        break;
                    case "emote":
                        this.dispatchEvent(new CallaEmoteEvent(fromUserID, values[0]));
                        break;
                    case "setAvatarEmoji":
                    case "tellAvatarEmoji":
                        this.dispatchEvent(new CallaEmojiAvatarEvent(fromUserID, values[0]));
                        break;
                    case "userPosed":
                        this.dispatchEvent(new CallaUserPosedEvent(fromUserID, values[0], values[1], values[2], values[3], values[4], values[5], values[6], values[7], values[8]));
                        break;
                    case "userPointer":
                        this.dispatchEvent(new CallaUserPointerEvent(fromUserID, values[0], values[1], values[2], values[3], values[4], values[5], values[6], values[7], values[8], values[9]));
                        break;
                    case "chat":
                        this.dispatchEvent(new CallaChatEvent(fromUserID, values[0]));
                        break;
                    default:
                        assertNever(command);
                }
            }
        });
        await sleep(250);
        this._status = ConnectionState.Connected;
    }
    async leave() {
        // JitsiTeleconferenceClient will already leave
        this._status = ConnectionState.Disconnected;
    }
    async identify(_userName) {
        // JitsiTeleconferenceClient will already identify the user
    }
    async disconnect() {
        // JitsiTeleconferenceClient will already disconnect
    }
    async callInternal(command, ...values) {
        const tasks = [];
        for (const toUserID of this.remoteUserIDs) {
            tasks.push(this.callInternalSingle(toUserID, command, values));
        }
        await Promise.all(tasks);
    }
    callInternalSingle(toUserID, command, values) {
        this.sendJitsiHax(toUserID, command, ...values);
        return Promise.resolve();
    }
    sendJitsiHax(toUserID, command, ...values) {
        this.tele.conference.sendMessage({
            hax: JITSI_HAX_FINGERPRINT,
            command,
            values
        }, toUserID);
    }
    async stopInternal() {
        this._status = ConnectionState.Disconnecting;
        await waitFor(() => this.metadataState === ConnectionState.Disconnected);
    }
}
//# sourceMappingURL=JitsiMetadataClient.js.map