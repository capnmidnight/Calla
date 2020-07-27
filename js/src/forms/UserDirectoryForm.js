import { height, width } from "../html/attrs.js";
import { backgroundColor, columnGap, width as cssWidth, zIndex } from "../html/css.js";
import { onClick, onMouseOut, onMouseOver } from "../html/evts.js";
import { gridDef, gridPos, row } from "../html/grid.js";
import { Canvas, Div } from "../html/tags.js";
import { RequestAnimationFrameTimer } from "../timers/RequestAnimationFrameTimer.js";
import { User } from "../User.js";
import { FormDialog } from "./FormDialog.js";

const newRowColor = backgroundColor("lightgreen");
const hoveredColor = backgroundColor("rgba(65, 255, 202, 0.25)");
const unhoveredColor = backgroundColor("transparent");
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

        this.timer = new RequestAnimationFrameTimer();
        this.timer.addEventListener("tick", () => {
            for (let entries of this.users.entries()) {
                const [id, user] = entries;
                if (this.avatarGs.has(id) && user.avatar) {
                    const g = this.avatarGs.get(id);
                    g.clearRect(0, 0, g.canvas.width, g.canvas.height);
                    user.avatar.draw(g, g.canvas.width, g.canvas.height);
                }
            }
        });

        /** @type {Map.<string, Element[]>} */
        this.rows = new Map();

        /** @type {Map<string, User>} */
        this.users = new Map();

        /** @type {Map<string, CanvasRenderingContext2D>} */
        this.avatarGs = new Map();

        this.content.append(
            this.table = Div(
                gridDef(
                    ["auto", "1fr"],
                    ["min-content"]),
                columnGap("5px"),
                cssWidth("100%")));
    }

    show() {
        super.show();
        this.timer.start();
    }

    hide() {
        super.hide();
        this.timer.stop();
    }

    /**
     * 
     * @param {User} user
     */
    set(user) {
        const isNew = !this.rows.has(user.id);
        this.delete(user.id);
        const row = this.rows.size + 1;

        if (isNew) {
            const elem = Div(
                gridPos(1, row, 2, 1),
                zIndex(-1),
                newRowColor);
            setTimeout(() => {
                this.table.removeChild(elem);
            }, ROW_TIMEOUT);
            this.table.append(elem);
            this.users.set(user.id, user);
            this.avatarGs.set(
                user.id,
                Canvas(
                    width(32),
                    height(32))
                    .getContext("2d"));
        }

        const avatar = this.avatarGs.get(user.id).canvas;

        const elems = [
            Div(gridPos(1, row), zIndex(0), avatar),
            Div(gridPos(2, row), zIndex(0), user.displayName),
            Div(
                gridPos(1, row, 2, 1), zIndex(1),
                unhoveredColor,
                onMouseOver(function () {
                    hoveredColor.apply(this);
                }),
                onMouseOut(function () {
                    unhoveredColor.apply(this);
                }),
                onClick(() => {
                    this.hide();
                    warpToEvt.id = user.id;
                    this.dispatchEvent(warpToEvt);
                }))];

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

    warn(...rest) {
        const elem = Div(
            gridPos(1, this.rows.size + 1, 2, 1),
            backgroundColor("yellow"),
            ...rest.map(i => i.toString()));

        this.table.append(elem);

        setTimeout(() => {
            this.table.removeChild(elem);
        }, 5000);
    }
}