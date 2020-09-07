import { isBoolean, isFunction, isNumber, isString } from "../calla/typeChecks";
import { HtmlAttr } from "./attrs";
import { CssProp, CssPropSet } from "./css";
import { HtmlEvt } from "./evts";

/**
 * @typedef {(Node|HtmlAttr|HtmlEvt|string|number|boolean|Date)} TagChild
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
    let elem = null;

    for (let i = 0; i < rest.length; ++i) {
        const attr = rest[i];
        if (isFunction(attr)) {
            rest[i] = attr(true);
        }

        if (attr instanceof HtmlAttr
            && attr.key === "id") {
            elem = document.getElementById(attr.value);
        }
    }

    if (elem === null) {
        elem = document.createElement(name);
    }

    for (let x of rest) {
        if (x !== null && x !== undefined) {
            if (isString(x)
                || isNumber(x)
                || isBoolean(x)
                || x instanceof Date) {
                elem.appendChild(document.createTextNode(x));
            }
            else if (x instanceof Node) {
                elem.appendChild(x);
            }
            else if (x.element instanceof Node) {
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