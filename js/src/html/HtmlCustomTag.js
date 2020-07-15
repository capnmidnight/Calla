import "../protos.js";
import { tag } from "./tag.js";

/**
 * A pseudo-element that is made out of other elements.
 **/
export class HtmlCustomTag extends EventTarget {
    /**
     * Creates a new pseudo-element
     * @param {string} tagName - the type of tag that will contain the elements in the custom tag.
     * @param {...TagChild} rest - optional attributes, child elements, and text
     */
    constructor(tagName, ...rest) {
        super();
        if (rest.length === 1
            && rest[0] instanceof Element) {
            /** @type {HTMLElement} */
            this.element = rest[0];
        }
        else {
            /** @type {HTMLElement} */
            this.element = tag(tagName, ...rest);
        }
    }

    /**
     * Gets the ID attribute of the container element.
     * @type {string}
     **/
    get id() {
        return this.element.id;
    }

    /**
     * Retrieves the desired element for attaching events.
     * @returns {HTMLElement}
     **/
    get eventTarget() {
        return this.element;
    }

    /**
     * Determine if an event type should be forwarded to the container element.
     * @param {string} name
     * @returns {boolean}
     */
    isForwardedEvent(name) {
        return true;
    }

    /**
     * Adds an event listener to the container element.
     * @param {string} name - the name of the event to attach to.
     * @param {Function} callback - the callback function to use with the event handler.
     * @param {(boolean|AddEventListenerOptions)=} opts - additional attach options.
     */
    addEventListener(name, callback, opts) {
        if (this.isForwardedEvent(name)) {
            this.eventTarget.addEventListener(name, callback, opts);
        }
        else {
            super.addEventListener(name, callback, opts);
        }
    }

    /**
     * Removes an event listener from the container element.
     * @param {string} name - the name of the event to attach to.
     * @param {Function} callback - the callback function to use with the event handler.
     */
    removeEventListener(name, callback) {
        if (this.isForwardedEvent(name)) {
            this.eventTarget.removeEventListener(name, callback);
        }
        else {
            super.removeEventListener(name, callback);
        }
    }

    /**
     * Wait for a specific event, one time.
     * @param {string} resolveEvt - the name of the event that will resolve the Promise this method creates.
     * @param {string} rejectEvt - the name of the event that could reject the Promise this method creates.
     * @param {number} timeout - the number of milliseconds to wait for the resolveEvt, before rejecting.
     */
    async once(resolveEvt, rejectEvt, timeout) {
        return await this.eventTarget.once(resolveEvt, rejectEvt, timeout);
    }

    /**
     * Set whether or not the container element is visible.
     * @param {boolean} v
     */
    setOpen(v) {
        this.element.setOpen(v);
    }

    /**
     * Makes the container element visible, if it is not already.
     **/
    show() {
        this.setOpen(true);
    }

    /**
     * Makes the container element not visible, if it is not already.
     **/
    hide() {
        this.setOpen(false);
    }

    /**
     * Gets the style attribute of the underlying select box.
     * @type {ElementCSSInlineStyle}
     */
    get style() {
        return this.element.style;
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