import { close } from "../emoji/emojis.js";
import { EventBase } from "../events/EventBase.js";
import { once } from "../events/once.js";
import { className, id } from "../html/attrs.js";
import { display, flexDirection, margin, overflowY, padding, styles } from "../html/css.js";
import { onClick } from "../html/evts.js";
import { col, gridColsDef, gridDef, gridPos } from "../html/grid.js";
import { Button, Div, H1 } from "../html/tags.js";
import "../protos/index.js";

const hiddenEvt = new Event("hidden");

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
                            this.hide()))));

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

    appendChild(child) {
        return this.element.appendChild(child);
    }

    append(...rest) {
        this.element.append(...rest);
    }

    show() {
        this.element.show("grid");
    }

    async showAsync() {
        this.show();
        await once(this, "hidden");
    }

    hide() {
        this.element.hide();
        this.dispatchEvent(hiddenEvt);
    }

    toggleOpen() {
        if (this.isOpen) {
            this.hide();
        }
        else {
            this.show();
        }
    }

    get isOpen() {
        return this.element.isOpen();
    }

    set isOpen(v) {
        if (v !== this.isOpen) {
            this.toggleOpen();
        }
    }
}