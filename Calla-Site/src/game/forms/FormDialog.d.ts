import { EventBase } from "kudzu/events/EventBase";
import { IOpenable } from "./ops";
export declare class FormDialog extends EventBase implements IOpenable {
    element: HTMLElement;
    header: HTMLElement;
    content: HTMLElement;
    footer: HTMLElement;
    constructor(tagId: string);
    isOpen(): boolean;
    setOpen(v: boolean, displayType?: string): void;
    updateLabel(_open: boolean, _enabledText: string, _disabledText: string, _bothText: string): void;
    toggleOpen(displayType?: string): void;
    setLocked(_v: boolean): void;
    get accessKey(): string;
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
