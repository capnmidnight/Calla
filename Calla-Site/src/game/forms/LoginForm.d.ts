import { TypedEvent } from "kudzu/events/EventBase";
import { FormDialog, FormDialogEvents } from "./FormDialog";
interface LoginFormEvents extends FormDialogEvents {
    login: TypedEvent<"login">;
}
export declare class LoginForm extends FormDialog<LoginFormEvents> {
    private _ready;
    private _connecting;
    private _connected;
    private roomSelectControl;
    private roomEntryControl;
    private roomSelect;
    private roomInput;
    private userNameInput;
    private emailInput;
    private connectButton;
    constructor();
    private validate;
    get roomSelectMode(): boolean;
    set roomSelectMode(value: boolean);
    get roomName(): string;
    set roomName(v: string);
    set userName(value: string);
    get userName(): string;
    set email(value: string);
    get email(): string;
    get connectButtonText(): string;
    set connectButtonText(str: string);
    get ready(): boolean;
    set ready(v: boolean);
    get connecting(): boolean;
    set connecting(v: boolean);
    get connected(): boolean;
    set connected(v: boolean);
}
export {};
