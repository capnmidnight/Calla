import { door, gear, questionMark } from "../emoji/emoji.js";
import { alt, grid, id, role, src, style, title } from "../html/attrs.js";
import { onClick } from "../html/evts.js";
import { Button, Div, Img, Span } from "../html/tags.js";


function Run(...rest) {
    return Span(
        style({ margin: "auto" }),
        ...rest);
}

const toggleOptionsEvt = new Event("toggleOptions"),
    tweetEvt = new Event("tweet"),
    leaveEvt = new Event("leave"),
    toggleInstructionsEvt = new Event("toggleInstructions"),
    subelStyle = style({
        fontSize: "1.25em",
        width: "3em",
        height: "100%"
    });

export class HeaderBar extends EventTarget {
    constructor() {
        super();

        const _ = (evt) => () => this.dispatchEvent(evt);

        this.element = Div(
            id("headbar"),
            style({
                display: "grid",
                padding: "4px",
                width: "100%",
                gridTemplateColumns: "auto 1fr auto auto auto",
                columnGap: "5px",
                backgroundColor: "#bbb"
            }),


            Button(
                title("Leave the room"),
                onClick(_(leaveEvt)),
                subelStyle,
                grid(1, 1),
                Run(door.value)),

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

            this.instructionsButton = Button(
                title("Show/hide instructions"),
                onClick(_(toggleInstructionsEvt)),
                subelStyle,
                grid(4, 1),
                Run(questionMark.value)),

            this.optionsButton = Button(
                title("Show/hide options"),
                onClick(_(toggleOptionsEvt)),
                subelStyle,
                grid(5, 1),
                Run(gear.value)));

        Object.seal(this);
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