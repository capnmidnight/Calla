import { EventBase, once } from "../../calla/index.js";
import { id } from "../../html/attrs.js";
import { hide, show } from "../../html/ops.js";
import { Div } from "../../html/tags.js";

const hiddenEvt = new Event("hidden"),
    shownEvt = new Event("shown");

export class FormDialog extends EventBase {
    constructor(tagId) {
        super();

        this.element = Div(id(tagId));
        this.header = this.element.querySelector(".header");
        this.content = this.element.querySelector(".content");
        this.footer = this.element.querySelector(".footer");

        const closeButton = this.element.querySelector(".dialogTitle > button.closeButton");
        if (closeButton) {
            closeButton.addEventListener("click", () => hide(this));
        }
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
        show(this.element);
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