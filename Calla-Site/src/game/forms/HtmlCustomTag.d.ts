import { EventBase } from "../lib/calla";
/**
 * A pseudo-element that is made out of other elements.
 **/
export declare class HtmlCustomTag extends EventBase {
    /**
     * Creates a new pseudo-element
     * @param {string} tagName - the type of tag that will contain the elements in the custom tag.
     * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
     */
    constructor(tagName: any, ...rest: any[]);
    /**
     * Gets the ID attribute of the container element.
     * @type {string}
     **/
    get id(): any;
    /**
     * Retrieves the desired element for attaching events.
     * @returns {HTMLElement}
     **/
    get eventTarget(): any;
    /**
     * Determine if an event type should be forwarded to the container element.
     * @param {string} name
     * @returns {boolean}
     */
    isForwardedEvent(name: any): boolean;
    /**
     * Adds an event listener to the container element.
     * @param {string} name - the name of the event to attach to.
     * @param {Function} callback - the callback function to use with the event handler.
     * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
     */
    addEventListener(name: any, callback: any, opts: any): void;
    /**
     * Removes an event listener from the container element.
     * @param {string} name - the name of the event to attach to.
     * @param {Function} callback - the callback function to use with the event handler.
     */
    removeEventListener(name: any, callback: any): void;
    /**
     * Gets the style attribute of the underlying select box.
     * @type {ElementCSSInlineStyle}
     */
    get style(): any;
    get tagName(): any;
    get disabled(): any;
    set disabled(v: any);
    /**
     * Moves cursor focus to the underyling element.
     **/
    focus(): void;
    /**
     * Removes cursor focus from the underlying element.
     **/
    blur(): void;
}
