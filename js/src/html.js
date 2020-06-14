export function isFunction(obj) {
    return typeof obj === "function"
        || obj instanceof Function;
}

export function clear(elem) {
    while (elem.lastChild) {
        elem.lastChild.remove();
    }
}

export function tag(name, ...rest) {
    const elem = document.createElement(name);

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
            else if (x instanceof Attr) {
                x.apply(elem);
            }
            else if (x instanceof Func) {
                x.add(elem);
            }
            else {
                console.trace(`Skipping ${x}: unsupported value type.`);
            }
        }
    }

    return elem;
}

// A selection of fonts for preferred monospace rendering.
export const monospaceFamily = "'Droid Sans Mono', 'Consolas', 'Lucida Console', 'Courier New', 'Courier', monospace";

// A selection of fonts that should match whatever the user's operating system normally uses.
export const systemFamily = "-apple-system, '.SFNSText-Regular', 'San Francisco', 'Roboto', 'Segoe UI', 'Helvetica Neue', 'Lucida Grande', sans-serif";

export function A(...rest) { return tag("a", ...rest); }
export function Abbr(...rest) { return tag("abbr", ...rest); }
export function _Acronym(...rest) { return tag("acronym", ...rest); }
export function Address(...rest) { return tag("address", ...rest); }
export function _Applet(...rest) { return tag("applet", ...rest); }
export function Area(...rest) { return tag("area", ...rest); }
export function Article(...rest) { return tag("article", ...rest); }
export function Aside(...rest) { return tag("aside", ...rest); }
export function Audio(...rest) { return tag("audio", ...rest); }
export function B(...rest) { return tag("b", ...rest); }
export function Base(...rest) { return tag("base", ...rest); }
export function _BaseFont(...rest) { return tag("basefont", ...rest); }
export function BDI(...rest) { return tag("bdi", ...rest); }
export function BDO(...rest) { return tag("bdo", ...rest); }
export function _BGSound(...rest) { return tag("bgsound", ...rest); }
export function _Big(...rest) { return tag("big", ...rest); }
export function _Blink(...rest) { return tag("blink", ...rest); }
export function BlockQuote(...rest) { return tag("blockquote", ...rest); }
export function Body(...rest) { return tag("body", ...rest); }
export function BR() { return tag("br"); }
export function HtmlButton(...rest) { return tag("button", ...rest); }
export function Button(...rest) { return HtmlButton(...rest, type("button")); }
export function SubmitButton(...rest) { return HtmlButton(...rest, type("submit")); }
export function ResetButton(...rest) { return HtmlButton(...rest, type("reset")); }
export function Canvas(...rest) { return tag("canvas", ...rest); }
export function Caption(...rest) { return tag("caption", ...rest); }
export function _Center(...rest) { return tag("center", ...rest); }
export function Cite(...rest) { return tag("cite", ...rest); }
export function Code(...rest) { return tag("code", ...rest); }
export function Col(...rest) { return tag("col", ...rest); }
export function ColGroup(...rest) { return tag("colgroup", ...rest); }
export function _Command(...rest) { return tag("command", ...rest); }
export function _Content(...rest) { return tag("content", ...rest); }
export function Data(...rest) { return tag("data", ...rest); }
export function DataList(...rest) { return tag("datalist", ...rest); }
export function DD(...rest) { return tag("dd", ...rest); }
export function Del(...rest) { return tag("del", ...rest); }
export function Details(...rest) { return tag("details", ...rest); }
export function DFN(...rest) { return tag("dfn", ...rest); }
export function Dialog(...rest) { return tag("dialog", ...rest); }
export function _Dir(...rest) { return tag("dir", ...rest); }
export function Div(...rest) { return tag("div", ...rest); }
export function DL(...rest) { return tag("dl", ...rest); }
export function DT(...rest) { return tag("dt", ...rest); }
export function _Element(...rest) { return tag("element", ...rest); }
export function Em(...rest) { return tag("em", ...rest); }
export function Embed(...rest) { return tag("embed", ...rest); }
export function FieldSet(...rest) { return tag("fieldset", ...rest); }
export function FigCaption(...rest) { return tag("figcaption", ...rest); }
export function Figure(...rest) { return tag("figure", ...rest); }
export function _Font(...rest) { return tag("font", ...rest); }
export function Footer(...rest) { return tag("footer", ...rest); }
export function Form(...rest) { return tag("form", ...rest); }
export function _Frame(...rest) { return tag("frame", ...rest); }
export function _FrameSet(...rest) { return tag("frameset", ...rest); }
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
export function _Keygen(...rest) { return tag("keygen", ...rest); }
export function Label(...rest) { return tag("label", ...rest); }
export function Legend(...rest) { return tag("legend", ...rest); }
export function LI(...rest) { return tag("li", ...rest); }
export function Link(...rest) { return tag("link", ...rest); }
export function _Listing(...rest) { return tag("listing", ...rest); }
export function Main(...rest) { return tag("main", ...rest); }
export function Map(...rest) { return tag("map", ...rest); }
export function Mark(...rest) { return tag("mark", ...rest); }
export function _Marquee(...rest) { return tag("marquee", ...rest); }
export function Menu(...rest) { return tag("menu", ...rest); }
export function _MenuItem(...rest) { return tag("menuitem", ...rest); }
export function Meta(...rest) { return tag("meta", ...rest); }
export function Meter(...rest) { return tag("meter", ...rest); }
export function Nav(...rest) { return tag("nav", ...rest); }
export function _NoFrames(...rest) { return tag("noframes", ...rest); }
export function NoScript(...rest) { return tag("noscript", ...rest); }
export function HtmlObject(...rest) { return tag("object", ...rest); }
export function OL(...rest) { return tag("ol", ...rest); }
export function OptGroup(...rest) { return tag("optgroup", ...rest); }
export function Option(...rest) { return tag("option", ...rest); }
export function Output(...rest) { return tag("output", ...rest); }
export function P(...rest) { return tag("p", ...rest); }
export function Param(...rest) { return tag("param", ...rest); }
export function Picture(...rest) { return tag("picture", ...rest); }
export function _PlainText(...rest) { return tag("plaintext", ...rest); }
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
export function _Shadow(...rest) { return tag("shadow", ...rest); }
export function Small(...rest) { return tag("small", ...rest); }
export function Source(...rest) { return tag("source", ...rest); }
export function _Spacer(...rest) { return tag("spacer", ...rest); }
export function Span(...rest) { return tag("span", ...rest); }
export function _Strike(...rest) { return tag("strike", ...rest); }
export function Strong(...rest) { return tag("strong", ...rest); }
export function Style(...rest) { return tag("style", ...rest); }
export function Sub(...rest) { return tag("sub", ...rest); }
export function Summary(...rest) { return tag("summary", ...rest); }
export function Sup(...rest) { return tag("sup", ...rest); }
export function Table(...rest) { return tag("table", ...rest); }
export function TBody(...rest) { return tag("tbody", ...rest); }
export function TD(...rest) { return tag("td", ...rest); }
export function Template(...rest) { return tag("template", ...rest); }
export function Text(value) { return document.createTextNode(value); }
export function TextArea(...rest) { return tag("textarea", ...rest); }
export function TFoot(...rest) { return tag("tfoot", ...rest); }
export function TH(...rest) { return tag("th", ...rest); }
export function THead(...rest) { return tag("thead", ...rest); }
export function Time(...rest) { return tag("time", ...rest); }
export function Title(...rest) { return tag("title", ...rest); }
export function TR(...rest) { return tag("tr", ...rest); }
export function Track(...rest) { return tag("track", ...rest); }
export function _TT(...rest) { return tag("tt", ...rest); }
export function U(...rest) { return tag("u", ...rest); }
export function UL(...rest) { return tag("ul", ...rest); }
export function Var(...rest) { return tag("var", ...rest); }
export function Video(...rest) { return tag("video", ...rest); }
export function WBR() { return tag("wbr"); }
export function XMP(...rest) { return tag("xmp", ...rest); }

