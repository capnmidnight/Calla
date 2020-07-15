/**
 * A setter functor for HTML attributes.
 **/
export class HtmlAttr {
    /**
     * Creates a new setter functor for HTML Attributes
     * @param {string} key - the attribute name.
     * @param {any} value - the value to set for the attribute.
     * @param {...string} tags - the HTML tags that support this attribute.
     */
    constructor(key, value, ...tags) {
        this.key = key;
        this.value = value;
        this.tags = tags.map(t => t.toLocaleUpperCase());
        Object.freeze(this);
    }

    /**
     * Set the attribute value on an HTMLElement
     * @param {HTMLElement} elem - the element on which to set the attribute.
     */
    apply(elem) {
        const isValid = this.tags.length === 0
            || this.tags.indexOf(elem.tagName) > -1;

        if (!isValid) {
            console.warn(`Element ${elem.tagName} does not support Attribute ${this.key}`);
        }
        else if (this.key === "style") {
            Object.assign(elem[this.key], this.value);
        }
        else if (!(typeof value === "boolean" || value instanceof Boolean)
            || this.key === "muted") {
            elem[this.key] = this.value;
        }
        else if (this.value) {
            elem.setAttribute(this.key, "");
        }
        else {
            elem.removeAttribute(this.key);
        }
    }
}

/**
 * The accept attribute, a ist of types the server accepts, typically a file type.
 * @param {any} value - the value to set on the attribute.
 **/
export function accept(value) { return new HtmlAttr("accept", value, "form", "input"); }

/**
 * The accessKey attribute
 * @param {any} value - the value to set on the attribute.
 **/
export function accessKey(value) { return new HtmlAttr("accessKey", value, "input", "button"); }

/**
 * The align attribute, specifying the horizontal alignment of the element.
 * @param {any} value - the value to set on the attribute.
 **/
export function align(value) { return new HtmlAttr("align", value, "applet", "caption", "col", "colgroup", "hr", "iframe", "img", "table", "tbody", "td", "tfoot", "th", "thead", "tr"); }

/**
 * The allow attribute, Specifies a feature-policy for the iframe.
 * @param {any} value - the value to set on the attribute.
 **/
export function allow(value) { return new HtmlAttr("allow", value, "iframe"); }

/**
 * The alt attribute, Alternative text in case an image can't be displayed.
 * @param {any} value - the value to set on the attribute.
 **/
export function alt(value) { return new HtmlAttr("alt", value, "applet", "area", "img", "input"); }

/**
 * The ariaActiveDescendant attribute
 * @param {any} value - the value to set on the attribute.
 **/
export function ariaActiveDescendant(value) { return new HtmlAttr("ariaActiveDescendant", value); }

/**
 * The ariaAtomic attribute
 * @param {any} value - the value to set on the attribute.
 **/
export function ariaAtomic(value) { return new HtmlAttr("ariaAtomic", value); }

/**
 * The ariaAutoComplete attribute
 * @param {any} value - the value to set on the attribute.
 **/
export function ariaAutoComplete(value) { return new HtmlAttr("ariaAutoComplete", value); }

/**
 * The ariaBusy attribute
 * @param {any} value - the value to set on the attribute.
 **/
export function ariaBusy(value) { return new HtmlAttr("ariaBusy", value); }

/**
 * The ariaChecked attribute
 * @param {any} value - the value to set on the attribute.
 **/
export function ariaChecked(value) { return new HtmlAttr("ariaChecked", value); }

/**
 * The ariaControls attribute
 * @param {any} value - the value to set on the attribute.
 **/
export function ariaControls(value) { return new HtmlAttr("ariaControls", value); }

/**
 * The ariaDescribedBy attribute
 * @param {any} value - the value to set on the attribute.
 **/
export function ariaDescribedBy(value) { return new HtmlAttr("ariaDescribedBy", value); }

/**
 * The ariaDisabled attribute
 * @param {any} value - the value to set on the attribute.
 **/
export function ariaDisabled(value) { return new HtmlAttr("ariaDisabled", value); }

/**
 * The ariaDropEffect attribute
 * @param {any} value - the value to set on the attribute.
 **/
export function ariaDropEffect(value) { return new HtmlAttr("ariaDropEffect", value); }

/**
 * The ariaExpanded attribute
 * @param {any} value - the value to set on the attribute.
 **/
export function ariaExpanded(value) { return new HtmlAttr("ariaExpanded", value); }

/**
 * The ariaFlowTo attribute
 * @param {any} value - the value to set on the attribute.
 **/
export function ariaFlowTo(value) { return new HtmlAttr("ariaFlowTo", value); }

/**
 * The ariaGrabbed attribute
 * @param {any} value - the value to set on the attribute.
 **/
export function ariaGrabbed(value) { return new HtmlAttr("ariaGrabbed", value); }

