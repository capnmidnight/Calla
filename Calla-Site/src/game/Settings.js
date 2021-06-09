import { TypedEventBase } from "kudzu/events/EventBase";
import { isString } from "kudzu/typeChecks";
const KEY = "CallaSettings";
export class InputBindingChangedEvent extends Event {
    constructor() {
        super("inputBindingChanged");
    }
}
const inputBindingChangedEvt = new InputBindingChangedEvent();
export class InputBinding extends TypedEventBase {
    bindings;
    constructor() {
        super();
        this.bindings = new Map([
            ["keyButtonUp", "ArrowUp"],
            ["keyButtonDown", "ArrowDown"],
            ["keyButtonLeft", "ArrowLeft"],
            ["keyButtonRight", "ArrowRight"],
            ["keyButtonEmote", "e"],
            ["keyButtonToggleAudio", "a"],
            ["keyButtonZoomOut", "["],
            ["keyButtonZoomIn", "]"],
            ["gpAxisLeftRight", 0],
            ["gpAxisUpDown", 1],
            ["gpButtonEmote", 0],
            ["gpButtonToggleAudio", 1],
            ["gpButtonZoomIn", 6],
            ["gpButtonZoomOut", 7],
            ["gpButtonUp", 12],
            ["gpButtonDown", 13],
            ["gpButtonLeft", 14],
            ["gpButtonRight", 15]
        ]);
        for (let id of this.bindings.keys()) {
            Object.defineProperty(this, id, {
                get: () => this.bindings.get(id),
                set: (v) => {
                    if (this.bindings.has(id)
                        && v !== this.bindings.get(id)) {
                        this.bindings.set(id, v);
                        this.dispatchEvent(inputBindingChangedEvt);
                    }
                }
            });
        }
        Object.freeze(this);
    }
    get(key) {
        return this.bindings.get(key);
    }
    set(key, value) {
        this.bindings.set(key, value);
    }
    get keyButtonUp() { return this.bindings.get("keyButtonUp"); }
    set keyButtonUp(v) { this.checkedSet("keyButtonUp", v); }
    get keyButtonDown() { return this.bindings.get("keyButtonDown"); }
    set keyButtonDown(v) { this.checkedSet("keyButtonDown", v); }
    get keyButtonLeft() { return this.bindings.get("keyButtonLeft"); }
    set keyButtonLeft(v) { this.checkedSet("keyButtonLeft", v); }
    get keyButtonRight() { return this.bindings.get("keyButtonRight"); }
    set keyButtonRight(v) { this.checkedSet("keyButtonRight", v); }
    get keyButtonEmote() { return this.bindings.get("keyButtonEmote"); }
    set keyButtonEmote(v) { this.checkedSet("keyButtonEmote", v); }
    get keyButtonToggleAudio() { return this.bindings.get("keyButtonToggleAudio"); }
    set keyButtonToggleAudio(v) { this.checkedSet("keyButtonToggleAudio", v); }
    get keyButtonZoomOut() { return this.bindings.get("keyButtonZoomOut"); }
    set keyButtonZoomOut(v) { this.checkedSet("keyButtonZoomOut", v); }
    get keyButtonZoomIn() { return this.bindings.get("keyButtonZoomIn"); }
    set keyButtonZoomIn(v) { this.checkedSet("keyButtonZoomIn", v); }
    get gpAxisLeftRight() { return this.bindings.get("gpAxisLeftRight"); }
    set gpAxisLeftRight(v) { this.checkedSet("gpAxisLeftRight", v); }
    get gpAxisUpDown() { return this.bindings.get("gpAxisUpDown"); }
    set gpAxisUpDown(v) { this.checkedSet("gpAxisUpDown", v); }
    get gpButtonEmote() { return this.bindings.get("gpButtonEmote"); }
    set gpButtonEmote(v) { this.checkedSet("gpButtonEmote", v); }
    get gpButtonToggleAudio() { return this.bindings.get("gpButtonToggleAudio"); }
    set gpButtonToggleAudio(v) { this.checkedSet("gpButtonToggleAudio", v); }
    get gpButtonZoomIn() { return this.bindings.get("gpButtonZoomIn"); }
    set gpButtonZoomIn(v) { this.checkedSet("gpButtonZoomIn", v); }
    get gpButtonZoomOut() { return this.bindings.get("gpButtonZoomOut"); }
    set gpButtonZoomOut(v) { this.checkedSet("gpButtonZoomOut", v); }
    get gpButtonUp() { return this.bindings.get("gpButtonUp"); }
    set gpButtonUp(v) { this.checkedSet("gpButtonUp", v); }
    get gpButtonDown() { return this.bindings.get("gpButtonDown"); }
    set gpButtonDown(v) { this.checkedSet("gpButtonDown", v); }
    get gpButtonLeft() { return this.bindings.get("gpButtonLeft"); }
    set gpButtonLeft(v) { this.checkedSet("gpButtonLeft", v); }
    get gpButtonRight() { return this.bindings.get("gpButtonRight"); }
    set gpButtonRight(v) { this.checkedSet("gpButtonRight", v); }
    checkedSet(key, v) {
        if (this.bindings.has(key)
            && v !== this.bindings.get(key)) {
            this.bindings.set(key, v);
            this.dispatchEvent(inputBindingChangedEvt);
        }
    }
    toJSON() {
        return {
            keyButtonUp: this.keyButtonUp,
            keyButtonDown: this.keyButtonDown,
            keyButtonLeft: this.keyButtonLeft,
            keyButtonRight: this.keyButtonRight,
            keyButtonEmote: this.keyButtonEmote,
            keyButtonToggleAudio: this.keyButtonToggleAudio,
            keyButtonZoomOut: this.keyButtonZoomOut,
            keyButtonZoomIn: this.keyButtonZoomIn,
            gpAxisLeftRight: this.gpAxisLeftRight,
            gpAxisUpDown: this.gpAxisUpDown,
            gpButtonEmote: this.gpButtonEmote,
            gpButtonToggleAudio: this.gpButtonToggleAudio,
            gpButtonZoomIn: this.gpButtonZoomIn,
            gpButtonZoomOut: this.gpButtonZoomOut,
            gpButtonUp: this.gpButtonUp,
            gpButtonDown: this.gpButtonDown,
            gpButtonLeft: this.gpButtonLeft,
            gpButtonRight: this.gpButtonRight
        };
    }
    copy(obj) {
        if (obj) {
            this.keyButtonUp = obj.keyButtonUp;
            this.keyButtonDown = obj.keyButtonDown;
            this.keyButtonLeft = obj.keyButtonLeft;
            this.keyButtonRight = obj.keyButtonRight;
            this.keyButtonEmote = obj.keyButtonEmote;
            this.keyButtonToggleAudio = obj.keyButtonToggleAudio;
            this.keyButtonZoomOut = obj.keyButtonZoomOut;
            this.keyButtonZoomIn = obj.keyButtonZoomIn;
            this.gpAxisLeftRight = obj.gpAxisLeftRight;
            this.gpAxisUpDown = obj.gpAxisUpDown;
            this.gpButtonEmote = obj.gpButtonEmote;
            this.gpButtonToggleAudio = obj.gpButtonToggleAudio;
            this.gpButtonZoomIn = obj.gpButtonZoomIn;
            this.gpButtonZoomOut = obj.gpButtonZoomOut;
            this.gpButtonUp = obj.gpButtonUp;
            this.gpButtonDown = obj.gpButtonDown;
            this.gpButtonLeft = obj.gpButtonLeft;
            this.gpButtonRight = obj.gpButtonRight;
        }
    }
    fix(obj) {
        if (!this.bindings.has("keyButtonUp")) {
            this.keyButtonUp = obj.keyButtonUp;
        }
        ;
        if (!this.bindings.has("keyButtonDown")) {
            this.keyButtonDown = obj.keyButtonDown;
        }
        ;
        if (!this.bindings.has("keyButtonLeft")) {
            this.keyButtonLeft = obj.keyButtonLeft;
        }
        ;
        if (!this.bindings.has("keyButtonRight")) {
            this.keyButtonRight = obj.keyButtonRight;
        }
        ;
        if (!this.bindings.has("keyButtonEmote")) {
            this.keyButtonEmote = obj.keyButtonEmote;
        }
        ;
        if (!this.bindings.has("keyButtonToggleAudio")) {
            this.keyButtonToggleAudio = obj.keyButtonToggleAudio;
        }
        ;
        if (!this.bindings.has("keyButtonZoomOut")) {
            this.keyButtonZoomOut = obj.keyButtonZoomOut;
        }
        ;
        if (!this.bindings.has("keyButtonZoomIn")) {
            this.keyButtonZoomIn = obj.keyButtonZoomIn;
        }
        ;
        if (!this.bindings.has("gpAxisLeftRight")) {
            this.gpAxisLeftRight = obj.gpAxisLeftRight;
        }
        ;
        if (!this.bindings.has("gpAxisUpDown")) {
            this.gpAxisUpDown = obj.gpAxisUpDown;
        }
        ;
        if (!this.bindings.has("gpButtonEmote")) {
            this.gpButtonEmote = obj.gpButtonEmote;
        }
        ;
        if (!this.bindings.has("gpButtonToggleAudio")) {
            this.gpButtonToggleAudio = obj.gpButtonToggleAudio;
        }
        ;
        if (!this.bindings.has("gpButtonZoomIn")) {
            this.gpButtonZoomIn = obj.gpButtonZoomIn;
        }
        ;
        if (!this.bindings.has("gpButtonZoomOut")) {
            this.gpButtonZoomOut = obj.gpButtonZoomOut;
        }
        ;
        if (!this.bindings.has("gpButtonUp")) {
            this.gpButtonUp = obj.gpButtonUp;
        }
        ;
        if (!this.bindings.has("gpButtonDown")) {
            this.gpButtonDown = obj.gpButtonDown;
        }
        ;
        if (!this.bindings.has("gpButtonLeft")) {
            this.gpButtonLeft = obj.gpButtonLeft;
        }
        ;
        if (!this.bindings.has("gpButtonRight")) {
            this.gpButtonRight = obj.gpButtonRight;
        }
        ;
    }
}
const DEFAULT_INPUT_BINDING = Object.freeze({
    keyButtonUp: "ArrowUp",
    keyButtonDown: "ArrowDown",
    keyButtonLeft: "ArrowLeft",
    keyButtonRight: "ArrowRight",
    keyButtonEmote: "e",
    keyButtonToggleAudio: "a",
    keyButtonZoomOut: "[",
    keyButtonZoomIn: "]",
    gpAxisLeftRight: 0,
    gpAxisUpDown: 1,
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
    _drawHearing = false;
    _audioDistanceMin = 1;
    _audioDistanceMax = 10;
    _audioRolloff = 1;
    _fontSize = 12;
    _transitionSpeed = 1;
    _zoom = 1.5;
    _roomName = "calla";
    _userName = "";
    _email = "";
    _avatarEmoji = null;
    _avatarURL = null;
    _gamepadIndex = 0;
    _inputBinding = new InputBinding();
    _preferredAudioOutputID = null;
    _preferredAudioInputID = null;
    _preferredVideoInputID = null;
    constructor() {
        const thisStr = localStorage.getItem(KEY);
        if (thisStr) {
            const obj = JSON.parse(thisStr);
            const inputBindings = obj._inputBinding;
            delete obj._inputBinding;
            Object.assign(this, obj);
            if (this._avatarEmoji
                && !isString(this._avatarEmoji)) {
                if ("value" in this._avatarEmoji) {
                    this._avatarEmoji = this._avatarEmoji.value;
                }
                else {
                    this._avatarEmoji = null;
                }
            }
            this.inputBinding = inputBindings;
        }
        this._inputBinding.fix(DEFAULT_INPUT_BINDING);
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
        return this._inputBinding.toJSON();
    }
    set inputBinding(value) {
        let hasChanged = false;
        this._inputBinding.addEventListener("inputBindingChanged", (_) => hasChanged = true, { once: true });
        this._inputBinding.copy(value);
        if (hasChanged) {
            this.commit();
        }
    }
}
//# sourceMappingURL=Settings.js.map