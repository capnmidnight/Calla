import { HubConnectionState } from "@microsoft/signalr";
import { arrayRemove, arraySortedInsert, once, waitFor } from "kudzu";
import {
    CallaAvatarChangedEvent,
    CallaChatEvent,
    CallaEmojiAvatarEvent,
    CallaEmoteEvent,
    CallaEventType,
    CallaMetadataEventType,
    CallaParticipantJoinedEvent,
    CallaParticipantLeftEvent,
    CallaTeleconferenceEventType,
    CallaUserPointerEvent,
    CallaUserPosedEvent
} from "../../CallaEvents";
import type JitsiParticipant from "../../lib-jitsi-meet/JitsiParticipant";
import type { JitsiTeleconferenceClient } from "../../tele/jitsi/JitsiTeleconferenceClient";
import { BaseMetadataClient } from "../BaseMetadataClient";

export interface JitsiHaxCommand {
    hax: string,
    command: CallaEventType,
    values: any[];
}

const JITSI_HAX_FINGERPRINT = "Calla";

export class JitsiMetadataClient
    extends BaseMetadataClient {
    private _status = HubConnectionState.Disconnected;
    private remoteUserIDs = new Array<string>();

    constructor(private tele: JitsiTeleconferenceClient) {
        super(250);

        this.tele.addEventListener(CallaTeleconferenceEventType.ParticipantJoined, (evt: CallaParticipantJoinedEvent) => {
            arraySortedInsert(this.remoteUserIDs, evt.id, false);
        });

        this.tele.addEventListener(CallaTeleconferenceEventType.ParticipantLeft, (evt: CallaParticipantLeftEvent) => {
            arrayRemove(this.remoteUserIDs, evt.id);
        });
    }

    get metadataState(): HubConnectionState {
        return this._status;
    }

    async connect(): Promise<void> {
        // JitsiTeleconferenceClient will already connect
    }

    async join(_roomName: string): Promise<void> {
        // JitsiTeleconferenceClient will already join
        this._status = HubConnectionState.Connecting;
        this.tele.conference.addEventListener(JitsiMeetJS.events.conference.ENDPOINT_MESSAGE_RECEIVED, (user: JitsiParticipant, data: JitsiHaxCommand) => {
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

        await once(this.tele.conference, JitsiMeetJS.events.conference.DATA_CHANNEL_OPENED);
        this._status = HubConnectionState.Connected;
    }

    async leave(): Promise<void> {
        // JitsiTeleconferenceClient will already leave
        this._status = HubConnectionState.Disconnected;
    }

    async identify(_userName: string): Promise<void> {
        // JitsiTeleconferenceClient will already identify the user
    }

    async disconnect(): Promise<void> {
        // JitsiTeleconferenceClient will already disconnect
    }

    private sendJitsiHax(toUserID: string, command: CallaEventType, ...values: any[]): void {
        this.tele.conference.sendMessage({
            hax: JITSI_HAX_FINGERPRINT,
            command,
            values
        }, toUserID);
    }

    protected callInternal(command: CallaEventType, ...values: any[]): Promise<void> {
        for (const toUserID of this.remoteUserIDs) {
            this.sendJitsiHax(toUserID, command, ...values);
        }

        return Promise.resolve();
    }

    protected async stopInternal(): Promise<void> {
        this._status = HubConnectionState.Disconnecting;
        await waitFor(() => this.metadataState === HubConnectionState.Disconnected);
    }
}
