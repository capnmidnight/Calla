export class HtmlAttr {
    constructor(key, tags, value) {
        tags = tags.map(t => t.toLocaleUpperCase());

        this.apply = (elem) => {
            const isValid = tags.length === 0
                || tags.indexOf(elem.tagName) > -1;

            if (!isValid) {
                console.warn(`Element ${elem.tagName} does not support Attribute ${key}`);
            }
            else if (key === "style") {
                Object.assign(elem[key], value);
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
export function accept(value) { return new HtmlAttr("accept", ["form", "input"], value); }
export function accessKey(value) { return new HtmlAttr("accessKey", ["input", "button"], value); }
// Specifies the horizontal alignment of the element.
export function align(value) { return new HtmlAttr("align", ["applet", "caption", "col", "colgroup", "hr", "iframe", "img", "table", "tbody", "td", "tfoot> , <th", "thead", "tr"], value); }
// Specifies a feature-policy for the iframe.
export function allow(value) { return new HtmlAttr("allow", ["iframe"], value); }
// Alternative text in case an image can't be displayed.
export function alt(value) { return new HtmlAttr("alt", ["applet", "area", "img", "input"], value); }
export function ariaActiveDescendant(value) { return new HtmlAttr("ariaActiveDescendant", [], value); }
export function ariaAtomic(value) { return new HtmlAttr("ariaAtomic", [], value); }
export function ariaAutoComplete(value) { return new HtmlAttr("ariaAutoComplete", [], value); }
export function ariaBusy(value) { return new HtmlAttr("ariaBusy", [], value); }
export function ariaChecked(value) { return new HtmlAttr("ariaChecked", [], value); }
export function ariaControls(value) { return new HtmlAttr("ariaControls", [], value); }
export function ariaDescribedBy(value) { return new HtmlAttr("ariaDescribedBy", [], value); }
export function ariaDisabled(value) { return new HtmlAttr("ariaDisabled", [], value); }
export function ariaDropEffect(value) { return new HtmlAttr("ariaDropEffect", [], value); }
export function ariaExpanded(value) { return new HtmlAttr("ariaExpanded", [], value); }
export function ariaFlowTo(value) { return new HtmlAttr("ariaFlowTo", [], value); }
export function ariaGrabbed(value) { return new HtmlAttr("ariaGrabbed", [], value); }
export function ariaHasPopup(value) { return new HtmlAttr("ariaHasPopup", [], value); }
export function ariaHidden(value) { return new HtmlAttr("ariaHidden", [], value); }
export function ariaInvalid(value) { return new HtmlAttr("ariaInvalid", [], value); }
export function ariaLabel(value) { return new HtmlAttr("ariaLabel", [], value); }
export function ariaLabelledBy(value) { return new HtmlAttr("ariaLabelledBy", [], value); }
export function ariaLevel(value) { return new HtmlAttr("ariaLevel", [], value); }
export function ariaLive(value) { return new HtmlAttr("ariaLive", [], value); }
export function ariaMultiline(value) { return new HtmlAttr("ariaMultiline", [], value); }
export function ariaMultiSelectable(value) { return new HtmlAttr("ariaMultiSelectable", [], value); }
export function ariaOwns(value) { return new HtmlAttr("ariaOwns", [], value); }
export function ariaPosInSet(value) { return new HtmlAttr("ariaPosInSet", [], value); }
export function ariaPressed(value) { return new HtmlAttr("ariaPressed", [], value); }
export function ariaReadOnly(value) { return new HtmlAttr("ariaReadOnly", [], value); }
export function ariaRelevant(value) { return new HtmlAttr("ariaRelevant", [], value); }
export function ariaRequired(value) { return new HtmlAttr("ariaRequired", [], value); }
export function ariaSelected(value) { return new HtmlAttr("ariaSelected", [], value); }
export function ariaSetSize(value) { return new HtmlAttr("ariaSetsize", [], value); }
export function ariaSort(value) { return new HtmlAttr("ariaSort", [], value); }
export function ariaValueMax(value) { return new HtmlAttr("ariaValueMax", [], value); }
export function ariaValueMin(value) { return new HtmlAttr("ariaValueMin", [], value); }
export function ariaValueNow(value) { return new HtmlAttr("ariaValueNow", [], value); }
export function ariaValueText(value) { return new HtmlAttr("ariaValueText", [], value); }
// Executes the script asynchronously.
export function async(value) { return new HtmlAttr("async", ["script"], value); }
// Sets whether input is automatically capitalized when entered by user
export function autoCapitalize(value) { return new HtmlAttr("autocapitalize", [], value); }
// Indicates whether controls in this form can by default have their values automatically completed by the browser.
export function autoComplete(value) { return new HtmlAttr("autocomplete", ["form", "input", "select", "textarea"], value); }
// The element should be automatically focused after the page loaded.
export function autoFocus(value) { return new HtmlAttr("autofocus", ["button", "input", "keygen", "select", "textarea"], value); }
// The audio or video should play as soon as possible.
export function autoPlay(value) { return new HtmlAttr("autoplay", ["audio", "video"], value); }
// Contains the time range of already buffered media.
export function buffered(value) { return new HtmlAttr("buffered", ["audio", "video"], value); }
// From the HTML Media Capture
export function capture(value) { return new HtmlAttr("capture", ["input"], value); }
// Declares the character encoding of the page or script.
export function charSet(value) { return new HtmlAttr("charset", ["meta", "script"], value); }
// Indicates whether the element should be checked on page load.
export function checked(value) { return new HtmlAttr("checked", ["command", "input"], value); }
// Contains a URI which points to the source of the quote or change.
export function cite(value) { return new HtmlAttr("cite", ["blockquote", "del", "ins", "q"], value); }
// Often used with CSS to style elements with common properties.
export function className(value) { return new HtmlAttr("className", [], value); }
// Specifies the URL of the applet's class file to be loaded and executed.
export function code(value) { return new HtmlAttr("code", ["applet"], value); }
// This attribute gives the absolute or relative URL of the directory where applets' .class files referenced by the code attribute are stored.
export function codeBase(value) { return new HtmlAttr("codebase", ["applet"], value); }
// Defines the number of columns in a textarea.
export function cols(value) { return new HtmlAttr("cols", ["textarea"], value); }
// The colspan attribute defines the number of columns a cell should span.
export function colSpan(value) { return new HtmlAttr("colspan", ["td", "th"], value); }
// A value associated with http-equiv or name depending on the context.
export function content(value) { return new HtmlAttr("content", ["meta"], value); }
// Indicates whether the element's content is editable.
export function contentEditable(value) { return new HtmlAttr("contenteditable", [], value); }
// Defines the ID of a <menu> element which will serve as the element's context menu.
export function contextMenu(value) { return new HtmlAttr("contextmenu", [], value); }
// Indicates whether the browser should show playback controls to the user.
export function controls(value) { return new HtmlAttr("controls", ["audio", "video"], value); }
// A set of values specifying the coordinates of the hot-spot region.
export function coords(value) { return new HtmlAttr("coords", ["area"], value); }
// How the element handles cross-origin requests
export function crossOrigin(value) { return new HtmlAttr("crossorigin", ["audio", "img", "link", "script", "video"], value); }
// Specifies the Content Security Policy that an embedded document must agree to enforce upon itself.
export function csp(value) { return new HtmlAttr("csp", ["iframe"], value); }
// Specifies the URL of the resource.
export function data(value) { return new HtmlAttr("data", ["object"], value); }
// Lets you attach custom attributes to an HTML element.
export function customData(name, value) { return new HtmlAttr("data" + name, [], value); }
// Indicates the date and time associated with the element.
export function dateTime(value) { return new HtmlAttr("datetime", ["del", "ins", "time"], value); }
// Indicates the preferred method to decode the image.
export function decoding(value) { return new HtmlAttr("decoding", ["img"], value); }
// Indicates that the track should be enabled unless the user's preferences indicate something different.
export function defaultValue(value) { return new HtmlAttr("default", ["track"], value); }
// Indicates that the script should be executed after the page has been parsed.
export function defer(value) { return new HtmlAttr("defer", ["script"], value); }
// Defines the text direction. Allowed values are ltr (Left-To-Right) or rtl (Right-To-Left)
export function dir(value) { return new HtmlAttr("dir", [], value); }
// Indicates whether the user can interact with the element.
export function disabled(value) { return new HtmlAttr("disabled", ["button", "command", "fieldset", "input", "keygen", "optgroup", "option", "select", "textarea"], value); }
// ??? 
export function dirName(value) { return new HtmlAttr("dirname", ["input", "textarea"], value); }
// Indicates that the hyperlink is to be used for downloading a resource.
export function download(value) { return new HtmlAttr("download", ["a", "area"], value); }
// Defines whether the element can be dragged.
export function draggable(value) { return new HtmlAttr("draggable", [], value); }
// Indicates that the element accepts the dropping of content onto it.
export function dropZone(value) { return new HtmlAttr("dropzone", [], value); }
// Defines the content type of the form data when the method is POST.
export function encType(value) { return new HtmlAttr("enctype", ["form"], value); }
// The enterkeyhint specifies what action label (or icon) to present for the enter key on virtual keyboards. The attribute can be used with form controls (such as the value of textarea elements), or in elements in an editing host (e.g., using contenteditable attribute).
export function enterKeyHint(value) { return new HtmlAttr("enterkeyhint", ["textarea"], value); }
// Describes elements which belongs to this one.
export function htmlFor(value) { return new HtmlAttr("htmlFor", ["label", "output"], value); }
// Indicates the form that is the owner of the element.
export function form(value) { return new HtmlAttr("form", ["button", "fieldset", "input", "keygen", "label", "meter", "object", "output", "progress", "select", "textarea"], value); }
// Indicates the action of the element, overriding the action defined in the <form>.
export function formAction(value) { return new HtmlAttr("formaction", ["input", "button"], value); }
// If the button/input is a submit button (type="submit"), this attribute sets the encoding type to use during form submission. If this attribute is specified, it overrides the enctype attribute of the button's form owner.
export function formEncType(value) { return new HtmlAttr("formenctype", ["button", "input"], value); }
// If the button/input is a submit button (type="submit"), this attribute sets the submission method to use during form submission (GET, POST, etc.). If this attribute is specified, it overrides the method attribute of the button's form owner.
export function formMethod(value) { return new HtmlAttr("formmethod", ["button", "input"], value); }
// If the button/input is a submit button (type="submit"), this boolean attribute specifies that the form is not to be validated when it is submitted. If this attribute is specified, it overrides the novalidate attribute of the button's form owner.
export function formNoValidate(value) { return new HtmlAttr("formnovalidate", ["button", "input"], value); }
// If the button/input is a submit button (type="submit"), this attribute specifies the browsing context (for example, tab, window, or inline frame) in which to display the response that is received after submitting the form. If this attribute is specified, it overrides the target attribute of the button's form owner.
export function formTarget(value) { return new HtmlAttr("formtarget", ["button", "input"], value); }
// IDs of the <th> elements which applies to this element.
export function headers(value) { return new HtmlAttr("headers", ["td", "th"], value); }
// Specifies the height of elements listed here. For all other elements, use the CSS height property.
export function height(value) { return new HtmlAttr("height", ["canvas", "embed", "iframe", "img", "input", "object", "video"], value); }
// Prevents rendering of given element, while keeping child elements, e.g. script elements, active.
export function hidden(value) { return new HtmlAttr("hidden", [], value); }
// Indicates the lower bound of the upper range.
export function high(value) { return new HtmlAttr("high", ["meter"], value); }
// The URL of a linked resource.
export function href(value) { return new HtmlAttr("href", ["a", "area", "base", "link"], value); }
// Specifies the language of the linked resource.
export function hrefLang(value) { return new HtmlAttr("hreflang", ["a", "area", "link"], value); }
// Defines a pragma directive.
export function httpEquiv(value) { return new HtmlAttr("httpEquiv", ["meta"], value); }
// Specifies a picture which represents the command.
export function icon(value) { return new HtmlAttr("icon", ["command"], value); }
// Often used with CSS to style a specific element. The value of this attribute must be unique.
export function id(value) { return new HtmlAttr("id", [], value); }
// Indicates the relative fetch priority for the resource.
export function importance(value) { return new HtmlAttr("importance", ["iframe", "img", "link", "script"], value); }
// Provides a hint as to the type of data that might be entered by the user while editing the element or its contents. The attribute can be used with form controls (such as the value of textarea elements), or in elements in an editing host (e.g., using contenteditable attribute).
export function inputMode(value) { return new HtmlAttr("inputmode", ["textarea"], value); }
// Specifies a Subresource Integrity value that allows browsers to verify what they fetch.
export function integrity(value) { return new HtmlAttr("integrity", ["link", "script"], value); }
// This attribute tells the browser to ignore the actual intrinsic size of the image and pretend it’s the size specified in the attribute.
export function intrinsicSize(value) { return new HtmlAttr("intrinsicsize", ["img"], value); }
// Indicates that the image is part of a server-side image map.
export function isMap(value) { return new HtmlAttr("ismap", ["img"], value); }
// Specifies the type of key generated.
export function keyType(value) { return new HtmlAttr("keytype", ["keygen"], value); }
// ???
export function itemProp(value) { return new HtmlAttr("itemprop", [], value); }
// Specifies the kind of text track.
export function kind(value) { return new HtmlAttr("kind", ["track"], value); }
// Specifies a user-readable title of the element.
export function label(value) { return new HtmlAttr("label", ["optgroup", "option", "track"], value); }
// Defines the language used in the element.
export function lang(value) { return new HtmlAttr("lang", [], value); }
// Defines the script language used in the element.
export function language(value) { return new HtmlAttr("language", ["script"], value); }
// Identifies a list of pre-defined options to suggest to the user.
export function list(value) { return new HtmlAttr("list", ["input"], value); }
// Indicates whether the media should start playing from the start when it's finished.
export function loop(value) { return new HtmlAttr("loop", ["audio", "bgsound", "marquee", "video"], value); }
// Indicates the upper bound of the lower range.
export function low(value) { return new HtmlAttr("low", ["meter"], value); }
// Indicates the maximum value allowed.
export function max(value) { return new HtmlAttr("max", ["input", "meter", "progress"], value); }
// Defines the maximum number of characters allowed in the element.
export function maxLength(value) { return new HtmlAttr("maxlength", ["input", "textarea"], value); }
// Defines the minimum number of characters allowed in the element.
export function minLength(value) { return new HtmlAttr("minlength", ["input", "textarea"], value); }
// Specifies a hint of the media for which the linked resource was designed.
export function media(value) { return new HtmlAttr("media", ["a", "area", "link", "source", "style"], value); }
// Defines which HTTP method to use when submitting the form. Can be GET (default) or POST.
export function method(value) { return new HtmlAttr("method", ["form"], value); }
// Indicates the minimum value allowed.
export function min(value) { return new HtmlAttr("min", ["input", "meter"], value); }
// Indicates whether multiple values can be entered in an input of the type email or file.
export function multiple(value) { return new HtmlAttr("multiple", ["input", "select"], value); }
// Indicates whether the audio will be initially silenced on page load.
export function muted(value) { return new HtmlAttr("muted", ["audio", "video"], value); }
// Name of the element. For example used by the server to identify the fields in form submits.
export function name(value) { return new HtmlAttr("name", ["button", "form", "fieldset", "iframe", "input", "keygen", "object", "output", "select", "textarea", "map", "meta", "param"], value); }
// This attribute indicates that the form shouldn't be validated when submitted.
export function noValidate(value) { return new HtmlAttr("novalidate", ["form"], value); }
// Indicates whether the details will be shown on page load.
export function open(value) { return new HtmlAttr("open", ["details"], value); }
// Indicates the optimal numeric value.
export function optimum(value) { return new HtmlAttr("optimum", ["meter"], value); }
// Defines a regular expression which the element's value will be validated against.
export function pattern(value) { return new HtmlAttr("pattern", ["input"], value); }
// The ping attribute specifies a space-separated list of URLs to be notified if a user follows the hyperlink.
export function ping(value) { return new HtmlAttr("ping", ["a", "area"], value); }
// Provides a hint to the user of what can be entered in the field.
export function placeHolder(value) { return new HtmlAttr("placeholder", ["input", "textarea"], value); }
// A URL indicating a poster frame to show until the user plays or seeks.
export function poster(value) { return new HtmlAttr("poster", ["video"], value); }
// Indicates whether the whole resource, parts of it or nothing should be preloaded.
export function preload(value) { return new HtmlAttr("preload", ["audio", "video"], value); }
// Indicates whether the element can be edited.
export function readOnly(value) { return new HtmlAttr("readonly", ["input", "textarea"], value); }
// ???
export function radioGroup(value) { return new HtmlAttr("radiogroup", ["command"], value); }
// Specifies which referrer is sent when fetching the resource.
export function referrerPolicy(value) { return new HtmlAttr("referrerpolicy", ["a", "area", "iframe", "img", "link", "script"], value); }
// Specifies the relationship of the target object to the link object.
export function rel(value) { return new HtmlAttr("rel", ["a", "area", "link"], value); }
// Indicates whether this element is required to fill out or not.
export function required(value) { return new HtmlAttr("required", ["input", "select", "textarea"], value); }
// Indicates whether the list should be displayed in a descending order instead of a ascending.
export function reversed(value) { return new HtmlAttr("reversed", ["ol"], value); }
// Defines the number of rows in a text area.
export function role(value) { return new HtmlAttr("role", [], value); }
export function rows(value) { return new HtmlAttr("rows", ["textarea"], value); }
// Defines the number of rows a table cell should span over.
export function rowSpan(value) { return new HtmlAttr("rowspan", ["td", "th"], value); }
// Stops a document loaded in an iframe from using certain features (such as submitting forms or opening new windows).
export function sandbox(value) { return new HtmlAttr("sandbox", ["iframe"], value); }
// Defines the cells that the header test (defined in the th element) relates to.
export function scope(value) { return new HtmlAttr("scope", ["th"], value); }
// ???
export function scoped(value) { return new HtmlAttr("scoped", ["style"], value); }
// Defines a value which will be selected on page load.
export function selected(value) { return new HtmlAttr("selected", ["option"], value); }
// ???
export function shape(value) { return new HtmlAttr("shape", ["a", "area"], value); }
// Defines the width of the element (in pixels). If the element's type attribute is text or password then it's the number of characters.
export function size(value) { return new HtmlAttr("size", ["input", "select"], value); }
// Assigns a slot in a shadow DOM shadow tree to an element.
export function slot(value) { return new HtmlAttr("slot", [], value); }
// ???
export function sizes(value) { return new HtmlAttr("sizes", ["link", "img", "source"], value); }
// ???
export function span(value) { return new HtmlAttr("span", ["col", "colgroup"], value); }
// Indicates whether spell checking is allowed for the element.
export function spellCheck(value) { return new HtmlAttr("spellcheck", [], value); }
// The URL of the embeddable content.
export function src(value) { return new HtmlAttr("src", ["audio", "embed", "iframe", "img", "input", "script", "source", "track", "video"], value); }
// ???
export function srcDoc(value) { return new HtmlAttr("srcdoc", ["iframe"], value); }
// ???
export function srcLang(value) { return new HtmlAttr("srclang", ["track"], value); }
// A MediaStream object to use as a source for an HTML video or audio element
export function srcObject(value) { return new HtmlAttr("srcObject", ["audio", "video"], value); }
// One or more responsive image candidates.
export function srcSet(value) { return new HtmlAttr("srcset", ["img", "source"], value); }
// Defines the first number if other than 1.
export function start(value) { return new HtmlAttr("start", ["ol"], value); }
// Defines CSS styles which will override styles previously set.
export function style(value) { return new HtmlAttr("style", [], value); }
// ???
export function step(value) { return new HtmlAttr("step", ["input"], value); }
// ???
export function summary(value) { return new HtmlAttr("summary", ["table"], value); }
// Overrides the browser's default tab order and follows the one specified instead.
export function tabIndex(value) { return new HtmlAttr("tabindex", [], value); }
// Text to be displayed in a tooltip when hovering over the element.
export function title(value) { return new HtmlAttr("title", [], value); }
// ???
export function target(value) { return new HtmlAttr("target", ["a", "area", "base", "form"], value); }
// Specify whether an element’s attribute values and the values of its Text node children are to be translated when the page is localized, or whether to leave them unchanged.
export function translate(value) { return new HtmlAttr("translate", [], value); }
// Defines the type of the element.
export function type(value) { return new HtmlAttr("type", ["button", "input", "command", "embed", "object", "script", "source", "style", "menu"], value); }
// Defines a default value which will be displayed in the element on page load.
export function value(value) { return new HtmlAttr("value", ["button", "data", "input", "li", "meter", "option", "progress", "param"], value); }
// ???
export function useMap(value) { return new HtmlAttr("usemap", ["img", "input", "object"], value); }
// For the elements listed here, this establishes the element's width.
export function width(value) { return new HtmlAttr("width", ["canvas", "embed", "iframe", "img", "input", "object", "video"], value); }
// Indicates whether the text should be wrapped.
export function wrap(value) { return new HtmlAttr("wrap", ["textarea"], value); }

// A selection of fonts for preferred monospace rendering.
export const monospaceFamily = "'Droid Sans Mono', 'Consolas', 'Lucida Console', 'Courier New', 'Courier', monospace";
export const monospaceFont = style({ fontFamily: monospaceFamily });

// A selection of fonts that should match whatever the user's operating system normally uses.
export const systemFamily = "-apple-system, '.SFNSText-Regular', 'San Francisco', 'Roboto', 'Segoe UI', 'Helvetica Neue', 'Lucida Grande', sans-serif";
export const systemFont = style({ fontFamily: systemFamily });



/**
 * 
 * @param {number} x
 */
export function col(x, w) {
    if (w === undefined) {
        w = 1;
    }

    return style({
        gridColumnStart: x,
        gridColumnEnd: x + w
    });
}

/**
 * 
 * @param {number} y
 */
export function row(y, h) {
    if (h === undefined) {
        h = 1;
    }

    return style({
        gridRowStart: y,
        gridRowEnd: y + h
    });
}

/**
 * 
 * @param {number} x
 * @param {number} y
 */
export function grid(x, y, w, h) {
    if (w === undefined) {
        w = 1;
    }

    if (h === undefined) {
        h = 1;
    }

    return style({
        gridRowStart: y,
        gridRowEnd: y + h,
        gridColumnStart: x,
        gridColumnEnd: x + w
    });
}