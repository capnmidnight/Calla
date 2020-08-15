import { EventBase, once } from "../../calla/index.js";
import { close } from "../emoji/emojis.js";
import { className, id } from "../html/attrs.js";
import { display, flexDirection, margin, overflowY, padding, styles } from "../html/css.js";
import { onClick } from "../html/evts.js";
import { col, gridColsDef, gridDef, gridPos } from "../html/grid.js";
import { hide, show } from "../html/ops.js";
import { Button, Div, H1 } from "../html/tags.js";

const hiddenEvt = new Event("hidden"),
    shownEvt = new Event("shown");

export class FormDialog extends EventBase {
    constructor(name, header) {
        super();

        const formStyle = styles(
            gridDef(
                ["5fr", "1fr", "1fr"],
                ["auto", "auto", "1fr", "auto", "auto"]),
            overflowY("hidden"));

        this.element = document.getElementById(name) ||
            Div(
                id(name),
                className("dialog"),
                Div(
                    gridColsDef("1fr", "auto"),
                    col(1, 3),
                    H1(
                        col(1),
                        margin("0"),
                        header),
                    Button(
                        col(2),
                        padding("1em"),
                        close.value,
                        onClick(() =>
                            hide(this)))));

        formStyle.apply(this.element);

        this.header = this.element.querySelector(".header")
            || this.element.appendChild(Div(className("header")));

        gridPos(1, 2, 3, 1).apply(this.header);

        this.content = this.element.querySelector(".content")
            || this.element.appendChild(Div(className("content")));

        styles(
            gridPos(1, 3, 3, 1),
            overflowY("scroll"))
            .apply(this.content);

        this.footer = this.element.querySelector(".footer")
            || this.element.appendChild(Div(className("footer")));

        styles(
            gridPos(1, 4, 3, 1),
            display("flex"),
            flexDirection("row-reverse"))
            .apply(this.footer);
    }

    get tagName() {
        return this.element.tagName;
    }

    get disabled() {
        return this.element.disabled;
    }

    set disabled(v) {
        this.element.disabled = v;
    }

    get style() {
        return this.element.style;
    }

    appendChild(child) {
        return this.element.appendChild(child);
    }

    append(...rest) {
        this.element.append(...rest);
    }

    show() {
        show(this.element, "grid");
        this.dispatchEvent(shownEvt);
    }

    async showAsync() {
        show(this);
        await once(this, "hidden");
    }

    hide() {
        hide(this.element);
        this.dispatchEvent(hiddenEvt);
    }
}