/**
 * The ariaHasPopup attribute
 * @param {any} value - the value to set on the attribute.
 **/
export function ariaHasPopup(value) { return new HtmlAttr("ariaHasPopup", value); }

/**
 * The ariaHidden attribute
 * @param {any} value - the value to set on the attribute.
 **/
export function ariaHidden(value) { return new HtmlAttr("ariaHidden", value); }

/**
 * The ariaInvalid attribute
 * @param {any} value - the value to set on the attribute.
 **/
export function ariaInvalid(value) { return new HtmlAttr("ariaInvalid", value); }

/**
 * The ariaLabel attribute
 * @param {any} value - the value to set on the attribute.
 **/
export function ariaLabel(value) { return new HtmlAttr("ariaLabel", value); }

/**
 * The ariaLabelledBy attribute
 * @param {any} value - the value to set on the attribute.
 **/
export function ariaLabelledBy(value) { return new HtmlAttr("ariaLabelledBy", value); }

/**
 * The ariaLevel attribute
 * @param {any} value - the value to set on the attribute.
 **/
export function ariaLevel(value) { return new HtmlAttr("ariaLevel", value); }

/**
 * The ariaLive attribute
 * @param {any} value - the value to set on the attribute.
 **/
export function ariaLive(value) { return new HtmlAttr("ariaLive", value); }

/**
 * The ariaMultiline attribute
 * @param {any} value - the value to set on the attribute.
 **/
export function ariaMultiline(value) { return new HtmlAttr("ariaMultiline", value); }

/**
 * The ariaMultiSelectable attribute
 * @param {any} value - the value to set on the attribute.
 **/
export function ariaMultiSelectable(value) { return new HtmlAttr("ariaMultiSelectable", value); }

/**
 * The ariaOwns attribute
 * @param {any} value - the value to set on the attribute.
 **/
export function ariaOwns(value) { return new HtmlAttr("ariaOwns", value); }

/**
 * The ariaPosInSet attribute
 * @param {any} value - the value to set on the attribute.
 **/
export function ariaPosInSet(value) { return new HtmlAttr("ariaPosInSet", value); }

/**
 * The ariaPressed attribute
 * @param {any} value - the value to set on the attribute.
 **/
export function ariaPressed(value) { return new HtmlAttr("ariaPressed", value); }

/**
 * The ariaReadOnly attribute
 * @param {any} value - the value to set on the attribute.
 **/
export function ariaReadOnly(value) { return new HtmlAttr("ariaReadOnly", value); }

/**
 * The ariaRelevant attribute
 * @param {any} value - the value to set on the attribute.
 **/
export function ariaRelevant(value) { return new HtmlAttr("ariaRelevant", value); }

/**
 * The ariaRequired attribute
 * @param {any} value - the value to set on the attribute.
 **/
export function ariaRequired(value) { return new HtmlAttr("ariaRequired", value); }

/**
 * The ariaSelected attribute
 * @param {any} value - the value to set on the attribute.
 **/
export function ariaSelected(value) { return new HtmlAttr("ariaSelected", value); }

/**
 * The ariaSetsize attribute
 * @param {any} value - the value to set on the attribute.
 **/
export function ariaSetSize(value) { return new HtmlAttr("ariaSetsize", value); }

/**
 * The ariaSort attribute
 * @param {any} value - the value to set on the attribute.
 **/
export function ariaSort(value) { return new HtmlAttr("ariaSort", value); }

/**
 * The ariaValueMax attribute
 * @param {any} value - the value to set on the attribute.
 **/
export function ariaValueMax(value) { return new HtmlAttr("ariaValueMax", value); }

/**
 * The ariaValueMin attribute
 * @param {any} value - the value to set on the attribute.
 **/
export function ariaValueMin(value) { return new HtmlAttr("ariaValueMin", value); }

/**
 * The ariaValueNow attribute
 * @param {any} value - the value to set on the attribute.
 **/
export function ariaValueNow(value) { return new HtmlAttr("ariaValueNow", value); }

/**
 * The ariaValueText attribute
 * @param {any} value - the value to set on the attribute.
 **/
export function ariaValueText(value) { return new HtmlAttr("ariaValueText", value); }

/**
 * The async attribute, Executes the script asynchronously.
 * @param {any} value - the value to set on the attribute.
 **/
export function async(value) { return new HtmlAttr("async", value, "script"); }

/**
 * The autocapitalize attribute, Sets whether input is automatically capitalized when entered by user
 * @param {any} value - the value to set on the attribute.
 **/
export function autoCapitalize(value) { return new HtmlAttr("autocapitalize", value); }

/**
 * The autocomplete attribute, Indicates whether controls in this form can by default have their values automatically completed by the browser.
 * @param {any} value - the value to set on the attribute.
 **/
