import { EventBase } from "kudzu/events/EventBase";
import { tag, TagChild } from "kudzu/html/tags";
import { setOpen } from "./ops";

/**
 * A pseudo-element that is made out of other elements.
 **/
export class HtmlCustomTag<ElementT extends HTMLElement> extends EventBase {
    element: ElementT;
    /**
     * Creates a new pseudo-element
     * @param tagName - the type of tag that will contain the elements in the custom tag.
     * @param rest - optional attributes, child elements, and text
     */
    constructor(tagName: string, ...rest: TagChild[]) {
        super();
        this.element = tag(tagName, ...rest) as ElementT;
    }

    /**
     * Gets the ID attribute of the container element.
     **/
    get id(): string {
        return this.element.id;
    }

    /**
     * Retrieves the desired element for attaching events.
     **/
    get eventTarget(): HTMLElement {
        return this.element;
    }

    /**
     * Determine if an event type should be forwarded to the container element.
     */
    isForwardedEvent(_name: string): boolean {
        return true;
    }

    /**
     * Adds an event listener to the container element.
     * @param name - the name of the event to attach to.
     * @param callback - the callback function to use with the event handler.
     * @param opts - additional attach options.
     */
    addEventListener(name: string, callback: (evt: Event) => any, opts?: AddEventListenerOptions) {
        if (this.isForwardedEvent(name)) {
            this.eventTarget.addEventListener(name, callback, opts);
        }
        else {
            super.addEventListener(name, callback, opts);
        }
    }

    /**
     * Removes an event listener from the container element.
     * @param name - the name of the event to attach to.
     * @param callback - the callback function to use with the event handler.
     */
    removeEventListener(name: string, callback: (evt: Event) => any) {
        if (this.isForwardedEvent(name)) {
            this.eventTarget.removeEventListener(name, callback);
        }
        else {
            super.removeEventListener(name, callback);
        }
    }

    /**
     * Gets the style attribute of the underlying select box.
     */
    get style(): CSSStyleDeclaration {
        return this.element.style;
    }

    get visible() {
        return this.style.display !== null;
    }

    set visible(v) {
        setOpen(this.element, v);
    }

    get tagName(): string {
        return this.element.tagName;
    }

    get disabled(): boolean {
        return false;
    }

    set disabled(_v: boolean) {
    }

    /**
     * Moves cursor focus to the underyling element.
     **/
    focus() {
        this.element.focus();
    }

    /**
     * Removes cursor focus from the underlying element.
     **/
    blur() {
        this.element.blur();
    }
}