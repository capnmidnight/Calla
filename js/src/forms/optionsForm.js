import "../protos.js";

import { bust } from "../emoji.js";

import { FormDialog } from "./formDialog.js";

import {
    Button,
    Div,
    H2,
    H3,
    Label,
    LabeledInput,
    LabeledSelectBox,
    P,
    Span,
    OptionPanel
} from "../html/tags.js";

import {
    accessKey,
    className,
    htmlFor,
    id,
    min,
    max,
    placeHolder,
    step,
    style,
    value,
    systemFont
} from "../html/attrs.js";

import {
    onInput,
    onClick,
    onKeyUp
} from "../html/evts.js";

import { InputBinding } from "./inputBinding.js";
import { GamepadManager } from "../gamepad/manager.js";

const keyWidthStyle = style({ width: "7em" }),
    numberWidthStyle = style({ width: "3em" }),
    avatarUrlChangedEvt = new Event("avatarurlchanged"),
    gamepadChangedEvt = new Event("gamepadchanged"),
    selectAvatarEvt = new Event("selectavatar"),
    fontSizeChangedEvt = new Event("fontsizechanged"),
    inputBindingChangedEvt = new Event("inputbindingchanged"),
    audioPropsChangedEvt = new Event("audiopropschanged"),
    toggleVideoEvt = new Event("videoenablechanged"),
    videoInputChangedEvt = new Event("videoinputchanged"),
    selfs = new Map();

