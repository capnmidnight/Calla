import { LabeledInputTag } from "./LabeledInputTag.js";
import { LabeledSelectBoxTag } from "./LabeledSelectBoxTag.js";
import { OptionPanelTag } from "./OptionPanelTag.js";
import { SelectBoxTag } from "./SelectBoxTag.js";
import { tag } from "./tag.js";
import { type, width, height } from "./attrs.js";

/** @typedef {import("./tag.js").TagChild} TagChild **/

/**
 * Empty an element of all children. This is faster than
 * setting `innerHTML = ""`.
 * @param {any} elem
 */
export function clear(elem) {
    while (elem.lastChild) {
        elem.lastChild.remove();
    }
}

/**
 * creates an HTML A tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLAnchorElement}
 */
export function A(...rest) { return tag("a", ...rest); }

/**
 * creates an HTML Abbr tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
export function Abbr(...rest) { return tag("abbr", ...rest); }

/**
 * creates an HTML Address tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
export function Address(...rest) { return tag("address", ...rest); }

/**
 * creates an HTML Area tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLAreaElement}
 */
export function Area(...rest) { return tag("area", ...rest); }

/**
 * creates an HTML Article tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
export function Article(...rest) { return tag("article", ...rest); }

/**
 * creates an HTML Aside tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
export function Aside(...rest) { return tag("aside", ...rest); }

/**
 * creates an HTML Audio tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLAudioElement}
 */
export function Audio(...rest) { return tag("audio", ...rest); }

/**
 * creates an HTML B tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
export function B(...rest) { return tag("b", ...rest); }

/**
 * creates an HTML Base tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLBaseElement}
 */
export function Base(...rest) { return tag("base", ...rest); }

/**
 * creates an HTML BDI tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
export function BDI(...rest) { return tag("bdi", ...rest); }

/**
 * creates an HTML BDO tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
export function BDO(...rest) { return tag("bdo", ...rest); }

/**
 * creates an HTML BlockQuote tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
export function BlockQuote(...rest) { return tag("blockquote", ...rest); }

/**
 * creates an HTML Body tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLBodyElement}
 */
export function Body(...rest) { return tag("body", ...rest); }

/**
 * creates an HTML BR tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLBRElement}
 */
export function BR() { return tag("br"); }

/**
 * creates an HTML HtmlButton tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLButtonElement}
 */
export function ButtonRaw(...rest) { return tag("button", ...rest); }

/**
 * creates an HTML Button tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLButtonElement}
 */
export function Button(...rest) { return ButtonRaw(...rest, type("button")); }

/**
 * creates an HTML SubmitButton tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLButtonElement}
 */
export function ButtonSubmit(...rest) { return ButtonRaw(...rest, type("submit")); }

/**
 * creates an HTML ResetButton tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLButtonElement}
 */
export function ButtonReset(...rest) { return ButtonRaw(...rest, type("reset")); }

/**
 * creates an HTML Canvas tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLCanvasElement}
 */
export function Canvas(...rest) { return tag("canvas", ...rest); }

/**
 * creates an HTML Caption tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLTableCaptionElement}
 */
export function Caption(...rest) { return tag("caption", ...rest); }

/**
 * creates an HTML Cite tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
export function Cite(...rest) { return tag("cite", ...rest); }

/**
 * creates an HTML Code tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
export function Code(...rest) { return tag("code", ...rest); }

/**
 * creates an HTML Col tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLTableColElement}
 */
export function Col(...rest) { return tag("col", ...rest); }

/**
 * creates an HTML ColGroup tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLTableColElement}
 */
export function ColGroup(...rest) { return tag("colgroup", ...rest); }

/**
 * creates an HTML Content tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLContentElement}
 */
export function Content(...rest) { return tag("content", ...rest); }

/**
 * creates an HTML Data tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLDataElement}
 */
export function Data(...rest) { return tag("data", ...rest); }

/**
 * creates an HTML DataList tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLDataListElement}
 */
export function DataList(...rest) { return tag("datalist", ...rest); }

/**
 * creates an HTML DD tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
export function DD(...rest) { return tag("dd", ...rest); }

/**
 * creates an HTML Del tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLModElement}
 */
export function Del(...rest) { return tag("del", ...rest); }

/**
 * creates an HTML Details tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLDetailsElement}
 */
export function Details(...rest) { return tag("details", ...rest); }

/**
 * creates an HTML DFN tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
export function DFN(...rest) { return tag("dfn", ...rest); }

/**
 * creates an HTML Dialog tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLDialogElement}
 */
export function Dialog(...rest) { return tag("dialog", ...rest); }

