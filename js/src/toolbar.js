import {
    A,
    Button,
    Div,
    Img,
    Input,
    KBD,
    Label,
    Run,
    Span,
    alt,
    ariaLabel,
    className,
    href,
    htmlFor,
    id,
    min,
    max,
    rel,
    role,
    src,
    step,
    style,
    target,
    title,
    type,
    value,
    onClick,
    onInput,
    systemFamily
} from "./html.js";

import {
    mutedSpeaker,
    speakerHighVolume,
    gear,
    downwardsButton,
    pauseButton,
    playButton
} from "./emoji.js";

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
        this.muteAudioButton = Button(
            onClick(_(toggleAudioEvt)),
            subelStyle,
            sysFontStyle,
            speakerHighVolume.value);
        this.toolbar.appendChild(this.muteAudioButton);
        // <<<<<<<<<< AUDIO <<<<<<<<<<

        // >>>>>>>>>> EMOJI >>>>>>>>>>
        this.emoteButton = Button(
            title("Emote"),
            onClick(_(emoteEvt)),
            sysFontStyle,
            "Emote ",
            KBD("(E)"),
            "(@)");

        const selectEmojiButton = Button(
            title("Select Emoji"),
            sysFontStyle,
            onClick(_(selectEmojiEvt)),
            downwardsButton.value);

        this.toolbar.appendChild(Span(
            subelStyle,
            this.emoteButton,
            selectEmojiButton));
        // <<<<<<<<<< EMOJI <<<<<<<<<<

        // >>>>>>>>>> ZOOM >>>>>>>>>>
        this.zoomSpinner = Input(
            type("number"),
            id("zoom"),
            title("Change map zoom"),
            value(1),
            min(0.1),
            max(8),
            step(0.1),
            style({ width: "4em" }),
            sysFontStyle,
            onInput(_(zoomChangedEvt)));

        this.toolbar.appendChild(Span(
            subelStyle,
            Label(
                htmlFor("zoom"),
                style({ margin: "auto" }),
                "Zoom"),
            this.zoomSpinner));
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

    advertise() {
        // GitHub link
        this.appendChild(A(
            href("https://github.com/capnmidnight/Calla"),
            target("_blank"),
            rel("noopener"),
            ariaLabel("Follow Calla on Git Hub"),
            title("Follow Calla on GitHub"),
            Span(
                className("icon icon-github"),
                role("presentation"))));

        // My own Twitter link
        this.appendChild(A(
            href("https://twitter.com/Sean_McBeth"),
            target("_blank"),
            rel("noopener"),
            ariaLabel("Follow Sean on Twitter"),
            title("Follow @Sean_McBeth on Twitter"),
            Span(
                className("icon icon-twitter"),
                role("presentation"))));
    }
}