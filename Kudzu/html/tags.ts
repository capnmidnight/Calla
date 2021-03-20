import { isBoolean, isFunction, isNumber, isObject, isString } from "../typeChecks";
import { Attr, type } from "./attrs";
import { CSSInJSRule, CssPropSet, margin, styles } from "./css";

interface HasNode {
    element: HTMLElement;
}

interface IAppliable {
    apply(x: any): any;
}

type makesIAppliable = (v: any) => IAppliable;


export type TagChild = Node
    | HasNode
    | IAppliable
    | makesIAppliable
    | string
    | number
    | boolean
    | Date
    | CssPropSet;

function hasNode(obj: any): obj is HasNode {
    return isObject(obj)
        && "element" in obj
        && (obj as any).element instanceof Node;
}

export interface IFocusable {
    focus(): void;
}

export function isFocusable(elem: any): elem is IFocusable {
    return "focus" in elem && isFunction((elem as IFocusable).focus);
}

export function elementSetDisplay(elem: HTMLElement, visible: boolean, visibleDisplayType: string = "block"): void {
    elem.style.display = visible ? visibleDisplayType : "none";
}

export function elementIsDisplayed(elem: HTMLElement): boolean {
    return elem.style.display !== "none";
}

export function getElement<T extends HTMLElement>(selector: string) {
    return document.querySelector<T>(selector);
}

export function getButton(selector: string) {
    return getElement<HTMLButtonElement>(selector);
}

export function getInput(selector: string) {
    return getElement<HTMLInputElement>(selector);
}

export function getSelect(selector: string) {
    return getElement<HTMLSelectElement>(selector);
}

