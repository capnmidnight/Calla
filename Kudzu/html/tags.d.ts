import { IAppliable } from "./attrs";
interface HasNode {
    element: HTMLElement;
}
declare type makesIAppliable = (v: any) => IAppliable;
export declare type TagChild = Node | HasNode | IAppliable | makesIAppliable | string | number | boolean | Date;
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
export declare function tag(name: string, ...rest: TagChild[]): HTMLElement;
/**
 * Empty an element of all children. This is faster than setting `innerHTML = ""`.
 */
export declare function elementClearChildren(elem: HTMLElement): void;
export declare function elementSetText(elem: HTMLElement, text: string): void;
export declare type HTMLAudioElementWithSinkID = HTMLAudioElement & {
    sinkId: string;
    setSinkId(id: string): Promise<void>;
};
export declare function A(...rest: TagChild[]): HTMLAnchorElement;
export declare function Abbr(...rest: TagChild[]): HTMLElement;
export declare function Address(...rest: TagChild[]): HTMLElement;
export declare function Area(...rest: TagChild[]): HTMLAreaElement;
export declare function Article(...rest: TagChild[]): HTMLElement;
export declare function Aside(...rest: TagChild[]): HTMLElement;
export declare function Audio(...rest: TagChild[]): HTMLAudioElementWithSinkID;
export declare function B(...rest: TagChild[]): HTMLElement;
export declare function Base(...rest: TagChild[]): HTMLBaseElement;
export declare function BDI(...rest: TagChild[]): HTMLElement;
export declare function BDO(...rest: TagChild[]): HTMLElement;
export declare function BlockQuote(...rest: TagChild[]): HTMLQuoteElement;
export declare function Body(...rest: TagChild[]): HTMLBodyElement;
export declare function BR(): HTMLBRElement;
export declare function ButtonRaw(...rest: TagChild[]): HTMLButtonElement;
export declare function Button(...rest: TagChild[]): HTMLButtonElement;
export declare function ButtonSubmit(...rest: TagChild[]): HTMLButtonElement;
export declare function ButtonReset(...rest: TagChild[]): HTMLButtonElement;
export declare function Canvas(...rest: TagChild[]): HTMLCanvasElement;
export declare function Caption(...rest: TagChild[]): HTMLTableCaptionElement;
export declare function Cite(...rest: TagChild[]): HTMLElement;
export declare function Code(...rest: TagChild[]): HTMLElement;
export declare function Col(...rest: TagChild[]): HTMLTableColElement;
export declare function ColGroup(...rest: TagChild[]): HTMLTableColElement;
export declare function Data(...rest: TagChild[]): HTMLDataElement;
export declare function DataList(...rest: TagChild[]): HTMLDataListElement;
export declare function DD(...rest: TagChild[]): HTMLElement;
export declare function Del(...rest: TagChild[]): HTMLModElement;
export declare function Details(...rest: TagChild[]): HTMLDetailsElement;
export declare function DFN(...rest: TagChild[]): HTMLElement;
export declare function Dialog(...rest: TagChild[]): HTMLDialogElement;
export declare function Dir(...rest: TagChild[]): HTMLDirectoryElement;
export declare function Div(...rest: TagChild[]): HTMLDivElement;
export declare function DL(...rest: TagChild[]): HTMLDListElement;
export declare function DT(...rest: TagChild[]): HTMLElement;
export declare function Em(...rest: TagChild[]): HTMLElement;
export declare function Embed(...rest: TagChild[]): HTMLEmbedElement;
export declare function FieldSet(...rest: TagChild[]): HTMLFieldSetElement;
export declare function FigCaption(...rest: TagChild[]): HTMLElement;
export declare function Figure(...rest: TagChild[]): HTMLElement;
export declare function Footer(...rest: TagChild[]): HTMLElement;
export declare function Form(...rest: TagChild[]): HTMLFormElement;
export declare function H1(...rest: TagChild[]): HTMLHeadingElement;
export declare function H2(...rest: TagChild[]): HTMLHeadingElement;
export declare function H3(...rest: TagChild[]): HTMLHeadingElement;
export declare function H4(...rest: TagChild[]): HTMLHeadingElement;
export declare function H5(...rest: TagChild[]): HTMLHeadingElement;
export declare function H6(...rest: TagChild[]): HTMLHeadingElement;
export declare function HR(...rest: TagChild[]): HTMLHRElement;
export declare function Head(...rest: TagChild[]): HTMLHeadElement;
export declare function Header(...rest: TagChild[]): HTMLElement;
export declare function HGroup(...rest: TagChild[]): HTMLElement;
export declare function HTML(...rest: TagChild[]): HTMLHtmlElement;
export declare function I(...rest: TagChild[]): HTMLElement;
export declare function IFrame(...rest: TagChild[]): HTMLIFrameElement;
export declare function Img(...rest: TagChild[]): HTMLImageElement;
export declare function Input(...rest: TagChild[]): HTMLInputElement;
export declare function Ins(...rest: TagChild[]): HTMLModElement;
export declare function KBD(...rest: TagChild[]): HTMLElement;
export declare function Label(...rest: TagChild[]): HTMLLabelElement;
export declare function Legend(...rest: TagChild[]): HTMLLegendElement;
export declare function LI(...rest: TagChild[]): HTMLLIElement;
export declare function Link(...rest: TagChild[]): HTMLLinkElement;
export declare function Main(...rest: TagChild[]): HTMLElement;
export declare function HtmlMap(...rest: TagChild[]): HTMLMapElement;
export declare function Mark(...rest: TagChild[]): HTMLElement;
export declare function Marquee(...rest: TagChild[]): HTMLMarqueeElement;
export declare function Menu(...rest: TagChild[]): HTMLMenuElement;
export declare function Meta(...rest: TagChild[]): HTMLMetaElement;
export declare function Meter(...rest: TagChild[]): HTMLMeterElement;
export declare function Nav(...rest: TagChild[]): HTMLElement;
export declare function NoScript(...rest: TagChild[]): HTMLElement;
export declare function HtmlObject(...rest: TagChild[]): HTMLObjectElement;
export declare function OL(...rest: TagChild[]): HTMLOListElement;
export declare function OptGroup(...rest: TagChild[]): HTMLOptGroupElement;
export declare function Option(...rest: TagChild[]): HTMLOptionElement;
export declare function Output(...rest: TagChild[]): HTMLOutputElement;
export declare function P(...rest: TagChild[]): HTMLParagraphElement;
export declare function Param(...rest: TagChild[]): HTMLParamElement;
export declare function Picture(...rest: TagChild[]): HTMLPictureElement;
export declare function Pre(...rest: TagChild[]): HTMLPreElement;
export declare function Progress(...rest: TagChild[]): HTMLProgressElement;
export declare function Q(...rest: TagChild[]): HTMLQuoteElement;
export declare function RB(...rest: TagChild[]): HTMLElement;
export declare function RP(...rest: TagChild[]): HTMLElement;
export declare function RT(...rest: TagChild[]): HTMLElement;
export declare function RTC(...rest: TagChild[]): HTMLElement;
export declare function Ruby(...rest: TagChild[]): HTMLElement;
export declare function S(...rest: TagChild[]): HTMLElement;
export declare function Samp(...rest: TagChild[]): HTMLElement;
export declare function Script(...rest: TagChild[]): HTMLScriptElement;
export declare function Section(...rest: TagChild[]): HTMLElement;
export declare function Select(...rest: TagChild[]): HTMLSelectElement;
export declare function Slot(...rest: TagChild[]): HTMLSlotElement;
export declare function Small(...rest: TagChild[]): HTMLElement;
export declare function Source(...rest: TagChild[]): HTMLSourceElement;
export declare function Span(...rest: TagChild[]): HTMLSpanElement;
export declare function Strong(...rest: TagChild[]): HTMLElement;
export declare function Style(...rest: TagChild[]): HTMLStyleElement;
export declare function Sub(...rest: TagChild[]): HTMLElement;
export declare function Summary(...rest: TagChild[]): HTMLElement;
export declare function Sup(...rest: TagChild[]): HTMLElement;
export declare function Table(...rest: TagChild[]): HTMLTableElement;
export declare function TBody(...rest: TagChild[]): HTMLTableSectionElement;
export declare function TD(...rest: TagChild[]): HTMLTableDataCellElement;
export declare function Template(...rest: TagChild[]): HTMLTemplateElement;
export declare function TextArea(...rest: TagChild[]): HTMLTextAreaElement;
export declare function TFoot(...rest: TagChild[]): HTMLTableSectionElement;
export declare function TH(...rest: TagChild[]): HTMLTableHeaderCellElement;
export declare function THead(...rest: TagChild[]): HTMLTableSectionElement;
export declare function Time(...rest: TagChild[]): HTMLTimeElement;
export declare function Title(...rest: TagChild[]): HTMLTitleElement;
export declare function TR(...rest: TagChild[]): HTMLTableRowElement;
export declare function Track(...rest: TagChild[]): HTMLTrackElement;
export declare function U(...rest: TagChild[]): HTMLElement;
export declare function UL(...rest: TagChild[]): HTMLUListElement;
export declare function Var(...rest: TagChild[]): HTMLElement;
export declare function Video(...rest: TagChild[]): HTMLVideoElement;
export declare function WBR(): HTMLElement;
/**
 * creates an HTML Input tag that is a button.
 */
