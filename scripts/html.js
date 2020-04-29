function tag(name, ...rest) {
    const elem = document.createElement(name);

    rest.filter(x => !(x instanceof Element)
        && !(x instanceof String)
        && typeof x !== "string")
        .forEach(attr => {
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
                else if (key.startsWith("on") && typeof value === "function") {
                    elem.addEventListener(key.substring(2), value);
                }
                else if (!(typeof value === "boolean" || value instanceof Boolean)) {
                    elem[key] = value;
                }
                else if (value) {
                    elem.setAttribute(key, "");
                }
                else {
                    elem.removeAttribute(key);
                }
            }
        });

    const textContent = rest.filter(x => x instanceof String || typeof x === "string")
        .reduce((a, b) => (a + "\n" + b), "")
        .trim();

    if (textContent.length > 0) {
        elem.appendChild(document.createTextNode(textContent));
    }

    rest
        .filter(x => x instanceof Element)
        .forEach(elem.appendChild.bind(elem));

    return elem;
}

export function a(...rest) { return tag("a", ...rest); }
export function abbr(...rest) { return tag("abbr", ...rest); }
export function acronym(...rest) { return tag("acronym", ...rest); }
export function address(...rest) { return tag("address", ...rest); }
export function applet(...rest) { return tag("applet", ...rest); }
export function area(...rest) { return tag("area", ...rest); }
export function article(...rest) { return tag("article", ...rest); }
export function aside(...rest) { return tag("aside", ...rest); }
export function audio(...rest) { return tag("audio", ...rest); }
export function b(...rest) { return tag("b", ...rest); }
export function base(...rest) { return tag("base", ...rest); }
export function basefont(...rest) { return tag("basefont", ...rest); }
export function bdo(...rest) { return tag("bdo", ...rest); }
export function big(...rest) { return tag("big", ...rest); }
export function blockquote(...rest) { return tag("blockquote", ...rest); }
export function body(...rest) { return tag("body", ...rest); }
export function br(...rest) { return tag("br", ...rest); }
export function button(...rest) { return tag("button", ...rest); }
export function canvas(...rest) { return tag("canvas", ...rest); }
export function caption(...rest) { return tag("caption", ...rest); }
export function center(...rest) { return tag("center", ...rest); }
export function cite(...rest) { return tag("cite", ...rest); }
export function code(...rest) { return tag("code", ...rest); }
export function col(...rest) { return tag("col", ...rest); }
export function colgroup(...rest) { return tag("colgroup", ...rest); }
export function datalist(...rest) { return tag("datalist", ...rest); }
export function dd(...rest) { return tag("dd", ...rest); }
export function del(...rest) { return tag("del", ...rest); }
export function dfn(...rest) { return tag("dfn", ...rest); }
export function div(...rest) { return tag("div", ...rest); }
export function dl(...rest) { return tag("dl", ...rest); }
export function dt(...rest) { return tag("dt", ...rest); }
export function em(...rest) { return tag("em", ...rest); }
export function embed(...rest) { return tag("embed", ...rest); }
export function fieldset(...rest) { return tag("fieldset", ...rest); }
export function figcaption(...rest) { return tag("figcaption", ...rest); }
export function figure(...rest) { return tag("figure", ...rest); }
export function font(...rest) { return tag("font", ...rest); }
export function footer(...rest) { return tag("footer", ...rest); }
export function form(...rest) { return tag("form", ...rest); }
export function frame(...rest) { return tag("frame", ...rest); }
export function frameset(...rest) { return tag("frameset", ...rest); }
export function head(...rest) { return tag("head", ...rest); }
export function header(...rest) { return tag("header", ...rest); }
export function h1(...rest) { return tag("h1", ...rest); }
export function h2(...rest) { return tag("h2", ...rest); }
export function h3(...rest) { return tag("h3", ...rest); }
export function h4(...rest) { return tag("h4", ...rest); }
export function h5(...rest) { return tag("h5", ...rest); }
export function h6(...rest) { return tag("h6", ...rest); }
export function hr(...rest) { return tag("hr", ...rest); }
export function html(...rest) { return tag("html", ...rest); }
export function i(...rest) { return tag("i", ...rest); }
export function iframe(...rest) { return tag("iframe", ...rest); }
export function img(...rest) { return tag("img", ...rest); }
export function input(...rest) { return tag("input", ...rest); }
export function ins(...rest) { return tag("ins", ...rest); }
export function kbd(...rest) { return tag("kbd", ...rest); }
export function label(...rest) { return tag("label", ...rest); }
export function legend(...rest) { return tag("legend", ...rest); }
export function li(...rest) { return tag("li", ...rest); }
export function link(...rest) { return tag("link", ...rest); }
export function main(...rest) { return tag("main", ...rest); }
export function map(...rest) { return tag("map", ...rest); }
export function mark(...rest) { return tag("mark", ...rest); }
export function meta(...rest) { return tag("meta", ...rest); }
export function meter(...rest) { return tag("meter", ...rest); }
export function nav(...rest) { return tag("nav", ...rest); }
export function noscript(...rest) { return tag("noscript", ...rest); }
export function object(...rest) { return tag("object", ...rest); }
export function ol(...rest) { return tag("ol", ...rest); }
export function optgroup(...rest) { return tag("optgroup", ...rest); }
export function option(...rest) { return tag("option", ...rest); }
export function p(...rest) { return tag("p", ...rest); }
export function param(...rest) { return tag("param", ...rest); }
export function pre(...rest) { return tag("pre", ...rest); }
export function progress(...rest) { return tag("progress", ...rest); }
export function q(...rest) { return tag("q", ...rest); }
export function s(...rest) { return tag("s", ...rest); }
export function samp(...rest) { return tag("samp", ...rest); }
export function script(...rest) { return tag("script", ...rest); }
export function section(...rest) { return tag("section", ...rest); }
export function select(...rest) { return tag("select", ...rest); }
export function small(...rest) { return tag("small", ...rest); }
export function source(...rest) { return tag("source", ...rest); }
export function span(...rest) { return tag("span", ...rest); }
export function strike(...rest) { return tag("strike", ...rest); }
export function strong(...rest) { return tag("strong", ...rest); }
export function style(...rest) { return tag("style", ...rest); }
export function sub(...rest) { return tag("sub", ...rest); }
export function sup(...rest) { return tag("sup", ...rest); }
export function table(...rest) { return tag("table", ...rest); }
export function tbody(...rest) { return tag("tbody", ...rest); }
export function td(...rest) { return tag("td", ...rest); }
export function textarea(...rest) { return tag("textarea", ...rest); }
export function tfoot(...rest) { return tag("tfoot", ...rest); }
export function th(...rest) { return tag("th", ...rest); }
export function thead(...rest) { return tag("thead", ...rest); }
export function time(...rest) { return tag("time", ...rest); }
export function title(...rest) { return tag("title", ...rest); }
export function tr(...rest) { return tag("tr", ...rest); }
export function u(...rest) { return tag("u", ...rest); }
export function ul(...rest) { return tag("ul", ...rest); }
export function varTag(...rest) { return tag("var", ...rest); }
export function video(...rest) { return tag("video", ...rest); }
export function wbr(...rest) { return tag("wbr", ...rest); }