export interface IAppliable {
    apply(elem: HTMLElement | CSSStyleDeclaration): void;
}
/**
 * A setter functor for HTML attributes.
 **/
export declare class Attr implements IAppliable {
    readonly key: string;
    readonly value: any;
    readonly tags: readonly string[];
    /**
     * Creates a new setter functor for HTML Attributes
     * @param key - the attribute name.
     * @param value - the value to set for the attribute.
     * @param tags - the HTML tags that support this attribute.
     */
    constructor(key: string, value: any, ...tags: string[]);
    /**
     * Set the attribute value on an HTMLElement
     * @param elem - the element on which to set the attribute.
     */
    apply(elem: HTMLElement | CSSStyleDeclaration): void;
}
/**
 * a list of types the server accepts, typically a file type.
 * @param value - the value to set on the attribute.
 **/
export declare function accept(value: string): Attr;
/**
 * The accessKey attribute
 **/
export declare function accessKey(value: string): Attr;
/**
 * specifying the horizontal alignment of the element.
 **/
export declare function align(value: string): Attr;
/**
 * Specifies a feature-policy for the iframe.
 **/
export declare function allow(value: string): Attr;
/**
 * Alternative text in case an image can't be displayed.
 **/
export declare function alt(value: string): Attr;
/**
 * Identifies the currently active element when DOM focus is on a composite widget, textbox, group, or application.
 **/
export declare function ariaActiveDescendant(value: string): Attr;
/**
 * Indicates whether assistive technologies will present all, or only parts of, the changed region based on the change notifications defined by the aria-relevant attribute.
 **/
export declare function ariaAtomic(value: boolean): Attr;
/**
 * Indicates whether inputting text could trigger display of one or more predictions of the user's intended value for an input and specifies how predictions would be presented if they are made.
 **/
export declare function ariaAutoComplete(value: string): Attr;
/**
 * Indicates an element is being modified and that assistive technologies MAY want to wait until the modifications are complete before exposing them to the user.
 **/
export declare function ariaBusy(value: boolean): Attr;
/**
 * Indicates the current "checked" state of checkboxes, radio buttons, and other widgets. See related aria-pressed and aria-selected.
 **/
export declare function ariaChecked(value: boolean): Attr;
/**
 * Defines the total number of columns in a table, grid, or treegrid. See related aria-colindex.
  **/
export declare function ariaColCount(value: number): Attr;
/**
 * Defines an element's column index or position with respect to the total number of columns within a table, grid, or treegrid. See related aria-colcount and aria-colspan.
  **/
export declare function ariaColIndex(value: number): Attr;
/**
 * Defines the number of columns spanned by a cell or gridcell within a table, grid, or treegrid. See related aria-colindex and aria-rowspan.
  **/
export declare function ariaColSpan(value: number): Attr;
/**
 * Identifies the element (or elements) whose contents or presence are controlled by the current element. See related aria-owns.
  **/
export declare function ariaControls(value: string): Attr;
/**
 * Indicates the element that represents the current item within a container or set of related elements.
  **/
export declare function ariaCurrent(value: string): Attr;
/**
 * Identifies the element (or elements) that describes the object. See related aria-labelledby.
  **/
export declare function ariaDescribedBy(value: string): Attr;
/**
 * Identifies the element that provides a detailed, extended description for the object. See related aria-describedby.
  **/
export declare function ariaDetails(value: string): Attr;
/**
 * Indicates that the element is perceivable but disabled, so it is not editable or otherwise operable. See related aria-hidden and aria-readonly.
  **/
export declare function ariaDisabled(value: boolean): Attr;
/**
 * Identifies the element that provides an error message for the object. See related aria-invalid and aria-describedby.
  **/
export declare function ariaErrorMessage(value: string): Attr;
/**
 * Indicates whether the element, or another grouping element it controls, is currently expanded or collapsed.
 **/
export declare function ariaExpanded(value: boolean): Attr;
/**
 * Identifies the next element (or elements) in an alternate reading order of content which, at the user's discretion, allows assistive technology to override the general default of reading in document source order.
  **/
export declare function ariaFlowTo(value: string): Attr;
/**
 * Indicates the availability and type of interactive popup element, such as menu or dialog, that can be triggered by an element.
  **/
export declare function ariaHasPopup(value: string): Attr;
/**
 * Indicates whether the element is exposed to an accessibility API. See related aria-disabled.
 **/
export declare function ariaHidden(value: boolean): Attr;
/**
 * Indicates the entered value does not conform to the format expected by the application. See related aria-errormessage.
  **/
export declare function ariaInvalid(value: string): Attr;
/**
 * Indicates keyboard shortcuts that an author has implemented to activate or give focus to an element.
  **/
export declare function ariaKeyShortcuts(value: string): Attr;
/**
 * Defines a string value that labels the current element. See related aria-labelledby.
  **/
export declare function ariaLabel(value: string): Attr;
/**
 * Identifies the element (or elements) that labels the current element. See related aria-describedby.
  **/
export declare function ariaLabelledBy(value: string): Attr;
/**
 * Defines the hierarchical level of an element within a structure.
  **/
export declare function ariaLevel(value: number): Attr;
/**
 * Indicates that an element will be updated, and describes the types of updates the user agents, assistive technologies, and user can expect from the live region.
  **/
