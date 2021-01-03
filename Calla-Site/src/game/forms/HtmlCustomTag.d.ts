import { EventBase } from "kudzu/events/EventBase";
import { TagChild } from "kudzu/html/tags";
/**
 * A pseudo-element that is made out of other elements.
 **/
export declare class HtmlCustomTag<ElementT extends HTMLElement> extends EventBase {
    element: ElementT;
    /**
     * Creates a new pseudo-element
     * @param tagName - the type of tag that will contain the elements in the custom tag.
     * @param rest - optional attributes, child elements, and text
     */
    constructor(tagName: string, ...rest: TagChild[]);
    /**
     * Gets the ID attribute of the container element.
     **/
    get id(): string;
    /**
     * Retrieves the desired element for attaching events.
     **/
    get eventTarget(): HTMLElement;
    /**
     * Determine if an event type should be forwarded to the container element.
     */
    isForwardedEvent(_name: string): boolean;
    /**
     * Adds an event listener to the container element.
     * @param name - the name of the event to attach to.
     * @param callback - the callback function to use with the event handler.
     * @param opts - additional attach options.
     */
    addEventListener(name: string, callback: (evt: Event) => any, opts?: AddEventListenerOptions): void;
    /**
     * Removes an event listener from the container element.
     * @param name - the name of the event to attach to.
     * @param callback - the callback function to use with the event handler.
     */
    removeEventListener(name: string, callback: (evt: Event) => any): void;
    /**
     * Gets the style attribute of the underlying select box.
     */
    get style(): CSSStyleDeclaration;
    get visible(): boolean;
    set visible(v: boolean);
    get tagName(): string;
    get disabled(): boolean;
    set disabled(_v: boolean);
    /**
     * Moves cursor focus to the underyling element.
     **/
    focus(): void;
    /**
     * Removes cursor focus from the underlying element.
     **/
    blur(): void;
}