export class OptionsForm extends FormDialog {
    constructor() {
        super("options", "Options");

        const _ = (evt) => () => this.dispatchEvent(evt);

        const self = {
            inputBinding: new InputBinding()
        };

        selfs.set(this, self);

        this.element.append(
            this.confirmButton = Button(
                className("confirm"),
                style({ gridArea: "4/3" }),
                systemFont,
                "OK"));

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

        const makeGamepadBinder = (id, label) => {
            const gp = LabeledInput(
                id,
                "text",
                label,
                numberWidthStyle);
            GamepadManager.addEventListener("gamepadbuttonup", (evt) => {
                if (document.activeElement === gp) {
                    gp.value
                        = self.inputBinding[id]
                        = evt.button;
                    this.dispatchEvent(inputBindingChangedEvt);
                }
            });
            gp.value = self.inputBinding[id];
            return gp;
        }

        const panels = [
            OptionPanel("avatar", "Avatar",
                this.avatarURL = LabeledInput(
                    "avatarURL",
                    "text",
                    "Avatar URL: ",
                    placeHolder("https://example.com/me.png"),
                    onInput(_(avatarUrlChangedEvt))),
                " or ",
                this.avatarEmoji = Div(
                    Label(
                        htmlFor("selectAvatarEmoji"),
                        "Avatar Emoji: "),
                    this.avatarEmojiPreview = Span(bust.value),
                    Button(
                        id("selectAvatarEmoji"),
                        "Select",
                        onClick(_(selectAvatarEvt))))),

            OptionPanel("interface", "Interface",
                this.fontSize = LabeledInput(
                    "fontSize",
                    "number",
                    "Font size: ",
                    value(10),
                    min(5),
                    max(32),
                    style({ width: "3em" }),
                    onInput(_(fontSizeChangedEvt)))),

            OptionPanel("keyboard", "Keyboard",
                this.keyButtonUp = makeKeyboardBinder("keyButtonUp", "Up: "),
                this.keyButtonDown = makeKeyboardBinder("keyButtonDown", "Down: "),
                this.keyButtonLeft = makeKeyboardBinder("keyButtonLeft", "Left: "),
                this.keyButtonRight = makeKeyboardBinder("keyButtonRight", "Right: "),
                this.keyButtonEmote = makeKeyboardBinder("keyButtonEmote", "Emote: "),
                this.keyButtonToggleAudio = makeKeyboardBinder("keyButtonToggleAudio", "Toggle audio: ")),

            OptionPanel("gamepad", "Gamepad",
                this.gpSelect = LabeledSelectBox(
                    "gamepads",
                    "Use gamepad: ",
                    "No gamepads available",
                    onInput(_(gamepadChangedEvt))),
                this.gpButtonUp = makeGamepadBinder("gpButtonUp", "Up: "),
                this.gpButtonDown = makeGamepadBinder("gpButtonDown", "Down: "),
                this.gpButtonLeft = makeGamepadBinder("gpButtonLeft", "Left: "),
                this.gpButtonRight = makeGamepadBinder("gpButtonRight", "Right: "),
                this.gpButtonEmote = makeGamepadBinder("gpButtonEmote", "Emote: "),
                this.gpButtonToggleAudio = makeGamepadBinder("gpButtonToggleAudio", "Toggle audio: ")),

            OptionPanel("audio", "Audio",
                P(
                    this.audioInputSelect = LabeledSelectBox(
                        "audioInputDevices",
                        "Input: ",
                        "No audio input devices available")),
                P(
                    this.audioOutputSelect = LabeledSelectBox(
                        "audioOutputDevices",
                        "Output: ",
                        "No audio output devices available")),
                P(
                    this.drawHearingCheck = LabeledInput(
                        "drawHearing",
                        "checkbox",
                        "Draw hearing range: "),
                    this.minAudio = LabeledInput(
                        "minAudio",
                        "number",
                        "Min: ",
                        value(2),
                        min(0),
                        max(100),
                        numberWidthStyle,
                        audioPropsChanged),
                    this.maxAudio = LabeledInput(
                        "maxAudio",
                        "number",
                        "Min: ",
                        value(10),
                        min(0),
                        max(100),
                        numberWidthStyle,
                        audioPropsChanged),
                    this.rolloff = LabeledInput(
                        "rollof",
                        "number",
                        "Rollof: ",
                        value(5),
                        min(0.1),
                        max(10),
                        step(0.1),
                        numberWidthStyle,
                        audioPropsChanged))),

            OptionPanel("video", "Video",
                P(
                    this.enableVideo = Button(
                        accessKey("v"),
                        "Enable video",
                        onClick(_(toggleVideoEvt)))),
                P(
                    this.videoInputSelect = LabeledSelectBox(
                        "videoInputDevices",
                        "Device: ",
                        "No video input devices available",
                        onInput(_(videoInputChangedEvt)))))
        ];

        const cols = [];
        for (let i = 0; i < panels.length; ++i) {
            cols[i] = "1fr";
            panels[i].element.style.gridColumnStart = i + 1;
        }

        Object.assign(this.header.style, {
            display: "grid",
            gridTemplateColumns: cols.join(" ")
        });

        this.header.append(...panels.map(p => p.button));
        this.content.append(...panels.map(p => p.element));

        const showPanel = (p) =>
            () => {
                for (let i = 0; i < panels.length; ++i) {
                    panels[i].visible = i === p;
                }
            };

        for (let i = 0; i < panels.length; ++i) {
            panels[i].addEventListener("select", showPanel(i));
        }

        showPanel(0)();

        self.inputBinding.addEventListener("inputbindingchanged", () => {
            for (let id of Object.getOwnPropertyNames(self.inputBinding)) {
                if (value[id] !== undefined
                    && this[id] != undefined) {
                    this[id].value = value[id];
                }
            }
        });

        this.gamepads = [];
        this.audioInputDevices = [];
        this.audioOutputDevices = [];
        this.videoInputDevices = [];

        Object.seal(this);
    }

    async showAsync() {
        this.show();
        await this.confirmButton.once("click");
        this.hide();
        return false;
    }

    get inputBinding() {
        const self = selfs.get(this);
        return self.inputBinding;
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

    get audioInputDevices() {
        return this.audioInputSelect.getValues();
    }

    set audioInputDevices(values) {
        this.audioInputSelect.setValues(values, v => v.label);
    }

    get audioOutputDevices() {
        return this.audioOutputSelect.getValues();
    }

    set audioOutputDevices(values) {
        this.audioOutputSelect.setValues(values, v => v.label);
    }

    get videoInputDevices() {
        return this.videoInputSelect.getValues();
    }

    set videoInputDevices(values) {
        this.videoInputSelect.setValues(values, v => v.label);
    }

    get gamepads() {
        return this.gpSelect.getValues();
    }

    set gamepads(values) {
        const disable = values.length === 0;
        this.gpSelect.setValues(values, v => v.id);
        this.gpButtonUp.setLocked(disable);
        this.gpButtonDown.setLocked(disable);
        this.gpButtonLeft.setLocked(disable);
        this.gpButtonRight.setLocked(disable);
        this.gpButtonEmote.setLocked(disable);
        this.gpButtonToggleAudio.setLocked(disable);
    }
}