import { EventBase } from "kudzu/events/EventBase";
import { once } from "kudzu/events/once";
import { id } from "kudzu/html/attrs";
import { Div } from "kudzu/html/tags";
import { hide, IOpenable, show } from "./ops";

const hiddenEvt = new Event("hidden"),
    shownEvt = new Event("shown");

export class FormDialog
    extends EventBase
    implements IOpenable {
    element: HTMLElement;
    header: HTMLElement;
    content: HTMLElement;
    footer: HTMLElement;

    constructor(tagId: string) {
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

    isOpen(): boolean {
        return this.style.display !== "none";
    }

    setOpen(v: boolean, displayType?: string): void {
        this.style.display = v
            ? displayType || ""
            : "none";
    }

    updateLabel(_open: boolean, _enabledText: string, _disabledText: string, _bothText: string): void {
    }

    toggleOpen(displayType?: string): void {
        this.setOpen(!this.isOpen(), displayType);
    }

    setLocked(_v: boolean): void {
    }

    get accessKey(): string {
        return this.element.accessKey;
    }

    get tagName() {
        return this.element.tagName;
    }

    get disabled() {
        return false;
    }

    set disabled(_v: boolean) {
    }

    get style() {
        return this.element.style;
    }

    appendChild(child: HTMLElement) {
        return this.element.appendChild(child);
    }

    append(...rest: HTMLElement[]) {
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