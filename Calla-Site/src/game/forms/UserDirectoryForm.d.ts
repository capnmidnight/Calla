import type { User } from "../User";
import { FormDialog, FormDialogEvents } from "./FormDialog";
export declare class UserDirectoryFormWarpToEvent extends Event {
    id: string;
    constructor();
}
interface UserDirectoryFormEvents extends FormDialogEvents {
    warpTo: UserDirectoryFormWarpToEvent;
}
export declare class UserDirectoryForm extends FormDialog<UserDirectoryFormEvents> {
    roomName: string;
    userName: string;
    usersList: HTMLDivElement;
    rows: Map<string, HTMLElement[]>;
    users: Map<string, User>;
    avatarGs: Map<string, CanvasRenderingContext2D>;
    lastUser: User;
    constructor();
    startAsync(roomName: string, userName: string): Promise<void>;
    update(): void;
    set(user: User): void;
    delete(userID: string): void;
    clear(): void;
    warn(...rest: any[]): void;
}
export {};