/**
 * creates an HTML Dir tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLDirectoryElement}
 */
export function Dir(...rest) { return tag("dir", ...rest); }

/**
 * creates an HTML Div tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLDivElement}
 */
export function Div(...rest) { return tag("div", ...rest); }

/**
 * creates an HTML DL tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLDListElement}
 */
export function DL(...rest) { return tag("dl", ...rest); }

/**
 * creates an HTML DT tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
export function DT(...rest) { return tag("dt", ...rest); }

/**
 * creates an HTML Em tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
export function Em(...rest) { return tag("em", ...rest); }

/**
 * creates an HTML Embed tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLEmbedElement}
 */
export function Embed(...rest) { return tag("embed", ...rest); }

/**
 * creates an HTML FieldSet tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLFieldSetElement}
 */
export function FieldSet(...rest) { return tag("fieldset", ...rest); }

/**
 * creates an HTML FigCaption tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
export function FigCaption(...rest) { return tag("figcaption", ...rest); }

/**
 * creates an HTML Figure tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
export function Figure(...rest) { return tag("figure", ...rest); }

/**
 * creates an HTML Footer tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
export function Footer(...rest) { return tag("footer", ...rest); }

/**
 * creates an HTML Form tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLFormElement}
 */
export function Form(...rest) { return tag("form", ...rest); }

/**
 * creates an HTML H1 tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLHeadingElement}
 */
export function H1(...rest) { return tag("h1", ...rest); }

/**
 * creates an HTML H2 tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLHeadingElement}
 */
export function H2(...rest) { return tag("h2", ...rest); }

/**
 * creates an HTML H3 tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLHeadingElement}
 */
export function H3(...rest) { return tag("h3", ...rest); }

/**
 * creates an HTML H4 tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLHeadingElement}
 */
export function H4(...rest) { return tag("h4", ...rest); }

/**
 * creates an HTML H5 tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLHeadingElement}
 */
export function H5(...rest) { return tag("h5", ...rest); }

/**
 * creates an HTML H6 tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLHeadingElement}
 */
export function H6(...rest) { return tag("h6", ...rest); }

/**
 * creates an HTML HR tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLHRElement}
 */
export function HR(...rest) { return tag("hr", ...rest); }

/**
 * creates an HTML Head tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLHeadElement}
 */
export function Head(...rest) { return tag("head", ...rest); }

/**
 * creates an HTML Header tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
export function Header(...rest) { return tag("header", ...rest); }

/**
 * creates an HTML HGroup tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
export function HGroup(...rest) { return tag("hgroup", ...rest); }

/**
 * creates an HTML HTML tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLHtmlElement}
 */
export function HTML(...rest) { return tag("html", ...rest); }

/**
 * creates an HTML I tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
export function I(...rest) { return tag("i", ...rest); }

/**
 * creates an HTML IFrame tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLIFrameElement}
 */
export function IFrame(...rest) { return tag("iframe", ...rest); }

/**
 * creates an HTML Img tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLImageElement}
 */
export function Img(...rest) { return tag("img", ...rest); }

/**
 * creates an HTML Input tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLInputElement}
 */
export function Input(...rest) { return tag("input", ...rest); }

/**
 * creates an HTML Ins tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLModElement}
 */
export function Ins(...rest) { return tag("ins", ...rest); }

/**
 * creates an HTML KBD tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
export function KBD(...rest) { return tag("kbd", ...rest); }

/**
 * creates an HTML Label tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLLabelElement}
 */
export function Label(...rest) { return tag("label", ...rest); }

/**
 * creates an HTML Legend tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLLegendElement}
 */
export function Legend(...rest) { return tag("legend", ...rest); }

/**
 * creates an HTML LI tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLLIElement}
 */
export function LI(...rest) { return tag("li", ...rest); }

/**
 * creates an HTML Link tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLLinkElement}
 */
export function Link(...rest) { return tag("link", ...rest); }

/**
 * creates an HTML Main tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
export function Main(...rest) { return tag("main", ...rest); }

/**
 * creates an HTML Map tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLMapElement}
 */
export function Map(...rest) { return tag("map", ...rest); }

/**
 * creates an HTML Mark tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
export function Mark(...rest) { return tag("mark", ...rest); }

/**
 * creates an HTML Marquee tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLMarqueeElement}
 */
export function Marquee(...rest) { return tag("marquee", ...rest); }

/**
 * creates an HTML Menu tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLMenuElement}
 */
export function Menu(...rest) { return tag("menu", ...rest); }

/**
 * creates an HTML Meta tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLMetaElement}
 */
export function Meta(...rest) { return tag("meta", ...rest); }

