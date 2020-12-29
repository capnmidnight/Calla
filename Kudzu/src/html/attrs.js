import { isBoolean, isHTMLElement } from "../typeChecks";
/**
 * A setter functor for HTML attributes.
 **/
export class Attr {
    /**
     * Creates a new setter functor for HTML Attributes
     * @param key - the attribute name.
     * @param value - the value to set for the attribute.
     * @param tags - the HTML tags that support this attribute.
     */
    constructor(key, value, ...tags) {
        this.key = key;
        this.value = value;
        this.tags = tags.map(t => t.toLocaleUpperCase());
        Object.freeze(this);
    }
    /**
     * Set the attribute value on an HTMLElement
     * @param elem - the element on which to set the attribute.
     */
    apply(elem) {
        if (isHTMLElement(elem)) {
            const isValid = this.tags.length === 0
                || this.tags.indexOf(elem.tagName) > -1;
            if (!isValid) {
                console.warn(`Element ${elem.tagName} does not support Attribute ${this.key}`);
            }
            else if (this.key === "style") {
                Object.assign(elem.style, this.value);
            }
            else if (this.key in elem) {
                elem[this.key] = this.value;
            }
            else if (this.value === false) {
                elem.removeAttribute(this.key);
            }
            else if (this.value === true) {
                elem.setAttribute(this.key, "");
            }
            else {
                elem.setAttribute(this.key, this.value);
            }
        }
        else {
            elem[this.key] = this.value;
        }
    }
}
/**
 * a list of types the server accepts, typically a file type.
 * @param value - the value to set on the attribute.
 **/
export function accept(value) { return new Attr("accept", value, "form", "input"); }
/**
 * The accessKey attribute
 **/
export function accessKey(value) { return new Attr("accessKey", value, "input", "button"); }
/**
 * specifying the horizontal alignment of the element.
 **/
export function align(value) { return new Attr("align", value, "applet", "caption", "col", "colgroup", "hr", "iframe", "img", "table", "tbody", "td", "tfoot", "th", "thead", "tr"); }
/**
 * Specifies a feature-policy for the iframe.
 **/
export function allow(value) { return new Attr("allow", value, "iframe"); }
/**
 * Alternative text in case an image can't be displayed.
 **/
export function alt(value) { return new Attr("alt", value, "applet", "area", "img", "input"); }
/**
 * Identifies the currently active element when DOM focus is on a composite widget, textbox, group, or application.
 **/
export function ariaActiveDescendant(value) { return new Attr("ariaActiveDescendant", value); }
/**
 * Indicates whether assistive technologies will present all, or only parts of, the changed region based on the change notifications defined by the aria-relevant attribute.
 **/
export function ariaAtomic(value) { return new Attr("ariaAtomic", value); }
/**
 * Indicates whether inputting text could trigger display of one or more predictions of the user's intended value for an input and specifies how predictions would be presented if they are made.
 **/
export function ariaAutoComplete(value) { return new Attr("ariaAutoComplete", value); }
/**
 * Indicates an element is being modified and that assistive technologies MAY want to wait until the modifications are complete before exposing them to the user.
 **/
export function ariaBusy(value) { return new Attr("ariaBusy", value); }
/**
 * Indicates the current "checked" state of checkboxes, radio buttons, and other widgets. See related aria-pressed and aria-selected.
 **/
export function ariaChecked(value) { return new Attr("ariaChecked", value); }
/**
 * Defines the total number of columns in a table, grid, or treegrid. See related aria-colindex.
  **/
export function ariaColCount(value) { return new Attr("ariaColCount", value); }
/**
 * Defines an element's column index or position with respect to the total number of columns within a table, grid, or treegrid. See related aria-colcount and aria-colspan.
  **/
export function ariaColIndex(value) { return new Attr("ariaColIndex", value); }
/**
 * Defines the number of columns spanned by a cell or gridcell within a table, grid, or treegrid. See related aria-colindex and aria-rowspan.
  **/
export function ariaColSpan(value) { return new Attr("ariaColSpan", value); }
/**
 * Identifies the element (or elements) whose contents or presence are controlled by the current element. See related aria-owns.
  **/
export function ariaControls(value) { return new Attr("ariaControls", value); }
/**
 * Indicates the element that represents the current item within a container or set of related elements.
  **/
export function ariaCurrent(value) { return new Attr("ariaCurrent", value); }
/**
 * Identifies the element (or elements) that describes the object. See related aria-labelledby.
  **/
export function ariaDescribedBy(value) { return new Attr("ariaDescribedBy", value); }
/**
 * Identifies the element that provides a detailed, extended description for the object. See related aria-describedby.
  **/
export function ariaDetails(value) { return new Attr("ariaDetails", value); }
/**
 * Indicates that the element is perceivable but disabled, so it is not editable or otherwise operable. See related aria-hidden and aria-readonly.
  **/
export function ariaDisabled(value) { return new Attr("ariaDisabled", value); }
/**
 * Identifies the element that provides an error message for the object. See related aria-invalid and aria-describedby.
  **/
export function ariaErrorMessage(value) { return new Attr("ariaErrorMessage", value); }
/**
 * Indicates whether the element, or another grouping element it controls, is currently expanded or collapsed.
 **/
export function ariaExpanded(value) { return new Attr("ariaExpanded", value); }
/**
 * Identifies the next element (or elements) in an alternate reading order of content which, at the user's discretion, allows assistive technology to override the general default of reading in document source order.
  **/
export function ariaFlowTo(value) { return new Attr("ariaFlowTo", value); }
/**
 * Indicates the availability and type of interactive popup element, such as menu or dialog, that can be triggered by an element.
  **/
export function ariaHasPopup(value) { return new Attr("ariaHasPopup", value); }
/**
 * Indicates whether the element is exposed to an accessibility API. See related aria-disabled.
 **/
export function ariaHidden(value) { return new Attr("ariaHidden", value); }
/**
 * Indicates the entered value does not conform to the format expected by the application. See related aria-errormessage.
  **/
export function ariaInvalid(value) { return new Attr("ariaInvalid", value); }
/**
 * Indicates keyboard shortcuts that an author has implemented to activate or give focus to an element.
  **/
export function ariaKeyShortcuts(value) { return new Attr("ariaKeyShortcuts", value); }
/**
 * Defines a string value that labels the current element. See related aria-labelledby.
  **/
export function ariaLabel(value) { return new Attr("ariaLabel", value); }
/**
 * Identifies the element (or elements) that labels the current element. See related aria-describedby.
  **/
export function ariaLabelledBy(value) { return new Attr("ariaLabelledBy", value); }
/**
 * Defines the hierarchical level of an element within a structure.
  **/
export function ariaLevel(value) { return new Attr("ariaLevel", value); }
/**
 * Indicates that an element will be updated, and describes the types of updates the user agents, assistive technologies, and user can expect from the live region.
  **/
export function ariaLive(value) { return new Attr("ariaLive", value); }
/**
 * Indicates whether an element is modal when displayed
  **/
export function ariaModal(value) { return new Attr("ariaModal", value); }
/**
 * Indicates whether a text box accepts multiple lines of input or only a single line.
  **/
