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
    onClick
} from "../html/evts.js";

const keyWidthStyle = style({ width: "7em" }),
    numberWidthStyle = style({ width: "3em" }),
    avatarUrlChangedEvt = new Event("avatarurlchanged"),
    gamepadChangedEvt = new Event("gamepadchanged"),
    selectAvatarEvt = new Event("selectavatar"),
    fontSizeChangedEvt = new Event("fontsizechanged"),
    inputBindingChangedEvt = new Event("keybindingchanged"),
    audioPropsChangedEvt = new Event("audiopropschanged"),
    toggleVideoEvt = new Event("videoenablechanged"),
    videoInputChangedEvt = new Event("videoinputchanged");

export class OptionsForm extends FormDialog {
    constructor() {
        super("options", "Options");

        const _ = (evt) => () => this.dispatchEvent(evt);

        this.confirmButton = this.element.appendChild(Button(
            className("confirm"),
            style({ gridArea: "3/3" }),
            systemFont,
            "OK"));

        const avatarURL = LabeledInput(
            "avatarURL",
            "text",
            "Avatar URL: ",
            placeHolder("https://example.com/me.png"),
            onInput(_(avatarUrlChangedEvt))),

            avatarEmojiPreview = Span(bust.value),
            avatarEmoji = Div(
                Label(
                    htmlFor("selectAvatarEmoji"),
                    "Avatar Emoji: "),
                avatarEmojiPreview,
                Button(
                    id("selectAvatarEmoji"),
                    "Select",
                    onClick(_(selectAvatarEvt)))),

            fontSize = LabeledInput(
                "fontSize",
                "number",
                "Font size: ",
                value(10),
                min(5),
                max(32),
                style({ width: "3em" }),
                onInput(_(fontSizeChangedEvt))),

            bindingChanged = onInput(_(inputBindingChangedEvt)),
            keyUp = LabeledInput(
                "keyButtonUp",
                "text",
                "Up: ",
                keyWidthStyle,
                bindingChanged),
            keyDown = LabeledInput(
                "keyButtonDown",
                "text",
                "Down: ",
                keyWidthStyle,
                bindingChanged),
            keyLeft = LabeledInput(
                "keyButtonLeft",
                "text",
                "Left: ",
                keyWidthStyle,
                bindingChanged),
            keyRight = LabeledInput(
                "keyButtonRight",
                "text",
                "Right: ",
                keyWidthStyle,
                bindingChanged),
            keyEmote = LabeledInput(
                "keyButtonEmote",
                "text",
                "Emote: ",
                keyWidthStyle,
                bindingChanged),
            keyToggleAudio = LabeledInput(
                "keyButtonToggleAudio",
                "text",
                "Toggle audio: ",
                keyWidthStyle,
                bindingChanged),

            gpSelect = LabeledSelectBox(
                "gamepads",
                "Use gamepad: ",
                "No gamepads available",
                onInput(_(gamepadChangedEvt))),
            gpUp = LabeledInput(
                "gpButtonUp",
                "text",
                "Up: ",
                numberWidthStyle,
                bindingChanged),
            gpDown = LabeledInput(
                "gpButtonDown",
                "text",
                "Down: ",
                numberWidthStyle,
                bindingChanged),
            gpLeft = LabeledInput(
                "gpButtonLeft",
                "text",
                "Left: ",
                numberWidthStyle,
                bindingChanged),
            gpRight = LabeledInput(
                "gpButtonRight",
                "text",
                "Right: ",
                numberWidthStyle,
                bindingChanged),
            gpEmote = LabeledInput(
                "gpButtonEmote",
                "text",
                "Emote: ",
                numberWidthStyle,
                bindingChanged),
            gpToggleAudio = LabeledInput(
                "gpButtonToggleAudio",
                "text",
                "Toggle audio: ",
                numberWidthStyle),

            audioInputSelect = LabeledSelectBox(
                "audioInputDevices",
                "Input: ",
                "No audio input devices available"),
            audioOutputSelect = LabeledSelectBox(
                "audioOutputDevices",
                "Output: ",
                "No audio output devices available"),

            drawHearingCheck = LabeledInput(
                "drawHearing",
                "checkbox",
                "Draw hearing range: "),

            audioPropsChanged = onInput(_(audioPropsChangedEvt)),
            minAudio = LabeledInput(
                "minAudio",
                "number",
                "Min: ",
                value(2),
                min(0),
                max(100),
                numberWidthStyle,
                audioPropsChanged),
            maxAudio = LabeledInput(
                "maxAudio",
                "number",
                "Min: ",
                value(10),
                min(0),
                max(100),
                numberWidthStyle,
                audioPropsChanged),
            rolloff = LabeledInput(
                "rollof",
                "number",
                "Rollof: ",
                value(5),
                min(0.1),
                max(10),
                step(0.1),
                numberWidthStyle,
                audioPropsChanged),

            enableVideo = Button(
                accessKey("v"),
                "Enable video",
                onClick(_(toggleVideoEvt))),
            videoInputDevices = LabeledSelectBox(
                "videoInputDevices",
                "Device: ",
                "No video input devices available",
                onInput(_(videoInputChangedEvt)));

        this.content.append(
            H2("Avatar"),
            P(avatarURL, " or ", avatarEmoji),

            H2("Interface"),
            P(fontSize),

            H2("Input"),

            H3("Keyboard"),
            P(keyUp,
                keyDown,
                keyLeft,
                keyRight),
            P(keyEmote,
                keyToggleAudio),

            H3("Gamepad"),
            P(gpSelect),
            P(gpUp,
                gpDown,
                gpLeft,
                gpRight),
            P(gpEmote,
                gpToggleAudio),

            H2("Audio"),
            P(audioInputSelect),
            P(audioOutputSelect),
            P(drawHearingCheck,
                minAudio,
                maxAudio,
                rolloff),

            H2("Video"),
            P(enableVideo),
            P(videoInputDevices));

        Object.seal(this);
    }

    async showAsync() {
        this.show();
        await this.confirmButton.once("click");
        this.hide();
        return false;
    }
}