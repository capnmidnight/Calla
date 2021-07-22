import { TypedEventBase } from "kudzu/events/EventBase";
import { CallaUserEvent } from "../CallaEvents";
import { ConnectionState } from "../ConnectionState";
export function addLogger(obj, evtName) {
    obj.addEventListener(evtName, (...rest) => {
        if (loggingEnabled) {
            console.log(">== CALLA ==<", evtName, ...rest);
        }
    });
}
export const DEFAULT_LOCAL_USER_ID = "local-user";
let loggingEnabled = window.location.hostname === "localhost"
    || /\bdebug\b/.test(window.location.search);
export class BaseTeleconferenceClient extends TypedEventBase {
    _audio;
    needsVideoDevice;
    toggleLogging() {
        loggingEnabled = !loggingEnabled;
    }
    localUserID = null;
    localUserName = null;
    roomName = null;
    fetcher;
    _connectionState = ConnectionState.Disconnected;
    _conferenceState = ConnectionState.Disconnected;
    hasAudioPermission = false;
    hasVideoPermission = false;
    get connectionState() {
        return this._connectionState;
    }
    setConnectionState(state) {
        this._connectionState = state;
    }
    get conferenceState() {
        return this._conferenceState;
    }
    setConferenceState(state) {
        this._conferenceState = state;
    }
    constructor(fetcher, _audio, needsVideoDevice = false) {
        super();
        this._audio = _audio;
        this.needsVideoDevice = needsVideoDevice;
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
    get audio() {
        return this._audio;
    }
    get devices() {
        return this._audio.devices;
    }
    onDispatching(evt) {
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
    async getNext(evtName, userID) {
        return new Promise((resolve) => {
            const getter = (evt) => {
                if (evt instanceof CallaUserEvent
                    && evt.userID === userID) {
                    this.removeEventListener(evtName, getter);
                    resolve(evt);
                }
            };
            this.addEventListener(evtName, getter);
        });
    }
    async connect() {
        this.setConnectionState(ConnectionState.Connecting);
    }
    async join(_roomName, _enableTeleconference) {
        this.setConferenceState(ConnectionState.Connecting);
    }
    async leave() {
        this.setConferenceState(ConnectionState.Disconnecting);
    }
    async disconnect() {
        this.setConnectionState(ConnectionState.Disconnecting);
    }
}
//# sourceMappingURL=BaseTeleconferenceClient.js.map