import { className, id, style, systemFamily } from "../html/attrs.js";
import { Div, H1 } from "../html/tags.js";
import "../protos.js";

export class FormDialog extends EventTarget {
    constructor(name, ...rest) {
        super();

        const formStyle = style({
            display: "grid",
            gridTemplateColumns: "5fr 1fr 1fr",
            gridTemplateRows: "auto auto 1fr auto auto",
            overflowY: "hidden",
            fontFamily: systemFamily
        });

        this.element = document.getElementById(name) ||
            Div(
                id(name),
                className("dialog"),
                H1(...rest));

        formStyle.apply(this.element);

        style({ gridArea: "1/1/2/4" }).apply(this.element.querySelector("h1"));

        this.header = this.element.querySelector(".header")
            || this.element.appendChild(Div(className("header")));

        style({ gridArea: "2/1/3/4" }).apply(this.header);

        this.content = this.element.querySelector(".content")
            || this.element.appendChild(Div(className("content")));

        style({
            overflowY: "scroll",
            gridArea: "3/1/4/4"
        }).apply(this.content);

        this.footer = this.element.querySelector(".footer")
            || this.element.appendChild(Div(className("footer")));

        style({
            display: "flex",
            flexDirection: "row-reverse",
            gridArea: "4/1/5/4"
        }).apply(this.footer);
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

    hide() {
        this.element.hide();
    }

    toggleOpen() {
        this.element.toggleOpen("grid");
    }
}