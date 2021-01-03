import { TypedEventBase } from "kudzu/events/EventBase";

const KEY = "CallaSettings";

export interface IInputBinding {
    keyButtonUp: string;
    keyButtonDown: string;
    keyButtonLeft: string;
    keyButtonRight: string;
    keyButtonEmote: string;
    keyButtonToggleAudio: string;
    keyButtonZoomOut: string;
    keyButtonZoomIn: string;

    gpAxisLeftRight: number;
    gpAxisUpDown: number;

    gpButtonEmote: number;
    gpButtonToggleAudio: number;
    gpButtonZoomIn: number;
    gpButtonZoomOut: number;
    gpButtonUp: number;
    gpButtonDown: number;
    gpButtonLeft: number;
    gpButtonRight: number;
}

export class InputBindingChangedEvent extends Event {
    constructor() {
        super("inputBindingChanged");
    }
}

interface InputBindingEvents {
    inputBindingChanged: InputBindingChangedEvent;
}

const inputBindingChangedEvt = new InputBindingChangedEvent();

export class InputBinding
    extends TypedEventBase<InputBindingEvents>
    implements IInputBinding {
    private bindings: Map<string, string | number>;

    constructor() {
        super();

        this.bindings = new Map<string, string | number>([
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

    get(key: string) {
        return this.bindings.get(key);
    }

    set(key: string, value: string | number) {
        this.bindings.set(key, value);
    }

    get keyButtonUp(): string { return this.bindings.get("keyButtonUp") as string; }
    set keyButtonUp(v: string) { this.checkedSet("keyButtonUp", v); }

    get keyButtonDown(): string { return this.bindings.get("keyButtonDown") as string; }
    set keyButtonDown(v: string) { this.checkedSet("keyButtonDown", v); }

    get keyButtonLeft(): string { return this.bindings.get("keyButtonLeft") as string; }
    set keyButtonLeft(v: string) { this.checkedSet("keyButtonLeft", v); }

    get keyButtonRight(): string { return this.bindings.get("keyButtonRight") as string; }
    set keyButtonRight(v: string) { this.checkedSet("keyButtonRight", v); }

    get keyButtonEmote(): string { return this.bindings.get("keyButtonEmote") as string; }
    set keyButtonEmote(v: string) { this.checkedSet("keyButtonEmote", v); }

    get keyButtonToggleAudio(): string { return this.bindings.get("keyButtonToggleAudio") as string; }
    set keyButtonToggleAudio(v: string) { this.checkedSet("keyButtonToggleAudio", v); }

    get keyButtonZoomOut(): string { return this.bindings.get("keyButtonZoomOut") as string; }
    set keyButtonZoomOut(v: string) { this.checkedSet("keyButtonZoomOut", v); }

    get keyButtonZoomIn(): string { return this.bindings.get("keyButtonZoomIn") as string; }
    set keyButtonZoomIn(v: string) { this.checkedSet("keyButtonZoomIn", v); }


    get gpAxisLeftRight(): number { return this.bindings.get("gpAxisLeftRight") as number; }
    set gpAxisLeftRight(v: number) { this.checkedSet("gpAxisLeftRight", v); }

    get gpAxisUpDown(): number { return this.bindings.get("gpAxisUpDown") as number; }
    set gpAxisUpDown(v: number) { this.checkedSet("gpAxisUpDown", v); }


    get gpButtonEmote(): number { return this.bindings.get("gpButtonEmote") as number; }
    set gpButtonEmote(v: number) { this.checkedSet("gpButtonEmote", v); }

    get gpButtonToggleAudio(): number { return this.bindings.get("gpButtonToggleAudio") as number; }
    set gpButtonToggleAudio(v: number) { this.checkedSet("gpButtonToggleAudio", v); }

    get gpButtonZoomIn(): number { return this.bindings.get("gpButtonZoomIn") as number; }
    set gpButtonZoomIn(v: number) { this.checkedSet("gpButtonZoomIn", v); }

    get gpButtonZoomOut(): number { return this.bindings.get("gpButtonZoomOut") as number; }
    set gpButtonZoomOut(v: number) { this.checkedSet("gpButtonZoomOut", v); }

    get gpButtonUp(): number { return this.bindings.get("gpButtonUp") as number; }
    set gpButtonUp(v: number) { this.checkedSet("gpButtonUp", v); }

    get gpButtonDown(): number { return this.bindings.get("gpButtonDown") as number; }
    set gpButtonDown(v: number) { this.checkedSet("gpButtonDown", v); }

    get gpButtonLeft(): number { return this.bindings.get("gpButtonLeft") as number; }
    set gpButtonLeft(v: number) { this.checkedSet("gpButtonLeft", v); }

    get gpButtonRight(): number { return this.bindings.get("gpButtonRight") as number; }
    set gpButtonRight(v: number) { this.checkedSet("gpButtonRight", v); }

    private checkedSet(key: string, v: number | string) {
        if (this.bindings.has(key)
            && v !== this.bindings.get(key)) {
            this.bindings.set(key, v);
            this.dispatchEvent(inputBindingChangedEvt);
        }
    }

    toJSON(): IInputBinding {
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

    copy(obj: IInputBinding) {
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

    fix(obj: IInputBinding) {
        if(!this.bindings.has("keyButtonUp")){ this.keyButtonUp = obj.keyButtonUp; };
        if(!this.bindings.has("keyButtonDown")){ this.keyButtonDown = obj.keyButtonDown; };
        if(!this.bindings.has("keyButtonLeft")){ this.keyButtonLeft = obj.keyButtonLeft; };
        if(!this.bindings.has("keyButtonRight")){ this.keyButtonRight = obj.keyButtonRight; };
        if(!this.bindings.has("keyButtonEmote")){ this.keyButtonEmote = obj.keyButtonEmote; };
        if(!this.bindings.has("keyButtonToggleAudio")){ this.keyButtonToggleAudio = obj.keyButtonToggleAudio; };
        if(!this.bindings.has("keyButtonZoomOut")){ this.keyButtonZoomOut = obj.keyButtonZoomOut; };
        if(!this.bindings.has("keyButtonZoomIn")){ this.keyButtonZoomIn = obj.keyButtonZoomIn; };

        if(!this.bindings.has("gpAxisLeftRight")){ this.gpAxisLeftRight = obj.gpAxisLeftRight; };
        if(!this.bindings.has("gpAxisUpDown")){ this.gpAxisUpDown = obj.gpAxisUpDown; };

        if(!this.bindings.has("gpButtonEmote")){ this.gpButtonEmote = obj.gpButtonEmote; };
        if(!this.bindings.has("gpButtonToggleAudio")){ this.gpButtonToggleAudio = obj.gpButtonToggleAudio; };
        if(!this.bindings.has("gpButtonZoomIn")){ this.gpButtonZoomIn = obj.gpButtonZoomIn; };
        if(!this.bindings.has("gpButtonZoomOut")){ this.gpButtonZoomOut = obj.gpButtonZoomOut; };
        if(!this.bindings.has("gpButtonUp")){ this.gpButtonUp = obj.gpButtonUp; };
        if(!this.bindings.has("gpButtonDown")){ this.gpButtonDown = obj.gpButtonDown; };
        if(!this.bindings.has("gpButtonLeft")){ this.gpButtonLeft = obj.gpButtonLeft; };
        if(!this.bindings.has("gpButtonRight")){ this.gpButtonRight = obj.gpButtonRight; };
    }
}

const DEFAULT_INPUT_BINDING: IInputBinding = Object.freeze({
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

    private _drawHearing = false;
    private _audioDistanceMin = 1;
    private _audioDistanceMax = 10;
    private _audioRolloff = 1;
    private _fontSize = 12;
    private _transitionSpeed = 1;
    private _zoom = 1.5;
    private _roomName = "calla";
    private _userName = "";
    private _email = "";
    private _avatarEmoji: string = null;
    private _avatarURL: string = null;
    private _gamepadIndex = 0;
    private _inputBinding = new InputBinding();

    private _preferredAudioOutputID: string = null;
    private _preferredAudioInputID: string = null;
    private _preferredVideoInputID: string = null;

    constructor() {
        const thisStr = localStorage.getItem(KEY);

        if (thisStr) {
            const obj = JSON.parse(thisStr);
            const inputBindings = obj.inputBinding;
            delete obj.inputBinding;
            Object.assign(this, obj);
            this.inputBinding = inputBindings;
        }

        this._inputBinding.fix(DEFAULT_INPUT_BINDING);
    
        if (window.location.hash.length > 0) {
            this.roomName = window.location.hash.substring(1);
        }

        Object.seal(this);
    }

    private commit() {
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
        this._inputBinding.addEventListener(
            "inputBindingChanged",
            (_) => hasChanged = true,
            { once: true });
        this._inputBinding.copy(value);
        if (hasChanged) {
            this.commit();
        }
    }
}