export function ariaMultiline(value) { return new Attr("ariaMultiline", value); }
/**
 * Indicates that the user may select more than one item from the current selectable descendants.
  **/
export function ariaMultiSelectable(value) { return new Attr("ariaMultiSelectable", value); }
/**
 * Indicates that the user may select more than one item from the current selectable descendants.
  **/
export function ariaOrientation(value) { return new Attr("ariaOrientation", value); }
/**
 * Identifies an element (or elements) in order to define a visual, functional, or contextual parent/child relationship between DOM elements where the DOM hierarchy cannot be used to represent the relationship. See related aria-controls.
  **/
export function ariaOwns(value) { return new Attr("ariaOwns", value); }
/**
 * Defines a short hint (a word or short phrase) intended to aid the user with data entry when the control has no value. A hint could be a sample value or a brief description of the expected format.
  **/
export function ariaPlaceholder(value) { return new Attr("ariaPlaceholder", value); }
/**
 * Defines an element's number or position in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM. See related aria-setsize.
  **/
export function ariaPosInSet(value) { return new Attr("ariaPosInSet", value); }
/**
 * Indicates the current "pressed" state of toggle buttons. See related aria-checked and aria-selected.
 **/
export function ariaPressed(value) { return new Attr("ariaPressed", value); }
/**
 * Indicates that the element is not editable, but is otherwise operable. See related aria-disabled.
  **/
export function ariaReadOnly(value) { return new Attr("ariaReadOnly", value); }
/**
 * Indicates what notifications the user agent will trigger when the accessibility tree within a live region is modified. See related aria-atomic.
  **/
export function ariaRelevant(value) { return new Attr("ariaRelevant", value); }
/**
 * Indicates that user input is required on the element before a form may be submitted.
  **/
export function ariaRequired(value) { return new Attr("ariaRequired", value); }
/**
 * Defines a human-readable, author-localized description for the role of an element.
  **/
export function ariaRoleDescription(value) { return new Attr("ariaRoleDescription", value); }
/**
 * Defines the total number of rows in a table, grid, or treegrid. See related aria-rowindex.
  **/
export function ariaRowCount(value) { return new Attr("ariaRowCount", value); }
/**
 * Defines an element's row index or position with respect to the total number of rows within a table, grid, or treegrid. See related aria-rowcount and aria-rowspan.
  **/
export function ariaRowIndex(value) { return new Attr("ariaRowIndex", value); }
/**
 Defines the number of rows spanned by a cell or gridcell within a table, grid, or treegrid. See related aria-rowindex and aria-colspan.
  **/
export function ariaRowSpan(value) { return new Attr("ariaRowSpan", value); }
/**
 * Indicates the current "selected" state of various widgets. See related aria-checked and aria-pressed.
 **/
export function ariaSelected(value) { return new Attr("ariaSelected", value); }
/**
 * Defines the number of items in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM. See related aria-posinset.
  **/
export function ariaSetSize(value) { return new Attr("ariaSetsize", value); }
/**
 * Indicates if items in a table or grid are sorted in ascending or descending order.
  **/
export function ariaSort(value) { return new Attr("ariaSort", value); }
/**
 * Defines the maximum allowed value for a range widget.
  **/
export function ariaValueMax(value) { return new Attr("ariaValueMax", value); }
/**
 * Defines the minimum allowed value for a range widget.
  **/
export function ariaValueMin(value) { return new Attr("ariaValueMin", value); }
/**
 * Defines the current value for a range widget. See related aria-valuetext.
  **/
export function ariaValueNow(value) { return new Attr("ariaValueNow", value); }
/**
 * Defines the human readable text alternative of aria-valuenow for a range widget.
  **/
export function ariaValueText(value) { return new Attr("ariaValueText", value); }
/**
 * Executes the script asynchronously.
  **/
export function async(value) { return new Attr("async", value, "script"); }
/**
 * Sets whether input is automatically capitalized when entered by user
  **/
export function autoCapitalize(value) { return new Attr("autocapitalize", value); }
/**
 * Indicates whether controls in this form can by default have their values automatically completed by the browser.
  **/
export function autoComplete(value) { return new Attr("autocomplete", value, "form", "input", "select", "textarea"); }
/**
 * The element should be automatically focused after the page loaded.
  **/
export function autoFocus(value) { return new Attr("autofocus", value, "button", "input", "keygen", "select", "textarea"); }
/**
 * The audio or video should play as soon as possible.
  **/
export function autoPlay(value) { return new Attr("autoplay", value, "audio", "video"); }
/**
 * Contains the time range of already buffered media.
  **/
export function buffered(value) { return new Attr("buffered", value, "audio", "video"); }
/**
 * From the HTML Media Capture
  **/
export function capture(value) { return new Attr("capture", value, "input"); }
/**
 * Declares the character encoding of the page or script.
  **/
export function charSet(value) { return new Attr("charset", value, "meta", "script"); }
/**
 * Indicates whether the element should be checked on page load.
  **/
export function checked(value) { return new Attr("checked", value, "command", "input"); }
/**
 * Contains a URI which points to the source of the quote or change.
  **/
export function cite(value) { return new Attr("cite", value, "blockquote", "del", "ins", "q"); }
/**
 * Often used with CSS to style elements with common properties.
  **/
export function className(value) { return new Attr("className", value); }
/**
 * Specifies the URL of the applet's class file to be loaded and executed.
  **/
export function code(value) { return new Attr("code", value, "applet"); }
/**
 * This attribute gives the absolute or relative URL of the directory where applets' .class files referenced by the code attribute are stored.
  **/
export function codeBase(value) { return new Attr("codebase", value, "applet"); }
/**
 * Defines the number of columns in a textarea.
  **/
export function cols(value) { return new Attr("cols", value, "textarea"); }
/**
 * The colspan attribute defines the number of columns a cell should span.
  **/
export function colSpan(value) { return new Attr("colspan", value, "td", "th"); }
/**
 * A value associated with http-equiv or name depending on the context.
  **/
export function content(value) { return new Attr("content", value, "meta"); }
/**
 * Indicates whether the element's content is editable.
  **/
export function contentEditable(value) { return new Attr("contenteditable", value); }
/**
 * Defines the ID of a <menu> element which will serve as the element's context menu.
  **/
export function contextMenu(value) { return new Attr("contextmenu", value); }
/**
 * Indicates whether the browser should show playback controls to the user.
  **/
export function controls(value) { return new Attr("controls", value, "audio", "video"); }
/**
 * A set of values specifying the coordinates of the hot-spot region.
  **/
export function coords(value) { return new Attr("coords", value, "area"); }
/**
 * How the element handles cross-origin requests
  **/
export function crossOrigin(value) { return new Attr("crossorigin", value, "audio", "img", "link", "script", "video"); }
/**
 * Specifies the Content Security Policy that an embedded document must agree to enforce upon itself.
  **/
export function csp(value) { return new Attr("csp", value, "iframe"); }
/**
 * Specifies the URL of the resource.
  **/
export function data(value) { return new Attr("data", value, "object"); }
/**
 * Lets you attach custom attributes to an HTML element.
 */
