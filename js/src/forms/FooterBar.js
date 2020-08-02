import { mutedSpeaker, noMobilePhone, speakerHighVolume, upwardsButton, videoCamera, whiteFlower } from "../emoji/emojis.js";
import { EventBase } from "../events/EventBase.js";
import { id, title } from "../html/attrs.js";
import { backgroundColor, borderLeft, borderRight, columnGap, cssHeight, cssWidth, fontSize, padding, pointerEvents, styles, textAlign } from "../html/css.js";
import { onClick } from "../html/evts.js";
import { gridColsDef, gridPos } from "../html/grid.js";
import { updateLabel } from "../html/ops.js";
import { Button, Div, Run, Span } from "../html/tags.js";

const toggleAudioEvt = new Event("toggleAudio"),
    toggleVideoEvt = new Event("toggleVideo"),
    emoteEvt = new Event("emote"),
    selectEmojiEvt = new Event("selectEmoji"),
    subelStyle = styles(
        fontSize("1.25em"),
        cssWidth("3em"),
        cssHeight("100%")),
    pointerEventsAll = pointerEvents("all"),
    subButtonStyle = styles(
        fontSize("1.25em"),
        cssHeight("100%")),
    buttonLabelStyle = fontSize("12px");

export class FooterBar extends EventBase {
    constructor() {
        super();

        const _ = (evt) => () => this.dispatchEvent(evt);

        /** @type {HTMLButtonElement} */
        this.muteAudioButton = null;

        this.element = Div(
            id("footbar"),
            gridColsDef("auto", "1fr", "auto"),
            padding("4px"),
            cssWidth("100%"),
            columnGap("5px"),
            backgroundColor("transparent"),
            pointerEvents("none"),

            Button(
                title("Toggle audio mute/unmute"),
                onClick(_(toggleAudioEvt)),
                gridPos(1, 1),
                subelStyle,
                pointerEventsAll,
                this.muteAudioButton = Run(speakerHighVolume.value),
                Run(buttonLabelStyle, "Audio")),

            this.emojiControl = Span(
                gridPos(2, 1),
                textAlign("center"),
                subButtonStyle,
                Button(
                    title("Emote"),
                    onClick(_(emoteEvt)),
                    subButtonStyle,
                    pointerEventsAll,
                    borderRight("none"),
                    this.emoteButton = Run(whiteFlower.value),
                    Run(buttonLabelStyle, "Emote")),
                Button(
                    title("Select Emoji"),
                    onClick(_(selectEmojiEvt)),
                    subButtonStyle,
                    pointerEventsAll,
                    borderLeft("none"),
                    Run(upwardsButton.value),
                    Run(buttonLabelStyle, "Change"))),


            Button(
                title("Toggle video mute/unmute"),
                onClick(_(toggleVideoEvt)),
                gridPos(3, 1),
                subelStyle,
                pointerEventsAll,
                this.muteVideoButton = Run(noMobilePhone.value),
                Run(buttonLabelStyle, "Video")));

        this._audioEnabled = true;
        this._videoEnabled = false;

        Object.seal(this);
    }

    get enabled() {
        return !this.muteAudioButton.disabled;
    }

    set enabled(v) {
        for (let button of this.element.querySelectorAll("button")) {
            button.disabled = !v;
        }
    }

    get audioEnabled() {
        return this._audioEnabled;
    }

    set audioEnabled(value) {
        this._audioEnabled = value;
        updateLabel(
            this.muteAudioButton,
            value,
            speakerHighVolume.value,
            mutedSpeaker.value);
    }

    get videoEnabled() {
        return this._videoEnabled;
    }

    set videoEnabled(value) {
        this._videoEnabled = value;
        updateLabel(
            this.muteVideoButton,
            value,
            videoCamera.value,
            noMobilePhone.value);
    }

    setEmojiButton(key, emoji) {
        this.emoteButton.innerHTML = emoji.value;
    }
}