import { isGoodNumber, isString } from "../../calla/index.js";
import { disabled, height, htmlFor, id, max, min, placeHolder, step, value, width } from "../html/attrs.js";
import { cssWidth } from "../html/css.js";
import { onClick, onInput, onKeyUp } from "../html/evts.js";
import { gridColsDef } from "../html/grid.js";
import { LabeledInput } from "../html/LabeledInputTag.js";
import { isOpen, setLocked } from "../html/ops.js";
import { OptionPanel } from "../html/OptionPanelTag.js";
import { SelectBox } from "../html/SelectBoxTag.js";
import { Button, Canvas, Div, InputURL, Label, P } from "../html/tags.js";
import { EventedGamepad } from "../input/EventedGamepad.js";
import { User } from "../User.js";
import { FormDialog } from "./FormDialog.js";
import { InputBinding } from "./InputBinding.js";



const keyWidthStyle = cssWidth("7em"),
    numberWidthStyle = cssWidth("3em"),
    avatarUrlChangedEvt = new Event("avatarURLChanged"),
    gamepadChangedEvt = new Event("gamepadChanged"),
    selectAvatarEvt = new Event("selectAvatar"),
    fontSizeChangedEvt = new Event("fontSizeChanged"),
    inputBindingChangedEvt = new Event("inputBindingChanged"),
    audioPropsChangedEvt = new Event("audioPropertiesChanged"),
    toggleDrawHearingEvt = new Event("toggleDrawHearing"),
    toggleVideoEvt = new Event("toggleVideo"),
    gamepadButtonUpEvt = Object.assign(new Event("gamepadbuttonup"), {
        button: 0
    }),
    gamepadAxisMaxedEvt = Object.assign(new Event("gamepadaxismaxed"), {
        axis: 0
    });

const disabler = disabled(true),
    enabler = disabled(false);

/** @type {WeakMap<OptionsForm, OptionsFormPrivate>} */
const selfs = new WeakMap();

class OptionsFormPrivate {
    constructor() {
        this.inputBinding = new InputBinding();
        /** @type {EventedGamepad} */
        this.pad = null;
    }
}