export function customData(name, value) { return new Attr("data" + name, [], value); }
/**
 * Indicates the date and time associated with the element.
  **/
export function dateTime(value) { return new Attr("datetime", value, "del", "ins", "time"); }
/**
 * Indicates the preferred method to decode the image.
  **/
export function decoding(value) { return new Attr("decoding", value, "img"); }
/**
 * Indicates that the track should be enabled unless the user's preferences indicate something different.
  **/
export function defaultValue(value) { return new Attr("default", value, "track"); }
/**
 * Indicates that the script should be executed after the page has been parsed.
  **/
export function defer(value) { return new Attr("defer", value, "script"); }
/**
 * Defines the text direction. Allowed values are ltr (Left-To-Right) or rtl (Right-To-Left)
  **/
export function dir(value) { return new Attr("dir", value); }
/**
 * Indicates whether the user can interact with the element.
  **/
export function disabled(value) { return new Attr("disabled", value, "button", "command", "fieldset", "input", "keygen", "optgroup", "option", "select", "textarea"); }
/**
 * ???
  **/
export function dirName(value) { return new Attr("dirname", value, "input", "textarea"); }
/**
 * Indicates that the hyperlink is to be used for downloading a resource.
  **/
export function download(value) { return new Attr("download", value, "a", "area"); }
/**
 * Defines whether the element can be dragged.
  **/
export function draggable(value) { return new Attr("draggable", value); }
/**
 * Indicates that the element accepts the dropping of content onto it.
  **/
export function dropZone(value) { return new Attr("dropzone", value); }
/**
 * Defines the content type of the form data when the method is POST.
  **/
export function encType(value) { return new Attr("enctype", value, "form"); }
/**
 * The enterkeyhint specifies what action label (or icon) to present for the enter key on virtual keyboards. The attribute can be used with form controls (such as the value of textarea elements), or in elements in an editing host (e.g., using contenteditable attribute).
  **/
export function enterKeyHint(value) { return new Attr("enterkeyhint", value, "textarea"); }
/**
 * Describes elements which belongs to this one.
  **/
export function htmlFor(value) { return new Attr("htmlFor", value, "label", "output"); }
/**
 * Indicates the form that is the owner of the element.
  **/
export function form(value) { return new Attr("form", value, "button", "fieldset", "input", "keygen", "label", "meter", "object", "output", "progress", "select", "textarea"); }
/**
 * Indicates the action of the element, overriding the action defined in the <form>.
  **/
export function formAction(value) { return new Attr("formaction", value, "input", "button"); }
/**
 * If the button/input is a submit button (type="submit"), this attribute sets the encoding type to use during form submission. If this attribute is specified, it overrides the enctype attribute of the button's form owner.
  **/
export function formEncType(value) { return new Attr("formenctype", value, "button", "input"); }
/**
 * If the button/input is a submit button (type="submit"), this attribute sets the submission method to use during form submission (GET, POST, etc.). If this attribute is specified, it overrides the method attribute of the button's form owner.
  **/
export function formMethod(value) { return new Attr("formmethod", value, "button", "input"); }
/**
 * If the button/input is a submit button (type="submit"), this boolean attribute specifies that the form is not to be validated when it is submitted. If this attribute is specified, it overrides the novalidate attribute of the button's form owner.
  **/
export function formNoValidate(value) { return new Attr("formnovalidate", value, "button", "input"); }
/**
 * If the button/input is a submit button (type="submit"), this attribute specifies the browsing context (for example, tab, window, or inline frame) in which to display the response that is received after submitting the form. If this attribute is specified, it overrides the target attribute of the button's form owner.
  **/
export function formTarget(value) { return new Attr("formtarget", value, "button", "input"); }
/**
 * IDs of the <th> elements which applies to this element.
  **/
export function headers(value) { return new Attr("headers", value, "td", "th"); }
/**
 * Specifies the height of elements listed here. For all other elements, use the CSS height property.
  **/
export function height(value) { return new Attr("height", value, "canvas", "embed", "iframe", "img", "input", "object", "video"); }
/**
 * Prevents rendering of given element, while keeping child elements, e.g. script elements, active.
  **/
export function hidden(value) { return new Attr("hidden", value); }
/**
 * Indicates the lower bound of the upper range.
  **/
export function high(value) { return new Attr("high", value, "meter"); }
/**
 * The URL of a linked resource.
  **/
export function href(value) { return new Attr("href", value, "a", "area", "base", "link"); }
/**
 * Specifies the language of the linked resource.
  **/
export function hrefLang(value) { return new Attr("hreflang", value, "a", "area", "link"); }
/**
 * Defines a pragma directive.
  **/
export function httpEquiv(value) { return new Attr("httpEquiv", value, "meta"); }
/**
 * Specifies a picture which represents the command.
  **/
export function icon(value) { return new Attr("icon", value, "command"); }
/**
 * Often used with CSS to style a specific element. The value of this attribute must be unique.
  **/
export function id(value) { return new Attr("id", value); }
/**
 * Indicates the relative fetch priority for the resource.
  **/
export function importance(value) { return new Attr("importance", value, "iframe", "img", "link", "script"); }
/**
 * Provides a hint as to the type of data that might be entered by the user while editing the element or its contents. The attribute can be used with form controls (such as the value of textarea elements), or in elements in an editing host (e.g., using contenteditable attribute).
  **/
export function inputMode(value) { return new Attr("inputmode", value, "textarea"); }
/**
 * Specifies a Subresource Integrity value that allows browsers to verify what they fetch.
  **/
export function integrity(value) { return new Attr("integrity", value, "link", "script"); }
/**
 * This attribute tells the browser to ignore the actual intrinsic size of the image and pretend it’s the size specified in the attribute.
  **/
export function intrinsicSize(value) { return new Attr("intrinsicsize", value, "img"); }
/**
 * Indicates that the image is part of a server-side image map.
  **/
export function isMap(value) { return new Attr("ismap", value, "img"); }
/**
 * Specifies the type of key generated.
  **/
export function keyType(value) { return new Attr("keytype", value, "keygen"); }
/**
 * The itemprop attribute
  **/
export function itemProp(value) { return new Attr("itemprop", value); }
/**
 * Specifies the kind of text track.
  **/
export function kind(value) { return new Attr("kind", value, "track"); }
/**
 * Specifies a user-readable title of the element.
  **/
export function label(value) { return new Attr("label", value, "optgroup", "option", "track"); }
/**
 * Defines the language used in the element.
  **/
export function lang(value) { return new Attr("lang", value); }
/**
 * Defines the script language used in the element.
  **/
export function language(value) { return new Attr("language", value, "script"); }
/**
 * Identifies a list of pre-defined options to suggest to the user.
  **/
export function list(value) { return new Attr("list", value, "input"); }
/**
 * Indicates whether the media should start playing from the start when it's finished.
  **/
export function loop(value) { return new Attr("loop", value, "audio", "bgsound", "marquee", "video"); }
/**
 * Indicates the upper bound of the lower range.
  **/
export function low(value) { return new Attr("low", value, "meter"); }
/**
 * Indicates the maximum value allowed.
  **/