export declare function ariaLive(value: string): Attr;
/**
 * Indicates whether an element is modal when displayed
  **/
export declare function ariaModal(value: boolean): Attr;
/**
 * Indicates whether a text box accepts multiple lines of input or only a single line.
  **/
export declare function ariaMultiline(value: boolean): Attr;
/**
 * Indicates that the user may select more than one item from the current selectable descendants.
  **/
export declare function ariaMultiSelectable(value: boolean): Attr;
/**
 * Indicates that the user may select more than one item from the current selectable descendants.
  **/
export declare function ariaOrientation(value: string): Attr;
/**
 * Identifies an element (or elements) in order to define a visual, functional, or contextual parent/child relationship between DOM elements where the DOM hierarchy cannot be used to represent the relationship. See related aria-controls.
  **/
export declare function ariaOwns(value: string): Attr;
/**
 * Defines a short hint (a word or short phrase) intended to aid the user with data entry when the control has no value. A hint could be a sample value or a brief description of the expected format.
  **/
export declare function ariaPlaceholder(value: string): Attr;
/**
 * Defines an element's number or position in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM. See related aria-setsize.
  **/
export declare function ariaPosInSet(value: number): Attr;
/**
 * Indicates the current "pressed" state of toggle buttons. See related aria-checked and aria-selected.
 **/
export declare function ariaPressed(value: boolean): Attr;
/**
 * Indicates that the element is not editable, but is otherwise operable. See related aria-disabled.
  **/
export declare function ariaReadOnly(value: boolean): Attr;
/**
 * Indicates what notifications the user agent will trigger when the accessibility tree within a live region is modified. See related aria-atomic.
  **/
export declare function ariaRelevant(value: string): Attr;
/**
 * Indicates that user input is required on the element before a form may be submitted.
  **/
export declare function ariaRequired(value: boolean): Attr;
/**
 * Defines a human-readable, author-localized description for the role of an element.
  **/
export declare function ariaRoleDescription(value: string): Attr;
/**
 * Defines the total number of rows in a table, grid, or treegrid. See related aria-rowindex.
  **/
export declare function ariaRowCount(value: number): Attr;
/**
 * Defines an element's row index or position with respect to the total number of rows within a table, grid, or treegrid. See related aria-rowcount and aria-rowspan.
  **/
export declare function ariaRowIndex(value: number): Attr;
/**
 Defines the number of rows spanned by a cell or gridcell within a table, grid, or treegrid. See related aria-rowindex and aria-colspan.
  **/
export declare function ariaRowSpan(value: number): Attr;
/**
 * Indicates the current "selected" state of various widgets. See related aria-checked and aria-pressed.
 **/
export declare function ariaSelected(value: boolean): Attr;
/**
 * Defines the number of items in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM. See related aria-posinset.
  **/
export declare function ariaSetSize(value: number): Attr;
/**
 * Indicates if items in a table or grid are sorted in ascending or descending order.
  **/
export declare function ariaSort(value: string): Attr;
/**
 * Defines the maximum allowed value for a range widget.
  **/
export declare function ariaValueMax(value: number): Attr;
/**
 * Defines the minimum allowed value for a range widget.
  **/
export declare function ariaValueMin(value: number): Attr;
/**
 * Defines the current value for a range widget. See related aria-valuetext.
  **/
export declare function ariaValueNow(value: number): Attr;
/**
 * Defines the human readable text alternative of aria-valuenow for a range widget.
  **/
export declare function ariaValueText(value: string): Attr;
/**
 * Executes the script asynchronously.
  **/
export declare function async(value: string): Attr;
/**
 * Sets whether input is automatically capitalized when entered by user
  **/
export declare function autoCapitalize(value: boolean): Attr;
/**
 * Indicates whether controls in this form can by default have their values automatically completed by the browser.
  **/
export declare function autoComplete(value: boolean): Attr;
/**
 * The element should be automatically focused after the page loaded.
  **/
export declare function autoFocus(value: boolean): Attr;
/**
 * The audio or video should play as soon as possible.
  **/
export declare function autoPlay(value: boolean): Attr;
/**
 * Contains the time range of already buffered media.
  **/
export declare function buffered(value: boolean): Attr;
/**
 * From the HTML Media Capture
  **/
export declare function capture(value: boolean): Attr;
/**
 * Declares the character encoding of the page or script.
  **/
export declare function charSet(value: string): Attr;
/**
 * Indicates whether the element should be checked on page load.
  **/
export declare function checked(value: boolean): Attr;
/**
 * Contains a URI which points to the source of the quote or change.
  **/
export declare function cite(value: string): Attr;
/**
 * Often used with CSS to style elements with common properties.
  **/
export declare function className(value: string): Attr;
/**
 * Specifies the URL of the applet's class file to be loaded and executed.
  **/
export declare function code(value: string): Attr;
/**
 * This attribute gives the absolute or relative URL of the directory where applets' .class files referenced by the code attribute are stored.
  **/
export declare function codeBase(value: string): Attr;
/**
 * Defines the number of columns in a textarea.
  **/
export declare function cols(value: number): Attr;
/**
 * The colspan attribute defines the number of columns a cell should span.
  **/
export declare function colSpan(value: number): Attr;
/**
 * A value associated with http-equiv or name depending on the context.
  **/
