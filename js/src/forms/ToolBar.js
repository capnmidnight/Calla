import { downwardsButton, gear, mutedSpeaker, speakerHighVolume, questionMark, door } from "../emoji/emoji.js";
import { alt, htmlFor, id, max, min, role, src, step, style, title, type, value } from "../html/attrs.js";
import { onClick, onInput } from "../html/evts.js";
import { Button, Div, Img, Input, KBD, Label, Span } from "../html/tags.js";


function Run(...rest) {
    return Span(
        style({ margin: "auto" }),
        ...rest);
}

const toggleAudioEvt = new Event("toggleAudio"),
    emoteEvt = new Event("emote"),
    selectEmojiEvt = new Event("selectEmoji"),
    zoomChangedEvt = new Event("zoomChanged"),
    toggleOptionsEvt = new Event("toggleOptions"),
    tweetEvt = new Event("tweet"),
    leaveEvt = new Event("leave"),
    toggleInstructionsEvt = new Event("toggleInstructions"),
    subelStyle = style({
        display: "inline-flex",
        margin: "0 0.5em 0 0",
        textAlign: "center",
        fontSize: "150%"
    });

/**
 * 
 * @param {number} n
 */
function col(n, m) {
    if (m === undefined) {
        m = n + 1;
    }

    return style({
        gridColumnStart: n,
        gridColumnEnd: m
    });
}

/**
 * 
 * @param {number} n
 */
function row(n, m) {
    if (m === undefined) {
        m = n + 1;
    }

    return style({
        gridRowStart: n,
        gridRowEnd: m
    });
}

/**
 * 
 * @param {number} x
 * @param {number} y
 */
function grid(x, y, w, h) {
    if (w === undefined) {
        w = 1;
    }

    if (h === undefined) {
        h = 1;
    }

    return style({
        gridRowStart: y,
        gridRowEnd: y + h,
        gridColumnStart: x,
        gridColumnEnd: x + w
    });
}

export class ToolBar extends EventTarget {
    constructor() {
        super();

        const _ = (evt) => () => this.dispatchEvent(evt);

        this.element = Div(
            id("toolbar"),
            style({
                position: "fixed",
                display: "grid",
                padding: "4px",
                top: 0,
                right: 0,
                width: "100vw",
                gridTemplateColumns: "4em auto 4em 4em 4em 1em 4em",
                backgroundColor: "#bbb"
            }),


            this.muteAudioButton = Button(
                onClick(_(toggleAudioEvt)),
                grid(1, 1),
                subelStyle,
                Run(speakerHighVolume.value)),

            Span(
                grid(2, 1),
                style({ textAlign: "center" }),
                this.emojiControl = Span(
                    Button(
                        title("Emote"),
                        subelStyle,
                        onClick(_(emoteEvt)),
                        this.emoteButton = Run(
                            "Emote ",
                            KBD("(E)"),
                            "(@)")),
                    Button(
                        title("Select Emoji"),
                        subelStyle,
                        onClick(_(selectEmojiEvt)),
                        Run(downwardsButton.value))),

                Span(
                    Label(
                        htmlFor("zoom"),
                        subelStyle,
                        style({ margin: "auto" }),
                        "Zoom"),
                    this.zoomSpinner = Input(
                        type("number"),
                        id("zoom"),
                        subelStyle,
                        title("Change map zoom"),
                        value(2),
                        min(0.1),
                        max(8),
                        step(0.1),
                        style({ width: "4em" }),
                        onInput(_(zoomChangedEvt))))),

            Button(
                title("Share your current room to twitter"),
                onClick(_(tweetEvt)),
                subelStyle,
                grid(3, 1),
                Run(
                    Img(src("https://cdn2.iconfinder.com/data/icons/minimalism/512/twitter.png"),
                        alt("icon"),
                        role("presentation"),
                        style({ height: "1.5em" })))),

            this.optionsButton = Button(
                title("Show/hide options"),
                onClick(_(toggleOptionsEvt)),
                subelStyle,
                grid(4, 1),
                Run(gear.value)),

            this.instructionsButton = Button(
                title("Show/hide instructions"),
                onClick(_(toggleInstructionsEvt)),
                subelStyle,
                grid(5, 1),
                Run(questionMark.value)),

            Button(
                title("Leave the room"),
                onClick(_(leaveEvt)),
                subelStyle,
                grid(7, 1),
                Run(door.value)));

        this._audioEnabled = true;

        Object.seal(this);
    }

    get offsetHeight() {
        return this.element.offsetHeight;
    }

    get zoom() {
        return this.zoomSpinner.value;
    }

    set zoom(value) {
        this.zoomSpinner.value = Math.round(value * 100) / 100;
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

    appendChild(child) {
        return this.element.appendChild(child);
    }

    insertBefore(newChild, refChild) {
        return this.element.insertBefore(newChild, refChild);
    }

    append(...children) {
        this.element.append(...children);
    }

    setEmojiButton(key, emoji) {
        this.emoteButton.innerHTML = `Emote (<kbd>${key.toUpperCase()}</kbd>) (${emoji.value})`
    }
}