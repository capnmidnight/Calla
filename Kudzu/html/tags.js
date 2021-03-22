import { isBoolean, isFunction, isNumber, isObject, isString } from "../typeChecks";
import { Attr, type } from "./attrs";
import { CssPropSet, margin, styles } from "./css";
function hasNode(obj) {
    return isObject(obj)
        && "element" in obj
        && obj.element instanceof Node;
}
export function isFocusable(elem) {
    return "focus" in elem && isFunction(elem.focus);
}
export function elementSetDisplay(elem, visible, visibleDisplayType = "block") {
    elem.style.display = visible ? visibleDisplayType : "none";
}
export function elementIsDisplayed(elem) {
    return elem.style.display !== "none";
}
export function getElement(selector) {
    return document.querySelector(selector);
}
export function getButton(selector) {
    return getElement(selector);
}
export function getInput(selector) {
    return getElement(selector);
}
export function getSelect(selector) {
    return getElement(selector);
}
export function getCanvas(selector) {
    return getElement(selector);
}
/**
 * Creates an HTML element for a given tag name.
 *
 * Boolean attributes that you want to default to true can be passed
 * as just the attribute creating function,
 *   e.g. `Audio(autoPlay)` vs `Audio(autoPlay(true))`
 * @param name - the name of the tag
 * @param rest - optional attributes, child elements, and text
 * @returns
 */
export function tag(name, ...rest) {
    let elem = null;
    for (const attr of rest) {
        if (attr instanceof Attr
            && attr.key === "id") {
            elem = document.getElementById(attr.value);
            break;
        }
    }
    if (elem == null) {
        elem = document.createElement(name);
    }
    for (let x of rest) {
        if (x != null) {
            if (x instanceof CssPropSet) {
                x.apply(elem.style);
            }
            else if (isString(x)
                || isNumber(x)
                || isBoolean(x)
                || x instanceof Date
                || x instanceof Node
                || hasNode(x)) {
                if (hasNode(x)) {
                    x = x.element;
                }
                else if (!(x instanceof Node)) {
                    x = document.createTextNode(x.toLocaleString());
                }
                elem.appendChild(x);
            }
            else {
                if (x instanceof Function) {
                    x = x(true);
                }
                x.apply(elem);
            }
        }
    }
    return elem;
}
export function isDisableable(element) {
    return "disabled" in element
        && typeof element.disabled === "boolean";
}
/**
 * Empty an element of all children. This is faster than setting `innerHTML = ""`.
 */
