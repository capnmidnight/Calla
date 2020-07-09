import { style, id } from "../html/attrs.js";
import { onClick } from "../html/evts.js";
import { Button, clear, Div } from "../html/tags.js";
import { FormDialog } from "./FormDialog.js";

const refreshDirectoryEvt = new Event("refreshUserDirectory");

export class UserDirectoryForm extends FormDialog {

    constructor() {
        super("users", "Users");

        const _ = (evt) => () => this.dispatchEvent(evt);

        style({
            gridTemplateColumns: "1fr 5fr",
            columGap: "5px"
        }).apply(this.content);

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
     * @param {string} from
     * @param {string} userID
     * @param {string} userName
     */
    set(from, userID, userName) {
        this.delete(userID, true);
        const elemID = `user_${userID}`;
        const elem = Div(
            id(elemID),
            style({ backgroundColor: "lightgreen" }),
            `${from.toLocaleUpperCase()}: ${userName} - (${userID})`);
        this.content.append(elem);
        setTimeout(() => {
            elem.style.backgroundColor = "";
        }, 3000);
    }

    delete(userID, now) {
        const elemID = `user_${userID}`;
        const elem = document.getElementById(elemID);
        if (elem !== null) {
            if (now) {
                elem.parentElement.removeChild(elem);
            }
            else {
                elem.style.backgroundColor = "red";
                setTimeout(() => {
                    elem.parentElement.removeChild(elem);
                }, 3000);
            }
        }
    }

    clear() {
        clear(this.content);
    }

    warn(...rest) {
        const elem = Div(
            style({ backgroundColor: "yellow" }),
            ...rest.map(i => i.toString()));
        this.content.append(elem);
        setTimeout(() => {
            elem.parentElement.removeChild(elem);
        }, 5000);
    }

    async showAsync() {
        this.show();
        await this.confirmButton.once("click");
        return false;
    }
}