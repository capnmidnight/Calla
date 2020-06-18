import { HtmlAttr, type } from "./attrs.js";
import { HtmlEvt, isFunction } from "./evts.js";
import { HtmlCustomTag } from "./custom.js";
import { LabeledInputTag } from "./labeledInputTag.js";
import { SelectBoxTag } from "./selectBoxTag.js";
import { LabeledSelectBoxTag } from "./labeledSelectBoxTag.js";

export function clear(elem) {
    while (elem.lastChild) {
        elem.lastChild.remove();
    }
}

export function tag(name, ...rest) {
    const elem = document.createElement(name);

    for (let i = 0; i < rest.length; ++i) {
        if (isFunction(rest[i])) {
            rest[i] = rest[i](true);
        }
    }

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
            else if (x instanceof HtmlCustomTag) {
                elem.appendChild(x.element);
            }
            else if (x instanceof HtmlAttr) {
                x.apply(elem);
            }
            else if (x instanceof HtmlEvt) {
                x.add(elem);
            }
            else {
                console.trace(`Skipping ${x}: unsupported value type.`);
            }
        }
    }

    return elem;
}

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

export function LabeledInput(id, inputType, labelText, ...rest) {
    return new LabeledInputTag(id, inputType, labelText, ...rest);
}

export function SelectBox(noSelectionText, ...rest) {
    return new SelectBoxTag(noSelectionText, ...rest);
}

export function LabeledSelectBox(id, labelText, noSelectionText, ...rest) {
    return new LabeledSelectBoxTag(id, labelText, noSelectionText, ...rest);
}