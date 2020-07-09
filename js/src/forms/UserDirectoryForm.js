import { row, style, grid } from "../html/attrs.js";
import { onClick } from "../html/evts.js";
import { Button, Div } from "../html/tags.js";
import { User } from "../User.js";
import { FormDialog } from "./FormDialog.js";

const refreshDirectoryEvt = new Event("refreshUserDirectory");
const newRowColor = "lightgreen";
const avatarSize = style({ height: "32px" });
const warpToEvt = Object.assign(
    new Event("warpTo"),
    {
        id: null
    });

const ROW_TIMEOUT = 3000;
export class UserDirectoryForm extends FormDialog {

    constructor() {
        super("users", "Users");

        const _ = (evt) => () => this.dispatchEvent(evt);

        /** @type {Map.<string, Element[]>} */
        this.rows = new Map();

        this.content.append(
            this.table = Div(
                style({
                    display: "grid",
                    gridTemplateColumns: "auto auto auto 1fr",
                    gridTemplateRows: "min-content",
                    columnGap: "5px",
                    width: "100%"
                })));

        this.table.append(
            Div(grid(1, 1), ""),
            Div(grid(2, 1), "ID"),
            Div(grid(3, 1), "Location"),
            Div(grid(4, 1), "Avatar"),
            Div(grid(5, 1), "User Name"));

        this.footer.append(
            Button(
                "Refresh",
                onClick(_(refreshDirectoryEvt))),

            this.confirmButton = Button(
                "Close",
                onClick(() => this.hide())));
    }

    /**
     * 
     * @param {User} user
     */
    set(user) {
        this.delete(user.id);
        const row = this.rows.size + 2;
        const elem = Div(
            grid(1, row, 4, 1),
            style({
                backgroundColor: newRowColor,
                zIndex: -1
            }));
        setTimeout(() => {
            this.table.removeChild(elem);
        }, ROW_TIMEOUT);
        this.table.append(elem);

        let avatar = "N/A";
        if (user.avatar && user.avatar.element) {
            avatar = user.avatar.element;
            avatarSize.apply(avatar);
        }

        const elems = [
            Button(
                grid(1, row),
                onClick(() => {
                    warpToEvt.id = user.id;
                    this.dispatchEvent(warpToEvt);
                }),
                "Visit"),
            Div(grid(2, row), user.id),
            Div(grid(3, row), `<x: ${user.position._tx}, y: ${user.position._ty}>`),
            Div(grid(4, row), avatar),
            Div(grid(5, row), user.displayName)];

        this.rows.set(user.id, elems);
        this.table.append(...elems);
    }

    delete(userID) {
        if (this.rows.has(userID)) {
            const elems = this.rows.get(userID);
            this.rows.delete(userID);
            for (let elem of elems) {
                this.table.removeChild(elem);
            }

            let rowCount = 2;
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

    warn(...rest) {
        const elem = Div(
            style({ backgroundColor: "yellow" }),
            ...rest.map(i => i.toString()));
        this.table.append(elem);
        setTimeout(() => {
            this.table.removeChild(elem);
        }, 5000);
    }

    async showAsync() {
        this.show();
        await this.confirmButton.once("click");
        return false;
    }
}