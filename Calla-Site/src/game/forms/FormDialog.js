import { multiply } from "kudzu/emoji/emojis";
import { TypedEvent, TypedEventBase } from "kudzu/events/EventBase";
import { once } from "kudzu/events/once";
import { className, id, selector } from "kudzu/html/attrs";
import { onClick } from "kudzu/html/evts";
import { Button, Div, H1 } from "kudzu/html/tags";
import { hide, show } from "./ops";
const hiddenEvt = new TypedEvent("hidden"), shownEvt = new TypedEvent("shown");
export class FormDialog extends TypedEventBase {
    title;
    element;
    content;
    constructor(tagId, title, addCloseButton = true) {
        super();
        this.element = Div(id(tagId), className("dialog"), this.title = Div(selector(`#${tagId} > .title`), className("title"), H1(selector(`#${tagId} > .title > h1`), title)), this.content = Div(selector(`#${tagId} > .content`), className("content")));
        if (addCloseButton) {
            this.title.append(Button(className("closeButton"), multiply.value, onClick(() => hide(this))));
        }
        this.hide();
    }
    isOpen() {
        return this.style.display !== "none";
    }
    setOpen(v, displayType) {
        this.style.display = v
            ? displayType || ""
            : "none";
    }
    toggleOpen(displayType) {
        this.setOpen(!this.isOpen(), displayType);
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