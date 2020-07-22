import { close } from "../emoji/emoji.js";
import { className, id } from "../html/attrs.js";
import { gridArea, col, gridTemplate, gridColsDef, margin, padding } from "../html/css.js";
import { onClick } from "../html/evts.js";
import { Button, Div, H1 } from "../html/tags.js";
import "../protos.js";

const hiddenEvt = new Event("hidden");

export class FormDialog extends EventTarget {
    constructor(name, header) {
        super();

        const formStyle = gridTemplate(
            ["5fr", "1fr", "1fr"],
            ["auto", "auto", "1fr", "auto", "auto"], {
            overflowY: "hidden"
        });

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

        gridArea(1, 2, 3, 1).apply(this.header);

        this.content = this.element.querySelector(".content")
            || this.element.appendChild(Div(className("content")));

        gridArea(1, 3, 3, 1, {
            overflowY: "scroll"
        }).apply(this.content);

        this.footer = this.element.querySelector(".footer")
            || this.element.appendChild(Div(className("footer")));

        gridArea(1, 4, 3, 1, {
            display: "flex",
            flexDirection: "row-reverse"
        }).apply(this.footer);
    }

    get isOpen() {
        return this.element.isOpen();
    }

    set isOpen(v) {
        if (v !== this.isOpen) {
            this.toggleOpen();
        }
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
        await this.once("hidden");
    }

    hide() {
        this.element.hide();
        this.dispatchEvent(hiddenEvt);
    }

    toggleOpen() {
        this.element.toggleOpen("grid");
    }
}