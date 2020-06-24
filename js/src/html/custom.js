import "../protos.js";
import { tag } from "./tag.js";

export class HtmlCustomTag extends EventTarget {
    constructor(tagName, ...rest) {
        super();
        if (rest.length === 1
            && rest[0] instanceof Element) {
            this.element = rest[0];
        }
        else {
            this.element = tag(tagName, ...rest);
        }
    }
}