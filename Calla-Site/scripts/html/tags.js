import { height, type, width } from "./attrs";
import { margin } from "./css";
import { tag } from "./tag";

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
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLAnchorElement}
 */
export function A(...rest) { return tag("a", ...rest); }

/**
 * creates an HTML Abbr tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
export function Abbr(...rest) { return tag("abbr", ...rest); }

/**
 * creates an HTML Address tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
export function Address(...rest) { return tag("address", ...rest); }

/**
 * creates an HTML Area tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLAreaElement}
 */
export function Area(...rest) { return tag("area", ...rest); }

/**
 * creates an HTML Article tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
export function Article(...rest) { return tag("article", ...rest); }

/**
 * creates an HTML Aside tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
export function Aside(...rest) { return tag("aside", ...rest); }

/**
 * creates an HTML Audio tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLAudioElement}
 */
export function Audio(...rest) { return tag("audio", ...rest); }

/**
 * creates an HTML B tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
export function B(...rest) { return tag("b", ...rest); }

/**
 * creates an HTML Base tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLBaseElement}
 */
export function Base(...rest) { return tag("base", ...rest); }

/**
 * creates an HTML BDI tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
export function BDI(...rest) { return tag("bdi", ...rest); }

/**
 * creates an HTML BDO tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
export function BDO(...rest) { return tag("bdo", ...rest); }

/**
 * creates an HTML BlockQuote tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
export function BlockQuote(...rest) { return tag("blockquote", ...rest); }

/**
 * creates an HTML Body tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLBodyElement}
 */
export function Body(...rest) { return tag("body", ...rest); }

/**
 * creates an HTML BR tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLBRElement}
 */
export function BR() { return tag("br"); }

/**
 * creates an HTML HtmlButton tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLButtonElement}
 */
export function ButtonRaw(...rest) { return tag("button", ...rest); }

/**
 * creates an HTML Button tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLButtonElement}
 */
export function Button(...rest) { return ButtonRaw(...rest, type("button")); }

/**
 * creates an HTML SubmitButton tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLButtonElement}
 */
export function ButtonSubmit(...rest) { return ButtonRaw(...rest, type("submit")); }

/**
 * creates an HTML ResetButton tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLButtonElement}
 */
export function ButtonReset(...rest) { return ButtonRaw(...rest, type("reset")); }

/**
 * creates an HTML Canvas tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLCanvasElement}
 */
export function Canvas(...rest) { return tag("canvas", ...rest); }

/**
 * creates an HTML Caption tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLTableCaptionElement}
 */
export function Caption(...rest) { return tag("caption", ...rest); }

/**
 * creates an HTML Cite tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
export function Cite(...rest) { return tag("cite", ...rest); }

/**
 * creates an HTML Code tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
export function Code(...rest) { return tag("code", ...rest); }

/**
 * creates an HTML Col tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLTableColElement}
 */
export function Col(...rest) { return tag("col", ...rest); }

/**
 * creates an HTML ColGroup tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLTableColElement}
 */
export function ColGroup(...rest) { return tag("colgroup", ...rest); }

/**
 * creates an HTML Content tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLContentElement}
 */
export function Content(...rest) { return tag("content", ...rest); }

/**
 * creates an HTML Data tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLDataElement}
 */
export function Data(...rest) { return tag("data", ...rest); }

/**
 * creates an HTML DataList tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLDataListElement}
 */
export function DataList(...rest) { return tag("datalist", ...rest); }

/**
 * creates an HTML DD tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
export function DD(...rest) { return tag("dd", ...rest); }

/**
 * creates an HTML Del tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLModElement}
 */
export function Del(...rest) { return tag("del", ...rest); }

/**
 * creates an HTML Details tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLDetailsElement}
 */
export function Details(...rest) { return tag("details", ...rest); }

/**
 * creates an HTML DFN tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
export function DFN(...rest) { return tag("dfn", ...rest); }

/**
 * creates an HTML Dialog tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLDialogElement}
 */
export function Dialog(...rest) { return tag("dialog", ...rest); }

/**
 * creates an HTML Dir tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLDirectoryElement}
 */
export function Dir(...rest) { return tag("dir", ...rest); }

/**
 * creates an HTML Div tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLDivElement}
 */
export function Div(...rest) { return tag("div", ...rest); }

/**
 * creates an HTML DL tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLDListElement}
 */
export function DL(...rest) { return tag("dl", ...rest); }

/**
 * creates an HTML DT tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
export function DT(...rest) { return tag("dt", ...rest); }

/**
 * creates an HTML Em tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
export function Em(...rest) { return tag("em", ...rest); }

/**
 * creates an HTML Embed tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLEmbedElement}
 */
export function Embed(...rest) { return tag("embed", ...rest); }

