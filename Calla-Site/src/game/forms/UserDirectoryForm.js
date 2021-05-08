import { htmlHeight, htmlWidth, id } from "kudzu/html/attrs";
import { backgroundColor, styles, zIndex } from "kudzu/html/css";
import { onClick, onMouseOut, onMouseOver } from "kudzu/html/evts";
import { gridPos, row } from "kudzu/html/grid";
import { Button, Canvas, Div, InputText } from "kudzu/html/tags";
import { FormDialog } from "./FormDialog";
import { hide, isOpen } from "./ops";
const newRowColor = backgroundColor("lightgreen");
const hoveredColor = backgroundColor("rgba(65, 255, 202, 0.25)");
const unhoveredColor = backgroundColor("transparent");
export class UserDirectoryFormWarpToEvent extends Event {
    constructor() {
        super("warpTo");
        this.id = null;
    }
}
const warpToEvt = new UserDirectoryFormWarpToEvent();
const ROW_TIMEOUT = 3000;
export class UserDirectoryForm extends FormDialog {
    constructor() {
        super("users", "Users");
        this.roomName = null;
        this.userName = null;
        this.rows = new Map();
        this.users = new Map();
        this.avatarGs = new Map();
        this.lastUser = null;
        this.content.append(this.usersList = Div(id("chatUsers")), Div(id("chatMessages")), InputText(id("chatEntry")), Button(id("chatSend"), "Send"));
        Object.seal(this);
    }
    async startAsync(roomName, userName) {
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
    set(user) {
        const isNew = !this.rows.has(user.id);
        this.delete(user.id);
        const row = this.rows.size + 1;
        if (isNew) {
            const elem = Div(gridPos(1, row, 2, 1), zIndex(-1), newRowColor);
            setTimeout(() => {
                this.usersList.removeChild(elem);
            }, ROW_TIMEOUT);
            this.usersList.append(elem);
            this.users.set(user.id, user);
            this.avatarGs.set(user.id, Canvas(htmlWidth(32), htmlHeight(32))
                .getContext("2d"));
        }
        const avatar = this.avatarGs.get(user.id).canvas;
        const trueRow = Div(styles(gridPos(1, row, 2, 1), zIndex(1), unhoveredColor), onMouseOver((_) => {
            hoveredColor.apply(trueRow.style);
        }), onMouseOut(() => unhoveredColor.apply(trueRow.style)), onClick(() => {
            hide(this);
            warpToEvt.id = user.id;
            this.dispatchEvent(warpToEvt);
        }));
        const elems = [
            Div(styles(gridPos(1, row), zIndex(0)), avatar),
            Div(styles(gridPos(2, row), zIndex(0)), user.displayName),
            trueRow
        ];
        this.rows.set(user.id, elems);
        this.usersList.append(...elems);
    }
    delete(userID) {
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
                    r.apply(elem.style);
                }
            }
        }
    }
    clear() {
        for (let id of this.rows.keys()) {
            this.delete(id);
        }
    }
    warn(...rest) {
        const elem = Div(styles(gridPos(1, this.rows.size + 1, 2, 1), backgroundColor("yellow")), ...rest.map(i => i.toString()));
        this.usersList.append(elem);
        setTimeout(() => {
            this.usersList.removeChild(elem);
        }, 5000);
    }
}
//# sourceMappingURL=UserDirectoryForm.js.map