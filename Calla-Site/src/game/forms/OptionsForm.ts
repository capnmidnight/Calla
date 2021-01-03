import { disabled, height, htmlFor, id, max, min, placeHolder, step, value, width as cssWidth, width } from "kudzu/html/attrs";
import { CanvasTypes } from "kudzu/html/canvas";
import { onClick, onInput, onKeyUp } from "kudzu/html/evts";
import { gridColsDef } from "kudzu/html/grid";
import { Button, Canvas, Div, InputURL, Label, P } from "kudzu/html/tags";
import { EventedGamepad } from "kudzu/input/EventedGamepad";
import { isGoodNumber, isString } from "kudzu/typeChecks";
import { IInputBinding, InputBinding } from "../Settings";
import type { User } from "../User";
import { FormDialog, FormDialogEvents } from "./FormDialog";
import type { LabeledInputTag } from "./LabeledInputTag";
import { LabeledInput } from "./LabeledInputTag";
import { isOpen, setLocked } from "./ops";
import { OptionPanel } from "./OptionPanelTag";
import type { SelectBoxTag } from "./SelectBoxTag";
import { SelectBox } from "./SelectBoxTag";


export class OptionsFormAvatarURLChangedEvent extends Event { constructor() { super("avatarURLChanged"); } }
export class OptionsFormGamepadChangedEvent extends Event { constructor() { super("gamepadChanged"); } }
export class OptionsFormSelectAvatarEvent extends Event { constructor() { super("selectAvatar"); } }
export class OptionsFormFontSizeChangedEvent extends Event { constructor() { super("fontSizeChanged"); } }
export class OptionsFormInputBindingChangedEvent extends Event { constructor() { super("inputBindingChanged"); } }
export class OptionsFormAudioPropertiesChangedEvent extends Event { constructor() { super("audioPropertiesChanged"); } }
export class OptionsFormToggleDrawHearingEvent extends Event { constructor() { super("toggleDrawHearing"); } }
export class OptionsFormToggleVideoEvent extends Event { constructor() { super("toggleVideo"); } }

export class OptionsFormGamepadButtonUpEvent extends Event {
    button = 0;
    constructor() { super("gamepadButtonUp"); }
}

export class OptionsFormGamepadAxisMaxedEvent extends Event {
    axis = 0;
    constructor() { super("gamepadAxisMaxed"); }
}

interface OptionsFormEvents extends FormDialogEvents {
    avatarURLChanged: OptionsFormAvatarURLChangedEvent;
    gamepadChanged: OptionsFormGamepadChangedEvent;
    selectAvatar: OptionsFormSelectAvatarEvent;
    fontSizeChanged: OptionsFormFontSizeChangedEvent;
    inputBindingChanged: OptionsFormInputBindingChangedEvent;
    audioPropertiesChanged: OptionsFormAudioPropertiesChangedEvent;
    toggleDrawHearing: OptionsFormToggleDrawHearingEvent;
    toggleVideo: OptionsFormToggleVideoEvent;
    gamepadButtonUp: OptionsFormGamepadButtonUpEvent;
    gamepadAxisMaxed: OptionsFormGamepadAxisMaxedEvent;
}

const keyWidthStyle = cssWidth("7em"),
    numberWidthStyle = cssWidth("3em"),
    avatarUrlChangedEvt = new OptionsFormAvatarURLChangedEvent(),
    gamepadChangedEvt = new OptionsFormGamepadChangedEvent(),
    selectAvatarEvt = new OptionsFormSelectAvatarEvent(),
    fontSizeChangedEvt = new OptionsFormFontSizeChangedEvent(),
    inputBindingChangedEvt = new OptionsFormInputBindingChangedEvent(),
    audioPropsChangedEvt = new OptionsFormAudioPropertiesChangedEvent(),
    toggleDrawHearingEvt = new OptionsFormToggleDrawHearingEvent(),
    toggleVideoEvt = new OptionsFormToggleVideoEvent(),
    gamepadButtonUpEvt = new OptionsFormGamepadButtonUpEvent(),
    gamepadAxisMaxedEvt = new OptionsFormGamepadAxisMaxedEvent();

const disabler = disabled(true),
    enabler = disabled(false);