export function elementClearChildren(elem) {
    while (elem.lastChild) {
        elem.lastChild.remove();
    }
}
export function elementSetText(elem, text) {
    elementClearChildren(elem);
    elem.appendChild(TextNode(text));
}
export function A(...rest) { return tag("a", ...rest); }
export function Abbr(...rest) { return tag("abbr", ...rest); }
export function Address(...rest) { return tag("address", ...rest); }
export function Area(...rest) { return tag("area", ...rest); }
export function Article(...rest) { return tag("article", ...rest); }
export function Aside(...rest) { return tag("aside", ...rest); }
export function Audio(...rest) { return tag("audio", ...rest); }
export function B(...rest) { return tag("b", ...rest); }
export function Base(...rest) { return tag("base", ...rest); }
export function BDI(...rest) { return tag("bdi", ...rest); }
export function BDO(...rest) { return tag("bdo", ...rest); }
export function BlockQuote(...rest) { return tag("blockquote", ...rest); }
export function Body(...rest) { return tag("body", ...rest); }
export function BR() { return tag("br"); }
export function ButtonRaw(...rest) { return tag("button", ...rest); }
export function Button(...rest) { return ButtonRaw(...rest, type("button")); }
export function ButtonSubmit(...rest) { return ButtonRaw(...rest, type("submit")); }
export function ButtonReset(...rest) { return ButtonRaw(...rest, type("reset")); }
export function Canvas(...rest) { return tag("canvas", ...rest); }
export function Caption(...rest) { return tag("caption", ...rest); }
export function Cite(...rest) { return tag("cite", ...rest); }
export function Code(...rest) { return tag("code", ...rest); }
export function Col(...rest) { return tag("col", ...rest); }
export function ColGroup(...rest) { return tag("colgroup", ...rest); }
export function Data(...rest) { return tag("data", ...rest); }
export function DataList(...rest) { return tag("datalist", ...rest); }
export function DD(...rest) { return tag("dd", ...rest); }
export function Del(...rest) { return tag("del", ...rest); }
export function Details(...rest) { return tag("details", ...rest); }
export function DFN(...rest) { return tag("dfn", ...rest); }
export function Dialog(...rest) { return tag("dialog", ...rest); }
export function Dir(...rest) { return tag("dir", ...rest); }
export function Div(...rest) { return tag("div", ...rest); }
export function DL(...rest) { return tag("dl", ...rest); }
export function DT(...rest) { return tag("dt", ...rest); }
export function Em(...rest) { return tag("em", ...rest); }
export function Embed(...rest) { return tag("embed", ...rest); }
export function FieldSet(...rest) { return tag("fieldset", ...rest); }
export function FigCaption(...rest) { return tag("figcaption", ...rest); }
export function Figure(...rest) { return tag("figure", ...rest); }
export function Footer(...rest) { return tag("footer", ...rest); }
export function Form(...rest) { return tag("form", ...rest); }
export function H1(...rest) { return tag("h1", ...rest); }
export function H2(...rest) { return tag("h2", ...rest); }
export function H3(...rest) { return tag("h3", ...rest); }
export function H4(...rest) { return tag("h4", ...rest); }
export function H5(...rest) { return tag("h5", ...rest); }
export function H6(...rest) { return tag("h6", ...rest); }
export function HR(...rest) { return tag("hr", ...rest); }
export function Head(...rest) { return tag("head", ...rest); }
export function Header(...rest) { return tag("header", ...rest); }
export function HGroup(...rest) { return tag("hgroup", ...rest); }
export function HTML(...rest) { return tag("html", ...rest); }
export function I(...rest) { return tag("i", ...rest); }
export function IFrame(...rest) { return tag("iframe", ...rest); }
export function Img(...rest) { return tag("img", ...rest); }
export function Input(...rest) { return tag("input", ...rest); }
export function Ins(...rest) { return tag("ins", ...rest); }
export function KBD(...rest) { return tag("kbd", ...rest); }
export function Label(...rest) { return tag("label", ...rest); }
export function Legend(...rest) { return tag("legend", ...rest); }
export function LI(...rest) { return tag("li", ...rest); }
export function Link(...rest) { return tag("link", ...rest); }
export function Main(...rest) { return tag("main", ...rest); }
export function HtmlMap(...rest) { return tag("map", ...rest); }
export function Mark(...rest) { return tag("mark", ...rest); }
export function Marquee(...rest) { return tag("marquee", ...rest); }
export function Menu(...rest) { return tag("menu", ...rest); }
export function Meta(...rest) { return tag("meta", ...rest); }
export function Meter(...rest) { return tag("meter", ...rest); }
export function Nav(...rest) { return tag("nav", ...rest); }
export function NoScript(...rest) { return tag("noscript", ...rest); }
export function HtmlObject(...rest) { return tag("object", ...rest); }
export function OL(...rest) { return tag("ol", ...rest); }
export function OptGroup(...rest) { return tag("optgroup", ...rest); }
export function Option(...rest) { return tag("option", ...rest); }
export function Output(...rest) { return tag("output", ...rest); }
export function P(...rest) { return tag("p", ...rest); }
export function Param(...rest) { return tag("param", ...rest); }
export function Picture(...rest) { return tag("picture", ...rest); }
export function Pre(...rest) { return tag("pre", ...rest); }
export function Progress(...rest) { return tag("progress", ...rest); }
export function Q(...rest) { return tag("q", ...rest); }
export function RB(...rest) { return tag("rb", ...rest); }
export function RP(...rest) { return tag("rp", ...rest); }
export function RT(...rest) { return tag("rt", ...rest); }
export function RTC(...rest) { return tag("rtc", ...rest); }
export function Ruby(...rest) { return tag("ruby", ...rest); }
export function S(...rest) { return tag("s", ...rest); }
export function Samp(...rest) { return tag("samp", ...rest); }
export function Script(...rest) { return tag("script", ...rest); }
export function Section(...rest) { return tag("section", ...rest); }
export function Select(...rest) { return tag("select", ...rest); }
export function Slot(...rest) { return tag("slot", ...rest); }
export function Small(...rest) { return tag("small", ...rest); }
export function Source(...rest) { return tag("source", ...rest); }
export function Span(...rest) { return tag("span", ...rest); }
export function Strong(...rest) { return tag("strong", ...rest); }
export function Sub(...rest) { return tag("sub", ...rest); }
export function Summary(...rest) { return tag("summary", ...rest); }
export function Sup(...rest) { return tag("sup", ...rest); }
export function Table(...rest) { return tag("table", ...rest); }
export function TBody(...rest) { return tag("tbody", ...rest); }
export function TD(...rest) { return tag("td", ...rest); }
export function Template(...rest) { return tag("template", ...rest); }
export function TextArea(...rest) { return tag("textarea", ...rest); }
export function TFoot(...rest) { return tag("tfoot", ...rest); }
export function TH(...rest) { return tag("th", ...rest); }
export function THead(...rest) { return tag("thead", ...rest); }
export function Time(...rest) { return tag("time", ...rest); }
export function Title(...rest) { return tag("title", ...rest); }
export function TR(...rest) { return tag("tr", ...rest); }
export function Track(...rest) { return tag("track", ...rest); }
export function U(...rest) { return tag("u", ...rest); }
export function UL(...rest) { return tag("ul", ...rest); }
export function Var(...rest) { return tag("var", ...rest); }
export function Video(...rest) { return tag("video", ...rest); }
export function WBR() { return tag("wbr"); }
/**
 * creates an HTML Input tag that is a button.
 */