export declare function content(value: string): Attr;
/**
 * Indicates whether the element's content is editable.
  **/
export declare function contentEditable(value: string): Attr;
/**
 * Defines the ID of a <menu> element which will serve as the element's context menu.
  **/
export declare function contextMenu(value: string): Attr;
/**
 * Indicates whether the browser should show playback controls to the user.
  **/
export declare function controls(value: boolean): Attr;
/**
 * A set of values specifying the coordinates of the hot-spot region.
  **/
export declare function coords(value: string): Attr;
/**
 * How the element handles cross-origin requests
  **/
export declare function crossOrigin(value: string): Attr;
/**
 * Specifies the Content Security Policy that an embedded document must agree to enforce upon itself.
  **/
export declare function csp(value: string): Attr;
/**
 * Specifies the URL of the resource.
  **/
export declare function data(value: string): Attr;
/**
 * Lets you attach custom attributes to an HTML element.
 */
export declare function customData(name: string, value: any): Attr;
/**
 * Indicates the date and time associated with the element.
  **/
export declare function dateTime(value: Date): Attr;
/**
 * Indicates the preferred method to decode the image.
  **/
export declare function decoding(value: string): Attr;
/**
 * Indicates that the track should be enabled unless the user's preferences indicate something different.
  **/
export declare function defaultValue(value: string): Attr;
/**
 * Indicates that the script should be executed after the page has been parsed.
  **/
export declare function defer(value: boolean): Attr;
/**
 * Defines the text direction. Allowed values are ltr (Left-To-Right) or rtl (Right-To-Left)
  **/
export declare function dir(value: string): Attr;
/**
 * Indicates whether the user can interact with the element.
  **/
export declare function disabled(value: boolean): Attr;
/**
 * ???
  **/
export declare function dirName(value: string): Attr;
/**
 * Indicates that the hyperlink is to be used for downloading a resource.
  **/
export declare function download(value: boolean): Attr;
/**
 * Defines whether the element can be dragged.
  **/
export declare function draggable(value: boolean): Attr;
/**
 * Indicates that the element accepts the dropping of content onto it.
  **/
export declare function dropZone(value: string): Attr;
/**
 * Defines the content type of the form data when the method is POST.
  **/
export declare function encType(value: string): Attr;
/**
 * The enterkeyhint specifies what action label (or icon) to present for the enter key on virtual keyboards. The attribute can be used with form controls (such as the value of textarea elements), or in elements in an editing host (e.g., using contenteditable attribute).
  **/
export declare function enterKeyHint(value: string): Attr;
/**
 * Describes elements which belongs to this one.
  **/
export declare function htmlFor(value: string): Attr;
/**
 * Indicates the form that is the owner of the element.
  **/
export declare function form(value: string): Attr;
/**
 * Indicates the action of the element, overriding the action defined in the <form>.
  **/
export declare function formAction(value: string): Attr;
/**
 * If the button/input is a submit button (type="submit"), this attribute sets the encoding type to use during form submission. If this attribute is specified, it overrides the enctype attribute of the button's form owner.
  **/
export declare function formEncType(value: string): Attr;
/**
 * If the button/input is a submit button (type="submit"), this attribute sets the submission method to use during form submission (GET, POST, etc.). If this attribute is specified, it overrides the method attribute of the button's form owner.
  **/
export declare function formMethod(value: string): Attr;
/**
 * If the button/input is a submit button (type="submit"), this boolean attribute specifies that the form is not to be validated when it is submitted. If this attribute is specified, it overrides the novalidate attribute of the button's form owner.
  **/
export declare function formNoValidate(value: boolean): Attr;
/**
 * If the button/input is a submit button (type="submit"), this attribute specifies the browsing context (for example, tab, window, or inline frame) in which to display the response that is received after submitting the form. If this attribute is specified, it overrides the target attribute of the button's form owner.
  **/
export declare function formTarget(value: string): Attr;
/**
 * IDs of the <th> elements which applies to this element.
  **/
export declare function headers(value: string): Attr;
/**
 * Specifies the height of elements listed here. For all other elements, use the CSS height property.
  **/
export declare function height(value: number | string): Attr;
/**
 * Prevents rendering of given element, while keeping child elements, e.g. script elements, active.
  **/
export declare function hidden(value: boolean): Attr;
/**
 * Indicates the lower bound of the upper range.
  **/
export declare function high(value: number): Attr;
/**
 * The URL of a linked resource.
  **/
export declare function href(value: string): Attr;
/**
 * Specifies the language of the linked resource.
  **/
export declare function hrefLang(value: string): Attr;
/**
 * Defines a pragma directive.
  **/
export declare function httpEquiv(value: string): Attr;
/**
 * Specifies a picture which represents the command.
  **/
export declare function icon(value: string): Attr;
/**
 * Often used with CSS to style a specific element. The value of this attribute must be unique.
  **/
export declare function id(value: string): Attr;
/**
 * Indicates the relative fetch priority for the resource.
  **/
export declare function importance(value: string): Attr;
/**
 * Provides a hint as to the type of data that might be entered by the user while editing the element or its contents. The attribute can be used with form controls (such as the value of textarea elements), or in elements in an editing host (e.g., using contenteditable attribute).
  **/
export declare function inputMode(value: string): Attr;
/**
 * Specifies a Subresource Integrity value that allows browsers to verify what they fetch.
  **/
