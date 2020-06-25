import { HtmlAttr } from "./attrs.js";
import { HtmlCustomTag } from "./HtmlCustomTag.js";
import { HtmlEvt, isFunction } from "./evts.js";

export function tag(name, ...rest) {
    const elem = document.createElement(name);

    for (let i = 0; i < rest.length; ++i) {
        if (isFunction(rest[i])) {
            rest[i] = rest[i](true);
        }
    }

    for (let x of rest) {
        if (x !== null && x !== undefined) {
            if (x instanceof String || typeof x === "string"
                || x instanceof Number || typeof x === "number"
                || x instanceof Boolean || typeof x === "boolean"
                || x instanceof Date) {
                elem.appendChild(document.createTextNode(x));
            }
            else if (x instanceof Element) {
                elem.appendChild(x);
            }
            else if (x instanceof HtmlCustomTag) {
                elem.appendChild(x.element);
            }
            else if (x instanceof HtmlAttr) {
                x.apply(elem);
            }
            else if (x instanceof HtmlEvt) {
                x.add(elem);
            }
            else {
                console.trace(`Skipping ${x}: unsupported value type.`);
            }
        }
    }

    return elem;
}