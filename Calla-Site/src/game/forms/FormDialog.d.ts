import { EventBase } from "../../lib/calla";
export declare class FormDialog extends EventBase {
    constructor(tagId: any);
    get tagName(): any;
    get disabled(): any;
    set disabled(v: any);
    get style(): any;
    appendChild(child: any): any;
    append(...rest: any[]): void;
    show(): void;
    showAsync(): Promise<void>;
    hide(): void;
}