export function max(value) { return new Attr("max", value, "input", "meter", "progress"); }
/**
 * Defines the maximum number of characters allowed in the element.
  **/
export function maxLength(value) { return new Attr("maxlength", value, "input", "textarea"); }
/**
 * Defines the minimum number of characters allowed in the element.
  **/
export function minLength(value) { return new Attr("minlength", value, "input", "textarea"); }
/**
 * Specifies a hint of the media for which the linked resource was designed.
  **/
export function media(value) { return new Attr("media", value, "a", "area", "link", "source", "style"); }
/**
 * Defines which HTTP method to use when submitting the form. Can be GET (default) or POST.
  **/
export function method(value) { return new Attr("method", value, "form"); }
/**
 * Indicates the minimum value allowed.
  **/
export function min(value) { return new Attr("min", value, "input", "meter"); }
/**
 * Indicates whether multiple values can be entered in an input of the type email or file.
  **/
export function multiple(value) { return new Attr("multiple", value, "input", "select"); }
/**
 * Indicates whether the audio will be initially silenced on page load.
  **/
export function muted(value) { return new Attr("muted", value, "audio", "video"); }
/**
 * Name of the element. For example used by the server to identify the fields in form submits.
  **/
export function name(value) { return new Attr("name", value, "button", "form", "fieldset", "iframe", "input", "keygen", "object", "output", "select", "textarea", "map", "meta", "param"); }
/**
 * This attribute indicates that the form shouldn't be validated when submitted.
  **/
export function noValidate(value) { return new Attr("novalidate", value, "form"); }
/**
 * Indicates whether the details will be shown on page load.
  **/
export function open(value) { return new Attr("open", value, "details"); }
/**
 * Indicates the optimal numeric value.
  **/
export function optimum(value) { return new Attr("optimum", value, "meter"); }
/**
 * Defines a regular expression which the element's value will be validated against.
  **/
export function pattern(value) { return new Attr("pattern", value, "input"); }
/**
 * The ping attribute specifies a space-separated list of URLs to be notified if a user follows the hyperlink.
  **/
export function ping(value) { return new Attr("ping", value, "a", "area"); }
/**
 * Provides a hint to the user of what can be entered in the field.
  **/
export function placeHolder(value) { return new Attr("placeholder", value, "input", "textarea"); }
/**
 * Indicates that the media element should play automatically on iOS.
  **/
export function playsInline(value) { return new Attr("playsInline", value, "audio", "video"); }
/**
 * A URL indicating a poster frame to show until the user plays or seeks.
  **/
export function poster(value) { return new Attr("poster", value, "video"); }
/**
 * Indicates whether the whole resource, parts of it or nothing should be preloaded.
  **/
export function preload(value) { return new Attr("preload", value, "audio", "video"); }
/**
 * Indicates whether the element can be edited.
  **/
export function readOnly(value) { return new Attr("readonly", value, "input", "textarea"); }
/**
 * The radiogroup attribute
  **/
export function radioGroup(value) { return new Attr("radiogroup", value, "command"); }
/**
 * Specifies which referrer is sent when fetching the resource.
  **/
export function referrerPolicy(value) { return new Attr("referrerpolicy", value, "a", "area", "iframe", "img", "link", "script"); }
/**
 * Specifies the relationship of the target object to the link object.
  **/
export function rel(value) { return new Attr("rel", value, "a", "area", "link"); }
/**
 * Indicates whether this element is required to fill out or not.
  **/
export function required(value) { return new Attr("required", value, "input", "select", "textarea"); }
/**
 * Indicates whether the list should be displayed in a descending order instead of a ascending.
  **/
export function reversed(value) { return new Attr("reversed", value, "ol"); }
/**
 * Defines the number of rows in a text area.
  **/
export function role(value) { return new Attr("role", value); }
/**
 * The rows attribute
  **/
export function rows(value) { return new Attr("rows", value, "textarea"); }
/**
 * Defines the number of rows a table cell should span over.
  **/
export function rowSpan(value) { return new Attr("rowspan", value, "td", "th"); }
/**
 * Stops a document loaded in an iframe from using certain features (such as submitting forms or opening new windows).
  **/
export function sandbox(value) { return new Attr("sandbox", value, "iframe"); }
/**
 * Defines the cells that the header test (defined in the th element) relates to.
  **/
export function scope(value) { return new Attr("scope", value, "th"); }
/**
 * The scoped attribute
  **/
export function scoped(value) { return new Attr("scoped", value, "style"); }
/**
 * Defines a value which will be selected on page load.
  **/
export function selected(value) { return new Attr("selected", value, "option"); }
/**
 * The shape attribute
  **/
export function shape(value) { return new Attr("shape", value, "a", "area"); }
/**
 * Defines the width of the element (in pixels). If the element's type attribute is text or password then it's the number of characters.
  **/
export function size(value) { return new Attr("size", value, "input", "select"); }
/**
 * Assigns a slot in a shadow DOM shadow tree to an element.
  **/
export function slot(value) { return new Attr("slot", value); }
/**
 * The sizes attribute
  **/
export function sizes(value) { return new Attr("sizes", value, "link", "img", "source"); }
/**
 * The span attribute
  **/
export function span(value) { return new Attr("span", value, "col", "colgroup"); }
/**
 * Indicates whether spell checking is allowed for the element.
  **/
export function spellCheck(value) { return new Attr("spellcheck", value); }
/**
 * The URL of the embeddable content.
  **/
export function src(value) { return new Attr("src", value, "audio", "embed", "iframe", "img", "input", "script", "source", "track", "video"); }
/**
 * The srcdoc attribute
  **/
export function srcDoc(value) { return new Attr("srcdoc", value, "iframe"); }
/**
 * The srclang attribute
  **/
export function srcLang(value) { return new Attr("srclang", value, "track"); }
/**
 * A MediaStream object to use as a source for an HTML video or audio element
  **/
export function srcObject(value) { return new Attr("srcObject", value, "audio", "video"); }
/**
 * One or more responsive image candidates.
  **/
export function srcSet(value) { return new Attr("srcset", value, "img", "source"); }
/**
 * Defines the first number if other than 1.
  **/
export function start(value) { return new Attr("start", value, "ol"); }
/**
 * Defines CSS styles which will override styles previously set.
 *
 * NOTE: DO NOT USE THIS. You should use `styles()` instead.
 **/
export function __deprecated__style__deprecated__(value) {
    for (let k in value) {
        if (!value[k] && !isBoolean(value[k])) {
            delete value[k];
        }
    }
    return new Attr("style", value);
}
/**
 * The step attribute
  **/
export function step(value) { return new Attr("step", value, "input"); }
/**
 * The summary attribute
  **/
export function summary(value) { return new Attr("summary", value, "table"); }
/**
 * Overrides the browser's default tab order and follows the one specified instead.
  **/
export function tabIndex(value) { return new Attr("tabindex", value); }
/**
 * Text to be displayed in a tooltip when hovering over the element.
  **/
export function title(value) { return new Attr("title", value); }
/**
 * The target attribute
  **/