export declare function InputButton(...rest: TagChild[]): HTMLInputElement;
/**
 * creates an HTML Input tag that is a checkbox.
 */
export declare function InputCheckbox(...rest: TagChild[]): HTMLInputElement;
/**
 * creates an HTML Input tag that is a color picker.
 */
export declare function InputColor(...rest: TagChild[]): HTMLInputElement;
/**
 * creates an HTML Input tag that is a date picker.
 */
export declare function InputDate(...rest: TagChild[]): HTMLInputElement;
/**
 * creates an HTML Input tag that is a local date-time picker.
 */
export declare function InputDateTime(...rest: TagChild[]): HTMLInputElement;
/**
 * creates an HTML Input tag that is an email entry field.
 */
export declare function InputEmail(...rest: TagChild[]): HTMLInputElement;
/**
 * creates an HTML Input tag that is a file picker.
 */
export declare function InputFile(...rest: TagChild[]): HTMLInputElement;
/**
 * creates an HTML Input tag that is a hidden field.
 */
export declare function InputHidden(...rest: TagChild[]): HTMLInputElement;
/**
 * creates an HTML Input tag that is a graphical submit button.
 */
export declare function InputImage(...rest: TagChild[]): HTMLInputElement;
/**
 * creates an HTML Input tag that is a month picker.
 */