/**
 * creates an HTML FieldSet tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLFieldSetElement}
 */
export function FieldSet(...rest) { return tag("fieldset", ...rest); }

/**
 * creates an HTML FigCaption tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
export function FigCaption(...rest) { return tag("figcaption", ...rest); }

/**
 * creates an HTML Figure tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
export function Figure(...rest) { return tag("figure", ...rest); }

/**
 * creates an HTML Footer tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
export function Footer(...rest) { return tag("footer", ...rest); }

/**
 * creates an HTML Form tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLFormElement}
 */
export function Form(...rest) { return tag("form", ...rest); }

/**
 * creates an HTML H1 tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLHeadingElement}
 */
export function H1(...rest) { return tag("h1", ...rest); }

/**
 * creates an HTML H2 tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLHeadingElement}
 */
export function H2(...rest) { return tag("h2", ...rest); }

/**
 * creates an HTML H3 tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLHeadingElement}
 */
export function H3(...rest) { return tag("h3", ...rest); }

/**
 * creates an HTML H4 tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLHeadingElement}
 */
export function H4(...rest) { return tag("h4", ...rest); }

/**
 * creates an HTML H5 tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLHeadingElement}
 */
export function H5(...rest) { return tag("h5", ...rest); }

/**
 * creates an HTML H6 tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLHeadingElement}
 */
export function H6(...rest) { return tag("h6", ...rest); }

/**
 * creates an HTML HR tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLHRElement}
 */
export function HR(...rest) { return tag("hr", ...rest); }

/**
 * creates an HTML Head tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLHeadElement}
 */
export function Head(...rest) { return tag("head", ...rest); }

/**
 * creates an HTML Header tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
export function Header(...rest) { return tag("header", ...rest); }

/**
 * creates an HTML HGroup tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
export function HGroup(...rest) { return tag("hgroup", ...rest); }

/**
 * creates an HTML HTML tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLHtmlElement}
 */
export function HTML(...rest) { return tag("html", ...rest); }

/**
 * creates an HTML I tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
export function I(...rest) { return tag("i", ...rest); }

/**
 * creates an HTML IFrame tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLIFrameElement}
 */
export function IFrame(...rest) { return tag("iframe", ...rest); }

/**
 * creates an HTML Img tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLImageElement}
 */
export function Img(...rest) { return tag("img", ...rest); }

/**
 * creates an HTML Input tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLInputElement}
 */
export function Input(...rest) { return tag("input", ...rest); }

/**
 * creates an HTML Input tag that is a button.
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLInputElement}
 */
export function InputButton(...rest) { return Input(type("button"), ...rest) }

/**
 * creates an HTML Input tag that is a checkbox.
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLInputElement}
 */
export function InputCheckbox(...rest) { return Input(type("checkbox"), ...rest) }

/**
 * creates an HTML Input tag that is a color picker.
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLInputElement}
 */
export function InputColor(...rest) { return Input(type("color"), ...rest) }

/**
 * creates an HTML Input tag that is a date picker.
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLInputElement}
 */
export function InputDate(...rest) { return Input(type("date"), ...rest) }

/**
 * creates an HTML Input tag that is a local date-time picker.
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLInputElement}
 */
export function InputDateTime(...rest) { return Input(type("datetime-local"), ...rest) }

/**
 * creates an HTML Input tag that is an email entry field.
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLInputElement}
 */
export function InputEmail(...rest) { return Input(type("email"), ...rest) }

/**
 * creates an HTML Input tag that is a file picker.
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLInputElement}
 */
export function InputFile(...rest) { return Input(type("file"), ...rest) }

/**
 * creates an HTML Input tag that is a hidden field.
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLInputElement}
 */
export function InputHidden(...rest) { return Input(type("hidden"), ...rest) }

/**
 * creates an HTML Input tag that is a graphical submit button.
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLInputElement}
 */
export function InputImage(...rest) { return Input(type("image"), ...rest) }

/**
 * creates an HTML Input tag that is a month picker.
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLInputElement}
 */
export function InputMonth(...rest) { return Input(type("month"), ...rest) }

/**
 * creates an HTML Input tag that is a password entry field.
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLInputElement}
 */
export function InputPassword(...rest) { return Input(type("password"), ...rest) }

/**
 * creates an HTML Input tag that is a radio button.
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLInputElement}
 */
export function InputRadio(...rest) { return Input(type("radio"), ...rest) }

/**
 * creates an HTML Input tag that is a range selector.
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLInputElement}
 */
export function InputRange(...rest) { return Input(type("range"), ...rest) }

/**
 * creates an HTML Input tag that is a form reset button.
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLInputElement}
 */
export function InputReset(...rest) { return Input(type("reset"), ...rest) }

