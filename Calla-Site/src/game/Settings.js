import { isNullOrUndefined } from "kudzu/typeChecks";
const KEY = "CallaSettings";
const DEFAULT_INPUT_BINDING = Object.freeze({
    keyButtonUp: "ArrowUp",
    keyButtonDown: "ArrowDown",
    keyButtonLeft: "ArrowLeft",
    keyButtonRight: "ArrowRight",
    keyButtonEmote: "e",
    keyButtonToggleAudio: "a",
    keyButtonZoomOut: "[",
    keyButtonZoomIn: "]",
    gpButtonEmote: 0,
    gpButtonToggleAudio: 1,
    gpButtonZoomIn: 6,
    gpButtonZoomOut: 7,
    gpButtonUp: 12,
    gpButtonDown: 13,
    gpButtonLeft: 14,
    gpButtonRight: 15
});
export class Settings {
    constructor() {
        this._drawHearing = false;
        this._audioDistanceMin = 1;
        this._audioDistanceMax = 10;
        this._audioRolloff = 1;
        this._fontSize = 12;
        this._transitionSpeed = 1;
        this._zoom = 1.5;
        this._roomName = "calla";
        this._userName = "";
        this._email = "";
        this._avatarEmoji = null;
        this._avatarURL = null;
        this._gamepadIndex = 0;
        this._preferredAudioOutputID = null;
        this._preferredAudioInputID = null;
        this._preferredVideoInputID = null;
        this._inputBinding = null;
        this.inputBinding = DEFAULT_INPUT_BINDING;
        const thisStr = localStorage.getItem(KEY);
        if (thisStr) {
            Object.assign(this, JSON.parse(thisStr));
        }
        for (const key in DEFAULT_INPUT_BINDING) {
            if (isNullOrUndefined(this._inputBinding[key])) {
                this._inputBinding[key] = DEFAULT_INPUT_BINDING[key];
            }
        }
        if (window.location.hash.length > 0) {
            this.roomName = window.location.hash.substring(1);
        }
        Object.seal(this);
    }
    commit() {
        localStorage.setItem(KEY, JSON.stringify(this));
    }
    get preferredAudioOutputID() {
        return this._preferredAudioOutputID;
    }
    set preferredAudioOutputID(value) {
        if (value !== this.preferredAudioOutputID) {
            this._preferredAudioOutputID = value;
            this.commit();
        }
    }
    get preferredAudioInputID() {
        return this._preferredAudioInputID;
    }
    set preferredAudioInputID(value) {
        if (value !== this.preferredAudioInputID) {
            this._preferredAudioInputID = value;
            this.commit();
        }
    }
    get preferredVideoInputID() {
        return this._preferredVideoInputID;
    }
    set preferredVideoInputID(value) {
        if (value !== this.preferredVideoInputID) {
            this._preferredVideoInputID = value;
            this.commit();
        }
    }
    get transitionSpeed() {
        return this._transitionSpeed;
    }
    set transitionSpeed(value) {
        if (value !== this.transitionSpeed) {
            this._transitionSpeed = value;
            this.commit();
        }
    }
    get drawHearing() {
        return this._drawHearing;
    }
    set drawHearing(value) {
        if (value !== this.drawHearing) {
            this._drawHearing = value;
            this.commit();
        }
    }
    get audioDistanceMin() {
        return this._audioDistanceMin;
    }
    set audioDistanceMin(value) {
        if (value !== this.audioDistanceMin) {
            this._audioDistanceMin = value;
            this.commit();
        }
    }
    get audioDistanceMax() {
        return this._audioDistanceMax;
    }
    set audioDistanceMax(value) {
        if (value !== this.audioDistanceMax) {
            this._audioDistanceMax = value;
            this.commit();
        }
    }
    get audioRolloff() {
        return this._audioRolloff;
    }
    set audioRolloff(value) {
        if (value !== this.audioRolloff) {
            this._audioRolloff = value;
            this.commit();
        }
    }
    get fontSize() {
        return this._fontSize;
    }
    set fontSize(value) {
        if (value !== this.fontSize) {
            this._fontSize = value;
            this.commit();
        }
    }
    get zoom() {
        return this._zoom;
    }
    set zoom(value) {
        if (value !== this.zoom) {
            this._zoom = value;
            this.commit();
        }
    }
    get userName() {
        return this._userName;
    }
    set userName(value) {
        if (value !== this.userName) {
            this._userName = value;
            this.commit();
        }
    }
    get email() {
        return this._email;
    }
    set email(value) {
        if (value !== this.email) {
            this._email = value;
            this.commit();
        }
    }
    get avatarEmoji() {
        return this._avatarEmoji;
    }
    set avatarEmoji(value) {
        if (value !== this.avatarEmoji) {
            this._avatarEmoji = value;
            this.commit();
        }
    }
    get avatarURL() {
        return this._avatarURL;
    }
    set avatarURL(value) {
        if (value !== this.avatarURL) {
            this._avatarURL = value;
            this.commit();
        }
    }
    get roomName() {
        return this._roomName;
    }
    set roomName(value) {
        if (value !== this.roomName) {
            this._roomName = value;
            this.commit();
        }
    }
    get gamepadIndex() {
        return this._gamepadIndex;
    }
    set gamepadIndex(value) {
        if (value !== this.gamepadIndex) {
            this._gamepadIndex = value;
            this.commit();
        }
    }
    get inputBinding() {
        return this._inputBinding;
    }
    set inputBinding(value) {
        if (value !== this.inputBinding) {
            for (let key in value) {
                this._inputBinding[key] = value[key];
            }
            this.commit();
        }
    }
}
//# sourceMappingURL=Settings.js.map