export declare function InputMonth(...rest: TagChild[]): HTMLInputElement;
/**
 * creates an HTML Input tag that is a password entry field.
 */
export declare function InputPassword(...rest: TagChild[]): HTMLInputElement;
/**
 * creates an HTML Input tag that is a radio button.
 */
export declare function InputRadio(...rest: TagChild[]): HTMLInputElement;
/**
 * creates an HTML Input tag that is a range selector.
 */
export declare function InputRange(...rest: TagChild[]): HTMLInputElement;
/**
 * creates an HTML Input tag that is a form reset button.
 */
export declare function InputReset(...rest: TagChild[]): HTMLInputElement;
/**
 * creates an HTML Input tag that is a search entry field.
 */
export declare function InputSearch(...rest: TagChild[]): HTMLInputElement;
/**
 * creates an HTML Input tag that is a submit button.
 */
export declare function InputSubmit(...rest: TagChild[]): HTMLInputElement;
/**
 * creates an HTML Input tag that is a telephone number entry field.
 */
export declare function InputTelephone(...rest: TagChild[]): HTMLInputElement;
/**
 * creates an HTML Input tag that is a text entry field.
 */
export declare function InputText(...rest: TagChild[]): HTMLInputElement;
/**
 * creates an HTML Input tag that is a time picker.
 */
export declare function InputTime(...rest: TagChild[]): HTMLInputElement;
/**
 * creates an HTML Input tag that is a URL entry field.
 */
export declare function InputURL(...rest: TagChild[]): HTMLInputElement;
/**
 * creates an HTML Input tag that is a week picker.
 */
export declare function InputWeek(...rest: TagChild[]): HTMLInputElement;
/**
 * Creates a text node out of the give input.
 */
export declare function TextNode(txt: any): Text;
/**
 * Creates a Div element with margin: auto.
 */
export declare function Run(...rest: TagChild[]): HTMLDivElement;
export {};