/**
 * creates an HTML Meter tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLMeterElement}
 */
export function Meter(...rest) { return tag("meter", ...rest); }

/**
 * creates an HTML Nav tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
export function Nav(...rest) { return tag("nav", ...rest); }

/**
 * creates an HTML NoScript tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
export function NoScript(...rest) { return tag("noscript", ...rest); }

/**
 * creates an HTML HtmlObject tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLObjectElement}
 */
export function ObjectElement(...rest) { return tag("object", ...rest); }

/**
 * creates an HTML OL tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLOListElement}
 */
export function OL(...rest) { return tag("ol", ...rest); }

/**
 * creates an HTML OptGroup tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLOptGroupElement}
 */
export function OptGroup(...rest) { return tag("optgroup", ...rest); }

/**
 * creates an HTML Option tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLOptionElement}
 */
export function Option(...rest) { return tag("option", ...rest); }

/**
 * creates an HTML Output tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLOutputElement}
 */
export function Output(...rest) { return tag("output", ...rest); }

/**
 * creates an HTML P tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLParagraphElement}
 */
export function P(...rest) { return tag("p", ...rest); }

/**
 * creates an HTML Param tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLParamElement}
 */
export function Param(...rest) { return tag("param", ...rest); }

/**
 * creates an HTML Picture tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLPictureElement}
 */
export function Picture(...rest) { return tag("picture", ...rest); }

/**
 * creates an HTML Pre tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLPreElement}
 */
export function Pre(...rest) { return tag("pre", ...rest); }

/**
 * creates an HTML Progress tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLProgressElement}
 */
export function Progress(...rest) { return tag("progress", ...rest); }

/**
 * creates an HTML Q tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLQuoteElement}
 */
export function Q(...rest) { return tag("q", ...rest); }

/**
 * creates an HTML RB tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
export function RB(...rest) { return tag("rb", ...rest); }

/**
 * creates an HTML RP tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
export function RP(...rest) { return tag("rp", ...rest); }

/**
 * creates an HTML RT tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
export function RT(...rest) { return tag("rt", ...rest); }

/**
 * creates an HTML RTC tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
export function RTC(...rest) { return tag("rtc", ...rest); }

/**
 * creates an HTML Ruby tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
export function Ruby(...rest) { return tag("ruby", ...rest); }

/**
 * creates an HTML S tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
export function S(...rest) { return tag("s", ...rest); }

/**
 * creates an HTML Shadow tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLShadowElement}
 */
export function Shadow(...rest) { return tag("shadow", ...rest); }

/**
 * creates an HTML Samp tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
export function Samp(...rest) { return tag("samp", ...rest); }

/**
 * creates an HTML Script tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLScriptElement}
 */
export function Script(...rest) { return tag("script", ...rest); }

/**
 * creates an HTML Section tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
export function Section(...rest) { return tag("section", ...rest); }

/**
 * creates an HTML Select tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLSelectElement}
 */
export function Select(...rest) { return tag("select", ...rest); }

/**
 * creates an HTML Slot tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLSelectElement}
 */
export function Slot(...rest) { return tag("slot", ...rest); }

/**
 * creates an HTML Small tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
export function Small(...rest) { return tag("small", ...rest); }

/**
 * creates an HTML Source tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLSourceElement}
 */
export function Source(...rest) { return tag("source", ...rest); }

/**
 * creates an HTML Span tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLSpanElement}
 */
export function Span(...rest) { return tag("span", ...rest); }

/**
 * creates an HTML Strong tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
export function Strong(...rest) { return tag("strong", ...rest); }

/**
 * creates an HTML Style tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLStyleElement}
 */
export function Style(...rest) { return tag("style", ...rest); }

/**
 * creates an HTML Sub tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
export function Sub(...rest) { return tag("sub", ...rest); }

/**
 * creates an HTML Summary tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
export function Summary(...rest) { return tag("summary", ...rest); }

/**
 * creates an HTML Sup tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
export function Sup(...rest) { return tag("sup", ...rest); }

/**
 * creates an HTML Table tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLTableElement}
 */
export function Table(...rest) { return tag("table", ...rest); }

/**
 * creates an HTML TBody tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLTableSectionElement}
 */
export function TBody(...rest) { return tag("tbody", ...rest); }

/**
 * creates an HTML TD tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLTableCellElement}
 */
export function TD(...rest) { return tag("td", ...rest); }

/**
 * creates an HTML Template tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLTemplateElement}
 */
export function Template(...rest) { return tag("template", ...rest); }

/**
 * creates an HTML TextArea tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLTextAreaElement}
 */
export function TextArea(...rest) { return tag("textarea", ...rest); }

