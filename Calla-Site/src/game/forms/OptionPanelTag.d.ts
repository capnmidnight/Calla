import type { TagChild } from "kudzu/html/tags";
import { HtmlCustomTag } from "./HtmlCustomTag";
/**
 * Creates a new panel that can be opened with a button click,
 * living in a collection of panels that will be hidden when
 * this panel is opened.
 * @param id - the ID to use for the content element of the option panel
 * @param name - the text to use in the button that triggers displaying the content element
 * @param rest - optional attributes, child elements, and text to use on the content element
 */
export declare function OptionPanel(id: string, name: string, ...rest: TagChild[]): OptionPanelTag;
/**
 * A panel and a button that opens it.
 **/
export declare class OptionPanelTag extends HtmlCustomTag<HTMLDivElement> {
    button: HTMLButtonElement;
    /**
     * Creates a new panel that can be opened with a button click,
     * living in a collection of panels that will be hidden when
     * this panel is opened.
     * @param id - the ID to use for the content element of the option panel
     * @param name - the text to use in the button that triggers displaying the content element
     * @param rest - optional attributes, child elements, and text to use on the content element
     */
    constructor(panelID: string, name: string, ...rest: TagChild[]);
    isForwardedEvent(name: string): boolean;
    /**
     * Gets whether or not the panel is visible
     **/
    get visible(): boolean;
    /**
     * Sets whether or not the panel is visible
     **/
    set visible(v: boolean);
}
