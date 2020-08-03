import { isBoolean, isFunction, isNumber, isString } from "../../../js/src/index.js";
import { HtmlAttr } from "./attrs.js";
import { CssProp, CssPropSet } from "./css.js";
import { HtmlEvt } from "./evts.js";
import { HtmlCustomTag } from "./HtmlCustomTag.js";

/**
 * @typedef {(Element|HtmlAttr|HtmlEvt|string|number|boolean|Date)} TagChild
 **/

/**
 * Creates an HTML element for a given tag name.
 * 
 * Boolean attributes that you want to default to true can be passed
 * as just the attribute creating function, 
 *   e.g. `Audio(autoPlay)` vs `Audio(autoPlay(true))`
 * @param {string} name - the name of the tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
export function tag(name, ...rest) {
    const elem = document.createElement(name);

    for (let i = 0; i < rest.length; ++i) {
        // 
        if (isFunction(rest[i])) {
            rest[i] = rest[i](true);
        }
    }

    for (let x of rest) {
        if (x !== null && x !== undefined) {
            if (isString(x)
                || isNumber(x)
                || isBoolean(x)
                || x instanceof Date) {
                elem.appendChild(document.createTextNode(x));
            }
            else if (x instanceof Element) {
                elem.appendChild(x);
            }
            else if (x instanceof HtmlCustomTag) {
                elem.appendChild(x.element);
            }
            else if (x instanceof HtmlAttr
                || x instanceof CssProp
                || x instanceof CssPropSet) {
                x.apply(elem);
            }
            else if (x instanceof HtmlEvt) {
                x.add(elem);
            }
            else {
                console.trace(`Skipping ${x}: unsupported value type.`, x);
            }
        }
    }

    return elem;
}