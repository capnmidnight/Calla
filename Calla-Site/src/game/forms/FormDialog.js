import { EventBase } from "kudzu/events/EventBase";
import { once } from "kudzu/events/once";
import { id } from "kudzu/html/attrs";
import { Div } from "kudzu/html/tags";
import { hide, show } from "./ops";
const hiddenEvt = new Event("hidden"), shownEvt = new Event("shown");
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
    isOpen() {
        return this.style.display !== "none";
    }
    setOpen(v, displayType) {
        this.style.display = v
            ? displayType || ""
            : "none";
    }
    updateLabel(_open, _enabledText, _disabledText, _bothText) {
    }
    toggleOpen(displayType) {
        this.setOpen(!this.isOpen(), displayType);
    }
    setLocked(_v) {
    }
    get accessKey() {
        return this.element.accessKey;
    }
    get tagName() {
        return this.element.tagName;
    }
    get disabled() {
        return false;
    }
    set disabled(_v) {
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
//# sourceMappingURL=FormDialog.js.map