export function autoComplete(value) { return new HtmlAttr("autocomplete", value, "form", "input", "select", "textarea"); }

/**
 * The autofocus attribute, The element should be automatically focused after the page loaded.
 * @param {any} value - the value to set on the attribute.
 **/
export function autoFocus(value) { return new HtmlAttr("autofocus", value, "button", "input", "keygen", "select", "textarea"); }

/**
 * The autoplay attribute, The audio or video should play as soon as possible.
 * @param {any} value - the value to set on the attribute.
 **/
export function autoPlay(value) { return new HtmlAttr("autoplay", value, "audio", "video"); }

/**
 * The buffered attribute, Contains the time range of already buffered media.
 * @param {any} value - the value to set on the attribute.
 **/
export function buffered(value) { return new HtmlAttr("buffered", value, "audio", "video"); }

/**
 * The capture attribute, From the HTML Media Capture
 * @param {any} value - the value to set on the attribute.
 **/
export function capture(value) { return new HtmlAttr("capture", value, "input"); }

/**
 * The charset attribute, Declares the character encoding of the page or script.
 * @param {any} value - the value to set on the attribute.
 **/
export function charSet(value) { return new HtmlAttr("charset", value, "meta", "script"); }

/**
 * The checked attribute, Indicates whether the element should be checked on page load.
 * @param {any} value - the value to set on the attribute.
 **/
export function checked(value) { return new HtmlAttr("checked", value, "command", "input"); }

/**
 * The cite attribute, Contains a URI which points to the source of the quote or change.
 * @param {any} value - the value to set on the attribute.
 **/
export function cite(value) { return new HtmlAttr("cite", value, "blockquote", "del", "ins", "q"); }

/**
 * The className attribute, Often used with CSS to style elements with common properties.
 * @param {any} value - the value to set on the attribute.
 **/
export function className(value) { return new HtmlAttr("className", value); }

/**
 * The code attribute, Specifies the URL of the applet's class file to be loaded and executed.
 * @param {any} value - the value to set on the attribute.
 **/
export function code(value) { return new HtmlAttr("code", value, "applet"); }

/**
 * The codebase attribute, This attribute gives the absolute or relative URL of the directory where applets' .class files referenced by the code attribute are stored.
 * @param {any} value - the value to set on the attribute.
 **/
export function codeBase(value) { return new HtmlAttr("codebase", value, "applet"); }

/**
 * The cols attribute, Defines the number of columns in a textarea.
 * @param {any} value - the value to set on the attribute.
 **/
export function cols(value) { return new HtmlAttr("cols", value, "textarea"); }

/**
 * The colspan attribute, The colspan attribute defines the number of columns a cell should span.
 * @param {any} value - the value to set on the attribute.
 **/
export function colSpan(value) { return new HtmlAttr("colspan", value, "td", "th"); }

/**
 * The content attribute, A value associated with http-equiv or name depending on the context.
 * @param {any} value - the value to set on the attribute.
 **/
export function content(value) { return new HtmlAttr("content", value, "meta"); }

/**
 * The contenteditable attribute, Indicates whether the element's content is editable.
 * @param {any} value - the value to set on the attribute.
 **/
export function contentEditable(value) { return new HtmlAttr("contenteditable", value); }

/**
 * The contextmenu attribute, Defines the ID of a <menu> element which will serve as the element's context menu.
 * @param {any} value - the value to set on the attribute.
 **/
export function contextMenu(value) { return new HtmlAttr("contextmenu", value); }

/**
 * The controls attribute, Indicates whether the browser should show playback controls to the user.
 * @param {any} value - the value to set on the attribute.
 **/
export function controls(value) { return new HtmlAttr("controls", value, "audio", "video"); }

/**
 * The coords attribute, A set of values specifying the coordinates of the hot-spot region.
 * @param {any} value - the value to set on the attribute.
 **/
export function coords(value) { return new HtmlAttr("coords", value, "area"); }

/**
 * The crossorigin attribute, How the element handles cross-origin requests
 * @param {any} value - the value to set on the attribute.
 **/
export function crossOrigin(value) { return new HtmlAttr("crossorigin", value, "audio", "img", "link", "script", "video"); }

/**
 * The csp attribute, Specifies the Content Security Policy that an embedded document must agree to enforce upon itself.
 * @param {any} value - the value to set on the attribute.
 **/
export function csp(value) { return new HtmlAttr("csp", value, "iframe"); }

/**
 * The data attribute, Specifies the URL of the resource.
 * @param {any} value - the value to set on the attribute.
 **/
export function data(value) { return new HtmlAttr("data", value, "object"); }
// Lets you attach custom attributes to an HTML element.
export function customData(name, value) { return new HtmlAttr("data" + name, [], value); }

/**
 * The datetime attribute, Indicates the date and time associated with the element.
 * @param {any} value - the value to set on the attribute.
 **/
