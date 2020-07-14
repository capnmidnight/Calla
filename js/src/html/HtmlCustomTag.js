import "../protos.js";
import { tag } from "./tag.js";

export class HtmlCustomTag extends EventTarget {
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

    get id() {
        return this.element.id;
    }

    addEventListener(name, callback, opts) {
        this.element.addEventListener(name, callback, opts);
    }

    removeEventListener(name, callback) {
        this.element.removeEventListener(name, callback);
    }

    setOpen(v) {
        this.element.setOpen(v);
    }

    show() {
        this.setOpen(true);
    }

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