export function Run(txt) {
    return Span(
        style({ margin: "auto" }),
        txt);
}

export function isCanvas(elem) {
    if (elem instanceof HTMLCanvasElement) {
        return true;
    }

    if (window.OffscreenCanvas
        && elem instanceof OffscreenCanvas) {
        return true;
    }

    return false;
}

export function OffscreenCanvas(options) {
    const width = options && options.width || 512,
        height = options && options.height || width;

    if (options instanceof Object) {
        Object.assign(options, {
            width,
            height
        });
    }

    if (window.OffscreenCanvas) {
        return new OffscreenCanvas(width, height);
    }

    return Canvas(options);
}

export function setCanvasSize(canv, w, h, superscale = 1) {
    w = Math.floor(w * superscale);
    h = Math.floor(h * superscale);
    if (canv.width != w
        || canv.height != h) {
        canv.width = w;
        canv.height = h;
        return true;
    }
    return false;
}

export function setContextSize(ctx, w, h, superscale = 1) {
    const oldImageSmoothingEnabled = ctx.imageSmoothingEnabled,
        oldTextBaseline = ctx.textBaseline,
        oldTextAlign = ctx.textAlign,
        oldFont = ctx.font,
        resized = setCanvasSize(
            ctx.canvas,
            w,
            h,
            superscale);

    if (resized) {
        ctx.imageSmoothingEnabled = oldImageSmoothingEnabled;
        ctx.textBaseline = oldTextBaseline;
        ctx.textAlign = oldTextAlign;
        ctx.font = oldFont;
    }

    return resized;
}

export function resizeCanvas(canv, superscale = 1) {
    return setCanvasSize(
        canv,
        canv.clientWidth,
        canv.clientHeight,
        superscale);
}

export function resizeContext(ctx, superscale = 1) {
    return setContextSize(
        ctx,
        ctx.canvas.clientWidth,
        ctx.canvas.clientHeight,
        superscale);
}

class Attr {
    constructor(key, tags, value) {
        tags = tags.map(t => t.toLocaleUpperCase());

        this.apply = (elem) => {
            const isValid = tags.length === 0
                || tags.indexOf(elem.tagName) > -1;

            if (!isValid) {
                console.warn(`Element ${elem.tagName} does not support Attribute ${key}`);
            }
            else if (key === "style") {
                for (let subKey in value) {
                    elem[key][subKey] = value[subKey];
                }
            }
            else if (!(typeof value === "boolean" || value instanceof Boolean)
                || key === "muted") {
                elem[key] = value;
            }
            else if (value) {
                elem.setAttribute(key, "");
            }
            else {
                elem.removeAttribute(key);
            }
        };

        Object.freeze(this);
    }
}

