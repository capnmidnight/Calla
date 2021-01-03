import { door, downRightArrow, gear, magnifyingGlassTiltedLeft, magnifyingGlassTiltedRight, mutedSpeaker, noMobilePhone, questionMark, speakerHighVolume, speakingHead, squareFourCourners, upwardsButton, videoCamera, whiteFlower } from "kudzu/emoji/emojis";
import { TypedEvent, TypedEventBase } from "kudzu/events/EventBase";
import { alt, className, height as cssHeight, id, margin, max, min, role, src, step, textAlign, title, value } from "kudzu/html/attrs";
import { onClick, onInput } from "kudzu/html/evts";
import { Button, Div, Img, InputRange, Run } from "kudzu/html/tags";
import { updateLabel } from "./ops";
const toggleOptionsEvt = new TypedEvent("toggleOptions"), tweetEvt = new TypedEvent("tweet"), leaveEvt = new TypedEvent("leave"), toggleFullscreenEvt = new TypedEvent("toggleFullscreen"), toggleInstructionsEvt = new TypedEvent("toggleInstructions"), toggleUserDirectoryEvt = new TypedEvent("toggleUserDirectory"), toggleAudioEvt = new TypedEvent("toggleAudio"), toggleVideoEvt = new TypedEvent("toggleVideo"), changeDevicesEvt = new TypedEvent("changeDevices"), emoteEvt = new TypedEvent("emote"), selectEmojiEvt = new TypedEvent("selectEmoji"), zoomChangedEvt = new TypedEvent("zoomChanged");
export class ButtonLayer extends TypedEventBase {
    constructor(zoomMin, zoomMax) {
        super();
        this._audioEnabled = true;
        this._videoEnabled = false;
        const changeZoom = (dz) => {
            this.zoom += dz;
            this.dispatchEvent(zoomChangedEvt);
        };
        this.element = Div(id("controls"));
        this.element.append(this.optionsButton = Button(id("optionsButton"), title("Show/hide options"), onClick(() => this.dispatchEvent(toggleOptionsEvt)), Run(gear.value), Run("Options")), this.instructionsButton = Button(id("instructionsButton"), title("Show/hide instructions"), onClick(() => this.dispatchEvent(toggleInstructionsEvt)), Run(questionMark.value), Run("Info")), this.shareButton = Button(id("shareButton"), title("Share your current room to twitter"), onClick(() => this.dispatchEvent(tweetEvt)), Img(src("https://cdn2.iconfinder.com/data/icons/minimalism/512/twitter.png"), alt("icon"), role("presentation"), cssHeight("25px"), margin("2px auto -2px auto")), Run("Tweet")), this.showUsersButton = Button(id("showUsersButton"), title("View user directory"), onClick(() => this.dispatchEvent(toggleUserDirectoryEvt)), Run(speakingHead.value), Run("Users")), this.fullscreenButton = Button(id("fullscreenButton"), title("Toggle fullscreen"), onClick(() => this.dispatchEvent(toggleFullscreenEvt)), onClick(() => this.isFullscreen = !this.isFullscreen), Run(squareFourCourners.value), Run("Expand")), this.leaveButton = Button(id("leaveButton"), title("Leave the room"), onClick(() => this.dispatchEvent(leaveEvt)), Run(door.value), Run("Leave")), Div(id("toggleAudioControl"), className("comboButton"), this.toggleAudioButton = Button(id("toggleAudioButton"), title("Toggle audio mute/unmute"), onClick(() => this.dispatchEvent(toggleAudioEvt)), this.toggleAudioLabel = Run(speakerHighVolume.value), Run("Audio")), this.toggleVideoButton = Button(id("toggleVideoButton"), title("Toggle video mute/unmute"), onClick(() => this.dispatchEvent(toggleVideoEvt)), this.toggleVideoLabel = Run(noMobilePhone.value), Run("Video")), this.changeDevicesButton = Button(id("changeDevicesButton"), title("Change devices"), onClick(() => this.dispatchEvent(changeDevicesEvt)), Run(upwardsButton.value), Run("Change"))), Div(id("emojiControl"), className("comboButton"), textAlign("center"), Button(id("emoteButton"), title("Emote"), onClick(() => this.dispatchEvent(emoteEvt)), this.emoteButton = Run(whiteFlower.value), Run("Emote")), Button(id("selectEmoteButton"), title("Select Emoji"), onClick(() => this.dispatchEvent(selectEmojiEvt)), Run(upwardsButton.value), Run("Change"))), this.zoomInButton = Button(id("zoomInButton"), title("Zoom in"), onClick(() => changeZoom(0.5)), Run(magnifyingGlassTiltedLeft.value), Run("+")), Div(id("zoomSliderContainer"), this.slider = InputRange(id("zoomSlider"), title("Zoom"), min(zoomMin), max(zoomMax), step(0.1), value("0"), onInput(() => this.dispatchEvent(zoomChangedEvt)))), this.zoomOutButton = Button(id("zoomOutButton"), title("Zoom out"), onClick(() => changeZoom(-0.5)), Run(magnifyingGlassTiltedRight.value), Run("-")));
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
        updateLabel(this.fullscreenButton, value, downRightArrow.value, squareFourCourners.value);
    }
    get style() {
        return this.element.style;
    }
    isOpen() {
        return this.style.display !== "none";
    }
    setOpen(v, displayType) {
        this.style.display = v
            ? displayType || ""
            : "none";
    }
    toggleOpen(displayType) {
        this.setOpen(!this.isOpen(), displayType);
    }
    hide() {
        this.setOpen(false);
    }
    show() {
        this.setOpen(true);
    }
    get enabled() {
        return !this.instructionsButton.disabled;
    }
    set enabled(v) {
        const buttons = this.element.querySelectorAll("button");
        for (let i = 0; i < buttons.length; ++i) {
            buttons[i].disabled = !v;
        }
    }
    get audioEnabled() {
        return this._audioEnabled;
    }
    set audioEnabled(value) {
        this._audioEnabled = value;
        updateLabel(this.toggleAudioLabel, value, speakerHighVolume.value, mutedSpeaker.value);
    }
    get videoEnabled() {
        return this._videoEnabled;
    }
    set videoEnabled(value) {
        this._videoEnabled = value;
        updateLabel(this.toggleVideoLabel, value, videoCamera.value, noMobilePhone.value);
    }
    setEmojiButton(emoji) {
        this.emoteButton.innerHTML = emoji.value;
    }
    get zoom() {
        return parseFloat(this.slider.value);
    }
    set zoom(v) {
        this.slider.value = v.toFixed(3);
    }
}
//# sourceMappingURL=ButtonLayer.js.map