/**
 * creates an HTML Input tag that is a search entry field.
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLInputElement}
 */
export function InputSearch(...rest) { return Input(type("search"), ...rest) }

/**
 * creates an HTML Input tag that is a submit button.
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLInputElement}
 */
export function InputSubmit(...rest) { return Input(type("submit"), ...rest) }

/**
 * creates an HTML Input tag that is a telephone number entry field.
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLInputElement}
 */
export function InputTelephone(...rest) { return Input(type("tel"), ...rest) }

/**
 * creates an HTML Input tag that is a text entry field.
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLInputElement}
 */
export function InputText(...rest) { return Input(type("text"), ...rest) }

/**
 * creates an HTML Input tag that is a time picker.
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLInputElement}
 */
export function InputTime(...rest) { return Input(type("time"), ...rest) }

/**
 * creates an HTML Input tag that is a URL entry field.
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLInputElement}
 */
export function InputURL(...rest) { return Input(type("url"), ...rest) }

/**
 * creates an HTML Input tag that is a week picker.
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLInputElement}
 */
export function InputWeek(...rest) { return Input(type("week"), ...rest) }

/**
 * creates an HTML Ins tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLModElement}
 */
export function Ins(...rest) { return tag("ins", ...rest); }

/**
 * creates an HTML KBD tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
export function KBD(...rest) { return tag("kbd", ...rest); }

/**
 * creates an HTML Label tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLLabelElement}
 */
export function Label(...rest) { return tag("label", ...rest); }

/**
 * creates an HTML Legend tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLLegendElement}
 */
export function Legend(...rest) { return tag("legend", ...rest); }

/**
 * creates an HTML LI tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLLIElement}
 */
export function LI(...rest) { return tag("li", ...rest); }

/**
 * creates an HTML Link tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLLinkElement}
 */
export function Link(...rest) { return tag("link", ...rest); }

/**
 * creates an HTML Main tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
export function Main(...rest) { return tag("main", ...rest); }

/**
 * creates an HTML Map tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLMapElement}
 */
export function HtmlMap(...rest) { return tag("map", ...rest); }

/**
 * creates an HTML Mark tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
export function Mark(...rest) { return tag("mark", ...rest); }

/**
 * creates an HTML Marquee tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLMarqueeElement}
 */
export function Marquee(...rest) { return tag("marquee", ...rest); }

/**
 * creates an HTML Menu tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLMenuElement}
 */
export function Menu(...rest) { return tag("menu", ...rest); }

/**
 * creates an HTML Meta tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLMetaElement}
 */
export function Meta(...rest) { return tag("meta", ...rest); }

/**
 * creates an HTML Meter tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLMeterElement}
 */
export function Meter(...rest) { return tag("meter", ...rest); }

/**
 * creates an HTML Nav tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
export function Nav(...rest) { return tag("nav", ...rest); }

/**
 * creates an HTML NoScript tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
export function NoScript(...rest) { return tag("noscript", ...rest); }

/**
 * creates an HTML HtmlObject tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLObjectElement}
 */
export function ObjectElement(...rest) { return tag("object", ...rest); }

/**
 * creates an HTML OL tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLOListElement}
 */
export function OL(...rest) { return tag("ol", ...rest); }

/**
 * creates an HTML OptGroup tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLOptGroupElement}
 */
export function OptGroup(...rest) { return tag("optgroup", ...rest); }

/**
 * creates an HTML Option tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLOptionElement}
 */
export function Option(...rest) { return tag("option", ...rest); }

/**
 * creates an HTML Output tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLOutputElement}
 */
export function Output(...rest) { return tag("output", ...rest); }

/**
 * creates an HTML P tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLParagraphElement}
 */
export function P(...rest) { return tag("p", ...rest); }

/**
 * creates an HTML Param tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLParamElement}
 */
export function Param(...rest) { return tag("param", ...rest); }

/**
 * creates an HTML Picture tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLPictureElement}
 */
export function Picture(...rest) { return tag("picture", ...rest); }

/**
 * creates an HTML Pre tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLPreElement}
 */
export function Pre(...rest) { return tag("pre", ...rest); }

/**
 * creates an HTML Progress tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLProgressElement}
 */
export function Progress(...rest) { return tag("progress", ...rest); }

/**
 * creates an HTML Q tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLQuoteElement}
 */
export function Q(...rest) { return tag("q", ...rest); }

/**
 * creates an HTML RB tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
export function RB(...rest) { return tag("rb", ...rest); }

/**
 * creates an HTML RP tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
export function RP(...rest) { return tag("rp", ...rest); }

/**
 * creates an HTML RT tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
export function RT(...rest) { return tag("rt", ...rest); }

/**
 * creates an HTML RTC tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
export function RTC(...rest) { return tag("rtc", ...rest); }

/**
 * creates an HTML Ruby tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
export function Ruby(...rest) { return tag("ruby", ...rest); }

/**
 * creates an HTML S tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
export function S(...rest) { return tag("s", ...rest); }

/**
 * creates an HTML Shadow tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLShadowElement}
 */
