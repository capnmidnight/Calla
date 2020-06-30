class HtmlAttr {
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
function accessKey(value) { return new HtmlAttr("accessKey", ["input", "button"], value); }
// Alternative text in case an image can't be displayed.
function alt(value) { return new HtmlAttr("alt", ["applet", "area", "img", "input"], value); }
function ariaLabel(value) { return new HtmlAttr("ariaLabel", [], value); }
// Often used with CSS to style elements with common properties.
function className(value) { return new HtmlAttr("className", [], value); }
// Describes elements which belongs to this one.
function htmlFor(value) { return new HtmlAttr("htmlFor", ["label", "output"], value); }
// Specifies the height of elements listed here. For all other elements, use the CSS height property.
function height(value) { return new HtmlAttr("height", ["canvas", "embed", "iframe", "img", "input", "object", "video"], value); }
// The URL of a linked resource.
function href(value) { return new HtmlAttr("href", ["a", "area", "base", "link"], value); }
// Often used with CSS to style a specific element. The value of this attribute must be unique.
function id(value) { return new HtmlAttr("id", [], value); }
// Indicates the maximum value allowed.
function max(value) { return new HtmlAttr("max", ["input", "meter", "progress"], value); }
// Indicates the minimum value allowed.
function min(value) { return new HtmlAttr("min", ["input", "meter"], value); }
// Provides a hint to the user of what can be entered in the field.
function placeHolder(value) { return new HtmlAttr("placeholder", ["input", "textarea"], value); }
// Specifies the relationship of the target object to the link object.
function rel(value) { return new HtmlAttr("rel", ["a", "area", "link"], value); }
// Defines the number of rows in a text area.
function role(value) { return new HtmlAttr("role", [], value); }
// The URL of the embeddable content.
function src(value) { return new HtmlAttr("src", ["audio", "embed", "iframe", "img", "input", "script", "source", "track", "video"], value); }
// Defines CSS styles which will override styles previously set.
function style(value) { return new HtmlAttr("style", [], value); }
// ???
function step(value) { return new HtmlAttr("step", ["input"], value); }
// Text to be displayed in a tooltip when hovering over the element.
function title(value) { return new HtmlAttr("title", [], value); }
// ???
function target(value) { return new HtmlAttr("target", ["a", "area", "base", "form"], value); }
// Defines the type of the element.
function type(value) { return new HtmlAttr("type", ["button", "input", "command", "embed", "object", "script", "source", "style", "menu"], value); }
// Defines a default value which will be displayed in the element on page load.
function value(value) { return new HtmlAttr("value", ["button", "data", "input", "li", "meter", "option", "progress", "param"], value); }
// For the elements listed here, this establishes the element's width.
function width(value) { return new HtmlAttr("width", ["canvas", "embed", "iframe", "img", "input", "object", "video"], value); }

const fillPageStyle = style({
    position: "absolute",
    display: "block",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    padding: 0,
    margin: 0,
    overflow: "hidden",
});

// A selection of fonts for preferred monospace rendering.
const monospaceFamily = "'Droid Sans Mono', 'Consolas', 'Lucida Console', 'Courier New', 'Courier', monospace";
const monospaceFont = style({ fontFamily: monospaceFamily });

// A selection of fonts that should match whatever the user's operating system normally uses.
const systemFamily = "-apple-system, '.SFNSText-Regular', 'San Francisco', 'Roboto', 'Segoe UI', 'Helvetica Neue', 'Lucida Grande', sans-serif";
const systemFont = style({ fontFamily: systemFamily });

function isGoodNumber(v) {
    return v !== null
        && v !== undefined
        && (typeof (v) === "number"
            || v instanceof Number)
        && !Number.isNaN(v);
}

function clamp(v, min, max) {
    return Math.min(max, Math.max(min, v));
}

function lerp(a, b, p) {
    return (1 - p) * a + p * b;
}

function project(v, min, max) {
    return (v - min) / (max - min);
}

function unproject(v, min, max) {
    return v * (max - min) + min;
}

// A few convenience methods for HTML elements.

Element.prototype.isOpen = function () {
    return this.style.display !== "none";
};

Element.prototype.setOpen = function (v, displayType = "") {
    this.style.display = v
        ? displayType
        : "none";
};

Element.prototype.setOpenWithLabel = function (v, label, enabledText, disabledText, bothText, displayType = "") {
    this.setOpen(v, displayType);
    label.updateLabel(this.isOpen(), enabledText, disabledText, bothText);
};

Element.prototype.updateLabel = function (isOpen, enabledText, disabledText, bothText) {
    bothText = bothText || "";
    if (this.accessKey) {
        bothText += ` <kbd>(ALT+${this.accessKey.toUpperCase()})</kbd>`;
    }
    this.innerHTML = (isOpen ? enabledText : disabledText) + bothText;
};

Element.prototype.toggleOpen = function (displayType = "") {
    this.setOpen(!this.isOpen(), displayType);
};

Element.prototype.toggleOpenWithLabel = function (label, enabledText, disabledText, bothText, displayType = "") {
    this.setOpenWithLabel(!this.isOpen(), label, enabledText, disabledText, bothText, displayType);
};

Element.prototype.show = function (displayType = "") {
    this.setOpen(true, displayType);
};

Element.prototype.hide = function () {
    this.setOpen(false);
};

Element.prototype.setLocked = function (value) {
    if (value) {
        this.lock();
    }
    else {
        this.unlock();
    }
};

Element.prototype.lock = function () {
    this.disabled = "disabled";
};

Element.prototype.unlock = function () {
    this.disabled = "";
};

Element.prototype.blinkBorder = function (times, color) {
    times = (times || 3) * 2;
    color = color || "rgb(255, 127, 127)";

    let state = false;
    const interval = setInterval(() => {
        state = !state;
        this.style.backgroundColor = state ? color : "";
        --times;
        if (times === 0) {
            clearInterval(interval);
        }
    }, 125);
};

HTMLCanvasElement.prototype.resize = function () {
    this.width = this.clientWidth * devicePixelRatio;
    this.height = this.clientHeight * devicePixelRatio;
};

const oldAddEventListener = HTMLInputElement.prototype.addEventListener;

HTMLInputElement.prototype.addEventListener = function (evtName, func, opts) {
    if (evtName === "enter") {
        oldAddEventListener.call(this, "keypress", function (evt) {
            if (evt.key === "Enter") {
                func(evt);
            }
        }, opts);
    }
    else {
        oldAddEventListener.call(this, evtName, func, opts);
    }
};

Response.prototype.xml = async function () {
    const text = await this.text(),
        parser = new DOMParser(),
        xml = parser.parseFromString(text, "text/xml");

    return xml.documentElement;
};

Response.prototype.html = async function () {
    const text = await this.text(),
        parser = new DOMParser(),
        xml = parser.parseFromString(text, "text/html");

    return xml.documentElement;
};

Array.prototype.random = function (defaultValue) {
    const offset = !!defaultValue ? 1 : 0,
        idx = Math.floor(Math.random() * (this.length + offset)) - offset;
    if (idx < 0) {
        return defaultValue;
    }
    else {
        return this[idx];
    }
};

HTMLSelectElement.prototype.setSelectedValue = function (value) {
    this.value = "";

    if (value !== null
        && value !== undefined) {
        value = value.toString();
        for (let option of this.options) {
            if (option.value === value) {
                this.value = value;
                return;
            }
        }
    }
};

Storage.prototype.getInt = function (name, defaultValue) {
    const n = parseFloat(this.getItem(name));
    if (!Number.isInteger(n)) {
        return defaultValue;
    }

    return n;
};

function add(a, b) {
    return evt => {
        a(evt);
        b(evt);
    };
}

Event.clone = function (target, ...objs) {
    for (let obj of objs) {
        for (let key in obj) {
            if (key !== "isTrusted") {
                target[key] = obj[key];
            }
        }
    }

    return target;
};

EventTarget.prototype.once = function (resolveEvt, rejectEvt, timeout) {

    if (timeout === undefined
        && isGoodNumber(rejectEvt)) {
        timeout = rejectEvt;
        rejectEvt = undefined;
    }

    return new Promise((resolve, reject) => {
        const hasResolveEvt = resolveEvt !== undefined && resolveEvt !== null,
            removeResolve = () => {
                if (hasResolveEvt) {
                    this.removeEventListener(resolveEvt, resolve);
                }
            },
            hasRejectEvt = rejectEvt !== undefined && rejectEvt !== null,
            removeReject = () => {
                if (hasRejectEvt) {
                    this.removeEventListener(rejectEvt, reject);
                }
            },
            remove = add(removeResolve, removeReject);

        resolve = add(remove, resolve);
        reject = add(remove, reject);

        if (timeout !== undefined
            && timeout !== null) {
            const timer = setTimeout(() => {
                reject("Timeout");
            }, timeout),
                cancel = () => clearTimeout(timer);
            resolve = add(cancel, resolve);
            reject = add(cancel, reject);
        }

        if (hasResolveEvt) {
            this.addEventListener(resolveEvt, resolve);
        }

        if (hasRejectEvt) {
            this.addEventListener(rejectEvt, () => {
                reject("Rejection event found");
            });
        }
    });
};

EventTarget.prototype.until = function (untilEvt, callback, test, repeatTimeout, cancelTimeout) {
    return new Promise((resolve, reject) => {
        let timer = null,
            canceller = null;

        const cleanup = () => {
            if (timer !== null) {
                clearTimeout(timer);
            }

            if (canceller !== null) {
                clearTimeout(canceller);
            }

            this.removeEventListener(untilEvt, success);
        };

        function success(evt) {
            if (test(evt)) {
                cleanup();
                resolve(evt);
            }
        }

        this.addEventListener(untilEvt, success);

        if (cancelTimeout !== undefined) {
            canceller = setTimeout(() => {
                cleanup();
                reject("timeout");
            }, cancelTimeout);
        }

        function repeater() {
            callback();
            timer = setTimeout(repeater, repeatTimeout);
        }

        timer = setTimeout(repeater, 0);
    });
};

EventTarget.prototype.addEventListeners = function (obj) {
    for (let evtName in obj) {
        let callback = obj[evtName];
        let opts = undefined;
        if (callback instanceof Array) {
            opts = callback[1];
            callback = callback[0];
        }

        this.addEventListener(evtName, callback, opts);
    }
};

Array.prototype.clear = function () {
    this.splice(0);
};

Array.prototype.removeAt = function (idx) {
    this.splice(idx, 1);
};

String.prototype.firstLetterToUpper = function () {
    return this[0].toLocaleUpperCase()
        + this.substring(1);
};

function isFunction(obj) {
    return typeof obj === "function"
        || obj instanceof Function;
}

class HtmlEvt {
    constructor(name, callback, opts) {
        if (!isFunction(callback)) {
            throw new Error("A function instance is required for this parameter");
        }

        this.add = (elem) => {
            elem.addEventListener(name, callback, opts);
        };

        this.remove = (elem) => {
            elem.removeEventListener(name, callback);
        };

        Object.freeze(this);
    }
}
function onClick(callback) { return new HtmlEvt("click", callback); }
function onInput(callback) { return new HtmlEvt("input", callback); }
function onKeyUp(callback) { return new HtmlEvt("keyup", callback); }

function tag(name, ...rest) {
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

class HtmlCustomTag extends EventTarget {
    constructor(tagName, ...rest) {
        super();
        if (rest.length === 1
            && rest[0] instanceof Element) {
            this.element = rest[0];
        }
        else {
            this.element = tag(tagName, ...rest);
        }
    }
}

class LabeledInputTag extends HtmlCustomTag {
    constructor(id, inputType, labelText, ...rest) {
        super("div");

        this.label = Label(
            htmlFor(id),
            labelText);

        this.input = Input(
            type(inputType),
            ...rest);

        this.element.append(
            this.label,
            this.input);

        Object.seal(this);
    }

    addEventListener(name, callback, opts) {
        this.input.addEventListener(name, callback, opts);
    }

    removeEventListener(name, callback) {
        this.input.removeEventListener(name, callback);
    }

    async once(resolveEvt, rejectEvt, timeout) {
        return await this.input.once(resolveEvt, rejectEvt, timeout);
    }

    get value() {
        return this.input.value;
    }

    set value(v) {
        this.input.value = v;
    }

    get checked() {
        return this.input.checked;
    }

    set checked(v) {
        this.input.checked = v;
    }

    setLocked(value) {
        this.input.setLocked(value);
    }
}

class LabeledSelectBoxTag extends HtmlCustomTag {
    constructor(tagId, labelText, noSelectionText, makeID, makeLabel, ...rest) {
        super("div");

        this.label = Label(
            htmlFor(tagId),
            labelText);

        this.select = new SelectBox(noSelectionText, makeID, makeLabel, id(tagId), ...rest);

        this.element.append(
            this.label,
            this.select.element);

        Object.seal(this);
    }

    get emptySelectionEnabled() {
        return this.select.emptySelectionEnabled;
    }

    set emptySelectionEnabled(value) {
        this.select.emptySelectionEnabled = value;
    }

    get values() {
        return this.select.values;
    }

    set values(values) {
        this.select.values = values;
    }

    get options() {
        return this.select.options;
    }

    get selectedIndex() {
        return this.select.selectedIndex;
    }

    set selectedIndex(i) {
        this.select.selectedIndex = i;
    }

    get selectedValue() {
        return this.select.selectedValue;
    }

    set selectedValue(v) {
        this.select.selectedValue = v;
    }

    indexOf(value) {
        return this.select.indexOf(value);
    }

    contains(value) {
        return this.select.contains(value);
    }

    addEventListener(name, callback, opts) {
        this.select.addEventListener(name, callback, opts);
    }

    removeEventListener(name, callback) {
        this.select.removeEventListener(name, callback);
    }
}

const selectEvt = new Event("select");

class OptionPanelTag extends HtmlCustomTag {
    constructor(panelID, name, ...rest) {
        super("div",
            id(panelID),
            H2(name),
            P(...rest));

        this.button = Button(
            id(panelID + "Btn"),
            onClick(() => this.dispatchEvent(selectEvt)),
            name);
    }

    get visible() {
        return this.element.style.display !== null;
    }

    set visible(v) {
        this.element.setOpen(v);
        this.button.setLocked(v);
    }
}

const _values = new Map();

class SelectBoxTag extends HtmlCustomTag {
    constructor(noSelectionText, makeID, makeLabel, ...rest) {
        super("select", ...rest);

        if (!isFunction(makeID)) {
            throw new Error("makeID parameter must be a Function");
        }

        if (!isFunction(makeLabel)) {
            throw new Error("makeLabel parameter must be a Function");
        }

        _values.set(this, []);

        this.noSelectionText = noSelectionText;
        this.makeID = (v) => v !== null && makeID(v) || null;
        this.makeLabel = (v) => v !== null && makeLabel(v) || "None";
        this.emptySelectionEnabled = true;

        Object.seal(this);
    }

    get emptySelectionEnabled() {
        return this._emptySelectionEnabled;
    }

    set emptySelectionEnabled(value) {
        this._emptySelectionEnabled = value;
        this._render();
    }

    get values() {
        return _values.get(this);
    }

    set values(newItems) {
        const curValue = this.selectedValue;
        const values = _values.get(this);
        values.splice(0, values.length, ...newItems);
        this._render();
        this.selectedValue = curValue;
    }

    _render() {
        clear(this.element);
        if (this.values.length === 0) {
            this.element.append(Option(this.noSelectionText));
            this.element.lock();
        }
        else {
            if (this.emptySelectionEnabled) {
                this.element.append(Option(this.noSelectionText));
            }
            for (let v of this.values) {
                this.element.append(
                    Option(
                        value(this.makeID(v)),
                        this.makeLabel(v)));
            }

            this.element.unlock();
        }
    }

    get options() {
        return this.element.options;
    }

    get selectedIndex() {
        let i = this.element.selectedIndex;
        if (this.emptySelectionEnabled) {
            --i;
        }
        return i;
    }

    set selectedIndex(i) {
        if (this.emptySelectionEnabled) {
            ++i;
        }
        this.element.selectedIndex = i;
    }

    get selectedValue() {
        if (0 <= this.selectedIndex && this.selectedIndex < this.values.length) {
            return this.values[this.selectedIndex];
        }
        else {
            return null;
        }
    }

    indexOf(value) {
        return _values.get(this)
            .findIndex(v =>
                value !== null
                && this.makeID(value) === this.makeID(v));
    }

    set selectedValue(value) {
        this.selectedIndex = this.indexOf(value);
    }

    contains(value) {
        return this.indexOf(value) >= 0.
    }

    addEventListener(name, callback, opts) {
        this.element.addEventListener(name, callback, opts);
    }

    removeEventListener(name, callback) {
        this.element.removeEventListener(name, callback);
    }

    setOpen(v) {
        this.element.setOpen(v);
    }

    get style() {
        return this.element.style;
    }
}

function clear(elem) {
    while (elem.lastChild) {
        elem.lastChild.remove();
    }
}

function A(...rest) { return tag("a", ...rest); }
function Aside(...rest) { return tag("aside", ...rest); }
function HtmlButton(...rest) { return tag("button", ...rest); }
function Button(...rest) { return HtmlButton(...rest, type("button")); }
function Canvas(...rest) { return tag("canvas", ...rest); }
function Div(...rest) { return tag("div", ...rest); }
function H1(...rest) { return tag("h1", ...rest); }
function H2(...rest) { return tag("h2", ...rest); }
function Img(...rest) { return tag("img", ...rest); }
function Input(...rest) { return tag("input", ...rest); }
function KBD(...rest) { return tag("kbd", ...rest); }
function Label(...rest) { return tag("label", ...rest); }
function LI(...rest) { return tag("li", ...rest); }
function Option(...rest) { return tag("option", ...rest); }
function P(...rest) { return tag("p", ...rest); }
function Span(...rest) { return tag("span", ...rest); }
function Strong(...rest) { return tag("strong", ...rest); }
function UL(...rest) { return tag("ul", ...rest); }

function LabeledInput(id, inputType, labelText, ...rest) {
    return new LabeledInputTag(id, inputType, labelText, ...rest);
}

function SelectBox(noSelectionText, makeID, makeLabel, ...rest) {
    return new SelectBoxTag(noSelectionText, makeID, makeLabel, ...rest);
}

function LabeledSelectBox(id, labelText, noSelectionText, makeID, makeLabel, ...rest) {
    return new LabeledSelectBoxTag(id, labelText, noSelectionText, makeID, makeLabel, ...rest);
}

function OptionPanel(id, name, ...rest) {
    return new OptionPanelTag(id, name, ...rest);
}

class FormDialog extends EventTarget {
    constructor(name, ...rest) {
        super();

        const formStyle = style({
            display: "grid",
            gridTemplateColumns: "5fr 1fr 1fr",
            gridTemplateRows: "auto auto 1fr auto auto",
            overflowY: "hidden",
            fontFamily: systemFamily
        });

        this.element = document.getElementById(name) ||
            Div(
                id(name),
                className("dialog"),
                H1(...rest));

        formStyle.apply(this.element);

        style({ gridArea: "1/1/2/4" }).apply(this.element.querySelector("h1"));

        this.header = this.element.querySelector(".header")
            || this.element.appendChild(Div(className("header")));

        style({ gridArea: "2/1/3/4" }).apply(this.header);

        this.content = this.element.querySelector(".content")
            || this.element.appendChild(Div(className("content")));

        style({
            overflowY: "scroll",
            gridArea: "3/1/4/4"
        }).apply(this.content);

        this.footer = this.element.querySelector(".footer")
            || this.element.appendChild(Div(className("footer")));

        style({
            display: "flex",
            flexDirection: "row-reverse",
            gridArea: "4/1/5/4"
        }).apply(this.footer);
    }

    appendChild(child) {
        return this.element.appendChild(child);
    }

    append(...rest) {
        this.element.append(...rest);
    }

    show() {
        this.element.show("grid");
    }

    hide() {
        this.element.hide();
    }

    toggleOpen() {
        this.element.toggleOpen("grid");
    }
}

class Emoji {
    /**
     * Unicode-standardized pictograms.
     * @param {string} value - a Unicode sequence.
     * @param {string} desc - an English text description of the pictogram.
     */
    constructor(value, desc) {
        this.value = value;
        this.desc = desc;
    }
}

class EmojiGroup extends Emoji {
    /**
     * Groupings of Unicode-standardized pictograms.
     * @param {string} value - a Unicode sequence.
     * @param {string} desc - an English text description of the pictogram.
     * @param {(Emoji|EmojiGroup)[]} rest - Emojis in this group.
     */
    constructor(value, desc, ...rest) {
        super(value, desc);
        /** @type {(Emoji|EmojiGroup)[]} */
        this.alts = rest;
        /** @type {string} */
        this.width = null;
    }

    random() {
        return this.alts.random();
    }
}

/**
 * Check to see if a given Emoji is part of a specific EmojiGroup
 * @param {EmojiGroup} group
 * @param {Emoji} emoji
 */
function isInSet(group, emoji) {
    return group.value === emoji
        || group.alts && group.alts.findIndex(e => e.value === emoji) >= 0;
}

/**
 * Check to see if a given Emoji walks on water.
 * @param {Emoji} emoji
 */
function isSurfer(emoji) {
    return isInSet(personSurfing, emoji)
        || isInSet(manSurfing, emoji)
        || isInSet(womanSurfing, emoji)
        || isInSet(personRowing, emoji)
        || isInSet(manRowing, emoji)
        || isInSet(womanRowing, emoji)
        || isInSet(personSwimming, emoji)
        || isInSet(manSwimming, emoji)
        || isInSet(womanSwimming, emoji);
}

const whiteChessKing = new Emoji("\u{2654}", "White Chess King");
const whiteChessQueen = new Emoji("\u{2655}", "White Chess Queen");
const whiteChessRook = new Emoji("\u{2656}", "White Chess Rook");
const whiteChessBishop = new Emoji("\u{2657}", "White Chess Bishop");
const whiteChessKnight = new Emoji("\u{2658}", "White Chess Knight");
const whiteChessPawn = new Emoji("\u{2659}", "White Chess Pawn");
const whiteChessPieces = Object.assign(new EmojiGroup(
    whiteChessKing.value
    + whiteChessQueen.value
    + whiteChessRook.value
    + whiteChessBishop.value
    + whiteChessKnight.value
    + whiteChessPawn.value,
    "White Chess Pieces",
    whiteChessKing,
    whiteChessQueen,
    whiteChessRook,
    whiteChessBishop,
    whiteChessKnight,
    whiteChessPawn), {
    width: "auto",
    king: whiteChessKing,
    queen: whiteChessQueen,
    rook: whiteChessRook,
    bishop: whiteChessBishop,
    knight: whiteChessKnight,
    pawn: whiteChessPawn
});

const blackChessKing = new Emoji("\u{265A}", "Black Chess King");
const blackChessQueen = new Emoji("\u{265B}", "Black Chess Queen");
const blackChessRook = new Emoji("\u{265C}", "Black Chess Rook");
const blackChessBishop = new Emoji("\u{265D}", "Black Chess Bishop");
const blackChessKnight = new Emoji("\u{265E}", "Black Chess Knight");
const blackChessPawn = new Emoji("\u{265F}", "Black Chess Pawn");
const blackChessPieces = Object.assign(new EmojiGroup(
    blackChessKing.value
    + blackChessQueen.value
    + blackChessRook.value
    + blackChessBishop.value
    + blackChessKnight.value
    + blackChessPawn.value,
    "Black Chess Pieces",
    blackChessKing,
    blackChessQueen,
    blackChessRook,
    blackChessBishop,
    blackChessKnight,
    blackChessPawn), {
    width: "auto",
    king: blackChessKing,
    queen: blackChessQueen,
    rook: blackChessRook,
    bishop: blackChessBishop,
    knight: blackChessKnight,
    pawn: blackChessPawn
});
const chessPawns = Object.assign(new EmojiGroup(
    whiteChessPawn.value + blackChessPawn.value,
    "Chess Pawns",
    whiteChessPawn,
    blackChessPawn), {
    width: "auto",
    white: whiteChessPawn,
    black: blackChessPawn
});
const chessRooks = Object.assign(new EmojiGroup(
    whiteChessRook.value + blackChessRook.value,
    "Chess Rooks",
    whiteChessRook,
    blackChessRook), {
    width: "auto",
    white: whiteChessRook,
    black: blackChessRook
});
const chessBishops = Object.assign(new EmojiGroup(
    whiteChessBishop.value + blackChessBishop.value,
    "Chess Bishops",
    whiteChessBishop,
    blackChessBishop), {
    width: "auto",
    white: whiteChessBishop,
    black: blackChessBishop
});
const chessKnights = Object.assign(new EmojiGroup(
    whiteChessKnight.value + blackChessKnight.value,
    "Chess Knights",
    whiteChessKnight,
    blackChessKnight), {
    width: "auto",
    white: whiteChessKnight,
    black: blackChessKnight
});
const chessQueens = Object.assign(new EmojiGroup(
    whiteChessQueen.value + blackChessQueen.value,
    "Chess Queens",
    whiteChessQueen,
    blackChessQueen), {
    width: "auto",
    white: whiteChessQueen,
    black: blackChessQueen
});
const chessKings = Object.assign(new EmojiGroup(
    whiteChessKing.value + blackChessKing.value,
    "Chess Kings",
    whiteChessKing,
    blackChessKing), {
    width: "auto",
    white: whiteChessKing,
    black: blackChessKing
});
const chess = Object.assign(new EmojiGroup(
    chessKings.value,
    "Chess Pieces",
    whiteChessPieces,
    blackChessPieces,
    chessPawns,
    chessRooks,
    chessBishops,
    chessKnights,
    chessQueens,
    chessKings), {
    width: "auto",
    white: whiteChessPieces,
    black: blackChessPieces,
    pawns: chessPawns,
    rooks: chessRooks,
    bishops: chessBishops,
    knights: chessKnights,
    queens: chessQueens,
    kings: chessKings
});

const personSurfingLightSkinTone = new Emoji("\u{1F3C4}\u{1F3FB}", "person surfing: light skin tone");
const personSurfingMediumLightSkinTone = new Emoji("\u{1F3C4}\u{1F3FC}", "person surfing: medium-light skin tone");
const personSurfingMediumSkinTone = new Emoji("\u{1F3C4}\u{1F3FD}", "person surfing: medium skin tone");
const personSurfingMediumDarkSkinTone = new Emoji("\u{1F3C4}\u{1F3FE}", "person surfing: medium-dark skin tone");
const personSurfingDarkSkinTone = new Emoji("\u{1F3C4}\u{1F3FF}", "person surfing: dark skin tone");
const personSurfing = new EmojiGroup(
    "\u{1F3C4}", "person surfing",
    personSurfingLightSkinTone,
    personSurfingMediumLightSkinTone,
    personSurfingMediumSkinTone,
    personSurfingMediumDarkSkinTone,
    personSurfingDarkSkinTone);
const manSurfing = new EmojiGroup(
    "\u{1F3C4}\u{200D}\u{2642}\u{FE0F}", "man surfing",
    new Emoji("\u{1F3C4}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "man surfing: light skin tone"),
    new Emoji("\u{1F3C4}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "man surfing: medium-light skin tone"),
    new Emoji("\u{1F3C4}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "man surfing: medium skin tone"),
    new Emoji("\u{1F3C4}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "man surfing: medium-dark skin tone"),
    new Emoji("\u{1F3C4}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "man surfing: dark skin tone"));
const womanSurfing = new EmojiGroup(
    "\u{1F3C4}\u{200D}\u{2640}\u{FE0F}", "woman surfing",
    new Emoji("\u{1F3C4}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "woman surfing: light skin tone"),
    new Emoji("\u{1F3C4}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "woman surfing: medium-light skin tone"),
    new Emoji("\u{1F3C4}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "woman surfing: medium skin tone"),
    new Emoji("\u{1F3C4}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "woman surfing: medium-dark skin tone"),
    new Emoji("\u{1F3C4}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "woman surfing: dark skin tone"));
const personRowing = new EmojiGroup(
    "\u{1F6A3}", "person rowing boat",
    new Emoji("\u{1F6A3}\u{1F3FB}", "person rowing boat: light skin tone"),
    new Emoji("\u{1F6A3}\u{1F3FC}", "person rowing boat: medium-light skin tone"),
    new Emoji("\u{1F6A3}\u{1F3FD}", "person rowing boat: medium skin tone"),
    new Emoji("\u{1F6A3}\u{1F3FE}", "person rowing boat: medium-dark skin tone"),
    new Emoji("\u{1F6A3}\u{1F3FF}", "person rowing boat: dark skin tone"));
const manRowing = new EmojiGroup(
    "\u{1F6A3}\u{200D}\u{2642}\u{FE0F}", "man rowing boat",
    new Emoji("\u{1F6A3}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "man rowing boat: light skin tone"),
    new Emoji("\u{1F6A3}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "man rowing boat: medium-light skin tone"),
    new Emoji("\u{1F6A3}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "man rowing boat: medium skin tone"),
    new Emoji("\u{1F6A3}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "man rowing boat: medium-dark skin tone"),
    new Emoji("\u{1F6A3}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "man rowing boat: dark skin tone"));
const womanRowing = new EmojiGroup(
    "\u{1F6A3}\u{200D}\u{2640}\u{FE0F}", "woman rowing boat",
    new Emoji("\u{1F6A3}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "woman rowing boat: light skin tone"),
    new Emoji("\u{1F6A3}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "woman rowing boat: medium-light skin tone"),
    new Emoji("\u{1F6A3}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "woman rowing boat: medium skin tone"),
    new Emoji("\u{1F6A3}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "woman rowing boat: medium-dark skin tone"),
    new Emoji("\u{1F6A3}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "woman rowing boat: dark skin tone"));
const personSwimming = new EmojiGroup(
    "\u{1F3CA}", "person swimming",
    new Emoji("\u{1F3CA}\u{1F3FB}", "person swimming: light skin tone"),
    new Emoji("\u{1F3CA}\u{1F3FC}", "person swimming: medium-light skin tone"),
    new Emoji("\u{1F3CA}\u{1F3FD}", "person swimming: medium skin tone"),
    new Emoji("\u{1F3CA}\u{1F3FE}", "person swimming: medium-dark skin tone"),
    new Emoji("\u{1F3CA}\u{1F3FF}", "person swimming: dark skin tone"));
const manSwimming = new EmojiGroup(
    "\u{1F3CA}\u{200D}\u{2642}\u{FE0F}", "man swimming",
    new Emoji("\u{1F3CA}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "man swimming: light skin tone"),
    new Emoji("\u{1F3CA}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "man swimming: medium-light skin tone"),
    new Emoji("\u{1F3CA}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "man swimming: medium skin tone"),
    new Emoji("\u{1F3CA}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "man swimming: medium-dark skin tone"),
    new Emoji("\u{1F3CA}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "man swimming: dark skin tone"));
const womanSwimming = new EmojiGroup(
    "\u{1F3CA}\u{200D}\u{2640}\u{FE0F}", "woman swimming",
    new Emoji("\u{1F3CA}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "woman swimming: light skin tone"),
    new Emoji("\u{1F3CA}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "woman swimming: medium-light skin tone"),
    new Emoji("\u{1F3CA}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "woman swimming: medium skin tone"),
    new Emoji("\u{1F3CA}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "woman swimming: medium-dark skin tone"),
    new Emoji("\u{1F3CA}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "woman swimming: dark skin tone"));
const personFrowning = new EmojiGroup(
    "\u{1F64D}", "person frowning",
    new Emoji("\u{1F64D}\u{1F3FB}", "person frowning: light skin tone"),
    new Emoji("\u{1F64D}\u{1F3FC}", "person frowning: medium-light skin tone"),
    new Emoji("\u{1F64D}\u{1F3FD}", "person frowning: medium skin tone"),
    new Emoji("\u{1F64D}\u{1F3FE}", "person frowning: medium-dark skin tone"),
    new Emoji("\u{1F64D}\u{1F3FF}", "person frowning: dark skin tone"));
const manFrowning = new EmojiGroup(
    "\u{1F64D}\u{200D}\u{2642}\u{FE0F}", "man frowning",
    new Emoji("\u{1F64D}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "man frowning: light skin tone"),
    new Emoji("\u{1F64D}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "man frowning: medium-light skin tone"),
    new Emoji("\u{1F64D}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "man frowning: medium skin tone"),
    new Emoji("\u{1F64D}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "man frowning: medium-dark skin tone"),
    new Emoji("\u{1F64D}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "man frowning: dark skin tone"));
const womanFrowning = new EmojiGroup(
    "\u{1F64D}\u{200D}\u{2640}\u{FE0F}", "woman frowning",
    new Emoji("\u{1F64D}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "woman frowning: light skin tone"),
    new Emoji("\u{1F64D}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "woman frowning: medium-light skin tone"),
    new Emoji("\u{1F64D}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "woman frowning: medium skin tone"),
    new Emoji("\u{1F64D}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "woman frowning: medium-dark skin tone"),
    new Emoji("\u{1F64D}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "woman frowning: dark skin tone"));
const personPouting = new EmojiGroup(
    "\u{1F64E}", "person pouting",
    new Emoji("\u{1F64E}\u{1F3FB}", "person pouting: light skin tone"),
    new Emoji("\u{1F64E}\u{1F3FC}", "person pouting: medium-light skin tone"),
    new Emoji("\u{1F64E}\u{1F3FD}", "person pouting: medium skin tone"),
    new Emoji("\u{1F64E}\u{1F3FE}", "person pouting: medium-dark skin tone"),
    new Emoji("\u{1F64E}\u{1F3FF}", "person pouting: dark skin tone"));
const manPouting = new EmojiGroup(
    "\u{1F64E}\u{200D}\u{2642}\u{FE0F}", "man pouting",
    new Emoji("\u{1F64E}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "man pouting: light skin tone"),
    new Emoji("\u{1F64E}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "man pouting: medium-light skin tone"),
    new Emoji("\u{1F64E}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "man pouting: medium skin tone"),
    new Emoji("\u{1F64E}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "man pouting: medium-dark skin tone"),
    new Emoji("\u{1F64E}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "man pouting: dark skin tone"));
const womanPouting = new EmojiGroup(
    "\u{1F64E}\u{200D}\u{2640}\u{FE0F}", "woman pouting",
    new Emoji("\u{1F64E}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "woman pouting: light skin tone"),
    new Emoji("\u{1F64E}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "woman pouting: medium-light skin tone"),
    new Emoji("\u{1F64E}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "woman pouting: medium skin tone"),
    new Emoji("\u{1F64E}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "woman pouting: medium-dark skin tone"),
    new Emoji("\u{1F64E}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "woman pouting: dark skin tone"));
const baby = new EmojiGroup(
    "\u{1F476}", "baby",
    new Emoji("\u{1F476}\u{1F3FB}", "baby: light skin tone"),
    new Emoji("\u{1F476}\u{1F3FC}", "baby: medium-light skin tone"),
    new Emoji("\u{1F476}\u{1F3FD}", "baby: medium skin tone"),
    new Emoji("\u{1F476}\u{1F3FE}", "baby: medium-dark skin tone"),
    new Emoji("\u{1F476}\u{1F3FF}", "baby: dark skin tone"));
const child = new EmojiGroup(
    "\u{1F9D2}", "child",
    new Emoji("\u{1F9D2}\u{1F3FB}", "child: light skin tone"),
    new Emoji("\u{1F9D2}\u{1F3FC}", "child: medium-light skin tone"),
    new Emoji("\u{1F9D2}\u{1F3FD}", "child: medium skin tone"),
    new Emoji("\u{1F9D2}\u{1F3FE}", "child: medium-dark skin tone"),
    new Emoji("\u{1F9D2}\u{1F3FF}", "child: dark skin tone"));
const boy = new EmojiGroup(
    "\u{1F466}", "boy",
    new Emoji("\u{1F466}\u{1F3FB}", "boy: light skin tone"),
    new Emoji("\u{1F466}\u{1F3FC}", "boy: medium-light skin tone"),
    new Emoji("\u{1F466}\u{1F3FD}", "boy: medium skin tone"),
    new Emoji("\u{1F466}\u{1F3FE}", "boy: medium-dark skin tone"),
    new Emoji("\u{1F466}\u{1F3FF}", "boy: dark skin tone"));
const girl = new EmojiGroup(
    "\u{1F467}", "girl",
    new Emoji("\u{1F467}\u{1F3FB}", "girl: light skin tone"),
    new Emoji("\u{1F467}\u{1F3FC}", "girl: medium-light skin tone"),
    new Emoji("\u{1F467}\u{1F3FD}", "girl: medium skin tone"),
    new Emoji("\u{1F467}\u{1F3FE}", "girl: medium-dark skin tone"),
    new Emoji("\u{1F467}\u{1F3FF}", "girl: dark skin tone"));
const person = new EmojiGroup(
    "\u{1F9D1}", "person",
    new Emoji("\u{1F9D1}\u{1F3FB}", "person: light skin tone"),
    new Emoji("\u{1F9D1}\u{1F3FC}", "person: medium-light skin tone"),
    new Emoji("\u{1F9D1}\u{1F3FD}", "person: medium skin tone"),
    new Emoji("\u{1F9D1}\u{1F3FE}", "person: medium-dark skin tone"),
    new Emoji("\u{1F9D1}\u{1F3FF}", "person: dark skin tone"));
const blondPerson = new EmojiGroup(
    "\u{1F471}", "person: blond hair",
    new Emoji("\u{1F471}\u{1F3FB}", "person: light skin tone, blond hair"),
    new Emoji("\u{1F471}\u{1F3FC}", "person: medium-light skin tone, blond hair"),
    new Emoji("\u{1F471}\u{1F3FD}", "person: medium skin tone, blond hair"),
    new Emoji("\u{1F471}\u{1F3FE}", "person: medium-dark skin tone, blond hair"),
    new Emoji("\u{1F471}\u{1F3FF}", "person: dark skin tone, blond hair"));
const olderPerson = new EmojiGroup(
    "\u{1F9D3}", "older person",
    new Emoji("\u{1F9D3}\u{1F3FB}", "older person: light skin tone"),
    new Emoji("\u{1F9D3}\u{1F3FC}", "older person: medium-light skin tone"),
    new Emoji("\u{1F9D3}\u{1F3FD}", "older person: medium skin tone"),
    new Emoji("\u{1F9D3}\u{1F3FE}", "older person: medium-dark skin tone"),
    new Emoji("\u{1F9D3}\u{1F3FF}", "older person: dark skin tone"));
const personGesturingNo = new EmojiGroup(
    "\u{1F645}", "person gesturing NO",
    new Emoji("\u{1F645}\u{1F3FB}", "person gesturing NO: light skin tone"),
    new Emoji("\u{1F645}\u{1F3FC}", "person gesturing NO: medium-light skin tone"),
    new Emoji("\u{1F645}\u{1F3FD}", "person gesturing NO: medium skin tone"),
    new Emoji("\u{1F645}\u{1F3FE}", "person gesturing NO: medium-dark skin tone"),
    new Emoji("\u{1F645}\u{1F3FF}", "person gesturing NO: dark skin tone"));
const manGesturingNo = new EmojiGroup(
    "\u{1F645}\u{200D}\u{2642}\u{FE0F}", "man gesturing NO",
    new Emoji("\u{1F645}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "man gesturing NO: light skin tone"),
    new Emoji("\u{1F645}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "man gesturing NO: medium-light skin tone"),
    new Emoji("\u{1F645}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "man gesturing NO: medium skin tone"),
    new Emoji("\u{1F645}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "man gesturing NO: medium-dark skin tone"),
    new Emoji("\u{1F645}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "man gesturing NO: dark skin tone"));
const womanGesturingNo = new EmojiGroup(
    "\u{1F645}\u{200D}\u{2640}\u{FE0F}", "woman gesturing NO",
    new Emoji("\u{1F645}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "woman gesturing NO: light skin tone"),
    new Emoji("\u{1F645}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "woman gesturing NO: medium-light skin tone"),
    new Emoji("\u{1F645}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "woman gesturing NO: medium skin tone"),
    new Emoji("\u{1F645}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "woman gesturing NO: medium-dark skin tone"),
    new Emoji("\u{1F645}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "woman gesturing NO: dark skin tone"));
const man = new EmojiGroup(
    "\u{1F468}", "man",
    new Emoji("\u{1F468}\u{1F3FB}", "man: light skin tone"),
    new Emoji("\u{1F468}\u{1F3FC}", "man: medium-light skin tone"),
    new Emoji("\u{1F468}\u{1F3FD}", "man: medium skin tone"),
    new Emoji("\u{1F468}\u{1F3FE}", "man: medium-dark skin tone"),
    new Emoji("\u{1F468}\u{1F3FF}", "man: dark skin tone"));
const blondMan = new EmojiGroup(
    "\u{1F471}\u{200D}\u{2642}\u{FE0F}", "man: blond hair",
    new Emoji("\u{1F471}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "man: light skin tone, blond hair"),
    new Emoji("\u{1F471}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "man: medium-light skin tone, blond hair"),
    new Emoji("\u{1F471}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "man: medium skin tone, blond hair"),
    new Emoji("\u{1F471}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "man: medium-dark skin tone, blond hair"),
    new Emoji("\u{1F471}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "man: dark skin tone, blond hair"));
const redHairedMan = new EmojiGroup(
    "\u{1F468}\u{200D}\u{1F9B0}", "man: red hair",
    new Emoji("\u{1F468}\u{1F3FB}\u{200D}\u{1F9B0}", "man: light skin tone, red hair"),
    new Emoji("\u{1F468}\u{1F3FC}\u{200D}\u{1F9B0}", "man: medium-light skin tone, red hair"),
    new Emoji("\u{1F468}\u{1F3FD}\u{200D}\u{1F9B0}", "man: medium skin tone, red hair"),
    new Emoji("\u{1F468}\u{1F3FE}\u{200D}\u{1F9B0}", "man: medium-dark skin tone, red hair"),
    new Emoji("\u{1F468}\u{1F3FF}\u{200D}\u{1F9B0}", "man: dark skin tone, red hair"));
const curlyHairedMan = new EmojiGroup(
    "\u{1F468}\u{200D}\u{1F9B1}", "man: curly hair",
    new Emoji("\u{1F468}\u{1F3FB}\u{200D}\u{1F9B1}", "man: light skin tone, curly hair"),
    new Emoji("\u{1F468}\u{1F3FC}\u{200D}\u{1F9B1}", "man: medium-light skin tone, curly hair"),
    new Emoji("\u{1F468}\u{1F3FD}\u{200D}\u{1F9B1}", "man: medium skin tone, curly hair"),
    new Emoji("\u{1F468}\u{1F3FE}\u{200D}\u{1F9B1}", "man: medium-dark skin tone, curly hair"),
    new Emoji("\u{1F468}\u{1F3FF}\u{200D}\u{1F9B1}", "man: dark skin tone, curly hair"));
const whiteHairedMan = new EmojiGroup(
    "\u{1F468}\u{200D}\u{1F9B3}", "man: white hair",
    new Emoji("\u{1F468}\u{1F3FB}\u{200D}\u{1F9B3}", "man: light skin tone, white hair"),
    new Emoji("\u{1F468}\u{1F3FC}\u{200D}\u{1F9B3}", "man: medium-light skin tone, white hair"),
    new Emoji("\u{1F468}\u{1F3FD}\u{200D}\u{1F9B3}", "man: medium skin tone, white hair"),
    new Emoji("\u{1F468}\u{1F3FE}\u{200D}\u{1F9B3}", "man: medium-dark skin tone, white hair"),
    new Emoji("\u{1F468}\u{1F3FF}\u{200D}\u{1F9B3}", "man: dark skin tone, white hair"));
const baldMan = new EmojiGroup(
    "\u{1F468}\u{200D}\u{1F9B2}", "man: bald",
    new Emoji("\u{1F468}\u{1F3FB}\u{200D}\u{1F9B2}", "man: light skin tone, bald"),
    new Emoji("\u{1F468}\u{1F3FC}\u{200D}\u{1F9B2}", "man: medium-light skin tone, bald"),
    new Emoji("\u{1F468}\u{1F3FD}\u{200D}\u{1F9B2}", "man: medium skin tone, bald"),
    new Emoji("\u{1F468}\u{1F3FE}\u{200D}\u{1F9B2}", "man: medium-dark skin tone, bald"),
    new Emoji("\u{1F468}\u{1F3FF}\u{200D}\u{1F9B2}", "man: dark skin tone, bald"));
const beardedMan = new EmojiGroup(
    "\u{1F9D4}", "man: beard",
    new Emoji("\u{1F9D4}\u{1F3FB}", "man: light skin tone, beard"),
    new Emoji("\u{1F9D4}\u{1F3FC}", "man: medium-light skin tone, beard"),
    new Emoji("\u{1F9D4}\u{1F3FD}", "man: medium skin tone, beard"),
    new Emoji("\u{1F9D4}\u{1F3FE}", "man: medium-dark skin tone, beard"),
    new Emoji("\u{1F9D4}\u{1F3FF}", "man: dark skin tone, beard"));
const oldMan = new EmojiGroup(
    "\u{1F474}", "old man",
    new Emoji("\u{1F474}\u{1F3FB}", "old man: light skin tone"),
    new Emoji("\u{1F474}\u{1F3FC}", "old man: medium-light skin tone"),
    new Emoji("\u{1F474}\u{1F3FD}", "old man: medium skin tone"),
    new Emoji("\u{1F474}\u{1F3FE}", "old man: medium-dark skin tone"),
    new Emoji("\u{1F474}\u{1F3FF}", "old man: dark skin tone"));
const woman = new EmojiGroup(
    "\u{1F469}", "woman",
    new Emoji("\u{1F469}\u{1F3FB}", "woman: light skin tone"),
    new Emoji("\u{1F469}\u{1F3FC}", "woman: medium-light skin tone"),
    new Emoji("\u{1F469}\u{1F3FD}", "woman: medium skin tone"),
    new Emoji("\u{1F469}\u{1F3FE}", "woman: medium-dark skin tone"),
    new Emoji("\u{1F469}\u{1F3FF}", "woman: dark skin tone"));
const blondWoman = new EmojiGroup(
    "\u{1F471}\u{200D}\u{2640}\u{FE0F}", "woman: blond hair",
    new Emoji("\u{1F471}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "woman: light skin tone, blond hair"),
    new Emoji("\u{1F471}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "woman: medium-light skin tone, blond hair"),
    new Emoji("\u{1F471}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "woman: medium skin tone, blond hair"),
    new Emoji("\u{1F471}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "woman: medium-dark skin tone, blond hair"),
    new Emoji("\u{1F471}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "woman: dark skin tone, blond hair"));
const redHairedWoman = new EmojiGroup(
    "\u{1F469}\u{200D}\u{1F9B0}", "woman: red hair",
    new Emoji("\u{1F469}\u{1F3FB}\u{200D}\u{1F9B0}", "woman: light skin tone, red hair"),
    new Emoji("\u{1F469}\u{1F3FC}\u{200D}\u{1F9B0}", "woman: medium-light skin tone, red hair"),
    new Emoji("\u{1F469}\u{1F3FD}\u{200D}\u{1F9B0}", "woman: medium skin tone, red hair"),
    new Emoji("\u{1F469}\u{1F3FE}\u{200D}\u{1F9B0}", "woman: medium-dark skin tone, red hair"),
    new Emoji("\u{1F469}\u{1F3FF}\u{200D}\u{1F9B0}", "woman: dark skin tone, red hair"));
const curlyHairedWoman = new EmojiGroup(
    "\u{1F469}\u{200D}\u{1F9B1}", "woman: curly hair",
    new Emoji("\u{1F469}\u{1F3FB}\u{200D}\u{1F9B1}", "woman: light skin tone, curly hair"),
    new Emoji("\u{1F469}\u{1F3FC}\u{200D}\u{1F9B1}", "woman: medium-light skin tone, curly hair"),
    new Emoji("\u{1F469}\u{1F3FD}\u{200D}\u{1F9B1}", "woman: medium skin tone, curly hair"),
    new Emoji("\u{1F469}\u{1F3FE}\u{200D}\u{1F9B1}", "woman: medium-dark skin tone, curly hair"),
    new Emoji("\u{1F469}\u{1F3FF}\u{200D}\u{1F9B1}", "woman: dark skin tone, curly hair"));
const whiteHairedWoman = new EmojiGroup(
    "\u{1F469}\u{200D}\u{1F9B3}", "woman: white hair",
    new Emoji("\u{1F469}\u{1F3FB}\u{200D}\u{1F9B3}", "woman: light skin tone, white hair"),
    new Emoji("\u{1F469}\u{1F3FC}\u{200D}\u{1F9B3}", "woman: medium-light skin tone, white hair"),
    new Emoji("\u{1F469}\u{1F3FD}\u{200D}\u{1F9B3}", "woman: medium skin tone, white hair"),
    new Emoji("\u{1F469}\u{1F3FE}\u{200D}\u{1F9B3}", "woman: medium-dark skin tone, white hair"),
    new Emoji("\u{1F469}\u{1F3FF}\u{200D}\u{1F9B3}", "woman: dark skin tone, white hair"));
const baldWoman = new EmojiGroup(
    "\u{1F469}\u{200D}\u{1F9B2}", "woman: bald",
    new Emoji("\u{1F469}\u{1F3FB}\u{200D}\u{1F9B2}", "woman: light skin tone, bald"),
    new Emoji("\u{1F469}\u{1F3FC}\u{200D}\u{1F9B2}", "woman: medium-light skin tone, bald"),
    new Emoji("\u{1F469}\u{1F3FD}\u{200D}\u{1F9B2}", "woman: medium skin tone, bald"),
    new Emoji("\u{1F469}\u{1F3FE}\u{200D}\u{1F9B2}", "woman: medium-dark skin tone, bald"),
    new Emoji("\u{1F469}\u{1F3FF}\u{200D}\u{1F9B2}", "woman: dark skin tone, bald"));
const oldWoman = new EmojiGroup(
    "\u{1F475}", "old woman",
    new Emoji("\u{1F475}\u{1F3FB}", "old woman: light skin tone"),
    new Emoji("\u{1F475}\u{1F3FC}", "old woman: medium-light skin tone"),
    new Emoji("\u{1F475}\u{1F3FD}", "old woman: medium skin tone"),
    new Emoji("\u{1F475}\u{1F3FE}", "old woman: medium-dark skin tone"),
    new Emoji("\u{1F475}\u{1F3FF}", "old woman: dark skin tone"));
const personGesturingOK = new EmojiGroup(
    "\u{1F646}", "person gesturing OK",
    new Emoji("\u{1F646}\u{1F3FB}", "person gesturing OK: light skin tone"),
    new Emoji("\u{1F646}\u{1F3FC}", "person gesturing OK: medium-light skin tone"),
    new Emoji("\u{1F646}\u{1F3FD}", "person gesturing OK: medium skin tone"),
    new Emoji("\u{1F646}\u{1F3FE}", "person gesturing OK: medium-dark skin tone"),
    new Emoji("\u{1F646}\u{1F3FF}", "person gesturing OK: dark skin tone"));
const manGesturingOK = new EmojiGroup(
    "\u{1F646}\u{200D}\u{2642}\u{FE0F}", "man gesturing OK",
    new Emoji("\u{1F646}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "man gesturing OK: light skin tone"),
    new Emoji("\u{1F646}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "man gesturing OK: medium-light skin tone"),
    new Emoji("\u{1F646}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "man gesturing OK: medium skin tone"),
    new Emoji("\u{1F646}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "man gesturing OK: medium-dark skin tone"),
    new Emoji("\u{1F646}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "man gesturing OK: dark skin tone"));
const womanGesturingOK = new EmojiGroup(
    "\u{1F646}\u{200D}\u{2640}\u{FE0F}", "woman gesturing OK",
    new Emoji("\u{1F646}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "woman gesturing OK: light skin tone"),
    new Emoji("\u{1F646}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "woman gesturing OK: medium-light skin tone"),
    new Emoji("\u{1F646}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "woman gesturing OK: medium skin tone"),
    new Emoji("\u{1F646}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "woman gesturing OK: medium-dark skin tone"),
    new Emoji("\u{1F646}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "woman gesturing OK: dark skin tone"));
const personTippingHand = new EmojiGroup(
    "\u{1F481}", "person tipping hand",
    new Emoji("\u{1F481}\u{1F3FB}", "person tipping hand: light skin tone"),
    new Emoji("\u{1F481}\u{1F3FC}", "person tipping hand: medium-light skin tone"),
    new Emoji("\u{1F481}\u{1F3FD}", "person tipping hand: medium skin tone"),
    new Emoji("\u{1F481}\u{1F3FE}", "person tipping hand: medium-dark skin tone"),
    new Emoji("\u{1F481}\u{1F3FF}", "person tipping hand: dark skin tone"));
const manTippingHand = new EmojiGroup(
    "\u{1F481}\u{200D}\u{2642}\u{FE0F}", "man tipping hand",
    new Emoji("\u{1F481}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "man tipping hand: light skin tone"),
    new Emoji("\u{1F481}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "man tipping hand: medium-light skin tone"),
    new Emoji("\u{1F481}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "man tipping hand: medium skin tone"),
    new Emoji("\u{1F481}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "man tipping hand: medium-dark skin tone"),
    new Emoji("\u{1F481}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "man tipping hand: dark skin tone"));
const womanTippingHand = new EmojiGroup(
    "\u{1F481}\u{200D}\u{2640}\u{FE0F}", "woman tipping hand",
    new Emoji("\u{1F481}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "woman tipping hand: light skin tone"),
    new Emoji("\u{1F481}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "woman tipping hand: medium-light skin tone"),
    new Emoji("\u{1F481}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "woman tipping hand: medium skin tone"),
    new Emoji("\u{1F481}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "woman tipping hand: medium-dark skin tone"),
    new Emoji("\u{1F481}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "woman tipping hand: dark skin tone"));
const personRaisingHand = new EmojiGroup(
    "\u{1F64B}", "person raising hand",
    new Emoji("\u{1F64B}\u{1F3FB}", "person raising hand: light skin tone"),
    new Emoji("\u{1F64B}\u{1F3FC}", "person raising hand: medium-light skin tone"),
    new Emoji("\u{1F64B}\u{1F3FD}", "person raising hand: medium skin tone"),
    new Emoji("\u{1F64B}\u{1F3FE}", "person raising hand: medium-dark skin tone"),
    new Emoji("\u{1F64B}\u{1F3FF}", "person raising hand: dark skin tone"));
const manRaisingHand = new EmojiGroup(
    "\u{1F64B}\u{200D}\u{2642}\u{FE0F}", "man raising hand",
    new Emoji("\u{1F64B}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "man raising hand: light skin tone"),
    new Emoji("\u{1F64B}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "man raising hand: medium-light skin tone"),
    new Emoji("\u{1F64B}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "man raising hand: medium skin tone"),
    new Emoji("\u{1F64B}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "man raising hand: medium-dark skin tone"),
    new Emoji("\u{1F64B}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "man raising hand: dark skin tone"));
const womanRaisingHand = new EmojiGroup(
    "\u{1F64B}\u{200D}\u{2640}\u{FE0F}", "woman raising hand",
    new Emoji("\u{1F64B}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "woman raising hand: light skin tone"),
    new Emoji("\u{1F64B}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "woman raising hand: medium-light skin tone"),
    new Emoji("\u{1F64B}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "woman raising hand: medium skin tone"),
    new Emoji("\u{1F64B}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "woman raising hand: medium-dark skin tone"),
    new Emoji("\u{1F64B}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "woman raising hand: dark skin tone"));
const deafPerson = new EmojiGroup(
    "\u{1F9CF}", "deaf person",
    new Emoji("\u{1F9CF}\u{1F3FB}", "deaf person: light skin tone"),
    new Emoji("\u{1F9CF}\u{1F3FC}", "deaf person: medium-light skin tone"),
    new Emoji("\u{1F9CF}\u{1F3FD}", "deaf person: medium skin tone"),
    new Emoji("\u{1F9CF}\u{1F3FE}", "deaf person: medium-dark skin tone"),
    new Emoji("\u{1F9CF}\u{1F3FF}", "deaf person: dark skin tone"));
const deafMan = new EmojiGroup(
    "\u{1F9CF}\u{200D}\u{2642}\u{FE0F}", "deaf man",
    new Emoji("\u{1F9CF}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "deaf man: light skin tone"),
    new Emoji("\u{1F9CF}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "deaf man: medium-light skin tone"),
    new Emoji("\u{1F9CF}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "deaf man: medium skin tone"),
    new Emoji("\u{1F9CF}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "deaf man: medium-dark skin tone"),
    new Emoji("\u{1F9CF}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "deaf man: dark skin tone"));
const deafWoman = new EmojiGroup(
    "\u{1F9CF}\u{200D}\u{2640}\u{FE0F}", "deaf woman",
    new Emoji("\u{1F9CF}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "deaf woman: light skin tone"),
    new Emoji("\u{1F9CF}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "deaf woman: medium-light skin tone"),
    new Emoji("\u{1F9CF}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "deaf woman: medium skin tone"),
    new Emoji("\u{1F9CF}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "deaf woman: medium-dark skin tone"),
    new Emoji("\u{1F9CF}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "deaf woman: dark skin tone"));
const personBowing = new EmojiGroup(
    "\u{1F647}", "person bowing",
    new Emoji("\u{1F647}\u{1F3FB}", "person bowing: light skin tone"),
    new Emoji("\u{1F647}\u{1F3FC}", "person bowing: medium-light skin tone"),
    new Emoji("\u{1F647}\u{1F3FD}", "person bowing: medium skin tone"),
    new Emoji("\u{1F647}\u{1F3FE}", "person bowing: medium-dark skin tone"),
    new Emoji("\u{1F647}\u{1F3FF}", "person bowing: dark skin tone"));
const manBowing = new EmojiGroup(
    "\u{1F647}\u{200D}\u{2642}\u{FE0F}", "man bowing",
    new Emoji("\u{1F647}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "man bowing: light skin tone"),
    new Emoji("\u{1F647}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "man bowing: medium-light skin tone"),
    new Emoji("\u{1F647}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "man bowing: medium skin tone"),
    new Emoji("\u{1F647}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "man bowing: medium-dark skin tone"),
    new Emoji("\u{1F647}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "man bowing: dark skin tone"));
const womanBowing = new EmojiGroup(
    "\u{1F647}\u{200D}\u{2640}\u{FE0F}", "woman bowing",
    new Emoji("\u{1F647}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "woman bowing: light skin tone"),
    new Emoji("\u{1F647}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "woman bowing: medium-light skin tone"),
    new Emoji("\u{1F647}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "woman bowing: medium skin tone"),
    new Emoji("\u{1F647}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "woman bowing: medium-dark skin tone"),
    new Emoji("\u{1F647}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "woman bowing: dark skin tone"));
const personFacePalming = new EmojiGroup(
    "\u{1F926}", "person facepalming",
    new Emoji("\u{1F926}\u{1F3FB}", "person facepalming: light skin tone"),
    new Emoji("\u{1F926}\u{1F3FC}", "person facepalming: medium-light skin tone"),
    new Emoji("\u{1F926}\u{1F3FD}", "person facepalming: medium skin tone"),
    new Emoji("\u{1F926}\u{1F3FE}", "person facepalming: medium-dark skin tone"),
    new Emoji("\u{1F926}\u{1F3FF}", "person facepalming: dark skin tone"));
const manFacePalming = new EmojiGroup(
    "\u{1F926}\u{200D}\u{2642}\u{FE0F}", "man facepalming",
    new Emoji("\u{1F926}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "man facepalming: light skin tone"),
    new Emoji("\u{1F926}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "man facepalming: medium-light skin tone"),
    new Emoji("\u{1F926}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "man facepalming: medium skin tone"),
    new Emoji("\u{1F926}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "man facepalming: medium-dark skin tone"),
    new Emoji("\u{1F926}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "man facepalming: dark skin tone"));
const womanFacePalming = new EmojiGroup(
    "\u{1F926}\u{200D}\u{2640}\u{FE0F}", "woman facepalming",
    new Emoji("\u{1F926}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "woman facepalming: light skin tone"),
    new Emoji("\u{1F926}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "woman facepalming: medium-light skin tone"),
    new Emoji("\u{1F926}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "woman facepalming: medium skin tone"),
    new Emoji("\u{1F926}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "woman facepalming: medium-dark skin tone"),
    new Emoji("\u{1F926}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "woman facepalming: dark skin tone"));
const personShrugging = new EmojiGroup(
    "\u{1F937}", "person shrugging",
    new Emoji("\u{1F937}\u{1F3FB}", "person shrugging: light skin tone"),
    new Emoji("\u{1F937}\u{1F3FC}", "person shrugging: medium-light skin tone"),
    new Emoji("\u{1F937}\u{1F3FD}", "person shrugging: medium skin tone"),
    new Emoji("\u{1F937}\u{1F3FE}", "person shrugging: medium-dark skin tone"),
    new Emoji("\u{1F937}\u{1F3FF}", "person shrugging: dark skin tone"));
const manShrugging = new EmojiGroup(
    "\u{1F937}\u{200D}\u{2642}\u{FE0F}", "man shrugging",
    new Emoji("\u{1F937}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "man shrugging: light skin tone"),
    new Emoji("\u{1F937}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "man shrugging: medium-light skin tone"),
    new Emoji("\u{1F937}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "man shrugging: medium skin tone"),
    new Emoji("\u{1F937}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "man shrugging: medium-dark skin tone"),
    new Emoji("\u{1F937}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "man shrugging: dark skin tone"));
const womanShrugging = new EmojiGroup(
    "\u{1F937}\u{200D}\u{2640}\u{FE0F}", "woman shrugging",
    new Emoji("\u{1F937}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "woman shrugging: light skin tone"),
    new Emoji("\u{1F937}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "woman shrugging: medium-light skin tone"),
    new Emoji("\u{1F937}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "woman shrugging: medium skin tone"),
    new Emoji("\u{1F937}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "woman shrugging: medium-dark skin tone"),
    new Emoji("\u{1F937}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "woman shrugging: dark skin tone"));
const gestures = new EmojiGroup(
    personGesturingOK.value, "gestures",
    new EmojiGroup(
        "\u{1F64D}", "person frowning",
        personFrowning,
        manFrowning,
        womanFrowning),
    new EmojiGroup(
        "\u{1F64E}", "person pouting",
        personPouting,
        manPouting,
        womanPouting),
    new EmojiGroup(
        "\u{1F645}", "person gesturing NO",
        personGesturingNo,
        manGesturingNo,
        womanGesturingNo),
    new EmojiGroup(
        "\u{1F646}", "person gesturing OK",
        personGesturingOK,
        manGesturingOK,
        womanGesturingOK),
    new EmojiGroup(
        "\u{1F481}", "person tipping hand",
        personTippingHand,
        manTippingHand,
        womanTippingHand),
    new EmojiGroup(
        "\u{1F64B}", "person raising hand",
        personRaisingHand,
        manRaisingHand,
        womanRaisingHand),
    new EmojiGroup(
        "\u{1F9CF}", "deaf person",
        deafPerson,
        deafMan,
        deafWoman),
    new EmojiGroup(
        "\u{1F647}", "person bowing",
        personBowing,
        manBowing,
        womanBowing),
    new EmojiGroup(
        "\u{1F926}", "person facepalming",
        personFacePalming,
        manFacePalming,
        womanFacePalming),
    new EmojiGroup(
        "\u{1F937}", "person shrugging",
        personShrugging,
        manShrugging,
        womanShrugging));
const manHealthWorker = new EmojiGroup(
    "\u{1F468}\u{200D}\u{2695}\u{FE0F}", "man health worker",
    new Emoji("\u{1F468}\u{1F3FB}\u{200D}\u{2695}\u{FE0F}", "man health worker: light skin tone"),
    new Emoji("\u{1F468}\u{1F3FC}\u{200D}\u{2695}\u{FE0F}", "man health worker: medium-light skin tone"),
    new Emoji("\u{1F468}\u{1F3FD}\u{200D}\u{2695}\u{FE0F}", "man health worker: medium skin tone"),
    new Emoji("\u{1F468}\u{1F3FE}\u{200D}\u{2695}\u{FE0F}", "man health worker: medium-dark skin tone"),
    new Emoji("\u{1F468}\u{1F3FF}\u{200D}\u{2695}\u{FE0F}", "man health worker: dark skin tone"));
const womanHealthWorker = new EmojiGroup(
    "\u{1F469}\u{200D}\u{2695}\u{FE0F}", "woman health worker",
    new Emoji("\u{1F469}\u{1F3FB}\u{200D}\u{2695}\u{FE0F}", "woman health worker: light skin tone"),
    new Emoji("\u{1F469}\u{1F3FC}\u{200D}\u{2695}\u{FE0F}", "woman health worker: medium-light skin tone"),
    new Emoji("\u{1F469}\u{1F3FD}\u{200D}\u{2695}\u{FE0F}", "woman health worker: medium skin tone"),
    new Emoji("\u{1F469}\u{1F3FE}\u{200D}\u{2695}\u{FE0F}", "woman health worker: medium-dark skin tone"),
    new Emoji("\u{1F469}\u{1F3FF}\u{200D}\u{2695}\u{FE0F}", "woman health worker: dark skin tone"));
const manStudent = new EmojiGroup(
    "\u{1F468}\u{200D}\u{1F393}", "man student",
    new Emoji("\u{1F468}\u{1F3FB}\u{200D}\u{1F393}", "man student: light skin tone"),
    new Emoji("\u{1F468}\u{1F3FC}\u{200D}\u{1F393}", "man student: medium-light skin tone"),
    new Emoji("\u{1F468}\u{1F3FD}\u{200D}\u{1F393}", "man student: medium skin tone"),
    new Emoji("\u{1F468}\u{1F3FE}\u{200D}\u{1F393}", "man student: medium-dark skin tone"),
    new Emoji("\u{1F468}\u{1F3FF}\u{200D}\u{1F393}", "man student: dark skin tone"));
const womanStudent = new EmojiGroup(
    "\u{1F469}\u{200D}\u{1F393}", "woman student",
    new Emoji("\u{1F469}\u{1F3FB}\u{200D}\u{1F393}", "woman student: light skin tone"),
    new Emoji("\u{1F469}\u{1F3FC}\u{200D}\u{1F393}", "woman student: medium-light skin tone"),
    new Emoji("\u{1F469}\u{1F3FD}\u{200D}\u{1F393}", "woman student: medium skin tone"),
    new Emoji("\u{1F469}\u{1F3FE}\u{200D}\u{1F393}", "woman student: medium-dark skin tone"),
    new Emoji("\u{1F469}\u{1F3FF}\u{200D}\u{1F393}", "woman student: dark skin tone"));
const manTeacher = new EmojiGroup(
    "\u{1F468}\u{200D}\u{1F3EB}", "man teacher",
    new Emoji("\u{1F468}\u{1F3FB}\u{200D}\u{1F3EB}", "man teacher: light skin tone"),
    new Emoji("\u{1F468}\u{1F3FC}\u{200D}\u{1F3EB}", "man teacher: medium-light skin tone"),
    new Emoji("\u{1F468}\u{1F3FD}\u{200D}\u{1F3EB}", "man teacher: medium skin tone"),
    new Emoji("\u{1F468}\u{1F3FE}\u{200D}\u{1F3EB}", "man teacher: medium-dark skin tone"),
    new Emoji("\u{1F468}\u{1F3FF}\u{200D}\u{1F3EB}", "man teacher: dark skin tone"));
const womanTeacher = new EmojiGroup(
    "\u{1F469}\u{200D}\u{1F3EB}", "woman teacher",
    new Emoji("\u{1F469}\u{1F3FB}\u{200D}\u{1F3EB}", "woman teacher: light skin tone"),
    new Emoji("\u{1F469}\u{1F3FC}\u{200D}\u{1F3EB}", "woman teacher: medium-light skin tone"),
    new Emoji("\u{1F469}\u{1F3FD}\u{200D}\u{1F3EB}", "woman teacher: medium skin tone"),
    new Emoji("\u{1F469}\u{1F3FE}\u{200D}\u{1F3EB}", "woman teacher: medium-dark skin tone"),
    new Emoji("\u{1F469}\u{1F3FF}\u{200D}\u{1F3EB}", "woman teacher: dark skin tone"));
const manJudge = new EmojiGroup(
    "\u{1F468}\u{200D}\u{2696}\u{FE0F}", "man judge",
    new Emoji("\u{1F468}\u{1F3FB}\u{200D}\u{2696}\u{FE0F}", "man judge: light skin tone"),
    new Emoji("\u{1F468}\u{1F3FC}\u{200D}\u{2696}\u{FE0F}", "man judge: medium-light skin tone"),
    new Emoji("\u{1F468}\u{1F3FD}\u{200D}\u{2696}\u{FE0F}", "man judge: medium skin tone"),
    new Emoji("\u{1F468}\u{1F3FE}\u{200D}\u{2696}\u{FE0F}", "man judge: medium-dark skin tone"),
    new Emoji("\u{1F468}\u{1F3FF}\u{200D}\u{2696}\u{FE0F}", "man judge: dark skin tone"));
const womanJudge = new EmojiGroup(
    "\u{1F469}\u{200D}\u{2696}\u{FE0F}", "woman judge",
    new Emoji("\u{1F469}\u{1F3FB}\u{200D}\u{2696}\u{FE0F}", "woman judge: light skin tone"),
    new Emoji("\u{1F469}\u{1F3FC}\u{200D}\u{2696}\u{FE0F}", "woman judge: medium-light skin tone"),
    new Emoji("\u{1F469}\u{1F3FD}\u{200D}\u{2696}\u{FE0F}", "woman judge: medium skin tone"),
    new Emoji("\u{1F469}\u{1F3FE}\u{200D}\u{2696}\u{FE0F}", "woman judge: medium-dark skin tone"),
    new Emoji("\u{1F469}\u{1F3FF}\u{200D}\u{2696}\u{FE0F}", "woman judge: dark skin tone"));
const manFarmer = new EmojiGroup(
    "\u{1F468}\u{200D}\u{1F33E}", "man farmer",
    new Emoji("\u{1F468}\u{1F3FB}\u{200D}\u{1F33E}", "man farmer: light skin tone"),
    new Emoji("\u{1F468}\u{1F3FC}\u{200D}\u{1F33E}", "man farmer: medium-light skin tone"),
    new Emoji("\u{1F468}\u{1F3FD}\u{200D}\u{1F33E}", "man farmer: medium skin tone"),
    new Emoji("\u{1F468}\u{1F3FE}\u{200D}\u{1F33E}", "man farmer: medium-dark skin tone"),
    new Emoji("\u{1F468}\u{1F3FF}\u{200D}\u{1F33E}", "man farmer: dark skin tone"));
const womanFarmer = new EmojiGroup(
    "\u{1F469}\u{200D}\u{1F33E}", "woman farmer",
    new Emoji("\u{1F469}\u{1F3FB}\u{200D}\u{1F33E}", "woman farmer: light skin tone"),
    new Emoji("\u{1F469}\u{1F3FC}\u{200D}\u{1F33E}", "woman farmer: medium-light skin tone"),
    new Emoji("\u{1F469}\u{1F3FD}\u{200D}\u{1F33E}", "woman farmer: medium skin tone"),
    new Emoji("\u{1F469}\u{1F3FE}\u{200D}\u{1F33E}", "woman farmer: medium-dark skin tone"),
    new Emoji("\u{1F469}\u{1F3FF}\u{200D}\u{1F33E}", "woman farmer: dark skin tone"));
const manCook = new EmojiGroup(
    "\u{1F468}\u{200D}\u{1F373}", "man cook",
    new Emoji("\u{1F468}\u{1F3FB}\u{200D}\u{1F373}", "man cook: light skin tone"),
    new Emoji("\u{1F468}\u{1F3FC}\u{200D}\u{1F373}", "man cook: medium-light skin tone"),
    new Emoji("\u{1F468}\u{1F3FD}\u{200D}\u{1F373}", "man cook: medium skin tone"),
    new Emoji("\u{1F468}\u{1F3FE}\u{200D}\u{1F373}", "man cook: medium-dark skin tone"),
    new Emoji("\u{1F468}\u{1F3FF}\u{200D}\u{1F373}", "man cook: dark skin tone"));
const womanCook = new EmojiGroup(
    "\u{1F469}\u{200D}\u{1F373}", "woman cook",
    new Emoji("\u{1F469}\u{1F3FB}\u{200D}\u{1F373}", "woman cook: light skin tone"),
    new Emoji("\u{1F469}\u{1F3FC}\u{200D}\u{1F373}", "woman cook: medium-light skin tone"),
    new Emoji("\u{1F469}\u{1F3FD}\u{200D}\u{1F373}", "woman cook: medium skin tone"),
    new Emoji("\u{1F469}\u{1F3FE}\u{200D}\u{1F373}", "woman cook: medium-dark skin tone"),
    new Emoji("\u{1F469}\u{1F3FF}\u{200D}\u{1F373}", "woman cook: dark skin tone"));
const manMechanic = new EmojiGroup(
    "\u{1F468}\u{200D}\u{1F527}", "man mechanic",
    new Emoji("\u{1F468}\u{1F3FB}\u{200D}\u{1F527}", "man mechanic: light skin tone"),
    new Emoji("\u{1F468}\u{1F3FC}\u{200D}\u{1F527}", "man mechanic: medium-light skin tone"),
    new Emoji("\u{1F468}\u{1F3FD}\u{200D}\u{1F527}", "man mechanic: medium skin tone"),
    new Emoji("\u{1F468}\u{1F3FE}\u{200D}\u{1F527}", "man mechanic: medium-dark skin tone"),
    new Emoji("\u{1F468}\u{1F3FF}\u{200D}\u{1F527}", "man mechanic: dark skin tone"));
const womanMechanic = new EmojiGroup(
    "\u{1F469}\u{200D}\u{1F527}", "woman mechanic",
    new Emoji("\u{1F469}\u{1F3FB}\u{200D}\u{1F527}", "woman mechanic: light skin tone"),
    new Emoji("\u{1F469}\u{1F3FC}\u{200D}\u{1F527}", "woman mechanic: medium-light skin tone"),
    new Emoji("\u{1F469}\u{1F3FD}\u{200D}\u{1F527}", "woman mechanic: medium skin tone"),
    new Emoji("\u{1F469}\u{1F3FE}\u{200D}\u{1F527}", "woman mechanic: medium-dark skin tone"),
    new Emoji("\u{1F469}\u{1F3FF}\u{200D}\u{1F527}", "woman mechanic: dark skin tone"));
const manFactoryWorker = new EmojiGroup(
    "\u{1F468}\u{200D}\u{1F3ED}", "man factory worker",
    new Emoji("\u{1F468}\u{1F3FB}\u{200D}\u{1F3ED}", "man factory worker: light skin tone"),
    new Emoji("\u{1F468}\u{1F3FC}\u{200D}\u{1F3ED}", "man factory worker: medium-light skin tone"),
    new Emoji("\u{1F468}\u{1F3FD}\u{200D}\u{1F3ED}", "man factory worker: medium skin tone"),
    new Emoji("\u{1F468}\u{1F3FE}\u{200D}\u{1F3ED}", "man factory worker: medium-dark skin tone"),
    new Emoji("\u{1F468}\u{1F3FF}\u{200D}\u{1F3ED}", "man factory worker: dark skin tone"));
const womanFactoryWorker = new EmojiGroup(
    "\u{1F469}\u{200D}\u{1F3ED}", "woman factory worker",
    new Emoji("\u{1F469}\u{1F3FB}\u{200D}\u{1F3ED}", "woman factory worker: light skin tone"),
    new Emoji("\u{1F469}\u{1F3FC}\u{200D}\u{1F3ED}", "woman factory worker: medium-light skin tone"),
    new Emoji("\u{1F469}\u{1F3FD}\u{200D}\u{1F3ED}", "woman factory worker: medium skin tone"),
    new Emoji("\u{1F469}\u{1F3FE}\u{200D}\u{1F3ED}", "woman factory worker: medium-dark skin tone"),
    new Emoji("\u{1F469}\u{1F3FF}\u{200D}\u{1F3ED}", "woman factory worker: dark skin tone"));
const manOfficeWorker = new EmojiGroup(
    "\u{1F468}\u{200D}\u{1F4BC}", "man office worker",
    new Emoji("\u{1F468}\u{1F3FB}\u{200D}\u{1F4BC}", "man office worker: light skin tone"),
    new Emoji("\u{1F468}\u{1F3FC}\u{200D}\u{1F4BC}", "man office worker: medium-light skin tone"),
    new Emoji("\u{1F468}\u{1F3FD}\u{200D}\u{1F4BC}", "man office worker: medium skin tone"),
    new Emoji("\u{1F468}\u{1F3FE}\u{200D}\u{1F4BC}", "man office worker: medium-dark skin tone"),
    new Emoji("\u{1F468}\u{1F3FF}\u{200D}\u{1F4BC}", "man office worker: dark skin tone"));
const womanOfficeWorker = new EmojiGroup(
    "\u{1F469}\u{200D}\u{1F4BC}", "woman office worker",
    new Emoji("\u{1F469}\u{1F3FB}\u{200D}\u{1F4BC}", "woman office worker: light skin tone"),
    new Emoji("\u{1F469}\u{1F3FC}\u{200D}\u{1F4BC}", "woman office worker: medium-light skin tone"),
    new Emoji("\u{1F469}\u{1F3FD}\u{200D}\u{1F4BC}", "woman office worker: medium skin tone"),
    new Emoji("\u{1F469}\u{1F3FE}\u{200D}\u{1F4BC}", "woman office worker: medium-dark skin tone"),
    new Emoji("\u{1F469}\u{1F3FF}\u{200D}\u{1F4BC}", "woman office worker: dark skin tone"));
const prince = new EmojiGroup(
    "\u{1F934}", "prince",
    new Emoji("\u{1F934}\u{1F3FB}", "prince: light skin tone"),
    new Emoji("\u{1F934}\u{1F3FC}", "prince: medium-light skin tone"),
    new Emoji("\u{1F934}\u{1F3FD}", "prince: medium skin tone"),
    new Emoji("\u{1F934}\u{1F3FE}", "prince: medium-dark skin tone"),
    new Emoji("\u{1F934}\u{1F3FF}", "prince: dark skin tone"));
const princess = new EmojiGroup(
    "\u{1F478}", "princess",
    new Emoji("\u{1F478}\u{1F3FB}", "princess: light skin tone"),
    new Emoji("\u{1F478}\u{1F3FC}", "princess: medium-light skin tone"),
    new Emoji("\u{1F478}\u{1F3FD}", "princess: medium skin tone"),
    new Emoji("\u{1F478}\u{1F3FE}", "princess: medium-dark skin tone"),
    new Emoji("\u{1F478}\u{1F3FF}", "princess: dark skin tone"));
const constructionWorker = new EmojiGroup(
    "\u{1F477}", "construction worker",
    new Emoji("\u{1F477}\u{1F3FB}", "construction worker: light skin tone"),
    new Emoji("\u{1F477}\u{1F3FC}", "construction worker: medium-light skin tone"),
    new Emoji("\u{1F477}\u{1F3FD}", "construction worker: medium skin tone"),
    new Emoji("\u{1F477}\u{1F3FE}", "construction worker: medium-dark skin tone"),
    new Emoji("\u{1F477}\u{1F3FF}", "construction worker: dark skin tone"));
const manConstructionWorker = new EmojiGroup(
    "\u{1F477}\u{200D}\u{2642}\u{FE0F}", "man construction worker",
    new Emoji("\u{1F477}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "man construction worker: light skin tone"),
    new Emoji("\u{1F477}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "man construction worker: medium-light skin tone"),
    new Emoji("\u{1F477}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "man construction worker: medium skin tone"),
    new Emoji("\u{1F477}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "man construction worker: medium-dark skin tone"),
    new Emoji("\u{1F477}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "man construction worker: dark skin tone"));
const womanConstructionWorker = new EmojiGroup(
    "\u{1F477}\u{200D}\u{2640}\u{FE0F}", "woman construction worker",
    new Emoji("\u{1F477}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "woman construction worker: light skin tone"),
    new Emoji("\u{1F477}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "woman construction worker: medium-light skin tone"),
    new Emoji("\u{1F477}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "woman construction worker: medium skin tone"),
    new Emoji("\u{1F477}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "woman construction worker: medium-dark skin tone"),
    new Emoji("\u{1F477}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "woman construction worker: dark skin tone"));
const guard = new EmojiGroup(
    "\u{1F482}", "guard",
    new Emoji("\u{1F482}\u{1F3FB}", "guard: light skin tone"),
    new Emoji("\u{1F482}\u{1F3FC}", "guard: medium-light skin tone"),
    new Emoji("\u{1F482}\u{1F3FD}", "guard: medium skin tone"),
    new Emoji("\u{1F482}\u{1F3FE}", "guard: medium-dark skin tone"),
    new Emoji("\u{1F482}\u{1F3FF}", "guard: dark skin tone"));
const manGuard = new EmojiGroup(
    "\u{1F482}\u{200D}\u{2642}\u{FE0F}", "man guard",
    new Emoji("\u{1F482}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "man guard: light skin tone"),
    new Emoji("\u{1F482}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "man guard: medium-light skin tone"),
    new Emoji("\u{1F482}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "man guard: medium skin tone"),
    new Emoji("\u{1F482}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "man guard: medium-dark skin tone"),
    new Emoji("\u{1F482}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "man guard: dark skin tone"));
const womanGuard = new EmojiGroup(
    "\u{1F482}\u{200D}\u{2640}\u{FE0F}", "woman guard",
    new Emoji("\u{1F482}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "woman guard: light skin tone"),
    new Emoji("\u{1F482}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "woman guard: medium-light skin tone"),
    new Emoji("\u{1F482}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "woman guard: medium skin tone"),
    new Emoji("\u{1F482}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "woman guard: medium-dark skin tone"),
    new Emoji("\u{1F482}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "woman guard: dark skin tone"));
const spy = new EmojiGroup(
    "\u{1F575}\u{FE0F}", "spy",
    new Emoji("\u{1F575}\u{1F3FB}", "spy: light skin tone"),
    new Emoji("\u{1F575}\u{1F3FC}", "spy: medium-light skin tone"),
    new Emoji("\u{1F575}\u{1F3FD}", "spy: medium skin tone"),
    new Emoji("\u{1F575}\u{1F3FE}", "spy: medium-dark skin tone"),
    new Emoji("\u{1F575}\u{1F3FF}", "spy: dark skin tone"));
const manSpy = new EmojiGroup(
    "\u{1F575}\u{FE0F}\u{200D}\u{2642}\u{FE0F}", "man spy",
    new Emoji("\u{1F575}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "man spy: light skin tone"),
    new Emoji("\u{1F575}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "man spy: medium-light skin tone"),
    new Emoji("\u{1F575}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "man spy: medium skin tone"),
    new Emoji("\u{1F575}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "man spy: medium-dark skin tone"),
    new Emoji("\u{1F575}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "man spy: dark skin tone"));
const womanSpy = new EmojiGroup(
    "\u{1F575}\u{FE0F}\u{200D}\u{2640}\u{FE0F}", "woman spy",
    new Emoji("\u{1F575}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "woman spy: light skin tone"),
    new Emoji("\u{1F575}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "woman spy: medium-light skin tone"),
    new Emoji("\u{1F575}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "woman spy: medium skin tone"),
    new Emoji("\u{1F575}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "woman spy: medium-dark skin tone"),
    new Emoji("\u{1F575}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "woman spy: dark skin tone"));
const policeOfficer = new EmojiGroup(
    "\u{1F46E}", "police officer",
    new Emoji("\u{1F46E}\u{1F3FB}", "police officer: light skin tone"),
    new Emoji("\u{1F46E}\u{1F3FC}", "police officer: medium-light skin tone"),
    new Emoji("\u{1F46E}\u{1F3FD}", "police officer: medium skin tone"),
    new Emoji("\u{1F46E}\u{1F3FE}", "police officer: medium-dark skin tone"),
    new Emoji("\u{1F46E}\u{1F3FF}", "police officer: dark skin tone"));
const manPoliceOfficer = new EmojiGroup(
    "\u{1F46E}\u{200D}\u{2642}\u{FE0F}", "man police officer",
    new Emoji("\u{1F46E}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "man police officer: light skin tone"),
    new Emoji("\u{1F46E}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "man police officer: medium-light skin tone"),
    new Emoji("\u{1F46E}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "man police officer: medium skin tone"),
    new Emoji("\u{1F46E}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "man police officer: medium-dark skin tone"),
    new Emoji("\u{1F46E}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "man police officer: dark skin tone"));
const womanPoliceOfficer = new EmojiGroup(
    "\u{1F46E}\u{200D}\u{2640}\u{FE0F}", "woman police officer",
    new Emoji("\u{1F46E}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "woman police officer: light skin tone"),
    new Emoji("\u{1F46E}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "woman police officer: medium-light skin tone"),
    new Emoji("\u{1F46E}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "woman police officer: medium skin tone"),
    new Emoji("\u{1F46E}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "woman police officer: medium-dark skin tone"),
    new Emoji("\u{1F46E}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "woman police officer: dark skin tone"));
const manFirefighter = new EmojiGroup(
    "\u{1F468}\u{200D}\u{1F692}", "man firefighter",
    new Emoji("\u{1F468}\u{1F3FB}\u{200D}\u{1F692}", "man firefighter: light skin tone"),
    new Emoji("\u{1F468}\u{1F3FC}\u{200D}\u{1F692}", "man firefighter: medium-light skin tone"),
    new Emoji("\u{1F468}\u{1F3FD}\u{200D}\u{1F692}", "man firefighter: medium skin tone"),
    new Emoji("\u{1F468}\u{1F3FE}\u{200D}\u{1F692}", "man firefighter: medium-dark skin tone"),
    new Emoji("\u{1F468}\u{1F3FF}\u{200D}\u{1F692}", "man firefighter: dark skin tone"));
const womanFirefighter = new EmojiGroup(
    "\u{1F469}\u{200D}\u{1F692}", "woman firefighter",
    new Emoji("\u{1F469}\u{1F3FB}\u{200D}\u{1F692}", "woman firefighter: light skin tone"),
    new Emoji("\u{1F469}\u{1F3FC}\u{200D}\u{1F692}", "woman firefighter: medium-light skin tone"),
    new Emoji("\u{1F469}\u{1F3FD}\u{200D}\u{1F692}", "woman firefighter: medium skin tone"),
    new Emoji("\u{1F469}\u{1F3FE}\u{200D}\u{1F692}", "woman firefighter: medium-dark skin tone"),
    new Emoji("\u{1F469}\u{1F3FF}\u{200D}\u{1F692}", "woman firefighter: dark skin tone"));
const manAstronaut = new EmojiGroup(
    "\u{1F468}\u{200D}\u{1F680}", "man astronaut",
    new Emoji("\u{1F468}\u{1F3FB}\u{200D}\u{1F680}", "man astronaut: light skin tone"),
    new Emoji("\u{1F468}\u{1F3FC}\u{200D}\u{1F680}", "man astronaut: medium-light skin tone"),
    new Emoji("\u{1F468}\u{1F3FD}\u{200D}\u{1F680}", "man astronaut: medium skin tone"),
    new Emoji("\u{1F468}\u{1F3FE}\u{200D}\u{1F680}", "man astronaut: medium-dark skin tone"),
    new Emoji("\u{1F468}\u{1F3FF}\u{200D}\u{1F680}", "man astronaut: dark skin tone"));
const womanAstronaut = new EmojiGroup(
    "\u{1F469}\u{200D}\u{1F680}", "woman astronaut",
    new Emoji("\u{1F469}\u{1F3FB}\u{200D}\u{1F680}", "woman astronaut: light skin tone"),
    new Emoji("\u{1F469}\u{1F3FC}\u{200D}\u{1F680}", "woman astronaut: medium-light skin tone"),
    new Emoji("\u{1F469}\u{1F3FD}\u{200D}\u{1F680}", "woman astronaut: medium skin tone"),
    new Emoji("\u{1F469}\u{1F3FE}\u{200D}\u{1F680}", "woman astronaut: medium-dark skin tone"),
    new Emoji("\u{1F469}\u{1F3FF}\u{200D}\u{1F680}", "woman astronaut: dark skin tone"));
const manPilot = new EmojiGroup(
    "\u{1F468}\u{200D}\u{2708}\u{FE0F}", "man pilot",
    new Emoji("\u{1F468}\u{1F3FB}\u{200D}\u{2708}\u{FE0F}", "man pilot: light skin tone"),
    new Emoji("\u{1F468}\u{1F3FC}\u{200D}\u{2708}\u{FE0F}", "man pilot: medium-light skin tone"),
    new Emoji("\u{1F468}\u{1F3FD}\u{200D}\u{2708}\u{FE0F}", "man pilot: medium skin tone"),
    new Emoji("\u{1F468}\u{1F3FE}\u{200D}\u{2708}\u{FE0F}", "man pilot: medium-dark skin tone"),
    new Emoji("\u{1F468}\u{1F3FF}\u{200D}\u{2708}\u{FE0F}", "man pilot: dark skin tone"));
const womanPilot = new EmojiGroup(
    "\u{1F469}\u{200D}\u{2708}\u{FE0F}", "woman pilot",
    new Emoji("\u{1F469}\u{1F3FB}\u{200D}\u{2708}\u{FE0F}", "woman pilot: light skin tone"),
    new Emoji("\u{1F469}\u{1F3FC}\u{200D}\u{2708}\u{FE0F}", "woman pilot: medium-light skin tone"),
    new Emoji("\u{1F469}\u{1F3FD}\u{200D}\u{2708}\u{FE0F}", "woman pilot: medium skin tone"),
    new Emoji("\u{1F469}\u{1F3FE}\u{200D}\u{2708}\u{FE0F}", "woman pilot: medium-dark skin tone"),
    new Emoji("\u{1F469}\u{1F3FF}\u{200D}\u{2708}\u{FE0F}", "woman pilot: dark skin tone"));
const manArtist = new EmojiGroup(
    "\u{1F468}\u{200D}\u{1F3A8}", "man artist",
    new Emoji("\u{1F468}\u{1F3FB}\u{200D}\u{1F3A8}", "man artist: light skin tone"),
    new Emoji("\u{1F468}\u{1F3FC}\u{200D}\u{1F3A8}", "man artist: medium-light skin tone"),
    new Emoji("\u{1F468}\u{1F3FD}\u{200D}\u{1F3A8}", "man artist: medium skin tone"),
    new Emoji("\u{1F468}\u{1F3FE}\u{200D}\u{1F3A8}", "man artist: medium-dark skin tone"),
    new Emoji("\u{1F468}\u{1F3FF}\u{200D}\u{1F3A8}", "man artist: dark skin tone"));
const womanArtist = new EmojiGroup(
    "\u{1F469}\u{200D}\u{1F3A8}", "woman artist",
    new Emoji("\u{1F469}\u{1F3FB}\u{200D}\u{1F3A8}", "woman artist: light skin tone"),
    new Emoji("\u{1F469}\u{1F3FC}\u{200D}\u{1F3A8}", "woman artist: medium-light skin tone"),
    new Emoji("\u{1F469}\u{1F3FD}\u{200D}\u{1F3A8}", "woman artist: medium skin tone"),
    new Emoji("\u{1F469}\u{1F3FE}\u{200D}\u{1F3A8}", "woman artist: medium-dark skin tone"),
    new Emoji("\u{1F469}\u{1F3FF}\u{200D}\u{1F3A8}", "woman artist: dark skin tone"));
const manSinger = new EmojiGroup(
    "\u{1F468}\u{200D}\u{1F3A4}", "man singer",
    new Emoji("\u{1F468}\u{1F3FB}\u{200D}\u{1F3A4}", "man singer: light skin tone"),
    new Emoji("\u{1F468}\u{1F3FC}\u{200D}\u{1F3A4}", "man singer: medium-light skin tone"),
    new Emoji("\u{1F468}\u{1F3FD}\u{200D}\u{1F3A4}", "man singer: medium skin tone"),
    new Emoji("\u{1F468}\u{1F3FE}\u{200D}\u{1F3A4}", "man singer: medium-dark skin tone"),
    new Emoji("\u{1F468}\u{1F3FF}\u{200D}\u{1F3A4}", "man singer: dark skin tone"));
const womanSinger = new EmojiGroup(
    "\u{1F469}\u{200D}\u{1F3A4}", "woman singer",
    new Emoji("\u{1F469}\u{1F3FB}\u{200D}\u{1F3A4}", "woman singer: light skin tone"),
    new Emoji("\u{1F469}\u{1F3FC}\u{200D}\u{1F3A4}", "woman singer: medium-light skin tone"),
    new Emoji("\u{1F469}\u{1F3FD}\u{200D}\u{1F3A4}", "woman singer: medium skin tone"),
    new Emoji("\u{1F469}\u{1F3FE}\u{200D}\u{1F3A4}", "woman singer: medium-dark skin tone"),
    new Emoji("\u{1F469}\u{1F3FF}\u{200D}\u{1F3A4}", "woman singer: dark skin tone"));
const manTechnologist = new EmojiGroup(
    "\u{1F468}\u{200D}\u{1F4BB}", "man technologist",
    new Emoji("\u{1F468}\u{1F3FB}\u{200D}\u{1F4BB}", "man technologist: light skin tone"),
    new Emoji("\u{1F468}\u{1F3FC}\u{200D}\u{1F4BB}", "man technologist: medium-light skin tone"),
    new Emoji("\u{1F468}\u{1F3FD}\u{200D}\u{1F4BB}", "man technologist: medium skin tone"),
    new Emoji("\u{1F468}\u{1F3FE}\u{200D}\u{1F4BB}", "man technologist: medium-dark skin tone"),
    new Emoji("\u{1F468}\u{1F3FF}\u{200D}\u{1F4BB}", "man technologist: dark skin tone"));
const womanTechnologist = new EmojiGroup(
    "\u{1F469}\u{200D}\u{1F4BB}", "woman technologist",
    new Emoji("\u{1F469}\u{1F3FB}\u{200D}\u{1F4BB}", "woman technologist: light skin tone"),
    new Emoji("\u{1F469}\u{1F3FC}\u{200D}\u{1F4BB}", "woman technologist: medium-light skin tone"),
    new Emoji("\u{1F469}\u{1F3FD}\u{200D}\u{1F4BB}", "woman technologist: medium skin tone"),
    new Emoji("\u{1F469}\u{1F3FE}\u{200D}\u{1F4BB}", "woman technologist: medium-dark skin tone"),
    new Emoji("\u{1F469}\u{1F3FF}\u{200D}\u{1F4BB}", "woman technologist: dark skin tone"));
const manScientist = new EmojiGroup(
    "\u{1F468}\u{200D}\u{1F52C}", "man scientist",
    new Emoji("\u{1F468}\u{1F3FB}\u{200D}\u{1F52C}", "man scientist: light skin tone"),
    new Emoji("\u{1F468}\u{1F3FC}\u{200D}\u{1F52C}", "man scientist: medium-light skin tone"),
    new Emoji("\u{1F468}\u{1F3FD}\u{200D}\u{1F52C}", "man scientist: medium skin tone"),
    new Emoji("\u{1F468}\u{1F3FE}\u{200D}\u{1F52C}", "man scientist: medium-dark skin tone"),
    new Emoji("\u{1F468}\u{1F3FF}\u{200D}\u{1F52C}", "man scientist: dark skin tone"));
const womanScientist = new EmojiGroup(
    "\u{1F469}\u{200D}\u{1F52C}", "woman scientist",
    new Emoji("\u{1F469}\u{1F3FB}\u{200D}\u{1F52C}", "woman scientist: light skin tone"),
    new Emoji("\u{1F469}\u{1F3FC}\u{200D}\u{1F52C}", "woman scientist: medium-light skin tone"),
    new Emoji("\u{1F469}\u{1F3FD}\u{200D}\u{1F52C}", "woman scientist: medium skin tone"),
    new Emoji("\u{1F469}\u{1F3FE}\u{200D}\u{1F52C}", "woman scientist: medium-dark skin tone"),
    new Emoji("\u{1F469}\u{1F3FF}\u{200D}\u{1F52C}", "woman scientist: dark skin tone"));
const roles = [
    new EmojiGroup(
        "\u{2695}\u{FE0F}", "health worker",
        manHealthWorker,
        womanHealthWorker),
    new EmojiGroup(
        "\u{1F393}", "student",
        manStudent,
        womanStudent),
    new EmojiGroup(
        "\u{1F3EB}", "teacher",
        manTeacher,
        womanTeacher),
    new EmojiGroup(
        "\u{2696}\u{FE0F}", "judge",
        manJudge,
        womanJudge),
    new EmojiGroup(
        "\u{1F33E}", "farmer",
        manFarmer,
        womanFarmer),
    new EmojiGroup(
        "\u{1F373}", "cook",
        manCook,
        womanCook),
    new EmojiGroup(
        "\u{1F527}", "mechanic",
        manMechanic,
        womanMechanic),
    new EmojiGroup(
        "\u{1F3ED}", "factory worker",
        manFactoryWorker,
        womanFactoryWorker),
    new EmojiGroup(
        "\u{1F4BC}", "office worker",
        manOfficeWorker,
        womanOfficeWorker),
    new EmojiGroup(
        "\u{1F52C}", "scientist",
        manScientist,
        womanScientist),
    new EmojiGroup(
        "\u{1F4BB}", "technologist",
        manTechnologist,
        womanTechnologist),
    new EmojiGroup(
        "\u{1F3A4}", "singer",
        manSinger,
        womanSinger),
    new EmojiGroup(
        "\u{1F3A8}", "artist",
        manArtist,
        womanArtist),
    new EmojiGroup(
        "\u{2708}\u{FE0F}", "pilot",
        manPilot,
        womanPilot),
    new EmojiGroup(
        "\u{1F680}", "astronaut",
        manAstronaut,
        womanAstronaut),
    new EmojiGroup(
        "\u{1F692}", "firefighter",
        manFirefighter,
        womanFirefighter),
    new EmojiGroup(
        "\u{1F575}\u{FE0F}", "spy",
        spy,
        manSpy,
        womanSpy),
    new EmojiGroup(
        "\u{1F482}", "guard",
        guard,
        manGuard,
        womanGuard),
    new EmojiGroup(
        "\u{1F477}", "construction worker",
        constructionWorker,
        manConstructionWorker,
        womanConstructionWorker),
    new EmojiGroup(
        "\u{1F934}", "royalty",
        prince,
        princess)
];
const personWearingTurban = new EmojiGroup(
    "\u{1F473}", "person wearing turban",
    new Emoji("\u{1F473}\u{1F3FB}", "person wearing turban: light skin tone"),
    new Emoji("\u{1F473}\u{1F3FC}", "person wearing turban: medium-light skin tone"),
    new Emoji("\u{1F473}\u{1F3FD}", "person wearing turban: medium skin tone"),
    new Emoji("\u{1F473}\u{1F3FE}", "person wearing turban: medium-dark skin tone"),
    new Emoji("\u{1F473}\u{1F3FF}", "person wearing turban: dark skin tone"));
const manWearingTurban = new EmojiGroup(
    "\u{1F473}\u{200D}\u{2642}\u{FE0F}", "man wearing turban",
    new Emoji("\u{1F473}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "man wearing turban: light skin tone"),
    new Emoji("\u{1F473}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "man wearing turban: medium-light skin tone"),
    new Emoji("\u{1F473}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "man wearing turban: medium skin tone"),
    new Emoji("\u{1F473}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "man wearing turban: medium-dark skin tone"),
    new Emoji("\u{1F473}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "man wearing turban: dark skin tone"));
const womanWearingTurban = new EmojiGroup(
    "\u{1F473}\u{200D}\u{2640}\u{FE0F}", "woman wearing turban",
    new Emoji("\u{1F473}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "woman wearing turban: light skin tone"),
    new Emoji("\u{1F473}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "woman wearing turban: medium-light skin tone"),
    new Emoji("\u{1F473}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "woman wearing turban: medium skin tone"),
    new Emoji("\u{1F473}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "woman wearing turban: medium-dark skin tone"),
    new Emoji("\u{1F473}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "woman wearing turban: dark skin tone"));
const wearingTurban = new EmojiGroup(
    personWearingTurban.value, "wearing turban",
    personWearingTurban,
    manWearingTurban,
    womanWearingTurban);
const manWithChineseCap = new EmojiGroup(
    "\u{1F472}", "man with Chinese cap",
    new Emoji("\u{1F472}\u{1F3FB}", "man with Chinese cap: light skin tone"),
    new Emoji("\u{1F472}\u{1F3FC}", "man with Chinese cap: medium-light skin tone"),
    new Emoji("\u{1F472}\u{1F3FD}", "man with Chinese cap: medium skin tone"),
    new Emoji("\u{1F472}\u{1F3FE}", "man with Chinese cap: medium-dark skin tone"),
    new Emoji("\u{1F472}\u{1F3FF}", "man with Chinese cap: dark skin tone"));
const womanWithHeadscarf = new EmojiGroup(
    "\u{1F9D5}", "woman with headscarf",
    new Emoji("\u{1F9D5}\u{1F3FB}", "woman with headscarf: light skin tone"),
    new Emoji("\u{1F9D5}\u{1F3FC}", "woman with headscarf: medium-light skin tone"),
    new Emoji("\u{1F9D5}\u{1F3FD}", "woman with headscarf: medium skin tone"),
    new Emoji("\u{1F9D5}\u{1F3FE}", "woman with headscarf: medium-dark skin tone"),
    new Emoji("\u{1F9D5}\u{1F3FF}", "woman with headscarf: dark skin tone"));
const manInTuxedo = new EmojiGroup(
    "\u{1F935}", "man in tuxedo",
    new Emoji("\u{1F935}\u{1F3FB}", "man in tuxedo: light skin tone"),
    new Emoji("\u{1F935}\u{1F3FC}", "man in tuxedo: medium-light skin tone"),
    new Emoji("\u{1F935}\u{1F3FD}", "man in tuxedo: medium skin tone"),
    new Emoji("\u{1F935}\u{1F3FE}", "man in tuxedo: medium-dark skin tone"),
    new Emoji("\u{1F935}\u{1F3FF}", "man in tuxedo: dark skin tone"));
const brideWithVeil = new EmojiGroup(
    "\u{1F470}", "bride with veil",
    new Emoji("\u{1F470}\u{1F3FB}", "bride with veil: light skin tone"),
    new Emoji("\u{1F470}\u{1F3FC}", "bride with veil: medium-light skin tone"),
    new Emoji("\u{1F470}\u{1F3FD}", "bride with veil: medium skin tone"),
    new Emoji("\u{1F470}\u{1F3FE}", "bride with veil: medium-dark skin tone"),
    new Emoji("\u{1F470}\u{1F3FF}", "bride with veil: dark skin tone"));
const pregnantWoman = new EmojiGroup(
    "\u{1F930}", "pregnant woman",
    new Emoji("\u{1F930}\u{1F3FB}", "pregnant woman: light skin tone"),
    new Emoji("\u{1F930}\u{1F3FC}", "pregnant woman: medium-light skin tone"),
    new Emoji("\u{1F930}\u{1F3FD}", "pregnant woman: medium skin tone"),
    new Emoji("\u{1F930}\u{1F3FE}", "pregnant woman: medium-dark skin tone"),
    new Emoji("\u{1F930}\u{1F3FF}", "pregnant woman: dark skin tone"));
const breastFeeding = new EmojiGroup(
    "\u{1F931}", "breast-feeding",
    new Emoji("\u{1F931}\u{1F3FB}", "breast-feeding: light skin tone"),
    new Emoji("\u{1F931}\u{1F3FC}", "breast-feeding: medium-light skin tone"),
    new Emoji("\u{1F931}\u{1F3FD}", "breast-feeding: medium skin tone"),
    new Emoji("\u{1F931}\u{1F3FE}", "breast-feeding: medium-dark skin tone"),
    new Emoji("\u{1F931}\u{1F3FF}", "breast-feeding: dark skin tone"));
const otherPeople = [
    wearingTurban,
    manWithChineseCap,
    womanWithHeadscarf,
    manInTuxedo,
    brideWithVeil,
    pregnantWoman,
    breastFeeding
];
const babyAngel = new EmojiGroup(
    "\u{1F47C}", "baby angel",
    new Emoji("\u{1F47C}\u{1F3FB}", "baby angel: light skin tone"),
    new Emoji("\u{1F47C}\u{1F3FC}", "baby angel: medium-light skin tone"),
    new Emoji("\u{1F47C}\u{1F3FD}", "baby angel: medium skin tone"),
    new Emoji("\u{1F47C}\u{1F3FE}", "baby angel: medium-dark skin tone"),
    new Emoji("\u{1F47C}\u{1F3FF}", "baby angel: dark skin tone"));
const santaClaus = new EmojiGroup(
    "\u{1F385}", "Santa Claus",
    new Emoji("\u{1F385}\u{1F3FB}", "Santa Claus: light skin tone"),
    new Emoji("\u{1F385}\u{1F3FC}", "Santa Claus: medium-light skin tone"),
    new Emoji("\u{1F385}\u{1F3FD}", "Santa Claus: medium skin tone"),
    new Emoji("\u{1F385}\u{1F3FE}", "Santa Claus: medium-dark skin tone"),
    new Emoji("\u{1F385}\u{1F3FF}", "Santa Claus: dark skin tone"));
const mrsClaus = new EmojiGroup(
    "\u{1F936}", "Mrs. Claus",
    new Emoji("\u{1F936}\u{1F3FB}", "Mrs. Claus: light skin tone"),
    new Emoji("\u{1F936}\u{1F3FC}", "Mrs. Claus: medium-light skin tone"),
    new Emoji("\u{1F936}\u{1F3FD}", "Mrs. Claus: medium skin tone"),
    new Emoji("\u{1F936}\u{1F3FE}", "Mrs. Claus: medium-dark skin tone"),
    new Emoji("\u{1F936}\u{1F3FF}", "Mrs. Claus: dark skin tone"));
const superhero = new EmojiGroup(
    "\u{1F9B8}", "superhero",
    new Emoji("\u{1F9B8}\u{1F3FB}", "superhero: light skin tone"),
    new Emoji("\u{1F9B8}\u{1F3FC}", "superhero: medium-light skin tone"),
    new Emoji("\u{1F9B8}\u{1F3FD}", "superhero: medium skin tone"),
    new Emoji("\u{1F9B8}\u{1F3FE}", "superhero: medium-dark skin tone"),
    new Emoji("\u{1F9B8}\u{1F3FF}", "superhero: dark skin tone"));
const manSuperhero = new EmojiGroup(
    "\u{1F9B8}\u{200D}\u{2642}\u{FE0F}", "man superhero",
    new Emoji("\u{1F9B8}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "man superhero: light skin tone"),
    new Emoji("\u{1F9B8}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "man superhero: medium-light skin tone"),
    new Emoji("\u{1F9B8}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "man superhero: medium skin tone"),
    new Emoji("\u{1F9B8}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "man superhero: medium-dark skin tone"),
    new Emoji("\u{1F9B8}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "man superhero: dark skin tone"));
const womanSuperhero = new EmojiGroup(
    "\u{1F9B8}\u{200D}\u{2640}\u{FE0F}", "woman superhero",
    new Emoji("\u{1F9B8}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "woman superhero: light skin tone"),
    new Emoji("\u{1F9B8}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "woman superhero: medium-light skin tone"),
    new Emoji("\u{1F9B8}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "woman superhero: medium skin tone"),
    new Emoji("\u{1F9B8}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "woman superhero: medium-dark skin tone"),
    new Emoji("\u{1F9B8}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "woman superhero: dark skin tone"));
const supervillain = new EmojiGroup(
    "\u{1F9B9}", "supervillain",
    new Emoji("\u{1F9B9}\u{1F3FB}", "supervillain: light skin tone"),
    new Emoji("\u{1F9B9}\u{1F3FC}", "supervillain: medium-light skin tone"),
    new Emoji("\u{1F9B9}\u{1F3FD}", "supervillain: medium skin tone"),
    new Emoji("\u{1F9B9}\u{1F3FE}", "supervillain: medium-dark skin tone"),
    new Emoji("\u{1F9B9}\u{1F3FF}", "supervillain: dark skin tone"));
const manSupervillain = new EmojiGroup(
    "\u{1F9B9}\u{200D}\u{2642}\u{FE0F}", "man supervillain",
    new Emoji("\u{1F9B9}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "man supervillain: light skin tone"),
    new Emoji("\u{1F9B9}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "man supervillain: medium-light skin tone"),
    new Emoji("\u{1F9B9}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "man supervillain: medium skin tone"),
    new Emoji("\u{1F9B9}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "man supervillain: medium-dark skin tone"),
    new Emoji("\u{1F9B9}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "man supervillain: dark skin tone"));
const womanSupervillain = new EmojiGroup(
    "\u{1F9B9}\u{200D}\u{2640}\u{FE0F}", "woman supervillain",
    new Emoji("\u{1F9B9}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "woman supervillain: light skin tone"),
    new Emoji("\u{1F9B9}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "woman supervillain: medium-light skin tone"),
    new Emoji("\u{1F9B9}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "woman supervillain: medium skin tone"),
    new Emoji("\u{1F9B9}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "woman supervillain: medium-dark skin tone"),
    new Emoji("\u{1F9B9}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "woman supervillain: dark skin tone"));
const mage = new EmojiGroup(
    "\u{1F9D9}", "mage",
    new Emoji("\u{1F9D9}\u{1F3FB}", "mage: light skin tone"),
    new Emoji("\u{1F9D9}\u{1F3FC}", "mage: medium-light skin tone"),
    new Emoji("\u{1F9D9}\u{1F3FD}", "mage: medium skin tone"),
    new Emoji("\u{1F9D9}\u{1F3FE}", "mage: medium-dark skin tone"),
    new Emoji("\u{1F9D9}\u{1F3FF}", "mage: dark skin tone"));
const manMage = new EmojiGroup(
    "\u{1F9D9}\u{200D}\u{2642}\u{FE0F}", "man mage",
    new Emoji("\u{1F9D9}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "man mage: light skin tone"),
    new Emoji("\u{1F9D9}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "man mage: medium-light skin tone"),
    new Emoji("\u{1F9D9}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "man mage: medium skin tone"),
    new Emoji("\u{1F9D9}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "man mage: medium-dark skin tone"),
    new Emoji("\u{1F9D9}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "man mage: dark skin tone"));
const womanMage = new EmojiGroup(
    "\u{1F9D9}\u{200D}\u{2640}\u{FE0F}", "woman mage",
    new Emoji("\u{1F9D9}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "woman mage: light skin tone"),
    new Emoji("\u{1F9D9}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "woman mage: medium-light skin tone"),
    new Emoji("\u{1F9D9}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "woman mage: medium skin tone"),
    new Emoji("\u{1F9D9}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "woman mage: medium-dark skin tone"),
    new Emoji("\u{1F9D9}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "woman mage: dark skin tone"));
const fairy = new EmojiGroup(
    "\u{1F9DA}", "fairy",
    new Emoji("\u{1F9DA}\u{1F3FB}", "fairy: light skin tone"),
    new Emoji("\u{1F9DA}\u{1F3FC}", "fairy: medium-light skin tone"),
    new Emoji("\u{1F9DA}\u{1F3FD}", "fairy: medium skin tone"),
    new Emoji("\u{1F9DA}\u{1F3FE}", "fairy: medium-dark skin tone"),
    new Emoji("\u{1F9DA}\u{1F3FF}", "fairy: dark skin tone"));
const manFairy = new EmojiGroup(
    "\u{1F9DA}\u{200D}\u{2642}\u{FE0F}", "man fairy",
    new Emoji("\u{1F9DA}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "man fairy: light skin tone"),
    new Emoji("\u{1F9DA}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "man fairy: medium-light skin tone"),
    new Emoji("\u{1F9DA}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "man fairy: medium skin tone"),
    new Emoji("\u{1F9DA}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "man fairy: medium-dark skin tone"),
    new Emoji("\u{1F9DA}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "man fairy: dark skin tone"));
const womanFairy = new EmojiGroup(
    "\u{1F9DA}\u{200D}\u{2640}\u{FE0F}", "woman fairy",
    new Emoji("\u{1F9DA}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "woman fairy: light skin tone"),
    new Emoji("\u{1F9DA}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "woman fairy: medium-light skin tone"),
    new Emoji("\u{1F9DA}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "woman fairy: medium skin tone"),
    new Emoji("\u{1F9DA}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "woman fairy: medium-dark skin tone"),
    new Emoji("\u{1F9DA}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "woman fairy: dark skin tone"));
const vampire = new EmojiGroup(
    "\u{1F9DB}", "vampire",
    new Emoji("\u{1F9DB}\u{1F3FB}", "vampire: light skin tone"),
    new Emoji("\u{1F9DB}\u{1F3FC}", "vampire: medium-light skin tone"),
    new Emoji("\u{1F9DB}\u{1F3FD}", "vampire: medium skin tone"),
    new Emoji("\u{1F9DB}\u{1F3FE}", "vampire: medium-dark skin tone"),
    new Emoji("\u{1F9DB}\u{1F3FF}", "vampire: dark skin tone"));
const manVampire = new EmojiGroup(
    "\u{1F9DB}\u{200D}\u{2642}\u{FE0F}", "man vampire",
    new Emoji("\u{1F9DB}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "man vampire: light skin tone"),
    new Emoji("\u{1F9DB}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "man vampire: medium-light skin tone"),
    new Emoji("\u{1F9DB}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "man vampire: medium skin tone"),
    new Emoji("\u{1F9DB}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "man vampire: medium-dark skin tone"),
    new Emoji("\u{1F9DB}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "man vampire: dark skin tone"));
const womanVampire = new EmojiGroup(
    "\u{1F9DB}\u{200D}\u{2640}\u{FE0F}", "woman vampire",
    new Emoji("\u{1F9DB}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "woman vampire: light skin tone"),
    new Emoji("\u{1F9DB}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "woman vampire: medium-light skin tone"),
    new Emoji("\u{1F9DB}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "woman vampire: medium skin tone"),
    new Emoji("\u{1F9DB}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "woman vampire: medium-dark skin tone"),
    new Emoji("\u{1F9DB}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "woman vampire: dark skin tone"));
const merperson = new EmojiGroup(
    "\u{1F9DC}", "merperson",
    new Emoji("\u{1F9DC}\u{1F3FB}", "merperson: light skin tone"),
    new Emoji("\u{1F9DC}\u{1F3FC}", "merperson: medium-light skin tone"),
    new Emoji("\u{1F9DC}\u{1F3FD}", "merperson: medium skin tone"),
    new Emoji("\u{1F9DC}\u{1F3FE}", "merperson: medium-dark skin tone"),
    new Emoji("\u{1F9DC}\u{1F3FF}", "merperson: dark skin tone"));
const merman = new EmojiGroup(
    "\u{1F9DC}\u{200D}\u{2642}\u{FE0F}", "merman",
    new Emoji("\u{1F9DC}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "merman: light skin tone"),
    new Emoji("\u{1F9DC}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "merman: medium-light skin tone"),
    new Emoji("\u{1F9DC}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "merman: medium skin tone"),
    new Emoji("\u{1F9DC}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "merman: medium-dark skin tone"),
    new Emoji("\u{1F9DC}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "merman: dark skin tone"));
const mermaid = new EmojiGroup(
    "\u{1F9DC}\u{200D}\u{2640}\u{FE0F}", "mermaid",
    new Emoji("\u{1F9DC}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "mermaid: light skin tone"),
    new Emoji("\u{1F9DC}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "mermaid: medium-light skin tone"),
    new Emoji("\u{1F9DC}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "mermaid: medium skin tone"),
    new Emoji("\u{1F9DC}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "mermaid: medium-dark skin tone"),
    new Emoji("\u{1F9DC}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "mermaid: dark skin tone"));
const elf = new EmojiGroup(
    "\u{1F9DD}", "elf",
    new Emoji("\u{1F9DD}\u{1F3FB}", "elf: light skin tone"),
    new Emoji("\u{1F9DD}\u{1F3FC}", "elf: medium-light skin tone"),
    new Emoji("\u{1F9DD}\u{1F3FD}", "elf: medium skin tone"),
    new Emoji("\u{1F9DD}\u{1F3FE}", "elf: medium-dark skin tone"),
    new Emoji("\u{1F9DD}\u{1F3FF}", "elf: dark skin tone"));
const manElf = new EmojiGroup(
    "\u{1F9DD}\u{200D}\u{2642}\u{FE0F}", "man elf",
    new Emoji("\u{1F9DD}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "man elf: light skin tone"),
    new Emoji("\u{1F9DD}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "man elf: medium-light skin tone"),
    new Emoji("\u{1F9DD}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "man elf: medium skin tone"),
    new Emoji("\u{1F9DD}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "man elf: medium-dark skin tone"),
    new Emoji("\u{1F9DD}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "man elf: dark skin tone"));
const womanElf = new EmojiGroup(
    "\u{1F9DD}\u{200D}\u{2640}\u{FE0F}", "woman elf",
    new Emoji("\u{1F9DD}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "woman elf: light skin tone"),
    new Emoji("\u{1F9DD}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "woman elf: medium-light skin tone"),
    new Emoji("\u{1F9DD}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "woman elf: medium skin tone"),
    new Emoji("\u{1F9DD}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "woman elf: medium-dark skin tone"),
    new Emoji("\u{1F9DD}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "woman elf: dark skin tone"));
const genie = new Emoji("\u{1F9DE}", "genie");
const manGenie = new Emoji("\u{1F9DE}\u{200D}\u{2642}\u{FE0F}", "man genie");
const womanGenie = new Emoji("\u{1F9DE}\u{200D}\u{2640}\u{FE0F}", "woman genie");
const zombie = new Emoji("\u{1F9DF}", "zombie");
const manZombie = new Emoji("\u{1F9DF}\u{200D}\u{2642}\u{FE0F}", "man zombie");
const womanZombie = new Emoji("\u{1F9DF}\u{200D}\u{2640}\u{FE0F}", "woman zombie");
const fantasy = [
    babyAngel,
    santaClaus,
    mrsClaus,
    new EmojiGroup(
        "\u{1F9B8}", "superhero",
        superhero,
        manSuperhero,
        womanSuperhero),
    new EmojiGroup(
        "\u{1F9B9}", "supervillain",
        supervillain,
        manSupervillain,
        womanSupervillain),
    new EmojiGroup(
        "\u{1F9D9}", "mage",
        mage,
        manMage,
        womanMage),
    new EmojiGroup(
        "\u{1F9DA}", "fairy",
        fairy,
        manFairy,
        womanFairy),
    new EmojiGroup(
        "\u{1F9DB}", "vampire",
        vampire,
        manVampire,
        womanVampire),
    new EmojiGroup(
        "\u{1F9DC}", "merperson",
        merperson,
        merman,
        mermaid),
    new EmojiGroup(
        "\u{1F9DD}", "elf",
        elf,
        manElf,
        womanElf),
    new EmojiGroup(
        "\u{1F9DE}", "genie",
        genie,
        manGenie,
        womanGenie),
    new EmojiGroup(
        "\u{1F9DF}", "zombie",
        zombie,
        manZombie,
        womanZombie)
];

const personGettingMassage = new EmojiGroup(
    "\u{1F486}", "person getting massage",
    new Emoji("\u{1F486}\u{1F3FB}", "person getting massage: light skin tone"),
    new Emoji("\u{1F486}\u{1F3FC}", "person getting massage: medium-light skin tone"),
    new Emoji("\u{1F486}\u{1F3FD}", "person getting massage: medium skin tone"),
    new Emoji("\u{1F486}\u{1F3FE}", "person getting massage: medium-dark skin tone"),
    new Emoji("\u{1F486}\u{1F3FF}", "person getting massage: dark skin tone"));
const manGettingMassage = new EmojiGroup(
    "\u{1F486}\u{200D}\u{2642}\u{FE0F}", "man getting massage",
    new Emoji("\u{1F486}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "man getting massage: light skin tone"),
    new Emoji("\u{1F486}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "man getting massage: medium-light skin tone"),
    new Emoji("\u{1F486}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "man getting massage: medium skin tone"),
    new Emoji("\u{1F486}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "man getting massage: medium-dark skin tone"),
    new Emoji("\u{1F486}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "man getting massage: dark skin tone"));
const womanGettingMassage = new EmojiGroup(
    "\u{1F486}\u{200D}\u{2640}\u{FE0F}", "woman getting massage",
    new Emoji("\u{1F486}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "woman getting massage: light skin tone"),
    new Emoji("\u{1F486}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "woman getting massage: medium-light skin tone"),
    new Emoji("\u{1F486}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "woman getting massage: medium skin tone"),
    new Emoji("\u{1F486}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "woman getting massage: medium-dark skin tone"),
    new Emoji("\u{1F486}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "woman getting massage: dark skin tone"));
const personGettingHaircut = new EmojiGroup(
    "\u{1F487}", "person getting haircut",
    new Emoji("\u{1F487}\u{1F3FB}", "person getting haircut: light skin tone"),
    new Emoji("\u{1F487}\u{1F3FC}", "person getting haircut: medium-light skin tone"),
    new Emoji("\u{1F487}\u{1F3FD}", "person getting haircut: medium skin tone"),
    new Emoji("\u{1F487}\u{1F3FE}", "person getting haircut: medium-dark skin tone"),
    new Emoji("\u{1F487}\u{1F3FF}", "person getting haircut: dark skin tone"));
const manGettingHaircut = new EmojiGroup(
    "\u{1F487}\u{200D}\u{2642}\u{FE0F}", "man getting haircut",
    new Emoji("\u{1F487}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "man getting haircut: light skin tone"),
    new Emoji("\u{1F487}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "man getting haircut: medium-light skin tone"),
    new Emoji("\u{1F487}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "man getting haircut: medium skin tone"),
    new Emoji("\u{1F487}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "man getting haircut: medium-dark skin tone"),
    new Emoji("\u{1F487}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "man getting haircut: dark skin tone"));
const womanGettingHaircut = new EmojiGroup(
    "\u{1F487}\u{200D}\u{2640}\u{FE0F}", "woman getting haircut",
    new Emoji("\u{1F487}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "woman getting haircut: light skin tone"),
    new Emoji("\u{1F487}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "woman getting haircut: medium-light skin tone"),
    new Emoji("\u{1F487}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "woman getting haircut: medium skin tone"),
    new Emoji("\u{1F487}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "woman getting haircut: medium-dark skin tone"),
    new Emoji("\u{1F487}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "woman getting haircut: dark skin tone"));
const personWalking = new EmojiGroup(
    "\u{1F6B6}", "person walking",
    new Emoji("\u{1F6B6}\u{1F3FB}", "person walking: light skin tone"),
    new Emoji("\u{1F6B6}\u{1F3FC}", "person walking: medium-light skin tone"),
    new Emoji("\u{1F6B6}\u{1F3FD}", "person walking: medium skin tone"),
    new Emoji("\u{1F6B6}\u{1F3FE}", "person walking: medium-dark skin tone"),
    new Emoji("\u{1F6B6}\u{1F3FF}", "person walking: dark skin tone"));
const manWalking = {
    value: "\u{1F6B6}\u{200D}\u{2642}\u{FE0F}", desc: "man walking", alts: [
        new Emoji("\u{1F6B6}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "man walking: light skin tone"),
        new Emoji("\u{1F6B6}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "man walking: medium-light skin tone"),
        new Emoji("\u{1F6B6}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "man walking: medium skin tone"),
        new Emoji("\u{1F6B6}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "man walking: medium-dark skin tone"),
        new Emoji("\u{1F6B6}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "man walking: dark skin tone"),
        new Emoji("\u{1F6B6}\u{200D}\u{2640}\u{FE0F}", "woman walking"),
    ]
};
const womanWalking = new EmojiGroup(
    "\u{1F6B6}\u{200D}\u{2640}", "woman walking",
    new Emoji("\u{1F6B6}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "woman walking: light skin tone"),
    new Emoji("\u{1F6B6}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "woman walking: medium-light skin tone"),
    new Emoji("\u{1F6B6}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "woman walking: medium skin tone"),
    new Emoji("\u{1F6B6}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "woman walking: medium-dark skin tone"),
    new Emoji("\u{1F6B6}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "woman walking: dark skin tone"));
const personStanding = new EmojiGroup(
    "\u{1F9CD}", "person standing",
    new Emoji("\u{1F9CD}\u{1F3FB}", "person standing: light skin tone"),
    new Emoji("\u{1F9CD}\u{1F3FC}", "person standing: medium-light skin tone"),
    new Emoji("\u{1F9CD}\u{1F3FD}", "person standing: medium skin tone"),
    new Emoji("\u{1F9CD}\u{1F3FE}", "person standing: medium-dark skin tone"),
    new Emoji("\u{1F9CD}\u{1F3FF}", "person standing: dark skin tone"));
const manStanding = new EmojiGroup(
    "\u{1F9CD}\u{200D}\u{2642}\u{FE0F}", "man standing",
    new Emoji("\u{1F9CD}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "man standing: light skin tone"),
    new Emoji("\u{1F9CD}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "man standing: medium-light skin tone"),
    new Emoji("\u{1F9CD}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "man standing: medium skin tone"),
    new Emoji("\u{1F9CD}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "man standing: medium-dark skin tone"),
    new Emoji("\u{1F9CD}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "man standing: dark skin tone"));
const womanStanding = new EmojiGroup(
    "\u{1F9CD}\u{200D}\u{2640}\u{FE0F}", "woman standing",
    new Emoji("\u{1F9CD}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "woman standing: light skin tone"),
    new Emoji("\u{1F9CD}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "woman standing: medium-light skin tone"),
    new Emoji("\u{1F9CD}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "woman standing: medium skin tone"),
    new Emoji("\u{1F9CD}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "woman standing: medium-dark skin tone"),
    new Emoji("\u{1F9CD}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "woman standing: dark skin tone"));
const personKneeling = new EmojiGroup(
    "\u{1F9CE}", "person kneeling",
    new Emoji("\u{1F9CE}\u{1F3FB}", "person kneeling: light skin tone"),
    new Emoji("\u{1F9CE}\u{1F3FC}", "person kneeling: medium-light skin tone"),
    new Emoji("\u{1F9CE}\u{1F3FD}", "person kneeling: medium skin tone"),
    new Emoji("\u{1F9CE}\u{1F3FE}", "person kneeling: medium-dark skin tone"),
    new Emoji("\u{1F9CE}\u{1F3FF}", "person kneeling: dark skin tone"));
const manKneeling = new EmojiGroup(
    "\u{1F9CE}\u{200D}\u{2642}\u{FE0F}", "man kneeling",
    new Emoji("\u{1F9CE}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "man kneeling: light skin tone"),
    new Emoji("\u{1F9CE}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "man kneeling: medium-light skin tone"),
    new Emoji("\u{1F9CE}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "man kneeling: medium skin tone"),
    new Emoji("\u{1F9CE}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "man kneeling: medium-dark skin tone"),
    new Emoji("\u{1F9CE}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "man kneeling: dark skin tone"));
const womanKneeling = new EmojiGroup(
    "\u{1F9CE}\u{200D}\u{2640}\u{FE0F}", "woman kneeling",
    new Emoji("\u{1F9CE}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "woman kneeling: light skin tone"),
    new Emoji("\u{1F9CE}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "woman kneeling: medium-light skin tone"),
    new Emoji("\u{1F9CE}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "woman kneeling: medium skin tone"),
    new Emoji("\u{1F9CE}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "woman kneeling: medium-dark skin tone"),
    new Emoji("\u{1F9CE}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "woman kneeling: dark skin tone"));
const manWithProbingCane = new EmojiGroup(
    "\u{1F468}\u{200D}\u{1F9AF}", "man with probing cane",
    new Emoji("\u{1F468}\u{1F3FB}\u{200D}\u{1F9AF}", "man with probing cane: light skin tone"),
    new Emoji("\u{1F468}\u{1F3FC}\u{200D}\u{1F9AF}", "man with probing cane: medium-light skin tone"),
    new Emoji("\u{1F468}\u{1F3FD}\u{200D}\u{1F9AF}", "man with probing cane: medium skin tone"),
    new Emoji("\u{1F468}\u{1F3FE}\u{200D}\u{1F9AF}", "man with probing cane: medium-dark skin tone"),
    new Emoji("\u{1F468}\u{1F3FF}\u{200D}\u{1F9AF}", "man with probing cane: dark skin tone"));
const womanWithProbingCane = new EmojiGroup(
    "\u{1F469}\u{200D}\u{1F9AF}", "woman with probing cane",
    new Emoji("\u{1F469}\u{1F3FB}\u{200D}\u{1F9AF}", "woman with probing cane: light skin tone"),
    new Emoji("\u{1F469}\u{1F3FC}\u{200D}\u{1F9AF}", "woman with probing cane: medium-light skin tone"),
    new Emoji("\u{1F469}\u{1F3FD}\u{200D}\u{1F9AF}", "woman with probing cane: medium skin tone"),
    new Emoji("\u{1F469}\u{1F3FE}\u{200D}\u{1F9AF}", "woman with probing cane: medium-dark skin tone"),
    new Emoji("\u{1F469}\u{1F3FF}\u{200D}\u{1F9AF}", "woman with probing cane: dark skin tone"));
const manInMotorizedWheelchair = new EmojiGroup(
    "\u{1F468}\u{200D}\u{1F9BC}", "man in motorized wheelchair",
    new Emoji("\u{1F468}\u{1F3FB}\u{200D}\u{1F9BC}", "man in motorized wheelchair: light skin tone"),
    new Emoji("\u{1F468}\u{1F3FC}\u{200D}\u{1F9BC}", "man in motorized wheelchair: medium-light skin tone"),
    new Emoji("\u{1F468}\u{1F3FD}\u{200D}\u{1F9BC}", "man in motorized wheelchair: medium skin tone"),
    new Emoji("\u{1F468}\u{1F3FE}\u{200D}\u{1F9BC}", "man in motorized wheelchair: medium-dark skin tone"),
    new Emoji("\u{1F468}\u{1F3FF}\u{200D}\u{1F9BC}", "man in motorized wheelchair: dark skin tone"));
const womanInMotorizedWheelchair = new EmojiGroup(
    "\u{1F469}\u{200D}\u{1F9BC}", "woman in motorized wheelchair",
    new Emoji("\u{1F469}\u{1F3FB}\u{200D}\u{1F9BC}", "woman in motorized wheelchair: light skin tone"),
    new Emoji("\u{1F469}\u{1F3FC}\u{200D}\u{1F9BC}", "woman in motorized wheelchair: medium-light skin tone"),
    new Emoji("\u{1F469}\u{1F3FD}\u{200D}\u{1F9BC}", "woman in motorized wheelchair: medium skin tone"),
    new Emoji("\u{1F469}\u{1F3FE}\u{200D}\u{1F9BC}", "woman in motorized wheelchair: medium-dark skin tone"),
    new Emoji("\u{1F469}\u{1F3FF}\u{200D}\u{1F9BC}", "woman in motorized wheelchair: dark skin tone"));
const manInManualWheelchair = new EmojiGroup(
    "\u{1F468}\u{200D}\u{1F9BD}", "man in manual wheelchair",
    new Emoji("\u{1F468}\u{1F3FB}\u{200D}\u{1F9BD}", "man in manual wheelchair: light skin tone"),
    new Emoji("\u{1F468}\u{1F3FC}\u{200D}\u{1F9BD}", "man in manual wheelchair: medium-light skin tone"),
    new Emoji("\u{1F468}\u{1F3FD}\u{200D}\u{1F9BD}", "man in manual wheelchair: medium skin tone"),
    new Emoji("\u{1F468}\u{1F3FE}\u{200D}\u{1F9BD}", "man in manual wheelchair: medium-dark skin tone"),
    new Emoji("\u{1F468}\u{1F3FF}\u{200D}\u{1F9BD}", "man in manual wheelchair: dark skin tone"));
const womanInManualWheelchair = new EmojiGroup(
    "\u{1F469}\u{200D}\u{1F9BD}", "woman in manual wheelchair",
    new Emoji("\u{1F469}\u{1F3FB}\u{200D}\u{1F9BD}", "woman in manual wheelchair: light skin tone"),
    new Emoji("\u{1F469}\u{1F3FC}\u{200D}\u{1F9BD}", "woman in manual wheelchair: medium-light skin tone"),
    new Emoji("\u{1F469}\u{1F3FD}\u{200D}\u{1F9BD}", "woman in manual wheelchair: medium skin tone"),
    new Emoji("\u{1F469}\u{1F3FE}\u{200D}\u{1F9BD}", "woman in manual wheelchair: medium-dark skin tone"),
    new Emoji("\u{1F469}\u{1F3FF}\u{200D}\u{1F9BD}", "woman in manual wheelchair: dark skin tone"));
const personRunning = new EmojiGroup(
    "\u{1F3C3}", "person running",
    new Emoji("\u{1F3C3}\u{1F3FB}", "person running: light skin tone"),
    new Emoji("\u{1F3C3}\u{1F3FC}", "person running: medium-light skin tone"),
    new Emoji("\u{1F3C3}\u{1F3FD}", "person running: medium skin tone"),
    new Emoji("\u{1F3C3}\u{1F3FE}", "person running: medium-dark skin tone"),
    new Emoji("\u{1F3C3}\u{1F3FF}", "person running: dark skin tone"));
const manRunning = new EmojiGroup(
    "\u{1F3C3}\u{200D}\u{2642}\u{FE0F}", "man running",
    new Emoji("\u{1F3C3}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "man running: light skin tone"),
    new Emoji("\u{1F3C3}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "man running: medium-light skin tone"),
    new Emoji("\u{1F3C3}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "man running: medium skin tone"),
    new Emoji("\u{1F3C3}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "man running: medium-dark skin tone"),
    new Emoji("\u{1F3C3}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "man running: dark skin tone"));
const womanRunning = new EmojiGroup(
    "\u{1F3C3}\u{200D}\u{2640}\u{FE0F}", "woman running",
    new Emoji("\u{1F3C3}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "woman running: light skin tone"),
    new Emoji("\u{1F3C3}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "woman running: medium-light skin tone"),
    new Emoji("\u{1F3C3}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "woman running: medium skin tone"),
    new Emoji("\u{1F3C3}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "woman running: medium-dark skin tone"),
    new Emoji("\u{1F3C3}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "woman running: dark skin tone"));
const manDancing = new EmojiGroup(
    "\u{1F57A}", "man dancing",
    new Emoji("\u{1F57A}\u{1F3FB}", "man dancing: light skin tone"),
    new Emoji("\u{1F57A}\u{1F3FC}", "man dancing: medium-light skin tone"),
    new Emoji("\u{1F57A}\u{1F3FD}", "man dancing: medium skin tone"),
    new Emoji("\u{1F57A}\u{1F3FE}", "man dancing: medium-dark skin tone"),
    new Emoji("\u{1F57A}\u{1F3FF}", "man dancing: dark skin tone"));
const womanDancing = new EmojiGroup(
    "\u{1F483}", "woman dancing",
    new Emoji("\u{1F483}\u{1F3FB}", "woman dancing: light skin tone"),
    new Emoji("\u{1F483}\u{1F3FC}", "woman dancing: medium-light skin tone"),
    new Emoji("\u{1F483}\u{1F3FD}", "woman dancing: medium skin tone"),
    new Emoji("\u{1F483}\u{1F3FE}", "woman dancing: medium-dark skin tone"),
    new Emoji("\u{1F483}\u{1F3FF}", "woman dancing: dark skin tone"));
const manInSuitLevitating = new EmojiGroup(
    "\u{1F574}\u{FE0F}", "man in suit levitating",
    new Emoji("\u{1F574}\u{1F3FB}", "man in suit levitating: light skin tone"),
    new Emoji("\u{1F574}\u{1F3FC}", "man in suit levitating: medium-light skin tone"),
    new Emoji("\u{1F574}\u{1F3FD}", "man in suit levitating: medium skin tone"),
    new Emoji("\u{1F574}\u{1F3FE}", "man in suit levitating: medium-dark skin tone"),
    new Emoji("\u{1F574}\u{1F3FF}", "man in suit levitating: dark skin tone"));
const personInSteamyRoom = new EmojiGroup(
    "\u{1F9D6}", "person in steamy room",
    new Emoji("\u{1F9D6}\u{1F3FB}", "person in steamy room: light skin tone"),
    new Emoji("\u{1F9D6}\u{1F3FC}", "person in steamy room: medium-light skin tone"),
    new Emoji("\u{1F9D6}\u{1F3FD}", "person in steamy room: medium skin tone"),
    new Emoji("\u{1F9D6}\u{1F3FE}", "person in steamy room: medium-dark skin tone"),
    new Emoji("\u{1F9D6}\u{1F3FF}", "person in steamy room: dark skin tone"));
const manInSteamyRoom = new EmojiGroup(
    "\u{1F9D6}\u{200D}\u{2642}\u{FE0F}", "man in steamy room",
    new Emoji("\u{1F9D6}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "man in steamy room: light skin tone"),
    new Emoji("\u{1F9D6}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "man in steamy room: medium-light skin tone"),
    new Emoji("\u{1F9D6}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "man in steamy room: medium skin tone"),
    new Emoji("\u{1F9D6}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "man in steamy room: medium-dark skin tone"),
    new Emoji("\u{1F9D6}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "man in steamy room: dark skin tone"));
const womanInSteamyRoom = new EmojiGroup(
    "\u{1F9D6}\u{200D}\u{2640}\u{FE0F}", "woman in steamy room",
    new Emoji("\u{1F9D6}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "woman in steamy room: light skin tone"),
    new Emoji("\u{1F9D6}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "woman in steamy room: medium-light skin tone"),
    new Emoji("\u{1F9D6}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "woman in steamy room: medium skin tone"),
    new Emoji("\u{1F9D6}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "woman in steamy room: medium-dark skin tone"),
    new Emoji("\u{1F9D6}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "woman in steamy room: dark skin tone"));
const activity = [
    new EmojiGroup(
        "\u{1F486}", "person getting massage",
        personGettingMassage,
        manGettingMassage,
        womanGettingMassage),
    new EmojiGroup(
        "\u{1F487}", "person getting haircut",
        personGettingHaircut,
        manGettingHaircut,
        womanGettingHaircut),
    new EmojiGroup(
        "\u{1F6B6}", "person walking",
        personWalking,
        manWalking,
        womanWalking),
    new EmojiGroup(
        "\u{1F9CD}", "person standing",
        personStanding,
        manStanding,
        womanStanding),
    new EmojiGroup(
        "\u{1F9CE}", "person kneeling",
        personKneeling,
        manKneeling,
        womanKneeling),
    new EmojiGroup(
        "\u{1F9AF}", "probing cane",
        manWithProbingCane,
        womanWithProbingCane),
    new EmojiGroup(
        "\u{1F9BC}", "motorized wheelchair",
        manInMotorizedWheelchair,
        womanInMotorizedWheelchair),
    new EmojiGroup(
        "\u{1F9BD}", "manual wheelchair",
        manInManualWheelchair,
        womanInManualWheelchair),
    new EmojiGroup(
        "\u{1F3C3}", "person running",
        personRunning,
        manRunning,
        womanRunning),
    new EmojiGroup(
        "\u{1F57A}", "dancing",
        manDancing,
        womanDancing),
    manInSuitLevitating,
    new EmojiGroup(
        "\u{1F9D6}", "person in steamy room",
        personInSteamyRoom,
        manInSteamyRoom,
        womanInSteamyRoom),
];

const personClimbing = new EmojiGroup(
    "\u{1F9D7}", "person climbing",
    new Emoji("\u{1F9D7}\u{1F3FB}", "person climbing: light skin tone"),
    new Emoji("\u{1F9D7}\u{1F3FC}", "person climbing: medium-light skin tone"),
    new Emoji("\u{1F9D7}\u{1F3FD}", "person climbing: medium skin tone"),
    new Emoji("\u{1F9D7}\u{1F3FE}", "person climbing: medium-dark skin tone"),
    new Emoji("\u{1F9D7}\u{1F3FF}", "person climbing: dark skin tone"));
const manClimbing = new EmojiGroup(
    "\u{1F9D7}\u{200D}\u{2642}\u{FE0F}", "man climbing",
    new Emoji("\u{1F9D7}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "man climbing: light skin tone"),
    new Emoji("\u{1F9D7}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "man climbing: medium-light skin tone"),
    new Emoji("\u{1F9D7}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "man climbing: medium skin tone"),
    new Emoji("\u{1F9D7}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "man climbing: medium-dark skin tone"),
    new Emoji("\u{1F9D7}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "man climbing: dark skin tone"));
const womanClimbing = new EmojiGroup(
    "\u{1F9D7}\u{200D}\u{2640}\u{FE0F}", "woman climbing",
    new Emoji("\u{1F9D7}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "woman climbing: light skin tone"),
    new Emoji("\u{1F9D7}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "woman climbing: medium-light skin tone"),
    new Emoji("\u{1F9D7}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "woman climbing: medium skin tone"),
    new Emoji("\u{1F9D7}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "woman climbing: medium-dark skin tone"),
    new Emoji("\u{1F9D7}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "woman climbing: dark skin tone"));
const personFencing = new Emoji("\u{1F93A}", "person fencing");
const personRacingHorse = new EmojiGroup(
    "\u{1F3C7}", "horse racing",
    new Emoji("\u{1F3C7}\u{1F3FB}", "horse racing: light skin tone"),
    new Emoji("\u{1F3C7}\u{1F3FC}", "horse racing: medium-light skin tone"),
    new Emoji("\u{1F3C7}\u{1F3FD}", "horse racing: medium skin tone"),
    new Emoji("\u{1F3C7}\u{1F3FE}", "horse racing: medium-dark skin tone"),
    new Emoji("\u{1F3C7}\u{1F3FF}", "horse racing: dark skin tone"));
const personSkiing = new Emoji("\u{26F7}\u{FE0F}", "skier");
const personSnowboarding = new EmojiGroup(
    "\u{1F3C2}", "snowboarder",
    new Emoji("\u{1F3C2}\u{1F3FB}", "snowboarder: light skin tone"),
    new Emoji("\u{1F3C2}\u{1F3FC}", "snowboarder: medium-light skin tone"),
    new Emoji("\u{1F3C2}\u{1F3FD}", "snowboarder: medium skin tone"),
    new Emoji("\u{1F3C2}\u{1F3FE}", "snowboarder: medium-dark skin tone"),
    new Emoji("\u{1F3C2}\u{1F3FF}", "snowboarder: dark skin tone"));
const personGolfing = new EmojiGroup(
    "\u{1F3CC}\u{FE0F}", "person golfing",
    new Emoji("\u{1F3CC}\u{1F3FB}", "person golfing: light skin tone"),
    new Emoji("\u{1F3CC}\u{1F3FC}", "person golfing: medium-light skin tone"),
    new Emoji("\u{1F3CC}\u{1F3FD}", "person golfing: medium skin tone"),
    new Emoji("\u{1F3CC}\u{1F3FE}", "person golfing: medium-dark skin tone"),
    new Emoji("\u{1F3CC}\u{1F3FF}", "person golfing: dark skin tone"));
const manGolfing = new EmojiGroup(
    "\u{1F3CC}\u{FE0F}\u{200D}\u{2642}\u{FE0F}", "man golfing",
    new Emoji("\u{1F3CC}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "man golfing: light skin tone"),
    new Emoji("\u{1F3CC}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "man golfing: medium-light skin tone"),
    new Emoji("\u{1F3CC}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "man golfing: medium skin tone"),
    new Emoji("\u{1F3CC}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "man golfing: medium-dark skin tone"),
    new Emoji("\u{1F3CC}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "man golfing: dark skin tone"));
const womanGolfing = new EmojiGroup(
    "\u{1F3CC}\u{FE0F}\u{200D}\u{2640}\u{FE0F}", "woman golfing",
    new Emoji("\u{1F3CC}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "woman golfing: light skin tone"),
    new Emoji("\u{1F3CC}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "woman golfing: medium-light skin tone"),
    new Emoji("\u{1F3CC}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "woman golfing: medium skin tone"),
    new Emoji("\u{1F3CC}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "woman golfing: medium-dark skin tone"),
    new Emoji("\u{1F3CC}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "woman golfing: dark skin tone"));
const personBouncingBall = new EmojiGroup(
    "\u{26F9}\u{FE0F}", "person bouncing ball",
    new Emoji("\u{26F9}\u{1F3FB}", "person bouncing ball: light skin tone"),
    new Emoji("\u{26F9}\u{1F3FC}", "person bouncing ball: medium-light skin tone"),
    new Emoji("\u{26F9}\u{1F3FD}", "person bouncing ball: medium skin tone"),
    new Emoji("\u{26F9}\u{1F3FE}", "person bouncing ball: medium-dark skin tone"),
    new Emoji("\u{26F9}\u{1F3FF}", "person bouncing ball: dark skin tone"));
const manBouncingBall = new EmojiGroup(
    "\u{26F9}\u{FE0F}\u{200D}\u{2642}\u{FE0F}", "man bouncing ball",
    new Emoji("\u{26F9}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "man bouncing ball: light skin tone"),
    new Emoji("\u{26F9}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "man bouncing ball: medium-light skin tone"),
    new Emoji("\u{26F9}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "man bouncing ball: medium skin tone"),
    new Emoji("\u{26F9}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "man bouncing ball: medium-dark skin tone"),
    new Emoji("\u{26F9}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "man bouncing ball: dark skin tone"));
const womanBouncingBall = new EmojiGroup(
    "\u{26F9}\u{FE0F}\u{200D}\u{2640}\u{FE0F}", "woman bouncing ball",
    new Emoji("\u{26F9}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "woman bouncing ball: light skin tone"),
    new Emoji("\u{26F9}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "woman bouncing ball: medium-light skin tone"),
    new Emoji("\u{26F9}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "woman bouncing ball: medium skin tone"),
    new Emoji("\u{26F9}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "woman bouncing ball: medium-dark skin tone"),
    new Emoji("\u{26F9}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "woman bouncing ball: dark skin tone"));
const personLiftingWeights = new EmojiGroup(
    "\u{1F3CB}\u{FE0F}", "person lifting weights",
    new Emoji("\u{1F3CB}\u{1F3FB}", "person lifting weights: light skin tone"),
    new Emoji("\u{1F3CB}\u{1F3FC}", "person lifting weights: medium-light skin tone"),
    new Emoji("\u{1F3CB}\u{1F3FD}", "person lifting weights: medium skin tone"),
    new Emoji("\u{1F3CB}\u{1F3FE}", "person lifting weights: medium-dark skin tone"),
    new Emoji("\u{1F3CB}\u{1F3FF}", "person lifting weights: dark skin tone"));
const manLifitingWeights = new EmojiGroup(
    "\u{1F3CB}\u{FE0F}\u{200D}\u{2642}\u{FE0F}", "man lifting weights",
    new Emoji("\u{1F3CB}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "man lifting weights: light skin tone"),
    new Emoji("\u{1F3CB}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "man lifting weights: medium-light skin tone"),
    new Emoji("\u{1F3CB}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "man lifting weights: medium skin tone"),
    new Emoji("\u{1F3CB}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "man lifting weights: medium-dark skin tone"),
    new Emoji("\u{1F3CB}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "man lifting weights: dark skin tone"));
const womanLiftingWeights = new EmojiGroup(
    "\u{1F3CB}\u{FE0F}\u{200D}\u{2640}\u{FE0F}", "woman lifting weights",
    new Emoji("\u{1F3CB}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "woman lifting weights: light skin tone"),
    new Emoji("\u{1F3CB}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "woman lifting weights: medium-light skin tone"),
    new Emoji("\u{1F3CB}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "woman lifting weights: medium skin tone"),
    new Emoji("\u{1F3CB}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "woman lifting weights: medium-dark skin tone"),
    new Emoji("\u{1F3CB}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "woman lifting weights: dark skin tone"));
const personBiking = new EmojiGroup(
    "\u{1F6B4}", "person biking",
    new Emoji("\u{1F6B4}\u{1F3FB}", "person biking: light skin tone"),
    new Emoji("\u{1F6B4}\u{1F3FC}", "person biking: medium-light skin tone"),
    new Emoji("\u{1F6B4}\u{1F3FD}", "person biking: medium skin tone"),
    new Emoji("\u{1F6B4}\u{1F3FE}", "person biking: medium-dark skin tone"),
    new Emoji("\u{1F6B4}\u{1F3FF}", "person biking: dark skin tone"));
const manBiking = new EmojiGroup(
    "\u{1F6B4}\u{200D}\u{2642}\u{FE0F}", "man biking",
    new Emoji("\u{1F6B4}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "man biking: light skin tone"),
    new Emoji("\u{1F6B4}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "man biking: medium-light skin tone"),
    new Emoji("\u{1F6B4}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "man biking: medium skin tone"),
    new Emoji("\u{1F6B4}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "man biking: medium-dark skin tone"),
    new Emoji("\u{1F6B4}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "man biking: dark skin tone"));
const womanBiking = new EmojiGroup(
    "\u{1F6B4}\u{200D}\u{2640}\u{FE0F}", "woman biking",
    new Emoji("\u{1F6B4}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "woman biking: light skin tone"),
    new Emoji("\u{1F6B4}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "woman biking: medium-light skin tone"),
    new Emoji("\u{1F6B4}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "woman biking: medium skin tone"),
    new Emoji("\u{1F6B4}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "woman biking: medium-dark skin tone"),
    new Emoji("\u{1F6B4}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "woman biking: dark skin tone"));
const personMountainBiking = new EmojiGroup(
    "\u{1F6B5}", "person mountain biking",
    new Emoji("\u{1F6B5}\u{1F3FB}", "person mountain biking: light skin tone"),
    new Emoji("\u{1F6B5}\u{1F3FC}", "person mountain biking: medium-light skin tone"),
    new Emoji("\u{1F6B5}\u{1F3FD}", "person mountain biking: medium skin tone"),
    new Emoji("\u{1F6B5}\u{1F3FE}", "person mountain biking: medium-dark skin tone"),
    new Emoji("\u{1F6B5}\u{1F3FF}", "person mountain biking: dark skin tone"));
const manMountainBiking = new EmojiGroup(
    "\u{1F6B5}\u{200D}\u{2642}\u{FE0F}", "man mountain biking",
    new Emoji("\u{1F6B5}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "man mountain biking: light skin tone"),
    new Emoji("\u{1F6B5}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "man mountain biking: medium-light skin tone"),
    new Emoji("\u{1F6B5}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "man mountain biking: medium skin tone"),
    new Emoji("\u{1F6B5}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "man mountain biking: medium-dark skin tone"),
    new Emoji("\u{1F6B5}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "man mountain biking: dark skin tone"));
const womanMountainBiking = new EmojiGroup(
    "\u{1F6B5}\u{200D}\u{2640}\u{FE0F}", "woman mountain biking",
    new Emoji("\u{1F6B5}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "woman mountain biking: light skin tone"),
    new Emoji("\u{1F6B5}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "woman mountain biking: medium-light skin tone"),
    new Emoji("\u{1F6B5}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "woman mountain biking: medium skin tone"),
    new Emoji("\u{1F6B5}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "woman mountain biking: medium-dark skin tone"),
    new Emoji("\u{1F6B5}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "woman mountain biking: dark skin tone"));
const personCartwheeling = new EmojiGroup(
    "\u{1F938}", "person cartwheeling",
    new Emoji("\u{1F938}\u{1F3FB}", "person cartwheeling: light skin tone"),
    new Emoji("\u{1F938}\u{1F3FC}", "person cartwheeling: medium-light skin tone"),
    new Emoji("\u{1F938}\u{1F3FD}", "person cartwheeling: medium skin tone"),
    new Emoji("\u{1F938}\u{1F3FE}", "person cartwheeling: medium-dark skin tone"),
    new Emoji("\u{1F938}\u{1F3FF}", "person cartwheeling: dark skin tone"));
const manCartwheeling = new EmojiGroup(
    "\u{1F938}\u{200D}\u{2642}\u{FE0F}", "man cartwheeling",
    new Emoji("\u{1F938}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "man cartwheeling: light skin tone"),
    new Emoji("\u{1F938}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "man cartwheeling: medium-light skin tone"),
    new Emoji("\u{1F938}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "man cartwheeling: medium skin tone"),
    new Emoji("\u{1F938}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "man cartwheeling: medium-dark skin tone"),
    new Emoji("\u{1F938}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "man cartwheeling: dark skin tone"));
const womanCartweeling = new EmojiGroup(
    "\u{1F938}\u{200D}\u{2640}\u{FE0F}", "woman cartwheeling",
    new Emoji("\u{1F938}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "woman cartwheeling: light skin tone"),
    new Emoji("\u{1F938}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "woman cartwheeling: medium-light skin tone"),
    new Emoji("\u{1F938}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "woman cartwheeling: medium skin tone"),
    new Emoji("\u{1F938}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "woman cartwheeling: medium-dark skin tone"),
    new Emoji("\u{1F938}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "woman cartwheeling: dark skin tone"));
const peopleWrestling = new Emoji("\u{1F93C}", "people wrestling");
const menWrestling = new Emoji("\u{1F93C}\u{200D}\u{2642}\u{FE0F}", "men wrestling");
const womenWrestling = new Emoji("\u{1F93C}\u{200D}\u{2640}\u{FE0F}", "women wrestling");
const personPlayingWaterPolo = new EmojiGroup(
    "\u{1F93D}", "person playing water polo",
    new Emoji("\u{1F93D}\u{1F3FB}", "person playing water polo: light skin tone"),
    new Emoji("\u{1F93D}\u{1F3FC}", "person playing water polo: medium-light skin tone"),
    new Emoji("\u{1F93D}\u{1F3FD}", "person playing water polo: medium skin tone"),
    new Emoji("\u{1F93D}\u{1F3FE}", "person playing water polo: medium-dark skin tone"),
    new Emoji("\u{1F93D}\u{1F3FF}", "person playing water polo: dark skin tone"));
const manPlayingWaterPolo = new EmojiGroup(
    "\u{1F93D}\u{200D}\u{2642}\u{FE0F}", "man playing water polo",
    new Emoji("\u{1F93D}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "man playing water polo: light skin tone"),
    new Emoji("\u{1F93D}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "man playing water polo: medium-light skin tone"),
    new Emoji("\u{1F93D}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "man playing water polo: medium skin tone"),
    new Emoji("\u{1F93D}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "man playing water polo: medium-dark skin tone"),
    new Emoji("\u{1F93D}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "man playing water polo: dark skin tone"));
const womanPlayingWaterPolo = new EmojiGroup(
    "\u{1F93D}\u{200D}\u{2640}\u{FE0F}", "woman playing water polo",
    new Emoji("\u{1F93D}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "woman playing water polo: light skin tone"),
    new Emoji("\u{1F93D}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "woman playing water polo: medium-light skin tone"),
    new Emoji("\u{1F93D}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "woman playing water polo: medium skin tone"),
    new Emoji("\u{1F93D}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "woman playing water polo: medium-dark skin tone"),
    new Emoji("\u{1F93D}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "woman playing water polo: dark skin tone"));
const personPlayingHandball = new EmojiGroup(
    "\u{1F93E}", "person playing handball",
    new Emoji("\u{1F93E}\u{1F3FB}", "person playing handball: light skin tone"),
    new Emoji("\u{1F93E}\u{1F3FC}", "person playing handball: medium-light skin tone"),
    new Emoji("\u{1F93E}\u{1F3FD}", "person playing handball: medium skin tone"),
    new Emoji("\u{1F93E}\u{1F3FE}", "person playing handball: medium-dark skin tone"),
    new Emoji("\u{1F93E}\u{1F3FF}", "person playing handball: dark skin tone"));
const manPlayingHandball = new EmojiGroup(
    "\u{1F93E}\u{200D}\u{2642}\u{FE0F}", "man playing handball",
    new Emoji("\u{1F93E}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "man playing handball: light skin tone"),
    new Emoji("\u{1F93E}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "man playing handball: medium-light skin tone"),
    new Emoji("\u{1F93E}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "man playing handball: medium skin tone"),
    new Emoji("\u{1F93E}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "man playing handball: medium-dark skin tone"),
    new Emoji("\u{1F93E}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "man playing handball: dark skin tone"));
const womanPlayingHandball = new EmojiGroup(
    "\u{1F93E}\u{200D}\u{2640}\u{FE0F}", "woman playing handball",
    new Emoji("\u{1F93E}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "woman playing handball: light skin tone"),
    new Emoji("\u{1F93E}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "woman playing handball: medium-light skin tone"),
    new Emoji("\u{1F93E}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "woman playing handball: medium skin tone"),
    new Emoji("\u{1F93E}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "woman playing handball: medium-dark skin tone"),
    new Emoji("\u{1F93E}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "woman playing handball: dark skin tone"));
const personJuggling = new EmojiGroup(
    "\u{1F939}", "person juggling",
    new Emoji("\u{1F939}\u{1F3FB}", "person juggling: light skin tone"),
    new Emoji("\u{1F939}\u{1F3FC}", "person juggling: medium-light skin tone"),
    new Emoji("\u{1F939}\u{1F3FD}", "person juggling: medium skin tone"),
    new Emoji("\u{1F939}\u{1F3FE}", "person juggling: medium-dark skin tone"),
    new Emoji("\u{1F939}\u{1F3FF}", "person juggling: dark skin tone"));
const manJuggling = new EmojiGroup(
    "\u{1F939}\u{200D}\u{2642}\u{FE0F}", "man juggling",
    new Emoji("\u{1F939}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "man juggling: light skin tone"),
    new Emoji("\u{1F939}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "man juggling: medium-light skin tone"),
    new Emoji("\u{1F939}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "man juggling: medium skin tone"),
    new Emoji("\u{1F939}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "man juggling: medium-dark skin tone"),
    new Emoji("\u{1F939}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "man juggling: dark skin tone"));
const womanJuggling = new EmojiGroup(
    "\u{1F939}\u{200D}\u{2640}\u{FE0F}", "woman juggling",
    new Emoji("\u{1F939}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "woman juggling: light skin tone"),
    new Emoji("\u{1F939}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "woman juggling: medium-light skin tone"),
    new Emoji("\u{1F939}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "woman juggling: medium skin tone"),
    new Emoji("\u{1F939}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "woman juggling: medium-dark skin tone"),
    new Emoji("\u{1F939}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "woman juggling: dark skin tone"));
const sports = [
    new EmojiGroup(
        "\u{1F9D7}", "person climbing",
        personClimbing,
        manClimbing,
        womanClimbing),
    personFencing,
    personRacingHorse,
    personSkiing,
    personSnowboarding,
    new EmojiGroup(
        "\u{1F3CC}\u{FE0F}", "person golfing",
        personGolfing,
        manGolfing,
        womanGolfing),
    new EmojiGroup(
        "\u{1F3C4}", "person surfing",
        personSurfing,
        manSurfing,
        womanSurfing),
    new EmojiGroup(
        "\u{1F6A3}", "person rowing boat",
        personRowing,
        manRowing,
        womanRowing),
    new EmojiGroup(
        "\u{1F3CA}", "person swimming",
        personSwimming,
        manSwimming,
        womanSwimming),
    new EmojiGroup(
        "\u{26F9}\u{FE0F}", "person bouncing ball",
        personBouncingBall,
        manBouncingBall,
        womanBouncingBall),
    new EmojiGroup(
        "\u{1F3CB}\u{FE0F}", "person lifting weights",
        personLiftingWeights,
        manLifitingWeights,
        womanLiftingWeights),
    new EmojiGroup(
        "\u{1F6B4}", "person biking",
        personBiking,
        manBiking,
        womanBiking),
    new EmojiGroup(
        "\u{1F6B5}", "person mountain biking",
        personMountainBiking,
        manMountainBiking,
        womanMountainBiking),
    new EmojiGroup(
        "\u{1F938}", "person cartwheeling",
        personCartwheeling,
        manCartwheeling,
        womanCartweeling),
    new EmojiGroup(
        "\u{1F93C}", "people wrestling",
        peopleWrestling,
        menWrestling,
        womenWrestling),
    new EmojiGroup(
        "\u{1F93D}", "person playing water polo",
        personPlayingWaterPolo,
        manPlayingWaterPolo,
        womanPlayingWaterPolo),
    new EmojiGroup(
        "\u{1F93E}", "person playing handball",
        personPlayingHandball,
        manPlayingHandball,
        womanPlayingHandball),
    new EmojiGroup(
        "\u{1F939}", "person juggling",
        personJuggling,
        manJuggling,
        womanJuggling)
];
const personInLotusPosition = new EmojiGroup(
    "\u{1F9D8}", "person in lotus position",
    new Emoji("\u{1F9D8}\u{1F3FB}", "person in lotus position: light skin tone"),
    new Emoji("\u{1F9D8}\u{1F3FC}", "person in lotus position: medium-light skin tone"),
    new Emoji("\u{1F9D8}\u{1F3FD}", "person in lotus position: medium skin tone"),
    new Emoji("\u{1F9D8}\u{1F3FE}", "person in lotus position: medium-dark skin tone"),
    new Emoji("\u{1F9D8}\u{1F3FF}", "person in lotus position: dark skin tone"));
const manInLotusPosition = new EmojiGroup(
    "\u{1F9D8}\u{200D}\u{2642}\u{FE0F}", "man in lotus position",
    new Emoji("\u{1F9D8}\u{1F3FB}\u{200D}\u{2642}\u{FE0F}", "man in lotus position: light skin tone"),
    new Emoji("\u{1F9D8}\u{1F3FC}\u{200D}\u{2642}\u{FE0F}", "man in lotus position: medium-light skin tone"),
    new Emoji("\u{1F9D8}\u{1F3FD}\u{200D}\u{2642}\u{FE0F}", "man in lotus position: medium skin tone"),
    new Emoji("\u{1F9D8}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}", "man in lotus position: medium-dark skin tone"),
    new Emoji("\u{1F9D8}\u{1F3FF}\u{200D}\u{2642}\u{FE0F}", "man in lotus position: dark skin tone"));
const womanInLotusPosition = new EmojiGroup(
    "\u{1F9D8}\u{200D}\u{2640}\u{FE0F}", "woman in lotus position",
    new Emoji("\u{1F9D8}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}", "woman in lotus position: light skin tone"),
    new Emoji("\u{1F9D8}\u{1F3FC}\u{200D}\u{2640}\u{FE0F}", "woman in lotus position: medium-light skin tone"),
    new Emoji("\u{1F9D8}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}", "woman in lotus position: medium skin tone"),
    new Emoji("\u{1F9D8}\u{1F3FE}\u{200D}\u{2640}\u{FE0F}", "woman in lotus position: medium-dark skin tone"),
    new Emoji("\u{1F9D8}\u{1F3FF}\u{200D}\u{2640}\u{FE0F}", "woman in lotus position: dark skin tone"));
const personTakingBath = new EmojiGroup(
    "\u{1F6C0}", "person taking bath",
    new Emoji("\u{1F6C0}\u{1F3FB}", "person taking bath: light skin tone"),
    new Emoji("\u{1F6C0}\u{1F3FC}", "person taking bath: medium-light skin tone"),
    new Emoji("\u{1F6C0}\u{1F3FD}", "person taking bath: medium skin tone"),
    new Emoji("\u{1F6C0}\u{1F3FE}", "person taking bath: medium-dark skin tone"),
    new Emoji("\u{1F6C0}\u{1F3FF}", "person taking bath: dark skin tone"));
const personInBed = new EmojiGroup(
    "\u{1F6CC}", "person in bed",
    new Emoji("\u{1F6CC}\u{1F3FB}", "person in bed: light skin tone"),
    new Emoji("\u{1F6CC}\u{1F3FC}", "person in bed: medium-light skin tone"),
    new Emoji("\u{1F6CC}\u{1F3FD}", "person in bed: medium skin tone"),
    new Emoji("\u{1F6CC}\u{1F3FE}", "person in bed: medium-dark skin tone"),
    new Emoji("\u{1F6CC}\u{1F3FF}", "person in bed: dark skin tone"));
const personResting = [
    new EmojiGroup(
        personInLotusPosition.value, "in lotus position",
        personInLotusPosition,
        manInLotusPosition,
        womanInLotusPosition),
    personTakingBath,
    personInBed,
];
const people = [
    {
        value: baby.value, desc: "baby", alts: [
            baby,
            babyAngel,
        ]
    },
    new EmojiGroup(
        "\u{1F9D2}", "child",
        child,
        boy,
        girl),
    {
        value: "\u{1F9D1}", desc: "person", alts: [
            new EmojiGroup(
                "\u{1F9D1}", "person",
                person,
                blondPerson,
                olderPerson,
                personFrowning,
                personPouting,
                personGesturingNo,
                personGesturingOK,
                personTippingHand,
                personRaisingHand,
                deafPerson,
                personBowing,
                personFacePalming,
                personShrugging,
                spy,
                guard,
                constructionWorker,
                personWearingTurban,
                superhero,
                supervillain,
                mage,
                fairy,
                vampire,
                merperson,
                elf,
                genie,
                zombie,
                personGettingMassage,
                personGettingHaircut,
                personWalking,
                personStanding,
                personKneeling,
                personRunning,
                personInSteamyRoom,
                personClimbing,
                personFencing,
                personRacingHorse,
                personSkiing,
                personSnowboarding,
                personGolfing,
                personSurfing,
                personRowing,
                personSwimming,
                personBouncingBall,
                personLiftingWeights,
                personBiking,
                personMountainBiking,
                personCartwheeling,
                peopleWrestling,
                personPlayingWaterPolo,
                personPlayingHandball,
                personJuggling,
                personInLotusPosition,
                personTakingBath,
                personInBed),
            new EmojiGroup(
                "\u{1F468}", "man",
                man,
                blondMan,
                redHairedMan,
                curlyHairedMan,
                whiteHairedMan,
                baldMan,
                beardedMan,
                oldMan,
                manFrowning,
                manPouting,
                manGesturingNo,
                manGesturingOK,
                manTippingHand,
                manRaisingHand,
                deafMan,
                manBowing,
                manFacePalming,
                manShrugging,
                manHealthWorker,
                manStudent,
                manTeacher,
                manJudge,
                manFarmer,
                manCook,
                manMechanic,
                manFactoryWorker,
                manOfficeWorker,
                manScientist,
                manTechnologist,
                manSinger,
                manArtist,
                manPilot,
                manAstronaut,
                manFirefighter,
                manPoliceOfficer,
                manSpy,
                manGuard,
                manConstructionWorker,
                prince,
                manWearingTurban,
                manWithChineseCap,
                manInTuxedo,
                santaClaus,
                manSuperhero,
                manSupervillain,
                manMage,
                manFairy,
                manVampire,
                merman,
                manElf,
                manGenie,
                manZombie,
                manGettingMassage,
                manGettingHaircut,
                manWalking,
                manStanding,
                manKneeling,
                manWithProbingCane,
                manInMotorizedWheelchair,
                manInManualWheelchair,
                manRunning,
                manDancing,
                manInSuitLevitating,
                manInSteamyRoom,
                manClimbing,
                manGolfing,
                manSurfing,
                manRowing,
                manSwimming,
                manBouncingBall,
                manLifitingWeights,
                manBiking,
                manMountainBiking,
                manCartwheeling,
                menWrestling,
                manPlayingWaterPolo,
                manPlayingHandball,
                manJuggling,
                manInLotusPosition),
            new EmojiGroup(
                "\u{1F469}", "woman",
                woman,
                blondWoman,
                redHairedWoman,
                curlyHairedWoman,
                whiteHairedWoman,
                baldWoman,
                oldWoman,
                womanFrowning,
                womanPouting,
                womanGesturingNo,
                womanGesturingOK,
                womanTippingHand,
                womanRaisingHand,
                deafWoman,
                womanBowing,
                womanFacePalming,
                womanShrugging,
                womanHealthWorker,
                womanStudent,
                womanTeacher,
                womanJudge,
                womanFarmer,
                womanCook,
                womanMechanic,
                womanFactoryWorker,
                womanOfficeWorker,
                womanScientist,
                womanTechnologist,
                womanSinger,
                womanArtist,
                womanPilot,
                womanAstronaut,
                womanFirefighter,
                womanPoliceOfficer,
                womanSpy,
                womanGuard,
                womanConstructionWorker,
                princess,
                womanWearingTurban,
                womanWithHeadscarf,
                brideWithVeil,
                pregnantWoman,
                breastFeeding,
                mrsClaus,
                womanSuperhero,
                womanSupervillain,
                womanMage,
                womanFairy,
                womanVampire,
                mermaid,
                womanElf,
                womanGenie,
                womanZombie,
                womanGettingMassage,
                womanGettingHaircut,
                womanWalking,
                womanStanding,
                womanKneeling,
                womanWithProbingCane,
                womanInMotorizedWheelchair,
                womanInManualWheelchair,
                womanRunning,
                womanDancing,
                womanInSteamyRoom,
                womanClimbing,
                womanGolfing,
                womanSurfing,
                womanRowing,
                womanSwimming,
                womanBouncingBall,
                womanLiftingWeights,
                womanBiking,
                womanMountainBiking,
                womanCartweeling,
                womenWrestling,
                womanPlayingWaterPolo,
                womanPlayingHandball,
                womanJuggling,
                womanInLotusPosition),
        ]
    },
    new EmojiGroup(
        "\u{1F9D3}", "older person",
        olderPerson,
        oldMan,
        oldWoman),
];

const allPeople = [
    people,
    gestures,
    activity,
    roles,
    fantasy,
    sports,
    personResting,
    otherPeople,
];

function randomPerson() {
    let value = allPeople.random().random(),
        lastValue = null;
    while (!!value.alts && lastValue !== value) {
        lastValue = value;
        if (value.value !== value.alts[0].value) {
            value = value.alts.random(value);
        }
        else {
            value = value.alts.random();
        }
    }
    return value;
}

const ogre = new Emoji("\u{1F479}", "Ogre");
const goblin = new Emoji("\u{1F47A}", "Goblin");
const ghost = new Emoji("\u{1F47B}", "Ghost");
const alien = new Emoji("\u{1F47D}", "Alien");
const alienMonster = new Emoji("\u{1F47E}", "Alien Monster");
const angryFaceWithHorns = new Emoji("\u{1F47F}", "Angry Face with Horns");
const skull = new Emoji("\u{1F480}", "Skull");
const pileOfPoo = new Emoji("\u{1F4A9}", "Pile of Poo");
const grinningFace = new Emoji("\u{1F600}", "Grinning Face");
const beamingFaceWithSmilingEyes = new Emoji("\u{1F601}", "Beaming Face with Smiling Eyes");
const faceWithTearsOfJoy = new Emoji("\u{1F602}", "Face with Tears of Joy");
const grinningFaceWithBigEyes = new Emoji("\u{1F603}", "Grinning Face with Big Eyes");
const grinningFaceWithSmilingEyes = new Emoji("\u{1F604}", "Grinning Face with Smiling Eyes");
const grinningFaceWithSweat = new Emoji("\u{1F605}", "Grinning Face with Sweat");
const grinningSquitingFace = new Emoji("\u{1F606}", "Grinning Squinting Face");
const smillingFaceWithHalo = new Emoji("\u{1F607}", "Smiling Face with Halo");
const smilingFaceWithHorns = new Emoji("\u{1F608}", "Smiling Face with Horns");
const winkingFace = new Emoji("\u{1F609}", "Winking Face");
const smilingFaceWithSmilingEyes = new Emoji("\u{1F60A}", "Smiling Face with Smiling Eyes");
const faceSavoringFood = new Emoji("\u{1F60B}", "Face Savoring Food");
const relievedFace = new Emoji("\u{1F60C}", "Relieved Face");
const smilingFaceWithHeartEyes = new Emoji("\u{1F60D}", "Smiling Face with Heart-Eyes");
const smilingFaceWithSunglasses = new Emoji("\u{1F60E}", "Smiling Face with Sunglasses");
const smirkingFace = new Emoji("\u{1F60F}", "Smirking Face");
const neutralFace = new Emoji("\u{1F610}", "Neutral Face");
const expressionlessFace = new Emoji("\u{1F611}", "Expressionless Face");
const unamusedFace = new Emoji("\u{1F612}", "Unamused Face");
const downcastFaceWithSweat = new Emoji("\u{1F613}", "Downcast Face with Sweat");
const pensiveFace = new Emoji("\u{1F614}", "Pensive Face");
const confusedFace = new Emoji("\u{1F615}", "Confused Face");
const confoundedFace = new Emoji("\u{1F616}", "Confounded Face");
const kissingFace = new Emoji("\u{1F617}", "Kissing Face");
const faceBlowingAKiss = new Emoji("\u{1F618}", "Face Blowing a Kiss");
const kissingFaceWithSmilingEyes = new Emoji("\u{1F619}", "Kissing Face with Smiling Eyes");
const kissingFaceWithClosedEyes = new Emoji("\u{1F61A}", "Kissing Face with Closed Eyes");
const faceWithTongue = new Emoji("\u{1F61B}", "Face with Tongue");
const winkingFaceWithTongue = new Emoji("\u{1F61C}", "Winking Face with Tongue");
const squintingFaceWithTongue = new Emoji("\u{1F61D}", "Squinting Face with Tongue");
const disappointedFace = new Emoji("\u{1F61E}", "Disappointed Face");
const worriedFace = new Emoji("\u{1F61F}", "Worried Face");
const angryFace = new Emoji("\u{1F620}", "Angry Face");
const poutingFace = new Emoji("\u{1F621}", "Pouting Face");
const cryingFace = new Emoji("\u{1F622}", "Crying Face");
const perseveringFace = new Emoji("\u{1F623}", "Persevering Face");
const faceWithSteamFromNose = new Emoji("\u{1F624}", "Face with Steam From Nose");
const sadButRelievedFace = new Emoji("\u{1F625}", "Sad but Relieved Face");
const frowningFaceWithOpenMouth = new Emoji("\u{1F626}", "Frowning Face with Open Mouth");
const anguishedFace = new Emoji("\u{1F627}", "Anguished Face");
const fearfulFace = new Emoji("\u{1F628}", "Fearful Face");
const wearyFace = new Emoji("\u{1F629}", "Weary Face");
const sleepyFace = new Emoji("\u{1F62A}", "Sleepy Face");
const tiredFace = new Emoji("\u{1F62B}", "Tired Face");
const grimacingFace = new Emoji("\u{1F62C}", "Grimacing Face");
const loudlyCryingFace = new Emoji("\u{1F62D}", "Loudly Crying Face");
const faceWithOpenMouth = new Emoji("\u{1F62E}", "Face with Open Mouth");
const hushedFace = new Emoji("\u{1F62F}", "Hushed Face");
const anxiousFaceWithSweat = new Emoji("\u{1F630}", "Anxious Face with Sweat");
const faceScreamingInFear = new Emoji("\u{1F631}", "Face Screaming in Fear");
const astonishedFace = new Emoji("\u{1F632}", "Astonished Face");
const flushedFace = new Emoji("\u{1F633}", "Flushed Face");
const sleepingFace = new Emoji("\u{1F634}", "Sleeping Face");
const dizzyFace = new Emoji("\u{1F635}", "Dizzy Face");
const faceWithoutMouth = new Emoji("\u{1F636}", "Face Without Mouth");
const faceWithMedicalMask = new Emoji("\u{1F637}", "Face with Medical Mask");
const grinningCatWithSmilingEyes = new Emoji("\u{1F638}", "Grinning Cat with Smiling Eyes");
const catWithTearsOfJoy = new Emoji("\u{1F639}", "Cat with Tears of Joy");
const grinningCat = new Emoji("\u{1F63A}", "Grinning Cat");
const smilingCatWithHeartEyes = new Emoji("\u{1F63B}", "Smiling Cat with Heart-Eyes");
const catWithWrySmile = new Emoji("\u{1F63C}", "Cat with Wry Smile");
const kissingCat = new Emoji("\u{1F63D}", "Kissing Cat");
const poutingCat = new Emoji("\u{1F63E}", "Pouting Cat");
const cryingCat = new Emoji("\u{1F63F}", "Crying Cat");
const wearyCat = new Emoji("\u{1F640}", "Weary Cat");
const slightlyFrowningFace = new Emoji("\u{1F641}", "Slightly Frowning Face");
const slightlySmilingFace = new Emoji("\u{1F642}", "Slightly Smiling Face");
const updisdeDownFace = new Emoji("\u{1F643}", "Upside-Down Face");
const faceWithRollingEyes = new Emoji("\u{1F644}", "Face with Rolling Eyes");
const seeNoEvilMonkey = new Emoji("\u{1F648}", "See-No-Evil Monkey");
const hearNoEvilMonkey = new Emoji("\u{1F649}", "Hear-No-Evil Monkey");
const speakNoEvilMonkey = new Emoji("\u{1F64A}", "Speak-No-Evil Monkey");
const zipperMouthFace = new Emoji("\u{1F910}", "Zipper-Mouth Face");
const moneyMouthFace = new Emoji("\u{1F911}", "Money-Mouth Face");
const faceWithThermometer = new Emoji("\u{1F912}", "Face with Thermometer");
const nerdFace = new Emoji("\u{1F913}", "Nerd Face");
const thinkingFace = new Emoji("\u{1F914}", "Thinking Face");
const faceWithHeadBandage = new Emoji("\u{1F915}", "Face with Head-Bandage");
const robot = new Emoji("\u{1F916}", "Robot");
const huggingFace = new Emoji("\u{1F917}", "Hugging Face");
const cowboyHatFace = new Emoji("\u{1F920}", "Cowboy Hat Face");
const clownFace = new Emoji("\u{1F921}", "Clown Face");
const nauseatedFace = new Emoji("\u{1F922}", "Nauseated Face");
const rollingOnTheFloorLaughing = new Emoji("\u{1F923}", "Rolling on the Floor Laughing");
const droolingFace = new Emoji("\u{1F924}", "Drooling Face");
const lyingFace = new Emoji("\u{1F925}", "Lying Face");
const sneezingFace = new Emoji("\u{1F927}", "Sneezing Face");
const faceWithRaisedEyebrow = new Emoji("\u{1F928}", "Face with Raised Eyebrow");
const starStruck = new Emoji("\u{1F929}", "Star-Struck");
const zanyFace = new Emoji("\u{1F92A}", "Zany Face");
const shushingFace = new Emoji("\u{1F92B}", "Shushing Face");
const faceWithSymbolsOnMouth = new Emoji("\u{1F92C}", "Face with Symbols on Mouth");
const faceWithHandOverMouth = new Emoji("\u{1F92D}", "Face with Hand Over Mouth");
const faceVomitting = new Emoji("\u{1F92E}", "Face Vomiting");
const explodingHead = new Emoji("\u{1F92F}", "Exploding Head");
const smilingFaceWithHearts = new Emoji("\u{1F970}", "Smiling Face with Hearts");
const yawningFace = new Emoji("\u{1F971}", "Yawning Face");
const smilingFaceWithTear = new Emoji("\u{1F972}", "Smiling Face with Tear");
const partyingFace = new Emoji("\u{1F973}", "Partying Face");
const woozyFace = new Emoji("\u{1F974}", "Woozy Face");
const hotFace = new Emoji("\u{1F975}", "Hot Face");
const coldFace = new Emoji("\u{1F976}", "Cold Face");
const disguisedFace = new Emoji("\u{1F978}", "Disguised Face");
const pleadingFace = new Emoji("\u{1F97A}", "Pleading Face");
const faceWithMonocle = new Emoji("\u{1F9D0}", "Face with Monocle");
const skullAndCrossbones = new Emoji("\u{2620}\u{FE0F}", "Skull and Crossbones");
const frowningFace = new Emoji("\u{2639}\u{FE0F}", "Frowning Face");
const fmilingFace = new Emoji("\u{263A}\u{FE0F}", "Smiling Face");
const speakingHead = new Emoji("\u{1F5E3}\u{FE0F}", "Speaking Head");
const bust = new Emoji("\u{1F464}", "Bust in Silhouette");
const faces = [
    ogre,
    goblin,
    ghost,
    alien,
    alienMonster,
    angryFaceWithHorns,
    skull,
    pileOfPoo,
    grinningFace,
    beamingFaceWithSmilingEyes,
    faceWithTearsOfJoy,
    grinningFaceWithBigEyes,
    grinningFaceWithSmilingEyes,
    grinningFaceWithSweat,
    grinningSquitingFace,
    smillingFaceWithHalo,
    smilingFaceWithHorns,
    winkingFace,
    smilingFaceWithSmilingEyes,
    faceSavoringFood,
    relievedFace,
    smilingFaceWithHeartEyes,
    smilingFaceWithSunglasses,
    smirkingFace,
    neutralFace,
    expressionlessFace,
    unamusedFace,
    downcastFaceWithSweat,
    pensiveFace,
    confusedFace,
    confoundedFace,
    kissingFace,
    faceBlowingAKiss,
    kissingFaceWithSmilingEyes,
    kissingFaceWithClosedEyes,
    faceWithTongue,
    winkingFaceWithTongue,
    squintingFaceWithTongue,
    disappointedFace,
    worriedFace,
    angryFace,
    poutingFace,
    cryingFace,
    perseveringFace,
    faceWithSteamFromNose,
    sadButRelievedFace,
    frowningFaceWithOpenMouth,
    anguishedFace,
    fearfulFace,
    wearyFace,
    sleepyFace,
    tiredFace,
    grimacingFace,
    loudlyCryingFace,
    faceWithOpenMouth,
    hushedFace,
    anxiousFaceWithSweat,
    faceScreamingInFear,
    astonishedFace,
    flushedFace,
    sleepingFace,
    dizzyFace,
    faceWithoutMouth,
    faceWithMedicalMask,
    grinningCatWithSmilingEyes,
    catWithTearsOfJoy,
    grinningCat,
    smilingCatWithHeartEyes,
    catWithWrySmile,
    kissingCat,
    poutingCat,
    cryingCat,
    wearyCat,
    slightlyFrowningFace,
    slightlySmilingFace,
    updisdeDownFace,
    faceWithRollingEyes,
    seeNoEvilMonkey,
    hearNoEvilMonkey,
    speakNoEvilMonkey,
    zipperMouthFace,
    moneyMouthFace,
    faceWithThermometer,
    nerdFace,
    thinkingFace,
    faceWithHeadBandage,
    robot,
    huggingFace,
    cowboyHatFace,
    clownFace,
    nauseatedFace,
    rollingOnTheFloorLaughing,
    droolingFace,
    lyingFace,
    sneezingFace,
    faceWithRaisedEyebrow,
    starStruck,
    zanyFace,
    shushingFace,
    faceWithSymbolsOnMouth,
    faceWithHandOverMouth,
    faceVomitting,
    explodingHead,
    smilingFaceWithHearts,
    yawningFace,
    smilingFaceWithTear,
    partyingFace,
    woozyFace,
    hotFace,
    coldFace,
    disguisedFace,
    pleadingFace,
    faceWithMonocle,
    skullAndCrossbones,
    frowningFace,
    fmilingFace,
    speakingHead,
    bust,
];

const kissMark = new Emoji("\u{1F48B}", "Kiss Mark");
const loveLetter = new Emoji("\u{1F48C}", "Love Letter");
const beatingHeart = new Emoji("\u{1F493}", "Beating Heart");
const brokenHeart = new Emoji("\u{1F494}", "Broken Heart");
const twoHearts = new Emoji("\u{1F495}", "Two Hearts");
const sparklingHeart = new Emoji("\u{1F496}", "Sparkling Heart");
const growingHeart = new Emoji("\u{1F497}", "Growing Heart");
const heartWithArrow = new Emoji("\u{1F498}", "Heart with Arrow");
const blueHeart = new Emoji("\u{1F499}", "Blue Heart");
const greenHeart = new Emoji("\u{1F49A}", "Green Heart");
const yellowHeart = new Emoji("\u{1F49B}", "Yellow Heart");
const purpleHeart = new Emoji("\u{1F49C}", "Purple Heart");
const heartWithRibbon = new Emoji("\u{1F49D}", "Heart with Ribbon");
const revolvingHearts = new Emoji("\u{1F49E}", "Revolving Hearts");
const heartDecoration = new Emoji("\u{1F49F}", "Heart Decoration");
const blackHeart = new Emoji("\u{1F5A4}", "Black Heart");
const whiteHeart = new Emoji("\u{1F90D}", "White Heart");
const brownHeart = new Emoji("\u{1F90E}", "Brown Heart");
const orangeHeart = new Emoji("\u{1F9E1}", "Orange Heart");
const heartExclamation = new Emoji("\u{2763}\u{FE0F}", "Heart Exclamation");
const redHeart = new Emoji("\u{2764}\u{FE0F}", "Red Heart");
const love = [
    kissMark,
    loveLetter,
    beatingHeart,
    brokenHeart,
    twoHearts,
    sparklingHeart,
    growingHeart,
    heartWithArrow,
    blueHeart,
    greenHeart,
    yellowHeart,
    purpleHeart,
    heartWithRibbon,
    revolvingHearts,
    heartDecoration,
    blackHeart,
    whiteHeart,
    brownHeart,
    orangeHeart,
    heartExclamation,
    redHeart,
];

const cartoon = [
    new Emoji("\u{1F4A2}", "Anger Symbol"),
    new Emoji("\u{1F4A3}", "Bomb"),
    new Emoji("\u{1F4A4}", "Zzz"),
    new Emoji("\u{1F4A5}", "Collision"),
    new Emoji("\u{1F4A6}", "Sweat Droplets"),
    new Emoji("\u{1F4A8}", "Dashing Away"),
    new Emoji("\u{1F4AB}", "Dizzy"),
    new Emoji("\u{1F4AC}", "Speech Balloon"),
    new Emoji("\u{1F4AD}", "Thought Balloon"),
    new Emoji("\u{1F4AF}", "Hundred Points"),
    new Emoji("\u{1F573}\u{FE0F}", "Hole"),
    new Emoji("\u{1F5E8}\u{FE0F}", "Left Speech Bubble"),
    new Emoji("\u{1F5EF}\u{FE0F}", "Right Anger Bubble"),
];

const hands = [
    new Emoji("\u{1F446}", "Backhand Index Pointing Up"),
    new Emoji("\u{1F447}", "Backhand Index Pointing Down"),
    new Emoji("\u{1F448}", "Backhand Index Pointing Left"),
    new Emoji("\u{1F449}", "Backhand Index Pointing Right"),
    new Emoji("\u{1F44A}", "Oncoming Fist"),
    new Emoji("\u{1F44B}", "Waving Hand"),
    new Emoji("\u{1F44C}", "OK Hand"),
    new Emoji("\u{1F44D}", "Thumbs Up"),
    new Emoji("\u{1F44E}", "Thumbs Down"),
    new Emoji("\u{1F44F}", "Clapping Hands"),
    new Emoji("\u{1F450}", "Open Hands"),
    new Emoji("\u{1F485}", "Nail Polish"),
    new Emoji("\u{1F590}\u{FE0F}", "Hand with Fingers Splayed"),
    new Emoji("\u{1F595}", "Middle Finger"),
    new Emoji("\u{1F596}", "Vulcan Salute"),
    new Emoji("\u{1F64C}", "Raising Hands"),
    new Emoji("\u{1F64F}", "Folded Hands"),
    new Emoji("\u{1F90C}", "Pinched Fingers"),
    new Emoji("\u{1F90F}", "Pinching Hand"),
    new Emoji("\u{1F918}", "Sign of the Horns"),
    new Emoji("\u{1F919}", "Call Me Hand"),
    new Emoji("\u{1F91A}", "Raised Back of Hand"),
    new Emoji("\u{1F91B}", "Left-Facing Fist"),
    new Emoji("\u{1F91C}", "Right-Facing Fist"),
    new Emoji("\u{1F91D}", "Handshake"),
    new Emoji("\u{1F91E}", "Crossed Fingers"),
    new Emoji("\u{1F91F}", "Love-You Gesture"),
    new Emoji("\u{1F932}", "Palms Up Together"),
    new Emoji("\u{261D}\u{FE0F}", "Index Pointing Up"),
    new Emoji("\u{270A}", "Raised Fist"),
    new Emoji("\u{270B}", "Raised Hand"),
    new Emoji("\u{270C}\u{FE0F}", "Victory Hand"),
    new Emoji("\u{270D}\u{FE0F}", "Writing Hand"),
];
const bodyParts = [
    new Emoji("\u{1F440}", "Eyes"),
    new Emoji("\u{1F441}\u{FE0F}", "Eye"),
    new Emoji("\u{1F441}\u{FE0F}\u{200D}\u{1F5E8}\u{FE0F}", "Eye in Speech Bubble"),
    new Emoji("\u{1F442}", "Ear"),
    new Emoji("\u{1F443}", "Nose"),
    new Emoji("\u{1F444}", "Mouth"),
    new Emoji("\u{1F445}", "Tongue"),
    new Emoji("\u{1F4AA}", "Flexed Biceps"),
    new Emoji("\u{1F933}", "Selfie"),
    new Emoji("\u{1F9B4}", "Bone"),
    new Emoji("\u{1F9B5}", "Leg"),
    new Emoji("\u{1F9B6}", "Foot"),
    new Emoji("\u{1F9B7}", "Tooth"),
    new Emoji("\u{1F9BB}", "Ear with Hearing Aid"),
    new Emoji("\u{1F9BE}", "Mechanical Arm"),
    new Emoji("\u{1F9BF}", "Mechanical Leg"),
    new Emoji("\u{1F9E0}", "Brain"),
    new Emoji("\u{1FAC0}", "Anatomical Heart"),
    new Emoji("\u{1FAC1}", "Lungs"),
];
const sex = [
    new Emoji("\u{200D}\u{2640}\u{FE0F}", "Female"),
    new Emoji("\u{200D}\u{2642}\u{FE0F}", "Male"),
];
const skinTones = [
    new Emoji("\u{1F3FB}", "Light Skin Tone"),
    new Emoji("\u{1F3FC}", "Medium-Light Skin Tone"),
    new Emoji("\u{1F3FD}", "Medium Skin Tone"),
    new Emoji("\u{1F3FE}", "Medium-Dark Skin Tone"),
    new Emoji("\u{1F3FF}", "Dark Skin Tone"),
];
const hairColors = [
    new Emoji("\u{1F9B0}", "Red Hair"),
    new Emoji("\u{1F9B1}", "Curly Hair"),
    new Emoji("\u{1F9B3}", "White Hair"),
    new Emoji("\u{1F9B2}", "Bald"),
];
const animals = [
    new Emoji("\u{1F400}", "Rat"),
    new Emoji("\u{1F401}", "Mouse"),
    new Emoji("\u{1F402}", "Ox"),
    new Emoji("\u{1F403}", "Water Buffalo"),
    new Emoji("\u{1F404}", "Cow"),
    new Emoji("\u{1F405}", "Tiger"),
    new Emoji("\u{1F406}", "Leopard"),
    new Emoji("\u{1F407}", "Rabbit"),
    new Emoji("\u{1F408}", "Cat"),
    new Emoji("\u{1F408}\u{200D}\u{2B1B}", "Black Cat"),
    new Emoji("\u{1F409}", "Dragon"),
    new Emoji("\u{1F40A}", "Crocodile"),
    new Emoji("\u{1F40B}", "Whale"),
    new Emoji("\u{1F40C}", "Snail"),
    new Emoji("\u{1F40D}", "Snake"),
    new Emoji("\u{1F40E}", "Horse"),
    new Emoji("\u{1F40F}", "Ram"),
    new Emoji("\u{1F410}", "Goat"),
    new Emoji("\u{1F411}", "Ewe"),
    new Emoji("\u{1F412}", "Monkey"),
    new Emoji("\u{1F413}", "Rooster"),
    new Emoji("\u{1F414}", "Chicken"),
    new Emoji("\u{1F415}", "Dog"),
    new Emoji("\u{1F415}\u{200D}\u{1F9BA}", "Service Dog"),
    new Emoji("\u{1F416}", "Pig"),
    new Emoji("\u{1F417}", "Boar"),
    new Emoji("\u{1F418}", "Elephant"),
    new Emoji("\u{1F419}", "Octopus"),
    new Emoji("\u{1F41A}", "Spiral Shell"),
    new Emoji("\u{1F41B}", "Bug"),
    new Emoji("\u{1F41C}", "Ant"),
    new Emoji("\u{1F41D}", "Honeybee"),
    new Emoji("\u{1F41E}", "Lady Beetle"),
    new Emoji("\u{1F41F}", "Fish"),
    new Emoji("\u{1F420}", "Tropical Fish"),
    new Emoji("\u{1F421}", "Blowfish"),
    new Emoji("\u{1F422}", "Turtle"),
    new Emoji("\u{1F423}", "Hatching Chick"),
    new Emoji("\u{1F424}", "Baby Chick"),
    new Emoji("\u{1F425}", "Front-Facing Baby Chick"),
    new Emoji("\u{1F426}", "Bird"),
    new Emoji("\u{1F427}", "Penguin"),
    new Emoji("\u{1F428}", "Koala"),
    new Emoji("\u{1F429}", "Poodle"),
    new Emoji("\u{1F42A}", "Camel"),
    new Emoji("\u{1F42B}", "Two-Hump Camel"),
    new Emoji("\u{1F42C}", "Dolphin"),
    new Emoji("\u{1F42D}", "Mouse Face"),
    new Emoji("\u{1F42E}", "Cow Face"),
    new Emoji("\u{1F42F}", "Tiger Face"),
    new Emoji("\u{1F430}", "Rabbit Face"),
    new Emoji("\u{1F431}", "Cat Face"),
    new Emoji("\u{1F432}", "Dragon Face"),
    new Emoji("\u{1F433}", "Spouting Whale"),
    new Emoji("\u{1F434}", "Horse Face"),
    new Emoji("\u{1F435}", "Monkey Face"),
    new Emoji("\u{1F436}", "Dog Face"),
    new Emoji("\u{1F437}", "Pig Face"),
    new Emoji("\u{1F438}", "Frog"),
    new Emoji("\u{1F439}", "Hamster"),
    new Emoji("\u{1F43A}", "Wolf"),
    new Emoji("\u{1F43B}", "Bear"),
    new Emoji("\u{1F43B}\u{200D}\u{2744}\u{FE0F}", "Polar Bear"),
    new Emoji("\u{1F43C}", "Panda"),
    new Emoji("\u{1F43D}", "Pig Nose"),
    new Emoji("\u{1F43E}", "Paw Prints"),
    new Emoji("\u{1F43F}\u{FE0F}", "Chipmunk"),
    new Emoji("\u{1F54A}\u{FE0F}", "Dove"),
    new Emoji("\u{1F577}\u{FE0F}", "Spider"),
    new Emoji("\u{1F578}\u{FE0F}", "Spider Web"),
    new Emoji("\u{1F981}", "Lion"),
    new Emoji("\u{1F982}", "Scorpion"),
    new Emoji("\u{1F983}", "Turkey"),
    new Emoji("\u{1F984}", "Unicorn"),
    new Emoji("\u{1F985}", "Eagle"),
    new Emoji("\u{1F986}", "Duck"),
    new Emoji("\u{1F987}", "Bat"),
    new Emoji("\u{1F988}", "Shark"),
    new Emoji("\u{1F989}", "Owl"),
    new Emoji("\u{1F98A}", "Fox"),
    new Emoji("\u{1F98B}", "Butterfly"),
    new Emoji("\u{1F98C}", "Deer"),
    new Emoji("\u{1F98D}", "Gorilla"),
    new Emoji("\u{1F98E}", "Lizard"),
    new Emoji("\u{1F98F}", "Rhinoceros"),
    new Emoji("\u{1F992}", "Giraffe"),
    new Emoji("\u{1F993}", "Zebra"),
    new Emoji("\u{1F994}", "Hedgehog"),
    new Emoji("\u{1F995}", "Sauropod"),
    new Emoji("\u{1F996}", "T-Rex"),
    new Emoji("\u{1F997}", "Cricket"),
    new Emoji("\u{1F998}", "Kangaroo"),
    new Emoji("\u{1F999}", "Llama"),
    new Emoji("\u{1F99A}", "Peacock"),
    new Emoji("\u{1F99B}", "Hippopotamus"),
    new Emoji("\u{1F99C}", "Parrot"),
    new Emoji("\u{1F99D}", "Raccoon"),
    new Emoji("\u{1F99F}", "Mosquito"),
    new Emoji("\u{1F9A0}", "Microbe"),
    new Emoji("\u{1F9A1}", "Badger"),
    new Emoji("\u{1F9A2}", "Swan"),
    new Emoji("\u{1F9A3}", "Mammoth"),
    new Emoji("\u{1F9A4}", "Dodo"),
    new Emoji("\u{1F9A5}", "Sloth"),
    new Emoji("\u{1F9A6}", "Otter"),
    new Emoji("\u{1F9A7}", "Orangutan"),
    new Emoji("\u{1F9A8}", "Skunk"),
    new Emoji("\u{1F9A9}", "Flamingo"),
    new Emoji("\u{1F9AB}", "Beaver"),
    new Emoji("\u{1F9AC}", "Bison"),
    new Emoji("\u{1F9AD}", "Seal"),
    new Emoji("\u{1F9AE}", "Guide Dog"),
    new Emoji("\u{1FAB0}", "Fly"),
    new Emoji("\u{1FAB1}", "Worm"),
    new Emoji("\u{1FAB2}", "Beetle"),
    new Emoji("\u{1FAB3}", "Cockroach"),
    new Emoji("\u{1FAB6}", "Feather"),
];
const plants = [
    new Emoji("\u{1F331}", "Seedling"),
    new Emoji("\u{1F332}", "Evergreen Tree"),
    new Emoji("\u{1F333}", "Deciduous Tree"),
    new Emoji("\u{1F334}", "Palm Tree"),
    new Emoji("\u{1F335}", "Cactus"),
    new Emoji("\u{1F337}", "Tulip"),
    new Emoji("\u{1F338}", "Cherry Blossom"),
    new Emoji("\u{1F339}", "Rose"),
    new Emoji("\u{1F33A}", "Hibiscus"),
    new Emoji("\u{1F33B}", "Sunflower"),
    new Emoji("\u{1F33C}", "Blossom"),
    new Emoji("\u{1F33E}", "Sheaf of Rice"),
    new Emoji("\u{1F33F}", "Herb"),
    new Emoji("\u{1F340}", "Four Leaf Clover"),
    new Emoji("\u{1F341}", "Maple Leaf"),
    new Emoji("\u{1F342}", "Fallen Leaf"),
    new Emoji("\u{1F343}", "Leaf Fluttering in Wind"),
    new Emoji("\u{1F3F5}\u{FE0F}", "Rosette"),
    new Emoji("\u{1F490}", "Bouquet"),
    new Emoji("\u{1F4AE}", "White Flower"),
    new Emoji("\u{1F940}", "Wilted Flower"),
    new Emoji("\u{1FAB4}", "Potted Plant"),
    new Emoji("\u{2618}\u{FE0F}", "Shamrock"),
];
const food = [
    new Emoji("\u{1F32D}", "Hot Dog"),
    new Emoji("\u{1F32E}", "Taco"),
    new Emoji("\u{1F32F}", "Burrito"),
    new Emoji("\u{1F330}", "Chestnut"),
    new Emoji("\u{1F336}\u{FE0F}", "Hot Pepper"),
    new Emoji("\u{1F33D}", "Ear of Corn"),
    new Emoji("\u{1F344}", "Mushroom"),
    new Emoji("\u{1F345}", "Tomato"),
    new Emoji("\u{1F346}", "Eggplant"),
    new Emoji("\u{1F347}", "Grapes"),
    new Emoji("\u{1F348}", "Melon"),
    new Emoji("\u{1F349}", "Watermelon"),
    new Emoji("\u{1F34A}", "Tangerine"),
    new Emoji("\u{1F34B}", "Lemon"),
    new Emoji("\u{1F34C}", "Banana"),
    new Emoji("\u{1F34D}", "Pineapple"),
    new Emoji("\u{1F34E}", "Red Apple"),
    new Emoji("\u{1F34F}", "Green Apple"),
    new Emoji("\u{1F350}", "Pear"),
    new Emoji("\u{1F351}", "Peach"),
    new Emoji("\u{1F352}", "Cherries"),
    new Emoji("\u{1F353}", "Strawberry"),
    new Emoji("\u{1F354}", "Hamburger"),
    new Emoji("\u{1F355}", "Pizza"),
    new Emoji("\u{1F356}", "Meat on Bone"),
    new Emoji("\u{1F357}", "Poultry Leg"),
    new Emoji("\u{1F358}", "Rice Cracker"),
    new Emoji("\u{1F359}", "Rice Ball"),
    new Emoji("\u{1F35A}", "Cooked Rice"),
    new Emoji("\u{1F35B}", "Curry Rice"),
    new Emoji("\u{1F35C}", "Steaming Bowl"),
    new Emoji("\u{1F35D}", "Spaghetti"),
    new Emoji("\u{1F35E}", "Bread"),
    new Emoji("\u{1F35F}", "French Fries"),
    new Emoji("\u{1F360}", "Roasted Sweet Potato"),
    new Emoji("\u{1F361}", "Dango"),
    new Emoji("\u{1F362}", "Oden"),
    new Emoji("\u{1F363}", "Sushi"),
    new Emoji("\u{1F364}", "Fried Shrimp"),
    new Emoji("\u{1F365}", "Fish Cake with Swirl"),
    new Emoji("\u{1F371}", "Bento Box"),
    new Emoji("\u{1F372}", "Pot of Food"),
    new Emoji("\u{1F373}", "Cooking"),
    new Emoji("\u{1F37F}", "Popcorn"),
    new Emoji("\u{1F950}", "Croissant"),
    new Emoji("\u{1F951}", "Avocado"),
    new Emoji("\u{1F952}", "Cucumber"),
    new Emoji("\u{1F953}", "Bacon"),
    new Emoji("\u{1F954}", "Potato"),
    new Emoji("\u{1F955}", "Carrot"),
    new Emoji("\u{1F956}", "Baguette Bread"),
    new Emoji("\u{1F957}", "Green Salad"),
    new Emoji("\u{1F958}", "Shallow Pan of Food"),
    new Emoji("\u{1F959}", "Stuffed Flatbread"),
    new Emoji("\u{1F95A}", "Egg"),
    new Emoji("\u{1F95C}", "Peanuts"),
    new Emoji("\u{1F95D}", "Kiwi Fruit"),
    new Emoji("\u{1F95E}", "Pancakes"),
    new Emoji("\u{1F95F}", "Dumpling"),
    new Emoji("\u{1F960}", "Fortune Cookie"),
    new Emoji("\u{1F961}", "Takeout Box"),
    new Emoji("\u{1F963}", "Bowl with Spoon"),
    new Emoji("\u{1F965}", "Coconut"),
    new Emoji("\u{1F966}", "Broccoli"),
    new Emoji("\u{1F968}", "Pretzel"),
    new Emoji("\u{1F969}", "Cut of Meat"),
    new Emoji("\u{1F96A}", "Sandwich"),
    new Emoji("\u{1F96B}", "Canned Food"),
    new Emoji("\u{1F96C}", "Leafy Green"),
    new Emoji("\u{1F96D}", "Mango"),
    new Emoji("\u{1F96E}", "Moon Cake"),
    new Emoji("\u{1F96F}", "Bagel"),
    new Emoji("\u{1F980}", "Crab"),
    new Emoji("\u{1F990}", "Shrimp"),
    new Emoji("\u{1F991}", "Squid"),
    new Emoji("\u{1F99E}", "Lobster"),
    new Emoji("\u{1F9AA}", "Oyster"),
    new Emoji("\u{1F9C0}", "Cheese Wedge"),
    new Emoji("\u{1F9C2}", "Salt"),
    new Emoji("\u{1F9C4}", "Garlic"),
    new Emoji("\u{1F9C5}", "Onion"),
    new Emoji("\u{1F9C6}", "Falafel"),
    new Emoji("\u{1F9C7}", "Waffle"),
    new Emoji("\u{1F9C8}", "Butter"),
    new Emoji("\u{1FAD0}", "Blueberries"),
    new Emoji("\u{1FAD1}", "Bell Pepper"),
    new Emoji("\u{1FAD2}", "Olive"),
    new Emoji("\u{1FAD3}", "Flatbread"),
    new Emoji("\u{1FAD4}", "Tamale"),
    new Emoji("\u{1FAD5}", "Fondue"),
];
const sweets = [
    new Emoji("\u{1F366}", "Soft Ice Cream"),
    new Emoji("\u{1F367}", "Shaved Ice"),
    new Emoji("\u{1F368}", "Ice Cream"),
    new Emoji("\u{1F369}", "Doughnut"),
    new Emoji("\u{1F36A}", "Cookie"),
    new Emoji("\u{1F36B}", "Chocolate Bar"),
    new Emoji("\u{1F36C}", "Candy"),
    new Emoji("\u{1F36D}", "Lollipop"),
    new Emoji("\u{1F36E}", "Custard"),
    new Emoji("\u{1F36F}", "Honey Pot"),
    new Emoji("\u{1F370}", "Shortcake"),
    new Emoji("\u{1F382}", "Birthday Cake"),
    new Emoji("\u{1F967}", "Pie"),
    new Emoji("\u{1F9C1}", "Cupcake"),
];
const drinks = [
    new Emoji("\u{1F375}", "Teacup Without Handle"),
    new Emoji("\u{1F376}", "Sake"),
    new Emoji("\u{1F377}", "Wine Glass"),
    new Emoji("\u{1F378}", "Cocktail Glass"),
    new Emoji("\u{1F379}", "Tropical Drink"),
    new Emoji("\u{1F37A}", "Beer Mug"),
    new Emoji("\u{1F37B}", "Clinking Beer Mugs"),
    new Emoji("\u{1F37C}", "Baby Bottle"),
    new Emoji("\u{1F37E}", "Bottle with Popping Cork"),
    new Emoji("\u{1F942}", "Clinking Glasses"),
    new Emoji("\u{1F943}", "Tumbler Glass"),
    new Emoji("\u{1F95B}", "Glass of Milk"),
    new Emoji("\u{1F964}", "Cup with Straw"),
    new Emoji("\u{1F9C3}", "Beverage Box"),
    new Emoji("\u{1F9C9}", "Mate"),
    new Emoji("\u{1F9CA}", "Ice"),
    new Emoji("\u{1F9CB}", "Bubble Tea"),
    new Emoji("\u{1FAD6}", "Teapot"),
    new Emoji("\u{2615}", "Hot Beverage"),
];
const utensils = [
    new Emoji("\u{1F374}", "Fork and Knife"),
    new Emoji("\u{1F37D}\u{FE0F}", "Fork and Knife with Plate"),
    new Emoji("\u{1F3FA}", "Amphora"),
    new Emoji("\u{1F52A}", "Kitchen Knife"),
    new Emoji("\u{1F944}", "Spoon"),
    new Emoji("\u{1F962}", "Chopsticks"),
];
const nations = [
    new Emoji("\u{1F1E6}\u{1F1E8}", "Flag: Ascension Island"),
    new Emoji("\u{1F1E6}\u{1F1E9}", "Flag: Andorra"),
    new Emoji("\u{1F1E6}\u{1F1EA}", "Flag: United Arab Emirates"),
    new Emoji("\u{1F1E6}\u{1F1EB}", "Flag: Afghanistan"),
    new Emoji("\u{1F1E6}\u{1F1EC}", "Flag: Antigua & Barbuda"),
    new Emoji("\u{1F1E6}\u{1F1EE}", "Flag: Anguilla"),
    new Emoji("\u{1F1E6}\u{1F1F1}", "Flag: Albania"),
    new Emoji("\u{1F1E6}\u{1F1F2}", "Flag: Armenia"),
    new Emoji("\u{1F1E6}\u{1F1F4}", "Flag: Angola"),
    new Emoji("\u{1F1E6}\u{1F1F6}", "Flag: Antarctica"),
    new Emoji("\u{1F1E6}\u{1F1F7}", "Flag: Argentina"),
    new Emoji("\u{1F1E6}\u{1F1F8}", "Flag: American Samoa"),
    new Emoji("\u{1F1E6}\u{1F1F9}", "Flag: Austria"),
    new Emoji("\u{1F1E6}\u{1F1FA}", "Flag: Australia"),
    new Emoji("\u{1F1E6}\u{1F1FC}", "Flag: Aruba"),
    new Emoji("\u{1F1E6}\u{1F1FD}", "Flag: Åland Islands"),
    new Emoji("\u{1F1E6}\u{1F1FF}", "Flag: Azerbaijan"),
    new Emoji("\u{1F1E7}\u{1F1E6}", "Flag: Bosnia & Herzegovina"),
    new Emoji("\u{1F1E7}\u{1F1E7}", "Flag: Barbados"),
    new Emoji("\u{1F1E7}\u{1F1E9}", "Flag: Bangladesh"),
    new Emoji("\u{1F1E7}\u{1F1EA}", "Flag: Belgium"),
    new Emoji("\u{1F1E7}\u{1F1EB}", "Flag: Burkina Faso"),
    new Emoji("\u{1F1E7}\u{1F1EC}", "Flag: Bulgaria"),
    new Emoji("\u{1F1E7}\u{1F1ED}", "Flag: Bahrain"),
    new Emoji("\u{1F1E7}\u{1F1EE}", "Flag: Burundi"),
    new Emoji("\u{1F1E7}\u{1F1EF}", "Flag: Benin"),
    new Emoji("\u{1F1E7}\u{1F1F1}", "Flag: St. Barthélemy"),
    new Emoji("\u{1F1E7}\u{1F1F2}", "Flag: Bermuda"),
    new Emoji("\u{1F1E7}\u{1F1F3}", "Flag: Brunei"),
    new Emoji("\u{1F1E7}\u{1F1F4}", "Flag: Bolivia"),
    new Emoji("\u{1F1E7}\u{1F1F6}", "Flag: Caribbean Netherlands"),
    new Emoji("\u{1F1E7}\u{1F1F7}", "Flag: Brazil"),
    new Emoji("\u{1F1E7}\u{1F1F8}", "Flag: Bahamas"),
    new Emoji("\u{1F1E7}\u{1F1F9}", "Flag: Bhutan"),
    new Emoji("\u{1F1E7}\u{1F1FB}", "Flag: Bouvet Island"),
    new Emoji("\u{1F1E7}\u{1F1FC}", "Flag: Botswana"),
    new Emoji("\u{1F1E7}\u{1F1FE}", "Flag: Belarus"),
    new Emoji("\u{1F1E7}\u{1F1FF}", "Flag: Belize"),
    new Emoji("\u{1F1E8}\u{1F1E6}", "Flag: Canada"),
    new Emoji("\u{1F1E8}\u{1F1E8}", "Flag: Cocos (Keeling) Islands"),
    new Emoji("\u{1F1E8}\u{1F1E9}", "Flag: Congo - Kinshasa"),
    new Emoji("\u{1F1E8}\u{1F1EB}", "Flag: Central African Republic"),
    new Emoji("\u{1F1E8}\u{1F1EC}", "Flag: Congo - Brazzaville"),
    new Emoji("\u{1F1E8}\u{1F1ED}", "Flag: Switzerland"),
    new Emoji("\u{1F1E8}\u{1F1EE}", "Flag: Côte d’Ivoire"),
    new Emoji("\u{1F1E8}\u{1F1F0}", "Flag: Cook Islands"),
    new Emoji("\u{1F1E8}\u{1F1F1}", "Flag: Chile"),
    new Emoji("\u{1F1E8}\u{1F1F2}", "Flag: Cameroon"),
    new Emoji("\u{1F1E8}\u{1F1F3}", "Flag: China"),
    new Emoji("\u{1F1E8}\u{1F1F4}", "Flag: Colombia"),
    new Emoji("\u{1F1E8}\u{1F1F5}", "Flag: Clipperton Island"),
    new Emoji("\u{1F1E8}\u{1F1F7}", "Flag: Costa Rica"),
    new Emoji("\u{1F1E8}\u{1F1FA}", "Flag: Cuba"),
    new Emoji("\u{1F1E8}\u{1F1FB}", "Flag: Cape Verde"),
    new Emoji("\u{1F1E8}\u{1F1FC}", "Flag: Curaçao"),
    new Emoji("\u{1F1E8}\u{1F1FD}", "Flag: Christmas Island"),
    new Emoji("\u{1F1E8}\u{1F1FE}", "Flag: Cyprus"),
    new Emoji("\u{1F1E8}\u{1F1FF}", "Flag: Czechia"),
    new Emoji("\u{1F1E9}\u{1F1EA}", "Flag: Germany"),
    new Emoji("\u{1F1E9}\u{1F1EC}", "Flag: Diego Garcia"),
    new Emoji("\u{1F1E9}\u{1F1EF}", "Flag: Djibouti"),
    new Emoji("\u{1F1E9}\u{1F1F0}", "Flag: Denmark"),
    new Emoji("\u{1F1E9}\u{1F1F2}", "Flag: Dominica"),
    new Emoji("\u{1F1E9}\u{1F1F4}", "Flag: Dominican Republic"),
    new Emoji("\u{1F1E9}\u{1F1FF}", "Flag: Algeria"),
    new Emoji("\u{1F1EA}\u{1F1E6}", "Flag: Ceuta & Melilla"),
    new Emoji("\u{1F1EA}\u{1F1E8}", "Flag: Ecuador"),
    new Emoji("\u{1F1EA}\u{1F1EA}", "Flag: Estonia"),
    new Emoji("\u{1F1EA}\u{1F1EC}", "Flag: Egypt"),
    new Emoji("\u{1F1EA}\u{1F1ED}", "Flag: Western Sahara"),
    new Emoji("\u{1F1EA}\u{1F1F7}", "Flag: Eritrea"),
    new Emoji("\u{1F1EA}\u{1F1F8}", "Flag: Spain"),
    new Emoji("\u{1F1EA}\u{1F1F9}", "Flag: Ethiopia"),
    new Emoji("\u{1F1EA}\u{1F1FA}", "Flag: European Union"),
    new Emoji("\u{1F1EB}\u{1F1EE}", "Flag: Finland"),
    new Emoji("\u{1F1EB}\u{1F1EF}", "Flag: Fiji"),
    new Emoji("\u{1F1EB}\u{1F1F0}", "Flag: Falkland Islands"),
    new Emoji("\u{1F1EB}\u{1F1F2}", "Flag: Micronesia"),
    new Emoji("\u{1F1EB}\u{1F1F4}", "Flag: Faroe Islands"),
    new Emoji("\u{1F1EB}\u{1F1F7}", "Flag: France"),
    new Emoji("\u{1F1EC}\u{1F1E6}", "Flag: Gabon"),
    new Emoji("\u{1F1EC}\u{1F1E7}", "Flag: United Kingdom"),
    new Emoji("\u{1F1EC}\u{1F1E9}", "Flag: Grenada"),
    new Emoji("\u{1F1EC}\u{1F1EA}", "Flag: Georgia"),
    new Emoji("\u{1F1EC}\u{1F1EB}", "Flag: French Guiana"),
    new Emoji("\u{1F1EC}\u{1F1EC}", "Flag: Guernsey"),
    new Emoji("\u{1F1EC}\u{1F1ED}", "Flag: Ghana"),
    new Emoji("\u{1F1EC}\u{1F1EE}", "Flag: Gibraltar"),
    new Emoji("\u{1F1EC}\u{1F1F1}", "Flag: Greenland"),
    new Emoji("\u{1F1EC}\u{1F1F2}", "Flag: Gambia"),
    new Emoji("\u{1F1EC}\u{1F1F3}", "Flag: Guinea"),
    new Emoji("\u{1F1EC}\u{1F1F5}", "Flag: Guadeloupe"),
    new Emoji("\u{1F1EC}\u{1F1F6}", "Flag: Equatorial Guinea"),
    new Emoji("\u{1F1EC}\u{1F1F7}", "Flag: Greece"),
    new Emoji("\u{1F1EC}\u{1F1F8}", "Flag: South Georgia & South Sandwich Islands"),
    new Emoji("\u{1F1EC}\u{1F1F9}", "Flag: Guatemala"),
    new Emoji("\u{1F1EC}\u{1F1FA}", "Flag: Guam"),
    new Emoji("\u{1F1EC}\u{1F1FC}", "Flag: Guinea-Bissau"),
    new Emoji("\u{1F1EC}\u{1F1FE}", "Flag: Guyana"),
    new Emoji("\u{1F1ED}\u{1F1F0}", "Flag: Hong Kong SAR China"),
    new Emoji("\u{1F1ED}\u{1F1F2}", "Flag: Heard & McDonald Islands"),
    new Emoji("\u{1F1ED}\u{1F1F3}", "Flag: Honduras"),
    new Emoji("\u{1F1ED}\u{1F1F7}", "Flag: Croatia"),
    new Emoji("\u{1F1ED}\u{1F1F9}", "Flag: Haiti"),
    new Emoji("\u{1F1ED}\u{1F1FA}", "Flag: Hungary"),
    new Emoji("\u{1F1EE}\u{1F1E8}", "Flag: Canary Islands"),
    new Emoji("\u{1F1EE}\u{1F1E9}", "Flag: Indonesia"),
    new Emoji("\u{1F1EE}\u{1F1EA}", "Flag: Ireland"),
    new Emoji("\u{1F1EE}\u{1F1F1}", "Flag: Israel"),
    new Emoji("\u{1F1EE}\u{1F1F2}", "Flag: Isle of Man"),
    new Emoji("\u{1F1EE}\u{1F1F3}", "Flag: India"),
    new Emoji("\u{1F1EE}\u{1F1F4}", "Flag: British Indian Ocean Territory"),
    new Emoji("\u{1F1EE}\u{1F1F6}", "Flag: Iraq"),
    new Emoji("\u{1F1EE}\u{1F1F7}", "Flag: Iran"),
    new Emoji("\u{1F1EE}\u{1F1F8}", "Flag: Iceland"),
    new Emoji("\u{1F1EE}\u{1F1F9}", "Flag: Italy"),
    new Emoji("\u{1F1EF}\u{1F1EA}", "Flag: Jersey"),
    new Emoji("\u{1F1EF}\u{1F1F2}", "Flag: Jamaica"),
    new Emoji("\u{1F1EF}\u{1F1F4}", "Flag: Jordan"),
    new Emoji("\u{1F1EF}\u{1F1F5}", "Flag: Japan"),
    new Emoji("\u{1F1F0}\u{1F1EA}", "Flag: Kenya"),
    new Emoji("\u{1F1F0}\u{1F1EC}", "Flag: Kyrgyzstan"),
    new Emoji("\u{1F1F0}\u{1F1ED}", "Flag: Cambodia"),
    new Emoji("\u{1F1F0}\u{1F1EE}", "Flag: Kiribati"),
    new Emoji("\u{1F1F0}\u{1F1F2}", "Flag: Comoros"),
    new Emoji("\u{1F1F0}\u{1F1F3}", "Flag: St. Kitts & Nevis"),
    new Emoji("\u{1F1F0}\u{1F1F5}", "Flag: North Korea"),
    new Emoji("\u{1F1F0}\u{1F1F7}", "Flag: South Korea"),
    new Emoji("\u{1F1F0}\u{1F1FC}", "Flag: Kuwait"),
    new Emoji("\u{1F1F0}\u{1F1FE}", "Flag: Cayman Islands"),
    new Emoji("\u{1F1F0}\u{1F1FF}", "Flag: Kazakhstan"),
    new Emoji("\u{1F1F1}\u{1F1E6}", "Flag: Laos"),
    new Emoji("\u{1F1F1}\u{1F1E7}", "Flag: Lebanon"),
    new Emoji("\u{1F1F1}\u{1F1E8}", "Flag: St. Lucia"),
    new Emoji("\u{1F1F1}\u{1F1EE}", "Flag: Liechtenstein"),
    new Emoji("\u{1F1F1}\u{1F1F0}", "Flag: Sri Lanka"),
    new Emoji("\u{1F1F1}\u{1F1F7}", "Flag: Liberia"),
    new Emoji("\u{1F1F1}\u{1F1F8}", "Flag: Lesotho"),
    new Emoji("\u{1F1F1}\u{1F1F9}", "Flag: Lithuania"),
    new Emoji("\u{1F1F1}\u{1F1FA}", "Flag: Luxembourg"),
    new Emoji("\u{1F1F1}\u{1F1FB}", "Flag: Latvia"),
    new Emoji("\u{1F1F1}\u{1F1FE}", "Flag: Libya"),
    new Emoji("\u{1F1F2}\u{1F1E6}", "Flag: Morocco"),
    new Emoji("\u{1F1F2}\u{1F1E8}", "Flag: Monaco"),
    new Emoji("\u{1F1F2}\u{1F1E9}", "Flag: Moldova"),
    new Emoji("\u{1F1F2}\u{1F1EA}", "Flag: Montenegro"),
    new Emoji("\u{1F1F2}\u{1F1EB}", "Flag: St. Martin"),
    new Emoji("\u{1F1F2}\u{1F1EC}", "Flag: Madagascar"),
    new Emoji("\u{1F1F2}\u{1F1ED}", "Flag: Marshall Islands"),
    new Emoji("\u{1F1F2}\u{1F1F0}", "Flag: North Macedonia"),
    new Emoji("\u{1F1F2}\u{1F1F1}", "Flag: Mali"),
    new Emoji("\u{1F1F2}\u{1F1F2}", "Flag: Myanmar (Burma)"),
    new Emoji("\u{1F1F2}\u{1F1F3}", "Flag: Mongolia"),
    new Emoji("\u{1F1F2}\u{1F1F4}", "Flag: Macao Sar China"),
    new Emoji("\u{1F1F2}\u{1F1F5}", "Flag: Northern Mariana Islands"),
    new Emoji("\u{1F1F2}\u{1F1F6}", "Flag: Martinique"),
    new Emoji("\u{1F1F2}\u{1F1F7}", "Flag: Mauritania"),
    new Emoji("\u{1F1F2}\u{1F1F8}", "Flag: Montserrat"),
    new Emoji("\u{1F1F2}\u{1F1F9}", "Flag: Malta"),
    new Emoji("\u{1F1F2}\u{1F1FA}", "Flag: Mauritius"),
    new Emoji("\u{1F1F2}\u{1F1FB}", "Flag: Maldives"),
    new Emoji("\u{1F1F2}\u{1F1FC}", "Flag: Malawi"),
    new Emoji("\u{1F1F2}\u{1F1FD}", "Flag: Mexico"),
    new Emoji("\u{1F1F2}\u{1F1FE}", "Flag: Malaysia"),
    new Emoji("\u{1F1F2}\u{1F1FF}", "Flag: Mozambique"),
    new Emoji("\u{1F1F3}\u{1F1E6}", "Flag: Namibia"),
    new Emoji("\u{1F1F3}\u{1F1E8}", "Flag: New Caledonia"),
    new Emoji("\u{1F1F3}\u{1F1EA}", "Flag: Niger"),
    new Emoji("\u{1F1F3}\u{1F1EB}", "Flag: Norfolk Island"),
    new Emoji("\u{1F1F3}\u{1F1EC}", "Flag: Nigeria"),
    new Emoji("\u{1F1F3}\u{1F1EE}", "Flag: Nicaragua"),
    new Emoji("\u{1F1F3}\u{1F1F1}", "Flag: Netherlands"),
    new Emoji("\u{1F1F3}\u{1F1F4}", "Flag: Norway"),
    new Emoji("\u{1F1F3}\u{1F1F5}", "Flag: Nepal"),
    new Emoji("\u{1F1F3}\u{1F1F7}", "Flag: Nauru"),
    new Emoji("\u{1F1F3}\u{1F1FA}", "Flag: Niue"),
    new Emoji("\u{1F1F3}\u{1F1FF}", "Flag: New Zealand"),
    new Emoji("\u{1F1F4}\u{1F1F2}", "Flag: Oman"),
    new Emoji("\u{1F1F5}\u{1F1E6}", "Flag: Panama"),
    new Emoji("\u{1F1F5}\u{1F1EA}", "Flag: Peru"),
    new Emoji("\u{1F1F5}\u{1F1EB}", "Flag: French Polynesia"),
    new Emoji("\u{1F1F5}\u{1F1EC}", "Flag: Papua New Guinea"),
    new Emoji("\u{1F1F5}\u{1F1ED}", "Flag: Philippines"),
    new Emoji("\u{1F1F5}\u{1F1F0}", "Flag: Pakistan"),
    new Emoji("\u{1F1F5}\u{1F1F1}", "Flag: Poland"),
    new Emoji("\u{1F1F5}\u{1F1F2}", "Flag: St. Pierre & Miquelon"),
    new Emoji("\u{1F1F5}\u{1F1F3}", "Flag: Pitcairn Islands"),
    new Emoji("\u{1F1F5}\u{1F1F7}", "Flag: Puerto Rico"),
    new Emoji("\u{1F1F5}\u{1F1F8}", "Flag: Palestinian Territories"),
    new Emoji("\u{1F1F5}\u{1F1F9}", "Flag: Portugal"),
    new Emoji("\u{1F1F5}\u{1F1FC}", "Flag: Palau"),
    new Emoji("\u{1F1F5}\u{1F1FE}", "Flag: Paraguay"),
    new Emoji("\u{1F1F6}\u{1F1E6}", "Flag: Qatar"),
    new Emoji("\u{1F1F7}\u{1F1EA}", "Flag: Réunion"),
    new Emoji("\u{1F1F7}\u{1F1F4}", "Flag: Romania"),
    new Emoji("\u{1F1F7}\u{1F1F8}", "Flag: Serbia"),
    new Emoji("\u{1F1F7}\u{1F1FA}", "Flag: Russia"),
    new Emoji("\u{1F1F7}\u{1F1FC}", "Flag: Rwanda"),
    new Emoji("\u{1F1F8}\u{1F1E6}", "Flag: Saudi Arabia"),
    new Emoji("\u{1F1F8}\u{1F1E7}", "Flag: Solomon Islands"),
    new Emoji("\u{1F1F8}\u{1F1E8}", "Flag: Seychelles"),
    new Emoji("\u{1F1F8}\u{1F1E9}", "Flag: Sudan"),
    new Emoji("\u{1F1F8}\u{1F1EA}", "Flag: Sweden"),
    new Emoji("\u{1F1F8}\u{1F1EC}", "Flag: Singapore"),
    new Emoji("\u{1F1F8}\u{1F1ED}", "Flag: St. Helena"),
    new Emoji("\u{1F1F8}\u{1F1EE}", "Flag: Slovenia"),
    new Emoji("\u{1F1F8}\u{1F1EF}", "Flag: Svalbard & Jan Mayen"),
    new Emoji("\u{1F1F8}\u{1F1F0}", "Flag: Slovakia"),
    new Emoji("\u{1F1F8}\u{1F1F1}", "Flag: Sierra Leone"),
    new Emoji("\u{1F1F8}\u{1F1F2}", "Flag: San Marino"),
    new Emoji("\u{1F1F8}\u{1F1F3}", "Flag: Senegal"),
    new Emoji("\u{1F1F8}\u{1F1F4}", "Flag: Somalia"),
    new Emoji("\u{1F1F8}\u{1F1F7}", "Flag: Suriname"),
    new Emoji("\u{1F1F8}\u{1F1F8}", "Flag: South Sudan"),
    new Emoji("\u{1F1F8}\u{1F1F9}", "Flag: São Tomé & Príncipe"),
    new Emoji("\u{1F1F8}\u{1F1FB}", "Flag: El Salvador"),
    new Emoji("\u{1F1F8}\u{1F1FD}", "Flag: Sint Maarten"),
    new Emoji("\u{1F1F8}\u{1F1FE}", "Flag: Syria"),
    new Emoji("\u{1F1F8}\u{1F1FF}", "Flag: Eswatini"),
    new Emoji("\u{1F1F9}\u{1F1E6}", "Flag: Tristan Da Cunha"),
    new Emoji("\u{1F1F9}\u{1F1E8}", "Flag: Turks & Caicos Islands"),
    new Emoji("\u{1F1F9}\u{1F1E9}", "Flag: Chad"),
    new Emoji("\u{1F1F9}\u{1F1EB}", "Flag: French Southern Territories"),
    new Emoji("\u{1F1F9}\u{1F1EC}", "Flag: Togo"),
    new Emoji("\u{1F1F9}\u{1F1ED}", "Flag: Thailand"),
    new Emoji("\u{1F1F9}\u{1F1EF}", "Flag: Tajikistan"),
    new Emoji("\u{1F1F9}\u{1F1F0}", "Flag: Tokelau"),
    new Emoji("\u{1F1F9}\u{1F1F1}", "Flag: Timor-Leste"),
    new Emoji("\u{1F1F9}\u{1F1F2}", "Flag: Turkmenistan"),
    new Emoji("\u{1F1F9}\u{1F1F3}", "Flag: Tunisia"),
    new Emoji("\u{1F1F9}\u{1F1F4}", "Flag: Tonga"),
    new Emoji("\u{1F1F9}\u{1F1F7}", "Flag: Turkey"),
    new Emoji("\u{1F1F9}\u{1F1F9}", "Flag: Trinidad & Tobago"),
    new Emoji("\u{1F1F9}\u{1F1FB}", "Flag: Tuvalu"),
    new Emoji("\u{1F1F9}\u{1F1FC}", "Flag: Taiwan"),
    new Emoji("\u{1F1F9}\u{1F1FF}", "Flag: Tanzania"),
    new Emoji("\u{1F1FA}\u{1F1E6}", "Flag: Ukraine"),
    new Emoji("\u{1F1FA}\u{1F1EC}", "Flag: Uganda"),
    new Emoji("\u{1F1FA}\u{1F1F2}", "Flag: U.S. Outlying Islands"),
    new Emoji("\u{1F1FA}\u{1F1F3}", "Flag: United Nations"),
    new Emoji("\u{1F1FA}\u{1F1F8}", "Flag: United States"),
    new Emoji("\u{1F1FA}\u{1F1FE}", "Flag: Uruguay"),
    new Emoji("\u{1F1FA}\u{1F1FF}", "Flag: Uzbekistan"),
    new Emoji("\u{1F1FB}\u{1F1E6}", "Flag: Vatican City"),
    new Emoji("\u{1F1FB}\u{1F1E8}", "Flag: St. Vincent & Grenadines"),
    new Emoji("\u{1F1FB}\u{1F1EA}", "Flag: Venezuela"),
    new Emoji("\u{1F1FB}\u{1F1EC}", "Flag: British Virgin Islands"),
    new Emoji("\u{1F1FB}\u{1F1EE}", "Flag: U.S. Virgin Islands"),
    new Emoji("\u{1F1FB}\u{1F1F3}", "Flag: Vietnam"),
    new Emoji("\u{1F1FB}\u{1F1FA}", "Flag: Vanuatu"),
    new Emoji("\u{1F1FC}\u{1F1EB}", "Flag: Wallis & Futuna"),
    new Emoji("\u{1F1FC}\u{1F1F8}", "Flag: Samoa"),
    new Emoji("\u{1F1FD}\u{1F1F0}", "Flag: Kosovo"),
    new Emoji("\u{1F1FE}\u{1F1EA}", "Flag: Yemen"),
    new Emoji("\u{1F1FE}\u{1F1F9}", "Flag: Mayotte"),
    new Emoji("\u{1F1FF}\u{1F1E6}", "Flag: South Africa"),
    new Emoji("\u{1F1FF}\u{1F1F2}", "Flag: Zambia"),
    new Emoji("\u{1F1FF}\u{1F1FC}", "Flag: Zimbabwe"),
];
const flags = [
    new Emoji("\u{1F38C}", "Crossed Flags"),
    new Emoji("\u{1F3C1}", "Chequered Flag"),
    new Emoji("\u{1F3F3}\u{FE0F}", "White Flag"),
    new Emoji("\u{1F3F3}\u{FE0F}\u{200D}\u{1F308}", "Rainbow Flag"),
    new Emoji("\u{1F3F3}\u{FE0F}\u{200D}\u{26A7}\u{FE0F}", "Transgender Flag"),
    new Emoji("\u{1F3F4}", "Black Flag"),
    new Emoji("\u{1F3F4}\u{200D}\u{2620}\u{FE0F}", "Pirate Flag"),
    new Emoji("\u{1F3F4}\u{E0067}\u{E0062}\u{E0065}\u{E006E}\u{E0067}\u{E007F}", "Flag: England"),
    new Emoji("\u{1F3F4}\u{E0067}\u{E0062}\u{E0073}\u{E0063}\u{E0074}\u{E007F}", "Flag: Scotland"),
    new Emoji("\u{1F3F4}\u{E0067}\u{E0062}\u{E0077}\u{E006C}\u{E0073}\u{E007F}", "Flag: Wales"),
    new Emoji("\u{1F6A9}", "Triangular Flag"),
];

const motorcycle = new Emoji("\u{1F3CD}\u{FE0F}", "Motorcycle");
const racingCar = new Emoji("\u{1F3CE}\u{FE0F}", "Racing Car");
const seat = new Emoji("\u{1F4BA}", "Seat");
const rocket = new Emoji("\u{1F680}", "Rocket");
const helicopter = new Emoji("\u{1F681}", "Helicopter");
const locomotive = new Emoji("\u{1F682}", "Locomotive");
const railwayCar = new Emoji("\u{1F683}", "Railway Car");
const highspeedTrain = new Emoji("\u{1F684}", "High-Speed Train");
const bulletTrain = new Emoji("\u{1F685}", "Bullet Train");
const train = new Emoji("\u{1F686}", "Train");
const metro = new Emoji("\u{1F687}", "Metro");
const lightRail = new Emoji("\u{1F688}", "Light Rail");
const station = new Emoji("\u{1F689}", "Station");
const tram = new Emoji("\u{1F68A}", "Tram");
const tramCar = new Emoji("\u{1F68B}", "Tram Car");
const bus = new Emoji("\u{1F68C}", "Bus");
const oncomingBus = new Emoji("\u{1F68D}", "Oncoming Bus");
const trolleyBus = new Emoji("\u{1F68E}", "Trolleybus");
const busStop = new Emoji("\u{1F68F}", "Bus Stop");
const miniBus = new Emoji("\u{1F690}", "Minibus");
const ambulance = new Emoji("\u{1F691}", "Ambulance");
const fireEngine = new Emoji("\u{1F692}", "Fire Engine");
const taxi = new Emoji("\u{1F695}", "Taxi");
const oncomingTaxi = new Emoji("\u{1F696}", "Oncoming Taxi");
const automobile = new Emoji("\u{1F697}", "Automobile");
const oncomingAutomobile = new Emoji("\u{1F698}", "Oncoming Automobile");
const sportUtilityVehicle = new Emoji("\u{1F699}", "Sport Utility Vehicle");
const deliveryTruck = new Emoji("\u{1F69A}", "Delivery Truck");
const articulatedLorry = new Emoji("\u{1F69B}", "Articulated Lorry");
const tractor = new Emoji("\u{1F69C}", "Tractor");
const monorail = new Emoji("\u{1F69D}", "Monorail");
const mountainRailway = new Emoji("\u{1F69E}", "Mountain Railway");
const suspensionRailway = new Emoji("\u{1F69F}", "Suspension Railway");
const mountainCableway = new Emoji("\u{1F6A0}", "Mountain Cableway");
const aerialTramway = new Emoji("\u{1F6A1}", "Aerial Tramway");
const ship = new Emoji("\u{1F6A2}", "Ship");
const speedBoat = new Emoji("\u{1F6A4}", "Speedboat");
const horizontalTrafficLight = new Emoji("\u{1F6A5}", "Horizontal Traffic Light");
const verticalTrafficLight = new Emoji("\u{1F6A6}", "Vertical Traffic Light");
const construction = new Emoji("\u{1F6A7}", "Construction");
const bicycle = new Emoji("\u{1F6B2}", "Bicycle");
const stopSign = new Emoji("\u{1F6D1}", "Stop Sign");
const oilDrum = new Emoji("\u{1F6E2}\u{FE0F}", "Oil Drum");
const motorway = new Emoji("\u{1F6E3}\u{FE0F}", "Motorway");
const railwayTrack = new Emoji("\u{1F6E4}\u{FE0F}", "Railway Track");
const motorBoat = new Emoji("\u{1F6E5}\u{FE0F}", "Motor Boat");
const smallAirplane = new Emoji("\u{1F6E9}\u{FE0F}", "Small Airplane");
const airplaneDeparture = new Emoji("\u{1F6EB}", "Airplane Departure");
const airplaneArrival = new Emoji("\u{1F6EC}", "Airplane Arrival");
const satellite = new Emoji("\u{1F6F0}\u{FE0F}", "Satellite");
const passengerShip = new Emoji("\u{1F6F3}\u{FE0F}", "Passenger Ship");
const kickScooter = new Emoji("\u{1F6F4}", "Kick Scooter");
const motorScooter = new Emoji("\u{1F6F5}", "Motor Scooter");
const canoe = new Emoji("\u{1F6F6}", "Canoe");
const flyingSaucer = new Emoji("\u{1F6F8}", "Flying Saucer");
const skateboard = new Emoji("\u{1F6F9}", "Skateboard");
const autoRickshaw = new Emoji("\u{1F6FA}", "Auto Rickshaw");
const pickupTruck = new Emoji("\u{1F6FB}", "Pickup Truck");
const rollerSkate = new Emoji("\u{1F6FC}", "Roller Skate");
const motorizedWheelchair = new Emoji("\u{1F9BC}", "Motorized Wheelchair");
const manualWheelchair = new Emoji("\u{1F9BD}", "Manual Wheelchair");
const parachute = new Emoji("\u{1FA82}", "Parachute");
const anchor = new Emoji("\u{2693}", "Anchor");
const ferry = new Emoji("\u{26F4}\u{FE0F}", "Ferry");
const sailboat = new Emoji("\u{26F5}", "Sailboat");
const fuelPump = new Emoji("\u{26FD}", "Fuel Pump");
const airplane = new Emoji("\u{2708}\u{FE0F}", "Airplane");
const vehicles = [
    motorcycle,
    racingCar,
    seat,
    rocket,
    helicopter,
    locomotive,
    railwayCar,
    highspeedTrain,
    bulletTrain,
    train,
    metro,
    lightRail,
    station,
    tram,
    tramCar,
    bus,
    oncomingBus,
    trolleyBus,
    busStop,
    miniBus,
    ambulance,
    fireEngine,
    taxi,
    oncomingTaxi,
    automobile,
    oncomingAutomobile,
    sportUtilityVehicle,
    deliveryTruck,
    articulatedLorry,
    tractor,
    monorail,
    mountainRailway,
    suspensionRailway,
    mountainCableway,
    aerialTramway,
    ship,
    speedBoat,
    horizontalTrafficLight,
    verticalTrafficLight,
    construction,
    bicycle,
    stopSign,
    oilDrum,
    motorway,
    railwayTrack,
    motorBoat,
    smallAirplane,
    airplaneDeparture,
    airplaneArrival,
    satellite,
    passengerShip,
    kickScooter,
    motorScooter,
    canoe,
    flyingSaucer,
    skateboard,
    autoRickshaw,
    pickupTruck,
    rollerSkate,
    motorizedWheelchair,
    manualWheelchair,
    parachute,
    anchor,
    ferry,
    sailboat,
    fuelPump,
    airplane,
];
const bloodTypes = [
    new Emoji("\u{1F170}", "A Button (Blood Type)"),
    new Emoji("\u{1F171}", "B Button (Blood Type)"),
    new Emoji("\u{1F17E}", "O Button (Blood Type)"),
    new Emoji("\u{1F18E}", "AB Button (Blood Type)"),
];
const regions = [
    new Emoji("\u{1F1E6}", "Regional Indicator Symbol Letter A"),
    new Emoji("\u{1F1E7}", "Regional Indicator Symbol Letter B"),
    new Emoji("\u{1F1E8}", "Regional Indicator Symbol Letter C"),
    new Emoji("\u{1F1E9}", "Regional Indicator Symbol Letter D"),
    new Emoji("\u{1F1EA}", "Regional Indicator Symbol Letter E"),
    new Emoji("\u{1F1EB}", "Regional Indicator Symbol Letter F"),
    new Emoji("\u{1F1EC}", "Regional Indicator Symbol Letter G"),
    new Emoji("\u{1F1ED}", "Regional Indicator Symbol Letter H"),
    new Emoji("\u{1F1EE}", "Regional Indicator Symbol Letter I"),
    new Emoji("\u{1F1EF}", "Regional Indicator Symbol Letter J"),
    new Emoji("\u{1F1F0}", "Regional Indicator Symbol Letter K"),
    new Emoji("\u{1F1F1}", "Regional Indicator Symbol Letter L"),
    new Emoji("\u{1F1F2}", "Regional Indicator Symbol Letter M"),
    new Emoji("\u{1F1F3}", "Regional Indicator Symbol Letter N"),
    new Emoji("\u{1F1F4}", "Regional Indicator Symbol Letter O"),
    new Emoji("\u{1F1F5}", "Regional Indicator Symbol Letter P"),
    new Emoji("\u{1F1F6}", "Regional Indicator Symbol Letter Q"),
    new Emoji("\u{1F1F7}", "Regional Indicator Symbol Letter R"),
    new Emoji("\u{1F1F8}", "Regional Indicator Symbol Letter S"),
    new Emoji("\u{1F1F9}", "Regional Indicator Symbol Letter T"),
    new Emoji("\u{1F1FA}", "Regional Indicator Symbol Letter U"),
    new Emoji("\u{1F1FB}", "Regional Indicator Symbol Letter V"),
    new Emoji("\u{1F1FC}", "Regional Indicator Symbol Letter W"),
    new Emoji("\u{1F1FD}", "Regional Indicator Symbol Letter X"),
    new Emoji("\u{1F1FE}", "Regional Indicator Symbol Letter Y"),
    new Emoji("\u{1F1FF}", "Regional Indicator Symbol Letter Z"),
];
const japanese = [
    new Emoji("\u{1F530}", "Japanese Symbol for Beginner"),
    new Emoji("\u{1F201}", "Japanese “Here” Button"),
    new Emoji("\u{1F202}\u{FE0F}", "Japanese “Service Charge” Button"),
    new Emoji("\u{1F21A}", "Japanese “Free of Charge” Button"),
    new Emoji("\u{1F22F}", "Japanese “Reserved” Button"),
    new Emoji("\u{1F232}", "Japanese “Prohibited” Button"),
    new Emoji("\u{1F233}", "Japanese “Vacancy” Button"),
    new Emoji("\u{1F234}", "Japanese “Passing Grade” Button"),
    new Emoji("\u{1F235}", "Japanese “No Vacancy” Button"),
    new Emoji("\u{1F236}", "Japanese “Not Free of Charge” Button"),
    new Emoji("\u{1F237}\u{FE0F}", "Japanese “Monthly Amount” Button"),
    new Emoji("\u{1F238}", "Japanese “Application” Button"),
    new Emoji("\u{1F239}", "Japanese “Discount” Button"),
    new Emoji("\u{1F23A}", "Japanese “Open for Business” Button"),
    new Emoji("\u{1F250}", "Japanese “Bargain” Button"),
    new Emoji("\u{1F251}", "Japanese “Acceptable” Button"),
    new Emoji("\u{3297}\u{FE0F}", "Japanese “Congratulations” Button"),
    new Emoji("\u{3299}\u{FE0F}", "Japanese “Secret” Button"),
];
const time = [
    new Emoji("\u{1F550}", "One O’Clock"),
    new Emoji("\u{1F551}", "Two O’Clock"),
    new Emoji("\u{1F552}", "Three O’Clock"),
    new Emoji("\u{1F553}", "Four O’Clock"),
    new Emoji("\u{1F554}", "Five O’Clock"),
    new Emoji("\u{1F555}", "Six O’Clock"),
    new Emoji("\u{1F556}", "Seven O’Clock"),
    new Emoji("\u{1F557}", "Eight O’Clock"),
    new Emoji("\u{1F558}", "Nine O’Clock"),
    new Emoji("\u{1F559}", "Ten O’Clock"),
    new Emoji("\u{1F55A}", "Eleven O’Clock"),
    new Emoji("\u{1F55B}", "Twelve O’Clock"),
    new Emoji("\u{1F55C}", "One-Thirty"),
    new Emoji("\u{1F55D}", "Two-Thirty"),
    new Emoji("\u{1F55E}", "Three-Thirty"),
    new Emoji("\u{1F55F}", "Four-Thirty"),
    new Emoji("\u{1F560}", "Five-Thirty"),
    new Emoji("\u{1F561}", "Six-Thirty"),
    new Emoji("\u{1F562}", "Seven-Thirty"),
    new Emoji("\u{1F563}", "Eight-Thirty"),
    new Emoji("\u{1F564}", "Nine-Thirty"),
    new Emoji("\u{1F565}", "Ten-Thirty"),
    new Emoji("\u{1F566}", "Eleven-Thirty"),
    new Emoji("\u{1F567}", "Twelve-Thirty"),
];
const clocks = [
    new Emoji("\u{1F570}\u{FE0F}", "Mantelpiece Clock"),
    new Emoji("\u{231A}", "Watch"),
    new Emoji("\u{23F0}", "Alarm Clock"),
    new Emoji("\u{23F1}\u{FE0F}", "Stopwatch"),
    new Emoji("\u{23F2}\u{FE0F}", "Timer Clock"),
    new Emoji("\u{231B}", "Hourglass Done"),
    new Emoji("\u{23F3}", "Hourglass Not Done"),
];
const arrows = [
    new Emoji("\u{1F503}\u{FE0F}", "Clockwise Vertical Arrows"),
    new Emoji("\u{1F504}\u{FE0F}", "Counterclockwise Arrows Button"),
    new Emoji("\u{2194}\u{FE0F}", "Left-Right Arrow"),
    new Emoji("\u{2195}\u{FE0F}", "Up-Down Arrow"),
    new Emoji("\u{2196}\u{FE0F}", "Up-Left Arrow"),
    new Emoji("\u{2197}\u{FE0F}", "Up-Right Arrow"),
    new Emoji("\u{2198}\u{FE0F}", "Down-Right Arrow"),
    new Emoji("\u{2199}\u{FE0F}", "Down-Left Arrow"),
    new Emoji("\u{21A9}\u{FE0F}", "Right Arrow Curving Left"),
    new Emoji("\u{21AA}\u{FE0F}", "Left Arrow Curving Right"),
    new Emoji("\u{27A1}\u{FE0F}", "Right Arrow"),
    new Emoji("\u{2934}\u{FE0F}", "Right Arrow Curving Up"),
    new Emoji("\u{2935}\u{FE0F}", "Right Arrow Curving Down"),
    new Emoji("\u{2B05}\u{FE0F}", "Left Arrow"),
    new Emoji("\u{2B06}\u{FE0F}", "Up Arrow"),
    new Emoji("\u{2B07}\u{FE0F}", "Down Arrow"),
];
const shapes = [
    new Emoji("\u{1F534}", "Red Circle"),
    new Emoji("\u{1F535}", "Blue Circle"),
    new Emoji("\u{1F536}", "Large Orange Diamond"),
    new Emoji("\u{1F537}", "Large Blue Diamond"),
    new Emoji("\u{1F538}", "Small Orange Diamond"),
    new Emoji("\u{1F539}", "Small Blue Diamond"),
    new Emoji("\u{1F53A}", "Red Triangle Pointed Up"),
    new Emoji("\u{1F53B}", "Red Triangle Pointed Down"),
    new Emoji("\u{1F7E0}", "Orange Circle"),
    new Emoji("\u{1F7E1}", "Yellow Circle"),
    new Emoji("\u{1F7E2}", "Green Circle"),
    new Emoji("\u{1F7E3}", "Purple Circle"),
    new Emoji("\u{1F7E4}", "Brown Circle"),
    new Emoji("\u{2B55}", "Hollow Red Circle"),
    new Emoji("\u{26AA}", "White Circle"),
    new Emoji("\u{26AB}", "Black Circle"),
    new Emoji("\u{1F7E5}", "Red Square"),
    new Emoji("\u{1F7E6}", "Blue Square"),
    new Emoji("\u{1F7E7}", "Orange Square"),
    new Emoji("\u{1F7E8}", "Yellow Square"),
    new Emoji("\u{1F7E9}", "Green Square"),
    new Emoji("\u{1F7EA}", "Purple Square"),
    new Emoji("\u{1F7EB}", "Brown Square"),
    new Emoji("\u{1F532}", "Black Square Button"),
    new Emoji("\u{1F533}", "White Square Button"),
    new Emoji("\u{25AA}\u{FE0F}", "Black Small Square"),
    new Emoji("\u{25AB}\u{FE0F}", "White Small Square"),
    new Emoji("\u{25FD}", "White Medium-Small Square"),
    new Emoji("\u{25FE}", "Black Medium-Small Square"),
    new Emoji("\u{25FB}\u{FE0F}", "White Medium Square"),
    new Emoji("\u{25FC}\u{FE0F}", "Black Medium Square"),
    new Emoji("\u{2B1B}", "Black Large Square"),
    new Emoji("\u{2B1C}", "White Large Square"),
    new Emoji("\u{2B50}", "Star"),
    new Emoji("\u{1F4A0}", "Diamond with a Dot")
];
const shuffleTracksButton = new Emoji("\u{1F500}", "Shuffle Tracks Button");
const repeatButton = new Emoji("\u{1F501}", "Repeat Button");
const repeatSingleButton = new Emoji("\u{1F502}", "Repeat Single Button");
const upwardsButton = new Emoji("\u{1F53C}", "Upwards Button");
const downwardsButton = new Emoji("\u{1F53D}", "Downwards Button");
const playButton = new Emoji("\u{25B6}\u{FE0F}", "Play Button");
const reverseButton = new Emoji("\u{25C0}\u{FE0F}", "Reverse Button");
const ejectButton = new Emoji("\u{23CF}\u{FE0F}", "Eject Button");
const fastForwardButton = new Emoji("\u{23E9}", "Fast-Forward Button");
const fastReverseButton = new Emoji("\u{23EA}", "Fast Reverse Button");
const fastUpButton = new Emoji("\u{23EB}", "Fast Up Button");
const fastDownButton = new Emoji("\u{23EC}", "Fast Down Button");
const nextTrackButton = new Emoji("\u{23ED}\u{FE0F}", "Next Track Button");
const lastTrackButton = new Emoji("\u{23EE}\u{FE0F}", "Last Track Button");
const playOrPauseButton = new Emoji("\u{23EF}\u{FE0F}", "Play or Pause Button");
const pauseButton = new Emoji("\u{23F8}\u{FE0F}", "Pause Button");
const stopButton = new Emoji("\u{23F9}\u{FE0F}", "Stop Button");
const recordButton = new Emoji("\u{23FA}\u{FE0F}", "Record Button");
const mediaPlayer = [
    shuffleTracksButton,
    repeatButton,
    repeatSingleButton,
    upwardsButton,
    downwardsButton,
    pauseButton,
    reverseButton,
    ejectButton,
    fastForwardButton,
    fastReverseButton,
    fastUpButton,
    fastDownButton,
    nextTrackButton,
    lastTrackButton,
    playOrPauseButton,
    pauseButton,
    stopButton,
    recordButton,
];
const zodiac = [
    new Emoji("\u{2648}", "Aries"),
    new Emoji("\u{2649}", "Taurus"),
    new Emoji("\u{264A}", "Gemini"),
    new Emoji("\u{264B}", "Cancer"),
    new Emoji("\u{264C}", "Leo"),
    new Emoji("\u{264D}", "Virgo"),
    new Emoji("\u{264E}", "Libra"),
    new Emoji("\u{264F}", "Scorpio"),
    new Emoji("\u{2650}", "Sagittarius"),
    new Emoji("\u{2651}", "Capricorn"),
    new Emoji("\u{2652}", "Aquarius"),
    new Emoji("\u{2653}", "Pisces"),
    new Emoji("\u{26CE}", "Ophiuchus"),
];
const numbers = [
    new Emoji("\u{30}\u{FE0F}", "Digit Zero"),
    new Emoji("\u{31}\u{FE0F}", "Digit One"),
    new Emoji("\u{32}\u{FE0F}", "Digit Two"),
    new Emoji("\u{33}\u{FE0F}", "Digit Three"),
    new Emoji("\u{34}\u{FE0F}", "Digit Four"),
    new Emoji("\u{35}\u{FE0F}", "Digit Five"),
    new Emoji("\u{36}\u{FE0F}", "Digit Six"),
    new Emoji("\u{37}\u{FE0F}", "Digit Seven"),
    new Emoji("\u{38}\u{FE0F}", "Digit Eight"),
    new Emoji("\u{39}\u{FE0F}", "Digit Nine"),
    new Emoji("\u{2A}\u{FE0F}", "Asterisk"),
    new Emoji("\u{23}\u{FE0F}", "Number Sign"),
    new Emoji("\u{30}\u{FE0F}\u{20E3}", "Keycap Digit Zero"),
    new Emoji("\u{31}\u{FE0F}\u{20E3}", "Keycap Digit One"),
    new Emoji("\u{32}\u{FE0F}\u{20E3}", "Keycap Digit Two"),
    new Emoji("\u{33}\u{FE0F}\u{20E3}", "Keycap Digit Three"),
    new Emoji("\u{34}\u{FE0F}\u{20E3}", "Keycap Digit Four"),
    new Emoji("\u{35}\u{FE0F}\u{20E3}", "Keycap Digit Five"),
    new Emoji("\u{36}\u{FE0F}\u{20E3}", "Keycap Digit Six"),
    new Emoji("\u{37}\u{FE0F}\u{20E3}", "Keycap Digit Seven"),
    new Emoji("\u{38}\u{FE0F}\u{20E3}", "Keycap Digit Eight"),
    new Emoji("\u{39}\u{FE0F}\u{20E3}", "Keycap Digit Nine"),
    new Emoji("\u{2A}\u{FE0F}\u{20E3}", "Keycap Asterisk"),
    new Emoji("\u{23}\u{FE0F}\u{20E3}", "Keycap Number Sign"),
    new Emoji("\u{1F51F}", "Keycap: 10"),
];
const tags = [
    new Emoji("\u{E0020}", "Tag Space"),
    new Emoji("\u{E0021}", "Tag Exclamation Mark"),
    new Emoji("\u{E0022}", "Tag Quotation Mark"),
    new Emoji("\u{E0023}", "Tag Number Sign"),
    new Emoji("\u{E0024}", "Tag Dollar Sign"),
    new Emoji("\u{E0025}", "Tag Percent Sign"),
    new Emoji("\u{E0026}", "Tag Ampersand"),
    new Emoji("\u{E0027}", "Tag Apostrophe"),
    new Emoji("\u{E0028}", "Tag Left Parenthesis"),
    new Emoji("\u{E0029}", "Tag Right Parenthesis"),
    new Emoji("\u{E002A}", "Tag Asterisk"),
    new Emoji("\u{E002B}", "Tag Plus Sign"),
    new Emoji("\u{E002C}", "Tag Comma"),
    new Emoji("\u{E002D}", "Tag Hyphen-Minus"),
    new Emoji("\u{E002E}", "Tag Full Stop"),
    new Emoji("\u{E002F}", "Tag Solidus"),
    new Emoji("\u{E0030}", "Tag Digit Zero"),
    new Emoji("\u{E0031}", "Tag Digit One"),
    new Emoji("\u{E0032}", "Tag Digit Two"),
    new Emoji("\u{E0033}", "Tag Digit Three"),
    new Emoji("\u{E0034}", "Tag Digit Four"),
    new Emoji("\u{E0035}", "Tag Digit Five"),
    new Emoji("\u{E0036}", "Tag Digit Six"),
    new Emoji("\u{E0037}", "Tag Digit Seven"),
    new Emoji("\u{E0038}", "Tag Digit Eight"),
    new Emoji("\u{E0039}", "Tag Digit Nine"),
    new Emoji("\u{E003A}", "Tag Colon"),
    new Emoji("\u{E003B}", "Tag Semicolon"),
    new Emoji("\u{E003C}", "Tag Less-Than Sign"),
    new Emoji("\u{E003D}", "Tag Equals Sign"),
    new Emoji("\u{E003E}", "Tag Greater-Than Sign"),
    new Emoji("\u{E003F}", "Tag Question Mark"),
    new Emoji("\u{E0040}", "Tag Commercial at"),
    new Emoji("\u{E0041}", "Tag Latin Capital Letter a"),
    new Emoji("\u{E0042}", "Tag Latin Capital Letter B"),
    new Emoji("\u{E0043}", "Tag Latin Capital Letter C"),
    new Emoji("\u{E0044}", "Tag Latin Capital Letter D"),
    new Emoji("\u{E0045}", "Tag Latin Capital Letter E"),
    new Emoji("\u{E0046}", "Tag Latin Capital Letter F"),
    new Emoji("\u{E0047}", "Tag Latin Capital Letter G"),
    new Emoji("\u{E0048}", "Tag Latin Capital Letter H"),
    new Emoji("\u{E0049}", "Tag Latin Capital Letter I"),
    new Emoji("\u{E004A}", "Tag Latin Capital Letter J"),
    new Emoji("\u{E004B}", "Tag Latin Capital Letter K"),
    new Emoji("\u{E004C}", "Tag Latin Capital Letter L"),
    new Emoji("\u{E004D}", "Tag Latin Capital Letter M"),
    new Emoji("\u{E004E}", "Tag Latin Capital Letter N"),
    new Emoji("\u{E004F}", "Tag Latin Capital Letter O"),
    new Emoji("\u{E0050}", "Tag Latin Capital Letter P"),
    new Emoji("\u{E0051}", "Tag Latin Capital Letter Q"),
    new Emoji("\u{E0052}", "Tag Latin Capital Letter R"),
    new Emoji("\u{E0053}", "Tag Latin Capital Letter S"),
    new Emoji("\u{E0054}", "Tag Latin Capital Letter T"),
    new Emoji("\u{E0055}", "Tag Latin Capital Letter U"),
    new Emoji("\u{E0056}", "Tag Latin Capital Letter V"),
    new Emoji("\u{E0057}", "Tag Latin Capital Letter W"),
    new Emoji("\u{E0058}", "Tag Latin Capital Letter X"),
    new Emoji("\u{E0059}", "Tag Latin Capital Letter Y"),
    new Emoji("\u{E005A}", "Tag Latin Capital Letter Z"),
    new Emoji("\u{E005B}", "Tag Left Square Bracket"),
    new Emoji("\u{E005C}", "Tag Reverse Solidus"),
    new Emoji("\u{E005D}", "Tag Right Square Bracket"),
    new Emoji("\u{E005E}", "Tag Circumflex Accent"),
    new Emoji("\u{E005F}", "Tag Low Line"),
    new Emoji("\u{E0060}", "Tag Grave Accent"),
    new Emoji("\u{E0061}", "Tag Latin Small Letter a"),
    new Emoji("\u{E0062}", "Tag Latin Small Letter B"),
    new Emoji("\u{E0063}", "Tag Latin Small Letter C"),
    new Emoji("\u{E0064}", "Tag Latin Small Letter D"),
    new Emoji("\u{E0065}", "Tag Latin Small Letter E"),
    new Emoji("\u{E0066}", "Tag Latin Small Letter F"),
    new Emoji("\u{E0067}", "Tag Latin Small Letter G"),
    new Emoji("\u{E0068}", "Tag Latin Small Letter H"),
    new Emoji("\u{E0069}", "Tag Latin Small Letter I"),
    new Emoji("\u{E006A}", "Tag Latin Small Letter J"),
    new Emoji("\u{E006B}", "Tag Latin Small Letter K"),
    new Emoji("\u{E006C}", "Tag Latin Small Letter L"),
    new Emoji("\u{E006D}", "Tag Latin Small Letter M"),
    new Emoji("\u{E006E}", "Tag Latin Small Letter N"),
    new Emoji("\u{E006F}", "Tag Latin Small Letter O"),
    new Emoji("\u{E0070}", "Tag Latin Small Letter P"),
    new Emoji("\u{E0071}", "Tag Latin Small Letter Q"),
    new Emoji("\u{E0072}", "Tag Latin Small Letter R"),
    new Emoji("\u{E0073}", "Tag Latin Small Letter S"),
    new Emoji("\u{E0074}", "Tag Latin Small Letter T"),
    new Emoji("\u{E0075}", "Tag Latin Small Letter U"),
    new Emoji("\u{E0076}", "Tag Latin Small Letter V"),
    new Emoji("\u{E0077}", "Tag Latin Small Letter W"),
    new Emoji("\u{E0078}", "Tag Latin Small Letter X"),
    new Emoji("\u{E0079}", "Tag Latin Small Letter Y"),
    new Emoji("\u{E007A}", "Tag Latin Small Letter Z"),
    new Emoji("\u{E007B}", "Tag Left Curly Bracket"),
    new Emoji("\u{E007C}", "Tag Vertical Line"),
    new Emoji("\u{E007D}", "Tag Right Curly Bracket"),
    new Emoji("\u{E007E}", "Tag Tilde"),
    new Emoji("\u{E007F}", "Cancel Tag"),
];
const math = [
    new Emoji("\u{2716}\u{FE0F}", "Multiply"),
    new Emoji("\u{2795}", "Plus"),
    new Emoji("\u{2796}", "Minus"),
    new Emoji("\u{2797}", "Divide"),
];
const games = [
    new Emoji("\u{2660}\u{FE0F}", "Spade Suit"),
    new Emoji("\u{2663}\u{FE0F}", "Club Suit"),
    { value: "\u{2665}\u{FE0F}", desc: "Heart Suit", color: "red" },
    { value: "\u{2666}\u{FE0F}", desc: "Diamond Suit", color: "red" },
    new Emoji("\u{1F004}", "Mahjong Red Dragon"),
    new Emoji("\u{1F0CF}", "Joker"),
    new Emoji("\u{1F3AF}", "Direct Hit"),
    new Emoji("\u{1F3B0}", "Slot Machine"),
    new Emoji("\u{1F3B1}", "Pool 8 Ball"),
    new Emoji("\u{1F3B2}", "Game Die"),
    new Emoji("\u{1F3B3}", "Bowling"),
    new Emoji("\u{1F3B4}", "Flower Playing Cards"),
    new Emoji("\u{1F9E9}", "Puzzle Piece"),
    new Emoji("\u{265F}\u{FE0F}", "Chess Pawn"),
    new Emoji("\u{1FA80}", "Yo-Yo"),
    new Emoji("\u{1FA81}", "Kite"),
    new Emoji("\u{1FA83}", "Boomerang"),
    new Emoji("\u{1FA86}", "Nesting Dolls"),
];
const sportsEquipment = [
    new Emoji("\u{1F3BD}", "Running Shirt"),
    new Emoji("\u{1F3BE}", "Tennis"),
    new Emoji("\u{1F3BF}", "Skis"),
    new Emoji("\u{1F3C0}", "Basketball"),
    new Emoji("\u{1F3C5}", "Sports Medal"),
    new Emoji("\u{1F3C6}", "Trophy"),
    new Emoji("\u{1F3C8}", "American Football"),
    new Emoji("\u{1F3C9}", "Rugby Football"),
    new Emoji("\u{1F3CF}", "Cricket Game"),
    new Emoji("\u{1F3D0}", "Volleyball"),
    new Emoji("\u{1F3D1}", "Field Hockey"),
    new Emoji("\u{1F3D2}", "Ice Hockey"),
    new Emoji("\u{1F3D3}", "Ping Pong"),
    new Emoji("\u{1F3F8}", "Badminton"),
    new Emoji("\u{1F6F7}", "Sled"),
    new Emoji("\u{1F945}", "Goal Net"),
    new Emoji("\u{1F947}", "1st Place Medal"),
    new Emoji("\u{1F948}", "2nd Place Medal"),
    new Emoji("\u{1F949}", "3rd Place Medal"),
    new Emoji("\u{1F94A}", "Boxing Glove"),
    new Emoji("\u{1F94C}", "Curling Stone"),
    new Emoji("\u{1F94D}", "Lacrosse"),
    new Emoji("\u{1F94E}", "Softball"),
    new Emoji("\u{1F94F}", "Flying Disc"),
    new Emoji("\u{26BD}", "Soccer Ball"),
    new Emoji("\u{26BE}", "Baseball"),
    new Emoji("\u{26F8}\u{FE0F}", "Ice Skate"),
];
const clothing = [
    new Emoji("\u{1F3A9}", "Top Hat"),
    new Emoji("\u{1F93F}", "Diving Mask"),
    new Emoji("\u{1F452}", "Woman’s Hat"),
    new Emoji("\u{1F453}", "Glasses"),
    new Emoji("\u{1F576}\u{FE0F}", "Sunglasses"),
    new Emoji("\u{1F454}", "Necktie"),
    new Emoji("\u{1F455}", "T-Shirt"),
    new Emoji("\u{1F456}", "Jeans"),
    new Emoji("\u{1F457}", "Dress"),
    new Emoji("\u{1F458}", "Kimono"),
    new Emoji("\u{1F459}", "Bikini"),
    new Emoji("\u{1F45A}", "Woman’s Clothes"),
    new Emoji("\u{1F45B}", "Purse"),
    new Emoji("\u{1F45C}", "Handbag"),
    new Emoji("\u{1F45D}", "Clutch Bag"),
    new Emoji("\u{1F45E}", "Man’s Shoe"),
    new Emoji("\u{1F45F}", "Running Shoe"),
    new Emoji("\u{1F460}", "High-Heeled Shoe"),
    new Emoji("\u{1F461}", "Woman’s Sandal"),
    new Emoji("\u{1F462}", "Woman’s Boot"),
    new Emoji("\u{1F94B}", "Martial Arts Uniform"),
    new Emoji("\u{1F97B}", "Sari"),
    new Emoji("\u{1F97C}", "Lab Coat"),
    new Emoji("\u{1F97D}", "Goggles"),
    new Emoji("\u{1F97E}", "Hiking Boot"),
    new Emoji("\u{1F97F}", "Flat Shoe"),
    new Emoji("\u{1F9AF}", "White Cane"),
    new Emoji("\u{1F9BA}", "Safety Vest"),
    new Emoji("\u{1F9E2}", "Billed Cap"),
    new Emoji("\u{1F9E3}", "Scarf"),
    new Emoji("\u{1F9E4}", "Gloves"),
    new Emoji("\u{1F9E5}", "Coat"),
    new Emoji("\u{1F9E6}", "Socks"),
    new Emoji("\u{1F9FF}", "Nazar Amulet"),
    new Emoji("\u{1FA70}", "Ballet Shoes"),
    new Emoji("\u{1FA71}", "One-Piece Swimsuit"),
    new Emoji("\u{1FA72}", "Briefs"),
    new Emoji("\u{1FA73}", "Shorts"),
    new Emoji("\u{1FA74}", "Thong Sandal"),
];
const town = [
    new Emoji("\u{1F3D7}\u{FE0F}", "Building Construction"),
    new Emoji("\u{1F3D8}\u{FE0F}", "Houses"),
    new Emoji("\u{1F3D9}\u{FE0F}", "Cityscape"),
    new Emoji("\u{1F3DA}\u{FE0F}", "Derelict House"),
    new Emoji("\u{1F3DB}\u{FE0F}", "Classical Building"),
    new Emoji("\u{1F3DC}\u{FE0F}", "Desert"),
    new Emoji("\u{1F3DD}\u{FE0F}", "Desert Island"),
    new Emoji("\u{1F3DE}\u{FE0F}", "National Park"),
    new Emoji("\u{1F3DF}\u{FE0F}", "Stadium"),
    new Emoji("\u{1F3E0}", "House"),
    new Emoji("\u{1F3E1}", "House with Garden"),
    new Emoji("\u{1F3E2}", "Office Building"),
    new Emoji("\u{1F3E3}", "Japanese Post Office"),
    new Emoji("\u{1F3E4}", "Post Office"),
    new Emoji("\u{1F3E5}", "Hospital"),
    new Emoji("\u{1F3E6}", "Bank"),
    new Emoji("\u{1F3E7}", "ATM Sign"),
    new Emoji("\u{1F3E8}", "Hotel"),
    new Emoji("\u{1F3E9}", "Love Hotel"),
    new Emoji("\u{1F3EA}", "Convenience Store"),
    new Emoji("\u{1F3EB}", "School"),
    new Emoji("\u{1F3EC}", "Department Store"),
    new Emoji("\u{1F3ED}", "Factory"),
    new Emoji("\u{1F309}", "Bridge at Night"),
    new Emoji("\u{26F2}", "Fountain"),
    new Emoji("\u{1F6CD}\u{FE0F}", "Shopping Bags"),
    new Emoji("\u{1F9FE}", "Receipt"),
    new Emoji("\u{1F6D2}", "Shopping Cart"),
    new Emoji("\u{1F488}", "Barber Pole"),
    new Emoji("\u{1F492}", "Wedding"),
    new Emoji("\u{1F6D6}", "Hut"),
    new Emoji("\u{1F6D7}", "Elevator"),
    new Emoji("\u{1F5F3}\u{FE0F}", "Ballot Box with Ballot")
];
const buttons = [
    new Emoji("\u{1F191}", "CL Button"),
    new Emoji("\u{1F192}", "Cool Button"),
    new Emoji("\u{1F193}", "Free Button"),
    new Emoji("\u{1F194}", "ID Button"),
    new Emoji("\u{1F195}", "New Button"),
    new Emoji("\u{1F196}", "NG Button"),
    new Emoji("\u{1F197}", "OK Button"),
    new Emoji("\u{1F198}", "SOS Button"),
    new Emoji("\u{1F199}", "Up! Button"),
    new Emoji("\u{1F19A}", "Vs Button"),
    new Emoji("\u{1F518}", "Radio Button"),
    new Emoji("\u{1F519}", "Back Arrow"),
    new Emoji("\u{1F51A}", "End Arrow"),
    new Emoji("\u{1F51B}", "On! Arrow"),
    new Emoji("\u{1F51C}", "Soon Arrow"),
    new Emoji("\u{1F51D}", "Top Arrow"),
    new Emoji("\u{2611}\u{FE0F}", "Check Box with Check"),
    new Emoji("\u{1F520}", "Input Latin Uppercase"),
    new Emoji("\u{1F521}", "Input Latin Lowercase"),
    new Emoji("\u{1F522}", "Input Numbers"),
    new Emoji("\u{1F523}", "Input Symbols"),
    new Emoji("\u{1F524}", "Input Latin Letters"),
];
const music = [
    new Emoji("\u{1F3BC}", "Musical Score"),
    new Emoji("\u{1F3B6}", "Musical Notes"),
    new Emoji("\u{1F3B5}", "Musical Note"),
    new Emoji("\u{1F3B7}", "Saxophone"),
    new Emoji("\u{1F3B8}", "Guitar"),
    new Emoji("\u{1F3B9}", "Musical Keyboard"),
    new Emoji("\u{1F3BA}", "Trumpet"),
    new Emoji("\u{1F3BB}", "Violin"),
    new Emoji("\u{1F941}", "Drum"),
    new Emoji("\u{1FA95}", "Banjo"),
    new Emoji("\u{1FA97}", "Accordion"),
    new Emoji("\u{1FA98}", "Long Drum"),
];
const weather = [
    new Emoji("\u{1F304}", "Sunrise Over Mountains"),
    new Emoji("\u{1F305}", "Sunrise"),
    new Emoji("\u{1F306}", "Cityscape at Dusk"),
    new Emoji("\u{1F307}", "Sunset"),
    new Emoji("\u{1F303}", "Night with Stars"),
    new Emoji("\u{1F302}", "Closed Umbrella"),
    new Emoji("\u{2602}\u{FE0F}", "Umbrella"),
    new Emoji("\u{2614}\u{FE0F}", "Umbrella with Rain Drops"),
    new Emoji("\u{2603}\u{FE0F}", "Snowman"),
    new Emoji("\u{26C4}", "Snowman Without Snow"),
    new Emoji("\u{2600}\u{FE0F}", "Sun"),
    new Emoji("\u{2601}\u{FE0F}", "Cloud"),
    new Emoji("\u{1F324}\u{FE0F}", "Sun Behind Small Cloud"),
    new Emoji("\u{26C5}", "Sun Behind Cloud"),
    new Emoji("\u{1F325}\u{FE0F}", "Sun Behind Large Cloud"),
    new Emoji("\u{1F326}\u{FE0F}", "Sun Behind Rain Cloud"),
    new Emoji("\u{1F327}\u{FE0F}", "Cloud with Rain"),
    new Emoji("\u{1F328}\u{FE0F}", "Cloud with Snow"),
    new Emoji("\u{1F329}\u{FE0F}", "Cloud with Lightning"),
    new Emoji("\u{26C8}\u{FE0F}", "Cloud with Lightning and Rain"),
    new Emoji("\u{2744}\u{FE0F}", "Snowflake"),
    new Emoji("\u{1F300}", "Cyclone"),
    new Emoji("\u{1F32A}\u{FE0F}", "Tornado"),
    new Emoji("\u{1F32C}\u{FE0F}", "Wind Face"),
    new Emoji("\u{1F30A}", "Water Wave"),
    new Emoji("\u{1F32B}\u{FE0F}", "Fog"),
    new Emoji("\u{1F301}", "Foggy"),
    new Emoji("\u{1F308}", "Rainbow"),
    new Emoji("\u{1F321}\u{FE0F}", "Thermometer"),
];
const astro = [
    new Emoji("\u{1F30C}", "Milky Way"),
    new Emoji("\u{1F30D}", "Globe Showing Europe-Africa"),
    new Emoji("\u{1F30E}", "Globe Showing Americas"),
    new Emoji("\u{1F30F}", "Globe Showing Asia-Australia"),
    new Emoji("\u{1F310}", "Globe with Meridians"),
    new Emoji("\u{1F311}", "New Moon"),
    new Emoji("\u{1F312}", "Waxing Crescent Moon"),
    new Emoji("\u{1F313}", "First Quarter Moon"),
    new Emoji("\u{1F314}", "Waxing Gibbous Moon"),
    new Emoji("\u{1F315}", "Full Moon"),
    new Emoji("\u{1F316}", "Waning Gibbous Moon"),
    new Emoji("\u{1F317}", "Last Quarter Moon"),
    new Emoji("\u{1F318}", "Waning Crescent Moon"),
    new Emoji("\u{1F319}", "Crescent Moon"),
    new Emoji("\u{1F31A}", "New Moon Face"),
    new Emoji("\u{1F31B}", "First Quarter Moon Face"),
    new Emoji("\u{1F31C}", "Last Quarter Moon Face"),
    new Emoji("\u{1F31D}", "Full Moon Face"),
    new Emoji("\u{1F31E}", "Sun with Face"),
    new Emoji("\u{1F31F}", "Glowing Star"),
    new Emoji("\u{1F320}", "Shooting Star"),
    new Emoji("\u{2604}\u{FE0F}", "Comet"),
    new Emoji("\u{1FA90}", "Ringed Planet"),
];
const finance = [
    new Emoji("\u{1F4B0}", "Money Bag"),
    new Emoji("\u{1F4B1}", "Currency Exchange"),
    new Emoji("\u{1F4B2}", "Heavy Dollar Sign"),
    new Emoji("\u{1F4B3}", "Credit Card"),
    new Emoji("\u{1F4B4}", "Yen Banknote"),
    new Emoji("\u{1F4B5}", "Dollar Banknote"),
    new Emoji("\u{1F4B6}", "Euro Banknote"),
    new Emoji("\u{1F4B7}", "Pound Banknote"),
    new Emoji("\u{1F4B8}", "Money with Wings"),
    new Emoji("\u{1F4B9}", "Chart Increasing with Yen"),
    new Emoji("\u{1FA99}", "Coin"),
];
const writing = [
    new Emoji("\u{1F58A}\u{FE0F}", "Pen"),
    new Emoji("\u{1F58B}\u{FE0F}", "Fountain Pen"),
    new Emoji("\u{1F58C}\u{FE0F}", "Paintbrush"),
    new Emoji("\u{1F58D}\u{FE0F}", "Crayon"),
    new Emoji("\u{270F}\u{FE0F}", "Pencil"),
    new Emoji("\u{2712}\u{FE0F}", "Black Nib"),
];
const droplet = new Emoji("\u{1F4A7}", "Droplet");
const dropOfBlood = new Emoji("\u{1FA78}", "Drop of Blood");
const adhesiveBandage = new Emoji("\u{1FA79}", "Adhesive Bandage");
const stehoscope = new Emoji("\u{1FA7A}", "Stethoscope");
const syringe = new Emoji("\u{1F489}", "Syringe");
const pill = new Emoji("\u{1F48A}", "Pill");
const micrscope = new Emoji("\u{1F52C}", "Microscope");
const testTube = new Emoji("\u{1F9EA}", "Test Tube");
const petriDish = new Emoji("\u{1F9EB}", "Petri Dish");
const dna = new Emoji("\u{1F9EC}", "DNA");
const abacus = new Emoji("\u{1F9EE}", "Abacus");
const magnet = new Emoji("\u{1F9F2}", "Magnet");
const telescope = new Emoji("\u{1F52D}", "Telescope");
const medicalSymbol = new Emoji("\u{2695}\u{FE0F}", "Medical Symbol");
const balanceScale = new Emoji("\u{2696}\u{FE0F}", "Balance Scale");
const alembic = new Emoji("\u{2697}\u{FE0F}", "Alembic");
const gear = new Emoji("\u{2699}\u{FE0F}", "Gear");
const atomSymbol = new Emoji("\u{269B}\u{FE0F}", "Atom Symbol");
const magnifyingGlassTiltedLeft = new Emoji("\u{1F50D}", "Magnifying Glass Tilted Left");
const magnifyingGlassTiltedRight = new Emoji("\u{1F50E}", "Magnifying Glass Tilted Right");
const science = [
    droplet,
    dropOfBlood,
    adhesiveBandage,
    stehoscope,
    syringe,
    pill,
    micrscope,
    testTube,
    petriDish,
    dna,
    abacus,
    magnet,
    telescope,
    medicalSymbol,
    balanceScale,
    alembic,
    gear,
    atomSymbol,
    magnifyingGlassTiltedLeft,
    magnifyingGlassTiltedRight,
];
const joystick = new Emoji("\u{1F579}\u{FE0F}", "Joystick");
const videoGame = new Emoji("\u{1F3AE}", "Video Game");
const lightBulb = new Emoji("\u{1F4A1}", "Light Bulb");
const laptop = new Emoji("\u{1F4BB}", "Laptop");
const briefcase = new Emoji("\u{1F4BC}", "Briefcase");
const computerDisk = new Emoji("\u{1F4BD}", "Computer Disk");
const floppyDisk = new Emoji("\u{1F4BE}", "Floppy Disk");
const opticalDisk = new Emoji("\u{1F4BF}", "Optical Disk");
const dvd = new Emoji("\u{1F4C0}", "DVD");
const desktopComputer = new Emoji("\u{1F5A5}\u{FE0F}", "Desktop Computer");
const keyboard = new Emoji("\u{2328}\u{FE0F}", "Keyboard");
const printer = new Emoji("\u{1F5A8}\u{FE0F}", "Printer");
const computerMouse = new Emoji("\u{1F5B1}\u{FE0F}", "Computer Mouse");
const trackball = new Emoji("\u{1F5B2}\u{FE0F}", "Trackball");
const telephone = new Emoji("\u{260E}\u{FE0F}", "Telephone");
const telephoneReceiver = new Emoji("\u{1F4DE}", "Telephone Receiver");
const pager = new Emoji("\u{1F4DF}", "Pager");
const faxMachine = new Emoji("\u{1F4E0}", "Fax Machine");
const satelliteAntenna = new Emoji("\u{1F4E1}", "Satellite Antenna");
const loudspeaker = new Emoji("\u{1F4E2}", "Loudspeaker");
const megaphone = new Emoji("\u{1F4E3}", "Megaphone");
const television = new Emoji("\u{1F4FA}", "Television");
const radio = new Emoji("\u{1F4FB}", "Radio");
const videocassette = new Emoji("\u{1F4FC}", "Videocassette");
const filProjector = new Emoji("\u{1F4FD}\u{FE0F}", "Film Projector");
const studioMicrophone = new Emoji("\u{1F399}\u{FE0F}", "Studio Microphone");
const levelSlider = new Emoji("\u{1F39A}\u{FE0F}", "Level Slider");
const controlKnobs = new Emoji("\u{1F39B}\u{FE0F}", "Control Knobs");
const microphone = new Emoji("\u{1F3A4}", "Microphone");
const movieCamera = new Emoji("\u{1F3A5}", "Movie Camera");
const headphone = new Emoji("\u{1F3A7}", "Headphone");
const camera = new Emoji("\u{1F4F7}", "Camera");
const cameraWithFlash = new Emoji("\u{1F4F8}", "Camera with Flash");
const videoCamera = new Emoji("\u{1F4F9}", "Video Camera");
const mobilePhone = new Emoji("\u{1F4F1}", "Mobile Phone");
const mobilePhoneOff = new Emoji("\u{1F4F4}", "Mobile Phone Off");
const mobilePhoneWithArrow = new Emoji("\u{1F4F2}", "Mobile Phone with Arrow");
const lockedWithPen = new Emoji("\u{1F50F}", "Locked with Pen");
const lockedWithKey = new Emoji("\u{1F510}", "Locked with Key");
const locked = new Emoji("\u{1F512}", "Locked");
const unlocked = new Emoji("\u{1F513}", "Unlocked");
const bell = new Emoji("\u{1F514}", "Bell");
const bellWithSlash = new Emoji("\u{1F515}", "Bell with Slash");
const bookmark = new Emoji("\u{1F516}", "Bookmark");
const link = new Emoji("\u{1F517}", "Link");
const vibrationMode = new Emoji("\u{1F4F3}", "Vibration Mode");
const antennaBars = new Emoji("\u{1F4F6}", "Antenna Bars");
const dimButton = new Emoji("\u{1F505}", "Dim Button");
const brightButton = new Emoji("\u{1F506}", "Bright Button");
const mutedSpeaker = new Emoji("\u{1F507}", "Muted Speaker");
const speakerLowVolume = new Emoji("\u{1F508}", "Speaker Low Volume");
const speakerMediumVolume = new Emoji("\u{1F509}", "Speaker Medium Volume");
const speakerHighVolume = new Emoji("\u{1F50A}", "Speaker High Volume");
const battery = new Emoji("\u{1F50B}", "Battery");
const electricPlug = new Emoji("\u{1F50C}", "Electric Plug");
const tech = [
    joystick,
    videoGame,
    lightBulb,
    laptop,
    briefcase,
    computerDisk,
    floppyDisk,
    opticalDisk,
    dvd,
    desktopComputer,
    keyboard,
    printer,
    computerMouse,
    trackball,
    telephone,
    telephoneReceiver,
    pager,
    faxMachine,
    satelliteAntenna,
    loudspeaker,
    megaphone,
    television,
    radio,
    videocassette,
    filProjector,
    studioMicrophone,
    levelSlider,
    controlKnobs,
    microphone,
    movieCamera,
    headphone,
    camera,
    cameraWithFlash,
    videoCamera,
    mobilePhone,
    mobilePhoneOff,
    mobilePhoneWithArrow,
    lockedWithPen,
    lockedWithKey,
    locked,
    unlocked,
    bell,
    bellWithSlash,
    bookmark,
    link,
    vibrationMode,
    antennaBars,
    dimButton,
    brightButton,
    mutedSpeaker,
    speakerLowVolume,
    speakerMediumVolume,
    speakerHighVolume,
    battery,
    electricPlug,
];
const mail = [
    new Emoji("\u{1F4E4}", "Outbox Tray"),
    new Emoji("\u{1F4E5}", "Inbox Tray"),
    new Emoji("\u{1F4E6}", "Package"),
    new Emoji("\u{1F4E7}", "E-Mail"),
    new Emoji("\u{1F4E8}", "Incoming Envelope"),
    new Emoji("\u{1F4E9}", "Envelope with Arrow"),
    new Emoji("\u{1F4EA}", "Closed Mailbox with Lowered Flag"),
    new Emoji("\u{1F4EB}", "Closed Mailbox with Raised Flag"),
    new Emoji("\u{1F4EC}", "Open Mailbox with Raised Flag"),
    new Emoji("\u{1F4ED}", "Open Mailbox with Lowered Flag"),
    new Emoji("\u{1F4EE}", "Postbox"),
    new Emoji("\u{1F4EF}", "Postal Horn"),
];
const celebration = [
    new Emoji("\u{1FA85}", "Piñata"),
    new Emoji("\u{1F380}", "Ribbon"),
    new Emoji("\u{1F381}", "Wrapped Gift"),
    new Emoji("\u{1F383}", "Jack-O-Lantern"),
    new Emoji("\u{1F384}", "Christmas Tree"),
    new Emoji("\u{1F9E8}", "Firecracker"),
    new Emoji("\u{1F386}", "Fireworks"),
    new Emoji("\u{1F387}", "Sparkler"),
    new Emoji("\u{2728}", "Sparkles"),
    new Emoji("\u{2747}\u{FE0F}", "Sparkle"),
    new Emoji("\u{1F388}", "Balloon"),
    new Emoji("\u{1F389}", "Party Popper"),
    new Emoji("\u{1F38A}", "Confetti Ball"),
    new Emoji("\u{1F38B}", "Tanabata Tree"),
    new Emoji("\u{1F38D}", "Pine Decoration"),
    new Emoji("\u{1F38E}", "Japanese Dolls"),
    new Emoji("\u{1F38F}", "Carp Streamer"),
    new Emoji("\u{1F390}", "Wind Chime"),
    new Emoji("\u{1F391}", "Moon Viewing Ceremony"),
    new Emoji("\u{1F392}", "Backpack"),
    new Emoji("\u{1F393}", "Graduation Cap"),
    new Emoji("\u{1F9E7}", "Red Envelope"),
    new Emoji("\u{1F3EE}", "Red Paper Lantern"),
    new Emoji("\u{1F396}\u{FE0F}", "Military Medal"),
];
const tools = [
    new Emoji("\u{1F3A3}", "Fishing Pole"),
    new Emoji("\u{1F526}", "Flashlight"),
    new Emoji("\u{1F527}", "Wrench"),
    new Emoji("\u{1F528}", "Hammer"),
    new Emoji("\u{1F529}", "Nut and Bolt"),
    new Emoji("\u{1F6E0}\u{FE0F}", "Hammer and Wrench"),
    new Emoji("\u{1F9ED}", "Compass"),
    new Emoji("\u{1F9EF}", "Fire Extinguisher"),
    new Emoji("\u{1F9F0}", "Toolbox"),
    new Emoji("\u{1F9F1}", "Brick"),
    new Emoji("\u{1FA93}", "Axe"),
    new Emoji("\u{2692}\u{FE0F}", "Hammer and Pick"),
    new Emoji("\u{26CF}\u{FE0F}", "Pick"),
    new Emoji("\u{26D1}\u{FE0F}", "Rescue Worker’s Helmet"),
    new Emoji("\u{26D3}\u{FE0F}", "Chains"),
    new Emoji("\u{1F5DC}\u{FE0F}", "Clamp"),
    new Emoji("\u{1FA9A}", "Carpentry Saw"),
    new Emoji("\u{1FA9B}", "Screwdriver"),
    new Emoji("\u{1FA9C}", "Ladder"),
    new Emoji("\u{1FA9D}", "Hook"),
];
const office = [
    new Emoji("\u{1F4C1}", "File Folder"),
    new Emoji("\u{1F4C2}", "Open File Folder"),
    new Emoji("\u{1F4C3}", "Page with Curl"),
    new Emoji("\u{1F4C4}", "Page Facing Up"),
    new Emoji("\u{1F4C5}", "Calendar"),
    new Emoji("\u{1F4C6}", "Tear-Off Calendar"),
    new Emoji("\u{1F4C7}", "Card Index"),
    new Emoji("\u{1F5C2}\u{FE0F}", "Card Index Dividers"),
    new Emoji("\u{1F5C3}\u{FE0F}", "Card File Box"),
    new Emoji("\u{1F5C4}\u{FE0F}", "File Cabinet"),
    new Emoji("\u{1F5D1}\u{FE0F}", "Wastebasket"),
    new Emoji("\u{1F5D2}\u{FE0F}", "Spiral Notepad"),
    new Emoji("\u{1F5D3}\u{FE0F}", "Spiral Calendar"),
    new Emoji("\u{1F4C8}", "Chart Increasing"),
    new Emoji("\u{1F4C9}", "Chart Decreasing"),
    new Emoji("\u{1F4CA}", "Bar Chart"),
    new Emoji("\u{1F4CB}", "Clipboard"),
    new Emoji("\u{1F4CC}", "Pushpin"),
    new Emoji("\u{1F4CD}", "Round Pushpin"),
    new Emoji("\u{1F4CE}", "Paperclip"),
    new Emoji("\u{1F587}\u{FE0F}", "Linked Paperclips"),
    new Emoji("\u{1F4CF}", "Straight Ruler"),
    new Emoji("\u{1F4D0}", "Triangular Ruler"),
    new Emoji("\u{1F4D1}", "Bookmark Tabs"),
    new Emoji("\u{1F4D2}", "Ledger"),
    new Emoji("\u{1F4D3}", "Notebook"),
    new Emoji("\u{1F4D4}", "Notebook with Decorative Cover"),
    new Emoji("\u{1F4D5}", "Closed Book"),
    new Emoji("\u{1F4D6}", "Open Book"),
    new Emoji("\u{1F4D7}", "Green Book"),
    new Emoji("\u{1F4D8}", "Blue Book"),
    new Emoji("\u{1F4D9}", "Orange Book"),
    new Emoji("\u{1F4DA}", "Books"),
    new Emoji("\u{1F4DB}", "Name Badge"),
    new Emoji("\u{1F4DC}", "Scroll"),
    new Emoji("\u{1F4DD}", "Memo"),
    new Emoji("\u{2702}\u{FE0F}", "Scissors"),
    new Emoji("\u{2709}\u{FE0F}", "Envelope"),
];
const signs = [
    new Emoji("\u{1F3A6}", "Cinema"),
    new Emoji("\u{1F4F5}", "No Mobile Phones"),
    new Emoji("\u{1F51E}", "No One Under Eighteen"),
    new Emoji("\u{1F6AB}", "Prohibited"),
    new Emoji("\u{1F6AC}", "Cigarette"),
    new Emoji("\u{1F6AD}", "No Smoking"),
    new Emoji("\u{1F6AE}", "Litter in Bin Sign"),
    new Emoji("\u{1F6AF}", "No Littering"),
    new Emoji("\u{1F6B0}", "Potable Water"),
    new Emoji("\u{1F6B1}", "Non-Potable Water"),
    new Emoji("\u{1F6B3}", "No Bicycles"),
    new Emoji("\u{1F6B7}", "No Pedestrians"),
    new Emoji("\u{1F6B8}", "Children Crossing"),
    new Emoji("\u{1F6B9}", "Men’s Room"),
    new Emoji("\u{1F6BA}", "Women’s Room"),
    new Emoji("\u{1F6BB}", "Restroom"),
    new Emoji("\u{1F6BC}", "Baby Symbol"),
    new Emoji("\u{1F6BE}", "Water Closet"),
    new Emoji("\u{1F6C2}", "Passport Control"),
    new Emoji("\u{1F6C3}", "Customs"),
    new Emoji("\u{1F6C4}", "Baggage Claim"),
    new Emoji("\u{1F6C5}", "Left Luggage"),
    new Emoji("\u{1F17F}\u{FE0F}", "Parking Button"),
    new Emoji("\u{267F}", "Wheelchair Symbol"),
    new Emoji("\u{2622}\u{FE0F}", "Radioactive"),
    new Emoji("\u{2623}\u{FE0F}", "Biohazard"),
    new Emoji("\u{26A0}\u{FE0F}", "Warning"),
    new Emoji("\u{26A1}", "High Voltage"),
    new Emoji("\u{26D4}", "No Entry"),
    new Emoji("\u{267B}\u{FE0F}", "Recycling Symbol"),
    new Emoji("\u{2640}\u{FE0F}", "Female Sign"),
    new Emoji("\u{2642}\u{FE0F}", "Male Sign"),
    new Emoji("\u{26A7}\u{FE0F}", "Transgender Symbol"),
];
const religion = [
    new Emoji("\u{1F52F}", "Dotted Six-Pointed Star"),
    new Emoji("\u{2721}\u{FE0F}", "Star of David"),
    new Emoji("\u{1F549}\u{FE0F}", "Om"),
    new Emoji("\u{1F54B}", "Kaaba"),
    new Emoji("\u{1F54C}", "Mosque"),
    new Emoji("\u{1F54D}", "Synagogue"),
    new Emoji("\u{1F54E}", "Menorah"),
    new Emoji("\u{1F6D0}", "Place of Worship"),
    new Emoji("\u{1F6D5}", "Hindu Temple"),
    new Emoji("\u{2626}\u{FE0F}", "Orthodox Cross"),
    new Emoji("\u{271D}\u{FE0F}", "Latin Cross"),
    new Emoji("\u{262A}\u{FE0F}", "Star and Crescent"),
    new Emoji("\u{262E}\u{FE0F}", "Peace Symbol"),
    new Emoji("\u{262F}\u{FE0F}", "Yin Yang"),
    new Emoji("\u{2638}\u{FE0F}", "Wheel of Dharma"),
    new Emoji("\u{267E}\u{FE0F}", "Infinity"),
    new Emoji("\u{1FA94}", "Diya Lamp"),
    new Emoji("\u{26E9}\u{FE0F}", "Shinto Shrine"),
    new Emoji("\u{26EA}", "Church"),
    new Emoji("\u{2734}\u{FE0F}", "Eight-Pointed Star"),
    new Emoji("\u{1F4FF}", "Prayer Beads"),
];
const household = [
    new Emoji("\u{1F484}", "Lipstick"),
    new Emoji("\u{1F48D}", "Ring"),
    new Emoji("\u{1F48E}", "Gem Stone"),
    new Emoji("\u{1F4F0}", "Newspaper"),
    new Emoji("\u{1F511}", "Key"),
    new Emoji("\u{1F525}", "Fire"),
    new Emoji("\u{1FAA8}", "Rock"),
    new Emoji("\u{1FAB5}", "Wood"),
    new Emoji("\u{1F52B}", "Pistol"),
    new Emoji("\u{1F56F}\u{FE0F}", "Candle"),
    new Emoji("\u{1F5BC}\u{FE0F}", "Framed Picture"),
    new Emoji("\u{1F5DD}\u{FE0F}", "Old Key"),
    new Emoji("\u{1F5DE}\u{FE0F}", "Rolled-Up Newspaper"),
    new Emoji("\u{1F5FA}\u{FE0F}", "World Map"),
    new Emoji("\u{1F6AA}", "Door"),
    new Emoji("\u{1F6BD}", "Toilet"),
    new Emoji("\u{1F6BF}", "Shower"),
    new Emoji("\u{1F6C1}", "Bathtub"),
    new Emoji("\u{1F6CB}\u{FE0F}", "Couch and Lamp"),
    new Emoji("\u{1F6CF}\u{FE0F}", "Bed"),
    new Emoji("\u{1F9F4}", "Lotion Bottle"),
    new Emoji("\u{1F9F5}", "Thread"),
    new Emoji("\u{1F9F6}", "Yarn"),
    new Emoji("\u{1F9F7}", "Safety Pin"),
    new Emoji("\u{1F9F8}", "Teddy Bear"),
    new Emoji("\u{1F9F9}", "Broom"),
    new Emoji("\u{1F9FA}", "Basket"),
    new Emoji("\u{1F9FB}", "Roll of Paper"),
    new Emoji("\u{1F9FC}", "Soap"),
    new Emoji("\u{1F9FD}", "Sponge"),
    new Emoji("\u{1FA91}", "Chair"),
    new Emoji("\u{1FA92}", "Razor"),
    new Emoji("\u{1FA9E}", "Mirror"),
    new Emoji("\u{1FA9F}", "Window"),
    new Emoji("\u{1FAA0}", "Plunger"),
    new Emoji("\u{1FAA1}", "Sewing Needle"),
    new Emoji("\u{1FAA2}", "Knot"),
    new Emoji("\u{1FAA3}", "Bucket"),
    new Emoji("\u{1FAA4}", "Mouse Trap"),
    new Emoji("\u{1FAA5}", "Toothbrush"),
    new Emoji("\u{1FAA6}", "Headstone"),
    new Emoji("\u{1FAA7}", "Placard"),
    new Emoji("\u{1F397}\u{FE0F}", "Reminder Ribbon"),
];
const activities = [
    new Emoji("\u{1F39E}\u{FE0F}", "Film Frames"),
    new Emoji("\u{1F39F}\u{FE0F}", "Admission Tickets"),
    new Emoji("\u{1F3A0}", "Carousel Horse"),
    new Emoji("\u{1F3A1}", "Ferris Wheel"),
    new Emoji("\u{1F3A2}", "Roller Coaster"),
    new Emoji("\u{1F3A8}", "Artist Palette"),
    new Emoji("\u{1F3AA}", "Circus Tent"),
    new Emoji("\u{1F3AB}", "Ticket"),
    new Emoji("\u{1F3AC}", "Clapper Board"),
    new Emoji("\u{1F3AD}", "Performing Arts"),
];
const travel = [
    new Emoji("\u{1F3F7}\u{FE0F}", "Label"),
    new Emoji("\u{1F30B}", "Volcano"),
    new Emoji("\u{1F3D4}\u{FE0F}", "Snow-Capped Mountain"),
    new Emoji("\u{26F0}\u{FE0F}", "Mountain"),
    new Emoji("\u{1F3D5}\u{FE0F}", "Camping"),
    new Emoji("\u{1F3D6}\u{FE0F}", "Beach with Umbrella"),
    new Emoji("\u{26F1}\u{FE0F}", "Umbrella on Ground"),
    new Emoji("\u{1F3EF}", "Japanese Castle"),
    new Emoji("\u{1F463}", "Footprints"),
    new Emoji("\u{1F5FB}", "Mount Fuji"),
    new Emoji("\u{1F5FC}", "Tokyo Tower"),
    new Emoji("\u{1F5FD}", "Statue of Liberty"),
    new Emoji("\u{1F5FE}", "Map of Japan"),
    new Emoji("\u{1F5FF}", "Moai"),
    new Emoji("\u{1F6CE}\u{FE0F}", "Bellhop Bell"),
    new Emoji("\u{1F9F3}", "Luggage"),
    new Emoji("\u{26F3}", "Flag in Hole"),
    new Emoji("\u{26FA}", "Tent"),
    new Emoji("\u{2668}\u{FE0F}", "Hot Springs"),
];
const medieval = [
    new Emoji("\u{1F3F0}", "Castle"),
    new Emoji("\u{1F3F9}", "Bow and Arrow"),
    new Emoji("\u{1F451}", "Crown"),
    new Emoji("\u{1F531}", "Trident Emblem"),
    new Emoji("\u{1F5E1}\u{FE0F}", "Dagger"),
    new Emoji("\u{1F6E1}\u{FE0F}", "Shield"),
    new Emoji("\u{1F52E}", "Crystal Ball"),
    new Emoji("\u{1FA84}", "Magic Wand"),
    new Emoji("\u{2694}\u{FE0F}", "Crossed Swords"),
    new Emoji("\u{269C}\u{FE0F}", "Fleur-de-lis"),
    new Emoji("\u{1FA96}", "Military Helmet")
];

const doubleExclamationMark = new Emoji("\u{203C}\u{FE0F}", "Double Exclamation Mark");
const interrobang = new Emoji("\u{2049}\u{FE0F}", "Exclamation Question Mark");
const information = new Emoji("\u{2139}\u{FE0F}", "Information");
const circledM = new Emoji("\u{24C2}\u{FE0F}", "Circled M");
const checkMarkButton = new Emoji("\u{2705}", "Check Mark Button");
const checkMark = new Emoji("\u{2714}\u{FE0F}", "Check Mark");
const eightSpokedAsterisk = new Emoji("\u{2733}\u{FE0F}", "Eight-Spoked Asterisk");
const crossMark = new Emoji("\u{274C}", "Cross Mark");
const crossMarkButton = new Emoji("\u{274E}", "Cross Mark Button");
const questionMark = new Emoji("\u{2753}", "Question Mark");
const whiteQuestionMark = new Emoji("\u{2754}", "White Question Mark");
const whiteExclamationMark = new Emoji("\u{2755}", "White Exclamation Mark");
const exclamationMark = new Emoji("\u{2757}", "Exclamation Mark");
const curlyLoop = new Emoji("\u{27B0}", "Curly Loop");
const doubleCurlyLoop = new Emoji("\u{27BF}", "Double Curly Loop");
const wavyDash = new Emoji("\u{3030}\u{FE0F}", "Wavy Dash");
const partAlternationMark = new Emoji("\u{303D}\u{FE0F}", "Part Alternation Mark");
const tradeMark = new Emoji("\u{2122}\u{FE0F}", "Trade Mark");
const copyright = new Emoji("\u{A9}\u{FE0F}", "Copyright");
const registered = new Emoji("\u{AE}\u{FE0F}", "Registered");
const marks = [
    doubleExclamationMark,
    interrobang,
    information,
    circledM,
    checkMarkButton,
    checkMark,
    eightSpokedAsterisk,
    crossMark,
    crossMarkButton,
    questionMark,
    whiteQuestionMark,
    whiteExclamationMark,
    exclamationMark,
    curlyLoop,
    doubleCurlyLoop,
    wavyDash,
    partAlternationMark,
    tradeMark,
    copyright,
    registered,
];

const textStyle = new Emoji("\u{FE0E}", "Variation Selector-15: text style");
const emojiStyle = new Emoji("\u{FE0F}", "Variation Selector-16: emoji style");
const zeroWidthJoiner = new Emoji("\u{200D}", "Zero Width Joiner");
const combiningClosingKeycap = new Emoji("\u{20E3}", "Combining Enclosing Keycap");
const combiners = [
    textStyle,
    emojiStyle,
    zeroWidthJoiner,
    combiningClosingKeycap,
];
const allIcons = {
    faces,
    love,
    cartoon,
    hands,
    bodyParts,
    sex,
    people,
    gestures,
    activity,
    roles,
    fantasy,
    sports,
    personResting,
    otherPeople,
    skinTones,
    hairColors,
    animals,
    plants,
    food,
    sweets,
    drinks,
    utensils,
    nations,
    flags,
    vehicles,
    bloodTypes,
    regions,
    japanese,
    time,
    clocks,
    arrows,
    shapes,
    mediaPlayer,
    zodiac,
    chess,
    numbers,
    tags,
    math,
    games,
    sportsEquipment,
    clothing,
    town,
    buttons,
    music,
    weather,
    astro,
    finance,
    writing,
    science,
    tech,
    mail,
    celebration,
    tools,
    office,
    signs,
    religion,
    household,
    activities,
    travel,
    medieval,
    marks,
    combiners
};

const headerStyle = style({
    textDecoration: "none",
    color: "black",
    textTransform: "capitalize"
}),
    buttonStyle = style({
        fontSize: "200%",
        width: "2em",
        fontFamily: systemFamily
    }),
    cancelEvt = new Event("emojiCanceled");

class EmojiForm extends FormDialog {
    constructor() {
        super("emoji", "Emoji");

        this.header.append(
            H2("Recent"),
            this.recent = P("(None)"));

        const previousEmoji = [],
            allAlts = [];

        let selectedEmoji = null,
            idCounter = 0;

        const closeAll = () => {
            for (let alt of allAlts) {
                alt.hide();
            }
        };

        function combine(a, b) {
            let left = a.value;

            let idx = left.indexOf(emojiStyle.value);
            if (idx === -1) {
                idx = left.indexOf(textStyle.value);
            }
            if (idx >= 0) {
                left = left.substring(0, idx);
            }

            return {
                value: left + b.value,
                desc: a.desc + "/" + b.desc
            };
        }

        const addIconsToContainer = (group, container, isAlts) => {
            group = group.alts || group;
            for (let icon of group) {
                const g = isAlts ? UL() : Span(),
                    btn = Button(
                        title(icon.desc),
                        buttonStyle,
                        onClick((evt) => {
                            selectedEmoji = selectedEmoji && evt.ctrlKey
                                ? combine(selectedEmoji, icon)
                                : icon;
                            this.preview.innerHTML = `${selectedEmoji.value} - ${selectedEmoji.desc}`;
                            this.confirmButton.unlock();

                            if (!!alts) {
                                alts.toggleOpen();
                                btn.innerHTML = icon.value + (alts.isOpen() ? "-" : "+");
                            }
                        }), icon.value);

                let alts = null;

                if (isAlts) {
                    btn.id = `emoji-with-alt-${idCounter++}`;
                    g.appendChild(LI(btn,
                        Label(htmlFor(btn.id),
                            icon.desc)));
                }
                else {
                    g.appendChild(btn);
                }

                if (!!icon.alts) {
                    alts = Div();
                    allAlts.push(alts);
                    addIconsToContainer(icon.alts, alts, true);
                    alts.hide();
                    g.appendChild(alts);
                    btn.style.width = "3em";
                    btn.innerHTML += "+";
                }

                if (!!icon.width) {
                    btn.style.width = icon.width;
                }

                if (!!icon.color) {
                    btn.style.color = icon.color;
                }

                container.appendChild(g);
            }
        };

        for (let key of Object.keys(allIcons)) {
            if (key !== "combiners") {
                const header = H1(),
                    container = P(),
                    headerButton = A(
                        href("javascript:undefined"),
                        title(key),
                        headerStyle,
                        onClick(() => {
                            container.toggleOpen();
                            headerButton.innerHTML = key + (container.isOpen() ? " -" : " +");
                        }),
                        key + " -"),
                    group = allIcons[key];

                addIconsToContainer(group, container);
                header.appendChild(headerButton);
                this.content.appendChild(header);
                this.content.appendChild(container);
            }
        }

        this.footer.append(

            this.confirmButton = Button(className("confirm"),
                systemFont,
                "OK",
                onClick(() => {
                    const idx = previousEmoji.indexOf(selectedEmoji);
                    if (idx === -1) {
                        previousEmoji.push(selectedEmoji);
                        this.recent.innerHTML = "";
                        addIconsToContainer(previousEmoji, this.recent);
                    }

                    this.hide();
                    this.dispatchEvent(new EmojiSelectedEvent(selectedEmoji));
                })),

            Button(className("cancel"),
                systemFont,
                "Cancel",
                onClick(() => {
                    this.confirmButton.lock();
                    this.hide();
                    this.dispatchEvent(cancelEvt);
                })),

            this.preview = Span(style({ gridArea: "4/1/5/4" })));

        this.confirmButton.lock();

        this.isOpen = this.element.isOpen.bind(this.element);

        this.selectAsync = () => {
            return new Promise((resolve, reject) => {
                let yes = null,
                    no = null;

                const done = () => {
                    this.removeEventListener("emojiSelected", yes);
                    this.removeEventListener("emojiCanceled", no);
                };

                yes = (evt) => {
                    done();
                    try {
                        resolve(evt.emoji);
                    }
                    catch (exp) {
                        reject(exp);
                    }
                };

                no = () => {
                    done();
                    resolve(null);
                };

                this.addEventListener("emojiSelected", yes);
                this.addEventListener("emojiCanceled", no);

                closeAll();
                this.show();
            });
        };
    }
}

class EmojiSelectedEvent extends Event {
    constructor(emoji) {
        super("emojiSelected");
        this.emoji = emoji;
    }
}

function instructions() {
    return [
        Aside(
            style({
                border: "dashed 2px darkred",
                backgroundColor: "wheat",
                borderRadius: "5px",
                padding: "0.5em"
            }),
            Strong("Note: "),
            "Calla is built on top of ",
            A(
                href("https://jitsi.org"),
                target("_blank"),
                rel("noopener"),
                "Jitsi Meet"),
            ". Jitsi does not support iPhones and iPads."),
        UL(
            LI(
                Strong("Be careful in picking your room name"),
                ", if you don't want randos to join. Traffic is low right now, but you never know."),
            LI(
                "Try to ",
                Strong("pick a unique user name"),
                ". A lot of people use \"Test\" and then there are a bunch of people with the same name running around."),
            LI(
                Strong("Open the Options view"),
                " to set your avatar, or to change your microphone settings."),
            LI(
                Strong("Click on the map"),
                " to move your avatar to wherever you want. Movement is instantaneous, with a smooth animation over the transition. Your avatar will stop at walls."),
            LI(
                "Or, ",
                Strong("use the arrow keys"),
                " on your keyboard to move."),
            LI(
                Strong("Click on yourself"),
                " to open a list of Emoji. Select an Emoji to float it out into the map."),
            LI(
                Strong("Hit the E key"),
                " to re-emote with your last selected Emoji."),
            LI(
                "You can ",
                Strong("roll your mouse wheel"),
                " or ",
                Strong("pinch your touchscreen"),
                " to zoom in and out of the map view. This is useful for groups of people standing close to each other to see the detail in their Avatar."),
            LI(
                "You can ",
                Strong(" click the Pause button(⏸️)"),
                " in the upper-right corner to show the default Jitsi Meet interface, in case you need to change any settings there (the game view blocks clicks on the Jitsi Meet interface)."))];
}

class InstructionsForm extends FormDialog {

    constructor() {
        super("instructions", "Instructions");

        this.content.append(...instructions());

        this.footer.append(
            this.confirmButton = Button(
                systemFont,
                style({ gridArea: "4/2" }),
                "Close",
                onClick(() => this.hide())));
    }

    async showAsync() {
        this.show();
        await this.confirmButton.once("click");
        return false;
    }
}

const loginEvt = new Event("login"),
    defaultRooms = new Map([
        ["calla", "Calla"],
        ["island", "Island"],
        ["alxcc", "Alexandria Code & Coffee"],
        ["vurv", "Vurv"]]),
    selfs = new Map();

class LoginForm extends FormDialog {
    constructor() {
        super("login");

        const self = Object.seal({
            ready: false,
            connecting: false,
            connected: false,
            validate: () => {
                const canConnect = this.roomName.length > 0
                    && this.userName.length > 0;

                this.connectButton.setLocked(!this.ready
                    || this.connecting
                    || this.connected
                    || !canConnect);
                this.connectButton.innerHTML =
                    this.connected
                        ? "Connected"
                        : this.connecting
                            ? "Connecting..."
                            : this.ready
                                ? "Connect"
                                : "Loading...";
            }
        });

        selfs.set(this, self);

        this.roomLabel = this.element.querySelector("label[for='roomSelector']");

        this.roomSelect = SelectBox(
            "No rooms available",
            v => v,
            k => defaultRooms.get(k),
            this.element.querySelector("#roomSelector"));
        this.roomSelect.addEventListener("input", () => {
            self.validate();
        });

        this.roomInput = this.element.querySelector("#roomName");
        this.createRoomButton = this.element.querySelector("#createNewRoom");
        this.userNameInput = this.element.querySelector("#userName");
        this.connectButton = this.element.querySelector("#connect");

        this.roomInput.addEventListener("input", self.validate);
        this.userNameInput.addEventListener("input", self.validate);

        this.createRoomButton.addEventListener("click", () => {
            this.roomSelectMode = !this.roomSelectMode;
        });

        this.connectButton.addEventListener("click", () => {
            this.connecting = true;
            this.dispatchEvent(loginEvt);
        });

        this.roomSelect.emptySelectionEnabled = false;
        this.roomSelect.values = defaultRooms.keys();
        this.roomSelectMode = true;
        this.roomSelect.selectedIndex = 0;

        self.validate();
    }

    get roomSelectMode() {
        return this.roomSelect.style.display !== "none";
    }

    set roomSelectMode(value) {
        const self = selfs.get(this);
        this.roomSelect.setOpen(value);
        this.roomInput.setOpen(!value);
        this.createRoomButton.innerHTML = value
            ? "New"
            : "Cancel";

        if (value) {
            this.roomLabel.htmlFor = this.roomSelect.id;
            this.roomSelect.selectedValue = this.roomInput.value.toLocaleLowerCase();
        }
        else if (this.roomSelect.selectedIndex >= 0) {
            this.roomLabel.htmlFor = this.roomInput.id;
            this.roomInput.value = this.roomSelect.selectedValue;
        }

        self.validate();
    }

    get roomName() {
        const room = this.roomSelectMode
            ? this.roomSelect.selectedValue
            : this.roomInput.value;

        return room && room.toLocaleLowerCase() || "";
    }

    set roomName(v) {
        if (v === null
            || v === undefined
            || v.length === 0) {
            v = defaultRooms.keys().next();
        }

        this.roomInput.value = v;
        this.roomSelect.selectedValue = v;
        this.roomSelectMode = this.roomSelect.contains(v);
        selfs.get(this).validate();
    }

    set userName(value) {
        this.userNameInput.value = value;
        selfs.get(this).validate();
    }

    get userName() {
        return this.userNameInput.value;
    }

    get connectButtonText() {
        return this.connectButton.innerText
            || this.connectButton.textContent;
    }

    set connectButtonText(str) {
        this.connectButton.innerHTML = str;
    }

    get ready() {
        const self = selfs.get(this);
        return self.ready;
    }

    set ready(v) {
        const self = selfs.get(this);
        self.ready = v;
        self.validate();
    }

    get connecting() {
        const self = selfs.get(this);
        return self.connecting;
    }

    set connecting(v) {
        const self = selfs.get(this);
        self.connecting = v;
        self.validate();
    }

    get connected() {
        const self = selfs.get(this);
        return self.connected;
    }

    set connected(v) {
        const self = selfs.get(this);
        self.connected = v;
        this.connecting = false;
    }

    show() {
        this.ready = true;
        super.show();
    }
}

const gamepadStates = new Map();

class EventedGamepad extends EventTarget {
    constructor(pad) {
        super();
        if (!(pad instanceof Gamepad)) {
            throw new Error("Value must be a Gamepad");
        }

        this.id = pad.id;
        this.displayId = pad.displayId;

        this.connected = pad.connected;
        this.hand = pad.hand;
        this.pose = pad.pose;

        const self = {
            btnDownEvts: [],
            btnUpEvts: [],
            btnState: [],
            axisMaxed: [],
            axisMaxEvts: [],
            sticks: []
        };

        this.buttons = [];
        this.axes = [];
        this.hapticActuators = [];
        this.axisThresholdMax = 0.9;
        this.axisThresholdMin = 0.1;

        this._isStick = (a) => a % 2 === 0 && a < pad.axes.length - 1;

        for (let b = 0; b < pad.buttons.length; ++b) {
            self.btnDownEvts[b] = Object.assign(new Event("gamepadbuttondown"), {
                button: b
            });
            self.btnUpEvts[b] = Object.assign(new Event("gamepadbuttonup"), {
                button: b
            });
            self.btnState[b] = false;

            this.buttons[b] = pad.buttons[b];
        }

        for (let a = 0; a < pad.axes.length; ++a) {
            self.axisMaxEvts[a] = Object.assign(new Event("gamepadaxismaxed"), {
                axis: a
            });
            self.axisMaxed[a] = false;
            if (this._isStick(a)) {
                self.sticks[a / 2] = { x: 0, y: 0 };
            }

            this.axes[a] = pad.axes[a];
        }

        if (pad.hapticActuators !== undefined) {
            for (let h = 0; h < pad.hapticActuators.length; ++h) {
                this.hapticActuators[h] = pad.hapticActuators[h];
            }
        }

        Object.seal(this);
        gamepadStates.set(this, self);
    }

    dispose() {
        gamepadStates.delete(this);
    }

    _update(pad) {
        if (!(pad instanceof Gamepad)) {
            throw new Error("Value must be a Gamepad");
        }

        this.connected = pad.connected;
        this.hand = pad.hand;
        this.pose = pad.pose;

        const self = gamepadStates.get(this);

        for (let b = 0; b < pad.buttons.length; ++b) {
            const wasPressed = self.btnState[b],
                pressed = pad.buttons[b].pressed;
            if (pressed !== wasPressed) {
                self.btnState[b] = pressed;
                this.dispatchEvent((state
                    ? self.btnDownEvts
                    : self.btnUpEvts)[b]);
            }

            this.buttons[b] = pad.buttons[b];
        }

        for (let a = 0; a < pad.axes.length; ++a) {
            const wasMaxed = self.axisMaxed[a],
                maxed = pad.axes[a] >= this.axisThresholdMax,
                mined = pad.axes[a] <= this.axisThresholdMin;
            if (maxed && !wasMaxed) {
                this.dispatchEvent(self.axisMaxEvts[a]);
            }

            this.axes[a] = maxed
                ? 1
                : (mined
                    ? 0
                    : pads.axes[a]);
        }

        for (let a = 0; a < this.axes.length - 1; a += 2) {
            const stick = self.sticks[a / 2];
            stick.x = this.axes[a];
            stick.y = this.axes[a + 1];
        }

        if (pad.hapticActuators !== undefined) {
            for (let h = 0; h < pad.hapticActuators.length; ++h) {
                this.hapticActuators[h] = pad.hapticActuators[h];
            }
        }
    }
}

const gamepadConnectedEvt = Object.assign(new Event("gamepadconnected"), {
    gamepad: null
}),
    gamepadDisconnectedEvt = Object.assign(new Event("gamepaddisconnected"), {
        gamepad: null
    }),

    gamepads = new Map(),
    anyButtonDownEvt = Object.assign(new Event("gamepadbuttondown"), { button: -1 }),
    anyButtonUpEvt = Object.assign(new Event("gamepadbuttonup"), { button: -1 }),
    anyAxisMaxedEvt = Object.assign(new Event("gamepadaxismaxed"), { axis: -1 });

class GamepadStateManager extends EventTarget {
    constructor() {
        super();

        const onAnyButtonDown = (evt) => {
            anyButtonDownEvt.button = evt.button;
            this.dispatchEvent(anyButtonDownEvt);
        };

        const onAnyButtonUp = (evt) => {
            anyButtonUpEvt.button = evt.button;
            this.dispatchEvent(anyButtonUpEvt);
        };

        const onAnyAxisMaxed = (evt) => {
            anyAxisMaxedEvt.axis = evt.axis;
            this.dispatchEvent(anyAxisMaxedEvt);
        };

        window.addEventListener("gamepadconnected", (evt) => {
            const pad = evt.gamepad,
                gamepad = new EventedGamepad(pad);
            gamepad.addEventListener("gamepadbuttondown", onAnyButtonDown);
            gamepad.addEventListener("gamepadbuttonup", onAnyButtonUp);
            gamepad.addEventListener("gamepadaxismaxed", onAnyAxisMaxed);
            gamepads.set(pad.id, gamepad);
            gamepadConnectedEvt.gamepad = gamepad;
            this.dispatchEvent(gamepadConnectedEvt);
        });

        window.addEventListener("gamepaddisconnected", (evt) => {
            const id = evt.gamepad.id,
                gamepad = gamepads.get(id);
            gamepads.delete(id);
            gamepad.removeEventListener("gamepadbuttondown", onAnyButtonDown);
            gamepad.removeEventListener("gamepadbuttonup", onAnyButtonUp);
            gamepad.removeEventListener("gamepadaxismaxed", onAnyAxisMaxed);
            gamepadDisconnectedEvt.gamepad = gamepad;
            this.dispatchEvent(gamepadDisconnectedEvt);
            gamepad.dispose();
        });

        Object.freeze(this);
    }

    get gamepadIDs() {
        return [...gamepads.keys()];
    }

    get gamepads() {
        return [...gamepads.values()];
    }

    get(id) {
        return gamepads.get(id);
    }
}

const GamepadManager = new GamepadStateManager();


function update() {
    requestAnimationFrame(update);
    const pads = navigator.getGamepads();
    for (let pad of pads) {
        if (pad !== null
            && gamepads.has(pad.id)) {
            const gamepad = gamepads.get(pad.id);
            gamepad.update(pad);
        }
    }
}

requestAnimationFrame(update);

const inputBindingChangedEvt = new Event("inputBindingChanged");

class InputBinding extends EventTarget {
    constructor() {
        super();

        const bindings = new Map([
            ["keyButtonUp", "ArrowUp"],
            ["keyButtonDown", "ArrowDown"],
            ["keyButtonLeft", "ArrowLeft"],
            ["keyButtonRight", "ArrowRight"],
            ["keyButtonEmote", "e"],
            ["keyButtonToggleAudio", "a"],

            ["gpButtonUp", 12],
            ["gpButtonDown", 13],
            ["gpButtonLeft", 14],
            ["gpButtonRight", 15],
            ["gpButtonEmote", 0],
            ["gpButtonToggleAudio", 1]
        ]);

        for (let id of bindings.keys()) {
            Object.defineProperty(this, id, {
                get: () => bindings.get(id),
                set: (v) => {
                    if (bindings.has(id)
                        && v !== bindings.get(id)) {
                        bindings.set(id, v);
                        this.dispatchEvent(inputBindingChangedEvt);
                    }
                }
            });
        }

        this.clone = () => {
            const c = {};
            for (let kp of bindings.entries()) {
                c[kp[0]] = kp[1];
            }
            return c;
        };

        Object.freeze(this);
    }
}

const keyWidthStyle = style({ width: "7em" }),
    numberWidthStyle = style({ width: "3em" }),
    avatarUrlChangedEvt = new Event("avatarURLChanged"),
    gamepadChangedEvt = new Event("gamepadChanged"),
    selectAvatarEvt = new Event("selectAvatar"),
    fontSizeChangedEvt = new Event("fontSizeChanged"),
    inputBindingChangedEvt$1 = new Event("inputBindingChanged"),
    audioPropsChangedEvt = new Event("audioPropertiesChanged"),
    toggleDrawHearingEvt = new Event("toggleDrawHearing"),
    toggleVideoEvt = new Event("toggleVideo"),
    audioInputChangedEvt = new Event("audioInputChanged"),
    audioOutputChangedEvt = new Event("audioOutputChanged"),
    videoInputChangedEvt = new Event("videoInputChanged"),
    selfs$1 = new Map();

class OptionsForm extends FormDialog {
    constructor() {
        super("options", "Options");

        const _ = (evt) => () => this.dispatchEvent(evt);

        const self = {
            inputBinding: new InputBinding()
        };

        selfs$1.set(this, self);

        const audioPropsChanged = onInput(_(audioPropsChangedEvt));

        const makeKeyboardBinder = (id, label) => {
            const key = LabeledInput(
                id,
                "text",
                label,
                keyWidthStyle,
                onKeyUp((evt) => {
                    if (evt.key !== "Tab"
                        && evt.key !== "Shift") {
                        key.value
                            = self.inputBinding[id]
                            = evt.key;
                        this.dispatchEvent(inputBindingChangedEvt$1);
                    }
                }));
            key.value = self.inputBinding[id];
            return key;
        };

        const makeGamepadBinder = (id, label) => {
            const gp = LabeledInput(
                id,
                "text",
                label,
                numberWidthStyle);
            GamepadManager.addEventListener("gamepadbuttonup", (evt) => {
                if (document.activeElement === gp) {
                    gp.value
                        = self.inputBinding[id]
                        = evt.button;
                    this.dispatchEvent(inputBindingChangedEvt$1);
                }
            });
            gp.value = self.inputBinding[id];
            return gp;
        };

        const panels = [
            OptionPanel("avatar", "Avatar",
                this.avatarURLInput = LabeledInput(
                    "avatarURL",
                    "text",
                    "Avatar URL: ",
                    placeHolder("https://example.com/me.png"),
                    onInput(_(avatarUrlChangedEvt))),
                " or ",
                this.avatarEmojiInput = Div(
                    Label(
                        htmlFor("selectAvatarEmoji"),
                        "Avatar Emoji: "),
                    this.avatarEmojiPreview = Span(bust.value),
                    Button(
                        id("selectAvatarEmoji"),
                        "Select",
                        onClick(_(selectAvatarEvt))))),

            OptionPanel("interface", "Interface",
                this.fontSizeInput = LabeledInput(
                    "fontSize",
                    "number",
                    "Font size: ",
                    value(10),
                    min(5),
                    max(32),
                    style({ width: "3em" }),
                    onInput(_(fontSizeChangedEvt)))),

            OptionPanel("keyboard", "Keyboard",
                this.keyButtonUp = makeKeyboardBinder("keyButtonUp", "Up: "),
                this.keyButtonDown = makeKeyboardBinder("keyButtonDown", "Down: "),
                this.keyButtonLeft = makeKeyboardBinder("keyButtonLeft", "Left: "),
                this.keyButtonRight = makeKeyboardBinder("keyButtonRight", "Right: "),
                this.keyButtonEmote = makeKeyboardBinder("keyButtonEmote", "Emote: "),
                this.keyButtonToggleAudio = makeKeyboardBinder("keyButtonToggleAudio", "Toggle audio: ")),

            OptionPanel("gamepad", "Gamepad",
                this.gpSelect = LabeledSelectBox(
                    "gamepads",
                    "Use gamepad: ",
                    "No gamepad",
                    gp => gp.id,
                    gp => gp.id,
                    onInput(_(gamepadChangedEvt))),
                this.gpButtonUp = makeGamepadBinder("gpButtonUp", "Up: "),
                this.gpButtonDown = makeGamepadBinder("gpButtonDown", "Down: "),
                this.gpButtonLeft = makeGamepadBinder("gpButtonLeft", "Left: "),
                this.gpButtonRight = makeGamepadBinder("gpButtonRight", "Right: "),
                this.gpButtonEmote = makeGamepadBinder("gpButtonEmote", "Emote: "),
                this.gpButtonToggleAudio = makeGamepadBinder("gpButtonToggleAudio", "Toggle audio: ")),

            OptionPanel("audio", "Audio",
                P(
                    this.audioInputSelect = LabeledSelectBox(
                        "audioInputDevices",
                        "Input: ",
                        "No audio input",
                        d => d.deviceId,
                        d => d.label,
                        onInput(_(audioInputChangedEvt)))),
                P(
                    this.audioOutputSelect = LabeledSelectBox(
                        "audioOutputDevices",
                        "Output: ",
                        "No audio output",
                        d => d.deviceId,
                        d => d.label,
                        onInput(_(audioOutputChangedEvt)))),
                P(
                    this.drawHearingCheck = LabeledInput(
                        "drawHearing",
                        "checkbox",
                        "Draw hearing range: ",
                        onInput(() => {
                            this.drawHearing = !this.drawHearing;
                            this.dispatchEvent(toggleDrawHearingEvt);
                        })),
                    this.audioMinInput = LabeledInput(
                        "minAudio",
                        "number",
                        "Min: ",
                        value(1),
                        min(0),
                        max(100),
                        numberWidthStyle,
                        audioPropsChanged),
                    this.audioMaxInput = LabeledInput(
                        "maxAudio",
                        "number",
                        "Min: ",
                        value(10),
                        min(0),
                        max(100),
                        numberWidthStyle,
                        audioPropsChanged),
                    this.audioRolloffInput = LabeledInput(
                        "rollof",
                        "number",
                        "Rollof: ",
                        value(1),
                        min(0.1),
                        max(10),
                        step(0.1),
                        numberWidthStyle,
                        audioPropsChanged))),

            OptionPanel("video", "Video",
                P(
                    this.enableVideo = Button(
                        accessKey("v"),
                        "Enable video",
                        onClick(_(toggleVideoEvt)))),
                P(
                    this.videoInputSelect = LabeledSelectBox(
                        "videoInputDevices",
                        "Device: ",
                        "No video input",
                        d => d.deviceId,
                        d => d.label,
                        onInput(_(videoInputChangedEvt)))))
        ];

        const cols = [];
        for (let i = 0; i < panels.length; ++i) {
            cols[i] = "1fr";
            panels[i].element.style.gridColumnStart = i + 1;
        }

        Object.assign(this.header.style, {
            display: "grid",
            gridTemplateColumns: cols.join(" ")
        });

        this.header.append(...panels.map(p => p.button));
        this.content.append(...panels.map(p => p.element));
        this.footer.append(
            this.confirmButton = Button(
                className("confirm"),
                systemFont,
                "Close",
                onClick(() => this.hide())));

        const showPanel = (p) =>
            () => {
                for (let i = 0; i < panels.length; ++i) {
                    panels[i].visible = i === p;
                }
            };

        for (let i = 0; i < panels.length; ++i) {
            panels[i].visible = i === 0;
            panels[i].addEventListener("select", showPanel(i));
        }

        self.inputBinding.addEventListener("inputBindingChanged", () => {
            for (let id of Object.getOwnPropertyNames(self.inputBinding)) {
                if (value[id] !== undefined
                    && this[id] != undefined) {
                    this[id].value = value[id];
                }
            }
        });

        this.gamepads = [];
        this.audioInputDevices = [];
        this.audioOutputDevices = [];
        this.videoInputDevices = [];

        this._videoEnabled = false;
        this._drawHearing = false;
        this._avatarEmoji = null;

        Object.seal(this);
    }

    get avatarEmoji() {
        return this._avatarEmoji;
    }

    set avatarEmoji(e) {
        this._avatarEmoji = e;
        clear(this.avatarEmojiPreview);
        this.avatarEmojiPreview.append(Span(
            title(e && e.desc || "(None)"),
            e && e.value || "N/A"));
    }

    get avatarURL() {
        return this.avatarURLInput.value;
    }

    set avatarURL(value) {
        this.avatarURLInput.value = value;
    }

    async showAsync() {
        this.show();
        await this.confirmButton.once("click");
    }

    get inputBinding() {
        const self = selfs$1.get(this);
        return self.inputBinding.clone();
    }

    set inputBinding(value) {
        const self = selfs$1.get(this);
        for (let id of Object.getOwnPropertyNames(value)) {
            if (self.inputBinding[id] !== undefined
                && value[id] !== undefined
                && this[id] != undefined) {
                self.inputBinding[id]
                    = this[id].value
                    = value[id];
            }
        }
    }

    get gamepads() {
        return this.gpSelect.values;
    }

    set gamepads(values) {
        this.gpSelect.values = values;
    }

    get audioInputDevices() {
        return this.audioInputSelect.values;
    }

    set audioInputDevices(values) {
        this.audioInputSelect.values = values;
    }

    get currentAudioInputDevice() {
        return this.audioInputSelect.selectedValue;
    }

    set currentAudioInputDevice(value) {
        this.audioInputSelect.selectedValue = value;
    }


    get audioOutputDevices() {
        return this.audioOutputSelect.values;
    }

    set audioOutputDevices(values) {
        this.audioOutputSelect.values = values;
    }

    get currentAudioOutputDevice() {
        return this.audioOutputSelect.selectedValue;
    }

    set currentAudioOutputDevice(value) {
        this.audioOutputSelect.selectedValue = value;
    }


    get videoInputDevices() {
        return this.videoInputSelect.values;
    }

    set videoInputDevices(values) {
        this.videoInputSelect.values = values;
    }

    get currentVideoInputDevice() {
        return this.videoInputSelect.selectedValue;
    }

    set currentVideoInputDevice(value) {
        this.videoInputSelect.selectedValue = value;
    }


    get videoEnabled() {
        return this._videoEnabled;
    }

    set videoEnabled(value) {
        this._videoEnabled = value;
        this.enableVideo.innerHTML = value
            ? "Disable video"
            : "Enable video";
    }

    get gamepads() {
        return this.gpSelect.getValues();
    }

    set gamepads(values) {
        const disable = values.length === 0;
        this.gpSelect.values = values;
        this.gpButtonUp.setLocked(disable);
        this.gpButtonDown.setLocked(disable);
        this.gpButtonLeft.setLocked(disable);
        this.gpButtonRight.setLocked(disable);
        this.gpButtonEmote.setLocked(disable);
        this.gpButtonToggleAudio.setLocked(disable);
    }

    get gamepadIndex() {
        return this.gpSelect.selectedIndex;
    }

    set gamepadIndex(value) {
        this.gpSelect.selectedIndex = value;
    }

    get drawHearing() {
        return this._drawHearing;
    }

    set drawHearing(value) {
        this._drawHearing = value;
        this.drawHearingCheck.checked = value;
    }

    get audioDistanceMin() {
        const value = parseFloat(this.audioMinInput.value);
        if (isGoodNumber(value)) {
            return value;
        }
        else {
            return 1;
        }
    }

    set audioDistanceMin(value) {
        if (isGoodNumber(value)
            && value > 0) {
            this.audioMinInput.value = value;
            if (this.audioDistanceMin > this.audioDistanceMax) {
                this.audioDistanceMax = this.audioDistanceMin;
            }
        }
    }


    get audioDistanceMax() {
        const value = parseFloat(this.audioMaxInput.value);
        if (isGoodNumber(value)) {
            return value;
        }
        else {
            return 10;
        }
    }

    set audioDistanceMax(value) {
        if (isGoodNumber(value)
            && value > 0) {
            this.audioMaxInput.value = value;
            if (this.audioDistanceMin > this.audioDistanceMax) {
                this.audioDistanceMin = this.audioDistanceMax;
            }
        }
    }


    get audioRolloff() {
        const value = parseFloat(this.audioRolloffInput.value);
        if (isGoodNumber(value)) {
            return value;
        }
        else {
            return 1;
        }
    }

    set audioRolloff(value) {
        if (isGoodNumber(value)
            && value > 0) {
            this.audioRolloffInput.value = value;
        }
    }


    get fontSize() {
        const value = parseFloat(this.fontSizeInput.value);
        if (isGoodNumber(value)) {
            return value;
        }
        else {
            return 16;
        }
    }

    set fontSize(value) {
        if (isGoodNumber(value)
            && value > 0) {
            this.fontSizeInput.value = value;
        }
    }
}

function Run(txt) {
    return Span(
        style({ margin: "auto" }),
        txt);
}

const toggleAudioEvt = new Event("toggleAudio"),
    emoteEvt = new Event("emote"),
    selectEmojiEvt = new Event("selectEmoji"),
    zoomChangedEvt = new Event("zoomChanged"),
    toggleOptionsEvt = new Event("toggleOptions"),
    tweetEvt = new Event("tweet"),
    leaveEvt = new Event("leave"),
    toggleUIEvt = new Event("toggleUI"),
    toggleInstructionsEvt = new Event("toggleInstructions"),
    subelStyle = style({
        display: "inline-flex",
        margin: "0 0.5em 0 0"
    });

class ToolBar extends EventTarget {
    constructor() {
        super();

        const _ = (evt) => () => this.dispatchEvent(evt);

        this.element = Div(
            id("toolbar"),
            style({
                position: "fixed",
                top: 0,
                right: 0,
                backgroundColor: "#bbb",
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap"
            }),

            this.toolbar = Div(
                style({
                    display: "flex",
                    width: "100vw",
                    padding: "4px",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    boxSizing: "border-box"
                }),
                systemFont,

                this.muteAudioButton = Button(
                    onClick(_(toggleAudioEvt)),
                    subelStyle,
                    systemFont,
                    speakerHighVolume.value),

                this.emojiControl = Span(
                    subelStyle,
                    this.emoteButton = Button(
                        title("Emote"),
                        onClick(_(emoteEvt)),
                        systemFont,
                        "Emote ",
                        KBD("(E)"),
                        "(@)"),
                    Button(
                        title("Select Emoji"),
                        systemFont,
                        onClick(_(selectEmojiEvt)),
                        downwardsButton.value)),

                Span(
                    subelStyle,
                    Label(
                        htmlFor("zoom"),
                        style({ margin: "auto" }),
                        "Zoom"),
                    this.zoomSpinner = Input(
                        type("number"),
                        id("zoom"),
                        title("Change map zoom"),
                        value(2),
                        min(0.1),
                        max(8),
                        step(0.1),
                        style({ width: "4em" }),
                        systemFont,
                        onInput(_(zoomChangedEvt)))),

                this.optionsButton = Button(
                    title("Show/hide options"),
                    onClick(_(toggleOptionsEvt)),
                    subelStyle,
                    systemFont,
                    gear.value),

                this.instructionsButton = Button(
                    title("Show/hide instructions"),
                    onClick(_(toggleInstructionsEvt)),
                    subelStyle,
                    systemFont,
                    questionMark.value),

                Button(
                    title("Share your current room to twitter"),
                    onClick(_(tweetEvt)),
                    subelStyle,
                    systemFont,
                    Run("Share room"),
                    Img(src("https://cdn2.iconfinder.com/data/icons/minimalism/512/twitter.png"),
                        alt("icon"),
                        role("presentation"),
                        style({ height: "1.5em" }))),

                Button(
                    title("Leave the room"),
                    onClick(_(leaveEvt)),
                    subelStyle,
                    systemFont,
                    style({ marginLeft: "1em" }),
                    Run("Leave"))),

            this.hideButton = Button(
                title("Show/hide Jitsi Meet interface"),
                style({
                    position: "absolute",
                    right: 0,
                    margin: "4px"
                }),
                systemFont,
                onClick(() => this.visible = !this.visible),
                Run(pauseButton.value)));

        this._audioEnabled = true;

        Object.seal(this);
    }

    get offsetHeight() {
        return this.toolbar.offsetHeight;
    }

    get zoom() {
        return this.zoomSpinner.value;
    }

    set zoom(value) {
        this.zoomSpinner.value = Math.round(value * 100) / 100;
    }

    get visible() {
        return this.toolbar.style.display !== "none";
    }

    set visible(value) {
        this.toolbar.setOpenWithLabel(
            value,
            this.hideButton,
            pauseButton.value,
            playButton.value);
        this.dispatchEvent(toggleUIEvt);
    }

    hide() {
        this.visible = false;
    }

    show() {
        this.visible = true;
    }

    get audioEnabled() {
        return this._audioEnabled;
    }

    set audioEnabled(value) {
        this._audioEnabled = value;
        this.muteAudioButton.updateLabel(
            value,
            speakerHighVolume.value,
            mutedSpeaker.value);
    }

    appendChild(child) {
        return this.toolbar.appendChild(child);
    }

    insertBefore(newChild, refChild) {
        return this.toolbar.insertBefore(newChild, refChild);
    }

    append(...children) {
        this.toolbar.append(...children);
    }

    setEmojiButton(key, emoji) {
        this.emoteButton.innerHTML = `Emote (<kbd>${key.toUpperCase()}</kbd>) (${emoji.value})`;
    }
}

const EMOJI_LIFE = 2;

class Emote {
    constructor(emoji, x, y) {
        this.emoji = emoji;
        this.x = x;
        this.y = y;
        this.dx = Math.random() - 0.5;
        this.dy = -Math.random() * 0.5 - 0.5;
        this.life = 1;
        this.width = -1;
    }

    isDead() {
        return this.life <= 0;
    }

    update(dt) {
        this.life -= dt / EMOJI_LIFE;
        this.dx *= 0.99;
        this.dy *= 0.99;
        this.x += this.dx * dt;
        this.y += this.dy * dt;
    }

    drawShadow(g, map, cameraZ) {
        g.save();
        {
            g.shadowColor = "rgba(0, 0, 0, 0.5)";
            g.shadowOffsetX = 3 * cameraZ;
            g.shadowOffsetY = 3 * cameraZ;
            g.shadowBlur = 3 * cameraZ;

            this.drawEmote(g, map);
        }
        g.restore();
    }

    drawEmote(g, map) {
        g.fillStyle = `rgba(0, 0, 0, ${this.life})`;
        g.font = map.tileHeight / 2 + "px sans-serif";
        if (this.width === -1) {
            const metrics = g.measureText(this.emoji.value);
            this.width = metrics.width;
        }

        g.fillText(
            this.emoji.value,
            this.x * map.tileWidth - this.width / 2,
            this.y * map.tileHeight);
    }
}

class TileSet {
    constructor(url) {
        this.url = url;
        this.tileWidth = 0;
        this.tileHeight = 0;
        this.tilesPerRow = 0;
        this.image = new Image();
        this.collision = {};
    }

    async load() {
        const response = await fetch(this.url),
            tileset = await response.xml(),
            imageLoad = new Promise((resolve, reject) => {
                this.image.addEventListener("load", (evt) => {
                    this.tilesPerRow = Math.floor(this.image.width / this.tileWidth);
                    resolve();
                });
                this.image.addEventListener("error", reject);
            }),
            image = tileset.querySelector("image"),
            imageSource = image.getAttribute("source"),
            imageURL = new URL(imageSource, this.url),
            tiles = tileset.querySelectorAll("tile");

        for (let tile of tiles) {
            const id = 1 * tile.getAttribute("id"),
                collid = tile.querySelector("properties > property[name='Collision']"),
                value = collid.getAttribute("value");
            this.collision[id] = value === "true";
        }

        this.name = tileset.getAttribute("name");
        this.tileWidth = 1 * tileset.getAttribute("tilewidth");
        this.tileHeight = 1 * tileset.getAttribute("tileheight");
        this.tileCount = 1 * tileset.getAttribute("tilecount");
        this.image.src = imageURL.href;
        await imageLoad;
    }

    isClear(tile) {
        return !this.collision[tile - 1];
    }

    draw(g, tile, x, y) {
        if (tile > 0) {
            const idx = tile - 1,
                sx = this.tileWidth * (idx % this.tilesPerRow),
                sy = this.tileHeight * Math.floor(idx / this.tilesPerRow),
                dx = x * this.tileWidth,
                dy = y * this.tileHeight;

            g.drawImage(this.image,
                sx, sy, this.tileWidth, this.tileHeight,
                dx, dy, this.tileWidth, this.tileHeight);
        }
    }
}

// TODO: move map data to requestable files
class TileMap {
    constructor(tilemapName) {
        this.url = new URL(`/data/tilemaps/${tilemapName}.tmx`, document.location);
        this.tileset = null;
        this.tileWidth = 0;
        this.tileHeight = 0;
        this.layers = 0;
        this.width = 0;
        this.height = 0;
        this.offsetX = 0;
        this.offsetY = 0;
        this.tiles = null;
        this.collision = null;
    }

    async load() {
        const response = await fetch(this.url.href),
            map = await response.xml(),
            width = 1 * map.getAttribute("width"),
            height = 1 * map.getAttribute("height"),
            tileWidth = 1 * map.getAttribute("tilewidth"),
            tileHeight = 1 * map.getAttribute("tileheight"),
            tileset = map.querySelector("tileset"),
            tilesetSource = tileset.getAttribute("source"),
            layers = map.querySelectorAll("layer > data");

        this.layers = layers.length;
        this.width = width;
        this.height = height;
        this.offsetX = -Math.floor(width / 2);
        this.offsetY = -Math.floor(height / 2);
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;

        this.tiles = [];
        for (let layer of layers) {
            const tileIds = layer.innerHTML
                    .replace(" ", "")
                    .replace("\t", "")
                    .replace("\n", "")
                    .replace("\r", "")
                    .split(","),
                rows = [];
            let row = [];
            for (let tile of tileIds) {
                row.push(tile);
                if (row.length === width) {
                    rows.push(row);
                    row = [];
                }
            }
            if (row.length > 0) {
                rows.push(row);
            }
            this.tiles.push(rows);
        }

        this.tileset = new TileSet(new URL(tilesetSource, this.url));
        await this.tileset.load();
        this.tileWidth = this.tileset.tileWidth;
        this.tileHeight = this.tileset.tileHeight;
    }

    draw(g) {
        g.save();
        {
            g.translate(this.offsetX * this.tileWidth, this.offsetY * this.tileHeight);
            for (let l = 0; l < this.layers; ++l) {
                const layer = this.tiles[l];
                for (let y = 0; y < this.height; ++y) {
                    const row = layer[y];
                    for (let x = 0; x < this.width; ++x) {
                        const tile = row[x];
                        this.tileset.draw(g, tile, x, y);
                    }
                }
            }
        }
        g.restore();
    }

    isClear(x, y, avatar) {
        x -= this.offsetX;
        y -= this.offsetY;
        return x < 0 || this.width <= x
            || y < 0 || this.height <= y
            || this.tileset.isClear(this.tiles[0][y][x])
            || isSurfer(avatar.value);
    }

    // Use Bresenham's line algorithm (with integer error)
    // to draw a line through the map, cutting it off if
    // it hits a wall.
    getClearTile(x, y, dx, dy, avatar) {
        const x1 = x + dx,
            y1 = y + dy,
            sx = x < x1 ? 1 : -1,
            sy = y < y1 ? 1 : -1;

        dx = Math.abs(x1 - x);
        dy = Math.abs(y1 - y);

        let err = (dx > dy ? dx : -dy) / 2;

        while (x !== x1
            || y !== y1) {
            const e2 = err;
            if (e2 > -dx) {
                if (this.isClear(x + sx, y, avatar)) {
                    err -= dy;
                    x += sx;
                }
                else {
                    break;
                }
            }
            if (e2 < dy) {
                if (this.isClear(x, y + sy, avatar)) {
                    err += dx;
                    y += sy;
                }
                else {
                    break;
                }
            }
        }

        return { x, y };
    }
}

const POSITION_REQUEST_DEBOUNCE_TIME = 1000,
    STACKED_USER_OFFSET_X = 5,
    STACKED_USER_OFFSET_Y = 5,
    MOVE_TRANSITION_TIME = 0.5,
    eventNames = ["userMoved", "userPositionNeeded"];

class User extends EventTarget {
    constructor(id, displayName, isMe) {
        super();

        this.id = id;

        this.x = 0;
        this.y = 0;
        this.avatarEmoji = (isMe ? randomPerson() : bust);

        this.displayName = displayName || id;
        this.audioMuted = false;
        this.videoMuted = true;
        this.sx = 0;
        this.sy = 0;
        this.tx = 0;
        this.ty = 0;
        this.dx = 0;
        this.dy = 0;
        this.dist = 0;
        this.t = 0;
        this.distXToMe = 0;
        this.distYToMe = 0;
        this.isMe = isMe;
        this.isActive = false;
        this.avatarImage = null;
        this.avatarURL = null;
        this.stackUserCount = 1;
        this.stackIndex = 0;
        this.stackAvatarHeight = 0;
        this.stackAvatarWidth = 0;
        this.stackOffsetX = 0;
        this.stackOffsetY = 0;
        this.isInitialized = isMe;
        this.lastPositionRequestTime = Date.now() - POSITION_REQUEST_DEBOUNCE_TIME;
        this.moveEvent = new UserMoveEvent(this.id);
        this.visible = true;
    }

    init(evt) {
        this.sx
            = this.tx
            = this.x
            = evt.x;
        this.sy
            = this.ty
            = this.y
            = evt.y;
        this.displayName = evt.displayName;
        this.avatarURL = evt.avatarURL;
        if (!this.avatarURL && !!this.avatarImage) {
            this.avatarImage = null;
        }

        this.avatarEmoji = evt._avatarEmoji;
        this.isInitialized = true;
    }

    get avatarEmoji() {
        return this._avatarEmoji;
    }

    set avatarEmoji(emoji) {
        this._avatarEmoji = emoji;
        this.avatarEmojiMetrics = null;
        if (!!emoji) {
            this.setAvatarURL("");
        }
    }


    addEventListener(evtName, func, opts) {
        if (eventNames.indexOf(evtName) === -1) {
            throw new Error(`Unrecognized event type: ${evtName}`);
        }

        super.addEventListener(evtName, func, opts);
    }

    setAvatarURL(url) {
        if (url !== null
            && url !== undefined) {

            if (url.length === 0) {
                this.avatarURL = null;
                this.avatarImage = null;
            }
            else {
                this.avatarURL = url;
                const img = new Image();
                img.addEventListener("load", (evt) => {
                    this.avatarImage = Canvas(
                        width(img.width),
                        height(img.height));
                    const g = this.avatarImage.getContext("2d");
                    g.clearRect(0, 0, img.width, img.height);
                    g.imageSmoothingEnabled = false;
                    g.drawImage(img, 0, 0);
                });
                img.src = url;
            }
        }
    }

    setDisplayName(name) {
        this.displayName = name || this.id;
    }

    moveTo(x, y) {
        if (this.isMe) {
            if (x !== this.tx
                || y !== this.ty) {
                this.moveEvent.set(x, y);
                this.dispatchEvent(this.moveEvent);
            }
        }
        else if (!this.isInitialized) {
            this.isInitialized = true;
            this.x = x;
            this.y = y;
        }

        this.sx = this.x;
        this.sy = this.y;
        this.tx = x;
        this.ty = y;

        if (this.tx !== this.sx
            || this.ty !== this.sy) {
            this.dx = this.tx - this.sx;
            this.dy = this.ty - this.sy;
            this.dist = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
            this.t = 0;
        }
    }

    update(dt, map, userList) {
        if (this.isInitialized) {
            if (this.dist > 0) {
                this.t += dt;
                if (this.t >= MOVE_TRANSITION_TIME) {
                    this.x = this.sx = this.tx;
                    this.y = this.sy = this.ty;
                    this.t = this.dx = this.dy = this.dist = 0;
                }
                else {
                    const p = this.t / MOVE_TRANSITION_TIME,
                        s = Math.sin(Math.PI * p / 2);
                    this.x = this.sx + s * this.dx;
                    this.y = this.sy + s * this.dy;
                }
            }

            this.stackUserCount = 0;
            this.stackIndex = 0;
            for (let user of userList) {
                if (user.isInitialized
                    && user.tx === this.tx
                    && user.ty === this.ty) {
                    if (user.id === this.id) {
                        this.stackIndex = this.stackUserCount;
                    }
                    ++this.stackUserCount;
                }
            }

            this.stackAvatarWidth = map.tileWidth - (this.stackUserCount - 1) * STACKED_USER_OFFSET_X;
            const oldHeight = this.stackAvatarHeight;
            this.stackAvatarHeight = map.tileHeight - (this.stackUserCount - 1) * STACKED_USER_OFFSET_Y;
            if (this.stackAvatarHeight != oldHeight) {
                this.avatarEmojiMetrics = null;
            }
            this.stackOffsetX = this.stackIndex * STACKED_USER_OFFSET_X;
            this.stackOffsetY = this.stackIndex * STACKED_USER_OFFSET_Y;
        }
        else {
            const now = Date.now(),
                dt = now - this.lastPositionRequestTime;
            if (dt >= POSITION_REQUEST_DEBOUNCE_TIME) {
                this.lastPositionRequestTime = now;
                this.dispatchEvent(new UserPositionNeededEvent(this.id));
            }
        }
    }

    drawShadow(g, map, cameraZ) {
        const x = this.x * map.tileWidth,
            y = this.y * map.tileHeight,
            t = g.getTransform(),
            p = t.transformPoint({ x, y });

        this.visible = -map.tileWidth <= p.x
            && p.x < g.canvas.width
            && -map.tileHeight <= p.y
            && p.y < g.canvas.height;

        if (this.visible) {
            g.save();
            {
                g.shadowColor = "rgba(0, 0, 0, 0.5)";
                g.shadowOffsetX = 3 * cameraZ;
                g.shadowOffsetY = 3 * cameraZ;
                g.shadowBlur = 3 * cameraZ;

                this.innerDraw(g, map);
            }
            g.restore();
        }
    }

    drawAvatar(g, map) {
        if (this.visible) {
            g.save();
            {
                this.innerDraw(g, map);
                if (this.isActive && !this.audioMuted) {
                    const height = this.stackAvatarHeight / 2;
                    g.font = height + "px sans-serif";
                    const metrics = g.measureText(speakerMediumVolume.value);
                    g.fillText(
                        speakerMediumVolume.value,
                        this.stackAvatarWidth - metrics.width,
                        0);
                }
            }
            g.restore();
        }
    }

    innerDraw(g, map) {
        g.translate(
            this.x * map.tileWidth + this.stackOffsetX,
            this.y * map.tileHeight + this.stackOffsetY);
        g.fillStyle = "black";
        g.textBaseline = "top";
        if (this.avatarImage) {
            g.drawImage(
                this.avatarImage,
                0, 0,
                this.stackAvatarWidth,
                this.stackAvatarHeight);
        }
        else if(this.avatarEmoji) {
            g.font = 0.9 * this.stackAvatarHeight + "px sans-serif";
            if (!this.avatarEmojiMetrics) {
                this.avatarEmojiMetrics = g.measureText(this.avatarEmoji.value);
            }
            g.fillText(
                this.avatarEmoji.value,
                (this.avatarEmojiMetrics.width - this.stackAvatarWidth) / 2 + this.avatarEmojiMetrics.actualBoundingBoxLeft,
                this.avatarEmojiMetrics.actualBoundingBoxAscent);
        }

        if (this.audioMuted || !this.videoMuted) {
            const height = this.stackAvatarHeight / 2;
            g.font = height + "px sans-serif";
            if (this.audioMuted) {
                const metrics = g.measureText(mutedSpeaker.value);
                g.fillText(
                    mutedSpeaker.value,
                    this.stackAvatarWidth - metrics.width,
                    0);
            }
            if (!this.videoMuted) {
                const metrics = g.measureText(videoCamera.value);
                g.fillText(
                    videoCamera.value,
                    this.stackAvatarWidth - metrics.width,
                    height);
            }
        }
    }

    drawName(g, map, cameraZ, fontSize) {
        if (this.visible) {
            g.save();
            {
                g.translate(
                    this.x * map.tileWidth + this.stackOffsetX,
                    this.y * map.tileHeight + this.stackOffsetY);
                g.shadowColor = "black";
                g.shadowOffsetX = 3 * cameraZ;
                g.shadowOffsetY = 3 * cameraZ;
                g.shadowBlur = 3 * cameraZ;

                g.fillStyle = "white";
                g.textBaseline = "bottom";
                g.font = `${fontSize * devicePixelRatio}pt sans-serif`;
                g.fillText(this.displayName, 0, 0);
            }
            g.restore();
        }
    }

    drawHearingTile(g, map, dx, dy, p) {
        g.save();
        {
            g.translate(
                (this.tx + dx) * map.tileWidth,
                (this.ty + dy) * map.tileHeight);
            g.strokeStyle = `rgba(0, 255, 0, ${(1 - p) / 2})`;
            g.strokeRect(0, 0, map.tileWidth, map.tileHeight);
        }
        g.restore();
    }

    drawHearingRange(g, map, cameraZ, minDist, maxDist) {
        if (this.isInitialized) {
            const tw = Math.min(maxDist, Math.ceil(g.canvas.width / (2 * map.tileWidth * cameraZ))),
                th = Math.min(maxDist, Math.ceil(g.canvas.height / (2 * map.tileHeight * cameraZ)));

            for (let dy = 0; dy < th; ++dy) {
                for (let dx = 0; dx < tw; ++dx) {
                    const dist = Math.sqrt(dx * dx + dy * dy),
                        p = project(dist, minDist, maxDist);
                    if (p <= 1) {
                        this.drawHearingTile(g, map, dx, dy, p);
                        if (dy != 0) {
                            this.drawHearingTile(g, map, dx, -dy, p);
                        }
                        if (dx != 0) {
                            this.drawHearingTile(g, map, -dx, dy, p);
                        }
                        if (dx != 0 && dy != 0) {
                            this.drawHearingTile(g, map, -dx, -dy, p);
                        }
                    }
                }
            }
        }
    }
}


class UserMoveEvent extends Event {
    constructor(id) {
        super("userMoved");
        this.id = id;
        this.x = 0;
        this.y = 0;
    }

    set(x, y) {
        this.x = x;
        this.y = y;
    }
}

class UserPositionNeededEvent extends Event {
    constructor(id) {
        super("userPositionNeeded");
        this.id = id;
    }
}

const CAMERA_LERP = 0.01,
    CAMERA_ZOOM_MAX = 8,
    CAMERA_ZOOM_MIN = 0.1,
    CAMERA_ZOOM_SHAPE = 1 / 4,
    CAMERA_ZOOM_SPEED = 0.005,
    MAX_DRAG_DISTANCE = 5,
    MOVE_REPEAT = 0.125,
    isFirefox = typeof InstallTrigger !== "undefined",
    gameStartedEvt = new Event("gameStarted"),
    gameEndedEvt = new Event("gameEnded"),
    zoomChangedEvt$1 = new Event("zoomChanged"),
    emojiNeededEvt = new Event("emojiNeeded"),
    toggleAudioEvt$1 = new Event("toggleAudio"),
    toggleVideoEvt$1 = new Event("toggleVideo"),
    emoteEvt$1 = Object.assign(new Event("emote"), {
        id: null,
        emoji: null
    }),
    userJoinedEvt = Object.assign(new Event("userJoined", {
        user: null
    }));

class Game extends EventTarget {

    constructor() {
        super();

        this.element = Canvas(
            id("frontBuffer"),
            fillPageStyle,
            style({ touchAction: "none" }));
        this.gFront = this.element.getContext("2d");

        this.me = null;
        this.map = null;
        this.keys = {};
        this.userLookup = {};
        this.userList = [];

        this._loop = this.loop.bind(this);
        this.lastTime = 0;
        this.lastMove = Number.MAX_VALUE;
        this.gridOffsetX = 0;
        this.gridOffsetY = 0;
        this.cameraX = this.offsetCameraX = this.targetOffsetCameraX = 0;
        this.cameraY = this.offsetCameraY = this.targetOffsetCameraY = 0;
        this.cameraZ = this.targetCameraZ = 1.5;
        this.currentRoomName = null;
        this.fontSize = 10;

        this.drawHearing = false;
        this.audioDistanceMin = 2;
        this.audioDistanceMax = 10;
        this.rolloff = 5;

        this.pointers = [];
        this.lastPinchDistance = 0;
        this.canClick = false;

        this.currentEmoji = null;
        this.emotes = [];

        this.inputBinding = {
            keyButtonUp: "ArrowUp",
            keyButtonDown: "ArrowDown",
            keyButtonLeft: "ArrowLeft",
            keyButtonRight: "ArrowRight",
            keyButtonEmote: "e",
            keyButtonToggleAudio: "a",

            gpButtonUp: 12,
            gpButtonDown: 13,
            gpButtonLeft: 14,
            gpButtonRight: 15,
            gpButtonEmote: 0,
            gpButtonToggleAudio: 1
        };

        this.gamepadIndex = -1;


        // ============= KEYBOARD =================

        addEventListener("keydown", (evt) => {
            this.keys[evt.key] = evt;
            if (!evt.ctrlKey
                && !evt.altKey
                && !evt.shiftKey
                && !evt.metaKey
                && evt.key === this.inputBinding.keyButtonToggleAudio
                && !!this.me) {
                this.toggleMyAudio();
            }
        });

        addEventListener("keyup", (evt) => {
            if (!!this.keys[evt.key]) {
                delete this.keys[evt.key];
            }
        });

        // ============= KEYBOARD =================

        // ============= POINTERS =================

        this.element.addEventListener("wheel", (evt) => {
            if (!evt.shiftKey
                && !evt.altKey
                && !evt.ctrlKey
                && !evt.metaKey) {
                // Chrome and Firefox report scroll values in completely different ranges.
                const deltaZ = evt.deltaY * (isFirefox ? 1 : 0.02);
                this.zoom(deltaZ);
            }
        }, { passive: true });

        function readPointer(evt) {
            return {
                id: evt.pointerId,
                buttons: evt.buttons,
                dragDistance: 0,
                x: evt.offsetX * devicePixelRatio,
                y: evt.offsetY * devicePixelRatio
            }
        }

        const findPointer = (pointer) => {
            return this.pointers.findIndex(p => p.id === pointer.id);
        };

        const replacePointer = (pointer) => {
            const idx = findPointer(pointer);
            if (idx > -1) {
                const last = this.pointers[idx];
                this.pointers[idx] = pointer;
                return last;
            }
            else {
                this.pointers.push(pointer);
                return null;
            }
        };

        const getPressCount = () => {
            let count = 0;
            for (let pointer of this.pointers) {
                if (pointer.buttons === 1) {
                    ++count;
                }
            }
            return count;
        };

        this.element.addEventListener("pointerdown", (evt) => {
            const oldCount = getPressCount(),
                pointer = readPointer(evt),
                _ = replacePointer(pointer),
                newCount = getPressCount();

            this.canClick = oldCount === 0
                && newCount === 1;
        });

        const getPinchDistance = () => {
            const count = getPressCount();
            if (count !== 2) {
                return null;
            }

            const pressed = this.pointers.filter(p => p.buttons === 1),
                a = pressed[0],
                b = pressed[1],
                dx = b.x - a.x,
                dy = b.y - a.y;

            return Math.sqrt(dx * dx + dy * dy);
        };

        this.element.addEventListener("pointermove", (evt) => {
            const oldPinchDistance = getPinchDistance(),
                pointer = readPointer(evt),
                last = replacePointer(pointer),
                count = getPressCount(),
                newPinchDistance = getPinchDistance();

            if (count === 1) {

                if (!!last
                    && pointer.buttons === 1
                    && last.buttons === pointer.buttons) {
                    const dx = pointer.x - last.x,
                        dy = pointer.y - last.y,
                        dist = Math.sqrt(dx * dx + dy * dy);
                    pointer.dragDistance = last.dragDistance + dist;

                    if (pointer.dragDistance > MAX_DRAG_DISTANCE) {
                        this.targetOffsetCameraX = this.offsetCameraX += dx;
                        this.targetOffsetCameraY = this.offsetCameraY += dy;
                        this.canClick = false;
                    }
                }

            }

            if (oldPinchDistance !== null
                && newPinchDistance !== null) {
                const ddist = oldPinchDistance - newPinchDistance;
                this.zoom(ddist / 5);
                this.canClick = false;
            }
        });

        this.element.addEventListener("pointerup", (evt) => {
            const pointer = readPointer(evt),
                _ = replacePointer(pointer);

            if (!!this.me && pointer.dragDistance < 2) {
                const tile = this.getTileAt(pointer),
                    dx = tile.x - this.me.tx,
                    dy = tile.y - this.me.ty;

                if (dx === 0 && dy === 0) {
                    this.emote(this.me.id, this.currentEmoji);
                }
                else if (this.canClick) {
                    this.moveMeBy(dx, dy);
                }
            }
        });

        this.element.addEventListener("pointercancel", (evt) => {
            const pointer = readPointer(evt),
                idx = findPointer(pointer);

            if (idx >= 0) {
                this.pointers.removeAt(idx);
            }

            return pointer;
        });

        // ============= POINTERS =================

        // ============= ACTION ==================
    }

    hide() {
        this.element.hide();
    }

    show() {
        this.element.show();
    }

    setOpen(v) {
        this.element.setOpen(v);
    }

    updateAudioActivity(evt) {
        const user = this.userLookup[evt.id];
        if (!!user) {
            user.isActive = evt.isActive;
        }
    }

    emote(id, emoji) {
        const user = this.userLookup[id];

        if (!!user) {

            if (user.isMe) {

                emoji = emoji
                    || this.currentEmoji;

                if (!emoji) {
                    this.dispatchEvent(emojiNeededEvt);
                }
                else {
                    emoteEvt$1.emoji = this.currentEmoji = emoji;
                    this.dispatchEvent(emoteEvt$1);
                }
            }

            if (!!emoji) {
                this.emotes.push(new Emote(emoji, user.tx + 0.5, user.ty));
            }
        }
    }

    getTileAt(cursor) {
        const imageX = cursor.x - this.gridOffsetX - this.offsetCameraX,
            imageY = cursor.y - this.gridOffsetY - this.offsetCameraY,
            zoomX = imageX / this.cameraZ,
            zoomY = imageY / this.cameraZ,
            mapX = zoomX - this.cameraX,
            mapY = zoomY - this.cameraY,
            mapWidth = this.map.tileWidth,
            mapHeight = this.map.tileHeight,
            gridX = Math.floor(mapX / mapWidth),
            gridY = Math.floor(mapY / mapHeight),
            tile = { x: gridX, y: gridY };
        return tile;
    }

    moveMeBy(dx, dy) {
        const clearTile = this.map.getClearTile(this.me.tx, this.me.ty, dx, dy, this.me.avatarEmoji);
        this.me.moveTo(clearTile.x, clearTile.y);
        this.targetOffsetCameraX = 0;
        this.targetOffsetCameraY = 0;
    }

    zoom(deltaZ) {
        const mag = Math.abs(deltaZ);
        if (0 < mag && mag <= 50) {
            const a = project(this.targetCameraZ, CAMERA_ZOOM_MIN, CAMERA_ZOOM_MAX),
                b = Math.pow(a, CAMERA_ZOOM_SHAPE),
                c = b - deltaZ * CAMERA_ZOOM_SPEED,
                d = clamp(c, 0, 1),
                e = Math.pow(d, 1 / CAMERA_ZOOM_SHAPE);

            this.targetCameraZ = unproject(e, CAMERA_ZOOM_MIN, CAMERA_ZOOM_MAX);
            this.dispatchEvent(zoomChangedEvt$1);
        }
    }

    addUser(evt) {
        //evt = {
        //    id: "string", // the id of the participant
        //    displayName: "string" // the display name of the participant
        //};
        if (this.userLookup[evt.id]) {
            this.removeUser(evt);
        }

        const user = new User(evt.id, evt.displayName, false);
        this.userLookup[evt.id] = user;
        this.userList.unshift(user);
        userJoinedEvt.user = user;
        this.dispatchEvent(userJoinedEvt);
    }

    changeUserName(evt) {
        //evt = {
        //    id: string, // the id of the participant that changed his display name
        //    displayName: string // the new display name
        //};

        const user = this.userLookup[evt.id];
        if (!!user) {
            user.setDisplayName(evt.displayName);
        }
    }

    toggleMyAudio() {
        this.dispatchEvent(toggleAudioEvt$1);
    }

    toggleMyVideo() {
        this.dispatchEvent(toggleVideoEvt$1);
    }

    muteUserAudio(evt) {
        let mutingUser = this.me;
        if (!!evt.id) {
            mutingUser = this.userLookup[evt.id];
        }

        if (!mutingUser) {
            console.log("no user");
            setTimeout(this.muteUserAudio.bind(this, evt), 1000);
        }
        else {
            mutingUser.audioMuted = evt.muted;
        }
    }

    muteUserVideo(evt) {
        let mutingUser = this.me;
        if (!!evt.id) {
            mutingUser = this.userLookup[evt.id];
        }

        if (!mutingUser) {
            console.log("no user");
            setTimeout(this.muteUserVideo.bind(this, evt), 1000);
        }
        else {
            mutingUser.videoMuted = evt.muted;
        }
    }

    removeUser(evt) {
        //evt = {
        //    id: "string" // the id of the participant
        //};
        const user = this.userLookup[evt.id];
        if (!!user) {
            delete this.userLookup[evt.id];

            const userIndex = this.userList.indexOf(user);
            if (userIndex >= 0) {
                this.userList.removeAt(userIndex);
            }
        }
    }

    setAvatarURL(evt) {
        //evt = {
        //  id: string, // the id of the participant that changed his avatar.
        //  avatarURL: string // the new avatar URL.
        //}
        if (!!evt) {
            const user = this.userLookup[evt.id];
            if (!!user) {
                user.setAvatarURL(evt.avatarURL);
            }
        }
    }

    setAvatarEmoji(evt) {
        //evt = {
        //  id: string, // the id of the participant that changed his avatar.
        //  value: string // the emoji text to use as the avatar.
        //  desc: string // a description of the emoji
        //}
        if (!!evt) {
            const user = this.userLookup[evt.id];
            if (!!user) {
                user.avatarEmoji = evt;
            }
        }
    }

    async start(evt) {
        //evt = {
        //    roomName: "string", // the room name of the conference
        //    id: "string", // the id of the local participant
        //    displayName: "string", // the display name of the local participant
        //    avatarURL: "string" // the avatar URL of the local participant
        //};

        this.currentRoomName = evt.roomName.toLowerCase();
        this.me = new User(evt.id, evt.displayName, true);
        this.userList.push(this.me);
        this.userLookup[this.me.id] = this.me;

        this.setAvatarURL(evt);

        this.map = new TileMap(this.currentRoomName);
        let success = false;
        for (let retryCount = 0; retryCount < 2; ++retryCount) {
            try {
                await this.map.load();
                success = true;
            }
            catch (exp) {
                console.warn(exp);
                this.map = new TileMap("default");
            }
        }

        if (!success) {
            console.error("Couldn't load any maps!");
        }

        this.startLoop();
        this.dispatchEvent(zoomChangedEvt$1);
        this.dispatchEvent(gameStartedEvt);
    }

    startLoop() {
        this.element.show();
        this.element.resize();
        this.element.focus();

        requestAnimationFrame((time) => {
            this.lastTime = time;
            requestAnimationFrame(this._loop);
        });
    }

    resize(top) {
        if (top !== undefined) {
            this.element.style.top = top + "px";
            this.element.style.height = `calc(100% - ${top}px)`;
        }
        this.element.resize();
    }

    loop(time) {
        if (this.currentRoomName !== null) {
            requestAnimationFrame(this._loop);
            const dt = time - this.lastTime;
            this.lastTime = time;
            this.update(dt / 1000);
            this.render();
        }
    }

    end() {
        this.currentRoomName = null;
        this.map = null;
        this.userLookup = {};
        this.userList.clear();
        this.me = null;
        this.dispatchEvent(gameEndedEvt);
    }

    update(dt) {
        this.gridOffsetX = Math.floor(0.5 * this.element.width / this.map.tileWidth) * this.map.tileWidth;
        this.gridOffsetY = Math.floor(0.5 * this.element.height / this.map.tileHeight) * this.map.tileHeight;

        this.lastMove += dt;
        if (this.lastMove >= MOVE_REPEAT) {
            let dx = 0,
                dy = 0;

            for (let evt of Object.values(this.keys)) {
                if (!evt.altKey
                    && !evt.shiftKey
                    && !evt.ctrlKey
                    && !evt.metaKey) {
                    switch (evt.key) {
                        case this.inputBinding.keyButtonUp: dy--; break;
                        case this.inputBinding.keyButtonDown: dy++; break;
                        case this.inputBinding.keyButtonLeft: dx--; break;
                        case this.inputBinding.keyButtonRight: dx++; break;
                        case this.inputBinding.keyButtonEmote: this.emote(this.me.id, this.currentEmoji); break;
                    }
                }
            }

            const pad = GamepadManager.gamepads[this.gamepadIndex];
            if (pad) {

                if (pad.buttons[this.inputBinding.gpButtonEmote].pressed) {
                    this.emote(this.me.id, this.currentEmoji);
                }

                if (!lastPad.buttons[this.inputBinding.gpButtonToggleAudio].pressed
                    && pad.buttons[this.inputBinding.gpButtonToggleAudio].pressed) {
                    this.toggleMyAudio();
                }

                if (pad.buttons[this.inputBinding.gpButtonUp].pressed) {
                    --dy;
                }
                else if (pad.buttons[this.inputBinding.gpButtonDown].pressed) {
                    ++dy;
                }

                if (pad.buttons[this.inputBinding.gpButtonLeft].pressed) {
                    --dx;
                }
                else if (pad.buttons[this.inputBinding.gpButtonRight].pressed) {
                    ++dx;
                }

                dx += Math.round(pad.axes[0]);
                dy += Math.round(pad.axes[1]);

                this.targetOffsetCameraX += -50 * Math.round(2 * pad.axes[2]);
                this.targetOffsetCameraY += -50 * Math.round(2 * pad.axes[3]);
                this.zoom(2 * (pad.buttons[6].value - pad.buttons[7].value));
            }

            dx = clamp(dx, -1, 1);
            dy = clamp(dy, -1, 1);

            if (dx !== 0
                || dy !== 0) {
                this.moveMeBy(dx, dy);
            }

            this.lastMove = 0;
        }

        for (let emote of this.emotes) {
            emote.update(dt);
        }

        this.emotes = this.emotes.filter(e => !e.isDead());

        for (let user of this.userList) {
            user.update(dt, this.map, this.userList);
        }
    }

    render() {
        const targetCameraX = -this.me.x * this.map.tileWidth,
            targetCameraY = -this.me.y * this.map.tileHeight;

        this.cameraZ = lerp(this.cameraZ, this.targetCameraZ, CAMERA_LERP * 10);
        this.cameraX = lerp(this.cameraX, targetCameraX, CAMERA_LERP * this.cameraZ);
        this.cameraY = lerp(this.cameraY, targetCameraY, CAMERA_LERP * this.cameraZ);

        this.offsetCameraX = lerp(this.offsetCameraX, this.targetOffsetCameraX, CAMERA_LERP);
        this.offsetCameraY = lerp(this.offsetCameraY, this.targetOffsetCameraY, CAMERA_LERP);

        this.gFront.resetTransform();
        this.gFront.imageSmoothingEnabled = false;
        this.gFront.clearRect(0, 0, this.element.width, this.element.height);

        this.gFront.save();
        {
            this.gFront.translate(
                this.gridOffsetX + this.offsetCameraX,
                this.gridOffsetY + this.offsetCameraY);
            this.gFront.scale(this.cameraZ, this.cameraZ);
            this.gFront.translate(this.cameraX, this.cameraY);

            this.map.draw(this.gFront);

            for (let user of this.userList) {
                user.drawShadow(this.gFront, this.map, this.cameraZ);
            }

            for (let emote of this.emotes) {
                emote.drawShadow(this.gFront, this.map, this.cameraZ);
            }

            for (let user of this.userList) {
                user.drawAvatar(this.gFront, this.map);
            }

            this.drawCursor();

            for (let user of this.userList) {
                user.drawName(this.gFront, this.map, this.cameraZ, this.fontSize);
            }

            if (this.drawHearing) {
                this.me.drawHearingRange(
                    this.gFront,
                    this.map,
                    this.cameraZ,
                    this.audioDistanceMin,
                    this.audioDistanceMax);
            }

            for (let emote of this.emotes) {
                emote.drawEmote(this.gFront, this.map);
            }

        }
        this.gFront.restore();
    }


    drawCursor() {
        if (this.pointers.length === 1) {
            const pointer = this.pointers[0],
                tile = this.getTileAt(pointer);
            this.gFront.strokeStyle = "red";
            this.gFront.strokeRect(
                tile.x * this.map.tileWidth,
                tile.y * this.map.tileHeight,
                this.map.tileWidth,
                this.map.tileHeight);
        }
    }
}

const selfs$2 = new Map(),
    KEY = "CallaSettings",
    DEFAULT_SETTINGS = {
        drawHearing: false,
        audioDistanceMin: 1,
        audioDistanceMax: 10,
        audioRolloff: 1,
        fontSize: 12,
        zoom: 1.5,
        roomName: "calla",
        userName: "",
        avatarEmoji: null,
        gamepadIndex: 0,
        inputBinding: {
            keyButtonUp: "ArrowUp",
            keyButtonDown: "ArrowDown",
            keyButtonLeft: "ArrowLeft",
            keyButtonRight: "ArrowRight",
            keyButtonEmote: "e",
            keyButtonToggleAudio: "a",

            gpButtonUp: 12,
            gpButtonDown: 13,
            gpButtonLeft: 14,
            gpButtonRight: 15,
            gpButtonEmote: 0,
            gpButtonToggleAudio: 1
        }
    };

function commit(settings) {
    const self = selfs$2.get(settings);
    localStorage.setItem(KEY, JSON.stringify(self));
}

function load() {
    const selfStr = localStorage.getItem(KEY);
    if (!!selfStr) {
        return Object.assign(
            {},
            DEFAULT_SETTINGS,
            JSON.parse(selfStr));
    }
}

class Settings {
    constructor() {
        const self = Object.seal(load() || DEFAULT_SETTINGS);
        selfs$2.set(this, self);
        if (window.location.hash.length > 0) {
            self.roomName = window.location.hash.substring(1);
        }
        Object.seal(this);
    }

    get drawHearing() {
        return selfs$2.get(this).drawHearing;
    }

    set drawHearing(value) {
        if (value !== this.drawHearing) {
            selfs$2.get(this).drawHearing = value;
            commit(this);
        }
    }

    get audioDistanceMin() {
        return selfs$2.get(this).audioDistanceMin;
    }

    set audioDistanceMin(value) {
        if (value !== this.audioDistanceMin) {
            selfs$2.get(this).audioDistanceMin = value;
            commit(this);
        }
    }

    get audioDistanceMax() {
        return selfs$2.get(this).audioDistanceMax;
    }

    set audioDistanceMax(value) {
        if (value !== this.audioDistanceMax) {
            selfs$2.get(this).audioDistanceMax = value;
            commit(this);
        }
    }

    get audioRolloff() {
        return selfs$2.get(this).audioRolloff;
    }

    set audioRolloff(value) {
        if (value !== this.audioRolloff) {
            selfs$2.get(this).audioRolloff = value;
            commit(this);
        }
    }

    get fontSize() {
        return selfs$2.get(this).fontSize;
    }

    set fontSize(value) {
        if (value !== this.fontSize) {
            selfs$2.get(this).fontSize = value;
            commit(this);
        }
    }

    get zoom() {
        return selfs$2.get(this).zoom;
    }

    set zoom(value) {
        if (value !== this.zoom) {
            selfs$2.get(this).zoom = value;
            commit(this);
        }
    }

    get userName() {
        return selfs$2.get(this).userName;
    }

    set userName(value) {
        if (value !== this.userName) {
            selfs$2.get(this).userName = value;
            commit(this);
        }
    }

    get avatarEmoji() {
        return selfs$2.get(this).avatarEmoji;
    }

    set avatarEmoji(value) {
        if (value !== this.avatarEmoji) {
            selfs$2.get(this).avatarEmoji = value;
            commit(this);
        }
    }

    get roomName() {
        return selfs$2.get(this).roomName;
    }

    set roomName(value) {
        if (value !== this.roomName) {
            selfs$2.get(this).roomName = value;
            commit(this);
        }
    }

    get gamepadIndex() {
        return selfs$2.get(this).gamepadIndex;
    }

    set gamepadIndex(value) {
        if (value !== this.gamepadIndex) {
            selfs$2.get(this).gamepadIndex = value;
            commit(this);
        }
    }

    get inputBinding() {
        return selfs$2.get(this).inputBinding;
    }

    set inputBinding(value) {
        if (value !== this.inputBinding) {
            selfs$2.get(this).inputBinding = value;
            commit(this);
        }
    }
}

class BaseAudioClient extends EventTarget {

    constructor() {
        super();
    }

    /**
     * Set the position of the listener.
     * @param {Point} evt
     */
    setLocalPosition(evt) {
        throw new Error("Not implemented in base class");
    }

    /**
     * Set the position of an audio source.
     * @param {UserPosition} evt
     */
    setUserPosition(evt) {
        throw new Error("Not implemented in base class");
    }

    /**
     * Set audio parameters for the listener.
     * @param {any} evt
     */
    setAudioProperties(evt) {
        throw new Error("Not implemented in base class");
    }

    /**
     * 
     * @param {BaseUser} evt
     */
    removeUser(evt) {
        throw new Error("Not implemented in base class");
    }
}

// helps us filter out data channel messages that don't belong to us
const APP_FINGERPRINT$1
    = window.APP_FINGERPRINT
    = "Calla",
    eventNames$1 = [
        "userMoved",
        "emote",
        "userInitRequest",
        "userInitResponse",
        "audioMuteStatusChanged",
        "videoMuteStatusChanged",
        "localAudioMuteStatusChanged",
        "localVideoMuteStatusChanged",
        "remoteAudioMuteStatusChanged",
        "remoteVideoMuteStatusChanged",
        "videoConferenceJoined",
        "videoConferenceLeft",
        "participantJoined",
        "participantLeft",
        "avatarChanged",
        "displayNameChange",
        "audioActivity",
        "setAvatarEmoji",
        "deviceListChanged",
        "participantRoleChanged",
    ];

// Manages communication between Jitsi Meet and Calla
class BaseJitsiClient extends EventTarget {

    constructor() {
        super();
        /** @type {HTMLElement} */
        this.element = Div(
            id("jitsi"),
            style({
                position: "absolute",
                left: 0,
                top: 0,
                width: "100%",
                height: "100%",
                margin: 0,
                padding: 0,
                overflow: "hidden"
            }));

        /** @type {String} */
        this.localUser = null;

        this.otherUsers = new Map();

        /** @type {BaseAudioClient} */
        this.audioClient = null;

        this.preInitEvtQ = [];
    }

    hide() {
        this.element.hide();
    }

    show() {
        this.element.show();
    }

    /**
     * 
     * @param {number} top
     */
    resize(top) {
        if (top !== undefined) {
            this.element.style.top = top + "px";
            this.element.style.height = `calc(100% - ${top}px)`;
        }
    }

    /**
     * 
     * @param {string} host
     * @param {string} roomName
     * @param {string} userName
     */
    async initializeAsync(host, roomName, userName) {
        throw new Error("Not implemented in base class.");
    }

    dispatchEvent(evt) {
        if (this.localUser !== null) {
            if (evt.id === null
                || evt.id === undefined
                || evt.id === "local") {
                evt.id = this.localUser;
            }

            super.dispatchEvent(evt);
            if (evt.type === "videoConferenceLeft") {
                this.localUser = null;
            }
        }
        else if (evt.type === "videoConferenceJoined") {
            this.localUser = evt.id;

            this.dispatchEvent(evt);
            for (evt of this.preInitEvtQ) {
                this.dispatchEvent(evt);
            }

            this.preInitEvtQ.clear();
        }
        else {
            this.preInitEvtQ.push(evt);
        }
    }

    /**
     * 
     * @param {string} host
     * @param {string} roomName
     * @param {string} userName
     */
    async joinAsync(host, roomName, userName) {
        this.dispose();

        const joinTask = this.once("videoConferenceJoined");

        await this.initializeAsync(host, roomName, userName);

        this.addEventListener("participantJoined", (evt) => {
            this.otherUsers.set(evt.id, evt.displayName);
        });

        this.addEventListener("participantLeft", (evt) => {
            if (this.otherUsers.has(evt.id)) {
                this.otherUsers.delete(evt.id);
            }
        });

        this.addEventListener("displayNameChange", (evt) => {
            if (evt.id !== this.localUser) {
                this.otherUsers.set(evt.id, evt.displayname);
            }
        });

        const localizeMuteEvent = (type) => (evt) => {
            const isLocal = evt.id === this.localUser
                || evt.id === null
                || evt.id === undefined,
                evt2 = Object.assign(
                    new Event((isLocal ? "local" : "remote") + type + "MuteStatusChanged"),
                    {
                        id: isLocal ? this.localUser : evt.id,
                        muted: evt.muted
                    });
            this.dispatchEvent(evt2);
        };

        this.addEventListener("audioMuteStatusChanged", localizeMuteEvent("Audio"));
        this.addEventListener("videoMuteStatusChanged", localizeMuteEvent("Video"));

        this.addEventListener("localAudioMuteStatusChanged", (evt) => {
            this.audioMuteStatusChanged(evt.muted);
        });

        this.addEventListener("localVideoMuteStatusChanged", (evt) => {
            this.videoMuteStatusChanged(evt.muted);
        });

        window.addEventListener("unload", () => {
            this.dispose();
        });

        const joinInfo = await joinTask;

        this.setDisplayName(userName);

        return joinInfo;
    }

    dispose() {
    }

    /**
     * 
     * @param {string} userName
     */
    setDisplayName(userName) {
        throw new Error("Not implemented in base class");
    }

    async leaveAsync() {
        throw new Error("Not implemented in base class");
    }


    async getAudioOutputDevicesAsync() {
        throw new Error("Not implemented in base class");
    }

    /**
     * @return {Promise.<MediaDeviceInfo>} */
    async getCurrentAudioOutputDeviceAsync() {
        throw new Error("Not implemented in base class");
    }

    /**
     * 
     * @param {MediaDeviceInfo} device
     */
    setAudioOutputDevice(device) {
        throw new Error("Not implemented in base class");
    }

    async getAudioInputDevicesAsync() {
        throw new Error("Not implemented in base class");
    }

    async getCurrentAudioInputDeviceAsync() {
        throw new Error("Not implemented in base class");
    }

    async setAudioInputDeviceAsync(device) {
        throw new Error("Not implemented in base class");
    }

    async getVideoInputDevicesAsync() {
        throw new Error("Not implemented in base class");
    }

    async getCurrentVideoInputDeviceAsync() {
        throw new Error("Not implemented in base class");
    }

    async setVideoInputDeviceAsync(device) {
        throw new Error("Not implemented in base class");
    }

    async toggleAudioAsync() {
        throw new Error("Not implemented in base class");
    }

    async toggleVideoAsync() {
        throw new Error("Not implemented in base class");
    }

    setAvatarURL(url) {
        throw new Error("Not implemented in base class");
    }

    /**
     * @return {Promise.<boolean>}
     */
    async isAudioMutedAsync() {
        throw new Error("Not implemented in base class");
    }

    /**
     * @return {Promise.<boolean>}
     */
    async isVideoMutedAsync() {
        throw new Error("Not implemented in base class");
    }

    txGameData(toUserID, data) {
        throw new Error("Not implemented in base class");
    }

    rxGameData(evt) {
        throw new Error("Not implemented in base class");
    }

    /// Send a Calla message through the Jitsi Meet data channel.
    sendMessageTo(toUserID, command, value) {
        this.txGameData(toUserID, {
            hax: APP_FINGERPRINT$1,
            command,
            value
        });
    }

    receiveMessageFrom(fromUserID, command, value) {
        const evt = new JitsiClientEvent(command, fromUserID, value);
        this.dispatchEvent(evt);
    }

    setAudioProperties(origin, transitionTime, minDistance, maxDistance, rolloff) {
        const evt = {
            origin,
            transitionTime,
            minDistance,
            maxDistance,
            rolloff
        };
        this.audioClient.setAudioProperties(evt);
    }

    setLocalPosition(evt) {
        this.audioClient.setLocalPosition(evt);
        for (let toUserID of this.otherUsers.keys()) {
            this.sendMessageTo(toUserID, "userMoved", evt);
        }
    }

    setUserPosition(evt) {
        this.audioClient.setUserPosition(evt);
    }

    removeUser(evt) {
        this.audioClient.removeUser(evt);
    }

    /**
     *
     * @param {boolean} muted
     */
    async setAudioMutedAsync(muted) {
        let isMuted = await this.isAudioMutedAsync();
        if (muted !== isMuted) {
            isMuted = await this.toggleAudioAsync();
        }
        return isMuted;
    }

    /**
     *
     * @param {boolean} muted
     */
    async setVideoMutedAsync(muted) {
        let isMuted = await this.isVideoMutedAsync();
        if (muted !== isMuted) {
            isMuted = await this.toggleVideoAsync();
        }
        return isMuted;
    }

    /// Add a listener for Calla events that come through the Jitsi Meet data channel.
    /**
     * 
     * @param {string} evtName
     * @param {function} callback
     * @param {AddEventListenerOptions} opts
     */
    addEventListener(evtName, callback, opts) {
        if (eventNames$1.indexOf(evtName) === -1) {
            throw new Error(`Unsupported event type: ${evtName}`);
        }

        super.addEventListener(evtName, callback, opts);
    }

    /**
     * 
     * @param {string} toUserID
     */
    userInitRequest(toUserID) {
        this.sendMessageTo(toUserID, "userInitRequest");
    }

    /**
     * 
     * @param {string} toUserID
     */
    async userInitRequestAsync(toUserID) {
        return await this.until("userInitResponse",
            () => this.userInitRequest(toUserID),
            (evt) => evt.id === toUserID,
            1000);
    }

    /**
     * 
     * @param {string} toUserID
     * @param {User} fromUserState
     */
    userInitResponse(toUserID, fromUserState) {
        this.sendMessageTo(toUserID, "userInitResponse", fromUserState);
    }

    setAvatarEmoji(emoji) {
        for (let toUserID of this.otherUsers.keys()) {
            this.sendMessageTo(toUserID, "setAvatarEmoji", emoji);
        }
    }

    emote(emoji) {
        for (let toUserID of this.otherUsers.keys()) {
            this.sendMessageTo(toUserID, "emote", emoji);
        }
    }

    /**
     *
     * @param {boolean} muted
     */
    audioMuteStatusChanged(muted) {
        const evt = { muted };
        for (let toUserID of this.otherUsers.keys()) {
            this.sendMessageTo(toUserID, "audioMuteStatusChanged", evt);
        }
    }

    /**
     * 
     * @param {boolean} muted
     */
    videoMuteStatusChanged(muted) {
        const evt = { muted };
        for (let toUserID of this.otherUsers.keys()) {
            this.sendMessageTo(toUserID, "videoMuteStatusChanged", evt);
        }
    }
}

class JitsiClientEvent extends Event {
    constructor(command, id, value) {
        super(command);
        this.id = id;
        Event.clone(this, value);
    }
}

// TODO

/**
 * 
 * @param {string} host
 * @param {BaseJitsiClient} client
 */
function init(host, client) {
    const settings = new Settings(),
        game = new Game(),
        login = new LoginForm(),
        toolbar = new ToolBar(),
        options = new OptionsForm(),
        emoji = new EmojiForm(),
        instructions = new InstructionsForm(),

        forExport = {
            settings,
            client,
            game,
            login,
            toolbar,
            options,
            emoji,
            instructions
        };

    for (let e of Object.values(forExport)) {
        if (e.element) {
            document.body.append(e.element);
        }
    }

    refreshGamepads();

    options.drawHearing = game.drawHearing = settings.drawHearing;
    options.audioDistanceMin = game.audioDistanceMin = settings.audioDistanceMin;
    options.audioDistanceMax = game.audioDistanceMax = settings.audioDistanceMax;
    options.audioRolloff = settings.audioRolloff;
    options.fontSize = game.fontSize = settings.fontSize;
    options.gamepadIndex = game.gamepadIndex = settings.gamepadIndex;
    options.inputBinding = game.inputBinding = settings.inputBinding;
    toolbar.zoom = game.cameraZ = game.targetCameraZ = settings.zoom;
    login.userName = settings.userName;
    login.roomName = settings.roomName;

    showLogin();

    function showLogin() {
        client.hide();
        game.hide();
        toolbar.hide();
        options.hide();
        emoji.hide();
        instructions.hide();
        login.show();
    }

    async function withEmojiSelection(callback) {
        if (!emoji.isOpen()) {
            toolbar.optionsButton.lock();
            toolbar.instructionsButton.lock();
            options.hide();
            instructions.hide();
            const e = await emoji.selectAsync();
            if (!!e) {
                callback(e);
            }
            toolbar.optionsButton.unlock();
            toolbar.instructionsButton.unlock();
        }
    }

    async function selectEmojiAsync() {
        await withEmojiSelection((e) => {
            game.emote(client.localUser, e);
            toolbar.setEmojiButton(settings.inputBinding.keyButtonEmote, e);
        });
    }

    function setAudioProperties() {
        client.setAudioProperties(
            window.location.origin,
            0.125,
            settings.audioDistanceMin = game.audioDistanceMin = options.audioDistanceMin,
            settings.audioDistanceMax = game.audioDistanceMax = options.audioDistanceMax,
            settings.audioRolloff = options.audioRolloff);
    }

    function refreshGamepads() {
        options.gamepads = GamepadManager.gamepads;
    }


    window.addEventListeners({
        resize: () => {
            game.resize(toolbar.offsetHeight);
            client.resize(toolbar.offsetHeight);
        },
        gamepadconnected: refreshGamepads,
        gamepaddisconnected: refreshGamepads
    });

    toolbar.addEventListeners({
        toggleAudio: () => {
            client.toggleAudioAsync();
        },
        selectEmoji: selectEmojiAsync,
        emote: () => {
            game.emote(client.localUser, game.currentEmoji);
        },
        zoomChanged: () => {
            settings.zoom = game.targetCameraZ = toolbar.zoom;
        },
        toggleOptions: () => {
            if (!emoji.isOpen()) {
                instructions.hide();
                options.toggleOpen();
            }
        },
        toggleInstructions: () => {
            if (!emoji.isOpen()) {
                options.hide();
                instructions.toggleOpen();
            }
        },
        tweet: () => {
            const message = encodeURIComponent(`Join my #TeleParty ${document.location.href}`),
                url = new URL("https://twitter.com/intent/tweet?text=" + message);
            open(url);
        },
        leave: () => {
            game.end();
        },
        toggleUI: () => {
            game.setOpen(toolbar.visible);
            game.resize(toolbar.offsetHeight);
            client.resize(toolbar.offsetHeight);
        }
    });


    login.addEventListener("login", () => {
        client.joinAsync(
            host,
            settings.roomName = login.roomName,
            settings.userName = login.userName);
    });


    options.addEventListeners({
        selectAvatar: async () => {
            withEmojiSelection((e) => {
                settings.avatarEmoji
                    = options.avatarEmoji
                    = game.me.avatarEmoji
                    = e;
                client.setAvatarEmoji(e);
            });
        },
        avatarURLChanged: () => {
            client.setAvatarURL(options.avatarURL);
        },
        audioPropertiesChanged: setAudioProperties,
        toggleVideo: () => {
            client.toggleVideoAsync();
        },
        toggleDrawHearing: () => {
            settings.drawHearing = game.drawHearing = options.drawHearing;
        },
        fontSizeChanged: () => {
            settings.fontSize = game.fontSize = options.fontSize;
        },
        audioInputChanged: () => {
            client.setAudioInputDeviceAsync(options.currentAudioInputDevice);
        },
        audioOutputChanged: () => {
            client.setAudioOutputDevice(options.currentAudioOutputDevice);
        },
        videoInputChanged: () => {
            client.setVideoInputDeviceAsync(options.currentVideoInputDevice);
        },
        gamepadChanged: () => {
            settings.gamepadIndex = game.gamepadIndex = options.gamepadIndex;
        },
        inputBindingChanged: () => {
            settings.inputBinding = game.inputBinding = options.inputBinding;
        }
    });

    game.addEventListeners({
        emote: (evt) => {
            client.emote(evt.emoji);
        },
        userJoined: (evt) => {
            evt.user.addEventListener("userPositionNeeded", (evt2) => {
                client.userInitRequest(evt2.id);
            });
        },
        toggleAudio: () => {
            client.toggleAudioAsync();
        },
        toggleVideo: () => {
            client.toggleVideoAsync();
        },
        gameStarted: () => {
            login.hide();
            toolbar.show();
            client.show();

            setAudioProperties();

            client.setLocalPosition(game.me);
            game.me.addEventListener("userMoved", (evt) => {
                client.setLocalPosition(evt);
            });

            if (settings.avatarEmoji !== null) {
                game.me.avatarEmoji = settings.avatarEmoji;
            }
            settings.avatarEmoji
                = options.avatarEmoji
                = game.me.avatarEmoji;
        },
        gameEnded: () => {
            game.hide();
            client.hide();
            login.connected = false;
            showLogin();
        },
        emojiNeeded: selectEmojiAsync,
        zoomChanged: () => {
            settings.zoom = toolbar.zoom = game.targetCameraZ;
        }
    });

    client.addEventListeners({
        videoConferenceJoined: async (evt) => {
            login.connected = true;

            window.location.hash = login.roomName;

            game.start(evt);

            options.audioInputDevices = await client.getAudioInputDevicesAsync();
            options.audioOutputDevices = await client.getAudioOutputDevicesAsync();
            options.videoInputDevices = await client.getVideoInputDevicesAsync();

            options.currentAudioInputDevice = await client.getCurrentAudioInputDeviceAsync();
            options.currentAudioOutputDevice = await client.getCurrentAudioOutputDeviceAsync();
            options.currentVideoInputDevice = await client.getCurrentVideoInputDeviceAsync();

            const audioMuted = await client.isAudioMutedAsync();
            game.muteUserAudio({ id: client.localUser, muted: audioMuted });
            toolbar.audioEnabled = !audioMuted;

            const videoMuted = await client.isVideoMutedAsync();
            game.muteUserVideo({ id: client.localUser, muted: videoMuted });
            options.videoEnabled = !videoMuted;
        },
        videoConferenceLeft: (evt) => {
            if (evt.roomName.toLowerCase() === game.currentRoomName) {
                game.end();
            }
        },
        participantJoined: (evt) => {
            game.addUser(evt);
        },
        participantLeft: (evt) => {
            game.removeUser(evt);
            client.removeUser(evt);
        },
        avatarChanged: (evt) => {
            game.setAvatarURL(evt);
            if (evt.id === client.localUser) {
                options.avatarURL = evt.avatarURL;
            }
        },
        displayNameChange: (evt) => {
            game.changeUserName(evt);
        },
        audioMuteStatusChanged: (evt) => {
            game.muteUserAudio(evt);
        },
        localAudioMuteStatusChanged: async (evt) => {
            toolbar.audioEnabled = !evt.muted;
            if (!evt.muted) {
                options.currentAudioInputDevice = await client.getCurrentAudioInputDeviceAsync();
            }
        },
        videoMuteStatusChanged: (evt) => {
            game.muteUserVideo(evt);
        },
        localVideoMuteStatusChanged: async (evt) => {
            options.videoEnabled = !evt.muted;
            if (!evt.muted) {
                options.currentVideoInputDevice = await client.getCurrentVideoInputDeviceAsync();
            }
            else {
                options.currentVideoInputDevice = null;
            }
        },
        userInitRequest: (evt) => {
            if (game.me && game.me.id) {
                client.userInitResponse(evt.id, game.me);
            }
            else {
                console.log("Local user not initialized");
            }
        },
        userInitResponse: (evt) => {
            const user = game.userLookup[evt.id];
            if (!!user) {
                user.init(evt);
                client.setUserPosition(evt);
            }
        },
        userMoved: (evt) => {
            const user = game.userLookup[evt.id];
            if (!!user) {
                user.moveTo(evt.x, evt.y);
                client.setUserPosition(evt);
            }
        },
        emote: (evt) => {
            game.emote(evt.id, evt);
        },
        setAvatarEmoji: (evt) => {
            game.setAvatarEmoji(evt);
        },
        audioActivity: (evt) => {
            game.updateAudioActivity(evt);
        }
    });

    login.ready = true;
    return forExport;
}

class ExternalJitsiAudioClient extends BaseAudioClient {
    constructor(host, apiOrigin, apiWindow) {
        super();

        /** @type {string} */
        this.host = host;

        /** @type {string} */
        this.apiOrigin = apiOrigin;

        /** @type {Window} */
        this.apiWindow = apiWindow;

        window.addEventListener("message", (evt) => {
            this.rxJitsiHax(evt);
        });
    }


    /**
     * Send a message to the Calla app
     * @param {string} command
     * @param {any} value
     */
    txJitsiHax(command, value) {
        if (this.apiWindow) {
            const evt = {
                hax: APP_FINGERPRINT,
                command: command,
                value: value
            };
            try {
                this.apiWindow.postMessage(JSON.stringify(evt), this.apiOrigin);
            }
            catch (exp) {
                console.error(exp);
            }
        }
    }

    /**
     * Recieve a message from the Calla app.
     * @param {MessageEvent} msg
     */
    rxJitsiHax(msg) {
        const isLocalHost = msg.origin.match(/^https?:\/\/localhost\b/);
        if (msg.origin === "https://" + this.host || isLocalHost) {
            try {
                const evt = JSON.parse(msg.data);
                if (evt.hax === APP_FINGERPRINT) {
                    const evt2 = new AudioClientEvent(evt);
                    this.dispatchEvent(evt2);
                }
            }
            catch (exp) {
                console.error(exp);
            }
        }
    }

    setLocalPosition(evt) {
        this.txJitsiHax("setLocalPosition", evt);
    }

    setUserPosition(evt) {
        this.txJitsiHax("setUserPosition", evt);
    }

    setAudioProperties(evt) {
        this.txJitsiHax("setAudioProperties", evt);
    }

    removeUser(evt) {
        this.txJitsiHax("removeUser", evt);
    }
}

class AudioClientEvent extends Event {
    constructor(data) {
        super(data.command);
        Event.clone(this, data.value);
    }
}

/* global JitsiMeetExternalAPI */

class ExternalJitsiClient extends BaseJitsiClient {
    constructor() {
        super();
        this.api = null;

        Object.seal(this);
    }

    dispose() {
        if (this.api !== null) {
            this.api.dispose();
            this.api = null;
        }
    }

    async initializeAsync(host, roomName, userName) {
        await import(`https://${host}/libs/external_api.min.js`);
        return new Promise((resolve) => {
            this.api = new JitsiMeetExternalAPI(host, {
                parentNode: this.element,
                roomName,
                onload: () => {
                    const iframe = this.api.getIFrame();
                    this.audioClient = new ExternalJitsiAudioClient(
                        host,
                        new URL(iframe.src).origin,
                        iframe.contentWindow);
                    this.audioClient.addEventListener("audioActivity", (evt) => {
                        const evt2 = Event.clone(new Event("audioActivity"), evt);
                        this.dispatchEvent(evt2);
                    });
                    resolve();
                },
                noSSL: false,
                width: "100%",
                height: "100%",
                configOverwrite: {
                    startVideoMuted: 0,
                    startWithVideoMuted: true
                },
                interfaceConfigOverwrite: {
                    DISABLE_VIDEO_BACKGROUND: true,
                    SHOW_JITSI_WATERMARK: false,
                    SHOW_WATERMARK_FOR_GUESTS: false,
                    SHOW_POWERED_BY: true,
                    AUTHENTICATION_ENABLE: false,
                    MOBILE_APP_PROMO: false
                }
            });

            const reroute = (evtType, test) => {
                test = test || (() => true);

                this.api.addEventListener(evtType, (evt) => {
                    if (test(evt)) {
                        const evt2 = Event.clone(new Event(evtType), evt);
                        if (evtType === "displayNameChange") {

                            // The version of the External API that I'm using
                            // is inconsistent with how parameters are set.
                            if (evt2.id === "local") {
                                evt2.id = null;
                            }

                            // The version of the External API that I'm using 
                            // misspells the name of this field.
                            if (evt2.displayname !== undefined) {
                                evt2.displayName = evt2.displayname;
                            }
                        }

                        this.dispatchEvent(evt2);
                    }
                });
            };

            reroute("videoConferenceJoined");
            reroute("videoConferenceLeft");
            reroute("participantJoined", (evt) => evt.id !== "local");
            reroute("participantLeft");
            reroute("avatarChanged", (evt) => evt.avatarURL !== undefined);
            reroute("displayNameChange");
            reroute("audioMuteStatusChanged");
            reroute("videoMuteStatusChanged");
            reroute("participantRoleChanged");

            this.api.addEventListener("endpointTextMessageReceived", (evt) => {
                this.rxGameData(evt);
            });
        });
    }

    setDisplayName(userName) {
        this.api.executeCommand("displayName", userName);
    }

    async leaveAsync() {
        const leaveTask = this.once("videoConferenceLeft", 5000);
        this.api.executeCommand("hangup");
        await leaveTask;
    }

    async getAudioOutputDevicesAsync() {
        const devices = await this.api.getAvailableDevices();
        return devices && devices.audioOutput || [];
    }

    async getCurrentAudioOutputDeviceAsync() {
        const devices = await this.api.getCurrentDevices();
        return devices && devices.audioOutput || null;
    }

    setAudioOutputDevice(device) {
        this.api.setAudioOutputDevice(device.label, device.id);
    }

    async getAudioInputDevicesAsync() {
        const devices = await this.api.getAvailableDevices();
        return devices && devices.audioInput || [];
    }

    async getCurrentAudioInputDeviceAsync() {
        const devices = await this.api.getCurrentDevices();
        return devices && devices.audioInput || null;
    }

    async setAudioInputDeviceAsync(device) {
        const muted = await this.isAudioMutedAsync();
        if (muted) {
            const unmuteTask = this.once("localAudioMuteStatusChanged", 5000);
            await this.setAudioMutedAsync(false);
            await unmuteTask;
        }

        this.api.setAudioInputDevice(device.label, device.id);
    }

    async getVideoInputDevicesAsync() {
        const devices = await this.api.getAvailableDevices();
        return devices && devices.videoInput || [];
    }

    async getCurrentVideoInputDeviceAsync() {
        const devices = await this.api.getCurrentDevices();
        return devices && devices.videoInput || null;
    }

    async setVideoInputDeviceAsync(device) {
        const muted = await this.isVideoMutedAsync();
        if (muted) {
            const unmuteTask = this.once("localVideoMuteStatusChanged", 5000);
            await this.setVideoMutedAsync(false);
            await unmuteTask;
        }

        this.api.setVideoInputDevice(device.label, device.id);
    }

    async toggleAudioAsync() {
        const changeTask = this.once("localAudioMuteStatusChanged", 5000);
        this.api.executeCommand("toggleAudio");
        return await changeTask;
    }

    async toggleVideoAsync() {
        const changeTask = this.once("localVideoMuteStatusChanged", 5000);
        this.api.executeCommand("toggleVideo");
        return await changeTask;
    }

    setAvatarURL(url) {
        this.api.executeCommand("avatarUrl", url);
    }

    async isAudioMutedAsync() {
        return await this.api.isAudioMuted();
    }

    async isVideoMutedAsync() {
        return await this.api.isVideoMuted();
    }

    txGameData(toUserID, data) {
        this.api.executeCommand("sendEndpointTextMessage", toUserID, JSON.stringify(data));
    }

    /// A listener to add to JitsiExternalAPI::endpointTextMessageReceived event
    /// to receive Calla messages from the Jitsi Meet data channel.
    rxGameData(evt) {
        // JitsiExternalAPI::endpointTextMessageReceived event arguments format:
        // evt = {
        //    data: {
        //      senderInfo: {
        //        jid: "string", // the jid of the sender
        //        id: "string" // the participant id of the sender
        //      },
        //      eventData: {
        //        name: "string", // the name of the datachannel event: `endpoint-text-message`
        //        text: "string" // the received text from the sender
        //      }
        //   }
        //};
        const data = JSON.parse(evt.data.eventData.text);
        if (data.hax === APP_FINGERPRINT) {
            this.receiveMessageFrom(evt.data.senderInfo.id, data.command, data.value);
        }
    }
}

/* global JITSI_HOST */

const { toolbar, login } = init(JITSI_HOST, new ExternalJitsiClient());

function adLink(url, label, icon) {
    return A(
        href(url),
        target("_blank"),
        rel("noopener"),
        ariaLabel(label.replace("GitHub", "Git Hub")),
        title(label),
        Span(className(`icon icon-${icon}`),
            role("presentation")));
}

toolbar.append(
    adLink(
        "https://github.com/capnmidnight/Calla",
        "Follow Calla on GitHub",
        "github"),
    adLink(
        "https://twitter.com/Sean_McBeth",
        "Follow Sean on Twitter",
        "twitter"));

login.content.append(
    H2("Made by"),
    P(adLink(
        "https://www.seanmcbeth.com",
        "Sean T. McBeth",
        "shrink"),
        "Sean T. McBeth"),
    P(adLink("https://twitter.com/Sean_McBeth",
        "Follow Sean on Twitter",
        "twitter"),
        "Follow @Sean_McBeth on Twitter"));
