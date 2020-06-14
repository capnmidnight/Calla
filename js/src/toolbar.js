import {
    Button,
    Div,
    Img,
    Input,
    KBD,
    Label,
    Span
} from "./htmltags.js";
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
    systemFamily
} from "./htmlattrs.js";
import {
    onClick,
    onInput
} from "./htmlevts.js";

import {
    mutedSpeaker,
    speakerHighVolume,
    gear,
    downwardsButton,
    pauseButton,
    playButton
} from "./emoji.js";

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
    }),
    sysFontStyle = style({ fontFamily: systemFamily });

export class ToolBar extends EventTarget {
    constructor() {
        super();

        this.toolbar = Div(
            style({
                display: "flex",
                width: "100vw",
                padding: "4px",
                flexDirection: "row",
                flexWrap: "wrap",
                boxSizing: "border-box"
            }),
            sysFontStyle);

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
            this.toolbar);

        const _ = (evt) => () => this.dispatchEvent(evt);

        // >>>>>>>>>> AUDIO >>>>>>>>>>
        this.muteAudioButton = this.toolbar.appendChild(Button(
            onClick(_(toggleAudioEvt)),
            subelStyle,
            sysFontStyle,
            speakerHighVolume.value));
        // <<<<<<<<<< AUDIO <<<<<<<<<<

        // >>>>>>>>>> EMOJI >>>>>>>>>>
        const emojiControl = this.toolbar.appendChild(Span(subelStyle));

        this.emoteButton = emojiControl.appendChild(Button(
            title("Emote"),
            onClick(_(emoteEvt)),
            sysFontStyle,
            "Emote ",
            KBD("(E)"),
            "(@)"));

        emojiControl.appendChild(Button(
            title("Select Emoji"),
            sysFontStyle,
            onClick(_(selectEmojiEvt)),
            downwardsButton.value));
        // <<<<<<<<<< EMOJI <<<<<<<<<<

        // >>>>>>>>>> ZOOM >>>>>>>>>>
        const zoomControl = this.toolbar.appendChild(Span(
            subelStyle,
            Label(
                htmlFor("zoom"),
                style({ margin: "auto" }),
                "Zoom")));

        this.zoomSpinner = zoomControl.appendChild(Input(
            type("number"),
            id("zoom"),
            title("Change map zoom"),
            value(1),
            min(0.1),
            max(8),
            step(0.1),
            style({ width: "4em" }),
            sysFontStyle,
            onInput(_(zoomChangedEvt))));
        // <<<<<<<<<< ZOOM <<<<<<<<<<

        // >>>>>>>>>> OPTIONS >>>>>>>>>>
        this.toolbar.appendChild(Button(
            title("Show/hide options"),
            onClick(_(optionsEvt)),
            subelStyle,
            sysFontStyle,
            gear.value));
        // <<<<<<<<<< OPTIONS <<<<<<<<<<

        // >>>>>>>>>> TWEET >>>>>>>>>>
        this.toolbar.appendChild(Button(
            title("Share your current room to twitter"),
            onClick(_(tweetEvt)),
            subelStyle,
            sysFontStyle,
            Run("Share room"),
            Img(src("https://cdn2.iconfinder.com/data/icons/minimalism/512/twitter.png"),
                alt("icon"),
                role("presentation"),
                style({ height: "1.5em" }))));
        // <<<<<<<<<< TWEET <<<<<<<<<<

        // >>>>>>>>>> LOGIN >>>>>>>>>>
        this.toolbar.appendChild(Button(
            title("Leave the room"),
            onClick(_(leaveEvt)),
            subelStyle,
            sysFontStyle,
            Run("Leave")));
        // <<<<<<<<<< LOGIN <<<<<<<<<<

        // >>>>>>>>>> HIDER >>>>>>>>>>
        this.hideButton = this.element.appendChild(Button(
            title("Show/hide Jitsi Meet interface"),
            style({
                position: "absolute",
                right: 0,
                margin: "4px"
            }),
            sysFontStyle,
            onClick(() => this.visible = !this.visible),
            onClick(_(toggleUIEvt)),
            Run(pauseButton.value)));
        // <<<<<<<<<< HIDER <<<<<<<<<<

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