/**
 * creates an HTML TFoot tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLTableSectionElement}
 */
export function TFoot(...rest) { return tag("tfoot", ...rest); }

/**
 * creates an HTML TH tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
export function TH(...rest) { return tag("th", ...rest); }

/**
 * creates an HTML THead tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLTableSectionElement}
 */
export function THead(...rest) { return tag("thead", ...rest); }

/**
 * creates an HTML Time tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLTimeElement}
 */
export function Time(...rest) { return tag("time", ...rest); }

/**
 * creates an HTML Title tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLTitleElement}
 */
export function Title(...rest) { return tag("title", ...rest); }

/**
 * creates an HTML TR tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLTableRowElement}
 */
export function TR(...rest) { return tag("tr", ...rest); }

/**
 * creates an HTML Track tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLTrackElement}
 */
export function Track(...rest) { return tag("track", ...rest); }

/**
 * creates an HTML U tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
export function U(...rest) { return tag("u", ...rest); }

/**
 * creates an HTML UL tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLUListElement}
 */
export function UL(...rest) { return tag("ul", ...rest); }

/**
 * creates an HTML Var tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
export function Var(...rest) { return tag("var", ...rest); }

/**
 * creates an HTML Video tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLVideoElement}
 */
export function Video(...rest) { return tag("video", ...rest); }

/**
 * creates an HTML WBR tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
export function WBR() { return tag("wbr"); }

/**
 * creates an HTML XMP tag
 * @param {...TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
export function XMP(...rest) { return tag("xmp", ...rest); }

/**
 * Creates an offscreen canvas element, if they are available. Otherwise, returns an HTMLCanvasElement.
 * @param {number} w - the width of the canvas
 * @param {number} h - the height of the canvas
 * @param {...TagChild} rest - optional HTML attributes and child elements, to use in constructing the HTMLCanvasElement if OffscreenCanvas is not available.
 * @returns {OffscreenCanvas|HTMLCanvasElement}
 */
export function CanvasOffscreen(w, h, ...rest) {
    if (window.OffscreenCanvas) {
        return new OffscreenCanvas(w, h);
    }
    else {
        return Canvas(...rest, width(w), height(h));
    }
}

/**
 * Creates an input box that has a label attached to it.
 * @param {string} id - the ID to use for the input box
 * @param {string} inputType - the type to use for the input box (number, text, etc.)
 * @param {string} labelText - the text to display in the label
 * @param {...TagChild} rest - optional attributes, child elements, and text to use on the select element
 * @returns {LabeledInputTag}
 */
export function LabeledInput(id, inputType, labelText, ...rest) {
    return new LabeledInputTag(id, inputType, labelText, ...rest);
}

/**
 * Creates a string from a list item to use as the item's ID or label in a select box.
 * @callback makeItemValueCallback
 * @param {any} obj - the object
 * @returns {string}
 */

/**
 * Creates a select box that can bind to collections
 * @param {string} noSelectionText - the text to display when no items are available.
 * @param {makeItemValueCallback} makeID - a function that evalutes a databound item to create an ID for it.
 * @param {makeItemValueCallback} makeLabel - a function that evalutes a databound item to create a label for it.
 * @param {...TagChild} rest - optional attributes, child elements, and text to use on the select element
 * @returns {SelectBoxTag}
 */
export function SelectBox(noSelectionText, makeID, makeLabel, ...rest) {
    return new SelectBoxTag(noSelectionText, makeID, makeLabel, ...rest);
}

/**
 * Creates a select box, with a label attached to it, that can bind to collections
 * @param {string} id - the ID to use for the input box
 * @param {string} labelText - the text to display in the label
 * @param {string} noSelectionText - the text to display when no items are available.
 * @param {makeItemValueCallback} makeID - a function that evalutes a databound item to create an ID for it.
 * @param {makeItemValueCallback} makeLabel - a function that evalutes a databound item to create a label for it.
 * @param {...TagChild} rest - optional attributes, child elements, and text to use on the select element
 * @returns {LabeledSelectBoxTag}
 */
export function LabeledSelectBox(id, labelText, noSelectionText, makeID, makeLabel, ...rest) {
    return new LabeledSelectBoxTag(id, labelText, noSelectionText, makeID, makeLabel, ...rest);
}

/**
 * Creates an OptionPanelTag element
 * @param {string} id - the ID to use for the content element of the option panel
 * @param {string} name - the text to use in the button that triggers displaying the content element
 * @param {...TagChild} rest - optional attributes, child elements, and text to use on the content element
 */
export function OptionPanel(id, name, ...rest) {
    return new OptionPanelTag(id, name, ...rest);
}