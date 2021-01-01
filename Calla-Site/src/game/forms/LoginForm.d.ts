import { FormDialog } from "./FormDialog";
export declare class LoginForm extends FormDialog {
    constructor();
    /**
     * @param {KeyboardEvent} evt
     * @param {Function} callback
     */
    _checkInput(evt: any, callback: any): void;
    addEventListener(evtName: any, callback: any, options: any): void;
    removeEventListener(evtName: any, callback: any): void;
    get roomSelectMode(): boolean;
    set roomSelectMode(value: boolean);
    get roomName(): any;
    set roomName(v: any);
    set userName(value: any);
    get userName(): any;
    set email(value: any);
    get email(): any;
    get connectButtonText(): any;
    set connectButtonText(str: any);
    get ready(): any;
    set ready(v: any);
    get connecting(): any;
    set connecting(v: any);
    get connected(): any;
    set connected(v: any);
}