export function getCanvas(selector: string) {
    return getElement<HTMLCanvasElement>(selector);
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
export function tag(name: string, ...rest: TagChild[]) {
    let elem: HTMLElement | null = null;

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

export interface IDisableable {
    disabled: boolean;
}

export function isDisableable(element: any): element is IDisableable {
    return "disabled" in element
        && typeof element.disabled === "boolean";
}

/**
 * Empty an element of all children. This is faster than setting `innerHTML = ""`.
 */
export function elementClearChildren(elem: HTMLElement) {
    while (elem.lastChild) {
        elem.lastChild.remove();
    }
}

export function elementSetText(elem: HTMLElement, text: string) {
    elementClearChildren(elem);
    elem.appendChild(TextNode(text));
}


export type HTMLAudioElementWithSinkID = HTMLAudioElement & {
    sinkId: string;
    setSinkId(id: string): Promise<void>;
};

export function A(...rest: TagChild[]): HTMLAnchorElement { return tag("a", ...rest) as HTMLAnchorElement; }
export function Abbr(...rest: TagChild[]): HTMLElement { return tag("abbr", ...rest); }
export function Address(...rest: TagChild[]): HTMLElement { return tag("address", ...rest); }
export function Area(...rest: TagChild[]): HTMLAreaElement { return tag("area", ...rest) as HTMLAreaElement; }
export function Article(...rest: TagChild[]): HTMLElement { return tag("article", ...rest); }
export function Aside(...rest: TagChild[]): HTMLElement { return tag("aside", ...rest); }
export function Audio(...rest: TagChild[]): HTMLAudioElementWithSinkID { return tag("audio", ...rest) as HTMLAudioElementWithSinkID; }
export function B(...rest: TagChild[]): HTMLElement { return tag("b", ...rest); }
export function Base(...rest: TagChild[]): HTMLBaseElement { return tag("base", ...rest) as HTMLBaseElement; }
export function BDI(...rest: TagChild[]): HTMLElement { return tag("bdi", ...rest); }
export function BDO(...rest: TagChild[]): HTMLElement { return tag("bdo", ...rest); }
export function BlockQuote(...rest: TagChild[]): HTMLQuoteElement { return tag("blockquote", ...rest) as HTMLQuoteElement; }
export function Body(...rest: TagChild[]): HTMLBodyElement { return tag("body", ...rest) as HTMLBodyElement; }
export function BR(): HTMLBRElement { return tag("br") as HTMLBRElement; }
export function ButtonRaw(...rest: TagChild[]): HTMLButtonElement { return tag("button", ...rest) as HTMLButtonElement; }
export function Button(...rest: TagChild[]): HTMLButtonElement { return ButtonRaw(...rest, type("button")); }
export function ButtonSubmit(...rest: TagChild[]): HTMLButtonElement { return ButtonRaw(...rest, type("submit")); }
export function ButtonReset(...rest: TagChild[]): HTMLButtonElement { return ButtonRaw(...rest, type("reset")); }
export function Canvas(...rest: TagChild[]): HTMLCanvasElement { return tag("canvas", ...rest) as HTMLCanvasElement; }
export function Caption(...rest: TagChild[]): HTMLTableCaptionElement { return tag("caption", ...rest) as HTMLTableCaptionElement; }
export function Cite(...rest: TagChild[]): HTMLElement { return tag("cite", ...rest); }
export function Code(...rest: TagChild[]): HTMLElement { return tag("code", ...rest); }
export function Col(...rest: TagChild[]): HTMLTableColElement { return tag("col", ...rest) as HTMLTableColElement; }
export function ColGroup(...rest: TagChild[]): HTMLTableColElement { return tag("colgroup", ...rest) as HTMLTableColElement; }
export function Data(...rest: TagChild[]): HTMLDataElement { return tag("data", ...rest) as HTMLDataElement; }
export function DataList(...rest: TagChild[]): HTMLDataListElement { return tag("datalist", ...rest) as HTMLDataListElement; }
export function DD(...rest: TagChild[]): HTMLElement { return tag("dd", ...rest); }
export function Del(...rest: TagChild[]): HTMLModElement { return tag("del", ...rest) as HTMLModElement; }
export function Details(...rest: TagChild[]): HTMLDetailsElement { return tag("details", ...rest) as HTMLDetailsElement; }
export function DFN(...rest: TagChild[]): HTMLElement { return tag("dfn", ...rest); }
export function Dialog(...rest: TagChild[]): HTMLDialogElement { return tag("dialog", ...rest) as HTMLDialogElement; }
export function Dir(...rest: TagChild[]): HTMLDirectoryElement { return tag("dir", ...rest) as HTMLDirectoryElement; }
export function Div(...rest: TagChild[]): HTMLDivElement { return tag("div", ...rest) as HTMLDivElement; }
export function DL(...rest: TagChild[]): HTMLDListElement { return tag("dl", ...rest) as HTMLDListElement; }
export function DT(...rest: TagChild[]): HTMLElement { return tag("dt", ...rest); }
export function Em(...rest: TagChild[]): HTMLElement { return tag("em", ...rest); }
export function Embed(...rest: TagChild[]): HTMLEmbedElement { return tag("embed", ...rest) as HTMLEmbedElement; }
export function FieldSet(...rest: TagChild[]): HTMLFieldSetElement { return tag("fieldset", ...rest) as HTMLFieldSetElement; }
export function FigCaption(...rest: TagChild[]): HTMLElement { return tag("figcaption", ...rest); }
export function Figure(...rest: TagChild[]): HTMLElement { return tag("figure", ...rest); }
export function Footer(...rest: TagChild[]): HTMLElement { return tag("footer", ...rest); }
export function Form(...rest: TagChild[]): HTMLFormElement { return tag("form", ...rest) as HTMLFormElement; }
export function H1(...rest: TagChild[]): HTMLHeadingElement { return tag("h1", ...rest) as HTMLHeadingElement; }
export function H2(...rest: TagChild[]): HTMLHeadingElement { return tag("h2", ...rest) as HTMLHeadingElement; }
export function H3(...rest: TagChild[]): HTMLHeadingElement { return tag("h3", ...rest) as HTMLHeadingElement; }
export function H4(...rest: TagChild[]): HTMLHeadingElement { return tag("h4", ...rest) as HTMLHeadingElement; }
export function H5(...rest: TagChild[]): HTMLHeadingElement { return tag("h5", ...rest) as HTMLHeadingElement; }
export function H6(...rest: TagChild[]): HTMLHeadingElement { return tag("h6", ...rest) as HTMLHeadingElement; }
export function HR(...rest: TagChild[]): HTMLHRElement { return tag("hr", ...rest) as HTMLHRElement; }
export function Head(...rest: TagChild[]): HTMLHeadElement { return tag("head", ...rest) as HTMLHeadElement; }
export function Header(...rest: TagChild[]): HTMLElement { return tag("header", ...rest); }
export function HGroup(...rest: TagChild[]): HTMLElement { return tag("hgroup", ...rest); }
export function HTML(...rest: TagChild[]): HTMLHtmlElement { return tag("html", ...rest) as HTMLHtmlElement; }
export function I(...rest: TagChild[]): HTMLElement { return tag("i", ...rest); }
export function IFrame(...rest: TagChild[]): HTMLIFrameElement { return tag("iframe", ...rest) as HTMLIFrameElement; }
export function Img(...rest: TagChild[]): HTMLImageElement { return tag("img", ...rest) as HTMLImageElement; }
export function Input(...rest: TagChild[]): HTMLInputElement { return tag("input", ...rest) as HTMLInputElement; }
export function Ins(...rest: TagChild[]): HTMLModElement { return tag("ins", ...rest) as HTMLModElement; }
export function KBD(...rest: TagChild[]): HTMLElement { return tag("kbd", ...rest); }
export function Label(...rest: TagChild[]): HTMLLabelElement { return tag("label", ...rest) as HTMLLabelElement; }
export function Legend(...rest: TagChild[]): HTMLLegendElement { return tag("legend", ...rest) as HTMLLegendElement; }
export function LI(...rest: TagChild[]): HTMLLIElement { return tag("li", ...rest) as HTMLLIElement; }
export function Link(...rest: TagChild[]): HTMLLinkElement { return tag("link", ...rest) as HTMLLinkElement; }
export function Main(...rest: TagChild[]): HTMLElement { return tag("main", ...rest); }
export function HtmlMap(...rest: TagChild[]): HTMLMapElement { return tag("map", ...rest) as HTMLMapElement; }
export function Mark(...rest: TagChild[]): HTMLElement { return tag("mark", ...rest); }
export function Marquee(...rest: TagChild[]): HTMLMarqueeElement { return tag("marquee", ...rest) as HTMLMarqueeElement; }
export function Menu(...rest: TagChild[]): HTMLMenuElement { return tag("menu", ...rest) as HTMLMenuElement; }
export function Meta(...rest: TagChild[]): HTMLMetaElement { return tag("meta", ...rest) as HTMLMetaElement; }
export function Meter(...rest: TagChild[]): HTMLMeterElement { return tag("meter", ...rest) as HTMLMeterElement; }
export function Nav(...rest: TagChild[]): HTMLElement { return tag("nav", ...rest); }
export function NoScript(...rest: TagChild[]): HTMLElement { return tag("noscript", ...rest); }
export function HtmlObject(...rest: TagChild[]): HTMLObjectElement { return tag("object", ...rest) as HTMLObjectElement; }
export function OL(...rest: TagChild[]): HTMLOListElement { return tag("ol", ...rest) as HTMLOListElement; }
export function OptGroup(...rest: TagChild[]): HTMLOptGroupElement { return tag("optgroup", ...rest) as HTMLOptGroupElement; }
export function Option(...rest: TagChild[]): HTMLOptionElement { return tag("option", ...rest) as HTMLOptionElement; }
export function Output(...rest: TagChild[]): HTMLOutputElement { return tag("output", ...rest) as HTMLOutputElement; }
export function P(...rest: TagChild[]): HTMLParagraphElement { return tag("p", ...rest) as HTMLParagraphElement; }
export function Param(...rest: TagChild[]): HTMLParamElement { return tag("param", ...rest) as HTMLParamElement; }
export function Picture(...rest: TagChild[]): HTMLPictureElement { return tag("picture", ...rest) as HTMLPictureElement; }
export function Pre(...rest: TagChild[]): HTMLPreElement { return tag("pre", ...rest) as HTMLPreElement; }
export function Progress(...rest: TagChild[]): HTMLProgressElement { return tag("progress", ...rest) as HTMLProgressElement; }
export function Q(...rest: TagChild[]): HTMLQuoteElement { return tag("q", ...rest) as HTMLQuoteElement; }
export function RB(...rest: TagChild[]): HTMLElement { return tag("rb", ...rest); }
export function RP(...rest: TagChild[]): HTMLElement { return tag("rp", ...rest); }
export function RT(...rest: TagChild[]): HTMLElement { return tag("rt", ...rest); }
export function RTC(...rest: TagChild[]): HTMLElement { return tag("rtc", ...rest); }
export function Ruby(...rest: TagChild[]): HTMLElement { return tag("ruby", ...rest); }
export function S(...rest: TagChild[]): HTMLElement { return tag("s", ...rest); }
export function Samp(...rest: TagChild[]): HTMLElement { return tag("samp", ...rest); }
export function Script(...rest: TagChild[]): HTMLScriptElement { return tag("script", ...rest) as HTMLScriptElement; }
export function Section(...rest: TagChild[]): HTMLElement { return tag("section", ...rest); }
export function Select(...rest: TagChild[]): HTMLSelectElement { return tag("select", ...rest) as HTMLSelectElement; }
export function Slot(...rest: TagChild[]): HTMLSlotElement { return tag("slot", ...rest) as HTMLSlotElement; }
export function Small(...rest: TagChild[]): HTMLElement { return tag("small", ...rest); }
export function Source(...rest: TagChild[]): HTMLSourceElement { return tag("source", ...rest) as HTMLSourceElement; }
export function Span(...rest: TagChild[]): HTMLSpanElement { return tag("span", ...rest) as HTMLSpanElement; }
export function Strong(...rest: TagChild[]): HTMLElement { return tag("strong", ...rest); }
export function Sub(...rest: TagChild[]): HTMLElement { return tag("sub", ...rest); }
export function Summary(...rest: TagChild[]): HTMLElement { return tag("summary", ...rest); }
export function Sup(...rest: TagChild[]): HTMLElement { return tag("sup", ...rest); }
export function Table(...rest: TagChild[]): HTMLTableElement { return tag("table", ...rest) as HTMLTableElement; }
export function TBody(...rest: TagChild[]): HTMLTableSectionElement { return tag("tbody", ...rest) as HTMLTableSectionElement; }
export function TD(...rest: TagChild[]): HTMLTableDataCellElement { return tag("td", ...rest) as HTMLTableDataCellElement; }
export function Template(...rest: TagChild[]): HTMLTemplateElement { return tag("template", ...rest) as HTMLTemplateElement; }
export function TextArea(...rest: TagChild[]): HTMLTextAreaElement { return tag("textarea", ...rest) as HTMLTextAreaElement; }
export function TFoot(...rest: TagChild[]): HTMLTableSectionElement { return tag("tfoot", ...rest) as HTMLTableSectionElement; }
export function TH(...rest: TagChild[]): HTMLTableHeaderCellElement { return tag("th", ...rest) as HTMLTableHeaderCellElement; }
export function THead(...rest: TagChild[]): HTMLTableSectionElement { return tag("thead", ...rest) as HTMLTableSectionElement; }
export function Time(...rest: TagChild[]): HTMLTimeElement { return tag("time", ...rest) as HTMLTimeElement; }
export function Title(...rest: TagChild[]): HTMLTitleElement { return tag("title", ...rest) as HTMLTitleElement; }
export function TR(...rest: TagChild[]): HTMLTableRowElement { return tag("tr", ...rest) as HTMLTableRowElement; }
export function Track(...rest: TagChild[]): HTMLTrackElement { return tag("track", ...rest) as HTMLTrackElement; }
export function U(...rest: TagChild[]): HTMLElement { return tag("u", ...rest); }
export function UL(...rest: TagChild[]): HTMLUListElement { return tag("ul", ...rest) as HTMLUListElement; }
export function Var(...rest: TagChild[]): HTMLElement { return tag("var", ...rest); }
export function Video(...rest: TagChild[]): HTMLVideoElement { return tag("video", ...rest) as HTMLVideoElement; }
export function WBR(): HTMLElement { return tag("wbr"); }

/**
 * creates an HTML Input tag that is a button.
 */
export function InputButton(...rest: TagChild[]): HTMLInputElement { return Input(type("button"), ...rest); }

/**
 * creates an HTML Input tag that is a checkbox.
 */
export function InputCheckbox(...rest: TagChild[]): HTMLInputElement { return Input(type("checkbox"), ...rest); }

/**
 * creates an HTML Input tag that is a color picker.
 */
export function InputColor(...rest: TagChild[]): HTMLInputElement { return Input(type("color"), ...rest); }

/**
 * creates an HTML Input tag that is a date picker.
 */
export function InputDate(...rest: TagChild[]): HTMLInputElement { return Input(type("date"), ...rest); }

/**
 * creates an HTML Input tag that is a local date-time picker.
 */
export function InputDateTime(...rest: TagChild[]): HTMLInputElement { return Input(type("datetime-local"), ...rest); }

/**
 * creates an HTML Input tag that is an email entry field.
 */
export function InputEmail(...rest: TagChild[]): HTMLInputElement { return Input(type("email"), ...rest); }

/**
 * creates an HTML Input tag that is a file picker.
 */
export function InputFile(...rest: TagChild[]): HTMLInputElement { return Input(type("file"), ...rest); }

/**
 * creates an HTML Input tag that is a hidden field.
 */
export function InputHidden(...rest: TagChild[]): HTMLInputElement { return Input(type("hidden"), ...rest); }

/**
 * creates an HTML Input tag that is a graphical submit button.
 */
export function InputImage(...rest: TagChild[]): HTMLInputElement { return Input(type("image"), ...rest); }

/**
 * creates an HTML Input tag that is a month picker.
 */
export function InputMonth(...rest: TagChild[]): HTMLInputElement { return Input(type("month"), ...rest); }

/**
 * creates an HTML Input tag that is a password entry field.
 */
export function InputPassword(...rest: TagChild[]): HTMLInputElement { return Input(type("password"), ...rest); }

/**
 * creates an HTML Input tag that is a radio button.
 */
export function InputRadio(...rest: TagChild[]): HTMLInputElement { return Input(type("radio"), ...rest); }

/**
 * creates an HTML Input tag that is a range selector.
 */
export function InputRange(...rest: TagChild[]): HTMLInputElement { return Input(type("range"), ...rest); }

/**
 * creates an HTML Input tag that is a form reset button.
 */
export function InputReset(...rest: TagChild[]): HTMLInputElement { return Input(type("reset"), ...rest); }

/**
 * creates an HTML Input tag that is a search entry field.
 */
export function InputSearch(...rest: TagChild[]): HTMLInputElement { return Input(type("search"), ...rest); }

/**
 * creates an HTML Input tag that is a submit button.
 */
export function InputSubmit(...rest: TagChild[]): HTMLInputElement { return Input(type("submit"), ...rest); }

/**
 * creates an HTML Input tag that is a telephone number entry field.
 */
export function InputTelephone(...rest: TagChild[]): HTMLInputElement { return Input(type("tel"), ...rest); }

/**
 * creates an HTML Input tag that is a text entry field.
 */
export function InputText(...rest: TagChild[]): HTMLInputElement { return Input(type("text"), ...rest); }

/**
 * creates an HTML Input tag that is a time picker.
 */
export function InputTime(...rest: TagChild[]): HTMLInputElement { return Input(type("time"), ...rest); }

/**
 * creates an HTML Input tag that is a URL entry field.
 */
export function InputURL(...rest: TagChild[]): HTMLInputElement { return Input(type("url"), ...rest); }

/**
 * creates an HTML Input tag that is a week picker.
 */
export function InputWeek(...rest: TagChild[]): HTMLInputElement { return Input(type("week"), ...rest); }

/**
 * Creates a text node out of the give input.
 */
export function TextNode(txt: any): Text {
    return document.createTextNode(txt);
}

/**
 * Creates a Div element with margin: auto.
 */
export function Run(...rest: TagChild[]): HTMLDivElement {
    return Div(
        styles(
            margin("auto")),
        ...rest);
}

export function Style(...rest: CSSInJSRule[]): HTMLStyleElement {
    let elem = document.createElement("style");
    document.head.appendChild(elem);

    for (let x of rest) {
        x.apply(elem.sheet);
    }

    return elem;
}