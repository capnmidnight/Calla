import { TypedEvent, TypedEventBase } from "kudzu/events/EventBase";
import { ErsatzElement } from "kudzu/html/tags";
import { IOpenable } from "./ops";
export interface FormDialogEvents {
    hidden: TypedEvent<"hidden">;
    shown: TypedEvent<"shown">;
}
export declare class FormDialog<T extends FormDialogEvents> extends TypedEventBase<T> implements IOpenable, ErsatzElement {
    element: HTMLElement;
    header: HTMLElement;
    content: HTMLElement;
    footer: HTMLElement;
    constructor(tagId: string);
    isOpen(): boolean;
    setOpen(v: boolean, displayType?: string): void;
    toggleOpen(displayType?: string): void;
    get tagName(): string;
    get disabled(): boolean;
    set disabled(_v: boolean);
    get style(): CSSStyleDeclaration;
    appendChild(child: HTMLElement): HTMLElement;
    append(...rest: HTMLElement[]): void;
    show(): void;
    showAsync(): Promise<void>;
    hide(): void;
}
