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
    Span
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

const keyWidthStyle = style({ width: "7em" }),
    numberWidthStyle = style({ width: "3em" }),
    avatarUrlChangedEvt = new Event("avatarurlchanged"),
    gamepadChangedEvt = new Event("gamepadchanged"),
    selectAvatarEvt = new Event("selectavatar"),
    fontSizeChangedEvt = new Event("fontsizechanged"),
    inputBindingChangedEvt = new Event("inputbindingchanged"),
    audioPropsChangedEvt = new Event("audiopropschanged"),
    toggleVideoEvt = new Event("videoenablechanged"),
    videoInputChangedEvt = new Event("videoinputchanged");

class InputBinding extends EventTarget {
    constructor() {
        super();

        this.bindings = new Map([
            ["keyButtonUp", "ArrowUp"],
            ["keyButtonDown", "ArrowDown"],
            ["keyButtonLeft", "ArrowLeft"],
            ["keyButtonRight", "ArrowRight"],
            ["keyButtonEmote", "e"],
            ["keyButtonToggleAudio", "a"],

            ["gpButtonUp", 12],
            ["gpButtonDown", 13],
            ["gpButtonLeft", 14],
            ["gpButtonRight", 15],
            ["gpButtonEmote", 0],
            ["gpButtonToggleAudio", 1]
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
}

export class OptionsForm extends FormDialog {
    constructor() {
        super("options", "Options");

        const _ = (evt) => () => this.dispatchEvent(evt);

        this._inputBinding = new InputBinding();

        this.element.append(
            this.confirmButton = Button(
                className("confirm"),
                style({ gridArea: "3/3" }),
                systemFont,
                "OK"));

        const bindingChanged = onInput(_(inputBindingChangedEvt)),
            audioPropsChanged = onInput(_(audioPropsChangedEvt));

        const makeKeyboardBinder = (id, label) => {
            const key = LabeledInput(
                id,
                "text",
                label,
                keyWidthStyle,
                onKeyUp((evt) => {
                    if (evt.key !== "Tab"
                        && evt.key !== "Shift") {
                        this._inputBinding[id]
                            = key.value
                            = evt.key;
                        this.dispatchEvent(inputBindingChangedEvt);
                    }
                }));
            key.value = this._inputBinding[id];
            return key;
        }

        const makeGamepadBinder = (id, label) => {
            const gp = LabeledInput(
                id,
                "text",
                label,
                numberWidthStyle,
                bindingChanged);
            return gp;
        }

        this.content.append(
            H2("Avatar"),
            P(
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

            H2("Interface"),
            P(
                this.fontSize = LabeledInput(
                    "fontSize",
                    "number",
                    "Font size: ",
                    value(10),
                    min(5),
                    max(32),
                    style({ width: "3em" }),
                    onInput(_(fontSizeChangedEvt)))),

            H2("Input"),

            H3("Keyboard"),
            P(
                this.keyButtonUp = makeKeyboardBinder("keyButtonUp", "Up: "),
                this.keyButtonDown = makeKeyboardBinder("keyButtonDown", "Down: "),
                this.keyButtonLeft = makeKeyboardBinder("keyButtonLeft", "Left: "),
                this.keyButtonRight = makeKeyboardBinder("keyButtonRight", "Right: ")),
            P(
                this.keyButtonEmote = makeKeyboardBinder("keyButtonEmote", "Emote: "),
                this.keyButtonToggleAudio = makeKeyboardBinder("keyButtonToggleAudio", "Toggle audio: ")),

            H3("Gamepad"),
            P(
                this.gpSelect = LabeledSelectBox(
                    "gamepads",
                    "Use gamepad: ",
                    "No gamepads available",
                    onInput(_(gamepadChangedEvt)))),
            P(
                this.gpButtonUp = makeGamepadBinder("gpButtonUp", "Up: "),
                this.gpButtonDown = makeGamepadBinder("gpButtonDown", "Down: "),
                this.gpButtonLeft = makeGamepadBinder("gpButtonLeft", "Left: "),
                this.gpButtonRight = makeGamepadBinder("gpButtonRight", "Right: ")),
            P(
                this.gpButtonEmote = makeGamepadBinder("gpButtonEmote", "Emote: "),
                this.gpButtonToggleAudio = makeGamepadBinder("gpButtonToggleAudio", "Toggle audio: ")),

            H2("Audio"),
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
                    audioPropsChanged)),

            H2("Video"),
            P(
                this.enableVideo = Button(
                    accessKey("v"),
                    "Enable video",
                    onClick(_(toggleVideoEvt)))),
            P(
                this.videoInputDevices = LabeledSelectBox(
                    "videoInputDevices",
                    "Device: ",
                    "No video input devices available",
                    onInput(_(videoInputChangedEvt)))));

        this._inputBinding.addEventListener("inputbindingchanged", () => {
            for (let id of Object.getOwnPropertyNames(this._inputBinding)) {
                if (value[id] !== undefined
                    && this[id] != undefined) {
                    this[id].value = value[id];
                }
            }
        });

        Object.seal(this);
    }

    async showAsync() {
        this.show();
        await this.confirmButton.once("click");
        this.hide();
        return false;
    }

    get inputBinding() {
        return this._inputBinding;
    }

    set inputBinding(value) {
        for (let id of Object.getOwnPropertyNames(value)) {
            if (this._inputBinding[id] !== undefined
                && value[id] !== undefined
                && this[id] != undefined) {
                this._inputBinding[id]
                    = this[id].value
                    = value[id];
            }
        }
    }
}