import { TypedEvent, TypedEventBase } from "kudzu/events/EventBase";
import { once } from "kudzu/events/once";
import { id } from "kudzu/html/attrs";
import { Div } from "kudzu/html/tags";
import { hide, IOpenable, show } from "./ops";

export interface FormDialogEvents {
    hidden: TypedEvent<"hidden">;
    shown: TypedEvent<"shown">;
}

const hiddenEvt = new TypedEvent("hidden"),
    shownEvt = new TypedEvent("shown");

export class FormDialog<T extends FormDialogEvents>
    extends TypedEventBase<T>
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

    toggleOpen(displayType?: string): void {
        this.setOpen(!this.isOpen(), displayType);
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