import { upwardsButton, mutedSpeaker, speakerHighVolume, mobilePhone, mobilePhoneOff } from "../emoji/emoji.js";
import { grid, id, style, title } from "../html/attrs.js";
import { onClick } from "../html/evts.js";
import { Button, Div, KBD, Span } from "../html/tags.js";


function Run(...rest) {
    return Span(
        style({ margin: "auto" }),
        ...rest);
}

const toggleAudioEvt = new Event("toggleAudio"),
    toggleVideoEvt = new Event("toggleVideo"),
    emoteEvt = new Event("emote"),
    selectEmojiEvt = new Event("selectEmoji"),
    subelStyle = style({
        fontSize: "1.25em",
        width: "3em",
        height: "100%"
    }),
    subButtonStyle = style({
        fontSize: "1.25em",
        height: "100%"
    });

export class FooterBar extends EventTarget {
    constructor() {
        super();

        const _ = (evt) => () => this.dispatchEvent(evt);

        /** @type {HTMLButtonElement} */
        this.muteAudioButton = null;

        this.element = Div(
            id("footbar"),
            style({
                gridTemplateColumns: "auto 1fr auto",
                display: "grid",
                padding: "4px",
                width: "100%",
                columnGap: "5px",
                backgroundColor: "transparent"
            }),

            this.muteAudioButton = Button(
                title("Toggle audio mute/unmute"),
                onClick(_(toggleAudioEvt)),
                grid(1, 1),
                subelStyle,
                Run(speakerHighVolume.value)),

            this.emojiControl = Span(
                grid(2, 1),
                style({ textAlign: "center" }),
                subButtonStyle,
                Button(
                    title("Emote"),
                    onClick(_(emoteEvt)),
                    subButtonStyle,
                    style({ borderRight: "none" }),
                    this.emoteButton = Run("Emote")),
                Button(
                    title("Select Emoji"),
                    onClick(_(selectEmojiEvt)),
                    subButtonStyle,
                    style({ borderLeft: "none" }),
                    Run(upwardsButton.value))),


            this.muteVideoButton = Button(
                title("Toggle video mute/unmute"),
                onClick(_(toggleVideoEvt)),
                grid(3, 1),
                subelStyle,
                Run(mobilePhoneOff.value)));

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
        this.muteAudioButton.updateLabel(
            value,
            speakerHighVolume.value,
            mutedSpeaker.value);
    }

    get videoEnabled() {
        return this._videoEnabled;
    }

    set videoEnabled(value) {
        this._videoEnabled = value;
        this.muteVideoButton.updateLabel(
            value,
            mobilePhone.value,
            mobilePhoneOff.value);
    }

    setEmojiButton(key, emoji) {
        this.emoteButton.innerHTML = emoji.value;
    }
}