// List of types the server accepts, typically a file type.
export function accept(value) { return new Attr("accept", ["form", "input"], value); }
// Specifies the horizontal alignment of the element.
export function align(value) { return new Attr("align", ["applet", "caption", "col", "colgroup", "hr", "iframe", "img", "table", "tbody", "td", "tfoot> , <th", "thead", "tr"], value); }
// Specifies a feature-policy for the iframe.
export function allow(value) { return new Attr("allow", ["iframe"], value); }
// Alternative text in case an image can't be displayed.
export function alt(value) { return new Attr("alt", ["applet", "area", "img", "input"], value); }
export function ariaActiveDescendant(value) { return new Attr("ariaActiveDescendant", [], value); }
export function ariaAtomic(value) { return new Attr("ariaAtomic", [], value); }
export function ariaAutoComplete(value) { return new Attr("ariaAutoComplete", [], value); }
export function ariaBusy(value) { return new Attr("ariaBusy", [], value); }
export function ariaChecked(value) { return new Attr("ariaChecked", [], value); }
export function ariaControls(value) { return new Attr("ariaControls", [], value); }
export function ariaDescribedBy(value) { return new Attr("ariaDescribedBy", [], value); }
export function ariaDisabled(value) { return new Attr("ariaDisabled", [], value); }
export function ariaDropEffect(value) { return new Attr("ariaDropEffect", [], value); }
export function ariaExpanded(value) { return new Attr("ariaExpanded", [], value); }
export function ariaFlowTo(value) { return new Attr("ariaFlowTo", [], value); }
export function ariaGrabbed(value) { return new Attr("ariaGrabbed", [], value); }
export function ariaHasPopup(value) { return new Attr("ariaHasPopup", [], value); }
export function ariaHidden(value) { return new Attr("ariaHidden", [], value); }
export function ariaInvalid(value) { return new Attr("ariaInvalid", [], value); }
export function ariaLabel(value) { return new Attr("ariaLabel", [], value); }
export function ariaLabelledBy(value) { return new Attr("ariaLabelledBy", [], value); }
export function ariaLevel(value) { return new Attr("ariaLevel", [], value); }
export function ariaLive(value) { return new Attr("ariaLive", [], value); }
export function ariaMultiline(value) { return new Attr("ariaMultiline", [], value); }
export function ariaMultiSelectable(value) { return new Attr("ariaMultiSelectable", [], value); }
export function ariaOwns(value) { return new Attr("ariaOwns", [], value); }
export function ariaPosInSet(value) { return new Attr("ariaPosInSet", [], value); }
export function ariaPressed(value) { return new Attr("ariaPressed", [], value); }
export function ariaReadOnly(value) { return new Attr("ariaReadOnly", [], value); }
export function ariaRelevant(value) { return new Attr("ariaRelevant", [], value); }
export function ariaRequired(value) { return new Attr("ariaRequired", [], value); }
export function ariaSelected(value) { return new Attr("ariaSelected", [], value); }
export function ariaSetSize(value) { return new Attr("ariaSetsize", [], value); }
export function ariaSort(value) { return new Attr("ariaSort", [], value); }
export function ariaValueMax(value) { return new Attr("ariaValueMax", [], value); }
export function ariaValueMin(value) { return new Attr("ariaValueMin", [], value); }
export function ariaValueNow(value) { return new Attr("ariaValueNow", [], value); }
export function ariaValueText(value) { return new Attr("ariaValueText", [], value); }
// Executes the script asynchronously.
export function async(value) { return new Attr("async", ["script"], value); }
// Sets whether input is automatically capitalized when entered by user
export function autoCapitalize(value) { return new Attr("autocapitalize", [], value); }
// Indicates whether controls in this form can by default have their values automatically completed by the browser.
export function autoComplete(value) { return new Attr("autocomplete", ["form", "input", "select", "textarea"], value); }
// The element should be automatically focused after the page loaded.
export function autoFocus(value) { return new Attr("autofocus", ["button", "input", "keygen", "select", "textarea"], value); }
// The audio or video should play as soon as possible.
export function autoPlay(value) { return new Attr("autoplay", ["audio", "video"], value); }
// Contains the time range of already buffered media.
export function buffered(value) { return new Attr("buffered", ["audio", "video"], value); }
// From the HTML Media Capture
export function capture(value) { return new Attr("capture", ["input"], value); }
// Declares the character encoding of the page or script.
export function charSet(value) { return new Attr("charset", ["meta", "script"], value); }
// Indicates whether the element should be checked on page load.
export function checked(value) { return new Attr("checked", ["command", "input"], value); }
// Contains a URI which points to the source of the quote or change.
export function cite(value) { return new Attr("cite", ["blockquote", "del", "ins", "q"], value); }
// Often used with CSS to style elements with common properties.
export function className(value) { return new Attr("className", [], value); }
// Specifies the URL of the applet's class file to be loaded and executed.
export function code(value) { return new Attr("code", ["applet"], value); }
// This attribute gives the absolute or relative URL of the directory where applets' .class files referenced by the code attribute are stored.
export function codeBase(value) { return new Attr("codebase", ["applet"], value); }
// Defines the number of columns in a textarea.
export function cols(value) { return new Attr("cols", ["textarea"], value); }
// The colspan attribute defines the number of columns a cell should span.
export function colSpan(value) { return new Attr("colspan", ["td", "th"], value); }
// A value associated with http-equiv or name depending on the context.
export function content(value) { return new Attr("content", ["meta"], value); }
// Indicates whether the element's content is editable.
export function contentEditable(value) { return new Attr("contenteditable", [], value); }
// Defines the ID of a <menu> element which will serve as the element's context menu.
export function contextMenu(value) { return new Attr("contextmenu", [], value); }
// Indicates whether the browser should show playback controls to the user.
export function controls(value) { return new Attr("controls", ["audio", "video"], value); }
// A set of values specifying the coordinates of the hot-spot region.
export function coords(value) { return new Attr("coords", ["area"], value); }
// How the element handles cross-origin requests
export function crossOrigin(value) { return new Attr("crossorigin", ["audio", "img", "link", "script", "video"], value); }
// Specifies the Content Security Policy that an embedded document must agree to enforce upon itself.
export function csp(value) { return new Attr("csp", ["iframe"], value); }
// Specifies the URL of the resource.
export function data(value) { return new Attr("data", ["object"], value); }
// Lets you attach custom attributes to an HTML element.
export function customData(name, value) { return new Attr("data" + name, [], value); }
// Indicates the date and time associated with the element.
export function dateTime(value) { return new Attr("datetime", ["del", "ins", "time"], value); }
// Indicates the preferred method to decode the image.
export function decoding(value) { return new Attr("decoding", ["img"], value); }
// Indicates that the track should be enabled unless the user's preferences indicate something different.
export function defaultValue(value) { return new Attr("default", ["track"], value); }
// Indicates that the script should be executed after the page has been parsed.
export function defer(value) { return new Attr("defer", ["script"], value); }
// Defines the text direction. Allowed values are ltr (Left-To-Right) or rtl (Right-To-Left)
export function dir(value) { return new Attr("dir", [], value); }
// Indicates whether the user can interact with the element.
export function disabled(value) { return new Attr("disabled", ["button", "command", "fieldset", "input", "keygen", "optgroup", "option", "select", "textarea"], value); }
// ??? 
export function dirName(value) { return new Attr("dirname", ["input", "textarea"], value); }
// Indicates that the hyperlink is to be used for downloading a resource.
export function download(value) { return new Attr("download", ["a", "area"], value); }
// Defines whether the element can be dragged.
export function draggable(value) { return new Attr("draggable", [], value); }
// Indicates that the element accepts the dropping of content onto it.
export function dropZone(value) { return new Attr("dropzone", [], value); }
// Defines the content type of the form data when the method is POST.
export function encType(value) { return new Attr("enctype", ["form"], value); }
// The enterkeyhint specifies what action label (or icon) to present for the enter key on virtual keyboards. The attribute can be used with form controls (such as the value of textarea elements), or in elements in an editing host (e.g., using contenteditable attribute).
export function enterKeyHint(value) { return new Attr("enterkeyhint", ["textarea"], value); }
// Describes elements which belongs to this one.
export function htmlFor(value) { return new Attr("htmlFor", ["label", "output"], value); }
// Indicates the form that is the owner of the element.
export function form(value) { return new Attr("form", ["button", "fieldset", "input", "keygen", "label", "meter", "object", "output", "progress", "select", "textarea"], value); }
// Indicates the action of the element, overriding the action defined in the <form>.
export function formAction(value) { return new Attr("formaction", ["input", "button"], value); }
// If the button/input is a submit button (type="submit"), this attribute sets the encoding type to use during form submission. If this attribute is specified, it overrides the enctype attribute of the button's form owner.
export function formEncType(value) { return new Attr("formenctype", ["button", "input"], value); }
// If the button/input is a submit button (type="submit"), this attribute sets the submission method to use during form submission (GET, POST, etc.). If this attribute is specified, it overrides the method attribute of the button's form owner.
export function formMethod(value) { return new Attr("formmethod", ["button", "input"], value); }
// If the button/input is a submit button (type="submit"), this boolean attribute specifies that the form is not to be validated when it is submitted. If this attribute is specified, it overrides the novalidate attribute of the button's form owner.
export function formNoValidate(value) { return new Attr("formnovalidate", ["button", "input"], value); }
// If the button/input is a submit button (type="submit"), this attribute specifies the browsing context (for example, tab, window, or inline frame) in which to display the response that is received after submitting the form. If this attribute is specified, it overrides the target attribute of the button's form owner.
export function formTarget(value) { return new Attr("formtarget", ["button", "input"], value); }
// IDs of the <th> elements which applies to this element.
export function headers(value) { return new Attr("headers", ["td", "th"], value); }
// Specifies the height of elements listed here. For all other elements, use the CSS height property.
export function height(value) { return new Attr("height", ["canvas", "embed", "iframe", "img", "input", "object", "video"], value); }
// Prevents rendering of given element, while keeping child elements, e.g. script elements, active.
export function hidden(value) { return new Attr("hidden", [], value); }
// Indicates the lower bound of the upper range.
export function high(value) { return new Attr("high", ["meter"], value); }
// The URL of a linked resource.
export function href(value) { return new Attr("href", ["a", "area", "base", "link"], value); }
// Specifies the language of the linked resource.
export function hrefLang(value) { return new Attr("hreflang", ["a", "area", "link"], value); }
// Defines a pragma directive.
export function httpEquiv(value) { return new Attr("httpEquiv", ["meta"], value); }
// Specifies a picture which represents the command.
export function icon(value) { return new Attr("icon", ["command"], value); }
// Often used with CSS to style a specific element. The value of this attribute must be unique.
export function id(value) { return new Attr("id", [], value); }
// Indicates the relative fetch priority for the resource.
export function importance(value) { return new Attr("importance", ["iframe", "img", "link", "script"], value); }
export function innerText(value) { return Text(value); }
// Provides a hint as to the type of data that might be entered by the user while editing the element or its contents. The attribute can be used with form controls (such as the value of textarea elements), or in elements in an editing host (e.g., using contenteditable attribute).
export function inputMode(value) { return new Attr("inputmode", ["textarea"], value); }
// Specifies a Subresource Integrity value that allows browsers to verify what they fetch.
export function integrity(value) { return new Attr("integrity", ["link", "script"], value); }
// This attribute tells the browser to ignore the actual intrinsic size of the image and pretend it’s the size specified in the attribute.
export function intrinsicSize(value) { return new Attr("intrinsicsize", ["img"], value); }
// Indicates that the image is part of a server-side image map.
export function isMap(value) { return new Attr("ismap", ["img"], value); }
// Specifies the type of key generated.
export function keyType(value) { return new Attr("keytype", ["keygen"], value); }
// ???
export function itemProp(value) { return new Attr("itemprop", [], value); }
// Specifies the kind of text track.
export function kind(value) { return new Attr("kind", ["track"], value); }
// Specifies a user-readable title of the element.
export function label(value) { return new Attr("label", ["optgroup", "option", "track"], value); }
// Defines the language used in the element.
export function lang(value) { return new Attr("lang", [], value); }
// Defines the script language used in the element.
export function language(value) { return new Attr("language", ["script"], value); }
// Identifies a list of pre-defined options to suggest to the user.
export function list(value) { return new Attr("list", ["input"], value); }
// Indicates whether the media should start playing from the start when it's finished.
export function loop(value) { return new Attr("loop", ["audio", "bgsound", "marquee", "video"], value); }
// Indicates the upper bound of the lower range.
export function low(value) { return new Attr("low", ["meter"], value); }
// Indicates the maximum value allowed.
export function max(value) { return new Attr("max", ["input", "meter", "progress"], value); }
// Defines the maximum number of characters allowed in the element.
export function maxLength(value) { return new Attr("maxlength", ["input", "textarea"], value); }
// Defines the minimum number of characters allowed in the element.
export function minLength(value) { return new Attr("minlength", ["input", "textarea"], value); }
// Specifies a hint of the media for which the linked resource was designed.
export function media(value) { return new Attr("media", ["a", "area", "link", "source", "style"], value); }
// Defines which HTTP method to use when submitting the form. Can be GET (default) or POST.
export function method(value) { return new Attr("method", ["form"], value); }
// Indicates the minimum value allowed.
export function min(value) { return new Attr("min", ["input", "meter"], value); }
// Indicates whether multiple values can be entered in an input of the type email or file.
export function multiple(value) { return new Attr("multiple", ["input", "select"], value); }
// Indicates whether the audio will be initially silenced on page load.
export function muted(value) { return new Attr("muted", ["audio", "video"], value); }
// Name of the element. For example used by the server to identify the fields in form submits.
export function name(value) { return new Attr("name", ["button", "form", "fieldset", "iframe", "input", "keygen", "object", "output", "select", "textarea", "map", "meta", "param"], value); }
// This attribute indicates that the form shouldn't be validated when submitted.
export function noValidate(value) { return new Attr("novalidate", ["form"], value); }
// Indicates whether the details will be shown on page load.
export function open(value) { return new Attr("open", ["details"], value); }
// Indicates the optimal numeric value.
export function optimum(value) { return new Attr("optimum", ["meter"], value); }
// Defines a regular expression which the element's value will be validated against.
export function pattern(value) { return new Attr("pattern", ["input"], value); }
// The ping attribute specifies a space-separated list of URLs to be notified if a user follows the hyperlink.
export function ping(value) { return new Attr("ping", ["a", "area"], value); }
// Provides a hint to the user of what can be entered in the field.
export function placeHolder(value) { return new Attr("placeholder", ["input", "textarea"], value); }
// A URL indicating a poster frame to show until the user plays or seeks.
export function poster(value) { return new Attr("poster", ["video"], value); }
// Indicates whether the whole resource, parts of it or nothing should be preloaded.
export function preload(value) { return new Attr("preload", ["audio", "video"], value); }
// Indicates whether the element can be edited.
export function readOnly(value) { return new Attr("readonly", ["input", "textarea"], value); }
// ???
export function radioGroup(value) { return new Attr("radiogroup", ["command"], value); }
// Specifies which referrer is sent when fetching the resource.
export function referrerPolicy(value) { return new Attr("referrerpolicy", ["a", "area", "iframe", "img", "link", "script"], value); }
// Specifies the relationship of the target object to the link object.
export function rel(value) { return new Attr("rel", ["a", "area", "link"], value); }
// Indicates whether this element is required to fill out or not.
export function required(value) { return new Attr("required", ["input", "select", "textarea"], value); }
// Indicates whether the list should be displayed in a descending order instead of a ascending.
export function reversed(value) { return new Attr("reversed", ["ol"], value); }
// Defines the number of rows in a text area.
export function role(value) { return new Attr("role", [], value); }
export function rows(value) { return new Attr("rows", ["textarea"], value); }
// Defines the number of rows a table cell should span over.
export function rowSpan(value) { return new Attr("rowspan", ["td", "th"], value); }
// Stops a document loaded in an iframe from using certain features (such as submitting forms or opening new windows).
export function sandbox(value) { return new Attr("sandbox", ["iframe"], value); }
// Defines the cells that the header test (defined in the th element) relates to.
export function scope(value) { return new Attr("scope", ["th"], value); }
// ???
export function scoped(value) { return new Attr("scoped", ["style"], value); }
// Defines a value which will be selected on page load.
export function selected(value) { return new Attr("selected", ["option"], value); }
// ???
export function shape(value) { return new Attr("shape", ["a", "area"], value); }
// Defines the width of the element (in pixels). If the element's type attribute is text or password then it's the number of characters.
export function size(value) { return new Attr("size", ["input", "select"], value); }
// Assigns a slot in a shadow DOM shadow tree to an element.
export function slot(value) { return new Attr("slot", [], value); }
// ???
export function sizes(value) { return new Attr("sizes", ["link", "img", "source"], value); }
// ???
export function span(value) { return new Attr("span", ["col", "colgroup"], value); }
// Indicates whether spell checking is allowed for the element.
export function spellCheck(value) { return new Attr("spellcheck", [], value); }
// The URL of the embeddable content.
export function src(value) { return new Attr("src", ["audio", "embed", "iframe", "img", "input", "script", "source", "track", "video"], value); }
// ???
export function srcDoc(value) { return new Attr("srcdoc", ["iframe"], value); }
// ???
export function srcLang(value) { return new Attr("srclang", ["track"], value); }
// One or more responsive image candidates.
export function srcSet(value) { return new Attr("srcset", ["img", "source"], value); }
// Defines the first number if other than 1.
export function start(value) { return new Attr("start", ["ol"], value); }
// Defines CSS styles which will override styles previously set.
export function style(value) { return new Attr("style", [], value); }
// ???
export function step(value) { return new Attr("step", ["input"], value); }
// ???
export function summary(value) { return new Attr("summary", ["table"], value); }
// Overrides the browser's default tab order and follows the one specified instead.
export function tabIndex(value) { return new Attr("tabindex", [], value); }
export function textContent(value) { return Text(value); }
// Text to be displayed in a tooltip when hovering over the element.
export function title(value) { return new Attr("title", [], value); }
// ???
export function target(value) { return new Attr("target", ["a", "area", "base", "form"], value); }
// Specify whether an element’s attribute values and the values of its Text node children are to be translated when the page is localized, or whether to leave them unchanged.
export function translate(value) { return new Attr("translate", [], value); }
// Defines the type of the element.
export function type(value) { return new Attr("type", ["button", "input", "command", "embed", "object", "script", "source", "style", "menu"], value); }
// Defines a default value which will be displayed in the element on page load.
export function value(value) { return new Attr("value", ["button", "data", "input", "li", "meter", "option", "progress", "param"], value); }
// ???
export function useMap(value) { return new Attr("usemap", ["img", "input", "object"], value); }
// For the elements listed here, this establishes the element's width.
export function width(value) { return new Attr("width", ["canvas", "embed", "iframe", "img", "input", "object", "video"], value); }
// Indicates whether the text should be wrapped.
export function wrap(value) { return new Attr("wrap", ["textarea"], value); }

