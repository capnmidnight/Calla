import "../protos.js";

import { FormDialog } from "./formDialog.js";

import {
    A,
    Button,
    Form,
    H2,
    Input,
    Label,
    P,
    SelectBox,
    Span,
    clear
} from "../html/tags.js";

import {
    ariaLabel,
    autoComplete,
    className,
    disabled,
    href,
    htmlFor,
    id,
    placeHolder,
    rel,
    style,
    target,
    title,
    type
} from "../html/attrs.js";

import { onClick, onInput } from "../html/evts.js";

import { preview } from "./preview.js";
import { instructions } from "./instructions.js";

const loginEvt = new Event("login"),
    defaultRooms = new Map([
        ["calla", "Calla"],
        ["island", "Island"],
        ["alxcc", "Alexandria Code & Coffee"],
        ["vurv", "Vurv"]]),
    _state = new Map();

export class LoginForm extends FormDialog {
    constructor() {
        super("login",
            "Calla",
            A(
                href("https://github.com/capnmidnight/Calla"),
                target("_blank"),
                rel("noopener"),
                Span(
                    className("icon icon-github"),
                    title("Follow Calla on Github"),
                    ariaLabel("Follow Calla on Git Hub"))));

        const self = Object.seal({
            ready: false,
            connecting: false,
            connected: false,
            validate: () => {
                const canConnect = (this.roomSelectMode
                    ? this.roomSelect.selectedIndex >= 0
                    : this.roomInput.value.length > 0)
                    && this.userName.length > 0;

                this.connectButton.setLocked(!this.ready
                    || this.connecting
                    || this.connected
                    || !canConnect);
                this.connectButton.innerHTML =
                    this.ready
                        ? this.connecting
                            ? "Connecting..."
                            : this.connected
                                ? "Connected"
                                : "Connect"
                        : "Loading...";
            }
        });

        _state.set(this, self);

        const onValidate = onInput(() => {
            self.validate();
        });

        this.content.append(
            P("Voice chat with an RPG map. Volume scales with distance from other users. Walk around, talk to folks, have private conversations by huddling in a corner, or drop in on other conversations. Ideal for meetups!"),
            H2("Login"),
            Form(
                autoComplete("on"),
                style({
                    display: "grid",
                    gridTemplateRows: "auto",
                    gridTemplateColumns: "2fr 4fr 2fr"
                }),

                this.roomLabel = Label(
                    htmlFor("existingRooms"),
                    style({ gridArea: "1/1" }),
                    "Room: "),
                this.roomSelect = SelectBox(
                    id("existingRooms"),
                    style({ gridArea: "1/2" })),

                this.roomInput = Input(
                    id("roomName"),
                    type("text"),
                    autoComplete("off"),
                    placeHolder("(Required)"),
                    style({
                        display: "none",
                        gridArea: "1/2"
                    }),
                    onValidate),

                this.createRoomButton = Button(
                    id("createNewRoom"),
                    title("Create a new, temporary room"),
                    style({ gridArea: "1/3" }),
                    "New",
                    onClick(() => this.roomSelectMode = !this.roomSelectMode)),

                Label(
                    htmlFor("userName"),
                    "User: ",
                    style({ gridArea: "2/1" })),
                this.userNameInput = Input(
                    id("userName"),
                    placeHolder("(Required)"),
                    type("text"),
                    style({ gridArea: "2/2" }),
                    onValidate),

                this.connectButton = Button(
                    id("connect"),
                    title("Create a new, temporary room"),
                    disabled,
                    style({ gridArea: "2/3" }),
                    "Loading...",
                    onClick(() => {
                        this.connecting = true;
                        this.dispatchEvent(loginEvt);
                    }))),

            ...preview(),
            ...instructions());

        this.roomSelect.setValues(
            defaultRooms.keys(),
            (k) => defaultRooms.get(k));
        this.roomSelectMode = true;
        this.roomSelect.selectedIndex = 0;

        self.validate();
    }

    get roomSelectMode() {
        return this.roomSelect.style.display !== "none";
    }

    set roomSelectMode(value) {
        const self = _state.get(this);
        this.roomSelect.setOpen(value);
        this.roomInput.setOpen(!value);
        this.createRoomButton.innerHTML = value
            ? "New"
            : "Cancel";

        if (value) {
            this.roomLabel.htmlFor = this.roomSelect.id;
            this.roomSelect.selectedValue = this.roomInput.value.toLocaleLowerCase();
        }
        else if (this.roomSelect.selectedIndex >= 0) {
            this.roomLabel.htmlFor = this.roomInput.id;
            this.roomInput.value = this.roomSelect.selectedValue;
        }

        self.validate();
    }

    get selectedRoom() {
        const room = this.roomSelectMode
            ? this.roomSelect.value
            : this.roomInput.value;

        return room.toLocaleLowerCase();
    }

    get userName() {
        return this.userNameInput.value;
    }

    get connectButtonText() {
        return this.connectButton.innerText
            || this.connectButton.textContent;
    }

    set connectButtonText(str) {
        this.connectButton.innerHTML = str;
    }

    get ready() {
        const self = _state.get(this);
        return self.ready;
    }

    set ready(v) {
        const self = _state.get(this);
        self.ready = v;
        self.validate();
    }

    get connecting() {
        const self = _state.get(this);
        return self.connecting;
    }

    set connecting(v) {
        const self = _state.get(this);
        self.connecting = v;
        self.validate();
    }

    get connected() {
        const self = _state.get(this);
        return self.connected;
    }

    set connected(v) {
        const self = _state.get(this);
        self.connected = v;
        self.validate();
    }
}