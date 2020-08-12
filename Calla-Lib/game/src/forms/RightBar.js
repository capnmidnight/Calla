import { EventBase } from "../../../js/src/index.js";
import { magnifyingGlassTiltedLeft, magnifyingGlassTiltedRight } from "../emoji/emojis.js";
import { id, max, min, step, title, value } from "../html/attrs.js";
import { backgroundColor, columnGap, cssHeight, cssWidth, fontSize, left, padding, pointerEvents, position, styles, textAlign, transform } from "../html/css.js";
import { onClick, onInput } from "../html/evts.js";
import { gridPos, gridRowsDef } from "../html/grid.js";
import { Button, Div, InputRange, Run } from "../html/tags.js";

const zoomChangedEvt = new Event("zoomChanged"),
    buttonStyle = styles(
        pointerEvents("all"),
        fontSize("1.25em"),
        position("relative"),
        left("calc(100% - 3em)"),
        cssWidth("3em"),
        cssHeight("100%")),
    buttonLabelStyle = fontSize("12px");

export class RightBar extends EventBase {
    constructor() {
        super();

        const _ = (evt) => () => this.dispatchEvent(evt);

        this.element = Div(
            id("rightbar"),
            gridRowsDef("auto", "1fr", "auto", "3fr"),
            padding("4px"),
            columnGap("5px"),
            textAlign("right"),
            backgroundColor("transparent"),
            pointerEvents("none"),

            this.zoomInButton = Button(
                title("Zoom in"),
                onClick(() => this.zoom += 0.5),
                onClick(_(zoomChangedEvt)),
                buttonStyle,
                gridPos(1, 1),
                Run(magnifyingGlassTiltedLeft.value),
                Run(buttonLabelStyle, "Zoom in")),

            this.slider = InputRange(
                title("Zoom"),
                min(0.1),
                max(8),
                step(0.1),
                value(0),
                onInput(_(zoomChangedEvt)),
                buttonStyle,
                transform("rotate(-90deg)"),
                gridPos(1, 2)),


            this.zoomOutButton = Button(
                title("Zoom out"),
                onClick(() => this.zoom -= 0.5),
                onClick(_(zoomChangedEvt)),
                buttonStyle,
                gridPos(1, 3),
                Run(magnifyingGlassTiltedRight.value),
                Run(buttonLabelStyle, "Zoom out")));

        Object.seal(this);
    }

    get zoom() {
        return parseFloat(this.slider.value);
    }

    /** @type {number} */
    set zoom(v) {
        this.slider.value = v;
    }
}