class Func {
    constructor(name, callback) {
        if (!(callback instanceof Function
            || typeof callback === "function")) {
            throw new Error("A function instance is required for this parameter");
        }

        this.add = (elem) => {
            elem.addEventListener(name, callback);
        };

        this.remove = (elem) => {
            elem.removeEventListener(name, callback);
        };

        Object.freeze(this);
    }
}


export function onAbort(callback) { return new Func("abort", callback); }
export function onAfterPrint(callback) { return new Func("afterprint", callback); }
export function onAnimationCancel(callback) { return new Func("animationcancel", callback); }
export function onAnimationEnd(callback) { return new Func("animationend", callback); }
export function onAnimationIteration(callback) { return new Func("animationiteration", callback); }
export function onAnimationStart(callback) { return new Func("animationstart", callback); }
export function onAppInstalled(callback) { return new Func("appinstalled", callback); }
export function _onAudioProcess(callback) { return new Func("audioprocess", callback); }
export function onAudioEnd(callback) { return new Func("audioend", callback); }
export function onAudioStart(callback) { return new Func("audiostart", callback); }
export function onAuxClick(callback) { return new Func("auxclick", callback); }
export function onBeforeInput(callback) { return new Func("beforeinput", callback); }
export function onBeforePrint(callback) { return new Func("beforeprint", callback); }
export function onBeforeUnload(callback) { return new Func("beforeunload", callback); }
export function onBlocked(callback) { return new Func("blocked", callback); }
export function onBlur(callback) { return new Func("blur", callback); }
export function onBoundary(callback) { return new Func("boundary", callback); }
export function onCanPlay(callback) { return new Func("canplay", callback); }
export function onCanPlayThrough(callback) { return new Func("canplaythrough", callback); }
export function onChange(callback) { return new Func("change", callback); }
export function onChargingChange(callback) { return new Func("chargingchange", callback); }
export function onChargingTimeChange(callback) { return new Func("chargingtimechange", callback); }
export function onChecking(callback) { return new Func("checking", callback); }
export function onClick(callback) { return new Func("click", callback); }
export function onClose(callback) { return new Func("close", callback); }
export function onComplete(callback) { return new Func("complete", callback); }
export function onCompositionEnd(callback) { return new Func("compositionend", callback); }
export function onCompositionStart(callback) { return new Func("compositionstart", callback); }
export function onCompositionUpdate(callback) { return new Func("compositionupdate", callback); }
export function onContextMenu(callback) { return new Func("contextmenu", callback); }
export function onCopy(callback) { return new Func("copy", callback); }
export function onCut(callback) { return new Func("cut", callback); }
export function onDblClick(callback) { return new Func("dblclick", callback); }
export function onDeviceChange(callback) { return new Func("devicechange", callback); }
export function onDeviceMotion(callback) { return new Func("devicemotion", callback); }
export function onDeviceOrientation(callback) { return new Func("deviceorientation", callback); }
export function onDischargingTimeChange(callback) { return new Func("dischargingtimechange", callback); }
export function onDownloading(callback) { return new Func("downloading", callback); }
export function onDrag(callback) { return new Func("drag", callback); }
export function onDragEnd(callback) { return new Func("dragend", callback); }
export function onDragEnter(callback) { return new Func("dragenter", callback); }
export function onDragLeave(callback) { return new Func("dragleave", callback); }
export function onDragOver(callback) { return new Func("dragover", callback); }
export function onDragStart(callback) { return new Func("dragstart", callback); }
export function onDrop(callback) { return new Func("drop", callback); }
export function onDurationChange(callback) { return new Func("durationchange", callback); }
export function onEmptied(callback) { return new Func("emptied", callback); }
export function onEnd(callback) { return new Func("end", callback); }
export function onEnded(callback) { return new Func("ended", callback); }
export function onError(callback) { return new Func("error", callback); }
export function onFocus(callback) { return new Func("focus", callback); }
export function onFocusIn(callback) { return new Func("focusin", callback); }
export function onFocusOut(callback) { return new Func("focusout", callback); }
export function onFullScreenChange(callback) { return new Func("fullscreenchange", callback); }
export function onFullScreenError(callback) { return new Func("fullscreenerror", callback); }
export function onGamepadConnected(callback) { return new Func("gamepadconnected", callback); }
export function onGamepadDisconnected(callback) { return new Func("gamepaddisconnected", callback); }
export function onGotPointerCapture(callback) { return new Func("gotpointercapture", callback); }
export function onHashChange(callback) { return new Func("hashchange", callback); }
export function onLostPointerCapture(callback) { return new Func("lostpointercapture", callback); }
export function onInput(callback) { return new Func("input", callback); }
export function onInvalid(callback) { return new Func("invalid", callback); }
export function onKeyDown(callback) { return new Func("keydown", callback); }
export function onKeyPress(callback) { return new Func("keypress", callback); }
export function onKeyUp(callback) { return new Func("keyup", callback); }
export function onLanguageChange(callback) { return new Func("languagechange", callback); }
export function onLevelChange(callback) { return new Func("levelchange", callback); }
export function onLoad(callback) { return new Func("load", callback); }
export function onLoadedData(callback) { return new Func("loadeddata", callback); }
export function onLoadedMetadata(callback) { return new Func("loadedmetadata", callback); }
export function onLoadEnd(callback) { return new Func("loadend", callback); }
export function onLoadStart(callback) { return new Func("loadstart", callback); }
export function onMark(callback) { return new Func("mark", callback); }
export function onMessage(callback) { return new Func("message", callback); }
export function onMessageError(callback) { return new Func("messageerror", callback); }
export function onMouseDown(callback) { return new Func("mousedown", callback); }
export function onMouseEnter(callback) { return new Func("mouseenter", callback); }
export function onMouseLeave(callback) { return new Func("mouseleave", callback); }
export function onMouseMove(callback) { return new Func("mousemove", callback); }
export function onMouseOut(callback) { return new Func("mouseout", callback); }
export function onMouseOver(callback) { return new Func("mouseover", callback); }
export function onMouseUp(callback) { return new Func("mouseup", callback); }
export function onNoMatch(callback) { return new Func("nomatch", callback); }
export function onNotificationClick(callback) { return new Func("notificationclick", callback); }
export function onNoUpdate(callback) { return new Func("noupdate", callback); }
export function onObsolete(callback) { return new Func("obsolete", callback); }
export function onOffline(callback) { return new Func("offline", callback); }
export function onOnline(callback) { return new Func("online", callback); }
export function onOpen(callback) { return new Func("open", callback); }
export function onOrientationChange(callback) { return new Func("orientationchange", callback); }
export function onPageHide(callback) { return new Func("pagehide", callback); }
export function onPageShow(callback) { return new Func("pageshow", callback); }
export function onPaste(callback) { return new Func("paste", callback); }
export function onPause(callback) { return new Func("pause", callback); }
export function onPointerCancel(callback) { return new Func("pointercancel", callback); }
export function onPointerDown(callback) { return new Func("pointerdown", callback); }
export function onPointerEnter(callback) { return new Func("pointerenter", callback); }
export function onPointerLeave(callback) { return new Func("pointerleave", callback); }
export function onPointerLockChange(callback) { return new Func("pointerlockchange", callback); }
export function onPointerLockError(callback) { return new Func("pointerlockerror", callback); }
export function onPointerMove(callback) { return new Func("pointermove", callback); }
export function onPointerOut(callback) { return new Func("pointerout", callback); }
export function onPointerOver(callback) { return new Func("pointerover", callback); }
export function onPointerUp(callback) { return new Func("pointerup", callback); }
export function onPlay(callback) { return new Func("play", callback); }
export function onPlaying(callback) { return new Func("playing", callback); }
export function onPopstate(callback) { return new Func("popstate", callback); }
export function onProgress(callback) { return new Func("progress", callback); }
export function onPush(callback) { return new Func("push", callback); }
export function onPushSubscriptionChange(callback) { return new Func("pushsubscriptionchange", callback); }
export function onRatechange(callback) { return new Func("ratechange", callback); }
export function onReadystatechange(callback) { return new Func("readystatechange", callback); }
export function onReset(callback) { return new Func("reset", callback); }
export function onResize(callback) { return new Func("resize", callback); }
export function onResourceTimingBufferFull(callback) { return new Func("resourcetimingbufferfull", callback); }
export function onResult(callback) { return new Func("result", callback); }
export function onResume(callback) { return new Func("resume", callback); }
export function onScroll(callback) { return new Func("scroll", callback); }
export function onSeeked(callback) { return new Func("seeked", callback); }
export function onSeeking(callback) { return new Func("seeking", callback); }
export function onSelect(callback) { return new Func("select", callback); }
export function onSelectStart(callback) { return new Func("selectstart", callback); }
export function onSelectionChange(callback) { return new Func("selectionchange", callback); }
export function onShow(callback) { return new Func("show", callback); }
export function onSlotChange(callback) { return new Func("slotchange", callback); }
export function onSoundEnd(callback) { return new Func("soundend", callback); }
export function onSoundStart(callback) { return new Func("soundstart", callback); }
export function onSpeechEnd(callback) { return new Func("speechend", callback); }
export function onSpeechStart(callback) { return new Func("speechstart", callback); }
export function onStalled(callback) { return new Func("stalled", callback); }
export function onStart(callback) { return new Func("start", callback); }
export function onStorage(callback) { return new Func("storage", callback); }
export function onSubmit(callback) { return new Func("submit", callback); }
export function onSuccess(callback) { return new Func("success", callback); }
export function onSuspend(callback) { return new Func("suspend", callback); }
export function onSVGAbort(callback) { return new Func("SVGAbort", callback); }
export function onSVGError(callback) { return new Func("SVGError", callback); }
export function onSVGLoad(callback) { return new Func("SVGLoad", callback); }
export function onSVGResize(callback) { return new Func("SVGResize", callback); }
export function onSVGScroll(callback) { return new Func("SVGScroll", callback); }
export function onSVGUnload(callback) { return new Func("SVGUnload", callback); }
export function onSVGZoom(callback) { return new Func("SVGZoom", callback); }
export function onTimeout(callback) { return new Func("timeout", callback); }
export function onTimeUpdate(callback) { return new Func("timeupdate", callback); }
export function onTouchCancel(callback) { return new Func("touchcancel", callback); }
export function onTouchEnd(callback) { return new Func("touchend", callback); }
export function onTouchMove(callback) { return new Func("touchmove", callback); }
export function onTouchStart(callback) { return new Func("touchstart", callback); }
export function onTransitionEnd(callback) { return new Func("transitionend", callback); }
export function onUnload(callback) { return new Func("unload", callback); }
export function onUpdateReady(callback) { return new Func("updateready", callback); }
export function onUpgradeNeeded(callback) { return new Func("upgradeneeded", callback); }
export function onUserProximity(callback) { return new Func("userproximity", callback); }
export function onVoicesChanged(callback) { return new Func("voiceschanged", callback); }
export function onVersionChange(callback) { return new Func("versionchange", callback); }
export function onVisibilityChange(callback) { return new Func("visibilitychange", callback); }
export function onVolumeChange(callback) { return new Func("volumechange", callback); }
export function onWaiting(callback) { return new Func("waiting", callback); }
export function onWheel(callback) { return new Func("wheel", callback); }