export function dateTime(value) { return new HtmlAttr("datetime", value, "del", "ins", "time"); }

/**
 * The decoding attribute, Indicates the preferred method to decode the image.
 * @param {any} value - the value to set on the attribute.
 **/
export function decoding(value) { return new HtmlAttr("decoding", value, "img"); }

/**
 * The default attribute, Indicates that the track should be enabled unless the user's preferences indicate something different.
 * @param {any} value - the value to set on the attribute.
 **/
export function defaultValue(value) { return new HtmlAttr("default", value, "track"); }

/**
 * The defer attribute, Indicates that the script should be executed after the page has been parsed.
 * @param {any} value - the value to set on the attribute.
 **/
export function defer(value) { return new HtmlAttr("defer", value, "script"); }

/**
 * The dir attribute, Defines the text direction. Allowed values are ltr (Left-To-Right) or rtl (Right-To-Left)
 * @param {any} value - the value to set on the attribute.
 **/
export function dir(value) { return new HtmlAttr("dir", value); }

/**
 * The disabled attribute, Indicates whether the user can interact with the element.
 * @param {any} value - the value to set on the attribute.
 **/
export function disabled(value) { return new HtmlAttr("disabled", value, "button", "command", "fieldset", "input", "keygen", "optgroup", "option", "select", "textarea"); }

/**
 * The dirname attribute, ??? 
 * @param {any} value - the value to set on the attribute.
 **/
export function dirName(value) { return new HtmlAttr("dirname", value, "input", "textarea"); }

/**
 * The download attribute, Indicates that the hyperlink is to be used for downloading a resource.
 * @param {any} value - the value to set on the attribute.
 **/
export function download(value) { return new HtmlAttr("download", value, "a", "area"); }

/**
 * The draggable attribute, Defines whether the element can be dragged.
 * @param {any} value - the value to set on the attribute.
 **/
export function draggable(value) { return new HtmlAttr("draggable", value); }

/**
 * The dropzone attribute, Indicates that the element accepts the dropping of content onto it.
 * @param {any} value - the value to set on the attribute.
 **/
export function dropZone(value) { return new HtmlAttr("dropzone", value); }

/**
 * The enctype attribute, Defines the content type of the form data when the method is POST.
 * @param {any} value - the value to set on the attribute.
 **/
export function encType(value) { return new HtmlAttr("enctype", value, "form"); }

/**
 * The enterkeyhint attribute, The enterkeyhint specifies what action label (or icon) to present for the enter key on virtual keyboards. The attribute can be used with form controls (such as the value of textarea elements), or in elements in an editing host (e.g., using contenteditable attribute).
 * @param {any} value - the value to set on the attribute.
 **/
export function enterKeyHint(value) { return new HtmlAttr("enterkeyhint", value, "textarea"); }

/**
 * The htmlFor attribute, Describes elements which belongs to this one.
 * @param {any} value - the value to set on the attribute.
 **/
export function htmlFor(value) { return new HtmlAttr("htmlFor", value, "label", "output"); }

/**
 * The form attribute, Indicates the form that is the owner of the element.
 * @param {any} value - the value to set on the attribute.
 **/
export function form(value) { return new HtmlAttr("form", value, "button", "fieldset", "input", "keygen", "label", "meter", "object", "output", "progress", "select", "textarea"); }

/**
 * The formaction attribute, Indicates the action of the element, overriding the action defined in the <form>.
 * @param {any} value - the value to set on the attribute.
 **/
export function formAction(value) { return new HtmlAttr("formaction", value, "input", "button"); }

/**
 * The formenctype attribute, If the button/input is a submit button (type="submit"), this attribute sets the encoding type to use during form submission. If this attribute is specified, it overrides the enctype attribute of the button's form owner.
 * @param {any} value - the value to set on the attribute.
 **/
export function formEncType(value) { return new HtmlAttr("formenctype", value, "button", "input"); }

/**
 * The formmethod attribute, If the button/input is a submit button (type="submit"), this attribute sets the submission method to use during form submission (GET, POST, etc.). If this attribute is specified, it overrides the method attribute of the button's form owner.
 * @param {any} value - the value to set on the attribute.
 **/
export function formMethod(value) { return new HtmlAttr("formmethod", value, "button", "input"); }

/**
 * The formnovalidate attribute, If the button/input is a submit button (type="submit"), this boolean attribute specifies that the form is not to be validated when it is submitted. If this attribute is specified, it overrides the novalidate attribute of the button's form owner.
 * @param {any} value - the value to set on the attribute.
 **/
export function formNoValidate(value) { return new HtmlAttr("formnovalidate", value, "button", "input"); }