export declare function integrity(value: string): Attr;
/**
 * This attribute tells the browser to ignore the actual intrinsic size of the image and pretend it’s the size specified in the attribute.
  **/
export declare function intrinsicSize(value: string): Attr;
/**
 * Indicates that the image is part of a server-side image map.
  **/
export declare function isMap(value: boolean): Attr;
/**
 * Specifies the type of key generated.
  **/
export declare function keyType(value: string): Attr;
/**
 * The itemprop attribute
  **/
export declare function itemProp(value: string): Attr;
/**
 * Specifies the kind of text track.
  **/
export declare function kind(value: string): Attr;
/**
 * Specifies a user-readable title of the element.
  **/
export declare function label(value: string): Attr;
/**
 * Defines the language used in the element.
  **/
export declare function lang(value: string): Attr;
/**
 * Defines the script language used in the element.
  **/
export declare function language(value: string): Attr;
/**
 * Identifies a list of pre-defined options to suggest to the user.
  **/
export declare function list(value: string): Attr;
/**
 * Indicates whether the media should start playing from the start when it's finished.
  **/
export declare function loop(value: boolean): Attr;
/**
 * Indicates the upper bound of the lower range.
  **/
export declare function low(value: number): Attr;
/**
 * Indicates the maximum value allowed.
  **/
export declare function max(value: number): Attr;
/**
 * Defines the maximum number of characters allowed in the element.
  **/
export declare function maxLength(value: number): Attr;
/**
 * Defines the minimum number of characters allowed in the element.
  **/
export declare function minLength(value: number): Attr;
/**
 * Specifies a hint of the media for which the linked resource was designed.
  **/
export declare function media(value: string): Attr;
/**
 * Defines which HTTP method to use when submitting the form. Can be GET (default) or POST.
  **/
export declare function method(value: string): Attr;
/**
 * Indicates the minimum value allowed.
  **/
export declare function min(value: number): Attr;
/**
 * Indicates whether multiple values can be entered in an input of the type email or file.
  **/
export declare function multiple(value: boolean): Attr;
/**
 * Indicates whether the audio will be initially silenced on page load.
  **/
export declare function muted(value: boolean): Attr;
/**
 * Name of the element. For example used by the server to identify the fields in form submits.
  **/
export declare function name(value: string): Attr;
/**
 * This attribute indicates that the form shouldn't be validated when submitted.
  **/
export declare function noValidate(value: boolean): Attr;
/**
 * Indicates whether the details will be shown on page load.
  **/
export declare function open(value: string): Attr;
/**
 * Indicates the optimal numeric value.
  **/
export declare function optimum(value: number): Attr;
/**
 * Defines a regular expression which the element's value will be validated against.
  **/
export declare function pattern(value: string): Attr;
/**
 * The ping attribute specifies a space-separated list of URLs to be notified if a user follows the hyperlink.
  **/
export declare function ping(value: string): Attr;
/**
 * Provides a hint to the user of what can be entered in the field.
  **/
export declare function placeHolder(value: string): Attr;
/**
 * Indicates that the media element should play automatically on iOS.
  **/
export declare function playsInline(value: boolean): Attr;
/**
 * A URL indicating a poster frame to show until the user plays or seeks.
  **/
export declare function poster(value: string): Attr;
/**
 * Indicates whether the whole resource, parts of it or nothing should be preloaded.
  **/
export declare function preload(value: boolean): Attr;
/**
 * Indicates whether the element can be edited.
  **/
export declare function readOnly(value: boolean): Attr;
/**
 * The radiogroup attribute
  **/
export declare function radioGroup(value: string): Attr;
/**
 * Specifies which referrer is sent when fetching the resource.
  **/
export declare function referrerPolicy(value: string): Attr;
/**
 * Specifies the relationship of the target object to the link object.
  **/
export declare function rel(value: string): Attr;
/**
 * Indicates whether this element is required to fill out or not.
  **/
export declare function required(value: boolean): Attr;
/**
 * Indicates whether the list should be displayed in a descending order instead of a ascending.
  **/
export declare function reversed(value: boolean): Attr;
/**
 * Defines the number of rows in a text area.
  **/
export declare function role(value: string): Attr;
/**
 * The rows attribute
  **/
export declare function rows(value: number): Attr;
/**
 * Defines the number of rows a table cell should span over.
  **/
export declare function rowSpan(value: number): Attr;
/**
 * Stops a document loaded in an iframe from using certain features (such as submitting forms or opening new windows).
  **/
export declare function sandbox(value: string): Attr;
/**
 * Defines the cells that the header test (defined in the th element) relates to.
  **/
export declare function scope(value: string): Attr;
/**
 * The scoped attribute
  **/
export declare function scoped(value: boolean): Attr;
/**
 * Defines a value which will be selected on page load.
  **/
export declare function selected(value: boolean): Attr;
/**
 * The shape attribute
  **/
export declare function shape(value: string): Attr;
/**
 * Defines the width of the element (in pixels). If the element's type attribute is text or password then it's the number of characters.
  **/
export declare function size(value: number): Attr;
/**
 * Assigns a slot in a shadow DOM shadow tree to an element.
  **/
export declare function slot(value: string): Attr;
/**
 * The sizes attribute
  **/
export declare function sizes(value: string): Attr;
/**
 * The span attribute
  **/