export function Shadow(...rest) { return tag("shadow", ...rest); }

/**
 * creates an HTML Samp tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
export function Samp(...rest) { return tag("samp", ...rest); }

/**
 * creates an HTML Script tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLScriptElement}
 */
export function Script(...rest) { return tag("script", ...rest); }

/**
 * creates an HTML Section tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
export function Section(...rest) { return tag("section", ...rest); }

/**
 * creates an HTML Select tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLSelectElement}
 */
export function Select(...rest) { return tag("select", ...rest); }

/**
 * creates an HTML Slot tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLSelectElement}
 */
export function Slot(...rest) { return tag("slot", ...rest); }

/**
 * creates an HTML Small tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
export function Small(...rest) { return tag("small", ...rest); }

/**
 * creates an HTML Source tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLSourceElement}
 */
export function Source(...rest) { return tag("source", ...rest); }

/**
 * creates an HTML Span tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLSpanElement}
 */
export function Span(...rest) { return tag("span", ...rest); }

/**
 * creates an HTML Strong tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
export function Strong(...rest) { return tag("strong", ...rest); }

/**
 * creates an HTML Style tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLStyleElement}
 */
export function Style(...rest) { return tag("style", ...rest); }

/**
 * creates an HTML Sub tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
export function Sub(...rest) { return tag("sub", ...rest); }

/**
 * creates an HTML Summary tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
export function Summary(...rest) { return tag("summary", ...rest); }

/**
 * creates an HTML Sup tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
export function Sup(...rest) { return tag("sup", ...rest); }

/**
 * creates an HTML Table tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLTableElement}
 */
export function Table(...rest) { return tag("table", ...rest); }

/**
 * creates an HTML TBody tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLTableSectionElement}
 */
export function TBody(...rest) { return tag("tbody", ...rest); }

/**
 * creates an HTML TD tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLTableCellElement}
 */
export function TD(...rest) { return tag("td", ...rest); }

/**
 * creates an HTML Template tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLTemplateElement}
 */
export function Template(...rest) { return tag("template", ...rest); }

/**
 * creates an HTML TextArea tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLTextAreaElement}
 */
export function TextArea(...rest) { return tag("textarea", ...rest); }

/**
 * creates an HTML TFoot tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLTableSectionElement}
 */
export function TFoot(...rest) { return tag("tfoot", ...rest); }

/**
 * creates an HTML TH tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
export function TH(...rest) { return tag("th", ...rest); }

/**
 * creates an HTML THead tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLTableSectionElement}
 */
export function THead(...rest) { return tag("thead", ...rest); }

/**
 * creates an HTML Time tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLTimeElement}
 */
export function Time(...rest) { return tag("time", ...rest); }

/**
 * creates an HTML Title tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLTitleElement}
 */
export function Title(...rest) { return tag("title", ...rest); }

/**
 * creates an HTML TR tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLTableRowElement}
 */
export function TR(...rest) { return tag("tr", ...rest); }

/**
 * creates an HTML Track tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLTrackElement}
 */
export function Track(...rest) { return tag("track", ...rest); }

/**
 * creates an HTML U tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
export function U(...rest) { return tag("u", ...rest); }

/**
 * creates an HTML UL tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLUListElement}
 */
export function UL(...rest) { return tag("ul", ...rest); }

/**
 * creates an HTML Var tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
export function Var(...rest) { return tag("var", ...rest); }

/**
 * creates an HTML Video tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLVideoElement}
 */
export function Video(...rest) { return tag("video", ...rest); }

/**
 * creates an HTML WBR tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
export function WBR() { return tag("wbr"); }

/**
 * creates an HTML XMP tag
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text
 * @returns {HTMLElement}
 */
export function XMP(...rest) { return tag("xmp", ...rest); }

/**
 * Creates an offscreen canvas element, if they are available. Otherwise, returns an HTMLCanvasElement.
 * @param {number} w - the width of the canvas
 * @param {number} h - the height of the canvas
 * @param {...import("./tag").TagChild} rest - optional HTML attributes and child elements, to use in constructing the HTMLCanvasElement if OffscreenCanvas is not available.
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
 * Creates a text node out of the give input.
 * @param {any} txt
 */
export function TextNode(txt) {
    return document.createTextNode(txt);
}

/**
 * Creates a Div element with margin: auto.
 * @param {...any} rest
 * @returns {HTMLDivElement}
 */
export function Run(...rest) {
    return Div(
        margin("auto"),
        ...rest);
}