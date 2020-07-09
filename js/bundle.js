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
// Alternative text in case an image can't be displayed.
function alt(value) { return new HtmlAttr("alt", ["applet", "area", "img", "input"], value); }
function ariaLabel(value) { return new HtmlAttr("ariaLabel", [], value); }
// The audio or video should play as soon as possible.
function autoPlay(value) { return new HtmlAttr("autoplay", ["audio", "video"], value); }
// Often used with CSS to style elements with common properties.
function className(value) { return new HtmlAttr("className", [], value); }
// Describes elements which belongs to this one.
function htmlFor(value) { return new HtmlAttr("htmlFor", ["label", "output"], value); }
// The URL of a linked resource.
function href(value) { return new HtmlAttr("href", ["a", "area", "base", "link"], value); }
// Often used with CSS to style a specific element. The value of this attribute must be unique.
function id(value) { return new HtmlAttr("id", [], value); }
// Indicates the maximum value allowed.
function max(value) { return new HtmlAttr("max", ["input", "meter", "progress"], value); }
// Indicates the minimum value allowed.
function min(value) { return new HtmlAttr("min", ["input", "meter"], value); }
// Indicates whether the audio will be initially silenced on page load.
function muted(value) { return new HtmlAttr("muted", ["audio", "video"], value); }
// Provides a hint to the user of what can be entered in the field.
function placeHolder(value) { return new HtmlAttr("placeholder", ["input", "textarea"], value); }
// Specifies the relationship of the target object to the link object.
function rel(value) { return new HtmlAttr("rel", ["a", "area", "link"], value); }
// Defines the number of rows in a text area.
function role(value) { return new HtmlAttr("role", [], value); }
// The URL of the embeddable content.
function src(value) { return new HtmlAttr("src", ["audio", "embed", "iframe", "img", "input", "script", "source", "track", "video"], value); }
// A MediaStream object to use as a source for an HTML video or audio element
function srcObject(value) { return new HtmlAttr("srcObject", ["audio", "video"], value); }
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

// A selection of fonts for preferred monospace rendering.
const monospaceFamily = "'Droid Sans Mono', 'Consolas', 'Lucida Console', 'Courier New', 'Courier', monospace";
const monospaceFont = style({ fontFamily: monospaceFamily });

/**
 * 
 * @param {number} y
 */
