export function isFunction(obj) {
    return typeof obj === "function"
        || obj instanceof Function;
}

export function assignAttributes(elem, ...rest) {
    rest.filter(x => typeof x === "object"
        && !(x instanceof Element
            || x instanceof String
            || x instanceof Number
            || x instanceof Function
            || x instanceof Boolean
            || x instanceof Symbol))
        .forEach(attr => {
            if (attr instanceof Attr) {
                attr.apply(elem);
            }
            else if (attr instanceof Func) {
                attr.add(elem);
            }
            else {
                for (let key in attr) {
                    const value = attr[key];
                    if (key === "style") {
                        for (let subKey in value) {
                            elem[key][subKey] = value[subKey];
                        }
                    }
                    else if (key === "textContent" || key === "innerText") {
                        elem.appendChild(document.createTextNode(value));
                    }
                    else if (key.startsWith("on") && isFunction(value)) {
                        elem.addEventListener(key.substring(2), value);
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
                }
            }
        });
}

export function clear(elem) {
    while (elem.lastChild) {
        elem.lastChild.remove();
    }
}

export function tag(name, ...rest) {
    const elem = document.createElement(name);

    assignAttributes(elem, ...rest);

    for (let x of rest) {
        if (x instanceof String || typeof x === "string") {
            elem.appendChild(document.createTextNode(x));
        }
        else if (x instanceof Element) {
            elem.appendChild(x);
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
// Executes the script asynchronously.
export function async(value) { return new Attr("async", ["script"], value); }
// Sets whether input is automatically capitalized when entered by user
export function autocapitalize(value) { return new Attr("autocapitalize", [], value); }
// Indicates whether controls in this form can by default have their values automatically completed by the browser.
export function autocomplete(value) { return new Attr("autocomplete", ["form", "input", "select", "textarea"], value); }
// The element should be automatically focused after the page loaded.
export function autofocus(value) { return new Attr("autofocus", ["button", "input", "keygen", "select", "textarea"], value); }
// The audio or video should play as soon as possible.
export function autoplay(value) { return new Attr("autoplay", ["audio", "video"], value); }
// Contains the time range of already buffered media.
export function buffered(value) { return new Attr("buffered", ["audio", "video"], value); }
// From the HTML Media Capture
export function capture(value) { return new Attr("capture", ["input"], value); }
// Declares the character encoding of the page or script.
export function charset(value) { return new Attr("charset", ["meta", "script"], value); }
// Indicates whether the element should be checked on page load.
export function checked(value) { return new Attr("checked", ["command", "input"], value); }
// Contains a URI which points to the source of the quote or change.
export function cite(value) { return new Attr("cite", ["blockquote", "del", "ins", "q"], value); }
// Often used with CSS to style elements with common properties.
export function className(value) { return new Attr("className", [], value); }
// Specifies the URL of the applet's class file to be loaded and executed.
export function code(value) { return new Attr("code", ["applet"], value); }
// This attribute gives the absolute or relative URL of the directory where applets' .class files referenced by the code attribute are stored.
export function codebase(value) { return new Attr("codebase", ["applet"], value); }
// Defines the number of columns in a textarea.
export function cols(value) { return new Attr("cols", ["textarea"], value); }
// The colspan attribute defines the number of columns a cell should span.
export function colSpan(value) { return new Attr("colspan", ["td", "th"], value); }
// A value associated with http-equiv or name depending on the context.
export function content(value) { return new Attr("content", ["meta"], value); }
// Indicates whether the element's content is editable.
export function contenteditable(value) { return new Attr("contenteditable", [], value); }
// Defines the ID of a <menu> element which will serve as the element's context menu.
export function contextmenu(value) { return new Attr("contextmenu", [], value); }
// Indicates whether the browser should show playback controls to the user.
export function controls(value) { return new Attr("controls", ["audio", "video"], value); }
// A set of values specifying the coordinates of the hot-spot region.
export function coords(value) { return new Attr("coords", ["area"], value); }
// How the element handles cross-origin requests
export function crossorigin(value) { return new Attr("crossorigin", ["audio", "img", "link", "script", "video"], value); }
// Specifies the Content Security Policy that an embedded document must agree to enforce upon itself.
export function csp(value) { return new Attr("csp", ["iframe"], value); }
// Specifies the URL of the resource.
export function data(value) { return new Attr("data", ["object"], value); }
// Lets you attach custom attributes to an HTML element.
export function datanewattr(name, value) { return new Attr("data" + name, [], value); }
// Indicates the date and time associated with the element.
export function datetime(value) { return new Attr("datetime", ["del", "ins", "time"], value); }
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
export function dirname(value) { return new Attr("dirname", ["input", "textarea"], value); }
// Indicates that the hyperlink is to be used for downloading a resource.
export function download(value) { return new Attr("download", ["a", "area"], value); }
// Defines whether the element can be dragged.
export function draggable(value) { return new Attr("draggable", [], value); }
// Indicates that the element accepts the dropping of content onto it.
export function dropzone(value) { return new Attr("dropzone", [], value); }
// Defines the content type of the form data when the method is POST.
export function enctype(value) { return new Attr("enctype", ["form"], value); }
// The enterkeyhint specifies what action label (or icon) to present for the enter key on virtual keyboards. The attribute can be used with form controls (such as the value of textarea elements), or in elements in an editing host (e.g., using contenteditable attribute).
export function enterkeyhint(value) { return new Attr("enterkeyhint", ["textarea"], value); }
// Describes elements which belongs to this one.
const el = document.createElement("label");
export function htmlFor(value) { return new Attr("htmlFor", ["label", "output"], value); }
// Indicates the form that is the owner of the element.
export function form(value) { return new Attr("form", ["button", "fieldset", "input", "keygen", "label", "meter", "object", "output", "progress", "select", "textarea"], value); }
// Indicates the action of the element, overriding the action defined in the <form>.
export function formaction(value) { return new Attr("formaction", ["input", "button"], value); }
// If the button/input is a submit button (type="submit"), this attribute sets the encoding type to use during form submission. If this attribute is specified, it overrides the enctype attribute of the button's form owner.
export function formenctype(value) { return new Attr("formenctype", ["button", "input"], value); }
// If the button/input is a submit button (type="submit"), this attribute sets the submission method to use during form submission (GET, POST, etc.). If this attribute is specified, it overrides the method attribute of the button's form owner.
export function formmethod(value) { return new Attr("formmethod", ["button", "input"], value); }
// If the button/input is a submit button (type="submit"), this boolean attribute specifies that the form is not to be validated when it is submitted. If this attribute is specified, it overrides the novalidate attribute of the button's form owner.
export function formnovalidate(value) { return new Attr("formnovalidate", ["button", "input"], value); }
// If the button/input is a submit button (type="submit"), this attribute specifies the browsing context (for example, tab, window, or inline frame) in which to display the response that is received after submitting the form. If this attribute is specified, it overrides the target attribute of the button's form owner.
export function formtarget(value) { return new Attr("formtarget", ["button", "input"], value); }
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
export function hreflang(value) { return new Attr("hreflang", ["a", "area", "link"], value); }
// Defines a pragma directive.
export function httpEquiv(value) { return new Attr("httpEquiv", ["meta"], value); }
// Specifies a picture which represents the command.
export function icon(value) { return new Attr("icon", ["command"], value); }
// Often used with CSS to style a specific element. The value of this attribute must be unique.
export function id(value) { return new Attr("id", [], value); }
// Indicates the relative fetch priority for the resource.
export function importance(value) { return new Attr("importance", ["iframe", "img", "link", "script"], value); }
// Specifies a Subresource Integrity value that allows browsers to verify what they fetch.
export function integrity(value) { return new Attr("integrity", ["link", "script"], value); }
// This attribute tells the browser to ignore the actual intrinsic size of the image and pretend it’s the size specified in the attribute.
export function intrinsicsize(value) { return new Attr("intrinsicsize", ["img"], value); }
// Provides a hint as to the type of data that might be entered by the user while editing the element or its contents. The attribute can be used with form controls (such as the value of textarea elements), or in elements in an editing host (e.g., using contenteditable attribute).
export function inputmode(value) { return new Attr("inputmode", ["textarea"], value); }
// Indicates that the image is part of a server-side image map.
export function ismap(value) { return new Attr("ismap", ["img"], value); }
// Specifies the type of key generated.
export function keytype(value) { return new Attr("keytype", ["keygen"], value); }
// ???
export function itemprop(value) { return new Attr("itemprop", [], value); }
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
export function maxlength(value) { return new Attr("maxlength", ["input", "textarea"], value); }
// Defines the minimum number of characters allowed in the element.
export function minlength(value) { return new Attr("minlength", ["input", "textarea"], value); }
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
export function novalidate(value) { return new Attr("novalidate", ["form"], value); }
// Indicates whether the details will be shown on page load.
export function open(value) { return new Attr("open", ["details"], value); }
// Indicates the optimal numeric value.
export function optimum(value) { return new Attr("optimum", ["meter"], value); }
// Defines a regular expression which the element's value will be validated against.
export function pattern(value) { return new Attr("pattern", ["input"], value); }
// The ping attribute specifies a space-separated list of URLs to be notified if a user follows the hyperlink.
export function ping(value) { return new Attr("ping", ["a", "area"], value); }
// Provides a hint to the user of what can be entered in the field.
export function placeholder(value) { return new Attr("placeholder", ["input", "textarea"], value); }
// A URL indicating a poster frame to show until the user plays or seeks.
export function poster(value) { return new Attr("poster", ["video"], value); }
// Indicates whether the whole resource, parts of it or nothing should be preloaded.
export function preload(value) { return new Attr("preload", ["audio", "video"], value); }
// Indicates whether the element can be edited.
export function readonly(value) { return new Attr("readonly", ["input", "textarea"], value); }
// ???
export function radiogroup(value) { return new Attr("radiogroup", ["command"], value); }
// Specifies which referrer is sent when fetching the resource.
export function referrerpolicy(value) { return new Attr("referrerpolicy", ["a", "area", "iframe", "img", "link", "script"], value); }
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
export function rowspan(value) { return new Attr("rowspan", ["td", "th"], value); }
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
export function spellcheck(value) { return new Attr("spellcheck", [], value); }
// The URL of the embeddable content.
export function src(value) { return new Attr("src", ["audio", "embed", "iframe", "img", "input", "script", "source", "track", "video"], value); }
// ???
export function srcdoc(value) { return new Attr("srcdoc", ["iframe"], value); }
// ???
export function srclang(value) { return new Attr("srclang", ["track"], value); }
// One or more responsive image candidates.
export function srcset(value) { return new Attr("srcset", ["img", "source"], value); }
// Defines the first number if other than 1.
export function start(value) { return new Attr("start", ["ol"], value); }
// Defines CSS styles which will override styles previously set.
export function style(value) { return new Attr("style", [], value); }
// ???
export function step(value) { return new Attr("step", ["input"], value); }
// ???
export function summary(value) { return new Attr("summary", ["table"], value); }
// Overrides the browser's default tab order and follows the one specified instead.
export function tabindex(value) { return new Attr("tabindex", [], value); }
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
export function usemap(value) { return new Attr("usemap", ["img", "input", "object"], value); }
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


export function onabort(callback) { return new Func("abort", callback); }
export function onafterprint(callback) { return new Func("afterprint", callback); }
export function onanimationcancel(callback) { return new Func("animationcancel", callback); }
export function onanimationend(callback) { return new Func("animationend", callback); }
export function onanimationiteration(callback) { return new Func("animationiteration", callback); }
export function onanimationstart(callback) { return new Func("animationstart", callback); }
export function onappinstalled(callback) { return new Func("appinstalled", callback); }
export function _onaudioprocess(callback) { return new Func("audioprocess", callback); }
export function onaudioend(callback) { return new Func("audioend", callback); }
export function onaudiostart(callback) { return new Func("audiostart", callback); }
export function onauxclick(callback) { return new Func("auxclick", callback); }
export function onbeforeinput(callback) { return new Func("beforeinput", callback); }
export function onbeforeprint(callback) { return new Func("beforeprint", callback); }
export function onbeforeunload(callback) { return new Func("beforeunload", callback); }
export function onbeginEvent(callback) { return new Func("beginEvent", callback); }
export function onblocked(callback) { return new Func("blocked", callback); }
export function onblur(callback) { return new Func("blur", callback); }
export function onboundary(callback) { return new Func("boundary", callback); }
export function oncanplay(callback) { return new Func("canplay", callback); }
export function oncanplaythrough(callback) { return new Func("canplaythrough", callback); }
export function onchange(callback) { return new Func("change", callback); }
export function onchargingchange(callback) { return new Func("chargingchange", callback); }
export function onchargingtimechange(callback) { return new Func("chargingtimechange", callback); }
export function onchecking(callback) { return new Func("checking", callback); }
export function onclick(callback) { return new Func("click", callback); }
export function onclose(callback) { return new Func("close", callback); }
export function oncomplete(callback) { return new Func("complete", callback); }
export function oncompositionend(callback) { return new Func("compositionend", callback); }
export function oncompositionstart(callback) { return new Func("compositionstart", callback); }
export function oncompositionupdate(callback) { return new Func("compositionupdate", callback); }
export function oncontextmenu(callback) { return new Func("contextmenu", callback); }
export function oncopy(callback) { return new Func("copy", callback); }
export function oncut(callback) { return new Func("cut", callback); }
export function ondblclick(callback) { return new Func("dblclick", callback); }
export function ondevicechange(callback) { return new Func("devicechange", callback); }
export function ondevicemotion(callback) { return new Func("devicemotion", callback); }
export function ondeviceorientation(callback) { return new Func("deviceorientation", callback); }
export function ondischargingtimechange(callback) { return new Func("dischargingtimechange", callback); }
export function ondownloading(callback) { return new Func("downloading", callback); }
export function ondrag(callback) { return new Func("drag", callback); }
export function ondragend(callback) { return new Func("dragend", callback); }
export function ondragenter(callback) { return new Func("dragenter", callback); }
export function ondragleave(callback) { return new Func("dragleave", callback); }
export function ondragover(callback) { return new Func("dragover", callback); }
export function ondragstart(callback) { return new Func("dragstart", callback); }
export function ondrop(callback) { return new Func("drop", callback); }
export function ondurationchange(callback) { return new Func("durationchange", callback); }
export function onemptied(callback) { return new Func("emptied", callback); }
export function onend(callback) { return new Func("end", callback); }
export function onended(callback) { return new Func("ended", callback); }
export function onendEvent(callback) { return new Func("endEvent", callback); }
export function onerror(callback) { return new Func("error", callback); }
export function onfocus(callback) { return new Func("focus", callback); }
export function onfocusin(callback) { return new Func("focusin", callback); }
export function onfocusout(callback) { return new Func("focusout", callback); }
export function onfullscreenchange(callback) { return new Func("fullscreenchange", callback); }
export function onfullscreenerror(callback) { return new Func("fullscreenerror", callback); }
export function ongamepadconnected(callback) { return new Func("gamepadconnected", callback); }
export function ongamepaddisconnected(callback) { return new Func("gamepaddisconnected", callback); }
export function ongotpointercapture(callback) { return new Func("gotpointercapture", callback); }
export function onhashchange(callback) { return new Func("hashchange", callback); }
export function onlostpointercapture(callback) { return new Func("lostpointercapture", callback); }
export function oninput(callback) { return new Func("input", callback); }
export function oninvalid(callback) { return new Func("invalid", callback); }
export function onkeydown(callback) { return new Func("keydown", callback); }
export function _onkeypress(callback) { return new Func("keypress", callback); }
export function onkeyup(callback) { return new Func("keyup", callback); }
export function onlanguagechange(callback) { return new Func("languagechange", callback); }
export function onlevelchange(callback) { return new Func("levelchange", callback); }
export function onload(callback) { return new Func("load", callback); }
export function onloadeddata(callback) { return new Func("loadeddata", callback); }
export function onloadedmetadata(callback) { return new Func("loadedmetadata", callback); }
export function onloadend(callback) { return new Func("loadend", callback); }
export function onloadstart(callback) { return new Func("loadstart", callback); }
export function onmark(callback) { return new Func("mark", callback); }
export function onmessage(callback) { return new Func("message", callback); }
export function onmessageerror(callback) { return new Func("messageerror", callback); }
export function onmousedown(callback) { return new Func("mousedown", callback); }
export function onmouseenter(callback) { return new Func("mouseenter", callback); }
export function onmouseleave(callback) { return new Func("mouseleave", callback); }
export function onmousemove(callback) { return new Func("mousemove", callback); }
export function onmouseout(callback) { return new Func("mouseout", callback); }
export function onmouseover(callback) { return new Func("mouseover", callback); }
export function onmouseup(callback) { return new Func("mouseup", callback); }
export function onnomatch(callback) { return new Func("nomatch", callback); }
export function onnotificationclick(callback) { return new Func("notificationclick", callback); }
export function onnoupdate(callback) { return new Func("noupdate", callback); }
export function onobsolete(callback) { return new Func("obsolete", callback); }
export function onoffline(callback) { return new Func("offline", callback); }
export function ononline(callback) { return new Func("online", callback); }
export function onopen(callback) { return new Func("open", callback); }
export function onorientationchange(callback) { return new Func("orientationchange", callback); }
export function onpagehide(callback) { return new Func("pagehide", callback); }
export function onpageshow(callback) { return new Func("pageshow", callback); }
export function onpaste(callback) { return new Func("paste", callback); }
export function onpause(callback) { return new Func("pause", callback); }
export function onpointercancel(callback) { return new Func("pointercancel", callback); }
export function onpointerdown(callback) { return new Func("pointerdown", callback); }
export function onpointerenter(callback) { return new Func("pointerenter", callback); }
export function onpointerleave(callback) { return new Func("pointerleave", callback); }
export function onpointerlockchange(callback) { return new Func("pointerlockchange", callback); }
export function onpointerlockerror(callback) { return new Func("pointerlockerror", callback); }
export function onpointermove(callback) { return new Func("pointermove", callback); }
export function onpointerout(callback) { return new Func("pointerout", callback); }
export function onpointerover(callback) { return new Func("pointerover", callback); }
export function onpointerup(callback) { return new Func("pointerup", callback); }
export function onplay(callback) { return new Func("play", callback); }
export function onplaying(callback) { return new Func("playing", callback); }
export function onpopstate(callback) { return new Func("popstate", callback); }
export function onprogress(callback) { return new Func("progress", callback); }
export function onpush(callback) { return new Func("push", callback); }
export function onpushsubscriptionchange(callback) { return new Func("pushsubscriptionchange", callback); }
export function onratechange(callback) { return new Func("ratechange", callback); }
export function onreadystatechange(callback) { return new Func("readystatechange", callback); }
export function onrepeatEvent(callback) { return new Func("repeatEvent", callback); }
export function onreset(callback) { return new Func("reset", callback); }
export function onresize(callback) { return new Func("resize", callback); }
export function onresourcetimingbufferfull(callback) { return new Func("resourcetimingbufferfull", callback); }
export function onresult(callback) { return new Func("result", callback); }
export function onresume(callback) { return new Func("resume", callback); }
export function onscroll(callback) { return new Func("scroll", callback); }
export function onseeked(callback) { return new Func("seeked", callback); }
export function onseeking(callback) { return new Func("seeking", callback); }
export function onselect(callback) { return new Func("select", callback); }
export function onselectstart(callback) { return new Func("selectstart", callback); }
export function onselectionchange(callback) { return new Func("selectionchange", callback); }
export function onshow(callback) { return new Func("show", callback); }
export function onslotchange(callback) { return new Func("slotchange", callback); }
export function onsoundend(callback) { return new Func("soundend", callback); }
export function onsoundstart(callback) { return new Func("soundstart", callback); }
export function onspeechend(callback) { return new Func("speechend", callback); }
export function onspeechstart(callback) { return new Func("speechstart", callback); }
export function onstalled(callback) { return new Func("stalled", callback); }
export function onstart(callback) { return new Func("start", callback); }
export function onstorage(callback) { return new Func("storage", callback); }
export function onsubmit(callback) { return new Func("submit", callback); }
export function onsuccess(callback) { return new Func("success", callback); }
export function onsuspend(callback) { return new Func("suspend", callback); }
export function onSVGAbort(callback) { return new Func("SVGAbort", callback); }
export function onSVGError(callback) { return new Func("SVGError", callback); }
export function onSVGLoad(callback) { return new Func("SVGLoad", callback); }
export function onSVGResize(callback) { return new Func("SVGResize", callback); }
export function onSVGScroll(callback) { return new Func("SVGScroll", callback); }
export function onSVGUnload(callback) { return new Func("SVGUnload", callback); }
export function onSVGZoom(callback) { return new Func("SVGZoom", callback); }
export function ontimeout(callback) { return new Func("timeout", callback); }
export function ontimeupdate(callback) { return new Func("timeupdate", callback); }
export function ontouchcancel(callback) { return new Func("touchcancel", callback); }
export function ontouchend(callback) { return new Func("touchend", callback); }
export function ontouchmove(callback) { return new Func("touchmove", callback); }
export function ontouchstart(callback) { return new Func("touchstart", callback); }
export function ontransitionend(callback) { return new Func("transitionend", callback); }
export function onunload(callback) { return new Func("unload", callback); }
export function onupdateready(callback) { return new Func("updateready", callback); }
export function onupgradeneeded(callback) { return new Func("upgradeneeded", callback); }
export function onuserproximity(callback) { return new Func("userproximity", callback); }
export function onvoiceschanged(callback) { return new Func("voiceschanged", callback); }
export function onversionchange(callback) { return new Func("versionchange", callback); }
export function onvisibilitychange(callback) { return new Func("visibilitychange", callback); }
export function onvolumechange(callback) { return new Func("volumechange", callback); }
export function onwaiting(callback) { return new Func("waiting", callback); }
export function onwheel(callback) { return new Func("wheel", callback); }