export function target(value) { return new Attr("target", value, "a", "area", "base", "form"); }
/**
 * Specify whether an element’s attribute values and the values of its Text node children are to be translated when the page is localized, or whether to leave them unchanged.
  **/
export function translate(value) { return new Attr("translate", value); }
/**
 * Defines the type of the element.
  **/
export function type(value) { return new Attr("type", value, "button", "input", "command", "embed", "object", "script", "source", "style", "menu"); }
/**
 * Defines a default value which will be displayed in the element on page load.
  **/
export function value(value) { return new Attr("value", value, "button", "data", "input", "li", "meter", "option", "progress", "param"); }
/**
 * setting the volume at which a media element plays.
  **/
export function volume(value) { return new Attr("volume", value, "audio", "video"); }
/**
 * The usemap attribute
  **/
export function useMap(value) { return new Attr("usemap", value, "img", "input", "object"); }
/**
 * For the elements listed here, this establishes the element's width.
  **/
export function width(value) { return new Attr("width", value, "canvas", "embed", "iframe", "img", "input", "object", "video"); }
/**
 * Indicates whether the text should be wrapped.
  **/
export function wrap(value) { return new Attr("wrap", value, "textarea"); }
export class CssPropSet {
    constructor(...rest) {
        this.set = new Map();
        const set = (key, value) => {
            if (value || isBoolean(value)) {
                this.set.set(key, value);
            }
            else if (this.set.has(key)) {
                this.set.delete(key);
            }
        };
        for (const prop of rest) {
            if (prop instanceof Attr) {
                const { key, value } = prop;
                set(key, value);
            }
            else {
                for (const [key, value] of prop.set.entries()) {
                    set(key, value);
                }
            }
        }
    }
    /**
     * Set the attribute value on an HTMLElement
     * @param elem - the element on which to set the attribute.
     */
    apply(elem) {
        const style = isHTMLElement(elem)
            ? elem.style
            : elem;
        for (const prop of this.set.entries()) {
            const [key, value] = prop;
            style[key] = value;
        }
    }
}
/**
 * Combine style properties.
 **/
