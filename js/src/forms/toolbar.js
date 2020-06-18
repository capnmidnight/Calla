import {
    Button,
    Div,
    Img,
    Input,
    KBD,
    Label,
    Span
} from "../html/tags.js";
import {
    alt,
    htmlFor,
    id,
    min,
    max,
    role,
    src,
    step,
    style,
    title,
    type,
    value,
    systemFont
} from "../html/attrs.js";
import {
    onClick,
    onInput
} from "../html/evts.js";

import {
    mutedSpeaker,
    speakerHighVolume,
    gear,
    downwardsButton,
    pauseButton,
    playButton
} from "../emoji.js";

function Run(txt) {
    return Span(
        style({ margin: "auto" }),
        txt);
}

const toggleAudioEvt = new Event("toggleaudio"),
    emoteEvt = new Event("emote"),
    selectEmojiEvt = new Event("selectemoji"),
    zoomChangedEvt = new Event("zoomchanged"),
    optionsEvt = new Event("options"),
    tweetEvt = new Event("tweet"),
    leaveEvt = new Event("leave"),
    toggleUIEvt = new Event("toggleui"),
    subelStyle = style({
        display: "inline-flex",
        margin: "0 0.5em 0 0"
    });

export class ToolBar extends EventTarget {
    constructor() {
        super();

        const _ = (evt) => () => this.dispatchEvent(evt);

        this.element = Div(
            id("toolbar"),
            style({
                position: "fixed",
                top: 0,
                right: 0,
                backgroundColor: "#bbb",
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap"
            }),

            this.toolbar = Div(
                style({
                    display: "flex",
                    width: "100vw",
                    padding: "4px",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    boxSizing: "border-box"
                }),
                systemFont,

                this.muteAudioButton = Button(
                    onClick(_(toggleAudioEvt)),
                    subelStyle,
                    systemFont,
                    speakerHighVolume.value),

                this.emojiControl = Span(
                    subelStyle,
                    this.emoteButton = Button(
                        title("Emote"),
                        onClick(_(emoteEvt)),
                        systemFont,
                        "Emote ",
                        KBD("(E)"),
                        "(@)"),
                    Button(
                        title("Select Emoji"),
                        systemFont,
                        onClick(_(selectEmojiEvt)),
                        downwardsButton.value)),

                Span(
                    subelStyle,
                    Label(
                        htmlFor("zoom"),
                        style({ margin: "auto" }),
                        "Zoom"),
                    this.zoomSpinner = Input(
                        type("number"),
                        id("zoom"),
                        title("Change map zoom"),
                        value(1),
                        min(0.1),
                        max(8),
                        step(0.1),
                        style({ width: "4em" }),
                        systemFont,
                        onInput(_(zoomChangedEvt)))),

                Button(
                    title("Show/hide options"),
                    onClick(_(optionsEvt)),
                    subelStyle,
                    systemFont,
                    gear.value),

                Button(
                    title("Share your current room to twitter"),
                    onClick(_(tweetEvt)),
                    subelStyle,
                    systemFont,
                    Run("Share room"),
                    Img(src("https://cdn2.iconfinder.com/data/icons/minimalism/512/twitter.png"),
                        alt("icon"),
                        role("presentation"),
                        style({ height: "1.5em" }))),
                Button(
                    title("Leave the room"),
                    onClick(_(leaveEvt)),
                    subelStyle,
                    systemFont,
                    Run("Leave"))),
            this.hideButton = Button(
                title("Show/hide Jitsi Meet interface"),
                style({
                    position: "absolute",
                    right: 0,
                    margin: "4px"
                }),
                systemFont,
                onClick(() => this.visible = !this.visible),
                onClick(_(toggleUIEvt)),
                Run(pauseButton.value)));

        Object.seal(this);
    }

    get offsetHeight() {
        return this.toolbar.offsetHeight;
    }

    get zoom() {
        return this.zoomSpinner.value;
    }

    set zoom(value) {
        this.zoomSpinner.value = Math.round(value * 100) / 100;
    }

    get visible() {
        return this.toolbar.style.display !== "none";
    }

    set visible(value) {
        this.toolbar.setOpenWithLabel(
            value,
            this.hideButton,
            pauseButton.value,
            playButton.value);
    }

    hide() {
        this.visible = false;
    }

    show() {
        this.visible = true;
    }

    setAudioMuted(muted) {
        this.muteAudioButton.updateLabel(
            muted,
            mutedSpeaker.value,
            speakerHighVolume.value);
    }

    appendChild(child) {
        return this.toolbar.appendChild(child);
    }

    insertBefore(newChild, refChild) {
        return this.toolbar.insertBefore(newChild, refChild);
    }

    append(...children) {
        this.toolbar.append(...children);
    }

    setEmojiButton(key, value) {
        this.emoteButton.innerHTML = `Emote (<kbd>${key.toUpperCase()}</kbd>) (${value})`
    }
}