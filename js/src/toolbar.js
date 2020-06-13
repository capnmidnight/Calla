import {
    div,
    button,
    kbd,
    span,
    input,
    label,
    run,
    img,
    a
} from "./html.js";

import {
    mutedSpeaker,
    speakerHighVolume
} from "./emoji.js";

const toggleAudioEvt = new Event("toggleaudio"),
    emoteEvt = new Event("emote"),
    selectEmojiEvt = new Event("selectemoji"),
    zoomChangedEvt = new Event("zoomchanged"),
    optionsEvt = new Event("options"),
    tweetEvt = new Event("tweet"),
    leaveEvt = new Event("leave");

export class ToolBar extends EventTarget {
    constructor() {
        super();

        this.element = div({ id: "toolbar" });

        const _ = (evt) => () => this.dispatchEvent(evt);

        // >>>>>>>>>> AUDIO >>>>>>>>>>
        this.muteAudioButton = button({
            onclick: _(toggleAudioEvt)
        }, "🔊");
        this.element.appendChild(this.muteAudioButton);
        // <<<<<<<<<< AUDIO <<<<<<<<<<

        // >>>>>>>>>> EMOJI >>>>>>>>>>
        this.emoteButton = button(
            {
                title: "Emote",
                onclick: _(emoteEvt)
            },
            "Emote ",
            kbd("(E)"),
            "(@)");

        const selectEmojiButton = button({
            title: "Select Emoji",
            onclick: _(selectEmojiEvt)
        }, "🔻");

        this.element.appendChild(span(this.emoteButton, selectEmojiButton));
        // <<<<<<<<<< EMOJI <<<<<<<<<<

        // >>>>>>>>>> ZOOM >>>>>>>>>>
        this.zoomSpinner = input({
            type: "number",
            id: "zoom",
            title: "Change map zoom",
            value: 1,
            min: 0.1,
            max: 8,
            step: 0.1,
            style: { width: "4em" },
            oninput: _(zoomChangedEvt)
        });

        this.element.appendChild(span(
            label({ for: "zoom" }, "Zoom"),
            this.zoomSpinner));
        // <<<<<<<<<< ZOOM <<<<<<<<<<

        // >>>>>>>>>> OPTIONS >>>>>>>>>>
        this.element.appendChild(button({
            title: "Show/hide options",
            onclick: _(optionsEvt)
        }, "⚙️"));
        // <<<<<<<<<< OPTIONS <<<<<<<<<<

        // >>>>>>>>>> TWEET >>>>>>>>>>
        this.element.appendChild(button(
            {
                title: "Share your current room to twitter",
                onclick: _(tweetEvt)
            },
            run("Share room"),
            img({
                src: "https://cdn2.iconfinder.com/data/icons/minimalism/512/twitter.png",
                alt: "icon",
                role: "presentation",
                style: { height: "1.5em" }
            })));
        // <<<<<<<<<< TWEET <<<<<<<<<<

        // >>>>>>>>>> LOGIN >>>>>>>>>>
        this.element.appendChild(button(
            {
                title: "Leave the room",
                onclick: _(leaveEvt)
            },
            run("Leave")));
        // <<<<<<<<<< LOGIN <<<<<<<<<<
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

    setAudioMuted(muted) {
        this.muteAudioButton.updateLabel(
            muted,
            mutedSpeaker.value,
            speakerHighVolume.value);
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

    setEmojiButton(key, value) {
        this.emoteButton.innerHTML = `Emote (<kbd>${key.toUpperCase()}</kbd>) (${value})`
    }

    advertise() {
        this.appendChild(a({
            href: "https://github.com/capnmidnight/Calla",
            target: "_blank",
            rel: "noopener",
            ariaLabel: "Follow Calla on Git Hub",
            title: "Follow Calla on GitHub"
        },
            span({
                className: "icon icon-github",
                role: "presentation"
            })));

        this.appendChild(a({
            href: "https://twitter.com/Sean_McBeth",
            target: "_blank",
            rel: "noopener",
            ariaLabel: "Follow Sean on Twitter",
            title: "Follow @Sean_McBeth on Twitter"
        },
            span({
                className: "icon icon-twitter",
                role: "presentation"
            })));
    }
}