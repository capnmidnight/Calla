import { door, downRightArrow, gear, questionMark, speakingHead, squareFourCourners } from "../emoji/emoji.js";
import { alt, gridSpan, gridCols, id, role, src, style, title } from "../html/attrs.js";
import { onClick } from "../html/evts.js";
import { Button, Div, Img } from "../html/tags.js";


function Run(...rest) {
    return Div(
        style({ margin: "auto" }),
        ...rest);
}

const toggleOptionsEvt = new Event("toggleOptions"),
    tweetEvt = new Event("tweet"),
    leaveEvt = new Event("leave"),
    toggleFullscreenEvt = new Event("toggleFullscreen"),
    toggleInstructionsEvt = new Event("toggleInstructions"),
    toggleUserDirectoryEvt = new Event("toggleUserDirectory"),
    subelStyle = style({
        fontSize: "1.25em",
        width: "3em",
        height: "100%",
        pointerEvents: "all"
    }),
    buttonLabelStyle = style({
        fontSize: "12px"
    });

export class HeaderBar extends EventTarget {
    constructor() {
        super();

        const _ = (evt) => () => this.dispatchEvent(evt);

        this.element = Div(
            id("headbar"),
            gridCols("auto", "auto", "auto", "auto", "1fr", "auto", "auto"),
            style({
                padding: "4px",
                width: "100%",
                columnGap: "5px",
                backgroundColor: "transparent",
                pointerEvents: "none"
            }),

            this.optionsButton = Button(
                title("Show/hide options"),
                onClick(_(toggleOptionsEvt)),
                subelStyle,
                gridSpan(1, 1),
                Run(gear.value),
                Run(buttonLabelStyle, "Options")),

            this.instructionsButton = Button(
                title("Show/hide instructions"),
                onClick(_(toggleInstructionsEvt)),
                subelStyle,
                gridSpan(2, 1),
                Run(questionMark.value),
                Run(buttonLabelStyle, "Info")),

            Button(
                title("Share your current room to twitter"),
                onClick(_(tweetEvt)),
                subelStyle,
                gridSpan(3, 1),
                Img(src("https://cdn2.iconfinder.com/data/icons/minimalism/512/twitter.png"),
                    alt("icon"),
                    role("presentation"),
                    style({ height: "25px", marginBottom: "-7px" })),
                Run(buttonLabelStyle, "Tweet")),

            Button(
                title("View user directory"),
                onClick(_(toggleUserDirectoryEvt)),
                subelStyle,
                gridSpan(4, 1),
                Run(speakingHead.value),
                Run(buttonLabelStyle, "Users")),


            this.fullscreenButton = Button(
                title("Toggle fullscreen"),
                onClick(_(toggleFullscreenEvt)),
                onClick(() => this.isFullscreen = !this.isFullscreen),
                subelStyle,
                gridSpan(6, 1),
                Run(squareFourCourners.value),
                Run(buttonLabelStyle, "Expand")),


            Button(
                title("Leave the room"),
                onClick(_(leaveEvt)),
                subelStyle,
                gridSpan(7, 1),
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
        this.fullscreenButton.updateLabel(
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