/**
 * The formtarget attribute, If the button/input is a submit button (type="submit"), this attribute specifies the browsing context (for example, tab, window, or inline frame) in which to display the response that is received after submitting the form. If this attribute is specified, it overrides the target attribute of the button's form owner.
 * @param {any} value - the value to set on the attribute.
 **/
export function formTarget(value) { return new HtmlAttr("formtarget", value, "button", "input"); }

/**
 * The headers attribute, IDs of the <th> elements which applies to this element.
 * @param {any} value - the value to set on the attribute.
 **/
export function headers(value) { return new HtmlAttr("headers", value, "td", "th"); }

/**
 * The height attribute, Specifies the height of elements listed here. For all other elements, use the CSS height property.
 * @param {any} value - the value to set on the attribute.
 **/
export function height(value) { return new HtmlAttr("height", value, "canvas", "embed", "iframe", "img", "input", "object", "video"); }

/**
 * The hidden attribute, Prevents rendering of given element, while keeping child elements, e.g. script elements, active.
 * @param {any} value - the value to set on the attribute.
 **/
export function hidden(value) { return new HtmlAttr("hidden", value); }

/**
 * The high attribute, Indicates the lower bound of the upper range.
 * @param {any} value - the value to set on the attribute.
 **/
export function high(value) { return new HtmlAttr("high", value, "meter"); }

/**
 * The href attribute, The URL of a linked resource.
 * @param {any} value - the value to set on the attribute.
 **/
export function href(value) { return new HtmlAttr("href", value, "a", "area", "base", "link"); }

/**
 * The hreflang attribute, Specifies the language of the linked resource.
 * @param {any} value - the value to set on the attribute.
 **/
export function hrefLang(value) { return new HtmlAttr("hreflang", value, "a", "area", "link"); }

/**
 * The httpEquiv attribute, Defines a pragma directive.
 * @param {any} value - the value to set on the attribute.
 **/
export function httpEquiv(value) { return new HtmlAttr("httpEquiv", value, "meta"); }

/**
 * The icon attribute, Specifies a picture which represents the command.
 * @param {any} value - the value to set on the attribute.
 **/
export function icon(value) { return new HtmlAttr("icon", value, "command"); }

/**
 * The id attribute, Often used with CSS to style a specific element. The value of this attribute must be unique.
 * @param {any} value - the value to set on the attribute.
 **/
export function id(value) { return new HtmlAttr("id", value); }

/**
 * The importance attribute, Indicates the relative fetch priority for the resource.
 * @param {any} value - the value to set on the attribute.
 **/
export function importance(value) { return new HtmlAttr("importance", value, "iframe", "img", "link", "script"); }

/**
 * The inputmode attribute, Provides a hint as to the type of data that might be entered by the user while editing the element or its contents. The attribute can be used with form controls (such as the value of textarea elements), or in elements in an editing host (e.g., using contenteditable attribute).
 * @param {any} value - the value to set on the attribute.
 **/
export function inputMode(value) { return new HtmlAttr("inputmode", value, "textarea"); }

/**
 * The integrity attribute, Specifies a Subresource Integrity value that allows browsers to verify what they fetch.
 * @param {any} value - the value to set on the attribute.
 **/
export function integrity(value) { return new HtmlAttr("integrity", value, "link", "script"); }

/**
 * The intrinsicsize attribute, This attribute tells the browser to ignore the actual intrinsic size of the image and pretend it’s the size specified in the attribute.
 * @param {any} value - the value to set on the attribute.
 **/
export function intrinsicSize(value) { return new HtmlAttr("intrinsicsize", value, "img"); }

/**
 * The ismap attribute, Indicates that the image is part of a server-side image map.
 * @param {any} value - the value to set on the attribute.
 **/
export function isMap(value) { return new HtmlAttr("ismap", value, "img"); }

/**
 * The keytype attribute, Specifies the type of key generated.
 * @param {any} value - the value to set on the attribute.
 **/
export function keyType(value) { return new HtmlAttr("keytype", value, "keygen"); }

/**
 * The itemprop attribute
 * @param {any} value - the value to set on the attribute.
 **/
export function itemProp(value) { return new HtmlAttr("itemprop", value); }

/**
 * The kind attribute, Specifies the kind of text track.
 * @param {any} value - the value to set on the attribute.
 **/
export function kind(value) { return new HtmlAttr("kind", value, "track"); }

/**
 * The label attribute, Specifies a user-readable title of the element.
 * @param {any} value - the value to set on the attribute.
 **/
export function label(value) { return new HtmlAttr("label", value, "optgroup", "option", "track"); }

/**
 * The lang attribute, Defines the language used in the element.
 * @param {any} value - the value to set on the attribute.
 **/
export function lang(value) { return new HtmlAttr("lang", value); }

/**
 * The language attribute, Defines the script language used in the element.
 * @param {any} value - the value to set on the attribute.
 **/
