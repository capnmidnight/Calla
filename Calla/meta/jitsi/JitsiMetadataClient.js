import { arrayRemove } from "kudzu/arrays/arrayRemove";
import { arraySortedInsert } from "kudzu/arrays/arraySortedInsert";
import { Logger } from "kudzu/debugging/Logger";
import { waitFor } from "kudzu/events/waitFor";
import { assertNever } from "kudzu/typeChecks";
import { CallaChatEvent, CallaEmojiAvatarEvent, CallaEmoteEvent, CallaPhotoAvatarEvent, CallaUserPointerEvent, CallaUserPosedEvent } from "../../CallaEvents";
import { ConnectionState } from "../../ConnectionState";
import { BaseMetadataClient } from "../BaseMetadataClient";
const JITSI_HAX_FINGERPRINT = "Calla";
const logger = new Logger();
export class JitsiMetadataClient extends BaseMetadataClient {
    tele;
    _status = ConnectionState.Disconnected;
    remoteUserIDs = new Array();
    constructor(tele) {
        super();
        this.tele = tele;
        this.tele.addEventListener("participantJoined", (evt) => {
            arraySortedInsert(this.remoteUserIDs, evt.userID, false);
        });
        this.tele.addEventListener("participantLeft", (evt) => {
            arrayRemove(this.remoteUserIDs, evt.userID);
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
                    case "emote":
                        this.dispatchEvent(new CallaEmoteEvent(fromUserID, values[0]));
                        break;
                    case "setAvatarEmoji":
                        this.dispatchEvent(new CallaEmojiAvatarEvent(fromUserID, values[0]));
                        break;
                    case "setAvatarURL":
                        this.dispatchEvent(new CallaPhotoAvatarEvent(fromUserID, values[0]));
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
                    case "info":
                    case "error":
                        // not used here
                        break;
                    default:
                        assertNever(command);
                }
            }
        });
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
    toRoom(command, ...values) {
        logger.log(`callInternal:${command}`, ...values);
        this.tele.conference.broadcastEndpointMessage({
            hax: JITSI_HAX_FINGERPRINT,
            command,
            values
        });
        return Promise.resolve();
    }
    toUser(command, toUserID, ...values) {
        logger.log(`callInternal:${toUserID}:${command}`, ...values);
        this.tele.conference.sendMessage({
            hax: JITSI_HAX_FINGERPRINT,
            command,
            values
        }, toUserID);
        return Promise.resolve();
    }
    setLocalPose(px, py, pz, fx, fy, fz, ux, uy, uz) {
        this.toRoom("userPosed", px, py, pz, fx, fy, fz, ux, uy, uz);
    }
    tellLocalPose(toUserID, px, py, pz, fx, fy, fz, ux, uy, uz) {
        this.toUser("userPosedSingle", toUserID, px, py, pz, fx, fy, fz, ux, uy, uz);
    }
    setLocalPointer(name, px, py, pz, fx, fy, fz, ux, uy, uz) {
        this.toRoom("userPointer", name, px, py, pz, fx, fy, fz, ux, uy, uz);
    }
    setAvatarEmoji(toUserID, emoji) {
        this.toUser("setAvatarEmoji", toUserID, emoji);
    }
    setAvatarURL(toUserID, url) {
        this.toUser("setAvatarURL", toUserID, url);
    }
    emote(emoji) {
        this.toRoom("emote", emoji);
    }
    chat(text) {
        this.toRoom("chat", text);
    }
    async stopInternal() {
        this._status = ConnectionState.Disconnecting;
        await waitFor(() => this.metadataState === ConnectionState.Disconnected);
    }
}
//# sourceMappingURL=JitsiMetadataClient.js.map