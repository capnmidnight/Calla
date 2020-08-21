import { EventBase } from "../../calla/index.js";
import { door, downRightArrow, gear, magnifyingGlassTiltedLeft, magnifyingGlassTiltedRight, mutedSpeaker, noMobilePhone, questionMark, speakerHighVolume, speakingHead, squareFourCourners, upwardsButton, videoCamera, whiteFlower } from "../emoji/emojis.js";
import { alt, id, max, min, role, src, step, title, value, className } from "../html/attrs.js";
import { cssHeight, margin, textAlign } from "../html/css.js";
import { onClick, onInput } from "../html/evts.js";
import { updateLabel } from "../html/ops.js";
import { Button, Div, Img, InputRange, Run, Span } from "../html/tags.js";

const toggleOptionsEvt = new Event("toggleOptions"),
    tweetEvt = new Event("tweet"),
    leaveEvt = new Event("leave"),
    toggleFullscreenEvt = new Event("toggleFullscreen"),
    toggleInstructionsEvt = new Event("toggleInstructions"),
    toggleUserDirectoryEvt = new Event("toggleUserDirectory"),
    toggleAudioEvt = new Event("toggleAudio"),
    toggleVideoEvt = new Event("toggleVideo"),
    changeDevicesEvt = new Event("changeDevices"),
    emoteEvt = new Event("emote"),
    selectEmojiEvt = new Event("selectEmoji"),
    zoomChangedEvt = new Event("zoomChanged");

export class ButtonLayer extends EventBase {
    constructor(targetCanvas, zoomMin, zoomMax) {
        super();

        const _ = (evt) => () => this.dispatchEvent(evt);

        const changeZoom = (dz) => {
            this.zoom += dz;
            this.dispatchEvent(zoomChangedEvt);
        };

        this.element = Div(id("controls"))

        this.element.append(

            this.optionsButton = Button(
                id("optionsButton"),
                title("Show/hide options"),
                onClick(_(toggleOptionsEvt)),
                Run(gear.value),
                Run("Options")),

            this.instructionsButton = Button(
                id("instructionsButton"),
                title("Show/hide instructions"),
                onClick(_(toggleInstructionsEvt)),
                Run(questionMark.value),
                Run("Info")),

            this.shareButton = Button(
                id("shareButton"),
                title("Share your current room to twitter"),
                onClick(_(tweetEvt)),
                Img(src("https://cdn2.iconfinder.com/data/icons/minimalism/512/twitter.png"),
                    alt("icon"),
                    role("presentation"),
                    cssHeight("25px"),
                    margin("2px auto -2px auto")),
                Run("Tweet")),

            this.showUsersButton = Button(
                id("showUsersButton"),
                title("View user directory"),
                onClick(_(toggleUserDirectoryEvt)),
                Run(speakingHead.value),
                Run("Users")),


            this.fullscreenButton = Button(
                id("fullscreenButton"),
                title("Toggle fullscreen"),
                onClick(_(toggleFullscreenEvt)),
                onClick(() => this.isFullscreen = !this.isFullscreen),
                Run(squareFourCourners.value),
                Run("Expand")),


            this.leaveButton = Button(
                id("leaveButton"),
                title("Leave the room"),
                onClick(_(leaveEvt)),
                Run(door.value),
                Run("Leave")),

            Div(
                id("toggleAudioControl"),
                className("comboButton"),
                this.toggleAudioButton = Button(
                    id("toggleAudioButton"),
                    title("Toggle audio mute/unmute"),
                    onClick(_(toggleAudioEvt)),
                    this.toggleAudioLabel = Run(speakerHighVolume.value),
                    Run("Audio")),
                this.toggleVideoButton = Button(
                    id("toggleVideoButton"),
                    title("Toggle video mute/unmute"),
                    onClick(_(toggleVideoEvt)),
                    this.toggleVideoLabel = Run(noMobilePhone.value),
                    Run("Video")),
                this.changeDevicesButton = Button(
                    id("changeDevicesButton"),
                    title("Change devices"),
                    onClick(_(changeDevicesEvt)),
                    Run(upwardsButton.value),
                    Run("Change"))),

            Div(
                id("emojiControl"),
                className("comboButton"),
                textAlign("center"),
                Button(
                    id("emoteButton"),
                    title("Emote"),
                    onClick(_(emoteEvt)),
                    this.emoteButton = Run(whiteFlower.value),
                    Run("Emote")),
                Button(
                    id("selectEmoteButton"),
                    title("Select Emoji"),
                    onClick(_(selectEmojiEvt)),
                    Run(upwardsButton.value),
                    Run("Change"))),

            this.zoomInButton = Button(
                id("zoomInButton"),
                title("Zoom in"),
                onClick(() => changeZoom(0.5)),
                Run(magnifyingGlassTiltedLeft.value),
                Run("+")),

            Div(id("zoomSliderContainer"),
                this.slider = InputRange(
                    id("zoomSlider"),
                    title("Zoom"),
                    min(zoomMin),
                    max(zoomMax),
                    step(0.1),
                    value(0),
                    onInput(() => this.dispatchEvent(zoomChangedEvt)))),


            this.zoomOutButton = Button(
                id("zoomOutButton"),
                title("Zoom out"),
                onClick(() => changeZoom(-0.5)),
                Run(magnifyingGlassTiltedRight.value),
                Run("-")));

        this._audioEnabled = true;
        this._videoEnabled = false;

        Object.seal(this);
    }

    get isFullscreen() {
        return document.fullscreenElement !== null;
    }

    set isFullscreen(value) {
        if (value) {
            document.body.requestFullscreen();
        }
        else {
            document.exitFullscreen();
        }
        updateLabel(
            this.fullscreenButton,
            value,
            downRightArrow.value,
            squareFourCourners.value);
    }

    hide() {
        this.element.style.display = "none";
    }

    show() {
        this.element.style.display = "";
    }

    get enabled() {
        return !this.instructionsButton.disabled;
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
            this.toggleAudioLabel,
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
            this.toggleVideoLabel,
            value,
            videoCamera.value,
            noMobilePhone.value);
    }

    setEmojiButton(key, emoji) {
        this.emoteButton.innerHTML = emoji.value;
    }

    get zoom() {
        return parseFloat(this.slider.value);
    }

    /** @type {number} */
    set zoom(v) {
        this.slider.value = v;
    }
}