export function language(value) { return new HtmlAttr("language", value, "script"); }

/**
 * The list attribute, Identifies a list of pre-defined options to suggest to the user.
 * @param {any} value - the value to set on the attribute.
 **/
export function list(value) { return new HtmlAttr("list", value, "input"); }

/**
 * The loop attribute, Indicates whether the media should start playing from the start when it's finished.
 * @param {any} value - the value to set on the attribute.
 **/
export function loop(value) { return new HtmlAttr("loop", value, "audio", "bgsound", "marquee", "video"); }

/**
 * The low attribute, Indicates the upper bound of the lower range.
 * @param {any} value - the value to set on the attribute.
 **/
export function low(value) { return new HtmlAttr("low", value, "meter"); }

/**
 * The max attribute, Indicates the maximum value allowed.
 * @param {any} value - the value to set on the attribute.
 **/
export function max(value) { return new HtmlAttr("max", value, "input", "meter", "progress"); }

/**
 * The maxlength attribute, Defines the maximum number of characters allowed in the element.
 * @param {any} value - the value to set on the attribute.
 **/
export function maxLength(value) { return new HtmlAttr("maxlength", value, "input", "textarea"); }

/**
 * The minlength attribute, Defines the minimum number of characters allowed in the element.
 * @param {any} value - the value to set on the attribute.
 **/
export function minLength(value) { return new HtmlAttr("minlength", value, "input", "textarea"); }

/**
 * The media attribute, Specifies a hint of the media for which the linked resource was designed.
 * @param {any} value - the value to set on the attribute.
 **/
export function media(value) { return new HtmlAttr("media", value, "a", "area", "link", "source", "style"); }

/**
 * The method attribute, Defines which HTTP method to use when submitting the form. Can be GET (default) or POST.
 * @param {any} value - the value to set on the attribute.
 **/
export function method(value) { return new HtmlAttr("method", value, "form"); }

/**
 * The min attribute, Indicates the minimum value allowed.
 * @param {any} value - the value to set on the attribute.
 **/
export function min(value) { return new HtmlAttr("min", value, "input", "meter"); }

/**
 * The multiple attribute, Indicates whether multiple values can be entered in an input of the type email or file.
 * @param {any} value - the value to set on the attribute.
 **/
export function multiple(value) { return new HtmlAttr("multiple", value, "input", "select"); }

/**
 * The muted attribute, Indicates whether the audio will be initially silenced on page load.
 * @param {any} value - the value to set on the attribute.
 **/
export function muted(value) { return new HtmlAttr("muted", value, "audio", "video"); }

/**
 * The name attribute, Name of the element. For example used by the server to identify the fields in form submits.
 * @param {any} value - the value to set on the attribute.
 **/
export function name(value) { return new HtmlAttr("name", value, "button", "form", "fieldset", "iframe", "input", "keygen", "object", "output", "select", "textarea", "map", "meta", "param"); }

/**
 * The novalidate attribute, This attribute indicates that the form shouldn't be validated when submitted.
 * @param {any} value - the value to set on the attribute.
 **/
export function noValidate(value) { return new HtmlAttr("novalidate", value, "form"); }

/**
 * The open attribute, Indicates whether the details will be shown on page load.
 * @param {any} value - the value to set on the attribute.
 **/
export function open(value) { return new HtmlAttr("open", value, "details"); }

/**
 * The optimum attribute, Indicates the optimal numeric value.
 * @param {any} value - the value to set on the attribute.
 **/
export function optimum(value) { return new HtmlAttr("optimum", value, "meter"); }

/**
 * The pattern attribute, Defines a regular expression which the element's value will be validated against.
 * @param {any} value - the value to set on the attribute.
 **/
export function pattern(value) { return new HtmlAttr("pattern", value, "input"); }

/**
 * The ping attribute, The ping attribute specifies a space-separated list of URLs to be notified if a user follows the hyperlink.
 * @param {any} value - the value to set on the attribute.
 **/
export function ping(value) { return new HtmlAttr("ping", value, "a", "area"); }

/**
 * The placeholder attribute, Provides a hint to the user of what can be entered in the field.
 * @param {any} value - the value to set on the attribute.
 **/
export function placeHolder(value) { return new HtmlAttr("placeholder", value, "input", "textarea"); }

/**
 * The poster attribute, A URL indicating a poster frame to show until the user plays or seeks.
 * @param {any} value - the value to set on the attribute.
 **/
export function poster(value) { return new HtmlAttr("poster", value, "video"); }

/**
 * The preload attribute, Indicates whether the whole resource, parts of it or nothing should be preloaded.
 * @param {any} value - the value to set on the attribute.
 **/
export function preload(value) { return new HtmlAttr("preload", value, "audio", "video"); }

/**
 * The readonly attribute, Indicates whether the element can be edited.
 * @param {any} value - the value to set on the attribute.
 **/
