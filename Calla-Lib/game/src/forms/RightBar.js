import { EventBase } from "../../../js/src/index.js";
import { magnifyingGlassTiltedLeft, magnifyingGlassTiltedRight } from "../emoji/emojis.js";
import { id, max, min, step, title, value } from "../html/attrs.js";
import { backgroundColor, columnGap, cssHeight, cssWidth, fontSize, left, marginRight, padding, pointerEvents, position, styles, textAlign, transform } from "../html/css.js";
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
    constructor(targetCanvas, zoomMin, zoomMax) {
        super();

        const changeZoom = (dz) => {
            this.zoom += dz;
            this.dispatchEvent(zoomChangedEvt);
        };

        this.enabled = false;

        this.element = Div(
            id("rightbar"),
            gridRowsDef("auto", "9.5em", "auto", "1fr"),
            padding("4px"),
            columnGap("5px"),
            textAlign("right"),
            backgroundColor("transparent"),
            pointerEvents("none"),

            this.zoomInButton = Button(
                title("Zoom in"),
                onClick(() => changeZoom(0.5)),
                buttonStyle,
                gridPos(1, 1),
                Run(magnifyingGlassTiltedLeft.value),
                Run(buttonLabelStyle, "Zoom in")),

            Div(
                buttonStyle,
                cssHeight("8em"),
                gridPos(1, 2),
                this.slider = InputRange(
                    title("Zoom"),
                    min(zoomMin),
                    max(zoomMax),
                    step(0.1),
                    value(0),
                    onInput(() => this.dispatchEvent(zoomChangedEvt)),
                    cssWidth("8em"),
                    marginRight("-5em"),
                    transform("translateX(-3em) rotate(270deg) translateX(-5em)"))),


            this.zoomOutButton = Button(
                title("Zoom out"),
                onClick(() => changeZoom(-0.5)),
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