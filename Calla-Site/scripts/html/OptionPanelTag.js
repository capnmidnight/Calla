import { id } from "./attrs.js";
import { onClick } from "./evts.js";
import { HtmlCustomTag } from "./HtmlCustomTag.js";
import { setOpen } from "./ops.js";
import { Button, P } from "./tags.js";

const selectEvt = new Event("select");

/**
 * Creates an OptionPanelTag element
 * @param {string} id - the ID to use for the content element of the option panel
 * @param {string} name - the text to use in the button that triggers displaying the content element
 * @param {...TagChild} rest - optional attributes, child elements, and text to use on the content element
 */
export function OptionPanel(id, name, ...rest) {
    return new OptionPanelTag(id, name, ...rest);
}

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
        this.button.className = v ? "tabSelected" : "tabUnselected";
        this.element.className = v ? "tabSelected" : "tabUnselected";
    }
}