export function readOnly(value) { return new HtmlAttr("readonly", value, "input", "textarea"); }

/**
 * The radiogroup attribute
 * @param {any} value - the value to set on the attribute.
 **/
export function radioGroup(value) { return new HtmlAttr("radiogroup", value, "command"); }

/**
 * The referrerpolicy attribute, Specifies which referrer is sent when fetching the resource.
 * @param {any} value - the value to set on the attribute.
 **/
export function referrerPolicy(value) { return new HtmlAttr("referrerpolicy", value, "a", "area", "iframe", "img", "link", "script"); }

/**
 * The rel attribute, Specifies the relationship of the target object to the link object.
 * @param {any} value - the value to set on the attribute.
 **/
export function rel(value) { return new HtmlAttr("rel", value, "a", "area", "link"); }

/**
 * The required attribute, Indicates whether this element is required to fill out or not.
 * @param {any} value - the value to set on the attribute.
 **/
export function required(value) { return new HtmlAttr("required", value, "input", "select", "textarea"); }

/**
 * The reversed attribute, Indicates whether the list should be displayed in a descending order instead of a ascending.
 * @param {any} value - the value to set on the attribute.
 **/
export function reversed(value) { return new HtmlAttr("reversed", value, "ol"); }

/**
 * The role attribute, Defines the number of rows in a text area.
 * @param {any} value - the value to set on the attribute.
 **/
export function role(value) { return new HtmlAttr("role", value); }

/**
 * The rows attribute
 * @param {any} value - the value to set on the attribute.
 **/
export function rows(value) { return new HtmlAttr("rows", value, "textarea"); }

/**
 * The rowspan attribute, Defines the number of rows a table cell should span over.
 * @param {any} value - the value to set on the attribute.
 **/
export function rowSpan(value) { return new HtmlAttr("rowspan", value, "td", "th"); }

/**
 * The sandbox attribute, Stops a document loaded in an iframe from using certain features (such as submitting forms or opening new windows).
 * @param {any} value - the value to set on the attribute.
 **/
export function sandbox(value) { return new HtmlAttr("sandbox", value, "iframe"); }

/**
 * The scope attribute, Defines the cells that the header test (defined in the th element) relates to.
 * @param {any} value - the value to set on the attribute.
 **/
export function scope(value) { return new HtmlAttr("scope", value, "th"); }

/**
 * The scoped attribute
 * @param {any} value - the value to set on the attribute.
 **/
export function scoped(value) { return new HtmlAttr("scoped", value, "style"); }

/**
 * The selected attribute, Defines a value which will be selected on page load.
 * @param {any} value - the value to set on the attribute.
 **/
export function selected(value) { return new HtmlAttr("selected", value, "option"); }

/**
 * The shape attribute
 * @param {any} value - the value to set on the attribute.
 **/
export function shape(value) { return new HtmlAttr("shape", value, "a", "area"); }

/**
 * The size attribute, Defines the width of the element (in pixels). If the element's type attribute is text or password then it's the number of characters.
 * @param {any} value - the value to set on the attribute.
 **/
export function size(value) { return new HtmlAttr("size", value, "input", "select"); }

/**
 * The slot attribute, Assigns a slot in a shadow DOM shadow tree to an element.
 * @param {any} value - the value to set on the attribute.
 **/
export function slot(value) { return new HtmlAttr("slot", value); }

/**
 * The sizes attribute
 * @param {any} value - the value to set on the attribute.
 **/
export function sizes(value) { return new HtmlAttr("sizes", value, "link", "img", "source"); }

/**
 * The span attribute
 * @param {any} value - the value to set on the attribute.
 **/
export function span(value) { return new HtmlAttr("span", value, "col", "colgroup"); }

/**
 * The spellcheck attribute, Indicates whether spell checking is allowed for the element.
 * @param {any} value - the value to set on the attribute.
 **/
export function spellCheck(value) { return new HtmlAttr("spellcheck", value); }

/**
 * The src attribute, The URL of the embeddable content.
 * @param {any} value - the value to set on the attribute.
 **/
export function src(value) { return new HtmlAttr("src", value, "audio", "embed", "iframe", "img", "input", "script", "source", "track", "video"); }

/**
 * The srcdoc attribute
 * @param {any} value - the value to set on the attribute.
 **/
export function srcDoc(value) { return new HtmlAttr("srcdoc", value, "iframe"); }

/**
 * The srclang attribute
 * @param {any} value - the value to set on the attribute.
 **/
export function srcLang(value) { return new HtmlAttr("srclang", value, "track"); }

/**
 * The srcObject attribute, A MediaStream object to use as a source for an HTML video or audio element
 * @param {any} value - the value to set on the attribute.
 **/
export function srcObject(value) { return new HtmlAttr("srcObject", value, "audio", "video"); }

