import { TypedEvent } from "kudzu/events/EventBase";
import { FormDialog, FormDialogEvents } from "./FormDialog";
interface RoomEntry {
    value: string;
    text: string;
}
interface LoginFormEvents extends FormDialogEvents {
    login: TypedEvent<"login">;
}
export declare class LoginForm extends FormDialog<LoginFormEvents> {
    private _ready;
    private _connecting;
    private _connected;
    private roomNameInput;
    private userNameInput;
    private emailInput;
    private connectButton;
    constructor(rooms: RoomEntry[]);
    private validate;
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
