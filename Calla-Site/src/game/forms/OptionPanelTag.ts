import { TypedEvent } from "kudzu/events/EventBase";
import { id } from "kudzu/html/attrs";
import { onClick } from "kudzu/html/evts";
import type { TagChild } from "kudzu/html/tags";
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
export function OptionPanel(id: string, name: string, ...rest: TagChild[]) {
    return new OptionPanelTag(id, name, ...rest);
}

/**
 * A panel and a button that opens it.
 **/
export class OptionPanelTag extends HtmlCustomTag<HTMLDivElement> {
    button: HTMLButtonElement;

    /**
     * Creates a new panel that can be opened with a button click, 
     * living in a collection of panels that will be hidden when
     * this panel is opened.
     * @param id - the ID to use for the content element of the option panel
     * @param name - the text to use in the button that triggers displaying the content element
     * @param rest - optional attributes, child elements, and text to use on the content element
     */
    constructor(panelID: string, name: string, ...rest: TagChild[]) {
        super("div",
            id(panelID),
            P(...rest));

        this.button = Button(
            id(panelID + "Btn"),
            onClick(() => this.dispatchEvent(selectEvt)),
            name);
    }

    isForwardedEvent(name: string) {
        return name !== "select";
    }

    /**
     * Gets whether or not the panel is visible
     **/
    get visible(): boolean {
        return super.visible;
    }

    /**
     * Sets whether or not the panel is visible
     **/
    set visible(v: boolean) {
        super.visible = v;
        this.button.className = v ? "tabSelected" : "tabUnselected";
        this.element.className = v ? "tabSelected" : "tabUnselected";
    }
}