/**
 * The srcset attribute, One or more responsive image candidates.
 * @param {any} value - the value to set on the attribute.
 **/
export function srcSet(value) { return new HtmlAttr("srcset", value, "img", "source"); }

/**
 * The start attribute, Defines the first number if other than 1.
 * @param {any} value - the value to set on the attribute.
 **/
export function start(value) { return new HtmlAttr("start", value, "ol"); }

/**
 * The style attribute, Defines CSS styles which will override styles previously set.
 * @param {any} value - the value to set on the attribute.
 **/
export function style(value) { return new HtmlAttr("style", value); }

/**
 * The step attribute
 * @param {any} value - the value to set on the attribute.
 **/
export function step(value) { return new HtmlAttr("step", value, "input"); }

/**
 * The summary attribute
 * @param {any} value - the value to set on the attribute.
 **/
export function summary(value) { return new HtmlAttr("summary", value, "table"); }

/**
 * The tabindex attribute, Overrides the browser's default tab order and follows the one specified instead.
 * @param {any} value - the value to set on the attribute.
 **/
export function tabIndex(value) { return new HtmlAttr("tabindex", value); }

/**
 * The title attribute, Text to be displayed in a tooltip when hovering over the element.
 * @param {any} value - the value to set on the attribute.
 **/
export function title(value) { return new HtmlAttr("title", value); }

/**
 * The target attribute
 * @param {any} value - the value to set on the attribute.
 **/
export function target(value) { return new HtmlAttr("target", value, "a", "area", "base", "form"); }

/**
 * The translate attribute, Specify whether an element’s attribute values and the values of its Text node children are to be translated when the page is localized, or whether to leave them unchanged.
 * @param {any} value - the value to set on the attribute.
 **/
export function translate(value) { return new HtmlAttr("translate", value); }

/**
 * The type attribute, Defines the type of the element.
 * @param {any} value - the value to set on the attribute.
 **/
export function type(value) { return new HtmlAttr("type", value, "button", "input", "command", "embed", "object", "script", "source", "style", "menu"); }

/**
 * The value attribute, Defines a default value which will be displayed in the element on page load.
 * @param {any} value - the value to set on the attribute.
 **/
export function value(value) { return new HtmlAttr("value", value, "button", "data", "input", "li", "meter", "option", "progress", "param"); }

/**
 * The usemap attribute
 * @param {any} value - the value to set on the attribute.
 **/
export function useMap(value) { return new HtmlAttr("usemap", value, "img", "input", "object"); }

/**
 * The width attribute, For the elements listed here, this establishes the element's width.
 * @param {any} value - the value to set on the attribute.
 **/
export function width(value) { return new HtmlAttr("width", value, "canvas", "embed", "iframe", "img", "input", "object", "video"); }

/**
 * The wrap attribute, Indicates whether the text should be wrapped.
 * @param {any} value - the value to set on the attribute.
 **/
export function wrap(value) { return new HtmlAttr("wrap", value, "textarea"); }

// A selection of fonts for preferred monospace rendering.
export const monospaceFamily = "'Droid Sans Mono', 'Consolas', 'Lucida Console', 'Courier New', 'Courier', monospace";
export const monospaceFont = style({ fontFamily: monospaceFamily });

// A selection of fonts that should match whatever the user's operating system normally uses.
export const systemFamily = "-apple-system, '.SFNSText-Regular', 'San Francisco', 'Roboto', 'Segoe UI', 'Helvetica Neue', 'Lucida Grande', sans-serif";


/**
 * Constructs a CSS grid column definition
 * @param {number} x - the starting horizontal cell for the element.
 * @param {number} [w=null] - the number of cells wide the element should cover.
 */
export function col(x, w = null) {
    if (w === null) {
        w = 1;
    }

    return style({
        gridColumnStart: x,
        gridColumnEnd: x + w
    });
}

/**
 * Constructs a CSS grid row definition
 * @param {number} y - the starting vertical cell for the element.
 * @param {number} [h=null] - the number of cells tall the element should cover.
 */
export function row(y, h = null) {
    if (h === null) {
        h = 1;
    }

    return style({
        gridRowStart: y,
        gridRowEnd: y + h
    });
}

/**
 * Constructs a CSS grid area definition.
 * @param {number} x - the starting horizontal cell for the element.
 * @param {number} y - the starting vertical cell for the element.
 * @param {number} [w=null] - the number of cells wide the element should cover.
 * @param {number} [h=null] - the number of cells tall the element should cover.
 */
export function grid(x, y, w = null, h = null) {
    if (w === null) {
        w = 1;
    }

    if (h === null) {
        h = 1;
    }

    return style({
        gridRowStart: y,
        gridRowEnd: y + h,
        gridColumnStart: x,
        gridColumnEnd: x + w
    });
}