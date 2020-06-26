import "../protos.js";

import { bust } from "../emoji.js";
import { GamepadManager } from "../gamepad/GamepadStateManager.js";
import { accessKey, className, htmlFor, id, max, min, placeHolder, step, style, systemFont, title, value } from "../html/attrs.js";
import { onClick, onInput, onKeyUp } from "../html/evts.js";
import { Button, clear, Div, Label, LabeledInput, LabeledSelectBox, OptionPanel, P, Span } from "../html/tags.js";
import { isGoodNumber } from "../math.js";
import { FormDialog } from "./FormDialog.js";
import { InputBinding } from "./InputBinding.js";

const keyWidthStyle = style({ width: "7em" }),
    numberWidthStyle = style({ width: "3em" }),
    avatarUrlChangedEvt = new Event("avatarurlchanged"),
    gamepadChangedEvt = new Event("gamepadchanged"),
    selectAvatarEvt = new Event("selectavatar"),
    fontSizeChangedEvt = new Event("fontsizechanged"),
    inputBindingChangedEvt = new Event("inputbindingchanged"),
    audioPropsChangedEvt = new Event("audiopropschanged"),
    toggleDrawHearingEvt = new Event("toggledrawhearing"),
    toggleVideoEvt = new Event("togglevideo"),
    audioInputChangedEvt = new Event("audioinputchanged"),
    audioOutputChangedEvt = new Event("audiooutputchanged"),
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
                this.avatarURLInput = LabeledInput(
                    "avatarURL",
                    "text",
                    "Avatar URL: ",
                    placeHolder("https://example.com/me.png"),
                    onInput(_(avatarUrlChangedEvt))),
                " or ",
                this.avatarEmojiInput = Div(
                    Label(
                        htmlFor("selectAvatarEmoji"),
                        "Avatar Emoji: "),
                    this.avatarEmojiPreview = Span(bust.value),
                    Button(
                        id("selectAvatarEmoji"),
                        "Select",
                        onClick(_(selectAvatarEvt))))),

            OptionPanel("interface", "Interface",
                this.fontSizeInput = LabeledInput(
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
                    "No gamepad",
                    gp => gp.id,
                    gp => gp.id,
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
                        "No audio input",
                        d => d.deviceId,
                        d => d.label,
                        onInput(_(audioInputChangedEvt)))),
                P(
                    this.audioOutputSelect = LabeledSelectBox(
                        "audioOutputDevices",
                        "Output: ",
                        "No audio output",
                        d => d.deviceId,
                        d => d.label,
                        onInput(_(audioOutputChangedEvt)))),
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
                        "No video input",
                        d => d.deviceId,
                        d => d.label,
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
        this.footer.append(
            this.confirmButton = Button(
                className("confirm"),
                systemFont,
                "Close",
                onClick(() => this.hide())));

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

        this._videoEnabled = false;
        this._drawHearing = false;

        Object.seal(this);
    }

    setAvatarEmoji(e) {
        clear(this.avatarEmojiPreview);
        this.avatarEmojiPreview.append(Span(
            title(e.desc),
            e.value));
    }

    get avatarURL() {
        return this.avatarURLInput.value;
    }

    set avatarURL(value) {
        this.avatarURLInput.value = value;
    }

    async showAsync() {
        this.show();
        await this.confirmButton.once("click");
        this.hide();
        return false;
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
        this.gpSelect.values = values;
    }

    get audioInputDevices() {
        return this.audioInputSelect.values;
    }

    set audioInputDevices(values) {
        this.audioInputSelect.values = values;
    }

    get currentAudioInputDevice() {
        return this.audioInputSelect.selectedValue;
    }

    set currentAudioInputDevice(value) {
        this.audioInputSelect.selectedValue = value;
    }


    get audioOutputDevices() {
        return this.audioOutputSelect.values;
    }

    set audioOutputDevices(values) {
        this.audioOutputSelect.values = values;
    }

    get currentAudioOutputDevice() {
        return this.audioOutputSelect.selectedValue;
    }

    set currentAudioOutputDevice(value) {
        this.audioOutputSelect.selectedValue = value;
    }


    get videoInputDevices() {
        return this.videoInputSelect.values;
    }

    set videoInputDevices(values) {
        this.videoInputSelect.values = values;
    }

    get currentVideoInputDevice() {
        return this.videoInputSelect.selectedValue;
    }

    set currentVideoInputDevice(value) {
        this.videoInputSelect.selectedValue = value;
    }


    get videoEnabled() {
        return this._videoEnabled;
    }

    set videoEnabled(value) {
        this._videoEnabled = value;
        this.enableVideo.innerHTML = value
            ? "Disable video"
            : "Enable video";
    }

    get gamepads() {
        return this.gpSelect.getValues();
    }

    set gamepads(values) {
        const disable = values.length === 0;
        this.gpSelect.values = values;
        this.gpButtonUp.setLocked(disable);
        this.gpButtonDown.setLocked(disable);
        this.gpButtonLeft.setLocked(disable);
        this.gpButtonRight.setLocked(disable);
        this.gpButtonEmote.setLocked(disable);
        this.gpButtonToggleAudio.setLocked(disable);
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