import { TypedEvent } from "kudzu/events/EventBase";
import { id } from "kudzu/html/attrs";
import { onClick } from "kudzu/html/evts";
import { Button, P } from "kudzu/html/tags";
import { HtmlCustomTag } from "./HtmlCustomTag";
const selectEvt = new TypedEvent("select");
/**
 * Creates a new panel that can be opened with a button click,
 * living in a collection of panels that will be hidden when
 * this panel is opened.
 * @param id - the ID to use for the content element of the option panel
 * @param name - the text to use in the button that triggers displaying the content element
 * @param rest - optional attributes, child elements, and text to use on the content element
 */
export function OptionPanel(id, name, ...rest) {
    return new OptionPanelTag(id, name, ...rest);
}
/**
 * A panel and a button that opens it.
 **/
export class OptionPanelTag extends HtmlCustomTag {
    button;
    /**
     * Creates a new panel that can be opened with a button click,
     * living in a collection of panels that will be hidden when
     * this panel is opened.
     * @param id - the ID to use for the content element of the option panel
     * @param name - the text to use in the button that triggers displaying the content element
     * @param rest - optional attributes, child elements, and text to use on the content element
     */
    constructor(panelID, name, ...rest) {
        super("div", id(panelID), P(...rest));
        this.button = Button(id(panelID + "Btn"), onClick(() => this.dispatchEvent(selectEvt)), name);
    }
    isForwardedEvent(name) {
        return name !== "select";
    }
    /**
     * Gets whether or not the panel is visible
     **/
    get visible() {
        return super.visible;
    }
    /**
     * Sets whether or not the panel is visible
     **/
    set visible(v) {
        super.visible = v;
        this.button.className = v ? "tabSelected" : "tabUnselected";
        this.element.className = v ? "tabSelected" : "tabUnselected";
    }
}
//# sourceMappingURL=OptionPanelTag.js.map