export class OptionsForm
    extends FormDialog<OptionsFormEvents>
    implements IInputBinding {
    _drawHearing = false;

    private _inputBinding = new InputBinding();
    private _pad: EventedGamepad;
    avatarURLInput: HTMLInputElement;
    clearAvatarURLButton: HTMLButtonElement;
    useVideoAvatarButton: HTMLButtonElement;
    avatarPreview: HTMLCanvasElement;
    fontSizeInput: LabeledInputTag;
    drawHearingCheck: LabeledInputTag;
    audioMinInput: LabeledInputTag;
    audioMaxInput: LabeledInputTag;
    audioRolloffInput: LabeledInputTag;
    gpSelect: SelectBoxTag<Gamepad>;

    keyButtonUpInput: LabeledInputTag;
    keyButtonDownInput: LabeledInputTag;
    keyButtonLeftInput: LabeledInputTag;
    keyButtonRightInput: LabeledInputTag;
    keyButtonEmoteInput: LabeledInputTag;
    keyButtonToggleAudioInput: LabeledInputTag;
    keyButtonZoomOutInput: LabeledInputTag;
    keyButtonZoomInInput: LabeledInputTag;

    gpAxisLeftRightInput: LabeledInputTag;
    gpAxisUpDownInput: LabeledInputTag;
    gpButtonUpInput: LabeledInputTag;
    gpButtonDownInput: LabeledInputTag;
    gpButtonLeftInput: LabeledInputTag;
    gpButtonRightInput: LabeledInputTag;
    gpButtonEmoteInput: LabeledInputTag;
    gpButtonToggleAudioInput: LabeledInputTag;
    gpButtonZoomOutInput: LabeledInputTag;
    gpButtonZoomInInput: LabeledInputTag;


    user: User = null;
    private _avatarG: CanvasRenderingContext2D;

    constructor() {
        super("options");

        const _ = (evt: Event) => () => this.dispatchEvent(evt);

        const audioPropsChanged = onInput(_(audioPropsChangedEvt));

        const makeKeyboardBinder = (id: string, label: string) => {
            const key = LabeledInput(
                id,
                "text",
                label,
                keyWidthStyle,
                onKeyUp((evt: Event) => {
                    const keyEvt = evt as KeyboardEvent;
                    if (keyEvt.key !== "Tab"
                        && keyEvt.key !== "Shift") {
                        this._inputBinding.set(id, keyEvt.key);
                        this.dispatchEvent(inputBindingChangedEvt);
                    }
                }));
            key.value = this._inputBinding.get(id).toString();
            return key;
        };

        const makeGamepadButtonBinder = (id: string, label: string) => {
            const gp = LabeledInput(
                id,
                "text",
                label,
                numberWidthStyle);
            this.addEventListener("gamepadButtonUp", (evt) => {
                if (document.activeElement === gp.input) {
                    this._inputBinding.set(id, evt.button);
                    this.dispatchEvent(inputBindingChangedEvt);
                }
            });
            gp.value = this._inputBinding.get(id).toString();
            return gp;
        };

        const makeGamepadAxisBinder = (id: string, label: string) => {
            const gp = LabeledInput(
                id,
                "text",
                label,
                numberWidthStyle);
            this.addEventListener("gamepadAxisMaxed", (evt) => {
                if (document.activeElement === gp.input) {
                    this._inputBinding.set(id, evt.axis);
                    this.dispatchEvent(inputBindingChangedEvt);
                }
            });
            gp.value = this._inputBinding.get(id).toString();
            return gp;
        };

        const panels = [
            OptionPanel("avatar", "Avatar",
                Div(
                    Label(
                        htmlFor("selectAvatarEmoji"),
                        "Emoji: "),
                    Button(
                        id("selectAvatarEmoji"),
                        "Select",
                        onClick(_(selectAvatarEvt)))),
                " or ",
                Div(
                    Label(
                        htmlFor("setAvatarURL"),
                        "Photo: "),

                    this.avatarURLInput = InputURL(
                        placeHolder("https://example.com/me.png")),
                    Button(
                        id("setAvatarURL"),
                        "Set",
                        onClick(() => {
                            this.avatarURL = this.avatarURLInput.value;
                            this.dispatchEvent(avatarUrlChangedEvt);
                        })),
                    this.clearAvatarURLButton = Button(
                        disabled,
                        "Clear",
                        onClick(() => {
                            this.avatarURL = null;
                            this.dispatchEvent(avatarUrlChangedEvt);
                        }))),
                " or ",
                Div(
                    Label(
                        htmlFor("videoAvatarButton"),
                        "Video: "),
                    this.useVideoAvatarButton = Button(
                        id("videoAvatarButton"),
                        "Use video",
                        onClick(_(toggleVideoEvt)))),
                this.avatarPreview = Canvas(
                    width(256),
                    height(256))),

            OptionPanel("interface", "Interface",
                this.fontSizeInput = LabeledInput(
                    "fontSize",
                    "number",
                    "Font size: ",
                    value("10"),
                    min(5),
                    max(32),
                    numberWidthStyle,
                    onInput(_(fontSizeChangedEvt))),
                P(
                    this.drawHearingCheck = LabeledInput(
                        "drawHearing",
                        "checkbox",
                        "Draw hearing range: ",
                        onInput(() => {
                            this.drawHearing = !this.drawHearing;
                            this.dispatchEvent(toggleDrawHearingEvt);
                        })),
                    this.audioMinInput = LabeledInput(
                        "minAudio",
                        "number",
                        "Min: ",
                        value("1"),
                        min(0),
                        max(100),
                        numberWidthStyle,
                        audioPropsChanged),
                    this.audioMaxInput = LabeledInput(
                        "maxAudio",
                        "number",
                        "Min: ",
                        value("10"),
                        min(0),
                        max(100),
                        numberWidthStyle,
                        audioPropsChanged),
                    this.audioRolloffInput = LabeledInput(
                        "rollof",
                        "number",
                        "Rollof: ",
                        value("1"),
                        min(0.1),
                        max(10),
                        step(0.1),
                        numberWidthStyle,
                        audioPropsChanged))),

            OptionPanel("keyboard", "Keyboard",
                this.keyButtonUpInput = makeKeyboardBinder("keyButtonUp", "Up: "),
                this.keyButtonDownInput = makeKeyboardBinder("keyButtonDown", "Down: "),
                this.keyButtonLeftInput = makeKeyboardBinder("keyButtonLeft", "Left: "),
                this.keyButtonRightInput = makeKeyboardBinder("keyButtonRight", "Right: "),
                this.keyButtonEmoteInput = makeKeyboardBinder("keyButtonEmote", "Emote: "),
                this.keyButtonToggleAudioInput = makeKeyboardBinder("keyButtonToggleAudio", "Toggle audio: ")),

            OptionPanel("gamepad", "Gamepad",
                Div(
                    Label(htmlFor("gamepads"),

                        "Use gamepad: "),
                    this.gpSelect = SelectBox<Gamepad>(
                        "gamepads",
                        "No gamepad",
                        gp => gp.id,
                        gp => gp.id,
                        onInput(_(gamepadChangedEvt)))),
                this.gpAxisLeftRightInput = makeGamepadAxisBinder("gpAxisLeftRight", "Left/Right axis:"),
                this.gpAxisUpDownInput = makeGamepadAxisBinder("gpAxisUpDown", "Up/Down axis:"),
                this.gpButtonUpInput = makeGamepadButtonBinder("gpButtonUp", "Up button: "),
                this.gpButtonDownInput = makeGamepadButtonBinder("gpButtonDown", "Down button: "),
                this.gpButtonLeftInput = makeGamepadButtonBinder("gpButtonLeft", "Left button: "),
                this.gpButtonRightInput = makeGamepadButtonBinder("gpButtonRight", "Right button: "),
                this.gpButtonEmoteInput = makeGamepadButtonBinder("gpButtonEmote", "Emote button: "),
                this.gpButtonToggleAudioInput = makeGamepadButtonBinder("gpButtonToggleAudio", "Toggle audio button: "))
        ];

        const cols = [];
        for (let i = 0; i < panels.length; ++i) {
            cols[i] = "1fr";
            panels[i].style.gridColumnStart = (i + 1).toFixed(0);
        }

        gridColsDef(...cols).apply(this.header);

        this.header.append(...panels.map(p => p.button));
        this.content.append(...panels.map(p => p.element));

        const showPanel = (p: number) =>
            () => {
                for (let i = 0; i < panels.length; ++i) {
                    panels[i].visible = i === p;
                }
            };

        for (let i = 0; i < panels.length; ++i) {
            panels[i].visible = i === 0;
            panels[i].addEventListener("select", showPanel(i));
        }

        this._inputBinding.addEventListener("inputBindingChanged", () => {
            this.keyButtonUp = this._inputBinding.keyButtonUp;
            this.keyButtonDown = this._inputBinding.keyButtonDown;
            this.keyButtonLeft = this._inputBinding.keyButtonLeft;
            this.keyButtonRight = this._inputBinding.keyButtonRight;
            this.keyButtonEmote = this._inputBinding.keyButtonEmote;
            this.keyButtonToggleAudio = this._inputBinding.keyButtonToggleAudio;
            this.keyButtonZoomOut = this._inputBinding.keyButtonZoomOut;
            this.keyButtonZoomIn = this._inputBinding.keyButtonZoomIn;

            this.gpAxisLeftRight = this._inputBinding.gpAxisLeftRight;
            this.gpAxisUpDown = this._inputBinding.gpAxisUpDown;
            this.gpButtonUp = this._inputBinding.gpButtonUp;
            this.gpButtonDown = this._inputBinding.gpButtonDown;
            this.gpButtonLeft = this._inputBinding.gpButtonLeft;
            this.gpButtonRight = this._inputBinding.gpButtonRight;
            this.gpButtonEmote = this._inputBinding.gpButtonEmote;
            this.gpButtonToggleAudio = this._inputBinding.gpButtonToggleAudio;
            this.gpButtonZoomOut = this._inputBinding.gpButtonZoomOut;
            this.gpButtonZoomIn = this._inputBinding.gpButtonZoomIn;
        });

        this.gamepads = [];

        this._avatarG = this.avatarPreview.getContext("2d");

        Object.seal(this);
    }

    update() {
        if (isOpen(this)) {
            const pad = this.currentGamepad;
            if (pad) {
                if (this._pad) {
                    this._pad.update(pad);
                }
                else {
                    this._pad = new EventedGamepad(pad);
                    this._pad.addEventListener("gamepadbuttonup", (evt) => {
                        gamepadButtonUpEvt.button = evt.button;
                        this.dispatchEvent(gamepadButtonUpEvt);
                    });
                    this._pad.addEventListener("gamepadaxismaxed", (evt) => {
                        gamepadAxisMaxedEvt.axis = evt.axis;
                        this.dispatchEvent(gamepadAxisMaxedEvt);
                    });
                }
            }

            if (this.user && this.user.avatar) {
                this._avatarG.clearRect(0, 0, this.avatarPreview.width, this.avatarPreview.height);
                this.user.avatar.draw(this._avatarG, this.avatarPreview.width, this.avatarPreview.height, true);
            }
        }
    }

    get avatarURL() {
        if (this.avatarURLInput.value.length === 0) {
            return null;
        }
        else {
            return this.avatarURLInput.value;
        }
    }

    set avatarURL(v) {
        if (isString(v)) {
            this.avatarURLInput.value = v;
            enabler.apply(this.clearAvatarURLButton);
        }
        else {
            this.avatarURLInput.value = "";
            disabler.apply(this.clearAvatarURLButton);
        }
    }


    setAvatarVideo(v: CanvasTypes) {
        if (v !== null) {
            this.useVideoAvatarButton.innerHTML = "Remove video";
        }
        else {
            this.useVideoAvatarButton.innerHTML = "Use video";
        }
    }

    get inputBinding() {
        return this._inputBinding.toJSON();
    }

    set inputBinding(value) {
        this._inputBinding.copy(value);
    }

    get gamepads() {
        return this.gpSelect.values;
    }

    set gamepads(values) {
        const disable = values.length === 0;
        this.gpSelect.values = values;
        setLocked(this.gpAxisLeftRightInput, disable);
        setLocked(this.gpAxisUpDownInput, disable);
        setLocked(this.gpButtonUpInput, disable);
        setLocked(this.gpButtonDownInput, disable);
        setLocked(this.gpButtonLeftInput, disable);
        setLocked(this.gpButtonRightInput, disable);
        setLocked(this.gpButtonEmoteInput, disable);
        setLocked(this.gpButtonToggleAudioInput, disable);
    }

    get currentGamepadIndex() {
        return this.gpSelect.selectedIndex;
    }

    get currentGamepad() {
        if (this.currentGamepadIndex < 0) {
            return null;
        }
        else {
            return navigator.getGamepads()[this.currentGamepadIndex];
        }
    }

    get gamepadIndex() {
        return this.gpSelect.selectedIndex;
    }

    set gamepadIndex(value) {
        this.gpSelect.selectedIndex = value;
    }

    get drawHearing() {
        return this._drawHearing;
    }

    set drawHearing(value) {
        this._drawHearing = value;
        this.drawHearingCheck.checked = value;
    }

    get audioDistanceMin() {
        const value = parseFloat(this.audioMinInput.value);
        if (isGoodNumber(value)) {
            return value;
        }
        else {
            return 1;
        }
    }

    set audioDistanceMin(value) {
        if (isGoodNumber(value)
            && value > 0) {
            this.audioMinInput.value = value.toFixed(3);
            if (this.audioDistanceMin > this.audioDistanceMax) {
                this.audioDistanceMax = this.audioDistanceMin;
            }
        }
    }


    get audioDistanceMax() {
        const value = parseFloat(this.audioMaxInput.value);
        if (isGoodNumber(value)) {
            return value;
        }
        else {
            return 10;
        }
    }

    set audioDistanceMax(value) {
        if (isGoodNumber(value)
            && value > 0) {
            this.audioMaxInput.value = value.toFixed(3);
            if (this.audioDistanceMin > this.audioDistanceMax) {
                this.audioDistanceMin = this.audioDistanceMax;
            }
        }
    }


    get audioRolloff() {
        const value = parseFloat(this.audioRolloffInput.value);
        if (isGoodNumber(value)) {
            return value;
        }
        else {
            return 1;
        }
    }

    set audioRolloff(value) {
        if (isGoodNumber(value)
            && value > 0) {
            this.audioRolloffInput.value = value.toFixed(3);
        }
    }


    get fontSize() {
        const value = parseFloat(this.fontSizeInput.value);
        if (isGoodNumber(value)) {
            return value;
        }
        else {
            return 16;
        }
    }

    set fontSize(value) {
        if (isGoodNumber(value)
            && value > 0) {
            this.fontSizeInput.value = value.toFixed(3);
        }
    }

    get keyButtonUp() { return this.keyButtonUpInput.value; }
    set keyButtonUp(v) { this.keyButtonUpInput.value = v; }

    get keyButtonDown() { return this.keyButtonDownInput.value; }
    set keyButtonDown(v) { this.keyButtonDownInput.value = v; }

    get keyButtonLeft() { return this.keyButtonLeftInput.value; }
    set keyButtonLeft(v) { this.keyButtonLeftInput.value = v; }

    get keyButtonRight() { return this.keyButtonRightInput.value; }
    set keyButtonRight(v) { this.keyButtonRightInput.value = v; }

    get keyButtonEmote() { return this.keyButtonEmoteInput.value; }
    set keyButtonEmote(v) { this.keyButtonEmoteInput.value = v; }

    get keyButtonToggleAudio() { return this.keyButtonToggleAudioInput.value; }
    set keyButtonToggleAudio(v) { this.keyButtonToggleAudioInput.value = v; }

    get keyButtonZoomOut() { return this.keyButtonZoomOutInput.value; }
    set keyButtonZoomOut(v) { this.keyButtonZoomOutInput.value = v; }

    get keyButtonZoomIn() { return this.keyButtonZoomInInput.value; }
    set keyButtonZoomIn(v) { this.keyButtonZoomInInput.value = v; }

    get gpAxisLeftRight() { return parseInt(this.gpAxisLeftRightInput.value, 10); }
    set gpAxisLeftRight(v) { this.gpAxisLeftRightInput.value = v.toFixed(0); }

    get gpAxisUpDown() { return parseInt(this.gpAxisUpDownInput.value, 10); }
    set gpAxisUpDown(v) { this.gpAxisUpDownInput.value = v.toFixed(0); }

    get gpButtonUp() { return parseInt(this.gpButtonUpInput.value, 10); }
    set gpButtonUp(v) { this.gpButtonUpInput.value = v.toFixed(0); }

    get gpButtonDown() { return parseInt(this.gpButtonDownInput.value, 10); }
    set gpButtonDown(v) { this.gpButtonDownInput.value = v.toFixed(0); }

    get gpButtonLeft() { return parseInt(this.gpButtonLeftInput.value, 10); }
    set gpButtonLeft(v) { this.gpButtonLeftInput.value = v.toFixed(0); }

    get gpButtonRight() { return parseInt(this.gpButtonRightInput.value, 10); }
    set gpButtonRight(v) { this.gpButtonRightInput.value = v.toFixed(0); }

    get gpButtonEmote() { return parseInt(this.gpButtonEmoteInput.value, 10); }
    set gpButtonEmote(v) { this.gpButtonEmoteInput.value = v.toFixed(0); }

    get gpButtonToggleAudio() { return parseInt(this.gpButtonToggleAudioInput.value, 10); }
    set gpButtonToggleAudio(v) { this.gpButtonToggleAudioInput.value = v.toFixed(0); }

    get gpButtonZoomOut() { return parseInt(this.gpButtonZoomOutInput.value, 10); }
    set gpButtonZoomOut(v) { this.gpButtonZoomOutInput.value = v.toFixed(0); }

    get gpButtonZoomIn() { return parseInt(this.gpButtonZoomInInput.value, 10); }
    set gpButtonZoomIn(v) { this.gpButtonZoomInInput.value = v.toFixed(0); }
}