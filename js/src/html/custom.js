import "../protos.js";
import { tag } from "./tags.js";

export class HtmlCustomTag {
    constructor(tagName, ...rest) {
        this.element = tag(tagName, ...rest);
    }
}