export function styles(...rest) {
    return new CssPropSet(...rest);
}
export function alignContent(v) { return new Attr("alignContent", v); }
export function alignItems(v) { return new Attr("alignItems", v); }
export function alignSelf(v) { return new Attr("alignSelf", v); }
export function alignmentBaseline(v) { return new Attr("alignmentBaseline", v); }
export function all(v) { return new Attr("all", v); }
export function animation(v) { return new Attr("animation", v); }
export function animationDelay(v) { return new Attr("animationDelay", v); }
export function animationDirection(v) { return new Attr("animationDirection", v); }
export function animationDuration(v) { return new Attr("animationDuration", v); }
export function animationFillMode(v) { return new Attr("animationFillMode", v); }
export function animationIterationCount(v) { return new Attr("animationIterationCount", v); }
export function animationName(v) { return new Attr("animationName", v); }
export function animationPlayState(v) { return new Attr("animationPlayState", v); }
export function animationTimingFunction(v) { return new Attr("animationTimingFunction", v); }
export function appearance(v) { return new Attr("appearance", v); }
export function backdropFilter(v) { return new Attr("backdropFilter", v); }
export function backfaceVisibility(v) { return new Attr("backfaceVisibility", v); }
export function background(v) { return new Attr("background", v); }
export function backgroundAttachment(v) { return new Attr("backgroundAttachment", v); }
export function backgroundBlendMode(v) { return new Attr("backgroundBlendMode", v); }
export function backgroundClip(v) { return new Attr("backgroundClip", v); }
export function backgroundColor(v) { return new Attr("backgroundColor", v); }
export function backgroundImage(v) { return new Attr("backgroundImage", v); }
export function backgroundOrigin(v) { return new Attr("backgroundOrigin", v); }
export function backgroundPosition(v) { return new Attr("backgroundPosition", v); }
export function backgroundPositionX(v) { return new Attr("backgroundPositionX", v); }
export function backgroundPositionY(v) { return new Attr("backgroundPositionY", v); }
export function backgroundRepeat(v) { return new Attr("backgroundRepeat", v); }
export function backgroundRepeatX(v) { return new Attr("backgroundRepeatX", v); }
export function backgroundRepeatY(v) { return new Attr("backgroundRepeatY", v); }
export function backgroundSize(v) { return new Attr("backgroundSize", v); }
export function baselineShift(v) { return new Attr("baselineShift", v); }
export function blockSize(v) { return new Attr("blockSize", v); }
export function border(v) { return new Attr("border", v); }
export function borderBlockEnd(v) { return new Attr("borderBlockEnd", v); }
export function borderBlockEndColor(v) { return new Attr("borderBlockEndColor", v); }
export function borderBlockEndStyle(v) { return new Attr("borderBlockEndStyle", v); }
export function borderBlockEndWidth(v) { return new Attr("borderBlockEndWidth", v); }
export function borderBlockStart(v) { return new Attr("borderBlockStart", v); }
export function borderBlockStartColor(v) { return new Attr("borderBlockStartColor", v); }
export function borderBlockStartStyle(v) { return new Attr("borderBlockStartStyle", v); }
export function borderBlockStartWidth(v) { return new Attr("borderBlockStartWidth", v); }
export function borderBottom(v) { return new Attr("borderBottom", v); }
export function borderBottomColor(v) { return new Attr("borderBottomColor", v); }
export function borderBottomLeftRadius(v) { return new Attr("borderBottomLeftRadius", v); }
export function borderBottomRightRadius(v) { return new Attr("borderBottomRightRadius", v); }
export function borderBottomStyle(v) { return new Attr("borderBottomStyle", v); }
export function borderBottomWidth(v) { return new Attr("borderBottomWidth", v); }
export function borderCollapse(v) { return new Attr("borderCollapse", v); }
export function borderColor(v) { return new Attr("borderColor", v); }
export function borderImage(v) { return new Attr("borderImage", v); }
export function borderImageOutset(v) { return new Attr("borderImageOutset", v); }
export function borderImageRepeat(v) { return new Attr("borderImageRepeat", v); }
export function borderImageSlice(v) { return new Attr("borderImageSlice", v); }
export function borderImageSource(v) { return new Attr("borderImageSource", v); }
export function borderImageWidth(v) { return new Attr("borderImageWidth", v); }
export function borderInlineEnd(v) { return new Attr("borderInlineEnd", v); }
export function borderInlineEndColor(v) { return new Attr("borderInlineEndColor", v); }
export function borderInlineEndStyle(v) { return new Attr("borderInlineEndStyle", v); }
export function borderInlineEndWidth(v) { return new Attr("borderInlineEndWidth", v); }
export function borderInlineStart(v) { return new Attr("borderInlineStart", v); }
export function borderInlineStartColor(v) { return new Attr("borderInlineStartColor", v); }
export function borderInlineStartStyle(v) { return new Attr("borderInlineStartStyle", v); }
export function borderInlineStartWidth(v) { return new Attr("borderInlineStartWidth", v); }
export function borderLeft(v) { return new Attr("borderLeft", v); }
export function borderLeftColor(v) { return new Attr("borderLeftColor", v); }
export function borderLeftStyle(v) { return new Attr("borderLeftStyle", v); }
export function borderLeftWidth(v) { return new Attr("borderLeftWidth", v); }
export function borderRadius(v) { return new Attr("borderRadius", v); }
export function borderRight(v) { return new Attr("borderRight", v); }
export function borderRightColor(v) { return new Attr("borderRightColor", v); }
export function borderRightStyle(v) { return new Attr("borderRightStyle", v); }
export function borderRightWidth(v) { return new Attr("borderRightWidth", v); }
export function borderSpacing(v) { return new Attr("borderSpacing", v); }
export function borderStyle(v) { return new Attr("borderStyle", v); }
export function borderTop(v) { return new Attr("borderTop", v); }
export function borderTopColor(v) { return new Attr("borderTopColor", v); }
export function borderTopLeftRadius(v) { return new Attr("borderTopLeftRadius", v); }
export function borderTopRightRadius(v) { return new Attr("borderTopRightRadius", v); }
export function borderTopStyle(v) { return new Attr("borderTopStyle", v); }
export function borderTopWidth(v) { return new Attr("borderTopWidth", v); }
export function borderWidth(v) { return new Attr("borderWidth", v); }
export function bottom(v) { return new Attr("bottom", v); }
export function boxShadow(v) { return new Attr("boxShadow", v); }
export function boxSizing(v) { return new Attr("boxSizing", v); }
export function breakAfter(v) { return new Attr("breakAfter", v); }
export function breakBefore(v) { return new Attr("breakBefore", v); }
export function breakInside(v) { return new Attr("breakInside", v); }
export function bufferedRendering(v) { return new Attr("bufferedRendering", v); }
export function captionSide(v) { return new Attr("captionSide", v); }
export function caretColor(v) { return new Attr("caretColor", v); }
export function clear(v) { return new Attr("clear", v); }
export function clip(v) { return new Attr("clip", v); }
export function clipPath(v) { return new Attr("clipPath", v); }
export function clipRule(v) { return new Attr("clipRule", v); }
export function color(v) { return new Attr("color", v); }
export function colorInterpolation(v) { return new Attr("colorInterpolation", v); }
export function colorInterpolationFilters(v) { return new Attr("colorInterpolationFilters", v); }
export function colorRendering(v) { return new Attr("colorRendering", v); }
export function colorScheme(v) { return new Attr("colorScheme", v); }
export function columnCount(v) { return new Attr("columnCount", v); }
export function columnFill(v) { return new Attr("columnFill", v); }
export function columnGap(v) { return new Attr("columnGap", v); }
export function columnRule(v) { return new Attr("columnRule", v); }
export function columnRuleColor(v) { return new Attr("columnRuleColor", v); }
export function columnRuleStyle(v) { return new Attr("columnRuleStyle", v); }
export function columnRuleWidth(v) { return new Attr("columnRuleWidth", v); }
export function columnSpan(v) { return new Attr("columnSpan", v); }
export function columnWidth(v) { return new Attr("columnWidth", v); }
export function columns(v) { return new Attr("columns", v); }
export function contain(v) { return new Attr("contain", v); }
export function containIntrinsicSize(v) { return new Attr("containIntrinsicSize", v); }
export function counterIncrement(v) { return new Attr("counterIncrement", v); }
export function counterReset(v) { return new Attr("counterReset", v); }
export function cursor(v) { return new Attr("cursor", v); }
export function cx(v) { return new Attr("cx", v); }
export function cy(v) { return new Attr("cy", v); }
export function d(v) { return new Attr("d", v); }
export function direction(v) { return new Attr("direction", v); }
export function display(v) { return new Attr("display", v); }
export function dominantBaseline(v) { return new Attr("dominantBaseline", v); }
export function emptyCells(v) { return new Attr("emptyCells", v); }
export function fill(v) { return new Attr("fill", v); }
export function fillOpacity(v) { return new Attr("fillOpacity", v); }
export function fillRule(v) { return new Attr("fillRule", v); }
export function filter(v) { return new Attr("filter", v); }
export function flex(v) { return new Attr("flex", v); }
export function flexBasis(v) { return new Attr("flexBasis", v); }
export function flexDirection(v) { return new Attr("flexDirection", v); }
export function flexFlow(v) { return new Attr("flexFlow", v); }
export function flexGrow(v) { return new Attr("flexGrow", v); }
export function flexShrink(v) { return new Attr("flexShrink", v); }
export function flexWrap(v) { return new Attr("flexWrap", v); }
export function float(v) { return new Attr("float", v); }
export function floodColor(v) { return new Attr("floodColor", v); }
export function floodOpacity(v) { return new Attr("floodOpacity", v); }
export function font(v) { return new Attr("font", v); }
export function fontDisplay(v) { return new Attr("fontDisplay", v); }
export function fontFamily(v) { return new Attr("fontFamily", v); }
export function fontFeatureSettings(v) { return new Attr("fontFeatureSettings", v); }
export function fontKerning(v) { return new Attr("fontKerning", v); }
export function fontOpticalSizing(v) { return new Attr("fontOpticalSizing", v); }
export function fontSize(v) { return new Attr("fontSize", v); }
export function fontStretch(v) { return new Attr("fontStretch", v); }
export function fontStyle(v) { return new Attr("fontStyle", v); }
export function fontVariant(v) { return new Attr("fontVariant", v); }
export function fontVariantCaps(v) { return new Attr("fontVariantCaps", v); }
export function fontVariantEastAsian(v) { return new Attr("fontVariantEastAsian", v); }
export function fontVariantLigatures(v) { return new Attr("fontVariantLigatures", v); }
export function fontVariantNumeric(v) { return new Attr("fontVariantNumeric", v); }
export function fontVariationSettings(v) { return new Attr("fontVariationSettings", v); }
export function fontWeight(v) { return new Attr("fontWeight", v); }
export function forcedColorAdjust(v) { return new Attr("forcedColorAdjust", v); }
export function gap(v) { return new Attr("gap", v); }
export function grid(v) { return new Attr("grid", v); }
export function gridArea(v) { return new Attr("gridArea", v); }
export function gridAutoColumns(v) { return new Attr("gridAutoColumns", v); }
export function gridAutoFlow(v) { return new Attr("gridAutoFlow", v); }
export function gridAutoRows(v) { return new Attr("gridAutoRows", v); }
export function gridColumn(v) { return new Attr("gridColumn", v); }
export function gridColumnEnd(v) { return new Attr("gridColumnEnd", v); }
export function gridColumnGap(v) { return new Attr("gridColumnGap", v); }
export function gridColumnStart(v) { return new Attr("gridColumnStart", v); }
export function gridGap(v) { return new Attr("gridGap", v); }
export function gridRow(v) { return new Attr("gridRow", v); }
export function gridRowEnd(v) { return new Attr("gridRowEnd", v); }
export function gridRowGap(v) { return new Attr("gridRowGap", v); }
export function gridRowStart(v) { return new Attr("gridRowStart", v); }
export function gridTemplate(v) { return new Attr("gridTemplate", v); }
export function gridTemplateAreas(v) { return new Attr("gridTemplateAreas", v); }
export function gridTemplateColumns(v) { return new Attr("gridTemplateColumns", v); }
export function gridTemplateRows(v) { return new Attr("gridTemplateRows", v); }
export function hyphens(v) { return new Attr("hyphens", v); }
export function imageOrientation(v) { return new Attr("imageOrientation", v); }
export function imageRendering(v) { return new Attr("imageRendering", v); }
export function inlineSize(v) { return new Attr("inlineSize", v); }
export function isolation(v) { return new Attr("isolation", v); }
export function justifyContent(v) { return new Attr("justifyContent", v); }
export function justifyItems(v) { return new Attr("justifyItems", v); }
export function justifySelf(v) { return new Attr("justifySelf", v); }
export function left(v) { return new Attr("left", v); }
export function letterSpacing(v) { return new Attr("letterSpacing", v); }
export function lightingColor(v) { return new Attr("lightingColor", v); }
export function lineBreak(v) { return new Attr("lineBreak", v); }
export function lineHeight(v) { return new Attr("lineHeight", v); }
export function listStyle(v) { return new Attr("listStyle", v); }
export function listStyleImage(v) { return new Attr("listStyleImage", v); }
export function listStylePosition(v) { return new Attr("listStylePosition", v); }
export function listStyleType(v) { return new Attr("listStyleType", v); }
export function margin(v) { return new Attr("margin", v); }
export function marginBlockEnd(v) { return new Attr("marginBlockEnd", v); }
export function marginBlockStart(v) { return new Attr("marginBlockStart", v); }
export function marginBottom(v) { return new Attr("marginBottom", v); }
export function marginInlineEnd(v) { return new Attr("marginInlineEnd", v); }
export function marginInlineStart(v) { return new Attr("marginInlineStart", v); }
export function marginLeft(v) { return new Attr("marginLeft", v); }
export function marginRight(v) { return new Attr("marginRight", v); }
export function marginTop(v) { return new Attr("marginTop", v); }
export function marker(v) { return new Attr("marker", v); }
export function markerEnd(v) { return new Attr("markerEnd", v); }
export function markerMid(v) { return new Attr("markerMid", v); }
export function markerStart(v) { return new Attr("markerStart", v); }
export function mask(v) { return new Attr("mask", v); }
export function maskType(v) { return new Attr("maskType", v); }
export function maxBlockSize(v) { return new Attr("maxBlockSize", v); }
export function maxHeight(v) { return new Attr("maxHeight", v); }
export function maxInlineSize(v) { return new Attr("maxInlineSize", v); }
export function maxWidth(v) { return new Attr("maxWidth", v); }
export function maxZoom(v) { return new Attr("maxZoom", v); }
export function minBlockSize(v) { return new Attr("minBlockSize", v); }
export function minHeight(v) { return new Attr("minHeight", v); }
export function minInlineSize(v) { return new Attr("minInlineSize", v); }
export function minWidth(v) { return new Attr("minWidth", v); }
export function minZoom(v) { return new Attr("minZoom", v); }
export function mixBlendMode(v) { return new Attr("mixBlendMode", v); }
export function objectFit(v) { return new Attr("objectFit", v); }
export function objectPosition(v) { return new Attr("objectPosition", v); }
export function offset(v) { return new Attr("offset", v); }
export function offsetDistance(v) { return new Attr("offsetDistance", v); }
export function offsetPath(v) { return new Attr("offsetPath", v); }
export function offsetRotate(v) { return new Attr("offsetRotate", v); }
export function opacity(v) { return new Attr("opacity", v); }
export function order(v) { return new Attr("order", v); }
export function orientation(v) { return new Attr("orientation", v); }
export function orphans(v) { return new Attr("orphans", v); }
export function outline(v) { return new Attr("outline", v); }
export function outlineColor(v) { return new Attr("outlineColor", v); }
export function outlineOffset(v) { return new Attr("outlineOffset", v); }
export function outlineStyle(v) { return new Attr("outlineStyle", v); }
export function outlineWidth(v) { return new Attr("outlineWidth", v); }
export function overflow(v) { return new Attr("overflow", v); }
export function overflowAnchor(v) { return new Attr("overflowAnchor", v); }
export function overflowWrap(v) { return new Attr("overflowWrap", v); }
export function overflowX(v) { return new Attr("overflowX", v); }
export function overflowY(v) { return new Attr("overflowY", v); }
export function overscrollBehavior(v) { return new Attr("overscrollBehavior", v); }
export function overscrollBehaviorBlock(v) { return new Attr("overscrollBehaviorBlock", v); }
export function overscrollBehaviorInline(v) { return new Attr("overscrollBehaviorInline", v); }
export function overscrollBehaviorX(v) { return new Attr("overscrollBehaviorX", v); }
export function overscrollBehaviorY(v) { return new Attr("overscrollBehaviorY", v); }
export function padding(v) { return new Attr("padding", v); }
export function paddingBlockEnd(v) { return new Attr("paddingBlockEnd", v); }
export function paddingBlockStart(v) { return new Attr("paddingBlockStart", v); }
export function paddingBottom(v) { return new Attr("paddingBottom", v); }
export function paddingInlineEnd(v) { return new Attr("paddingInlineEnd", v); }
export function paddingInlineStart(v) { return new Attr("paddingInlineStart", v); }
export function paddingLeft(v) { return new Attr("paddingLeft", v); }
export function paddingRight(v) { return new Attr("paddingRight", v); }
export function paddingTop(v) { return new Attr("paddingTop", v); }
export function pageBreakAfter(v) { return new Attr("pageBreakAfter", v); }
export function pageBreakBefore(v) { return new Attr("pageBreakBefore", v); }
export function pageBreakInside(v) { return new Attr("pageBreakInside", v); }
export function paintOrder(v) { return new Attr("paintOrder", v); }
export function perspective(v) { return new Attr("perspective", v); }
export function perspectiveOrigin(v) { return new Attr("perspectiveOrigin", v); }
export function placeContent(v) { return new Attr("placeContent", v); }
export function placeItems(v) { return new Attr("placeItems", v); }
export function placeSelf(v) { return new Attr("placeSelf", v); }
export function pointerEvents(v) { return new Attr("pointerEvents", v); }
export function position(v) { return new Attr("position", v); }
export function quotes(v) { return new Attr("quotes", v); }
export function r(v) { return new Attr("r", v); }
export function resize(v) { return new Attr("resize", v); }
export function right(v) { return new Attr("right", v); }
export function rowGap(v) { return new Attr("rowGap", v); }
export function rubyPosition(v) { return new Attr("rubyPosition", v); }
export function rx(v) { return new Attr("rx", v); }
export function ry(v) { return new Attr("ry", v); }
export function scrollBehavior(v) { return new Attr("scrollBehavior", v); }
export function scrollMargin(v) { return new Attr("scrollMargin", v); }
export function scrollMarginBlock(v) { return new Attr("scrollMarginBlock", v); }
export function scrollMarginBlockEnd(v) { return new Attr("scrollMarginBlockEnd", v); }
export function scrollMarginBlockStart(v) { return new Attr("scrollMarginBlockStart", v); }
export function scrollMarginBottom(v) { return new Attr("scrollMarginBottom", v); }
export function scrollMarginInline(v) { return new Attr("scrollMarginInline", v); }
export function scrollMarginInlineEnd(v) { return new Attr("scrollMarginInlineEnd", v); }
export function scrollMarginInlineStart(v) { return new Attr("scrollMarginInlineStart", v); }
export function scrollMarginLeft(v) { return new Attr("scrollMarginLeft", v); }
export function scrollMarginRight(v) { return new Attr("scrollMarginRight", v); }
export function scrollMarginTop(v) { return new Attr("scrollMarginTop", v); }
export function scrollPadding(v) { return new Attr("scrollPadding", v); }
export function scrollPaddingBlock(v) { return new Attr("scrollPaddingBlock", v); }
export function scrollPaddingBlockEnd(v) { return new Attr("scrollPaddingBlockEnd", v); }
export function scrollPaddingBlockStart(v) { return new Attr("scrollPaddingBlockStart", v); }
export function scrollPaddingBottom(v) { return new Attr("scrollPaddingBottom", v); }
export function scrollPaddingInline(v) { return new Attr("scrollPaddingInline", v); }
export function scrollPaddingInlineEnd(v) { return new Attr("scrollPaddingInlineEnd", v); }
export function scrollPaddingInlineStart(v) { return new Attr("scrollPaddingInlineStart", v); }
export function scrollPaddingLeft(v) { return new Attr("scrollPaddingLeft", v); }
export function scrollPaddingRight(v) { return new Attr("scrollPaddingRight", v); }
export function scrollPaddingTop(v) { return new Attr("scrollPaddingTop", v); }
export function scrollSnapAlign(v) { return new Attr("scrollSnapAlign", v); }
export function scrollSnapStop(v) { return new Attr("scrollSnapStop", v); }
export function scrollSnapType(v) { return new Attr("scrollSnapType", v); }
export function shapeImageThreshold(v) { return new Attr("shapeImageThreshold", v); }
export function shapeMargin(v) { return new Attr("shapeMargin", v); }
export function shapeOutside(v) { return new Attr("shapeOutside", v); }
export function shapeRendering(v) { return new Attr("shapeRendering", v); }
export function speak(v) { return new Attr("speak", v); }
export function stopColor(v) { return new Attr("stopColor", v); }
export function stopOpacity(v) { return new Attr("stopOpacity", v); }
export function stroke(v) { return new Attr("stroke", v); }
export function strokeDasharray(v) { return new Attr("strokeDasharray", v); }
export function strokeDashoffset(v) { return new Attr("strokeDashoffset", v); }
export function strokeLinecap(v) { return new Attr("strokeLinecap", v); }
export function strokeLinejoin(v) { return new Attr("strokeLinejoin", v); }
export function strokeMiterlimit(v) { return new Attr("strokeMiterlimit", v); }
export function strokeOpacity(v) { return new Attr("strokeOpacity", v); }
export function strokeWidth(v) { return new Attr("strokeWidth", v); }
export function tabSize(v) { return new Attr("tabSize", v); }
export function tableLayout(v) { return new Attr("tableLayout", v); }
export function textAlign(v) { return new Attr("textAlign", v); }
export function textAlignLast(v) { return new Attr("textAlignLast", v); }
export function textAnchor(v) { return new Attr("textAnchor", v); }
export function textCombineUpright(v) { return new Attr("textCombineUpright", v); }
export function textDecoration(v) { return new Attr("textDecoration", v); }
export function textDecorationColor(v) { return new Attr("textDecorationColor", v); }
export function textDecorationLine(v) { return new Attr("textDecorationLine", v); }
export function textDecorationSkipInk(v) { return new Attr("textDecorationSkipInk", v); }
export function textDecorationStyle(v) { return new Attr("textDecorationStyle", v); }
export function textIndent(v) { return new Attr("textIndent", v); }
export function textOrientation(v) { return new Attr("textOrientation", v); }
export function textOverflow(v) { return new Attr("textOverflow", v); }
export function textRendering(v) { return new Attr("textRendering", v); }
export function textShadow(v) { return new Attr("textShadow", v); }
export function textSizeAdjust(v) { return new Attr("textSizeAdjust", v); }
export function textTransform(v) { return new Attr("textTransform", v); }
export function textUnderlinePosition(v) { return new Attr("textUnderlinePosition", v); }
export function top(v) { return new Attr("top", v); }
export function touchAction(v) { return new Attr("touchAction", v); }
export function transform(v) { return new Attr("transform", v); }
export function transformBox(v) { return new Attr("transformBox", v); }
export function transformOrigin(v) { return new Attr("transformOrigin", v); }
export function transformStyle(v) { return new Attr("transformStyle", v); }
export function transition(v) { return new Attr("transition", v); }
export function transitionDelay(v) { return new Attr("transitionDelay", v); }
export function transitionDuration(v) { return new Attr("transitionDuration", v); }
export function transitionProperty(v) { return new Attr("transitionProperty", v); }
export function transitionTimingFunction(v) { return new Attr("transitionTimingFunction", v); }
export function unicodeBidi(v) { return new Attr("unicodeBidi", v); }
export function unicodeRange(v) { return new Attr("unicodeRange", v); }
export function userSelect(v) { return new Attr("userSelect", v); }
export function userZoom(v) { return new Attr("userZoom", v); }
export function vectorEffect(v) { return new Attr("vectorEffect", v); }
export function verticalAlign(v) { return new Attr("verticalAlign", v); }
export function visibility(v) { return new Attr("visibility", v); }
export function whiteSpace(v) { return new Attr("whiteSpace", v); }
export function widows(v) { return new Attr("widows", v); }
export function willChange(v) { return new Attr("willChange", v); }
export function wordBreak(v) { return new Attr("wordBreak", v); }
export function wordSpacing(v) { return new Attr("wordSpacing", v); }
export function wordWrap(v) { return new Attr("wordWrap", v); }
export function writingMode(v) { return new Attr("writingMode", v); }
export function x(v) { return new Attr("x", v); }
export function y(v) { return new Attr("y", v); }
export function zIndex(v) { return new Attr("zIndex", v); }
export function zoom(v) { return new Attr("zoom", v); }
/**
 * A selection of fonts for preferred monospace rendering.
 **/
export const monospaceFonts = "'Droid Sans Mono', 'Consolas', 'Lucida Console', 'Courier New', 'Courier', monospace";
/**
 * A selection of fonts for preferred monospace rendering.
 **/
export const monospaceFamily = fontFamily(monospaceFonts);
/**
 * A selection of fonts that should match whatever the user's operating system normally uses.
 **/
export const systemFonts = "-apple-system, '.SFNSText-Regular', 'San Francisco', 'Roboto', 'Segoe UI', 'Helvetica Neue', 'Lucida Grande', sans-serif";
/**
 * A selection of fonts that should match whatever the user's operating system normally uses.
 **/
export const systemFamily = fontFamily(systemFonts);
//# sourceMappingURL=attrs.js.map