export class OptionsForm extends FormDialog {
    constructor() {
        super("options");

        const _ = (evt) => () => this.dispatchEvent(evt);

        const self = new OptionsFormPrivate();
        selfs.set(this, self);

        const audioPropsChanged = onInput(_(audioPropsChangedEvt));

        const makeKeyboardBinder = (id, label) => {
            const key = LabeledInput(
                id,
                "text",
                label,
                keyWidthStyle,
                onKeyUp((evt) => {
                    if (evt.key !== "Tab"
                        && evt.key !== "Shift") {
                        key.value
                            = self.inputBinding[id]
                            = evt.key;
                        this.dispatchEvent(inputBindingChangedEvt);
                    }
                }));
            key.value = self.inputBinding[id];
            return key;
        }

        const makeGamepadButtonBinder = (id, label) => {
            const gp = LabeledInput(
                id,
                "text",
                label,
                numberWidthStyle);
            this.addEventListener("gamepadbuttonup", (evt) => {
                if (document.activeElement === gp.input) {
                    gp.value
                        = self.inputBinding[id]
                        = evt.button;
                    this.dispatchEvent(inputBindingChangedEvt);
                }
            });
            gp.value = self.inputBinding[id];
            return gp;
        };

        const makeGamepadAxisBinder = (id, label) => {
            const gp = LabeledInput(
                id,
                "text",
                label,
                numberWidthStyle);
            this.addEventListener("gamepadaxismaxed", (evt) => {
                if (document.activeElement === gp.input) {
                    gp.value
                        = self.inputBinding[id]
                        = evt.axis;
                    this.dispatchEvent(inputBindingChangedEvt);
                }
            });
            gp.value = self.inputBinding[id];
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
                    value(10),
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
                        value(1),
                        min(0),
                        max(100),
                        numberWidthStyle,
                        audioPropsChanged),
                    this.audioMaxInput = LabeledInput(
                        "maxAudio",
                        "number",
                        "Min: ",
                        value(10),
                        min(0),
                        max(100),
                        numberWidthStyle,
                        audioPropsChanged),
                    this.audioRolloffInput = LabeledInput(
                        "rollof",
                        "number",
                        "Rollof: ",
                        value(1),
                        min(0.1),
                        max(10),
                        step(0.1),
                        numberWidthStyle,
                        audioPropsChanged))),

            OptionPanel("keyboard", "Keyboard",
                this.keyButtonUp = makeKeyboardBinder("keyButtonUp", "Up: "),
                this.keyButtonDown = makeKeyboardBinder("keyButtonDown", "Down: "),
                this.keyButtonLeft = makeKeyboardBinder("keyButtonLeft", "Left: "),
                this.keyButtonRight = makeKeyboardBinder("keyButtonRight", "Right: "),
                this.keyButtonEmote = makeKeyboardBinder("keyButtonEmote", "Emote: "),
                this.keyButtonToggleAudio = makeKeyboardBinder("keyButtonToggleAudio", "Toggle audio: ")),

            OptionPanel("gamepad", "Gamepad",
                Div(
                    Label(htmlFor("gamepads"),

                        "Use gamepad: "),
                    this.gpSelect = SelectBox(
                        "gamepads",
                        "No gamepad",
                        gp => gp.id,
                        gp => gp.id,
                        onInput(_(gamepadChangedEvt)))),
                this.gpAxisLeftRight = makeGamepadAxisBinder("gpAxisLeftRight", "Left/Right axis:"),
                this.gpAxisUpDown = makeGamepadAxisBinder("gpAxisUpDown", "Up/Down axis:"),
                this.gpButtonUp = makeGamepadButtonBinder("gpButtonUp", "Up button: "),
                this.gpButtonDown = makeGamepadButtonBinder("gpButtonDown", "Down button: "),
                this.gpButtonLeft = makeGamepadButtonBinder("gpButtonLeft", "Left button: "),
                this.gpButtonRight = makeGamepadButtonBinder("gpButtonRight", "Right button: "),
                this.gpButtonEmote = makeGamepadButtonBinder("gpButtonEmote", "Emote button: "),
                this.gpButtonToggleAudio = makeGamepadButtonBinder("gpButtonToggleAudio", "Toggle audio button: "))
        ];

        const cols = [];
        for (let i = 0; i < panels.length; ++i) {
            cols[i] = "1fr";
            panels[i].element.style.gridColumnStart = i + 1;
        }

        gridColsDef(...cols).apply(this.header);

        this.header.append(...panels.map(p => p.button));
        this.content.append(...panels.map(p => p.element));

        const showPanel = (p) =>
            () => {
                for (let i = 0; i < panels.length; ++i) {
                    panels[i].visible = i === p;
                }
            };

        for (let i = 0; i < panels.length; ++i) {
            panels[i].visible = i === 0;
            panels[i].addEventListener("select", showPanel(i));
        }

        self.inputBinding.addEventListener("inputBindingChanged", () => {
            for (let id of Object.getOwnPropertyNames(self.inputBinding)) {
                if (value[id] !== undefined
                    && this[id] != undefined) {
                    this[id].value = value[id];
                }
            }
        });

        this.gamepads = [];

        this._drawHearing = false;

        /** @type {User} */
        this.user = null;
        this._avatarG = this.avatarPreview.getContext("2d");

        Object.seal(this);
    }

    update() {
        if (isOpen(this)) {
            const pad = this.currentGamepad;
            if (pad) {
                if (self.pad) {
                    self.pad.update(pad);
                }
                else {
                    self.pad = new EventedGamepad(pad);
                    self.pad.addEventListener("gamepadbuttonup", (evt) => {
                        gamepadButtonUpEvt.button = evt.button;
                        this.dispatchEvent(gamepadButtonUpEvt);
                    });
                    self.pad.addEventListener("gamepadaxismaxed", (evt) => {
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


    setAvatarVideo(v) {
        if (v !== null) {
            this.useVideoAvatarButton.innerHTML = "Remove video";
        }
        else {
            this.useVideoAvatarButton.innerHTML = "Use video";
        }
    }

    get inputBinding() {
        const self = selfs.get(this);
        return self.inputBinding.clone();
    }

    set inputBinding(value) {
        const self = selfs.get(this);
        for (let id of Object.getOwnPropertyNames(value)) {
            if (self.inputBinding[id] !== undefined
                && value[id] !== undefined
                && this[id] != undefined) {
                self.inputBinding[id]
                    = this[id].value
                    = value[id];
            }
        }
    }

    get gamepads() {
        return this.gpSelect.values;
    }

    set gamepads(values) {
        const disable = values.length === 0;
        this.gpSelect.values = values;
        setLocked(this.gpAxisLeftRight, disable);
        setLocked(this.gpAxisUpDown, disable);
        setLocked(this.gpButtonUp, disable);
        setLocked(this.gpButtonDown, disable);
        setLocked(this.gpButtonLeft, disable);
        setLocked(this.gpButtonRight, disable);
        setLocked(this.gpButtonEmote, disable);
        setLocked(this.gpButtonToggleAudio, disable);
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
            this.audioMinInput.value = value;
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
            this.audioMaxInput.value = value;
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
            this.audioRolloffInput.value = value;
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
            this.fontSizeInput.value = value;
        }
    }
}