export declare function span(value: string): Attr;
/**
 * Indicates whether spell checking is allowed for the element.
  **/
export declare function spellCheck(value: boolean): Attr;
/**
 * The URL of the embeddable content.
  **/
export declare function src(value: string): Attr;
/**
 * The srcdoc attribute
  **/
export declare function srcDoc(value: string): Attr;
/**
 * The srclang attribute
  **/
export declare function srcLang(value: string): Attr;
/**
 * A MediaStream object to use as a source for an HTML video or audio element
  **/
export declare function srcObject(value: MediaProvider): Attr;
/**
 * One or more responsive image candidates.
  **/
export declare function srcSet(value: string): Attr;
/**
 * Defines the first number if other than 1.
  **/
export declare function start(value: number): Attr;
/**
 * Defines CSS styles which will override styles previously set.
 *
 * NOTE: DO NOT USE THIS. You should use `styles()` instead.
 **/
export declare function __deprecated__style__deprecated__(value: any): Attr;
/**
 * The step attribute
  **/
export declare function step(value: number): Attr;
/**
 * The summary attribute
  **/
export declare function summary(value: string): Attr;
/**
 * Overrides the browser's default tab order and follows the one specified instead.
  **/
export declare function tabIndex(value: number): Attr;
/**
 * Text to be displayed in a tooltip when hovering over the element.
  **/
export declare function title(value: string): Attr;
/**
 * The target attribute
  **/
export declare function target(value: string): Attr;
/**
 * Specify whether an element’s attribute values and the values of its Text node children are to be translated when the page is localized, or whether to leave them unchanged.
  **/
export declare function translate(value: boolean): Attr;
/**
 * Defines the type of the element.
  **/
export declare function type(value: string): Attr;
/**
 * Defines a default value which will be displayed in the element on page load.
  **/
export declare function value(value: string): Attr;
/**
 * setting the volume at which a media element plays.
  **/
export declare function volume(value: number): Attr;
/**
 * The usemap attribute
  **/
export declare function useMap(value: boolean): Attr;
/**
 * For the elements listed here, this establishes the element's width.
  **/
export declare function width(value: number | string): Attr;
/**
 * Indicates whether the text should be wrapped.
  **/
export declare function wrap(value: boolean): Attr;
export declare class CssPropSet implements IAppliable {
    set: Map<string, string>;
    constructor(...rest: (Attr | CssPropSet)[]);
    /**
     * Set the attribute value on an HTMLElement
     * @param elem - the element on which to set the attribute.
     */
    apply(elem: HTMLElement | CSSStyleDeclaration): void;
}
/**
 * Combine style properties.
 **/
