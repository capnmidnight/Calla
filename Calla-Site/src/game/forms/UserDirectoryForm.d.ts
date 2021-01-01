import { FormDialog } from "./FormDialog";
export declare class UserDirectoryForm extends FormDialog {
    constructor();
    /**
     *
     * @param {string} roomName
     * @param {string} userName
     */
    startAsync(roomName: any, userName: any): Promise<void>;
    update(): void;
    /**
     *
     * @param {User} user
     */
    set(user: any): void;
    delete(userID: any): void;
    clear(): void;
    warn(...rest: any[]): void;
}
