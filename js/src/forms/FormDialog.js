import { className, id, style, gridCol, gridCols, gridArea, gridSpan } from "../html/attrs.js";
import { Div, H1, Button } from "../html/tags.js";
import { close } from "../emoji/emoji.js";
import "../protos.js";
import { onClick } from "../html/evts.js";

const hiddenEvt = new Event("hidden");

export class FormDialog extends EventTarget {
    constructor(name, header) {
        super();

        const formStyle = gridArea(
            ["5fr", "1fr", "1fr"],
            ["auto", "auto", "1fr", "auto", "auto"], {
            overflowY: "hidden"
        });

        this.element = document.getElementById(name) ||
            Div(
                id(name),
                className("dialog"),
                Div(
                    gridCols("1fr", "auto"),
                    gridCol(1, 3),
                    H1(
                        gridCol(1),
                        style({ margin: "0" }),
                        header),
                    Button(
                        gridCol(2),
                        style({ padding: "1em" }),
                        close.value,
                        onClick(() =>
                            this.hide()))));

        formStyle.apply(this.element);

        this.header = this.element.querySelector(".header")
            || this.element.appendChild(Div(className("header")));

        gridSpan(1, 2, 3, 1).apply(this.header);

        this.content = this.element.querySelector(".content")
            || this.element.appendChild(Div(className("content")));

        gridSpan(1, 3, 3, 1, {
            overflowY: "scroll"
        }).apply(this.content);

        this.footer = this.element.querySelector(".footer")
            || this.element.appendChild(Div(className("footer")));

        gridSpan(1, 4, 3, 1, {
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