export declare function styles(...rest: (Attr | CssPropSet)[]): CssPropSet;
export declare function alignContent(v: string): Attr;
export declare function alignItems(v: string): Attr;
export declare function alignSelf(v: string): Attr;
export declare function alignmentBaseline(v: string): Attr;
export declare function all(v: string): Attr;
export declare function animation(v: string): Attr;
export declare function animationDelay(v: string): Attr;
export declare function animationDirection(v: string): Attr;
export declare function animationDuration(v: string): Attr;
export declare function animationFillMode(v: string): Attr;
export declare function animationIterationCount(v: string): Attr;
export declare function animationName(v: string): Attr;
export declare function animationPlayState(v: string): Attr;
export declare function animationTimingFunction(v: string): Attr;
export declare function appearance(v: string): Attr;
export declare function backdropFilter(v: string): Attr;
export declare function backfaceVisibility(v: string): Attr;
export declare function background(v: string): Attr;
export declare function backgroundAttachment(v: string): Attr;
export declare function backgroundBlendMode(v: string): Attr;
export declare function backgroundClip(v: string): Attr;
export declare function backgroundColor(v: string): Attr;
export declare function backgroundImage(v: string): Attr;
export declare function backgroundOrigin(v: string): Attr;
export declare function backgroundPosition(v: string): Attr;
export declare function backgroundPositionX(v: string): Attr;
export declare function backgroundPositionY(v: string): Attr;
export declare function backgroundRepeat(v: string): Attr;
export declare function backgroundRepeatX(v: string): Attr;
export declare function backgroundRepeatY(v: string): Attr;
export declare function backgroundSize(v: string): Attr;
export declare function baselineShift(v: string): Attr;
export declare function blockSize(v: string): Attr;
export declare function border(v: string): Attr;
export declare function borderBlockEnd(v: string): Attr;
export declare function borderBlockEndColor(v: string): Attr;
export declare function borderBlockEndStyle(v: string): Attr;
export declare function borderBlockEndWidth(v: string): Attr;
export declare function borderBlockStart(v: string): Attr;
export declare function borderBlockStartColor(v: string): Attr;
export declare function borderBlockStartStyle(v: string): Attr;
export declare function borderBlockStartWidth(v: string): Attr;
export declare function borderBottom(v: string): Attr;
export declare function borderBottomColor(v: string): Attr;
export declare function borderBottomLeftRadius(v: string): Attr;
export declare function borderBottomRightRadius(v: string): Attr;
export declare function borderBottomStyle(v: string): Attr;
export declare function borderBottomWidth(v: string): Attr;
export declare function borderCollapse(v: string): Attr;
export declare function borderColor(v: string): Attr;
export declare function borderImage(v: string): Attr;
export declare function borderImageOutset(v: string): Attr;
export declare function borderImageRepeat(v: string): Attr;
export declare function borderImageSlice(v: string): Attr;
export declare function borderImageSource(v: string): Attr;
export declare function borderImageWidth(v: string): Attr;
export declare function borderInlineEnd(v: string): Attr;
export declare function borderInlineEndColor(v: string): Attr;
export declare function borderInlineEndStyle(v: string): Attr;
export declare function borderInlineEndWidth(v: string): Attr;
export declare function borderInlineStart(v: string): Attr;
export declare function borderInlineStartColor(v: string): Attr;
export declare function borderInlineStartStyle(v: string): Attr;
export declare function borderInlineStartWidth(v: string): Attr;
export declare function borderLeft(v: string): Attr;
export declare function borderLeftColor(v: string): Attr;
export declare function borderLeftStyle(v: string): Attr;
export declare function borderLeftWidth(v: string): Attr;
export declare function borderRadius(v: string): Attr;
export declare function borderRight(v: string): Attr;
export declare function borderRightColor(v: string): Attr;
export declare function borderRightStyle(v: string): Attr;
export declare function borderRightWidth(v: string): Attr;
export declare function borderSpacing(v: string): Attr;
export declare function borderStyle(v: string): Attr;
export declare function borderTop(v: string): Attr;
export declare function borderTopColor(v: string): Attr;
export declare function borderTopLeftRadius(v: string): Attr;
export declare function borderTopRightRadius(v: string): Attr;
export declare function borderTopStyle(v: string): Attr;
export declare function borderTopWidth(v: string): Attr;
export declare function borderWidth(v: string): Attr;
export declare function bottom(v: string): Attr;
export declare function boxShadow(v: string): Attr;
export declare function boxSizing(v: string): Attr;
export declare function breakAfter(v: string): Attr;
export declare function breakBefore(v: string): Attr;
export declare function breakInside(v: string): Attr;
export declare function bufferedRendering(v: string): Attr;
export declare function captionSide(v: string): Attr;
export declare function caretColor(v: string): Attr;
export declare function clear(v: string): Attr;
export declare function clip(v: string): Attr;
export declare function clipPath(v: string): Attr;
export declare function clipRule(v: string): Attr;
export declare function color(v: string): Attr;
export declare function colorInterpolation(v: string): Attr;
export declare function colorInterpolationFilters(v: string): Attr;
export declare function colorRendering(v: string): Attr;
export declare function colorScheme(v: string): Attr;
export declare function columnCount(v: string): Attr;
export declare function columnFill(v: string): Attr;
export declare function columnGap(v: string): Attr;
export declare function columnRule(v: string): Attr;
export declare function columnRuleColor(v: string): Attr;
export declare function columnRuleStyle(v: string): Attr;
export declare function columnRuleWidth(v: string): Attr;
export declare function columnSpan(v: string): Attr;
export declare function columnWidth(v: string): Attr;
export declare function columns(v: string): Attr;
export declare function contain(v: string): Attr;
export declare function containIntrinsicSize(v: string): Attr;
export declare function counterIncrement(v: string): Attr;
export declare function counterReset(v: string): Attr;
export declare function cursor(v: string): Attr;
export declare function cx(v: string): Attr;
export declare function cy(v: string): Attr;
export declare function d(v: string): Attr;
export declare function direction(v: string): Attr;
export declare function display(v: string): Attr;
export declare function dominantBaseline(v: string): Attr;
export declare function emptyCells(v: string): Attr;
export declare function fill(v: string): Attr;
export declare function fillOpacity(v: string): Attr;
export declare function fillRule(v: string): Attr;
export declare function filter(v: string): Attr;
export declare function flex(v: string): Attr;
export declare function flexBasis(v: string): Attr;
export declare function flexDirection(v: string): Attr;
export declare function flexFlow(v: string): Attr;
export declare function flexGrow(v: string): Attr;
export declare function flexShrink(v: string): Attr;
export declare function flexWrap(v: string): Attr;
export declare function float(v: string): Attr;
export declare function floodColor(v: string): Attr;
export declare function floodOpacity(v: string): Attr;
export declare function font(v: string): Attr;
export declare function fontDisplay(v: string): Attr;
export declare function fontFamily(v: string): Attr;
export declare function fontFeatureSettings(v: string): Attr;
export declare function fontKerning(v: string): Attr;
export declare function fontOpticalSizing(v: string): Attr;
export declare function fontSize(v: string): Attr;
export declare function fontStretch(v: string): Attr;
export declare function fontStyle(v: string): Attr;
export declare function fontVariant(v: string): Attr;
export declare function fontVariantCaps(v: string): Attr;
export declare function fontVariantEastAsian(v: string): Attr;
export declare function fontVariantLigatures(v: string): Attr;
export declare function fontVariantNumeric(v: string): Attr;
export declare function fontVariationSettings(v: string): Attr;
export declare function fontWeight(v: string): Attr;
export declare function forcedColorAdjust(v: string): Attr;
export declare function gap(v: string): Attr;
export declare function grid(v: string): Attr;
export declare function gridArea(v: string): Attr;
export declare function gridAutoColumns(v: string): Attr;
export declare function gridAutoFlow(v: string): Attr;
export declare function gridAutoRows(v: string): Attr;
export declare function gridColumn(v: string): Attr;
export declare function gridColumnEnd(v: string): Attr;
export declare function gridColumnGap(v: string): Attr;
export declare function gridColumnStart(v: string): Attr;
export declare function gridGap(v: string): Attr;
export declare function gridRow(v: string): Attr;
export declare function gridRowEnd(v: string): Attr;
export declare function gridRowGap(v: string): Attr;
export declare function gridRowStart(v: string): Attr;
export declare function gridTemplate(v: string): Attr;
export declare function gridTemplateAreas(v: string): Attr;
export declare function gridTemplateColumns(v: string): Attr;
export declare function gridTemplateRows(v: string): Attr;
export declare function hyphens(v: string): Attr;
export declare function imageOrientation(v: string): Attr;
export declare function imageRendering(v: string): Attr;
export declare function inlineSize(v: string): Attr;
export declare function isolation(v: string): Attr;
export declare function justifyContent(v: string): Attr;
export declare function justifyItems(v: string): Attr;
export declare function justifySelf(v: string): Attr;
export declare function left(v: string): Attr;
export declare function letterSpacing(v: string): Attr;
export declare function lightingColor(v: string): Attr;
export declare function lineBreak(v: string): Attr;
export declare function lineHeight(v: string): Attr;
export declare function listStyle(v: string): Attr;
export declare function listStyleImage(v: string): Attr;
export declare function listStylePosition(v: string): Attr;
export declare function listStyleType(v: string): Attr;
export declare function margin(v: string): Attr;
export declare function marginBlockEnd(v: string): Attr;
export declare function marginBlockStart(v: string): Attr;
export declare function marginBottom(v: string): Attr;
export declare function marginInlineEnd(v: string): Attr;
export declare function marginInlineStart(v: string): Attr;
export declare function marginLeft(v: string): Attr;
export declare function marginRight(v: string): Attr;
export declare function marginTop(v: string): Attr;
export declare function marker(v: string): Attr;
export declare function markerEnd(v: string): Attr;
export declare function markerMid(v: string): Attr;
export declare function markerStart(v: string): Attr;
export declare function mask(v: string): Attr;
export declare function maskType(v: string): Attr;
export declare function maxBlockSize(v: string): Attr;
export declare function maxHeight(v: string): Attr;
export declare function maxInlineSize(v: string): Attr;
export declare function maxWidth(v: string): Attr;
export declare function maxZoom(v: string): Attr;
export declare function minBlockSize(v: string): Attr;
export declare function minHeight(v: string): Attr;
export declare function minInlineSize(v: string): Attr;
export declare function minWidth(v: string): Attr;
export declare function minZoom(v: string): Attr;
export declare function mixBlendMode(v: string): Attr;
export declare function objectFit(v: string): Attr;
export declare function objectPosition(v: string): Attr;
export declare function offset(v: string): Attr;
export declare function offsetDistance(v: string): Attr;
export declare function offsetPath(v: string): Attr;
export declare function offsetRotate(v: string): Attr;
export declare function opacity(v: string): Attr;
export declare function order(v: string): Attr;
export declare function orientation(v: string): Attr;
export declare function orphans(v: string): Attr;
export declare function outline(v: string): Attr;
export declare function outlineColor(v: string): Attr;
export declare function outlineOffset(v: string): Attr;
export declare function outlineStyle(v: string): Attr;
export declare function outlineWidth(v: string): Attr;
export declare function overflow(v: string): Attr;
export declare function overflowAnchor(v: string): Attr;
export declare function overflowWrap(v: string): Attr;
export declare function overflowX(v: string): Attr;
export declare function overflowY(v: string): Attr;
export declare function overscrollBehavior(v: string): Attr;
export declare function overscrollBehaviorBlock(v: string): Attr;
export declare function overscrollBehaviorInline(v: string): Attr;
export declare function overscrollBehaviorX(v: string): Attr;
export declare function overscrollBehaviorY(v: string): Attr;
export declare function padding(v: string): Attr;
export declare function paddingBlockEnd(v: string): Attr;
export declare function paddingBlockStart(v: string): Attr;
export declare function paddingBottom(v: string): Attr;
export declare function paddingInlineEnd(v: string): Attr;
export declare function paddingInlineStart(v: string): Attr;
export declare function paddingLeft(v: string): Attr;
export declare function paddingRight(v: string): Attr;
export declare function paddingTop(v: string): Attr;
export declare function pageBreakAfter(v: string): Attr;
export declare function pageBreakBefore(v: string): Attr;
export declare function pageBreakInside(v: string): Attr;
export declare function paintOrder(v: string): Attr;
export declare function perspective(v: string): Attr;
export declare function perspectiveOrigin(v: string): Attr;
export declare function placeContent(v: string): Attr;
export declare function placeItems(v: string): Attr;
export declare function placeSelf(v: string): Attr;
export declare function pointerEvents(v: string): Attr;
export declare function position(v: string): Attr;
export declare function quotes(v: string): Attr;
export declare function r(v: string): Attr;
export declare function resize(v: string): Attr;
export declare function right(v: string): Attr;
export declare function rowGap(v: string): Attr;
export declare function rubyPosition(v: string): Attr;
export declare function rx(v: string): Attr;
export declare function ry(v: string): Attr;
export declare function scrollBehavior(v: string): Attr;
export declare function scrollMargin(v: string): Attr;
export declare function scrollMarginBlock(v: string): Attr;
export declare function scrollMarginBlockEnd(v: string): Attr;
export declare function scrollMarginBlockStart(v: string): Attr;
export declare function scrollMarginBottom(v: string): Attr;
export declare function scrollMarginInline(v: string): Attr;
export declare function scrollMarginInlineEnd(v: string): Attr;
export declare function scrollMarginInlineStart(v: string): Attr;
export declare function scrollMarginLeft(v: string): Attr;
export declare function scrollMarginRight(v: string): Attr;
export declare function scrollMarginTop(v: string): Attr;
export declare function scrollPadding(v: string): Attr;
export declare function scrollPaddingBlock(v: string): Attr;
export declare function scrollPaddingBlockEnd(v: string): Attr;
export declare function scrollPaddingBlockStart(v: string): Attr;
export declare function scrollPaddingBottom(v: string): Attr;
export declare function scrollPaddingInline(v: string): Attr;
export declare function scrollPaddingInlineEnd(v: string): Attr;
export declare function scrollPaddingInlineStart(v: string): Attr;
export declare function scrollPaddingLeft(v: string): Attr;
export declare function scrollPaddingRight(v: string): Attr;
export declare function scrollPaddingTop(v: string): Attr;
export declare function scrollSnapAlign(v: string): Attr;
export declare function scrollSnapStop(v: string): Attr;
export declare function scrollSnapType(v: string): Attr;
export declare function shapeImageThreshold(v: string): Attr;
export declare function shapeMargin(v: string): Attr;
export declare function shapeOutside(v: string): Attr;
export declare function shapeRendering(v: string): Attr;
export declare function speak(v: string): Attr;
export declare function stopColor(v: string): Attr;
export declare function stopOpacity(v: string): Attr;
export declare function stroke(v: string): Attr;
export declare function strokeDasharray(v: string): Attr;
export declare function strokeDashoffset(v: string): Attr;
export declare function strokeLinecap(v: string): Attr;
export declare function strokeLinejoin(v: string): Attr;
export declare function strokeMiterlimit(v: string): Attr;
export declare function strokeOpacity(v: string): Attr;
export declare function strokeWidth(v: string): Attr;
export declare function tabSize(v: string): Attr;
export declare function tableLayout(v: string): Attr;
export declare function textAlign(v: string): Attr;
export declare function textAlignLast(v: string): Attr;
export declare function textAnchor(v: string): Attr;
export declare function textCombineUpright(v: string): Attr;
export declare function textDecoration(v: string): Attr;
export declare function textDecorationColor(v: string): Attr;
export declare function textDecorationLine(v: string): Attr;
export declare function textDecorationSkipInk(v: string): Attr;
export declare function textDecorationStyle(v: string): Attr;
export declare function textIndent(v: string): Attr;
export declare function textOrientation(v: string): Attr;
export declare function textOverflow(v: string): Attr;
export declare function textRendering(v: string): Attr;
export declare function textShadow(v: string): Attr;
export declare function textSizeAdjust(v: string): Attr;
export declare function textTransform(v: string): Attr;
export declare function textUnderlinePosition(v: string): Attr;
export declare function top(v: string): Attr;
export declare function touchAction(v: string): Attr;
export declare function transform(v: string): Attr;
export declare function transformBox(v: string): Attr;
export declare function transformOrigin(v: string): Attr;
export declare function transformStyle(v: string): Attr;
export declare function transition(v: string): Attr;
export declare function transitionDelay(v: string): Attr;
export declare function transitionDuration(v: string): Attr;
export declare function transitionProperty(v: string): Attr;
export declare function transitionTimingFunction(v: string): Attr;
export declare function unicodeBidi(v: string): Attr;
export declare function unicodeRange(v: string): Attr;
export declare function userSelect(v: string): Attr;
export declare function userZoom(v: string): Attr;
export declare function vectorEffect(v: string): Attr;
export declare function verticalAlign(v: string): Attr;
export declare function visibility(v: string): Attr;
export declare function whiteSpace(v: string): Attr;
export declare function widows(v: string): Attr;
export declare function willChange(v: string): Attr;
export declare function wordBreak(v: string): Attr;
export declare function wordSpacing(v: string): Attr;
export declare function wordWrap(v: string): Attr;
export declare function writingMode(v: string): Attr;
export declare function x(v: string): Attr;
export declare function y(v: string): Attr;
export declare function zIndex(v: number): Attr;
export declare function zoom(v: number): Attr;
/**
 * A selection of fonts for preferred monospace rendering.
 **/
export declare const monospaceFonts = "'Droid Sans Mono', 'Consolas', 'Lucida Console', 'Courier New', 'Courier', monospace";
/**
 * A selection of fonts for preferred monospace rendering.
 **/
export declare const monospaceFamily: Attr;
/**
 * A selection of fonts that should match whatever the user's operating system normally uses.
 **/
export declare const systemFonts = "-apple-system, '.SFNSText-Regular', 'San Francisco', 'Roboto', 'Segoe UI', 'Helvetica Neue', 'Lucida Grande', sans-serif";
/**
 * A selection of fonts that should match whatever the user's operating system normally uses.
 **/
export declare const systemFamily: Attr;
