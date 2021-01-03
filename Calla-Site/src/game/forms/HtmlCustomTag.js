import { EventBase } from "kudzu/events/EventBase";
import { tag } from "kudzu/html/tags";
import { setOpen } from "./ops";
/**
 * A pseudo-element that is made out of other elements.
 **/
export class HtmlCustomTag extends EventBase {
    /**
     * Creates a new pseudo-element
     * @param tagName - the type of tag that will contain the elements in the custom tag.
     * @param rest - optional attributes, child elements, and text
     */
    constructor(tagName, ...rest) {
        super();
        this.element = tag(tagName, ...rest);
    }
    /**
     * Gets the ID attribute of the container element.
     **/
    get id() {
        return this.element.id;
    }
    /**
     * Retrieves the desired element for attaching events.
     **/
    get eventTarget() {
        return this.element;
    }
    /**
     * Determine if an event type should be forwarded to the container element.
     */
    isForwardedEvent(_name) {
        return true;
    }
    /**
     * Adds an event listener to the container element.
     * @param name - the name of the event to attach to.
     * @param callback - the callback function to use with the event handler.
     * @param opts - additional attach options.
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
     * @param name - the name of the event to attach to.
     * @param callback - the callback function to use with the event handler.
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
     * Gets the style attribute of the underlying select box.
     */
    get style() {
        return this.element.style;
    }
    get visible() {
        return this.style.display !== null;
    }
    set visible(v) {
        setOpen(this.element, v);
    }
    get tagName() {
        return this.element.tagName;
    }
    get disabled() {
        return false;
    }
    set disabled(_v) {
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
//# sourceMappingURL=HtmlCustomTag.js.map