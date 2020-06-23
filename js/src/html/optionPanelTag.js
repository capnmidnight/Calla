import { Button, H2, P } from "./tags.js";
import { onClick } from "./evts.js";
import { id } from "./attrs.js";
import { HtmlCustomTag } from "./custom.js";

const selectEvt = new Event("select");

export class OptionPanelTag extends HtmlCustomTag {
    constructor(panelID, name, ...rest) {
        super("div",
            id(panelID),
            H2(name),
            P(...rest));

        this.button = Button(
            id(panelID + "Btn"),
            onClick(() => this.dispatchEvent(selectEvt)),
            name);
    }

    get visible() {
        return this.element.style.display !== null;
    }

    set visible(v) {
        this.element.setOpen(v);
        this.button.setLocked(v);
    }
}