export function InputButton(...rest) { return Input(type("button"), ...rest); }
/**
 * creates an HTML Input tag that is a checkbox.
 */
export function InputCheckbox(...rest) { return Input(type("checkbox"), ...rest); }
/**
 * creates an HTML Input tag that is a color picker.
 */
export function InputColor(...rest) { return Input(type("color"), ...rest); }
/**
 * creates an HTML Input tag that is a date picker.
 */
export function InputDate(...rest) { return Input(type("date"), ...rest); }
/**
 * creates an HTML Input tag that is a local date-time picker.
 */
export function InputDateTime(...rest) { return Input(type("datetime-local"), ...rest); }
/**
 * creates an HTML Input tag that is an email entry field.
 */
export function InputEmail(...rest) { return Input(type("email"), ...rest); }
/**
 * creates an HTML Input tag that is a file picker.
 */
export function InputFile(...rest) { return Input(type("file"), ...rest); }
/**
 * creates an HTML Input tag that is a hidden field.
 */
export function InputHidden(...rest) { return Input(type("hidden"), ...rest); }
/**
 * creates an HTML Input tag that is a graphical submit button.
 */
export function InputImage(...rest) { return Input(type("image"), ...rest); }
/**
 * creates an HTML Input tag that is a month picker.
 */
export function InputMonth(...rest) { return Input(type("month"), ...rest); }
/**
 * creates an HTML Input tag that is a month picker.
 */
export function InputNumber(...rest) { return Input(type("number"), ...rest); }
/**
 * creates an HTML Input tag that is a password entry field.
 */
export function InputPassword(...rest) { return Input(type("password"), ...rest); }
/**
 * creates an HTML Input tag that is a radio button.
 */
export function InputRadio(...rest) { return Input(type("radio"), ...rest); }
/**
 * creates an HTML Input tag that is a range selector.
 */
export function InputRange(...rest) { return Input(type("range"), ...rest); }
/**
 * creates an HTML Input tag that is a form reset button.
 */
export function InputReset(...rest) { return Input(type("reset"), ...rest); }
/**
 * creates an HTML Input tag that is a search entry field.
 */
export function InputSearch(...rest) { return Input(type("search"), ...rest); }
/**
 * creates an HTML Input tag that is a submit button.
 */
export function InputSubmit(...rest) { return Input(type("submit"), ...rest); }
/**
 * creates an HTML Input tag that is a telephone number entry field.
 */
export function InputTelephone(...rest) { return Input(type("tel"), ...rest); }
/**
 * creates an HTML Input tag that is a text entry field.
 */
export function InputText(...rest) { return Input(type("text"), ...rest); }
/**
 * creates an HTML Input tag that is a time picker.
 */
export function InputTime(...rest) { return Input(type("time"), ...rest); }
/**
 * creates an HTML Input tag that is a URL entry field.
 */
export function InputURL(...rest) { return Input(type("url"), ...rest); }
/**
 * creates an HTML Input tag that is a week picker.
 */
export function InputWeek(...rest) { return Input(type("week"), ...rest); }
/**
 * Creates a text node out of the give input.
 */
export function TextNode(txt) {
    return document.createTextNode(txt);
}
/**
 * Creates a Div element with margin: auto.
 */
export function Run(...rest) {
    return Div(styles(margin("auto")), ...rest);
}
export function Style(...rest) {
    let elem = document.createElement("style");
    document.head.appendChild(elem);
    for (let x of rest) {
        x.apply(elem.sheet);
    }
    return elem;
}
//# sourceMappingURL=tags.js.map