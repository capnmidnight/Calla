import { HubConnectionState } from "@microsoft/signalr";
import { arrayRemove, arraySortedInsert, once, waitFor } from "kudzu";
import { BaseMetadataClient } from "./BaseMetadataClient";
import type {
    CallaEventType,
    CallaParticipantJoinedEvent,
    CallaParticipantLeftEvent
} from "./CallaEvents";
import {
    CallaAvatarChangedEvent,
    CallaChatEvent,
    CallaEmojiAvatarEvent,
    CallaEmoteEvent,
    CallaMetadataEventType,
    CallaTeleconferenceEventType,
    CallaUserPointerEvent,
    CallaUserPosedEvent
} from "./CallaEvents";
import type { JitsiTeleconferenceClient } from "./JitsiTeleconferenceClient";
import type JitsiParticipant from "./lib-jitsi-meet/JitsiParticipant";

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
        await this.tele.connect();
    }

    async join(roomName: string): Promise<void> {
        this._status = HubConnectionState.Connecting;
        const joinTask = await once(this.tele.conference, JitsiMeetJS.events.conference.DATA_CHANNEL_OPENED);
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
        await this.tele.join(roomName);
        await joinTask;
        this._status = HubConnectionState.Connected;
    }

    async leave(): Promise<void> {
        this._status = HubConnectionState.Disconnecting;
        await this.tele.leave();
        this._status = HubConnectionState.Disconnected;
    }

    async identify(userName: string): Promise<void> {
        await this.tele.identify(userName);
    }

    async disconnect(): Promise<void> {
        await this.tele.disconnect();
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
