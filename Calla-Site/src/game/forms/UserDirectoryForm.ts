import { backgroundColor, height, id, styles, width, zIndex } from "kudzu/html/attrs";
import { onClick, onMouseOut, onMouseOver } from "kudzu/html/evts";
import { gridPos, row } from "kudzu/html/grid";
import { Canvas, Div } from "kudzu/html/tags";
import type { User } from "../User";
import { FormDialog, FormDialogEvents } from "./FormDialog";
import { hide, isOpen } from "./ops";

const newRowColor = backgroundColor("lightgreen");
const hoveredColor = backgroundColor("rgba(65, 255, 202, 0.25)");
const unhoveredColor = backgroundColor("transparent");

export class UserDirectoryFormWarpToEvent extends Event {
    id: string = null;
    constructor() {
        super("warpTo");
    }
}

interface UserDirectoryFormEvents extends FormDialogEvents {
    warpTo: UserDirectoryFormWarpToEvent;
}

const warpToEvt = new UserDirectoryFormWarpToEvent();

const ROW_TIMEOUT = 3000;

export class UserDirectoryForm extends FormDialog<UserDirectoryFormEvents> {

    roomName: string = null;
    userName: string = null;
    usersList: HTMLDivElement;
    rows = new Map<string, HTMLElement[]>();
    users = new Map<string, User>();
    avatarGs = new Map<string, CanvasRenderingContext2D>();
    lastUser: User = null;

    constructor() {
        super("users");

        this.usersList = Div(id("chatUsers"));

        Object.seal(this);
    }

    async startAsync(roomName: string, userName: string) {
        this.roomName = roomName;
        this.userName = userName;
    }

    update() {
        if (isOpen(this)) {
            for (let entries of this.users.entries()) {
                const [id, user] = entries;
                if (this.avatarGs.has(id) && user.avatar) {
                    const g = this.avatarGs.get(id);
                    g.clearRect(0, 0, g.canvas.width, g.canvas.height);
                    user.avatar.draw(g, g.canvas.width, g.canvas.height, user.isMe);
                }
            }
        }
    }

    set(user: User) {
        const isNew = !this.rows.has(user.id);
        this.delete(user.id);
        const row = this.rows.size + 1;

        if (isNew) {
            const elem = Div(
                gridPos(1, row, 2, 1),
                zIndex(-1),
                newRowColor);
            setTimeout(() => {
                this.usersList.removeChild(elem);
            }, ROW_TIMEOUT);
            this.usersList.append(elem);
            this.users.set(user.id, user);
            this.avatarGs.set(
                user.id,
                Canvas(
                    width(32),
                    height(32))
                    .getContext("2d"));
        }

        const avatar = this.avatarGs.get(user.id).canvas;

        const trueRow = Div(
            styles(gridPos(1, row, 2, 1), zIndex(1), unhoveredColor),
            onMouseOver((_:Event) => {
                hoveredColor.apply(trueRow.style);
            }),
            onMouseOut(() => unhoveredColor.apply(trueRow.style)),
            onClick(() => {
                hide(this);
                warpToEvt.id = user.id;
                this.dispatchEvent(warpToEvt);
            }));

        const elems = [
            Div(styles(gridPos(1, row), zIndex(0)), avatar),
            Div(styles(gridPos(2, row), zIndex(0)), user.displayName),
            trueRow];

        this.rows.set(user.id, elems);
        this.usersList.append(...elems);
    }

    delete(userID: string) {
        if (this.rows.has(userID)) {
            const elems = this.rows.get(userID);
            this.rows.delete(userID);
            for (let elem of elems) {
                this.usersList.removeChild(elem);
            }

            let rowCount = 1;
            for (let elems of this.rows.values()) {
                const r = row(rowCount++);
                for (let elem of elems) {
                    r.apply(elem);
                }
            }
        }
    }

    clear() {
        for (let id of this.rows.keys()) {
            this.delete(id);
        }
    }

    warn(...rest: any[]) {
        const elem = Div(
            styles(gridPos(1, this.rows.size + 1, 2, 1),
                backgroundColor("yellow")),
            ...rest.map(i => i.toString()));

        this.usersList.append(elem);

        setTimeout(() => {
            this.usersList.removeChild(elem);
        }, 5000);
    }
}