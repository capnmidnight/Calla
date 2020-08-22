import { HubConnectionBuilder } from "../../lib/signalr/dist/esm/index.js";
import { disabled, height, id, width } from "../html/attrs.js";
import { backgroundColor, zIndex } from "../html/css.js";
import { onBlur, onClick, onFocus, onKeyPress, onMouseOut, onMouseOver } from "../html/evts.js";
import { gridPos, row } from "../html/grid.js";
import { hide, isOpen } from "../html/ops.js";
import { Button, Canvas, Div, InputText, Sub, Em } from "../html/tags.js";
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

const chatFocusChanged = new Event("chatFocusChanged");

const ROW_TIMEOUT = 3000;

export class UserDirectoryForm extends FormDialog {

    constructor() {
        super("users");

        const _ = (evt) => () => this.dispatchEvent(evt);

        this.roomName = null;
        this.userName = null;
        this.chatFocused = false;
        this.usersList = Div(id("chatUsers"));
        this.messages = Div(id("chatMessages"));

        /** @type {Map.<string, Element[]>} */
        this.rows = new Map();

        /** @type {Map<string, User>} */
        this.users = new Map();

        /** @type {Map<string, CanvasRenderingContext2D>} */
        this.avatarGs = new Map();

        this.chat = new HubConnectionBuilder().withUrl("/Chat").build();

        let lastUser = null,
            lastRoom = null;

        this.chat.on("ReceiveMessage", (room, user, message) => {
            let from = null
            if (user !== lastUser
                || room !== lastRoom) {
                lastUser = user;
                lastRoom = room;
                from = Div(user, Sub(Em(`(${room})`)));
            }
            else {
                from = Div("");
            }

            this.messages.append(from, Div(message));
            this.messages.lastChild.scrollIntoView();
        });

        const sendMessage = async () => {
            if (this.entry.value.length > 0) {
                this.send.disabled
                    = this.entry.disabled
                    = true;
                await this.chat.invoke("SendMessage", this.roomName, this.userName, this.entry.value);
                this.entry.value = "";
                this.entry.disabled
                    = this.send.disabled
                    = false;
                this.entry.focus();
            }
        };

        const onFocusChanged = () => this.dispatchEvent(chatFocusChanged);

        this.entry = InputText(
            id("chatEntry"),
            disabled,
            onFocus(() => this.chatFocused = true),
            onFocus(onFocusChanged),
            onBlur(() => this.chatFocused = false),
            onBlur(onFocusChanged),
            onKeyPress((evt) => {
                if (evt.key === "Enter") {
                    sendMessage();
                }
            }));

        this.send = Button(
            id("chatSend"),
            disabled,
            onClick(sendMessage));

        Object.seal(this);
    }

    /**
     *
     * @param {string} roomName
     * @param {string} userName
     */
    async startAsync(roomName, userName) {
        this.roomName = roomName;
        this.userName = userName;
        await this.chat.start();
        this.entry.disabled
            = this.send.disabled
            = false;
    }

    update() {
        if (isOpen(this)) {
            for (let entries of this.users.entries()) {
                const [id, user] = entries;
                if (this.avatarGs.has(id) && user.avatar) {
                    const g = this.avatarGs.get(id);
                    g.clearRect(0, 0, g.canvas.width, g.canvas.height);
                    user.avatar.draw(g, g.canvas.width, g.canvas.height);
                }
            }
        }
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
                    hide(this);
                    warpToEvt.id = user.id;
                    this.dispatchEvent(warpToEvt);
                }))];

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

        this.usersList.append(elem);

        setTimeout(() => {
            this.usersList.removeChild(elem);
        }, 5000);
    }
}