function row(y, h) {
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
function grid(x, y, w, h) {
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

function t(o, s, c) {
    return typeof o === s || o instanceof c;
}

function isFunction(obj) {
    return t(obj, "function", Function);
}

function isString(obj) {
    return t(obj, "string", String);
}

function isNumber(obj) {
    return t(obj, "number", Number);
}
function isBoolean(obj) {
    return t(obj, "boolean", Boolean);
}

/**
 * Check a value to see if it is of a number type
 * and is not the special NaN value.
 * 
 * @param {any} v
 */
function isGoodNumber(v) {
    return isNumber(v)
        && !Number.isNaN(v);
}

/**
 * Force a value onto a range
 * 
 * @param {number} v
 * @param {number} min
 * @param {number} max
 */
function clamp(v, min, max) {
    return Math.min(max, Math.max(min, v));
}

/**
 * Translate a value into a range.
 * 
 * @param {number} v
 * @param {number} min
 * @param {number} max
 */
function project(v, min, max) {
    return (v - min) / (max - min);
}

/**
 * Translate a value out of a range.
 * 
 * @param {number} v
 * @param {number} min
 * @param {number} max
 */
function unproject(v, min, max) {
    return v * (max - min) + min;
}

/**
 * Pick a value that is proportionally between two values.
 * 
 * @param {number} a
 * @param {number} b
 * @param {number} p
 * @returns {number}
 */
function lerp(a, b, p) {
    return (1 - p) * a + p * b;
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
            if (key !== "isTrusted"
                && !Event.prototype.hasOwnProperty(key)) {
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
        const hasResolveEvt = isString(resolveEvt);
        if (hasResolveEvt) {
            const oldResolve = resolve;
            const remove = () => {
                this.removeEventListener(resolveEvt, oldResolve);
            };
            resolve = add(remove, resolve);
            reject = add(remove, reject);
        }

        const hasRejectEvt = isString(rejectEvt);
        if (hasRejectEvt) {
            const oldReject = reject;
            const remove = () => {
                this.removeEventListener(rejectEvt, oldReject);
            };

            resolve = add(remove, resolve);
            reject = add(remove, reject);
        }

        if (isNumber(timeout)) {
            const timer = setTimeout(reject, timeout, `'${resolveEvt}' has timed out.`),
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

EventTarget.prototype.when = function (resolveEvt, filterTest, timeout) {

    if (!isString(resolveEvt)) {
        throw new Error("Filtering tests function is required. Otherwise, use `once`.");
    }

    if (!isFunction(filterTest)) {
        throw new Error("Filtering tests function is required. Otherwise, use `once`.");
    }

    return new Promise((resolve, reject) => {
        const remove = () => {
            this.removeEventListener(resolveEvt, resolve);
        };

        resolve = add(remove, resolve);
        reject = add(remove, reject);

        if (isNumber(timeout)) {
            const timer = setTimeout(reject, timeout, `'${resolveEvt}' has timed out.`),
                cancel = () => clearTimeout(timer);
            resolve = add(cancel, resolve);
            reject = add(cancel, reject);
        }

        this.addEventListener(resolveEvt, resolve);
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

        if (repeatTimeout !== undefined) {
            if (cancelTimeout !== undefined) {
                canceller = setTimeout(() => {
                    cleanup();
                    reject(`'${untilEvt}' has timed out.`);
                }, cancelTimeout);
            }

            function repeater() {
                callback();
                timer = setTimeout(repeater, repeatTimeout);
            }

            timer = setTimeout(repeater, 0);
        }
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

Array.prototype.scan = function (...tests) {
    for (let test of tests) {
        const filtered = this.filter(test);
        if (filtered.length > 0) {
            return filtered[0];
        }
    }

    return null;
};

String.prototype.firstLetterToUpper = function () {
    return this[0].toLocaleUpperCase()
        + this.substring(1);
};

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
            if (isString(x)
                || isNumber(x)
                || isBoolean(x)
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
            /** @type {Element} */
            this.element = rest[0];
        }
        else {
            /** @type {Element} */
            this.element = tag(tagName, ...rest);
        }
    }

    get id() {
        return this.element.id;
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
            style({ padding: "1em" }),
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
        //this.button.setLocked(v);
        style({
            backgroundColor: v ? "#ddd" : "transparent",
            borderTop: v ? "" : "none",
            borderRight: v ? "" : "none",
            borderBottom: v ? "none" : "",
            borderLeft: v ? "" : "none",
        }).apply(this.button);
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

    focus() {
        this.element.focus();
    }

    blur() {
        this.element.blur();
    }
}

function clear(elem) {
    while (elem.lastChild) {
        elem.lastChild.remove();
    }
}

function A(...rest) { return tag("a", ...rest); }
function HtmlButton(...rest) { return tag("button", ...rest); }
function Button(...rest) { return HtmlButton(...rest, type("button")); }
function Canvas(...rest) { return tag("canvas", ...rest); }
function Div(...rest) { return tag("div", ...rest); }
function H1(...rest) { return tag("h1", ...rest); }
function H2(...rest) { return tag("h2", ...rest); }
function Img(...rest) { return tag("img", ...rest); }
function Input(...rest) { return tag("input", ...rest); }
function Label(...rest) { return tag("label", ...rest); }
function LI(...rest) { return tag("li", ...rest); }
function Option(...rest) { return tag("option", ...rest); }
function P(...rest) { return tag("p", ...rest); }
function Span(...rest) { return tag("span", ...rest); }
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

    /**
     *
     * @param {(Emoji|EmojiGroup)} e
     */
    contains(e) {
        return this.value.indexOf(e.value) >= 0;
    }
}

function e(v, d) {
    return new Emoji(v, d);
}

class EmojiGroup extends Emoji {
    /**
     * Groupings of Unicode-standardized pictograms.
     * @param {string} value - a Unicode sequence.
     * @param {string} desc - an English text description of the pictogram.
     * @param {(Emoji|EmojiGroup)[]} rest - Emojis in this group.
     */
    constructor(...rest) {
        const first = rest.splice(0, 1)[0];
        super(first.value, first.desc);
        /** @type {(Emoji|EmojiGroup)[]} */
        this.alts = rest;
        /** @type {string} */
        this.width = null;
    }

    /**
     * @returns {(Emoji|EmojiGroup)}
     */
    random() {
        return this.alts.random();
    }

    /**
     * 
     * @param {(Emoji|EmojiGroup)} e
     */
    contains(e) {
        return super.contains(e)
            || this.alts.reduce((a, b) => a || b.contains(e), false);
    }
}

function g(...r) {
    return new EmojiGroup(...r);
}

const textStyle = e("\u{FE0E}", "Variation Selector-15: text style");
const emojiStyle = e("\u{FE0F}", "Variation Selector-16: emoji style");
const zeroWidthJoiner = e("\u{200D}", "Zero Width Joiner");

const female = e("\u{2640}\u{FE0F}", "Female");
const male = e("\u{2642}\u{FE0F}", "Male");
const skinL = e("\u{1F3FB}", "Light Skin Tone");
const skinML = e("\u{1F3FC}", "Medium-Light Skin Tone");
const skinM = e("\u{1F3FD}", "Medium Skin Tone");
const skinMD = e("\u{1F3FE}", "Medium-Dark Skin Tone");
const skinD = e("\u{1F3FF}", "Dark Skin Tone");
const hairRed = e("\u{1F9B0}", "Red Hair");
const hairCurly = e("\u{1F9B1}", "Curly Hair");
const hairWhite = e("\u{1F9B3}", "White Hair");
const hairBald = e("\u{1F9B2}", "Bald");

function combo(a, b) {
    if (a instanceof Array) {
        return a.map(c => combo(c, b));
    }
    else if (a instanceof EmojiGroup) {
        return g(
            combo(e(a.value, a.desc), b),
            ...combo(a.alts, b));
    }
    else if (b instanceof Array) {
        return b.map(c => combo(a, c));
    }
    else {
        return e(a.value + b.value, a.desc + ": " + b.desc);
    }
}

function join(a, b) {
    if (a instanceof Array) {
        return a.map(c => join(c, b));
    }
    else if (a instanceof EmojiGroup) {
        return g(
            join(e(a.value, a.desc), b),
            ...join(a.alts, b));
    }
    else if (b instanceof Array) {
        return b.map(c => join(a, c));
    }
    else {
        return e(a.value + zeroWidthJoiner.value + b.value, a.desc + ": " + b.desc);
    }
}

/**
 * Check to see if a given Emoji walks on water.
 * @param {Emoji} e
 */
function isSurfer(e) {
    return surfers.contains(e)
        || rowers.contains(e)
        || swimmers.contains(e);
}

function skin(v, d, ...rest) {
    const person = e(v, d),
        light = combo(person, skinL),
        mediumLight = combo(person, skinML),
        medium = combo(person, skinM),
        mediumDark = combo(person, skinMD),
        dark = combo(person, skinD);
    return Object.assign(
        g(person, person, light, mediumLight, medium, mediumDark, dark, ...rest), {
        default: person,
        light,
        mediumLight,
        medium,
        mediumDark,
        dark
    });
}

function sex(person) {
    const man = join(person, male),
        woman = join(person, female);

    return Object.assign(
        g(person, person, man, woman), {
        default: person,
        man,
        woman
    });
}

function skinAndSex(v, d) {
    return sex(skin(v, d));
}

function skinAndHair(v, d, ...rest) {
    const people = skin(v, d),
        red = join(people, hairRed),
        curly = join(people, hairCurly),
        white = join(people, hairWhite),
        bald = join(people, hairBald);
    return Object.assign(
        g(people, people, red, curly, white, bald, ...rest), {
        default: people,
        red,
        curly,
        white,
        bald
    });}

function sym(symbol, name) {
    const j = e(symbol.value, name),
        men = join(man.default, j),
        women = join(woman.default, j);
    return Object.assign(
        g(symbol, men, women), {
        symbol,
        men,
        women
    });
}

const frowners = skinAndSex("\u{1F64D}", "Frowning");
const pouters = skinAndSex("\u{1F64E}", "Pouting");
const gesturingNo = skinAndSex("\u{1F645}", "Gesturing NO");
const gesturingOK = skinAndSex("\u{1F646}", "Gesturing OK");
const tippingHand = skinAndSex("\u{1F481}", "Tipping Hand");
const raisingHand = skinAndSex("\u{1F64B}", "Raising Hand");
const bowing = skinAndSex("\u{1F647}", "Bowing");
const facePalming = skinAndSex("\u{1F926}", "Facepalming");
const shrugging = skinAndSex("\u{1F937}", "Shrugging");
const cantHear = skinAndSex("\u{1F9CF}", "Can't Hear");
const gettingMassage = skinAndSex("\u{1F486}", "Getting Massage");
const gettingHaircut = skinAndSex("\u{1F487}", "Getting Haircut");

const constructionWorkers = skinAndSex("\u{1F477}", "Construction Worker");
const guards = skinAndSex("\u{1F482}", "Guard");
const spies = skinAndSex("\u{1F575}", "Spy");
const police = skinAndSex("\u{1F46E}", "Police");
const wearingTurban = skinAndSex("\u{1F473}", "Wearing Turban");
const superheroes = skinAndSex("\u{1F9B8}", "Superhero");
const supervillains = skinAndSex("\u{1F9B9}", "Supervillain");
const mages = skinAndSex("\u{1F9D9}", "Mage");
const fairies = skinAndSex("\u{1F9DA}", "Fairy");
const vampires = skinAndSex("\u{1F9DB}", "Vampire");
const merpeople = skinAndSex("\u{1F9DC}", "Merperson");
const elves = skinAndSex("\u{1F9DD}", "Elf");
const walking = skinAndSex("\u{1F6B6}", "Walking");
const standing = skinAndSex("\u{1F9CD}", "Standing");
const kneeling = skinAndSex("\u{1F9CE}", "Kneeling");
const runners = skinAndSex("\u{1F3C3}", "Running");

const gestures = g(
    e(gesturingOK.value, "Gestures"),
    frowners,
    pouters,
    gesturingNo,
    gesturingOK,
    tippingHand,
    raisingHand,
    bowing,
    facePalming,
    shrugging,
    cantHear,
    gettingMassage,
    gettingHaircut);


const baby = skin("\u{1F476}", "Baby");
const child = skin("\u{1F9D2}", "Child");
const boy = skin("\u{1F466}", "Boy");
const girl = skin("\u{1F467}", "Girl");
const children = g(child, child, boy, girl);


const blondes = skinAndSex("\u{1F471}", "Blond Person");
const person = skin("\u{1F9D1}", "Person", blondes.default, wearingTurban.default);

const beardedMan = skin("\u{1F9D4}", "Bearded Man");
const manInSuitLevitating = e("\u{1F574}\u{FE0F}", "Man in Suit, Levitating");
const manWithChineseCap = skin("\u{1F472}", "Man With Chinese Cap");
const manInTuxedo = skin("\u{1F935}", "Man in Tuxedo");
const man = skinAndHair("\u{1F468}", "Man",
    blondes.man,
    beardedMan,
    manInSuitLevitating,
    manWithChineseCap,
    wearingTurban.man,
    manInTuxedo);

const pregnantWoman = skin("\u{1F930}", "Pregnant Woman");
const breastFeeding = skin("\u{1F931}", "Breast-Feeding");
const womanWithHeadscarf = skin("\u{1F9D5}", "Woman With Headscarf");
const brideWithVeil = skin("\u{1F470}", "Bride With Veil");
const woman = skinAndHair("\u{1F469}", "Woman",
    blondes.woman,
    pregnantWoman,
    breastFeeding,
    womanWithHeadscarf,
    wearingTurban.woman,
    brideWithVeil);
const adults = g(
    e(person.value, "Adult"),
    person,
    man,
    woman);

const olderPerson = skin("\u{1F9D3}", "Older Person");
const oldMan = skin("\u{1F474}", "Old Man");
const oldWoman = skin("\u{1F475}", "Old Woman");
const olderPeople = g(olderPerson, olderPerson, oldMan, oldWoman);

const medical = e("\u{2695}\u{FE0F}", "Medical");
const healthCareWorkers = sym(medical, "Health Care");

const graduationCap = e("\u{1F393}", "Graduation Cap");
const students = sym(graduationCap, "Student");

const school = e("\u{1F3EB}", "School");
const teachers = sym(school, "Teacher");

const balanceScale = e("\u{2696}\u{FE0F}", "Balance Scale");
const judges = sym(balanceScale, "Judge");

const sheafOfRice = e("\u{1F33E}", "Sheaf of Rice");
const farmers = sym(sheafOfRice, "Farmer");

const cooking = e("\u{1F373}", "Cooking");
const cooks = sym(cooking, "Cook");

const wrench = e("\u{1F527}", "Wrench");
const mechanics = sym(wrench, "Mechanic");

const factory = e("\u{1F3ED}", "Factory");
const factoryWorkers = sym(factory, "Factory Worker");

const briefcase = e("\u{1F4BC}", "Briefcase");
const officeWorkers = sym(briefcase, "Office Worker");

const fireEngine = e("\u{1F692}", "Fire Engine");
const fireFighters = sym(fireEngine, "Fire Fighter");

const rocket = e("\u{1F680}", "Rocket");
const astronauts = sym(rocket, "Astronaut");

const airplane = e("\u{2708}\u{FE0F}", "Airplane");
const pilots = sym(airplane, "Pilot");

const artistPalette = e("\u{1F3A8}", "Artist Palette");
const artists = sym(artistPalette, "Artist");

const microphone = e("\u{1F3A4}", "Microphone");
const singers = sym(microphone, "Singer");

const laptop = e("\u{1F4BB}", "Laptop");
const technologists = sym(laptop, "Technologist");

const microscope = e("\u{1F52C}", "Microscope");
const scientists = sym(microscope, "Scientist");

const crown = e("\u{1F451}", "Crown");
const prince = skin("\u{1F934}", "Prince");
const princess = skin("\u{1F478}", "Princess");
const royalty = g(crown, prince, princess);

const roles = g(
    e("Roles", "Roles"),
    healthCareWorkers,
    students,
    teachers,
    judges,
    farmers,
    cooks,
    mechanics,
    factoryWorkers,
    officeWorkers,
    scientists,
    technologists,
    singers,
    artists,
    pilots,
    astronauts,
    fireFighters,
    spies,
    guards,
    constructionWorkers,
    royalty);

const cherub = skin("\u{1F47C}", "Cherub");
const santaClaus = skin("\u{1F385}", "Santa Claus");
const mrsClaus = skin("\u{1F936}", "Mrs. Claus");

const genies = sex(e("\u{1F9DE}", "Genie"));
const zombies = sex(e("\u{1F9DF}", "Zombie"));

const fantasy = [
    cherub,
    santaClaus,
    mrsClaus,
    superheroes,
    supervillains,
    mages,
    fairies,
    vampires,
    merpeople,
    elves,
    genies,
    zombies
];

const whiteCane = e("\u{1F9AF}", "Probing Cane");
const withProbingCane = sym(whiteCane, "Probing");

const motorizedWheelchair = e("\u{1F9BC}", "Motorized Wheelchair");
const inMotorizedWheelchair = sym(motorizedWheelchair, "In Motorized Wheelchair");

const manualWheelchair = e("\u{1F9BD}", "Manual Wheelchair");
const inManualWheelchair = sym(manualWheelchair, "In Manual Wheelchair");


const manDancing = skin("\u{1F57A}", "Man Dancing");
const womanDancing = skin("\u{1F483}", "Woman Dancing");
const dancers = g(e(manDancing.value, "Dancing"), manDancing, womanDancing);

const jugglers = skinAndSex("\u{1F939}", "Juggler");

const climbers = skinAndSex("\u{1F9D7}", "Climber");
const fencer = e("\u{1F93A}", "Fencer");
const jockeys = skin("\u{1F3C7}", "Jockey");
const skier = e("\u{26F7}\u{FE0F}", "Skier");
const snowboarders = skin("\u{1F3C2}", "Snowboarder");
const golfers = skinAndSex("\u{1F3CC}\u{FE0F}", "Golfer");
const surfers = skinAndSex("\u{1F3C4}", "Surfing");
const rowers = skinAndSex("\u{1F6A3}", "Rowing Boat");
const swimmers = skinAndSex("\u{1F3CA}", "Swimming");
const basketballers = skinAndSex("\u{26F9}\u{FE0F}", "Basket Baller");
const weightLifters = skinAndSex("\u{1F3CB}\u{FE0F}", "Weight Lifter");
const bikers = skinAndSex("\u{1F6B4}", "Biker");
const mountainBikers = skinAndSex("\u{1F6B5}", "Mountain Biker");
const cartwheelers = skinAndSex("\u{1F938}", "Cartwheeler");
const wrestlers = sex(e("\u{1F93C}", "Wrestler"));
const waterPoloers = skinAndSex("\u{1F93D}", "Water Polo Player");
const handBallers = skinAndSex("\u{1F93E}", "Hand Baller");

const inMotion = [
    walking,
    standing,
    kneeling,
    withProbingCane,
    inMotorizedWheelchair,
    inManualWheelchair,
    dancers,
    jugglers,
    climbers,
    fencer,
    jockeys,
    skier,
    snowboarders,
    golfers,
    surfers,
    rowers,
    swimmers,
    runners,
    basketballers,
    weightLifters,
    bikers,
    mountainBikers,
    cartwheelers,
    wrestlers,
    waterPoloers,
    handBallers
];

const inLotusPosition = skinAndSex("\u{1F9D8}", "In Lotus Position");
const inBath = skin("\u{1F6C0}", "In Bath");
const inBed = skin("\u{1F6CC}", "In Bed");
const inSauna = skinAndSex("\u{1F9D6}", "In Sauna");
const resting = [
    inLotusPosition,
    inBath,
    inBed,
    inSauna
];

const babies = g(baby, baby, cherub);
const people = g(
    e("People", "People"),
    babies,
    children,
    adults,
    olderPeople);

const allPeople = [
    people,
    gestures,
    inMotion,
    resting,
    roles,
    fantasy
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

const ogre = e("\u{1F479}", "Ogre");
const goblin = e("\u{1F47A}", "Goblin");
const ghost = e("\u{1F47B}", "Ghost");
const alien = e("\u{1F47D}", "Alien");
const alienMonster = e("\u{1F47E}", "Alien Monster");
const angryFaceWithHorns = e("\u{1F47F}", "Angry Face with Horns");
const skull = e("\u{1F480}", "Skull");
const pileOfPoo = e("\u{1F4A9}", "Pile of Poo");
const grinningFace = e("\u{1F600}", "Grinning Face");
const beamingFaceWithSmilingEyes = e("\u{1F601}", "Beaming Face with Smiling Eyes");
const faceWithTearsOfJoy = e("\u{1F602}", "Face with Tears of Joy");
const grinningFaceWithBigEyes = e("\u{1F603}", "Grinning Face with Big Eyes");
const grinningFaceWithSmilingEyes = e("\u{1F604}", "Grinning Face with Smiling Eyes");
const grinningFaceWithSweat = e("\u{1F605}", "Grinning Face with Sweat");
const grinningSquitingFace = e("\u{1F606}", "Grinning Squinting Face");
const smillingFaceWithHalo = e("\u{1F607}", "Smiling Face with Halo");
const smilingFaceWithHorns = e("\u{1F608}", "Smiling Face with Horns");
const winkingFace = e("\u{1F609}", "Winking Face");
const smilingFaceWithSmilingEyes = e("\u{1F60A}", "Smiling Face with Smiling Eyes");
const faceSavoringFood = e("\u{1F60B}", "Face Savoring Food");
const relievedFace = e("\u{1F60C}", "Relieved Face");
const smilingFaceWithHeartEyes = e("\u{1F60D}", "Smiling Face with Heart-Eyes");
const smilingFaceWithSunglasses = e("\u{1F60E}", "Smiling Face with Sunglasses");
const smirkingFace = e("\u{1F60F}", "Smirking Face");
const neutralFace = e("\u{1F610}", "Neutral Face");
const expressionlessFace = e("\u{1F611}", "Expressionless Face");
const unamusedFace = e("\u{1F612}", "Unamused Face");
const downcastFaceWithSweat = e("\u{1F613}", "Downcast Face with Sweat");
const pensiveFace = e("\u{1F614}", "Pensive Face");
const confusedFace = e("\u{1F615}", "Confused Face");
const confoundedFace = e("\u{1F616}", "Confounded Face");
const kissingFace = e("\u{1F617}", "Kissing Face");
const faceBlowingAKiss = e("\u{1F618}", "Face Blowing a Kiss");
const kissingFaceWithSmilingEyes = e("\u{1F619}", "Kissing Face with Smiling Eyes");
const kissingFaceWithClosedEyes = e("\u{1F61A}", "Kissing Face with Closed Eyes");
const faceWithTongue = e("\u{1F61B}", "Face with Tongue");
const winkingFaceWithTongue = e("\u{1F61C}", "Winking Face with Tongue");
const squintingFaceWithTongue = e("\u{1F61D}", "Squinting Face with Tongue");
const disappointedFace = e("\u{1F61E}", "Disappointed Face");
const worriedFace = e("\u{1F61F}", "Worried Face");
const angryFace = e("\u{1F620}", "Angry Face");
const poutingFace = e("\u{1F621}", "Pouting Face");
const cryingFace = e("\u{1F622}", "Crying Face");
const perseveringFace = e("\u{1F623}", "Persevering Face");
const faceWithSteamFromNose = e("\u{1F624}", "Face with Steam From Nose");
const sadButRelievedFace = e("\u{1F625}", "Sad but Relieved Face");
const frowningFaceWithOpenMouth = e("\u{1F626}", "Frowning Face with Open Mouth");
const anguishedFace = e("\u{1F627}", "Anguished Face");
const fearfulFace = e("\u{1F628}", "Fearful Face");
const wearyFace = e("\u{1F629}", "Weary Face");
const sleepyFace = e("\u{1F62A}", "Sleepy Face");
const tiredFace = e("\u{1F62B}", "Tired Face");
const grimacingFace = e("\u{1F62C}", "Grimacing Face");
const loudlyCryingFace = e("\u{1F62D}", "Loudly Crying Face");
const faceWithOpenMouth = e("\u{1F62E}", "Face with Open Mouth");
const hushedFace = e("\u{1F62F}", "Hushed Face");
const anxiousFaceWithSweat = e("\u{1F630}", "Anxious Face with Sweat");
const faceScreamingInFear = e("\u{1F631}", "Face Screaming in Fear");
const astonishedFace = e("\u{1F632}", "Astonished Face");
const flushedFace = e("\u{1F633}", "Flushed Face");
const sleepingFace = e("\u{1F634}", "Sleeping Face");
const dizzyFace = e("\u{1F635}", "Dizzy Face");
const faceWithoutMouth = e("\u{1F636}", "Face Without Mouth");
const faceWithMedicalMask = e("\u{1F637}", "Face with Medical Mask");
const grinningCatWithSmilingEyes = e("\u{1F638}", "Grinning Cat with Smiling Eyes");
const catWithTearsOfJoy = e("\u{1F639}", "Cat with Tears of Joy");
const grinningCat = e("\u{1F63A}", "Grinning Cat");
const smilingCatWithHeartEyes = e("\u{1F63B}", "Smiling Cat with Heart-Eyes");
const catWithWrySmile = e("\u{1F63C}", "Cat with Wry Smile");
const kissingCat = e("\u{1F63D}", "Kissing Cat");
const poutingCat = e("\u{1F63E}", "Pouting Cat");
const cryingCat = e("\u{1F63F}", "Crying Cat");
const wearyCat = e("\u{1F640}", "Weary Cat");
const slightlyFrowningFace = e("\u{1F641}", "Slightly Frowning Face");
const slightlySmilingFace = e("\u{1F642}", "Slightly Smiling Face");
const updisdeDownFace = e("\u{1F643}", "Upside-Down Face");
const faceWithRollingEyes = e("\u{1F644}", "Face with Rolling Eyes");
const seeNoEvilMonkey = e("\u{1F648}", "See-No-Evil Monkey");
const hearNoEvilMonkey = e("\u{1F649}", "Hear-No-Evil Monkey");
const speakNoEvilMonkey = e("\u{1F64A}", "Speak-No-Evil Monkey");
const zipperMouthFace = e("\u{1F910}", "Zipper-Mouth Face");
const moneyMouthFace = e("\u{1F911}", "Money-Mouth Face");
const faceWithThermometer = e("\u{1F912}", "Face with Thermometer");
const nerdFace = e("\u{1F913}", "Nerd Face");
const thinkingFace = e("\u{1F914}", "Thinking Face");
const faceWithHeadBandage = e("\u{1F915}", "Face with Head-Bandage");
const robot = e("\u{1F916}", "Robot");
const huggingFace = e("\u{1F917}", "Hugging Face");
const cowboyHatFace = e("\u{1F920}", "Cowboy Hat Face");
const clownFace = e("\u{1F921}", "Clown Face");
const nauseatedFace = e("\u{1F922}", "Nauseated Face");
const rollingOnTheFloorLaughing = e("\u{1F923}", "Rolling on the Floor Laughing");
const droolingFace = e("\u{1F924}", "Drooling Face");
const lyingFace = e("\u{1F925}", "Lying Face");
const sneezingFace = e("\u{1F927}", "Sneezing Face");
const faceWithRaisedEyebrow = e("\u{1F928}", "Face with Raised Eyebrow");
const starStruck = e("\u{1F929}", "Star-Struck");
const zanyFace = e("\u{1F92A}", "Zany Face");
const shushingFace = e("\u{1F92B}", "Shushing Face");
const faceWithSymbolsOnMouth = e("\u{1F92C}", "Face with Symbols on Mouth");
const faceWithHandOverMouth = e("\u{1F92D}", "Face with Hand Over Mouth");
const faceVomitting = e("\u{1F92E}", "Face Vomiting");
const explodingHead = e("\u{1F92F}", "Exploding Head");
const smilingFaceWithHearts = e("\u{1F970}", "Smiling Face with Hearts");
const yawningFace = e("\u{1F971}", "Yawning Face");
const smilingFaceWithTear = e("\u{1F972}", "Smiling Face with Tear");
const partyingFace = e("\u{1F973}", "Partying Face");
const woozyFace = e("\u{1F974}", "Woozy Face");
const hotFace = e("\u{1F975}", "Hot Face");
const coldFace = e("\u{1F976}", "Cold Face");
const disguisedFace = e("\u{1F978}", "Disguised Face");
const pleadingFace = e("\u{1F97A}", "Pleading Face");
const faceWithMonocle = e("\u{1F9D0}", "Face with Monocle");
const skullAndCrossbones = e("\u{2620}\u{FE0F}", "Skull and Crossbones");
const frowningFace = e("\u{2639}\u{FE0F}", "Frowning Face");
const fmilingFace = e("\u{263A}\u{FE0F}", "Smiling Face");
const speakingHead = e("\u{1F5E3}\u{FE0F}", "Speaking Head");
const bust = e("\u{1F464}", "Bust in Silhouette");
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

const kissMark = e("\u{1F48B}", "Kiss Mark");
const loveLetter = e("\u{1F48C}", "Love Letter");
const beatingHeart = e("\u{1F493}", "Beating Heart");
const brokenHeart = e("\u{1F494}", "Broken Heart");
const twoHearts = e("\u{1F495}", "Two Hearts");
const sparklingHeart = e("\u{1F496}", "Sparkling Heart");
const growingHeart = e("\u{1F497}", "Growing Heart");
const heartWithArrow = e("\u{1F498}", "Heart with Arrow");
const blueHeart = e("\u{1F499}", "Blue Heart");
const greenHeart = e("\u{1F49A}", "Green Heart");
const yellowHeart = e("\u{1F49B}", "Yellow Heart");
const purpleHeart = e("\u{1F49C}", "Purple Heart");
const heartWithRibbon = e("\u{1F49D}", "Heart with Ribbon");
const revolvingHearts = e("\u{1F49E}", "Revolving Hearts");
const heartDecoration = e("\u{1F49F}", "Heart Decoration");
const blackHeart = e("\u{1F5A4}", "Black Heart");
const whiteHeart = e("\u{1F90D}", "White Heart");
const brownHeart = e("\u{1F90E}", "Brown Heart");
const orangeHeart = e("\u{1F9E1}", "Orange Heart");
const heartExclamation = e("\u{2763}\u{FE0F}", "Heart Exclamation");
const redHeart = e("\u{2764}\u{FE0F}", "Red Heart");
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
    e("\u{1F4A2}", "Anger Symbol"),
    e("\u{1F4A3}", "Bomb"),
    e("\u{1F4A4}", "Zzz"),
    e("\u{1F4A5}", "Collision"),
    e("\u{1F4A6}", "Sweat Droplets"),
    e("\u{1F4A8}", "Dashing Away"),
    e("\u{1F4AB}", "Dizzy"),
    e("\u{1F4AC}", "Speech Balloon"),
    e("\u{1F4AD}", "Thought Balloon"),
    e("\u{1F4AF}", "Hundred Points"),
    e("\u{1F573}\u{FE0F}", "Hole"),
    e("\u{1F5E8}\u{FE0F}", "Left Speech Bubble"),
    e("\u{1F5EF}\u{FE0F}", "Right Anger Bubble"),
];

const hands = [
    e("\u{1F446}", "Backhand Index Pointing Up"),
    e("\u{1F447}", "Backhand Index Pointing Down"),
    e("\u{1F448}", "Backhand Index Pointing Left"),
    e("\u{1F449}", "Backhand Index Pointing Right"),
    e("\u{1F44A}", "Oncoming Fist"),
    e("\u{1F44B}", "Waving Hand"),
    e("\u{1F44C}", "OK Hand"),
    e("\u{1F44D}", "Thumbs Up"),
    e("\u{1F44E}", "Thumbs Down"),
    e("\u{1F44F}", "Clapping Hands"),
    e("\u{1F450}", "Open Hands"),
    e("\u{1F485}", "Nail Polish"),
    e("\u{1F590}\u{FE0F}", "Hand with Fingers Splayed"),
    e("\u{1F595}", "Middle Finger"),
    e("\u{1F596}", "Vulcan Salute"),
    e("\u{1F64C}", "Raising Hands"),
    e("\u{1F64F}", "Folded Hands"),
    e("\u{1F90C}", "Pinched Fingers"),
    e("\u{1F90F}", "Pinching Hand"),
    e("\u{1F918}", "Sign of the Horns"),
    e("\u{1F919}", "Call Me Hand"),
    e("\u{1F91A}", "Raised Back of Hand"),
    e("\u{1F91B}", "Left-Facing Fist"),
    e("\u{1F91C}", "Right-Facing Fist"),
    e("\u{1F91D}", "Handshake"),
    e("\u{1F91E}", "Crossed Fingers"),
    e("\u{1F91F}", "Love-You Gesture"),
    e("\u{1F932}", "Palms Up Together"),
    e("\u{261D}\u{FE0F}", "Index Pointing Up"),
    e("\u{270A}", "Raised Fist"),
    e("\u{270B}", "Raised Hand"),
    e("\u{270C}\u{FE0F}", "Victory Hand"),
    e("\u{270D}\u{FE0F}", "Writing Hand"),
];
const bodyParts = [
    e("\u{1F440}", "Eyes"),
    e("\u{1F441}\u{FE0F}", "Eye"),
    e("\u{1F441}\u{FE0F}\u{200D}\u{1F5E8}\u{FE0F}", "Eye in Speech Bubble"),
    e("\u{1F442}", "Ear"),
    e("\u{1F443}", "Nose"),
    e("\u{1F444}", "Mouth"),
    e("\u{1F445}", "Tongue"),
    e("\u{1F4AA}", "Flexed Biceps"),
    e("\u{1F933}", "Selfie"),
    e("\u{1F9B4}", "Bone"),
    e("\u{1F9B5}", "Leg"),
    e("\u{1F9B6}", "Foot"),
    e("\u{1F9B7}", "Tooth"),
    e("\u{1F9BB}", "Ear with Hearing Aid"),
    e("\u{1F9BE}", "Mechanical Arm"),
    e("\u{1F9BF}", "Mechanical Leg"),
    e("\u{1F9E0}", "Brain"),
    e("\u{1FAC0}", "Anatomical Heart"),
    e("\u{1FAC1}", "Lungs"),
];
const animals = [
    e("\u{1F400}", "Rat"),
    e("\u{1F401}", "Mouse"),
    e("\u{1F402}", "Ox"),
    e("\u{1F403}", "Water Buffalo"),
    e("\u{1F404}", "Cow"),
    e("\u{1F405}", "Tiger"),
    e("\u{1F406}", "Leopard"),
    e("\u{1F407}", "Rabbit"),
    e("\u{1F408}", "Cat"),
    e("\u{1F408}\u{200D}\u{2B1B}", "Black Cat"),
    e("\u{1F409}", "Dragon"),
    e("\u{1F40A}", "Crocodile"),
    e("\u{1F40B}", "Whale"),
    e("\u{1F40C}", "Snail"),
    e("\u{1F40D}", "Snake"),
    e("\u{1F40E}", "Horse"),
    e("\u{1F40F}", "Ram"),
    e("\u{1F410}", "Goat"),
    e("\u{1F411}", "Ewe"),
    e("\u{1F412}", "Monkey"),
    e("\u{1F413}", "Rooster"),
    e("\u{1F414}", "Chicken"),
    e("\u{1F415}", "Dog"),
    e("\u{1F415}\u{200D}\u{1F9BA}", "Service Dog"),
    e("\u{1F416}", "Pig"),
    e("\u{1F417}", "Boar"),
    e("\u{1F418}", "Elephant"),
    e("\u{1F419}", "Octopus"),
    e("\u{1F41A}", "Spiral Shell"),
    e("\u{1F41B}", "Bug"),
    e("\u{1F41C}", "Ant"),
    e("\u{1F41D}", "Honeybee"),
    e("\u{1F41E}", "Lady Beetle"),
    e("\u{1F41F}", "Fish"),
    e("\u{1F420}", "Tropical Fish"),
    e("\u{1F421}", "Blowfish"),
    e("\u{1F422}", "Turtle"),
    e("\u{1F423}", "Hatching Chick"),
    e("\u{1F424}", "Baby Chick"),
    e("\u{1F425}", "Front-Facing Baby Chick"),
    e("\u{1F426}", "Bird"),
    e("\u{1F427}", "Penguin"),
    e("\u{1F428}", "Koala"),
    e("\u{1F429}", "Poodle"),
    e("\u{1F42A}", "Camel"),
    e("\u{1F42B}", "Two-Hump Camel"),
    e("\u{1F42C}", "Dolphin"),
    e("\u{1F42D}", "Mouse Face"),
    e("\u{1F42E}", "Cow Face"),
    e("\u{1F42F}", "Tiger Face"),
    e("\u{1F430}", "Rabbit Face"),
    e("\u{1F431}", "Cat Face"),
    e("\u{1F432}", "Dragon Face"),
    e("\u{1F433}", "Spouting Whale"),
    e("\u{1F434}", "Horse Face"),
    e("\u{1F435}", "Monkey Face"),
    e("\u{1F436}", "Dog Face"),
    e("\u{1F437}", "Pig Face"),
    e("\u{1F438}", "Frog"),
    e("\u{1F439}", "Hamster"),
    e("\u{1F43A}", "Wolf"),
    e("\u{1F43B}", "Bear"),
    e("\u{1F43B}\u{200D}\u{2744}\u{FE0F}", "Polar Bear"),
    e("\u{1F43C}", "Panda"),
    e("\u{1F43D}", "Pig Nose"),
    e("\u{1F43E}", "Paw Prints"),
    e("\u{1F43F}\u{FE0F}", "Chipmunk"),
    e("\u{1F54A}\u{FE0F}", "Dove"),
    e("\u{1F577}\u{FE0F}", "Spider"),
    e("\u{1F578}\u{FE0F}", "Spider Web"),
    e("\u{1F981}", "Lion"),
    e("\u{1F982}", "Scorpion"),
    e("\u{1F983}", "Turkey"),
    e("\u{1F984}", "Unicorn"),
    e("\u{1F985}", "Eagle"),
    e("\u{1F986}", "Duck"),
    e("\u{1F987}", "Bat"),
    e("\u{1F988}", "Shark"),
    e("\u{1F989}", "Owl"),
    e("\u{1F98A}", "Fox"),
    e("\u{1F98B}", "Butterfly"),
    e("\u{1F98C}", "Deer"),
    e("\u{1F98D}", "Gorilla"),
    e("\u{1F98E}", "Lizard"),
    e("\u{1F98F}", "Rhinoceros"),
    e("\u{1F992}", "Giraffe"),
    e("\u{1F993}", "Zebra"),
    e("\u{1F994}", "Hedgehog"),
    e("\u{1F995}", "Sauropod"),
    e("\u{1F996}", "T-Rex"),
    e("\u{1F997}", "Cricket"),
    e("\u{1F998}", "Kangaroo"),
    e("\u{1F999}", "Llama"),
    e("\u{1F99A}", "Peacock"),
    e("\u{1F99B}", "Hippopotamus"),
    e("\u{1F99C}", "Parrot"),
    e("\u{1F99D}", "Raccoon"),
    e("\u{1F99F}", "Mosquito"),
    e("\u{1F9A0}", "Microbe"),
    e("\u{1F9A1}", "Badger"),
    e("\u{1F9A2}", "Swan"),
    e("\u{1F9A3}", "Mammoth"),
    e("\u{1F9A4}", "Dodo"),
    e("\u{1F9A5}", "Sloth"),
    e("\u{1F9A6}", "Otter"),
    e("\u{1F9A7}", "Orangutan"),
    e("\u{1F9A8}", "Skunk"),
    e("\u{1F9A9}", "Flamingo"),
    e("\u{1F9AB}", "Beaver"),
    e("\u{1F9AC}", "Bison"),
    e("\u{1F9AD}", "Seal"),
    e("\u{1F9AE}", "Guide Dog"),
    e("\u{1FAB0}", "Fly"),
    e("\u{1FAB1}", "Worm"),
    e("\u{1FAB2}", "Beetle"),
    e("\u{1FAB3}", "Cockroach"),
    e("\u{1FAB6}", "Feather"),
];
const whiteFlower = e("\u{1F4AE}", "White Flower");
const plants = [
    e("\u{1F331}", "Seedling"),
    e("\u{1F332}", "Evergreen Tree"),
    e("\u{1F333}", "Deciduous Tree"),
    e("\u{1F334}", "Palm Tree"),
    e("\u{1F335}", "Cactus"),
    e("\u{1F337}", "Tulip"),
    e("\u{1F338}", "Cherry Blossom"),
    e("\u{1F339}", "Rose"),
    e("\u{1F33A}", "Hibiscus"),
    e("\u{1F33B}", "Sunflower"),
    e("\u{1F33C}", "Blossom"),
    sheafOfRice,
    e("\u{1F33F}", "Herb"),
    e("\u{1F340}", "Four Leaf Clover"),
    e("\u{1F341}", "Maple Leaf"),
    e("\u{1F342}", "Fallen Leaf"),
    e("\u{1F343}", "Leaf Fluttering in Wind"),
    e("\u{1F3F5}\u{FE0F}", "Rosette"),
    e("\u{1F490}", "Bouquet"),
    whiteFlower,
    e("\u{1F940}", "Wilted Flower"),
    e("\u{1FAB4}", "Potted Plant"),
    e("\u{2618}\u{FE0F}", "Shamrock"),
];
const banana = e("\u{1F34C}", "Banana");
const food = [
    e("\u{1F32D}", "Hot Dog"),
    e("\u{1F32E}", "Taco"),
    e("\u{1F32F}", "Burrito"),
    e("\u{1F330}", "Chestnut"),
    e("\u{1F336}\u{FE0F}", "Hot Pepper"),
    e("\u{1F33D}", "Ear of Corn"),
    e("\u{1F344}", "Mushroom"),
    e("\u{1F345}", "Tomato"),
    e("\u{1F346}", "Eggplant"),
    e("\u{1F347}", "Grapes"),
    e("\u{1F348}", "Melon"),
    e("\u{1F349}", "Watermelon"),
    e("\u{1F34A}", "Tangerine"),
    e("\u{1F34B}", "Lemon"),
    banana,
    e("\u{1F34D}", "Pineapple"),
    e("\u{1F34E}", "Red Apple"),
    e("\u{1F34F}", "Green Apple"),
    e("\u{1F350}", "Pear"),
    e("\u{1F351}", "Peach"),
    e("\u{1F352}", "Cherries"),
    e("\u{1F353}", "Strawberry"),
    e("\u{1F354}", "Hamburger"),
    e("\u{1F355}", "Pizza"),
    e("\u{1F356}", "Meat on Bone"),
    e("\u{1F357}", "Poultry Leg"),
    e("\u{1F358}", "Rice Cracker"),
    e("\u{1F359}", "Rice Ball"),
    e("\u{1F35A}", "Cooked Rice"),
    e("\u{1F35B}", "Curry Rice"),
    e("\u{1F35C}", "Steaming Bowl"),
    e("\u{1F35D}", "Spaghetti"),
    e("\u{1F35E}", "Bread"),
    e("\u{1F35F}", "French Fries"),
    e("\u{1F360}", "Roasted Sweet Potato"),
    e("\u{1F361}", "Dango"),
    e("\u{1F362}", "Oden"),
    e("\u{1F363}", "Sushi"),
    e("\u{1F364}", "Fried Shrimp"),
    e("\u{1F365}", "Fish Cake with Swirl"),
    e("\u{1F371}", "Bento Box"),
    e("\u{1F372}", "Pot of Food"),
    cooking,
    e("\u{1F37F}", "Popcorn"),
    e("\u{1F950}", "Croissant"),
    e("\u{1F951}", "Avocado"),
    e("\u{1F952}", "Cucumber"),
    e("\u{1F953}", "Bacon"),
    e("\u{1F954}", "Potato"),
    e("\u{1F955}", "Carrot"),
    e("\u{1F956}", "Baguette Bread"),
    e("\u{1F957}", "Green Salad"),
    e("\u{1F958}", "Shallow Pan of Food"),
    e("\u{1F959}", "Stuffed Flatbread"),
    e("\u{1F95A}", "Egg"),
    e("\u{1F95C}", "Peanuts"),
    e("\u{1F95D}", "Kiwi Fruit"),
    e("\u{1F95E}", "Pancakes"),
    e("\u{1F95F}", "Dumpling"),
    e("\u{1F960}", "Fortune Cookie"),
    e("\u{1F961}", "Takeout Box"),
    e("\u{1F963}", "Bowl with Spoon"),
    e("\u{1F965}", "Coconut"),
    e("\u{1F966}", "Broccoli"),
    e("\u{1F968}", "Pretzel"),
    e("\u{1F969}", "Cut of Meat"),
    e("\u{1F96A}", "Sandwich"),
    e("\u{1F96B}", "Canned Food"),
    e("\u{1F96C}", "Leafy Green"),
    e("\u{1F96D}", "Mango"),
    e("\u{1F96E}", "Moon Cake"),
    e("\u{1F96F}", "Bagel"),
    e("\u{1F980}", "Crab"),
    e("\u{1F990}", "Shrimp"),
    e("\u{1F991}", "Squid"),
    e("\u{1F99E}", "Lobster"),
    e("\u{1F9AA}", "Oyster"),
    e("\u{1F9C0}", "Cheese Wedge"),
    e("\u{1F9C2}", "Salt"),
    e("\u{1F9C4}", "Garlic"),
    e("\u{1F9C5}", "Onion"),
    e("\u{1F9C6}", "Falafel"),
    e("\u{1F9C7}", "Waffle"),
    e("\u{1F9C8}", "Butter"),
    e("\u{1FAD0}", "Blueberries"),
    e("\u{1FAD1}", "Bell Pepper"),
    e("\u{1FAD2}", "Olive"),
    e("\u{1FAD3}", "Flatbread"),
    e("\u{1FAD4}", "Tamale"),
    e("\u{1FAD5}", "Fondue"),
];
const sweets = [
    e("\u{1F366}", "Soft Ice Cream"),
    e("\u{1F367}", "Shaved Ice"),
    e("\u{1F368}", "Ice Cream"),
    e("\u{1F369}", "Doughnut"),
    e("\u{1F36A}", "Cookie"),
    e("\u{1F36B}", "Chocolate Bar"),
    e("\u{1F36C}", "Candy"),
    e("\u{1F36D}", "Lollipop"),
    e("\u{1F36E}", "Custard"),
    e("\u{1F36F}", "Honey Pot"),
    e("\u{1F370}", "Shortcake"),
    e("\u{1F382}", "Birthday Cake"),
    e("\u{1F967}", "Pie"),
    e("\u{1F9C1}", "Cupcake"),
];
const drinks = [
    e("\u{1F375}", "Teacup Without Handle"),
    e("\u{1F376}", "Sake"),
    e("\u{1F377}", "Wine Glass"),
    e("\u{1F378}", "Cocktail Glass"),
    e("\u{1F379}", "Tropical Drink"),
    e("\u{1F37A}", "Beer Mug"),
    e("\u{1F37B}", "Clinking Beer Mugs"),
    e("\u{1F37C}", "Baby Bottle"),
    e("\u{1F37E}", "Bottle with Popping Cork"),
    e("\u{1F942}", "Clinking Glasses"),
    e("\u{1F943}", "Tumbler Glass"),
    e("\u{1F95B}", "Glass of Milk"),
    e("\u{1F964}", "Cup with Straw"),
    e("\u{1F9C3}", "Beverage Box"),
    e("\u{1F9C9}", "Mate"),
    e("\u{1F9CA}", "Ice"),
    e("\u{1F9CB}", "Bubble Tea"),
    e("\u{1FAD6}", "Teapot"),
    e("\u{2615}", "Hot Beverage"),
];
const utensils = [
    e("\u{1F374}", "Fork and Knife"),
    e("\u{1F37D}\u{FE0F}", "Fork and Knife with Plate"),
    e("\u{1F3FA}", "Amphora"),
    e("\u{1F52A}", "Kitchen Knife"),
    e("\u{1F944}", "Spoon"),
    e("\u{1F962}", "Chopsticks"),
];
const flags = [
    e("\u{1F38C}", "Crossed Flags"),
    e("\u{1F3C1}", "Chequered Flag"),
    e("\u{1F3F3}\u{FE0F}", "White Flag"),
    e("\u{1F3F3}\u{FE0F}\u{200D}\u{1F308}", "Rainbow Flag"),
    e("\u{1F3F3}\u{FE0F}\u{200D}\u{26A7}\u{FE0F}", "Transgender Flag"),
    e("\u{1F3F4}", "Black Flag"),
    e("\u{1F3F4}\u{200D}\u{2620}\u{FE0F}", "Pirate Flag"),
    e("\u{1F3F4}\u{E0067}\u{E0062}\u{E0065}\u{E006E}\u{E0067}\u{E007F}", "Flag: England"),
    e("\u{1F3F4}\u{E0067}\u{E0062}\u{E0073}\u{E0063}\u{E0074}\u{E007F}", "Flag: Scotland"),
    e("\u{1F3F4}\u{E0067}\u{E0062}\u{E0077}\u{E006C}\u{E0073}\u{E007F}", "Flag: Wales"),
    e("\u{1F6A9}", "Triangular Flag"),
];

const motorcycle = e("\u{1F3CD}\u{FE0F}", "Motorcycle");
const racingCar = e("\u{1F3CE}\u{FE0F}", "Racing Car");
const seat = e("\u{1F4BA}", "Seat");
const helicopter = e("\u{1F681}", "Helicopter");
const locomotive = e("\u{1F682}", "Locomotive");
const railwayCar = e("\u{1F683}", "Railway Car");
const highspeedTrain = e("\u{1F684}", "High-Speed Train");
const bulletTrain = e("\u{1F685}", "Bullet Train");
const train = e("\u{1F686}", "Train");
const metro = e("\u{1F687}", "Metro");
const lightRail = e("\u{1F688}", "Light Rail");
const station = e("\u{1F689}", "Station");
const tram = e("\u{1F68A}", "Tram");
const tramCar = e("\u{1F68B}", "Tram Car");
const bus = e("\u{1F68C}", "Bus");
const oncomingBus = e("\u{1F68D}", "Oncoming Bus");
const trolleyBus = e("\u{1F68E}", "Trolleybus");
const busStop = e("\u{1F68F}", "Bus Stop");
const miniBus = e("\u{1F690}", "Minibus");
const ambulance = e("\u{1F691}", "Ambulance");
const taxi = e("\u{1F695}", "Taxi");
const oncomingTaxi = e("\u{1F696}", "Oncoming Taxi");
const automobile = e("\u{1F697}", "Automobile");
const oncomingAutomobile = e("\u{1F698}", "Oncoming Automobile");
const sportUtilityVehicle = e("\u{1F699}", "Sport Utility Vehicle");
const deliveryTruck = e("\u{1F69A}", "Delivery Truck");
const articulatedLorry = e("\u{1F69B}", "Articulated Lorry");
const tractor = e("\u{1F69C}", "Tractor");
const monorail = e("\u{1F69D}", "Monorail");
const mountainRailway = e("\u{1F69E}", "Mountain Railway");
const suspensionRailway = e("\u{1F69F}", "Suspension Railway");
const mountainCableway = e("\u{1F6A0}", "Mountain Cableway");
const aerialTramway = e("\u{1F6A1}", "Aerial Tramway");
const ship = e("\u{1F6A2}", "Ship");
const speedBoat = e("\u{1F6A4}", "Speedboat");
const horizontalTrafficLight = e("\u{1F6A5}", "Horizontal Traffic Light");
const verticalTrafficLight = e("\u{1F6A6}", "Vertical Traffic Light");
const construction = e("\u{1F6A7}", "Construction");
const bicycle = e("\u{1F6B2}", "Bicycle");
const stopSign = e("\u{1F6D1}", "Stop Sign");
const oilDrum = e("\u{1F6E2}\u{FE0F}", "Oil Drum");
const motorway = e("\u{1F6E3}\u{FE0F}", "Motorway");
const railwayTrack = e("\u{1F6E4}\u{FE0F}", "Railway Track");
const motorBoat = e("\u{1F6E5}\u{FE0F}", "Motor Boat");
const smallAirplane = e("\u{1F6E9}\u{FE0F}", "Small Airplane");
const airplaneDeparture = e("\u{1F6EB}", "Airplane Departure");
const airplaneArrival = e("\u{1F6EC}", "Airplane Arrival");
const satellite = e("\u{1F6F0}\u{FE0F}", "Satellite");
const passengerShip = e("\u{1F6F3}\u{FE0F}", "Passenger Ship");
const kickScooter = e("\u{1F6F4}", "Kick Scooter");
const motorScooter = e("\u{1F6F5}", "Motor Scooter");
const canoe = e("\u{1F6F6}", "Canoe");
const flyingSaucer = e("\u{1F6F8}", "Flying Saucer");
const skateboard = e("\u{1F6F9}", "Skateboard");
const autoRickshaw = e("\u{1F6FA}", "Auto Rickshaw");
const pickupTruck = e("\u{1F6FB}", "Pickup Truck");
const rollerSkate = e("\u{1F6FC}", "Roller Skate");
const parachute = e("\u{1FA82}", "Parachute");
const anchor = e("\u{2693}", "Anchor");
const ferry = e("\u{26F4}\u{FE0F}", "Ferry");
const sailboat = e("\u{26F5}", "Sailboat");
const fuelPump = e("\u{26FD}", "Fuel Pump");
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
    e("\u{1F170}", "A Button (Blood Type)"),
    e("\u{1F171}", "B Button (Blood Type)"),
    e("\u{1F17E}", "O Button (Blood Type)"),
    e("\u{1F18E}", "AB Button (Blood Type)"),
];
const japanese = [
    e("\u{1F530}", "Japanese Symbol for Beginner"),
    e("\u{1F201}", "Japanese “Here” Button"),
    e("\u{1F202}\u{FE0F}", "Japanese “Service Charge” Button"),
    e("\u{1F21A}", "Japanese “Free of Charge” Button"),
    e("\u{1F22F}", "Japanese “Reserved” Button"),
    e("\u{1F232}", "Japanese “Prohibited” Button"),
    e("\u{1F233}", "Japanese “Vacancy” Button"),
    e("\u{1F234}", "Japanese “Passing Grade” Button"),
    e("\u{1F235}", "Japanese “No Vacancy” Button"),
    e("\u{1F236}", "Japanese “Not Free of Charge” Button"),
    e("\u{1F237}\u{FE0F}", "Japanese “Monthly Amount” Button"),
    e("\u{1F238}", "Japanese “Application” Button"),
    e("\u{1F239}", "Japanese “Discount” Button"),
    e("\u{1F23A}", "Japanese “Open for Business” Button"),
    e("\u{1F250}", "Japanese “Bargain” Button"),
    e("\u{1F251}", "Japanese “Acceptable” Button"),
    e("\u{3297}\u{FE0F}", "Japanese “Congratulations” Button"),
    e("\u{3299}\u{FE0F}", "Japanese “Secret” Button"),
];
const time = [
    e("\u{1F550}", "One O’Clock"),
    e("\u{1F551}", "Two O’Clock"),
    e("\u{1F552}", "Three O’Clock"),
    e("\u{1F553}", "Four O’Clock"),
    e("\u{1F554}", "Five O’Clock"),
    e("\u{1F555}", "Six O’Clock"),
    e("\u{1F556}", "Seven O’Clock"),
    e("\u{1F557}", "Eight O’Clock"),
    e("\u{1F558}", "Nine O’Clock"),
    e("\u{1F559}", "Ten O’Clock"),
    e("\u{1F55A}", "Eleven O’Clock"),
    e("\u{1F55B}", "Twelve O’Clock"),
    e("\u{1F55C}", "One-Thirty"),
    e("\u{1F55D}", "Two-Thirty"),
    e("\u{1F55E}", "Three-Thirty"),
    e("\u{1F55F}", "Four-Thirty"),
    e("\u{1F560}", "Five-Thirty"),
    e("\u{1F561}", "Six-Thirty"),
    e("\u{1F562}", "Seven-Thirty"),
    e("\u{1F563}", "Eight-Thirty"),
    e("\u{1F564}", "Nine-Thirty"),
    e("\u{1F565}", "Ten-Thirty"),
    e("\u{1F566}", "Eleven-Thirty"),
    e("\u{1F567}", "Twelve-Thirty"),
];
const clocks = [
    e("\u{1F570}\u{FE0F}", "Mantelpiece Clock"),
    e("\u{231A}", "Watch"),
    e("\u{23F0}", "Alarm Clock"),
    e("\u{23F1}\u{FE0F}", "Stopwatch"),
    e("\u{23F2}\u{FE0F}", "Timer Clock"),
    e("\u{231B}", "Hourglass Done"),
    e("\u{23F3}", "Hourglass Not Done"),
];
const downRightArrow = e("\u{2198}", "Down-Right Arrow");
const downRightArrowEmoji = e("\u{2198}\u{FE0F}", "Down-Right Arrow");
const arrows = [
    e("\u{1F503}\u{FE0F}", "Clockwise Vertical Arrows"),
    e("\u{1F504}\u{FE0F}", "Counterclockwise Arrows Button"),
    e("\u{2194}\u{FE0F}", "Left-Right Arrow"),
    e("\u{2195}\u{FE0F}", "Up-Down Arrow"),
    e("\u{2196}\u{FE0F}", "Up-Left Arrow"),
    e("\u{2197}\u{FE0F}", "Up-Right Arrow"),
    downRightArrowEmoji,
    e("\u{2199}\u{FE0F}", "Down-Left Arrow"),
    e("\u{21A9}\u{FE0F}", "Right Arrow Curving Left"),
    e("\u{21AA}\u{FE0F}", "Left Arrow Curving Right"),
    e("\u{27A1}\u{FE0F}", "Right Arrow"),
    e("\u{2934}\u{FE0F}", "Right Arrow Curving Up"),
    e("\u{2935}\u{FE0F}", "Right Arrow Curving Down"),
    e("\u{2B05}\u{FE0F}", "Left Arrow"),
    e("\u{2B06}\u{FE0F}", "Up Arrow"),
    e("\u{2B07}\u{FE0F}", "Down Arrow"),
];
const shapes = [
    e("\u{1F534}", "Red Circle"),
    e("\u{1F535}", "Blue Circle"),
    e("\u{1F536}", "Large Orange Diamond"),
    e("\u{1F537}", "Large Blue Diamond"),
    e("\u{1F538}", "Small Orange Diamond"),
    e("\u{1F539}", "Small Blue Diamond"),
    e("\u{1F53A}", "Red Triangle Pointed Up"),
    e("\u{1F53B}", "Red Triangle Pointed Down"),
    e("\u{1F7E0}", "Orange Circle"),
    e("\u{1F7E1}", "Yellow Circle"),
    e("\u{1F7E2}", "Green Circle"),
    e("\u{1F7E3}", "Purple Circle"),
    e("\u{1F7E4}", "Brown Circle"),
    e("\u{2B55}", "Hollow Red Circle"),
    e("\u{26AA}", "White Circle"),
    e("\u{26AB}", "Black Circle"),
    e("\u{1F7E5}", "Red Square"),
    e("\u{1F7E6}", "Blue Square"),
    e("\u{1F7E7}", "Orange Square"),
    e("\u{1F7E8}", "Yellow Square"),
    e("\u{1F7E9}", "Green Square"),
    e("\u{1F7EA}", "Purple Square"),
    e("\u{1F7EB}", "Brown Square"),
    e("\u{1F532}", "Black Square Button"),
    e("\u{1F533}", "White Square Button"),
    e("\u{25AA}\u{FE0F}", "Black Small Square"),
    e("\u{25AB}\u{FE0F}", "White Small Square"),
    e("\u{25FD}", "White Medium-Small Square"),
    e("\u{25FE}", "Black Medium-Small Square"),
    e("\u{25FB}\u{FE0F}", "White Medium Square"),
    e("\u{25FC}\u{FE0F}", "Black Medium Square"),
    e("\u{2B1B}", "Black Large Square"),
    e("\u{2B1C}", "White Large Square"),
    e("\u{2B50}", "Star"),
    e("\u{1F4A0}", "Diamond with a Dot")
];
const shuffleTracksButton = e("\u{1F500}", "Shuffle Tracks Button");
const repeatButton = e("\u{1F501}", "Repeat Button");
const repeatSingleButton = e("\u{1F502}", "Repeat Single Button");
const upwardsButton = e("\u{1F53C}", "Upwards Button");
const downwardsButton = e("\u{1F53D}", "Downwards Button");
const reverseButton = e("\u{25C0}\u{FE0F}", "Reverse Button");
const ejectButton = e("\u{23CF}\u{FE0F}", "Eject Button");
const fastForwardButton = e("\u{23E9}", "Fast-Forward Button");
const fastReverseButton = e("\u{23EA}", "Fast Reverse Button");
const fastUpButton = e("\u{23EB}", "Fast Up Button");
const fastDownButton = e("\u{23EC}", "Fast Down Button");
const nextTrackButton = e("\u{23ED}\u{FE0F}", "Next Track Button");
const lastTrackButton = e("\u{23EE}\u{FE0F}", "Last Track Button");
const playOrPauseButton = e("\u{23EF}\u{FE0F}", "Play or Pause Button");
const pauseButton = e("\u{23F8}\u{FE0F}", "Pause Button");
const stopButton = e("\u{23F9}\u{FE0F}", "Stop Button");
const recordButton = e("\u{23FA}\u{FE0F}", "Record Button");
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
    e("\u{2648}", "Aries"),
    e("\u{2649}", "Taurus"),
    e("\u{264A}", "Gemini"),
    e("\u{264B}", "Cancer"),
    e("\u{264C}", "Leo"),
    e("\u{264D}", "Virgo"),
    e("\u{264E}", "Libra"),
    e("\u{264F}", "Scorpio"),
    e("\u{2650}", "Sagittarius"),
    e("\u{2651}", "Capricorn"),
    e("\u{2652}", "Aquarius"),
    e("\u{2653}", "Pisces"),
    e("\u{26CE}", "Ophiuchus"),
];
const math = [
    e("\u{2716}\u{FE0F}", "Multiply"),
    e("\u{2795}", "Plus"),
    e("\u{2796}", "Minus"),
    e("\u{2797}", "Divide"),
];
const games = [
    e("\u{2660}\u{FE0F}", "Spade Suit"),
    e("\u{2663}\u{FE0F}", "Club Suit"),
    Object.assign(e("\u{2665}\u{FE0F}", "Heart Suit"), { color: "red" }),
    Object.assign(e("\u{2666}\u{FE0F}", "Diamond Suit"), { color: "red" }),
    e("\u{1F004}", "Mahjong Red Dragon"),
    e("\u{1F0CF}", "Joker"),
    e("\u{1F3AF}", "Direct Hit"),
    e("\u{1F3B0}", "Slot Machine"),
    e("\u{1F3B1}", "Pool 8 Ball"),
    e("\u{1F3B2}", "Game Die"),
    e("\u{1F3B3}", "Bowling"),
    e("\u{1F3B4}", "Flower Playing Cards"),
    e("\u{1F9E9}", "Puzzle Piece"),
    e("\u{265F}\u{FE0F}", "Chess Pawn"),
    e("\u{1FA80}", "Yo-Yo"),
    e("\u{1FA81}", "Kite"),
    e("\u{1FA83}", "Boomerang"),
    e("\u{1FA86}", "Nesting Dolls"),
];
const sportsEquipment = [
    e("\u{1F3BD}", "Running Shirt"),
    e("\u{1F3BE}", "Tennis"),
    e("\u{1F3BF}", "Skis"),
    e("\u{1F3C0}", "Basketball"),
    e("\u{1F3C5}", "Sports Medal"),
    e("\u{1F3C6}", "Trophy"),
    e("\u{1F3C8}", "American Football"),
    e("\u{1F3C9}", "Rugby Football"),
    e("\u{1F3CF}", "Cricket Game"),
    e("\u{1F3D0}", "Volleyball"),
    e("\u{1F3D1}", "Field Hockey"),
    e("\u{1F3D2}", "Ice Hockey"),
    e("\u{1F3D3}", "Ping Pong"),
    e("\u{1F3F8}", "Badminton"),
    e("\u{1F6F7}", "Sled"),
    e("\u{1F945}", "Goal Net"),
    e("\u{1F947}", "1st Place Medal"),
    e("\u{1F948}", "2nd Place Medal"),
    e("\u{1F949}", "3rd Place Medal"),
    e("\u{1F94A}", "Boxing Glove"),
    e("\u{1F94C}", "Curling Stone"),
    e("\u{1F94D}", "Lacrosse"),
    e("\u{1F94E}", "Softball"),
    e("\u{1F94F}", "Flying Disc"),
    e("\u{26BD}", "Soccer Ball"),
    e("\u{26BE}", "Baseball"),
    e("\u{26F8}\u{FE0F}", "Ice Skate"),
];
const clothing = [
    e("\u{1F3A9}", "Top Hat"),
    e("\u{1F93F}", "Diving Mask"),
    e("\u{1F452}", "Woman’s Hat"),
    e("\u{1F453}", "Glasses"),
    e("\u{1F576}\u{FE0F}", "Sunglasses"),
    e("\u{1F454}", "Necktie"),
    e("\u{1F455}", "T-Shirt"),
    e("\u{1F456}", "Jeans"),
    e("\u{1F457}", "Dress"),
    e("\u{1F458}", "Kimono"),
    e("\u{1F459}", "Bikini"),
    e("\u{1F45A}", "Woman’s Clothes"),
    e("\u{1F45B}", "Purse"),
    e("\u{1F45C}", "Handbag"),
    e("\u{1F45D}", "Clutch Bag"),
    e("\u{1F45E}", "Man’s Shoe"),
    e("\u{1F45F}", "Running Shoe"),
    e("\u{1F460}", "High-Heeled Shoe"),
    e("\u{1F461}", "Woman’s Sandal"),
    e("\u{1F462}", "Woman’s Boot"),
    e("\u{1F94B}", "Martial Arts Uniform"),
    e("\u{1F97B}", "Sari"),
    e("\u{1F97C}", "Lab Coat"),
    e("\u{1F97D}", "Goggles"),
    e("\u{1F97E}", "Hiking Boot"),
    e("\u{1F97F}", "Flat Shoe"),
    whiteCane,
    e("\u{1F9BA}", "Safety Vest"),
    e("\u{1F9E2}", "Billed Cap"),
    e("\u{1F9E3}", "Scarf"),
    e("\u{1F9E4}", "Gloves"),
    e("\u{1F9E5}", "Coat"),
    e("\u{1F9E6}", "Socks"),
    e("\u{1F9FF}", "Nazar Amulet"),
    e("\u{1FA70}", "Ballet Shoes"),
    e("\u{1FA71}", "One-Piece Swimsuit"),
    e("\u{1FA72}", "Briefs"),
    e("\u{1FA73}", "Shorts"),
    e("\u{1FA74}", "Thong Sandal"),
];
const town = [
    e("\u{1F3D7}\u{FE0F}", "Building Construction"),
    e("\u{1F3D8}\u{FE0F}", "Houses"),
    e("\u{1F3D9}\u{FE0F}", "Cityscape"),
    e("\u{1F3DA}\u{FE0F}", "Derelict House"),
    e("\u{1F3DB}\u{FE0F}", "Classical Building"),
    e("\u{1F3DC}\u{FE0F}", "Desert"),
    e("\u{1F3DD}\u{FE0F}", "Desert Island"),
    e("\u{1F3DE}\u{FE0F}", "National Park"),
    e("\u{1F3DF}\u{FE0F}", "Stadium"),
    e("\u{1F3E0}", "House"),
    e("\u{1F3E1}", "House with Garden"),
    e("\u{1F3E2}", "Office Building"),
    e("\u{1F3E3}", "Japanese Post Office"),
    e("\u{1F3E4}", "Post Office"),
    e("\u{1F3E5}", "Hospital"),
    e("\u{1F3E6}", "Bank"),
    e("\u{1F3E7}", "ATM Sign"),
    e("\u{1F3E8}", "Hotel"),
    e("\u{1F3E9}", "Love Hotel"),
    e("\u{1F3EA}", "Convenience Store"),
    school,
    e("\u{1F3EC}", "Department Store"),
    factory,
    e("\u{1F309}", "Bridge at Night"),
    e("\u{26F2}", "Fountain"),
    e("\u{1F6CD}\u{FE0F}", "Shopping Bags"),
    e("\u{1F9FE}", "Receipt"),
    e("\u{1F6D2}", "Shopping Cart"),
    e("\u{1F488}", "Barber Pole"),
    e("\u{1F492}", "Wedding"),
    e("\u{1F6D6}", "Hut"),
    e("\u{1F6D7}", "Elevator"),
    e("\u{1F5F3}\u{FE0F}", "Ballot Box with Ballot")
];
const buttons = [
    e("\u{1F191}", "CL Button"),
    e("\u{1F192}", "Cool Button"),
    e("\u{1F193}", "Free Button"),
    e("\u{1F194}", "ID Button"),
    e("\u{1F195}", "New Button"),
    e("\u{1F196}", "NG Button"),
    e("\u{1F197}", "OK Button"),
    e("\u{1F198}", "SOS Button"),
    e("\u{1F199}", "Up! Button"),
    e("\u{1F19A}", "Vs Button"),
    e("\u{1F518}", "Radio Button"),
    e("\u{1F519}", "Back Arrow"),
    e("\u{1F51A}", "End Arrow"),
    e("\u{1F51B}", "On! Arrow"),
    e("\u{1F51C}", "Soon Arrow"),
    e("\u{1F51D}", "Top Arrow"),
    e("\u{2611}\u{FE0F}", "Check Box with Check"),
    e("\u{1F520}", "Input Latin Uppercase"),
    e("\u{1F521}", "Input Latin Lowercase"),
    e("\u{1F522}", "Input Numbers"),
    e("\u{1F523}", "Input Symbols"),
    e("\u{1F524}", "Input Latin Letters"),
];
const music = [
    e("\u{1F3BC}", "Musical Score"),
    e("\u{1F3B6}", "Musical Notes"),
    e("\u{1F3B5}", "Musical Note"),
    e("\u{1F3B7}", "Saxophone"),
    e("\u{1F3B8}", "Guitar"),
    e("\u{1F3B9}", "Musical Keyboard"),
    e("\u{1F3BA}", "Trumpet"),
    e("\u{1F3BB}", "Violin"),
    e("\u{1F941}", "Drum"),
    e("\u{1FA95}", "Banjo"),
    e("\u{1FA97}", "Accordion"),
    e("\u{1FA98}", "Long Drum"),
];
const weather = [
    e("\u{1F304}", "Sunrise Over Mountains"),
    e("\u{1F305}", "Sunrise"),
    e("\u{1F306}", "Cityscape at Dusk"),
    e("\u{1F307}", "Sunset"),
    e("\u{1F303}", "Night with Stars"),
    e("\u{1F302}", "Closed Umbrella"),
    e("\u{2602}\u{FE0F}", "Umbrella"),
    e("\u{2614}\u{FE0F}", "Umbrella with Rain Drops"),
    e("\u{2603}\u{FE0F}", "Snowman"),
    e("\u{26C4}", "Snowman Without Snow"),
    e("\u{2600}\u{FE0F}", "Sun"),
    e("\u{2601}\u{FE0F}", "Cloud"),
    e("\u{1F324}\u{FE0F}", "Sun Behind Small Cloud"),
    e("\u{26C5}", "Sun Behind Cloud"),
    e("\u{1F325}\u{FE0F}", "Sun Behind Large Cloud"),
    e("\u{1F326}\u{FE0F}", "Sun Behind Rain Cloud"),
    e("\u{1F327}\u{FE0F}", "Cloud with Rain"),
    e("\u{1F328}\u{FE0F}", "Cloud with Snow"),
    e("\u{1F329}\u{FE0F}", "Cloud with Lightning"),
    e("\u{26C8}\u{FE0F}", "Cloud with Lightning and Rain"),
    e("\u{2744}\u{FE0F}", "Snowflake"),
    e("\u{1F300}", "Cyclone"),
    e("\u{1F32A}\u{FE0F}", "Tornado"),
    e("\u{1F32C}\u{FE0F}", "Wind Face"),
    e("\u{1F30A}", "Water Wave"),
    e("\u{1F32B}\u{FE0F}", "Fog"),
    e("\u{1F301}", "Foggy"),
    e("\u{1F308}", "Rainbow"),
    e("\u{1F321}\u{FE0F}", "Thermometer"),
];
const astro = [
    e("\u{1F30C}", "Milky Way"),
    e("\u{1F30D}", "Globe Showing Europe-Africa"),
    e("\u{1F30E}", "Globe Showing Americas"),
    e("\u{1F30F}", "Globe Showing Asia-Australia"),
    e("\u{1F310}", "Globe with Meridians"),
    e("\u{1F311}", "New Moon"),
    e("\u{1F312}", "Waxing Crescent Moon"),
    e("\u{1F313}", "First Quarter Moon"),
    e("\u{1F314}", "Waxing Gibbous Moon"),
    e("\u{1F315}", "Full Moon"),
    e("\u{1F316}", "Waning Gibbous Moon"),
    e("\u{1F317}", "Last Quarter Moon"),
    e("\u{1F318}", "Waning Crescent Moon"),
    e("\u{1F319}", "Crescent Moon"),
    e("\u{1F31A}", "New Moon Face"),
    e("\u{1F31B}", "First Quarter Moon Face"),
    e("\u{1F31C}", "Last Quarter Moon Face"),
    e("\u{1F31D}", "Full Moon Face"),
    e("\u{1F31E}", "Sun with Face"),
    e("\u{1F31F}", "Glowing Star"),
    e("\u{1F320}", "Shooting Star"),
    e("\u{2604}\u{FE0F}", "Comet"),
    e("\u{1FA90}", "Ringed Planet"),
];
const finance = [
    e("\u{1F4B0}", "Money Bag"),
    e("\u{1F4B1}", "Currency Exchange"),
    e("\u{1F4B2}", "Heavy Dollar Sign"),
    e("\u{1F4B3}", "Credit Card"),
    e("\u{1F4B4}", "Yen Banknote"),
    e("\u{1F4B5}", "Dollar Banknote"),
    e("\u{1F4B6}", "Euro Banknote"),
    e("\u{1F4B7}", "Pound Banknote"),
    e("\u{1F4B8}", "Money with Wings"),
    e("\u{1F4B9}", "Chart Increasing with Yen"),
    e("\u{1FA99}", "Coin"),
];
const writing = [
    e("\u{1F58A}\u{FE0F}", "Pen"),
    e("\u{1F58B}\u{FE0F}", "Fountain Pen"),
    e("\u{1F58C}\u{FE0F}", "Paintbrush"),
    e("\u{1F58D}\u{FE0F}", "Crayon"),
    e("\u{270F}\u{FE0F}", "Pencil"),
    e("\u{2712}\u{FE0F}", "Black Nib"),
];
const droplet = e("\u{1F4A7}", "Droplet");
const dropOfBlood = e("\u{1FA78}", "Drop of Blood");
const adhesiveBandage = e("\u{1FA79}", "Adhesive Bandage");
const stehoscope = e("\u{1FA7A}", "Stethoscope");
const syringe = e("\u{1F489}", "Syringe");
const pill = e("\u{1F48A}", "Pill");
const testTube = e("\u{1F9EA}", "Test Tube");
const petriDish = e("\u{1F9EB}", "Petri Dish");
const dna = e("\u{1F9EC}", "DNA");
const abacus = e("\u{1F9EE}", "Abacus");
const magnet = e("\u{1F9F2}", "Magnet");
const telescope = e("\u{1F52D}", "Telescope");
const alembic = e("\u{2697}\u{FE0F}", "Alembic");
const gear = e("\u{2699}\u{FE0F}", "Gear");
const atomSymbol = e("\u{269B}\u{FE0F}", "Atom Symbol");
const keyboard = e("\u{2328}\u{FE0F}", "Keyboard");
const telephone = e("\u{260E}\u{FE0F}", "Telephone");
const studioMicrophone = e("\u{1F399}\u{FE0F}", "Studio Microphone");
const levelSlider = e("\u{1F39A}\u{FE0F}", "Level Slider");
const controlKnobs = e("\u{1F39B}\u{FE0F}", "Control Knobs");
const movieCamera = e("\u{1F3A5}", "Movie Camera");
const headphone = e("\u{1F3A7}", "Headphone");
const videoGame = e("\u{1F3AE}", "Video Game");
const lightBulb = e("\u{1F4A1}", "Light Bulb");
const computerDisk = e("\u{1F4BD}", "Computer Disk");
const floppyDisk = e("\u{1F4BE}", "Floppy Disk");
const opticalDisk = e("\u{1F4BF}", "Optical Disk");
const dvd = e("\u{1F4C0}", "DVD");
const telephoneReceiver = e("\u{1F4DE}", "Telephone Receiver");
const pager = e("\u{1F4DF}", "Pager");
const faxMachine = e("\u{1F4E0}", "Fax Machine");
const satelliteAntenna = e("\u{1F4E1}", "Satellite Antenna");
const loudspeaker = e("\u{1F4E2}", "Loudspeaker");
const megaphone = e("\u{1F4E3}", "Megaphone");
const mobilePhone = e("\u{1F4F1}", "Mobile Phone");
const mobilePhoneWithArrow = e("\u{1F4F2}", "Mobile Phone with Arrow");
const mobilePhoneVibrating = e("\u{1F4F3}", "Mobile Phone Vibrating");
const mobilePhoneOff = e("\u{1F4F4}", "Mobile Phone Off");
const noMobilePhone = e("\u{1F4F5}", "No Mobile Phone");
const antennaBars = e("\u{1F4F6}", "Antenna Bars");
const camera = e("\u{1F4F7}", "Camera");
const cameraWithFlash = e("\u{1F4F8}", "Camera with Flash");
const videoCamera = e("\u{1F4F9}", "Video Camera");
const television = e("\u{1F4FA}", "Television");
const radio = e("\u{1F4FB}", "Radio");
const videocassette = e("\u{1F4FC}", "Videocassette");
const filmProjector = e("\u{1F4FD}\u{FE0F}", "Film Projector");
const dimButton = e("\u{1F505}", "Dim Button");
const brightButton = e("\u{1F506}", "Bright Button");
const mutedSpeaker = e("\u{1F507}", "Muted Speaker");
const speakerLowVolume = e("\u{1F508}", "Speaker Low Volume");
const speakerMediumVolume = e("\u{1F509}", "Speaker Medium Volume");
const speakerHighVolume = e("\u{1F50A}", "Speaker High Volume");
const battery = e("\u{1F50B}", "Battery");
const electricPlug = e("\u{1F50C}", "Electric Plug");
const magnifyingGlassTiltedLeft = e("\u{1F50D}", "Magnifying Glass Tilted Left");
const magnifyingGlassTiltedRight = e("\u{1F50E}", "Magnifying Glass Tilted Right");
const lockedWithPen = e("\u{1F50F}", "Locked with Pen");
const lockedWithKey = e("\u{1F510}", "Locked with Key");
const key = e("\u{1F511}", "Key");
const locked = e("\u{1F512}", "Locked");
const unlocked = e("\u{1F513}", "Unlocked");
const bell = e("\u{1F514}", "Bell");
const bellWithSlash = e("\u{1F515}", "Bell with Slash");
const bookmark = e("\u{1F516}", "Bookmark");
const link = e("\u{1F517}", "Link");
const joystick = e("\u{1F579}\u{FE0F}", "Joystick");
const desktopComputer = e("\u{1F5A5}\u{FE0F}", "Desktop Computer");
const printer = e("\u{1F5A8}\u{FE0F}", "Printer");
const computerMouse = e("\u{1F5B1}\u{FE0F}", "Computer Mouse");
const trackball = e("\u{1F5B2}\u{FE0F}", "Trackball");
const clamp$1 = e("\u{1F5DC}", "Compression");
const oldKey = e("\u{1F5DD}", "Old Key");
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
    filmProjector,
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
    mobilePhoneVibrating,
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
    e("\u{1F4E4}", "Outbox Tray"),
    e("\u{1F4E5}", "Inbox Tray"),
    e("\u{1F4E6}", "Package"),
    e("\u{1F4E7}", "E-Mail"),
    e("\u{1F4E8}", "Incoming Envelope"),
    e("\u{1F4E9}", "Envelope with Arrow"),
    e("\u{1F4EA}", "Closed Mailbox with Lowered Flag"),
    e("\u{1F4EB}", "Closed Mailbox with Raised Flag"),
    e("\u{1F4EC}", "Open Mailbox with Raised Flag"),
    e("\u{1F4ED}", "Open Mailbox with Lowered Flag"),
    e("\u{1F4EE}", "Postbox"),
    e("\u{1F4EF}", "Postal Horn"),
];
const celebration = [
    e("\u{1FA85}", "Piñata"),
    e("\u{1F380}", "Ribbon"),
    e("\u{1F381}", "Wrapped Gift"),
    e("\u{1F383}", "Jack-O-Lantern"),
    e("\u{1F384}", "Christmas Tree"),
    e("\u{1F9E8}", "Firecracker"),
    e("\u{1F386}", "Fireworks"),
    e("\u{1F387}", "Sparkler"),
    e("\u{2728}", "Sparkles"),
    e("\u{2747}\u{FE0F}", "Sparkle"),
    e("\u{1F388}", "Balloon"),
    e("\u{1F389}", "Party Popper"),
    e("\u{1F38A}", "Confetti Ball"),
    e("\u{1F38B}", "Tanabata Tree"),
    e("\u{1F38D}", "Pine Decoration"),
    e("\u{1F38E}", "Japanese Dolls"),
    e("\u{1F38F}", "Carp Streamer"),
    e("\u{1F390}", "Wind Chime"),
    e("\u{1F391}", "Moon Viewing Ceremony"),
    e("\u{1F392}", "Backpack"),
    graduationCap,
    e("\u{1F9E7}", "Red Envelope"),
    e("\u{1F3EE}", "Red Paper Lantern"),
    e("\u{1F396}\u{FE0F}", "Military Medal"),
];

const tools = [
    e("\u{1F3A3}", "Fishing Pole"),
    e("\u{1F526}", "Flashlight"),
    wrench,
    e("\u{1F528}", "Hammer"),
    e("\u{1F529}", "Nut and Bolt"),
    e("\u{1F6E0}\u{FE0F}", "Hammer and Wrench"),
    e("\u{1F9ED}", "Compass"),
    e("\u{1F9EF}", "Fire Extinguisher"),
    e("\u{1F9F0}", "Toolbox"),
    e("\u{1F9F1}", "Brick"),
    e("\u{1FA93}", "Axe"),
    e("\u{2692}\u{FE0F}", "Hammer and Pick"),
    e("\u{26CF}\u{FE0F}", "Pick"),
    e("\u{26D1}\u{FE0F}", "Rescue Worker’s Helmet"),
    e("\u{26D3}\u{FE0F}", "Chains"),
    clamp$1,
    e("\u{1FA9A}", "Carpentry Saw"),
    e("\u{1FA9B}", "Screwdriver"),
    e("\u{1FA9C}", "Ladder"),
    e("\u{1FA9D}", "Hook"),
];
const office = [
    e("\u{1F4C1}", "File Folder"),
    e("\u{1F4C2}", "Open File Folder"),
    e("\u{1F4C3}", "Page with Curl"),
    e("\u{1F4C4}", "Page Facing Up"),
    e("\u{1F4C5}", "Calendar"),
    e("\u{1F4C6}", "Tear-Off Calendar"),
    e("\u{1F4C7}", "Card Index"),
    e("\u{1F5C2}\u{FE0F}", "Card Index Dividers"),
    e("\u{1F5C3}\u{FE0F}", "Card File Box"),
    e("\u{1F5C4}\u{FE0F}", "File Cabinet"),
    e("\u{1F5D1}\u{FE0F}", "Wastebasket"),
    e("\u{1F5D2}\u{FE0F}", "Spiral Notepad"),
    e("\u{1F5D3}\u{FE0F}", "Spiral Calendar"),
    e("\u{1F4C8}", "Chart Increasing"),
    e("\u{1F4C9}", "Chart Decreasing"),
    e("\u{1F4CA}", "Bar Chart"),
    e("\u{1F4CB}", "Clipboard"),
    e("\u{1F4CC}", "Pushpin"),
    e("\u{1F4CD}", "Round Pushpin"),
    e("\u{1F4CE}", "Paperclip"),
    e("\u{1F587}\u{FE0F}", "Linked Paperclips"),
    e("\u{1F4CF}", "Straight Ruler"),
    e("\u{1F4D0}", "Triangular Ruler"),
    e("\u{1F4D1}", "Bookmark Tabs"),
    e("\u{1F4D2}", "Ledger"),
    e("\u{1F4D3}", "Notebook"),
    e("\u{1F4D4}", "Notebook with Decorative Cover"),
    e("\u{1F4D5}", "Closed Book"),
    e("\u{1F4D6}", "Open Book"),
    e("\u{1F4D7}", "Green Book"),
    e("\u{1F4D8}", "Blue Book"),
    e("\u{1F4D9}", "Orange Book"),
    e("\u{1F4DA}", "Books"),
    e("\u{1F4DB}", "Name Badge"),
    e("\u{1F4DC}", "Scroll"),
    e("\u{1F4DD}", "Memo"),
    e("\u{2702}\u{FE0F}", "Scissors"),
    e("\u{2709}\u{FE0F}", "Envelope"),
];
const signs = [
    e("\u{1F3A6}", "Cinema"),
    noMobilePhone,
    e("\u{1F51E}", "No One Under Eighteen"),
    e("\u{1F6AB}", "Prohibited"),
    e("\u{1F6AC}", "Cigarette"),
    e("\u{1F6AD}", "No Smoking"),
    e("\u{1F6AE}", "Litter in Bin Sign"),
    e("\u{1F6AF}", "No Littering"),
    e("\u{1F6B0}", "Potable Water"),
    e("\u{1F6B1}", "Non-Potable Water"),
    e("\u{1F6B3}", "No Bicycles"),
    e("\u{1F6B7}", "No Pedestrians"),
    e("\u{1F6B8}", "Children Crossing"),
    e("\u{1F6B9}", "Men’s Room"),
    e("\u{1F6BA}", "Women’s Room"),
    e("\u{1F6BB}", "Restroom"),
    e("\u{1F6BC}", "Baby Symbol"),
    e("\u{1F6BE}", "Water Closet"),
    e("\u{1F6C2}", "Passport Control"),
    e("\u{1F6C3}", "Customs"),
    e("\u{1F6C4}", "Baggage Claim"),
    e("\u{1F6C5}", "Left Luggage"),
    e("\u{1F17F}\u{FE0F}", "Parking Button"),
    e("\u{267F}", "Wheelchair Symbol"),
    e("\u{2622}\u{FE0F}", "Radioactive"),
    e("\u{2623}\u{FE0F}", "Biohazard"),
    e("\u{26A0}\u{FE0F}", "Warning"),
    e("\u{26A1}", "High Voltage"),
    e("\u{26D4}", "No Entry"),
    e("\u{267B}\u{FE0F}", "Recycling Symbol"),
    e("\u{2640}\u{FE0F}", "Female Sign"),
    e("\u{2642}\u{FE0F}", "Male Sign"),
    e("\u{26A7}\u{FE0F}", "Transgender Symbol"),
];
const religion = [
    e("\u{1F52F}", "Dotted Six-Pointed Star"),
    e("\u{2721}\u{FE0F}", "Star of David"),
    e("\u{1F549}\u{FE0F}", "Om"),
    e("\u{1F54B}", "Kaaba"),
    e("\u{1F54C}", "Mosque"),
    e("\u{1F54D}", "Synagogue"),
    e("\u{1F54E}", "Menorah"),
    e("\u{1F6D0}", "Place of Worship"),
    e("\u{1F6D5}", "Hindu Temple"),
    e("\u{2626}\u{FE0F}", "Orthodox Cross"),
    e("\u{271D}\u{FE0F}", "Latin Cross"),
    e("\u{262A}\u{FE0F}", "Star and Crescent"),
    e("\u{262E}\u{FE0F}", "Peace Symbol"),
    e("\u{262F}\u{FE0F}", "Yin Yang"),
    e("\u{2638}\u{FE0F}", "Wheel of Dharma"),
    e("\u{267E}\u{FE0F}", "Infinity"),
    e("\u{1FA94}", "Diya Lamp"),
    e("\u{26E9}\u{FE0F}", "Shinto Shrine"),
    e("\u{26EA}", "Church"),
    e("\u{2734}\u{FE0F}", "Eight-Pointed Star"),
    e("\u{1F4FF}", "Prayer Beads"),
];
const door = e("\u{1F6AA}", "Door");
const household = [
    e("\u{1F484}", "Lipstick"),
    e("\u{1F48D}", "Ring"),
    e("\u{1F48E}", "Gem Stone"),
    e("\u{1F4F0}", "Newspaper"),
    key,
    e("\u{1F525}", "Fire"),
    e("\u{1FAA8}", "Rock"),
    e("\u{1FAB5}", "Wood"),
    e("\u{1F52B}", "Pistol"),
    e("\u{1F56F}\u{FE0F}", "Candle"),
    e("\u{1F5BC}\u{FE0F}", "Framed Picture"),
    oldKey,
    e("\u{1F5DE}\u{FE0F}", "Rolled-Up Newspaper"),
    e("\u{1F5FA}\u{FE0F}", "World Map"),
    door,
    e("\u{1F6BD}", "Toilet"),
    e("\u{1F6BF}", "Shower"),
    e("\u{1F6C1}", "Bathtub"),
    e("\u{1F6CB}\u{FE0F}", "Couch and Lamp"),
    e("\u{1F6CF}\u{FE0F}", "Bed"),
    e("\u{1F9F4}", "Lotion Bottle"),
    e("\u{1F9F5}", "Thread"),
    e("\u{1F9F6}", "Yarn"),
    e("\u{1F9F7}", "Safety Pin"),
    e("\u{1F9F8}", "Teddy Bear"),
    e("\u{1F9F9}", "Broom"),
    e("\u{1F9FA}", "Basket"),
    e("\u{1F9FB}", "Roll of Paper"),
    e("\u{1F9FC}", "Soap"),
    e("\u{1F9FD}", "Sponge"),
    e("\u{1FA91}", "Chair"),
    e("\u{1FA92}", "Razor"),
    e("\u{1FA9E}", "Mirror"),
    e("\u{1FA9F}", "Window"),
    e("\u{1FAA0}", "Plunger"),
    e("\u{1FAA1}", "Sewing Needle"),
    e("\u{1FAA2}", "Knot"),
    e("\u{1FAA3}", "Bucket"),
    e("\u{1FAA4}", "Mouse Trap"),
    e("\u{1FAA5}", "Toothbrush"),
    e("\u{1FAA6}", "Headstone"),
    e("\u{1FAA7}", "Placard"),
    e("\u{1F397}\u{FE0F}", "Reminder Ribbon"),
];
const activities = [
    e("\u{1F39E}\u{FE0F}", "Film Frames"),
    e("\u{1F39F}\u{FE0F}", "Admission Tickets"),
    e("\u{1F3A0}", "Carousel Horse"),
    e("\u{1F3A1}", "Ferris Wheel"),
    e("\u{1F3A2}", "Roller Coaster"),
    artistPalette,
    e("\u{1F3AA}", "Circus Tent"),
    e("\u{1F3AB}", "Ticket"),
    e("\u{1F3AC}", "Clapper Board"),
    e("\u{1F3AD}", "Performing Arts"),
];
const travel = [
    e("\u{1F3F7}\u{FE0F}", "Label"),
    e("\u{1F30B}", "Volcano"),
    e("\u{1F3D4}\u{FE0F}", "Snow-Capped Mountain"),
    e("\u{26F0}\u{FE0F}", "Mountain"),
    e("\u{1F3D5}\u{FE0F}", "Camping"),
    e("\u{1F3D6}\u{FE0F}", "Beach with Umbrella"),
    e("\u{26F1}\u{FE0F}", "Umbrella on Ground"),
    e("\u{1F3EF}", "Japanese Castle"),
    e("\u{1F463}", "Footprints"),
    e("\u{1F5FB}", "Mount Fuji"),
    e("\u{1F5FC}", "Tokyo Tower"),
    e("\u{1F5FD}", "Statue of Liberty"),
    e("\u{1F5FE}", "Map of Japan"),
    e("\u{1F5FF}", "Moai"),
    e("\u{1F6CE}\u{FE0F}", "Bellhop Bell"),
    e("\u{1F9F3}", "Luggage"),
    e("\u{26F3}", "Flag in Hole"),
    e("\u{26FA}", "Tent"),
    e("\u{2668}\u{FE0F}", "Hot Springs"),
];
const medieval = [
    e("\u{1F3F0}", "Castle"),
    e("\u{1F3F9}", "Bow and Arrow"),
    crown,
    e("\u{1F531}", "Trident Emblem"),
    e("\u{1F5E1}\u{FE0F}", "Dagger"),
    e("\u{1F6E1}\u{FE0F}", "Shield"),
    e("\u{1F52E}", "Crystal Ball"),
    e("\u{1FA84}", "Magic Wand"),
    e("\u{2694}\u{FE0F}", "Crossed Swords"),
    e("\u{269C}\u{FE0F}", "Fleur-de-lis"),
    e("\u{1FA96}", "Military Helmet")
];
const questionMark = e("\u{2753}", "Question Mark");
const squareFourCourners = e("\u{26F6}\u{FE0F}", "Square: Four Corners");

const dice1 = e("\u2680", "Dice: Side 1");
const dice2 = e("\u2681", "Dice: Side 2");
const dice3 = e("\u2682", "Dice: Side 3");
const dice4 = e("\u2683", "Dice: Side 4");
const dice5 = e("\u2684", "Dice: Side 5");
const dice6 = e("\u2685", "Dice: Side 6");
const dice = g(e(dice3.value, "Dice"), dice1, dice2, dice3, dice4, dice5, dice6);

const whiteChessKing = e("\u{2654}", "White Chess King");
const whiteChessQueen = e("\u{2655}", "White Chess Queen");
const whiteChessRook = e("\u{2656}", "White Chess Rook");
const whiteChessBishop = e("\u{2657}", "White Chess Bishop");
const whiteChessKnight = e("\u{2658}", "White Chess Knight");
const whiteChessPawn = e("\u{2659}", "White Chess Pawn");
const whiteChessPieces = Object.assign(g(
    e(whiteChessKing.value + whiteChessQueen.value + whiteChessRook.value + whiteChessBishop.value + whiteChessKnight.value + whiteChessPawn.value, "White Chess Pieces"),
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

const blackChessKing = e("\u{265A}", "Black Chess King");
const blackChessQueen = e("\u{265B}", "Black Chess Queen");
const blackChessRook = e("\u{265C}", "Black Chess Rook");
const blackChessBishop = e("\u{265D}", "Black Chess Bishop");
const blackChessKnight = e("\u{265E}", "Black Chess Knight");
const blackChessPawn = e("\u{265F}", "Black Chess Pawn");
const blackChessPieces = Object.assign(g(
    e(blackChessKing.value + blackChessQueen.value + blackChessRook.value + blackChessBishop.value + blackChessKnight.value + blackChessPawn.value, "Black Chess Pieces"),
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
const chessPawns = Object.assign(g(
    e(whiteChessPawn.value + blackChessPawn.value, "Chess Pawns"),
    whiteChessPawn,
    blackChessPawn), {
    width: "auto",
    white: whiteChessPawn,
    black: blackChessPawn
});
const chessRooks = Object.assign(g(
    e(whiteChessRook.value + blackChessRook.value, "Chess Rooks"),
    whiteChessRook,
    blackChessRook), {
    width: "auto",
    white: whiteChessRook,
    black: blackChessRook
});
const chessBishops = Object.assign(g(
    e(whiteChessBishop.value + blackChessBishop.value, "Chess Bishops"),
    whiteChessBishop,
    blackChessBishop), {
    width: "auto",
    white: whiteChessBishop,
    black: blackChessBishop
});
const chessKnights = Object.assign(g(
    e(whiteChessKnight.value + blackChessKnight.value, "Chess Knights"),
    whiteChessKnight,
    blackChessKnight), {
    width: "auto",
    white: whiteChessKnight,
    black: blackChessKnight
});
const chessQueens = Object.assign(g(
    e(whiteChessQueen.value + blackChessQueen.value, "Chess Queens"),
    whiteChessQueen,
    blackChessQueen), {
    width: "auto",
    white: whiteChessQueen,
    black: blackChessQueen
});
const chessKings = Object.assign(g(
    e(whiteChessKing.value + blackChessKing.value, "Chess Kings"),
    whiteChessKing,
    blackChessKing), {
    width: "auto",
    white: whiteChessKing,
    black: blackChessKing
});
const chess = Object.assign(g(
    e(chessKings.value, "Chess Pieces"),
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

const science = [
    droplet,
    dropOfBlood,
    adhesiveBandage,
    stehoscope,
    syringe,
    pill,
    microscope,
    testTube,
    petriDish,
    dna,
    abacus,
    magnet,
    telescope,
    medical,
    balanceScale,
    alembic,
    gear,
    atomSymbol,
    magnifyingGlassTiltedLeft,
    magnifyingGlassTiltedRight,
];

const allIcons = {
    faces,
    love,
    cartoon,
    hands,
    bodyParts,
    people,
    gestures,
    inMotion,
    resting,
    roles,
    fantasy,
    animals,
    plants,
    food,
    sweets,
    drinks,
    utensils,
    flags,
    vehicles,
    bloodTypes,
    japanese,
    time,
    clocks,
    arrows,
    shapes,
    mediaPlayer,
    zodiac,
    chess,
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
    medieval
};

class FormDialog extends EventTarget {
    constructor(name, ...rest) {
        super();

        const formStyle = style({
            display: "grid",
            width: "100%",
            height: "100%",
            gridTemplateColumns: "5fr 1fr 1fr",
            gridTemplateRows: "auto auto 1fr auto auto",
            overflowY: "hidden"
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
            padding: "1em",
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

    get isOpen() {
        return this.element.isOpen();
    }

    set isOpen(v) {
        if (v !== this.isOpen) {
            this.toggleOpen();
        }
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

const headerStyle = style({
    textDecoration: "none",
    color: "black",
    textTransform: "capitalize"
}),
    buttonStyle = style({
        fontSize: "200%",
        width: "2em"
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
                "Cancel",
                onClick(() => {
                    this.confirmButton.lock();
                    this.hide();
                    this.dispatchEvent(cancelEvt);
                })),

            this.preview = Span(style({ gridArea: "4/1/5/4" })));

        this.confirmButton.lock();

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

function Run(...rest) {
    return Div(
        style({ margin: "auto" }),
        ...rest);
}

const toggleAudioEvt = new Event("toggleAudio"),
    toggleVideoEvt = new Event("toggleVideo"),
    emoteEvt = new Event("emote"),
    selectEmojiEvt = new Event("selectEmoji"),
    subelStyle = style({
        fontSize: "1.25em",
        width: "3em",
        height: "100%"
    }),
    subButtonStyle = style({
        fontSize: "1.25em",
        height: "100%"
    }),
    buttonLabelStyle = style({
        fontSize: "12px"
    });

class FooterBar extends EventTarget {
    constructor() {
        super();

        const _ = (evt) => () => this.dispatchEvent(evt);

        /** @type {HTMLButtonElement} */
        this.muteAudioButton = null;

        this.element = Div(
            id("footbar"),
            style({
                gridTemplateColumns: "auto 1fr auto",
                display: "grid",
                padding: "4px",
                width: "100%",
                columnGap: "5px",
                backgroundColor: "transparent"
            }),

            this.muteAudioButton = Button(
                title("Toggle audio mute/unmute"),
                onClick(_(toggleAudioEvt)),
                grid(1, 1),
                subelStyle,
                Run(speakerHighVolume.value),
                Run(buttonLabelStyle, "Audio")),

            this.emojiControl = Span(
                grid(2, 1),
                style({ textAlign: "center" }),
                subButtonStyle,
                Button(
                    title("Emote"),
                    onClick(_(emoteEvt)),
                    subButtonStyle,
                    style({ borderRight: "none" }),
                    this.emoteButton = Run(whiteFlower.value),
                    Run(buttonLabelStyle, "Emote")),
                Button(
                    title("Select Emoji"),
                    onClick(_(selectEmojiEvt)),
                    subButtonStyle,
                    style({ borderLeft: "none" }),
                    Run(upwardsButton.value),
                    Run(buttonLabelStyle, "Change"))),


            this.muteVideoButton = Button(
                title("Toggle video mute/unmute"),
                onClick(_(toggleVideoEvt)),
                grid(3, 1),
                subelStyle,
                Run(noMobilePhone.value),
                Run(buttonLabelStyle, "Video")));

        this._audioEnabled = true;
        this._videoEnabled = false;

        Object.seal(this);
    }

    get enabled() {
        return !this.muteAudioButton.disabled;
    }

    set enabled(v) {
        for (let button of this.element.querySelectorAll("button")) {
            button.disabled = !v;
        }
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

    get videoEnabled() {
        return this._videoEnabled;
    }

    set videoEnabled(value) {
        this._videoEnabled = value;
        this.muteVideoButton.updateLabel(
            value,
            videoCamera.value,
            noMobilePhone.value);
    }

    setEmojiButton(key, emoji) {
        this.emoteButton.innerHTML = emoji.value;
    }
}

function Run$1(...rest) {
    return Div(
        style({ margin: "auto" }),
        ...rest);
}

const toggleOptionsEvt = new Event("toggleOptions"),
    tweetEvt = new Event("tweet"),
    leaveEvt = new Event("leave"),
    toggleFullscreenEvt = new Event("toggleFullscreen"),
    toggleInstructionsEvt = new Event("toggleInstructions"),
    toggleUserDirectoryEvt = new Event("toggleUserDirectory"),
    subelStyle$1 = style({
        fontSize: "1.25em",
        width: "3em",
        height: "100%",
        pointerEvents: "all"
    }),
    buttonLabelStyle$1 = style({
        fontSize: "12px"
    });

class HeaderBar extends EventTarget {
    constructor() {
        super();

        const _ = (evt) => () => this.dispatchEvent(evt);

        this.element = Div(
            id("headbar"),
            style({
                gridTemplateColumns: "auto auto auto auto 1fr auto auto",
                display: "grid",
                padding: "4px",
                width: "100%",
                columnGap: "5px",
                backgroundColor: "transparent",
                pointerEvents: "none"
            }),

            this.optionsButton = Button(
                title("Show/hide options"),
                onClick(_(toggleOptionsEvt)),
                subelStyle$1,
                grid(1, 1),
                Run$1(gear.value),
                Run$1(buttonLabelStyle$1, "Options")),

            this.instructionsButton = Button(
                title("Show/hide instructions"),
                onClick(_(toggleInstructionsEvt)),
                subelStyle$1,
                grid(2, 1),
                Run$1(questionMark.value),
                Run$1(buttonLabelStyle$1, "Info")),

            Button(
                title("Share your current room to twitter"),
                onClick(_(tweetEvt)),
                subelStyle$1,
                grid(3, 1),
                Img(src("https://cdn2.iconfinder.com/data/icons/minimalism/512/twitter.png"),
                    alt("icon"),
                    role("presentation"),
                    style({ height: "25px" })),
                Run$1(buttonLabelStyle$1, "Tweet")),

            Button(
                title("View user directory"),
                onClick(_(toggleUserDirectoryEvt)),
                subelStyle$1,
                grid(4, 1),
                Run$1(speakingHead.value),
                Run$1(buttonLabelStyle$1, "Users")),


            this.fullscreenButton = Button(
                title("Toggle fullscreen"),
                onClick(_(toggleFullscreenEvt)),
                subelStyle$1,
                grid(6, 1),
                Run$1(squareFourCourners.value),
                Run$1(buttonLabelStyle$1, "Expand")),


            Button(
                title("Leave the room"),
                onClick(_(leaveEvt)),
                subelStyle$1,
                grid(7, 1),
                Run$1(door.value),
                Run$1(buttonLabelStyle$1, "Leave")));

        Object.seal(this);
    }

    get isFullscreen() {
        return document.fullscreenElement !== null;
    }

    set isFullscreen(value) {
        if (value) {
            document.body.requestFullscreen();
        }
        else {
            document.exitFullscreen();
        }
        this.fullscreenButton.updateLabel(
            value,
            downRightArrow.value,
            squareFourCourners.value);
    }

    get enabled() {
        return !this.instructionsButton.disabled;
    }

    set enabled(v) {
        for (let button of this.element.querySelectorAll("button")) {
            button.disabled = !v;
        }
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

        this.roomSelect.emptySelectionEnabled = false;
        this.roomSelect.values = defaultRooms.keys();
        this.roomSelect.selectedIndex = 0;

        this.roomInput = this.element.querySelector("#roomName");
        this.roomInput.addEventListener("input", self.validate);
        this.roomInput.addEventListener("enter", () => {
            this.userNameInput.focus();
        });

        this.userNameInput = this.element.querySelector("#userName");
        this.userNameInput.addEventListener("input", self.validate);
        this.userNameInput.addEventListener("enter", () => {
            if (this.roomName.length > 0
                && this.userName.length > 0) {
                this.connectButton.click();
            }
            else if (this.userName.length === 0) {
                this.userNameInput.focus();
            }
            else if (this.roomSelectMode) {
                this.roomSelect.focus();
            }
            else {
                this.roomInput.focus();
            }
        });

        this.createRoomButton = this.element.querySelector("#createNewRoom");
        this.createRoomButton.addEventListener("click", () => {
            this.roomSelectMode = !this.roomSelectMode;
        });

        this.connectButton = this.element.querySelector("#connect");
        this.addEventListener("login", () => {
            this.connecting = true;
        });

        this.roomSelectMode = true;

        self.validate();
    }

    addEventListener(evtName, callback, options) {
        if (evtName === "login") {
            this.connectButton.addEventListener("click", callback, options);
        }
        else {
            super.addEventListener(evtName, callback, options);
        }
    }

    removeEventListener(evtName, callback) {
        if (evtName === "login") {
            this.connectButton.removeEventListener("click", callback);
        }
        else {
            super.removeEventListener(evtName, callback);
        }
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

        this.lastButtons = [];
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

            this.lastButtons[b] = null;
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

    update(pad) {
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
                this.dispatchEvent((pressed
                    ? self.btnDownEvts
                    : self.btnUpEvts)[b]);
            }

            this.lastButtons[b] = this.buttons[b];
            this.buttons[b] = pad.buttons[b];
        }

        for (let a = 0; a < pad.axes.length; ++a) {
            const wasMaxed = self.axisMaxed[a],
                val = pad.axes[a],
                dir = Math.sign(val),
                mag = Math.abs(val),
                maxed = mag >= this.axisThresholdMax,
                mined = mag <= this.axisThresholdMin;
            if (maxed && !wasMaxed) {
                this.dispatchEvent(self.axisMaxEvts[a]);
            }

            this.axes[a] = dir * (maxed ? 1 : (mined ? 0 : mag));
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

const tickEvt = Object.assign(new Event("tick"), {
    dt: 0
});

class BaseTimer extends EventTarget {

    /**
     * 
     * @param {number} targetFrameRate
     */
    constructor(targetFrameRate) {
        super();
        this._lt = 0;
        this._timer = null;
        this.targetFrameRate = targetFrameRate;
    }

    /**
     * 
     * @param {number} dt
     */
    _onTick(dt) {
        tickEvt.dt = dt;
        this.dispatchEvent(tickEvt);
    }

    restart() {
        this.stop();
        this.start();
    }

    get isRunning() {
        return this._timer !== null;
    }

    start() {
        throw new Error("Not implemented in base class");
    }

    stop() {
        this._timer = null;
    }

    /** @type {number} */
    get targetFrameRate() {
        return this._targetFPS;
    }

    set targetFrameRate(fps) {
        this._targetFPS = fps;
        this._frameTime = 1000 / fps;
    }
}

class RequestAnimationFrameTimer extends BaseTimer {
    constructor() {
        super(60);
    }

    start() {
        const updater = (t) => {
            const dt = t - this._lt;
            this._lt = t;
            this._timer = requestAnimationFrame(updater);
            this._onTick(dt);
        };
        this._lt = performance.now();
        this._timer = requestAnimationFrame(updater);
    }

    stop() {
        if (this.isRunning) {
            cancelAnimationFrame(this._timer);
            super.stop();
        }
    }

    get targetFrameRate() {
        return super.targetFrameRate;
    }

    set targetFrameRate(fps) {
        console.warn("You cannot change the target framerate for requestAnimationFrame");
    }
}

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

            ["gpAxisLeftRight", 0],
            ["gpAxisUpDown", 1],

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
    audioInputChangedEvt = new Event("audioInputChanged"),
    audioOutputChangedEvt = new Event("audioOutputChanged"),
    videoInputChangedEvt = new Event("videoInputChanged"),
    gamepadButtonUpEvt = Object.assign(new Event("gamepadbuttonup"), {
        button: 0
    }),
    gamepadAxisMaxedEvt = Object.assign(new Event("gamepadaxismaxed"), {
        axis: 0
    }),
    selfs$1 = new Map();

class OptionsForm extends FormDialog {
    constructor() {
        super("options", "Options");

        const _ = (evt) => () => this.dispatchEvent(evt);

        const self = {
            inputBinding: new InputBinding(),
            timer: new RequestAnimationFrameTimer(),

            /** @type {EventedGamepad} */
            pad: null
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

        const makeGamepadButtonBinder = (id, label) => {
            const gp = LabeledInput(
                id,
                "text",
                label,
                numberWidthStyle);
            this.addEventListener("gamepadbuttonup", (evt) => {
                if (document.activeElement === gp.input) {
                    gp.value
                        = self.inputBinding[id]
                        = evt.button;
                    this.dispatchEvent(inputBindingChangedEvt$1);
                }
            });
            gp.value = self.inputBinding[id];
            return gp;
        };

        const makeGamepadAxisBinder = (id, label) => {
            const gp = LabeledInput(
                id,
                "text",
                label,
                numberWidthStyle);
            this.addEventListener("gamepadaxismaxed", (evt) => {
                if (document.activeElement === gp.input) {
                    gp.value
                        = self.inputBinding[id]
                        = evt.axis;
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
                    onInput(_(fontSizeChangedEvt))),
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
                this.gpAxisLeftRight = makeGamepadAxisBinder("gpAxisLeftRight", "Left/Right axis:"),
                this.gpAxisUpDown = makeGamepadAxisBinder("gpAxisUpDown", "Up/Down axis:"),
                this.gpButtonUp = makeGamepadButtonBinder("gpButtonUp", "Up button: "),
                this.gpButtonDown = makeGamepadButtonBinder("gpButtonDown", "Down button: "),
                this.gpButtonLeft = makeGamepadButtonBinder("gpButtonLeft", "Left button: "),
                this.gpButtonRight = makeGamepadButtonBinder("gpButtonRight", "Right button: "),
                this.gpButtonEmote = makeGamepadButtonBinder("gpButtonEmote", "Emote button: "),
                this.gpButtonToggleAudio = makeGamepadButtonBinder("gpButtonToggleAudio", "Toggle audio button: ")),

            OptionPanel("devices", "Devices",
                this.videoInputSelect = LabeledSelectBox(
                    "videoInputDevices",
                    "Video Input: ",
                    "No video input",
                    d => d.deviceId,
                    d => d.label,
                    onInput(_(videoInputChangedEvt))),
                this.audioInputSelect = LabeledSelectBox(
                    "audioInputDevices",
                    "Audio Input: ",
                    "No audio input",
                    d => d.deviceId,
                    d => d.label,
                    onInput(_(audioInputChangedEvt))),
                this.audioOutputSelect = LabeledSelectBox(
                    "audioOutputDevices",
                    "Audio Output: ",
                    "No audio output",
                    d => d.deviceId,
                    d => d.label,
                    onInput(_(audioOutputChangedEvt))))
        ];

        const cols = [];
        for (let i = 0; i < panels.length; ++i) {
            cols[i] = "1fr";
            panels[i].element.style.gridColumnStart = i + 1;
            panels[i].button.style.fontSize = "24pt";
        }

        Object.assign(this.header.style, {
            display: "grid",
            gridTemplateColumns: cols.join(" ")
        });

        this.header.append(...panels.map(p => p.button));
        this.content.append(...panels.map(p => p.element));
        style({
            backgroundColor: "#ddd",
            borderLeft: "solid 2px black",
            borderRight: "solid 2px black",
            borderBottom: "solid 2px black"
        }).apply(this.content);
        this.footer.append(
            this.confirmButton = Button(
                className("confirm"),
                "Close",
                onClick(() => this.hide())));

        const showPanel = (p) =>
            () => {
                for (let i = 0; i < panels.length; ++i) {
                    panels[i].visible = i === p;
                }

                const isGamepad = panels[p].id === "gamepad";
                if (self.timer.isRunning !== isGamepad) {
                    if (isGamepad) {
                        self.timer.start();
                    }
                    else {
                        self.timer.stop();
                    }
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

        self.timer.addEventListener("tick", () => {
            const pad = this.currentGamepad;
            if (pad) {
                if (self.pad) {
                    self.pad.update(pad);
                }
                else {
                    self.pad = new EventedGamepad(pad);
                    self.pad.addEventListener("gamepadbuttonup", (evt) => {
                        gamepadButtonUpEvt.button = evt.button;
                        this.dispatchEvent(gamepadButtonUpEvt);
                    });
                    self.pad.addEventListener("gamepadaxismaxed", (evt) => {
                        gamepadAxisMaxedEvt.axis = evt.axis;
                        this.dispatchEvent(gamepadAxisMaxedEvt);
                    });
                }
            }
        });

        this.gamepads = [];
        this.audioInputDevices = [];
        this.audioOutputDevices = [];
        this.videoInputDevices = [];

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

    get currentGamepadIndex() {
        return this.gpSelect.selectedIndex;
    }

    get currentGamepad() {
        if (this.currentGamepadIndex < 0) {
            return null;
        }
        else {
            return navigator.getGamepads()[this.currentGamepadIndex];
        }
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

class BaseAvatar {

    constructor(element) {
        this.element = element;
    }

    /** @type {boolean} */
    get canSwim() {
        return false;
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} g
     * @param {number} width
     * @param {number} height
     */
    draw(g, width, height) {
        throw new Error("Not implemented in base class");
    }
}

const AvatarMode = Object.freeze({
    none: null,
    emoji: "emoji",
    photo: "photo",
    video: "video"
});

const selfs$2 = new Map();

class EmojiAvatar extends BaseAvatar {
    constructor(emoji) {
        super(Span(
            title(emoji.desc),
            emoji.value));

        const self = {
            canSwim: isSurfer(emoji),
            x: 0,
            y: 0,
            aspectRatio: null
        };

        this.value = emoji.value;
        this.desc = emoji.desc;

        selfs$2.set(this, self);
    }

    get canSwim() {
        return selfs$2.get(this).canSwim;
    }

    draw(g, width, height) {
        const self = selfs$2.get(this);

        if (self.aspectRatio === null) {
            const oldFont = g.font;
            const size = 100;
            g.font = size + "px sans-serif";
            const metrics = g.measureText(this.value);
            self.aspectRatio = metrics.width / size;
            self.x = (size - metrics.width) / 2;
            self.y = metrics.actualBoundingBoxAscent / 2;

            self.x /= size;
            self.y /= size;

            g.font = oldFont;
        }

        if (self.aspectRatio !== null) {
            const fontHeight = self.aspectRatio <= 1
                ? height
                : width / self.aspectRatio;

            g.font = fontHeight + "px sans-serif";
            g.fillText(this.value, self.x * fontHeight, self.y * fontHeight);
        }
    }
}

class PhotoAvatar extends BaseAvatar {

    /**
     * 
     * @param {(URL|string)} url
     */
    constructor(url) {
        super(Canvas());

        /** @type {HTMLCanvasElement} */
        this.element = null;

        const img = new Image();
        img.addEventListener("load", (evt) => {
            this.element.width = img.width;
            this.element.height = img.height;
            const g = this.element.getContext("2d");
            g.clearRect(0, 0, img.width, img.height);
            g.imageSmoothingEnabled = false;
            g.drawImage(img, 0, 0);
        });

        /** @type {string} */
        this.url
            = img.src
            = url && url.href || url;
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} g
     * @param {any} width
     * @param {any} height
     */
    draw(g, width, height) {
        const offset = (this.element.width - this.element.height) / 2,
            sx = Math.max(0, offset),
            sy = Math.max(0, -offset),
            dim = Math.min(this.element.width, this.element.height);
        g.drawImage(
            this.element,
            sx, sy,
            dim, dim,
            0, 0,
            width, height);
    }
}

class VideoAvatar extends BaseAvatar {
    /**
     * 
     * @param {HTMLVideoElement} video
     */
    constructor(video) {
        super(video);
        this.element.play();
        this.element
            .once("canplay")
            .then(() => this.element.play());
    }

    draw(g, width, height) {
        if (this.element !== null) {
            const offset = (this.element.videoWidth - this.element.videoHeight) / 2,
                sx = Math.max(0, offset),
                sy = Math.max(0, -offset),
                dim = Math.min(this.element.videoWidth, this.element.videoHeight);
            g.drawImage(
                this.element,
                sx, sy,
                dim, dim,
                0, 0,
                width, height);
        }
    }
}

class BasePosition {
    /** 
     *  The horizontal component of the position.
     *  @type {number} */
    get x() {
        throw new Error("Not implemented in base class.");
    }

    /** 
     *  The vertical component of the position.
     *  @type {number} */
    get y() {
        throw new Error("Not implemented in base class.");
    }

    /**
     * Set the target position
     * @param {Point} evt - the target position
     * @param {number} t - the current time, in seconds
     * @param {number} dt - the amount of time to take to transition, in seconds
     */
    setTarget(evt, t, dt) {
        throw new Error("Not implemented in base class.");
    }

    /**
     * Update the position.
     * @param {number} t - the current time, in seconds
     */
    update(t) {
    }
}

class InterpolatedPosition extends BasePosition {

    constructor() {
        super();

        this._st
            = this._et
            = 0;
        this._x
            = this._tx
            = this._sx
            = 0;
        this._y
            = this._ty
            = this._sy
            = 0;
    }

    /** @type {number} */
    get x() {
        return this._x;
    }

    /** @type {number} */
    get y() {
        return this._y;
    }

    /**
     * 
     * @param {UserPosition} evt
     * @param {number} t
     * @param {number} dt
     */
    setTarget(evt, t, dt) {
        this._st = t;
        this._et = t + dt;
        this._sx = this._x;
        this._sy = this._y;
        this._tx = evt.x;
        this._ty = evt.y;
    }

    /**
     * 
     * @param {number} t
     */
    update(t) {
        const p = project(t, this._st, this._et);
        if (p <= 1) {
            this._x = lerp(this._sx, this._tx, p);
            this._y = lerp(this._sy, this._ty, p);
        }
    }
}

const POSITION_REQUEST_DEBOUNCE_TIME = 1,
    STACKED_USER_OFFSET_X = 5,
    STACKED_USER_OFFSET_Y = 5,
    eventNames = ["userMoved", "userPositionNeeded"];

function resetAvatarMode(self) {
    if (self.avatarVideo) {
        self.avatarMode = AvatarMode.video;
    }
    else if (self.avatarPhoto) {
        self.avatarMode = AvatarMode.photo;
    }
    else if (self.avatarEmoji) {
        self.avatarMode = AvatarMode.emoji;
    }
    else {
        self.avatarMode = AvatarMode.none;
    }
}

class User extends EventTarget {
    constructor(evt, isMe) {
        super();

        this.id = evt.id;
        this.displayName = evt.displayName;
        this.label = isMe ? "(Me)" : `(${this.id})`;

        this.moveEvent = new UserMoveEvent(this.id);
        this.position = new InterpolatedPosition();

        this.avatarMode = AvatarMode.none;
        this.avatarEmoji = (isMe ? randomPerson() : bust);
        this.avatarImage = null;
        this.avatarVideo = null;

        this.audioMuted = false;
        this.videoMuted = true;
        this.isMe = isMe;
        this.isActive = false;
        this.stackUserCount = 1;
        this.stackIndex = 0;
        this.stackAvatarHeight = 0;
        this.stackAvatarWidth = 0;
        this.stackOffsetX = 0;
        this.stackOffsetY = 0;
        this.isInitialized = isMe;
        this.lastPositionRequestTime = performance.now() / 1000 - POSITION_REQUEST_DEBOUNCE_TIME;
        this.visible = true;
    }

    deserialize(evt) {
        if (evt.displayName !== undefined) {
            this.displayName = evt.displayName;
        }

        if (evt.avatarMode !== undefined) {
            this.avatarMode = evt.avatarMode;
            this.avatarID = evt.avatarID;
        }

        if (evt.x !== undefined) {
            this.position.setTarget(evt, performance.now() / 1000, 0);
            this.isInitialized = true;
        }
    }

    serialize() {
        return {
            id: this.id,
            x: this.position._tx,
            y: this.position._ty,
            displayName: this.displayName,
            avatarMode: this.avatarMode,
            avatarID: this.avatarID
        };
    }

    get avatarVideo() {
        return this._avatarVideo;
    }

    set avatarVideo(video) {
        if (video === null
            || video === undefined) {
            this._avatarVideo = null;
            resetAvatarMode(this);
        }
        else {
            this.avatarMode = AvatarMode.video;
            this._avatarVideo = new VideoAvatar(video);
        }
    }

    get avatarImage() {
        return this._avatarImage;
    }

    set avatarImage(url) {
        this._avatarURL = url;
        if (url === null
            || url === undefined) {
            this._avatarImage = null;
            resetAvatarMode(this);
        }
        else {
            this.avatarMode = AvatarMode.photo;
            this._avatarImage = new PhotoAvatar(url);
        }
    }

    get avatarEmoji() {
        return this._avatarEmoji;
    }

    set avatarEmoji(emoji) {
        if (emoji === null
            || emoji === undefined) {
            this._avatarEmoji = null;
            resetAvatarMode(this);
        }
        else {
            this.avatarMode = AvatarMode.emoji;
            this._avatarEmoji = new EmojiAvatar(emoji);
        }
    }

    get avatar() {
        if (this.avatarMode === AvatarMode.none) {
            resetAvatarMode(this);
        }

        switch (this.avatarMode) {
            case AvatarMode.emoji:
                return this.avatarEmoji;
            case AvatarMode.photo:
                return this.avatarImage;
            case AvatarMode.video:
                return this.avatarVideo;
            default:
                return null;
        }
    }

    get avatarID() {
        switch (this.avatarMode) {
            case AvatarMode.emoji:
                return { value: this.avatarEmoji.value, desc: this.avatarEmoji.desc };
            case AvatarMode.photo:
                return this.avatarImage.url;
            default:
                return null;
        }
    }

    set avatarID(id) {
        switch (this.avatarMode) {
            case AvatarMode.emoji:
                this.avatarEmoji = id;
                break;
            case AvatarMode.photo:
                this.avatarImage = id;
                break;
        }
    }

    addEventListener(evtName, func, opts) {
        if (eventNames.indexOf(evtName) === -1) {
            throw new Error(`Unrecognized event type: ${evtName}`);
        }

        super.addEventListener(evtName, func, opts);
    }

    setDisplayName(name) {
        this.displayName = name;
    }

    moveTo(x, y, dt) {
        if (this.isInitialized) {
            if (this.isMe) {
                this.moveEvent.set(x, y);
                this.dispatchEvent(this.moveEvent);
            }

            this.position.setTarget({ x, y }, performance.now() / 1000, dt);
        }
    }

    update(map, users) {
        const t = performance.now() / 1000;

        if (!this.isInitialized) {
            const dt = t - this.lastPositionRequestTime;
            if (dt >= POSITION_REQUEST_DEBOUNCE_TIME) {
                this.lastPositionRequestTime = t;
                this.dispatchEvent(new UserPositionNeededEvent(this.id));
            }
        }

        this.position.update(t);

        this.stackUserCount = 0;
        this.stackIndex = 0;
        for (let user of users.values()) {
            if (user.position._tx === this.position._tx
                && user.position._ty === this.position._ty) {
                if (user.id === this.id) {
                    this.stackIndex = this.stackUserCount;
                }
                ++this.stackUserCount;
            }
        }

        this.stackAvatarWidth = map.tileWidth - (this.stackUserCount - 1) * STACKED_USER_OFFSET_X;
        this.stackAvatarHeight = map.tileHeight - (this.stackUserCount - 1) * STACKED_USER_OFFSET_Y;
        this.stackOffsetX = this.stackIndex * STACKED_USER_OFFSET_X;
        this.stackOffsetY = this.stackIndex * STACKED_USER_OFFSET_Y;
    }

    drawShadow(g, map, cameraZ) {
        const x = this.position.x * map.tileWidth,
            y = this.position.y * map.tileHeight,
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
            this.position.x * map.tileWidth + this.stackOffsetX,
            this.position.y * map.tileHeight + this.stackOffsetY);
        g.fillStyle = "black";
        g.textBaseline = "top";

        if (this.avatar) {
            this.avatar.draw(g, this.stackAvatarWidth, this.stackAvatarHeight);
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
            if (!this.videoMuted && !(this.avatar instanceof VideoAvatar)) {
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
                    this.position.x * map.tileWidth + this.stackOffsetX,
                    this.position.y * map.tileHeight + this.stackOffsetY);
                g.shadowColor = "black";
                g.shadowOffsetX = 3 * cameraZ;
                g.shadowOffsetY = 3 * cameraZ;
                g.shadowBlur = 3 * cameraZ;

                g.fillStyle = "white";
                g.textBaseline = "bottom";
                g.font = `${fontSize * devicePixelRatio}pt sans-serif`;
                g.fillText(this.displayName || this.label, 0, 0);
            }
            g.restore();
        }
    }

    drawHearingTile(g, map, dx, dy, p) {
        g.save();
        {
            g.translate(
                (this.position._tx + dx) * map.tileWidth,
                (this.position._ty + dy) * map.tileHeight);
            g.strokeStyle = `rgba(0, 255, 0, ${(1 - p) / 2})`;
            g.strokeRect(0, 0, map.tileWidth, map.tileHeight);
        }
        g.restore();
    }

    drawHearingRange(g, map, cameraZ, minDist, maxDist) {
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

const refreshDirectoryEvt = new Event("refreshUserDirectory");
const newRowColor = "lightgreen";
const avatarSize = style({ height: "32px" });
const warpToEvt = Object.assign(
    new Event("warpTo"),
    {
        id: null
    });

const ROW_TIMEOUT = 3000;
class UserDirectoryForm extends FormDialog {

    constructor() {
        super("users", "Users");

        const _ = (evt) => () => this.dispatchEvent(evt);

        /** @type {Map.<string, Element[]>} */
        this.rows = new Map();

        this.content.append(
            this.table = Div(
                style({
                    display: "grid",
                    gridTemplateColumns: "auto auto auto 1fr",
                    gridTemplateRows: "min-content",
                    columnGap: "5px",
                    width: "100%"
                })));

        this.table.append(
            Div(grid(1, 1), ""),
            Div(grid(2, 1), "ID"),
            Div(grid(3, 1), "Location"),
            Div(grid(4, 1), "Avatar"),
            Div(grid(5, 1), "User Name"));

        this.footer.append(
            Button(
                "Refresh",
                onClick(_(refreshDirectoryEvt))),

            this.confirmButton = Button(
                "Close",
                onClick(() => this.hide())));
    }

    /**
     * 
     * @param {User} user
     */
    set(user) {
        this.delete(user.id);
        const row = this.rows.size + 2;
        const elem = Div(
            grid(1, row, 4, 1),
            style({
                backgroundColor: newRowColor,
                zIndex: -1
            }));
        setTimeout(() => {
            this.table.removeChild(elem);
        }, ROW_TIMEOUT);
        this.table.append(elem);

        let avatar = "N/A";
        if (user.avatar && user.avatar.element) {
            avatar = user.avatar.element;
            avatarSize.apply(avatar);
        }

        const elems = [
            Button(
                grid(1, row),
                onClick(() => {
                    warpToEvt.id = user.id;
                    this.dispatchEvent(warpToEvt);
                }),
                "Visit"),
            Div(grid(2, row), user.id),
            Div(grid(3, row), `<x: ${user.position._tx}, y: ${user.position._ty}>`),
            Div(grid(4, row), avatar),
            Div(grid(5, row), user.displayName)];

        this.rows.set(user.id, elems);
        this.table.append(...elems);
    }

    delete(userID) {
        if (this.rows.has(userID)) {
            const elems = this.rows.get(userID);
            this.rows.delete(userID);
            for (let elem of elems) {
                this.table.removeChild(elem);
            }

            let rowCount = 2;
            for (let elems of this.rows.values()) {
                const r = row(rowCount++);
                for (let elem of elems) {
                    r.apply(elem);
                }
            }
        }
    }

    clear() {
        for (let id of this.rows.keys()) {
            this.delete(id);
        }
    }

    warn(...rest) {
        const elem = Div(
            style({ backgroundColor: "yellow" }),
            ...rest.map(i => i.toString()));
        this.table.append(elem);
        setTimeout(() => {
            this.table.removeChild(elem);
        }, 5000);
    }

    async showAsync() {
        this.show();
        await this.confirmButton.once("click");
        return false;
    }
}

const EMOJI_LIFE = 5;

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

    getClearTileNear(x, y, maxRadius, avatar) {
        for (let r = 1; r <= maxRadius; ++r) {
            for (let dx = -r; dx <= r; ++dx) {
                const dy1 = r - Math.abs(dx);
                const dy2 = -dy1;
                const tx = x + dx;
                const ty1 = y + dy1;
                const ty2 = y + dy2;

                if (this.isClear(tx, ty1, avatar)) {
                    return { x: tx, y: ty1 };
                }
                else if (this.isClear(tx, ty2, avatar)) {
                    return { x: tx, y: ty2 };
                }
            }
        }

        return { x, y };
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
    zoomChangedEvt = new Event("zoomChanged"),
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

/** @type {Map.<Game, EventedGamepad>} */
const gamepads = new Map();

class Game extends EventTarget {

    constructor() {
        super();

        this.element = Canvas(
            id("frontBuffer"),
            style({
                width: "100%",
                height: "100%",
                touchAction: "none"
            }));
        this.gFront = this.element.getContext("2d");

        this.me = null;
        this.map = null;
        this.keys = {};

        /** @type {Map.<string, User>} */
        this.users = new Map();

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

        /** @type {Emote[]} */
        this.emotes = [];

        this.inputBinding = {
            keyButtonUp: "ArrowUp",
            keyButtonDown: "ArrowDown",
            keyButtonLeft: "ArrowLeft",
            keyButtonRight: "ArrowRight",
            keyButtonEmote: "e",
            keyButtonToggleAudio: "a",

            gpAxisLeftRight: 0,
            gpAxisUpDown: 1,

            gpButtonUp: 12,
            gpButtonDown: 13,
            gpButtonLeft: 14,
            gpButtonRight: 15,
            gpButtonEmote: 0,
            gpButtonToggleAudio: 1
        };

        this.lastGamepadIndex = -1;
        this.gamepadIndex = -1;
        this.transitionSpeed = 0.125;


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
                    dx = tile.x - this.me.position._tx,
                    dy = tile.y - this.me.position._ty;

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
        if (this.users.has(evt.id)) {
            const user = this.users.get(evt.id);
            user.isActive = evt.isActive;
        }
    }

    emote(id, emoji) {
        if (this.users.has(id)) {
            const user = this.users.get(id);
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
                this.emotes.push(new Emote(emoji, user.position.x + 0.5, user.position.y));
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

    moveMeTo(x, y) {
        if (this.map.isClear(x, y, this.me.avatarEmoji)) {
            this.me.moveTo(x, y, this.transitionSpeed);
            this.targetOffsetCameraX = 0;
            this.targetOffsetCameraY = 0;
        }
    }


    moveMeBy(dx, dy) {
        const clearTile = this.map.getClearTile(this.me.position._tx, this.me.position._ty, dx, dy, this.me.avatarEmoji);
        this.moveMeTo(clearTile.x, clearTile.y);
    }

    warpMeTo(x, y) {
        const clearTile = this.map.getClearTileNear(x, y, 3, this.me.avatarEmoji);
        this.moveMeTo(clearTile.x, clearTile.y);
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
            this.dispatchEvent(zoomChangedEvt);
        }
    }

    addUser(evt) {
        //evt = {
        //    id: "string", // the id of the participant
        //    displayName: "string" // the display name of the participant
        //};
        if (this.users.has(evt.id)) {
            this.removeUser(evt);
        }

        const user = new User(evt, false);
        this.users.set(evt.id, user);

        userJoinedEvt.user = user;
        this.dispatchEvent(userJoinedEvt);
    }

    toggleMyAudio() {
        this.dispatchEvent(toggleAudioEvt$1);
    }

    toggleMyVideo() {
        this.dispatchEvent(toggleVideoEvt$1);
    }

    muteUserAudio(evt) {
        let mutingUser = this.me;
        if (!!evt.id && this.users.has(evt.id)) {
            mutingUser = this.users.get(evt.id);
        }

        if (!mutingUser) {
            console.warn("No user found to mute audio, retrying in 1 second.");
            setTimeout(this.muteUserAudio.bind(this, evt), 1000);
        }
        else {
            mutingUser.audioMuted = evt.muted;
        }
    }

    muteUserVideo(evt) {
        let mutingUser = this.me;
        if (!!evt.id && this.users.has(evt.id)) {
            mutingUser = this.users.get(evt.id);
        }

        if (!mutingUser) {
            console.warn("No user found to mute video, retrying in 1 second.");
            setTimeout(this.muteUserVideo.bind(this, evt), 1000);
        }
        else {
            mutingUser.videoMuted = evt.muted;
        }
    }

    withUser(id, callback, timeout) {
        if (timeout === undefined) {
            timeout = 5000;
        }
        if (!!id) {
            if (this.users.has(id)) {
                const user = this.users.get(id);
                callback(user);
            }
            else {
                console.warn("No user, trying again in a quarter second");
                if (timeout > 0) {
                    setTimeout(this.withUser.bind(this, id, callback, timeout - 250), 250);
                }
            }
        }
    }

    changeUserName(evt) {
        //evt = {
        //    id: string, // the id of the participant that changed his display name
        //    displayName: string // the new display name
        //};
        this.withUser(evt && evt.id, (user) => {
            user.setDisplayName(evt.displayName);
        });
    }

    removeUser(evt) {
        //evt = {
        //    id: "string" // the id of the participant
        //};
        this.withUser(evt && evt.id, (user) => {
            this.users.delete(user.id);
        });
    }

    setAvatarVideo(evt) {
        this.withUser(evt && evt.id, (user) => {
            user.avatarVideo = evt.element;
        });
    }

    setAvatarURL(evt) {
        //evt = {
        //  id: string, // the id of the participant that changed his avatar.
        //  avatarURL: string // the new avatar URL.
        //}
        this.withUser(evt && evt.id, (user) => {
            user.avatarImage = evt.avatarURL;
        });
    }

    setAvatarEmoji(evt) {
        //evt = {
        //  id: string, // the id of the participant that changed his avatar.
        //  value: string // the emoji text to use as the avatar.
        //  desc: string // a description of the emoji
        //}
        this.withUser(evt && evt.id, (user) => {
            user.avatarEmoji = evt;
        });
    }

    async start(evt) {
        //evt = {
        //    roomName: "string", // the room name of the conference
        //    id: "string", // the id of the local participant
        //    displayName: "string", // the display name of the local participant
        //    avatarURL: "string" // the avatar URL of the local participant
        //};

        this.currentRoomName = evt.roomName.toLowerCase();
        this.me = new User(evt, true);
        this.users.set(evt.id, this.me);

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
        this.dispatchEvent(zoomChangedEvt);
        this.dispatchEvent(gameStartedEvt);
    }

    startLoop() {
        this.show();
        this.resize();
        this.element.focus();

        requestAnimationFrame((time) => {
            this.lastTime = time;
            requestAnimationFrame(this._loop);
        });
    }

    resize() {
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
        this.users.clear();
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

            const gp = navigator.getGamepads()[this.gamepadIndex];
            if (gp) {
                if (!gamepads.has(this)) {
                    gamepads.set(this, new EventedGamepad(gp));
                }

                const pad = gamepads.get(this);
                pad.update(gp);

                if (pad.buttons[this.inputBinding.gpButtonEmote].pressed) {
                    this.emote(this.me.id, this.currentEmoji);
                }

                if (!pad.lastButtons[this.inputBinding.gpButtonToggleAudio].pressed
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

                dx += Math.round(pad.axes[this.inputBinding.gpAxisLeftRight]);
                dy += Math.round(pad.axes[this.inputBinding.gpAxisUpDown]);

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

        for (let user of this.users.values()) {
            user.update(this.map, this.users);
        }
    }

    render() {
        const targetCameraX = -this.me.position.x * this.map.tileWidth,
            targetCameraY = -this.me.position.y * this.map.tileHeight;

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

            for (let user of this.users.values()) {
                user.drawShadow(this.gFront, this.map, this.cameraZ);
            }

            for (let emote of this.emotes) {
                emote.drawShadow(this.gFront, this.map, this.cameraZ);
            }

            for (let user of this.users.values()) {
                user.drawAvatar(this.gFront, this.map);
            }

            this.drawCursor();

            for (let user of this.users.values()) {
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

class BaseAudioClient extends EventTarget {

    constructor() {
        super();
    }

    /**
     *
     * @param {string} deviceID
     */
    setAudioOutputDevice(deviceID) {
        throw new Error("Not implemented in base class");
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
     * @param {string} userID
     */
    removeSource(userID) {
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
        "audioAdded",
        "videoAdded",
        "audioRemoved",
        "videoRemoved"
    ];

// Manages communication between Jitsi Meet and Calla
class BaseJitsiClient extends EventTarget {

    constructor() {
        super();

        /** @type {String} */
        this.localUser = null;

        /** @type {BaseAudioClient} */
        this.audioClient = null;

        this.preInitEvtQ = [];

        this.preferedAudioOutputID = null;
        this.preferedAudioInputID = null;
        this.preferedVideoInputID = null;
    }

    userIDs() {
        throw new Error("Not implemented in base class");
    }

    userExists(id) {
        throw new Error("Not implemented in base class");
    }

    users() {
        throw new Error("Not implemented in base class");
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

        window.addEventListener("unload", () => {
            this.dispose();
        });

        const joinInfo = await joinTask;

        this.setDisplayName(userName);


        const audioOutputs = await this.getAudioOutputDevicesAsync();
        const audOut = audioOutputs.scan(
            (d) => d.deviceId === this.preferedAudioOutputID,
            (d) => d.deviceId === "communications",
            (d) => d.deviceId === "default",
            (d) => !!d);
        if (audOut) {
            await this.setAudioOutputDevice(audOut);
        }

        const audioInputs = await this.getAudioInputDevicesAsync();
        const audIn = audioInputs.scan(
            (d) => d.deviceId === this.preferedAudioInputID,
            (d) => d.deviceId === "communications",
            (d) => d.deviceId === "default",
            (d) => !!d);
        if (audIn) {
            await this.setAudioInputDeviceAsync(audIn);
        }

        const videoInputs = await this.getVideoInputDevicesAsync();
        const vidIn = videoInputs.scan((d) => d.deviceId === this.preferedVideoInputID);
        if (vidIn) {
            await this.setVideoInputDeviceAsync(vidIn);
        }

        return joinInfo;
    }

    dispose() {
        this.leave();
    }

    /**
     * 
     * @param {string} userName
     */
    setDisplayName(userName) {
        throw new Error("Not implemented in base class");
    }

    async leaveAsync() {
        const leaveTask = this.once("videoConferenceLeft", 5000);
        const maybeLeaveTask = this.leave();
        if (maybeLeaveTask instanceof Promise) {
            await maybeLeaveTask;
        }
        return await leaveTask;
    }

    leave() {
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
        for (let toUserID of this.userIDs()) {
            this.sendMessageTo(toUserID, "userMoved", evt);
        }
    }

    setUserPosition(evt) {
        this.audioClient.setUserPosition(evt);
    }

    removeUser(evt) {
        this.audioClient.removeSource(evt.id);
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
        for (let toUserID of this.userIDs()) {
            this.sendMessageTo(toUserID, "setAvatarEmoji", emoji);
        }
    }

    emote(emoji) {
        for (let toUserID of this.userIDs()) {
            this.sendMessageTo(toUserID, "emote", emoji);
        }
    }

    startAudio() {
    }
}

class JitsiClientEvent extends Event {
    constructor(command, id, value) {
        super(command);
        this.id = id;
        Event.clone(this, value);
    }
}

const selfs$3 = new Map(),
    KEY = "CallaSettings",
    DEFAULT_SETTINGS = {
        drawHearing: false,
        audioDistanceMin: 1,
        audioDistanceMax: 10,
        audioRolloff: 1,
        fontSize: 12,
        transitionSpeed: 1,
        zoom: 1.5,
        roomName: "calla",
        userName: "",
        avatarEmoji: null,
        gamepadIndex: 0,
        preferedAudioOutputID: null,
        preferedAudioInputID: null,
        preferedVideoInputID: null,

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
    const self = selfs$3.get(settings);
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
        selfs$3.set(this, self);
        if (window.location.hash.length > 0) {
            self.roomName = window.location.hash.substring(1);
        }
        Object.seal(this);
    }

    get preferedAudioOutputID() {
        return selfs$3.get(this).preferedAudioOutputID;
    }

    set preferedAudioOutputID(value) {
        if (value !== this.preferedAudioOutputID) {
            selfs$3.get(this).preferedAudioOutputID = value;
            commit(this);
        }
    }

    get preferedAudioInputID() {
        return selfs$3.get(this).preferedAudioInputID;
    }

    set preferedAudioInputID(value) {
        if (value !== this.preferedAudioInputID) {
            selfs$3.get(this).preferedAudioInputID = value;
            commit(this);
        }
    }

    get preferedVideoInputID() {
        return selfs$3.get(this).preferedVideoInputID;
    }

    set preferedVideoInputID(value) {
        if (value !== this.preferedVideoInputID) {
            selfs$3.get(this).preferedVideoInputID = value;
            commit(this);
        }
    }

    get transitionSpeed() {
        return selfs$3.get(this).transitionSpeed;
    }

    set transitionSpeed(value) {
        if (value !== this.transitionSpeed) {
            selfs$3.get(this).transitionSpeed = value;
            commit(this);
        }
    }

    get drawHearing() {
        return selfs$3.get(this).drawHearing;
    }

    set drawHearing(value) {
        if (value !== this.drawHearing) {
            selfs$3.get(this).drawHearing = value;
            commit(this);
        }
    }

    get audioDistanceMin() {
        return selfs$3.get(this).audioDistanceMin;
    }

    set audioDistanceMin(value) {
        if (value !== this.audioDistanceMin) {
            selfs$3.get(this).audioDistanceMin = value;
            commit(this);
        }
    }

    get audioDistanceMax() {
        return selfs$3.get(this).audioDistanceMax;
    }

    set audioDistanceMax(value) {
        if (value !== this.audioDistanceMax) {
            selfs$3.get(this).audioDistanceMax = value;
            commit(this);
        }
    }

    get audioRolloff() {
        return selfs$3.get(this).audioRolloff;
    }

    set audioRolloff(value) {
        if (value !== this.audioRolloff) {
            selfs$3.get(this).audioRolloff = value;
            commit(this);
        }
    }

    get fontSize() {
        return selfs$3.get(this).fontSize;
    }

    set fontSize(value) {
        if (value !== this.fontSize) {
            selfs$3.get(this).fontSize = value;
            commit(this);
        }
    }

    get zoom() {
        return selfs$3.get(this).zoom;
    }

    set zoom(value) {
        if (value !== this.zoom) {
            selfs$3.get(this).zoom = value;
            commit(this);
        }
    }

    get userName() {
        return selfs$3.get(this).userName;
    }

    set userName(value) {
        if (value !== this.userName) {
            selfs$3.get(this).userName = value;
            commit(this);
        }
    }

    get avatarEmoji() {
        return selfs$3.get(this).avatarEmoji;
    }

    set avatarEmoji(value) {
        if (value !== this.avatarEmoji) {
            selfs$3.get(this).avatarEmoji = value;
            commit(this);
        }
    }

    get roomName() {
        return selfs$3.get(this).roomName;
    }

    set roomName(value) {
        if (value !== this.roomName) {
            selfs$3.get(this).roomName = value;
            commit(this);
        }
    }

    get gamepadIndex() {
        return selfs$3.get(this).gamepadIndex;
    }

    set gamepadIndex(value) {
        if (value !== this.gamepadIndex) {
            selfs$3.get(this).gamepadIndex = value;
            commit(this);
        }
    }

    get inputBinding() {
        return selfs$3.get(this).inputBinding;
    }

    set inputBinding(value) {
        if (value !== this.inputBinding) {
            selfs$3.get(this).inputBinding = value;
            commit(this);
        }
    }
}

/**
 * 
 * @param {string} host
 * @param {BaseJitsiClient} client
 */
function init(host, client) {
    const settings = new Settings(),
        game = new Game(),
        login = new LoginForm(),
        directory = new UserDirectoryForm(),
        headbar = new HeaderBar(),
        footbar = new FooterBar(),
        options = new OptionsForm(),
        emoji = new EmojiForm(),

        forExport = {
            settings,
            client,
            game,
            login,
            directory,
            headbar,
            footbar,
            options,
            emoji
        },

        forAppend = [
            game,
            directory,
            options,
            emoji,
            headbar,
            footbar,
            login
        ].filter(x => x.element);

    function showLogin() {
        game.hide();
        directory.hide();
        options.hide();
        emoji.hide();
        headbar.enabled = false;
        footbar.enabled = false;
        login.show();
    }

    async function withEmojiSelection(callback) {
        if (!emoji.isOpen) {
            headbar.optionsButton.lock();
            headbar.instructionsButton.lock();
            options.hide();
            const e = await emoji.selectAsync();
            if (!!e) {
                callback(e);
            }
            headbar.optionsButton.unlock();
            headbar.instructionsButton.unlock();
        }
    }

    async function selectEmojiAsync() {
        await withEmojiSelection((e) => {
            game.emote(client.localUser, e);
            footbar.setEmojiButton(settings.inputBinding.keyButtonEmote, e);
        });
    }

    function setAudioProperties() {
        client.setAudioProperties(
            window.location.origin,
            settings.transitionSpeed,
            settings.audioDistanceMin = game.audioDistanceMin = options.audioDistanceMin,
            settings.audioDistanceMax = game.audioDistanceMax = options.audioDistanceMax,
            settings.audioRolloff = options.audioRolloff);
    }

    function refreshGamepads() {
        options.gamepads = navigator.getGamepads();
        options.gamepadIndex = game.gamepadIndex;
    }

    function refreshUser(userID) {
        if (game.users.has(userID)) {
            const user = game.users.get(userID);
            if (!user.isMe) {
                directory.set(user);
            }
        }
    }

    document.body.style.display = "grid";
    document.body.style.gridTemplateRows = "auto 1fr auto";
    let z = 0;
    for (let e of forAppend) {
        if (e.element) {
            let g = null;
            if (e === headbar) {
                g = grid(1, 1);
            }
            else if (e === footbar) {
                g = grid(1, 3);
            }
            else if (e === game || e === login) {
                g = grid(1, 1, 1, 3);
            }
            else {
                g = grid(1, 2);
            }
            g.apply(e.element);
            e.element.style.zIndex = (z++);
            document.body.append(e.element);
        }
    }

    refreshGamepads();
    headbar.enabled = false;
    footbar.enabled = false;
    options.drawHearing = game.drawHearing = settings.drawHearing;
    options.audioDistanceMin = game.audioDistanceMin = settings.audioDistanceMin;
    options.audioDistanceMax = game.audioDistanceMax = settings.audioDistanceMax;
    options.audioRolloff = settings.audioRolloff;
    options.fontSize = game.fontSize = settings.fontSize;
    options.gamepadIndex = game.gamepadIndex = settings.gamepadIndex;
    options.inputBinding = game.inputBinding = settings.inputBinding;
    game.cameraZ = game.targetCameraZ = settings.zoom;
    game.transitionSpeed = settings.transitionSpeed = 0.5;
    login.userName = settings.userName;
    login.roomName = settings.roomName;
    client.preferedAudioOutputID = settings.preferedAudioOutputID;
    client.preferedAudioInputID = settings.preferedAudioInputID;
    client.preferedVideoInputID = settings.preferedVideoInputID;

    showLogin();

    window.addEventListeners({
        gamepadconnected: refreshGamepads,
        gamepaddisconnected: refreshGamepads,

        resize: () => {
            game.resize();
        }
    });

    const showView = (view) => () => {
        if (!emoji.isOpen) {
            const isOpen = view.isOpen;
            login.hide();
            directory.hide();
            options.hide();
            view.isOpen = !isOpen;
        }
    };

    headbar.addEventListeners({
        toggleOptions: showView(options),
        toggleInstructions: showView(login),
        toggleUserDirectory: showView(directory),

        toggleFullscreen: () => {
            headbar.isFullscreen = !headbar.isFullscreen;
        },

        tweet: () => {
            const message = encodeURIComponent(`Join my #TeleParty ${document.location.href}`),
                url = new URL("https://twitter.com/intent/tweet?text=" + message);
            open(url);
        },

        leave: () => {
            client.leave();
        }
    });

    footbar.addEventListeners({
        selectEmoji: selectEmojiAsync,

        emote: () => {
            game.emote(client.localUser, game.currentEmoji);
        },

        toggleAudio: () => {
            client.toggleAudioAsync();
        },

        toggleVideo: () => {
            client.toggleVideoAsync();
        }
    });


    login.addEventListener("login", () => {
        client.startAudio();
        client.joinAsync(
            host,
            settings.roomName = login.roomName,
            settings.userName = login.userName);
    });


    options.addEventListeners({
        audioPropertiesChanged: setAudioProperties,

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
            const device = options.currentAudioInputDevice;
            settings.preferedAudioInputID = device && device.deviceId || null;
            client.setAudioInputDeviceAsync(device);
        },

        audioOutputChanged: () => {
            const device = options.currentAudioOutputDevice;
            settings.preferedAudioOutputID = device && device.deviceId || null;
            client.setAudioOutputDevice(device);
        },

        videoInputChanged: () => {
            const device = options.currentVideoInputDevice;
            settings.preferedVideoInputID = device && device.deviceId || null;
            client.setVideoInputDeviceAsync(device);
        },

        gamepadChanged: () => {
            settings.gamepadIndex = game.gamepadIndex = options.gamepadIndex;
        },

        inputBindingChanged: () => {
            settings.inputBinding = game.inputBinding = options.inputBinding;
        }
    });

    game.addEventListeners({
        emojiNeeded: selectEmojiAsync,

        emote: (evt) => {
            client.emote(evt.emoji);
        },

        userJoined: (evt) => {
            evt.user.addEventListener("userPositionNeeded", (evt2) => {
                client.userInitRequest(evt2.id);
            });
            refreshUser(evt.user.id);
        },

        toggleAudio: () => {
            client.toggleAudioAsync();
        },

        toggleVideo: () => {
            client.toggleVideoAsync();
        },

        gameStarted: () => {
            grid(1, 2).apply(login.element);
            login.hide();
            headbar.enabled = true;
            footbar.enabled = true;

            setAudioProperties();

            client.setLocalPosition(game.me.serialize());
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
            login.connected = false;
            showLogin();
        },

        zoomChanged: () => {
            settings.zoom = game.targetCameraZ;
        }
    });

    directory.addEventListeners({
        refreshUserDirectory: () => {
            directory.clear();
            for (let userID of game.users.keys()) {
                if (userID !== client.localUser) {
                    refreshUser(userID);
                }
            }
        },

        warpTo: (evt) => {
            if (game.users.has(evt.id)) {
                const user = game.users.get(evt.id);
                game.warpMeTo(user.position._tx, user.position._ty);
                directory.hide();
            }
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
            footbar.audioEnabled = !audioMuted;

            const videoMuted = await client.isVideoMutedAsync();
            game.muteUserVideo({ id: client.localUser, muted: videoMuted });
            footbar.videoEnabled = !videoMuted;
        },

        videoConferenceLeft: (evt) => {
            game.end();
        },

        participantJoined: (evt) => {
            game.addUser(evt);
        },

        videoAdded: (evt) => {
            game.setAvatarVideo(evt);
            refreshUser(evt.id);
        },

        videoRemoved: (evt) => {
            game.setAvatarVideo(evt);
            refreshUser(evt.id);
        },

        participantLeft: (evt) => {
            game.removeUser(evt);
            client.removeUser(evt);
            directory.delete(evt.id);
        },

        avatarChanged: (evt) => {
            game.setAvatarURL(evt);
            if (evt.id === client.localUser) {
                options.avatarURL = evt.avatarURL;
            }
            refreshUser(evt.id);
        },

        displayNameChange: (evt) => {
            game.changeUserName(evt);
            refreshUser(evt.id);
        },

        audioMuteStatusChanged: async (evt) => {
            game.muteUserAudio(evt);
            if (evt.id === client.localUser) {
                footbar.audioEnabled = !evt.muted;
                options.currentAudioInputDevice = await client.getCurrentAudioInputDeviceAsync();
            }
        },

        videoMuteStatusChanged: async (evt) => {
            game.muteUserVideo(evt);
            if (evt.id === client.localUser) {
                footbar.videoEnabled = !evt.muted;
                options.currentVideoInputDevice = await client.getCurrentVideoInputDeviceAsync();
            }
        },

        userInitRequest: (evt) => {
            if (game.me && game.me.id) {
                client.userInitResponse(evt.id, game.me.serialize());
            }
            else {
                directory.warn("Local user not initialized");
            }
        },

        userInitResponse: (evt) => {
            if (game.users.has(evt.id)) {
                const user = game.users.get(evt.id);
                user.deserialize(evt);
                client.setUserPosition(evt);
                refreshUser(evt.id);
            }
        },

        userMoved: (evt) => {
            if (game.users.has(evt.id)) {
                const user = game.users.get(evt.id);
                user.moveTo(evt.x, evt.y, settings.transitionSpeed);
                client.setUserPosition(evt);
            }
            refreshUser(evt.id);
        },

        emote: (evt) => {
            game.emote(evt.id, evt);
        },

        setAvatarEmoji: (evt) => {
            game.setAvatarEmoji(evt);
            refreshUser(evt.id);
        },

        audioActivity: (evt) => {
            game.updateAudioActivity(evt);
        }
    });

    login.ready = true;

    return forExport;
}

class MockAudioContext {
    constructor() {
        this._t = performance.now() / 1000;
    }

    get currentTime() {
        return performance.now() / 1000 - this._t;
    }

    /** @type {AudioDestinationNode} */
    get destination() {
        return null;
    }
}

class WebAudioOldListenerPosition extends InterpolatedPosition {

    /**
     * 
     * @param {AudioListener} listener
     */
    constructor(listener) {
        super();
        
        this.listener = listener;
        this.listener.setPosition(0, 0, 0);
        this.listener.setOrientation(0, 0, -1, 0, 1, 0);
    }

    /**
     * 
     * @param {number} t
     */
    update(t) {
        super.update(t);
        this.listener.setPosition(this.x, 0, this.y);
    }
}

class WebAudioNodePosition extends BasePosition {
    /**
     * 
     * @param {PannerNode|AudioListener} node
     * @param {boolean} forceInterpolation
     */
    constructor(node, forceInterpolation) {
        super();

        /** @type {BasePosition} */
        this._p = forceInterpolation ? new InterpolatedPosition() : null;
        this.node = node;
        this.node.positionX.setValueAtTime(0, 0);
        this.node.positionY.setValueAtTime(0, 0);
        this.node.positionZ.setValueAtTime(0, 0);
    }

    /** @type {number} */
    get x() {
        return this.node.positionX.value;
    }

    /** @type {number} */
    get y() {
        return this.node.positionZ.value;
    }

    /**
     *
     * @param {UserPosition} evt
     * @param {number} t
     * @param {number} dt
     */
    setTarget(evt, t, dt) {
        if (this._p) {
            this._p.setTarget(evt, t, dt);
        }
        else {
            const time = t + dt;
            // our 2D position is in X/Y coords, but our 3D position
            // along the horizontal plane is X/Z coords.
            this.node.positionX.linearRampToValueAtTime(evt.x, time);
            this.node.positionZ.linearRampToValueAtTime(evt.y, time);
        }
    }

    /**
     *
     * @param {number} t
     */
    update(t) {
        if (this._p) {
            this._p.update(t);
            this.node.positionX.linearRampToValueAtTime(this._p.x, 0);
            this.node.positionZ.linearRampToValueAtTime(this._p.y, 0);
        }
    }
}

class WebAudioNewListenerPosition extends WebAudioNodePosition {
    /**
     * 
     * @param {AudioListener} node
     * @param {boolean} forceInterpolation
     */
    constructor(node, forceInterpolation) {
        super(node, forceInterpolation);
        this.node.forwardX.setValueAtTime(0, 0);
        this.node.forwardY.setValueAtTime(0, 0);
        this.node.forwardZ.setValueAtTime(-1, 0);
        this.node.upX.setValueAtTime(0, 0);
        this.node.upY.setValueAtTime(1, 0);
        this.node.upZ.setValueAtTime(0, 0);
    }
}

class BaseAudioElement extends EventTarget {
    /**
     * 
     * @param {BasePosition} position
     */
    constructor(position) {
        super();

        this.minDistance = 1;
        this.maxDistance = 10;
        this.rolloff = 1;
        this.transitionTime = 0.5;

        /** @type {BasePosition} */
        this.position = position;
    }

    setAudioProperties(minDistance, maxDistance, rolloff, transitionTime) {
        this.minDistance = minDistance;
        this.maxDistance = maxDistance;
        this.transitionTime = transitionTime;
        this.rolloff = rolloff;
    }

    get currentTime() {
        throw new Error("Not implemented in base class");
    }

    /**
     * Set the target position
     * @param {Point} evt
     */
    setTarget(evt) {
        if (this.position) {
            this.position.setTarget(evt, this.currentTime, this.transitionTime);
            this.update();
        }
    }

    update() {
        if (this.position) {
            this.position.update(this.currentTime);
        }
    }
}

/** Base class providing functionality for spatializers. */
class BaseSpatializer extends BaseAudioElement {

    /**
     * Creates a spatializer that keeps track of the relative position
     * of an audio element to the listener destination.
     * @param {string} userID
     * @param {Destination} destination
     * @param {HTMLAudioElement} audio
     * @param {BasePosition} position
     */
    constructor(userID, destination, audio, position) {
        super(position);

        this.id = userID;
        this.destination = destination;
        this.audio = audio;
        this.volume = 1;
        this.pan = 0;
    }
    /**
     * Discard values and make this instance useless.
     */
    dispose() {
        this.audio.pause();

        this.position = null;
        this.audio = null;
        this.destination = null;
        this.id = null;
    }

    setAudioOutputDevice(deviceID) {
        if (this.audio.setSinkId) {
            this.audio.setSinkId(deviceID);
        }
    }

    get currentTime() {
        return this.destination.currentTime;
    }

    /**
     * Run the position interpolation
     */
    update() {
        super.update();

        const lx = this.destination.position.x,
            ly = this.destination.position.y,
            distX = this.position.x - lx,
            distY = this.position.y - ly,
            dist = Math.sqrt(distX * distX + distY * distY),
            projected = project(dist, this.destination.minDistance, this.destination.maxDistance);

        this.volume = 1 - clamp(projected, 0, 1);
        this.pan = dist > 0
            ? distX / dist
            : 0;
    }
}

class VolumeOnlySpatializer extends BaseSpatializer {

    /**
     *
     * @param {string} userID
     * @param {Destination} destination
     * @param {HTMLAudioElement} audio
     */
    constructor(userID, destination, audio) {
        super(userID, destination, audio, new InterpolatedPosition());
        this.audio.play();

        Object.seal(this);
    }

    update() {
        super.update();
        this.audio.volume = this.volume;
    }
}

const audioActivityEvt = Object.assign(new Event("audioActivity", {
    id: null,
    isActive: false
})),
    activityCounterMin = 0,
    activityCounterMax = 60,
    activityCounterThresh = 5;

/**
 * 
 * @param {number} frequency
 * @param {number} sampleRate
 * @param {number} bufferSize
 */
function frequencyToIndex(frequency, sampleRate, bufferSize) {
    var nyquist = sampleRate / 2;
    var index = Math.round(frequency / nyquist * bufferSize);
    return clamp(index, 0, bufferSize)
}

/**
 * 
 * @param {AnalyserNode} analyser
 * @param {Float32Array} frequencies
 * @param {number} minHz
 * @param {number} maxHz
 * @param {number} bufferSize
 */
function analyserFrequencyAverage(analyser, frequencies, minHz, maxHz, bufferSize) {
    const sampleRate = analyser.context.sampleRate,
        start = frequencyToIndex(minHz, sampleRate, bufferSize),
        end = frequencyToIndex(maxHz, sampleRate, bufferSize),
        count = end - start;
    let sum = 0;
    for (let i = start; i < end; ++i) {
        sum += frequencies[i];
    }
    return count === 0 ? 0 : (sum / count);
}

class BaseAnalyzedSpatializer extends BaseSpatializer {

    /**
     * 
     * @param {string} userID
     * @param {Destination} destination
     * @param {HTMLAudioElement} audio
     * @param {BasePosition} position
     * @param {number} bufferSize
     * @param {PannerNode|StereoPannerNode} inNode
     */
    constructor(userID, destination, audio, position, bufferSize, inNode) {
        super(userID, destination, audio, position);

        this.audio.volume = 0;

        this.bufferSize = bufferSize;
        this.buffer = new Float32Array(this.bufferSize);

        /** @type {AnalyserNode} */
        this.analyser = this.destination.audioContext.createAnalyser();
        this.analyser.fftSize = 2 * this.bufferSize;
        this.analyser.smoothingTimeConstant = 0.2;

        /** @type {PannerNode|StereoPannerNode} */
        this.inNode = inNode;

        /** @type {boolean} */
        this.wasActive = false;
        this.lastAudible = true;
        this.activityCounter = 0;

        /** @type {MediaStream} */
        this.stream = null;

        /** @type {MediaSource} */
        this.source = null;
    }

    update() {
        super.update();

        if (!this.source) {
            try {
                if (!this.stream) {
                    this.stream = !!this.audio.mozCaptureStream
                        ? this.audio.mozCaptureStream()
                        : this.audio.captureStream();
                }

                if (this.stream.active) {
                    this.source = this.destination.audioContext.createMediaStreamSource(this.stream);
                    this.source.connect(this.analyser);
                    this.source.connect(this.inNode);
                }
            }
            catch (exp) {
                console.warn("Source isn't available yet. Will retry in a moment. Reason: ", exp);
            }
        }

        if (!!this.source) {
            this.analyser.getFloatFrequencyData(this.buffer);

            const average = 1.1 + analyserFrequencyAverage(this.analyser, this.buffer, 85, 255, this.bufferSize) / 100;
            if (average >= 0.5 && this.activityCounter < activityCounterMax) {
                this.activityCounter++;
            } else if (average < 0.5 && this.activityCounter > activityCounterMin) {
                this.activityCounter--;
            }

            const isActive = this.activityCounter > activityCounterThresh;
            if (this.wasActive !== isActive) {
                this.wasActive = isActive;
                audioActivityEvt.id = this.id;
                audioActivityEvt.isActive = isActive;
                this.dispatchEvent(audioActivityEvt);
            }
        }
    }

    dispose() {
        if (!!this.source) {
            this.source.disconnect(this.analyser);
            this.source.disconnect(this.inNode);
        }

        this.source = null;
        this.stream = null;
        this.inNode = null;
        this.analyser = null;
        this.buffer = null;

        super.dispose();
    }
}

class BaseWebAudioSpatializer extends BaseAnalyzedSpatializer {

    /**
     * 
     * @param {string} userID
     * @param {Destination} destination
     * @param {HTMLAudioElement} audio
     * @param {BasePosition} position
     * @param {number} bufferSize
     * @param {PannerNode|StereoPannerNode} inNode
     * @param {GainNode=} outNode
     */
    constructor(userID, destination, audio, position, bufferSize, inNode, outNode) {
        super(userID, destination, audio, position, bufferSize, inNode);

        this.outNode = outNode || inNode;
        this.outNode.connect(this.destination.audioContext.destination);

        if (this.inNode !== this.outNode) {
            this.inNode.connect(this.outNode);
        }
    }

    dispose() {
        if (this.inNode !== this.outNode) {
            this.inNode.disconnect(this.outNode);
        }

        this.outNode.disconnect(this.destination.audioContext.destination);
        this.outNode = null;

        super.dispose();
    }
}

class FullSpatializer extends BaseWebAudioSpatializer {

    /**
     *
     * @param {string} userID
     * @param {Destination} destination
     * @param {HTMLAudioElement} audio
     * @param {number} bufferSize
     * @param {boolean} forceInterpolatedPosition
     */
    constructor(userID, destination, audio, bufferSize, forceInterpolatedPosition) {
        const panner = destination.audioContext.createPanner(),
            position = new WebAudioNodePosition(panner, forceInterpolatedPosition);
        super(userID, destination, audio, position, bufferSize, panner);

        this.inNode.panningModel = "HRTF";
        this.inNode.distanceModel = "inverse";
        this.inNode.refDistance = destination.minDistance;
        this.inNode.rolloffFactor = destination.rolloff;
        this.inNode.coneInnerAngle = 360;
        this.inNode.coneOuterAngle = 0;
        this.inNode.coneOuterGain = 0;

        Object.seal(this);
    }

    setAudioProperties(minDistance, maxDistance, rolloff, transitionTime) {
        super.setAudioOutputDevice(minDistance, maxDistance, rolloff, transitionTime);
        this.inNode.refDistance = minDistance;
        this.inNode.rolloffFactor = rolloff;
    }
}

class StereoSpatializer extends BaseWebAudioSpatializer {

    /**
     *
     * @param {string} userID
     * @param {Destination} destination
     * @param {HTMLAudioElement} audio
     * @param {number} bufferSize
     */
    constructor(userID, destination, audio, bufferSize) {
        super(userID, destination, audio, new InterpolatedPosition(), bufferSize,
            destination.audioContext.createStereoPanner(),
            destination.audioContext.createGain());

        Object.seal(this);
    }

    update() {
        super.update();
        this.inNode.pan.value = this.pan;
        this.outNode.gain.value = this.volume;
    }
}

class GoogleResonanceAudioScene extends InterpolatedPosition {
    /**
     *
     * @param {AudioContext} audioContext
     */
    constructor(audioContext) {
        super();

        this.scene = new ResonanceAudio(audioContext, {
            ambisonicOrder: 3
        });
        this.scene.output.connect(audioContext.destination);

        this.position = new InterpolatedPosition();

        this.scene.setRoomProperties({
            width: 10,
            height: 5,
            depth: 10,
        }, {
            left: "transparent",
            right: "transparent",
            front: "transparent",
            back: "transparent",
            down: "grass",
            up: "transparent",
        });
    }

    update(t) {
        super.update(t);
        this.scene.setListenerPosition(this.x, 0, this.y);
    }
}

class GoogleResonanceAudioSpatializer extends BaseAnalyzedSpatializer {

    /**
     * 
     * @param {string} userID
     * @param {Destination} destination
     * @param {HTMLAudioElement} audio
     * @param {number} bufferSize
     */
    constructor(userID, destination, audio, bufferSize) {
        const position = new InterpolatedPosition();
        const resNode = destination.position.scene.createSource({
            minDistance: destination.minDistance,
            maxDistance: destination.maxDistance
        });

        super(userID, destination, audio, position, bufferSize, resNode.input);

        this.resNode = resNode;
    }

    setAudioProperties(minDistance, maxDistance, rolloff, transitionTime) {
        super.setAudioOutputDevice(minDistance, maxDistance, rolloff, transitionTime);
        this.resNode.setMinDistance(minDistance);
        this.resNode.setMaxDistance(maxDistance);
    }

    update() {
        super.update();
        this.resNode.setPosition(this.position.x, 0, this.position.y);
    }

    dispose() {
        this.resNode = null;
        super.dispose();
    }
}

/* global window, AudioListener, AudioContext, Event, EventTarget */

const forceInterpolatedPosition = false,
    contextDestroyingEvt = new Event("contextDestroying"),
    contextDestroyedEvt = new Event("contextDestroyed");

let hasWebAudioAPI = window.hasOwnProperty("AudioListener"),
    hasFullSpatializer = hasWebAudioAPI && window.hasOwnProperty("PannerNode"),
    isLatestWebAudioAPI = hasWebAudioAPI && AudioListener.prototype.hasOwnProperty("positionX"),
    attemptResonanceAPI = true;

class Destination extends BaseAudioElement {

    constructor() {
        super(null);

        /** @type {AudioContext|MockAudioContext} */
        this.audioContext = null;
    }

    createContext() {
        if (!this.audioContext) {
            try {
                if (hasWebAudioAPI) {
                    this.audioContext = new AudioContext();

                    try {
                        if (isLatestWebAudioAPI) {
                            try {
                                if (attemptResonanceAPI) {
                                    this.position = new GoogleResonanceAudioScene(this.audioContext);
                                }
                            }
                            catch (exp3) {
                                attemptResonanceAPI = false;
                                console.warn("Resonance Audio API not available!", exp3);
                            }
                            finally {
                                if (!attemptResonanceAPI) {
                                    this.position = new WebAudioNewListenerPosition(this.audioContext.listener, forceInterpolatedPosition);
                                }
                            }
                        }
                    }
                    catch (exp2) {
                        isLatestWebAudioAPI = false;
                        console.warn("No AudioListener.positionX property!", exp2);
                    }
                    finally {
                        if (!isLatestWebAudioAPI) {
                            this.position = new WebAudioOldListenerPosition(this.audioContext.listener);
                        }
                    }
                }
            }
            catch (exp1) {
                hasWebAudioAPI = false;
                console.warn("No WebAudio API!", exp1);
            }
            finally {
                if (!hasWebAudioAPI) {
                    this.audioContext = new MockAudioContext();
                    this.position = new InterpolatedPosition();
                }
            }
        }
    }

    get currentTime() {
        return this.audioContext.currentTime;
    }


    /**
     * 
     * @param {string} userID
     * @param {HTMLAudioElement} audio
     * @param {number} bufferSize
     * @return {BaseSpatializer}
     */
    createSpatializer(userID, audio, bufferSize) {
        const spatializer = this._createSpatializer(userID, audio, bufferSize);
        if (spatializer) {
            spatializer.setAudioProperties(this.minDistance, this.maxDistance, this.rolloff, this.transitionTime);
        }

        return spatializer;
    }

    /**
     * 
     * @param {string} userID
     * @param {HTMLAudioElement} audio
     * @param {number} bufferSize
     * @return {BaseSpatializer}
     */
    _createSpatializer(userID, audio, bufferSize) {
        try {
            if (hasWebAudioAPI) {
                try {
                    if (hasFullSpatializer) {
                        try {
                            if (attemptResonanceAPI) {
                                return new GoogleResonanceAudioSpatializer(userID, this, audio, bufferSize);
                            }
                        }
                        catch (exp3) {
                            attemptResonanceAPI = false;
                            console.warn("Resonance Audio API not available!", exp3);
                        }
                        finally {
                            if (!attemptResonanceAPI) {
                                return new FullSpatializer(userID, this, audio, bufferSize, forceInterpolatedPosition);
                            }
                        }
                    }
                }
                catch (exp2) {
                    hasFullSpatializer = false;
                    console.warn("No 360 spatializer support", exp2);
                }
                finally {
                    if (!hasFullSpatializer) {
                        return new StereoSpatializer(userID, this, audio, bufferSize);
                    }
                }
            }
        }
        catch (exp1) {
            hasWebAudioAPI = false;
            if (this.audioContext) {
                this.dispatchEvent(contextDestroyingEvt);
                this.audioContext.close();
                this.audioContext = null;
                this.position = null;
                this.dispatchEvent(contextDestroyedEvt);
            }
            console.warn("No WebAudio API!", exp1);
        }
        finally {
            if (!hasWebAudioAPI) {
                return new VolumeOnlySpatializer(userID, this, audio);
            }
        }
    }
}

const BUFFER_SIZE = 1024,
    audioActivityEvt$1 = Object.assign(new Event("audioActivity", {
        id: null,
        isActive: false
    }));


class AudioManager extends BaseAudioClient {
    constructor() {
        super();

        this.onAudioActivity = (evt) => {
            audioActivityEvt$1.id = evt.id;
            audioActivityEvt$1.isActive = evt.isActive;
            this.dispatchEvent(audioActivityEvt$1);
        };

        /** @type {Map.<string, BaseSpatializer>} */
        this.sources = new Map();

        this.destination = new Destination();

        /** @type {Event[]} */
        const recreationQ = [];

        this.destination.addEventListener("contextDestroying", () => {
            for (let source of this.sources.values()) {
                source.removeEventListener("audioActivity", this.onAudioActivity);
                recreationQ.push({
                    id: source.id,
                    x: source.position.x,
                    y: source.position.y,
                    audio: source.audio
                });

                source.dispose();
            }

            this.sources.clear();
        });

        this.destination.addEventListener("contextDestroyed", () => {
            this.timer.stop();
            this.destination.createContext();

            for (let recreate of recreationQ) {
                const source = this.createSource(recreate.id, recreate.audio);
                source.setTarget(recreate);
            }
            recreationQ.clear();
            this.timer.start();
        });

        this.timer = new RequestAnimationFrameTimer();
        this.timer.addEventListener("tick", () => {
            this.destination.update();
            for (let source of this.sources.values()) {
                source.update();
            }
        });

        Object.seal(this);
    }

    setAudioProperties(evt) {
        this.destination.setAudioProperties(evt.minDistance, evt.maxDistance, evt.rolloff, evt.transitionTime);
        for (let source of this.sources.values()) {
            source.setAudioProperties(evt.minDistance, evt.maxDistance, evt.rolloff, evt.transitionTime);
        }
    }

    start() {
        this.destination.createContext();
        this.timer.start();
    }

    /**
     *
     * @param {string} userID
     * @param {HTMLAudioElement} audio
     * @return {BaseSpatializer}
     */
    createSource(userID, audio) {
        const source = this.destination.createSpatializer(userID, audio, BUFFER_SIZE);
        source.addEventListener("audioActivity", this.onAudioActivity);
        this.sources.set(userID, source);
        return source;
    }

    setAudioOutputDevice(deviceID) {
        for (let source of this.sources.values()) {
            source.setAudioOutputDevice(deviceID);
        }
    }

    /**
     *
     * @param {string} userID
     */
    removeSource(userID) {
        if (this.sources.has(userID)) {
            const source = this.sources.get(userID);
            source.dispose();
            this.sources.delete(userID);
        }
    }

    setUserPosition(evt) {
        if (this.sources.has(evt.id)) {
            const source = this.sources.get(evt.id);
            source.setTarget(evt);
        }
    }

    setLocalPosition(evt) {
        this.destination.setTarget(evt);
    }
}

/** @typedef MediaElements
 * @type {object}
 * @property {HTMLAudioElement} audio
 * @property {HTMLVideoElement} video */

/** @type {Map.<string, MediaElements>} */
const userInputs = new Map();

const audioActivityEvt$2 = Object.assign(new Event("audioActivity"), {
    id: null,
    isActive: false
});


function logger(source, evtName) {
    const handler = (...rest) => {
        if (evtName === "conference.endpoint_message_received"
            && rest.length >= 2
            && (rest[1].type === "e2e-ping-request"
                || rest[1].type === "e2e-ping-response"
                || rest[1].type === "stats")) {
            return;
        }
        console.log(evtName, ...rest);
    };

    if (window.location.hostname === "localhost") {
        source.addEventListener(evtName, handler);
    }
}

function setLoggers(source, evtObj) {
    for (let evtName of Object.values(evtObj)) {
        if (evtName.indexOf("audioLevelsChanged") === -1) {
            logger(source, evtName);
        }
    }
}

// Manages communication between Jitsi Meet and Calla
class LibJitsiMeetClient extends BaseJitsiClient {

    constructor() {
        super();
        this.connection = null;
        this.conference = null;
        this.audioClient = new AudioManager();
        this.audioClient.addEventListener("audioActivity", (evt) => {
            audioActivityEvt$2.id = evt.id;
            audioActivityEvt$2.isActive = evt.isActive;
            this.dispatchEvent(audioActivityEvt$2);
        });

        Object.seal(this);
    }

    async initializeAsync(host, roomName, userName) {
        await import(`//${window.location.host}/lib/jquery.min.js`);
        await import(`https://${host}/libs/lib-jitsi-meet.min.js`);

        roomName = roomName.toLocaleLowerCase();

        JitsiMeetJS.setLogLevel(JitsiMeetJS.logLevels.ERROR);
        JitsiMeetJS.init();

        this.connection = new JitsiMeetJS.JitsiConnection(null, null, {
            hosts: {
                domain: host,
                muc: `conference.${host}`
            },
            serviceUrl: `https://${host}/http-bind`,
            enableLipSync: true
        });

        const {
            CONNECTION_ESTABLISHED,
            CONNECTION_FAILED,
            CONNECTION_DISCONNECTED
        } = JitsiMeetJS.events.connection;

        setLoggers(this.connection, JitsiMeetJS.events.connection);

        const onConnect = (connectionID) => {
            this.conference = this.connection.initJitsiConference(roomName, {
                openBridgeChannel: true
            });

            const {
                TRACK_ADDED,
                TRACK_REMOVED,
                CONFERENCE_JOINED,
                CONFERENCE_LEFT,
                USER_JOINED,
                USER_LEFT,
                DISPLAY_NAME_CHANGED,
                ENDPOINT_MESSAGE_RECEIVED,
                DATA_CHANNEL_OPENED
            } = JitsiMeetJS.events.conference;

            setLoggers(this.conference, JitsiMeetJS.events.conference);

            this.conference.addEventListener(CONFERENCE_JOINED, async () => {
                const id = this.conference.myUserId();

                this.dispatchEvent(Object.assign(
                    new Event("videoConferenceJoined"), {
                    id,
                    roomName,
                    displayName: userName
                }));
            });

            this.conference.addEventListener(CONFERENCE_LEFT, () => {
                this.dispatchEvent(Object.assign(
                    new Event("videoConferenceLeft"), {
                    roomName
                }));
            });

            const onTrackMuteChanged = (track, muted) => {
                    const userID = track.getParticipantId() || this.localUser,
                        trackKind = track.getType(),
                        muteChangedEvtName = trackKind + "MuteStatusChanged",
                        evt = Object.assign(
                            new Event(muteChangedEvtName), {
                            id: userID,
                            muted
                        });

                    this.dispatchEvent(evt);
                },

                onTrackChanged = (track) => {
                    onTrackMuteChanged(track, track.isMuted());
                };

            this.conference.addEventListener(USER_JOINED, (id, user) => {
                const evt = Object.assign(
                    new Event("participantJoined"), {
                    id,
                    displayName: user.getDisplayName()
                });
                this.dispatchEvent(evt);
            });

            this.conference.addEventListener(USER_LEFT, (id) => {
                const evt = Object.assign(
                    new Event("participantLeft"), {
                    id
                });

                this.dispatchEvent(evt);
            });

            this.conference.addEventListener(DISPLAY_NAME_CHANGED, (id, displayName) => {
                const evt = Object.assign(
                    new Event("displayNameChange"), {
                    id,
                    displayName
                });

                this.dispatchEvent(evt);
            });

            this.conference.addEventListener(TRACK_ADDED, (track) => {
                const userID = track.getParticipantId() || this.localUser,
                    isLocal = track.isLocal(),
                    trackKind = track.getType(),
                    trackType = trackKind.firstLetterToUpper();

                setLoggers(track, JitsiMeetJS.events.track);

                track.addEventListener(JitsiMeetJS.events.track.TRACK_MUTE_CHANGED, onTrackChanged);

                const elem = tag(trackType,
                    autoPlay(!isLocal),
                    muted(isLocal),
                    srcObject(track.stream));

                if (!userInputs.has(userID)) {
                    userInputs.set(userID, { audio: null, video: null });
                }

                const inputs = userInputs.get(userID),
                    hasCurrentTrack = !!inputs[trackKind];
                if (hasCurrentTrack) {
                    inputs[trackKind].dispose();
                }

                inputs[trackKind] = track;

                if (!isLocal && trackKind === "audio") {
                    this.audioClient.createSource(userID, elem);
                }

                this.dispatchEvent(Object.assign(new Event(trackKind + "Added"), {
                    id: userID,
                    element: elem
                }));

                onTrackMuteChanged(track, false);
            });

            this.conference.addEventListener(TRACK_REMOVED, (track) => {

                const userID = track.getParticipantId() || this.localUser,
                    isLocal = track.isLocal(),
                    trackKind = track.getType();

                if (userInputs.has(userID)) {
                    const inputs = userInputs.get(userID);
                    if (inputs[trackKind] === track) {
                        inputs[trackKind] = null;
                    }
                }

                if (!isLocal && trackKind === "audio") {
                    this.audioClient.removeSource(userID);
                }

                track.dispose();

                onTrackMuteChanged(track, true);

                this.dispatchEvent(Object.assign(new Event(trackKind + "Removed"), {
                    id: userID
                }));
            });

            this.conference.addEventListener(ENDPOINT_MESSAGE_RECEIVED, (user, data) => {
                this.rxGameData({ user, data });
            });

            this.conference.join();
        };

        const onFailed = (evt) => {
            console.error("Connection failed", evt);
            onDisconnect();
        };

        const onDisconnect = () => {
            this.connection.removeEventListener(CONNECTION_ESTABLISHED, onConnect);
            this.connection.removeEventListener(CONNECTION_FAILED, onFailed);
            this.connection.removeEventListener(CONNECTION_DISCONNECTED, onDisconnect);
        };

        this.connection.addEventListener(CONNECTION_ESTABLISHED, onConnect);
        this.connection.addEventListener(CONNECTION_FAILED, onFailed);
        this.connection.addEventListener(CONNECTION_DISCONNECTED, onDisconnect);

        setLoggers(JitsiMeetJS.mediaDevices, JitsiMeetJS.events.mediaDevices);

        this.connection.connect();
    }

    txGameData(toUserID, data) {
        this.conference.sendMessage(data, toUserID);
    }

    /// A listener to add to JitsiExternalAPI::endpointTextMessageReceived event
    /// to receive Calla messages from the Jitsi Meet data channel.
    rxGameData(evt) {
        if (evt.data.hax === APP_FINGERPRINT) {
            this.receiveMessageFrom(evt.user.getId(), evt.data.command, evt.data.value);
        }
    }

    leave() {
        if (this.conference) {
            if (this.localUser !== null && userInputs.has(this.localUser)) {
                const inputs = userInputs.get(this.localUser);
                if (inputs.audio) {
                    this.conference.removeTrack(inputs.audio);
                }

                if (inputs.video) {
                    this.conference.removeTrack(inputs.video);
                }
            }

            const leaveTask = this.conference.leave();
            leaveTask
                .then(() => this.connection.disconnect());
            return leaveTask;
        }
    }

    async getAvailableDevicesAsync() {
        const devices = await new Promise((resolve, reject) => {
            try {
                JitsiMeetJS.mediaDevices.enumerateDevices(resolve);
            }
            catch (exp) {
                reject(exp);
            }
        });

        return {
            audioOutput: devices.filter(d => d.kind === "audiooutput"),
            audioInput: devices.filter(d => d.kind === "audioinput"),
            videoInput: devices.filter(d => d.kind === "videoinput")
        };
    }

    async getAudioOutputDevicesAsync() {
        const devices = await this.getAvailableDevicesAsync();
        return devices && devices.audioOutput || [];
    }

    async getCurrentAudioOutputDeviceAsync() {
        const deviceId = JitsiMeetJS.mediaDevices.getAudioOutputDevice(),
            devices = await this.getAudioOutputDevicesAsync(),
            device = devices.filter((d) => d.deviceId === deviceId);
        if (device.length === 0) {
            return null;
        }
        else {
            return device[0];
        }
    }

    setAudioOutputDevice(device) {
        JitsiMeetJS.mediaDevices.setAudioOutputDevice(device.deviceId);
        this.audioClient.setAudioOutputDevice(device.deviceId);
    }

    getCurrentMediaTrack(type) {
        return this.localUser !== null
            && userInputs.has(this.localUser)
            && userInputs.get(this.localUser)[type]
            || null;
    }

    async getAudioInputDevicesAsync() {
        const devices = await this.getAvailableDevicesAsync();
        return devices && devices.audioInput || [];
    }

    async getCurrentAudioInputDeviceAsync() {
        const cur = this.getCurrentMediaTrack("audio"),
            devices = await this.getAudioInputDevicesAsync(),
            device = devices.filter((d) => cur !== null && d.deviceId === cur.deviceId);
        if (device.length === 0) {
            return null;
        }
        else {
            return device[0];
        }
    }

    taskOf(evt) {
        return this.when(evt, (evt) => evt.id === this.localUser, 5000);
    }

    async toggleAudioAsync() {
        const changeTask = this.taskOf("audioMuteStatusChanged");
        const cur = this.getCurrentMediaTrack("audio");
        if (cur) {
            const muted = cur.isMuted();
            if (muted) {
                await cur.unmute();
            }
            else {
                await cur.mute();
            }
        }
        else {
            const avail = await this.getAudioInputDevicesAsync();
            if (avail.length === 0) {
                throw new Error("No audio input devices available");
            }
            else {
                await this.setAudioInputDeviceAsync(avail[0]);
            }
        }
        return await changeTask;
    }

    async setAudioInputDeviceAsync(device) {
        const cur = this.getCurrentMediaTrack("audio");
        if (cur) {
            const removeTask = this.taskOf("audioRemoved");
            this.conference.removeTrack(cur);
            await removeTask;
        }

        if (device) {
            const addTask = this.taskOf("audioAdded");
            const tracks = await JitsiMeetJS.createLocalTracks({
                devices: ["audio"],
                micDeviceId: device.deviceId
            });

            for (let track of tracks) {
                this.conference.addTrack(track);
            }

            await addTask;
        }
    }

    async getVideoInputDevicesAsync() {
        const devices = await this.getAvailableDevicesAsync();
        return devices && devices.videoInput || [];
    }

    async getCurrentVideoInputDeviceAsync() {
        const cur = this.getCurrentMediaTrack("video"),
            devices = await this.getVideoInputDevicesAsync(),
            device = devices.filter((d) => cur !== null && d.deviceId === cur.deviceId);
        if (device.length === 0) {
            return null;
        }
        else {
            return device[0];
        }
    }

    async toggleVideoAsync() {
        const changeTask = this.when("videoMuteStatusChanged", (evt) => evt.id === this.this.localUser, 5000);
        const cur = this.getCurrentMediaTrack("video");
        if (cur) {
            await this.setVideoInputDeviceAsync(null);
        }
        else {
            const avail = await this.getVideoInputDevicesAsync();
            if (avail.length === 0) {
                throw new Error("No video input devices available");
            }
            else {
                await this.setVideoInputDeviceAsync(avail[0]);
            }
        }

        return await changeTask;
    }

    async setVideoInputDeviceAsync(device) {
        const cur = this.getCurrentMediaTrack("video");
        if (cur) {
            const removeTask = this.taskOf("videoRemoved");
            this.conference.removeTrack(cur);
            await removeTask;
        }

        if (device) {
            const addTask = this.taskOf("videoAdded");
            const tracks = await JitsiMeetJS.createLocalTracks({
                devices: ["video"],
                cameraDeviceId: device.deviceId
            });

            for (let track of tracks) {
                this.conference.addTrack(track);
            }

            await addTask;
        }
    }

    setDisplayName(userName) {
        this.conference.setDisplayName(userName);
    }

    setAvatarURL(url) {
        throw new Error("Not implemented in base class");
    }

    isMediaMuted(type) {
        const cur = this.getCurrentMediaTrack(type);
        return cur === null
            || cur.isMuted();
    }

    async isAudioMutedAsync() {
        return this.isMediaMuted("audio");
    }

    async isVideoMutedAsync() {
        return this.isMediaMuted("video");
    }

    startAudio() {
        this.audioClient.start();
    }

    userIDs() {
        return Object.keys(this.conference.participants);
    }

    userExists(id) {
        return !!this.conference.participants[id];
    }

    users() {
        return Object.keys(this.conference.participants)
            .map(k => [k, this.conference.participants[k].getDisplayName()]);
    }
}

/* global JITSI_HOST */

const { login } = init(JITSI_HOST, new LibJitsiMeetClient());

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
