import type { ErsatzEventTarget } from "kudzu/events/ErsatzEventTarget";
import { TypedEventBase } from "kudzu/events/EventBase";
import type { IFetcher } from "kudzu/io/IFetcher";
import { AudioManager } from "../audio/AudioManager";
import type { CallaTeleconferenceEvents } from "../CallaEvents";
import { CallaUserEvent } from "../CallaEvents";
import { ConnectionState } from "../ConnectionState";
import type { DeviceManagerInputsChangedEvent } from "../devices/DeviceManager";
import { DeviceManager } from "../devices/DeviceManager";
import type { ITeleconferenceClientExt } from "./ITeleconferenceClient";

export function addLogger(obj: ErsatzEventTarget, evtName: string): void {
    obj.addEventListener(evtName, (...rest: any[]) => {
        if (loggingEnabled) {
            console.log(">== CALLA ==<", evtName, ...rest);
        }
    });
}

export const DEFAULT_LOCAL_USER_ID = "local-user";

let loggingEnabled = window.location.hostname === "localhost"
    || /\bdebug\b/.test(window.location.search);

export abstract class BaseTeleconferenceClient
    extends TypedEventBase<CallaTeleconferenceEvents>
    implements ITeleconferenceClientExt {

    toggleLogging() {
        loggingEnabled = !loggingEnabled;
    }

    localUserID: string = null;
    localUserName: string = null;
    roomName: string = null;

    protected fetcher: IFetcher;

    private _connectionState = ConnectionState.Disconnected;
    private _conferenceState = ConnectionState.Disconnected;

    hasAudioPermission = false;
    hasVideoPermission = false;

    get connectionState(): ConnectionState {
        return this._connectionState;
    }

    get isConnected(): boolean {
        return this.connectionState === ConnectionState.Connected;
    }

    private setConnectionState(state: ConnectionState): void {
        this._connectionState = state;
    }

    get conferenceState(): ConnectionState {
        return this._conferenceState;
    }

    get isConferenced(): boolean {
        return this.conferenceState === ConnectionState.Connected;
    }

    private setConferenceState(state: ConnectionState): void {
        this._conferenceState = state;
    }

    constructor(fetcher: IFetcher, private _audio: AudioManager, public needsVideoDevice = false) {
        super();

        this.fetcher = fetcher;

        this.devices.addEventListener("inputschanged", this.onInputsChanged.bind(this));

        this.addEventListener("serverConnected", this.setConnectionState.bind(this, ConnectionState.Connected));
        this.addEventListener("serverFailed", this.setConnectionState.bind(this, ConnectionState.Disconnected));
        this.addEventListener("serverDisconnected", this.setConnectionState.bind(this, ConnectionState.Disconnected));

        this.addEventListener("conferenceJoined", this.setConferenceState.bind(this, ConnectionState.Connected));
        this.addEventListener("conferenceFailed", this.setConferenceState.bind(this, ConnectionState.Disconnected));
        this.addEventListener("conferenceRestored", this.setConferenceState.bind(this, ConnectionState.Connected));
        this.addEventListener("conferenceLeft", this.setConferenceState.bind(this, ConnectionState.Disconnected));
    }

    get audio(): AudioManager {
        return this._audio;
    }

    get devices(): DeviceManager {
        return this._audio.devices;
    }

    protected onDispatching<T extends Event>(evt: T) {
        if (evt instanceof CallaUserEvent
            && (evt.userID == null
                || evt.userID === "local")) {
            if (this.localUserID === DEFAULT_LOCAL_USER_ID) {
                evt.userID = null;
            }
            else {
                evt.userID = this.localUserID;
            }
        }
    }

    async getNext<T extends keyof CallaTeleconferenceEvents>(evtName: T, userID: string): Promise<CallaTeleconferenceEvents[T]> {
        return new Promise((resolve) => {
            const getter = (evt: CallaTeleconferenceEvents[T]) => {
                if (evt instanceof CallaUserEvent
                    && evt.userID === userID) {
                    this.removeEventListener(evtName, getter);
                    resolve(evt);
                }
            };

            this.addEventListener(evtName, getter);
        });
    }

    async connect(): Promise<void> {
        this.setConnectionState(ConnectionState.Connecting);
    }

    async join(_roomName: string, _enableTeleconference: boolean): Promise<void> {
        this.setConferenceState(ConnectionState.Connecting);
    }

    async leave(): Promise<void> {
        this.setConferenceState(ConnectionState.Disconnecting);
    }

    async disconnect(): Promise<void> {
        this.setConnectionState(ConnectionState.Disconnecting);
    }

    abstract userExists(id: string): boolean;
    abstract getUserNames(): string[][];
    abstract identify(userNameOrID: string): Promise<void>;
    protected abstract onInputsChanged(evt: DeviceManagerInputsChangedEvent): Promise<void>;
    abstract toggleAudioMuted(): Promise<boolean>;
    abstract toggleVideoMuted(): Promise<boolean>;
    abstract getAudioMuted(): Promise<boolean>;
    abstract getVideoMuted(): Promise<boolean>;
}
