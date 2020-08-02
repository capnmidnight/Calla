import { door, downRightArrow, gear, questionMark, speakingHead, squareFourCourners } from "../emoji/emojis.js";
import { EventBase } from "../events/EventBase.js";
import { alt, id, role, src, title } from "../html/attrs.js";
import { backgroundColor, columnGap, cssHeight, cssWidth, fontSize, marginBottom, padding, pointerEvents, styles } from "../html/css.js";
import { onClick } from "../html/evts.js";
import { gridColsDef, gridPos } from "../html/grid.js";
import { updateLabel } from "../html/ops.js";
import { Button, Div, Img, Run } from "../html/tags.js";

const toggleOptionsEvt = new Event("toggleOptions"),
    tweetEvt = new Event("tweet"),
    leaveEvt = new Event("leave"),
    toggleFullscreenEvt = new Event("toggleFullscreen"),
    toggleInstructionsEvt = new Event("toggleInstructions"),
    toggleUserDirectoryEvt = new Event("toggleUserDirectory"),
    subelStyle = styles(
        pointerEvents("all"),
        fontSize("1.25em"),
        cssWidth("3em"),
        cssHeight("100%")),
    buttonLabelStyle = fontSize("12px");

export class HeaderBar extends EventBase {
    constructor() {
        super();

        const _ = (evt) => () => this.dispatchEvent(evt);

        this.element = Div(
            id("headbar"),
            gridColsDef("auto", "auto", "auto", "auto", "1fr", "auto", "auto"),
            padding("4px"),
            cssWidth("100%"),
            columnGap("5px"),
            backgroundColor("transparent"),
            pointerEvents("none"),

            this.optionsButton = Button(
                title("Show/hide options"),
                onClick(_(toggleOptionsEvt)),
                subelStyle,
                gridPos(1, 1),
                Run(gear.value),
                Run(buttonLabelStyle, "Options")),

            this.instructionsButton = Button(
                title("Show/hide instructions"),
                onClick(_(toggleInstructionsEvt)),
                subelStyle,
                gridPos(2, 1),
                Run(questionMark.value),
                Run(buttonLabelStyle, "Info")),

            Button(
                title("Share your current room to twitter"),
                onClick(_(tweetEvt)),
                subelStyle,
                gridPos(3, 1),
                Img(src("https://cdn2.iconfinder.com/data/icons/minimalism/512/twitter.png"),
                    alt("icon"),
                    role("presentation"),
                    cssHeight("25px"),
                    marginBottom("-7px")),
                Run(buttonLabelStyle, "Tweet")),

            Button(
                title("View user directory"),
                onClick(_(toggleUserDirectoryEvt)),
                subelStyle,
                gridPos(4, 1),
                Run(speakingHead.value),
                Run(buttonLabelStyle, "Users")),


            this.fullscreenButton = Button(
                title("Toggle fullscreen"),
                onClick(_(toggleFullscreenEvt)),
                onClick(() => this.isFullscreen = !this.isFullscreen),
                subelStyle,
                gridPos(6, 1),
                Run(squareFourCourners.value),
                Run(buttonLabelStyle, "Expand")),


            Button(
                title("Leave the room"),
                onClick(_(leaveEvt)),
                subelStyle,
                gridPos(7, 1),
                Run(door.value),
                Run(buttonLabelStyle, "Leave")));

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

    get enabled() {
        return !this.instructionsButton.disabled;
    }

    set enabled(v) {
        for (let button of this.element.querySelectorAll("button")) {
            button.disabled = !v;
        }
    }
}