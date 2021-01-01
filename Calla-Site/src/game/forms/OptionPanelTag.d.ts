import { HtmlCustomTag } from "./HtmlCustomTag";
/**
 * Creates an OptionPanelTag element
 * @param {string} id - the ID to use for the content element of the option panel
 * @param {string} name - the text to use in the button that triggers displaying the content element
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text to use on the content element
 */
export declare function OptionPanel(id: any, name: any, ...rest: any[]): OptionPanelTag;
/**
 * A panel and a button that opens it.
 **/
export declare class OptionPanelTag extends HtmlCustomTag {
    /**
     * Creates a new panel that can be opened with a button click,
     * living in a collection of panels that will be hidden when
     * this panel is opened.
     * @param {string} panelID - the ID to use for the panel element.
     * @param {string} name - the text to use on the button.
     * @param {...any} rest
     */
    constructor(panelID: any, name: any, ...rest: any[]);
    isForwardedEvent(name: any): boolean;
    /**
     * Gets whether or not the panel is visible
     * @type {boolean}
     **/
    get visible(): boolean;
    /**
     * Sets whether or not the panel is visible
     * @param {boolean} v
     **/
    set visible(v: boolean);
}
