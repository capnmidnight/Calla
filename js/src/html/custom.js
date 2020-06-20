import "../protos.js";
import { tag } from "./tags.js";

export class HtmlCustomTag {
    constructor(tagName, ...rest) {
        if (rest.length === 1
            && rest[0] instanceof Element) {
            this.element = rest[0];
        }
        else {
            this.element = tag(tagName, ...rest);
        }
    }
}