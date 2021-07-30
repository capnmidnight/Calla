import { arrayRemove } from "kudzu/arrays/arrayRemove";
import { arraySortedInsert } from "kudzu/arrays/arraySortedInsert";
import { Logger } from "kudzu/debugging/Logger";
import { waitFor } from "kudzu/events/waitFor";
import { assertNever } from "kudzu/typeChecks";
import {
    CallaChatEvent,
    CallaEmojiAvatarEvent,
    CallaEmoteEvent,
    CallaMetadataEventType,
    CallaParticipantJoinedEvent,
    CallaParticipantLeftEvent,
    CallaPhotoAvatarEvent,
    CallaUserPointerEvent,
    CallaUserPosedEvent
} from "../../CallaEvents";
import { ConnectionState } from "../../ConnectionState";
import type JitsiParticipant from "../../lib-jitsi-meet/JitsiParticipant";
import type { JitsiTeleconferenceClient } from "../../tele/jitsi/JitsiTeleconferenceClient";
import { BaseMetadataClient } from "../BaseMetadataClient";

export interface JitsiHaxCommand {
    hax: string,
    command: CallaMetadataEventType,
    values: any[];
}

const JITSI_HAX_FINGERPRINT = "Calla";
const logger = new Logger();

export class JitsiMetadataClient
    extends BaseMetadataClient {
    private _status = ConnectionState.Disconnected;
    private remoteUserIDs = new Array<string>();

    constructor(private tele: JitsiTeleconferenceClient) {
        super();

        this.tele.addEventListener("participantJoined", (evt: CallaParticipantJoinedEvent) => {
            arraySortedInsert(this.remoteUserIDs, evt.userID, false);
        });

        this.tele.addEventListener("participantLeft", (evt: CallaParticipantLeftEvent) => {
            arrayRemove(this.remoteUserIDs, evt.userID);
        });
    }

    get metadataState(): ConnectionState {
        return this._status;
    }

    async connect(): Promise<void> {
        // JitsiTeleconferenceClient will already connect
    }

    async join(_roomName: string): Promise<void> {
        // JitsiTeleconferenceClient will already join
        this._status = ConnectionState.Connecting;
        this.tele.conference.addEventListener(JitsiMeetJS.events.conference.ENDPOINT_MESSAGE_RECEIVED, (user: JitsiParticipant, data: JitsiHaxCommand) => {
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

    async leave(): Promise<void> {
        // JitsiTeleconferenceClient will already leave
        this._status = ConnectionState.Disconnected;
    }

    async identify(_userName: string): Promise<void> {
        // JitsiTeleconferenceClient will already identify the user
    }

    async disconnect(): Promise<void> {
        // JitsiTeleconferenceClient will already disconnect
    }

    private toRoom(command: string, ...values: any[]): Promise<void> {
        logger.log(`callInternal:${command}`, ...values);
        this.tele.conference.broadcastEndpointMessage({
            hax: JITSI_HAX_FINGERPRINT,
            command,
            values
        });
        return Promise.resolve();
    }

    private toUser(command: string, toUserID: string, ...values: any[]): Promise<void> {
        logger.log(`callInternal:${toUserID}:${command}`, ...values);
        this.tele.conference.sendMessage({
            hax: JITSI_HAX_FINGERPRINT,
            command,
            values
        }, toUserID);
        return Promise.resolve();
    }

    setLocalPose(px: number, py: number, pz: number, fx: number, fy: number, fz: number, ux: number, uy: number, uz: number): void {
        this.toRoom("userPosed", px, py, pz, fx, fy, fz, ux, uy, uz);
    }

    tellLocalPose(toUserID: string, px: number, py: number, pz: number, fx: number, fy: number, fz: number, ux: number, uy: number, uz: number): void {
        this.toUser("userPosedSingle", toUserID, px, py, pz, fx, fy, fz, ux, uy, uz);
    }

    setLocalPointer(name: string, px: number, py: number, pz: number, fx: number, fy: number, fz: number, ux: number, uy: number, uz: number): void {
        this.toRoom("userPointer", name, px, py, pz, fx, fy, fz, ux, uy, uz);
    }

    setAvatarEmoji(toUserID: string, emoji: string): void {
        this.toUser("setAvatarEmoji", toUserID, emoji);
    }

    setAvatarURL(toUserID: string, url: string): void {
        this.toUser("setAvatarURL", toUserID, url);
    }

    emote(emoji: string): void {
        this.toRoom("emote", emoji);
    }

    chat(text: string): void {
        this.toRoom("chat", text);
    }

    protected async stopInternal(): Promise<void> {
        this._status = ConnectionState.Disconnecting;
        await waitFor(() => this.metadataState === ConnectionState.Disconnected);
    }
}
