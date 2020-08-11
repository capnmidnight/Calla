import { id } from "./attrs.js";
import { backgroundColor, borderBottomColor, borderLeft, borderRight, borderStyle, borderTop, borderWidth, padding, styles } from "./css.js";
import { onClick } from "./evts.js";
import { HtmlCustomTag } from "./HtmlCustomTag.js";
import { setOpen } from "./ops.js";
import { Button, P } from "./tags.js";

const selectEvt = new Event("select");

/**
 * A panel and a button that opens it.
 **/
export class OptionPanelTag extends HtmlCustomTag {

    /**
     * Creates a new panel that can be opened with a button click, 
     * living in a collection of panels that will be hidden when
     * this panel is opened.
     * @param {string} panelID - the ID to use for the panel element.
     * @param {string} name - the text to use on the button.
     * @param {...any} rest
     */
    constructor(panelID, name, ...rest) {
        super("div",
            id(panelID),
            padding("1em"),
            P(...rest));

        this.button = Button(
            id(panelID + "Btn"),
            onClick(() => this.dispatchEvent(selectEvt)),
            name);
    }

    isForwardedEvent(name) {
        return name !== "select";
    }

    /**
     * Gets whether or not the panel is visible
     * @type {boolean}
     **/
    get visible() {
        return this.element.style.display !== null;
    }

    /**
     * Sets whether or not the panel is visible
     * @param {boolean} v
     **/
    set visible(v) {
        setOpen(this.element, v);
        styles(
            borderStyle("solid"),
            borderWidth("2px"),
            backgroundColor(v ? "#ddd" : "transparent"),
            borderTop(v ? "" : "none"),
            borderRight(v ? "" : "none"),
            borderBottomColor(v ? "#ddd" : ""),
            borderLeft(v ? "" : "none"))
            .apply(this.button);
    }
}