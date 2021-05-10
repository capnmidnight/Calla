import { arrayRemove } from "kudzu/arrays/arrayRemove";
import { arraySortedInsert } from "kudzu/arrays/arraySortedInsert";
import { sleep } from "kudzu/events/sleep";
import { waitFor } from "kudzu/events/waitFor";
import { assertNever } from "kudzu/typeChecks";
import {
    CallaAvatarChangedEvent,
    CallaChatEvent,
    CallaEmojiAvatarEvent,
    CallaEmoteEvent,
    CallaEventType,
    CallaMetadataEventType,
    CallaParticipantJoinedEvent,
    CallaParticipantLeftEvent,
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

export class JitsiMetadataClient
    extends BaseMetadataClient {
    private _status = ConnectionState.Disconnected;
    private remoteUserIDs = new Array<string>();

    constructor(private tele: JitsiTeleconferenceClient) {
        super(250);

        this.tele.addEventListener("participantJoined", (evt: CallaParticipantJoinedEvent) => {
            arraySortedInsert(this.remoteUserIDs, evt.id, false);
        });

        this.tele.addEventListener("participantLeft", (evt: CallaParticipantLeftEvent) => {
            arrayRemove(this.remoteUserIDs, evt.id);
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

    protected async callInternal(command: CallaEventType, ...values: any[]): Promise<void> {
        const tasks = [];
        for (const toUserID of this.remoteUserIDs) {
            tasks.push(this.callInternalSingle(toUserID, command, values));
        }

        await Promise.all(tasks);
    }

    protected callInternalSingle(toUserID: string, command: CallaEventType, values: any[]): Promise<void> {
        this.sendJitsiHax(toUserID, command, ...values);
        return Promise.resolve();
    }

    private sendJitsiHax(toUserID: string, command: CallaEventType, ...values: any[]): void {
        this.tele.conference.sendMessage({
            hax: JITSI_HAX_FINGERPRINT,
            command,
            values
        }, toUserID);
    }

    protected async stopInternal(): Promise<void> {
        this._status = ConnectionState.Disconnecting;
        await waitFor(() => this.metadataState === ConnectionState.Disconnected);
    }
}
