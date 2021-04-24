(function () {
    'use strict';

    /**
     * Removes an item at the given index from an array.
     */
    function arrayRemoveAt(arr, idx) {
        return arr.splice(idx, 1)[0];
    }

    /**
     * Removes a given item from an array, returning true if the item was removed.
     */
    function arrayRemove(arr, value) {
        const idx = arr.indexOf(value);
        if (idx > -1) {
            arrayRemoveAt(arr, idx);
            return true;
        }
        return false;
    }

    function t(o, s, c) {
        return typeof o === s
            || o instanceof c;
    }
    function isFunction(obj) {
        return t(obj, "function", Function);
    }
    function isString(obj) {
        return t(obj, "string", String);
    }
    function isBoolean(obj) {
        return t(obj, "boolean", Boolean);
    }
    function isNumber(obj) {
        return t(obj, "number", Number);
    }
    /**
     * Check a value to see if it is of a number type
     * and is not the special NaN value.
     */
    function isGoodNumber(obj) {
        return isNumber(obj)
            && !Number.isNaN(obj);
    }
    function isObject(obj) {
        return isDefined(obj)
            && t(obj, "object", Object);
    }
    function isArray(obj) {
        return obj instanceof Array;
    }
    function isHTMLElement(obj) {
        return obj instanceof HTMLElement;
    }
    function assertNever(x, msg) {
        throw new Error((msg || "Unexpected object: ") + x);
    }
    function isNullOrUndefined(obj) {
        return obj === null
            || obj === undefined;
    }
    function isDefined(obj) {
        return !isNullOrUndefined(obj);
    }
    function isArrayBufferView(obj) {
        return obj instanceof Uint8Array
            || obj instanceof Uint8ClampedArray
            || obj instanceof Int8Array
            || obj instanceof Uint16Array
            || obj instanceof Int16Array
            || obj instanceof Uint32Array
            || obj instanceof Int32Array
            || obj instanceof BigUint64Array
            || obj instanceof BigInt64Array
            || obj instanceof Float32Array
            || obj instanceof Float64Array;
    }
    function isXHRBodyInit(obj) {
        return isString(obj)
            || obj instanceof Blob
            || obj instanceof FormData
            || obj instanceof ArrayBuffer
            || obj instanceof Document
            || isArrayBufferView(obj)
            || obj instanceof ReadableStream;
    }

    function defaultKeySelector(obj) {
        return obj;
    }
    /**
     * Performs a binary search on a list to find where the item should be inserted.
     *
     * If the item is found, the returned index will be an exact integer.
     *
     * If the item is not found, the returned insertion index will be 0.5 greater than
     * the index at which it should be inserted.
     */
    function arrayBinarySearchByKey(arr, itemKey, keySelector) {
        let left = 0;
        let right = arr.length;
        let idx = Math.floor((left + right) / 2);
        let found = false;
        while (left < right && idx < arr.length) {
            const compareTo = arr[idx];
            const compareToKey = isNullOrUndefined(compareTo)
                ? null
                : keySelector(compareTo);
            if (isDefined(compareToKey)
                && itemKey < compareToKey) {
                right = idx;
            }
            else {
                if (itemKey === compareToKey) {
                    found = true;
                }
                left = idx + 1;
            }
            idx = Math.floor((left + right) / 2);
        }
        if (!found) {
            idx += 0.5;
        }
        return idx;
    }
    /**
     * Performs a binary search on a list to find where the item should be inserted.
     *
     * If the item is found, the returned index will be an exact integer.
     *
     * If the item is not found, the returned insertion index will be 0.5 greater than
     * the index at which it should be inserted.
     */
    function arrayBinarySearch(arr, item, keySelector) {
        keySelector = keySelector || defaultKeySelector;
        const itemKey = keySelector(item);
        return arrayBinarySearchByKey(arr, itemKey, keySelector);
    }

    /**
     * Inserts an item at the given index into an array.
     * @param arr
     * @param item
     * @param idx
     */
    function arrayInsertAt(arr, item, idx) {
        arr.splice(idx, 0, item);
    }

    function arraySortedInsert(arr, item, keySelector, allowDuplicates) {
        let ks;
        if (isFunction(keySelector)) {
            ks = keySelector;
        }
        else if (isBoolean(keySelector)) {
            allowDuplicates = keySelector;
        }
        if (isNullOrUndefined(allowDuplicates)) {
            allowDuplicates = true;
        }
        let idx = arrayBinarySearch(arr, item, ks);
        const found = (idx % 1) === 0;
        idx = idx | 0;
        if (!found || allowDuplicates) {
            arrayInsertAt(arr, item, idx);
        }
        return idx;
    }

    class EventBase {
        constructor() {
            this.listeners = new Map();
            this.listenerOptions = new Map();
        }
        addEventListener(type, callback, options) {
            if (isFunction(callback)) {
                let listeners = this.listeners.get(type);
                if (!listeners) {
                    listeners = new Array();
                    this.listeners.set(type, listeners);
                }
                if (!listeners.find(c => c === callback)) {
                    listeners.push(callback);
                    if (options) {
                        this.listenerOptions.set(callback, options);
                    }
                }
            }
        }
        removeEventListener(type, callback) {
            if (isFunction(callback)) {
                const listeners = this.listeners.get(type);
                if (listeners) {
                    this.removeListener(listeners, callback);
                }
            }
        }
        removeListener(listeners, callback) {
            const idx = listeners.findIndex(c => c === callback);
            if (idx >= 0) {
                arrayRemoveAt(listeners, idx);
                if (this.listenerOptions.has(callback)) {
                    this.listenerOptions.delete(callback);
                }
            }
        }
        dispatchEvent(evt) {
            const listeners = this.listeners.get(evt.type);
            if (listeners) {
                for (const callback of listeners) {
                    const options = this.listenerOptions.get(callback);
                    if (isDefined(options)
                        && !isBoolean(options)
                        && options.once) {
                        this.removeListener(listeners, callback);
                    }
                    callback.call(this, evt);
                }
            }
            return !evt.defaultPrevented;
        }
    }
    class TypedEvent extends Event {
        constructor(type) {
            super(type);
        }
    }
    class TypedEventBase extends EventBase {
        constructor() {
            super(...arguments);
            this.mappedCallbacks = new Map();
        }
        addEventListener(type, callback, options) {
            if (this.checkAddEventListener(type, callback)) {
                let mappedCallback = this.mappedCallbacks.get(callback);
                if (mappedCallback == null) {
                    mappedCallback = (evt) => callback(evt);
                    this.mappedCallbacks.set(callback, mappedCallback);
                }
                super.addEventListener(type, mappedCallback, options);
            }
        }
        checkAddEventListener(_type, _callback) {
            return true;
        }
        removeEventListener(type, callback) {
            const mappedCallback = this.mappedCallbacks.get(callback);
            if (mappedCallback) {
                super.removeEventListener(type, mappedCallback);
            }
        }
        dispatchEvent(evt) {
            this.onDispatching(evt);
            return super.dispatchEvent(evt);
        }
        onDispatching(_evt) { }
    }

    function add$2(a, b) {
        return async (v) => {
            await a(v);
            await b(v);
        };
    }

    function once(target, resolveEvt, rejectEvt, timeout) {
        if (timeout == null
            && isGoodNumber(rejectEvt)) {
            timeout = rejectEvt;
            rejectEvt = undefined;
        }
        const hasTimeout = timeout != null;
        return new Promise((resolve, reject) => {
            const remove = () => {
                target.removeEventListener(resolveEvt, resolve);
            };
            resolve = add$2(remove, resolve);
            reject = add$2(remove, reject);
            if (isString(rejectEvt)) {
                const rejectEvt2 = rejectEvt;
                const remove = () => {
                    target.removeEventListener(rejectEvt2, reject);
                };
                resolve = add$2(remove, resolve);
                reject = add$2(remove, reject);
            }
            if (hasTimeout) {
                const timer = setTimeout(reject, timeout, `'${resolveEvt}' has timed out.`), cancel = () => clearTimeout(timer);
                resolve = add$2(cancel, resolve);
                reject = add$2(cancel, reject);
            }
            target.addEventListener(resolveEvt, resolve);
            if (isString(rejectEvt)) {
                target.addEventListener(rejectEvt, () => {
                    reject("Rejection event found");
                });
            }
        });
    }

    const gestures = [
        "change",
        "click",
        "contextmenu",
        "dblclick",
        "mouseup",
        "pointerup",
        "reset",
        "submit",
        "touchend"
    ];
    function identityPromise() {
        return Promise.resolve();
    }
    /**
     * This is not an event handler that you can add to an element. It's a global event that
     * waits for the user to perform some sort of interaction with the website.
      */
    function onUserGesture(callback, test) {
        const realTest = isNullOrUndefined(test)
            ? identityPromise
            : test;
        const check = async (evt) => {
            if (evt.isTrusted && await realTest()) {
                for (const gesture of gestures) {
                    window.removeEventListener(gesture, check);
                }
                callback();
            }
        };
        for (const gesture of gestures) {
            window.addEventListener(gesture, check);
        }
    }

    function waitFor(test) {
        return new Promise((resolve) => {
            const handle = setInterval(() => {
                if (test()) {
                    clearInterval(handle);
                    resolve();
                }
            }, 100);
        });
    }

    /**
     * A setter functor for HTML attributes.
     **/
    class Attr {
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
    }
    /**
     * Alternative text in case an image can't be displayed.
     **/
    function alt(value) { return new Attr("alt", value, "applet", "area", "img", "input"); }
    /**
     * The audio or video should play as soon as possible.
      **/
    function autoPlay(value) { return new Attr("autoplay", value, "audio", "video"); }
    /**
     * Often used with CSS to style elements with common properties.
      **/
    function className(value) { return new Attr("className", value); }
    /**
     * Indicates whether the browser should show playback controls to the user.
      **/
    function controls$1(value) { return new Attr("controls", value, "audio", "video"); }
    /**
     * Indicates whether the user can interact with the element.
      **/
    function disabled(value) { return new Attr("disabled", value, "button", "command", "fieldset", "input", "keygen", "optgroup", "option", "select", "textarea"); }
    /**
     * Describes elements which belongs to this one.
      **/
    function htmlFor(value) { return new Attr("htmlFor", value, "label", "output"); }
    /**
     * Specifies the height of elements listed here. For all other elements, use the CSS height property.
      **/
    function htmlHeight(value) { return new Attr("height", value, "canvas", "embed", "iframe", "img", "input", "object", "video"); }
    /**
     * The URL of a linked resource.
      **/
    function href(value) { return new Attr("href", value, "a", "area", "base", "link"); }
    /**
     * Often used with CSS to style a specific element. The value of this attribute must be unique.
      **/
    function id(value) { return new Attr("id", value); }
    /**
     * Indicates the maximum value allowed.
      **/
    function max(value) { return new Attr("max", value, "input", "meter", "progress"); }
    /**
     * Indicates the minimum value allowed.
      **/
    function min(value) { return new Attr("min", value, "input", "meter"); }
    /**
     * Indicates whether the audio will be initially silenced on page load.
      **/
    function muted(value) { return new Attr("muted", value, "audio", "video"); }
    /**
     * Provides a hint to the user of what can be entered in the field.
      **/
    function placeHolder(value) { return new Attr("placeholder", value, "input", "textarea"); }
    /**
     * Indicates that the media element should play automatically on iOS.
      **/
    function playsInline(value) { return new Attr("playsInline", value, "audio", "video"); }
    /**
     * Defines the number of rows in a text area.
      **/
    function role(value) { return new Attr("role", value); }
    /**
     * The URL of the embeddable content.
      **/
    function src(value) { return new Attr("src", value, "audio", "embed", "iframe", "img", "input", "script", "source", "track", "video"); }
    /**
     * A MediaStream object to use as a source for an HTML video or audio element
      **/
    function srcObject(value) { return new Attr("srcObject", value, "audio", "video"); }
    /**
     * The step attribute
      **/
    function step(value) { return new Attr("step", value, "input"); }
    /**
     * Text to be displayed in a tooltip when hovering over the element.
      **/
    function title(value) { return new Attr("title", value); }
    /**
     * Defines the type of the element.
      **/
    function type(value) { return new Attr("type", value, "button", "input", "command", "embed", "link", "object", "script", "source", "style", "menu"); }
    /**
     * Defines a default value which will be displayed in the element on page load.
      **/
    function value(value) { return new Attr("value", value, "button", "data", "input", "li", "meter", "option", "progress", "param"); }
    /**
     * setting the volume at which a media element plays.
      **/
    function volume(value) { return new Attr("volume", value, "audio", "video"); }
    /**
     * For the elements listed here, this establishes the element's width.
      **/
    function htmlWidth(value) { return new Attr("width", value, "canvas", "embed", "iframe", "img", "input", "object", "video"); }

    class CssProp {
        constructor(key, value) {
            this.key = key;
            this.value = value;
            this.name = key.replace(/[A-Z]/g, (m) => {
                return "-" + m.toLocaleLowerCase();
            });
        }
        /**
         * Set the attribute value on an HTMLElement
         * @param elem - the element on which to set the attribute.
         */
        apply(elem) {
            elem[this.key] = this.value;
        }
    }
    class CssPropSet {
        constructor(...rest) {
            this.rest = rest;
        }
        /**
         * Set the attribute value on an HTMLElement
         * @param style - the element on which to set the attribute.
         */
        apply(style) {
            for (const prop of this.rest) {
                prop.apply(style);
            }
        }
    }
    /**
     * Combine style properties.
     **/
    function styles(...rest) {
        return new CssPropSet(...rest);
    }
    function backgroundColor(v) { return new CssProp("backgroundColor", v); }
    function display(v) { return new CssProp("display", v); }
    function gridArea(v) { return new CssProp("gridArea", v); }
    function gridRow(v) { return new CssProp("gridRow", v); }
    function gridTemplateColumns(v) { return new CssProp("gridTemplateColumns", v); }
    function height(v) { return new CssProp("height", v); }
    function margin(v) { return new CssProp("margin", v); }
    function textAlign(v) { return new CssProp("textAlign", v); }
    function width(v) { return new CssProp("width", v); }
    function zIndex(v) { return new CssProp("zIndex", v.toFixed(0)); }

    function isErsatzElement(obj) {
        return isObject(obj)
            && "element" in obj
            && obj.element instanceof Node;
    }
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
    function tag(name, ...rest) {
        let elem = null;
        for (const attr of rest) {
            if (attr instanceof Attr
                && attr.key === "id") {
                elem = document.getElementById(attr.value);
                break;
            }
        }
        if (elem == null) {
            elem = document.createElement(name);
        }
        for (let x of rest) {
            if (x != null) {
                if (x instanceof CssPropSet) {
                    x.apply(elem.style);
                }
                else if (isString(x)
                    || isNumber(x)
                    || isBoolean(x)
                    || x instanceof Date
                    || x instanceof Node
                    || isErsatzElement(x)) {
                    if (isErsatzElement(x)) {
                        x = x.element;
                    }
                    else if (!(x instanceof Node)) {
                        x = document.createTextNode(x.toLocaleString());
                    }
                    elem.appendChild(x);
                }
                else {
                    if (x instanceof Function) {
                        x = x(true);
                    }
                    x.apply(elem);
                }
            }
        }
        return elem;
    }
    /**
     * Empty an element of all children. This is faster than setting `innerHTML = ""`.
     */
    function elementClearChildren(elem) {
        while (elem.lastChild) {
            elem.lastChild.remove();
        }
    }
    function A(...rest) { return tag("a", ...rest); }
    function Audio(...rest) { return tag("audio", ...rest); }
    function ButtonRaw(...rest) { return tag("button", ...rest); }
    function Button(...rest) { return ButtonRaw(...rest, type("button")); }
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
    function Script(...rest) { return tag("script", ...rest); }
    function Span(...rest) { return tag("span", ...rest); }
    function UL(...rest) { return tag("ul", ...rest); }
    function Video(...rest) { return tag("video", ...rest); }
    /**
     * creates an HTML Input tag that is an email entry field.
     */
    function InputEmail(...rest) { return Input(type("email"), ...rest); }
    /**
     * creates an HTML Input tag that is a range selector.
     */
    function InputRange(...rest) { return Input(type("range"), ...rest); }
    /**
     * creates an HTML Input tag that is a text entry field.
     */
    function InputText(...rest) { return Input(type("text"), ...rest); }
    /**
     * creates an HTML Input tag that is a URL entry field.
     */
    function InputURL(...rest) { return Input(type("url"), ...rest); }
    /**
     * Creates a Div element with margin: auto.
     */
    function Run(...rest) {
        return Div(styles(margin("auto")), ...rest);
    }

    const windows = [];
    if ("window" in globalThis) {
        // Closes all the windows.
        window.addEventListener("unload", () => {
            for (const w of windows) {
                w.close();
            }
        });
    }

    "chrome" in globalThis && !navigator.userAgent.match("CriOS");
    const isFirefox = "InstallTrigger" in globalThis;
    /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    /Opera/.test(navigator.userAgent);
    /Android/.test(navigator.userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.platform)
        || /Macintosh(.*?) FxiOS(.*?)\//.test(navigator.platform)
        || navigator.platform === "MacIntel" && navigator.maxTouchPoints > 2;
    /Macintosh/.test(navigator.userAgent || "");
    /BlackBerry/.test(navigator.userAgent);
    /(UC Browser |UCWEB)/.test(navigator.userAgent);
    const isOculus = /oculus/i.test(navigator.userAgent);
    isOculus && /pacific/i.test(navigator.userAgent);
    isOculus && /quest/i.test(navigator.userAgent);
    isOculus && /quest 2/i.test(navigator.userAgent);
    /Mobile VR/.test(navigator.userAgent)
        || isOculus;

    const hasOffscreenCanvas = "OffscreenCanvas" in globalThis;
    const hasImageBitmap = "createImageBitmap" in globalThis;
    function testOffscreen2D() {
        try {
            const canv = new OffscreenCanvas(1, 1);
            const g = canv.getContext("2d");
            return g != null;
        }
        catch (exp) {
            return false;
        }
    }
    const hasOffscreenCanvasRenderingContext2D = hasOffscreenCanvas && testOffscreen2D();
    const createUtilityCanvas = hasOffscreenCanvasRenderingContext2D
        ? createOffscreenCanvas
        : createCanvas;
    function testOffscreen3D() {
        try {
            const canv = new OffscreenCanvas(1, 1);
            const g = canv.getContext("webgl2");
            return g != null;
        }
        catch (exp) {
            return false;
        }
    }
    hasOffscreenCanvas && testOffscreen3D();
    function testBitmapRenderer() {
        try {
            const canv = createUtilityCanvas(1, 1);
            const g = canv.getContext("bitmaprenderer");
            return g != null;
        }
        catch (exp) {
            return false;
        }
    }
    hasImageBitmap && testBitmapRenderer();
    function createOffscreenCanvas(width, height) {
        return new OffscreenCanvas(width, height);
    }
    function createCanvas(w, h) {
        return Canvas(htmlWidth(w), htmlHeight(h));
    }
    /**
     * Resizes a canvas element
     * @param canv
     * @param w - the new width of the canvas
     * @param h - the new height of the canvas
     * @param [superscale=1] - a value by which to scale width and height to achieve supersampling. Defaults to 1.
     * @returns true, if the canvas size changed, false if the given size (with super sampling) resulted in the same size.
     */
    function setCanvasSize(canv, w, h, superscale = 1) {
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
    function is2DRenderingContext(ctx) {
        return isDefined(ctx.textBaseline);
    }
    function setCanvas2DContextSize(ctx, w, h, superscale = 1) {
        const oldImageSmoothingEnabled = ctx.imageSmoothingEnabled, oldTextBaseline = ctx.textBaseline, oldTextAlign = ctx.textAlign, oldFont = ctx.font, resized = setCanvasSize(ctx.canvas, w, h, superscale);
        if (resized) {
            ctx.imageSmoothingEnabled = oldImageSmoothingEnabled;
            ctx.textBaseline = oldTextBaseline;
            ctx.textAlign = oldTextAlign;
            ctx.font = oldFont;
        }
        return resized;
    }
    /**
     * Resizes the canvas element of a given rendering context.
     *
     * Note: the imageSmoothingEnabled, textBaseline, textAlign, and font
     * properties of the context will be restored after the context is resized,
     * as these values are usually reset to their default values when a canvas
     * is resized.
     * @param ctx
     * @param w - the new width of the canvas
     * @param h - the new height of the canvas
     * @param [superscale=1] - a value by which to scale width and height to achieve supersampling. Defaults to 1.
     * @returns true, if the canvas size changed, false if the given size (with super sampling) resulted in the same size.
     */
    function setContextSize(ctx, w, h, superscale = 1) {
        if (is2DRenderingContext(ctx)) {
            return setCanvas2DContextSize(ctx, w, h, superscale);
        }
        else {
            return setCanvasSize(ctx.canvas, w, h, superscale);
        }
    }
    /**
     * Resizes a canvas element to match the proportions of the size of the element in the DOM.
     * @param canv
     * @param [superscale=1] - a value by which to scale width and height to achieve supersampling. Defaults to 1.
     * @returns true, if the canvas size changed, false if the given size (with super sampling) resulted in the same size.
     */
    function resizeCanvas(canv, superscale = 1) {
        return setCanvasSize(canv, canv.clientWidth, canv.clientHeight, superscale);
    }

    function createScript(file) {
        const script = Script(src(file));
        document.body.appendChild(script);
    }

    function dumpProgress(_soFar, _total, _message, _est) {
        // do nothing
    }

    function splitProgress(onProgress, subProgressWeights) {
        let weightTotal = 0;
        for (let i = 0; i < subProgressWeights.length; ++i) {
            weightTotal += subProgressWeights[i];
        }
        const subProgressValues = new Array(subProgressWeights.length);
        const subProgressCallbacks = new Array(subProgressWeights.length);
        const start = performance.now();
        const update = (i, subSoFar, subTotal, msg) => {
            if (onProgress) {
                subProgressValues[i] = subSoFar / subTotal;
                let soFar = 0;
                for (let j = 0; j < subProgressWeights.length; ++j) {
                    soFar += subProgressValues[j] * subProgressWeights[j];
                }
                const end = performance.now();
                const delta = end - start;
                const est = start - end + delta * weightTotal / soFar;
                onProgress(soFar, weightTotal, msg, est);
            }
        };
        for (let i = 0; i < subProgressWeights.length; ++i) {
            subProgressValues[i] = 0;
            subProgressCallbacks[i] = (soFar, total, msg) => update(i, soFar, total, msg);
        }
        return subProgressCallbacks;
    }

    function normalizeMap(map, key, value) {
        if (isNullOrUndefined(map)) {
            map = new Map();
        }
        if (!map.has(key)) {
            map.set(key, value);
        }
        return map;
    }
    async function fileToImage(file) {
        const img = Img(src(file));
        await once(img, "loaded");
        return img;
    }
    function trackXHRProgress(name, xhr, target, onProgress, skipLoading, prevTask) {
        return new Promise((resolve, reject) => {
            let done = false;
            let loaded = skipLoading;
            function maybeResolve() {
                if (loaded && done) {
                    resolve();
                }
            }
            async function onError() {
                await prevTask;
                reject(xhr.status);
            }
            target.addEventListener("loadstart", async () => {
                await prevTask;
                onProgress(0, 1, name);
            });
            target.addEventListener("progress", async (ev) => {
                const evt = ev;
                await prevTask;
                onProgress(evt.loaded, Math.max(evt.loaded, evt.total), name);
                if (evt.loaded === evt.total) {
                    loaded = true;
                    maybeResolve();
                }
            });
            target.addEventListener("load", async () => {
                await prevTask;
                onProgress(1, 1, name);
                done = true;
                maybeResolve();
            });
            target.addEventListener("error", onError);
            target.addEventListener("abort", onError);
        });
    }
    function setXHRHeaders(xhr, method, path, xhrType, headers) {
        xhr.open(method, path);
        xhr.responseType = xhrType;
        if (headers) {
            for (const [key, value] of headers) {
                xhr.setRequestHeader(key, value);
            }
        }
    }
    async function blobToBuffer(blob) {
        const buffer = await blob.arrayBuffer();
        return {
            buffer,
            contentType: blob.type
        };
    }
    class Fetcher {
        async getXHR(path, xhrType, headers, onProgress) {
            onProgress = onProgress || dumpProgress;
            const xhr = new XMLHttpRequest();
            const download = trackXHRProgress("downloading", xhr, xhr, onProgress, true, Promise.resolve());
            setXHRHeaders(xhr, "GET", path, xhrType, headers);
            xhr.send();
            await download;
            return xhr.response;
        }
        async postXHR(path, xhrType, obj, contentType, headers, onProgress) {
            onProgress = onProgress || dumpProgress;
            const [upProg, downProg] = splitProgress(onProgress, [1, 1]);
            const xhr = new XMLHttpRequest();
            const upload = trackXHRProgress("uploading", xhr, xhr.upload, upProg, false, Promise.resolve());
            const download = trackXHRProgress("saving", xhr, xhr, downProg, true, upload);
            let body = null;
            if (!(obj instanceof FormData)
                && isDefined(contentType)) {
                headers = normalizeMap(headers, "Content-Type", contentType);
            }
            if (isXHRBodyInit(obj) && !isString(obj)) {
                body = obj;
            }
            else if (isDefined(obj)) {
                body = JSON.stringify(obj);
            }
            setXHRHeaders(xhr, "POST", path, xhrType, headers);
            if (isDefined(body)) {
                xhr.send(body);
            }
            else {
                xhr.send();
            }
            await upload;
            await download;
            return xhr.response;
        }
        async getBlob(path, headers, onProgress) {
            return await this.getXHR(path, "blob", headers, onProgress);
        }
        async postObjectForBlob(path, obj, contentType, headers, onProgress) {
            return await this.postXHR(path, "blob", obj, contentType, headers, onProgress);
        }
        async getBuffer(path, headers, onProgress) {
            const blob = await this.getBlob(path, headers, onProgress);
            return await blobToBuffer(blob);
        }
        async postObjectForBuffer(path, obj, contentType, headers, onProgress) {
            const blob = await this.postObjectForBlob(path, obj, contentType, headers, onProgress);
            return await blobToBuffer(blob);
        }
        async getFile(path, headers, onProgress) {
            const blob = await this.getBlob(path, headers, onProgress);
            return URL.createObjectURL(blob);
        }
        async postObjectForFile(path, obj, contentType, headers, onProgress) {
            const blob = await this.postObjectForBlob(path, obj, contentType, headers, onProgress);
            return URL.createObjectURL(blob);
        }
        async getText(path, headers, onProgress) {
            return await this.getXHR(path, "text", headers, onProgress);
        }
        async postObjectForText(path, obj, contentType, headers, onProgress) {
            return this.postXHR(path, "text", obj, contentType, headers, onProgress);
        }
        async getObject(path, headers, onProgress) {
            if (!headers) {
                headers = new Map();
            }
            if (!headers.has("Accept")) {
                headers.set("Accept", "application/json");
            }
            return await this.getXHR(path, "json", headers, onProgress);
        }
        async postObjectForObject(path, obj, contentType, headers, onProgress) {
            return await this.postXHR(path, "json", obj, contentType, headers, onProgress);
        }
        async postObject(path, obj, contentType, headers, onProgress) {
            await this.postXHR(path, "", obj, contentType, headers, onProgress);
        }
        async getXml(path, headers, onProgress) {
            const doc = await this.getXHR(path, "document", headers, onProgress);
            return doc.documentElement;
        }
        async postObjectForXml(path, obj, contentType, headers, onProgress) {
            const doc = await this.postXHR(path, "document", obj, contentType, headers, onProgress);
            return doc.documentElement;
        }
        async getImageBitmap(path, headers, onProgress) {
            const blob = await this.getBlob(path, headers, onProgress);
            return await createImageBitmap(blob);
        }
        async getCanvasImage(path, headers, onProgress) {
            if (hasImageBitmap) {
                return await this.getImageBitmap(path, headers, onProgress);
            }
            else {
                const file = await this.getFile(path, headers, onProgress);
                return await fileToImage(file);
            }
        }
        async postObjectForImageBitmap(path, obj, contentType, headers, onProgress) {
            const blob = await this.postObjectForBlob(path, obj, contentType, headers, onProgress);
            return await createImageBitmap(blob);
        }
        async postObjectForCanvasImage(path, obj, contentType, headers, onProgress) {
            if (hasImageBitmap) {
                return await this.postObjectForImageBitmap(path, obj, contentType, headers, onProgress);
            }
            else {
                const file = await this.postObjectForFile(path, obj, contentType, headers, onProgress);
                return await fileToImage(file);
            }
        }
        async loadScript(path, test, onProgress) {
            if (!test()) {
                const scriptLoadTask = waitFor(test);
                const file = await this.getFile(path, null, onProgress);
                createScript(file);
                await scriptLoadTask;
            }
            else if (onProgress) {
                onProgress(1, 1, "skip");
            }
        }
        async getWASM(path, imports, onProgress) {
            const wasmBuffer = await this.getBuffer(path, null, onProgress);
            if (wasmBuffer.contentType !== "application/wasm") {
                throw new Error("Server did not respond with WASM file. Was: " + wasmBuffer.contentType);
            }
            const wasmModule = await WebAssembly.instantiate(wasmBuffer.buffer, imports);
            return wasmModule.instance.exports;
        }
    }

    function isDisposable(obj) {
        return isObject(obj)
            && "dispose" in obj
            && isFunction(obj.dispose);
    }
    function isClosable(obj) {
        return isObject(obj)
            && "close" in obj
            && isFunction(obj.close);
    }
    function dispose(val) {
        if (isDisposable(val)) {
            val.dispose();
        }
        else if (isClosable(val)) {
            val.close();
        }
    }
    function using(val, thunk) {
        try {
            return thunk(val);
        }
        finally {
            dispose(val);
        }
    }

    /**
     * Scans through a series of filters to find an item that matches
     * any of the filters. The first item of the first filter that matches
     * will be returned.
     */
    function arrayScan(arr, ...tests) {
        for (const test of tests) {
            for (const item of arr) {
                if (test(item)) {
                    return item;
                }
            }
        }
        return null;
    }

    /**
     * Indicates whether or not the current browser can change the destination device for audio output.
     **/
    const canChangeAudioOutput = isFunction(HTMLAudioElement.prototype.setSinkId);

    /**
     * Unicode-standardized pictograms.
     **/
    class Emoji {
        /**
         * Creates a new Unicode-standardized pictograms.
         * @param value - a Unicode sequence.
         * @param desc - an English text description of the pictogram.
         * @param props - an optional set of properties to store with the emoji.
         */
        constructor(value, desc, props = null) {
            this.value = value;
            this.desc = desc;
            this.value = value;
            this.desc = desc;
            this.props = props || {};
        }
        /**
         * Determines of the provided Emoji or EmojiGroup is a subset of
         * this emoji.
         */
        contains(e) {
            if (e instanceof Emoji) {
                return this.contains(e.value);
            }
            else {
                return this.value.indexOf(e) >= 0;
            }
        }
    }

    class CallaEvent extends Event {
        constructor(eventType) {
            super(eventType);
            this.eventType = eventType;
        }
    }
    class CallaTeleconferenceServerConnectedEvent extends CallaEvent {
        constructor() {
            super("serverConnected");
        }
    }
    class CallaTeleconferenceServerDisconnectedEvent extends CallaEvent {
        constructor() {
            super("serverDisconnected");
        }
    }
    class CallaTeleconferenceServerFailedEvent extends CallaEvent {
        constructor() {
            super("serverFailed");
        }
    }
    class CallaUserEvent extends CallaEvent {
        constructor(type, id) {
            super(type);
            this.id = id;
        }
    }
    class CallaParticipantEvent extends CallaUserEvent {
        constructor(type, id, displayName) {
            super(type, id);
            this.displayName = displayName;
        }
    }
    class CallaConferenceJoinedEvent extends CallaUserEvent {
        constructor(id, pose) {
            super("conferenceJoined", id);
            this.pose = pose;
        }
    }
    class CallaConferenceLeftEvent extends CallaUserEvent {
        constructor(id) {
            super("conferenceLeft", id);
        }
    }
    class CallaConferenceFailedEvent extends CallaEvent {
        constructor() {
            super("conferenceFailed");
        }
    }
    class CallaParticipantJoinedEvent extends CallaParticipantEvent {
        constructor(id, displayName, source) {
            super("participantJoined", id, displayName);
            this.source = source;
        }
    }
    class CallaParticipantLeftEvent extends CallaUserEvent {
        constructor(id) {
            super("participantLeft", id);
        }
    }
    class CallaParticipantNameChangeEvent extends CallaParticipantEvent {
        constructor(id, displayName) {
            super("userNameChanged", id, displayName);
        }
    }
    class CallaUserMutedEvent extends CallaUserEvent {
        constructor(type, id, muted) {
            super(type, id);
            this.muted = muted;
        }
    }
    class CallaUserAudioMutedEvent extends CallaUserMutedEvent {
        constructor(id, muted) {
            super("audioMuteStatusChanged", id, muted);
        }
    }
    class CallaUserVideoMutedEvent extends CallaUserMutedEvent {
        constructor(id, muted) {
            super("videoMuteStatusChanged", id, muted);
        }
    }
    var StreamType;
    (function (StreamType) {
        StreamType["Audio"] = "audio";
        StreamType["Video"] = "video";
    })(StreamType || (StreamType = {}));
    var StreamOpType;
    (function (StreamOpType) {
        StreamOpType["Added"] = "added";
        StreamOpType["Removed"] = "removed";
        StreamOpType["Changed"] = "changed";
    })(StreamOpType || (StreamOpType = {}));
    class CallaStreamEvent extends CallaUserEvent {
        constructor(type, kind, op, id, stream) {
            super(type, id);
            this.kind = kind;
            this.op = op;
            this.stream = stream;
        }
    }
    class CallaStreamAddedEvent extends CallaStreamEvent {
        constructor(type, kind, id, stream) {
            super(type, kind, StreamOpType.Added, id, stream);
        }
    }
    class CallaStreamRemovedEvent extends CallaStreamEvent {
        constructor(type, kind, id, stream) {
            super(type, kind, StreamOpType.Removed, id, stream);
        }
    }
    class CallaAudioStreamAddedEvent extends CallaStreamAddedEvent {
        constructor(id, stream) {
            super("audioAdded", StreamType.Audio, id, stream);
        }
    }
    class CallaAudioStreamRemovedEvent extends CallaStreamRemovedEvent {
        constructor(id, stream) {
            super("audioRemoved", StreamType.Audio, id, stream);
        }
    }
    class CallaVideoStreamAddedEvent extends CallaStreamAddedEvent {
        constructor(id, stream) {
            super("videoAdded", StreamType.Video, id, stream);
        }
    }
    class CallaVideoStreamRemovedEvent extends CallaStreamRemovedEvent {
        constructor(id, stream) {
            super("videoRemoved", StreamType.Video, id, stream);
        }
    }
    class CallaPoseEvent extends CallaUserEvent {
        constructor(type, id, px, py, pz, fx, fy, fz, ux, uy, uz) {
            super(type, id);
            this.px = px;
            this.py = py;
            this.pz = pz;
            this.fx = fx;
            this.fy = fy;
            this.fz = fz;
            this.ux = ux;
            this.uy = uy;
            this.uz = uz;
        }
        set(px, py, pz, fx, fy, fz, ux, uy, uz) {
            this.px = px;
            this.py = py;
            this.pz = pz;
            this.fx = fx;
            this.fy = fy;
            this.fz = fz;
            this.ux = ux;
            this.uy = uy;
            this.uz = uz;
        }
    }
    class CallaUserPosedEvent extends CallaPoseEvent {
        constructor(id, px, py, pz, fx, fy, fz, ux, uy, uz) {
            super("userPosed", id, px, py, pz, fx, fy, fz, ux, uy, uz);
        }
    }
    class CallaUserPointerEvent extends CallaPoseEvent {
        constructor(id, name, px, py, pz, fx, fy, fz, ux, uy, uz) {
            super("userPointer", id, px, py, pz, fx, fy, fz, ux, uy, uz);
            this.name = name;
        }
    }
    class CallaEmojiEvent extends CallaUserEvent {
        constructor(type, id, emoji) {
            super(type, id);
            if (emoji instanceof Emoji) {
                this.emoji = emoji.value;
            }
            else {
                this.emoji = emoji;
            }
        }
    }
    class CallaEmoteEvent extends CallaEmojiEvent {
        constructor(id, emoji) {
            super("emote", id, emoji);
        }
    }
    class CallaEmojiAvatarEvent extends CallaEmojiEvent {
        constructor(id, emoji) {
            super("setAvatarEmoji", id, emoji);
        }
    }
    class CallaAvatarChangedEvent extends CallaUserEvent {
        constructor(id, url) {
            super("avatarChanged", id);
            this.url = url;
        }
    }
    class CallaChatEvent extends CallaUserEvent {
        constructor(id, text) {
            super("chat", id);
            this.text = text;
        }
    }

    var ConnectionState;
    (function (ConnectionState) {
        ConnectionState["Disconnected"] = "Disconnected";
        ConnectionState["Connecting"] = "Connecting";
        ConnectionState["Connected"] = "Connected";
        ConnectionState["Disconnecting"] = "Disconnecting";
    })(ConnectionState || (ConnectionState = {}));

    function addLogger(obj, evtName) {
        obj.addEventListener(evtName, (...rest) => {
            if (loggingEnabled) {
                console.log(">== CALLA ==<", evtName, ...rest);
            }
        });
    }
    function filterDeviceDuplicates(devices) {
        const filtered = [];
        for (let i = 0; i < devices.length; ++i) {
            const a = devices[i];
            let found = false;
            for (let j = 0; j < filtered.length && !found; ++j) {
                const b = filtered[j];
                found = a.kind === b.kind && b.label.indexOf(a.label) > 0;
            }
            if (!found) {
                filtered.push(a);
            }
        }
        return filtered;
    }
    const PREFERRED_AUDIO_OUTPUT_ID_KEY = "calla:preferredAudioOutputID";
    const PREFERRED_AUDIO_INPUT_ID_KEY = "calla:preferredAudioInputID";
    const PREFERRED_VIDEO_INPUT_ID_KEY = "calla:preferredVideoInputID";
    const DEFAULT_LOCAL_USER_ID = "local-user";
    let loggingEnabled = window.location.hostname === "localhost"
        || /\bdebug\b/.test(window.location.search);
    class BaseTeleconferenceClient extends TypedEventBase {
        constructor(fetcher, audio, needsAudioDevice = true, needsVideoDevice = false) {
            super();
            this.needsAudioDevice = needsAudioDevice;
            this.needsVideoDevice = needsVideoDevice;
            this.localUserID = null;
            this.localUserName = null;
            this.roomName = null;
            this._connectionState = ConnectionState.Disconnected;
            this._conferenceState = ConnectionState.Disconnected;
            this.hasAudioPermission = false;
            this.hasVideoPermission = false;
            this.fetcher = fetcher;
            this.audio = audio;
            this.addEventListener("serverConnected", this.setConnectionState.bind(this, ConnectionState.Connected));
            this.addEventListener("serverFailed", this.setConnectionState.bind(this, ConnectionState.Disconnected));
            this.addEventListener("serverDisconnected", this.setConnectionState.bind(this, ConnectionState.Disconnected));
            this.addEventListener("conferenceJoined", this.setConferenceState.bind(this, ConnectionState.Connected));
            this.addEventListener("conferenceFailed", this.setConferenceState.bind(this, ConnectionState.Disconnected));
            this.addEventListener("conferenceRestored", this.setConferenceState.bind(this, ConnectionState.Connected));
            this.addEventListener("conferenceLeft", this.setConferenceState.bind(this, ConnectionState.Disconnected));
        }
        toggleLogging() {
            loggingEnabled = !loggingEnabled;
        }
        get connectionState() {
            return this._connectionState;
        }
        setConnectionState(state) {
            this._connectionState = state;
        }
        get conferenceState() {
            return this._conferenceState;
        }
        setConferenceState(state) {
            this._conferenceState = state;
        }
        onDispatching(evt) {
            if (evt instanceof CallaUserEvent
                && (evt.id == null
                    || evt.id === "local")) {
                if (this.localUserID === DEFAULT_LOCAL_USER_ID) {
                    evt.id = null;
                }
                else {
                    evt.id = this.localUserID;
                }
            }
        }
        async getNext(evtName, userID) {
            return new Promise((resolve) => {
                const getter = (evt) => {
                    if (evt instanceof CallaUserEvent
                        && evt.id === userID) {
                        this.removeEventListener(evtName, getter);
                        resolve(evt);
                    }
                };
                this.addEventListener(evtName, getter);
            });
        }
        get preferredAudioInputID() {
            return localStorage.getItem(PREFERRED_AUDIO_INPUT_ID_KEY);
        }
        set preferredAudioInputID(v) {
            localStorage.setItem(PREFERRED_AUDIO_INPUT_ID_KEY, v);
        }
        get preferredVideoInputID() {
            return localStorage.getItem(PREFERRED_VIDEO_INPUT_ID_KEY);
        }
        set preferredVideoInputID(v) {
            localStorage.setItem(PREFERRED_VIDEO_INPUT_ID_KEY, v);
        }
        async setPreferredDevices() {
            await this.setPreferredAudioInput(true);
            await this.setPreferredVideoInput(false);
            await this.setPreferredAudioOutput(true);
        }
        async getPreferredAudioInput(allowAny) {
            const devices = await this.getAudioInputDevices();
            const device = arrayScan(devices, (d) => d.deviceId === this.preferredAudioInputID, (d) => d.deviceId === "communications", (d) => d.deviceId === "default", (d) => allowAny && d.deviceId.length > 0);
            return device;
        }
        async setPreferredAudioInput(allowAny) {
            const device = await this.getPreferredAudioInput(allowAny);
            if (device) {
                await this.setAudioInputDevice(device);
            }
        }
        async getPreferredVideoInput(allowAny) {
            const devices = await this.getVideoInputDevices();
            const device = arrayScan(devices, (d) => d.deviceId === this.preferredVideoInputID, (d) => allowAny && d && /front/i.test(d.label), (d) => allowAny && d.deviceId.length > 0);
            return device;
        }
        async setPreferredVideoInput(allowAny) {
            const device = await this.getPreferredVideoInput(allowAny);
            if (device) {
                await this.setVideoInputDevice(device);
            }
        }
        async getDevices() {
            let devices = null;
            for (let i = 0; i < 3; ++i) {
                devices = await navigator.mediaDevices.enumerateDevices();
                for (const device of devices) {
                    if (device.deviceId.length > 0) {
                        this.hasAudioPermission = this.hasAudioPermission || device.kind === "audioinput" && device.label.length > 0;
                        this.hasVideoPermission = this.hasVideoPermission || device.kind === "videoinput" && device.label.length > 0;
                    }
                }
                if (this.hasAudioPermission) {
                    break;
                }
                try {
                    await navigator.mediaDevices.getUserMedia({
                        audio: this.needsAudioDevice && !this.hasAudioPermission,
                        video: this.needsVideoDevice && !this.hasVideoPermission
                    });
                }
                catch (exp) {
                    console.warn(exp);
                }
            }
            return devices || [];
        }
        async getMediaPermissions() {
            await this.getDevices();
            return {
                audio: this.hasAudioPermission,
                video: this.hasVideoPermission
            };
        }
        async getAvailableDevices(filterDuplicates = false) {
            let devices = await this.getDevices();
            if (filterDuplicates) {
                devices = filterDeviceDuplicates(devices);
            }
            return {
                audioOutput: canChangeAudioOutput ? devices.filter(d => d.kind === "audiooutput") : [],
                audioInput: devices.filter(d => d.kind === "audioinput"),
                videoInput: devices.filter(d => d.kind === "videoinput")
            };
        }
        async getAudioInputDevices(filterDuplicates = false) {
            const devices = await this.getAvailableDevices(filterDuplicates);
            return devices && devices.audioInput || [];
        }
        async getVideoInputDevices(filterDuplicates = false) {
            const devices = await this.getAvailableDevices(filterDuplicates);
            return devices && devices.videoInput || [];
        }
        async setAudioOutputDevice(device) {
            if (canChangeAudioOutput) {
                this.preferredAudioOutputID = device && device.deviceId || null;
            }
        }
        async getAudioOutputDevices(filterDuplicates = false) {
            if (!canChangeAudioOutput) {
                return [];
            }
            const devices = await this.getAvailableDevices(filterDuplicates);
            return devices && devices.audioOutput || [];
        }
        async getCurrentAudioOutputDevice() {
            if (!canChangeAudioOutput) {
                return null;
            }
            const curId = this.audio.getAudioOutputDeviceID(), devices = await this.getAudioOutputDevices(), device = devices.filter((d) => curId != null && d.deviceId === curId
                || curId == null && d.deviceId === this.preferredAudioOutputID);
            if (device.length === 0) {
                return null;
            }
            else {
                return device[0];
            }
        }
        get preferredAudioOutputID() {
            return localStorage.getItem(PREFERRED_AUDIO_OUTPUT_ID_KEY);
        }
        set preferredAudioOutputID(v) {
            localStorage.setItem(PREFERRED_AUDIO_OUTPUT_ID_KEY, v);
        }
        async getPreferredAudioOutput(allowAny) {
            const devices = await this.getAudioOutputDevices();
            const device = arrayScan(devices, (d) => d.deviceId === this.preferredAudioOutputID, (d) => d.deviceId === "communications", (d) => d.deviceId === "default", (d) => allowAny && d.deviceId.length > 0);
            return device;
        }
        async setPreferredAudioOutput(allowAny) {
            const device = await this.getPreferredAudioOutput(allowAny);
            if (device) {
                await this.setAudioOutputDevice(device);
            }
        }
        async setAudioInputDevice(device) {
            this.preferredAudioInputID = device && device.deviceId || null;
        }
        async setVideoInputDevice(device) {
            this.preferredVideoInputID = device && device.deviceId || null;
        }
        async connect() {
            this.setConnectionState(ConnectionState.Connecting);
        }
        async join(_roomName, _password) {
            this.setConferenceState(ConnectionState.Connecting);
        }
        async leave() {
            this.setConferenceState(ConnectionState.Disconnecting);
        }
        async disconnect() {
            this.setConnectionState(ConnectionState.Disconnecting);
        }
    }

    /**
     * Force a value onto a range
     */
    function clamp(v, min, max) {
        return Math.min(max, Math.max(min, v));
    }

    /**
     * An Event class for tracking changes to audio activity.
     **/
    class AudioActivityEvent extends Event {
        /** Creates a new "audioActivity" event */
        constructor() {
            super("audioActivity");
            this.id = null;
            this.isActive = false;
            Object.seal(this);
        }
        /**
         * Sets the current state of the event
         * @param id - the user for which the activity changed
         * @param isActive - the new state of the activity
         */
        set(id, isActive) {
            this.id = id;
            this.isActive = isActive;
        }
    }

    const graph = new Map();
    const children = new Map();
    function add$1(a, b) {
        if (isAudioNode(b)) {
            children.set(b, (children.get(b) || 0) + 1);
        }
        if (!graph.has(a)) {
            graph.set(a, new Set());
        }
        const g = graph.get(a);
        if (g.has(b)) {
            return false;
        }
        g.add(b);
        return true;
    }
    function rem(a, b) {
        if (!graph.has(a)) {
            return false;
        }
        const g = graph.get(a);
        let removed = false;
        if (isNullOrUndefined(b)) {
            removed = g.size > 0;
            g.clear();
        }
        else if (g.has(b)) {
            removed = true;
            g.delete(b);
        }
        if (g.size === 0) {
            graph.delete(a);
        }
        if (isAudioNode(b)
            && children.has(b)) {
            const newCount = children.get(b) - 1;
            children.set(b, newCount);
            if (newCount === 0) {
                children.delete(b);
            }
        }
        return removed;
    }
    function isAudioNode(a) {
        return isDefined(a)
            && isDefined(a.context);
    }
    function isAudioParam(a) {
        return !isAudioNode(a);
    }
    function connect(a, b, c, d) {
        if (isAudioNode(b)) {
            a.connect(b, c, d);
            return add$1(a, b);
        }
        else {
            a.connect(b, c);
            return add$1(a, b);
        }
    }
    function disconnect(a, b, c, d) {
        if (isNullOrUndefined(b)) {
            a.disconnect();
            return rem(a);
        }
        else if (isNumber(b)) {
            a.disconnect(b);
            return rem(a);
        }
        else if (isAudioNode(b)
            && isNumber(c)
            && isNumber(d)) {
            a.disconnect(b, c, d);
            return rem(a, b);
        }
        else if (isAudioNode(b)
            && isNumber(c)) {
            a.disconnect(b, c);
            return rem(a, b);
        }
        else if (isAudioNode(b)) {
            a.disconnect(b);
            return rem(a, b);
        }
        else if (isAudioParam(b)
            && isNumber(c)) {
            a.disconnect(b);
            return rem(a, b);
        }
        else if (isAudioParam(b)) {
            a.disconnect(b);
            return rem(a, b);
        }
        return false;
    }
    function print() {
        for (const node of graph.keys()) {
            if (!children.has(node)) {
                const stack = new Array();
                stack.push({
                    pre: "",
                    node
                });
                while (stack.length > 0) {
                    const { pre, node } = stack.pop();
                    console.log(pre, node);
                    if (isAudioNode(node)) {
                        const set = graph.get(node);
                        if (set) {
                            for (const child of set) {
                                stack.push({
                                    pre: pre + "  ",
                                    node: child
                                });
                            }
                        }
                    }
                }
            }
        }
    }
    window.printGraph = print;

    const audioActivityEvt$2 = new AudioActivityEvent();
    const activityCounterMin = 0;
    const activityCounterMax = 60;
    const activityCounterThresh = 5;
    function frequencyToIndex(frequency, sampleRate, bufferSize) {
        const nyquist = sampleRate / 2;
        const index = Math.round(frequency / nyquist * bufferSize);
        return clamp(index, 0, bufferSize);
    }
    function analyserFrequencyAverage(analyser, frequencies, minHz, maxHz, bufferSize) {
        const sampleRate = analyser.context.sampleRate, start = frequencyToIndex(minHz, sampleRate, bufferSize), end = frequencyToIndex(maxHz, sampleRate, bufferSize), count = end - start;
        let sum = 0;
        for (let i = start; i < end; ++i) {
            sum += frequencies[i];
        }
        return count === 0 ? 0 : (sum / count);
    }
    class ActivityAnalyser extends TypedEventBase {
        constructor(source, audioContext, bufferSize) {
            super();
            this.source = source;
            this.wasActive = false;
            this.analyser = null;
            this.disposed = false;
            if (!isGoodNumber(bufferSize)
                || bufferSize <= 0) {
                throw new Error("Buffer size must be greater than 0");
            }
            this.id = source.id;
            this.bufferSize = bufferSize;
            this.buffer = new Float32Array(this.bufferSize);
            this.wasActive = false;
            this.activityCounter = 0;
            const checkSource = () => {
                if (source.spatializer
                    && source.source) {
                    this.analyser = audioContext.createAnalyser();
                    this.analyser.fftSize = 2 * this.bufferSize;
                    this.analyser.smoothingTimeConstant = 0.2;
                    connect(source.source, this.analyser);
                }
                else {
                    setTimeout(checkSource, 0);
                }
            };
            checkSource();
        }
        dispose() {
            if (!this.disposed) {
                disconnect(this.source.source, this.analyser);
                this.disposed = true;
            }
            this.buffer = null;
        }
        update() {
            if (this.analyser) {
                this.analyser.getFloatFrequencyData(this.buffer);
                const average = 1.1 + analyserFrequencyAverage(this.analyser, this.buffer, 85, 255, this.bufferSize) / 100;
                if (average >= 0.5 && this.activityCounter < activityCounterMax) {
                    this.activityCounter++;
                }
                else if (average < 0.5 && this.activityCounter > activityCounterMin) {
                    this.activityCounter--;
                }
                const isActive = this.activityCounter > activityCounterThresh;
                if (this.wasActive !== isActive) {
                    this.wasActive = isActive;
                    audioActivityEvt$2.id = this.id;
                    audioActivityEvt$2.isActive = isActive;
                    this.dispatchEvent(audioActivityEvt$2);
                }
            }
        }
    }

    /**
     * Common utilities
     * @module glMatrix
     */
    var ARRAY_TYPE = typeof Float32Array !== 'undefined' ? Float32Array : Array;
    if (!Math.hypot) Math.hypot = function () {
      var y = 0,
          i = arguments.length;

      while (i--) {
        y += arguments[i] * arguments[i];
      }

      return Math.sqrt(y);
    };

    /**
     * 3x3 Matrix
     * @module mat3
     */

    /**
     * Creates a new identity mat3
     *
     * @returns {mat3} a new 3x3 matrix
     */

    function create$2() {
      var out = new ARRAY_TYPE(9);

      if (ARRAY_TYPE != Float32Array) {
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[5] = 0;
        out[6] = 0;
        out[7] = 0;
      }

      out[0] = 1;
      out[4] = 1;
      out[8] = 1;
      return out;
    }
    /**
     * Set the components of a mat3 to the given values
     *
     * @param {mat3} out the receiving matrix
     * @param {Number} m00 Component in column 0, row 0 position (index 0)
     * @param {Number} m01 Component in column 0, row 1 position (index 1)
     * @param {Number} m02 Component in column 0, row 2 position (index 2)
     * @param {Number} m10 Component in column 1, row 0 position (index 3)
     * @param {Number} m11 Component in column 1, row 1 position (index 4)
     * @param {Number} m12 Component in column 1, row 2 position (index 5)
     * @param {Number} m20 Component in column 2, row 0 position (index 6)
     * @param {Number} m21 Component in column 2, row 1 position (index 7)
     * @param {Number} m22 Component in column 2, row 2 position (index 8)
     * @returns {mat3} out
     */

    function set$2(out, m00, m01, m02, m10, m11, m12, m20, m21, m22) {
      out[0] = m00;
      out[1] = m01;
      out[2] = m02;
      out[3] = m10;
      out[4] = m11;
      out[5] = m12;
      out[6] = m20;
      out[7] = m21;
      out[8] = m22;
      return out;
    }
    /**
     * Set a mat3 to the identity matrix
     *
     * @param {mat3} out the receiving matrix
     * @returns {mat3} out
     */

    function identity(out) {
      out[0] = 1;
      out[1] = 0;
      out[2] = 0;
      out[3] = 0;
      out[4] = 1;
      out[5] = 0;
      out[6] = 0;
      out[7] = 0;
      out[8] = 1;
      return out;
    }

    /**
     * 4x4 Matrix<br>Format: column-major, when typed out it looks like row-major<br>The matrices are being post multiplied.
     * @module mat4
     */

    /**
     * Creates a new identity mat4
     *
     * @returns {mat4} a new 4x4 matrix
     */

    function create$1() {
      var out = new ARRAY_TYPE(16);

      if (ARRAY_TYPE != Float32Array) {
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[4] = 0;
        out[6] = 0;
        out[7] = 0;
        out[8] = 0;
        out[9] = 0;
        out[11] = 0;
        out[12] = 0;
        out[13] = 0;
        out[14] = 0;
      }

      out[0] = 1;
      out[5] = 1;
      out[10] = 1;
      out[15] = 1;
      return out;
    }
    /**
     * Set the components of a mat4 to the given values
     *
     * @param {mat4} out the receiving matrix
     * @param {Number} m00 Component in column 0, row 0 position (index 0)
     * @param {Number} m01 Component in column 0, row 1 position (index 1)
     * @param {Number} m02 Component in column 0, row 2 position (index 2)
     * @param {Number} m03 Component in column 0, row 3 position (index 3)
     * @param {Number} m10 Component in column 1, row 0 position (index 4)
     * @param {Number} m11 Component in column 1, row 1 position (index 5)
     * @param {Number} m12 Component in column 1, row 2 position (index 6)
     * @param {Number} m13 Component in column 1, row 3 position (index 7)
     * @param {Number} m20 Component in column 2, row 0 position (index 8)
     * @param {Number} m21 Component in column 2, row 1 position (index 9)
     * @param {Number} m22 Component in column 2, row 2 position (index 10)
     * @param {Number} m23 Component in column 2, row 3 position (index 11)
     * @param {Number} m30 Component in column 3, row 0 position (index 12)
     * @param {Number} m31 Component in column 3, row 1 position (index 13)
     * @param {Number} m32 Component in column 3, row 2 position (index 14)
     * @param {Number} m33 Component in column 3, row 3 position (index 15)
     * @returns {mat4} out
     */

    function set$1(out, m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
      out[0] = m00;
      out[1] = m01;
      out[2] = m02;
      out[3] = m03;
      out[4] = m10;
      out[5] = m11;
      out[6] = m12;
      out[7] = m13;
      out[8] = m20;
      out[9] = m21;
      out[10] = m22;
      out[11] = m23;
      out[12] = m30;
      out[13] = m31;
      out[14] = m32;
      out[15] = m33;
      return out;
    }

    /**
     * 3 Dimensional Vector
     * @module vec3
     */

    /**
     * Creates a new, empty vec3
     *
     * @returns {vec3} a new 3D vector
     */

    function create() {
      var out = new ARRAY_TYPE(3);

      if (ARRAY_TYPE != Float32Array) {
        out[0] = 0;
        out[1] = 0;
        out[2] = 0;
      }

      return out;
    }
    /**
     * Calculates the length of a vec3
     *
     * @param {ReadonlyVec3} a vector to calculate length of
     * @returns {Number} length of a
     */

    function length(a) {
      var x = a[0];
      var y = a[1];
      var z = a[2];
      return Math.hypot(x, y, z);
    }
    /**
     * Copy the values from one vec3 to another
     *
     * @param {vec3} out the receiving vector
     * @param {ReadonlyVec3} a the source vector
     * @returns {vec3} out
     */

    function copy(out, a) {
      out[0] = a[0];
      out[1] = a[1];
      out[2] = a[2];
      return out;
    }
    /**
     * Set the components of a vec3 to the given values
     *
     * @param {vec3} out the receiving vector
     * @param {Number} x X component
     * @param {Number} y Y component
     * @param {Number} z Z component
     * @returns {vec3} out
     */

    function set(out, x, y, z) {
      out[0] = x;
      out[1] = y;
      out[2] = z;
      return out;
    }
    /**
     * Adds two vec3's
     *
     * @param {vec3} out the receiving vector
     * @param {ReadonlyVec3} a the first operand
     * @param {ReadonlyVec3} b the second operand
     * @returns {vec3} out
     */

    function add(out, a, b) {
      out[0] = a[0] + b[0];
      out[1] = a[1] + b[1];
      out[2] = a[2] + b[2];
      return out;
    }
    /**
     * Subtracts vector b from vector a
     *
     * @param {vec3} out the receiving vector
     * @param {ReadonlyVec3} a the first operand
     * @param {ReadonlyVec3} b the second operand
     * @returns {vec3} out
     */

    function subtract(out, a, b) {
      out[0] = a[0] - b[0];
      out[1] = a[1] - b[1];
      out[2] = a[2] - b[2];
      return out;
    }
    /**
     * Scales a vec3 by a scalar number
     *
     * @param {vec3} out the receiving vector
     * @param {ReadonlyVec3} a the vector to scale
     * @param {Number} b amount to scale the vector by
     * @returns {vec3} out
     */

    function scale(out, a, b) {
      out[0] = a[0] * b;
      out[1] = a[1] * b;
      out[2] = a[2] * b;
      return out;
    }
    /**
     * Normalize a vec3
     *
     * @param {vec3} out the receiving vector
     * @param {ReadonlyVec3} a vector to normalize
     * @returns {vec3} out
     */

    function normalize(out, a) {
      var x = a[0];
      var y = a[1];
      var z = a[2];
      var len = x * x + y * y + z * z;

      if (len > 0) {
        //TODO: evaluate use of glm_invsqrt here?
        len = 1 / Math.sqrt(len);
      }

      out[0] = a[0] * len;
      out[1] = a[1] * len;
      out[2] = a[2] * len;
      return out;
    }
    /**
     * Calculates the dot product of two vec3's
     *
     * @param {ReadonlyVec3} a the first operand
     * @param {ReadonlyVec3} b the second operand
     * @returns {Number} dot product of a and b
     */

    function dot(a, b) {
      return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    }
    /**
     * Computes the cross product of two vec3's
     *
     * @param {vec3} out the receiving vector
     * @param {ReadonlyVec3} a the first operand
     * @param {ReadonlyVec3} b the second operand
     * @returns {vec3} out
     */

    function cross(out, a, b) {
      var ax = a[0],
          ay = a[1],
          az = a[2];
      var bx = b[0],
          by = b[1],
          bz = b[2];
      out[0] = ay * bz - az * by;
      out[1] = az * bx - ax * bz;
      out[2] = ax * by - ay * bx;
      return out;
    }
    /**
     * Performs a linear interpolation between two vec3's
     *
     * @param {vec3} out the receiving vector
     * @param {ReadonlyVec3} a the first operand
     * @param {ReadonlyVec3} b the second operand
     * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
     * @returns {vec3} out
     */

    function lerp$1(out, a, b, t) {
      var ax = a[0];
      var ay = a[1];
      var az = a[2];
      out[0] = ax + t * (b[0] - ax);
      out[1] = ay + t * (b[1] - ay);
      out[2] = az + t * (b[2] - az);
      return out;
    }
    /**
     * Set the components of a vec3 to zero
     *
     * @param {vec3} out the receiving vector
     * @returns {vec3} out
     */

    function zero(out) {
      out[0] = 0.0;
      out[1] = 0.0;
      out[2] = 0.0;
      return out;
    }
    /**
     * Alias for {@link vec3.subtract}
     * @function
     */

    var sub = subtract;
    /**
     * Perform some operation over an array of vec3s.
     *
     * @param {Array} a the array of vectors to iterate over
     * @param {Number} stride Number of elements between the start of each vec3. If 0 assumes tightly packed
     * @param {Number} offset Number of elements to skip at the beginning of the array
     * @param {Number} count Number of vec3s to iterate over. If 0 iterates over entire array
     * @param {Function} fn Function to call for each vector in the array
     * @param {Object} [arg] additional argument to pass to fn
     * @returns {Array} a
     * @function
     */

    (function () {
      var vec = create();
      return function (a, stride, offset, count, fn, arg) {
        var i, l;

        if (!stride) {
          stride = 3;
        }

        if (!offset) {
          offset = 0;
        }

        if (count) {
          l = Math.min(count * stride + offset, a.length);
        } else {
          l = a.length;
        }

        for (i = offset; i < l; i += stride) {
          vec[0] = a[i];
          vec[1] = a[i + 1];
          vec[2] = a[i + 2];
          fn(vec, vec, arg);
          a[i] = vec[0];
          a[i + 1] = vec[1];
          a[i + 2] = vec[2];
        }

        return a;
      };
    })();

    /**
     * Translate a value into a range.
     */
    function project(v, min, max) {
        const delta = max - min;
        if (delta === 0) {
            return 0;
        }
        else {
            return (v - min) / delta;
        }
    }

    /**
     * A position and orientation, at a given time.
     **/
    class Pose {
        /**
         * Creates a new position and orientation, at a given time.
         **/
        constructor() {
            this.t = 0;
            this.p = create();
            this.f = set(create(), 0, 0, -1);
            this.u = set(create(), 0, 1, 0);
            Object.seal(this);
        }
        /**
         * Sets the components of the pose.
         */
        set(px, py, pz, fx, fy, fz, ux, uy, uz) {
            set(this.p, px, py, pz);
            set(this.f, fx, fy, fz);
            set(this.u, ux, uy, uz);
        }
        /**
         * Copies the components of another pose into this pose.
         */
        copy(other) {
            copy(this.p, other.p);
            copy(this.f, other.f);
            copy(this.u, other.u);
        }
        /**
         * Performs a lerp between two positions and a slerp between to orientations
         * and stores the result in this pose.
         */
        interpolate(start, end, t) {
            if (t <= start.t) {
                this.copy(start);
            }
            else if (end.t <= t) {
                this.copy(end);
            }
            else if (start.t < t) {
                const p = project(t, start.t, end.t);
                this.copy(start);
                lerp$1(this.p, this.p, end.p, p);
                lerp$1(this.f, this.f, end.f, p);
                lerp$1(this.u, this.u, end.u, p);
                normalize(this.f, this.f);
                normalize(this.u, this.u);
                this.t = t;
            }
        }
    }

    const delta$1 = create();
    const k = 2;
    /**
     * A position value that is blended from the current position to
     * a target position over time.
     */
    class InterpolatedPose {
        constructor() {
            this.start = new Pose();
            this.current = new Pose();
            this.end = new Pose();
            this.offset = create();
        }
        /**
         * Set the target comfort offset for the time `t + dt`.
         */
        setOffset(ox, oy, oz) {
            set(delta$1, ox, oy, oz);
            sub(delta$1, delta$1, this.offset);
            add(this.start.p, this.start.p, delta$1);
            add(this.current.p, this.current.p, delta$1);
            add(this.end.p, this.end.p, delta$1);
            scale(this.start.f, this.start.f, k);
            add(this.start.f, this.start.f, delta$1);
            normalize(this.start.f, this.start.f);
            scale(this.current.f, this.current.f, k);
            add(this.current.f, this.current.f, delta$1);
            normalize(this.current.f, this.current.f);
            scale(this.end.f, this.end.f, k);
            add(this.end.f, this.end.f, delta$1);
            normalize(this.end.f, this.end.f);
            set(this.offset, ox, oy, oz);
        }
        /**
         * Set the target position and orientation for the time `t + dt`.
         * @param px - the horizontal component of the position.
         * @param py - the vertical component of the position.
         * @param pz - the lateral component of the position.
         * @param fx - the horizontal component of the position.
         * @param fy - the vertical component of the position.
         * @param fz - the lateral component of the position.
         * @param ux - the horizontal component of the position.
         * @param uy - the vertical component of the position.
         * @param uz - the lateral component of the position.
         * @param t - the time at which to start the transition.
         * @param dt - the amount of time to take making the transition.
         */
        setTarget(px, py, pz, fx, fy, fz, ux, uy, uz, t, dt) {
            const ox = this.offset[0];
            const oy = this.offset[1];
            const oz = this.offset[2];
            this.end.set(px + ox, py + oy, pz + oz, fx, fy, fz, ux, uy, uz);
            this.end.t = t + dt;
            if (dt > 0) {
                this.start.copy(this.current);
                this.start.t = t;
            }
            else {
                this.start.copy(this.end);
                this.start.t = t;
                this.current.copy(this.end);
                this.current.t = t;
            }
        }
        /**
         * Set the target position for the time `t + dt`.
         * @param px - the horizontal component of the position.
         * @param py - the vertical component of the position.
         * @param pz - the lateral component of the position.
         * @param t - the time at which to start the transition.
         * @param dt - the amount of time to take making the transition.
         */
        setTargetPosition(px, py, pz, t, dt) {
            this.setTarget(px, py, pz, this.end.f[0], this.end.f[1], this.end.f[2], this.end.u[0], this.end.u[1], this.end.u[2], t, dt);
        }
        /**
         * Set the target orientation for the time `t + dt`.
         * @param fx - the horizontal component of the position.
         * @param fy - the vertical component of the position.
         * @param fz - the lateral component of the position.
         * @param ux - the horizontal component of the position.
         * @param uy - the vertical component of the position.
         * @param uz - the lateral component of the position.
         * @param t - the time at which to start the transition.
         * @param dt - the amount of time to take making the transition.
         */
        setTargetOrientation(fx, fy, fz, ux, uy, uz, t, dt) {
            this.setTarget(this.end.p[0], this.end.p[1], this.end.p[2], fx, fy, fz, ux, uy, uz, t, dt);
        }
        /**
         * Calculates the new position for the given time.
         */
        update(t) {
            this.current.interpolate(this.start, this.end, t);
        }
    }

    class BaseAudioElement {
        constructor(audioContext) {
            this.audioContext = audioContext;
            this.pose = new InterpolatedPose();
            this._spatializer = null;
            this.disposed = false;
            this.volumeControl = audioContext.createGain();
        }
        dispose() {
            if (!this.disposed) {
                this.spatializer = null;
                this.disposed = true;
            }
        }
        get volume() {
            return this.volumeControl.gain.value;
        }
        set volume(v) {
            this.volumeControl.gain.value = v;
        }
        get spatializer() {
            return this._spatializer;
        }
        set spatializer(v) {
            if (this.spatializer !== v) {
                if (this._spatializer) {
                    this.disconnectSpatializer();
                    this._spatializer.dispose();
                }
                this._spatializer = v;
                if (this._spatializer) {
                    this.connectSpatializer();
                }
            }
        }
        /**
         * Update the user.
         * @param t - the current update time.
         */
        update(t) {
            this.pose.update(t);
            if (this.spatializer) {
                this.spatializer.update(this.pose.current, t);
            }
        }
    }

    /**
     * Base class providing functionality for spatializers.
     */
    class BaseSpatializer {
        constructor(audioContext) {
            this.audioContext = audioContext;
            this.minDistance = 1;
            this.maxDistance = 10;
            this.rolloff = 1;
            this.algorithm = "logarithmic";
            this.transitionTime = 0.1;
        }
        dispose() {
            // nothing to do in the base case
        }
        /**
         * Sets parameters that alter spatialization.
         **/
        setAudioProperties(minDistance, maxDistance, rolloff, algorithm, transitionTime) {
            this.minDistance = minDistance;
            this.maxDistance = maxDistance;
            this.rolloff = rolloff;
            this.algorithm = algorithm;
            this.transitionTime = transitionTime;
        }
    }

    /**
     * Base class providing functionality for audio listeners.
     **/
    class BaseEmitter extends BaseSpatializer {
        /**
         * Creates a spatializer that keeps track of position
         */
        constructor(audioContext, destination) {
            super(audioContext);
            this.destination = destination;
            this.disposed = false;
        }
        dispose() {
            if (!this.disposed) {
                if (this.output !== this.destination) {
                    disconnect(this.output, this.destination);
                }
                this.disposed = true;
            }
        }
        copyAudioProperties(from) {
            this.setAudioProperties(from.minDistance, from.maxDistance, from.rolloff, from.algorithm, from.transitionTime);
        }
        clone() {
            const emitter = this.createNew();
            emitter.copyAudioProperties(this);
            return emitter;
        }
    }

    class NoSpatializationNode extends BaseEmitter {
        /**
         * Creates a new "spatializer" that performs no panning. An anti-spatializer.
         */
        constructor(audioContext, destination) {
            super(audioContext, destination);
            this.input = this.output = destination;
            Object.seal(this);
        }
        createNew() {
            return new NoSpatializationNode(this.audioContext, this.destination);
        }
        update(_loc, _t) {
            // do nothing
        }
    }

    /**
     * Base class providing functionality for audio listeners.
     **/
    class BaseListener extends BaseSpatializer {
        /**
         * Creates a spatializer that keeps track of position
         */
        constructor(audioContext) {
            super(audioContext);
        }
        /**
         * Creates a spatialzer for an audio source.
         */
        createSpatializer(spatialize, audioContext, destination) {
            if (spatialize) {
                throw new Error("Can't spatialize with the base listener.");
            }
            return new NoSpatializationNode(audioContext, destination.nonSpatializedInput);
        }
    }

    class NoSpatializationListener extends BaseListener {
        constructor(audioContext) {
            super(audioContext);
            const gain = audioContext.createGain();
            gain.gain.value = 0.1;
            this.input = this.output = gain;
        }
        /**
         * Do nothing
         */
        update(_loc, _t) {
        }
        /**
         * Creates a spatialzer for an audio source.
         */
        createSpatializer(_spatialize, audioContext, destination) {
            return new NoSpatializationNode(audioContext, destination.nonSpatializedInput);
        }
    }

    class AudioDestination extends BaseAudioElement {
        constructor(audioContext, destination) {
            super(audioContext);
            this.disposed2 = false;
            this._spatializedInput = audioContext.createGain();
            this._nonSpatializedInput = audioContext.createGain();
            connect(this._nonSpatializedInput, this.volumeControl);
            this.setDestination(destination);
        }
        dispose() {
            if (!this.disposed2) {
                this.setDestination(null);
                disconnect(this._nonSpatializedInput, this.volumeControl);
                super.dispose();
                this.disposed2 = true;
            }
        }
        get spatialized() {
            return !(this.spatializer instanceof NoSpatializationListener);
        }
        get spatializedInput() {
            return this._spatializedInput;
        }
        get nonSpatializedInput() {
            return this._nonSpatializedInput;
        }
        setDestination(v) {
            if (v !== this._trueDestination) {
                if (this._trueDestination) {
                    disconnect(this.volumeControl, this._trueDestination);
                }
                this._trueDestination = v;
                if (this._trueDestination) {
                    connect(this.volumeControl, this._trueDestination);
                }
            }
        }
        disconnectSpatializer() {
            disconnect(this.spatializer.output, this.volumeControl);
            disconnect(this._spatializedInput, this.spatializer.input);
        }
        connectSpatializer() {
            connect(this._spatializedInput, this.spatializer.input);
            connect(this.spatializer.output, this.volumeControl);
        }
    }

    /**
     * Rendering mode ENUM.
     */
    var RenderingMode;
    (function (RenderingMode) {
        /** Use ambisonic rendering. */
        RenderingMode["Ambisonic"] = "ambisonic";
        /** Bypass. No ambisonic rendering. */
        RenderingMode["Bypass"] = "bypass";
        /** Disable audio output. */
        RenderingMode["None"] = "off";
    })(RenderingMode || (RenderingMode = {}));

    var Direction;
    (function (Direction) {
        Direction["Left"] = "left";
        Direction["Right"] = "right";
        Direction["Front"] = "front";
        Direction["Back"] = "back";
        Direction["Down"] = "down";
        Direction["Up"] = "up";
    })(Direction || (Direction = {}));

    /**
     * Copyright 2017 Google Inc. All Rights Reserved.
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *     http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * @file Pre-computed lookup tables for encoding ambisonic sources.
     * @author Andrew Allen <bitllama@google.com>
     */
    /**
     * Pre-computed Spherical Harmonics Coefficients.
     *
     * This function generates an efficient lookup table of SH coefficients. It
     * exploits the way SHs are generated (i.e. Ylm = Nlm * Plm * Em). Since Nlm
     * & Plm coefficients only depend on theta, and Em only depends on phi, we
     * can separate the equation along these lines. Em does not depend on
     * degree, so we only need to compute (2 * l) per azimuth Em total and
     * Nlm * Plm is symmetrical across indexes, so only positive indexes are
     * computed ((l + 1) * (l + 2) / 2 - 1) per elevation.
     */
    const SPHERICAL_HARMONICS = [
        [
            [0.000000, 0.000000, 0.000000, 1.000000, 1.000000, 1.000000],
            [0.052336, 0.034899, 0.017452, 0.999848, 0.999391, 0.998630],
            [0.104528, 0.069756, 0.034899, 0.999391, 0.997564, 0.994522],
            [0.156434, 0.104528, 0.052336, 0.998630, 0.994522, 0.987688],
            [0.207912, 0.139173, 0.069756, 0.997564, 0.990268, 0.978148],
            [0.258819, 0.173648, 0.087156, 0.996195, 0.984808, 0.965926],
            [0.309017, 0.207912, 0.104528, 0.994522, 0.978148, 0.951057],
            [0.358368, 0.241922, 0.121869, 0.992546, 0.970296, 0.933580],
            [0.406737, 0.275637, 0.139173, 0.990268, 0.961262, 0.913545],
            [0.453990, 0.309017, 0.156434, 0.987688, 0.951057, 0.891007],
            [0.500000, 0.342020, 0.173648, 0.984808, 0.939693, 0.866025],
            [0.544639, 0.374607, 0.190809, 0.981627, 0.927184, 0.838671],
            [0.587785, 0.406737, 0.207912, 0.978148, 0.913545, 0.809017],
            [0.629320, 0.438371, 0.224951, 0.974370, 0.898794, 0.777146],
            [0.669131, 0.469472, 0.241922, 0.970296, 0.882948, 0.743145],
            [0.707107, 0.500000, 0.258819, 0.965926, 0.866025, 0.707107],
            [0.743145, 0.529919, 0.275637, 0.961262, 0.848048, 0.669131],
            [0.777146, 0.559193, 0.292372, 0.956305, 0.829038, 0.629320],
            [0.809017, 0.587785, 0.309017, 0.951057, 0.809017, 0.587785],
            [0.838671, 0.615661, 0.325568, 0.945519, 0.788011, 0.544639],
            [0.866025, 0.642788, 0.342020, 0.939693, 0.766044, 0.500000],
            [0.891007, 0.669131, 0.358368, 0.933580, 0.743145, 0.453990],
            [0.913545, 0.694658, 0.374607, 0.927184, 0.719340, 0.406737],
            [0.933580, 0.719340, 0.390731, 0.920505, 0.694658, 0.358368],
            [0.951057, 0.743145, 0.406737, 0.913545, 0.669131, 0.309017],
            [0.965926, 0.766044, 0.422618, 0.906308, 0.642788, 0.258819],
            [0.978148, 0.788011, 0.438371, 0.898794, 0.615661, 0.207912],
            [0.987688, 0.809017, 0.453990, 0.891007, 0.587785, 0.156434],
            [0.994522, 0.829038, 0.469472, 0.882948, 0.559193, 0.104528],
            [0.998630, 0.848048, 0.484810, 0.874620, 0.529919, 0.052336],
            [1.000000, 0.866025, 0.500000, 0.866025, 0.500000, 0.000000],
            [0.998630, 0.882948, 0.515038, 0.857167, 0.469472, -0.052336],
            [0.994522, 0.898794, 0.529919, 0.848048, 0.438371, -0.104528],
            [0.987688, 0.913545, 0.544639, 0.838671, 0.406737, -0.156434],
            [0.978148, 0.927184, 0.559193, 0.829038, 0.374607, -0.207912],
            [0.965926, 0.939693, 0.573576, 0.819152, 0.342020, -0.258819],
            [0.951057, 0.951057, 0.587785, 0.809017, 0.309017, -0.309017],
            [0.933580, 0.961262, 0.601815, 0.798636, 0.275637, -0.358368],
            [0.913545, 0.970296, 0.615661, 0.788011, 0.241922, -0.406737],
            [0.891007, 0.978148, 0.629320, 0.777146, 0.207912, -0.453990],
            [0.866025, 0.984808, 0.642788, 0.766044, 0.173648, -0.500000],
            [0.838671, 0.990268, 0.656059, 0.754710, 0.139173, -0.544639],
            [0.809017, 0.994522, 0.669131, 0.743145, 0.104528, -0.587785],
            [0.777146, 0.997564, 0.681998, 0.731354, 0.069756, -0.629320],
            [0.743145, 0.999391, 0.694658, 0.719340, 0.034899, -0.669131],
            [0.707107, 1.000000, 0.707107, 0.707107, 0.000000, -0.707107],
            [0.669131, 0.999391, 0.719340, 0.694658, -0.034899, -0.743145],
            [0.629320, 0.997564, 0.731354, 0.681998, -0.069756, -0.777146],
            [0.587785, 0.994522, 0.743145, 0.669131, -0.104528, -0.809017],
            [0.544639, 0.990268, 0.754710, 0.656059, -0.139173, -0.838671],
            [0.500000, 0.984808, 0.766044, 0.642788, -0.173648, -0.866025],
            [0.453990, 0.978148, 0.777146, 0.629320, -0.207912, -0.891007],
            [0.406737, 0.970296, 0.788011, 0.615661, -0.241922, -0.913545],
            [0.358368, 0.961262, 0.798636, 0.601815, -0.275637, -0.933580],
            [0.309017, 0.951057, 0.809017, 0.587785, -0.309017, -0.951057],
            [0.258819, 0.939693, 0.819152, 0.573576, -0.342020, -0.965926],
            [0.207912, 0.927184, 0.829038, 0.559193, -0.374607, -0.978148],
            [0.156434, 0.913545, 0.838671, 0.544639, -0.406737, -0.987688],
            [0.104528, 0.898794, 0.848048, 0.529919, -0.438371, -0.994522],
            [0.052336, 0.882948, 0.857167, 0.515038, -0.469472, -0.998630],
            [0.000000, 0.866025, 0.866025, 0.500000, -0.500000, -1.000000],
            [-0.052336, 0.848048, 0.874620, 0.484810, -0.529919, -0.998630],
            [-0.104528, 0.829038, 0.882948, 0.469472, -0.559193, -0.994522],
            [-0.156434, 0.809017, 0.891007, 0.453990, -0.587785, -0.987688],
            [-0.207912, 0.788011, 0.898794, 0.438371, -0.615661, -0.978148],
            [-0.258819, 0.766044, 0.906308, 0.422618, -0.642788, -0.965926],
            [-0.309017, 0.743145, 0.913545, 0.406737, -0.669131, -0.951057],
            [-0.358368, 0.719340, 0.920505, 0.390731, -0.694658, -0.933580],
            [-0.406737, 0.694658, 0.927184, 0.374607, -0.719340, -0.913545],
            [-0.453990, 0.669131, 0.933580, 0.358368, -0.743145, -0.891007],
            [-0.500000, 0.642788, 0.939693, 0.342020, -0.766044, -0.866025],
            [-0.544639, 0.615661, 0.945519, 0.325568, -0.788011, -0.838671],
            [-0.587785, 0.587785, 0.951057, 0.309017, -0.809017, -0.809017],
            [-0.629320, 0.559193, 0.956305, 0.292372, -0.829038, -0.777146],
            [-0.669131, 0.529919, 0.961262, 0.275637, -0.848048, -0.743145],
            [-0.707107, 0.500000, 0.965926, 0.258819, -0.866025, -0.707107],
            [-0.743145, 0.469472, 0.970296, 0.241922, -0.882948, -0.669131],
            [-0.777146, 0.438371, 0.974370, 0.224951, -0.898794, -0.629320],
            [-0.809017, 0.406737, 0.978148, 0.207912, -0.913545, -0.587785],
            [-0.838671, 0.374607, 0.981627, 0.190809, -0.927184, -0.544639],
            [-0.866025, 0.342020, 0.984808, 0.173648, -0.939693, -0.500000],
            [-0.891007, 0.309017, 0.987688, 0.156434, -0.951057, -0.453990],
            [-0.913545, 0.275637, 0.990268, 0.139173, -0.961262, -0.406737],
            [-0.933580, 0.241922, 0.992546, 0.121869, -0.970296, -0.358368],
            [-0.951057, 0.207912, 0.994522, 0.104528, -0.978148, -0.309017],
            [-0.965926, 0.173648, 0.996195, 0.087156, -0.984808, -0.258819],
            [-0.978148, 0.139173, 0.997564, 0.069756, -0.990268, -0.207912],
            [-0.987688, 0.104528, 0.998630, 0.052336, -0.994522, -0.156434],
            [-0.994522, 0.069756, 0.999391, 0.034899, -0.997564, -0.104528],
            [-0.998630, 0.034899, 0.999848, 0.017452, -0.999391, -0.052336],
            [-1.000000, 0.000000, 1.000000, 0.000000, -1.000000, -0.000000],
            [-0.998630, -0.034899, 0.999848, -0.017452, -0.999391, 0.052336],
            [-0.994522, -0.069756, 0.999391, -0.034899, -0.997564, 0.104528],
            [-0.987688, -0.104528, 0.998630, -0.052336, -0.994522, 0.156434],
            [-0.978148, -0.139173, 0.997564, -0.069756, -0.990268, 0.207912],
            [-0.965926, -0.173648, 0.996195, -0.087156, -0.984808, 0.258819],
            [-0.951057, -0.207912, 0.994522, -0.104528, -0.978148, 0.309017],
            [-0.933580, -0.241922, 0.992546, -0.121869, -0.970296, 0.358368],
            [-0.913545, -0.275637, 0.990268, -0.139173, -0.961262, 0.406737],
            [-0.891007, -0.309017, 0.987688, -0.156434, -0.951057, 0.453990],
            [-0.866025, -0.342020, 0.984808, -0.173648, -0.939693, 0.500000],
            [-0.838671, -0.374607, 0.981627, -0.190809, -0.927184, 0.544639],
            [-0.809017, -0.406737, 0.978148, -0.207912, -0.913545, 0.587785],
            [-0.777146, -0.438371, 0.974370, -0.224951, -0.898794, 0.629320],
            [-0.743145, -0.469472, 0.970296, -0.241922, -0.882948, 0.669131],
            [-0.707107, -0.500000, 0.965926, -0.258819, -0.866025, 0.707107],
            [-0.669131, -0.529919, 0.961262, -0.275637, -0.848048, 0.743145],
            [-0.629320, -0.559193, 0.956305, -0.292372, -0.829038, 0.777146],
            [-0.587785, -0.587785, 0.951057, -0.309017, -0.809017, 0.809017],
            [-0.544639, -0.615661, 0.945519, -0.325568, -0.788011, 0.838671],
            [-0.500000, -0.642788, 0.939693, -0.342020, -0.766044, 0.866025],
            [-0.453990, -0.669131, 0.933580, -0.358368, -0.743145, 0.891007],
            [-0.406737, -0.694658, 0.927184, -0.374607, -0.719340, 0.913545],
            [-0.358368, -0.719340, 0.920505, -0.390731, -0.694658, 0.933580],
            [-0.309017, -0.743145, 0.913545, -0.406737, -0.669131, 0.951057],
            [-0.258819, -0.766044, 0.906308, -0.422618, -0.642788, 0.965926],
            [-0.207912, -0.788011, 0.898794, -0.438371, -0.615661, 0.978148],
            [-0.156434, -0.809017, 0.891007, -0.453990, -0.587785, 0.987688],
            [-0.104528, -0.829038, 0.882948, -0.469472, -0.559193, 0.994522],
            [-0.052336, -0.848048, 0.874620, -0.484810, -0.529919, 0.998630],
            [-0.000000, -0.866025, 0.866025, -0.500000, -0.500000, 1.000000],
            [0.052336, -0.882948, 0.857167, -0.515038, -0.469472, 0.998630],
            [0.104528, -0.898794, 0.848048, -0.529919, -0.438371, 0.994522],
            [0.156434, -0.913545, 0.838671, -0.544639, -0.406737, 0.987688],
            [0.207912, -0.927184, 0.829038, -0.559193, -0.374607, 0.978148],
            [0.258819, -0.939693, 0.819152, -0.573576, -0.342020, 0.965926],
            [0.309017, -0.951057, 0.809017, -0.587785, -0.309017, 0.951057],
            [0.358368, -0.961262, 0.798636, -0.601815, -0.275637, 0.933580],
            [0.406737, -0.970296, 0.788011, -0.615661, -0.241922, 0.913545],
            [0.453990, -0.978148, 0.777146, -0.629320, -0.207912, 0.891007],
            [0.500000, -0.984808, 0.766044, -0.642788, -0.173648, 0.866025],
            [0.544639, -0.990268, 0.754710, -0.656059, -0.139173, 0.838671],
            [0.587785, -0.994522, 0.743145, -0.669131, -0.104528, 0.809017],
            [0.629320, -0.997564, 0.731354, -0.681998, -0.069756, 0.777146],
            [0.669131, -0.999391, 0.719340, -0.694658, -0.034899, 0.743145],
            [0.707107, -1.000000, 0.707107, -0.707107, -0.000000, 0.707107],
            [0.743145, -0.999391, 0.694658, -0.719340, 0.034899, 0.669131],
            [0.777146, -0.997564, 0.681998, -0.731354, 0.069756, 0.629320],
            [0.809017, -0.994522, 0.669131, -0.743145, 0.104528, 0.587785],
            [0.838671, -0.990268, 0.656059, -0.754710, 0.139173, 0.544639],
            [0.866025, -0.984808, 0.642788, -0.766044, 0.173648, 0.500000],
            [0.891007, -0.978148, 0.629320, -0.777146, 0.207912, 0.453990],
            [0.913545, -0.970296, 0.615661, -0.788011, 0.241922, 0.406737],
            [0.933580, -0.961262, 0.601815, -0.798636, 0.275637, 0.358368],
            [0.951057, -0.951057, 0.587785, -0.809017, 0.309017, 0.309017],
            [0.965926, -0.939693, 0.573576, -0.819152, 0.342020, 0.258819],
            [0.978148, -0.927184, 0.559193, -0.829038, 0.374607, 0.207912],
            [0.987688, -0.913545, 0.544639, -0.838671, 0.406737, 0.156434],
            [0.994522, -0.898794, 0.529919, -0.848048, 0.438371, 0.104528],
            [0.998630, -0.882948, 0.515038, -0.857167, 0.469472, 0.052336],
            [1.000000, -0.866025, 0.500000, -0.866025, 0.500000, 0.000000],
            [0.998630, -0.848048, 0.484810, -0.874620, 0.529919, -0.052336],
            [0.994522, -0.829038, 0.469472, -0.882948, 0.559193, -0.104528],
            [0.987688, -0.809017, 0.453990, -0.891007, 0.587785, -0.156434],
            [0.978148, -0.788011, 0.438371, -0.898794, 0.615661, -0.207912],
            [0.965926, -0.766044, 0.422618, -0.906308, 0.642788, -0.258819],
            [0.951057, -0.743145, 0.406737, -0.913545, 0.669131, -0.309017],
            [0.933580, -0.719340, 0.390731, -0.920505, 0.694658, -0.358368],
            [0.913545, -0.694658, 0.374607, -0.927184, 0.719340, -0.406737],
            [0.891007, -0.669131, 0.358368, -0.933580, 0.743145, -0.453990],
            [0.866025, -0.642788, 0.342020, -0.939693, 0.766044, -0.500000],
            [0.838671, -0.615661, 0.325568, -0.945519, 0.788011, -0.544639],
            [0.809017, -0.587785, 0.309017, -0.951057, 0.809017, -0.587785],
            [0.777146, -0.559193, 0.292372, -0.956305, 0.829038, -0.629320],
            [0.743145, -0.529919, 0.275637, -0.961262, 0.848048, -0.669131],
            [0.707107, -0.500000, 0.258819, -0.965926, 0.866025, -0.707107],
            [0.669131, -0.469472, 0.241922, -0.970296, 0.882948, -0.743145],
            [0.629320, -0.438371, 0.224951, -0.974370, 0.898794, -0.777146],
            [0.587785, -0.406737, 0.207912, -0.978148, 0.913545, -0.809017],
            [0.544639, -0.374607, 0.190809, -0.981627, 0.927184, -0.838671],
            [0.500000, -0.342020, 0.173648, -0.984808, 0.939693, -0.866025],
            [0.453990, -0.309017, 0.156434, -0.987688, 0.951057, -0.891007],
            [0.406737, -0.275637, 0.139173, -0.990268, 0.961262, -0.913545],
            [0.358368, -0.241922, 0.121869, -0.992546, 0.970296, -0.933580],
            [0.309017, -0.207912, 0.104528, -0.994522, 0.978148, -0.951057],
            [0.258819, -0.173648, 0.087156, -0.996195, 0.984808, -0.965926],
            [0.207912, -0.139173, 0.069756, -0.997564, 0.990268, -0.978148],
            [0.156434, -0.104528, 0.052336, -0.998630, 0.994522, -0.987688],
            [0.104528, -0.069756, 0.034899, -0.999391, 0.997564, -0.994522],
            [0.052336, -0.034899, 0.017452, -0.999848, 0.999391, -0.998630],
            [0.000000, -0.000000, 0.000000, -1.000000, 1.000000, -1.000000],
            [-0.052336, 0.034899, -0.017452, -0.999848, 0.999391, -0.998630],
            [-0.104528, 0.069756, -0.034899, -0.999391, 0.997564, -0.994522],
            [-0.156434, 0.104528, -0.052336, -0.998630, 0.994522, -0.987688],
            [-0.207912, 0.139173, -0.069756, -0.997564, 0.990268, -0.978148],
            [-0.258819, 0.173648, -0.087156, -0.996195, 0.984808, -0.965926],
            [-0.309017, 0.207912, -0.104528, -0.994522, 0.978148, -0.951057],
            [-0.358368, 0.241922, -0.121869, -0.992546, 0.970296, -0.933580],
            [-0.406737, 0.275637, -0.139173, -0.990268, 0.961262, -0.913545],
            [-0.453990, 0.309017, -0.156434, -0.987688, 0.951057, -0.891007],
            [-0.500000, 0.342020, -0.173648, -0.984808, 0.939693, -0.866025],
            [-0.544639, 0.374607, -0.190809, -0.981627, 0.927184, -0.838671],
            [-0.587785, 0.406737, -0.207912, -0.978148, 0.913545, -0.809017],
            [-0.629320, 0.438371, -0.224951, -0.974370, 0.898794, -0.777146],
            [-0.669131, 0.469472, -0.241922, -0.970296, 0.882948, -0.743145],
            [-0.707107, 0.500000, -0.258819, -0.965926, 0.866025, -0.707107],
            [-0.743145, 0.529919, -0.275637, -0.961262, 0.848048, -0.669131],
            [-0.777146, 0.559193, -0.292372, -0.956305, 0.829038, -0.629320],
            [-0.809017, 0.587785, -0.309017, -0.951057, 0.809017, -0.587785],
            [-0.838671, 0.615661, -0.325568, -0.945519, 0.788011, -0.544639],
            [-0.866025, 0.642788, -0.342020, -0.939693, 0.766044, -0.500000],
            [-0.891007, 0.669131, -0.358368, -0.933580, 0.743145, -0.453990],
            [-0.913545, 0.694658, -0.374607, -0.927184, 0.719340, -0.406737],
            [-0.933580, 0.719340, -0.390731, -0.920505, 0.694658, -0.358368],
            [-0.951057, 0.743145, -0.406737, -0.913545, 0.669131, -0.309017],
            [-0.965926, 0.766044, -0.422618, -0.906308, 0.642788, -0.258819],
            [-0.978148, 0.788011, -0.438371, -0.898794, 0.615661, -0.207912],
            [-0.987688, 0.809017, -0.453990, -0.891007, 0.587785, -0.156434],
            [-0.994522, 0.829038, -0.469472, -0.882948, 0.559193, -0.104528],
            [-0.998630, 0.848048, -0.484810, -0.874620, 0.529919, -0.052336],
            [-1.000000, 0.866025, -0.500000, -0.866025, 0.500000, 0.000000],
            [-0.998630, 0.882948, -0.515038, -0.857167, 0.469472, 0.052336],
            [-0.994522, 0.898794, -0.529919, -0.848048, 0.438371, 0.104528],
            [-0.987688, 0.913545, -0.544639, -0.838671, 0.406737, 0.156434],
            [-0.978148, 0.927184, -0.559193, -0.829038, 0.374607, 0.207912],
            [-0.965926, 0.939693, -0.573576, -0.819152, 0.342020, 0.258819],
            [-0.951057, 0.951057, -0.587785, -0.809017, 0.309017, 0.309017],
            [-0.933580, 0.961262, -0.601815, -0.798636, 0.275637, 0.358368],
            [-0.913545, 0.970296, -0.615661, -0.788011, 0.241922, 0.406737],
            [-0.891007, 0.978148, -0.629320, -0.777146, 0.207912, 0.453990],
            [-0.866025, 0.984808, -0.642788, -0.766044, 0.173648, 0.500000],
            [-0.838671, 0.990268, -0.656059, -0.754710, 0.139173, 0.544639],
            [-0.809017, 0.994522, -0.669131, -0.743145, 0.104528, 0.587785],
            [-0.777146, 0.997564, -0.681998, -0.731354, 0.069756, 0.629320],
            [-0.743145, 0.999391, -0.694658, -0.719340, 0.034899, 0.669131],
            [-0.707107, 1.000000, -0.707107, -0.707107, 0.000000, 0.707107],
            [-0.669131, 0.999391, -0.719340, -0.694658, -0.034899, 0.743145],
            [-0.629320, 0.997564, -0.731354, -0.681998, -0.069756, 0.777146],
            [-0.587785, 0.994522, -0.743145, -0.669131, -0.104528, 0.809017],
            [-0.544639, 0.990268, -0.754710, -0.656059, -0.139173, 0.838671],
            [-0.500000, 0.984808, -0.766044, -0.642788, -0.173648, 0.866025],
            [-0.453990, 0.978148, -0.777146, -0.629320, -0.207912, 0.891007],
            [-0.406737, 0.970296, -0.788011, -0.615661, -0.241922, 0.913545],
            [-0.358368, 0.961262, -0.798636, -0.601815, -0.275637, 0.933580],
            [-0.309017, 0.951057, -0.809017, -0.587785, -0.309017, 0.951057],
            [-0.258819, 0.939693, -0.819152, -0.573576, -0.342020, 0.965926],
            [-0.207912, 0.927184, -0.829038, -0.559193, -0.374607, 0.978148],
            [-0.156434, 0.913545, -0.838671, -0.544639, -0.406737, 0.987688],
            [-0.104528, 0.898794, -0.848048, -0.529919, -0.438371, 0.994522],
            [-0.052336, 0.882948, -0.857167, -0.515038, -0.469472, 0.998630],
            [-0.000000, 0.866025, -0.866025, -0.500000, -0.500000, 1.000000],
            [0.052336, 0.848048, -0.874620, -0.484810, -0.529919, 0.998630],
            [0.104528, 0.829038, -0.882948, -0.469472, -0.559193, 0.994522],
            [0.156434, 0.809017, -0.891007, -0.453990, -0.587785, 0.987688],
            [0.207912, 0.788011, -0.898794, -0.438371, -0.615661, 0.978148],
            [0.258819, 0.766044, -0.906308, -0.422618, -0.642788, 0.965926],
            [0.309017, 0.743145, -0.913545, -0.406737, -0.669131, 0.951057],
            [0.358368, 0.719340, -0.920505, -0.390731, -0.694658, 0.933580],
            [0.406737, 0.694658, -0.927184, -0.374607, -0.719340, 0.913545],
            [0.453990, 0.669131, -0.933580, -0.358368, -0.743145, 0.891007],
            [0.500000, 0.642788, -0.939693, -0.342020, -0.766044, 0.866025],
            [0.544639, 0.615661, -0.945519, -0.325568, -0.788011, 0.838671],
            [0.587785, 0.587785, -0.951057, -0.309017, -0.809017, 0.809017],
            [0.629320, 0.559193, -0.956305, -0.292372, -0.829038, 0.777146],
            [0.669131, 0.529919, -0.961262, -0.275637, -0.848048, 0.743145],
            [0.707107, 0.500000, -0.965926, -0.258819, -0.866025, 0.707107],
            [0.743145, 0.469472, -0.970296, -0.241922, -0.882948, 0.669131],
            [0.777146, 0.438371, -0.974370, -0.224951, -0.898794, 0.629320],
            [0.809017, 0.406737, -0.978148, -0.207912, -0.913545, 0.587785],
            [0.838671, 0.374607, -0.981627, -0.190809, -0.927184, 0.544639],
            [0.866025, 0.342020, -0.984808, -0.173648, -0.939693, 0.500000],
            [0.891007, 0.309017, -0.987688, -0.156434, -0.951057, 0.453990],
            [0.913545, 0.275637, -0.990268, -0.139173, -0.961262, 0.406737],
            [0.933580, 0.241922, -0.992546, -0.121869, -0.970296, 0.358368],
            [0.951057, 0.207912, -0.994522, -0.104528, -0.978148, 0.309017],
            [0.965926, 0.173648, -0.996195, -0.087156, -0.984808, 0.258819],
            [0.978148, 0.139173, -0.997564, -0.069756, -0.990268, 0.207912],
            [0.987688, 0.104528, -0.998630, -0.052336, -0.994522, 0.156434],
            [0.994522, 0.069756, -0.999391, -0.034899, -0.997564, 0.104528],
            [0.998630, 0.034899, -0.999848, -0.017452, -0.999391, 0.052336],
            [1.000000, 0.000000, -1.000000, -0.000000, -1.000000, 0.000000],
            [0.998630, -0.034899, -0.999848, 0.017452, -0.999391, -0.052336],
            [0.994522, -0.069756, -0.999391, 0.034899, -0.997564, -0.104528],
            [0.987688, -0.104528, -0.998630, 0.052336, -0.994522, -0.156434],
            [0.978148, -0.139173, -0.997564, 0.069756, -0.990268, -0.207912],
            [0.965926, -0.173648, -0.996195, 0.087156, -0.984808, -0.258819],
            [0.951057, -0.207912, -0.994522, 0.104528, -0.978148, -0.309017],
            [0.933580, -0.241922, -0.992546, 0.121869, -0.970296, -0.358368],
            [0.913545, -0.275637, -0.990268, 0.139173, -0.961262, -0.406737],
            [0.891007, -0.309017, -0.987688, 0.156434, -0.951057, -0.453990],
            [0.866025, -0.342020, -0.984808, 0.173648, -0.939693, -0.500000],
            [0.838671, -0.374607, -0.981627, 0.190809, -0.927184, -0.544639],
            [0.809017, -0.406737, -0.978148, 0.207912, -0.913545, -0.587785],
            [0.777146, -0.438371, -0.974370, 0.224951, -0.898794, -0.629320],
            [0.743145, -0.469472, -0.970296, 0.241922, -0.882948, -0.669131],
            [0.707107, -0.500000, -0.965926, 0.258819, -0.866025, -0.707107],
            [0.669131, -0.529919, -0.961262, 0.275637, -0.848048, -0.743145],
            [0.629320, -0.559193, -0.956305, 0.292372, -0.829038, -0.777146],
            [0.587785, -0.587785, -0.951057, 0.309017, -0.809017, -0.809017],
            [0.544639, -0.615661, -0.945519, 0.325568, -0.788011, -0.838671],
            [0.500000, -0.642788, -0.939693, 0.342020, -0.766044, -0.866025],
            [0.453990, -0.669131, -0.933580, 0.358368, -0.743145, -0.891007],
            [0.406737, -0.694658, -0.927184, 0.374607, -0.719340, -0.913545],
            [0.358368, -0.719340, -0.920505, 0.390731, -0.694658, -0.933580],
            [0.309017, -0.743145, -0.913545, 0.406737, -0.669131, -0.951057],
            [0.258819, -0.766044, -0.906308, 0.422618, -0.642788, -0.965926],
            [0.207912, -0.788011, -0.898794, 0.438371, -0.615661, -0.978148],
            [0.156434, -0.809017, -0.891007, 0.453990, -0.587785, -0.987688],
            [0.104528, -0.829038, -0.882948, 0.469472, -0.559193, -0.994522],
            [0.052336, -0.848048, -0.874620, 0.484810, -0.529919, -0.998630],
            [0.000000, -0.866025, -0.866025, 0.500000, -0.500000, -1.000000],
            [-0.052336, -0.882948, -0.857167, 0.515038, -0.469472, -0.998630],
            [-0.104528, -0.898794, -0.848048, 0.529919, -0.438371, -0.994522],
            [-0.156434, -0.913545, -0.838671, 0.544639, -0.406737, -0.987688],
            [-0.207912, -0.927184, -0.829038, 0.559193, -0.374607, -0.978148],
            [-0.258819, -0.939693, -0.819152, 0.573576, -0.342020, -0.965926],
            [-0.309017, -0.951057, -0.809017, 0.587785, -0.309017, -0.951057],
            [-0.358368, -0.961262, -0.798636, 0.601815, -0.275637, -0.933580],
            [-0.406737, -0.970296, -0.788011, 0.615661, -0.241922, -0.913545],
            [-0.453990, -0.978148, -0.777146, 0.629320, -0.207912, -0.891007],
            [-0.500000, -0.984808, -0.766044, 0.642788, -0.173648, -0.866025],
            [-0.544639, -0.990268, -0.754710, 0.656059, -0.139173, -0.838671],
            [-0.587785, -0.994522, -0.743145, 0.669131, -0.104528, -0.809017],
            [-0.629320, -0.997564, -0.731354, 0.681998, -0.069756, -0.777146],
            [-0.669131, -0.999391, -0.719340, 0.694658, -0.034899, -0.743145],
            [-0.707107, -1.000000, -0.707107, 0.707107, -0.000000, -0.707107],
            [-0.743145, -0.999391, -0.694658, 0.719340, 0.034899, -0.669131],
            [-0.777146, -0.997564, -0.681998, 0.731354, 0.069756, -0.629320],
            [-0.809017, -0.994522, -0.669131, 0.743145, 0.104528, -0.587785],
            [-0.838671, -0.990268, -0.656059, 0.754710, 0.139173, -0.544639],
            [-0.866025, -0.984808, -0.642788, 0.766044, 0.173648, -0.500000],
            [-0.891007, -0.978148, -0.629320, 0.777146, 0.207912, -0.453990],
            [-0.913545, -0.970296, -0.615661, 0.788011, 0.241922, -0.406737],
            [-0.933580, -0.961262, -0.601815, 0.798636, 0.275637, -0.358368],
            [-0.951057, -0.951057, -0.587785, 0.809017, 0.309017, -0.309017],
            [-0.965926, -0.939693, -0.573576, 0.819152, 0.342020, -0.258819],
            [-0.978148, -0.927184, -0.559193, 0.829038, 0.374607, -0.207912],
            [-0.987688, -0.913545, -0.544639, 0.838671, 0.406737, -0.156434],
            [-0.994522, -0.898794, -0.529919, 0.848048, 0.438371, -0.104528],
            [-0.998630, -0.882948, -0.515038, 0.857167, 0.469472, -0.052336],
            [-1.000000, -0.866025, -0.500000, 0.866025, 0.500000, -0.000000],
            [-0.998630, -0.848048, -0.484810, 0.874620, 0.529919, 0.052336],
            [-0.994522, -0.829038, -0.469472, 0.882948, 0.559193, 0.104528],
            [-0.987688, -0.809017, -0.453990, 0.891007, 0.587785, 0.156434],
            [-0.978148, -0.788011, -0.438371, 0.898794, 0.615661, 0.207912],
            [-0.965926, -0.766044, -0.422618, 0.906308, 0.642788, 0.258819],
            [-0.951057, -0.743145, -0.406737, 0.913545, 0.669131, 0.309017],
            [-0.933580, -0.719340, -0.390731, 0.920505, 0.694658, 0.358368],
            [-0.913545, -0.694658, -0.374607, 0.927184, 0.719340, 0.406737],
            [-0.891007, -0.669131, -0.358368, 0.933580, 0.743145, 0.453990],
            [-0.866025, -0.642788, -0.342020, 0.939693, 0.766044, 0.500000],
            [-0.838671, -0.615661, -0.325568, 0.945519, 0.788011, 0.544639],
            [-0.809017, -0.587785, -0.309017, 0.951057, 0.809017, 0.587785],
            [-0.777146, -0.559193, -0.292372, 0.956305, 0.829038, 0.629320],
            [-0.743145, -0.529919, -0.275637, 0.961262, 0.848048, 0.669131],
            [-0.707107, -0.500000, -0.258819, 0.965926, 0.866025, 0.707107],
            [-0.669131, -0.469472, -0.241922, 0.970296, 0.882948, 0.743145],
            [-0.629320, -0.438371, -0.224951, 0.974370, 0.898794, 0.777146],
            [-0.587785, -0.406737, -0.207912, 0.978148, 0.913545, 0.809017],
            [-0.544639, -0.374607, -0.190809, 0.981627, 0.927184, 0.838671],
            [-0.500000, -0.342020, -0.173648, 0.984808, 0.939693, 0.866025],
            [-0.453990, -0.309017, -0.156434, 0.987688, 0.951057, 0.891007],
            [-0.406737, -0.275637, -0.139173, 0.990268, 0.961262, 0.913545],
            [-0.358368, -0.241922, -0.121869, 0.992546, 0.970296, 0.933580],
            [-0.309017, -0.207912, -0.104528, 0.994522, 0.978148, 0.951057],
            [-0.258819, -0.173648, -0.087156, 0.996195, 0.984808, 0.965926],
            [-0.207912, -0.139173, -0.069756, 0.997564, 0.990268, 0.978148],
            [-0.156434, -0.104528, -0.052336, 0.998630, 0.994522, 0.987688],
            [-0.104528, -0.069756, -0.034899, 0.999391, 0.997564, 0.994522],
            [-0.052336, -0.034899, -0.017452, 0.999848, 0.999391, 0.998630],
        ],
        [
            [-1.000000, -0.000000, 1.000000, -0.000000, 0.000000,
                -1.000000, -0.000000, 0.000000, -0.000000],
            [-0.999848, 0.017452, 0.999543, -0.030224, 0.000264,
                -0.999086, 0.042733, -0.000590, 0.000004],
            [-0.999391, 0.034899, 0.998173, -0.060411, 0.001055,
                -0.996348, 0.085356, -0.002357, 0.000034],
            [-0.998630, 0.052336, 0.995891, -0.090524, 0.002372,
                -0.991791, 0.127757, -0.005297, 0.000113],
            [-0.997564, 0.069756, 0.992701, -0.120527, 0.004214,
                -0.985429, 0.169828, -0.009400, 0.000268],
            [-0.996195, 0.087156, 0.988606, -0.150384, 0.006578,
                -0.977277, 0.211460, -0.014654, 0.000523],
            [-0.994522, 0.104528, 0.983611, -0.180057, 0.009462,
                -0.967356, 0.252544, -0.021043, 0.000903],
            [-0.992546, 0.121869, 0.977722, -0.209511, 0.012862,
                -0.955693, 0.292976, -0.028547, 0.001431],
            [-0.990268, 0.139173, 0.970946, -0.238709, 0.016774,
                -0.942316, 0.332649, -0.037143, 0.002131],
            [-0.987688, 0.156434, 0.963292, -0.267617, 0.021193,
                -0.927262, 0.371463, -0.046806, 0.003026],
            [-0.984808, 0.173648, 0.954769, -0.296198, 0.026114,
                -0.910569, 0.409317, -0.057505, 0.004140],
            [-0.981627, 0.190809, 0.945388, -0.324419, 0.031530,
                -0.892279, 0.446114, -0.069209, 0.005492],
            [-0.978148, 0.207912, 0.935159, -0.352244, 0.037436,
                -0.872441, 0.481759, -0.081880, 0.007105],
            [-0.974370, 0.224951, 0.924096, -0.379641, 0.043823,
                -0.851105, 0.516162, -0.095481, 0.008999],
            [-0.970296, 0.241922, 0.912211, -0.406574, 0.050685,
                -0.828326, 0.549233, -0.109969, 0.011193],
            [-0.965926, 0.258819, 0.899519, -0.433013, 0.058013,
                -0.804164, 0.580889, -0.125300, 0.013707],
            [-0.961262, 0.275637, 0.886036, -0.458924, 0.065797,
                -0.778680, 0.611050, -0.141427, 0.016556],
            [-0.956305, 0.292372, 0.871778, -0.484275, 0.074029,
                -0.751940, 0.639639, -0.158301, 0.019758],
            [-0.951057, 0.309017, 0.856763, -0.509037, 0.082698,
                -0.724012, 0.666583, -0.175868, 0.023329],
            [-0.945519, 0.325568, 0.841008, -0.533178, 0.091794,
                -0.694969, 0.691816, -0.194075, 0.027281],
            [-0.939693, 0.342020, 0.824533, -0.556670, 0.101306,
                -0.664885, 0.715274, -0.212865, 0.031630],
            [-0.933580, 0.358368, 0.807359, -0.579484, 0.111222,
                -0.633837, 0.736898, -0.232180, 0.036385],
            [-0.927184, 0.374607, 0.789505, -0.601592, 0.121529,
                -0.601904, 0.756637, -0.251960, 0.041559],
            [-0.920505, 0.390731, 0.770994, -0.622967, 0.132217,
                -0.569169, 0.774442, -0.272143, 0.047160],
            [-0.913545, 0.406737, 0.751848, -0.643582, 0.143271,
                -0.535715, 0.790270, -0.292666, 0.053196],
            [-0.906308, 0.422618, 0.732091, -0.663414, 0.154678,
                -0.501627, 0.804083, -0.313464, 0.059674],
            [-0.898794, 0.438371, 0.711746, -0.682437, 0.166423,
                -0.466993, 0.815850, -0.334472, 0.066599],
            [-0.891007, 0.453990, 0.690839, -0.700629, 0.178494,
                -0.431899, 0.825544, -0.355623, 0.073974],
            [-0.882948, 0.469472, 0.669395, -0.717968, 0.190875,
                -0.396436, 0.833145, -0.376851, 0.081803],
            [-0.874620, 0.484810, 0.647439, -0.734431, 0.203551,
                -0.360692, 0.838638, -0.398086, 0.090085],
            [-0.866025, 0.500000, 0.625000, -0.750000, 0.216506,
                -0.324760, 0.842012, -0.419263, 0.098821],
            [-0.857167, 0.515038, 0.602104, -0.764655, 0.229726,
                -0.288728, 0.843265, -0.440311, 0.108009],
            [-0.848048, 0.529919, 0.578778, -0.778378, 0.243192,
                -0.252688, 0.842399, -0.461164, 0.117644],
            [-0.838671, 0.544639, 0.555052, -0.791154, 0.256891,
                -0.216730, 0.839422, -0.481753, 0.127722],
            [-0.829038, 0.559193, 0.530955, -0.802965, 0.270803,
                -0.180944, 0.834347, -0.502011, 0.138237],
            [-0.819152, 0.573576, 0.506515, -0.813798, 0.284914,
                -0.145420, 0.827194, -0.521871, 0.149181],
            [-0.809017, 0.587785, 0.481763, -0.823639, 0.299204,
                -0.110246, 0.817987, -0.541266, 0.160545],
            [-0.798636, 0.601815, 0.456728, -0.832477, 0.313658,
                -0.075508, 0.806757, -0.560132, 0.172317],
            [-0.788011, 0.615661, 0.431441, -0.840301, 0.328257,
                -0.041294, 0.793541, -0.578405, 0.184487],
            [-0.777146, 0.629320, 0.405934, -0.847101, 0.342984,
                -0.007686, 0.778379, -0.596021, 0.197040],
            [-0.766044, 0.642788, 0.380236, -0.852869, 0.357821,
                0.025233, 0.761319, -0.612921, 0.209963],
            [-0.754710, 0.656059, 0.354380, -0.857597, 0.372749,
                0.057383, 0.742412, -0.629044, 0.223238],
            [-0.743145, 0.669131, 0.328396, -0.861281, 0.387751,
                0.088686, 0.721714, -0.644334, 0.236850],
            [-0.731354, 0.681998, 0.302317, -0.863916, 0.402807,
                0.119068, 0.699288, -0.658734, 0.250778],
            [-0.719340, 0.694658, 0.276175, -0.865498, 0.417901,
                0.148454, 0.675199, -0.672190, 0.265005],
            [-0.707107, 0.707107, 0.250000, -0.866025, 0.433013,
                0.176777, 0.649519, -0.684653, 0.279508],
            [-0.694658, 0.719340, 0.223825, -0.865498, 0.448125,
                0.203969, 0.622322, -0.696073, 0.294267],
            [-0.681998, 0.731354, 0.197683, -0.863916, 0.463218,
                0.229967, 0.593688, -0.706405, 0.309259],
            [-0.669131, 0.743145, 0.171604, -0.861281, 0.478275,
                0.254712, 0.563700, -0.715605, 0.324459],
            [-0.656059, 0.754710, 0.145620, -0.857597, 0.493276,
                0.278147, 0.532443, -0.723633, 0.339844],
            [-0.642788, 0.766044, 0.119764, -0.852869, 0.508205,
                0.300221, 0.500009, -0.730451, 0.355387],
            [-0.629320, 0.777146, 0.094066, -0.847101, 0.523041,
                0.320884, 0.466490, -0.736025, 0.371063],
            [-0.615661, 0.788011, 0.068559, -0.840301, 0.537768,
                0.340093, 0.431982, -0.740324, 0.386845],
            [-0.601815, 0.798636, 0.043272, -0.832477, 0.552367,
                0.357807, 0.396584, -0.743320, 0.402704],
            [-0.587785, 0.809017, 0.018237, -0.823639, 0.566821,
                0.373991, 0.360397, -0.744989, 0.418613],
            [-0.573576, 0.819152, -0.006515, -0.813798, 0.581112,
                0.388612, 0.323524, -0.745308, 0.434544],
            [-0.559193, 0.829038, -0.030955, -0.802965, 0.595222,
                0.401645, 0.286069, -0.744262, 0.450467],
            [-0.544639, 0.838671, -0.055052, -0.791154, 0.609135,
                0.413066, 0.248140, -0.741835, 0.466352],
            [-0.529919, 0.848048, -0.078778, -0.778378, 0.622833,
                0.422856, 0.209843, -0.738017, 0.482171],
            [-0.515038, 0.857167, -0.102104, -0.764655, 0.636300,
                0.431004, 0.171288, -0.732801, 0.497894],
            [-0.500000, 0.866025, -0.125000, -0.750000, 0.649519,
                0.437500, 0.132583, -0.726184, 0.513490],
            [-0.484810, 0.874620, -0.147439, -0.734431, 0.662474,
                0.442340, 0.093837, -0.718167, 0.528929],
            [-0.469472, 0.882948, -0.169395, -0.717968, 0.675150,
                0.445524, 0.055160, -0.708753, 0.544183],
            [-0.453990, 0.891007, -0.190839, -0.700629, 0.687531,
                0.447059, 0.016662, -0.697950, 0.559220],
            [-0.438371, 0.898794, -0.211746, -0.682437, 0.699602,
                0.446953, -0.021550, -0.685769, 0.574011],
            [-0.422618, 0.906308, -0.232091, -0.663414, 0.711348,
                0.445222, -0.059368, -0.672226, 0.588528],
            [-0.406737, 0.913545, -0.251848, -0.643582, 0.722755,
                0.441884, -0.096684, -0.657339, 0.602741],
            [-0.390731, 0.920505, -0.270994, -0.622967, 0.733809,
                0.436964, -0.133395, -0.641130, 0.616621],
            [-0.374607, 0.927184, -0.289505, -0.601592, 0.744496,
                0.430488, -0.169397, -0.623624, 0.630141],
            [-0.358368, 0.933580, -0.307359, -0.579484, 0.754804,
                0.422491, -0.204589, -0.604851, 0.643273],
            [-0.342020, 0.939693, -0.324533, -0.556670, 0.764720,
                0.413008, -0.238872, -0.584843, 0.655990],
            [-0.325568, 0.945519, -0.341008, -0.533178, 0.774231,
                0.402081, -0.272150, -0.563635, 0.668267],
            [-0.309017, 0.951057, -0.356763, -0.509037, 0.783327,
                0.389754, -0.304329, -0.541266, 0.680078],
            [-0.292372, 0.956305, -0.371778, -0.484275, 0.791997,
                0.376077, -0.335319, -0.517778, 0.691399],
            [-0.275637, 0.961262, -0.386036, -0.458924, 0.800228,
                0.361102, -0.365034, -0.493216, 0.702207],
            [-0.258819, 0.965926, -0.399519, -0.433013, 0.808013,
                0.344885, -0.393389, -0.467627, 0.712478],
            [-0.241922, 0.970296, -0.412211, -0.406574, 0.815340,
                0.327486, -0.420306, -0.441061, 0.722191],
            [-0.224951, 0.974370, -0.424096, -0.379641, 0.822202,
                0.308969, -0.445709, -0.413572, 0.731327],
            [-0.207912, 0.978148, -0.435159, -0.352244, 0.828589,
                0.289399, -0.469527, -0.385215, 0.739866],
            [-0.190809, 0.981627, -0.445388, -0.324419, 0.834495,
                0.268846, -0.491693, -0.356047, 0.747790],
            [-0.173648, 0.984808, -0.454769, -0.296198, 0.839912,
                0.247382, -0.512145, -0.326129, 0.755082],
            [-0.156434, 0.987688, -0.463292, -0.267617, 0.844832,
                0.225081, -0.530827, -0.295521, 0.761728],
            [-0.139173, 0.990268, -0.470946, -0.238709, 0.849251,
                0.202020, -0.547684, -0.264287, 0.767712],
            [-0.121869, 0.992546, -0.477722, -0.209511, 0.853163,
                0.178279, -0.562672, -0.232494, 0.773023],
            [-0.104528, 0.994522, -0.483611, -0.180057, 0.856563,
                0.153937, -0.575747, -0.200207, 0.777648],
            [-0.087156, 0.996195, -0.488606, -0.150384, 0.859447,
                0.129078, -0.586872, -0.167494, 0.781579],
            [-0.069756, 0.997564, -0.492701, -0.120527, 0.861811,
                0.103786, -0.596018, -0.134426, 0.784806],
            [-0.052336, 0.998630, -0.495891, -0.090524, 0.863653,
                0.078146, -0.603158, -0.101071, 0.787324],
            [-0.034899, 0.999391, -0.498173, -0.060411, 0.864971,
                0.052243, -0.608272, -0.067500, 0.789126],
            [-0.017452, 0.999848, -0.499543, -0.030224, 0.865762,
                0.026165, -0.611347, -0.033786, 0.790208],
            [0.000000, 1.000000, -0.500000, 0.000000, 0.866025,
                -0.000000, -0.612372, 0.000000, 0.790569],
            [0.017452, 0.999848, -0.499543, 0.030224, 0.865762,
                -0.026165, -0.611347, 0.033786, 0.790208],
            [0.034899, 0.999391, -0.498173, 0.060411, 0.864971,
                -0.052243, -0.608272, 0.067500, 0.789126],
            [0.052336, 0.998630, -0.495891, 0.090524, 0.863653,
                -0.078146, -0.603158, 0.101071, 0.787324],
            [0.069756, 0.997564, -0.492701, 0.120527, 0.861811,
                -0.103786, -0.596018, 0.134426, 0.784806],
            [0.087156, 0.996195, -0.488606, 0.150384, 0.859447,
                -0.129078, -0.586872, 0.167494, 0.781579],
            [0.104528, 0.994522, -0.483611, 0.180057, 0.856563,
                -0.153937, -0.575747, 0.200207, 0.777648],
            [0.121869, 0.992546, -0.477722, 0.209511, 0.853163,
                -0.178279, -0.562672, 0.232494, 0.773023],
            [0.139173, 0.990268, -0.470946, 0.238709, 0.849251,
                -0.202020, -0.547684, 0.264287, 0.767712],
            [0.156434, 0.987688, -0.463292, 0.267617, 0.844832,
                -0.225081, -0.530827, 0.295521, 0.761728],
            [0.173648, 0.984808, -0.454769, 0.296198, 0.839912,
                -0.247382, -0.512145, 0.326129, 0.755082],
            [0.190809, 0.981627, -0.445388, 0.324419, 0.834495,
                -0.268846, -0.491693, 0.356047, 0.747790],
            [0.207912, 0.978148, -0.435159, 0.352244, 0.828589,
                -0.289399, -0.469527, 0.385215, 0.739866],
            [0.224951, 0.974370, -0.424096, 0.379641, 0.822202,
                -0.308969, -0.445709, 0.413572, 0.731327],
            [0.241922, 0.970296, -0.412211, 0.406574, 0.815340,
                -0.327486, -0.420306, 0.441061, 0.722191],
            [0.258819, 0.965926, -0.399519, 0.433013, 0.808013,
                -0.344885, -0.393389, 0.467627, 0.712478],
            [0.275637, 0.961262, -0.386036, 0.458924, 0.800228,
                -0.361102, -0.365034, 0.493216, 0.702207],
            [0.292372, 0.956305, -0.371778, 0.484275, 0.791997,
                -0.376077, -0.335319, 0.517778, 0.691399],
            [0.309017, 0.951057, -0.356763, 0.509037, 0.783327,
                -0.389754, -0.304329, 0.541266, 0.680078],
            [0.325568, 0.945519, -0.341008, 0.533178, 0.774231,
                -0.402081, -0.272150, 0.563635, 0.668267],
            [0.342020, 0.939693, -0.324533, 0.556670, 0.764720,
                -0.413008, -0.238872, 0.584843, 0.655990],
            [0.358368, 0.933580, -0.307359, 0.579484, 0.754804,
                -0.422491, -0.204589, 0.604851, 0.643273],
            [0.374607, 0.927184, -0.289505, 0.601592, 0.744496,
                -0.430488, -0.169397, 0.623624, 0.630141],
            [0.390731, 0.920505, -0.270994, 0.622967, 0.733809,
                -0.436964, -0.133395, 0.641130, 0.616621],
            [0.406737, 0.913545, -0.251848, 0.643582, 0.722755,
                -0.441884, -0.096684, 0.657339, 0.602741],
            [0.422618, 0.906308, -0.232091, 0.663414, 0.711348,
                -0.445222, -0.059368, 0.672226, 0.588528],
            [0.438371, 0.898794, -0.211746, 0.682437, 0.699602,
                -0.446953, -0.021550, 0.685769, 0.574011],
            [0.453990, 0.891007, -0.190839, 0.700629, 0.687531,
                -0.447059, 0.016662, 0.697950, 0.559220],
            [0.469472, 0.882948, -0.169395, 0.717968, 0.675150,
                -0.445524, 0.055160, 0.708753, 0.544183],
            [0.484810, 0.874620, -0.147439, 0.734431, 0.662474,
                -0.442340, 0.093837, 0.718167, 0.528929],
            [0.500000, 0.866025, -0.125000, 0.750000, 0.649519,
                -0.437500, 0.132583, 0.726184, 0.513490],
            [0.515038, 0.857167, -0.102104, 0.764655, 0.636300,
                -0.431004, 0.171288, 0.732801, 0.497894],
            [0.529919, 0.848048, -0.078778, 0.778378, 0.622833,
                -0.422856, 0.209843, 0.738017, 0.482171],
            [0.544639, 0.838671, -0.055052, 0.791154, 0.609135,
                -0.413066, 0.248140, 0.741835, 0.466352],
            [0.559193, 0.829038, -0.030955, 0.802965, 0.595222,
                -0.401645, 0.286069, 0.744262, 0.450467],
            [0.573576, 0.819152, -0.006515, 0.813798, 0.581112,
                -0.388612, 0.323524, 0.745308, 0.434544],
            [0.587785, 0.809017, 0.018237, 0.823639, 0.566821,
                -0.373991, 0.360397, 0.744989, 0.418613],
            [0.601815, 0.798636, 0.043272, 0.832477, 0.552367,
                -0.357807, 0.396584, 0.743320, 0.402704],
            [0.615661, 0.788011, 0.068559, 0.840301, 0.537768,
                -0.340093, 0.431982, 0.740324, 0.386845],
            [0.629320, 0.777146, 0.094066, 0.847101, 0.523041,
                -0.320884, 0.466490, 0.736025, 0.371063],
            [0.642788, 0.766044, 0.119764, 0.852869, 0.508205,
                -0.300221, 0.500009, 0.730451, 0.355387],
            [0.656059, 0.754710, 0.145620, 0.857597, 0.493276,
                -0.278147, 0.532443, 0.723633, 0.339844],
            [0.669131, 0.743145, 0.171604, 0.861281, 0.478275,
                -0.254712, 0.563700, 0.715605, 0.324459],
            [0.681998, 0.731354, 0.197683, 0.863916, 0.463218,
                -0.229967, 0.593688, 0.706405, 0.309259],
            [0.694658, 0.719340, 0.223825, 0.865498, 0.448125,
                -0.203969, 0.622322, 0.696073, 0.294267],
            [0.707107, 0.707107, 0.250000, 0.866025, 0.433013,
                -0.176777, 0.649519, 0.684653, 0.279508],
            [0.719340, 0.694658, 0.276175, 0.865498, 0.417901,
                -0.148454, 0.675199, 0.672190, 0.265005],
            [0.731354, 0.681998, 0.302317, 0.863916, 0.402807,
                -0.119068, 0.699288, 0.658734, 0.250778],
            [0.743145, 0.669131, 0.328396, 0.861281, 0.387751,
                -0.088686, 0.721714, 0.644334, 0.236850],
            [0.754710, 0.656059, 0.354380, 0.857597, 0.372749,
                -0.057383, 0.742412, 0.629044, 0.223238],
            [0.766044, 0.642788, 0.380236, 0.852869, 0.357821,
                -0.025233, 0.761319, 0.612921, 0.209963],
            [0.777146, 0.629320, 0.405934, 0.847101, 0.342984,
                0.007686, 0.778379, 0.596021, 0.197040],
            [0.788011, 0.615661, 0.431441, 0.840301, 0.328257,
                0.041294, 0.793541, 0.578405, 0.184487],
            [0.798636, 0.601815, 0.456728, 0.832477, 0.313658,
                0.075508, 0.806757, 0.560132, 0.172317],
            [0.809017, 0.587785, 0.481763, 0.823639, 0.299204,
                0.110246, 0.817987, 0.541266, 0.160545],
            [0.819152, 0.573576, 0.506515, 0.813798, 0.284914,
                0.145420, 0.827194, 0.521871, 0.149181],
            [0.829038, 0.559193, 0.530955, 0.802965, 0.270803,
                0.180944, 0.834347, 0.502011, 0.138237],
            [0.838671, 0.544639, 0.555052, 0.791154, 0.256891,
                0.216730, 0.839422, 0.481753, 0.127722],
            [0.848048, 0.529919, 0.578778, 0.778378, 0.243192,
                0.252688, 0.842399, 0.461164, 0.117644],
            [0.857167, 0.515038, 0.602104, 0.764655, 0.229726,
                0.288728, 0.843265, 0.440311, 0.108009],
            [0.866025, 0.500000, 0.625000, 0.750000, 0.216506,
                0.324760, 0.842012, 0.419263, 0.098821],
            [0.874620, 0.484810, 0.647439, 0.734431, 0.203551,
                0.360692, 0.838638, 0.398086, 0.090085],
            [0.882948, 0.469472, 0.669395, 0.717968, 0.190875,
                0.396436, 0.833145, 0.376851, 0.081803],
            [0.891007, 0.453990, 0.690839, 0.700629, 0.178494,
                0.431899, 0.825544, 0.355623, 0.073974],
            [0.898794, 0.438371, 0.711746, 0.682437, 0.166423,
                0.466993, 0.815850, 0.334472, 0.066599],
            [0.906308, 0.422618, 0.732091, 0.663414, 0.154678,
                0.501627, 0.804083, 0.313464, 0.059674],
            [0.913545, 0.406737, 0.751848, 0.643582, 0.143271,
                0.535715, 0.790270, 0.292666, 0.053196],
            [0.920505, 0.390731, 0.770994, 0.622967, 0.132217,
                0.569169, 0.774442, 0.272143, 0.047160],
            [0.927184, 0.374607, 0.789505, 0.601592, 0.121529,
                0.601904, 0.756637, 0.251960, 0.041559],
            [0.933580, 0.358368, 0.807359, 0.579484, 0.111222,
                0.633837, 0.736898, 0.232180, 0.036385],
            [0.939693, 0.342020, 0.824533, 0.556670, 0.101306,
                0.664885, 0.715274, 0.212865, 0.031630],
            [0.945519, 0.325568, 0.841008, 0.533178, 0.091794,
                0.694969, 0.691816, 0.194075, 0.027281],
            [0.951057, 0.309017, 0.856763, 0.509037, 0.082698,
                0.724012, 0.666583, 0.175868, 0.023329],
            [0.956305, 0.292372, 0.871778, 0.484275, 0.074029,
                0.751940, 0.639639, 0.158301, 0.019758],
            [0.961262, 0.275637, 0.886036, 0.458924, 0.065797,
                0.778680, 0.611050, 0.141427, 0.016556],
            [0.965926, 0.258819, 0.899519, 0.433013, 0.058013,
                0.804164, 0.580889, 0.125300, 0.013707],
            [0.970296, 0.241922, 0.912211, 0.406574, 0.050685,
                0.828326, 0.549233, 0.109969, 0.011193],
            [0.974370, 0.224951, 0.924096, 0.379641, 0.043823,
                0.851105, 0.516162, 0.095481, 0.008999],
            [0.978148, 0.207912, 0.935159, 0.352244, 0.037436,
                0.872441, 0.481759, 0.081880, 0.007105],
            [0.981627, 0.190809, 0.945388, 0.324419, 0.031530,
                0.892279, 0.446114, 0.069209, 0.005492],
            [0.984808, 0.173648, 0.954769, 0.296198, 0.026114,
                0.910569, 0.409317, 0.057505, 0.004140],
            [0.987688, 0.156434, 0.963292, 0.267617, 0.021193,
                0.927262, 0.371463, 0.046806, 0.003026],
            [0.990268, 0.139173, 0.970946, 0.238709, 0.016774,
                0.942316, 0.332649, 0.037143, 0.002131],
            [0.992546, 0.121869, 0.977722, 0.209511, 0.012862,
                0.955693, 0.292976, 0.028547, 0.001431],
            [0.994522, 0.104528, 0.983611, 0.180057, 0.009462,
                0.967356, 0.252544, 0.021043, 0.000903],
            [0.996195, 0.087156, 0.988606, 0.150384, 0.006578,
                0.977277, 0.211460, 0.014654, 0.000523],
            [0.997564, 0.069756, 0.992701, 0.120527, 0.004214,
                0.985429, 0.169828, 0.009400, 0.000268],
            [0.998630, 0.052336, 0.995891, 0.090524, 0.002372,
                0.991791, 0.127757, 0.005297, 0.000113],
            [0.999391, 0.034899, 0.998173, 0.060411, 0.001055,
                0.996348, 0.085356, 0.002357, 0.000034],
            [0.999848, 0.017452, 0.999543, 0.030224, 0.000264,
                0.999086, 0.042733, 0.000590, 0.000004],
            [1.000000, -0.000000, 1.000000, -0.000000, 0.000000,
                1.000000, -0.000000, 0.000000, -0.000000],
        ],
    ];
    SPHERICAL_HARMONICS[0].length;
    SPHERICAL_HARMONICS[1].length;
    /**
     * The maximum allowed ambisonic order.
     */
    const SPHERICAL_HARMONICS_MAX_ORDER = SPHERICAL_HARMONICS[0][0].length / 2;
    /**
     * Pre-computed per-band weighting coefficients for producing energy-preserving
     * Max-Re sources.
     */
    const MAX_RE_WEIGHTS = [
        [1.000000, 1.000000, 1.000000, 1.000000],
        [1.000000, 1.000000, 1.000000, 1.000000],
        [1.000000, 1.000000, 1.000000, 1.000000],
        [1.000000, 1.000000, 1.000000, 1.000000],
        [1.000000, 1.000000, 1.000000, 1.000000],
        [1.000000, 1.000000, 1.000000, 1.000000],
        [1.000000, 1.000000, 1.000000, 1.000000],
        [1.000000, 1.000000, 1.000000, 1.000000],
        [1.000000, 1.000000, 1.000000, 1.000000],
        [1.000000, 1.000000, 1.000000, 1.000000],
        [1.000000, 1.000000, 1.000000, 1.000000],
        [1.000000, 1.000000, 1.000000, 1.000000],
        [1.000000, 1.000000, 1.000000, 1.000000],
        [1.000000, 1.000000, 1.000000, 1.000000],
        [1.000000, 1.000000, 1.000000, 1.000000],
        [1.000000, 1.000000, 1.000000, 1.000000],
        [1.000000, 1.000000, 1.000000, 1.000000],
        [1.000000, 1.000000, 1.000000, 1.000000],
        [1.000000, 1.000000, 1.000000, 1.000000],
        [1.000000, 1.000000, 1.000000, 1.000000],
        [1.000000, 1.000000, 1.000000, 1.000000],
        [1.000000, 1.000000, 1.000000, 1.000000],
        [1.000000, 1.000000, 1.000000, 1.000000],
        [1.000000, 1.000000, 1.000000, 1.000000],
        [1.000000, 1.000000, 1.000000, 1.000000],
        [1.000000, 1.000000, 1.000000, 1.000000],
        [1.000000, 1.000000, 1.000000, 1.000000],
        [1.000000, 1.000000, 1.000000, 1.000000],
        [1.000000, 1.000000, 1.000000, 1.000000],
        [1.000000, 1.000000, 1.000000, 1.000000],
        [1.003236, 1.002156, 0.999152, 0.990038],
        [1.032370, 1.021194, 0.990433, 0.898572],
        [1.062694, 1.040231, 0.979161, 0.799806],
        [1.093999, 1.058954, 0.964976, 0.693603],
        [1.126003, 1.077006, 0.947526, 0.579890],
        [1.158345, 1.093982, 0.926474, 0.458690],
        [1.190590, 1.109437, 0.901512, 0.330158],
        [1.222228, 1.122890, 0.872370, 0.194621],
        [1.252684, 1.133837, 0.838839, 0.052614],
        [1.281987, 1.142358, 0.801199, 0.000000],
        [1.312073, 1.150207, 0.760839, 0.000000],
        [1.343011, 1.157424, 0.717799, 0.000000],
        [1.374649, 1.163859, 0.671999, 0.000000],
        [1.406809, 1.169354, 0.623371, 0.000000],
        [1.439286, 1.173739, 0.571868, 0.000000],
        [1.471846, 1.176837, 0.517465, 0.000000],
        [1.504226, 1.178465, 0.460174, 0.000000],
        [1.536133, 1.178438, 0.400043, 0.000000],
        [1.567253, 1.176573, 0.337165, 0.000000],
        [1.597247, 1.172695, 0.271688, 0.000000],
        [1.625766, 1.166645, 0.203815, 0.000000],
        [1.652455, 1.158285, 0.133806, 0.000000],
        [1.676966, 1.147506, 0.061983, 0.000000],
        [1.699006, 1.134261, 0.000000, 0.000000],
        [1.720224, 1.119789, 0.000000, 0.000000],
        [1.741631, 1.104810, 0.000000, 0.000000],
        [1.763183, 1.089330, 0.000000, 0.000000],
        [1.784837, 1.073356, 0.000000, 0.000000],
        [1.806548, 1.056898, 0.000000, 0.000000],
        [1.828269, 1.039968, 0.000000, 0.000000],
        [1.849952, 1.022580, 0.000000, 0.000000],
        [1.871552, 1.004752, 0.000000, 0.000000],
        [1.893018, 0.986504, 0.000000, 0.000000],
        [1.914305, 0.967857, 0.000000, 0.000000],
        [1.935366, 0.948837, 0.000000, 0.000000],
        [1.956154, 0.929471, 0.000000, 0.000000],
        [1.976625, 0.909790, 0.000000, 0.000000],
        [1.996736, 0.889823, 0.000000, 0.000000],
        [2.016448, 0.869607, 0.000000, 0.000000],
        [2.035721, 0.849175, 0.000000, 0.000000],
        [2.054522, 0.828565, 0.000000, 0.000000],
        [2.072818, 0.807816, 0.000000, 0.000000],
        [2.090581, 0.786964, 0.000000, 0.000000],
        [2.107785, 0.766051, 0.000000, 0.000000],
        [2.124411, 0.745115, 0.000000, 0.000000],
        [2.140439, 0.724196, 0.000000, 0.000000],
        [2.155856, 0.703332, 0.000000, 0.000000],
        [2.170653, 0.682561, 0.000000, 0.000000],
        [2.184823, 0.661921, 0.000000, 0.000000],
        [2.198364, 0.641445, 0.000000, 0.000000],
        [2.211275, 0.621169, 0.000000, 0.000000],
        [2.223562, 0.601125, 0.000000, 0.000000],
        [2.235230, 0.581341, 0.000000, 0.000000],
        [2.246289, 0.561847, 0.000000, 0.000000],
        [2.256751, 0.542667, 0.000000, 0.000000],
        [2.266631, 0.523826, 0.000000, 0.000000],
        [2.275943, 0.505344, 0.000000, 0.000000],
        [2.284707, 0.487239, 0.000000, 0.000000],
        [2.292939, 0.469528, 0.000000, 0.000000],
        [2.300661, 0.452225, 0.000000, 0.000000],
        [2.307892, 0.435342, 0.000000, 0.000000],
        [2.314654, 0.418888, 0.000000, 0.000000],
        [2.320969, 0.402870, 0.000000, 0.000000],
        [2.326858, 0.387294, 0.000000, 0.000000],
        [2.332343, 0.372164, 0.000000, 0.000000],
        [2.337445, 0.357481, 0.000000, 0.000000],
        [2.342186, 0.343246, 0.000000, 0.000000],
        [2.346585, 0.329458, 0.000000, 0.000000],
        [2.350664, 0.316113, 0.000000, 0.000000],
        [2.354442, 0.303208, 0.000000, 0.000000],
        [2.357937, 0.290738, 0.000000, 0.000000],
        [2.361168, 0.278698, 0.000000, 0.000000],
        [2.364152, 0.267080, 0.000000, 0.000000],
        [2.366906, 0.255878, 0.000000, 0.000000],
        [2.369446, 0.245082, 0.000000, 0.000000],
        [2.371786, 0.234685, 0.000000, 0.000000],
        [2.373940, 0.224677, 0.000000, 0.000000],
        [2.375923, 0.215048, 0.000000, 0.000000],
        [2.377745, 0.205790, 0.000000, 0.000000],
        [2.379421, 0.196891, 0.000000, 0.000000],
        [2.380959, 0.188342, 0.000000, 0.000000],
        [2.382372, 0.180132, 0.000000, 0.000000],
        [2.383667, 0.172251, 0.000000, 0.000000],
        [2.384856, 0.164689, 0.000000, 0.000000],
        [2.385945, 0.157435, 0.000000, 0.000000],
        [2.386943, 0.150479, 0.000000, 0.000000],
        [2.387857, 0.143811, 0.000000, 0.000000],
        [2.388694, 0.137421, 0.000000, 0.000000],
        [2.389460, 0.131299, 0.000000, 0.000000],
        [2.390160, 0.125435, 0.000000, 0.000000],
        [2.390801, 0.119820, 0.000000, 0.000000],
        [2.391386, 0.114445, 0.000000, 0.000000],
        [2.391921, 0.109300, 0.000000, 0.000000],
        [2.392410, 0.104376, 0.000000, 0.000000],
        [2.392857, 0.099666, 0.000000, 0.000000],
        [2.393265, 0.095160, 0.000000, 0.000000],
        [2.393637, 0.090851, 0.000000, 0.000000],
        [2.393977, 0.086731, 0.000000, 0.000000],
        [2.394288, 0.082791, 0.000000, 0.000000],
        [2.394571, 0.079025, 0.000000, 0.000000],
        [2.394829, 0.075426, 0.000000, 0.000000],
        [2.395064, 0.071986, 0.000000, 0.000000],
        [2.395279, 0.068699, 0.000000, 0.000000],
        [2.395475, 0.065558, 0.000000, 0.000000],
        [2.395653, 0.062558, 0.000000, 0.000000],
        [2.395816, 0.059693, 0.000000, 0.000000],
        [2.395964, 0.056955, 0.000000, 0.000000],
        [2.396099, 0.054341, 0.000000, 0.000000],
        [2.396222, 0.051845, 0.000000, 0.000000],
        [2.396334, 0.049462, 0.000000, 0.000000],
        [2.396436, 0.047186, 0.000000, 0.000000],
        [2.396529, 0.045013, 0.000000, 0.000000],
        [2.396613, 0.042939, 0.000000, 0.000000],
        [2.396691, 0.040959, 0.000000, 0.000000],
        [2.396761, 0.039069, 0.000000, 0.000000],
        [2.396825, 0.037266, 0.000000, 0.000000],
        [2.396883, 0.035544, 0.000000, 0.000000],
        [2.396936, 0.033901, 0.000000, 0.000000],
        [2.396984, 0.032334, 0.000000, 0.000000],
        [2.397028, 0.030838, 0.000000, 0.000000],
        [2.397068, 0.029410, 0.000000, 0.000000],
        [2.397104, 0.028048, 0.000000, 0.000000],
        [2.397137, 0.026749, 0.000000, 0.000000],
        [2.397167, 0.025509, 0.000000, 0.000000],
        [2.397194, 0.024326, 0.000000, 0.000000],
        [2.397219, 0.023198, 0.000000, 0.000000],
        [2.397242, 0.022122, 0.000000, 0.000000],
        [2.397262, 0.021095, 0.000000, 0.000000],
        [2.397281, 0.020116, 0.000000, 0.000000],
        [2.397298, 0.019181, 0.000000, 0.000000],
        [2.397314, 0.018290, 0.000000, 0.000000],
        [2.397328, 0.017441, 0.000000, 0.000000],
        [2.397341, 0.016630, 0.000000, 0.000000],
        [2.397352, 0.015857, 0.000000, 0.000000],
        [2.397363, 0.015119, 0.000000, 0.000000],
        [2.397372, 0.014416, 0.000000, 0.000000],
        [2.397381, 0.013745, 0.000000, 0.000000],
        [2.397389, 0.013106, 0.000000, 0.000000],
        [2.397396, 0.012496, 0.000000, 0.000000],
        [2.397403, 0.011914, 0.000000, 0.000000],
        [2.397409, 0.011360, 0.000000, 0.000000],
        [2.397414, 0.010831, 0.000000, 0.000000],
        [2.397419, 0.010326, 0.000000, 0.000000],
        [2.397424, 0.009845, 0.000000, 0.000000],
        [2.397428, 0.009387, 0.000000, 0.000000],
        [2.397432, 0.008949, 0.000000, 0.000000],
        [2.397435, 0.008532, 0.000000, 0.000000],
        [2.397438, 0.008135, 0.000000, 0.000000],
        [2.397441, 0.007755, 0.000000, 0.000000],
        [2.397443, 0.007394, 0.000000, 0.000000],
        [2.397446, 0.007049, 0.000000, 0.000000],
        [2.397448, 0.006721, 0.000000, 0.000000],
        [2.397450, 0.006407, 0.000000, 0.000000],
        [2.397451, 0.006108, 0.000000, 0.000000],
        [2.397453, 0.005824, 0.000000, 0.000000],
        [2.397454, 0.005552, 0.000000, 0.000000],
        [2.397456, 0.005293, 0.000000, 0.000000],
        [2.397457, 0.005046, 0.000000, 0.000000],
        [2.397458, 0.004811, 0.000000, 0.000000],
        [2.397459, 0.004586, 0.000000, 0.000000],
        [2.397460, 0.004372, 0.000000, 0.000000],
        [2.397461, 0.004168, 0.000000, 0.000000],
        [2.397461, 0.003974, 0.000000, 0.000000],
        [2.397462, 0.003788, 0.000000, 0.000000],
        [2.397463, 0.003611, 0.000000, 0.000000],
        [2.397463, 0.003443, 0.000000, 0.000000],
        [2.397464, 0.003282, 0.000000, 0.000000],
        [2.397464, 0.003129, 0.000000, 0.000000],
        [2.397465, 0.002983, 0.000000, 0.000000],
        [2.397465, 0.002844, 0.000000, 0.000000],
        [2.397465, 0.002711, 0.000000, 0.000000],
        [2.397466, 0.002584, 0.000000, 0.000000],
        [2.397466, 0.002464, 0.000000, 0.000000],
        [2.397466, 0.002349, 0.000000, 0.000000],
        [2.397466, 0.002239, 0.000000, 0.000000],
        [2.397467, 0.002135, 0.000000, 0.000000],
        [2.397467, 0.002035, 0.000000, 0.000000],
        [2.397467, 0.001940, 0.000000, 0.000000],
        [2.397467, 0.001849, 0.000000, 0.000000],
        [2.397467, 0.001763, 0.000000, 0.000000],
        [2.397467, 0.001681, 0.000000, 0.000000],
        [2.397468, 0.001602, 0.000000, 0.000000],
        [2.397468, 0.001527, 0.000000, 0.000000],
        [2.397468, 0.001456, 0.000000, 0.000000],
        [2.397468, 0.001388, 0.000000, 0.000000],
        [2.397468, 0.001323, 0.000000, 0.000000],
        [2.397468, 0.001261, 0.000000, 0.000000],
        [2.397468, 0.001202, 0.000000, 0.000000],
        [2.397468, 0.001146, 0.000000, 0.000000],
        [2.397468, 0.001093, 0.000000, 0.000000],
        [2.397468, 0.001042, 0.000000, 0.000000],
        [2.397468, 0.000993, 0.000000, 0.000000],
        [2.397468, 0.000947, 0.000000, 0.000000],
        [2.397468, 0.000902, 0.000000, 0.000000],
        [2.397468, 0.000860, 0.000000, 0.000000],
        [2.397468, 0.000820, 0.000000, 0.000000],
        [2.397469, 0.000782, 0.000000, 0.000000],
        [2.397469, 0.000745, 0.000000, 0.000000],
        [2.397469, 0.000710, 0.000000, 0.000000],
        [2.397469, 0.000677, 0.000000, 0.000000],
        [2.397469, 0.000646, 0.000000, 0.000000],
        [2.397469, 0.000616, 0.000000, 0.000000],
        [2.397469, 0.000587, 0.000000, 0.000000],
        [2.397469, 0.000559, 0.000000, 0.000000],
        [2.397469, 0.000533, 0.000000, 0.000000],
        [2.397469, 0.000508, 0.000000, 0.000000],
        [2.397469, 0.000485, 0.000000, 0.000000],
        [2.397469, 0.000462, 0.000000, 0.000000],
        [2.397469, 0.000440, 0.000000, 0.000000],
        [2.397469, 0.000420, 0.000000, 0.000000],
        [2.397469, 0.000400, 0.000000, 0.000000],
        [2.397469, 0.000381, 0.000000, 0.000000],
        [2.397469, 0.000364, 0.000000, 0.000000],
        [2.397469, 0.000347, 0.000000, 0.000000],
        [2.397469, 0.000330, 0.000000, 0.000000],
        [2.397469, 0.000315, 0.000000, 0.000000],
        [2.397469, 0.000300, 0.000000, 0.000000],
        [2.397469, 0.000286, 0.000000, 0.000000],
        [2.397469, 0.000273, 0.000000, 0.000000],
        [2.397469, 0.000260, 0.000000, 0.000000],
        [2.397469, 0.000248, 0.000000, 0.000000],
        [2.397469, 0.000236, 0.000000, 0.000000],
        [2.397469, 0.000225, 0.000000, 0.000000],
        [2.397469, 0.000215, 0.000000, 0.000000],
        [2.397469, 0.000205, 0.000000, 0.000000],
        [2.397469, 0.000195, 0.000000, 0.000000],
        [2.397469, 0.000186, 0.000000, 0.000000],
        [2.397469, 0.000177, 0.000000, 0.000000],
        [2.397469, 0.000169, 0.000000, 0.000000],
        [2.397469, 0.000161, 0.000000, 0.000000],
        [2.397469, 0.000154, 0.000000, 0.000000],
        [2.397469, 0.000147, 0.000000, 0.000000],
        [2.397469, 0.000140, 0.000000, 0.000000],
        [2.397469, 0.000133, 0.000000, 0.000000],
        [2.397469, 0.000127, 0.000000, 0.000000],
        [2.397469, 0.000121, 0.000000, 0.000000],
        [2.397469, 0.000115, 0.000000, 0.000000],
        [2.397469, 0.000110, 0.000000, 0.000000],
        [2.397469, 0.000105, 0.000000, 0.000000],
        [2.397469, 0.000100, 0.000000, 0.000000],
        [2.397469, 0.000095, 0.000000, 0.000000],
        [2.397469, 0.000091, 0.000000, 0.000000],
        [2.397469, 0.000087, 0.000000, 0.000000],
        [2.397469, 0.000083, 0.000000, 0.000000],
        [2.397469, 0.000079, 0.000000, 0.000000],
        [2.397469, 0.000075, 0.000000, 0.000000],
        [2.397469, 0.000071, 0.000000, 0.000000],
        [2.397469, 0.000068, 0.000000, 0.000000],
        [2.397469, 0.000065, 0.000000, 0.000000],
        [2.397469, 0.000062, 0.000000, 0.000000],
        [2.397469, 0.000059, 0.000000, 0.000000],
        [2.397469, 0.000056, 0.000000, 0.000000],
        [2.397469, 0.000054, 0.000000, 0.000000],
        [2.397469, 0.000051, 0.000000, 0.000000],
        [2.397469, 0.000049, 0.000000, 0.000000],
        [2.397469, 0.000046, 0.000000, 0.000000],
        [2.397469, 0.000044, 0.000000, 0.000000],
        [2.397469, 0.000042, 0.000000, 0.000000],
        [2.397469, 0.000040, 0.000000, 0.000000],
        [2.397469, 0.000038, 0.000000, 0.000000],
        [2.397469, 0.000037, 0.000000, 0.000000],
        [2.397469, 0.000035, 0.000000, 0.000000],
        [2.397469, 0.000033, 0.000000, 0.000000],
        [2.397469, 0.000032, 0.000000, 0.000000],
        [2.397469, 0.000030, 0.000000, 0.000000],
        [2.397469, 0.000029, 0.000000, 0.000000],
        [2.397469, 0.000027, 0.000000, 0.000000],
        [2.397469, 0.000026, 0.000000, 0.000000],
        [2.397469, 0.000025, 0.000000, 0.000000],
        [2.397469, 0.000024, 0.000000, 0.000000],
        [2.397469, 0.000023, 0.000000, 0.000000],
        [2.397469, 0.000022, 0.000000, 0.000000],
        [2.397469, 0.000021, 0.000000, 0.000000],
        [2.397469, 0.000020, 0.000000, 0.000000],
        [2.397469, 0.000019, 0.000000, 0.000000],
        [2.397469, 0.000018, 0.000000, 0.000000],
        [2.397469, 0.000017, 0.000000, 0.000000],
        [2.397469, 0.000016, 0.000000, 0.000000],
        [2.397469, 0.000015, 0.000000, 0.000000],
        [2.397469, 0.000015, 0.000000, 0.000000],
        [2.397469, 0.000014, 0.000000, 0.000000],
        [2.397469, 0.000013, 0.000000, 0.000000],
        [2.397469, 0.000013, 0.000000, 0.000000],
        [2.397469, 0.000012, 0.000000, 0.000000],
        [2.397469, 0.000012, 0.000000, 0.000000],
        [2.397469, 0.000011, 0.000000, 0.000000],
        [2.397469, 0.000011, 0.000000, 0.000000],
        [2.397469, 0.000010, 0.000000, 0.000000],
        [2.397469, 0.000010, 0.000000, 0.000000],
        [2.397469, 0.000009, 0.000000, 0.000000],
        [2.397469, 0.000009, 0.000000, 0.000000],
        [2.397469, 0.000008, 0.000000, 0.000000],
        [2.397469, 0.000008, 0.000000, 0.000000],
        [2.397469, 0.000008, 0.000000, 0.000000],
        [2.397469, 0.000007, 0.000000, 0.000000],
        [2.397469, 0.000007, 0.000000, 0.000000],
        [2.397469, 0.000007, 0.000000, 0.000000],
        [2.397469, 0.000006, 0.000000, 0.000000],
        [2.397469, 0.000006, 0.000000, 0.000000],
        [2.397469, 0.000006, 0.000000, 0.000000],
        [2.397469, 0.000005, 0.000000, 0.000000],
        [2.397469, 0.000005, 0.000000, 0.000000],
        [2.397469, 0.000005, 0.000000, 0.000000],
        [2.397469, 0.000005, 0.000000, 0.000000],
        [2.397469, 0.000004, 0.000000, 0.000000],
        [2.397469, 0.000004, 0.000000, 0.000000],
        [2.397469, 0.000004, 0.000000, 0.000000],
        [2.397469, 0.000004, 0.000000, 0.000000],
        [2.397469, 0.000004, 0.000000, 0.000000],
        [2.397469, 0.000004, 0.000000, 0.000000],
        [2.397469, 0.000003, 0.000000, 0.000000],
        [2.397469, 0.000003, 0.000000, 0.000000],
        [2.397469, 0.000003, 0.000000, 0.000000],
        [2.397469, 0.000003, 0.000000, 0.000000],
        [2.397469, 0.000003, 0.000000, 0.000000],
        [2.397469, 0.000003, 0.000000, 0.000000],
        [2.397469, 0.000003, 0.000000, 0.000000],
        [2.397469, 0.000002, 0.000000, 0.000000],
        [2.397469, 0.000002, 0.000000, 0.000000],
        [2.397469, 0.000002, 0.000000, 0.000000],
        [2.397469, 0.000002, 0.000000, 0.000000],
        [2.397469, 0.000002, 0.000000, 0.000000],
        [2.397469, 0.000002, 0.000000, 0.000000],
        [2.397469, 0.000002, 0.000000, 0.000000],
        [2.397469, 0.000002, 0.000000, 0.000000],
        [2.397469, 0.000002, 0.000000, 0.000000],
        [2.397469, 0.000002, 0.000000, 0.000000],
        [2.397469, 0.000001, 0.000000, 0.000000],
        [2.397469, 0.000001, 0.000000, 0.000000],
        [2.397469, 0.000001, 0.000000, 0.000000],
    ];

    /**
     * Rolloff models
     */
    var AttenuationRolloff;
    (function (AttenuationRolloff) {
        AttenuationRolloff["Logarithmic"] = "logarithmic";
        AttenuationRolloff["Linear"] = "linear";
        AttenuationRolloff["None"] = "none";
    })(AttenuationRolloff || (AttenuationRolloff = {}));

    var Dimension;
    (function (Dimension) {
        Dimension["Width"] = "width";
        Dimension["Height"] = "height";
        Dimension["Depth"] = "depth";
    })(Dimension || (Dimension = {}));

    /**
     * @license
     * Copyright 2017 Google Inc. All Rights Reserved.
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *     http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * Default input gain (linear).
     */
    const DEFAULT_SOURCE_GAIN = 1;
    /**
     * Maximum outside-the-room distance to attenuate far-field listener by.
     */
    const LISTENER_MAX_OUTSIDE_ROOM_DISTANCE = 1;
    /**
     * Maximum outside-the-room distance to attenuate far-field sources by.
     */
    const SOURCE_MAX_OUTSIDE_ROOM_DISTANCE = 1;
    const DEFAULT_POSITION = zero(create());
    const DEFAULT_FORWARD = set(create(), 0, 0, -1);
    const DEFAULT_UP = set(create(), 0, 1, 0);
    set(create(), 1, 0, 0);
    const DEFAULT_SPEED_OF_SOUND = 343;
    /**
     * Default rolloff model ('logarithmic').
     */
    const DEFAULT_ATTENUATION_ROLLOFF = AttenuationRolloff.Logarithmic;
    /**
     * Default mode for rendering ambisonics.
     */
    const DEFAULT_RENDERING_MODE = 'ambisonic';
    const DEFAULT_MIN_DISTANCE = 1;
    const DEFAULT_MAX_DISTANCE = 1000;
    /**
     * The default alpha (i.e. microphone pattern).
     */
    const DEFAULT_DIRECTIVITY_ALPHA = 0;
    /**
     * The default pattern sharpness (i.e. pattern exponent).
     */
    const DEFAULT_DIRECTIVITY_SHARPNESS = 1;
    /**
     * Default azimuth (in degrees). Suitable range is 0 to 360.
     * @type {Number}
     */
    const DEFAULT_AZIMUTH = 0;
    /**
     * Default elevation (in degres).
     * Suitable range is from -90 (below) to 90 (above).
     */
    const DEFAULT_ELEVATION = 0;
    /**
     * The default ambisonic order.
     */
    const DEFAULT_AMBISONIC_ORDER = 1;
    /**
     * The default source width.
     */
    const DEFAULT_SOURCE_WIDTH = 0;
    /**
     * The maximum delay (in seconds) of a single wall reflection.
     */
    const DEFAULT_REFLECTION_MAX_DURATION = 2;
    /**
     * The -12dB cutoff frequency (in Hertz) for the lowpass filter applied to
     * all reflections.
     */
    const DEFAULT_REFLECTION_CUTOFF_FREQUENCY = 6400; // Uses -12dB cutoff.
    /**
     * The default reflection coefficients (where 0 = no reflection, 1 = perfect
     * reflection, -1 = mirrored reflection (180-degrees out of phase)).
     */
    const DEFAULT_REFLECTION_COEFFICIENTS = {
        [Direction.Left]: 0,
        [Direction.Right]: 0,
        [Direction.Front]: 0,
        [Direction.Back]: 0,
        [Direction.Down]: 0,
        [Direction.Up]: 0,
    };
    /**
     * The minimum distance we consider the listener to be to any given wall.
     */
    const DEFAULT_REFLECTION_MIN_DISTANCE = 1;
    /**
     * Default room dimensions (in meters).
     */
    const DEFAULT_ROOM_DIMENSIONS = {
        [Dimension.Width]: 0,
        [Dimension.Height]: 0,
        [Dimension.Depth]: 0,
    };
    /**
     * The multiplier to apply to distances from the listener to each wall.
     */
    const DEFAULT_REFLECTION_MULTIPLIER = 1;
    /** The default bandwidth (in octaves) of the center frequencies.
     */
    const DEFAULT_REVERB_BANDWIDTH = 1;
    /** The default multiplier applied when computing tail lengths.
     */
    const DEFAULT_REVERB_DURATION_MULTIPLIER = 1;
    /**
     * The late reflections pre-delay (in milliseconds).
     */
    const DEFAULT_REVERB_PREDELAY = 1.5;
    /**
     * The length of the beginning of the impulse response to apply a
     * half-Hann window to.
     */
    const DEFAULT_REVERB_TAIL_ONSET = 3.8;
    /**
     * The default gain (linear).
     */
    const DEFAULT_REVERB_GAIN = 0.01;
    /**
     * The maximum impulse response length (in seconds).
     */
    const DEFAULT_REVERB_MAX_DURATION = 3;
    /**
     * Center frequencies of the multiband late reflections.
     * Nine bands are computed by: 31.25 * 2^(0:8).
     */
    const DEFAULT_REVERB_FREQUENCY_BANDS = [
        31.25, 62.5, 125, 250, 500, 1000, 2000, 4000, 8000,
    ];
    /**
     * The number of frequency bands.
     */
    const NUMBER_REVERB_FREQUENCY_BANDS = DEFAULT_REVERB_FREQUENCY_BANDS.length;
    /**
     * The default multiband RT60 durations (in seconds).
     */
    const DEFAULT_REVERB_DURATIONS = new Float32Array(NUMBER_REVERB_FREQUENCY_BANDS);
    var Material;
    (function (Material) {
        Material["Transparent"] = "transparent";
        Material["AcousticCeilingTiles"] = "acoustic-ceiling-tiles";
        Material["BrickBare"] = "brick-bare";
        Material["BrickPainted"] = "brick-painted";
        Material["ConcreteBlockCoarse"] = "concrete-block-coarse";
        Material["ConcreteBlockPainted"] = "concrete-block-painted";
        Material["CurtainHeavy"] = "curtain-heavy";
        Material["FiberGlassInsulation"] = "fiber-glass-insulation";
        Material["GlassThin"] = "glass-thin";
        Material["GlassThick"] = "glass-thick";
        Material["Grass"] = "grass";
        Material["LinoleumOnConcrete"] = "linoleum-on-concrete";
        Material["Marble"] = "marble";
        Material["Metal"] = "metal";
        Material["ParquetOnConcrete"] = "parquet-on-concrete";
        Material["PlasterRough"] = "plaster-rough";
        Material["PlasterSmooth"] = "plaster-smooth";
        Material["PlywoodPanel"] = "plywood-panel";
        Material["PolishedConcreteOrTile"] = "polished-concrete-or-tile";
        Material["Sheetrock"] = "sheetrock";
        Material["WaterOrIceSurface"] = "water-or-ice-surface";
        Material["WoodCeiling"] = "wood-ceiling";
        Material["WoodPanel"] = "wood-panel";
        Material["Uniform"] = "uniform";
    })(Material || (Material = {}));
    /**
     * Pre-defined frequency-dependent absorption coefficients for listed materials.
     * Currently supported materials are:
     * <ul>
     * <li>'transparent'</li>
     * <li>'acoustic-ceiling-tiles'</li>
     * <li>'brick-bare'</li>
     * <li>'brick-painted'</li>
     * <li>'concrete-block-coarse'</li>
     * <li>'concrete-block-painted'</li>
     * <li>'curtain-heavy'</li>
     * <li>'fiber-glass-insulation'</li>
     * <li>'glass-thin'</li>
     * <li>'glass-thick'</li>
     * <li>'grass'</li>
     * <li>'linoleum-on-concrete'</li>
     * <li>'marble'</li>
     * <li>'metal'</li>
     * <li>'parquet-on-concrete'</li>
     * <li>'plaster-smooth'</li>
     * <li>'plywood-panel'</li>
     * <li>'polished-concrete-or-tile'</li>
     * <li>'sheetrock'</li>
     * <li>'water-or-ice-surface'</li>
     * <li>'wood-ceiling'</li>
     * <li>'wood-panel'</li>
     * <li>'uniform'</li>
     * </ul>
     * @type {Object}
     */
    const ROOM_MATERIAL_COEFFICIENTS = {
        [Material.Transparent]: [1.000, 1.000, 1.000, 1.000, 1.000, 1.000, 1.000, 1.000, 1.000],
        [Material.AcousticCeilingTiles]: [0.672, 0.675, 0.700, 0.660, 0.720, 0.920, 0.880, 0.750, 1.000],
        [Material.BrickBare]: [0.030, 0.030, 0.030, 0.030, 0.030, 0.040, 0.050, 0.070, 0.140],
        [Material.BrickPainted]: [0.006, 0.007, 0.010, 0.010, 0.020, 0.020, 0.020, 0.030, 0.060],
        [Material.ConcreteBlockCoarse]: [0.360, 0.360, 0.360, 0.440, 0.310, 0.290, 0.390, 0.250, 0.500],
        [Material.ConcreteBlockPainted]: [0.092, 0.090, 0.100, 0.050, 0.060, 0.070, 0.090, 0.080, 0.160],
        [Material.CurtainHeavy]: [0.073, 0.106, 0.140, 0.350, 0.550, 0.720, 0.700, 0.650, 1.000],
        [Material.FiberGlassInsulation]: [0.193, 0.220, 0.220, 0.820, 0.990, 0.990, 0.990, 0.990, 1.000],
        [Material.GlassThin]: [0.180, 0.169, 0.180, 0.060, 0.040, 0.030, 0.020, 0.020, 0.040],
        [Material.GlassThick]: [0.350, 0.350, 0.350, 0.250, 0.180, 0.120, 0.070, 0.040, 0.080],
        [Material.Grass]: [0.050, 0.050, 0.150, 0.250, 0.400, 0.550, 0.600, 0.600, 0.600],
        [Material.LinoleumOnConcrete]: [0.020, 0.020, 0.020, 0.030, 0.030, 0.030, 0.030, 0.020, 0.040],
        [Material.Marble]: [0.010, 0.010, 0.010, 0.010, 0.010, 0.010, 0.020, 0.020, 0.040],
        [Material.Metal]: [0.030, 0.035, 0.040, 0.040, 0.050, 0.050, 0.050, 0.070, 0.090],
        [Material.ParquetOnConcrete]: [0.028, 0.030, 0.040, 0.040, 0.070, 0.060, 0.060, 0.070, 0.140],
        [Material.PlasterRough]: [0.017, 0.018, 0.020, 0.030, 0.040, 0.050, 0.040, 0.030, 0.060],
        [Material.PlasterSmooth]: [0.011, 0.012, 0.013, 0.015, 0.020, 0.030, 0.040, 0.050, 0.100],
        [Material.PlywoodPanel]: [0.400, 0.340, 0.280, 0.220, 0.170, 0.090, 0.100, 0.110, 0.220],
        [Material.PolishedConcreteOrTile]: [0.008, 0.008, 0.010, 0.010, 0.015, 0.020, 0.020, 0.020, 0.040],
        [Material.Sheetrock]: [0.290, 0.279, 0.290, 0.100, 0.050, 0.040, 0.070, 0.090, 0.180],
        [Material.WaterOrIceSurface]: [0.006, 0.006, 0.008, 0.008, 0.013, 0.015, 0.020, 0.025, 0.050],
        [Material.WoodCeiling]: [0.150, 0.147, 0.150, 0.110, 0.100, 0.070, 0.060, 0.070, 0.140],
        [Material.WoodPanel]: [0.280, 0.280, 0.280, 0.220, 0.170, 0.090, 0.100, 0.110, 0.220],
        [Material.Uniform]: [0.500, 0.500, 0.500, 0.500, 0.500, 0.500, 0.500, 0.500, 0.500],
    };
    /**
     * Default materials that use strings from
     * {@linkcode Utils.MATERIAL_COEFFICIENTS MATERIAL_COEFFICIENTS}
     */
    const DEFAULT_ROOM_MATERIALS = {
        [Direction.Left]: Material.Transparent,
        [Direction.Right]: Material.Transparent,
        [Direction.Front]: Material.Transparent,
        [Direction.Back]: Material.Transparent,
        [Direction.Down]: Material.Transparent,
        [Direction.Up]: Material.Transparent,
    };
    /**
     * The number of bands to average over when computing reflection coefficients.
     */
    const NUMBER_REFLECTION_AVERAGING_BANDS = 3;
    /**
     * The starting band to average over when computing reflection coefficients.
     */
    const ROOM_STARTING_AVERAGING_BAND = 4;
    /**
     * The minimum threshold for room volume.
     * Room model is disabled if volume is below this value.
     */
    const ROOM_MIN_VOLUME = 1e-4;
    /**
     * Air absorption coefficients per frequency band.
     */
    const ROOM_AIR_ABSORPTION_COEFFICIENTS = [0.0006, 0.0006, 0.0007, 0.0008, 0.0010, 0.0015, 0.0026, 0.0060, 0.0207];
    /**
     * A scalar correction value to ensure Sabine and Eyring produce the same RT60
     * value at the cross-over threshold.
     */
    const ROOM_EYRING_CORRECTION_COEFFICIENT = 1.38;
    const TWO_PI = 6.28318530717959;
    const TWENTY_FOUR_LOG10 = 55.2620422318571;
    const LOG1000 = 6.90775527898214;
    const LOG2_DIV2 = 0.346573590279973;
    const RADIANS_TO_DEGREES = 57.295779513082323;
    const EPSILON_FLOAT = 1e-8;
    /**
     * ResonanceAudio library logging function.
     */
    const log$1 = function (...args) {
        window.console.log.apply(window.console, [
            '%c[ResonanceAudio]%c '
                + args.join(' ') + ' %c(@'
                + performance.now().toFixed(2) + 'ms)',
            'background: #BBDEFB; color: #FF5722; font-weight: 700',
            'font-weight: 400',
            'color: #AAA',
        ]);
    };
    const DirectionToDimension = {
        [Direction.Left]: Dimension.Width,
        [Direction.Right]: Dimension.Width,
        [Direction.Front]: Dimension.Depth,
        [Direction.Back]: Dimension.Depth,
        [Direction.Up]: Dimension.Height,
        [Direction.Down]: Dimension.Height
    };
    const DirectionToAxis = {
        [Direction.Left]: 0,
        [Direction.Right]: 0,
        [Direction.Front]: 2,
        [Direction.Back]: 2,
        [Direction.Up]: 1,
        [Direction.Down]: 1
    };
    const DirectionSign = {
        [Direction.Left]: 1,
        [Direction.Right]: -1,
        [Direction.Front]: 1,
        [Direction.Back]: -1,
        [Direction.Up]: -1,
        [Direction.Down]: 1
    };

    /**
     * @license
     * Copyright 2017 Google Inc. All Rights Reserved.
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *     http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * Spatially encodes input using weighted spherical harmonics.
     */
    class Encoder {
        /**
         * Spatially encodes input using weighted spherical harmonics.
         */
        constructor(context, options) {
            this.channelGain = new Array();
            this.merger = null;
            this.disposed = false;
            // Use defaults for undefined arguments.
            options = Object.assign({
                ambisonicOrder: DEFAULT_AMBISONIC_ORDER,
                azimuth: DEFAULT_AZIMUTH,
                elevation: DEFAULT_ELEVATION,
                sourceWidth: DEFAULT_SOURCE_WIDTH
            }, options);
            this.context = context;
            // Create I/O nodes.
            this.input = context.createGain();
            this.output = context.createGain();
            // Set initial order, angle and source width.
            this.setAmbisonicOrder(options.ambisonicOrder);
            this.azimuth = options.azimuth;
            this.elevation = options.elevation;
            this.setSourceWidth(options.sourceWidth);
        }
        /**
         * Validate the provided ambisonic order.
         * @param ambisonicOrder Desired ambisonic order.
         * @return Validated/adjusted ambisonic order.
         */
        static validateAmbisonicOrder(ambisonicOrder) {
            if (isNaN(ambisonicOrder) || ambisonicOrder == null) {
                log$1('Error: Invalid ambisonic order', ambisonicOrder, '\nUsing ambisonicOrder=1 instead.');
                ambisonicOrder = 1;
            }
            else if (ambisonicOrder < 1) {
                log$1('Error: Unable to render ambisonic order', ambisonicOrder, '(Min order is 1)', '\nUsing min order instead.');
                ambisonicOrder = 1;
            }
            else if (ambisonicOrder > SPHERICAL_HARMONICS_MAX_ORDER) {
                log$1('Error: Unable to render ambisonic order', ambisonicOrder, '(Max order is', SPHERICAL_HARMONICS_MAX_ORDER, ')\nUsing max order instead.');
                ambisonicOrder = SPHERICAL_HARMONICS_MAX_ORDER;
            }
            return ambisonicOrder;
        }
        /**
         * Set the desired ambisonic order.
         * @param ambisonicOrder Desired ambisonic order.
         */
        setAmbisonicOrder(ambisonicOrder) {
            this.ambisonicOrder = Encoder.validateAmbisonicOrder(ambisonicOrder);
            this.dispose();
            // Create audio graph.
            let numChannels = (this.ambisonicOrder + 1) * (this.ambisonicOrder + 1);
            this.merger = this.context.createChannelMerger(numChannels);
            this.channelGain = new Array(numChannels);
            for (let i = 0; i < numChannels; i++) {
                this.channelGain[i] = this.context.createGain();
                connect(this.input, this.channelGain[i]);
                connect(this.channelGain[i], this.merger, 0, i);
            }
            connect(this.merger, this.output);
        }
        dispose() {
            if (!this.disposed) {
                for (let i = 0; i < this.channelGain.length; i++) {
                    disconnect(this.input, this.channelGain[i]);
                    if (this.merger) {
                        disconnect(this.channelGain[i], this.merger, 0, i);
                    }
                }
                if (this.merger) {
                    disconnect(this.merger, this.output);
                }
                this.disposed = true;
            }
        }
        /**
         * Set the direction of the encoded source signal.
         * @param azimuth
         * Azimuth (in degrees). Defaults to
         * {@linkcode DEFAULT_AZIMUTH DEFAULT_AZIMUTH}.
         * @param elevation
         * Elevation (in degrees). Defaults to
         * {@linkcode DEFAULT_ELEVATION DEFAULT_ELEVATION}.
         */
        setDirection(azimuth, elevation) {
            // Format input direction to nearest indices.
            if (azimuth == undefined || isNaN(azimuth)) {
                azimuth = DEFAULT_AZIMUTH;
            }
            if (elevation == undefined || isNaN(elevation)) {
                elevation = DEFAULT_ELEVATION;
            }
            // Store the formatted input (for updating source width).
            this.azimuth = azimuth;
            this.elevation = elevation;
            // Format direction for index lookups.
            azimuth = Math.round(azimuth % 360);
            if (azimuth < 0) {
                azimuth += 360;
            }
            elevation = Math.round(Math.min(90, Math.max(-90, elevation))) + 90;
            // Assign gains to each output.
            this.channelGain[0].gain.value = MAX_RE_WEIGHTS[this.spreadIndex][0];
            for (let i = 1; i <= this.ambisonicOrder; i++) {
                let degreeWeight = MAX_RE_WEIGHTS[this.spreadIndex][i];
                for (let j = -i; j <= i; j++) {
                    const acnChannel = (i * i) + i + j;
                    const elevationIndex = i * (i + 1) / 2 + Math.abs(j) - 1;
                    let val = SPHERICAL_HARMONICS[1][elevation][elevationIndex];
                    if (j != 0) {
                        let azimuthIndex = SPHERICAL_HARMONICS_MAX_ORDER + j - 1;
                        if (j < 0) {
                            azimuthIndex = SPHERICAL_HARMONICS_MAX_ORDER + j;
                        }
                        val *= SPHERICAL_HARMONICS[0][azimuth][azimuthIndex];
                    }
                    this.channelGain[acnChannel].gain.value = val * degreeWeight;
                }
            }
        }
        /**
         * Set the source width (in degrees). Where 0 degrees is a point source and 360
         * degrees is an omnidirectional source.
         * @param sourceWidth (in degrees).
         */
        setSourceWidth(sourceWidth) {
            // The MAX_RE_WEIGHTS is a 360 x (SPHERICAL_HARMONICS_MAX_ORDER+1)
            // size table.
            this.spreadIndex = Math.min(359, Math.max(0, Math.round(sourceWidth)));
            this.setDirection(this.azimuth, this.elevation);
        }
    }

    /**
     * @license
     * Copyright 2016 Google Inc. All Rights Reserved.
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *     http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * @file Omnitone library common utilities.
     */
    /**
     * Omnitone library logging function.
     * @param Message to be printed out.
     */
    function log(...rest) {
        const message = `[Omnitone] ${rest.join(' ')}`;
        window.console.log(message);
    }
    /**
     * Converts Base64-encoded string to ArrayBuffer.
     * @param base64String - Base64-encdoed string.
     * @return Converted ArrayBuffer object.
     */
    function getArrayBufferFromBase64String(base64String) {
        const binaryString = window.atob(base64String);
        const byteArray = new Uint8Array(binaryString.length);
        for (let i = 0; i < byteArray.length; ++i) {
            byteArray[i] = binaryString.charCodeAt(i);
        }
        return byteArray.buffer;
    }

    /**
     * @license
     * Copyright 2017 Google Inc. All Rights Reserved.
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *     http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * @file Streamlined AudioBuffer loader.
     */
    /**
     * Buffer data type for ENUM.
     */
    var BufferDataType;
    (function (BufferDataType) {
        /** The data contains Base64-encoded string.. */
        BufferDataType["BASE64"] = "base64";
        /** The data is a URL for audio file. */
        BufferDataType["URL"] = "url";
    })(BufferDataType || (BufferDataType = {}));
    /**
     * BufferList object mananges the async loading/decoding of multiple
     * AudioBuffers from multiple URLs.
     */
    class BufferList {
        /**
         * BufferList object mananges the async loading/decoding of multiple
         * AudioBuffers from multiple URLs.
         * @param context - Associated BaseAudioContext.
         * @param bufferData - An ordered list of URLs.
         * @param options - Options.
         */
        constructor(context, bufferData, options) {
            this._context = context;
            this._options = Object.assign({}, {
                dataType: BufferDataType.BASE64,
                verbose: false,
            }, options);
            this._bufferData = this._options.dataType === BufferDataType.BASE64
                ? bufferData
                : bufferData.slice(0);
        }
        /**
         * Starts AudioBuffer loading tasks.
         */
        async load() {
            try {
                const tasks = this._bufferData.map(async (bData) => {
                    try {
                        return await this._launchAsyncLoadTask(bData);
                    }
                    catch (exp) {
                        const message = 'BufferList: error while loading "' +
                            bData + '". (' + exp.message + ')';
                        throw new Error(message);
                    }
                });
                const buffers = await Promise.all(tasks);
                return buffers;
            }
            catch (exp) {
                const message = 'BufferList: error while loading ". (' + exp.message + ')';
                throw new Error(message);
            }
        }
        /**
         * Run async loading task for Base64-encoded string.
         * @param bData - Base64-encoded data.
         */
        async _launchAsyncLoadTask(bData) {
            const arrayBuffer = await this._fetch(bData);
            const audioBuffer = await this._context.decodeAudioData(arrayBuffer);
            return audioBuffer;
        }
        /**
         * Get an array buffer out of the given data.
         * @param bData - Base64-encoded data.
         */
        async _fetch(bData) {
            if (this._options.dataType === BufferDataType.BASE64) {
                return getArrayBufferFromBase64String(bData);
            }
            else {
                const response = await fetch(bData);
                return await response.arrayBuffer();
            }
        }
    }

    /**
     * @license
     * Copyright 2017 Google Inc. All Rights Reserved.
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *     http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * @file A collection of convolvers. Can be used for the optimized FOA binaural
     * rendering. (e.g. SH-MaxRe HRTFs)
     */
    /**
     * FOAConvolver. A collection of 2 stereo convolvers for 4-channel FOA stream.
     */
    class FOAConvolver {
        /**
         * FOAConvolver. A collection of 2 stereo convolvers for 4-channel FOA stream.
         * @param context The associated BaseAudioContext.
         * @param hrirBufferList - An ordered-list of stereo AudioBuffers for convolution. (i.e. 2 stereo AudioBuffers for FOA)
         */
        constructor(context, hrirBufferList) {
            this.disposed = false;
            this._context = context;
            this._active = false;
            this._isBufferLoaded = false;
            this._buildAudioGraph();
            if (hrirBufferList) {
                this.setHRIRBufferList(hrirBufferList);
            }
            this.enable();
        }
        /**
         * Build the internal audio graph.
         */
        _buildAudioGraph() {
            this._splitterWYZX = this._context.createChannelSplitter(4);
            this._mergerWY = this._context.createChannelMerger(2);
            this._mergerZX = this._context.createChannelMerger(2);
            this._convolverWY = this._context.createConvolver();
            this._convolverZX = this._context.createConvolver();
            this._splitterWY = this._context.createChannelSplitter(2);
            this._splitterZX = this._context.createChannelSplitter(2);
            this._inverter = this._context.createGain();
            this._mergerBinaural = this._context.createChannelMerger(2);
            this._summingBus = this._context.createGain();
            // Group W and Y, then Z and X.
            connect(this._splitterWYZX, this._mergerWY, 0, 0);
            connect(this._splitterWYZX, this._mergerWY, 1, 1);
            connect(this._splitterWYZX, this._mergerZX, 2, 0);
            connect(this._splitterWYZX, this._mergerZX, 3, 1);
            // Create a network of convolvers using splitter/merger.
            connect(this._mergerWY, this._convolverWY);
            connect(this._mergerZX, this._convolverZX);
            connect(this._convolverWY, this._splitterWY);
            connect(this._convolverZX, this._splitterZX);
            connect(this._splitterWY, this._mergerBinaural, 0, 0);
            connect(this._splitterWY, this._mergerBinaural, 0, 1);
            connect(this._splitterWY, this._mergerBinaural, 1, 0);
            connect(this._splitterWY, this._inverter, 1, 0);
            connect(this._inverter, this._mergerBinaural, 0, 1);
            connect(this._splitterZX, this._mergerBinaural, 0, 0);
            connect(this._splitterZX, this._mergerBinaural, 0, 1);
            connect(this._splitterZX, this._mergerBinaural, 1, 0);
            connect(this._splitterZX, this._mergerBinaural, 1, 1);
            // By default, WebAudio's convolver does the normalization based on IR's
            // energy. For the precise convolution, it must be disabled before the buffer
            // assignment.
            this._convolverWY.normalize = false;
            this._convolverZX.normalize = false;
            // For asymmetric degree.
            this._inverter.gain.value = -1;
            // Input/output proxy.
            this.input = this._splitterWYZX;
            this.output = this._summingBus;
        }
        dispose() {
            if (!this.disposed) {
                if (this._active) {
                    this.disable();
                }
                // Group W and Y, then Z and X.
                disconnect(this._splitterWYZX, this._mergerWY, 0, 0);
                disconnect(this._splitterWYZX, this._mergerWY, 1, 1);
                disconnect(this._splitterWYZX, this._mergerZX, 2, 0);
                disconnect(this._splitterWYZX, this._mergerZX, 3, 1);
                // Create a network of convolvers using splitter/merger.
                disconnect(this._mergerWY, this._convolverWY);
                disconnect(this._mergerZX, this._convolverZX);
                disconnect(this._convolverWY, this._splitterWY);
                disconnect(this._convolverZX, this._splitterZX);
                disconnect(this._splitterWY, this._mergerBinaural, 0, 0);
                disconnect(this._splitterWY, this._mergerBinaural, 0, 1);
                disconnect(this._splitterWY, this._mergerBinaural, 1, 0);
                disconnect(this._splitterWY, this._inverter, 1, 0);
                disconnect(this._inverter, this._mergerBinaural, 0, 1);
                disconnect(this._splitterZX, this._mergerBinaural, 0, 0);
                disconnect(this._splitterZX, this._mergerBinaural, 0, 1);
                disconnect(this._splitterZX, this._mergerBinaural, 1, 0);
                disconnect(this._splitterZX, this._mergerBinaural, 1, 1);
                this.disposed = true;
            }
        }
        /**
         * Assigns 2 HRIR AudioBuffers to 2 convolvers: Note that we use 2 stereo
         * convolutions for 4-channel direct convolution. Using mono convolver or
         * 4-channel convolver is not viable because mono convolution wastefully
         * produces the stereo outputs, and the 4-ch convolver does cross-channel
         * convolution. (See Web Audio API spec)
         * @param hrirBufferList - An array of stereo AudioBuffers for
         * convolvers.
         */
        setHRIRBufferList(hrirBufferList) {
            // After these assignments, the channel data in the buffer is immutable in
            // FireFox. (i.e. neutered) So we should avoid re-assigning buffers, otherwise
            // an exception will be thrown.
            if (this._isBufferLoaded) {
                return;
            }
            this._convolverWY.buffer = hrirBufferList[0];
            this._convolverZX.buffer = hrirBufferList[1];
            this._isBufferLoaded = true;
        }
        /**
         * Enable FOAConvolver instance. The audio graph will be activated and pulled by
         * the WebAudio engine. (i.e. consume CPU cycle)
         */
        enable() {
            connect(this._mergerBinaural, this._summingBus);
            this._active = true;
        }
        /**
         * Disable FOAConvolver instance. The inner graph will be disconnected from the
         * audio destination, thus no CPU cycle will be consumed.
         */
        disable() {
            disconnect(this._mergerBinaural, this._summingBus);
            this._active = false;
        }
    }

    /**
     * @license
     * Copyright 2016 Google Inc. All Rights Reserved.
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *     http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * @file Sound field rotator for first-order-ambisonics decoding.
     */
    /**
     * First-order-ambisonic decoder based on gain node network.
     */
    class FOARotator {
        /**
         * First-order-ambisonic decoder based on gain node network.
         * @param context - Associated BaseAudioContext.
         */
        constructor(context) {
            this.disposed = false;
            this._context = context;
            this._splitter = this._context.createChannelSplitter(4);
            this._inX = this._context.createGain();
            this._inY = this._context.createGain();
            this._inZ = this._context.createGain();
            this._m0 = this._context.createGain();
            this._m1 = this._context.createGain();
            this._m2 = this._context.createGain();
            this._m3 = this._context.createGain();
            this._m4 = this._context.createGain();
            this._m5 = this._context.createGain();
            this._m6 = this._context.createGain();
            this._m7 = this._context.createGain();
            this._m8 = this._context.createGain();
            this._outX = this._context.createGain();
            this._outY = this._context.createGain();
            this._outZ = this._context.createGain();
            this._merger = this._context.createChannelMerger(4);
            // ACN channel ordering: [1, 2, 3] => [X, Y, Z]
            // X (from channel 1)
            connect(this._splitter, this._inX, 1);
            // Y (from channel 2)
            connect(this._splitter, this._inY, 2);
            // Z (from channel 3)
            connect(this._splitter, this._inZ, 3);
            this._inX.gain.value = -1;
            this._inY.gain.value = -1;
            this._inZ.gain.value = -1;
            // Apply the rotation in the world space.
            // |X|   | m0  m3  m6 |   | X * m0 + Y * m3 + Z * m6 |   | Xr |
            // |Y| * | m1  m4  m7 | = | X * m1 + Y * m4 + Z * m7 | = | Yr |
            // |Z|   | m2  m5  m8 |   | X * m2 + Y * m5 + Z * m8 |   | Zr |
            connect(this._inX, this._m0);
            connect(this._inX, this._m1);
            connect(this._inX, this._m2);
            connect(this._inY, this._m3);
            connect(this._inY, this._m4);
            connect(this._inY, this._m5);
            connect(this._inZ, this._m6);
            connect(this._inZ, this._m7);
            connect(this._inZ, this._m8);
            connect(this._m0, this._outX);
            connect(this._m1, this._outY);
            connect(this._m2, this._outZ);
            connect(this._m3, this._outX);
            connect(this._m4, this._outY);
            connect(this._m5, this._outZ);
            connect(this._m6, this._outX);
            connect(this._m7, this._outY);
            connect(this._m8, this._outZ);
            // Transform 3: world space to audio space.
            // W -> W (to channel 0)
            connect(this._splitter, this._merger, 0, 0);
            // X (to channel 1)
            connect(this._outX, this._merger, 0, 1);
            // Y (to channel 2)
            connect(this._outY, this._merger, 0, 2);
            // Z (to channel 3)
            connect(this._outZ, this._merger, 0, 3);
            this._outX.gain.value = -1;
            this._outY.gain.value = -1;
            this._outZ.gain.value = -1;
            this.setRotationMatrix3(identity(create$2()));
            // input/output proxy.
            this.input = this._splitter;
            this.output = this._merger;
        }
        dispose() {
            if (!this.disposed) {
                // ACN channel ordering: [1, 2, 3] => [X, Y, Z]
                // X (from channel 1)
                disconnect(this._splitter, this._inX, 1);
                // Y (from channel 2)
                disconnect(this._splitter, this._inY, 2);
                // Z (from channel 3)
                disconnect(this._splitter, this._inZ, 3);
                // Apply the rotation in the world space.
                // |X|   | m0  m3  m6 |   | X * m0 + Y * m3 + Z * m6 |   | Xr |
                // |Y| * | m1  m4  m7 | = | X * m1 + Y * m4 + Z * m7 | = | Yr |
                // |Z|   | m2  m5  m8 |   | X * m2 + Y * m5 + Z * m8 |   | Zr |
                disconnect(this._inX, this._m0);
                disconnect(this._inX, this._m1);
                disconnect(this._inX, this._m2);
                disconnect(this._inY, this._m3);
                disconnect(this._inY, this._m4);
                disconnect(this._inY, this._m5);
                disconnect(this._inZ, this._m6);
                disconnect(this._inZ, this._m7);
                disconnect(this._inZ, this._m8);
                disconnect(this._m0, this._outX);
                disconnect(this._m1, this._outY);
                disconnect(this._m2, this._outZ);
                disconnect(this._m3, this._outX);
                disconnect(this._m4, this._outY);
                disconnect(this._m5, this._outZ);
                disconnect(this._m6, this._outX);
                disconnect(this._m7, this._outY);
                disconnect(this._m8, this._outZ);
                // Transform 3: world space to audio space.
                // W -> W (to channel 0)
                disconnect(this._splitter, this._merger, 0, 0);
                // X (to channel 1)
                disconnect(this._outX, this._merger, 0, 1);
                // Y (to channel 2)
                disconnect(this._outY, this._merger, 0, 2);
                // Z (to channel 3)
                disconnect(this._outZ, this._merger, 0, 3);
                this.disposed = true;
            }
        }
        /**
         * Updates the rotation matrix with 3x3 matrix.
         * @param rotationMatrix3 - A 3x3 rotation matrix. (column-major)
         */
        setRotationMatrix3(rotationMatrix3) {
            this._m0.gain.value = rotationMatrix3[0];
            this._m1.gain.value = rotationMatrix3[1];
            this._m2.gain.value = rotationMatrix3[2];
            this._m3.gain.value = rotationMatrix3[3];
            this._m4.gain.value = rotationMatrix3[4];
            this._m5.gain.value = rotationMatrix3[5];
            this._m6.gain.value = rotationMatrix3[6];
            this._m7.gain.value = rotationMatrix3[7];
            this._m8.gain.value = rotationMatrix3[8];
        }
        /**
         * Updates the rotation matrix with 4x4 matrix.
         * @param rotationMatrix4 - A 4x4 rotation matrix. (column-major)
         */
        setRotationMatrix4(rotationMatrix4) {
            this._m0.gain.value = rotationMatrix4[0];
            this._m1.gain.value = rotationMatrix4[1];
            this._m2.gain.value = rotationMatrix4[2];
            this._m3.gain.value = rotationMatrix4[4];
            this._m4.gain.value = rotationMatrix4[5];
            this._m5.gain.value = rotationMatrix4[6];
            this._m6.gain.value = rotationMatrix4[8];
            this._m7.gain.value = rotationMatrix4[9];
            this._m8.gain.value = rotationMatrix4[10];
        }
        /**
         * Returns the current 3x3 rotation matrix.
         * @return A 3x3 rotation matrix. (column-major)
         */
        getRotationMatrix3() {
            set$2(rotationMatrix3$1, this._m0.gain.value, this._m1.gain.value, this._m2.gain.value, this._m3.gain.value, this._m4.gain.value, this._m5.gain.value, this._m6.gain.value, this._m7.gain.value, this._m8.gain.value);
            return rotationMatrix3$1;
        }
        /**
         * Returns the current 4x4 rotation matrix.
         * @return A 4x4 rotation matrix. (column-major)
         */
        getRotationMatrix4() {
            set$1(rotationMatrix4$1, this._m0.gain.value, this._m1.gain.value, this._m2.gain.value, 0, this._m3.gain.value, this._m4.gain.value, this._m5.gain.value, 0, this._m6.gain.value, this._m7.gain.value, this._m8.gain.value, 0, 0, 0, 0, 1);
            return rotationMatrix4$1;
        }
    }
    const rotationMatrix3$1 = create$2();
    const rotationMatrix4$1 = create$1();

    /**
     * @license
     * Copyright 2016 Google Inc. All Rights Reserved.
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *     http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * @file An audio channel router to resolve different channel layouts between
     * browsers.
     */
    var ChannelMap;
    (function (ChannelMap) {
        ChannelMap[ChannelMap["Default"] = 0] = "Default";
        ChannelMap[ChannelMap["Safari"] = 1] = "Safari";
        ChannelMap[ChannelMap["FUMA"] = 2] = "FUMA";
    })(ChannelMap || (ChannelMap = {}));
    /**
     * Channel map dictionary ENUM.
     */
    const ChannelMaps = {
        /** ACN channel map for Chrome and FireFox. (FFMPEG) */
        [ChannelMap.Default]: [0, 1, 2, 3],
        /** Safari's 4-channel map for AAC codec. */
        [ChannelMap.Safari]: [2, 0, 1, 3],
        /** ACN > FuMa conversion map. */
        [ChannelMap.FUMA]: [0, 3, 1, 2]
    };
    /**
     * Channel router for FOA stream.
     */
    class FOARouter {
        /**
         * Channel router for FOA stream.
         * @param context - Associated BaseAudioContext.
         * @param channelMap - Routing destination array.
         */
        constructor(context, channelMap) {
            this.disposed = false;
            this._context = context;
            this._splitter = this._context.createChannelSplitter(4);
            this._merger = this._context.createChannelMerger(4);
            // input/output proxy.
            this.input = this._splitter;
            this.output = this._merger;
            this.setChannelMap(channelMap || ChannelMap.Default);
        }
        /**
         * Sets channel map.
         * @param channelMap - A new channel map for FOA stream.
         */
        setChannelMap(channelMap) {
            if (channelMap instanceof Array) {
                this._channelMap = channelMap;
            }
            else {
                this._channelMap = ChannelMaps[channelMap];
            }
            connect(this._splitter, this._merger, 0, this._channelMap[0]);
            connect(this._splitter, this._merger, 1, this._channelMap[1]);
            connect(this._splitter, this._merger, 2, this._channelMap[2]);
            connect(this._splitter, this._merger, 3, this._channelMap[3]);
        }
        dispose() {
            if (!this.disposed) {
                disconnect(this._splitter, this._merger, 0, this._channelMap[0]);
                disconnect(this._splitter, this._merger, 1, this._channelMap[1]);
                disconnect(this._splitter, this._merger, 2, this._channelMap[2]);
                disconnect(this._splitter, this._merger, 3, this._channelMap[3]);
                this.disposed = true;
            }
        }
    }

    var FOAHrirBase64 = [
        "UklGRiQEAABXQVZFZm10IBAAAAABAAIAgLsAAADuAgAEABAAZGF0YQAEAAD+/wIA9v8QAPv/CwD+/wcA/v8MAP//AQD7/wEACAAEAPj/+v8YABAA7v/n//v/9P/M/8D//f34/R38EvzxAfEBtA2lDTcBJQFJ9T71FP0D/cD1tfVo/Wv9uPTO9PPmOufc/U/+agL3Aisc/RxuGKEZBv3j/iYMzQ2gAzsEQQUABiQFrASzA5cB2QmyCy0AtgR4AeYGtfgAA2j5OQHP+scArPsMBJgEggIEBtz6+QVq/pj/aPg8BPP3gQEi+jEAof0fA1v9+/7S+8IBjvwd/xD4IADL/Pf9zvs+/l3+wgB7/+L+7fzFADH9kf6A+n3+DP6+/TP9xP68/pn+w/26/i39YgA0/u790Pt9/kD+7v1s/Wb+8f4C/1P+pf/x/cT+6/3p/Xz9ff5F/0f9G/4r/6v/4P5L/sL+ff7c/pj+Ov7X/UT+9P5G/oz+6v6A/2D+9/6P/8r/bP7m/ij+C//e/tj/Gf4e/9v+FwDP/lz/sP7F/2H+rv/G/s7/Hf7y/4P+NAD9/k0AK/6w/zP/hACh/sX/gf44AOP+dgCm/iUAk/5qAOD+PwC+/jEAWP4CAAr/bQBw/vv/zf5iACD/OgCS/uD/Cv9oAAb/CgDK/kwA//5tACH/TgCg/h4AHP9aABP/JADP/hEAYv9gAAj/3f8m/ysAYv8gACX/8/8k/ysAXv8bABH//v8j/ygAa/8qAAD/9f9g/1YAWf8JACH/AgB2/z4AXP/w/z3/FgB2/ykAX//9/z//EwCV/zUAS//n/1T/GACK/x4ATv/0/4P/QQB4//v/WP/2/3X/HAB8//P/V//3/2f/AQBh/9v/Tf/x/5P/IwCI/wMAf/8hAKP/JACZ/xUAiv8nAK//HgCr/yMAm/8uAMz/OACi/yQAqf87AMT/MwCY/yUAtP9FAMH/KgCu/ycAyP85AMv/IwCz/xoA1f8qAMn/FgC8/xQA4/8nAMX/CwDJ/xQA4f8ZAMH/BgDO/xQA4f8WAMP/BwDU/xQA4P8QAMH/AQDb/xQA3P8JAMP/AgDh/xIA2v8EAMj/AgDk/w0A1f/+/8v/AwDm/wwA0v/+/9H/BgDl/wkAzv/8/9T/BwDk/wcAzv/8/9r/CQDi/wQAzf/8/9//CADf////0P/9/+L/BwDd//7/0////+T/BgDb//z/1f8AAOf/BQDZ//v/2v8CAOb/AwDY//v/3v8EAOb/AgDY//3/4f8FAOX/AQDZ//7/5P8GAOP/AADb/wAA5/8GAOH////d/wIA5/8FAOD////f/wMA6P8FAOD////h/wQA6P8EAN7////h/wUA4v8DANv/AQDd/wQA3P8CANn/AgDb/wMA2/8CANv/AgDd/wIA3v8CAOH/AQDj/wEA",
        "UklGRiQEAABXQVZFZm10IBAAAAABAAIAgLsAAADuAgAEABAAZGF0YQAEAAAAAAAA/f8CAP//AQD//wEA//8BAP3/AAACAP7/+f8AAAIA/P8FAAQA8/8AABoA+f/V/wQAHQDO/xoAQQBO/ocA0Px1/ucHW/4UCm8HLO6kAjv8/fCRDdAAYfPiBIgFXveUCM0GBvh6/nz7rf0J/QcQSRVdBgoBSgFR62r9NP8m+LoEAvriBVAAiAPmABEGMf2l+SwBjva6/G4A//8P/CYDMgXm/R0CKAE6/fcBBwAtAND+kQA0A5UDhwFs/8IB8fydAEP/A/8v/e7/mP8j/2YBIwE3Av0AYv+uAOD8lgAg/wwAIf/L/n0Ae//OAJMB3P/XAF//XwCM/08AB/8NAEf/rf4jAT3/lgAJAP4AHgDpAO8AUf9L/07/Qf8KAOD/x/+D/3sATQCDAMoA0f79/+L/EQDt/7EAqv+S/7IAuv/o/wgAc//X//H/SwCm/+3/Yf/B/yoAAADI/7X/AwBg/5EATgCX/xYA/P+q/00AVACY/6v/BADD/zwALQCN/8z/KQDu/ygAEgCZ/6f/VQDC//T/KQCs/7P/UgAfAO7/NgC8/57/awAZAPP/+P/V/8z/bQBBAL//DgD0/+T/TABBAMz/CwAxAPz/SQBqALn/BgALAPz/EAA7AIz/3/8iAAUA//8kALf/y/9VABQA+v81AOj/0P9cAB4A+f8WAOr/vv83ABgAw/8JAOj/4f8nACIAsf/y/w4A3v8gACQAxP/n/ycA7P8WAC0Ayf/U/ycA9v/7/yUA0P/P/zUABADc/xUA5P/J/zcACwDS/xUA9P/m/zAACQDX/+3/9v/2/yQACgDZ/+P/AwAKABYA///b/9j/EQALABkADgD6/+7/GwD4/w4A8P/w//j/EgAEAAUA9f/1/wQAGgD4/wAA5////wAAGQD1////7f8FAAUAFQDv/wAA6v8LAAcAFQDs/wEA9P8SAAYACwDr//7/AQASAAYABQDv/wIAAwAWAAIAAgDv/wAABgATAAEA/f/u/wQABgAQAPr/+P/z/wUACQALAPj/9//4/wgABwAKAPT/+f/5/w4ABwAIAPT/+//9/w4AAwADAPH//f///w8A//8BAPP///8BAA0A/f/+//X/AgACAA0A+//8//b/BAADAAoA+f/7//n/BgADAAcA+P/7//v/BwABAAQA+P/8//3/CQABAAIA9//9////CQD/////+P///wAACAD9//7/+f8AAAAABwD8//3/+v8CAAAABgD7//z//P8EAAAABAD6//3//P8FAP//AgD6//7//v8FAP7/AQD7//////8GAP7/AAD7/wEA//8EAP3/AAD9/wEA/v8DAP3/AAD9/wIA/v8CAP3/AQD9/wIA/v8CAP7/AQD+/wEA",
    ];

    /**
     * @license
     * Copyright 2017 Google Inc. All Rights Reserved.
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *     http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * Omnitone FOA renderer class. Uses the optimized convolution technique.
     */
    class FOARenderer {
        /**
         * Omnitone FOA renderer class. Uses the optimized convolution technique.
         */
        constructor(context, options) {
            this.disposed = false;
            this.context = context;
            this.config = Object.assign({
                channelMap: ChannelMap.Default,
                renderingMode: RenderingMode.Ambisonic,
            }, options);
            if (this.config.channelMap instanceof Array
                && this.config.channelMap.length !== 4) {
                throw new Error('FOARenderer: Invalid channel map. (got ' + this.config.channelMap
                    + ')');
            }
            if (this.config.hrirPathList && this.config.hrirPathList.length !== 2) {
                throw new Error('FOARenderer: Invalid HRIR URLs. It must be an array with ' +
                    '2 URLs to HRIR files. (got ' + this.config.hrirPathList + ')');
            }
            this.buildAudioGraph();
        }
        /**
         * Builds the internal audio graph.
         */
        buildAudioGraph() {
            this.input = this.context.createGain();
            this.output = this.context.createGain();
            this.bypass = this.context.createGain();
            this.router = new FOARouter(this.context, this.config.channelMap);
            this.rotator = new FOARotator(this.context);
            this.convolver = new FOAConvolver(this.context);
            connect(this.input, this.router.input);
            connect(this.input, this.bypass);
            connect(this.router.output, this.rotator.input);
            connect(this.rotator.output, this.convolver.input);
            connect(this.convolver.output, this.output);
            this.input.channelCount = 4;
            this.input.channelCountMode = 'explicit';
            this.input.channelInterpretation = 'discrete';
        }
        dispose() {
            if (!this.disposed) {
                if (this.getRenderingMode() === RenderingMode.Bypass) {
                    disconnect(this.bypass, this.output);
                }
                disconnect(this.input, this.router.input);
                disconnect(this.input, this.bypass);
                disconnect(this.router.output, this.rotator.input);
                disconnect(this.rotator.output, this.convolver.input);
                disconnect(this.convolver.output, this.output);
                this.convolver.dispose();
                this.rotator.dispose();
                this.router.dispose();
                this.disposed = true;
            }
        }
        /**
         * Initializes and loads the resource for the renderer.
         */
        async initialize() {
            const bufferList = this.config.hrirPathList
                ? new BufferList(this.context, this.config.hrirPathList, { dataType: BufferDataType.URL })
                : new BufferList(this.context, FOAHrirBase64, { dataType: BufferDataType.BASE64 });
            try {
                const hrirBufferList = await bufferList.load();
                this.convolver.setHRIRBufferList(hrirBufferList);
                this.setRenderingMode(this.config.renderingMode);
            }
            catch (exp) {
                const errorMessage = `FOARenderer: HRIR loading/decoding (mode: ${this.config.renderingMode}) failed. Reason: ${exp.message}`;
                throw new Error(errorMessage);
            }
        }
        /**
         * Set the channel map.
         * @param channelMap - Custom channel routing for FOA stream.
         */
        setChannelMap(channelMap) {
            if (channelMap.toString() !== this.config.channelMap.toString()) {
                log('Remapping channels ([' + this.config.channelMap.toString() +
                    '] -> [' + channelMap.toString() + ']).');
                if (channelMap instanceof Array) {
                    this.config.channelMap = channelMap.slice();
                }
                else {
                    this.config.channelMap = channelMap;
                }
                this.router.setChannelMap(this.config.channelMap);
            }
        }
        /**
         * Updates the rotation matrix with 3x3 matrix.
         * @param rotationMatrix3 - A 3x3 rotation matrix. (column-major)
         */
        setRotationMatrix3(rotationMatrix3) {
            this.rotator.setRotationMatrix3(rotationMatrix3);
        }
        /**
         * Updates the rotation matrix with 4x4 matrix.
         * @param rotationMatrix4 - A 4x4 rotation matrix. (column-major)
         */
        setRotationMatrix4(rotationMatrix4) {
            this.rotator.setRotationMatrix4(rotationMatrix4);
        }
        getRenderingMode() {
            return this.config.renderingMode;
        }
        /**
         * Set the rendering mode.
         * @param mode - Rendering mode.
         *  - 'ambisonic': activates the ambisonic decoding/binaurl rendering.
         *  - 'bypass': bypasses the input stream directly to the output. No ambisonic
         *    decoding or encoding.
         *  - 'off': all the processing off saving the CPU power.
         */
        setRenderingMode(mode) {
            if (mode === this.config.renderingMode) {
                return;
            }
            if (mode === RenderingMode.Ambisonic) {
                this.convolver.enable;
            }
            else {
                this.convolver.disable();
            }
            if (mode === RenderingMode.Bypass) {
                connect(this.bypass, this.output);
            }
            else {
                disconnect(this.bypass, this.output);
            }
            this.config.renderingMode = mode;
        }
    }

    /**
     * @license
     * Copyright 2017 Google Inc. All Rights Reserved.
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *     http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * @file A collection of convolvers. Can be used for the optimized HOA binaural
     * rendering. (e.g. SH-MaxRe HRTFs)
     */
    /**
     * A convolver network for N-channel HOA stream.
     */
    class HOAConvolver {
        /**
         * A convolver network for N-channel HOA stream.
          * @param context - Associated BaseAudioContext.
         * @param ambisonicOrder - Ambisonic order. (2 or 3)
         * @param [hrirBufferList] - An ordered-list of stereo
         * AudioBuffers for convolution. (SOA: 5 AudioBuffers, TOA: 8 AudioBuffers)
         */
        constructor(context, ambisonicOrder, hrirBufferList) {
            this._active = false;
            this._isBufferLoaded = false;
            this._context = context;
            // The number of channels K based on the ambisonic order N where K = (N+1)^2.
            this._ambisonicOrder = ambisonicOrder;
            this._numberOfChannels =
                (this._ambisonicOrder + 1) * (this._ambisonicOrder + 1);
            this._buildAudioGraph();
            if (hrirBufferList) {
                this.setHRIRBufferList(hrirBufferList);
            }
            this.enable();
        }
        /**
         * Build the internal audio graph.
         * For TOA convolution:
         *   input -> splitter(16) -[0,1]-> merger(2) -> convolver(2) -> splitter(2)
         *                         -[2,3]-> merger(2) -> convolver(2) -> splitter(2)
         *                         -[4,5]-> ... (6 more, 8 branches total)
         */
        _buildAudioGraph() {
            const numberOfStereoChannels = Math.ceil(this._numberOfChannels / 2);
            this._inputSplitter =
                this._context.createChannelSplitter(this._numberOfChannels);
            this._stereoMergers = [];
            this._convolvers = [];
            this._stereoSplitters = [];
            this._positiveIndexSphericalHarmonics = this._context.createGain();
            this._negativeIndexSphericalHarmonics = this._context.createGain();
            this._inverter = this._context.createGain();
            this._binauralMerger = this._context.createChannelMerger(2);
            this._outputGain = this._context.createGain();
            for (let i = 0; i < numberOfStereoChannels; ++i) {
                this._stereoMergers[i] = this._context.createChannelMerger(2);
                this._convolvers[i] = this._context.createConvolver();
                this._stereoSplitters[i] = this._context.createChannelSplitter(2);
                this._convolvers[i].normalize = false;
            }
            for (let l = 0; l <= this._ambisonicOrder; ++l) {
                for (let m = -l; m <= l; m++) {
                    // We compute the ACN index (k) of ambisonics channel using the degree (l)
                    // and index (m): k = l^2 + l + m
                    const acnIndex = l * l + l + m;
                    const stereoIndex = Math.floor(acnIndex / 2);
                    // Split channels from input into array of stereo convolvers.
                    // Then create a network of mergers that produces the stereo output.
                    connect(this._inputSplitter, this._stereoMergers[stereoIndex], acnIndex, acnIndex % 2);
                    connect(this._stereoMergers[stereoIndex], this._convolvers[stereoIndex]);
                    connect(this._convolvers[stereoIndex], this._stereoSplitters[stereoIndex]);
                    // Positive index (m >= 0) spherical harmonics are symmetrical around the
                    // front axis, while negative index (m < 0) spherical harmonics are
                    // anti-symmetrical around the front axis. We will exploit this symmetry
                    // to reduce the number of convolutions required when rendering to a
                    // symmetrical binaural renderer.
                    if (m >= 0) {
                        connect(this._stereoSplitters[stereoIndex], this._positiveIndexSphericalHarmonics, acnIndex % 2);
                    }
                    else {
                        connect(this._stereoSplitters[stereoIndex], this._negativeIndexSphericalHarmonics, acnIndex % 2);
                    }
                }
            }
            connect(this._positiveIndexSphericalHarmonics, this._binauralMerger, 0, 0);
            connect(this._positiveIndexSphericalHarmonics, this._binauralMerger, 0, 1);
            connect(this._negativeIndexSphericalHarmonics, this._binauralMerger, 0, 0);
            connect(this._negativeIndexSphericalHarmonics, this._inverter);
            connect(this._inverter, this._binauralMerger, 0, 1);
            // For asymmetric index.
            this._inverter.gain.value = -1;
            // Input/Output proxy.
            this.input = this._inputSplitter;
            this.output = this._outputGain;
        }
        dispose() {
            if (this._active) {
                this.disable();
            }
            for (let l = 0; l <= this._ambisonicOrder; ++l) {
                for (let m = -l; m <= l; m++) {
                    // We compute the ACN index (k) of ambisonics channel using the degree (l)
                    // and index (m): k = l^2 + l + m
                    const acnIndex = l * l + l + m;
                    const stereoIndex = Math.floor(acnIndex / 2);
                    // Split channels from input into array of stereo convolvers.
                    // Then create a network of mergers that produces the stereo output.
                    disconnect(this._inputSplitter, this._stereoMergers[stereoIndex], acnIndex, acnIndex % 2);
                    disconnect(this._stereoMergers[stereoIndex], this._convolvers[stereoIndex]);
                    disconnect(this._convolvers[stereoIndex], this._stereoSplitters[stereoIndex]);
                    // Positive index (m >= 0) spherical harmonics are symmetrical around the
                    // front axis, while negative index (m < 0) spherical harmonics are
                    // anti-symmetrical around the front axis. We will exploit this symmetry
                    // to reduce the number of convolutions required when rendering to a
                    // symmetrical binaural renderer.
                    if (m >= 0) {
                        disconnect(this._stereoSplitters[stereoIndex], this._positiveIndexSphericalHarmonics, acnIndex % 2);
                    }
                    else {
                        disconnect(this._stereoSplitters[stereoIndex], this._negativeIndexSphericalHarmonics, acnIndex % 2);
                    }
                }
            }
            disconnect(this._positiveIndexSphericalHarmonics, this._binauralMerger, 0, 0);
            disconnect(this._positiveIndexSphericalHarmonics, this._binauralMerger, 0, 1);
            disconnect(this._negativeIndexSphericalHarmonics, this._binauralMerger, 0, 0);
            disconnect(this._negativeIndexSphericalHarmonics, this._inverter);
            disconnect(this._inverter, this._binauralMerger, 0, 1);
        }
        /**
         * Assigns N HRIR AudioBuffers to N convolvers: Note that we use 2 stereo
         * convolutions for 4-channel direct convolution. Using mono convolver or
         * 4-channel convolver is not viable because mono convolution wastefully
         * produces the stereo outputs, and the 4-ch convolver does cross-channel
         * convolution. (See Web Audio API spec)
         * @param hrirBufferList - An array of stereo AudioBuffers for
         * convolvers.
         */
        setHRIRBufferList(hrirBufferList) {
            // After these assignments, the channel data in the buffer is immutable in
            // FireFox. (i.e. neutered) So we should avoid re-assigning buffers, otherwise
            // an exception will be thrown.
            if (this._isBufferLoaded) {
                return;
            }
            for (let i = 0; i < hrirBufferList.length; ++i) {
                this._convolvers[i].buffer = hrirBufferList[i];
            }
            this._isBufferLoaded = true;
        }
        /**
         * Enable HOAConvolver instance. The audio graph will be activated and pulled by
         * the WebAudio engine. (i.e. consume CPU cycle)
         */
        enable() {
            connect(this._binauralMerger, this._outputGain);
            this._active = true;
        }
        /**
         * Disable HOAConvolver instance. The inner graph will be disconnected from the
         * audio destination, thus no CPU cycle will be consumed.
         */
        disable() {
            disconnect(this._binauralMerger, this._outputGain);
            this._active = false;
        }
    }

    /**
     * @license
     * Copyright 2016 Google Inc. All Rights Reserved.
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *     http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * @file Sound field rotator for higher-order-ambisonics decoding.
     */
    function getKroneckerDelta(i, j) {
        return i === j ? 1 : 0;
    }
    function lij2i(l, i, j) {
        const index = (j + l) * (2 * l + 1) + (i + l);
        return index;
    }
    /**
     * A helper function to allow us to access a matrix array in the same
     * manner, assuming it is a (2l+1)x(2l+1) matrix. [2] uses an odd convention of
     * referring to the rows and columns using centered indices, so the middle row
     * and column are (0, 0) and the upper left would have negative coordinates.
     * @param matrix - N matrices of gainNodes, each with (2n+1) x (2n+1) elements, where n=1,2,...,N.
     * @param l
     * @param i
     * @param j
     * @param gainValue
     */
    function setCenteredElement(matrix, l, i, j, gainValue) {
        const index = lij2i(l, i, j);
        // Row-wise indexing.
        matrix[l - 1][index].gain.value = gainValue;
    }
    /**
     * This is a helper function to allow us to access a matrix array in the same
     * manner, assuming it is a (2l+1) x (2l+1) matrix.
     * @param matrix - N matrices of gainNodes, each with (2n+1) x (2n+1)
     * elements, where n=1,2,...,N.
     * @param l
     * @param i
     * @param j
     */
    function getCenteredElement(matrix, l, i, j) {
        // Row-wise indexing.
        const index = lij2i(l, i, j);
        return matrix[l - 1][index].gain.value;
    }
    /**
     * Helper function defined in [2] that is used by the functions U, V, W.
     * This should not be called on its own, as U, V, and W (and their coefficients)
     * select the appropriate matrix elements to access arguments |a| and |b|.
     * @param matrix - N matrices of gainNodes, each with (2n+1) x (2n+1)
     * elements, where n=1,2,...,N.
     * @param i
     * @param a
     * @param b
     * @param l
     */
    function getP(matrix, i, a, b, l) {
        if (b === l) {
            return getCenteredElement(matrix, 1, i, 1) *
                getCenteredElement(matrix, l - 1, a, l - 1) -
                getCenteredElement(matrix, 1, i, -1) *
                    getCenteredElement(matrix, l - 1, a, -l + 1);
        }
        else if (b === -l) {
            return getCenteredElement(matrix, 1, i, 1) *
                getCenteredElement(matrix, l - 1, a, -l + 1) +
                getCenteredElement(matrix, 1, i, -1) *
                    getCenteredElement(matrix, l - 1, a, l - 1);
        }
        else {
            return getCenteredElement(matrix, 1, i, 0) *
                getCenteredElement(matrix, l - 1, a, b);
        }
    }
    /**
     * The functions U, V, and W should only be called if the correspondingly
     * named coefficient u, v, w from the function ComputeUVWCoeff() is non-zero.
     * When the coefficient is 0, these would attempt to access matrix elements that
     * are out of bounds. The vector of rotations, |r|, must have the |l - 1|
     * previously completed band rotations. These functions are valid for |l >= 2|.
     * @param matrix - N matrices of gainNodes, each with (2n+1) x (2n+1)
     * elements, where n=1,2,...,N.
     * @param m
     * @param n
     * @param l
     */
    function getU(matrix, m, n, l) {
        // Although [1, 2] split U into three cases for m == 0, m < 0, m > 0
        // the actual values are the same for all three cases.
        return getP(matrix, 0, m, n, l);
    }
    /**
     * The functions U, V, and W should only be called if the correspondingly
     * named coefficient u, v, w from the function ComputeUVWCoeff() is non-zero.
     * When the coefficient is 0, these would attempt to access matrix elements that
     * are out of bounds. The vector of rotations, |r|, must have the |l - 1|
     * previously completed band rotations. These functions are valid for |l >= 2|.
     * @param matrix - N matrices of gainNodes, each with (2n+1) x (2n+1)
     * elements, where n=1,2,...,N.
     * @param m
     * @param n
     * @param l
     */
    function getV(matrix, m, n, l) {
        if (m === 0) {
            return getP(matrix, 1, 1, n, l) +
                getP(matrix, -1, -1, n, l);
        }
        else if (m > 0) {
            const d = getKroneckerDelta(m, 1);
            return getP(matrix, 1, m - 1, n, l) * Math.sqrt(1 + d) -
                getP(matrix, -1, -m + 1, n, l) * (1 - d);
        }
        else {
            // Note there is apparent errata in [1,2,2b] dealing with this particular
            // case. [2b] writes it should be P*(1-d)+P*(1-d)^0.5
            // [1] writes it as P*(1+d)+P*(1-d)^0.5, but going through the math by hand,
            // you must have it as P*(1-d)+P*(1+d)^0.5 to form a 2^.5 term, which
            // parallels the case where m > 0.
            const d = getKroneckerDelta(m, -1);
            return getP(matrix, 1, m + 1, n, l) * (1 - d) +
                getP(matrix, -1, -m - 1, n, l) * Math.sqrt(1 + d);
        }
    }
    /**
     * The functions U, V, and W should only be called if the correspondingly
     * named coefficient u, v, w from the function ComputeUVWCoeff() is non-zero.
     * When the coefficient is 0, these would attempt to access matrix elements that
     * are out of bounds. The vector of rotations, |r|, must have the |l - 1|
     * previously completed band rotations. These functions are valid for |l >= 2|.
     * @param matrix N matrices of gainNodes, each with (2n+1) x (2n+1)
     * elements, where n=1,2,...,N.
     * @param m
     * @param n
     * @param l
     */
    function getW(matrix, m, n, l) {
        // Whenever this happens, w is also 0 so W can be anything.
        if (m === 0) {
            return 0;
        }
        return m > 0 ?
            getP(matrix, 1, m + 1, n, l) + getP(matrix, -1, -m - 1, n, l) :
            getP(matrix, 1, m - 1, n, l) - getP(matrix, -1, -m + 1, n, l);
    }
    /**
     * Calculates the coefficients applied to the U, V, and W functions. Because
     * their equations share many common terms they are computed simultaneously.
     * @return 3 coefficients for U, V and W functions.
     */
    function computeUVWCoeff(m, n, l) {
        const d = getKroneckerDelta(m, 0);
        const reciprocalDenominator = Math.abs(n) === l ? 1 / (2 * l * (2 * l - 1)) : 1 / ((l + n) * (l - n));
        set(UVWCoeff, Math.sqrt((l + m) * (l - m) * reciprocalDenominator), 0.5 * (1 - 2 * d) * Math.sqrt((1 + d) *
            (l + Math.abs(m) - 1) *
            (l + Math.abs(m)) *
            reciprocalDenominator), -0.5 * (1 - d) * Math.sqrt((l - Math.abs(m) - 1) * (l - Math.abs(m))) * reciprocalDenominator);
        return UVWCoeff;
    }
    const UVWCoeff = create();
    /**
     * Calculates the (2l+1) x (2l+1) rotation matrix for the band l.
     * This uses the matrices computed for band 1 and band l-1 to compute the
     * matrix for band l. |rotations| must contain the previously computed l-1
     * rotation matrices.
     * This implementation comes from p. 5 (6346), Table 1 and 2 in [2] taking
     * into account the corrections from [2b].
     * @param matrix - N matrices of gainNodes, each with where
     * n=1,2,...,N.
     * @param l
     */
    function computeBandRotation(matrix, l) {
        // The lth band rotation matrix has rows and columns equal to the number of
        // coefficients within that band (-l <= m <= l implies 2l + 1 coefficients).
        for (let m = -l; m <= l; m++) {
            for (let n = -l; n <= l; n++) {
                const uvwCoefficients = computeUVWCoeff(m, n, l);
                // The functions U, V, W are only safe to call if the coefficients
                // u, v, w are not zero.
                if (Math.abs(uvwCoefficients[0]) > 0) {
                    uvwCoefficients[0] *= getU(matrix, m, n, l);
                }
                if (Math.abs(uvwCoefficients[1]) > 0) {
                    uvwCoefficients[1] *= getV(matrix, m, n, l);
                }
                if (Math.abs(uvwCoefficients[2]) > 0) {
                    uvwCoefficients[2] *= getW(matrix, m, n, l);
                }
                setCenteredElement(matrix, l, m, n, uvwCoefficients[0] + uvwCoefficients[1] + uvwCoefficients[2]);
            }
        }
    }
    /**
     * Compute the HOA rotation matrix after setting the transform matrix.
     * @param matrix - N matrices of gainNodes, each with (2n+1) x (2n+1)
     * elements, where n=1,2,...,N.
     */
    function computeHOAMatrices(matrix) {
        // We start by computing the 2nd-order matrix from the 1st-order matrix.
        for (let i = 2; i <= matrix.length; i++) {
            computeBandRotation(matrix, i);
        }
    }
    /**
     * Higher-order-ambisonic decoder based on gain node network. We expect
     * the order of the channels to conform to ACN ordering. Below are the helper
     * methods to compute SH rotation using recursion. The code uses maths described
     * in the following papers:
     *  [1] R. Green, "Spherical Harmonic Lighting: The Gritty Details", GDC 2003,
     *      http://www.research.scea.com/gdc2003/spherical-harmonic-lighting.pdf
     *  [2] J. Ivanic and K. Ruedenberg, "Rotation Matrices for Real
     *      Spherical Harmonics. Direct Determination by Recursion", J. Phys.
     *      Chem., vol. 100, no. 15, pp. 6342-6347, 1996.
     *      http://pubs.acs.org/doi/pdf/10.1021/jp953350u
     *  [2b] Corrections to initial publication:
     *       http://pubs.acs.org/doi/pdf/10.1021/jp9833350
     */
    class HOARotator {
        /**
         * Higher-order-ambisonic decoder based on gain node network. We expect
         * the order of the channels to conform to ACN ordering. Below are the helper
         * methods to compute SH rotation using recursion. The code uses maths described
         * in the following papers:
         *  [1] R. Green, "Spherical Harmonic Lighting: The Gritty Details", GDC 2003,
         *      http://www.research.scea.com/gdc2003/spherical-harmonic-lighting.pdf
         *  [2] J. Ivanic and K. Ruedenberg, "Rotation Matrices for Real
         *      Spherical Harmonics. Direct Determination by Recursion", J. Phys.
         *      Chem., vol. 100, no. 15, pp. 6342-6347, 1996.
         *      http://pubs.acs.org/doi/pdf/10.1021/jp953350u
         *  [2b] Corrections to initial publication:
         *       http://pubs.acs.org/doi/pdf/10.1021/jp9833350
         * @param context - Associated BaseAudioContext.
         * @param ambisonicOrder - Ambisonic order.
         */
        constructor(context, ambisonicOrder) {
            this.disposed = false;
            this._context = context;
            this._ambisonicOrder = ambisonicOrder;
            // We need to determine the number of channels K based on the ambisonic order
            // N where K = (N + 1)^2.
            const numberOfChannels = (ambisonicOrder + 1) * (ambisonicOrder + 1);
            this._splitter = this._context.createChannelSplitter(numberOfChannels);
            this._merger = this._context.createChannelMerger(numberOfChannels);
            // Create a set of per-order rotation matrices using gain nodes.
            /** @type {GainNode[][]} */
            this._gainNodeMatrix = [];
            for (let i = 1; i <= ambisonicOrder; i++) {
                // Each ambisonic order requires a separate (2l + 1) x (2l + 1) rotation
                // matrix. We compute the offset value as the first channel index of the
                // current order where
                //   k_last = l^2 + l + m,
                // and m = -l
                //   k_last = l^2
                const orderOffset = i * i;
                // Uses row-major indexing.
                const rows = (2 * i + 1);
                this._gainNodeMatrix[i - 1] = [];
                for (let j = 0; j < rows; j++) {
                    const inputIndex = orderOffset + j;
                    for (let k = 0; k < rows; k++) {
                        const outputIndex = orderOffset + k;
                        const matrixIndex = j * rows + k;
                        this._gainNodeMatrix[i - 1][matrixIndex] = this._context.createGain();
                        connect(this._splitter, this._gainNodeMatrix[i - 1][matrixIndex], inputIndex);
                        connect(this._gainNodeMatrix[i - 1][matrixIndex], this._merger, 0, outputIndex);
                    }
                }
            }
            // W-channel is not involved in rotation, skip straight to ouput.
            connect(this._splitter, this._merger, 0, 0);
            // Default Identity matrix.
            this.setRotationMatrix3(identity(create$2()));
            // Input/Output proxy.
            this.input = this._splitter;
            this.output = this._merger;
        }
        dispose() {
            if (!this.disposed) {
                for (let i = 1; i <= this._ambisonicOrder; i++) {
                    // Each ambisonic order requires a separate (2l + 1) x (2l + 1) rotation
                    // matrix. We compute the offset value as the first channel index of the
                    // current order where
                    //   k_last = l^2 + l + m,
                    // and m = -l
                    //   k_last = l^2
                    const orderOffset = i * i;
                    // Uses row-major indexing.
                    const rows = (2 * i + 1);
                    for (let j = 0; j < rows; j++) {
                        const inputIndex = orderOffset + j;
                        for (let k = 0; k < rows; k++) {
                            const outputIndex = orderOffset + k;
                            const matrixIndex = j * rows + k;
                            disconnect(this._splitter, this._gainNodeMatrix[i - 1][matrixIndex], inputIndex);
                            disconnect(this._gainNodeMatrix[i - 1][matrixIndex], this._merger, 0, outputIndex);
                        }
                    }
                }
                // W-channel is not involved in rotation, skip straight to ouput.
                disconnect(this._splitter, this._merger, 0, 0);
                this.disposed = true;
            }
        }
        /**
         * Updates the rotation matrix with 3x3 matrix.
         * @param rotationMatrix3 - A 3x3 rotation matrix. (column-major)
         */
        setRotationMatrix3(rotationMatrix3) {
            this._gainNodeMatrix[0][0].gain.value = rotationMatrix3[0];
            this._gainNodeMatrix[0][1].gain.value = rotationMatrix3[1];
            this._gainNodeMatrix[0][2].gain.value = rotationMatrix3[2];
            this._gainNodeMatrix[0][3].gain.value = rotationMatrix3[3];
            this._gainNodeMatrix[0][4].gain.value = rotationMatrix3[4];
            this._gainNodeMatrix[0][5].gain.value = rotationMatrix3[5];
            this._gainNodeMatrix[0][6].gain.value = rotationMatrix3[6];
            this._gainNodeMatrix[0][7].gain.value = rotationMatrix3[7];
            this._gainNodeMatrix[0][8].gain.value = rotationMatrix3[8];
            computeHOAMatrices(this._gainNodeMatrix);
        }
        /**
         * Updates the rotation matrix with 4x4 matrix.
         * @param rotationMatrix4 - A 4x4 rotation matrix. (column-major)
         */
        setRotationMatrix4(rotationMatrix4) {
            this._gainNodeMatrix[0][0].gain.value = rotationMatrix4[0];
            this._gainNodeMatrix[0][1].gain.value = rotationMatrix4[1];
            this._gainNodeMatrix[0][2].gain.value = rotationMatrix4[2];
            this._gainNodeMatrix[0][3].gain.value = rotationMatrix4[4];
            this._gainNodeMatrix[0][4].gain.value = rotationMatrix4[5];
            this._gainNodeMatrix[0][5].gain.value = rotationMatrix4[6];
            this._gainNodeMatrix[0][6].gain.value = rotationMatrix4[8];
            this._gainNodeMatrix[0][7].gain.value = rotationMatrix4[9];
            this._gainNodeMatrix[0][8].gain.value = rotationMatrix4[10];
            computeHOAMatrices(this._gainNodeMatrix);
        }
        /**
         * Returns the current 3x3 rotation matrix.
         * @return A 3x3 rotation matrix. (column-major)
         */
        getRotationMatrix3() {
            set$2(rotationMatrix3, this._gainNodeMatrix[0][0].gain.value, this._gainNodeMatrix[0][1].gain.value, this._gainNodeMatrix[0][2].gain.value, this._gainNodeMatrix[0][3].gain.value, this._gainNodeMatrix[0][4].gain.value, this._gainNodeMatrix[0][5].gain.value, this._gainNodeMatrix[0][6].gain.value, this._gainNodeMatrix[0][7].gain.value, this._gainNodeMatrix[0][8].gain.value);
            return rotationMatrix3;
        }
        /**
         * Returns the current 4x4 rotation matrix.
         * @return A 4x4 rotation matrix. (column-major)
         */
        getRotationMatrix4() {
            set$1(rotationMatrix4, this._gainNodeMatrix[0][0].gain.value, this._gainNodeMatrix[0][1].gain.value, this._gainNodeMatrix[0][2].gain.value, 0, this._gainNodeMatrix[0][3].gain.value, this._gainNodeMatrix[0][4].gain.value, this._gainNodeMatrix[0][5].gain.value, 0, this._gainNodeMatrix[0][6].gain.value, this._gainNodeMatrix[0][7].gain.value, this._gainNodeMatrix[0][8].gain.value, 0, 0, 0, 0, 1);
            return rotationMatrix4;
        }
        /**
         * Get the current ambisonic order.
         */
        getAmbisonicOrder() {
            return this._ambisonicOrder;
        }
    }
    const rotationMatrix3 = create$2();
    const rotationMatrix4 = create$1();

    var SOAHrirBase64 = [
        "UklGRiQEAABXQVZFZm10IBAAAAABAAIAgLsAAADuAgAEABAAZGF0YQAEAAD+/wQA8/8ZAPr/DAD+/wMA/v8KAAQA/f8DAAMABADs//z/8v/z/8f/R/90/ob+//zAAWsDAwY3DKn9//tu93DvkwI6An4CuwJ0/BH7VPux92X0Gu7N/EX9mgfqCkkIiRMgBd4NQQGL/c0G/xBxAKELZATUA/sIHRSx+fkCyAUmBNEJIARlAdHz2AjNACcIsAW4AlECsvtJ/P/7K/tf++n8aP4W+g0FXAElAMn8nQHn/sT+Zv7N+9X2xvzM/O3+EvpqBBD7SQLd+vb/sPlw/JD72/3n+Rr+L/wS/vz6UQGg/Nf+Av5L/5X9Gv2//SP+mf3j/lf+v/2B/ZH/5P05/iL9MP9F/uf9UP4v/qv9mv7o/Xn+wP2k/8L+uP5J/tD+Dv/Y/bL+mP72/n3+pP+7/hAA+/5zAGH+Z/+u/g8Azv2y/6L+//9o/iIADP8VACz/CwCN/pb/1v4yAFP+wf+4/jsAcf5VAP3+bADa/nMA6f4sAOT+IQBd/v7/7v6aAIL+QADe/nEA0P4yAKz+CQCo/moAuf5xAN7+mAC8/jcANf9eAPX+IAA1/1kAAP9hAMz+PQD5/m0A2/4gAPr+UQDh/jQAEv9BAPH+FABN/zkASv9DADP/BABe/1IAGf8oAE3/RQAw/zIAQf8mADn/GgBE/xIAR/8hAD7/BABy/zEAKP/0/07/GwBX/z4ARf8mAFr/QQBV/zUAVP8eAFz/JABt/0EAUP8MAHz/KgBr/ycAYv8EAH3/MABl/x8Agv8bAIj/GgBv//z/ff8AAJX/IABu/+T/jv/r/4z/9/9n/77/pP8JAJD/EQCJ//r/q/8WAJ//GQCU/xYAtv8qAKr/PQCW/ysAwf8+ALb/OgC3/ygAz/8uAM7/OgDH/ygAz/8kAMz/OgC//xsA1f8qAMn/LwDN/xcA1f8oAMv/JQDR/xMAzf8bAM//HgDU/wUA2v8ZANL/EwDW/wEA1f8ZAMz/BwDX/wIA0v8SANT/BQDW/wMA0/8PANT/AADY/wIA1f8MANX/+f/a/wUA0v8IANf/+//Y/wUA0/8DANr/+f/Y/wQA1v8BANr/+f/Z/wUA1//8/9z/+v/Y/wYA2f/8/93//v/Y/wUA2v/9/93////Z/wUA3P/8/97/AgDa/wMA3v/8/97/AwDb/wIA3//9/97/BADd/wEA4f///9//BQDf/wAA4v8AAN//BQDf/wAA4/8CAN//BADh/wAA4/8DAOD/BADi////4/8DAOH/AwDk/wAA5P8FAOL/AgDl/wEA5P8FAOL/AQDl/wEA4/8EAOL/AQDj/wIA4P8DAN//AADg/wIA3v8CAOD/AADh/wEA4v8AAOP/AADm/wAA6P8AAOz/AADu/wAA",
        "UklGRiQEAABXQVZFZm10IBAAAAABAAIAgLsAAADuAgAEABAAZGF0YQAEAAD//////f/+//7///8AAP////8BAAEA/f8AAAEAAQAFAAUA9//6/x0A2f/9/xMA3P+jAE//of9HAKP//gCj/77/Z/vi/28D9/ywDJAJIvr6AsX0Xec4BhcGzf23DZP7yfZ6C1//nwBDBIHyYgob/Tf3sQ41ANoKRA/A+E7yffAa9gD5EQUBDMwMygiqAHMAqPqhAGUB2/gE+a78H/+4APT6DwIUAA0HNwMhBfL8E/90A5n7dP9cALIC+v5C/q0AOv9kAogBHv01/+3/qAQD/ub8T/4vAOUA5P6KATv+ywEYAeT+KP6i/3gCFP6h/hr/+P83ACL/VADn/8UARQJI/4MAu/8qAlj+wf4iAPb/LgFJ/8QAUABAAI4ABf+k/3X/YgFK/ij/j/9HADoAi/+WAA0BVwC/ACL/LACe//cARv9i/xgAUgA0ACj/FgBgAIj/5P9M/7z/zv8/AKz/gv8sAEQA6/+I/yYAawDL/7T/xf8qAOv/FQCu/5n/EgAyAO3/i/9LAE4A+//R//P/FgDe/8z/u/8DADIALAAZALL/TAA8ABwAo//1/xwA/P/L/z0A6P8jAN7/7v+a/zAAwf/7/3//KQAuACwA9v8RAGYAIwBNADgAKgASAF0ADgANACEAMQDH//H/LQACAB0Ay////x0APAABAAQA2v8iAAcAEgDE/+v/FQD+/+P/DAD1/97/6v/4//X/EwD4/+7/5P8cAA0ACQDH//7/CQAXAAEA/P/5//j/CwAWAAEABQD9//n/AQAWAB0A7v/k/wAACQAmAP//9/8AAPn/8/8aAO//6/8fAOv/5v8hAP//5/8PAOf/AAAGAPn/6v8JAAYABgABAOv/1//1//L/+P8DABcA6f/8/wMACgD7/xAA3v/2//z/DADu//z/5v/5/wEA/P/6//7/7v/x/wQABgD5/wAA8v/w/wkAEQD2//j/+v8EAAcAEAD3//v/+v8CAAAACQD3//v//v/9/wUADAD2//X/AgAHAAAABwD2//T/BgAKAP7/AQD4//r/BAAIAPn/AAD3//f/BQAHAPv//v/7//n/BQAJAPj/+v/9//7/AgAGAPj/+f8BAAEAAgAFAPn/+v8BAAIAAAAEAPn/+f8CAAQA/v8BAPr/+v8CAAQA/P////v//P8CAAQA+//+//3//f8CAAUA+v/9//////8AAAQA+v/8////AAD//wIA+//8/wAAAQD+/wEA+//8/wAAAgD9/////P/9/wEAAgD8//7//f/9/wAAAgD8//3//v/+////AQD8//z/////////AAD8//3///8AAP7/AAD9//7///8AAP7////+//////8AAP7////+////////////////////",
        "UklGRiQEAABXQVZFZm10IBAAAAABAAIAgLsAAADuAgAEABAAZGF0YQAEAAD//////v8AAP///////wAAAAAAAP7/AQABAAAABwD///X/BQAjAPL/CQDb/9D/GAAb/7sAYwCW/z0BcP/X/7T/2QDW+wH8yANCCCUJ5QT++UXmhPwhA78FuAxH+p78ifudBlAG9vmu/lAK2fdlB///cfjoCa0E7Akn9Yb/zvba+AkAHPywBGEBFwUNAL8AXAAGA20DFvmR/kz+F/06Ag/+GwHl/5EEKgJd/q0AP/ym/9n6EfxY/2H+/QFtAC4C6QBDAaMCo/20/+3/3f/p/fL9rv9V/6cBhQHuAX4AcwJYAaH/IP/P/gsApP0LAe7/sQBuAI0AAgGDAE4BzACe/5X//v+v/+f+Zf+gAOv/5QBhAOIApAANASYAuP+h/8b/HQBr/9//bACWAGEAFAB5AD0AWQDU/+D/Yf/p//D/s/+R/4QAMQBvABEAkQBfABQAJgDW/wwA8/8XALz/vf8zAFAAKwD1/zEAPwDJ/x0A7/8LAOX/FwDR//H/EQAdAO//6P8QAFEA2f8WABEAMgDy/xIA+f/s/xAALgDv////HQAvAPT/+f8iAAYAEgAFABoAGgD//w0A+f/0/xsAHgDx/9f/GAACAPH/8f8JAPf/GwALABEA7/8cAPT/CgD2//j/BQD8/+3/OgAgAAYA9f8PAN7/DgD9/9r/1//3/+3/9//1//b/8//5//f/AgAJAOf/+v8OAAMACwD9/+7/5f8eAAEA9//q//7/8P8WAP7/+//4/wIA+f8TAAIA9f/5/wcA+P8iAAgA9v/n/xoA//8gAAUABwDj/wAA9v8BAAUAFQDn/wMA7v8QABAAEQDm/wwA8f8aAAAABwDu/wcACgASAAEA7//w//f/BgARAAkA6P/3/wcADgAKAAYA4f/4/wYADgAAAPr/8P/9/xQACgAHAPn/7//9/xEAAgD+//L/8v/8/xUAAwDw//H/9f8CAAsA/v/q//L/+f8FAAYA/P/r//j///8GAAkA+//o//j/AQAIAP//+v/o//v/CAAIAPv/+P/w/wEACQAHAPj/+f/0/wIACwAFAPb/+f/4/wQACwACAPP/+f/+/wYACAD///L/+/8BAAYABQD9//P//P8FAAUAAgD7//T//f8HAAQA///7//f///8IAAMA/P/6//r/AQAIAAEA+v/6//3/AgAHAAAA+f/7/wAAAwAFAP7/+P/8/wIAAgACAP3/+f/9/wMAAwAAAPz/+v/+/wQAAgD+//z/+/8AAAQAAQD8//z//f8BAAQAAAD7//3///8BAAMA///7//3/AAACAAEA/v/7//7/AQABAAAA/v/9////AQAAAP///v/+////AAD/////////////////////////////",
        "UklGRiQEAABXQVZFZm10IBAAAAABAAIAgLsAAADuAgAEABAAZGF0YQAEAAD////////+//////8AAAAA/v/+/wAAAQD8//3/CQAJAP3/+v8PAAcApABlABkBkwCO/i//lfqa/HQAcf/3BdkCzwJcBCMC0wMN/9/9wgI7AaECYfxV/Tf83vhn/xrt8Owx/8n7cgHABYb43QcZDh4WugNrA7P74gHu/9z/zv0t/acCiQHY/iv4qQOl/ysCE/0//XT9Sf4O//j9xfupAn394gHO+rsCXAFIAxQC9wIXBgcD2AQuAnb/9gJh/6wAVfxEAI4Bvf7oAFv/bALsAMQBe/88/joAT/4dAH39/v9LAXn/gwDI//QBdABcAA0A7f4lAMn///+9/tv/iABp/13/pP/dALv/w/8MAHv//f+y/6////7U/5AAZP+Z/8r/nQDR/5r/DwDr/xAA4v+s/3z/+P9uAOv/t/82AGcAHgCb/yQAFQBGAM7/CgD3/xoAegAaAOz/CgBHAA8Adv8/AAAABQC2/xIAAAA7ABQAKgCj/z4AAQAXAJz/JAADAAcA8f/1/2AAAQAlAPD/NgDx/1wA7v/4/wMAZADv//3/HQAkAFoA8P9FAPv/FgBIAPf/WQAHAEUACQD0/xIAQwDu/wMAwP9VALn/XwCw/yEA5f8sAPj/FgDD/1YAyv8rAOX/HQDo//j/IQAQACAAHwD9/yQAHQBAABgABQAiAAUAKAD3/wkACwAKAAMABwAJAPb/+f8GAOr/JQAHABMA6P8TAA4AGgD//woA8/8ZAP//GADu/w0A9v8SAAMABwD4/wQA5P8XAAQACgDq/wUA+/8VAAcACADs/xIAAAATAPH/+v/1//T/7f///+z/+v/y/+//9/8KAAcACgAJAPT/BAAKAAAABgAIAPL/9v8KAAMABAACAPr/9v8OAAIA+P/x//v/+f8MAPb/+P/w/wQA9f8MAPn////7/woA/v8PAAEAAgD1/xAAAQAPAP//AwD//xQABwALAAAABgADABAAAgAHAAAACAABAA8ABQAFAAMABwAEAA4ABwADAAEACQAFAAoAAwD//wAACQADAAUAAQD/////CAABAAMAAAD/////BwACAAEAAAD/////BwACAP7///8BAAAABgABAP7///8CAAAABAAAAP7///8DAAAAAwAAAP3///8DAAAAAQAAAP3//v8EAAAAAAD+//////8EAP/////+/wAA/v8EAP/////+/wEA/v8EAP///v/+/wIA//8DAP///v/+/wIA//8BAP///v/+/wMA//8BAP/////+/wMA//8AAP//AAD+/wQA//8AAP7/AQD//wIA////////AQD//wIA////////AQAAAAEAAAAAAP//AQD//wEAAAAAAP//AQAAAAEAAAAAAAAA",
        "UklGRiQEAABXQVZFZm10IBAAAAABAAIAgLsAAADuAgAEABAAZGF0YQAEAAD+/wAA+v8AAPz/AAD//wAA/f8AAAEAAAD+/wAACQAAAAQAAAAZAAAAtgAAAFsBAABW/gAAH/oAAGcBAABoBwAAlAAAAO3/AAARAQAA+wIAAEoEAACe/gAAiv4AALD0AADJ8wAAkQQAAF34AABi8QAAPQAAAAH2AAD19AAADAMAAJwGAACTEAAA0AwAAJkHAACOBwAAuQEAANcDAAC6AgAAHwUAAHEFAAB0AwAAbgEAADz+AADYAQAAGAAAAJwCAADgAAAA//0AAMn+AAAT/AAAwP8AAOn9AAAJAAAAewEAAOn+AACN/wAAOv0AAO3+AADN/gAAcP8AACj/AACq/gAA+f4AAML9AACa/wAA/f4AAN7/AABo/wAA6/4AAE//AAAC/wAAEQAAAHX/AAB0AAAA5f8AAEwAAAB3AAAA5/8AAMIAAABCAAAAzgAAAE8AAAB3AAAAKAAAADMAAACqAAAALwAAAK4AAAASAAAAVgAAACgAAAAtAAAATAAAAP3/AAA7AAAA2/8AACQAAADw/wAALQAAADEAAAAlAAAAbAAAADMAAABUAAAAEAAAACgAAAD1/wAA9v8AAPr/AADu/wAALgAAABIAAABUAAAARAAAAGUAAABGAAAAOAAAAGAAAAAuAAAARQAAACEAAAAfAAAAAAAAAAkAAAAQAAAAAwAAABIAAADs/wAAEAAAAAYAAAASAAAAIgAAABEAAAADAAAABAAAAA8AAAD4/wAAHQAAAAsAAAAIAAAADgAAAP//AAAcAAAADwAAAAYAAAASAAAAFwAAAAMAAAAYAAAAEgAAAPr/AAAQAAAADQAAAAoAAAD3/wAABgAAAPb/AADf/wAA/v8AAPL/AAD6/wAAFAAAAAQAAAAEAAAAGwAAAAEAAAAMAAAAIAAAAAIAAAAdAAAAGAAAAAIAAAAcAAAAEgAAAAcAAAAeAAAADwAAAAQAAAAeAAAABAAAAAYAAAAZAAAAAQAAAA4AAAATAAAA/v8AAAoAAAAOAAAA+/8AAAsAAAAJAAAA+f8AAAsAAAABAAAA+f8AAAoAAAD9/wAA+v8AAAcAAAD5/wAA+v8AAAUAAAD3/wAA/f8AAAQAAAD2/wAAAAAAAAEAAAD3/wAAAgAAAAAAAAD4/wAAAwAAAP7/AAD6/wAABAAAAP3/AAD8/wAABAAAAPv/AAD+/wAAAwAAAPv/AAD//wAAAQAAAPv/AAAAAAAAAAAAAPv/AAACAAAA//8AAPz/AAACAAAA/v8AAP3/AAACAAAA/f8AAP7/AAABAAAA/f8AAP//AAABAAAA/f8AAAAAAAAAAAAA/v8AAAEAAAAAAAAA//8AAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    ];

    var TOAHrirBase64 = [
        "UklGRiQEAABXQVZFZm10IBAAAAABAAIAgLsAAADuAgAEABAAZGF0YQAEAAD+/wQA8/8YAP3/CgACAAAA//8CAAYA8/8AAPH/CgDv/97/e/+y/9P+UQDwAHUBEwV7/pP8P/y09bsDwAfNBGYIFf/Y+736+fP890Hv8AGcC3T/vwYy+S70AAICA3AD4AagBw0R4w3ZEAcN8RVYAV8Q8P2z+kECHwdK/jIG0QNKAYUElf8IClj7BgjX+/f8j/l3/5f/6fkK+xz8FP0v/nj/Mf/n/FcBPfvH/1H3+gBP/Hf8cfiCAR/54QBh+UQAcvkzAWL8TP13+iD/V/73+wv9Kv+Y/hv+xPz7/UL83//a/z/9AP6R/5L+jf26/P3+rP26/tD8nP7B/Pv+WP1V/sP9gv91/3P9xP3J/nv/GP5S/sb+IP8v/9j/dv7U/pr+6v+u/Z3/sv5cAOr9Q/83/+n/zP5x/57+2//k/nwA/v01//L+SACB/sD/Ff81AJT+TgDp/ocAm/5dAFT+MgD+/pMAW/7o/yH/xQDA/kkA9P6LAL3+pAC0/iQAz/5UALD+UwAt/3UAhf4UAA//pwC+/joAz/5aAAv/fwDY/iMAIf+uAPP+ZAAc/0QAy/4xAB7/TgDs/goADP8wAEL/NwDo/ub/Uf9BAC3/+v9F/y4ARP9HAFP/EQA3/xMATP81AG3/HQAu/wgAaP9FACb/9f9B/y0AUP8rAED/CwBV/z4AW/8TAGH/BQBK/xsAfv8eAFn/AgB3/zwAff8RAGj//v+E/yAAb//0/3n/FwBz/xcAiv8PAHn/FQCJ/xgAg//x/3j/EQCa/ycAff/w/47/HwCI//X/iv/7/43/JQCM/+n/kP8AAJb/JACj//7/oP8ZAML/SwCo/w4Atv8tAMb/PACr/xcAwP9HAMP/OADF/y4A0f9IANL/NwC//zEA0f9LAMb/MAC8/y4A3f9GAMH/FQDQ/yYA2/8sAMT/AwDX/xkA3v8SAM3/9v/c/w8A4f8LAMj/8f/h/xQA2P8CAMn/8//j/xQA0v/7/9H//P/i/xEA0v/1/9L//f/j/w0A0f/x/9f//v/k/wgAz//u/9z/AwDg/wMA0P/v/9//BQDf////0v/y/+D/CADc//3/0v/2/+L/CgDa//r/1v/5/+T/CgDY//j/2f/9/+T/CADY//f/3P8AAOT/BwDY//f/4P8EAOP/BADZ//j/4v8GAOL/AwDa//r/5f8IAOH/AQDc//3/5v8JAOD//v/f////5v8IAOD//v/h/wIA5/8HAOD//f/j/wMA5/8GAOD//f/l/wYA5v8EAOD//v/m/wYA5f8CAOL////n/wYA5P8BAOH/AADl/wUA4f///+H/AQDk/wMA4f///+T/AQDm/wEA5////+r/AADt/wAA7/////P/AAD1////",
        "UklGRiQEAABXQVZFZm10IBAAAAABAAIAgLsAAADuAgAEABAAZGF0YQAEAAD//////v///wAAAAAAAAAAAQAAAAAA///9/wAABAD+//n/AgAJAAAA+v/+//f/DAAdAPv/+v+l/8L+jf/4/vgAdwVPAQACLQBo+Qj/Ev7o/N3/VgCbA08Bxf+L+yn9J/2HCU8FmgBvDe30Rv5h/LT09gi5CxkA5gOi8/30kwEM+4YJMf2nBmkJJAQQBLoFtvvv+m4A7PF6/R0Bif3qAuf8WARAAf4GyABG/BIAwvr4Acv8U//c/yIC8AEn/B8Daf2CAgMBAf3MAN38vgLK/UT/QwCyAPYClPyvAW/+pQAoASD+zP+R/IYC1f7C/nEBQP96AZb+1QAIAM//yQE7/tkAZ/7TAXL/w/8+AIsAtwB7/24A4v9a/z4A7v4iADb/dwCj/23/kgBOANUAIv8lAKEAxP9gAK7/BwCP/5kA7/9v/0wAzv9DAGT/3/9vAHv/6P+q/xUA7P8XAO//uv/g/2UAEgCV/wEATADM/+7/+//j/+D/9v/i//j/IgD+/xoAxf/6/z4A5/+8/9D/QwDq/+3/OQDT/zUAIgA/APP/PgAjAPD/BwAGACAADAC3//b/HAA3AN//RgDN/w8AIAACAN//GQBDACEAIwA+ACoAJQAeAPz/KgAYAPr/DgAEABYAIgAcAMT/7f8OAOL/5P/2//L/9P8GAPT/7v/8/+7/6v/t//z/AgAUAOL//P8VAAMA4/8IAPb/+P8MAAoA5v8NAAsA9v///wEAAAD9//n/9/8JAAYA7v/6/wMA+f8GAAEA7f/7/xgACAD4/w8A///3/w0A+f8BAAIA/P/5/xIA///9//r/7v/+/xYACQD///H/CwDz/wEADgAHAPP/FADn/+3/AQD5//f/AgD7/wEABwAMAAEADQD8//n/8f8OAPX/BAD+//X/+v8WAAQA+f8CAAEA7/8QAAEA/P8DAAUA9f8KAAwA9v8DAAUA+f8OAAoA9f/7/w0A+v8EAAgA8P/6/woA+//8/wkA+P/3/woA+//8/wcA9//1/woAAwD5/wcA/P/3/w0AAwD3/wEABAD2/wkABgD3/wEABQD3/wUABQD3//v/BwD3/wMABQD3//r/CQD7////BQD6//n/CQD9//3/BAD9//j/BwAAAPv/AwD///j/BwABAPn/AQABAPn/BQACAPn///8DAPr/AwADAPr//v8EAPv/AQADAPv//P8FAP3///8DAPz/+/8FAP7//f8CAP7/+/8EAP///P8BAP//+/8DAAEA+/8AAAEA+/8CAAIA+////wIA/f8AAAIA/P/+/wIA/f8AAAIA/f/9/wMA/////wEA///+/wIA/////wAAAAD+/wAAAAD/////AAD//wAA//8AAP//AAD//wAA",
        "UklGRiQEAABXQVZFZm10IBAAAAABAAIAgLsAAADuAgAEABAAZGF0YQAEAAD////////+//////8AAP////8AAP//AAAAAPz//f8IAAMA9////w4AAQD6/wwA8//+/y8Afv/0/2H/UP5gAbH+2QG1B2cAVAIh/l32FPyM/nACPQDV/+UEo/Q6AQwCu/oLD9kF8QJA/Uz+Wf2KCOcC+wUKBsL5aQBQ97rwOPiPAvn5CAl8AHEDkQPcAA8Bn/lIAdz7HQF1+xz9cAM4/94E4gDKAun+cgPYAYr9JgJr/bf+ivxz/MoBgv5UA8EBSgAQAJ7/UgEk/cQB7f63/sD/vf4XAhT/BQFCADYAnQGI/9EBtv3hALD/vP+c/3H/TgIN/1sBpf8yAP3/4f8qABr+1f8OAJ3/dwAGADEBnv9JAPz/IQBwAIH/jgAS/4wAsACTAOn/DQDCALn/ZQCSAAIAAwD1/9//jv9aADQA/v9EAB0AfgA8AAQACgB9APr/IAARAPT/5v9xACAABAAHAGUAt/89AC4ACgAjAMP/+v/9/xYA7f/1/+D/7P87AC0Auv8RAAcA9/8FAC8A2//y/xIAEwAaADQAJADp/zoAAgAfABIA2f/e/zUA+P/6/w4A9//A/zcA4//P//T/5f/R////EwDb/w4A8/8BABkANADh/xEA+f/0/wIAHADc//j/GwD1//f/GADs/+v/EAAAAPz/EgD3/+r/FgAMAAkAGAD9/+z/IQAQAPH/GQD3//z/CgAfAOX/AgD8//H/BAATAOv/+v///wIABAAdAOj/BQAPAAcAAQATAOz/8/8JAAkA6f8VAOv/+f8QABUA/v8OAO3/+P8KABUA9f8FAPv/5/8TAA0A7f8XAAkAAQAJABYA4/8WAAcACgANABEA7v8EAP7/AAD+/wMA9//7/xAAAQD8/wQA+f/7/wMABgDq/wAA+v/3/wYACQD1//3/BAD9/wgADgDw//r/AgD6/wEACADv//j/BQD///X/BwDu//j/AgACAPP/BAD2//n/BAAGAPb/BAD8//3/BQAJAPL/AwD+//3/BAAIAPP//f8DAPz/AAAGAPP/+/8CAP7//f8FAPX/+f8DAAAA/P8EAPf/+v8GAAMA+/8EAPv/+/8GAAQA+v8CAP///P8EAAUA+f8AAP///f8CAAUA+P///wEA/v8BAAUA+f/+/wIAAAD//wUA+v/9/wMAAQD9/wQA+//9/wMAAgD8/wMA/P/9/wMAAwD7/wEA/v/+/wIAAwD6/wEA///+/wAABAD6/wAAAQD//wAAAwD7////AQAAAP//AwD8//7/AgABAP3/AgD9//7/AQABAP3/AQD+//7/AAACAPz/AAD+//////8BAP3/AAD//wAA//8BAP7/AAD//wAA/v8AAP7/AAD//wAA//8AAP//",
        "UklGRiQEAABXQVZFZm10IBAAAAABAAIAgLsAAADuAgAEABAAZGF0YQAEAAD//////P/9//3//////wAAAAAAAAIAAgACAP//CAAEAEEA//+cAAUAb/8HAAH9+P9eARkAogQUAJn8BwCd/gX/+QQNAKoC9gFdAtb/b/vd/936TP/6AsD/nfqn/un1W/0dA8IEsQLvAJv2bP72+WMAkP8dAcX+nQO2AIr6bP/EABX+NgK/Bdj2IQv2AE4EUAiD/xQAnwIm/B0B/wGNAoH7sQaP/b8CiQakAqD+R/9xA477KQL//6r75v/O/pcCgQCtAiMCBQAkANAARwHf//39hgBl/kUAJgEtAUEATgA/AgoASADK/zUAJv29/vL+l/9c/0cAUwBBAE8A6QE5/87/Wv9NAOf+5v7P/5P/4/9BAKYAQwDD/zYB5v+r/zYATwAp/1v/WQAEAB0AhwA0AA0AIAA3AAEAzv/u/+//5v9m/zwAIADQ/8T/SABiANb/SwAbAFf/MQDX/7L/hP8TAPr/AgAMAAsAHwAZAI3/VgDC/9v/5//x/6P/AwBlAMv/yf82AB4A+P9WAPj/NwDi/1EA0v9JANj/JwAcAAEADABYANj/4f8MAEwAmP82AN//3P8UADYA7//6/wIACADU/ygAyv82AN7/9v/2/ygAxv/9/+3/5//n/zUA6//g/y4ADgD5/wsABwDv/xIADwAGACoAJQD3/zIA+/8FABsAFgDO/zAAHAAIABQALADp/xcACAAAAPH/GADs/wkACQAFAAgAFQDp/wIAHAD1//P/EQDw/+3/GAD9/+f/HAD8//T/DAAQAPH/HwD4//r/DwAPAOj/EQACAOn/DAAXAOX/BAAOANH/9/8MAO//9f8LANT/9f8EAO//6f8NANb/+P8KAOz/5v8MAOD/7f8UAO//7//+//7/9v8YAPj/9f/z/wsA+v8SAPD/+v/x/xYA+f8SAPb/9//3/xEABQACAPn/9//y/xQACQD///b//v/7/xIACQD9//H/AAD7/xEAAgD5//P/AwD9/w8AAgD3//D/BAD//wUA/v/0//D/BgADAAMA/P/2//f/BwAGAP7/+//2//j/CAAFAPv/+f/5//v/BwAHAPn/9//7//7/BQAFAPf/9//+/wEABAACAPf/+P8BAAIAAgAAAPj/9/8CAAMAAAD+//n/+f8EAAQA/v/8//r/+/8EAAMA/P/7//z//P8EAAIA/P/5//7//v8DAAEA+//5//////8CAAAA+//5/wEAAAABAP//+//6/wIAAQD///3//P/7/wMAAQD///3//f/9/wIAAQD9//3//v/9/wMAAQD9//z/AAD//wEAAAD9//z/AAAAAAAA///9//3/AAD//wAA/v////7/AAD//wAA////////AAD//wAA//8AAP//",
        "UklGRiQEAABXQVZFZm10IBAAAAABAAIAgLsAAADuAgAEABAAZGF0YQAEAAD+////+f////v//v///wAA/////wUAAQAIAAIABwACAHkATAAOAaMAAf9C/9X6QvwhArAAtghABW37nv/y+0wAWQNcAE8JRwSOC6AEJe8P8S/zrPWaBI/+LQA/+0L+P/4K8AgAb/8uCh78BQtC614GaQWfAin5UfzN8Tf+GQizAZ4MCQMbGJ4BoRS7AvcHyQARA6n9ZwHZ/z4DvwAZAlAB6gbNAS4GFADFATL7E/2K+j37C/xp/SD9Uv0VAOsDs//WAd3+bv7F/f79mP2X/KH+FwC0/1n+VgFcATABHQGaAET+nf8Y/hoAovpqAXj9CQKW/lsCl/4RApj+bAHk/RcAlv4BAG/+DgDi//3/GwAOAEIAq/+y/3z/8v8+/7T/Tv8//27/mgDZ/1sA+P+cAAAA/P/i/yMAi/85AMP/KgDM/9MA9P+QABoA4QAiACwACwBdAP7/TQDb/y0Ayf+SAA0AZwDg/4wA+/8/AAMAgQDp/w0ADAAQAAoANgAgAA4AKABIAB4A4v/3/+f/+v/c/+n/EADn/wgAFAAqAOz/IwDc/9//3f8XAND/2v/a/w0A5v8BANb/9P/m/wAA8P8ZAN3/RwAGAEsABgB/AP7/NAASAEgABAA3AP3/KgD9/1sA8P8lAOr/FgD1/xAA4/8kAOv/AwD4/xEA5f8NAPT/+v/3/x8A7f8PAPj/IwD5/yAA9/8ZAAEAGgD4/xoA9f8HAAMACAD0/xgA+P8AAPr/IQDp/w4A8v8HAPX/IgD1/wYA+P8GAPX/GgD3/woABQASAAcAGQDw/+v/9P8bAP3/HADs/+f/7/8LAPr//v/0//T/AgD2/wsA6P///+P/CADY//7/5v/3/wQA/v8LAPD/GgD1/yMA/P8QAOv/LADw/yQA+P8XAO7/MQD9/yEAAQAcAPD/IgD9/xMA+/8OAO//FQABAAoA+/8PAPP/FQABAAQA9/8PAPX/CAADAAEA+P8NAPv/CAAGAAUA9/8JAP//AAAFAPz/+f8HAAQA/f8FAP3//P8FAAYA+P8DAP7/+/8AAAcA9/8BAP///f///wgA9//+/wAA/v/8/wUA9//8/wIA///7/wUA+v/7/wIAAAD6/wMA/P/6/wEAAQD6/wEA/v/7/wIAAgD6////AAD7/wEAAgD7//7/AQD8/wAAAwD8//3/AwD9/wAAAgD9//z/AwD/////AgD+//z/AwAAAP7/AQD///3/AgABAP3/AAAAAP3/AgACAPz///8BAP3/AQACAP3//v8BAP7/AAABAP3//v8CAP7///8BAP7//f8CAP////8AAAAA/v8CAAAAAAAAAAAA/v8BAAAAAAD//wAA//8AAP//AAD//wAA//8AAP//",
        "UklGRiQEAABXQVZFZm10IBAAAAABAAIAgLsAAADuAgAEABAAZGF0YQAEAAAAAP//AAD//wAA//8AAAAA/////wAAAQD+////AAAGAP3/OAABAIIAAwBv//f/E/0QAK0ADQCzA/7/8P4u/0cBDQCJA6ABbQDg/w7/z/9o+Vn/SPnL/1//Ef+2+jr9RfZgA5QFZwILDFj+PAb2/nEFKgKk/R0Dlv6b/FUDsP6YAoj9SgAT/iL/tAPwAv8A0P6zAr7/dwAnAf39uP22/skA2v///2YCoP4UAUsAZgF2AJH+4P70/rz9+f+U/Xv/8v7CAcb+TACS/kwAv/+x/tX9oP71/oL/1f8nAEUAZwGtAAgAIgC/AD4BaP8GAGH/dQDF/64Arf8nAakAhAH9/+kAQQD3AFb/q/8p/yIAR/8FAPD/ZAA/AIYA3v8tADQADQBp/3f/CwABAP3/Wf8OANj/WwDH/xoAe/8DAKz/zv96/z8A3f/J/5X/IAD5//j/q//c/+//RADq//D/vv8pADUAFQDI/y8ACAAbANb/OwD3/+3/9f/e/wcAIAAeAMH/8/8xAC0AEADW/+3/HAADAPv/8P8DAOL/OwD3/xcACQAHAM//5f8XAAcAz//T/9D/HgD9////yf/e//v/AgD//9H/6/////H/+/8hAAIA9//7/w0AFgAQAPL/2v/8/xsAGQABANz/9P8YAAQA/v/y/wMA5v8YAAkAAAAAAAMA7/8KABgADwDs//j/BwATABsA8P/1//z/BAAMAAAA9P/s/xAA/v8GAAkA/v/p/wMACwALAP7/9P/p/wcADQAFAPb/7//4/w0ACAD8//b//v/1/wMACwD1//T/8P/8/wAACQDz/+f/5P8GAAkABQD5//D/+v8FAA0AAwD///T/AgACABAA/v8CAPD/+/8FAAoA9f/3//f//v8GAP7/9v/t//z/+f8AAPj/+v/3/wEA+v8HAPr//P/5/wQA//8DAPr/+P/3/wYA///+//X/+//5/wQA/f/7//X/+//4/wMA/f/8//j//v/9/wYA///8//f/AgAAAAUA/f/6//n/AwACAAIA/f/7//z/AwACAAAA/f/6//3/AgADAP7//f/7/wAAAwAFAPz////8/wMAAgAEAPv//v/+/wMAAgADAPv//v///wMAAQABAPv//f8AAAIAAAD///v//f8BAAIA///+//z//v8CAAIA/v/9//3///8CAAEA/v/9//7/AAACAAAA/v/9////AAABAAAA/f/9/wAAAQABAP///f/+/wEAAQAAAP///v/+/wEAAQD///7//v///wEAAQD///7//v///wEAAAD+//7///8AAAAAAAD+//7///8AAAAA///+//7///8AAAAA////////AAAAAP////////////8AAP//////////",
        "UklGRiQEAABXQVZFZm10IBAAAAABAAIAgLsAAADuAgAEABAAZGF0YQAEAAAAAAAAAAABAAAAAAD//////////////v////3/////////+//8////AQD9//z/9f8BAAIA+f8dACgAWQBxAJX/qv+Y/uz9aP9k/7UDUQQBAiQA4Pgi/AkB0gKaBsD/+fxp/vz9CQSp/I/+ywDO+vMD0fzK/PABcgBeBfoBv/+uAuH9Sf5gAy39awMmBWUBuP9fA9/9fgDj/2/+EACaACcCSv9Z/2j/rv7hAA0AWf55/7L84P7E/SIAT/67AMv/tf+FAA7/1v+7/gv/IP+E/sQA+P5aAXz/tP9XAFX/tP8o/4r/j//e/yQAMv9mAJT/rgCr/9X/EwCb//H/9f7F/6D/EAAoAK3//v+e/zsAh/+B/7r/if/C/2r/4P/z/6//HwCy/0IA7/9ZALT/y/80ACgA9v/J/9//DgA5ADUALQARADIACwAfAOf/NgArACMACQBBAEcAGAAjAC4AWQBUAHcAAAAfACEAIAAcAPj/CADk/yQA7v89AEEAFwD5/xYA6f8aAOX/AADF/zQADwAUAOT/BQDr/yUA6P8XAOf/HADR/0AA8P8nAAgACQDt/ycAKAAHAPH/IQDz/xsACADn//n/DgADAA4A8P///8z/GgDN/yMA/f8QANj/MwACAC0ACwAOAO3/JgAZAAUACgAAAA4AIgAaAAkADwACAAAAHQATAAUABQACAAgACwAjAO////8AAA8ABQAPAPL//f8GAAsABgAGAPD/8v8GAPz/CAD6//H/6v8PAAgABgD4//3/9v8aAAgABwD1//7//v8QAAoACAD//wUA9v8QAAoABAAFAAgAAgAJAAoAAwD//w0AAgD//wcA/v8DAAoABQAFABUABAAKAAYABwAHAA8ACgAGAAwADwAMAAkAEAAJAAgADwAMAAgADgAJAAUACQAPAAUACwAHAAEABgAIAAEABAAGAP//AgAJAAAAAgAEAP7///8IAAIA//8GAAEAAQAJAAIA/v8EAAMA//8JAAEA/v8DAAMA/v8HAAMA/f8BAAUA/v8FAAMA/v8BAAcA//8DAAMA/v8BAAYA//8CAAMA/////wcAAAAAAAMAAAD//wYAAQD+/wMAAQD//wUAAQD+/wIAAgD//wQAAgD+/wEAAwD//wMAAwD+/wEAAwD//wIAAwD//wEABAAAAAEABAD//wAABAABAAAAAwAAAAAABAABAP//AwABAAAAAwACAP//AgACAAAAAwACAP//AgACAAAAAgACAAAAAQADAAAAAQACAAAAAQADAAAAAQACAAAAAAACAAEAAAACAAEAAAACAAEAAAABAAEAAAABAAEAAAABAAEAAAABAAEAAAABAAEAAAABAAEAAAAAAAAAAAAAAAAA",
        "UklGRiQEAABXQVZFZm10IBAAAAABAAIAgLsAAADuAgAEABAAZGF0YQAEAAAAAP//AAD//wAA//8AAAAA//8AAP//AAACAAAA+f8BAAYA///4/wIA//8AAA8A/v/V/wEAEwA9AAEBRwA2AF7/kfog/3gBwv99CDYBU/qtAUX/AP7OAfkAX/o9B38FSfwaAuT14/60BAr8CQAI/tfyIQTzAXP+egdUBBwBof7TBMT8bAWi/5EEWwBRAAAKyfxE/8b88vp6ACP+PAF4/qD8MQNM/ygCJ/2XAPD9kP5gAVT/iP9I/lEB4P8qAD0BFAGa/+7/DgB2AOP98gFm/u/+Vv5/AG8ASP9gAM//qv9w//oAcv+2/jIBHgA7/6D/oAAGAKH/lADT/wAAggC8AAYAkP9yAEcAkf8BAOD/RAAr/zUANwDt/xQAJQAkAMT/zwA/AOH/xv9zAGsANQBTAIcALAAvACIATACy/xMADADg/xcAWABvAJL/7f9VAPb/EgDt/wcA4f8kAPP/5P+h/wgACQDy//r/LgAQAMn/8/9CAOX/5v/S/9//3P8pABYAuP/s/w8AFgDt/+3/7v/w/9j/5/8GAOf/2P/2//P//v8kABMAuf/m/xoADADZ/+r/3P8KAAUAKwDe/wsA3P8VAAAADgAfAB0ACAAMAF4AGgAhAPL/MwDz/0kABAAKAPX/LwAbAAkA9v/s/+3/8/8CABAAAADm//n/BQALAAUAAQDj//n/JQAVAPX/9v/+/wIAEQABAPP/8P/1/wAABgD6/+3/7//o//j/DAD8/+b/8P8IAAkABgD4//D/8P8UAAoAAwD4/wAA+f8OAAcAAAAFAPX/9v8TAAkA8v8EAPb/9/8dAA0A7/8CAPn/+f8SAAQA8/8CAOf/+v8DAAgA9P////H//P8IAAUA8//0/wIAAQAGAAgA9//7/wAA+/8EAP//+P/+////AgACAAsA8v/+/wIABQD7/wgA9v/7/wMABAD5/wAA/P/3/wEAAQD7//7//P/1/wQA///3//r////3/wMAAwD1//r/AwD6////AgD4//n/AwD8//7/AgD4//n/AwD+//3/AQD4//n/BQD///n/AAD6//j/BAABAPj/AAD9//v/AwADAPj//v/+//z/AwAEAPj//v8BAP7/AQADAPj//f8CAP////8EAPr//P8DAAAA/v8CAPv//P8DAAEA/f8BAP3//f8DAAIA/P8AAP7//f8DAAIA/P///wAA/f8BAAIA+//+/wEA//8AAAEA+//+/wEA/////wEA/P/+/wEA///+/wAA/f/9/wEAAAD9/wAA/f/+/wEAAQD8/////v/+/wAAAQD8////////////AQD9////AAD/////AAD+////AAAAAP//AAD///////8AAP//AAD//wAA//8AAP//",
    ];

    /**
     * @license
     * Copyright 2017 Google Inc. All Rights Reserved.
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *     http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    // Currently SOA and TOA are only supported.
    const SupportedAmbisonicOrder = [2, 3];
    /**
     * Omnitone HOA renderer class. Uses the optimized convolution technique.
     */
    class HOARenderer {
        /**
         * Omnitone HOA renderer class. Uses the optimized convolution technique.
         */
        constructor(context, options) {
            this.disposed = false;
            this.context = context;
            this.config = Object.assign({
                ambisonicOrder: 3,
                renderingMode: RenderingMode.Ambisonic,
            }, options);
            if (!SupportedAmbisonicOrder.includes(this.config.ambisonicOrder)) {
                log('HOARenderer: Invalid ambisonic order. (got ' +
                    this.config.ambisonicOrder + ') Fallbacks to 3rd-order ambisonic.');
                this.config.ambisonicOrder = Math.max(2, Math.min(3, this.config.ambisonicOrder));
            }
            this.config.numberOfChannels =
                (this.config.ambisonicOrder + 1) * (this.config.ambisonicOrder + 1);
            this.config.numberOfStereoChannels =
                Math.ceil(this.config.numberOfChannels / 2);
            if (this.config.hrirPathList.length !== this.config.numberOfStereoChannels) {
                throw new Error('HOARenderer: Invalid HRIR URLs. It must be an array with ' +
                    this.config.numberOfStereoChannels + ' URLs to HRIR files.' +
                    ' (got ' + options.hrirPathList + ')');
            }
            this._buildAudioGraph();
        }
        /**
         * Builds the internal audio graph.
         */
        _buildAudioGraph() {
            this.input = this.context.createGain();
            this.output = this.context.createGain();
            this.bypass = this.context.createGain();
            this.rotator = new HOARotator(this.context, this.config.ambisonicOrder);
            this.convolver =
                new HOAConvolver(this.context, this.config.ambisonicOrder);
            connect(this.input, this.rotator.input);
            connect(this.input, this.bypass);
            connect(this.rotator.output, this.convolver.input);
            connect(this.convolver.output, this.output);
            this.input.channelCount = this.config.numberOfChannels;
            this.input.channelCountMode = 'explicit';
            this.input.channelInterpretation = 'discrete';
        }
        dispose() {
            if (!this.disposed) {
                if (this.getRenderingMode() === RenderingMode.Bypass) {
                    disconnect(this.bypass, this.output);
                }
                disconnect(this.input, this.rotator.input);
                disconnect(this.input, this.bypass);
                disconnect(this.rotator.output, this.convolver.input);
                disconnect(this.convolver.output, this.output);
                this.rotator.dispose();
                this.convolver.dispose();
                this.disposed = true;
            }
        }
        /**
         * Initializes and loads the resource for the renderer.
         */
        async initialize() {
            let bufferList;
            if (this.config.hrirPathList) {
                bufferList =
                    new BufferList(this.context, this.config.hrirPathList, { dataType: BufferDataType.URL });
            }
            else {
                bufferList = this.config.ambisonicOrder === 2
                    ? new BufferList(this.context, SOAHrirBase64)
                    : new BufferList(this.context, TOAHrirBase64);
            }
            try {
                const hrirBufferList = await bufferList.load();
                this.convolver.setHRIRBufferList(hrirBufferList);
                this.setRenderingMode(this.config.renderingMode);
            }
            catch (exp) {
                const errorMessage = `HOARenderer: HRIR loading/decoding (mode: ${this.config.renderingMode}) failed. Reason: ${exp.message}`;
                throw new Error(errorMessage);
            }
        }
        /**
         * Updates the rotation matrix with 3x3 matrix.
         * @param rotationMatrix3 - A 3x3 rotation matrix. (column-major)
         */
        setRotationMatrix3(rotationMatrix3) {
            this.rotator.setRotationMatrix3(rotationMatrix3);
        }
        /**
         * Updates the rotation matrix with 4x4 matrix.
         * @param rotationMatrix4 - A 4x4 rotation matrix. (column-major)
         */
        setRotationMatrix4(rotationMatrix4) {
            this.rotator.setRotationMatrix4(rotationMatrix4);
        }
        getRenderingMode() {
            return this.config.renderingMode;
        }
        /**
         * Set the decoding mode.
         * @param mode - Decoding mode.
         *  - 'ambisonic': activates the ambisonic decoding/binaurl rendering.
         *  - 'bypass': bypasses the input stream directly to the output. No ambisonic
         *    decoding or encoding.
         *  - 'off': all the processing off saving the CPU power.
         */
        setRenderingMode(mode) {
            if (mode === this.config.renderingMode) {
                return;
            }
            if (mode === RenderingMode.Ambisonic) {
                this.convolver.enable;
            }
            else {
                this.convolver.disable();
            }
            if (mode === RenderingMode.Bypass) {
                connect(this.bypass, this.output);
            }
            else {
                disconnect(this.bypass, this.output);
            }
            this.config.renderingMode = mode;
        }
    }

    /**
     * @license
     * Copyright 2016 Google Inc. All Rights Reserved.
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *     http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * Create a FOARenderer, the first-order ambisonic decoder and the optimized
     * binaural renderer.
     */
    function createFOARenderer(context, config) {
        return new FOARenderer(context, config);
    }
    /**
     * Creates HOARenderer for higher-order ambisonic decoding and the optimized
     * binaural rendering.
     */
    function createHOARenderer(context, config) {
        return new HOARenderer(context, config);
    }

    /**
     * @license
     * Copyright 2017 Google Inc. All Rights Reserved.
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *     http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * Listener model to spatialize sources in an environment.
     */
    class Listener {
        /**
         * Listener model to spatialize sources in an environment.
         */
        constructor(context, options) {
            this.disposed = false;
            // Use defaults for undefined arguments.
            options = Object.assign({
                ambisonicOrder: DEFAULT_AMBISONIC_ORDER,
                position: copy(create(), DEFAULT_POSITION),
                forward: copy(create(), DEFAULT_FORWARD),
                up: copy(create(), DEFAULT_UP),
                renderingMode: DEFAULT_RENDERING_MODE
            }, options);
            // Member variables.
            this.position = create();
            this.tempMatrix3 = create$2();
            // Select the appropriate HRIR filters using 2-channel chunks since
            // multichannel audio is not yet supported by a majority of browsers.
            this.ambisonicOrder =
                Encoder.validateAmbisonicOrder(options.ambisonicOrder);
            // Create audio nodes.
            if (this.ambisonicOrder == 1) {
                this.renderer = createFOARenderer(context, {
                    renderingMode: options.renderingMode
                });
            }
            else if (this.ambisonicOrder > 1) {
                this.renderer = createHOARenderer(context, {
                    ambisonicOrder: this.ambisonicOrder,
                    renderingMode: options.renderingMode
                });
            }
            // These nodes are created in order to safely asynchronously load Omnitone
            // while the rest of the scene is being created.
            this.input = context.createGain();
            this.output = context.createGain();
            this.ambisonicOutput = context.createGain();
            // Initialize Omnitone (async) and connect to audio graph when complete.
            this.renderer.initialize().then(() => {
                // Connect pre-rotated soundfield to renderer.
                connect(this.input, this.renderer.input);
                // Connect rotated soundfield to ambisonic output.
                connect(this.renderer.rotator.output, this.ambisonicOutput);
                // Connect binaurally-rendered soundfield to binaural output.
                connect(this.renderer.output, this.output);
            });
            // Set orientation and update rotation matrix accordingly.
            this.setOrientation(options.forward, options.up);
        }
        dispose() {
            if (!this.disposed) {
                // Connect pre-rotated soundfield to renderer.
                disconnect(this.input, this.renderer.input);
                // Connect rotated soundfield to ambisonic output.
                disconnect(this.renderer.rotator.output, this.ambisonicOutput);
                // Connect binaurally-rendered soundfield to binaural output.
                disconnect(this.renderer.output, this.output);
                this.renderer.dispose();
                this.disposed = true;
            }
        }
        getRenderingMode() {
            return this.renderer.getRenderingMode();
        }
        setRenderingMode(mode) {
            this.renderer.setRenderingMode(mode);
        }
        /**
         * Set the source's orientation using forward and up vectors.
         */
        setOrientation(forward, up) {
            copy(F, forward);
            copy(U, up);
            cross(R, F, U);
            set$2(this.tempMatrix3, R[0], R[1], R[2], U[0], U[1], U[2], -F[0], -F[1], -F[2]);
            this.renderer.setRotationMatrix3(this.tempMatrix3);
        }
    }
    const F = create();
    const U = create();
    const R = create();

    /**
     * @license
     * Copyright 2017 Google Inc. All Rights Reserved.
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *     http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
    * Ray-tracing-based early reflections model.
    */
    class EarlyReflections {
        /**
         * Ray-tracing-based early reflections model.
         */
        constructor(context, options) {
            this.listenerPosition = copy(create(), DEFAULT_POSITION);
            this.speedOfSound = DEFAULT_SPEED_OF_SOUND;
            this.coefficients = {
                left: DEFAULT_REFLECTION_COEFFICIENTS.left,
                right: DEFAULT_REFLECTION_COEFFICIENTS.right,
                front: DEFAULT_REFLECTION_COEFFICIENTS.front,
                back: DEFAULT_REFLECTION_COEFFICIENTS.back,
                up: DEFAULT_REFLECTION_COEFFICIENTS.up,
                down: DEFAULT_REFLECTION_COEFFICIENTS.down,
            };
            this.halfDimensions = {
                width: 0.5 * DEFAULT_ROOM_DIMENSIONS.width,
                height: 0.5 * DEFAULT_ROOM_DIMENSIONS.height,
                depth: 0.5 * DEFAULT_ROOM_DIMENSIONS.depth,
            };
            this.disposed = false;
            if (options) {
                if (isGoodNumber(options.speedOfSound)) {
                    this.speedOfSound = options.speedOfSound;
                }
                if (isArray(options.listenerPosition)
                    && options.listenerPosition.length === 3
                    && isGoodNumber(options.listenerPosition[0])
                    && isGoodNumber(options.listenerPosition[1])
                    && isGoodNumber(options.listenerPosition[2])) {
                    this.listenerPosition[0] = options.listenerPosition[0];
                    this.listenerPosition[1] = options.listenerPosition[1];
                    this.listenerPosition[2] = options.listenerPosition[2];
                }
            }
            // Create nodes.
            this.input = context.createGain();
            this.output = context.createGain();
            this.lowpass = context.createBiquadFilter();
            this.merger = context.createChannelMerger(4); // First-order encoding only.
            this.delays = {
                left: context.createDelay(DEFAULT_REFLECTION_MAX_DURATION),
                right: context.createDelay(DEFAULT_REFLECTION_MAX_DURATION),
                front: context.createDelay(DEFAULT_REFLECTION_MAX_DURATION),
                back: context.createDelay(DEFAULT_REFLECTION_MAX_DURATION),
                up: context.createDelay(DEFAULT_REFLECTION_MAX_DURATION),
                down: context.createDelay(DEFAULT_REFLECTION_MAX_DURATION)
            };
            this.gains = {
                left: context.createGain(),
                right: context.createGain(),
                front: context.createGain(),
                back: context.createGain(),
                up: context.createGain(),
                down: context.createGain()
            };
            this.inverters = {
                right: context.createGain(),
                back: context.createGain(),
                down: context.createGain()
            };
            // Connect audio graph for each wall reflection and initialize encoder directions, set delay times and gains to 0.
            for (const direction of Object.values(Direction)) {
                const delay = this.delays[direction];
                const gain = this.gains[direction];
                delay.delayTime.value = 0;
                gain.gain.value = 0;
                this.delays[direction] = delay;
                this.gains[direction] = gain;
                connect(this.lowpass, delay);
                connect(delay, gain);
                connect(gain, this.merger, 0, 0);
                // Initialize inverters for opposite walls ('right', 'down', 'back' only).
                if (direction === Direction.Right
                    || direction == Direction.Back
                    || direction === Direction.Down) {
                    this.inverters[direction].gain.value = -1;
                }
            }
            connect(this.input, this.lowpass);
            // Initialize lowpass filter.
            this.lowpass.type = 'lowpass';
            this.lowpass.frequency.value = DEFAULT_REFLECTION_CUTOFF_FREQUENCY;
            this.lowpass.Q.value = 0;
            // Connect nodes.
            // Connect gains to ambisonic channel output.
            // Left: [1 1 0 0]
            // Right: [1 -1 0 0]
            // Up: [1 0 1 0]
            // Down: [1 0 -1 0]
            // Front: [1 0 0 1]
            // Back: [1 0 0 -1]
            connect(this.gains.left, this.merger, 0, 1);
            connect(this.gains.right, this.inverters.right);
            connect(this.inverters.right, this.merger, 0, 1);
            connect(this.gains.up, this.merger, 0, 2);
            connect(this.gains.down, this.inverters.down);
            connect(this.inverters.down, this.merger, 0, 2);
            connect(this.gains.front, this.merger, 0, 3);
            connect(this.gains.back, this.inverters.back);
            connect(this.inverters.back, this.merger, 0, 3);
            connect(this.merger, this.output);
            // Initialize.
            this.setRoomProperties(options && options.dimensions, options && options.coefficients);
        }
        dispose() {
            if (!this.disposed) {
                // Connect nodes.
                disconnect(this.input, this.lowpass);
                for (const property of Object.values(Direction)) {
                    const delay = this.delays[property];
                    const gain = this.gains[property];
                    disconnect(this.lowpass, delay);
                    disconnect(delay, gain);
                    disconnect(gain, this.merger, 0, 0);
                }
                // Connect gains to ambisonic channel output.
                // Left: [1 1 0 0]
                // Right: [1 -1 0 0]
                // Up: [1 0 1 0]
                // Down: [1 0 -1 0]
                // Front: [1 0 0 1]
                // Back: [1 0 0 -1]
                disconnect(this.gains.left, this.merger, 0, 1);
                disconnect(this.gains.right, this.inverters.right);
                disconnect(this.inverters.right, this.merger, 0, 1);
                disconnect(this.gains.up, this.merger, 0, 2);
                disconnect(this.gains.down, this.inverters.down);
                disconnect(this.inverters.down, this.merger, 0, 2);
                disconnect(this.gains.front, this.merger, 0, 3);
                disconnect(this.gains.back, this.inverters.back);
                disconnect(this.inverters.back, this.merger, 0, 3);
                disconnect(this.merger, this.output);
                this.disposed = true;
            }
        }
        /**
         * Set the room's properties which determines the characteristics of
         * reflections.
         * @param dimensions
         * Room dimensions (in meters). Defaults to
         * {@linkcode DEFAULT_ROOM_DIMENSIONS DEFAULT_ROOM_DIMENSIONS}.
         * @param coefficients
         * Frequency-independent reflection coeffs per wall. Defaults to
         * {@linkcode DEFAULT_REFLECTION_COEFFICIENTS
         * DEFAULT_REFLECTION_COEFFICIENTS}.
         */
        setRoomProperties(dimensions, coefficients) {
            if (!dimensions) {
                dimensions = {
                    width: DEFAULT_ROOM_DIMENSIONS.width,
                    height: DEFAULT_ROOM_DIMENSIONS.height,
                    depth: DEFAULT_ROOM_DIMENSIONS.depth,
                };
            }
            if (isGoodNumber(dimensions.width)
                && isGoodNumber(dimensions.height)
                && isGoodNumber(dimensions.depth)) {
                this.halfDimensions.width = 0.5 * dimensions.width;
                this.halfDimensions.height = 0.5 * dimensions.height;
                this.halfDimensions.depth = 0.5 * dimensions.depth;
            }
            if (!coefficients) {
                coefficients = {
                    left: DEFAULT_REFLECTION_COEFFICIENTS.left,
                    right: DEFAULT_REFLECTION_COEFFICIENTS.right,
                    front: DEFAULT_REFLECTION_COEFFICIENTS.front,
                    back: DEFAULT_REFLECTION_COEFFICIENTS.back,
                    up: DEFAULT_REFLECTION_COEFFICIENTS.up,
                    down: DEFAULT_REFLECTION_COEFFICIENTS.down,
                };
            }
            if (isGoodNumber(coefficients.left)
                && isGoodNumber(coefficients.right)
                && isGoodNumber(coefficients.front)
                && isGoodNumber(coefficients.back)
                && isGoodNumber(coefficients.up)
                && isGoodNumber(coefficients.down)) {
                this.coefficients.left = coefficients.left;
                this.coefficients.right = coefficients.right;
                this.coefficients.front = coefficients.front;
                this.coefficients.back = coefficients.back;
                this.coefficients.up = coefficients.up;
                this.coefficients.down = coefficients.down;
            }
            // Update listener position with new room properties.
            this.setListenerPosition(this.listenerPosition);
        }
        /**
         * Set the listener's position (in meters),
         * where [0,0,0] is the center of the room.
         */
        setListenerPosition(v) {
            // Assign listener position.
            copy(this.listenerPosition, v);
            // Assign delay & attenuation values using distances.
            for (const direction of Object.values(Direction)) {
                const dim = this.halfDimensions[DirectionToDimension[direction]];
                const axis = this.listenerPosition[DirectionToAxis[direction]];
                const sign = DirectionSign[direction];
                const distance = DEFAULT_REFLECTION_MULTIPLIER * Math.max(0, dim + sign * axis) + DEFAULT_REFLECTION_MIN_DISTANCE;
                // Compute and assign delay (in seconds).
                const delayInSecs = distance / this.speedOfSound;
                this.delays[direction].delayTime.value = delayInSecs;
                // Compute and assign gain, uses logarithmic rolloff: "g = R / (d + 1)"
                const attenuation = this.coefficients[direction] / distance;
                this.gains[direction].gain.value = attenuation;
            }
        }
    }

    /**
     * @license
     * Copyright 2017 Google Inc. All Rights Reserved.
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *     http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * Late-reflections reverberation filter for Ambisonic content.
     */
    class LateReflections {
        /**
        * Late-reflections reverberation filter for Ambisonic content.
        */
        constructor(context, options) {
            this.disposed = false;
            // Use defaults for undefined arguments.
            options = Object.assign({
                durations: DEFAULT_REVERB_DURATIONS.slice(),
                predelay: DEFAULT_REVERB_PREDELAY,
                gain: DEFAULT_REVERB_GAIN,
                bandwidth: DEFAULT_REVERB_BANDWIDTH,
                tailonset: DEFAULT_REVERB_TAIL_ONSET
            }, options);
            // Assign pre-computed variables.
            const delaySecs = options.predelay / 1000;
            this.bandwidthCoeff = options.bandwidth * LOG2_DIV2;
            this.tailonsetSamples = options.tailonset / 1000;
            // Create nodes.
            this.context = context;
            this.input = context.createGain();
            this.predelay = context.createDelay(delaySecs);
            this.convolver = context.createConvolver();
            this.output = context.createGain();
            // Set reverb attenuation.
            this.output.gain.value = options.gain;
            // Disable normalization.
            this.convolver.normalize = false;
            // Connect nodes.
            connect(this.input, this.predelay);
            connect(this.predelay, this.convolver);
            connect(this.convolver, this.output);
            // Compute IR using RT60 values.
            this.setDurations(options.durations);
        }
        dispose() {
            if (!this.disposed) {
                disconnect(this.input, this.predelay);
                disconnect(this.predelay, this.convolver);
                disconnect(this.convolver, this.output);
                this.disposed = true;
            }
        }
        /**
         * Re-compute a new impulse response by providing Multiband RT60 durations.
         * @param durations
         * Multiband RT60 durations (in seconds) for each frequency band, listed as
         * {@linkcode DEFAULT_REVERB_FREQUENCY_BANDS
         * DEFAULT_REVERB_FREQUENCY_BANDS}.
         */
        setDurations(durations) {
            if (durations.length !== NUMBER_REVERB_FREQUENCY_BANDS) {
                log$1('Warning: invalid number of RT60 values provided to reverb.');
                return;
            }
            // Compute impulse response.
            const durationsSamples = new Float32Array(NUMBER_REVERB_FREQUENCY_BANDS);
            const sampleRate = this.context.sampleRate;
            for (let i = 0; i < durations.length; i++) {
                // Clamp within suitable range.
                durations[i] =
                    Math.max(0, Math.min(DEFAULT_REVERB_MAX_DURATION, durations[i]));
                // Convert seconds to samples.
                durationsSamples[i] = Math.round(durations[i] * sampleRate *
                    DEFAULT_REVERB_DURATION_MULTIPLIER);
            }
            // Determine max RT60 length in samples.
            let durationsSamplesMax = 0;
            for (let i = 0; i < durationsSamples.length; i++) {
                if (durationsSamples[i] > durationsSamplesMax) {
                    durationsSamplesMax = durationsSamples[i];
                }
            }
            // Skip this step if there is no reverberation to compute.
            if (durationsSamplesMax < 1) {
                durationsSamplesMax = 1;
            }
            // Create impulse response buffer.
            const buffer = this.context.createBuffer(1, durationsSamplesMax, sampleRate);
            const bufferData = buffer.getChannelData(0);
            // Create noise signal (computed once, referenced in each band's routine).
            const noiseSignal = new Float32Array(durationsSamplesMax);
            for (let i = 0; i < durationsSamplesMax; i++) {
                noiseSignal[i] = Math.random() * 2 - 1;
            }
            // Compute the decay rate per-band and filter the decaying noise signal.
            for (let i = 0; i < NUMBER_REVERB_FREQUENCY_BANDS; i++) {
                // Compute decay rate.
                const decayRate = -LOG1000 / durationsSamples[i];
                // Construct a standard one-zero, two-pole bandpass filter:
                // H(z) = (b0 * z^0 + b1 * z^-1 + b2 * z^-2) / (1 + a1 * z^-1 + a2 * z^-2)
                const omega = TWO_PI *
                    DEFAULT_REVERB_FREQUENCY_BANDS[i] / sampleRate;
                const sinOmega = Math.sin(omega);
                const alpha = sinOmega * Math.sinh(this.bandwidthCoeff * omega / sinOmega);
                const a0CoeffReciprocal = 1 / (1 + alpha);
                const b0Coeff = alpha * a0CoeffReciprocal;
                const a1Coeff = -2 * Math.cos(omega) * a0CoeffReciprocal;
                const a2Coeff = (1 - alpha) * a0CoeffReciprocal;
                // We optimize since b2 = -b0, b1 = 0.
                // Update equation for two-pole bandpass filter:
                //   u[n] = x[n] - a1 * x[n-1] - a2 * x[n-2]
                //   y[n] = b0 * (u[n] - u[n-2])
                let um1 = 0;
                let um2 = 0;
                for (let j = 0; j < durationsSamples[i]; j++) {
                    // Exponentially-decaying white noise.
                    const x = noiseSignal[j] * Math.exp(decayRate * j);
                    // Filter signal with bandpass filter and add to output.
                    const u = x - a1Coeff * um1 - a2Coeff * um2;
                    bufferData[j] += b0Coeff * (u - um2);
                    // Update coefficients.
                    um2 = um1;
                    um1 = u;
                }
            }
            // Create and apply half of a Hann window to the beginning of the
            // impulse response.
            const halfHannLength = Math.round(this.tailonsetSamples);
            for (let i = 0; i < Math.min(bufferData.length, halfHannLength); i++) {
                const halfHann = 0.5 * (1 - Math.cos(TWO_PI * i / (2 * halfHannLength - 1)));
                bufferData[i] *= halfHann;
            }
            this.convolver.buffer = buffer;
        }
    }

    /**
     * @license
     * Copyright 2017 Google Inc. All Rights Reserved.
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *     http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * Generate absorption coefficients from material names.
     */
    function _getCoefficientsFromMaterials(materials) {
        // Initialize coefficients to use defaults.
        const coefficients = {
            [Direction.Left]: null,
            [Direction.Right]: null,
            [Direction.Front]: null,
            [Direction.Back]: null,
            [Direction.Up]: null,
            [Direction.Down]: null
        };
        for (const property of Object.values(Direction)) {
            const material = DEFAULT_ROOM_MATERIALS[property];
            coefficients[property] = ROOM_MATERIAL_COEFFICIENTS[material];
        }
        // Sanitize materials.
        if (materials == undefined) {
            materials = Object.assign({}, materials, DEFAULT_ROOM_MATERIALS);
        }
        // Assign coefficients using provided materials.
        for (const property of Object.values(Direction)) {
            if (materials[property] in ROOM_MATERIAL_COEFFICIENTS) {
                coefficients[property] =
                    ROOM_MATERIAL_COEFFICIENTS[materials[property]];
            }
            else {
                log$1('Material \"' + materials[property] + '\" on wall \"' +
                    property + '\" not found. Using \"' +
                    DEFAULT_ROOM_MATERIALS[property] + '\".');
            }
        }
        return coefficients;
    }
    /**
     * Sanitize coefficients.
     * @param coefficients
     * @return {Object}
     */
    function _sanitizeCoefficients(coefficients) {
        if (coefficients == undefined) {
            coefficients = {
                [Direction.Left]: null,
                [Direction.Right]: null,
                [Direction.Front]: null,
                [Direction.Back]: null,
                [Direction.Up]: null,
                [Direction.Down]: null
            };
        }
        for (const property of Object.values(Direction)) {
            if (!(coefficients.hasOwnProperty(property))) {
                // If element is not present, use default coefficients.
                coefficients[property] = ROOM_MATERIAL_COEFFICIENTS[DEFAULT_ROOM_MATERIALS[property]];
            }
        }
        return coefficients;
    }
    /**
     * Sanitize dimensions.
     * @param dimensions
     * @return {RoomDimensions}
     */
    function _sanitizeDimensions(dimensions) {
        if (dimensions == undefined) {
            dimensions = {
                width: DEFAULT_ROOM_DIMENSIONS.width,
                height: DEFAULT_ROOM_DIMENSIONS.height,
                depth: DEFAULT_ROOM_DIMENSIONS.depth
            };
        }
        else {
            for (const dimension of Object.values(Dimension)) {
                if (!dimensions.hasOwnProperty(dimension)) {
                    dimensions[dimension] = DEFAULT_ROOM_DIMENSIONS[dimension];
                }
            }
        }
        return dimensions;
    }
    /**
     * Compute frequency-dependent reverb durations.
     */
    function _getDurationsFromProperties(dimensions, coefficients, speedOfSound) {
        const durations = new Float32Array(NUMBER_REVERB_FREQUENCY_BANDS);
        // Sanitize inputs.
        dimensions = _sanitizeDimensions(dimensions);
        coefficients = _sanitizeCoefficients(coefficients);
        if (speedOfSound == undefined) {
            speedOfSound = DEFAULT_SPEED_OF_SOUND;
        }
        // Acoustic constant.
        const k = TWENTY_FOUR_LOG10 / speedOfSound;
        // Compute volume, skip if room is not present.
        const volume = dimensions.width * dimensions.height * dimensions.depth;
        if (volume < ROOM_MIN_VOLUME) {
            return durations;
        }
        // Room surface area.
        const leftRightArea = dimensions.width * dimensions.height;
        const floorCeilingArea = dimensions.width * dimensions.depth;
        const frontBackArea = dimensions.depth * dimensions.height;
        const totalArea = 2 * (leftRightArea + floorCeilingArea + frontBackArea);
        for (let i = 0; i < NUMBER_REVERB_FREQUENCY_BANDS; i++) {
            // Effective absorptive area.
            const absorbtionArea = (coefficients.left[i] + coefficients.right[i]) * leftRightArea +
                (coefficients.down[i] + coefficients.up[i]) * floorCeilingArea +
                (coefficients.front[i] + coefficients.back[i]) * frontBackArea;
            const meanAbsorbtionArea = absorbtionArea / totalArea;
            // Compute reverberation using Eyring equation [1].
            // [1] Beranek, Leo L. "Analysis of Sabine and Eyring equations and their
            //     application to concert hall audience and chair absorption." The
            //     Journal of the Acoustical Society of America, Vol. 120, No. 3.
            //     (2006), pp. 1399-1399.
            durations[i] = ROOM_EYRING_CORRECTION_COEFFICIENT * k * volume /
                (-totalArea * Math.log(1 - meanAbsorbtionArea) + 4 *
                    ROOM_AIR_ABSORPTION_COEFFICIENTS[i] * volume);
        }
        return durations;
    }
    /**
     * Compute reflection coefficients from absorption coefficients.
     * @param absorptionCoefficients
     * @return {Object}
     */
    function _computeReflectionCoefficients(absorptionCoefficients) {
        const reflectionCoefficients = {
            [Direction.Left]: 0,
            [Direction.Right]: 0,
            [Direction.Front]: 0,
            [Direction.Back]: 0,
            [Direction.Up]: 0,
            [Direction.Down]: 0
        };
        for (const property of Object.values(Direction)) {
            if (DEFAULT_REFLECTION_COEFFICIENTS
                .hasOwnProperty(property)) {
                // Compute average absorption coefficient (per wall).
                reflectionCoefficients[property] = 0;
                for (let j = 0; j < NUMBER_REFLECTION_AVERAGING_BANDS; j++) {
                    const bandIndex = j + ROOM_STARTING_AVERAGING_BAND;
                    reflectionCoefficients[property] +=
                        absorptionCoefficients[property][bandIndex];
                }
                reflectionCoefficients[property] /=
                    NUMBER_REFLECTION_AVERAGING_BANDS;
                // Convert absorption coefficient to reflection coefficient.
                reflectionCoefficients[property] =
                    Math.sqrt(1 - reflectionCoefficients[property]);
            }
        }
        return reflectionCoefficients;
    }
    /**
     * Model that manages early and late reflections using acoustic
     * properties and listener position relative to a rectangular room.
     **/
    class Room {
        constructor(context, options) {
            // Use defaults for undefined arguments.
            options = Object.assign({
                listenerPosition: copy(create(), DEFAULT_POSITION),
                dimensions: Object.assign({}, options.dimensions, DEFAULT_ROOM_DIMENSIONS),
                materials: Object.assign({}, options.materials, DEFAULT_ROOM_MATERIALS),
                speedOfSound: DEFAULT_SPEED_OF_SOUND
            }, options);
            // Sanitize room-properties-related arguments.
            options.dimensions = _sanitizeDimensions(options.dimensions);
            const absorptionCoefficients = _getCoefficientsFromMaterials(options.materials);
            const reflectionCoefficients = _computeReflectionCoefficients(absorptionCoefficients);
            const durations = _getDurationsFromProperties(options.dimensions, absorptionCoefficients, options.speedOfSound);
            // Construct submodules for early and late reflections.
            this.early = new EarlyReflections(context, {
                dimensions: options.dimensions,
                coefficients: reflectionCoefficients,
                speedOfSound: options.speedOfSound,
                listenerPosition: options.listenerPosition,
            });
            this.late = new LateReflections(context, {
                durations: durations,
            });
            this.speedOfSound = options.speedOfSound;
            // Construct auxillary audio nodes.
            this.output = context.createGain();
            connect(this.early.output, this.output);
            this._merger = context.createChannelMerger(4);
            connect(this.late.output, this._merger, 0, 0);
            connect(this._merger, this.output);
        }
        dispose() {
            disconnect(this.early.output, this.output);
            disconnect(this.late.output, this._merger, 0, 0);
            disconnect(this._merger, this.output);
        }
        /**
         * Set the room's dimensions and wall materials.
         * @param dimensions Room dimensions (in meters). Defaults to
         * {@linkcode DEFAULT_ROOM_DIMENSIONS DEFAULT_ROOM_DIMENSIONS}.
         * @param materials Named acoustic materials per wall. Defaults to
         * {@linkcode DEFAULT_ROOM_MATERIALS DEFAULT_ROOM_MATERIALS}.
         */
        setProperties(dimensions, materials) {
            // Compute late response.
            const absorptionCoefficients = _getCoefficientsFromMaterials(materials);
            const durations = _getDurationsFromProperties(dimensions, absorptionCoefficients, this.speedOfSound);
            this.late.setDurations(durations);
            // Compute early response.
            this.early.speedOfSound = this.speedOfSound;
            const reflectionCoefficients = _computeReflectionCoefficients(absorptionCoefficients);
            this.early.setRoomProperties(dimensions, reflectionCoefficients);
        }
        /**
         * Set the listener's position (in meters), where origin is the center of
         * the room.
         */
        setListenerPosition(v) {
            this.early.speedOfSound = this.speedOfSound;
            this.early.setListenerPosition(v);
            // Disable room effects if the listener is outside the room boundaries.
            const distance = this.getDistanceOutsideRoom(v);
            let gain = 1;
            if (distance > EPSILON_FLOAT) {
                gain = 1 - distance / LISTENER_MAX_OUTSIDE_ROOM_DISTANCE;
                // Clamp gain between 0 and 1.
                gain = Math.max(0, Math.min(1, gain));
            }
            this.output.gain.value = gain;
        }
        /**
         * Compute distance outside room of provided position (in meters). Returns
         * Distance outside room (in meters). Returns 0 if inside room.
         */
        getDistanceOutsideRoom(v) {
            const dx = Math.max(0, -this.early.halfDimensions.width - v[0], v[0] - this.early.halfDimensions.width);
            const dy = Math.max(0, -this.early.halfDimensions.height - v[1], v[1] - this.early.halfDimensions.height);
            const dz = Math.max(0, -this.early.halfDimensions.depth - v[2], v[2] - this.early.halfDimensions.depth);
            return Math.sqrt(dx * dx + dy * dy + dz * dz);
        }
    }

    /**
     * @license
     * Copyright 2017 Google Inc. All Rights Reserved.
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *     http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * Distance-based attenuation filter.
     */
    class Attenuation {
        /**
         * Distance-based attenuation filter.
         */
        constructor(context, options) {
            this.minDistance = DEFAULT_MIN_DISTANCE;
            this.maxDistance = DEFAULT_MAX_DISTANCE;
            this.rolloff = DEFAULT_ATTENUATION_ROLLOFF;
            if (options) {
                if (isGoodNumber(options.minDistance)) {
                    this.minDistance = options.minDistance;
                }
                if (isGoodNumber(options.maxDistance)) {
                    this.maxDistance = options.maxDistance;
                }
                if (options.rolloff) {
                    this.rolloff = options.rolloff;
                }
            }
            // Assign values.
            this.setRolloff(this.rolloff);
            // Create node.
            this.gainNode = context.createGain();
            // Initialize distance to max distance.
            this.setDistance(this.maxDistance);
            // Input/Output proxy.
            this.input = this.gainNode;
            this.output = this.gainNode;
        }
        /**
         * Set distance from the listener.
         * @param distance Distance (in meters).
         */
        setDistance(distance) {
            let gain = 1;
            if (this.rolloff == 'logarithmic') {
                if (distance > this.maxDistance) {
                    gain = 0;
                }
                else if (distance > this.minDistance) {
                    let range = this.maxDistance - this.minDistance;
                    if (range > EPSILON_FLOAT) {
                        // Compute the distance attenuation value by the logarithmic curve
                        // "1 / (d + 1)" with an offset of |minDistance|.
                        let relativeDistance = distance - this.minDistance;
                        let attenuation = 1 / (relativeDistance + 1);
                        let attenuationMax = 1 / (range + 1);
                        gain = (attenuation - attenuationMax) / (1 - attenuationMax);
                    }
                }
            }
            else if (this.rolloff == 'linear') {
                if (distance > this.maxDistance) {
                    gain = 0;
                }
                else if (distance > this.minDistance) {
                    let range = this.maxDistance - this.minDistance;
                    if (range > EPSILON_FLOAT) {
                        gain = (this.maxDistance - distance) / range;
                    }
                }
            }
            this.gainNode.gain.value = gain;
        }
        /**
         * Set rolloff.
         * @param rolloff
         * Rolloff model to use, chosen from options in
         * {@linkcode ATTENUATION_ROLLOFFS ATTENUATION_ROLLOFFS}.
         */
        setRolloff(rolloff) {
            if (rolloff == null) {
                rolloff = DEFAULT_ATTENUATION_ROLLOFF;
            }
            this.rolloff = rolloff;
        }
    }

    /**
     * @license
     * Copyright 2017 Google Inc. All Rights Reserved.
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *     http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    const forwardNorm = create();
    const directionNorm = create();
    /**
     * Directivity/occlusion filter.
     **/
    class Directivity {
        constructor(context, options) {
            this.cosTheta = 0;
            // Use defaults for undefined arguments.
            options = Object.assign({
                alpha: DEFAULT_DIRECTIVITY_ALPHA,
                sharpness: DEFAULT_DIRECTIVITY_SHARPNESS
            }, options);
            // Create audio node.
            this.context = context;
            this.lowpass = context.createBiquadFilter();
            // Initialize filter coefficients.
            this.lowpass.type = 'lowpass';
            this.lowpass.Q.value = 0;
            this.lowpass.frequency.value = context.sampleRate * 0.5;
            this.setPattern(options.alpha, options.sharpness);
            // Input/Output proxy.
            this.input = this.lowpass;
            this.output = this.lowpass;
        }
        /**
         * Compute the filter using the source's forward orientation and the listener's
         * position.
         * @param forward The source's forward vector.
         * @param direction The direction from the source to the
         * listener.
         */
        computeAngle(forward, direction) {
            normalize(forwardNorm, forward);
            normalize(directionNorm, direction);
            let coeff = 1;
            if (this.alpha > EPSILON_FLOAT) {
                let cosTheta = dot(forwardNorm, directionNorm);
                coeff = (1 - this.alpha) + this.alpha * cosTheta;
                coeff = Math.pow(Math.abs(coeff), this.sharpness);
            }
            this.lowpass.frequency.value = this.context.sampleRate * 0.5 * coeff;
        }
        /**
         * Set source's directivity pattern (defined by alpha), where 0 is an
         * omnidirectional pattern, 1 is a bidirectional pattern, 0.5 is a cardiod
         * pattern. The sharpness of the pattern is increased exponenentially.
         * @param alpha
         * Determines directivity pattern (0 to 1).
         * @param sharpness
         * Determines the sharpness of the directivity pattern (1 to Inf).
         * DEFAULT_DIRECTIVITY_SHARPNESS}.
         */
        setPattern(alpha, sharpness) {
            // Clamp and set values.
            this.alpha = Math.min(1, Math.max(0, alpha));
            this.sharpness = Math.max(1, sharpness);
            // Update angle calculation using new values.
            this.computeAngle(set(forwardNorm, this.cosTheta * this.cosTheta, 0, 0), set(directionNorm, 1, 0, 0));
        }
    }

    /**
     * @license
     * Copyright 2017 Google Inc. All Rights Reserved.
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *     http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * Determine the distance a source is outside of a room. Attenuate gain going
     * to the reflections and reverb when the source is outside of the room.
     * @param distance Distance in meters.
     * @return Gain (linear) of source.
     */
    function _computeDistanceOutsideRoom(distance) {
        // We apply a linear ramp from 1 to 0 as the source is up to 1m outside.
        let gain = 1;
        if (distance > EPSILON_FLOAT) {
            gain = 1 - distance / SOURCE_MAX_OUTSIDE_ROOM_DISTANCE;
            // Clamp gain between 0 and 1.
            gain = Math.max(0, Math.min(1, gain));
        }
        return gain;
    }
    /**
     * Source model to spatialize an audio buffer.
     */
    class Source {
        /**
         * Source model to spatialize an audio buffer.
         * @param scene Associated ResonanceAudio instance.
         * @param options
         * Options for constructing a new Source.
         */
        constructor(scene, options) {
            // Use defaults for undefined arguments.
            options = Object.assign({
                position: copy(create(), DEFAULT_POSITION),
                forward: copy(create(), DEFAULT_FORWARD),
                up: copy(create(), DEFAULT_UP),
                minDistance: DEFAULT_MIN_DISTANCE,
                maxDistance: DEFAULT_MAX_DISTANCE,
                rolloff: DEFAULT_ATTENUATION_ROLLOFF,
                gain: DEFAULT_SOURCE_GAIN,
                alpha: DEFAULT_DIRECTIVITY_ALPHA,
                sharpness: DEFAULT_DIRECTIVITY_SHARPNESS,
                sourceWidth: DEFAULT_SOURCE_WIDTH,
            }, options);
            // Member variables.
            this.scene = scene;
            this.position = options.position;
            this.forward = options.forward;
            this.up = options.up;
            this.dx = create();
            this.right = create();
            cross(this.right, this.forward, this.up);
            // Create audio nodes.
            let context = scene.context;
            this.input = context.createGain();
            this.directivity = new Directivity(context, {
                alpha: options.alpha,
                sharpness: options.sharpness,
            });
            this.toEarly = context.createGain();
            this.toLate = context.createGain();
            this.attenuation = new Attenuation(context, {
                minDistance: options.minDistance,
                maxDistance: options.maxDistance,
                rolloff: options.rolloff,
            });
            this.encoder = new Encoder(context, {
                ambisonicOrder: scene.ambisonicOrder,
                sourceWidth: options.sourceWidth,
            });
            // Connect nodes.
            connect(this.input, this.toLate);
            connect(this.toLate, scene.room.late.input);
            connect(this.input, this.attenuation.input);
            connect(this.attenuation.output, this.toEarly);
            connect(this.toEarly, scene.room.early.input);
            connect(this.attenuation.output, this.directivity.input);
            connect(this.directivity.output, this.encoder.input);
            // Assign initial conditions.
            this.setPosition(options.position);
            this.input.gain.value = options.gain;
        }
        get output() {
            return this.encoder.output;
        }
        dispose() {
            disconnect(this.directivity.output, this.encoder.input);
            disconnect(this.attenuation.output, this.directivity.input);
            disconnect(this.toEarly, this.scene.room.early.input);
            disconnect(this.attenuation.output, this.toEarly);
            disconnect(this.input, this.attenuation.input);
            disconnect(this.toLate, this.scene.room.late.input);
            disconnect(this.input, this.toLate);
            this.encoder.dispose();
        }
        // Update the source when changing the listener's position.
        update() {
            // Compute distance to listener.
            subtract(this.dx, this.position, this.scene.listener.position);
            const distance = length(this.dx);
            normalize(this.dx, this.dx);
            // Compuete angle of direction vector.
            const azimuth = RADIANS_TO_DEGREES * Math.atan2(-this.dx[0], this.dx[2]);
            const elevation = RADIANS_TO_DEGREES * Math.atan2(this.dx[1], Math.sqrt(this.dx[0] * this.dx[0] + this.dx[2] * this.dx[2]));
            // Set distance/directivity/direction values.
            this.attenuation.setDistance(distance);
            this.directivity.computeAngle(this.forward, this.dx);
            this.encoder.setDirection(azimuth, elevation);
        }
        /**
         * Set source's rolloff.
         * @param rolloff
         * Rolloff model to use, chosen from options in
         * {@linkcode ATTENUATION_ROLLOFFS ATTENUATION_ROLLOFFS}.
         */
        setRolloff(rolloff) {
            this.attenuation.setRolloff(rolloff);
        }
        /**
         * Set source's minimum distance (in meters).
         */
        setMinDistance(minDistance) {
            this.attenuation.minDistance = minDistance;
        }
        /**
         * Set source's maximum distance (in meters).
         */
        setMaxDistance(maxDistance) {
            this.attenuation.maxDistance = maxDistance;
        }
        /**
         * Set source's gain (linear).
         */
        setGain(gain) {
            this.input.gain.value = gain;
        }
        /**
         * Set source's position (in meters), where origin is the center of
         * the room.
         */
        setPosition(v) {
            // Assign new position.
            copy(this.position, v);
            // Handle far-field effect.
            let distance = this.scene.room.getDistanceOutsideRoom(this.position);
            let gain = _computeDistanceOutsideRoom(distance);
            this.toLate.gain.value = gain;
            this.toEarly.gain.value = gain;
            this.update();
        }
        /**
         * Set the source's orientation using forward and up vectors.
         */
        setOrientation(forward, up) {
            copy(this.forward, forward);
            copy(this.up, up);
            cross(this.right, this.forward, this.up);
        }
        /**
         * Set the source width (in degrees). Where 0 degrees is a point source and 360
         * degrees is an omnidirectional source.
         */
        setSourceWidth(sourceWidth) {
            this.encoder.setSourceWidth(sourceWidth);
            this.setPosition(this.position);
        }
        /**
         * Set source's directivity pattern (defined by alpha), where 0 is an
         * omnidirectional pattern, 1 is a bidirectional pattern, 0.5 is a cardiod
         * pattern. The sharpness of the pattern is increased exponentially.
         * @param alpha - Determines directivity pattern (0 to 1).
         * @param sharpness - Determines the sharpness of the directivity pattern (1 to Inf).
         */
        setDirectivityPattern(alpha, sharpness) {
            this.directivity.setPattern(alpha, sharpness);
            this.setPosition(this.position);
        }
    }

    /**
     * @license
     * Copyright 2017 Google Inc. All Rights Reserved.
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *     http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * Main class for managing sources, room and listener models.
     */
    class ResonanceAudio {
        /**
         * Main class for managing sources, room and listener models.
         * @param context
         * Associated {@link
        https://developer.mozilla.org/en-US/docs/Web/API/AudioContext AudioContext}.
         * @param options
         * Options for constructing a new ResonanceAudio scene.
         */
        constructor(context, options) {
            this.disposed = false;
            // Use defaults for undefined arguments.
            options = Object.assign({
                ambisonicOrder: DEFAULT_AMBISONIC_ORDER,
                listenerPosition: copy(create(), DEFAULT_POSITION),
                listenerForward: copy(create(), DEFAULT_FORWARD),
                listenerUp: copy(create(), DEFAULT_UP),
                dimensions: Object.assign({}, options.dimensions, DEFAULT_ROOM_DIMENSIONS),
                materials: Object.assign({}, options.materials, DEFAULT_ROOM_MATERIALS),
                speedOfSound: DEFAULT_SPEED_OF_SOUND,
                renderingMode: DEFAULT_RENDERING_MODE
            }, options);
            // Create member submodules.
            this.ambisonicOrder = Encoder.validateAmbisonicOrder(options.ambisonicOrder);
            this._sources = new Array();
            this.room = new Room(context, {
                listenerPosition: options.listenerPosition,
                dimensions: options.dimensions,
                materials: options.materials,
                speedOfSound: options.speedOfSound,
            });
            this.listener = new Listener(context, {
                ambisonicOrder: options.ambisonicOrder,
                position: options.listenerPosition,
                forward: options.listenerForward,
                up: options.listenerUp,
                renderingMode: options.renderingMode
            });
            // Create auxillary audio nodes.
            this.context = context;
            this.output = context.createGain();
            this.ambisonicOutput = context.createGain();
            this.ambisonicInput = this.listener.input;
            // Connect audio graph.
            connect(this.room.output, this.listener.input);
            connect(this.listener.output, this.output);
            connect(this.listener.ambisonicOutput, this.ambisonicOutput);
        }
        getRenderingMode() {
            return this.listener.getRenderingMode();
        }
        setRenderingMode(mode) {
            this.listener.setRenderingMode(mode);
        }
        dispose() {
            if (!this.disposed) {
                disconnect(this.room.output, this.listener.input);
                disconnect(this.listener.output, this.output);
                disconnect(this.listener.ambisonicOutput, this.ambisonicOutput);
                this.disposed = true;
            }
        }
        /**
         * Create a new source for the scene.
         * @param options
         * Options for constructing a new Source.
         * @return {Source}
         */
        createSource(options) {
            // Create a source and push it to the internal sources array, returning
            // the object's reference to the user.
            let source = new Source(this, options);
            this._sources[this._sources.length] = source;
            return source;
        }
        /**
         * Remove an existing source for the scene.
         * @param source
         */
        removeSource(source) {
            const sourceIdx = this._sources.findIndex((s) => s === source);
            if (sourceIdx > -1) {
                arrayRemoveAt(this._sources, sourceIdx);
                source.dispose();
            }
        }
        /**
         * Set the scene's desired ambisonic order.
         * @param ambisonicOrder Desired ambisonic order.
         */
        setAmbisonicOrder(ambisonicOrder) {
            this.ambisonicOrder = Encoder.validateAmbisonicOrder(ambisonicOrder);
        }
        /**
         * Set the room's dimensions and wall materials.
         * @param dimensions Room dimensions (in meters).
         * @param materials Named acoustic materials per wall.
         */
        setRoomProperties(dimensions, materials) {
            this.room.setProperties(dimensions, materials);
        }
        /**
         * Set the listener's position (in meters), where origin is the center of
         * the room.
         */
        setListenerPosition(v) {
            // Update listener position.
            copy(this.listener.position, v);
            this.room.setListenerPosition(v);
            // Update sources with new listener position.
            this._sources.forEach(function (element) {
                element.update();
            });
        }
        /**
         * Set the source's orientation using forward and up vectors.
         */
        setListenerOrientation(forward, up) {
            this.listener.setOrientation(forward, up);
        }
        /**
         * Set the speed of sound.
         */
        setSpeedOfSound(speedOfSound) {
            this.room.speedOfSound = speedOfSound;
        }
    }

    /**
     * A spatializer that uses Google's Resonance Audio library.
     **/
    class ResonanceAudioNode extends BaseEmitter {
        /**
         * Creates a new spatializer that uses Google's Resonance Audio library.
         */
        constructor(audioContext, destination, res) {
            super(audioContext, destination);
            this.resScene = res;
            this.resNode = res.createSource(undefined);
            this.input = this.resNode.input;
            this.output = this.resNode.output;
            connect(this.output, this.destination);
            Object.seal(this);
        }
        createNew() {
            return new ResonanceAudioNode(this.audioContext, this.destination, this.resScene);
        }
        /**
         * Performs the spatialization operation for the audio source's latest location.
         */
        update(loc, _t) {
            const { p, f, u } = loc;
            this.resNode.setPosition(p);
            this.resNode.setOrientation(f, u);
        }
        /**
         * Sets parameters that alter spatialization.
         **/
        setAudioProperties(minDistance, maxDistance, rolloff, algorithm, transitionTime) {
            super.setAudioProperties(minDistance, maxDistance, rolloff, algorithm, transitionTime);
            this.resNode.setMinDistance(this.minDistance);
            this.resNode.setMaxDistance(this.maxDistance);
            this.resNode.setGain(1 / this.rolloff);
            this.resNode.setRolloff(this.algorithm);
        }
        /**
         * Discard values and make this instance useless.
         */
        dispose() {
            this.resScene.removeSource(this.resNode);
            this.resNode = null;
            super.dispose();
        }
    }

    /**
     * An audio positioner that uses Google's Resonance Audio library
     **/
    class ResonanceAudioListener extends BaseListener {
        /**
         * Creates a new audio positioner that uses Google's Resonance Audio library
         */
        constructor(audioContext) {
            super(audioContext);
            this.disposed = false;
            const scene = new ResonanceAudio(audioContext, {
                ambisonicOrder: 1,
                renderingMode: RenderingMode.Bypass
            });
            scene.setRoomProperties({
                width: 10,
                height: 5,
                depth: 10,
            }, {
                [Direction.Left]: Material.Transparent,
                [Direction.Right]: Material.Transparent,
                [Direction.Front]: Material.Transparent,
                [Direction.Back]: Material.Transparent,
                [Direction.Down]: Material.Grass,
                [Direction.Up]: Material.Transparent,
            });
            this.input = scene.listener.input;
            this.output = scene.output;
            this.scene = scene;
            Object.seal(this);
        }
        dispose() {
            if (!this.disposed) {
                if (this.scene) {
                    this.scene.dispose();
                }
                super.dispose();
                this.disposed = true;
            }
        }
        /**
         * Performs the spatialization operation for the audio source's latest location.
         */
        update(loc, _t) {
            const { p, f, u } = loc;
            this.scene.setListenerPosition(p);
            this.scene.setListenerOrientation(f, u);
        }
        /**
         * Creates a spatialzer for an audio source.
         */
        createSpatializer(spatialize, audioContext, destination) {
            if (spatialize) {
                return new ResonanceAudioNode(audioContext, destination.spatializedInput, this.scene);
            }
            else {
                return super.createSpatializer(spatialize, audioContext, destination);
            }
        }
    }

    const delta = create();
    class VolumeScalingNode extends BaseEmitter {
        /**
         * Creates a new spatializer that performs no panning, only distance-based volume scaling
         */
        constructor(audioContext, destination, listener) {
            super(audioContext, destination);
            const gain = audioContext.createGain();
            this.input = this.output = gain;
            this.gain = gain;
            this.listener = listener;
            connect(this.output, this.destination);
            Object.seal(this);
        }
        createNew() {
            return new VolumeScalingNode(this.audioContext, this.destination, this.listener);
        }
        update(loc, t) {
            const p = this.listener.pose.p;
            sub(delta, p, loc.p);
            const distance = length(delta);
            let range = clamp(project(distance, this.minDistance, this.maxDistance), 0, 1);
            if (this.algorithm === "logarithmic") {
                range = Math.sqrt(range);
            }
            const volume = 1 - range;
            this.gain.gain.setValueAtTime(volume, t);
        }
    }

    /**
     * A positioner that uses WebAudio's gain nodes to only adjust volume.
     **/
    class VolumeScalingListener extends BaseListener {
        /**
         * Creates a new positioner that uses WebAudio's playback dependent time progression.
         */
        constructor(audioContext) {
            super(audioContext);
            const gain = audioContext.createGain();
            this.input = this.output = gain;
            this.pose = new Pose();
        }
        /**
         * Performs the spatialization operation for the audio source's latest location.
         */
        update(loc, _t) {
            this.pose.copy(loc);
        }
        /**
         * Creates a spatialzer for an audio source.
         */
        createSpatializer(spatialize, audioContext, destination) {
            if (spatialize) {
                return new VolumeScalingNode(audioContext, destination.spatializedInput, this);
            }
            else {
                return super.createSpatializer(spatialize, audioContext, destination);
            }
        }
    }

    /**
     * Base class for spatializers that uses WebAudio's PannerNode
     **/
    class BaseWebAudioPanner extends BaseEmitter {
        /**
         * Creates a new spatializer that uses WebAudio's PannerNode.
         * @param audioContext - the output WebAudio context
         */
        constructor(audioContext, destination) {
            super(audioContext, destination);
            this.panner = audioContext.createPanner();
            this.panner.panningModel = "HRTF";
            this.panner.distanceModel = "inverse";
            this.panner.coneInnerAngle = 360;
            this.panner.coneOuterAngle = 0;
            this.panner.coneOuterGain = 0;
            this.input = this.output = this.panner;
            connect(this.output, this.destination);
        }
        copyAudioProperties(from) {
            super.copyAudioProperties(from);
            this.panner.panningModel = from.panner.panningModel;
            this.panner.distanceModel = from.panner.distanceModel;
            this.panner.coneInnerAngle = from.panner.coneInnerAngle;
            this.panner.coneOuterAngle = from.panner.coneOuterAngle;
            this.panner.coneOuterGain = from.panner.coneOuterGain;
        }
        /**
         * Sets parameters that alter spatialization.
         **/
        setAudioProperties(minDistance, maxDistance, rolloff, algorithm, transitionTime) {
            super.setAudioProperties(minDistance, maxDistance, rolloff, algorithm, transitionTime);
            this.panner.refDistance = this.minDistance;
            if (this.algorithm === "logarithmic") {
                algorithm = "inverse";
            }
            this.panner.distanceModel = algorithm;
            this.panner.rolloffFactor = this.rolloff;
        }
    }

    /**
     * A positioner that uses WebAudio's playback dependent time progression.
     **/
    class WebAudioPannerNew extends BaseWebAudioPanner {
        /**
         * Creates a new positioner that uses WebAudio's playback dependent time progression.
         */
        constructor(audioContext, destination) {
            super(audioContext, destination);
            Object.seal(this);
        }
        createNew() {
            return new WebAudioPannerNew(this.audioContext, this.destination);
        }
        /**
         * Performs the spatialization operation for the audio source's latest location.
         */
        update(loc, t) {
            const { p, f } = loc;
            this.panner.positionX.setValueAtTime(p[0], t);
            this.panner.positionY.setValueAtTime(p[1], t);
            this.panner.positionZ.setValueAtTime(p[2], t);
            this.panner.orientationX.setValueAtTime(-f[0], t);
            this.panner.orientationY.setValueAtTime(-f[1], t);
            this.panner.orientationZ.setValueAtTime(-f[2], t);
        }
    }

    /**
     * Base class for spatializers that uses WebAudio's AudioListener
     **/
    class BaseWebAudioListener extends BaseListener {
        /**
         * Creates a new spatializer that uses WebAudio's PannerNode.
         */
        constructor(audioContext) {
            super(audioContext);
            this.disposed2 = false;
            const gain = audioContext.createGain();
            gain.gain.value = 0.75;
            this.input = this.output = gain;
            this.listener = audioContext.listener;
        }
        dispose() {
            if (!this.disposed2) {
                this.listener = null;
                super.dispose();
                this.disposed2 = true;
            }
        }
    }

    /**
     * A positioner that uses WebAudio's playback dependent time progression.
     **/
    class WebAudioListenerNew extends BaseWebAudioListener {
        /**
         * Creates a new positioner that uses WebAudio's playback dependent time progression.
         */
        constructor(audioContext) {
            super(audioContext);
            Object.seal(this);
        }
        /**
         * Performs the spatialization operation for the audio source's latest location.
         */
        update(loc, t) {
            const { p, f, u } = loc;
            this.listener.positionX.setValueAtTime(p[0], t);
            this.listener.positionY.setValueAtTime(p[1], t);
            this.listener.positionZ.setValueAtTime(p[2], t);
            this.listener.forwardX.setValueAtTime(f[0], t);
            this.listener.forwardY.setValueAtTime(f[1], t);
            this.listener.forwardZ.setValueAtTime(f[2], t);
            this.listener.upX.setValueAtTime(u[0], t);
            this.listener.upY.setValueAtTime(u[1], t);
            this.listener.upZ.setValueAtTime(u[2], t);
        }
        /**
         * Creates a spatialzer for an audio source.
         */
        createSpatializer(spatialize, audioContext, destination) {
            if (spatialize) {
                return new WebAudioPannerNew(audioContext, destination.spatializedInput);
            }
            else {
                return super.createSpatializer(spatialize, audioContext, destination);
            }
        }
    }

    /**
     * A positioner that uses the WebAudio API's old setPosition method.
     **/
    class WebAudioPannerOld extends BaseWebAudioPanner {
        /**
         * Creates a new positioner that uses the WebAudio API's old setPosition method.
         */
        constructor(audioContext, destination) {
            super(audioContext, destination);
            Object.seal(this);
        }
        createNew() {
            return new WebAudioPannerOld(this.audioContext, this.destination);
        }
        /**
         * Performs the spatialization operation for the audio source's latest location.
         */
        update(loc, _t) {
            const { p, f } = loc;
            this.panner.setPosition(p[0], p[1], p[2]);
            this.panner.setOrientation(f[0], f[1], f[2]);
        }
    }

    /**
     * A positioner that uses WebAudio's playback dependent time progression.
     **/
    class WebAudioListenerOld extends BaseWebAudioListener {
        /**
         * Creates a new positioner that uses WebAudio's playback dependent time progression.
         */
        constructor(audioContext) {
            super(audioContext);
            Object.seal(this);
        }
        /**
         * Performs the spatialization operation for the audio source's latest location.
         */
        update(loc, _t) {
            const { p, f, u } = loc;
            this.listener.setPosition(p[0], p[1], p[2]);
            this.listener.setOrientation(f[0], f[1], f[2], u[0], u[1], u[2]);
        }
        /**
         * Creates a spatialzer for an audio source.
         */
        createSpatializer(spatialize, audioContext, destination) {
            if (spatialize) {
                return new WebAudioPannerOld(audioContext, destination.spatializedInput);
            }
            else {
                return super.createSpatializer(spatialize, audioContext, destination);
            }
        }
    }

    /**
     * Empties out an array, returning the items that were in the array.
     */
    function arrayClear(arr) {
        return arr.splice(0);
    }

    class BaseAudioSource extends BaseAudioElement {
        constructor(id, audioContext) {
            super(audioContext);
            this.id = id;
            this.disposed2 = false;
        }
        dispose() {
            if (!this.disposed2) {
                this.source = null;
                super.dispose();
                this.disposed2 = true;
            }
        }
        get spatialized() {
            return !(this.spatializer instanceof NoSpatializationNode);
        }
        get source() {
            return this._source;
        }
        set source(v) {
            if (v !== this.source) {
                if (this._source) {
                    disconnect(this._source, this.volumeControl);
                }
                this._source = v;
                if (this._source) {
                    connect(this._source, this.volumeControl);
                }
            }
        }
        disconnectSpatializer() {
            disconnect(this.volumeControl, this.spatializer.input);
        }
        connectSpatializer() {
            connect(this.volumeControl, this.spatializer.input);
        }
    }

    class BaseAudioBufferSource extends BaseAudioSource {
        constructor(id, audioContext, source, spatializer) {
            super(id, audioContext);
            this.source = source;
            this.spatializer = spatializer;
        }
    }

    class AudioBufferSource extends BaseAudioBufferSource {
        constructor(id, audioContext, source, spatializer) {
            super(id, audioContext, source, spatializer);
            this.isPlaying = false;
            this.disposed3 = false;
        }
        async play() {
            this.source.start();
            await once(this.source, "ended");
            this.isPlaying = false;
        }
        stop() {
            this.source.stop();
        }
        dispose() {
            if (!this.disposed3) {
                this.stop();
                super.dispose();
                this.disposed3 = true;
            }
        }
    }

    class AudioBufferSpawningSource extends BaseAudioBufferSource {
        constructor(id, audioContext, source, spatializer) {
            super(id, audioContext, source, spatializer);
            this.counter = 0;
            this.playingSources = new Array();
            this.disposed3 = false;
        }
        connectSpatializer() {
            // do nothing, this node doesn't play on its own
        }
        disconnectSpatializer() {
            // do nothing, this node doesn't play on its own
        }
        get isPlaying() {
            for (const source of this.playingSources) {
                if (source.isPlaying) {
                    return true;
                }
            }
            return false;
        }
        async play() {
            const newBuffer = this.source.context.createBufferSource();
            newBuffer.buffer = this.source.buffer;
            newBuffer.loop = this.source.loop;
            const newSpatializer = this.spatializer.clone();
            const newSource = new AudioBufferSource(`${this.id}-${this.counter++}`, this.audioContext, newBuffer, newSpatializer);
            newSource.spatializer = newSpatializer;
            this.playingSources.push(newSource);
            newSource.play();
            if (!this.source.loop) {
                await once(newBuffer, "ended");
                if (this.playingSources.indexOf(newSource) >= 0) {
                    newSource.dispose();
                    arrayRemove(this.playingSources, newSource);
                }
            }
        }
        stop() {
            for (const source of this.playingSources) {
                source.dispose();
            }
            arrayClear(this.playingSources);
        }
        dispose() {
            if (!this.disposed3) {
                this.stop();
                super.dispose();
                this.disposed3 = true;
            }
        }
    }

    class AudioElementSource extends BaseAudioSource {
        constructor(id, audioContext, source, spatializer) {
            super(id, audioContext);
            this.isPlaying = false;
            this.disposed3 = false;
            this.source = source;
            this.spatializer = spatializer;
        }
        async play() {
            this.isPlaying = true;
            await this.source.mediaElement.play();
            if (!this.source.mediaElement.loop) {
                await once(this.source.mediaElement, "ended");
                this.isPlaying = false;
            }
        }
        stop() {
            this.source.mediaElement.pause();
            this.source.mediaElement.currentTime = 0;
            this.isPlaying = false;
        }
        dispose() {
            if (!this.disposed3) {
                if (this.source.mediaElement.parentElement) {
                    this.source.mediaElement.parentElement.removeChild(this.source.mediaElement);
                }
                super.dispose();
                this.disposed3 = false;
            }
        }
    }

    class AudioStreamSource extends BaseAudioSource {
        constructor(id, audioContext) {
            super(id, audioContext);
            this.streams = new Map();
        }
    }

    function BackgroundAudio(autoplay, mute, ...rest) {
        const elem = Audio(playsInline(true), controls$1(false), muted(mute), autoPlay(autoplay), styles(display("none")), ...rest);
        //document.body.appendChild(elem);
        return elem;
    }
    if (!("AudioContext" in globalThis) && "webkitAudioContext" in globalThis) {
        globalThis.AudioContext = globalThis.webkitAudioContext;
    }
    if (!("OfflineAudioContext" in globalThis) && "webkitOfflineAudioContext" in globalThis) {
        globalThis.OfflineAudioContext = globalThis.webkitOfflineAudioContext;
    }
    const BUFFER_SIZE = 1024;
    const audioActivityEvt$1 = new AudioActivityEvent();
    const audioReadyEvt = new TypedEvent("audioReady");
    const testAudio = Audio();
    const useTrackSource = "createMediaStreamTrackSource" in AudioContext.prototype;
    const useElementSourceForUsers = !useTrackSource && !("createMediaStreamSource" in AudioContext.prototype);
    const audioTypes = new Map([
        ["wav", ["audio/wav", "audio/vnd.wave", "audio/wave", "audio/x-wav"]],
        ["mp3", ["audio/mpeg"]],
        ["m4a", ["audio/mp4"]],
        ["m4b", ["audio/mp4"]],
        ["3gp", ["audio/mp4"]],
        ["3g2", ["audio/mp4"]],
        ["aac", ["audio/aac", "audio/aacp"]],
        ["oga", ["audio/ogg"]],
        ["ogg", ["audio/ogg"]],
        ["spx", ["audio/ogg"]],
        ["webm", ["audio/webm"]],
        ["flac", ["audio/flac"]]
    ]);
    function shouldTry(path) {
        const idx = path.lastIndexOf(".");
        if (idx > -1) {
            const ext = path.substring(idx + 1);
            if (audioTypes.has(ext)) {
                for (const type of audioTypes.get(ext)) {
                    if (testAudio.canPlayType(type)) {
                        return true;
                    }
                }
                return false;
            }
        }
        return true;
    }
    let hasAudioContext = "AudioContext" in globalThis;
    let hasAudioListener = "AudioListener" in globalThis;
    let hasOldAudioListener = hasAudioListener && "setPosition" in AudioListener.prototype;
    let hasNewAudioListener = hasAudioListener && "positionX" in AudioListener.prototype;
    let attemptResonanceAPI = hasAudioListener;
    var SpatializerType;
    (function (SpatializerType) {
        SpatializerType["None"] = "none";
        SpatializerType["Low"] = "low";
        SpatializerType["Medium"] = "medium";
        SpatializerType["High"] = "high";
    })(SpatializerType || (SpatializerType = {}));
    /**
     * A manager of audio sources, destinations, and their spatialization.
     **/
    class AudioManager extends TypedEventBase {
        /**
         * Creates a new manager of audio sources, destinations, and their spatialization.
         **/
        constructor(fetcher, type, analyzeAudio = false) {
            super();
            this.analyzeAudio = analyzeAudio;
            this.minDistance = 1;
            this.maxDistance = 10;
            this.rolloff = 1;
            this._algorithm = "logarithmic";
            this.transitionTime = 0.5;
            this._offsetRadius = 0;
            this.clips = new Map();
            this.users = new Map();
            this.analysers = new Map();
            this.localUserID = null;
            this.sortedUserIDs = new Array();
            this.localUser = null;
            this.listener = null;
            this.audioContext = null;
            this.element = null;
            this.destination = null;
            this._audioOutputDeviceID = null;
            this.fetcher = fetcher || new Fetcher();
            this.setLocalUserID(DEFAULT_LOCAL_USER_ID);
            this.audioContext = new AudioContext();
            if (canChangeAudioOutput) {
                this.destination = this.audioContext.createMediaStreamDestination();
                this.element = Audio(playsInline, autoPlay, srcObject(this.destination.stream), styles(display("none")));
                document.body.appendChild(this.element);
            }
            else {
                this.destination = this.audioContext.destination;
            }
            this.localUser = new AudioDestination(this.audioContext, this.destination);
            if (this.ready) {
                this.start();
            }
            else {
                onUserGesture(() => this.dispatchEvent(audioReadyEvt), async () => {
                    await this.start();
                    return this.ready;
                });
            }
            this.type = type || SpatializerType.Medium;
            this.onAudioActivity = (evt) => {
                audioActivityEvt$1.id = evt.id;
                audioActivityEvt$1.isActive = evt.isActive;
                this.dispatchEvent(audioActivityEvt$1);
            };
            Object.seal(this);
        }
        get offsetRadius() {
            return this._offsetRadius;
        }
        set offsetRadius(v) {
            this._offsetRadius = v;
            this.updateUserOffsets();
        }
        get algorithm() {
            return this._algorithm;
        }
        checkAddEventListener(type, callback) {
            if (type === audioReadyEvt.type && this.ready) {
                callback(audioReadyEvt);
                return false;
            }
            return true;
        }
        get ready() {
            return this.audioContext && this.audioContext.state === "running";
        }
        /**
         * Perform the audio system initialization, after a user gesture
         **/
        async start() {
            await this.audioContext.resume();
            await this.setAudioOutputDeviceID(this._audioOutputDeviceID);
            if (this.element) {
                await this.element.play();
            }
        }
        update() {
            const t = this.currentTime;
            this.localUser.update(t);
            for (const clip of this.clips.values()) {
                clip.update(t);
            }
            for (const user of this.users.values()) {
                user.update(t);
            }
            for (const analyser of this.analysers.values()) {
                analyser.update();
            }
        }
        get type() {
            return this._type;
        }
        set type(type) {
            const inputType = type;
            if (type !== SpatializerType.High
                && type !== SpatializerType.Medium
                && type !== SpatializerType.Low
                && type !== SpatializerType.None) {
                assertNever(type, "Invalid spatialization type: ");
            }
            // These checks are done in an arcane way because it makes the fallback logic
            // for each step self-contained. It's easier to look at a single step and determine
            // wether or not it is correct, without having to look at previous blocks of code.
            if (type === SpatializerType.High) {
                if (hasAudioContext && hasAudioListener && attemptResonanceAPI) {
                    try {
                        this.listener = new ResonanceAudioListener(this.audioContext);
                    }
                    catch (exp) {
                        attemptResonanceAPI = false;
                        type = SpatializerType.Medium;
                        console.warn("Resonance Audio API not available!", exp);
                    }
                }
                else {
                    type = SpatializerType.Medium;
                }
            }
            if (type === SpatializerType.Medium) {
                if (hasAudioContext && hasAudioListener) {
                    if (hasNewAudioListener) {
                        try {
                            this.listener = new WebAudioListenerNew(this.audioContext);
                        }
                        catch (exp) {
                            hasNewAudioListener = false;
                            console.warn("No AudioListener.positionX property!", exp);
                        }
                    }
                    if (!hasNewAudioListener && hasOldAudioListener) {
                        try {
                            this.listener = new WebAudioListenerOld(this.audioContext);
                        }
                        catch (exp) {
                            hasOldAudioListener = false;
                            console.warn("No WebAudio API!", exp);
                        }
                    }
                    if (!hasNewAudioListener && !hasOldAudioListener) {
                        type = SpatializerType.Low;
                        hasAudioListener = false;
                    }
                }
                else {
                    type = SpatializerType.Low;
                }
            }
            if (type === SpatializerType.Low) {
                this.listener = new VolumeScalingListener(this.audioContext);
            }
            else if (type === SpatializerType.None) {
                this.listener = new NoSpatializationListener(this.audioContext);
            }
            if (!this.listener) {
                throw new Error("Calla requires a functioning WebAudio system. Could not create one for type: " + inputType);
            }
            else if (type !== inputType) {
                console.warn(`Wasn't able to create the listener type ${inputType}. Fell back to ${type} instead.`);
            }
            this._type = type;
            this.localUser.spatializer = this.listener;
            for (const clip of this.clips.values()) {
                clip.spatializer = this.createSpatializer(clip.spatialized);
            }
            for (const user of this.users.values()) {
                user.spatializer = this.createSpatializer(user.spatialized);
            }
        }
        getAudioOutputDeviceID() {
            return this.element && this.element.sinkId;
        }
        async setAudioOutputDeviceID(deviceID) {
            this._audioOutputDeviceID = deviceID || "";
            if (this.element
                && this._audioOutputDeviceID !== this.element.sinkId) {
                await this.element.setSinkId(this._audioOutputDeviceID);
            }
        }
        /**
         * Creates a spatialzer for an audio source.
         * @param source - the audio element that is being spatialized.
         * @param spatialize - whether or not the audio stream should be spatialized. Stereo audio streams that are spatialized will get down-mixed to a single channel.
         */
        createSpatializer(spatialize) {
            return this.listener.createSpatializer(spatialize, this.audioContext, this.localUser);
        }
        /**
         * Gets the current playback time.
         */
        get currentTime() {
            return this.audioContext.currentTime;
        }
        /**
         * Create a new user for audio processing.
         */
        createUser(id) {
            let user = this.users.get(id);
            if (!user) {
                user = new AudioStreamSource(id, this.audioContext);
                this.users.set(id, user);
                arraySortedInsert(this.sortedUserIDs, id);
                this.updateUserOffsets();
            }
            return user;
        }
        /**
         * Create a new user for the audio listener.
         */
        setLocalUserID(id) {
            if (this.localUser) {
                arrayRemove(this.sortedUserIDs, this.localUserID);
                this.localUserID = id;
                arraySortedInsert(this.sortedUserIDs, this.localUserID);
                this.updateUserOffsets();
            }
            return this.localUser;
        }
        /**
         * Creates a new sound effect from a series of fallback paths
         * for media files.
         * @param id - the name of the sound effect, to reference when executing playback.
         * @param looping - whether or not the sound effect should be played on loop.
         * @param autoPlaying - whether or not the sound effect should be played immediately.
         * @param spatialize - whether or not the sound effect should be spatialized.
         * @param vol - the volume at which to set the clip.
         * @param path - a path for loading the media of the sound effect.
         * @param onProgress - an optional callback function to use for tracking progress of loading the clip.
         */
        async createClip(id, looping, autoPlaying, spatialize, vol, path, onProgress) {
            if (path == null || path.length === 0) {
                throw new Error("No clip source path provided");
            }
            const clip = await this.createAudioElementSource(id, looping, autoPlaying, spatialize, path, onProgress)
                ;
            clip.volume = vol;
            this.clips.set(id, clip);
            return clip;
        }
        async createAudioElementSource(id, looping, autoPlaying, spatialize, path, onProgress) {
            if (onProgress) {
                onProgress(0, 1);
            }
            const elem = BackgroundAudio(autoPlaying, false);
            const task = once(elem, "canplaythrough");
            elem.loop = looping;
            elem.src = await this.fetcher.getFile(path, null, onProgress);
            await task;
            const source = this.audioContext.createMediaElementSource(elem);
            if (onProgress) {
                onProgress(1, 1);
            }
            return new AudioElementSource("audio-clip-" + id, this.audioContext, source, this.createSpatializer(spatialize));
        }
        async createAudioBufferSource(id, looping, autoPlaying, spatialize, path, onProgress) {
            let goodBlob = null;
            if (!shouldTry(path)) {
                if (onProgress) {
                    onProgress(1, 1, "skip");
                }
            }
            else {
                const blob = await this.fetcher.getBlob(path, null, onProgress);
                if (testAudio.canPlayType(blob.type)) {
                    goodBlob = blob;
                }
            }
            if (!goodBlob) {
                throw new Error("Cannot play file: " + path);
            }
            const buffer = await goodBlob.arrayBuffer();
            const data = await this.audioContext.decodeAudioData(buffer);
            const source = this.audioContext.createBufferSource();
            source.buffer = data;
            source.loop = looping;
            const clip = new AudioBufferSpawningSource("audio-clip-" + id, this.audioContext, source, this.createSpatializer(spatialize));
            if (autoPlaying) {
                clip.play();
            }
            return clip;
        }
        hasClip(name) {
            return this.clips.has(name);
        }
        /**
         * Plays a named sound effect.
         * @param name - the name of the effect to play.
         */
        async playClip(name) {
            if (this.ready && this.hasClip(name)) {
                const clip = this.clips.get(name);
                await clip.play();
            }
        }
        stopClip(name) {
            if (this.ready && this.hasClip(name)) {
                const clip = this.clips.get(name);
                clip.stop();
            }
        }
        /**
         * Get an existing user.
         */
        getUser(id) {
            return this.users.get(id);
        }
        /**
         * Get an existing audio clip.
         */
        getClip(id) {
            return this.clips.get(id);
        }
        renameClip(id, newID) {
            const clip = this.clips.get(id);
            if (clip) {
                clip.id = "audio-clip-" + id;
                this.clips.delete(id);
                this.clips.set(newID, clip);
            }
        }
        /**
         * Remove an audio source from audio processing.
         * @param sources - the collection of audio sources from which to remove.
         * @param id - the id of the audio source to remove
         **/
        removeSource(sources, id) {
            const source = sources.get(id);
            if (source) {
                sources.delete(id);
                source.dispose();
            }
            return source;
        }
        /**
         * Remove a user from audio processing.
         **/
        removeUser(id) {
            this.removeSource(this.users, id);
            arrayRemove(this.sortedUserIDs, id);
            this.updateUserOffsets();
        }
        /**
         * Remove an audio clip from audio processing.
         **/
        removeClip(id) {
            return this.removeSource(this.clips, id);
        }
        createSourceFromStream(stream) {
            if (useTrackSource) {
                const tracks = stream.getAudioTracks()
                    .map((track) => this.audioContext.createMediaStreamTrackSource(track));
                if (tracks.length === 0) {
                    throw new Error("No audio tracks!");
                }
                else if (tracks.length === 1) {
                    return tracks[0];
                }
                else {
                    const merger = this.audioContext.createChannelMerger(tracks.length);
                    for (const track of tracks) {
                        connect(track, merger);
                    }
                    return merger;
                }
            }
            else {
                const elem = BackgroundAudio(true, !useElementSourceForUsers);
                elem.srcObject = stream;
                elem.play();
                if (useElementSourceForUsers) {
                    return this.audioContext.createMediaElementSource(elem);
                }
                else {
                    elem.muted = true;
                    return this.audioContext.createMediaStreamSource(stream);
                }
            }
        }
        async setUserStream(id, stream) {
            if (this.users.has(id)) {
                if (this.analysers.has(id)) {
                    using(this.analysers.get(id), (analyser) => {
                        this.analysers.delete(id);
                        analyser.removeEventListener("audioActivity", this.onAudioActivity);
                    });
                }
                const user = this.users.get(id);
                user.spatializer = null;
                if (stream) {
                    await waitFor(() => stream.active);
                    user.source = this.createSourceFromStream(stream);
                    user.spatializer = this.createSpatializer(true);
                    user.spatializer.setAudioProperties(this.minDistance, this.maxDistance, this.rolloff, this.algorithm, this.transitionTime);
                    if (this.analyzeAudio) {
                        const analyser = new ActivityAnalyser(user, this.audioContext, BUFFER_SIZE);
                        analyser.addEventListener("audioActivity", this.onAudioActivity);
                        this.analysers.set(id, analyser);
                    }
                }
            }
        }
        updateUserOffsets() {
            if (this.offsetRadius > 0) {
                const idx = this.sortedUserIDs.indexOf(this.localUserID);
                const dAngle = 2 * Math.PI / this.sortedUserIDs.length;
                const localAngle = (idx + 1) * dAngle;
                const dx = this.offsetRadius * Math.sin(localAngle);
                const dy = this.offsetRadius * (Math.cos(localAngle) - 1);
                for (let i = 0; i < this.sortedUserIDs.length; ++i) {
                    const id = this.sortedUserIDs[i];
                    const angle = (i + 1) * dAngle;
                    const x = this.offsetRadius * Math.sin(angle) - dx;
                    const z = this.offsetRadius * (Math.cos(angle) - 1) - dy;
                    this.setUserOffset(id, x, 0, z);
                }
            }
        }
        /**
         * Sets parameters that alter spatialization.
         **/
        setAudioProperties(minDistance, maxDistance, rolloff, algorithm, transitionTime) {
            this.minDistance = minDistance;
            this.maxDistance = maxDistance;
            this.transitionTime = transitionTime;
            this.rolloff = rolloff;
            this._algorithm = algorithm;
            for (const user of this.users.values()) {
                if (user.spatializer) {
                    user.spatializer.setAudioProperties(this.minDistance, this.maxDistance, this.rolloff, this.algorithm, this.transitionTime);
                }
            }
        }
        /**
         * Get a pose, normalize the transition time, and perform on operation on it, if it exists.
         * @param sources - the collection of poses from which to retrieve the pose.
         * @param id - the id of the pose for which to perform the operation.
         * @param dt - the amount of time to take to make the transition. Defaults to this AudioManager's `transitionTime`.
         * @param poseCallback
         */
        withPose(sources, id, dt, poseCallback) {
            const source = sources.get(id);
            let pose = null;
            if (source) {
                pose = source.pose;
            }
            else if (id === this.localUserID) {
                pose = this.localUser.pose;
            }
            if (!pose) {
                return null;
            }
            if (dt == null) {
                dt = this.transitionTime;
            }
            return poseCallback(pose, dt);
        }
        /**
         * Get a user pose, normalize the transition time, and perform on operation on it, if it exists.
         * @param id - the id of the user for which to perform the operation.
         * @param dt - the amount of time to take to make the transition. Defaults to this AudioManager's `transitionTime`.
         * @param poseCallback
         */
        withUser(id, dt, poseCallback) {
            return this.withPose(this.users, id, dt, poseCallback);
        }
        /**
         * Set the comfort position offset for a given user.
         * @param id - the id of the user for which to set the offset.
         * @param x - the horizontal component of the offset.
         * @param y - the vertical component of the offset.
         * @param z - the lateral component of the offset.
         */
        setUserOffset(id, x, y, z) {
            this.withUser(id, null, (pose) => {
                pose.setOffset(x, y, z);
            });
        }
        /**
         * Get the comfort position offset for a given user.
         * @param id - the id of the user for which to set the offset.
         */
        getUserOffset(id) {
            return this.withUser(id, null, (pose) => {
                return pose.offset;
            });
        }
        /**
         * Set the position and orientation of a user.
         * @param id - the id of the user for which to set the position.
         * @param px - the horizontal component of the position.
         * @param py - the vertical component of the position.
         * @param pz - the lateral component of the position.
         * @param fx - the horizontal component of the forward vector.
         * @param fy - the vertical component of the forward vector.
         * @param fz - the lateral component of the forward vector.
         * @param ux - the horizontal component of the up vector.
         * @param uy - the vertical component of the up vector.
         * @param uz - the lateral component of the up vector.
         * @param dt - the amount of time to take to make the transition. Defaults to this AudioManager's `transitionTime`.
         **/
        setUserPose(id, px, py, pz, fx, fy, fz, ux, uy, uz, dt = null) {
            this.withUser(id, dt, (pose, dt) => {
                pose.setTarget(px, py, pz, fx, fy, fz, ux, uy, uz, this.currentTime, dt);
            });
        }
        /**
         * Get an audio clip pose, normalize the transition time, and perform on operation on it, if it exists.
         * @param id - the id of the audio clip for which to perform the operation.
         * @param dt - the amount of time to take to make the transition. Defaults to this AudioManager's `transitionTime`.
         * @param poseCallback
         */
        withClip(id, dt, poseCallback) {
            return this.withPose(this.clips, id, dt, poseCallback);
        }
        /**
         * Set the position of an audio clip.
         * @param id - the id of the audio clip for which to set the position.
         * @param x - the horizontal component of the position.
         * @param y - the vertical component of the position.
         * @param z - the lateral component of the position.
         * @param dt - the amount of time to take to make the transition. Defaults to this AudioManager's `transitionTime`.
         **/
        setClipPosition(id, x, y, z, dt = null) {
            this.withClip(id, dt, (pose, dt) => {
                pose.setTargetPosition(x, y, z, this.currentTime, dt);
            });
        }
        /**
         * Set the orientation of an audio clip.
         * @param id - the id of the audio clip for which to set the position.
         * @param fx - the horizontal component of the forward vector.
         * @param fy - the vertical component of the forward vector.
         * @param fz - the lateral component of the forward vector.
         * @param ux - the horizontal component of the up vector.
         * @param uy - the vertical component of the up vector.
         * @param uz - the lateral component of the up vector.
         * @param dt - the amount of time to take to make the transition. Defaults to this AudioManager's `transitionTime`.
         **/
        setClipOrientation(id, fx, fy, fz, ux, uy, uz, dt = null) {
            this.withClip(id, dt, (pose, dt) => {
                pose.setTargetOrientation(fx, fy, fz, ux, uy, uz, this.currentTime, dt);
            });
        }
        /**
         * Set the position and orientation of an audio clip.
         * @param id - the id of the audio clip for which to set the position.
         * @param px - the horizontal component of the position.
         * @param py - the vertical component of the position.
         * @param pz - the lateral component of the position.
         * @param fx - the horizontal component of the forward vector.
         * @param fy - the vertical component of the forward vector.
         * @param fz - the lateral component of the forward vector.
         * @param ux - the horizontal component of the up vector.
         * @param uy - the vertical component of the up vector.
         * @param uz - the lateral component of the up vector.
         * @param dt - the amount of time to take to make the transition. Defaults to this AudioManager's `transitionTime`.
         **/
        setClipPose(id, px, py, pz, fx, fy, fz, ux, uy, uz, dt = null) {
            this.withClip(id, dt, (pose, dt) => {
                pose.setTarget(px, py, pz, fx, fy, fz, ux, uy, uz, this.currentTime, dt);
            });
        }
    }

    function sleep(dt) {
        return new Promise((resolve) => {
            setTimeout(resolve, dt);
        });
    }

    class BaseMetadataClient extends TypedEventBase {
        constructor(sleepTime) {
            super();
            this.sleepTime = sleepTime;
            this.tasks = new Map();
        }
        async getNext(evtName, userID) {
            return new Promise((resolve) => {
                const getter = (evt) => {
                    if (evt instanceof CallaUserEvent
                        && evt.id === userID) {
                        this.removeEventListener(evtName, getter);
                        resolve(evt);
                    }
                };
                this.addEventListener(evtName, getter);
            });
        }
        get isConnected() {
            return this.metadataState === ConnectionState.Connected;
        }
        async callThrottled(key, command, ...args) {
            if (!this.tasks.has(key)) {
                const start = performance.now();
                const task = this.callInternal(command, ...args);
                this.tasks.set(key, task);
                await task;
                const delta = performance.now() - start;
                const sleepTime = this.sleepTime - delta;
                if (sleepTime > 0) {
                    await sleep(this.sleepTime);
                }
                this.tasks.delete(key);
            }
        }
        async callImmediate(command, ...args) {
            await this.callInternal(command, ...args);
        }
        setLocalPose(px, py, pz, fx, fy, fz, ux, uy, uz) {
            this.callThrottled("userPosed", "userPosed", px, py, pz, fx, fy, fz, ux, uy, uz);
        }
        setLocalPoseImmediate(px, py, pz, fx, fy, fz, ux, uy, uz) {
            this.callImmediate("userPosed", px, py, pz, fx, fy, fz, ux, uy, uz);
        }
        setLocalPointer(name, px, py, pz, fx, fy, fz, ux, uy, uz) {
            this.callThrottled("userPointer" + name, "userPointer", name, px, py, pz, fx, fy, fz, ux, uy, uz);
        }
        setAvatarEmoji(emoji) {
            this.callImmediate("setAvatarEmoji", emoji);
        }
        setAvatarURL(url) {
            this.callImmediate("avatarChanged", url);
        }
        emote(emoji) {
            this.callImmediate("emote", emoji);
        }
        chat(text) {
            this.callImmediate("chat", text);
        }
    }

    const JITSI_HAX_FINGERPRINT = "Calla";
    class JitsiMetadataClient extends BaseMetadataClient {
        constructor(tele) {
            super(250);
            this.tele = tele;
            this._status = ConnectionState.Disconnected;
            this.remoteUserIDs = new Array();
            this.tele.addEventListener("participantJoined", (evt) => {
                arraySortedInsert(this.remoteUserIDs, evt.id, false);
            });
            this.tele.addEventListener("participantLeft", (evt) => {
                arrayRemove(this.remoteUserIDs, evt.id);
            });
        }
        get metadataState() {
            return this._status;
        }
        async connect() {
            // JitsiTeleconferenceClient will already connect
        }
        async join(_roomName) {
            // JitsiTeleconferenceClient will already join
            this._status = ConnectionState.Connecting;
            this.tele.conference.addEventListener(JitsiMeetJS.events.conference.ENDPOINT_MESSAGE_RECEIVED, (user, data) => {
                if (data.hax === JITSI_HAX_FINGERPRINT) {
                    const fromUserID = user.getId();
                    const command = data.command;
                    const values = data.values;
                    switch (command) {
                        case "avatarChanged":
                            this.dispatchEvent(new CallaAvatarChangedEvent(fromUserID, values[0]));
                            break;
                        case "emote":
                            this.dispatchEvent(new CallaEmoteEvent(fromUserID, values[0]));
                            break;
                        case "setAvatarEmoji":
                            this.dispatchEvent(new CallaEmojiAvatarEvent(fromUserID, values[0]));
                            break;
                        case "userPosed":
                            this.dispatchEvent(new CallaUserPosedEvent(fromUserID, values[0], values[1], values[2], values[3], values[4], values[5], values[6], values[7], values[8]));
                            break;
                        case "userPointer":
                            this.dispatchEvent(new CallaUserPointerEvent(fromUserID, values[0], values[1], values[2], values[3], values[4], values[5], values[6], values[7], values[8], values[9]));
                            break;
                        case "chat":
                            this.dispatchEvent(new CallaChatEvent(fromUserID, values[0]));
                            break;
                        default:
                            assertNever(command);
                    }
                }
            });
            await once(this.tele.conference, JitsiMeetJS.events.conference.DATA_CHANNEL_OPENED);
            this._status = ConnectionState.Connected;
        }
        async leave() {
            // JitsiTeleconferenceClient will already leave
            this._status = ConnectionState.Disconnected;
        }
        async identify(_userName) {
            // JitsiTeleconferenceClient will already identify the user
        }
        async disconnect() {
            // JitsiTeleconferenceClient will already disconnect
        }
        sendJitsiHax(toUserID, command, ...values) {
            this.tele.conference.sendMessage({
                hax: JITSI_HAX_FINGERPRINT,
                command,
                values
            }, toUserID);
        }
        callInternal(command, ...values) {
            for (const toUserID of this.remoteUserIDs) {
                this.sendJitsiHax(toUserID, command, ...values);
            }
            return Promise.resolve();
        }
        async stopInternal() {
            this._status = ConnectionState.Disconnecting;
            await waitFor(() => this.metadataState === ConnectionState.Disconnected);
        }
    }

    function encodeUserName(v) {
        try {
            return encodeURIComponent(v);
        }
        catch (exp) {
            return v;
        }
    }
    function decodeUserName(v) {
        try {
            return decodeURIComponent(v);
        }
        catch (exp) {
            return v;
        }
    }
    class JitsiTeleconferenceClient extends BaseTeleconferenceClient {
        constructor(fetcher, audio, host, bridgeHost, bridgeMUC) {
            super(fetcher, audio);
            this.host = host;
            this.bridgeHost = bridgeHost;
            this.bridgeMUC = bridgeMUC;
            this.usingDefaultMetadataClient = false;
            this.connection = null;
            this.conference = null;
            this.tracks = new Map();
            this.listenersForObjs = new Map();
        }
        _on(obj, evtName, handler) {
            let objListeners = this.listenersForObjs.get(obj);
            if (!objListeners) {
                this.listenersForObjs.set(obj, objListeners = new Map());
            }
            let evtListeners = objListeners.get(evtName);
            if (!evtListeners) {
                objListeners.set(evtName, evtListeners = new Array());
            }
            evtListeners.push(handler);
            obj.addEventListener(evtName, handler);
        }
        _off(obj) {
            const objListeners = this.listenersForObjs.get(obj);
            if (objListeners) {
                this.listenersForObjs.delete(obj);
                for (const [evtName, handlers] of objListeners.entries()) {
                    for (const handler of handlers) {
                        obj.removeEventListener(evtName, handler);
                    }
                    arrayClear(handlers);
                }
                objListeners.clear();
            }
        }
        getDefaultMetadataClient() {
            this.usingDefaultMetadataClient = true;
            return new JitsiMetadataClient(this);
        }
        async connect() {
            await super.connect();
            const connectionEvents = JitsiMeetJS.events.connection;
            this.connection = new JitsiMeetJS.JitsiConnection(null, null, {
                hosts: {
                    domain: this.bridgeHost,
                    muc: this.bridgeMUC
                },
                serviceUrl: `https://${this.host}/http-bind`
            });
            for (const evtName of Object.values(connectionEvents)) {
                addLogger(this.connection, evtName);
            }
            const onDisconnect = () => {
                if (this.connection) {
                    this._off(this.connection);
                    this.connection = null;
                }
            };
            const fwd = (evtName, EvtClass, extra) => {
                this._on(this.connection, evtName, () => {
                    this.dispatchEvent(new EvtClass());
                    if (extra) {
                        extra();
                    }
                });
            };
            fwd(connectionEvents.CONNECTION_ESTABLISHED, CallaTeleconferenceServerConnectedEvent);
            fwd(connectionEvents.CONNECTION_DISCONNECTED, CallaTeleconferenceServerDisconnectedEvent, onDisconnect);
            fwd(connectionEvents.CONNECTION_FAILED, CallaTeleconferenceServerFailedEvent, onDisconnect);
            const connectTask = once(this.connection, connectionEvents.CONNECTION_ESTABLISHED);
            this.connection.connect();
            await connectTask;
        }
        async join(roomName, password) {
            await super.join(roomName, password);
            const isoRoomName = roomName.toLocaleLowerCase();
            if (isoRoomName !== this.roomName) {
                if (this.conference) {
                    await this.leave();
                }
                this.roomName = isoRoomName;
                this.conference = this.connection.initJitsiConference(this.roomName, {
                    openBridgeChannel: this.usingDefaultMetadataClient,
                    p2p: { enabled: false },
                    startVideoMuted: true
                });
                const conferenceEvents = JitsiMeetJS.events.conference;
                for (const evtName of Object.values(conferenceEvents)) {
                    if (evtName !== "conference.audioLevelsChanged") {
                        addLogger(this.conference, evtName);
                    }
                }
                const fwd = (evtName, EvtClass, extra) => {
                    this._on(this.conference, evtName, () => {
                        this.dispatchEvent(new EvtClass());
                        if (extra) {
                            extra(evtName);
                        }
                    });
                };
                const onLeft = async (evtName) => {
                    this.localUserID = DEFAULT_LOCAL_USER_ID;
                    if (this.tracks.size > 0) {
                        console.warn("><> CALLA <>< ---- there are leftover conference tracks");
                        for (const userID of this.tracks.keys()) {
                            await this.tryRemoveTrack(userID, StreamType.Video);
                            await this.tryRemoveTrack(userID, StreamType.Audio);
                            this.dispatchEvent(new CallaParticipantLeftEvent(userID));
                        }
                    }
                    this.dispatchEvent(new CallaConferenceLeftEvent(this.localUserID));
                    if (this.conference) {
                        this._off(this.conference);
                        this.conference = null;
                    }
                    console.info(`Left room '${roomName}'. Reason: ${evtName}.`);
                };
                fwd(conferenceEvents.CONFERENCE_ERROR, CallaConferenceFailedEvent, onLeft);
                fwd(conferenceEvents.CONFERENCE_FAILED, CallaConferenceFailedEvent, onLeft);
                fwd(conferenceEvents.CONNECTION_INTERRUPTED, CallaConferenceFailedEvent, onLeft);
                this._on(this.conference, conferenceEvents.CONFERENCE_JOINED, async () => {
                    const userID = this.conference.myUserId();
                    if (userID) {
                        this.localUserID = userID;
                        this.dispatchEvent(new CallaConferenceJoinedEvent(userID, null));
                    }
                });
                this._on(this.conference, conferenceEvents.CONFERENCE_LEFT, () => onLeft(conferenceEvents.CONFERENCE_LEFT));
                this._on(this.conference, conferenceEvents.USER_JOINED, (id, jitsiUser) => {
                    this.dispatchEvent(new CallaParticipantJoinedEvent(id, decodeUserName(jitsiUser.getDisplayName()), null));
                });
                this._on(this.conference, conferenceEvents.USER_LEFT, (id) => {
                    this.dispatchEvent(new CallaParticipantLeftEvent(id));
                });
                this._on(this.conference, conferenceEvents.DISPLAY_NAME_CHANGED, (id, displayName) => {
                    this.dispatchEvent(new CallaParticipantNameChangeEvent(id, decodeUserName(displayName)));
                });
                const onTrackMuteChanged = (track, muted) => {
                    const userID = track.getParticipantId() || this.localUserID, trackKind = track.getType(), evt = trackKind === StreamType.Audio
                        ? new CallaUserAudioMutedEvent(userID, muted)
                        : new CallaUserVideoMutedEvent(userID, muted);
                    this.dispatchEvent(evt);
                };
                this._on(this.conference, conferenceEvents.TRACK_ADDED, (track) => {
                    const userID = track.getParticipantId() || this.localUserID, trackKind = track.getType(), trackAddedEvt = trackKind === StreamType.Audio
                        ? new CallaAudioStreamAddedEvent(userID, track.stream)
                        : new CallaVideoStreamAddedEvent(userID, track.stream);
                    let userTracks = this.tracks.get(userID);
                    if (!userTracks) {
                        userTracks = new Map();
                        this.tracks.set(userID, userTracks);
                    }
                    const curTrack = userTracks.get(trackKind);
                    if (curTrack) {
                        const trackRemovedEvt = StreamType.Audio
                            ? new CallaAudioStreamRemovedEvent(userID, curTrack.stream)
                            : new CallaVideoStreamRemovedEvent(userID, curTrack.stream);
                        this.dispatchEvent(trackRemovedEvt);
                        curTrack.dispose();
                    }
                    userTracks.set(trackKind, track);
                    this.dispatchEvent(trackAddedEvt);
                    track.addEventListener(JitsiMeetJS.events.track.TRACK_MUTE_CHANGED, (track) => {
                        onTrackMuteChanged(track, track.isMuted());
                    });
                    onTrackMuteChanged(track, false);
                });
                this._on(this.conference, conferenceEvents.TRACK_REMOVED, (track) => {
                    using(track, (_) => {
                        const userID = track.getParticipantId() || this.localUserID, trackKind = track.getType(), trackRemovedEvt = StreamType.Audio
                            ? new CallaAudioStreamRemovedEvent(userID, track.stream)
                            : new CallaVideoStreamRemovedEvent(userID, track.stream);
                        onTrackMuteChanged(track, true);
                        this.dispatchEvent(trackRemovedEvt);
                        const userTracks = this.tracks.get(userID);
                        if (userTracks) {
                            const curTrack = userTracks.get(trackKind);
                            if (curTrack) {
                                userTracks.delete(trackKind);
                                if (userTracks.size === 0) {
                                    this.tracks.delete(userID);
                                }
                                if (curTrack !== track) {
                                    curTrack.dispose();
                                }
                            }
                        }
                    });
                });
                const joinTask = once(this, "conferenceJoined");
                this.conference.join(password);
                await joinTask;
            }
        }
        async identify(userName) {
            this.localUserName = userName;
            this.conference.setDisplayName(encodeUserName(userName));
        }
        async tryRemoveTrack(userID, kind) {
            const userTracks = this.tracks.get(userID);
            const EvtClass = kind === StreamType.Video
                ? CallaVideoStreamRemovedEvent
                : CallaAudioStreamRemovedEvent;
            if (userTracks) {
                const track = userTracks.get(kind);
                if (track) {
                    this.dispatchEvent(new EvtClass(userID, track.stream));
                    userTracks.delete(kind);
                    try {
                        if (this.conference && track.isLocal) {
                            this.conference.removeTrack(track);
                        }
                    }
                    catch (exp) {
                        console.warn(exp);
                    }
                    finally {
                        track.dispose();
                    }
                }
                if (userTracks.size === 0) {
                    this.tracks.delete(userID);
                }
            }
        }
        async leave() {
            await super.leave();
            try {
                await this.tryRemoveTrack(this.localUserID, StreamType.Video);
                await this.tryRemoveTrack(this.localUserID, StreamType.Audio);
                const leaveTask = once(this, "conferenceLeft");
                this.conference.leave();
                await leaveTask;
            }
            catch (exp) {
                console.warn("><> CALLA <>< ---- Failed to leave teleconference.", exp);
            }
        }
        async disconnect() {
            await super.disconnect();
            if (this.conferenceState === ConnectionState.Connected) {
                await this.leave();
            }
            const disconnectTask = once(this, "serverDisconnected");
            this.connection.disconnect();
            await disconnectTask;
        }
        userExists(id) {
            return this.conference
                && this.conference.participants
                && id in this.conference.participants;
        }
        getUserNames() {
            if (this.conference) {
                return Object.keys(this.conference.participants)
                    .map(k => [k, decodeUserName(this.conference.participants[k].getDisplayName())]);
            }
            else {
                return [];
            }
        }
        getCurrentMediaTrack(type) {
            if (this.localUserID === DEFAULT_LOCAL_USER_ID) {
                return null;
            }
            const userTracks = this.tracks.get(this.localUserID);
            if (!userTracks) {
                return null;
            }
            return userTracks.get(type);
        }
        async setAudioInputDevice(device) {
            await super.setAudioInputDevice(device);
            const cur = this.getCurrentMediaTrack(StreamType.Audio);
            if (cur) {
                const removeTask = this.getNext("audioRemoved", this.localUserID);
                this.conference.removeTrack(cur);
                await removeTask;
            }
            if (this.conference && this.preferredAudioInputID) {
                const addTask = this.getNext("audioAdded", this.localUserID);
                const tracks = await JitsiMeetJS.createLocalTracks({
                    devices: ["audio"],
                    micDeviceId: this.preferredAudioInputID,
                    constraints: {
                        autoGainControl: true,
                        echoCancellation: true,
                        noiseSuppression: true
                    }
                });
                for (const track of tracks) {
                    this.conference.addTrack(track);
                }
                await addTask;
            }
        }
        async setVideoInputDevice(device) {
            await super.setVideoInputDevice(device);
            const cur = this.getCurrentMediaTrack(StreamType.Video);
            if (cur) {
                const removeTask = this.getNext("videoRemoved", this.localUserID);
                this.conference.removeTrack(cur);
                await removeTask;
            }
            if (this.conference && this.preferredVideoInputID) {
                const addTask = this.getNext("videoAdded", this.localUserID);
                const tracks = await JitsiMeetJS.createLocalTracks({
                    devices: ["video"],
                    cameraDeviceId: this.preferredVideoInputID
                });
                for (const track of tracks) {
                    this.conference.addTrack(track);
                }
                await addTask;
            }
        }
        async getCurrentAudioInputDevice() {
            const cur = this.getCurrentMediaTrack(StreamType.Audio), devices = await this.getAudioInputDevices(), device = devices.filter((d) => cur != null && d.deviceId === cur.getDeviceId()
                || cur == null && d.deviceId === this.preferredAudioInputID);
            if (device.length === 0) {
                return null;
            }
            else {
                return device[0];
            }
        }
        async getCurrentVideoInputDevice() {
            const cur = this.getCurrentMediaTrack(StreamType.Video), devices = await this.getVideoInputDevices(), device = devices.filter((d) => cur != null && d.deviceId === cur.getDeviceId()
                || cur == null && d.deviceId === this.preferredVideoInputID);
            if (device.length === 0) {
                return null;
            }
            else {
                return device[0];
            }
        }
        async toggleAudioMuted() {
            const changeTask = this.getNext("audioMuteStatusChanged", this.localUserID);
            const cur = this.getCurrentMediaTrack(StreamType.Audio);
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
                await this.setPreferredAudioInput(true);
            }
            const evt = await changeTask;
            return evt.muted;
        }
        async toggleVideoMuted() {
            const changeTask = this.getNext("videoMuteStatusChanged", this.localUserID);
            const cur = this.getCurrentMediaTrack(StreamType.Video);
            if (cur) {
                await this.setVideoInputDevice(null);
            }
            else {
                await this.setPreferredVideoInput(true);
            }
            const evt = await changeTask;
            return evt.muted;
        }
        isMediaMuted(type) {
            const cur = this.getCurrentMediaTrack(type);
            return cur == null
                || cur.isMuted();
        }
        async getAudioMuted() {
            return this.isMediaMuted(StreamType.Audio);
        }
        async getVideoMuted() {
            return this.isMediaMuted(StreamType.Video);
        }
    }

    var ClientState;
    (function (ClientState) {
        ClientState["InConference"] = "in-conference";
        ClientState["JoiningConference"] = "joining-conference";
        ClientState["Connected"] = "connected";
        ClientState["Connecting"] = "connecting";
        ClientState["Prepaired"] = "prepaired";
        ClientState["Prepairing"] = "prepairing";
        ClientState["Unprepared"] = "unprepaired";
    })(ClientState || (ClientState = {}));
    const audioActivityEvt = new AudioActivityEvent();
    class Calla extends TypedEventBase {
        constructor(_fetcher, _tele, _meta) {
            super();
            this._fetcher = _fetcher;
            this._tele = _tele;
            this._meta = _meta;
            this.isAudioMuted = null;
            this.isVideoMuted = null;
            this.disposed = false;
            const fwd = this.dispatchEvent.bind(this);
            this._tele.addEventListener("serverConnected", fwd);
            this._tele.addEventListener("serverDisconnected", fwd);
            this._tele.addEventListener("serverFailed", fwd);
            this._tele.addEventListener("conferenceFailed", fwd);
            this._tele.addEventListener("conferenceRestored", fwd);
            this._tele.addEventListener("audioMuteStatusChanged", fwd);
            this._tele.addEventListener("videoMuteStatusChanged", fwd);
            this._tele.addEventListener("conferenceJoined", async (evt) => {
                const user = this.audio.setLocalUserID(evt.id);
                evt.pose = user.pose;
                this.dispatchEvent(evt);
                await this.setPreferredDevices();
            });
            this._tele.addEventListener("conferenceLeft", (evt) => {
                this.audio.setLocalUserID(evt.id);
                this.dispatchEvent(evt);
            });
            this._tele.addEventListener("participantJoined", async (joinEvt) => {
                joinEvt.source = this.audio.createUser(joinEvt.id);
                this.dispatchEvent(joinEvt);
            });
            this._tele.addEventListener("participantLeft", (evt) => {
                this.dispatchEvent(evt);
                this.audio.removeUser(evt.id);
            });
            this._tele.addEventListener("userNameChanged", fwd);
            this._tele.addEventListener("videoAdded", fwd);
            this._tele.addEventListener("videoRemoved", fwd);
            this._tele.addEventListener("audioAdded", (evt) => {
                const user = this.audio.getUser(evt.id);
                if (user) {
                    let stream = user.streams.get(evt.kind);
                    if (stream) {
                        user.streams.delete(evt.kind);
                    }
                    stream = evt.stream;
                    user.streams.set(evt.kind, stream);
                    if (evt.id !== this._tele.localUserID) {
                        this.audio.setUserStream(evt.id, stream);
                    }
                    this.dispatchEvent(evt);
                }
            });
            this._tele.addEventListener("audioRemoved", (evt) => {
                const user = this.audio.getUser(evt.id);
                if (user && user.streams.has(evt.kind)) {
                    user.streams.delete(evt.kind);
                }
                if (evt.id !== this._tele.localUserID) {
                    this.audio.setUserStream(evt.id, null);
                }
                this.dispatchEvent(evt);
            });
            this._meta.addEventListener("avatarChanged", fwd);
            this._meta.addEventListener("chat", fwd);
            this._meta.addEventListener("emote", fwd);
            this._meta.addEventListener("setAvatarEmoji", fwd);
            const offsetEvt = (poseEvt) => {
                const O = this.audio.getUserOffset(poseEvt.id);
                if (O) {
                    poseEvt.px += O[0];
                    poseEvt.py += O[1];
                    poseEvt.pz += O[2];
                }
                this.dispatchEvent(poseEvt);
            };
            this._meta.addEventListener("userPointer", offsetEvt);
            this._meta.addEventListener("userPosed", (evt) => {
                this.audio.setUserPose(evt.id, evt.px, evt.py, evt.pz, evt.fx, evt.fy, evt.fz, evt.ux, evt.uy, evt.uz);
                offsetEvt(evt);
            });
            this.audio.addEventListener("audioActivity", (evt) => {
                audioActivityEvt.id = evt.id;
                audioActivityEvt.isActive = evt.isActive;
                this.dispatchEvent(audioActivityEvt);
            });
            const dispose = this.dispose.bind(this);
            window.addEventListener("beforeunload", dispose);
            window.addEventListener("unload", dispose);
            window.addEventListener("pagehide", dispose);
            Object.seal(this);
        }
        get connectionState() {
            return this._tele.connectionState;
        }
        get conferenceState() {
            return this._tele.conferenceState;
        }
        get fetcher() {
            return this._fetcher;
        }
        get tele() {
            return this._tele;
        }
        get meta() {
            return this._meta;
        }
        get audio() {
            return this._tele.audio;
        }
        get preferredAudioOutputID() {
            return this._tele.preferredAudioOutputID;
        }
        set preferredAudioOutputID(v) {
            this._tele.preferredAudioOutputID = v;
        }
        get preferredAudioInputID() {
            return this._tele.preferredAudioInputID;
        }
        set preferredAudioInputID(v) {
            this._tele.preferredAudioInputID = v;
        }
        get preferredVideoInputID() {
            return this._tele.preferredVideoInputID;
        }
        set preferredVideoInputID(v) {
            this._tele.preferredVideoInputID = v;
        }
        async getCurrentAudioOutputDevice() {
            return await this._tele.getCurrentAudioOutputDevice();
        }
        async getMediaPermissions() {
            return await this._tele.getMediaPermissions();
        }
        async getAudioOutputDevices(filterDuplicates) {
            return await this._tele.getAudioOutputDevices(filterDuplicates);
        }
        async getAudioInputDevices(filterDuplicates) {
            return await this._tele.getAudioInputDevices(filterDuplicates);
        }
        async getVideoInputDevices(filterDuplicates) {
            return await this._tele.getVideoInputDevices(filterDuplicates);
        }
        dispose() {
            if (!this.disposed) {
                this.leave();
                this.disconnect();
                this.disposed = true;
            }
        }
        get offsetRadius() {
            return this.audio.offsetRadius;
        }
        set offsetRadius(v) {
            this.audio.offsetRadius = v;
        }
        setLocalPose(px, py, pz, fx, fy, fz, ux, uy, uz) {
            this.audio.setUserPose(this.localUserID, px, py, pz, fx, fy, fz, ux, uy, uz, 0);
            this._meta.setLocalPose(px, py, pz, fx, fy, fz, ux, uy, uz);
        }
        setLocalPoseImmediate(px, py, pz, fx, fy, fz, ux, uy, uz) {
            this.audio.setUserPose(this.localUserID, px, py, pz, fx, fy, fz, ux, uy, uz, 0);
            this._meta.setLocalPoseImmediate(px, py, pz, fx, fy, fz, ux, uy, uz);
        }
        setLocalPointer(name, px, py, pz, fx, fy, fz, ux, uy, uz) {
            this._meta.setLocalPointer(name, px, py, pz, fx, fy, fz, ux, uy, uz);
        }
        setAvatarEmoji(emoji) {
            this._meta.setAvatarEmoji(emoji);
        }
        setAvatarURL(url) {
            this._meta.setAvatarURL(url);
        }
        emote(emoji) {
            this._meta.emote(emoji);
        }
        chat(text) {
            this._meta.chat(text);
        }
        async setPreferredDevices() {
            await this._tele.setPreferredDevices();
        }
        async setAudioInputDevice(device) {
            await this._tele.setAudioInputDevice(device);
        }
        async setVideoInputDevice(device) {
            await this._tele.setVideoInputDevice(device);
        }
        async getCurrentAudioInputDevice() {
            return await this._tele.getCurrentAudioInputDevice();
        }
        async getCurrentVideoInputDevice() {
            return await this._tele.getCurrentVideoInputDevice();
        }
        async toggleAudioMuted() {
            return await this._tele.toggleAudioMuted();
        }
        async toggleVideoMuted() {
            return await this._tele.toggleVideoMuted();
        }
        async getAudioMuted() {
            return await this._tele.getAudioMuted();
        }
        async getVideoMuted() {
            return await this._tele.getVideoMuted();
        }
        get metadataState() {
            return this._meta.metadataState;
        }
        get localUserID() {
            return this._tele.localUserID;
        }
        get localUserName() {
            return this._tele.localUserName;
        }
        get roomName() {
            return this._tele.roomName;
        }
        userExists(id) {
            return this._tele.userExists(id);
        }
        getUserNames() {
            return this._tele.getUserNames();
        }
        async connect() {
            await this._tele.connect();
            if (this._tele.connectionState === ConnectionState.Connected) {
                await this._meta.connect();
            }
        }
        async join(roomName) {
            await this._tele.join(roomName);
            if (this._tele.conferenceState === ConnectionState.Connected) {
                await this._meta.join(roomName);
            }
        }
        async identify(userName) {
            await this._tele.identify(userName);
            await this._meta.identify(this.localUserID);
        }
        async leave() {
            await this._meta.leave();
            await this._tele.leave();
        }
        async disconnect() {
            await this._meta.disconnect();
            await this._tele.disconnect();
        }
        update() {
            this.audio.update();
        }
        async setAudioOutputDevice(device) {
            this._tele.setAudioOutputDevice(device);
            if (canChangeAudioOutput) {
                await this.audio.setAudioOutputDeviceID(this._tele.preferredAudioOutputID);
            }
        }
        async setAudioMuted(muted) {
            let isMuted = this.isAudioMuted;
            if (muted !== isMuted) {
                isMuted = await this.toggleAudioMuted();
            }
            return isMuted;
        }
        async setVideoMuted(muted) {
            let isMuted = this.isVideoMuted;
            if (muted !== isMuted) {
                isMuted = await this.toggleVideoMuted();
            }
            return isMuted;
        }
    }

    class BaseClientLoader {
        async load(fetcher, audio, onProgress) {
            let f = null;
            let a = null;
            let p = null;
            if (isDefined(fetcher)
                && !(fetcher instanceof AudioManager)
                && !isFunction(fetcher)) {
                f = fetcher;
            }
            else {
                f = new Fetcher();
            }
            if (fetcher instanceof AudioManager) {
                a = fetcher;
            }
            else if (isDefined(audio)
                && !isFunction(audio)) {
                a = audio;
            }
            else {
                a = new AudioManager(f);
            }
            if (isFunction(fetcher)) {
                p = fetcher;
            }
            else if (isFunction(audio)) {
                p = audio;
            }
            else if (isFunction(onProgress)) {
                p = onProgress;
            }
            await this._load(f, p);
            const t = this.createTeleconferenceClient(f, a);
            const m = this.createMetadataClient(f, a, t);
            return Promise.resolve(new Calla(f, t, m));
        }
    }

    const jQueryPath = "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js";
    class BaseJitsiClientLoader extends BaseClientLoader {
        constructor(host, bridgeHost, bridgeMUC) {
            super();
            this.host = host;
            this.bridgeHost = bridgeHost;
            this.bridgeMUC = bridgeMUC;
            this.loaded = false;
        }
        async _load(fetcher, onProgress) {
            if (!this.loaded) {
                console.info("Connecting to:", this.host);
                const progs = splitProgress(onProgress, [1, 3]);
                await fetcher.loadScript(jQueryPath, () => "jQuery" in globalThis, progs.shift());
                await fetcher.loadScript(`https://${this.host}/libs/lib-jitsi-meet.min.js`, () => "JitsiMeetJS" in globalThis, progs.shift());
                {
                    JitsiMeetJS.setLogLevel(JitsiMeetJS.logLevels.ERROR);
                }
                JitsiMeetJS.init();
                this.loaded = true;
            }
        }
        createTeleconferenceClient(fetcher, audio) {
            if (!this.loaded) {
                throw new Error("lib-jitsi-meet has not been loaded. Call clientFactory.load().");
            }
            return new JitsiTeleconferenceClient(fetcher, audio, this.host, this.bridgeHost, this.bridgeMUC);
        }
    }

    class JitsiOnlyClientLoader extends BaseJitsiClientLoader {
        constructor(host, bridgeHost, bridgeMUC) {
            super(host, bridgeHost, bridgeMUC);
        }
        createMetadataClient(_fetcher, _audio, tele) {
            if (!this.loaded) {
                throw new Error("lib-jitsi-meet has not been loaded. Call clientFactory.load().");
            }
            return new JitsiMetadataClient(tele);
        }
    }

    /**
     * A shorthand for `new EmojiGroup` that allows for setting optional properties
     * on the EmojiGroup object.
     */
    function G(v, d, o, ...r) {
        const emojis = Object.values(o)
            .filter(oo => oo instanceof Emoji)
            .map(oo => oo)
            .concat(...r);
        return Object.assign(new EmojiGroup(v, d, ...emojis), o);
    }
    class EmojiGroup extends Emoji {
        /**
         * Groupings of Unicode-standardized pictograms.
         * @param value - a Unicode sequence.
         * @param desc - an English text description of the pictogram.
         * @param ...rest - Emojis in this group.
         */
        constructor(value, desc, ...alts) {
            super(value, desc);
            this.width = null;
            this.alts = alts;
        }
        /**
         * Selects a random emoji out of the collection.
         **/
        random() {
            const idx = Math.floor(Math.random() * this.alts.length);
            if (idx < 0) {
                return null;
            }
            const selection = this.alts[idx];
            if (selection instanceof EmojiGroup) {
                return selection.random();
            }
            else {
                return selection;
            }
        }
        contains(e) {
            if (super.contains(e)) {
                return true;
            }
            else {
                for (const alt of this.alts) {
                    if (alt.contains(e)) {
                        return true;
                    }
                }
                return false;
            }
        }
    }

    const textStyle = new Emoji("\uFE0E", "Variation Selector-15: text style");
    const emojiStyle = new Emoji("\uFE0F", "Variation Selector-16: emoji style");
    const female = new Emoji("\u2640\uFE0F", "Female");
    const male = new Emoji("\u2642\uFE0F", "Male");
    const transgenderSymbol = new Emoji("\u26A7\uFE0F", "Transgender Symbol");
    const frowning = new Emoji("\u{1F64D}", "Frowning");
    const frowningLightSkinTone = new Emoji("\u{1F64D}\u{1F3FB}", "Frowning: Light Skin Tone");
    const frowningMediumLightSkinTone = new Emoji("\u{1F64D}\u{1F3FC}", "Frowning: Medium-Light Skin Tone");
    const frowningMediumSkinTone = new Emoji("\u{1F64D}\u{1F3FD}", "Frowning: Medium Skin Tone");
    const frowningMediumDarkSkinTone = new Emoji("\u{1F64D}\u{1F3FE}", "Frowning: Medium-Dark Skin Tone");
    const frowningDarkSkinTone = new Emoji("\u{1F64D}\u{1F3FF}", "Frowning: Dark Skin Tone");
    const frowningMale = new Emoji("\u{1F64D}\u200D\u2642\uFE0F", "Frowning: Male");
    const frowningLightSkinToneMale = new Emoji("\u{1F64D}\u{1F3FB}\u200D\u2642\uFE0F", "Frowning: Light Skin Tone: Male");
    const frowningMediumLightSkinToneMale = new Emoji("\u{1F64D}\u{1F3FC}\u200D\u2642\uFE0F", "Frowning: Medium-Light Skin Tone: Male");
    const frowningMediumSkinToneMale = new Emoji("\u{1F64D}\u{1F3FD}\u200D\u2642\uFE0F", "Frowning: Medium Skin Tone: Male");
    const frowningMediumDarkSkinToneMale = new Emoji("\u{1F64D}\u{1F3FE}\u200D\u2642\uFE0F", "Frowning: Medium-Dark Skin Tone: Male");
    const frowningDarkSkinToneMale = new Emoji("\u{1F64D}\u{1F3FF}\u200D\u2642\uFE0F", "Frowning: Dark Skin Tone: Male");
    const frowningFemale = new Emoji("\u{1F64D}\u200D\u2640\uFE0F", "Frowning: Female");
    const frowningLightSkinToneFemale = new Emoji("\u{1F64D}\u{1F3FB}\u200D\u2640\uFE0F", "Frowning: Light Skin Tone: Female");
    const frowningMediumLightSkinToneFemale = new Emoji("\u{1F64D}\u{1F3FC}\u200D\u2640\uFE0F", "Frowning: Medium-Light Skin Tone: Female");
    const frowningMediumSkinToneFemale = new Emoji("\u{1F64D}\u{1F3FD}\u200D\u2640\uFE0F", "Frowning: Medium Skin Tone: Female");
    const frowningMediumDarkSkinToneFemale = new Emoji("\u{1F64D}\u{1F3FE}\u200D\u2640\uFE0F", "Frowning: Medium-Dark Skin Tone: Female");
    const frowningDarkSkinToneFemale = new Emoji("\u{1F64D}\u{1F3FF}\u200D\u2640\uFE0F", "Frowning: Dark Skin Tone: Female");
    const pouting = new Emoji("\u{1F64E}", "Pouting");
    const poutingLightSkinTone = new Emoji("\u{1F64E}\u{1F3FB}", "Pouting: Light Skin Tone");
    const poutingMediumLightSkinTone = new Emoji("\u{1F64E}\u{1F3FC}", "Pouting: Medium-Light Skin Tone");
    const poutingMediumSkinTone = new Emoji("\u{1F64E}\u{1F3FD}", "Pouting: Medium Skin Tone");
    const poutingMediumDarkSkinTone = new Emoji("\u{1F64E}\u{1F3FE}", "Pouting: Medium-Dark Skin Tone");
    const poutingDarkSkinTone = new Emoji("\u{1F64E}\u{1F3FF}", "Pouting: Dark Skin Tone");
    const poutingMale = new Emoji("\u{1F64E}\u200D\u2642\uFE0F", "Pouting: Male");
    const poutingLightSkinToneMale = new Emoji("\u{1F64E}\u{1F3FB}\u200D\u2642\uFE0F", "Pouting: Light Skin Tone: Male");
    const poutingMediumLightSkinToneMale = new Emoji("\u{1F64E}\u{1F3FC}\u200D\u2642\uFE0F", "Pouting: Medium-Light Skin Tone: Male");
    const poutingMediumSkinToneMale = new Emoji("\u{1F64E}\u{1F3FD}\u200D\u2642\uFE0F", "Pouting: Medium Skin Tone: Male");
    const poutingMediumDarkSkinToneMale = new Emoji("\u{1F64E}\u{1F3FE}\u200D\u2642\uFE0F", "Pouting: Medium-Dark Skin Tone: Male");
    const poutingDarkSkinToneMale = new Emoji("\u{1F64E}\u{1F3FF}\u200D\u2642\uFE0F", "Pouting: Dark Skin Tone: Male");
    const poutingFemale = new Emoji("\u{1F64E}\u200D\u2640\uFE0F", "Pouting: Female");
    const poutingLightSkinToneFemale = new Emoji("\u{1F64E}\u{1F3FB}\u200D\u2640\uFE0F", "Pouting: Light Skin Tone: Female");
    const poutingMediumLightSkinToneFemale = new Emoji("\u{1F64E}\u{1F3FC}\u200D\u2640\uFE0F", "Pouting: Medium-Light Skin Tone: Female");
    const poutingMediumSkinToneFemale = new Emoji("\u{1F64E}\u{1F3FD}\u200D\u2640\uFE0F", "Pouting: Medium Skin Tone: Female");
    const poutingMediumDarkSkinToneFemale = new Emoji("\u{1F64E}\u{1F3FE}\u200D\u2640\uFE0F", "Pouting: Medium-Dark Skin Tone: Female");
    const poutingDarkSkinToneFemale = new Emoji("\u{1F64E}\u{1F3FF}\u200D\u2640\uFE0F", "Pouting: Dark Skin Tone: Female");
    const gesturingNO = new Emoji("\u{1F645}", "Gesturing NO");
    const gesturingNOLightSkinTone = new Emoji("\u{1F645}\u{1F3FB}", "Gesturing NO: Light Skin Tone");
    const gesturingNOMediumLightSkinTone = new Emoji("\u{1F645}\u{1F3FC}", "Gesturing NO: Medium-Light Skin Tone");
    const gesturingNOMediumSkinTone = new Emoji("\u{1F645}\u{1F3FD}", "Gesturing NO: Medium Skin Tone");
    const gesturingNOMediumDarkSkinTone = new Emoji("\u{1F645}\u{1F3FE}", "Gesturing NO: Medium-Dark Skin Tone");
    const gesturingNODarkSkinTone = new Emoji("\u{1F645}\u{1F3FF}", "Gesturing NO: Dark Skin Tone");
    const gesturingNOMale = new Emoji("\u{1F645}\u200D\u2642\uFE0F", "Gesturing NO: Male");
    const gesturingNOLightSkinToneMale = new Emoji("\u{1F645}\u{1F3FB}\u200D\u2642\uFE0F", "Gesturing NO: Light Skin Tone: Male");
    const gesturingNOMediumLightSkinToneMale = new Emoji("\u{1F645}\u{1F3FC}\u200D\u2642\uFE0F", "Gesturing NO: Medium-Light Skin Tone: Male");
    const gesturingNOMediumSkinToneMale = new Emoji("\u{1F645}\u{1F3FD}\u200D\u2642\uFE0F", "Gesturing NO: Medium Skin Tone: Male");
    const gesturingNOMediumDarkSkinToneMale = new Emoji("\u{1F645}\u{1F3FE}\u200D\u2642\uFE0F", "Gesturing NO: Medium-Dark Skin Tone: Male");
    const gesturingNODarkSkinToneMale = new Emoji("\u{1F645}\u{1F3FF}\u200D\u2642\uFE0F", "Gesturing NO: Dark Skin Tone: Male");
    const gesturingNOFemale = new Emoji("\u{1F645}\u200D\u2640\uFE0F", "Gesturing NO: Female");
    const gesturingNOLightSkinToneFemale = new Emoji("\u{1F645}\u{1F3FB}\u200D\u2640\uFE0F", "Gesturing NO: Light Skin Tone: Female");
    const gesturingNOMediumLightSkinToneFemale = new Emoji("\u{1F645}\u{1F3FC}\u200D\u2640\uFE0F", "Gesturing NO: Medium-Light Skin Tone: Female");
    const gesturingNOMediumSkinToneFemale = new Emoji("\u{1F645}\u{1F3FD}\u200D\u2640\uFE0F", "Gesturing NO: Medium Skin Tone: Female");
    const gesturingNOMediumDarkSkinToneFemale = new Emoji("\u{1F645}\u{1F3FE}\u200D\u2640\uFE0F", "Gesturing NO: Medium-Dark Skin Tone: Female");
    const gesturingNODarkSkinToneFemale = new Emoji("\u{1F645}\u{1F3FF}\u200D\u2640\uFE0F", "Gesturing NO: Dark Skin Tone: Female");
    const gesturingOK = new Emoji("\u{1F646}", "Gesturing OK");
    const gesturingOKLightSkinTone = new Emoji("\u{1F646}\u{1F3FB}", "Gesturing OK: Light Skin Tone");
    const gesturingOKMediumLightSkinTone = new Emoji("\u{1F646}\u{1F3FC}", "Gesturing OK: Medium-Light Skin Tone");
    const gesturingOKMediumSkinTone = new Emoji("\u{1F646}\u{1F3FD}", "Gesturing OK: Medium Skin Tone");
    const gesturingOKMediumDarkSkinTone = new Emoji("\u{1F646}\u{1F3FE}", "Gesturing OK: Medium-Dark Skin Tone");
    const gesturingOKDarkSkinTone = new Emoji("\u{1F646}\u{1F3FF}", "Gesturing OK: Dark Skin Tone");
    const gesturingOKMale = new Emoji("\u{1F646}\u200D\u2642\uFE0F", "Gesturing OK: Male");
    const gesturingOKLightSkinToneMale = new Emoji("\u{1F646}\u{1F3FB}\u200D\u2642\uFE0F", "Gesturing OK: Light Skin Tone: Male");
    const gesturingOKMediumLightSkinToneMale = new Emoji("\u{1F646}\u{1F3FC}\u200D\u2642\uFE0F", "Gesturing OK: Medium-Light Skin Tone: Male");
    const gesturingOKMediumSkinToneMale = new Emoji("\u{1F646}\u{1F3FD}\u200D\u2642\uFE0F", "Gesturing OK: Medium Skin Tone: Male");
    const gesturingOKMediumDarkSkinToneMale = new Emoji("\u{1F646}\u{1F3FE}\u200D\u2642\uFE0F", "Gesturing OK: Medium-Dark Skin Tone: Male");
    const gesturingOKDarkSkinToneMale = new Emoji("\u{1F646}\u{1F3FF}\u200D\u2642\uFE0F", "Gesturing OK: Dark Skin Tone: Male");
    const gesturingOKFemale = new Emoji("\u{1F646}\u200D\u2640\uFE0F", "Gesturing OK: Female");
    const gesturingOKLightSkinToneFemale = new Emoji("\u{1F646}\u{1F3FB}\u200D\u2640\uFE0F", "Gesturing OK: Light Skin Tone: Female");
    const gesturingOKMediumLightSkinToneFemale = new Emoji("\u{1F646}\u{1F3FC}\u200D\u2640\uFE0F", "Gesturing OK: Medium-Light Skin Tone: Female");
    const gesturingOKMediumSkinToneFemale = new Emoji("\u{1F646}\u{1F3FD}\u200D\u2640\uFE0F", "Gesturing OK: Medium Skin Tone: Female");
    const gesturingOKMediumDarkSkinToneFemale = new Emoji("\u{1F646}\u{1F3FE}\u200D\u2640\uFE0F", "Gesturing OK: Medium-Dark Skin Tone: Female");
    const gesturingOKDarkSkinToneFemale = new Emoji("\u{1F646}\u{1F3FF}\u200D\u2640\uFE0F", "Gesturing OK: Dark Skin Tone: Female");
    const tippingHand = new Emoji("\u{1F481}", "Tipping Hand");
    const tippingHandLightSkinTone = new Emoji("\u{1F481}\u{1F3FB}", "Tipping Hand: Light Skin Tone");
    const tippingHandMediumLightSkinTone = new Emoji("\u{1F481}\u{1F3FC}", "Tipping Hand: Medium-Light Skin Tone");
    const tippingHandMediumSkinTone = new Emoji("\u{1F481}\u{1F3FD}", "Tipping Hand: Medium Skin Tone");
    const tippingHandMediumDarkSkinTone = new Emoji("\u{1F481}\u{1F3FE}", "Tipping Hand: Medium-Dark Skin Tone");
    const tippingHandDarkSkinTone = new Emoji("\u{1F481}\u{1F3FF}", "Tipping Hand: Dark Skin Tone");
    const tippingHandMale = new Emoji("\u{1F481}\u200D\u2642\uFE0F", "Tipping Hand: Male");
    const tippingHandLightSkinToneMale = new Emoji("\u{1F481}\u{1F3FB}\u200D\u2642\uFE0F", "Tipping Hand: Light Skin Tone: Male");
    const tippingHandMediumLightSkinToneMale = new Emoji("\u{1F481}\u{1F3FC}\u200D\u2642\uFE0F", "Tipping Hand: Medium-Light Skin Tone: Male");
    const tippingHandMediumSkinToneMale = new Emoji("\u{1F481}\u{1F3FD}\u200D\u2642\uFE0F", "Tipping Hand: Medium Skin Tone: Male");
    const tippingHandMediumDarkSkinToneMale = new Emoji("\u{1F481}\u{1F3FE}\u200D\u2642\uFE0F", "Tipping Hand: Medium-Dark Skin Tone: Male");
    const tippingHandDarkSkinToneMale = new Emoji("\u{1F481}\u{1F3FF}\u200D\u2642\uFE0F", "Tipping Hand: Dark Skin Tone: Male");
    const tippingHandFemale = new Emoji("\u{1F481}\u200D\u2640\uFE0F", "Tipping Hand: Female");
    const tippingHandLightSkinToneFemale = new Emoji("\u{1F481}\u{1F3FB}\u200D\u2640\uFE0F", "Tipping Hand: Light Skin Tone: Female");
    const tippingHandMediumLightSkinToneFemale = new Emoji("\u{1F481}\u{1F3FC}\u200D\u2640\uFE0F", "Tipping Hand: Medium-Light Skin Tone: Female");
    const tippingHandMediumSkinToneFemale = new Emoji("\u{1F481}\u{1F3FD}\u200D\u2640\uFE0F", "Tipping Hand: Medium Skin Tone: Female");
    const tippingHandMediumDarkSkinToneFemale = new Emoji("\u{1F481}\u{1F3FE}\u200D\u2640\uFE0F", "Tipping Hand: Medium-Dark Skin Tone: Female");
    const tippingHandDarkSkinToneFemale = new Emoji("\u{1F481}\u{1F3FF}\u200D\u2640\uFE0F", "Tipping Hand: Dark Skin Tone: Female");
    const raisingHand = new Emoji("\u{1F64B}", "Raising Hand");
    const raisingHandLightSkinTone = new Emoji("\u{1F64B}\u{1F3FB}", "Raising Hand: Light Skin Tone");
    const raisingHandMediumLightSkinTone = new Emoji("\u{1F64B}\u{1F3FC}", "Raising Hand: Medium-Light Skin Tone");
    const raisingHandMediumSkinTone = new Emoji("\u{1F64B}\u{1F3FD}", "Raising Hand: Medium Skin Tone");
    const raisingHandMediumDarkSkinTone = new Emoji("\u{1F64B}\u{1F3FE}", "Raising Hand: Medium-Dark Skin Tone");
    const raisingHandDarkSkinTone = new Emoji("\u{1F64B}\u{1F3FF}", "Raising Hand: Dark Skin Tone");
    const raisingHandMale = new Emoji("\u{1F64B}\u200D\u2642\uFE0F", "Raising Hand: Male");
    const raisingHandLightSkinToneMale = new Emoji("\u{1F64B}\u{1F3FB}\u200D\u2642\uFE0F", "Raising Hand: Light Skin Tone: Male");
    const raisingHandMediumLightSkinToneMale = new Emoji("\u{1F64B}\u{1F3FC}\u200D\u2642\uFE0F", "Raising Hand: Medium-Light Skin Tone: Male");
    const raisingHandMediumSkinToneMale = new Emoji("\u{1F64B}\u{1F3FD}\u200D\u2642\uFE0F", "Raising Hand: Medium Skin Tone: Male");
    const raisingHandMediumDarkSkinToneMale = new Emoji("\u{1F64B}\u{1F3FE}\u200D\u2642\uFE0F", "Raising Hand: Medium-Dark Skin Tone: Male");
    const raisingHandDarkSkinToneMale = new Emoji("\u{1F64B}\u{1F3FF}\u200D\u2642\uFE0F", "Raising Hand: Dark Skin Tone: Male");
    const raisingHandFemale = new Emoji("\u{1F64B}\u200D\u2640\uFE0F", "Raising Hand: Female");
    const raisingHandLightSkinToneFemale = new Emoji("\u{1F64B}\u{1F3FB}\u200D\u2640\uFE0F", "Raising Hand: Light Skin Tone: Female");
    const raisingHandMediumLightSkinToneFemale = new Emoji("\u{1F64B}\u{1F3FC}\u200D\u2640\uFE0F", "Raising Hand: Medium-Light Skin Tone: Female");
    const raisingHandMediumSkinToneFemale = new Emoji("\u{1F64B}\u{1F3FD}\u200D\u2640\uFE0F", "Raising Hand: Medium Skin Tone: Female");
    const raisingHandMediumDarkSkinToneFemale = new Emoji("\u{1F64B}\u{1F3FE}\u200D\u2640\uFE0F", "Raising Hand: Medium-Dark Skin Tone: Female");
    const raisingHandDarkSkinToneFemale = new Emoji("\u{1F64B}\u{1F3FF}\u200D\u2640\uFE0F", "Raising Hand: Dark Skin Tone: Female");
    const bowing = new Emoji("\u{1F647}", "Bowing");
    const bowingLightSkinTone = new Emoji("\u{1F647}\u{1F3FB}", "Bowing: Light Skin Tone");
    const bowingMediumLightSkinTone = new Emoji("\u{1F647}\u{1F3FC}", "Bowing: Medium-Light Skin Tone");
    const bowingMediumSkinTone = new Emoji("\u{1F647}\u{1F3FD}", "Bowing: Medium Skin Tone");
    const bowingMediumDarkSkinTone = new Emoji("\u{1F647}\u{1F3FE}", "Bowing: Medium-Dark Skin Tone");
    const bowingDarkSkinTone = new Emoji("\u{1F647}\u{1F3FF}", "Bowing: Dark Skin Tone");
    const bowingMale = new Emoji("\u{1F647}\u200D\u2642\uFE0F", "Bowing: Male");
    const bowingLightSkinToneMale = new Emoji("\u{1F647}\u{1F3FB}\u200D\u2642\uFE0F", "Bowing: Light Skin Tone: Male");
    const bowingMediumLightSkinToneMale = new Emoji("\u{1F647}\u{1F3FC}\u200D\u2642\uFE0F", "Bowing: Medium-Light Skin Tone: Male");
    const bowingMediumSkinToneMale = new Emoji("\u{1F647}\u{1F3FD}\u200D\u2642\uFE0F", "Bowing: Medium Skin Tone: Male");
    const bowingMediumDarkSkinToneMale = new Emoji("\u{1F647}\u{1F3FE}\u200D\u2642\uFE0F", "Bowing: Medium-Dark Skin Tone: Male");
    const bowingDarkSkinToneMale = new Emoji("\u{1F647}\u{1F3FF}\u200D\u2642\uFE0F", "Bowing: Dark Skin Tone: Male");
    const bowingFemale = new Emoji("\u{1F647}\u200D\u2640\uFE0F", "Bowing: Female");
    const bowingLightSkinToneFemale = new Emoji("\u{1F647}\u{1F3FB}\u200D\u2640\uFE0F", "Bowing: Light Skin Tone: Female");
    const bowingMediumLightSkinToneFemale = new Emoji("\u{1F647}\u{1F3FC}\u200D\u2640\uFE0F", "Bowing: Medium-Light Skin Tone: Female");
    const bowingMediumSkinToneFemale = new Emoji("\u{1F647}\u{1F3FD}\u200D\u2640\uFE0F", "Bowing: Medium Skin Tone: Female");
    const bowingMediumDarkSkinToneFemale = new Emoji("\u{1F647}\u{1F3FE}\u200D\u2640\uFE0F", "Bowing: Medium-Dark Skin Tone: Female");
    const bowingDarkSkinToneFemale = new Emoji("\u{1F647}\u{1F3FF}\u200D\u2640\uFE0F", "Bowing: Dark Skin Tone: Female");
    const facepalming = new Emoji("\u{1F926}", "Facepalming");
    const facepalmingLightSkinTone = new Emoji("\u{1F926}\u{1F3FB}", "Facepalming: Light Skin Tone");
    const facepalmingMediumLightSkinTone = new Emoji("\u{1F926}\u{1F3FC}", "Facepalming: Medium-Light Skin Tone");
    const facepalmingMediumSkinTone = new Emoji("\u{1F926}\u{1F3FD}", "Facepalming: Medium Skin Tone");
    const facepalmingMediumDarkSkinTone = new Emoji("\u{1F926}\u{1F3FE}", "Facepalming: Medium-Dark Skin Tone");
    const facepalmingDarkSkinTone = new Emoji("\u{1F926}\u{1F3FF}", "Facepalming: Dark Skin Tone");
    const facepalmingMale = new Emoji("\u{1F926}\u200D\u2642\uFE0F", "Facepalming: Male");
    const facepalmingLightSkinToneMale = new Emoji("\u{1F926}\u{1F3FB}\u200D\u2642\uFE0F", "Facepalming: Light Skin Tone: Male");
    const facepalmingMediumLightSkinToneMale = new Emoji("\u{1F926}\u{1F3FC}\u200D\u2642\uFE0F", "Facepalming: Medium-Light Skin Tone: Male");
    const facepalmingMediumSkinToneMale = new Emoji("\u{1F926}\u{1F3FD}\u200D\u2642\uFE0F", "Facepalming: Medium Skin Tone: Male");
    const facepalmingMediumDarkSkinToneMale = new Emoji("\u{1F926}\u{1F3FE}\u200D\u2642\uFE0F", "Facepalming: Medium-Dark Skin Tone: Male");
    const facepalmingDarkSkinToneMale = new Emoji("\u{1F926}\u{1F3FF}\u200D\u2642\uFE0F", "Facepalming: Dark Skin Tone: Male");
    const facepalmingFemale = new Emoji("\u{1F926}\u200D\u2640\uFE0F", "Facepalming: Female");
    const facepalmingLightSkinToneFemale = new Emoji("\u{1F926}\u{1F3FB}\u200D\u2640\uFE0F", "Facepalming: Light Skin Tone: Female");
    const facepalmingMediumLightSkinToneFemale = new Emoji("\u{1F926}\u{1F3FC}\u200D\u2640\uFE0F", "Facepalming: Medium-Light Skin Tone: Female");
    const facepalmingMediumSkinToneFemale = new Emoji("\u{1F926}\u{1F3FD}\u200D\u2640\uFE0F", "Facepalming: Medium Skin Tone: Female");
    const facepalmingMediumDarkSkinToneFemale = new Emoji("\u{1F926}\u{1F3FE}\u200D\u2640\uFE0F", "Facepalming: Medium-Dark Skin Tone: Female");
    const facepalmingDarkSkinToneFemale = new Emoji("\u{1F926}\u{1F3FF}\u200D\u2640\uFE0F", "Facepalming: Dark Skin Tone: Female");
    const shrugging = new Emoji("\u{1F937}", "Shrugging");
    const shruggingLightSkinTone = new Emoji("\u{1F937}\u{1F3FB}", "Shrugging: Light Skin Tone");
    const shruggingMediumLightSkinTone = new Emoji("\u{1F937}\u{1F3FC}", "Shrugging: Medium-Light Skin Tone");
    const shruggingMediumSkinTone = new Emoji("\u{1F937}\u{1F3FD}", "Shrugging: Medium Skin Tone");
    const shruggingMediumDarkSkinTone = new Emoji("\u{1F937}\u{1F3FE}", "Shrugging: Medium-Dark Skin Tone");
    const shruggingDarkSkinTone = new Emoji("\u{1F937}\u{1F3FF}", "Shrugging: Dark Skin Tone");
    const shruggingMale = new Emoji("\u{1F937}\u200D\u2642\uFE0F", "Shrugging: Male");
    const shruggingLightSkinToneMale = new Emoji("\u{1F937}\u{1F3FB}\u200D\u2642\uFE0F", "Shrugging: Light Skin Tone: Male");
    const shruggingMediumLightSkinToneMale = new Emoji("\u{1F937}\u{1F3FC}\u200D\u2642\uFE0F", "Shrugging: Medium-Light Skin Tone: Male");
    const shruggingMediumSkinToneMale = new Emoji("\u{1F937}\u{1F3FD}\u200D\u2642\uFE0F", "Shrugging: Medium Skin Tone: Male");
    const shruggingMediumDarkSkinToneMale = new Emoji("\u{1F937}\u{1F3FE}\u200D\u2642\uFE0F", "Shrugging: Medium-Dark Skin Tone: Male");
    const shruggingDarkSkinToneMale = new Emoji("\u{1F937}\u{1F3FF}\u200D\u2642\uFE0F", "Shrugging: Dark Skin Tone: Male");
    const shruggingFemale = new Emoji("\u{1F937}\u200D\u2640\uFE0F", "Shrugging: Female");
    const shruggingLightSkinToneFemale = new Emoji("\u{1F937}\u{1F3FB}\u200D\u2640\uFE0F", "Shrugging: Light Skin Tone: Female");
    const shruggingMediumLightSkinToneFemale = new Emoji("\u{1F937}\u{1F3FC}\u200D\u2640\uFE0F", "Shrugging: Medium-Light Skin Tone: Female");
    const shruggingMediumSkinToneFemale = new Emoji("\u{1F937}\u{1F3FD}\u200D\u2640\uFE0F", "Shrugging: Medium Skin Tone: Female");
    const shruggingMediumDarkSkinToneFemale = new Emoji("\u{1F937}\u{1F3FE}\u200D\u2640\uFE0F", "Shrugging: Medium-Dark Skin Tone: Female");
    const shruggingDarkSkinToneFemale = new Emoji("\u{1F937}\u{1F3FF}\u200D\u2640\uFE0F", "Shrugging: Dark Skin Tone: Female");
    const cantHear = new Emoji("\u{1F9CF}", "Can't Hear");
    const cantHearLightSkinTone = new Emoji("\u{1F9CF}\u{1F3FB}", "Can't Hear: Light Skin Tone");
    const cantHearMediumLightSkinTone = new Emoji("\u{1F9CF}\u{1F3FC}", "Can't Hear: Medium-Light Skin Tone");
    const cantHearMediumSkinTone = new Emoji("\u{1F9CF}\u{1F3FD}", "Can't Hear: Medium Skin Tone");
    const cantHearMediumDarkSkinTone = new Emoji("\u{1F9CF}\u{1F3FE}", "Can't Hear: Medium-Dark Skin Tone");
    const cantHearDarkSkinTone = new Emoji("\u{1F9CF}\u{1F3FF}", "Can't Hear: Dark Skin Tone");
    const cantHearMale = new Emoji("\u{1F9CF}\u200D\u2642\uFE0F", "Can't Hear: Male");
    const cantHearLightSkinToneMale = new Emoji("\u{1F9CF}\u{1F3FB}\u200D\u2642\uFE0F", "Can't Hear: Light Skin Tone: Male");
    const cantHearMediumLightSkinToneMale = new Emoji("\u{1F9CF}\u{1F3FC}\u200D\u2642\uFE0F", "Can't Hear: Medium-Light Skin Tone: Male");
    const cantHearMediumSkinToneMale = new Emoji("\u{1F9CF}\u{1F3FD}\u200D\u2642\uFE0F", "Can't Hear: Medium Skin Tone: Male");
    const cantHearMediumDarkSkinToneMale = new Emoji("\u{1F9CF}\u{1F3FE}\u200D\u2642\uFE0F", "Can't Hear: Medium-Dark Skin Tone: Male");
    const cantHearDarkSkinToneMale = new Emoji("\u{1F9CF}\u{1F3FF}\u200D\u2642\uFE0F", "Can't Hear: Dark Skin Tone: Male");
    const cantHearFemale = new Emoji("\u{1F9CF}\u200D\u2640\uFE0F", "Can't Hear: Female");
    const cantHearLightSkinToneFemale = new Emoji("\u{1F9CF}\u{1F3FB}\u200D\u2640\uFE0F", "Can't Hear: Light Skin Tone: Female");
    const cantHearMediumLightSkinToneFemale = new Emoji("\u{1F9CF}\u{1F3FC}\u200D\u2640\uFE0F", "Can't Hear: Medium-Light Skin Tone: Female");
    const cantHearMediumSkinToneFemale = new Emoji("\u{1F9CF}\u{1F3FD}\u200D\u2640\uFE0F", "Can't Hear: Medium Skin Tone: Female");
    const cantHearMediumDarkSkinToneFemale = new Emoji("\u{1F9CF}\u{1F3FE}\u200D\u2640\uFE0F", "Can't Hear: Medium-Dark Skin Tone: Female");
    const cantHearDarkSkinToneFemale = new Emoji("\u{1F9CF}\u{1F3FF}\u200D\u2640\uFE0F", "Can't Hear: Dark Skin Tone: Female");
    const gettingMassage = new Emoji("\u{1F486}", "Getting Massage");
    const gettingMassageLightSkinTone = new Emoji("\u{1F486}\u{1F3FB}", "Getting Massage: Light Skin Tone");
    const gettingMassageMediumLightSkinTone = new Emoji("\u{1F486}\u{1F3FC}", "Getting Massage: Medium-Light Skin Tone");
    const gettingMassageMediumSkinTone = new Emoji("\u{1F486}\u{1F3FD}", "Getting Massage: Medium Skin Tone");
    const gettingMassageMediumDarkSkinTone = new Emoji("\u{1F486}\u{1F3FE}", "Getting Massage: Medium-Dark Skin Tone");
    const gettingMassageDarkSkinTone = new Emoji("\u{1F486}\u{1F3FF}", "Getting Massage: Dark Skin Tone");
    const gettingMassageMale = new Emoji("\u{1F486}\u200D\u2642\uFE0F", "Getting Massage: Male");
    const gettingMassageLightSkinToneMale = new Emoji("\u{1F486}\u{1F3FB}\u200D\u2642\uFE0F", "Getting Massage: Light Skin Tone: Male");
    const gettingMassageMediumLightSkinToneMale = new Emoji("\u{1F486}\u{1F3FC}\u200D\u2642\uFE0F", "Getting Massage: Medium-Light Skin Tone: Male");
    const gettingMassageMediumSkinToneMale = new Emoji("\u{1F486}\u{1F3FD}\u200D\u2642\uFE0F", "Getting Massage: Medium Skin Tone: Male");
    const gettingMassageMediumDarkSkinToneMale = new Emoji("\u{1F486}\u{1F3FE}\u200D\u2642\uFE0F", "Getting Massage: Medium-Dark Skin Tone: Male");
    const gettingMassageDarkSkinToneMale = new Emoji("\u{1F486}\u{1F3FF}\u200D\u2642\uFE0F", "Getting Massage: Dark Skin Tone: Male");
    const gettingMassageFemale = new Emoji("\u{1F486}\u200D\u2640\uFE0F", "Getting Massage: Female");
    const gettingMassageLightSkinToneFemale = new Emoji("\u{1F486}\u{1F3FB}\u200D\u2640\uFE0F", "Getting Massage: Light Skin Tone: Female");
    const gettingMassageMediumLightSkinToneFemale = new Emoji("\u{1F486}\u{1F3FC}\u200D\u2640\uFE0F", "Getting Massage: Medium-Light Skin Tone: Female");
    const gettingMassageMediumSkinToneFemale = new Emoji("\u{1F486}\u{1F3FD}\u200D\u2640\uFE0F", "Getting Massage: Medium Skin Tone: Female");
    const gettingMassageMediumDarkSkinToneFemale = new Emoji("\u{1F486}\u{1F3FE}\u200D\u2640\uFE0F", "Getting Massage: Medium-Dark Skin Tone: Female");
    const gettingMassageDarkSkinToneFemale = new Emoji("\u{1F486}\u{1F3FF}\u200D\u2640\uFE0F", "Getting Massage: Dark Skin Tone: Female");
    const gettingHaircut = new Emoji("\u{1F487}", "Getting Haircut");
    const gettingHaircutLightSkinTone = new Emoji("\u{1F487}\u{1F3FB}", "Getting Haircut: Light Skin Tone");
    const gettingHaircutMediumLightSkinTone = new Emoji("\u{1F487}\u{1F3FC}", "Getting Haircut: Medium-Light Skin Tone");
    const gettingHaircutMediumSkinTone = new Emoji("\u{1F487}\u{1F3FD}", "Getting Haircut: Medium Skin Tone");
    const gettingHaircutMediumDarkSkinTone = new Emoji("\u{1F487}\u{1F3FE}", "Getting Haircut: Medium-Dark Skin Tone");
    const gettingHaircutDarkSkinTone = new Emoji("\u{1F487}\u{1F3FF}", "Getting Haircut: Dark Skin Tone");
    const gettingHaircutMale = new Emoji("\u{1F487}\u200D\u2642\uFE0F", "Getting Haircut: Male");
    const gettingHaircutLightSkinToneMale = new Emoji("\u{1F487}\u{1F3FB}\u200D\u2642\uFE0F", "Getting Haircut: Light Skin Tone: Male");
    const gettingHaircutMediumLightSkinToneMale = new Emoji("\u{1F487}\u{1F3FC}\u200D\u2642\uFE0F", "Getting Haircut: Medium-Light Skin Tone: Male");
    const gettingHaircutMediumSkinToneMale = new Emoji("\u{1F487}\u{1F3FD}\u200D\u2642\uFE0F", "Getting Haircut: Medium Skin Tone: Male");
    const gettingHaircutMediumDarkSkinToneMale = new Emoji("\u{1F487}\u{1F3FE}\u200D\u2642\uFE0F", "Getting Haircut: Medium-Dark Skin Tone: Male");
    const gettingHaircutDarkSkinToneMale = new Emoji("\u{1F487}\u{1F3FF}\u200D\u2642\uFE0F", "Getting Haircut: Dark Skin Tone: Male");
    const gettingHaircutFemale = new Emoji("\u{1F487}\u200D\u2640\uFE0F", "Getting Haircut: Female");
    const gettingHaircutLightSkinToneFemale = new Emoji("\u{1F487}\u{1F3FB}\u200D\u2640\uFE0F", "Getting Haircut: Light Skin Tone: Female");
    const gettingHaircutMediumLightSkinToneFemale = new Emoji("\u{1F487}\u{1F3FC}\u200D\u2640\uFE0F", "Getting Haircut: Medium-Light Skin Tone: Female");
    const gettingHaircutMediumSkinToneFemale = new Emoji("\u{1F487}\u{1F3FD}\u200D\u2640\uFE0F", "Getting Haircut: Medium Skin Tone: Female");
    const gettingHaircutMediumDarkSkinToneFemale = new Emoji("\u{1F487}\u{1F3FE}\u200D\u2640\uFE0F", "Getting Haircut: Medium-Dark Skin Tone: Female");
    const gettingHaircutDarkSkinToneFemale = new Emoji("\u{1F487}\u{1F3FF}\u200D\u2640\uFE0F", "Getting Haircut: Dark Skin Tone: Female");
    const constructionWorker = new Emoji("\u{1F477}", "Construction Worker");
    const constructionWorkerLightSkinTone = new Emoji("\u{1F477}\u{1F3FB}", "Construction Worker: Light Skin Tone");
    const constructionWorkerMediumLightSkinTone = new Emoji("\u{1F477}\u{1F3FC}", "Construction Worker: Medium-Light Skin Tone");
    const constructionWorkerMediumSkinTone = new Emoji("\u{1F477}\u{1F3FD}", "Construction Worker: Medium Skin Tone");
    const constructionWorkerMediumDarkSkinTone = new Emoji("\u{1F477}\u{1F3FE}", "Construction Worker: Medium-Dark Skin Tone");
    const constructionWorkerDarkSkinTone = new Emoji("\u{1F477}\u{1F3FF}", "Construction Worker: Dark Skin Tone");
    const constructionWorkerMale = new Emoji("\u{1F477}\u200D\u2642\uFE0F", "Construction Worker: Male");
    const constructionWorkerLightSkinToneMale = new Emoji("\u{1F477}\u{1F3FB}\u200D\u2642\uFE0F", "Construction Worker: Light Skin Tone: Male");
    const constructionWorkerMediumLightSkinToneMale = new Emoji("\u{1F477}\u{1F3FC}\u200D\u2642\uFE0F", "Construction Worker: Medium-Light Skin Tone: Male");
    const constructionWorkerMediumSkinToneMale = new Emoji("\u{1F477}\u{1F3FD}\u200D\u2642\uFE0F", "Construction Worker: Medium Skin Tone: Male");
    const constructionWorkerMediumDarkSkinToneMale = new Emoji("\u{1F477}\u{1F3FE}\u200D\u2642\uFE0F", "Construction Worker: Medium-Dark Skin Tone: Male");
    const constructionWorkerDarkSkinToneMale = new Emoji("\u{1F477}\u{1F3FF}\u200D\u2642\uFE0F", "Construction Worker: Dark Skin Tone: Male");
    const constructionWorkerFemale = new Emoji("\u{1F477}\u200D\u2640\uFE0F", "Construction Worker: Female");
    const constructionWorkerLightSkinToneFemale = new Emoji("\u{1F477}\u{1F3FB}\u200D\u2640\uFE0F", "Construction Worker: Light Skin Tone: Female");
    const constructionWorkerMediumLightSkinToneFemale = new Emoji("\u{1F477}\u{1F3FC}\u200D\u2640\uFE0F", "Construction Worker: Medium-Light Skin Tone: Female");
    const constructionWorkerMediumSkinToneFemale = new Emoji("\u{1F477}\u{1F3FD}\u200D\u2640\uFE0F", "Construction Worker: Medium Skin Tone: Female");
    const constructionWorkerMediumDarkSkinToneFemale = new Emoji("\u{1F477}\u{1F3FE}\u200D\u2640\uFE0F", "Construction Worker: Medium-Dark Skin Tone: Female");
    const constructionWorkerDarkSkinToneFemale = new Emoji("\u{1F477}\u{1F3FF}\u200D\u2640\uFE0F", "Construction Worker: Dark Skin Tone: Female");
    const guard = new Emoji("\u{1F482}", "Guard");
    const guardLightSkinTone = new Emoji("\u{1F482}\u{1F3FB}", "Guard: Light Skin Tone");
    const guardMediumLightSkinTone = new Emoji("\u{1F482}\u{1F3FC}", "Guard: Medium-Light Skin Tone");
    const guardMediumSkinTone = new Emoji("\u{1F482}\u{1F3FD}", "Guard: Medium Skin Tone");
    const guardMediumDarkSkinTone = new Emoji("\u{1F482}\u{1F3FE}", "Guard: Medium-Dark Skin Tone");
    const guardDarkSkinTone = new Emoji("\u{1F482}\u{1F3FF}", "Guard: Dark Skin Tone");
    const guardMale = new Emoji("\u{1F482}\u200D\u2642\uFE0F", "Guard: Male");
    const guardLightSkinToneMale = new Emoji("\u{1F482}\u{1F3FB}\u200D\u2642\uFE0F", "Guard: Light Skin Tone: Male");
    const guardMediumLightSkinToneMale = new Emoji("\u{1F482}\u{1F3FC}\u200D\u2642\uFE0F", "Guard: Medium-Light Skin Tone: Male");
    const guardMediumSkinToneMale = new Emoji("\u{1F482}\u{1F3FD}\u200D\u2642\uFE0F", "Guard: Medium Skin Tone: Male");
    const guardMediumDarkSkinToneMale = new Emoji("\u{1F482}\u{1F3FE}\u200D\u2642\uFE0F", "Guard: Medium-Dark Skin Tone: Male");
    const guardDarkSkinToneMale = new Emoji("\u{1F482}\u{1F3FF}\u200D\u2642\uFE0F", "Guard: Dark Skin Tone: Male");
    const guardFemale = new Emoji("\u{1F482}\u200D\u2640\uFE0F", "Guard: Female");
    const guardLightSkinToneFemale = new Emoji("\u{1F482}\u{1F3FB}\u200D\u2640\uFE0F", "Guard: Light Skin Tone: Female");
    const guardMediumLightSkinToneFemale = new Emoji("\u{1F482}\u{1F3FC}\u200D\u2640\uFE0F", "Guard: Medium-Light Skin Tone: Female");
    const guardMediumSkinToneFemale = new Emoji("\u{1F482}\u{1F3FD}\u200D\u2640\uFE0F", "Guard: Medium Skin Tone: Female");
    const guardMediumDarkSkinToneFemale = new Emoji("\u{1F482}\u{1F3FE}\u200D\u2640\uFE0F", "Guard: Medium-Dark Skin Tone: Female");
    const guardDarkSkinToneFemale = new Emoji("\u{1F482}\u{1F3FF}\u200D\u2640\uFE0F", "Guard: Dark Skin Tone: Female");
    const spy = new Emoji("\u{1F575}", "Spy");
    const spyLightSkinTone = new Emoji("\u{1F575}\u{1F3FB}", "Spy: Light Skin Tone");
    const spyMediumLightSkinTone = new Emoji("\u{1F575}\u{1F3FC}", "Spy: Medium-Light Skin Tone");
    const spyMediumSkinTone = new Emoji("\u{1F575}\u{1F3FD}", "Spy: Medium Skin Tone");
    const spyMediumDarkSkinTone = new Emoji("\u{1F575}\u{1F3FE}", "Spy: Medium-Dark Skin Tone");
    const spyDarkSkinTone = new Emoji("\u{1F575}\u{1F3FF}", "Spy: Dark Skin Tone");
    const spyMale = new Emoji("\u{1F575}\u200D\u2642\uFE0F", "Spy: Male");
    const spyLightSkinToneMale = new Emoji("\u{1F575}\u{1F3FB}\u200D\u2642\uFE0F", "Spy: Light Skin Tone: Male");
    const spyMediumLightSkinToneMale = new Emoji("\u{1F575}\u{1F3FC}\u200D\u2642\uFE0F", "Spy: Medium-Light Skin Tone: Male");
    const spyMediumSkinToneMale = new Emoji("\u{1F575}\u{1F3FD}\u200D\u2642\uFE0F", "Spy: Medium Skin Tone: Male");
    const spyMediumDarkSkinToneMale = new Emoji("\u{1F575}\u{1F3FE}\u200D\u2642\uFE0F", "Spy: Medium-Dark Skin Tone: Male");
    const spyDarkSkinToneMale = new Emoji("\u{1F575}\u{1F3FF}\u200D\u2642\uFE0F", "Spy: Dark Skin Tone: Male");
    const spyFemale = new Emoji("\u{1F575}\u200D\u2640\uFE0F", "Spy: Female");
    const spyLightSkinToneFemale = new Emoji("\u{1F575}\u{1F3FB}\u200D\u2640\uFE0F", "Spy: Light Skin Tone: Female");
    const spyMediumLightSkinToneFemale = new Emoji("\u{1F575}\u{1F3FC}\u200D\u2640\uFE0F", "Spy: Medium-Light Skin Tone: Female");
    const spyMediumSkinToneFemale = new Emoji("\u{1F575}\u{1F3FD}\u200D\u2640\uFE0F", "Spy: Medium Skin Tone: Female");
    const spyMediumDarkSkinToneFemale = new Emoji("\u{1F575}\u{1F3FE}\u200D\u2640\uFE0F", "Spy: Medium-Dark Skin Tone: Female");
    const spyDarkSkinToneFemale = new Emoji("\u{1F575}\u{1F3FF}\u200D\u2640\uFE0F", "Spy: Dark Skin Tone: Female");
    const police = new Emoji("\u{1F46E}", "Police");
    const policeLightSkinTone = new Emoji("\u{1F46E}\u{1F3FB}", "Police: Light Skin Tone");
    const policeMediumLightSkinTone = new Emoji("\u{1F46E}\u{1F3FC}", "Police: Medium-Light Skin Tone");
    const policeMediumSkinTone = new Emoji("\u{1F46E}\u{1F3FD}", "Police: Medium Skin Tone");
    const policeMediumDarkSkinTone = new Emoji("\u{1F46E}\u{1F3FE}", "Police: Medium-Dark Skin Tone");
    const policeDarkSkinTone = new Emoji("\u{1F46E}\u{1F3FF}", "Police: Dark Skin Tone");
    const policeMale = new Emoji("\u{1F46E}\u200D\u2642\uFE0F", "Police: Male");
    const policeLightSkinToneMale = new Emoji("\u{1F46E}\u{1F3FB}\u200D\u2642\uFE0F", "Police: Light Skin Tone: Male");
    const policeMediumLightSkinToneMale = new Emoji("\u{1F46E}\u{1F3FC}\u200D\u2642\uFE0F", "Police: Medium-Light Skin Tone: Male");
    const policeMediumSkinToneMale = new Emoji("\u{1F46E}\u{1F3FD}\u200D\u2642\uFE0F", "Police: Medium Skin Tone: Male");
    const policeMediumDarkSkinToneMale = new Emoji("\u{1F46E}\u{1F3FE}\u200D\u2642\uFE0F", "Police: Medium-Dark Skin Tone: Male");
    const policeDarkSkinToneMale = new Emoji("\u{1F46E}\u{1F3FF}\u200D\u2642\uFE0F", "Police: Dark Skin Tone: Male");
    const policeFemale = new Emoji("\u{1F46E}\u200D\u2640\uFE0F", "Police: Female");
    const policeLightSkinToneFemale = new Emoji("\u{1F46E}\u{1F3FB}\u200D\u2640\uFE0F", "Police: Light Skin Tone: Female");
    const policeMediumLightSkinToneFemale = new Emoji("\u{1F46E}\u{1F3FC}\u200D\u2640\uFE0F", "Police: Medium-Light Skin Tone: Female");
    const policeMediumSkinToneFemale = new Emoji("\u{1F46E}\u{1F3FD}\u200D\u2640\uFE0F", "Police: Medium Skin Tone: Female");
    const policeMediumDarkSkinToneFemale = new Emoji("\u{1F46E}\u{1F3FE}\u200D\u2640\uFE0F", "Police: Medium-Dark Skin Tone: Female");
    const policeDarkSkinToneFemale = new Emoji("\u{1F46E}\u{1F3FF}\u200D\u2640\uFE0F", "Police: Dark Skin Tone: Female");
    const wearingTurban = new Emoji("\u{1F473}", "Wearing Turban");
    const wearingTurbanLightSkinTone = new Emoji("\u{1F473}\u{1F3FB}", "Wearing Turban: Light Skin Tone");
    const wearingTurbanMediumLightSkinTone = new Emoji("\u{1F473}\u{1F3FC}", "Wearing Turban: Medium-Light Skin Tone");
    const wearingTurbanMediumSkinTone = new Emoji("\u{1F473}\u{1F3FD}", "Wearing Turban: Medium Skin Tone");
    const wearingTurbanMediumDarkSkinTone = new Emoji("\u{1F473}\u{1F3FE}", "Wearing Turban: Medium-Dark Skin Tone");
    const wearingTurbanDarkSkinTone = new Emoji("\u{1F473}\u{1F3FF}", "Wearing Turban: Dark Skin Tone");
    const wearingTurbanMale = new Emoji("\u{1F473}\u200D\u2642\uFE0F", "Wearing Turban: Male");
    const wearingTurbanLightSkinToneMale = new Emoji("\u{1F473}\u{1F3FB}\u200D\u2642\uFE0F", "Wearing Turban: Light Skin Tone: Male");
    const wearingTurbanMediumLightSkinToneMale = new Emoji("\u{1F473}\u{1F3FC}\u200D\u2642\uFE0F", "Wearing Turban: Medium-Light Skin Tone: Male");
    const wearingTurbanMediumSkinToneMale = new Emoji("\u{1F473}\u{1F3FD}\u200D\u2642\uFE0F", "Wearing Turban: Medium Skin Tone: Male");
    const wearingTurbanMediumDarkSkinToneMale = new Emoji("\u{1F473}\u{1F3FE}\u200D\u2642\uFE0F", "Wearing Turban: Medium-Dark Skin Tone: Male");
    const wearingTurbanDarkSkinToneMale = new Emoji("\u{1F473}\u{1F3FF}\u200D\u2642\uFE0F", "Wearing Turban: Dark Skin Tone: Male");
    const wearingTurbanFemale = new Emoji("\u{1F473}\u200D\u2640\uFE0F", "Wearing Turban: Female");
    const wearingTurbanLightSkinToneFemale = new Emoji("\u{1F473}\u{1F3FB}\u200D\u2640\uFE0F", "Wearing Turban: Light Skin Tone: Female");
    const wearingTurbanMediumLightSkinToneFemale = new Emoji("\u{1F473}\u{1F3FC}\u200D\u2640\uFE0F", "Wearing Turban: Medium-Light Skin Tone: Female");
    const wearingTurbanMediumSkinToneFemale = new Emoji("\u{1F473}\u{1F3FD}\u200D\u2640\uFE0F", "Wearing Turban: Medium Skin Tone: Female");
    const wearingTurbanMediumDarkSkinToneFemale = new Emoji("\u{1F473}\u{1F3FE}\u200D\u2640\uFE0F", "Wearing Turban: Medium-Dark Skin Tone: Female");
    const wearingTurbanDarkSkinToneFemale = new Emoji("\u{1F473}\u{1F3FF}\u200D\u2640\uFE0F", "Wearing Turban: Dark Skin Tone: Female");
    const superhero = new Emoji("\u{1F9B8}", "Superhero");
    const superheroLightSkinTone = new Emoji("\u{1F9B8}\u{1F3FB}", "Superhero: Light Skin Tone");
    const superheroMediumLightSkinTone = new Emoji("\u{1F9B8}\u{1F3FC}", "Superhero: Medium-Light Skin Tone");
    const superheroMediumSkinTone = new Emoji("\u{1F9B8}\u{1F3FD}", "Superhero: Medium Skin Tone");
    const superheroMediumDarkSkinTone = new Emoji("\u{1F9B8}\u{1F3FE}", "Superhero: Medium-Dark Skin Tone");
    const superheroDarkSkinTone = new Emoji("\u{1F9B8}\u{1F3FF}", "Superhero: Dark Skin Tone");
    const superheroMale = new Emoji("\u{1F9B8}\u200D\u2642\uFE0F", "Superhero: Male");
    const superheroLightSkinToneMale = new Emoji("\u{1F9B8}\u{1F3FB}\u200D\u2642\uFE0F", "Superhero: Light Skin Tone: Male");
    const superheroMediumLightSkinToneMale = new Emoji("\u{1F9B8}\u{1F3FC}\u200D\u2642\uFE0F", "Superhero: Medium-Light Skin Tone: Male");
    const superheroMediumSkinToneMale = new Emoji("\u{1F9B8}\u{1F3FD}\u200D\u2642\uFE0F", "Superhero: Medium Skin Tone: Male");
    const superheroMediumDarkSkinToneMale = new Emoji("\u{1F9B8}\u{1F3FE}\u200D\u2642\uFE0F", "Superhero: Medium-Dark Skin Tone: Male");
    const superheroDarkSkinToneMale = new Emoji("\u{1F9B8}\u{1F3FF}\u200D\u2642\uFE0F", "Superhero: Dark Skin Tone: Male");
    const superheroFemale = new Emoji("\u{1F9B8}\u200D\u2640\uFE0F", "Superhero: Female");
    const superheroLightSkinToneFemale = new Emoji("\u{1F9B8}\u{1F3FB}\u200D\u2640\uFE0F", "Superhero: Light Skin Tone: Female");
    const superheroMediumLightSkinToneFemale = new Emoji("\u{1F9B8}\u{1F3FC}\u200D\u2640\uFE0F", "Superhero: Medium-Light Skin Tone: Female");
    const superheroMediumSkinToneFemale = new Emoji("\u{1F9B8}\u{1F3FD}\u200D\u2640\uFE0F", "Superhero: Medium Skin Tone: Female");
    const superheroMediumDarkSkinToneFemale = new Emoji("\u{1F9B8}\u{1F3FE}\u200D\u2640\uFE0F", "Superhero: Medium-Dark Skin Tone: Female");
    const superheroDarkSkinToneFemale = new Emoji("\u{1F9B8}\u{1F3FF}\u200D\u2640\uFE0F", "Superhero: Dark Skin Tone: Female");
    const supervillain = new Emoji("\u{1F9B9}", "Supervillain");
    const supervillainLightSkinTone = new Emoji("\u{1F9B9}\u{1F3FB}", "Supervillain: Light Skin Tone");
    const supervillainMediumLightSkinTone = new Emoji("\u{1F9B9}\u{1F3FC}", "Supervillain: Medium-Light Skin Tone");
    const supervillainMediumSkinTone = new Emoji("\u{1F9B9}\u{1F3FD}", "Supervillain: Medium Skin Tone");
    const supervillainMediumDarkSkinTone = new Emoji("\u{1F9B9}\u{1F3FE}", "Supervillain: Medium-Dark Skin Tone");
    const supervillainDarkSkinTone = new Emoji("\u{1F9B9}\u{1F3FF}", "Supervillain: Dark Skin Tone");
    const supervillainMale = new Emoji("\u{1F9B9}\u200D\u2642\uFE0F", "Supervillain: Male");
    const supervillainLightSkinToneMale = new Emoji("\u{1F9B9}\u{1F3FB}\u200D\u2642\uFE0F", "Supervillain: Light Skin Tone: Male");
    const supervillainMediumLightSkinToneMale = new Emoji("\u{1F9B9}\u{1F3FC}\u200D\u2642\uFE0F", "Supervillain: Medium-Light Skin Tone: Male");
    const supervillainMediumSkinToneMale = new Emoji("\u{1F9B9}\u{1F3FD}\u200D\u2642\uFE0F", "Supervillain: Medium Skin Tone: Male");
    const supervillainMediumDarkSkinToneMale = new Emoji("\u{1F9B9}\u{1F3FE}\u200D\u2642\uFE0F", "Supervillain: Medium-Dark Skin Tone: Male");
    const supervillainDarkSkinToneMale = new Emoji("\u{1F9B9}\u{1F3FF}\u200D\u2642\uFE0F", "Supervillain: Dark Skin Tone: Male");
    const supervillainFemale = new Emoji("\u{1F9B9}\u200D\u2640\uFE0F", "Supervillain: Female");
    const supervillainLightSkinToneFemale = new Emoji("\u{1F9B9}\u{1F3FB}\u200D\u2640\uFE0F", "Supervillain: Light Skin Tone: Female");
    const supervillainMediumLightSkinToneFemale = new Emoji("\u{1F9B9}\u{1F3FC}\u200D\u2640\uFE0F", "Supervillain: Medium-Light Skin Tone: Female");
    const supervillainMediumSkinToneFemale = new Emoji("\u{1F9B9}\u{1F3FD}\u200D\u2640\uFE0F", "Supervillain: Medium Skin Tone: Female");
    const supervillainMediumDarkSkinToneFemale = new Emoji("\u{1F9B9}\u{1F3FE}\u200D\u2640\uFE0F", "Supervillain: Medium-Dark Skin Tone: Female");
    const supervillainDarkSkinToneFemale = new Emoji("\u{1F9B9}\u{1F3FF}\u200D\u2640\uFE0F", "Supervillain: Dark Skin Tone: Female");
    const mage = new Emoji("\u{1F9D9}", "Mage");
    const mageLightSkinTone = new Emoji("\u{1F9D9}\u{1F3FB}", "Mage: Light Skin Tone");
    const mageMediumLightSkinTone = new Emoji("\u{1F9D9}\u{1F3FC}", "Mage: Medium-Light Skin Tone");
    const mageMediumSkinTone = new Emoji("\u{1F9D9}\u{1F3FD}", "Mage: Medium Skin Tone");
    const mageMediumDarkSkinTone = new Emoji("\u{1F9D9}\u{1F3FE}", "Mage: Medium-Dark Skin Tone");
    const mageDarkSkinTone = new Emoji("\u{1F9D9}\u{1F3FF}", "Mage: Dark Skin Tone");
    const mageMale = new Emoji("\u{1F9D9}\u200D\u2642\uFE0F", "Mage: Male");
    const mageLightSkinToneMale = new Emoji("\u{1F9D9}\u{1F3FB}\u200D\u2642\uFE0F", "Mage: Light Skin Tone: Male");
    const mageMediumLightSkinToneMale = new Emoji("\u{1F9D9}\u{1F3FC}\u200D\u2642\uFE0F", "Mage: Medium-Light Skin Tone: Male");
    const mageMediumSkinToneMale = new Emoji("\u{1F9D9}\u{1F3FD}\u200D\u2642\uFE0F", "Mage: Medium Skin Tone: Male");
    const mageMediumDarkSkinToneMale = new Emoji("\u{1F9D9}\u{1F3FE}\u200D\u2642\uFE0F", "Mage: Medium-Dark Skin Tone: Male");
    const mageDarkSkinToneMale = new Emoji("\u{1F9D9}\u{1F3FF}\u200D\u2642\uFE0F", "Mage: Dark Skin Tone: Male");
    const mageFemale = new Emoji("\u{1F9D9}\u200D\u2640\uFE0F", "Mage: Female");
    const mageLightSkinToneFemale = new Emoji("\u{1F9D9}\u{1F3FB}\u200D\u2640\uFE0F", "Mage: Light Skin Tone: Female");
    const mageMediumLightSkinToneFemale = new Emoji("\u{1F9D9}\u{1F3FC}\u200D\u2640\uFE0F", "Mage: Medium-Light Skin Tone: Female");
    const mageMediumSkinToneFemale = new Emoji("\u{1F9D9}\u{1F3FD}\u200D\u2640\uFE0F", "Mage: Medium Skin Tone: Female");
    const mageMediumDarkSkinToneFemale = new Emoji("\u{1F9D9}\u{1F3FE}\u200D\u2640\uFE0F", "Mage: Medium-Dark Skin Tone: Female");
    const mageDarkSkinToneFemale = new Emoji("\u{1F9D9}\u{1F3FF}\u200D\u2640\uFE0F", "Mage: Dark Skin Tone: Female");
    const fairy = new Emoji("\u{1F9DA}", "Fairy");
    const fairyLightSkinTone = new Emoji("\u{1F9DA}\u{1F3FB}", "Fairy: Light Skin Tone");
    const fairyMediumLightSkinTone = new Emoji("\u{1F9DA}\u{1F3FC}", "Fairy: Medium-Light Skin Tone");
    const fairyMediumSkinTone = new Emoji("\u{1F9DA}\u{1F3FD}", "Fairy: Medium Skin Tone");
    const fairyMediumDarkSkinTone = new Emoji("\u{1F9DA}\u{1F3FE}", "Fairy: Medium-Dark Skin Tone");
    const fairyDarkSkinTone = new Emoji("\u{1F9DA}\u{1F3FF}", "Fairy: Dark Skin Tone");
    const fairyMale = new Emoji("\u{1F9DA}\u200D\u2642\uFE0F", "Fairy: Male");
    const fairyLightSkinToneMale = new Emoji("\u{1F9DA}\u{1F3FB}\u200D\u2642\uFE0F", "Fairy: Light Skin Tone: Male");
    const fairyMediumLightSkinToneMale = new Emoji("\u{1F9DA}\u{1F3FC}\u200D\u2642\uFE0F", "Fairy: Medium-Light Skin Tone: Male");
    const fairyMediumSkinToneMale = new Emoji("\u{1F9DA}\u{1F3FD}\u200D\u2642\uFE0F", "Fairy: Medium Skin Tone: Male");
    const fairyMediumDarkSkinToneMale = new Emoji("\u{1F9DA}\u{1F3FE}\u200D\u2642\uFE0F", "Fairy: Medium-Dark Skin Tone: Male");
    const fairyDarkSkinToneMale = new Emoji("\u{1F9DA}\u{1F3FF}\u200D\u2642\uFE0F", "Fairy: Dark Skin Tone: Male");
    const fairyFemale = new Emoji("\u{1F9DA}\u200D\u2640\uFE0F", "Fairy: Female");
    const fairyLightSkinToneFemale = new Emoji("\u{1F9DA}\u{1F3FB}\u200D\u2640\uFE0F", "Fairy: Light Skin Tone: Female");
    const fairyMediumLightSkinToneFemale = new Emoji("\u{1F9DA}\u{1F3FC}\u200D\u2640\uFE0F", "Fairy: Medium-Light Skin Tone: Female");
    const fairyMediumSkinToneFemale = new Emoji("\u{1F9DA}\u{1F3FD}\u200D\u2640\uFE0F", "Fairy: Medium Skin Tone: Female");
    const fairyMediumDarkSkinToneFemale = new Emoji("\u{1F9DA}\u{1F3FE}\u200D\u2640\uFE0F", "Fairy: Medium-Dark Skin Tone: Female");
    const fairyDarkSkinToneFemale = new Emoji("\u{1F9DA}\u{1F3FF}\u200D\u2640\uFE0F", "Fairy: Dark Skin Tone: Female");
    const vampire = new Emoji("\u{1F9DB}", "Vampire");
    const vampireLightSkinTone = new Emoji("\u{1F9DB}\u{1F3FB}", "Vampire: Light Skin Tone");
    const vampireMediumLightSkinTone = new Emoji("\u{1F9DB}\u{1F3FC}", "Vampire: Medium-Light Skin Tone");
    const vampireMediumSkinTone = new Emoji("\u{1F9DB}\u{1F3FD}", "Vampire: Medium Skin Tone");
    const vampireMediumDarkSkinTone = new Emoji("\u{1F9DB}\u{1F3FE}", "Vampire: Medium-Dark Skin Tone");
    const vampireDarkSkinTone = new Emoji("\u{1F9DB}\u{1F3FF}", "Vampire: Dark Skin Tone");
    const vampireMale = new Emoji("\u{1F9DB}\u200D\u2642\uFE0F", "Vampire: Male");
    const vampireLightSkinToneMale = new Emoji("\u{1F9DB}\u{1F3FB}\u200D\u2642\uFE0F", "Vampire: Light Skin Tone: Male");
    const vampireMediumLightSkinToneMale = new Emoji("\u{1F9DB}\u{1F3FC}\u200D\u2642\uFE0F", "Vampire: Medium-Light Skin Tone: Male");
    const vampireMediumSkinToneMale = new Emoji("\u{1F9DB}\u{1F3FD}\u200D\u2642\uFE0F", "Vampire: Medium Skin Tone: Male");
    const vampireMediumDarkSkinToneMale = new Emoji("\u{1F9DB}\u{1F3FE}\u200D\u2642\uFE0F", "Vampire: Medium-Dark Skin Tone: Male");
    const vampireDarkSkinToneMale = new Emoji("\u{1F9DB}\u{1F3FF}\u200D\u2642\uFE0F", "Vampire: Dark Skin Tone: Male");
    const vampireFemale = new Emoji("\u{1F9DB}\u200D\u2640\uFE0F", "Vampire: Female");
    const vampireLightSkinToneFemale = new Emoji("\u{1F9DB}\u{1F3FB}\u200D\u2640\uFE0F", "Vampire: Light Skin Tone: Female");
    const vampireMediumLightSkinToneFemale = new Emoji("\u{1F9DB}\u{1F3FC}\u200D\u2640\uFE0F", "Vampire: Medium-Light Skin Tone: Female");
    const vampireMediumSkinToneFemale = new Emoji("\u{1F9DB}\u{1F3FD}\u200D\u2640\uFE0F", "Vampire: Medium Skin Tone: Female");
    const vampireMediumDarkSkinToneFemale = new Emoji("\u{1F9DB}\u{1F3FE}\u200D\u2640\uFE0F", "Vampire: Medium-Dark Skin Tone: Female");
    const vampireDarkSkinToneFemale = new Emoji("\u{1F9DB}\u{1F3FF}\u200D\u2640\uFE0F", "Vampire: Dark Skin Tone: Female");
    const merperson = new Emoji("\u{1F9DC}", "Merperson");
    const merpersonLightSkinTone = new Emoji("\u{1F9DC}\u{1F3FB}", "Merperson: Light Skin Tone");
    const merpersonMediumLightSkinTone = new Emoji("\u{1F9DC}\u{1F3FC}", "Merperson: Medium-Light Skin Tone");
    const merpersonMediumSkinTone = new Emoji("\u{1F9DC}\u{1F3FD}", "Merperson: Medium Skin Tone");
    const merpersonMediumDarkSkinTone = new Emoji("\u{1F9DC}\u{1F3FE}", "Merperson: Medium-Dark Skin Tone");
    const merpersonDarkSkinTone = new Emoji("\u{1F9DC}\u{1F3FF}", "Merperson: Dark Skin Tone");
    const merpersonMale = new Emoji("\u{1F9DC}\u200D\u2642\uFE0F", "Merperson: Male");
    const merpersonLightSkinToneMale = new Emoji("\u{1F9DC}\u{1F3FB}\u200D\u2642\uFE0F", "Merperson: Light Skin Tone: Male");
    const merpersonMediumLightSkinToneMale = new Emoji("\u{1F9DC}\u{1F3FC}\u200D\u2642\uFE0F", "Merperson: Medium-Light Skin Tone: Male");
    const merpersonMediumSkinToneMale = new Emoji("\u{1F9DC}\u{1F3FD}\u200D\u2642\uFE0F", "Merperson: Medium Skin Tone: Male");
    const merpersonMediumDarkSkinToneMale = new Emoji("\u{1F9DC}\u{1F3FE}\u200D\u2642\uFE0F", "Merperson: Medium-Dark Skin Tone: Male");
    const merpersonDarkSkinToneMale = new Emoji("\u{1F9DC}\u{1F3FF}\u200D\u2642\uFE0F", "Merperson: Dark Skin Tone: Male");
    const merpersonFemale = new Emoji("\u{1F9DC}\u200D\u2640\uFE0F", "Merperson: Female");
    const merpersonLightSkinToneFemale = new Emoji("\u{1F9DC}\u{1F3FB}\u200D\u2640\uFE0F", "Merperson: Light Skin Tone: Female");
    const merpersonMediumLightSkinToneFemale = new Emoji("\u{1F9DC}\u{1F3FC}\u200D\u2640\uFE0F", "Merperson: Medium-Light Skin Tone: Female");
    const merpersonMediumSkinToneFemale = new Emoji("\u{1F9DC}\u{1F3FD}\u200D\u2640\uFE0F", "Merperson: Medium Skin Tone: Female");
    const merpersonMediumDarkSkinToneFemale = new Emoji("\u{1F9DC}\u{1F3FE}\u200D\u2640\uFE0F", "Merperson: Medium-Dark Skin Tone: Female");
    const merpersonDarkSkinToneFemale = new Emoji("\u{1F9DC}\u{1F3FF}\u200D\u2640\uFE0F", "Merperson: Dark Skin Tone: Female");
    const elf = new Emoji("\u{1F9DD}", "Elf");
    const elfLightSkinTone = new Emoji("\u{1F9DD}\u{1F3FB}", "Elf: Light Skin Tone");
    const elfMediumLightSkinTone = new Emoji("\u{1F9DD}\u{1F3FC}", "Elf: Medium-Light Skin Tone");
    const elfMediumSkinTone = new Emoji("\u{1F9DD}\u{1F3FD}", "Elf: Medium Skin Tone");
    const elfMediumDarkSkinTone = new Emoji("\u{1F9DD}\u{1F3FE}", "Elf: Medium-Dark Skin Tone");
    const elfDarkSkinTone = new Emoji("\u{1F9DD}\u{1F3FF}", "Elf: Dark Skin Tone");
    const elfMale = new Emoji("\u{1F9DD}\u200D\u2642\uFE0F", "Elf: Male");
    const elfLightSkinToneMale = new Emoji("\u{1F9DD}\u{1F3FB}\u200D\u2642\uFE0F", "Elf: Light Skin Tone: Male");
    const elfMediumLightSkinToneMale = new Emoji("\u{1F9DD}\u{1F3FC}\u200D\u2642\uFE0F", "Elf: Medium-Light Skin Tone: Male");
    const elfMediumSkinToneMale = new Emoji("\u{1F9DD}\u{1F3FD}\u200D\u2642\uFE0F", "Elf: Medium Skin Tone: Male");
    const elfMediumDarkSkinToneMale = new Emoji("\u{1F9DD}\u{1F3FE}\u200D\u2642\uFE0F", "Elf: Medium-Dark Skin Tone: Male");
    const elfDarkSkinToneMale = new Emoji("\u{1F9DD}\u{1F3FF}\u200D\u2642\uFE0F", "Elf: Dark Skin Tone: Male");
    const elfFemale = new Emoji("\u{1F9DD}\u200D\u2640\uFE0F", "Elf: Female");
    const elfLightSkinToneFemale = new Emoji("\u{1F9DD}\u{1F3FB}\u200D\u2640\uFE0F", "Elf: Light Skin Tone: Female");
    const elfMediumLightSkinToneFemale = new Emoji("\u{1F9DD}\u{1F3FC}\u200D\u2640\uFE0F", "Elf: Medium-Light Skin Tone: Female");
    const elfMediumSkinToneFemale = new Emoji("\u{1F9DD}\u{1F3FD}\u200D\u2640\uFE0F", "Elf: Medium Skin Tone: Female");
    const elfMediumDarkSkinToneFemale = new Emoji("\u{1F9DD}\u{1F3FE}\u200D\u2640\uFE0F", "Elf: Medium-Dark Skin Tone: Female");
    const elfDarkSkinToneFemale = new Emoji("\u{1F9DD}\u{1F3FF}\u200D\u2640\uFE0F", "Elf: Dark Skin Tone: Female");
    const walking = new Emoji("\u{1F6B6}", "Walking");
    const walkingLightSkinTone = new Emoji("\u{1F6B6}\u{1F3FB}", "Walking: Light Skin Tone");
    const walkingMediumLightSkinTone = new Emoji("\u{1F6B6}\u{1F3FC}", "Walking: Medium-Light Skin Tone");
    const walkingMediumSkinTone = new Emoji("\u{1F6B6}\u{1F3FD}", "Walking: Medium Skin Tone");
    const walkingMediumDarkSkinTone = new Emoji("\u{1F6B6}\u{1F3FE}", "Walking: Medium-Dark Skin Tone");
    const walkingDarkSkinTone = new Emoji("\u{1F6B6}\u{1F3FF}", "Walking: Dark Skin Tone");
    const walkingMale = new Emoji("\u{1F6B6}\u200D\u2642\uFE0F", "Walking: Male");
    const walkingLightSkinToneMale = new Emoji("\u{1F6B6}\u{1F3FB}\u200D\u2642\uFE0F", "Walking: Light Skin Tone: Male");
    const walkingMediumLightSkinToneMale = new Emoji("\u{1F6B6}\u{1F3FC}\u200D\u2642\uFE0F", "Walking: Medium-Light Skin Tone: Male");
    const walkingMediumSkinToneMale = new Emoji("\u{1F6B6}\u{1F3FD}\u200D\u2642\uFE0F", "Walking: Medium Skin Tone: Male");
    const walkingMediumDarkSkinToneMale = new Emoji("\u{1F6B6}\u{1F3FE}\u200D\u2642\uFE0F", "Walking: Medium-Dark Skin Tone: Male");
    const walkingDarkSkinToneMale = new Emoji("\u{1F6B6}\u{1F3FF}\u200D\u2642\uFE0F", "Walking: Dark Skin Tone: Male");
    const walkingFemale = new Emoji("\u{1F6B6}\u200D\u2640\uFE0F", "Walking: Female");
    const walkingLightSkinToneFemale = new Emoji("\u{1F6B6}\u{1F3FB}\u200D\u2640\uFE0F", "Walking: Light Skin Tone: Female");
    const walkingMediumLightSkinToneFemale = new Emoji("\u{1F6B6}\u{1F3FC}\u200D\u2640\uFE0F", "Walking: Medium-Light Skin Tone: Female");
    const walkingMediumSkinToneFemale = new Emoji("\u{1F6B6}\u{1F3FD}\u200D\u2640\uFE0F", "Walking: Medium Skin Tone: Female");
    const walkingMediumDarkSkinToneFemale = new Emoji("\u{1F6B6}\u{1F3FE}\u200D\u2640\uFE0F", "Walking: Medium-Dark Skin Tone: Female");
    const walkingDarkSkinToneFemale = new Emoji("\u{1F6B6}\u{1F3FF}\u200D\u2640\uFE0F", "Walking: Dark Skin Tone: Female");
    const standing = new Emoji("\u{1F9CD}", "Standing");
    const standingLightSkinTone = new Emoji("\u{1F9CD}\u{1F3FB}", "Standing: Light Skin Tone");
    const standingMediumLightSkinTone = new Emoji("\u{1F9CD}\u{1F3FC}", "Standing: Medium-Light Skin Tone");
    const standingMediumSkinTone = new Emoji("\u{1F9CD}\u{1F3FD}", "Standing: Medium Skin Tone");
    const standingMediumDarkSkinTone = new Emoji("\u{1F9CD}\u{1F3FE}", "Standing: Medium-Dark Skin Tone");
    const standingDarkSkinTone = new Emoji("\u{1F9CD}\u{1F3FF}", "Standing: Dark Skin Tone");
    const standingMale = new Emoji("\u{1F9CD}\u200D\u2642\uFE0F", "Standing: Male");
    const standingLightSkinToneMale = new Emoji("\u{1F9CD}\u{1F3FB}\u200D\u2642\uFE0F", "Standing: Light Skin Tone: Male");
    const standingMediumLightSkinToneMale = new Emoji("\u{1F9CD}\u{1F3FC}\u200D\u2642\uFE0F", "Standing: Medium-Light Skin Tone: Male");
    const standingMediumSkinToneMale = new Emoji("\u{1F9CD}\u{1F3FD}\u200D\u2642\uFE0F", "Standing: Medium Skin Tone: Male");
    const standingMediumDarkSkinToneMale = new Emoji("\u{1F9CD}\u{1F3FE}\u200D\u2642\uFE0F", "Standing: Medium-Dark Skin Tone: Male");
    const standingDarkSkinToneMale = new Emoji("\u{1F9CD}\u{1F3FF}\u200D\u2642\uFE0F", "Standing: Dark Skin Tone: Male");
    const standingFemale = new Emoji("\u{1F9CD}\u200D\u2640\uFE0F", "Standing: Female");
    const standingLightSkinToneFemale = new Emoji("\u{1F9CD}\u{1F3FB}\u200D\u2640\uFE0F", "Standing: Light Skin Tone: Female");
    const standingMediumLightSkinToneFemale = new Emoji("\u{1F9CD}\u{1F3FC}\u200D\u2640\uFE0F", "Standing: Medium-Light Skin Tone: Female");
    const standingMediumSkinToneFemale = new Emoji("\u{1F9CD}\u{1F3FD}\u200D\u2640\uFE0F", "Standing: Medium Skin Tone: Female");
    const standingMediumDarkSkinToneFemale = new Emoji("\u{1F9CD}\u{1F3FE}\u200D\u2640\uFE0F", "Standing: Medium-Dark Skin Tone: Female");
    const standingDarkSkinToneFemale = new Emoji("\u{1F9CD}\u{1F3FF}\u200D\u2640\uFE0F", "Standing: Dark Skin Tone: Female");
    const kneeling = new Emoji("\u{1F9CE}", "Kneeling");
    const kneelingLightSkinTone = new Emoji("\u{1F9CE}\u{1F3FB}", "Kneeling: Light Skin Tone");
    const kneelingMediumLightSkinTone = new Emoji("\u{1F9CE}\u{1F3FC}", "Kneeling: Medium-Light Skin Tone");
    const kneelingMediumSkinTone = new Emoji("\u{1F9CE}\u{1F3FD}", "Kneeling: Medium Skin Tone");
    const kneelingMediumDarkSkinTone = new Emoji("\u{1F9CE}\u{1F3FE}", "Kneeling: Medium-Dark Skin Tone");
    const kneelingDarkSkinTone = new Emoji("\u{1F9CE}\u{1F3FF}", "Kneeling: Dark Skin Tone");
    const kneelingMale = new Emoji("\u{1F9CE}\u200D\u2642\uFE0F", "Kneeling: Male");
    const kneelingLightSkinToneMale = new Emoji("\u{1F9CE}\u{1F3FB}\u200D\u2642\uFE0F", "Kneeling: Light Skin Tone: Male");
    const kneelingMediumLightSkinToneMale = new Emoji("\u{1F9CE}\u{1F3FC}\u200D\u2642\uFE0F", "Kneeling: Medium-Light Skin Tone: Male");
    const kneelingMediumSkinToneMale = new Emoji("\u{1F9CE}\u{1F3FD}\u200D\u2642\uFE0F", "Kneeling: Medium Skin Tone: Male");
    const kneelingMediumDarkSkinToneMale = new Emoji("\u{1F9CE}\u{1F3FE}\u200D\u2642\uFE0F", "Kneeling: Medium-Dark Skin Tone: Male");
    const kneelingDarkSkinToneMale = new Emoji("\u{1F9CE}\u{1F3FF}\u200D\u2642\uFE0F", "Kneeling: Dark Skin Tone: Male");
    const kneelingFemale = new Emoji("\u{1F9CE}\u200D\u2640\uFE0F", "Kneeling: Female");
    const kneelingLightSkinToneFemale = new Emoji("\u{1F9CE}\u{1F3FB}\u200D\u2640\uFE0F", "Kneeling: Light Skin Tone: Female");
    const kneelingMediumLightSkinToneFemale = new Emoji("\u{1F9CE}\u{1F3FC}\u200D\u2640\uFE0F", "Kneeling: Medium-Light Skin Tone: Female");
    const kneelingMediumSkinToneFemale = new Emoji("\u{1F9CE}\u{1F3FD}\u200D\u2640\uFE0F", "Kneeling: Medium Skin Tone: Female");
    const kneelingMediumDarkSkinToneFemale = new Emoji("\u{1F9CE}\u{1F3FE}\u200D\u2640\uFE0F", "Kneeling: Medium-Dark Skin Tone: Female");
    const kneelingDarkSkinToneFemale = new Emoji("\u{1F9CE}\u{1F3FF}\u200D\u2640\uFE0F", "Kneeling: Dark Skin Tone: Female");
    const running = new Emoji("\u{1F3C3}", "Running");
    const runningLightSkinTone = new Emoji("\u{1F3C3}\u{1F3FB}", "Running: Light Skin Tone");
    const runningMediumLightSkinTone = new Emoji("\u{1F3C3}\u{1F3FC}", "Running: Medium-Light Skin Tone");
    const runningMediumSkinTone = new Emoji("\u{1F3C3}\u{1F3FD}", "Running: Medium Skin Tone");
    const runningMediumDarkSkinTone = new Emoji("\u{1F3C3}\u{1F3FE}", "Running: Medium-Dark Skin Tone");
    const runningDarkSkinTone = new Emoji("\u{1F3C3}\u{1F3FF}", "Running: Dark Skin Tone");
    const runningMale = new Emoji("\u{1F3C3}\u200D\u2642\uFE0F", "Running: Male");
    const runningLightSkinToneMale = new Emoji("\u{1F3C3}\u{1F3FB}\u200D\u2642\uFE0F", "Running: Light Skin Tone: Male");
    const runningMediumLightSkinToneMale = new Emoji("\u{1F3C3}\u{1F3FC}\u200D\u2642\uFE0F", "Running: Medium-Light Skin Tone: Male");
    const runningMediumSkinToneMale = new Emoji("\u{1F3C3}\u{1F3FD}\u200D\u2642\uFE0F", "Running: Medium Skin Tone: Male");
    const runningMediumDarkSkinToneMale = new Emoji("\u{1F3C3}\u{1F3FE}\u200D\u2642\uFE0F", "Running: Medium-Dark Skin Tone: Male");
    const runningDarkSkinToneMale = new Emoji("\u{1F3C3}\u{1F3FF}\u200D\u2642\uFE0F", "Running: Dark Skin Tone: Male");
    const runningFemale = new Emoji("\u{1F3C3}\u200D\u2640\uFE0F", "Running: Female");
    const runningLightSkinToneFemale = new Emoji("\u{1F3C3}\u{1F3FB}\u200D\u2640\uFE0F", "Running: Light Skin Tone: Female");
    const runningMediumLightSkinToneFemale = new Emoji("\u{1F3C3}\u{1F3FC}\u200D\u2640\uFE0F", "Running: Medium-Light Skin Tone: Female");
    const runningMediumSkinToneFemale = new Emoji("\u{1F3C3}\u{1F3FD}\u200D\u2640\uFE0F", "Running: Medium Skin Tone: Female");
    const runningMediumDarkSkinToneFemale = new Emoji("\u{1F3C3}\u{1F3FE}\u200D\u2640\uFE0F", "Running: Medium-Dark Skin Tone: Female");
    const runningDarkSkinToneFemale = new Emoji("\u{1F3C3}\u{1F3FF}\u200D\u2640\uFE0F", "Running: Dark Skin Tone: Female");
    const baby = new Emoji("\u{1F476}", "Baby");
    const babyLightSkinTone = new Emoji("\u{1F476}\u{1F3FB}", "Baby: Light Skin Tone");
    const babyMediumLightSkinTone = new Emoji("\u{1F476}\u{1F3FC}", "Baby: Medium-Light Skin Tone");
    const babyMediumSkinTone = new Emoji("\u{1F476}\u{1F3FD}", "Baby: Medium Skin Tone");
    const babyMediumDarkSkinTone = new Emoji("\u{1F476}\u{1F3FE}", "Baby: Medium-Dark Skin Tone");
    const babyDarkSkinTone = new Emoji("\u{1F476}\u{1F3FF}", "Baby: Dark Skin Tone");
    const child = new Emoji("\u{1F9D2}", "Child");
    const childLightSkinTone = new Emoji("\u{1F9D2}\u{1F3FB}", "Child: Light Skin Tone");
    const childMediumLightSkinTone = new Emoji("\u{1F9D2}\u{1F3FC}", "Child: Medium-Light Skin Tone");
    const childMediumSkinTone = new Emoji("\u{1F9D2}\u{1F3FD}", "Child: Medium Skin Tone");
    const childMediumDarkSkinTone = new Emoji("\u{1F9D2}\u{1F3FE}", "Child: Medium-Dark Skin Tone");
    const childDarkSkinTone = new Emoji("\u{1F9D2}\u{1F3FF}", "Child: Dark Skin Tone");
    const boy = new Emoji("\u{1F466}", "Boy");
    const boyLightSkinTone = new Emoji("\u{1F466}\u{1F3FB}", "Boy: Light Skin Tone");
    const boyMediumLightSkinTone = new Emoji("\u{1F466}\u{1F3FC}", "Boy: Medium-Light Skin Tone");
    const boyMediumSkinTone = new Emoji("\u{1F466}\u{1F3FD}", "Boy: Medium Skin Tone");
    const boyMediumDarkSkinTone = new Emoji("\u{1F466}\u{1F3FE}", "Boy: Medium-Dark Skin Tone");
    const boyDarkSkinTone = new Emoji("\u{1F466}\u{1F3FF}", "Boy: Dark Skin Tone");
    const girl = new Emoji("\u{1F467}", "Girl");
    const girlLightSkinTone = new Emoji("\u{1F467}\u{1F3FB}", "Girl: Light Skin Tone");
    const girlMediumLightSkinTone = new Emoji("\u{1F467}\u{1F3FC}", "Girl: Medium-Light Skin Tone");
    const girlMediumSkinTone = new Emoji("\u{1F467}\u{1F3FD}", "Girl: Medium Skin Tone");
    const girlMediumDarkSkinTone = new Emoji("\u{1F467}\u{1F3FE}", "Girl: Medium-Dark Skin Tone");
    const girlDarkSkinTone = new Emoji("\u{1F467}\u{1F3FF}", "Girl: Dark Skin Tone");
    const blondPerson = new Emoji("\u{1F471}", "Blond Person");
    const blondPersonLightSkinTone = new Emoji("\u{1F471}\u{1F3FB}", "Blond Person: Light Skin Tone");
    const blondPersonMediumLightSkinTone = new Emoji("\u{1F471}\u{1F3FC}", "Blond Person: Medium-Light Skin Tone");
    const blondPersonMediumSkinTone = new Emoji("\u{1F471}\u{1F3FD}", "Blond Person: Medium Skin Tone");
    const blondPersonMediumDarkSkinTone = new Emoji("\u{1F471}\u{1F3FE}", "Blond Person: Medium-Dark Skin Tone");
    const blondPersonDarkSkinTone = new Emoji("\u{1F471}\u{1F3FF}", "Blond Person: Dark Skin Tone");
    const blondPersonMale = new Emoji("\u{1F471}\u200D\u2642\uFE0F", "Blond Person: Male");
    const blondPersonLightSkinToneMale = new Emoji("\u{1F471}\u{1F3FB}\u200D\u2642\uFE0F", "Blond Person: Light Skin Tone: Male");
    const blondPersonMediumLightSkinToneMale = new Emoji("\u{1F471}\u{1F3FC}\u200D\u2642\uFE0F", "Blond Person: Medium-Light Skin Tone: Male");
    const blondPersonMediumSkinToneMale = new Emoji("\u{1F471}\u{1F3FD}\u200D\u2642\uFE0F", "Blond Person: Medium Skin Tone: Male");
    const blondPersonMediumDarkSkinToneMale = new Emoji("\u{1F471}\u{1F3FE}\u200D\u2642\uFE0F", "Blond Person: Medium-Dark Skin Tone: Male");
    const blondPersonDarkSkinToneMale = new Emoji("\u{1F471}\u{1F3FF}\u200D\u2642\uFE0F", "Blond Person: Dark Skin Tone: Male");
    const blondPersonFemale = new Emoji("\u{1F471}\u200D\u2640\uFE0F", "Blond Person: Female");
    const blondPersonLightSkinToneFemale = new Emoji("\u{1F471}\u{1F3FB}\u200D\u2640\uFE0F", "Blond Person: Light Skin Tone: Female");
    const blondPersonMediumLightSkinToneFemale = new Emoji("\u{1F471}\u{1F3FC}\u200D\u2640\uFE0F", "Blond Person: Medium-Light Skin Tone: Female");
    const blondPersonMediumSkinToneFemale = new Emoji("\u{1F471}\u{1F3FD}\u200D\u2640\uFE0F", "Blond Person: Medium Skin Tone: Female");
    const blondPersonMediumDarkSkinToneFemale = new Emoji("\u{1F471}\u{1F3FE}\u200D\u2640\uFE0F", "Blond Person: Medium-Dark Skin Tone: Female");
    const blondPersonDarkSkinToneFemale = new Emoji("\u{1F471}\u{1F3FF}\u200D\u2640\uFE0F", "Blond Person: Dark Skin Tone: Female");
    const person = new Emoji("\u{1F9D1}", "Person");
    const personLightSkinTone = new Emoji("\u{1F9D1}\u{1F3FB}", "Person: Light Skin Tone");
    const personMediumLightSkinTone = new Emoji("\u{1F9D1}\u{1F3FC}", "Person: Medium-Light Skin Tone");
    const personMediumSkinTone = new Emoji("\u{1F9D1}\u{1F3FD}", "Person: Medium Skin Tone");
    const personMediumDarkSkinTone = new Emoji("\u{1F9D1}\u{1F3FE}", "Person: Medium-Dark Skin Tone");
    const personDarkSkinTone = new Emoji("\u{1F9D1}\u{1F3FF}", "Person: Dark Skin Tone");
    const beardedMan = new Emoji("\u{1F9D4}", "Bearded Man");
    const beardedManLightSkinTone = new Emoji("\u{1F9D4}\u{1F3FB}", "Bearded Man: Light Skin Tone");
    const beardedManMediumLightSkinTone = new Emoji("\u{1F9D4}\u{1F3FC}", "Bearded Man: Medium-Light Skin Tone");
    const beardedManMediumSkinTone = new Emoji("\u{1F9D4}\u{1F3FD}", "Bearded Man: Medium Skin Tone");
    const beardedManMediumDarkSkinTone = new Emoji("\u{1F9D4}\u{1F3FE}", "Bearded Man: Medium-Dark Skin Tone");
    const beardedManDarkSkinTone = new Emoji("\u{1F9D4}\u{1F3FF}", "Bearded Man: Dark Skin Tone");
    const manInSuitLevitating = new Emoji("\u{1F574}\uFE0F", "Man in Suit, Levitating");
    const manWithChineseCap = new Emoji("\u{1F472}", "Man With Chinese Cap");
    const manWithChineseCapLightSkinTone = new Emoji("\u{1F472}\u{1F3FB}", "Man With Chinese Cap: Light Skin Tone");
    const manWithChineseCapMediumLightSkinTone = new Emoji("\u{1F472}\u{1F3FC}", "Man With Chinese Cap: Medium-Light Skin Tone");
    const manWithChineseCapMediumSkinTone = new Emoji("\u{1F472}\u{1F3FD}", "Man With Chinese Cap: Medium Skin Tone");
    const manWithChineseCapMediumDarkSkinTone = new Emoji("\u{1F472}\u{1F3FE}", "Man With Chinese Cap: Medium-Dark Skin Tone");
    const manWithChineseCapDarkSkinTone = new Emoji("\u{1F472}\u{1F3FF}", "Man With Chinese Cap: Dark Skin Tone");
    const manInTuxedo = new Emoji("\u{1F935}", "Man in Tuxedo");
    const manInTuxedoLightSkinTone = new Emoji("\u{1F935}\u{1F3FB}", "Man in Tuxedo: Light Skin Tone");
    const manInTuxedoMediumLightSkinTone = new Emoji("\u{1F935}\u{1F3FC}", "Man in Tuxedo: Medium-Light Skin Tone");
    const manInTuxedoMediumSkinTone = new Emoji("\u{1F935}\u{1F3FD}", "Man in Tuxedo: Medium Skin Tone");
    const manInTuxedoMediumDarkSkinTone = new Emoji("\u{1F935}\u{1F3FE}", "Man in Tuxedo: Medium-Dark Skin Tone");
    const manInTuxedoDarkSkinTone = new Emoji("\u{1F935}\u{1F3FF}", "Man in Tuxedo: Dark Skin Tone");
    const man = new Emoji("\u{1F468}", "Man");
    const manLightSkinTone = new Emoji("\u{1F468}\u{1F3FB}", "Man: Light Skin Tone");
    const manMediumLightSkinTone = new Emoji("\u{1F468}\u{1F3FC}", "Man: Medium-Light Skin Tone");
    const manMediumSkinTone = new Emoji("\u{1F468}\u{1F3FD}", "Man: Medium Skin Tone");
    const manMediumDarkSkinTone = new Emoji("\u{1F468}\u{1F3FE}", "Man: Medium-Dark Skin Tone");
    const manDarkSkinTone = new Emoji("\u{1F468}\u{1F3FF}", "Man: Dark Skin Tone");
    const manRedHair = new Emoji("\u{1F468}\u200D\u{1F9B0}", "Man: Red Hair");
    const manLightSkinToneRedHair = new Emoji("\u{1F468}\u{1F3FB}\u200D\u{1F9B0}", "Man: Light Skin Tone: Red Hair");
    const manMediumLightSkinToneRedHair = new Emoji("\u{1F468}\u{1F3FC}\u200D\u{1F9B0}", "Man: Medium-Light Skin Tone: Red Hair");
    const manMediumSkinToneRedHair = new Emoji("\u{1F468}\u{1F3FD}\u200D\u{1F9B0}", "Man: Medium Skin Tone: Red Hair");
    const manMediumDarkSkinToneRedHair = new Emoji("\u{1F468}\u{1F3FE}\u200D\u{1F9B0}", "Man: Medium-Dark Skin Tone: Red Hair");
    const manDarkSkinToneRedHair = new Emoji("\u{1F468}\u{1F3FF}\u200D\u{1F9B0}", "Man: Dark Skin Tone: Red Hair");
    const manCurlyHair = new Emoji("\u{1F468}\u200D\u{1F9B1}", "Man: Curly Hair");
    const manLightSkinToneCurlyHair = new Emoji("\u{1F468}\u{1F3FB}\u200D\u{1F9B1}", "Man: Light Skin Tone: Curly Hair");
    const manMediumLightSkinToneCurlyHair = new Emoji("\u{1F468}\u{1F3FC}\u200D\u{1F9B1}", "Man: Medium-Light Skin Tone: Curly Hair");
    const manMediumSkinToneCurlyHair = new Emoji("\u{1F468}\u{1F3FD}\u200D\u{1F9B1}", "Man: Medium Skin Tone: Curly Hair");
    const manMediumDarkSkinToneCurlyHair = new Emoji("\u{1F468}\u{1F3FE}\u200D\u{1F9B1}", "Man: Medium-Dark Skin Tone: Curly Hair");
    const manDarkSkinToneCurlyHair = new Emoji("\u{1F468}\u{1F3FF}\u200D\u{1F9B1}", "Man: Dark Skin Tone: Curly Hair");
    const manWhiteHair = new Emoji("\u{1F468}\u200D\u{1F9B3}", "Man: White Hair");
    const manLightSkinToneWhiteHair = new Emoji("\u{1F468}\u{1F3FB}\u200D\u{1F9B3}", "Man: Light Skin Tone: White Hair");
    const manMediumLightSkinToneWhiteHair = new Emoji("\u{1F468}\u{1F3FC}\u200D\u{1F9B3}", "Man: Medium-Light Skin Tone: White Hair");
    const manMediumSkinToneWhiteHair = new Emoji("\u{1F468}\u{1F3FD}\u200D\u{1F9B3}", "Man: Medium Skin Tone: White Hair");
    const manMediumDarkSkinToneWhiteHair = new Emoji("\u{1F468}\u{1F3FE}\u200D\u{1F9B3}", "Man: Medium-Dark Skin Tone: White Hair");
    const manDarkSkinToneWhiteHair = new Emoji("\u{1F468}\u{1F3FF}\u200D\u{1F9B3}", "Man: Dark Skin Tone: White Hair");
    const manBald = new Emoji("\u{1F468}\u200D\u{1F9B2}", "Man: Bald");
    const manLightSkinToneBald = new Emoji("\u{1F468}\u{1F3FB}\u200D\u{1F9B2}", "Man: Light Skin Tone: Bald");
    const manMediumLightSkinToneBald = new Emoji("\u{1F468}\u{1F3FC}\u200D\u{1F9B2}", "Man: Medium-Light Skin Tone: Bald");
    const manMediumSkinToneBald = new Emoji("\u{1F468}\u{1F3FD}\u200D\u{1F9B2}", "Man: Medium Skin Tone: Bald");
    const manMediumDarkSkinToneBald = new Emoji("\u{1F468}\u{1F3FE}\u200D\u{1F9B2}", "Man: Medium-Dark Skin Tone: Bald");
    const manDarkSkinToneBald = new Emoji("\u{1F468}\u{1F3FF}\u200D\u{1F9B2}", "Man: Dark Skin Tone: Bald");
    const pregnantWoman = new Emoji("\u{1F930}", "Pregnant Woman");
    const pregnantWomanLightSkinTone = new Emoji("\u{1F930}\u{1F3FB}", "Pregnant Woman: Light Skin Tone");
    const pregnantWomanMediumLightSkinTone = new Emoji("\u{1F930}\u{1F3FC}", "Pregnant Woman: Medium-Light Skin Tone");
    const pregnantWomanMediumSkinTone = new Emoji("\u{1F930}\u{1F3FD}", "Pregnant Woman: Medium Skin Tone");
    const pregnantWomanMediumDarkSkinTone = new Emoji("\u{1F930}\u{1F3FE}", "Pregnant Woman: Medium-Dark Skin Tone");
    const pregnantWomanDarkSkinTone = new Emoji("\u{1F930}\u{1F3FF}", "Pregnant Woman: Dark Skin Tone");
    const breastFeeding = new Emoji("\u{1F931}", "Breast-Feeding");
    const breastFeedingLightSkinTone = new Emoji("\u{1F931}\u{1F3FB}", "Breast-Feeding: Light Skin Tone");
    const breastFeedingMediumLightSkinTone = new Emoji("\u{1F931}\u{1F3FC}", "Breast-Feeding: Medium-Light Skin Tone");
    const breastFeedingMediumSkinTone = new Emoji("\u{1F931}\u{1F3FD}", "Breast-Feeding: Medium Skin Tone");
    const breastFeedingMediumDarkSkinTone = new Emoji("\u{1F931}\u{1F3FE}", "Breast-Feeding: Medium-Dark Skin Tone");
    const breastFeedingDarkSkinTone = new Emoji("\u{1F931}\u{1F3FF}", "Breast-Feeding: Dark Skin Tone");
    const womanWithHeadscarf = new Emoji("\u{1F9D5}", "Woman With Headscarf");
    const womanWithHeadscarfLightSkinTone = new Emoji("\u{1F9D5}\u{1F3FB}", "Woman With Headscarf: Light Skin Tone");
    const womanWithHeadscarfMediumLightSkinTone = new Emoji("\u{1F9D5}\u{1F3FC}", "Woman With Headscarf: Medium-Light Skin Tone");
    const womanWithHeadscarfMediumSkinTone = new Emoji("\u{1F9D5}\u{1F3FD}", "Woman With Headscarf: Medium Skin Tone");
    const womanWithHeadscarfMediumDarkSkinTone = new Emoji("\u{1F9D5}\u{1F3FE}", "Woman With Headscarf: Medium-Dark Skin Tone");
    const womanWithHeadscarfDarkSkinTone = new Emoji("\u{1F9D5}\u{1F3FF}", "Woman With Headscarf: Dark Skin Tone");
    const brideWithVeil = new Emoji("\u{1F470}", "Bride With Veil");
    const brideWithVeilLightSkinTone = new Emoji("\u{1F470}\u{1F3FB}", "Bride With Veil: Light Skin Tone");
    const brideWithVeilMediumLightSkinTone = new Emoji("\u{1F470}\u{1F3FC}", "Bride With Veil: Medium-Light Skin Tone");
    const brideWithVeilMediumSkinTone = new Emoji("\u{1F470}\u{1F3FD}", "Bride With Veil: Medium Skin Tone");
    const brideWithVeilMediumDarkSkinTone = new Emoji("\u{1F470}\u{1F3FE}", "Bride With Veil: Medium-Dark Skin Tone");
    const brideWithVeilDarkSkinTone = new Emoji("\u{1F470}\u{1F3FF}", "Bride With Veil: Dark Skin Tone");
    const woman = new Emoji("\u{1F469}", "Woman");
    const womanLightSkinTone = new Emoji("\u{1F469}\u{1F3FB}", "Woman: Light Skin Tone");
    const womanMediumLightSkinTone = new Emoji("\u{1F469}\u{1F3FC}", "Woman: Medium-Light Skin Tone");
    const womanMediumSkinTone = new Emoji("\u{1F469}\u{1F3FD}", "Woman: Medium Skin Tone");
    const womanMediumDarkSkinTone = new Emoji("\u{1F469}\u{1F3FE}", "Woman: Medium-Dark Skin Tone");
    const womanDarkSkinTone = new Emoji("\u{1F469}\u{1F3FF}", "Woman: Dark Skin Tone");
    const womanRedHair = new Emoji("\u{1F469}\u200D\u{1F9B0}", "Woman: Red Hair");
    const womanLightSkinToneRedHair = new Emoji("\u{1F469}\u{1F3FB}\u200D\u{1F9B0}", "Woman: Light Skin Tone: Red Hair");
    const womanMediumLightSkinToneRedHair = new Emoji("\u{1F469}\u{1F3FC}\u200D\u{1F9B0}", "Woman: Medium-Light Skin Tone: Red Hair");
    const womanMediumSkinToneRedHair = new Emoji("\u{1F469}\u{1F3FD}\u200D\u{1F9B0}", "Woman: Medium Skin Tone: Red Hair");
    const womanMediumDarkSkinToneRedHair = new Emoji("\u{1F469}\u{1F3FE}\u200D\u{1F9B0}", "Woman: Medium-Dark Skin Tone: Red Hair");
    const womanDarkSkinToneRedHair = new Emoji("\u{1F469}\u{1F3FF}\u200D\u{1F9B0}", "Woman: Dark Skin Tone: Red Hair");
    const womanCurlyHair = new Emoji("\u{1F469}\u200D\u{1F9B1}", "Woman: Curly Hair");
    const womanLightSkinToneCurlyHair = new Emoji("\u{1F469}\u{1F3FB}\u200D\u{1F9B1}", "Woman: Light Skin Tone: Curly Hair");
    const womanMediumLightSkinToneCurlyHair = new Emoji("\u{1F469}\u{1F3FC}\u200D\u{1F9B1}", "Woman: Medium-Light Skin Tone: Curly Hair");
    const womanMediumSkinToneCurlyHair = new Emoji("\u{1F469}\u{1F3FD}\u200D\u{1F9B1}", "Woman: Medium Skin Tone: Curly Hair");
    const womanMediumDarkSkinToneCurlyHair = new Emoji("\u{1F469}\u{1F3FE}\u200D\u{1F9B1}", "Woman: Medium-Dark Skin Tone: Curly Hair");
    const womanDarkSkinToneCurlyHair = new Emoji("\u{1F469}\u{1F3FF}\u200D\u{1F9B1}", "Woman: Dark Skin Tone: Curly Hair");
    const womanWhiteHair = new Emoji("\u{1F469}\u200D\u{1F9B3}", "Woman: White Hair");
    const womanLightSkinToneWhiteHair = new Emoji("\u{1F469}\u{1F3FB}\u200D\u{1F9B3}", "Woman: Light Skin Tone: White Hair");
    const womanMediumLightSkinToneWhiteHair = new Emoji("\u{1F469}\u{1F3FC}\u200D\u{1F9B3}", "Woman: Medium-Light Skin Tone: White Hair");
    const womanMediumSkinToneWhiteHair = new Emoji("\u{1F469}\u{1F3FD}\u200D\u{1F9B3}", "Woman: Medium Skin Tone: White Hair");
    const womanMediumDarkSkinToneWhiteHair = new Emoji("\u{1F469}\u{1F3FE}\u200D\u{1F9B3}", "Woman: Medium-Dark Skin Tone: White Hair");
    const womanDarkSkinToneWhiteHair = new Emoji("\u{1F469}\u{1F3FF}\u200D\u{1F9B3}", "Woman: Dark Skin Tone: White Hair");
    const womanBald = new Emoji("\u{1F469}\u200D\u{1F9B2}", "Woman: Bald");
    const womanLightSkinToneBald = new Emoji("\u{1F469}\u{1F3FB}\u200D\u{1F9B2}", "Woman: Light Skin Tone: Bald");
    const womanMediumLightSkinToneBald = new Emoji("\u{1F469}\u{1F3FC}\u200D\u{1F9B2}", "Woman: Medium-Light Skin Tone: Bald");
    const womanMediumSkinToneBald = new Emoji("\u{1F469}\u{1F3FD}\u200D\u{1F9B2}", "Woman: Medium Skin Tone: Bald");
    const womanMediumDarkSkinToneBald = new Emoji("\u{1F469}\u{1F3FE}\u200D\u{1F9B2}", "Woman: Medium-Dark Skin Tone: Bald");
    const womanDarkSkinToneBald = new Emoji("\u{1F469}\u{1F3FF}\u200D\u{1F9B2}", "Woman: Dark Skin Tone: Bald");
    const olderPerson = new Emoji("\u{1F9D3}", "Older Person");
    const olderPersonLightSkinTone = new Emoji("\u{1F9D3}\u{1F3FB}", "Older Person: Light Skin Tone");
    const olderPersonMediumLightSkinTone = new Emoji("\u{1F9D3}\u{1F3FC}", "Older Person: Medium-Light Skin Tone");
    const olderPersonMediumSkinTone = new Emoji("\u{1F9D3}\u{1F3FD}", "Older Person: Medium Skin Tone");
    const olderPersonMediumDarkSkinTone = new Emoji("\u{1F9D3}\u{1F3FE}", "Older Person: Medium-Dark Skin Tone");
    const olderPersonDarkSkinTone = new Emoji("\u{1F9D3}\u{1F3FF}", "Older Person: Dark Skin Tone");
    const oldMan = new Emoji("\u{1F474}", "Old Man");
    const oldManLightSkinTone = new Emoji("\u{1F474}\u{1F3FB}", "Old Man: Light Skin Tone");
    const oldManMediumLightSkinTone = new Emoji("\u{1F474}\u{1F3FC}", "Old Man: Medium-Light Skin Tone");
    const oldManMediumSkinTone = new Emoji("\u{1F474}\u{1F3FD}", "Old Man: Medium Skin Tone");
    const oldManMediumDarkSkinTone = new Emoji("\u{1F474}\u{1F3FE}", "Old Man: Medium-Dark Skin Tone");
    const oldManDarkSkinTone = new Emoji("\u{1F474}\u{1F3FF}", "Old Man: Dark Skin Tone");
    const oldWoman = new Emoji("\u{1F475}", "Old Woman");
    const oldWomanLightSkinTone = new Emoji("\u{1F475}\u{1F3FB}", "Old Woman: Light Skin Tone");
    const oldWomanMediumLightSkinTone = new Emoji("\u{1F475}\u{1F3FC}", "Old Woman: Medium-Light Skin Tone");
    const oldWomanMediumSkinTone = new Emoji("\u{1F475}\u{1F3FD}", "Old Woman: Medium Skin Tone");
    const oldWomanMediumDarkSkinTone = new Emoji("\u{1F475}\u{1F3FE}", "Old Woman: Medium-Dark Skin Tone");
    const oldWomanDarkSkinTone = new Emoji("\u{1F475}\u{1F3FF}", "Old Woman: Dark Skin Tone");
    const medical = new Emoji("\u2695\uFE0F", "Medical");
    const manHealthCare = new Emoji("\u{1F468}\u200D\u2695\uFE0F", "Man: Health Care");
    const manLightSkinToneHealthCare = new Emoji("\u{1F468}\u{1F3FB}\u200D\u2695\uFE0F", "Man: Light Skin Tone: Health Care");
    const manMediumLightSkinToneHealthCare = new Emoji("\u{1F468}\u{1F3FC}\u200D\u2695\uFE0F", "Man: Medium-Light Skin Tone: Health Care");
    const manMediumSkinToneHealthCare = new Emoji("\u{1F468}\u{1F3FD}\u200D\u2695\uFE0F", "Man: Medium Skin Tone: Health Care");
    const manMediumDarkSkinToneHealthCare = new Emoji("\u{1F468}\u{1F3FE}\u200D\u2695\uFE0F", "Man: Medium-Dark Skin Tone: Health Care");
    const manDarkSkinToneHealthCare = new Emoji("\u{1F468}\u{1F3FF}\u200D\u2695\uFE0F", "Man: Dark Skin Tone: Health Care");
    const womanHealthCare = new Emoji("\u{1F469}\u200D\u2695\uFE0F", "Woman: Health Care");
    const womanLightSkinToneHealthCare = new Emoji("\u{1F469}\u{1F3FB}\u200D\u2695\uFE0F", "Woman: Light Skin Tone: Health Care");
    const womanMediumLightSkinToneHealthCare = new Emoji("\u{1F469}\u{1F3FC}\u200D\u2695\uFE0F", "Woman: Medium-Light Skin Tone: Health Care");
    const womanMediumSkinToneHealthCare = new Emoji("\u{1F469}\u{1F3FD}\u200D\u2695\uFE0F", "Woman: Medium Skin Tone: Health Care");
    const womanMediumDarkSkinToneHealthCare = new Emoji("\u{1F469}\u{1F3FE}\u200D\u2695\uFE0F", "Woman: Medium-Dark Skin Tone: Health Care");
    const womanDarkSkinToneHealthCare = new Emoji("\u{1F469}\u{1F3FF}\u200D\u2695\uFE0F", "Woman: Dark Skin Tone: Health Care");
    const graduationCap = new Emoji("\u{1F393}", "Graduation Cap");
    const manStudent = new Emoji("\u{1F468}\u200D\u{1F393}", "Man: Student");
    const manLightSkinToneStudent = new Emoji("\u{1F468}\u{1F3FB}\u200D\u{1F393}", "Man: Light Skin Tone: Student");
    const manMediumLightSkinToneStudent = new Emoji("\u{1F468}\u{1F3FC}\u200D\u{1F393}", "Man: Medium-Light Skin Tone: Student");
    const manMediumSkinToneStudent = new Emoji("\u{1F468}\u{1F3FD}\u200D\u{1F393}", "Man: Medium Skin Tone: Student");
    const manMediumDarkSkinToneStudent = new Emoji("\u{1F468}\u{1F3FE}\u200D\u{1F393}", "Man: Medium-Dark Skin Tone: Student");
    const manDarkSkinToneStudent = new Emoji("\u{1F468}\u{1F3FF}\u200D\u{1F393}", "Man: Dark Skin Tone: Student");
    const womanStudent = new Emoji("\u{1F469}\u200D\u{1F393}", "Woman: Student");
    const womanLightSkinToneStudent = new Emoji("\u{1F469}\u{1F3FB}\u200D\u{1F393}", "Woman: Light Skin Tone: Student");
    const womanMediumLightSkinToneStudent = new Emoji("\u{1F469}\u{1F3FC}\u200D\u{1F393}", "Woman: Medium-Light Skin Tone: Student");
    const womanMediumSkinToneStudent = new Emoji("\u{1F469}\u{1F3FD}\u200D\u{1F393}", "Woman: Medium Skin Tone: Student");
    const womanMediumDarkSkinToneStudent = new Emoji("\u{1F469}\u{1F3FE}\u200D\u{1F393}", "Woman: Medium-Dark Skin Tone: Student");
    const womanDarkSkinToneStudent = new Emoji("\u{1F469}\u{1F3FF}\u200D\u{1F393}", "Woman: Dark Skin Tone: Student");
    const school = new Emoji("\u{1F3EB}", "School");
    const manTeacher = new Emoji("\u{1F468}\u200D\u{1F3EB}", "Man: Teacher");
    const manLightSkinToneTeacher = new Emoji("\u{1F468}\u{1F3FB}\u200D\u{1F3EB}", "Man: Light Skin Tone: Teacher");
    const manMediumLightSkinToneTeacher = new Emoji("\u{1F468}\u{1F3FC}\u200D\u{1F3EB}", "Man: Medium-Light Skin Tone: Teacher");
    const manMediumSkinToneTeacher = new Emoji("\u{1F468}\u{1F3FD}\u200D\u{1F3EB}", "Man: Medium Skin Tone: Teacher");
    const manMediumDarkSkinToneTeacher = new Emoji("\u{1F468}\u{1F3FE}\u200D\u{1F3EB}", "Man: Medium-Dark Skin Tone: Teacher");
    const manDarkSkinToneTeacher = new Emoji("\u{1F468}\u{1F3FF}\u200D\u{1F3EB}", "Man: Dark Skin Tone: Teacher");
    const womanTeacher = new Emoji("\u{1F469}\u200D\u{1F3EB}", "Woman: Teacher");
    const womanLightSkinToneTeacher = new Emoji("\u{1F469}\u{1F3FB}\u200D\u{1F3EB}", "Woman: Light Skin Tone: Teacher");
    const womanMediumLightSkinToneTeacher = new Emoji("\u{1F469}\u{1F3FC}\u200D\u{1F3EB}", "Woman: Medium-Light Skin Tone: Teacher");
    const womanMediumSkinToneTeacher = new Emoji("\u{1F469}\u{1F3FD}\u200D\u{1F3EB}", "Woman: Medium Skin Tone: Teacher");
    const womanMediumDarkSkinToneTeacher = new Emoji("\u{1F469}\u{1F3FE}\u200D\u{1F3EB}", "Woman: Medium-Dark Skin Tone: Teacher");
    const womanDarkSkinToneTeacher = new Emoji("\u{1F469}\u{1F3FF}\u200D\u{1F3EB}", "Woman: Dark Skin Tone: Teacher");
    const balanceScale = new Emoji("\u2696\uFE0F", "Balance Scale");
    const manJudge = new Emoji("\u{1F468}\u200D\u2696\uFE0F", "Man: Judge");
    const manLightSkinToneJudge = new Emoji("\u{1F468}\u{1F3FB}\u200D\u2696\uFE0F", "Man: Light Skin Tone: Judge");
    const manMediumLightSkinToneJudge = new Emoji("\u{1F468}\u{1F3FC}\u200D\u2696\uFE0F", "Man: Medium-Light Skin Tone: Judge");
    const manMediumSkinToneJudge = new Emoji("\u{1F468}\u{1F3FD}\u200D\u2696\uFE0F", "Man: Medium Skin Tone: Judge");
    const manMediumDarkSkinToneJudge = new Emoji("\u{1F468}\u{1F3FE}\u200D\u2696\uFE0F", "Man: Medium-Dark Skin Tone: Judge");
    const manDarkSkinToneJudge = new Emoji("\u{1F468}\u{1F3FF}\u200D\u2696\uFE0F", "Man: Dark Skin Tone: Judge");
    const womanJudge = new Emoji("\u{1F469}\u200D\u2696\uFE0F", "Woman: Judge");
    const womanLightSkinToneJudge = new Emoji("\u{1F469}\u{1F3FB}\u200D\u2696\uFE0F", "Woman: Light Skin Tone: Judge");
    const womanMediumLightSkinToneJudge = new Emoji("\u{1F469}\u{1F3FC}\u200D\u2696\uFE0F", "Woman: Medium-Light Skin Tone: Judge");
    const womanMediumSkinToneJudge = new Emoji("\u{1F469}\u{1F3FD}\u200D\u2696\uFE0F", "Woman: Medium Skin Tone: Judge");
    const womanMediumDarkSkinToneJudge = new Emoji("\u{1F469}\u{1F3FE}\u200D\u2696\uFE0F", "Woman: Medium-Dark Skin Tone: Judge");
    const womanDarkSkinToneJudge = new Emoji("\u{1F469}\u{1F3FF}\u200D\u2696\uFE0F", "Woman: Dark Skin Tone: Judge");
    const sheafOfRice = new Emoji("\u{1F33E}", "Sheaf of Rice");
    const manFarmer = new Emoji("\u{1F468}\u200D\u{1F33E}", "Man: Farmer");
    const manLightSkinToneFarmer = new Emoji("\u{1F468}\u{1F3FB}\u200D\u{1F33E}", "Man: Light Skin Tone: Farmer");
    const manMediumLightSkinToneFarmer = new Emoji("\u{1F468}\u{1F3FC}\u200D\u{1F33E}", "Man: Medium-Light Skin Tone: Farmer");
    const manMediumSkinToneFarmer = new Emoji("\u{1F468}\u{1F3FD}\u200D\u{1F33E}", "Man: Medium Skin Tone: Farmer");
    const manMediumDarkSkinToneFarmer = new Emoji("\u{1F468}\u{1F3FE}\u200D\u{1F33E}", "Man: Medium-Dark Skin Tone: Farmer");
    const manDarkSkinToneFarmer = new Emoji("\u{1F468}\u{1F3FF}\u200D\u{1F33E}", "Man: Dark Skin Tone: Farmer");
    const womanFarmer = new Emoji("\u{1F469}\u200D\u{1F33E}", "Woman: Farmer");
    const womanLightSkinToneFarmer = new Emoji("\u{1F469}\u{1F3FB}\u200D\u{1F33E}", "Woman: Light Skin Tone: Farmer");
    const womanMediumLightSkinToneFarmer = new Emoji("\u{1F469}\u{1F3FC}\u200D\u{1F33E}", "Woman: Medium-Light Skin Tone: Farmer");
    const womanMediumSkinToneFarmer = new Emoji("\u{1F469}\u{1F3FD}\u200D\u{1F33E}", "Woman: Medium Skin Tone: Farmer");
    const womanMediumDarkSkinToneFarmer = new Emoji("\u{1F469}\u{1F3FE}\u200D\u{1F33E}", "Woman: Medium-Dark Skin Tone: Farmer");
    const womanDarkSkinToneFarmer = new Emoji("\u{1F469}\u{1F3FF}\u200D\u{1F33E}", "Woman: Dark Skin Tone: Farmer");
    const cooking = new Emoji("\u{1F373}", "Cooking");
    const manCook = new Emoji("\u{1F468}\u200D\u{1F373}", "Man: Cook");
    const manLightSkinToneCook = new Emoji("\u{1F468}\u{1F3FB}\u200D\u{1F373}", "Man: Light Skin Tone: Cook");
    const manMediumLightSkinToneCook = new Emoji("\u{1F468}\u{1F3FC}\u200D\u{1F373}", "Man: Medium-Light Skin Tone: Cook");
    const manMediumSkinToneCook = new Emoji("\u{1F468}\u{1F3FD}\u200D\u{1F373}", "Man: Medium Skin Tone: Cook");
    const manMediumDarkSkinToneCook = new Emoji("\u{1F468}\u{1F3FE}\u200D\u{1F373}", "Man: Medium-Dark Skin Tone: Cook");
    const manDarkSkinToneCook = new Emoji("\u{1F468}\u{1F3FF}\u200D\u{1F373}", "Man: Dark Skin Tone: Cook");
    const womanCook = new Emoji("\u{1F469}\u200D\u{1F373}", "Woman: Cook");
    const womanLightSkinToneCook = new Emoji("\u{1F469}\u{1F3FB}\u200D\u{1F373}", "Woman: Light Skin Tone: Cook");
    const womanMediumLightSkinToneCook = new Emoji("\u{1F469}\u{1F3FC}\u200D\u{1F373}", "Woman: Medium-Light Skin Tone: Cook");
    const womanMediumSkinToneCook = new Emoji("\u{1F469}\u{1F3FD}\u200D\u{1F373}", "Woman: Medium Skin Tone: Cook");
    const womanMediumDarkSkinToneCook = new Emoji("\u{1F469}\u{1F3FE}\u200D\u{1F373}", "Woman: Medium-Dark Skin Tone: Cook");
    const womanDarkSkinToneCook = new Emoji("\u{1F469}\u{1F3FF}\u200D\u{1F373}", "Woman: Dark Skin Tone: Cook");
    const wrench = new Emoji("\u{1F527}", "Wrench");
    const manMechanic = new Emoji("\u{1F468}\u200D\u{1F527}", "Man: Mechanic");
    const manLightSkinToneMechanic = new Emoji("\u{1F468}\u{1F3FB}\u200D\u{1F527}", "Man: Light Skin Tone: Mechanic");
    const manMediumLightSkinToneMechanic = new Emoji("\u{1F468}\u{1F3FC}\u200D\u{1F527}", "Man: Medium-Light Skin Tone: Mechanic");
    const manMediumSkinToneMechanic = new Emoji("\u{1F468}\u{1F3FD}\u200D\u{1F527}", "Man: Medium Skin Tone: Mechanic");
    const manMediumDarkSkinToneMechanic = new Emoji("\u{1F468}\u{1F3FE}\u200D\u{1F527}", "Man: Medium-Dark Skin Tone: Mechanic");
    const manDarkSkinToneMechanic = new Emoji("\u{1F468}\u{1F3FF}\u200D\u{1F527}", "Man: Dark Skin Tone: Mechanic");
    const womanMechanic = new Emoji("\u{1F469}\u200D\u{1F527}", "Woman: Mechanic");
    const womanLightSkinToneMechanic = new Emoji("\u{1F469}\u{1F3FB}\u200D\u{1F527}", "Woman: Light Skin Tone: Mechanic");
    const womanMediumLightSkinToneMechanic = new Emoji("\u{1F469}\u{1F3FC}\u200D\u{1F527}", "Woman: Medium-Light Skin Tone: Mechanic");
    const womanMediumSkinToneMechanic = new Emoji("\u{1F469}\u{1F3FD}\u200D\u{1F527}", "Woman: Medium Skin Tone: Mechanic");
    const womanMediumDarkSkinToneMechanic = new Emoji("\u{1F469}\u{1F3FE}\u200D\u{1F527}", "Woman: Medium-Dark Skin Tone: Mechanic");
    const womanDarkSkinToneMechanic = new Emoji("\u{1F469}\u{1F3FF}\u200D\u{1F527}", "Woman: Dark Skin Tone: Mechanic");
    const factory = new Emoji("\u{1F3ED}", "Factory");
    const manFactoryWorker = new Emoji("\u{1F468}\u200D\u{1F3ED}", "Man: Factory Worker");
    const manLightSkinToneFactoryWorker = new Emoji("\u{1F468}\u{1F3FB}\u200D\u{1F3ED}", "Man: Light Skin Tone: Factory Worker");
    const manMediumLightSkinToneFactoryWorker = new Emoji("\u{1F468}\u{1F3FC}\u200D\u{1F3ED}", "Man: Medium-Light Skin Tone: Factory Worker");
    const manMediumSkinToneFactoryWorker = new Emoji("\u{1F468}\u{1F3FD}\u200D\u{1F3ED}", "Man: Medium Skin Tone: Factory Worker");
    const manMediumDarkSkinToneFactoryWorker = new Emoji("\u{1F468}\u{1F3FE}\u200D\u{1F3ED}", "Man: Medium-Dark Skin Tone: Factory Worker");
    const manDarkSkinToneFactoryWorker = new Emoji("\u{1F468}\u{1F3FF}\u200D\u{1F3ED}", "Man: Dark Skin Tone: Factory Worker");
    const womanFactoryWorker = new Emoji("\u{1F469}\u200D\u{1F3ED}", "Woman: Factory Worker");
    const womanLightSkinToneFactoryWorker = new Emoji("\u{1F469}\u{1F3FB}\u200D\u{1F3ED}", "Woman: Light Skin Tone: Factory Worker");
    const womanMediumLightSkinToneFactoryWorker = new Emoji("\u{1F469}\u{1F3FC}\u200D\u{1F3ED}", "Woman: Medium-Light Skin Tone: Factory Worker");
    const womanMediumSkinToneFactoryWorker = new Emoji("\u{1F469}\u{1F3FD}\u200D\u{1F3ED}", "Woman: Medium Skin Tone: Factory Worker");
    const womanMediumDarkSkinToneFactoryWorker = new Emoji("\u{1F469}\u{1F3FE}\u200D\u{1F3ED}", "Woman: Medium-Dark Skin Tone: Factory Worker");
    const womanDarkSkinToneFactoryWorker = new Emoji("\u{1F469}\u{1F3FF}\u200D\u{1F3ED}", "Woman: Dark Skin Tone: Factory Worker");
    const briefcase = new Emoji("\u{1F4BC}", "Briefcase");
    const manOfficeWorker = new Emoji("\u{1F468}\u200D\u{1F4BC}", "Man: Office Worker");
    const manLightSkinToneOfficeWorker = new Emoji("\u{1F468}\u{1F3FB}\u200D\u{1F4BC}", "Man: Light Skin Tone: Office Worker");
    const manMediumLightSkinToneOfficeWorker = new Emoji("\u{1F468}\u{1F3FC}\u200D\u{1F4BC}", "Man: Medium-Light Skin Tone: Office Worker");
    const manMediumSkinToneOfficeWorker = new Emoji("\u{1F468}\u{1F3FD}\u200D\u{1F4BC}", "Man: Medium Skin Tone: Office Worker");
    const manMediumDarkSkinToneOfficeWorker = new Emoji("\u{1F468}\u{1F3FE}\u200D\u{1F4BC}", "Man: Medium-Dark Skin Tone: Office Worker");
    const manDarkSkinToneOfficeWorker = new Emoji("\u{1F468}\u{1F3FF}\u200D\u{1F4BC}", "Man: Dark Skin Tone: Office Worker");
    const womanOfficeWorker = new Emoji("\u{1F469}\u200D\u{1F4BC}", "Woman: Office Worker");
    const womanLightSkinToneOfficeWorker = new Emoji("\u{1F469}\u{1F3FB}\u200D\u{1F4BC}", "Woman: Light Skin Tone: Office Worker");
    const womanMediumLightSkinToneOfficeWorker = new Emoji("\u{1F469}\u{1F3FC}\u200D\u{1F4BC}", "Woman: Medium-Light Skin Tone: Office Worker");
    const womanMediumSkinToneOfficeWorker = new Emoji("\u{1F469}\u{1F3FD}\u200D\u{1F4BC}", "Woman: Medium Skin Tone: Office Worker");
    const womanMediumDarkSkinToneOfficeWorker = new Emoji("\u{1F469}\u{1F3FE}\u200D\u{1F4BC}", "Woman: Medium-Dark Skin Tone: Office Worker");
    const womanDarkSkinToneOfficeWorker = new Emoji("\u{1F469}\u{1F3FF}\u200D\u{1F4BC}", "Woman: Dark Skin Tone: Office Worker");
    const fireEngine = new Emoji("\u{1F692}", "Fire Engine");
    const manFireFighter = new Emoji("\u{1F468}\u200D\u{1F692}", "Man: Fire Fighter");
    const manLightSkinToneFireFighter = new Emoji("\u{1F468}\u{1F3FB}\u200D\u{1F692}", "Man: Light Skin Tone: Fire Fighter");
    const manMediumLightSkinToneFireFighter = new Emoji("\u{1F468}\u{1F3FC}\u200D\u{1F692}", "Man: Medium-Light Skin Tone: Fire Fighter");
    const manMediumSkinToneFireFighter = new Emoji("\u{1F468}\u{1F3FD}\u200D\u{1F692}", "Man: Medium Skin Tone: Fire Fighter");
    const manMediumDarkSkinToneFireFighter = new Emoji("\u{1F468}\u{1F3FE}\u200D\u{1F692}", "Man: Medium-Dark Skin Tone: Fire Fighter");
    const manDarkSkinToneFireFighter = new Emoji("\u{1F468}\u{1F3FF}\u200D\u{1F692}", "Man: Dark Skin Tone: Fire Fighter");
    const womanFireFighter = new Emoji("\u{1F469}\u200D\u{1F692}", "Woman: Fire Fighter");
    const womanLightSkinToneFireFighter = new Emoji("\u{1F469}\u{1F3FB}\u200D\u{1F692}", "Woman: Light Skin Tone: Fire Fighter");
    const womanMediumLightSkinToneFireFighter = new Emoji("\u{1F469}\u{1F3FC}\u200D\u{1F692}", "Woman: Medium-Light Skin Tone: Fire Fighter");
    const womanMediumSkinToneFireFighter = new Emoji("\u{1F469}\u{1F3FD}\u200D\u{1F692}", "Woman: Medium Skin Tone: Fire Fighter");
    const womanMediumDarkSkinToneFireFighter = new Emoji("\u{1F469}\u{1F3FE}\u200D\u{1F692}", "Woman: Medium-Dark Skin Tone: Fire Fighter");
    const womanDarkSkinToneFireFighter = new Emoji("\u{1F469}\u{1F3FF}\u200D\u{1F692}", "Woman: Dark Skin Tone: Fire Fighter");
    const rocket = new Emoji("\u{1F680}", "Rocket");
    const manAstronaut = new Emoji("\u{1F468}\u200D\u{1F680}", "Man: Astronaut");
    const manLightSkinToneAstronaut = new Emoji("\u{1F468}\u{1F3FB}\u200D\u{1F680}", "Man: Light Skin Tone: Astronaut");
    const manMediumLightSkinToneAstronaut = new Emoji("\u{1F468}\u{1F3FC}\u200D\u{1F680}", "Man: Medium-Light Skin Tone: Astronaut");
    const manMediumSkinToneAstronaut = new Emoji("\u{1F468}\u{1F3FD}\u200D\u{1F680}", "Man: Medium Skin Tone: Astronaut");
    const manMediumDarkSkinToneAstronaut = new Emoji("\u{1F468}\u{1F3FE}\u200D\u{1F680}", "Man: Medium-Dark Skin Tone: Astronaut");
    const manDarkSkinToneAstronaut = new Emoji("\u{1F468}\u{1F3FF}\u200D\u{1F680}", "Man: Dark Skin Tone: Astronaut");
    const womanAstronaut = new Emoji("\u{1F469}\u200D\u{1F680}", "Woman: Astronaut");
    const womanLightSkinToneAstronaut = new Emoji("\u{1F469}\u{1F3FB}\u200D\u{1F680}", "Woman: Light Skin Tone: Astronaut");
    const womanMediumLightSkinToneAstronaut = new Emoji("\u{1F469}\u{1F3FC}\u200D\u{1F680}", "Woman: Medium-Light Skin Tone: Astronaut");
    const womanMediumSkinToneAstronaut = new Emoji("\u{1F469}\u{1F3FD}\u200D\u{1F680}", "Woman: Medium Skin Tone: Astronaut");
    const womanMediumDarkSkinToneAstronaut = new Emoji("\u{1F469}\u{1F3FE}\u200D\u{1F680}", "Woman: Medium-Dark Skin Tone: Astronaut");
    const womanDarkSkinToneAstronaut = new Emoji("\u{1F469}\u{1F3FF}\u200D\u{1F680}", "Woman: Dark Skin Tone: Astronaut");
    const airplane = new Emoji("\u2708\uFE0F", "Airplane");
    const manPilot = new Emoji("\u{1F468}\u200D\u2708\uFE0F", "Man: Pilot");
    const manLightSkinTonePilot = new Emoji("\u{1F468}\u{1F3FB}\u200D\u2708\uFE0F", "Man: Light Skin Tone: Pilot");
    const manMediumLightSkinTonePilot = new Emoji("\u{1F468}\u{1F3FC}\u200D\u2708\uFE0F", "Man: Medium-Light Skin Tone: Pilot");
    const manMediumSkinTonePilot = new Emoji("\u{1F468}\u{1F3FD}\u200D\u2708\uFE0F", "Man: Medium Skin Tone: Pilot");
    const manMediumDarkSkinTonePilot = new Emoji("\u{1F468}\u{1F3FE}\u200D\u2708\uFE0F", "Man: Medium-Dark Skin Tone: Pilot");
    const manDarkSkinTonePilot = new Emoji("\u{1F468}\u{1F3FF}\u200D\u2708\uFE0F", "Man: Dark Skin Tone: Pilot");
    const womanPilot = new Emoji("\u{1F469}\u200D\u2708\uFE0F", "Woman: Pilot");
    const womanLightSkinTonePilot = new Emoji("\u{1F469}\u{1F3FB}\u200D\u2708\uFE0F", "Woman: Light Skin Tone: Pilot");
    const womanMediumLightSkinTonePilot = new Emoji("\u{1F469}\u{1F3FC}\u200D\u2708\uFE0F", "Woman: Medium-Light Skin Tone: Pilot");
    const womanMediumSkinTonePilot = new Emoji("\u{1F469}\u{1F3FD}\u200D\u2708\uFE0F", "Woman: Medium Skin Tone: Pilot");
    const womanMediumDarkSkinTonePilot = new Emoji("\u{1F469}\u{1F3FE}\u200D\u2708\uFE0F", "Woman: Medium-Dark Skin Tone: Pilot");
    const womanDarkSkinTonePilot = new Emoji("\u{1F469}\u{1F3FF}\u200D\u2708\uFE0F", "Woman: Dark Skin Tone: Pilot");
    const artistPalette = new Emoji("\u{1F3A8}", "Artist Palette");
    const manArtist = new Emoji("\u{1F468}\u200D\u{1F3A8}", "Man: Artist");
    const manLightSkinToneArtist = new Emoji("\u{1F468}\u{1F3FB}\u200D\u{1F3A8}", "Man: Light Skin Tone: Artist");
    const manMediumLightSkinToneArtist = new Emoji("\u{1F468}\u{1F3FC}\u200D\u{1F3A8}", "Man: Medium-Light Skin Tone: Artist");
    const manMediumSkinToneArtist = new Emoji("\u{1F468}\u{1F3FD}\u200D\u{1F3A8}", "Man: Medium Skin Tone: Artist");
    const manMediumDarkSkinToneArtist = new Emoji("\u{1F468}\u{1F3FE}\u200D\u{1F3A8}", "Man: Medium-Dark Skin Tone: Artist");
    const manDarkSkinToneArtist = new Emoji("\u{1F468}\u{1F3FF}\u200D\u{1F3A8}", "Man: Dark Skin Tone: Artist");
    const womanArtist = new Emoji("\u{1F469}\u200D\u{1F3A8}", "Woman: Artist");
    const womanLightSkinToneArtist = new Emoji("\u{1F469}\u{1F3FB}\u200D\u{1F3A8}", "Woman: Light Skin Tone: Artist");
    const womanMediumLightSkinToneArtist = new Emoji("\u{1F469}\u{1F3FC}\u200D\u{1F3A8}", "Woman: Medium-Light Skin Tone: Artist");
    const womanMediumSkinToneArtist = new Emoji("\u{1F469}\u{1F3FD}\u200D\u{1F3A8}", "Woman: Medium Skin Tone: Artist");
    const womanMediumDarkSkinToneArtist = new Emoji("\u{1F469}\u{1F3FE}\u200D\u{1F3A8}", "Woman: Medium-Dark Skin Tone: Artist");
    const womanDarkSkinToneArtist = new Emoji("\u{1F469}\u{1F3FF}\u200D\u{1F3A8}", "Woman: Dark Skin Tone: Artist");
    const microphone = new Emoji("\u{1F3A4}", "Microphone");
    const manSinger = new Emoji("\u{1F468}\u200D\u{1F3A4}", "Man: Singer");
    const manLightSkinToneSinger = new Emoji("\u{1F468}\u{1F3FB}\u200D\u{1F3A4}", "Man: Light Skin Tone: Singer");
    const manMediumLightSkinToneSinger = new Emoji("\u{1F468}\u{1F3FC}\u200D\u{1F3A4}", "Man: Medium-Light Skin Tone: Singer");
    const manMediumSkinToneSinger = new Emoji("\u{1F468}\u{1F3FD}\u200D\u{1F3A4}", "Man: Medium Skin Tone: Singer");
    const manMediumDarkSkinToneSinger = new Emoji("\u{1F468}\u{1F3FE}\u200D\u{1F3A4}", "Man: Medium-Dark Skin Tone: Singer");
    const manDarkSkinToneSinger = new Emoji("\u{1F468}\u{1F3FF}\u200D\u{1F3A4}", "Man: Dark Skin Tone: Singer");
    const womanSinger = new Emoji("\u{1F469}\u200D\u{1F3A4}", "Woman: Singer");
    const womanLightSkinToneSinger = new Emoji("\u{1F469}\u{1F3FB}\u200D\u{1F3A4}", "Woman: Light Skin Tone: Singer");
    const womanMediumLightSkinToneSinger = new Emoji("\u{1F469}\u{1F3FC}\u200D\u{1F3A4}", "Woman: Medium-Light Skin Tone: Singer");
    const womanMediumSkinToneSinger = new Emoji("\u{1F469}\u{1F3FD}\u200D\u{1F3A4}", "Woman: Medium Skin Tone: Singer");
    const womanMediumDarkSkinToneSinger = new Emoji("\u{1F469}\u{1F3FE}\u200D\u{1F3A4}", "Woman: Medium-Dark Skin Tone: Singer");
    const womanDarkSkinToneSinger = new Emoji("\u{1F469}\u{1F3FF}\u200D\u{1F3A4}", "Woman: Dark Skin Tone: Singer");
    const laptop = new Emoji("\u{1F4BB}", "Laptop");
    const manTechnologist = new Emoji("\u{1F468}\u200D\u{1F4BB}", "Man: Technologist");
    const manLightSkinToneTechnologist = new Emoji("\u{1F468}\u{1F3FB}\u200D\u{1F4BB}", "Man: Light Skin Tone: Technologist");
    const manMediumLightSkinToneTechnologist = new Emoji("\u{1F468}\u{1F3FC}\u200D\u{1F4BB}", "Man: Medium-Light Skin Tone: Technologist");
    const manMediumSkinToneTechnologist = new Emoji("\u{1F468}\u{1F3FD}\u200D\u{1F4BB}", "Man: Medium Skin Tone: Technologist");
    const manMediumDarkSkinToneTechnologist = new Emoji("\u{1F468}\u{1F3FE}\u200D\u{1F4BB}", "Man: Medium-Dark Skin Tone: Technologist");
    const manDarkSkinToneTechnologist = new Emoji("\u{1F468}\u{1F3FF}\u200D\u{1F4BB}", "Man: Dark Skin Tone: Technologist");
    const womanTechnologist = new Emoji("\u{1F469}\u200D\u{1F4BB}", "Woman: Technologist");
    const womanLightSkinToneTechnologist = new Emoji("\u{1F469}\u{1F3FB}\u200D\u{1F4BB}", "Woman: Light Skin Tone: Technologist");
    const womanMediumLightSkinToneTechnologist = new Emoji("\u{1F469}\u{1F3FC}\u200D\u{1F4BB}", "Woman: Medium-Light Skin Tone: Technologist");
    const womanMediumSkinToneTechnologist = new Emoji("\u{1F469}\u{1F3FD}\u200D\u{1F4BB}", "Woman: Medium Skin Tone: Technologist");
    const womanMediumDarkSkinToneTechnologist = new Emoji("\u{1F469}\u{1F3FE}\u200D\u{1F4BB}", "Woman: Medium-Dark Skin Tone: Technologist");
    const womanDarkSkinToneTechnologist = new Emoji("\u{1F469}\u{1F3FF}\u200D\u{1F4BB}", "Woman: Dark Skin Tone: Technologist");
    const microscope = new Emoji("\u{1F52C}", "Microscope");
    const manScientist = new Emoji("\u{1F468}\u200D\u{1F52C}", "Man: Scientist");
    const manLightSkinToneScientist = new Emoji("\u{1F468}\u{1F3FB}\u200D\u{1F52C}", "Man: Light Skin Tone: Scientist");
    const manMediumLightSkinToneScientist = new Emoji("\u{1F468}\u{1F3FC}\u200D\u{1F52C}", "Man: Medium-Light Skin Tone: Scientist");
    const manMediumSkinToneScientist = new Emoji("\u{1F468}\u{1F3FD}\u200D\u{1F52C}", "Man: Medium Skin Tone: Scientist");
    const manMediumDarkSkinToneScientist = new Emoji("\u{1F468}\u{1F3FE}\u200D\u{1F52C}", "Man: Medium-Dark Skin Tone: Scientist");
    const manDarkSkinToneScientist = new Emoji("\u{1F468}\u{1F3FF}\u200D\u{1F52C}", "Man: Dark Skin Tone: Scientist");
    const womanScientist = new Emoji("\u{1F469}\u200D\u{1F52C}", "Woman: Scientist");
    const womanLightSkinToneScientist = new Emoji("\u{1F469}\u{1F3FB}\u200D\u{1F52C}", "Woman: Light Skin Tone: Scientist");
    const womanMediumLightSkinToneScientist = new Emoji("\u{1F469}\u{1F3FC}\u200D\u{1F52C}", "Woman: Medium-Light Skin Tone: Scientist");
    const womanMediumSkinToneScientist = new Emoji("\u{1F469}\u{1F3FD}\u200D\u{1F52C}", "Woman: Medium Skin Tone: Scientist");
    const womanMediumDarkSkinToneScientist = new Emoji("\u{1F469}\u{1F3FE}\u200D\u{1F52C}", "Woman: Medium-Dark Skin Tone: Scientist");
    const womanDarkSkinToneScientist = new Emoji("\u{1F469}\u{1F3FF}\u200D\u{1F52C}", "Woman: Dark Skin Tone: Scientist");
    const crown = new Emoji("\u{1F451}", "Crown");
    const genie = new Emoji("\u{1F9DE}", "Genie");
    const zombie = new Emoji("\u{1F9DF}", "Zombie");
    const safetyVest = new Emoji("\u{1F9BA}", "Safety Vest");
    const probingCane = new Emoji("\u{1F9AF}", "Probing Cane");
    const motorizedWheelchair = new Emoji("\u{1F9BC}", "Motorized Wheelchair");
    const manualWheelchair = new Emoji("\u{1F9BD}", "Manual Wheelchair");
    const fencer = new Emoji("\u{1F93A}", "Fencer");
    const skier = new Emoji("\u26F7\uFE0F", "Skier");
    const prince = new Emoji("\u{1F934}", "Prince");
    const princeLightSkinTone = new Emoji("\u{1F934}\u{1F3FB}", "Prince: Light Skin Tone");
    const princeMediumLightSkinTone = new Emoji("\u{1F934}\u{1F3FC}", "Prince: Medium-Light Skin Tone");
    const princeMediumSkinTone = new Emoji("\u{1F934}\u{1F3FD}", "Prince: Medium Skin Tone");
    const princeMediumDarkSkinTone = new Emoji("\u{1F934}\u{1F3FE}", "Prince: Medium-Dark Skin Tone");
    const princeDarkSkinTone = new Emoji("\u{1F934}\u{1F3FF}", "Prince: Dark Skin Tone");
    const princess = new Emoji("\u{1F478}", "Princess");
    const princessLightSkinTone = new Emoji("\u{1F478}\u{1F3FB}", "Princess: Light Skin Tone");
    const princessMediumLightSkinTone = new Emoji("\u{1F478}\u{1F3FC}", "Princess: Medium-Light Skin Tone");
    const princessMediumSkinTone = new Emoji("\u{1F478}\u{1F3FD}", "Princess: Medium Skin Tone");
    const princessMediumDarkSkinTone = new Emoji("\u{1F478}\u{1F3FE}", "Princess: Medium-Dark Skin Tone");
    const princessDarkSkinTone = new Emoji("\u{1F478}\u{1F3FF}", "Princess: Dark Skin Tone");
    const cherub = new Emoji("\u{1F47C}", "Cherub");
    const cherubLightSkinTone = new Emoji("\u{1F47C}\u{1F3FB}", "Cherub: Light Skin Tone");
    const cherubMediumLightSkinTone = new Emoji("\u{1F47C}\u{1F3FC}", "Cherub: Medium-Light Skin Tone");
    const cherubMediumSkinTone = new Emoji("\u{1F47C}\u{1F3FD}", "Cherub: Medium Skin Tone");
    const cherubMediumDarkSkinTone = new Emoji("\u{1F47C}\u{1F3FE}", "Cherub: Medium-Dark Skin Tone");
    const cherubDarkSkinTone = new Emoji("\u{1F47C}\u{1F3FF}", "Cherub: Dark Skin Tone");
    const santaClaus = new Emoji("\u{1F385}", "Santa Claus");
    const santaClausLightSkinTone = new Emoji("\u{1F385}\u{1F3FB}", "Santa Claus: Light Skin Tone");
    const santaClausMediumLightSkinTone = new Emoji("\u{1F385}\u{1F3FC}", "Santa Claus: Medium-Light Skin Tone");
    const santaClausMediumSkinTone = new Emoji("\u{1F385}\u{1F3FD}", "Santa Claus: Medium Skin Tone");
    const santaClausMediumDarkSkinTone = new Emoji("\u{1F385}\u{1F3FE}", "Santa Claus: Medium-Dark Skin Tone");
    const santaClausDarkSkinTone = new Emoji("\u{1F385}\u{1F3FF}", "Santa Claus: Dark Skin Tone");
    const mrsClaus = new Emoji("\u{1F936}", "Mrs. Claus");
    const mrsClausLightSkinTone = new Emoji("\u{1F936}\u{1F3FB}", "Mrs. Claus: Light Skin Tone");
    const mrsClausMediumLightSkinTone = new Emoji("\u{1F936}\u{1F3FC}", "Mrs. Claus: Medium-Light Skin Tone");
    const mrsClausMediumSkinTone = new Emoji("\u{1F936}\u{1F3FD}", "Mrs. Claus: Medium Skin Tone");
    const mrsClausMediumDarkSkinTone = new Emoji("\u{1F936}\u{1F3FE}", "Mrs. Claus: Medium-Dark Skin Tone");
    const mrsClausDarkSkinTone = new Emoji("\u{1F936}\u{1F3FF}", "Mrs. Claus: Dark Skin Tone");
    const genieMale = new Emoji("\u{1F9DE}\u200D\u2642\uFE0F", "Genie: Male");
    const genieFemale = new Emoji("\u{1F9DE}\u200D\u2640\uFE0F", "Genie: Female");
    const zombieMale = new Emoji("\u{1F9DF}\u200D\u2642\uFE0F", "Zombie: Male");
    const zombieFemale = new Emoji("\u{1F9DF}\u200D\u2640\uFE0F", "Zombie: Female");
    const manProbing = new Emoji("\u{1F468}\u200D\u{1F9AF}", "Man: Probing");
    const manLightSkinToneProbing = new Emoji("\u{1F468}\u{1F3FB}\u200D\u{1F9AF}", "Man: Light Skin Tone: Probing");
    const manMediumLightSkinToneProbing = new Emoji("\u{1F468}\u{1F3FC}\u200D\u{1F9AF}", "Man: Medium-Light Skin Tone: Probing");
    const manMediumSkinToneProbing = new Emoji("\u{1F468}\u{1F3FD}\u200D\u{1F9AF}", "Man: Medium Skin Tone: Probing");
    const manMediumDarkSkinToneProbing = new Emoji("\u{1F468}\u{1F3FE}\u200D\u{1F9AF}", "Man: Medium-Dark Skin Tone: Probing");
    const manDarkSkinToneProbing = new Emoji("\u{1F468}\u{1F3FF}\u200D\u{1F9AF}", "Man: Dark Skin Tone: Probing");
    const womanProbing = new Emoji("\u{1F469}\u200D\u{1F9AF}", "Woman: Probing");
    const womanLightSkinToneProbing = new Emoji("\u{1F469}\u{1F3FB}\u200D\u{1F9AF}", "Woman: Light Skin Tone: Probing");
    const womanMediumLightSkinToneProbing = new Emoji("\u{1F469}\u{1F3FC}\u200D\u{1F9AF}", "Woman: Medium-Light Skin Tone: Probing");
    const womanMediumSkinToneProbing = new Emoji("\u{1F469}\u{1F3FD}\u200D\u{1F9AF}", "Woman: Medium Skin Tone: Probing");
    const womanMediumDarkSkinToneProbing = new Emoji("\u{1F469}\u{1F3FE}\u200D\u{1F9AF}", "Woman: Medium-Dark Skin Tone: Probing");
    const womanDarkSkinToneProbing = new Emoji("\u{1F469}\u{1F3FF}\u200D\u{1F9AF}", "Woman: Dark Skin Tone: Probing");
    const manInMotorizedWheelchair = new Emoji("\u{1F468}\u200D\u{1F9BC}", "Man: In Motorized Wheelchair");
    const manLightSkinToneInMotorizedWheelchair = new Emoji("\u{1F468}\u{1F3FB}\u200D\u{1F9BC}", "Man: Light Skin Tone: In Motorized Wheelchair");
    const manMediumLightSkinToneInMotorizedWheelchair = new Emoji("\u{1F468}\u{1F3FC}\u200D\u{1F9BC}", "Man: Medium-Light Skin Tone: In Motorized Wheelchair");
    const manMediumSkinToneInMotorizedWheelchair = new Emoji("\u{1F468}\u{1F3FD}\u200D\u{1F9BC}", "Man: Medium Skin Tone: In Motorized Wheelchair");
    const manMediumDarkSkinToneInMotorizedWheelchair = new Emoji("\u{1F468}\u{1F3FE}\u200D\u{1F9BC}", "Man: Medium-Dark Skin Tone: In Motorized Wheelchair");
    const manDarkSkinToneInMotorizedWheelchair = new Emoji("\u{1F468}\u{1F3FF}\u200D\u{1F9BC}", "Man: Dark Skin Tone: In Motorized Wheelchair");
    const womanInMotorizedWheelchair = new Emoji("\u{1F469}\u200D\u{1F9BC}", "Woman: In Motorized Wheelchair");
    const womanLightSkinToneInMotorizedWheelchair = new Emoji("\u{1F469}\u{1F3FB}\u200D\u{1F9BC}", "Woman: Light Skin Tone: In Motorized Wheelchair");
    const womanMediumLightSkinToneInMotorizedWheelchair = new Emoji("\u{1F469}\u{1F3FC}\u200D\u{1F9BC}", "Woman: Medium-Light Skin Tone: In Motorized Wheelchair");
    const womanMediumSkinToneInMotorizedWheelchair = new Emoji("\u{1F469}\u{1F3FD}\u200D\u{1F9BC}", "Woman: Medium Skin Tone: In Motorized Wheelchair");
    const womanMediumDarkSkinToneInMotorizedWheelchair = new Emoji("\u{1F469}\u{1F3FE}\u200D\u{1F9BC}", "Woman: Medium-Dark Skin Tone: In Motorized Wheelchair");
    const womanDarkSkinToneInMotorizedWheelchair = new Emoji("\u{1F469}\u{1F3FF}\u200D\u{1F9BC}", "Woman: Dark Skin Tone: In Motorized Wheelchair");
    const manInManualWheelchair = new Emoji("\u{1F468}\u200D\u{1F9BD}", "Man: In Manual Wheelchair");
    const manLightSkinToneInManualWheelchair = new Emoji("\u{1F468}\u{1F3FB}\u200D\u{1F9BD}", "Man: Light Skin Tone: In Manual Wheelchair");
    const manMediumLightSkinToneInManualWheelchair = new Emoji("\u{1F468}\u{1F3FC}\u200D\u{1F9BD}", "Man: Medium-Light Skin Tone: In Manual Wheelchair");
    const manMediumSkinToneInManualWheelchair = new Emoji("\u{1F468}\u{1F3FD}\u200D\u{1F9BD}", "Man: Medium Skin Tone: In Manual Wheelchair");
    const manMediumDarkSkinToneInManualWheelchair = new Emoji("\u{1F468}\u{1F3FE}\u200D\u{1F9BD}", "Man: Medium-Dark Skin Tone: In Manual Wheelchair");
    const manDarkSkinToneInManualWheelchair = new Emoji("\u{1F468}\u{1F3FF}\u200D\u{1F9BD}", "Man: Dark Skin Tone: In Manual Wheelchair");
    const womanInManualWheelchair = new Emoji("\u{1F469}\u200D\u{1F9BD}", "Woman: In Manual Wheelchair");
    const womanLightSkinToneInManualWheelchair = new Emoji("\u{1F469}\u{1F3FB}\u200D\u{1F9BD}", "Woman: Light Skin Tone: In Manual Wheelchair");
    const womanMediumLightSkinToneInManualWheelchair = new Emoji("\u{1F469}\u{1F3FC}\u200D\u{1F9BD}", "Woman: Medium-Light Skin Tone: In Manual Wheelchair");
    const womanMediumSkinToneInManualWheelchair = new Emoji("\u{1F469}\u{1F3FD}\u200D\u{1F9BD}", "Woman: Medium Skin Tone: In Manual Wheelchair");
    const womanMediumDarkSkinToneInManualWheelchair = new Emoji("\u{1F469}\u{1F3FE}\u200D\u{1F9BD}", "Woman: Medium-Dark Skin Tone: In Manual Wheelchair");
    const womanDarkSkinToneInManualWheelchair = new Emoji("\u{1F469}\u{1F3FF}\u200D\u{1F9BD}", "Woman: Dark Skin Tone: In Manual Wheelchair");
    const manDancing = new Emoji("\u{1F57A}", "Man Dancing");
    const manDancingLightSkinTone = new Emoji("\u{1F57A}\u{1F3FB}", "Man Dancing: Light Skin Tone");
    const manDancingMediumLightSkinTone = new Emoji("\u{1F57A}\u{1F3FC}", "Man Dancing: Medium-Light Skin Tone");
    const manDancingMediumSkinTone = new Emoji("\u{1F57A}\u{1F3FD}", "Man Dancing: Medium Skin Tone");
    const manDancingMediumDarkSkinTone = new Emoji("\u{1F57A}\u{1F3FE}", "Man Dancing: Medium-Dark Skin Tone");
    const manDancingDarkSkinTone = new Emoji("\u{1F57A}\u{1F3FF}", "Man Dancing: Dark Skin Tone");
    const womanDancing = new Emoji("\u{1F483}", "Woman Dancing");
    const womanDancingLightSkinTone = new Emoji("\u{1F483}\u{1F3FB}", "Woman Dancing: Light Skin Tone");
    const womanDancingMediumLightSkinTone = new Emoji("\u{1F483}\u{1F3FC}", "Woman Dancing: Medium-Light Skin Tone");
    const womanDancingMediumSkinTone = new Emoji("\u{1F483}\u{1F3FD}", "Woman Dancing: Medium Skin Tone");
    const womanDancingMediumDarkSkinTone = new Emoji("\u{1F483}\u{1F3FE}", "Woman Dancing: Medium-Dark Skin Tone");
    const womanDancingDarkSkinTone = new Emoji("\u{1F483}\u{1F3FF}", "Woman Dancing: Dark Skin Tone");
    const juggler = new Emoji("\u{1F939}", "Juggler");
    const jugglerLightSkinTone = new Emoji("\u{1F939}\u{1F3FB}", "Juggler: Light Skin Tone");
    const jugglerMediumLightSkinTone = new Emoji("\u{1F939}\u{1F3FC}", "Juggler: Medium-Light Skin Tone");
    const jugglerMediumSkinTone = new Emoji("\u{1F939}\u{1F3FD}", "Juggler: Medium Skin Tone");
    const jugglerMediumDarkSkinTone = new Emoji("\u{1F939}\u{1F3FE}", "Juggler: Medium-Dark Skin Tone");
    const jugglerDarkSkinTone = new Emoji("\u{1F939}\u{1F3FF}", "Juggler: Dark Skin Tone");
    const jugglerMale = new Emoji("\u{1F939}\u200D\u2642\uFE0F", "Juggler: Male");
    const jugglerLightSkinToneMale = new Emoji("\u{1F939}\u{1F3FB}\u200D\u2642\uFE0F", "Juggler: Light Skin Tone: Male");
    const jugglerMediumLightSkinToneMale = new Emoji("\u{1F939}\u{1F3FC}\u200D\u2642\uFE0F", "Juggler: Medium-Light Skin Tone: Male");
    const jugglerMediumSkinToneMale = new Emoji("\u{1F939}\u{1F3FD}\u200D\u2642\uFE0F", "Juggler: Medium Skin Tone: Male");
    const jugglerMediumDarkSkinToneMale = new Emoji("\u{1F939}\u{1F3FE}\u200D\u2642\uFE0F", "Juggler: Medium-Dark Skin Tone: Male");
    const jugglerDarkSkinToneMale = new Emoji("\u{1F939}\u{1F3FF}\u200D\u2642\uFE0F", "Juggler: Dark Skin Tone: Male");
    const jugglerFemale = new Emoji("\u{1F939}\u200D\u2640\uFE0F", "Juggler: Female");
    const jugglerLightSkinToneFemale = new Emoji("\u{1F939}\u{1F3FB}\u200D\u2640\uFE0F", "Juggler: Light Skin Tone: Female");
    const jugglerMediumLightSkinToneFemale = new Emoji("\u{1F939}\u{1F3FC}\u200D\u2640\uFE0F", "Juggler: Medium-Light Skin Tone: Female");
    const jugglerMediumSkinToneFemale = new Emoji("\u{1F939}\u{1F3FD}\u200D\u2640\uFE0F", "Juggler: Medium Skin Tone: Female");
    const jugglerMediumDarkSkinToneFemale = new Emoji("\u{1F939}\u{1F3FE}\u200D\u2640\uFE0F", "Juggler: Medium-Dark Skin Tone: Female");
    const jugglerDarkSkinToneFemale = new Emoji("\u{1F939}\u{1F3FF}\u200D\u2640\uFE0F", "Juggler: Dark Skin Tone: Female");
    const climber = new Emoji("\u{1F9D7}", "Climber");
    const climberLightSkinTone = new Emoji("\u{1F9D7}\u{1F3FB}", "Climber: Light Skin Tone");
    const climberMediumLightSkinTone = new Emoji("\u{1F9D7}\u{1F3FC}", "Climber: Medium-Light Skin Tone");
    const climberMediumSkinTone = new Emoji("\u{1F9D7}\u{1F3FD}", "Climber: Medium Skin Tone");
    const climberMediumDarkSkinTone = new Emoji("\u{1F9D7}\u{1F3FE}", "Climber: Medium-Dark Skin Tone");
    const climberDarkSkinTone = new Emoji("\u{1F9D7}\u{1F3FF}", "Climber: Dark Skin Tone");
    const climberMale = new Emoji("\u{1F9D7}\u200D\u2642\uFE0F", "Climber: Male");
    const climberLightSkinToneMale = new Emoji("\u{1F9D7}\u{1F3FB}\u200D\u2642\uFE0F", "Climber: Light Skin Tone: Male");
    const climberMediumLightSkinToneMale = new Emoji("\u{1F9D7}\u{1F3FC}\u200D\u2642\uFE0F", "Climber: Medium-Light Skin Tone: Male");
    const climberMediumSkinToneMale = new Emoji("\u{1F9D7}\u{1F3FD}\u200D\u2642\uFE0F", "Climber: Medium Skin Tone: Male");
    const climberMediumDarkSkinToneMale = new Emoji("\u{1F9D7}\u{1F3FE}\u200D\u2642\uFE0F", "Climber: Medium-Dark Skin Tone: Male");
    const climberDarkSkinToneMale = new Emoji("\u{1F9D7}\u{1F3FF}\u200D\u2642\uFE0F", "Climber: Dark Skin Tone: Male");
    const climberFemale = new Emoji("\u{1F9D7}\u200D\u2640\uFE0F", "Climber: Female");
    const climberLightSkinToneFemale = new Emoji("\u{1F9D7}\u{1F3FB}\u200D\u2640\uFE0F", "Climber: Light Skin Tone: Female");
    const climberMediumLightSkinToneFemale = new Emoji("\u{1F9D7}\u{1F3FC}\u200D\u2640\uFE0F", "Climber: Medium-Light Skin Tone: Female");
    const climberMediumSkinToneFemale = new Emoji("\u{1F9D7}\u{1F3FD}\u200D\u2640\uFE0F", "Climber: Medium Skin Tone: Female");
    const climberMediumDarkSkinToneFemale = new Emoji("\u{1F9D7}\u{1F3FE}\u200D\u2640\uFE0F", "Climber: Medium-Dark Skin Tone: Female");
    const climberDarkSkinToneFemale = new Emoji("\u{1F9D7}\u{1F3FF}\u200D\u2640\uFE0F", "Climber: Dark Skin Tone: Female");
    const jockey = new Emoji("\u{1F3C7}", "Jockey");
    const jockeyLightSkinTone = new Emoji("\u{1F3C7}\u{1F3FB}", "Jockey: Light Skin Tone");
    const jockeyMediumLightSkinTone = new Emoji("\u{1F3C7}\u{1F3FC}", "Jockey: Medium-Light Skin Tone");
    const jockeyMediumSkinTone = new Emoji("\u{1F3C7}\u{1F3FD}", "Jockey: Medium Skin Tone");
    const jockeyMediumDarkSkinTone = new Emoji("\u{1F3C7}\u{1F3FE}", "Jockey: Medium-Dark Skin Tone");
    const jockeyDarkSkinTone = new Emoji("\u{1F3C7}\u{1F3FF}", "Jockey: Dark Skin Tone");
    const snowboarder = new Emoji("\u{1F3C2}", "Snowboarder");
    const snowboarderLightSkinTone = new Emoji("\u{1F3C2}\u{1F3FB}", "Snowboarder: Light Skin Tone");
    const snowboarderMediumLightSkinTone = new Emoji("\u{1F3C2}\u{1F3FC}", "Snowboarder: Medium-Light Skin Tone");
    const snowboarderMediumSkinTone = new Emoji("\u{1F3C2}\u{1F3FD}", "Snowboarder: Medium Skin Tone");
    const snowboarderMediumDarkSkinTone = new Emoji("\u{1F3C2}\u{1F3FE}", "Snowboarder: Medium-Dark Skin Tone");
    const snowboarderDarkSkinTone = new Emoji("\u{1F3C2}\u{1F3FF}", "Snowboarder: Dark Skin Tone");
    const golfer = new Emoji("\u{1F3CC}\uFE0F", "Golfer");
    const golferLightSkinTone = new Emoji("\u{1F3CC}\uFE0F\u{1F3FB}", "Golfer: Light Skin Tone");
    const golferMediumLightSkinTone = new Emoji("\u{1F3CC}\uFE0F\u{1F3FC}", "Golfer: Medium-Light Skin Tone");
    const golferMediumSkinTone = new Emoji("\u{1F3CC}\uFE0F\u{1F3FD}", "Golfer: Medium Skin Tone");
    const golferMediumDarkSkinTone = new Emoji("\u{1F3CC}\uFE0F\u{1F3FE}", "Golfer: Medium-Dark Skin Tone");
    const golferDarkSkinTone = new Emoji("\u{1F3CC}\uFE0F\u{1F3FF}", "Golfer: Dark Skin Tone");
    const golferMale = new Emoji("\u{1F3CC}\uFE0F\u200D\u2642\uFE0F", "Golfer: Male");
    const golferLightSkinToneMale = new Emoji("\u{1F3CC}\uFE0F\u{1F3FB}\u200D\u2642\uFE0F", "Golfer: Light Skin Tone: Male");
    const golferMediumLightSkinToneMale = new Emoji("\u{1F3CC}\uFE0F\u{1F3FC}\u200D\u2642\uFE0F", "Golfer: Medium-Light Skin Tone: Male");
    const golferMediumSkinToneMale = new Emoji("\u{1F3CC}\uFE0F\u{1F3FD}\u200D\u2642\uFE0F", "Golfer: Medium Skin Tone: Male");
    const golferMediumDarkSkinToneMale = new Emoji("\u{1F3CC}\uFE0F\u{1F3FE}\u200D\u2642\uFE0F", "Golfer: Medium-Dark Skin Tone: Male");
    const golferDarkSkinToneMale = new Emoji("\u{1F3CC}\uFE0F\u{1F3FF}\u200D\u2642\uFE0F", "Golfer: Dark Skin Tone: Male");
    const golferFemale = new Emoji("\u{1F3CC}\uFE0F\u200D\u2640\uFE0F", "Golfer: Female");
    const golferLightSkinToneFemale = new Emoji("\u{1F3CC}\uFE0F\u{1F3FB}\u200D\u2640\uFE0F", "Golfer: Light Skin Tone: Female");
    const golferMediumLightSkinToneFemale = new Emoji("\u{1F3CC}\uFE0F\u{1F3FC}\u200D\u2640\uFE0F", "Golfer: Medium-Light Skin Tone: Female");
    const golferMediumSkinToneFemale = new Emoji("\u{1F3CC}\uFE0F\u{1F3FD}\u200D\u2640\uFE0F", "Golfer: Medium Skin Tone: Female");
    const golferMediumDarkSkinToneFemale = new Emoji("\u{1F3CC}\uFE0F\u{1F3FE}\u200D\u2640\uFE0F", "Golfer: Medium-Dark Skin Tone: Female");
    const golferDarkSkinToneFemale = new Emoji("\u{1F3CC}\uFE0F\u{1F3FF}\u200D\u2640\uFE0F", "Golfer: Dark Skin Tone: Female");
    const surfing = new Emoji("\u{1F3C4}", "Surfing");
    const surfingLightSkinTone = new Emoji("\u{1F3C4}\u{1F3FB}", "Surfing: Light Skin Tone");
    const surfingMediumLightSkinTone = new Emoji("\u{1F3C4}\u{1F3FC}", "Surfing: Medium-Light Skin Tone");
    const surfingMediumSkinTone = new Emoji("\u{1F3C4}\u{1F3FD}", "Surfing: Medium Skin Tone");
    const surfingMediumDarkSkinTone = new Emoji("\u{1F3C4}\u{1F3FE}", "Surfing: Medium-Dark Skin Tone");
    const surfingDarkSkinTone = new Emoji("\u{1F3C4}\u{1F3FF}", "Surfing: Dark Skin Tone");
    const surfingMale = new Emoji("\u{1F3C4}\u200D\u2642\uFE0F", "Surfing: Male");
    const surfingLightSkinToneMale = new Emoji("\u{1F3C4}\u{1F3FB}\u200D\u2642\uFE0F", "Surfing: Light Skin Tone: Male");
    const surfingMediumLightSkinToneMale = new Emoji("\u{1F3C4}\u{1F3FC}\u200D\u2642\uFE0F", "Surfing: Medium-Light Skin Tone: Male");
    const surfingMediumSkinToneMale = new Emoji("\u{1F3C4}\u{1F3FD}\u200D\u2642\uFE0F", "Surfing: Medium Skin Tone: Male");
    const surfingMediumDarkSkinToneMale = new Emoji("\u{1F3C4}\u{1F3FE}\u200D\u2642\uFE0F", "Surfing: Medium-Dark Skin Tone: Male");
    const surfingDarkSkinToneMale = new Emoji("\u{1F3C4}\u{1F3FF}\u200D\u2642\uFE0F", "Surfing: Dark Skin Tone: Male");
    const surfingFemale = new Emoji("\u{1F3C4}\u200D\u2640\uFE0F", "Surfing: Female");
    const surfingLightSkinToneFemale = new Emoji("\u{1F3C4}\u{1F3FB}\u200D\u2640\uFE0F", "Surfing: Light Skin Tone: Female");
    const surfingMediumLightSkinToneFemale = new Emoji("\u{1F3C4}\u{1F3FC}\u200D\u2640\uFE0F", "Surfing: Medium-Light Skin Tone: Female");
    const surfingMediumSkinToneFemale = new Emoji("\u{1F3C4}\u{1F3FD}\u200D\u2640\uFE0F", "Surfing: Medium Skin Tone: Female");
    const surfingMediumDarkSkinToneFemale = new Emoji("\u{1F3C4}\u{1F3FE}\u200D\u2640\uFE0F", "Surfing: Medium-Dark Skin Tone: Female");
    const surfingDarkSkinToneFemale = new Emoji("\u{1F3C4}\u{1F3FF}\u200D\u2640\uFE0F", "Surfing: Dark Skin Tone: Female");
    const rowingBoat = new Emoji("\u{1F6A3}", "Rowing Boat");
    const rowingBoatLightSkinTone = new Emoji("\u{1F6A3}\u{1F3FB}", "Rowing Boat: Light Skin Tone");
    const rowingBoatMediumLightSkinTone = new Emoji("\u{1F6A3}\u{1F3FC}", "Rowing Boat: Medium-Light Skin Tone");
    const rowingBoatMediumSkinTone = new Emoji("\u{1F6A3}\u{1F3FD}", "Rowing Boat: Medium Skin Tone");
    const rowingBoatMediumDarkSkinTone = new Emoji("\u{1F6A3}\u{1F3FE}", "Rowing Boat: Medium-Dark Skin Tone");
    const rowingBoatDarkSkinTone = new Emoji("\u{1F6A3}\u{1F3FF}", "Rowing Boat: Dark Skin Tone");
    const rowingBoatMale = new Emoji("\u{1F6A3}\u200D\u2642\uFE0F", "Rowing Boat: Male");
    const rowingBoatLightSkinToneMale = new Emoji("\u{1F6A3}\u{1F3FB}\u200D\u2642\uFE0F", "Rowing Boat: Light Skin Tone: Male");
    const rowingBoatMediumLightSkinToneMale = new Emoji("\u{1F6A3}\u{1F3FC}\u200D\u2642\uFE0F", "Rowing Boat: Medium-Light Skin Tone: Male");
    const rowingBoatMediumSkinToneMale = new Emoji("\u{1F6A3}\u{1F3FD}\u200D\u2642\uFE0F", "Rowing Boat: Medium Skin Tone: Male");
    const rowingBoatMediumDarkSkinToneMale = new Emoji("\u{1F6A3}\u{1F3FE}\u200D\u2642\uFE0F", "Rowing Boat: Medium-Dark Skin Tone: Male");
    const rowingBoatDarkSkinToneMale = new Emoji("\u{1F6A3}\u{1F3FF}\u200D\u2642\uFE0F", "Rowing Boat: Dark Skin Tone: Male");
    const rowingBoatFemale = new Emoji("\u{1F6A3}\u200D\u2640\uFE0F", "Rowing Boat: Female");
    const rowingBoatLightSkinToneFemale = new Emoji("\u{1F6A3}\u{1F3FB}\u200D\u2640\uFE0F", "Rowing Boat: Light Skin Tone: Female");
    const rowingBoatMediumLightSkinToneFemale = new Emoji("\u{1F6A3}\u{1F3FC}\u200D\u2640\uFE0F", "Rowing Boat: Medium-Light Skin Tone: Female");
    const rowingBoatMediumSkinToneFemale = new Emoji("\u{1F6A3}\u{1F3FD}\u200D\u2640\uFE0F", "Rowing Boat: Medium Skin Tone: Female");
    const rowingBoatMediumDarkSkinToneFemale = new Emoji("\u{1F6A3}\u{1F3FE}\u200D\u2640\uFE0F", "Rowing Boat: Medium-Dark Skin Tone: Female");
    const rowingBoatDarkSkinToneFemale = new Emoji("\u{1F6A3}\u{1F3FF}\u200D\u2640\uFE0F", "Rowing Boat: Dark Skin Tone: Female");
    const swimming = new Emoji("\u{1F3CA}", "Swimming");
    const swimmingLightSkinTone = new Emoji("\u{1F3CA}\u{1F3FB}", "Swimming: Light Skin Tone");
    const swimmingMediumLightSkinTone = new Emoji("\u{1F3CA}\u{1F3FC}", "Swimming: Medium-Light Skin Tone");
    const swimmingMediumSkinTone = new Emoji("\u{1F3CA}\u{1F3FD}", "Swimming: Medium Skin Tone");
    const swimmingMediumDarkSkinTone = new Emoji("\u{1F3CA}\u{1F3FE}", "Swimming: Medium-Dark Skin Tone");
    const swimmingDarkSkinTone = new Emoji("\u{1F3CA}\u{1F3FF}", "Swimming: Dark Skin Tone");
    const swimmingMale = new Emoji("\u{1F3CA}\u200D\u2642\uFE0F", "Swimming: Male");
    const swimmingLightSkinToneMale = new Emoji("\u{1F3CA}\u{1F3FB}\u200D\u2642\uFE0F", "Swimming: Light Skin Tone: Male");
    const swimmingMediumLightSkinToneMale = new Emoji("\u{1F3CA}\u{1F3FC}\u200D\u2642\uFE0F", "Swimming: Medium-Light Skin Tone: Male");
    const swimmingMediumSkinToneMale = new Emoji("\u{1F3CA}\u{1F3FD}\u200D\u2642\uFE0F", "Swimming: Medium Skin Tone: Male");
    const swimmingMediumDarkSkinToneMale = new Emoji("\u{1F3CA}\u{1F3FE}\u200D\u2642\uFE0F", "Swimming: Medium-Dark Skin Tone: Male");
    const swimmingDarkSkinToneMale = new Emoji("\u{1F3CA}\u{1F3FF}\u200D\u2642\uFE0F", "Swimming: Dark Skin Tone: Male");
    const swimmingFemale = new Emoji("\u{1F3CA}\u200D\u2640\uFE0F", "Swimming: Female");
    const swimmingLightSkinToneFemale = new Emoji("\u{1F3CA}\u{1F3FB}\u200D\u2640\uFE0F", "Swimming: Light Skin Tone: Female");
    const swimmingMediumLightSkinToneFemale = new Emoji("\u{1F3CA}\u{1F3FC}\u200D\u2640\uFE0F", "Swimming: Medium-Light Skin Tone: Female");
    const swimmingMediumSkinToneFemale = new Emoji("\u{1F3CA}\u{1F3FD}\u200D\u2640\uFE0F", "Swimming: Medium Skin Tone: Female");
    const swimmingMediumDarkSkinToneFemale = new Emoji("\u{1F3CA}\u{1F3FE}\u200D\u2640\uFE0F", "Swimming: Medium-Dark Skin Tone: Female");
    const swimmingDarkSkinToneFemale = new Emoji("\u{1F3CA}\u{1F3FF}\u200D\u2640\uFE0F", "Swimming: Dark Skin Tone: Female");
    const basketBaller = new Emoji("\u26F9\uFE0F", "Basket Baller");
    const basketBallerLightSkinTone = new Emoji("\u26F9\uFE0F\u{1F3FB}", "Basket Baller: Light Skin Tone");
    const basketBallerMediumLightSkinTone = new Emoji("\u26F9\uFE0F\u{1F3FC}", "Basket Baller: Medium-Light Skin Tone");
    const basketBallerMediumSkinTone = new Emoji("\u26F9\uFE0F\u{1F3FD}", "Basket Baller: Medium Skin Tone");
    const basketBallerMediumDarkSkinTone = new Emoji("\u26F9\uFE0F\u{1F3FE}", "Basket Baller: Medium-Dark Skin Tone");
    const basketBallerDarkSkinTone = new Emoji("\u26F9\uFE0F\u{1F3FF}", "Basket Baller: Dark Skin Tone");
    const basketBallerMale = new Emoji("\u26F9\uFE0F\u200D\u2642\uFE0F", "Basket Baller: Male");
    const basketBallerLightSkinToneMale = new Emoji("\u26F9\uFE0F\u{1F3FB}\u200D\u2642\uFE0F", "Basket Baller: Light Skin Tone: Male");
    const basketBallerMediumLightSkinToneMale = new Emoji("\u26F9\uFE0F\u{1F3FC}\u200D\u2642\uFE0F", "Basket Baller: Medium-Light Skin Tone: Male");
    const basketBallerMediumSkinToneMale = new Emoji("\u26F9\uFE0F\u{1F3FD}\u200D\u2642\uFE0F", "Basket Baller: Medium Skin Tone: Male");
    const basketBallerMediumDarkSkinToneMale = new Emoji("\u26F9\uFE0F\u{1F3FE}\u200D\u2642\uFE0F", "Basket Baller: Medium-Dark Skin Tone: Male");
    const basketBallerDarkSkinToneMale = new Emoji("\u26F9\uFE0F\u{1F3FF}\u200D\u2642\uFE0F", "Basket Baller: Dark Skin Tone: Male");
    const basketBallerFemale = new Emoji("\u26F9\uFE0F\u200D\u2640\uFE0F", "Basket Baller: Female");
    const basketBallerLightSkinToneFemale = new Emoji("\u26F9\uFE0F\u{1F3FB}\u200D\u2640\uFE0F", "Basket Baller: Light Skin Tone: Female");
    const basketBallerMediumLightSkinToneFemale = new Emoji("\u26F9\uFE0F\u{1F3FC}\u200D\u2640\uFE0F", "Basket Baller: Medium-Light Skin Tone: Female");
    const basketBallerMediumSkinToneFemale = new Emoji("\u26F9\uFE0F\u{1F3FD}\u200D\u2640\uFE0F", "Basket Baller: Medium Skin Tone: Female");
    const basketBallerMediumDarkSkinToneFemale = new Emoji("\u26F9\uFE0F\u{1F3FE}\u200D\u2640\uFE0F", "Basket Baller: Medium-Dark Skin Tone: Female");
    const basketBallerDarkSkinToneFemale = new Emoji("\u26F9\uFE0F\u{1F3FF}\u200D\u2640\uFE0F", "Basket Baller: Dark Skin Tone: Female");
    const weightLifter = new Emoji("\u{1F3CB}\uFE0F", "Weight Lifter");
    const weightLifterLightSkinTone = new Emoji("\u{1F3CB}\uFE0F\u{1F3FB}", "Weight Lifter: Light Skin Tone");
    const weightLifterMediumLightSkinTone = new Emoji("\u{1F3CB}\uFE0F\u{1F3FC}", "Weight Lifter: Medium-Light Skin Tone");
    const weightLifterMediumSkinTone = new Emoji("\u{1F3CB}\uFE0F\u{1F3FD}", "Weight Lifter: Medium Skin Tone");
    const weightLifterMediumDarkSkinTone = new Emoji("\u{1F3CB}\uFE0F\u{1F3FE}", "Weight Lifter: Medium-Dark Skin Tone");
    const weightLifterDarkSkinTone = new Emoji("\u{1F3CB}\uFE0F\u{1F3FF}", "Weight Lifter: Dark Skin Tone");
    const weightLifterMale = new Emoji("\u{1F3CB}\uFE0F\u200D\u2642\uFE0F", "Weight Lifter: Male");
    const weightLifterLightSkinToneMale = new Emoji("\u{1F3CB}\uFE0F\u{1F3FB}\u200D\u2642\uFE0F", "Weight Lifter: Light Skin Tone: Male");
    const weightLifterMediumLightSkinToneMale = new Emoji("\u{1F3CB}\uFE0F\u{1F3FC}\u200D\u2642\uFE0F", "Weight Lifter: Medium-Light Skin Tone: Male");
    const weightLifterMediumSkinToneMale = new Emoji("\u{1F3CB}\uFE0F\u{1F3FD}\u200D\u2642\uFE0F", "Weight Lifter: Medium Skin Tone: Male");
    const weightLifterMediumDarkSkinToneMale = new Emoji("\u{1F3CB}\uFE0F\u{1F3FE}\u200D\u2642\uFE0F", "Weight Lifter: Medium-Dark Skin Tone: Male");
    const weightLifterDarkSkinToneMale = new Emoji("\u{1F3CB}\uFE0F\u{1F3FF}\u200D\u2642\uFE0F", "Weight Lifter: Dark Skin Tone: Male");
    const weightLifterFemale = new Emoji("\u{1F3CB}\uFE0F\u200D\u2640\uFE0F", "Weight Lifter: Female");
    const weightLifterLightSkinToneFemale = new Emoji("\u{1F3CB}\uFE0F\u{1F3FB}\u200D\u2640\uFE0F", "Weight Lifter: Light Skin Tone: Female");
    const weightLifterMediumLightSkinToneFemale = new Emoji("\u{1F3CB}\uFE0F\u{1F3FC}\u200D\u2640\uFE0F", "Weight Lifter: Medium-Light Skin Tone: Female");
    const weightLifterMediumSkinToneFemale = new Emoji("\u{1F3CB}\uFE0F\u{1F3FD}\u200D\u2640\uFE0F", "Weight Lifter: Medium Skin Tone: Female");
    const weightLifterMediumDarkSkinToneFemale = new Emoji("\u{1F3CB}\uFE0F\u{1F3FE}\u200D\u2640\uFE0F", "Weight Lifter: Medium-Dark Skin Tone: Female");
    const weightLifterDarkSkinToneFemale = new Emoji("\u{1F3CB}\uFE0F\u{1F3FF}\u200D\u2640\uFE0F", "Weight Lifter: Dark Skin Tone: Female");
    const biker = new Emoji("\u{1F6B4}", "Biker");
    const bikerLightSkinTone = new Emoji("\u{1F6B4}\u{1F3FB}", "Biker: Light Skin Tone");
    const bikerMediumLightSkinTone = new Emoji("\u{1F6B4}\u{1F3FC}", "Biker: Medium-Light Skin Tone");
    const bikerMediumSkinTone = new Emoji("\u{1F6B4}\u{1F3FD}", "Biker: Medium Skin Tone");
    const bikerMediumDarkSkinTone = new Emoji("\u{1F6B4}\u{1F3FE}", "Biker: Medium-Dark Skin Tone");
    const bikerDarkSkinTone = new Emoji("\u{1F6B4}\u{1F3FF}", "Biker: Dark Skin Tone");
    const bikerMale = new Emoji("\u{1F6B4}\u200D\u2642\uFE0F", "Biker: Male");
    const bikerLightSkinToneMale = new Emoji("\u{1F6B4}\u{1F3FB}\u200D\u2642\uFE0F", "Biker: Light Skin Tone: Male");
    const bikerMediumLightSkinToneMale = new Emoji("\u{1F6B4}\u{1F3FC}\u200D\u2642\uFE0F", "Biker: Medium-Light Skin Tone: Male");
    const bikerMediumSkinToneMale = new Emoji("\u{1F6B4}\u{1F3FD}\u200D\u2642\uFE0F", "Biker: Medium Skin Tone: Male");
    const bikerMediumDarkSkinToneMale = new Emoji("\u{1F6B4}\u{1F3FE}\u200D\u2642\uFE0F", "Biker: Medium-Dark Skin Tone: Male");
    const bikerDarkSkinToneMale = new Emoji("\u{1F6B4}\u{1F3FF}\u200D\u2642\uFE0F", "Biker: Dark Skin Tone: Male");
    const bikerFemale = new Emoji("\u{1F6B4}\u200D\u2640\uFE0F", "Biker: Female");
    const bikerLightSkinToneFemale = new Emoji("\u{1F6B4}\u{1F3FB}\u200D\u2640\uFE0F", "Biker: Light Skin Tone: Female");
    const bikerMediumLightSkinToneFemale = new Emoji("\u{1F6B4}\u{1F3FC}\u200D\u2640\uFE0F", "Biker: Medium-Light Skin Tone: Female");
    const bikerMediumSkinToneFemale = new Emoji("\u{1F6B4}\u{1F3FD}\u200D\u2640\uFE0F", "Biker: Medium Skin Tone: Female");
    const bikerMediumDarkSkinToneFemale = new Emoji("\u{1F6B4}\u{1F3FE}\u200D\u2640\uFE0F", "Biker: Medium-Dark Skin Tone: Female");
    const bikerDarkSkinToneFemale = new Emoji("\u{1F6B4}\u{1F3FF}\u200D\u2640\uFE0F", "Biker: Dark Skin Tone: Female");
    const mountainBiker = new Emoji("\u{1F6B5}", "Mountain Biker");
    const mountainBikerLightSkinTone = new Emoji("\u{1F6B5}\u{1F3FB}", "Mountain Biker: Light Skin Tone");
    const mountainBikerMediumLightSkinTone = new Emoji("\u{1F6B5}\u{1F3FC}", "Mountain Biker: Medium-Light Skin Tone");
    const mountainBikerMediumSkinTone = new Emoji("\u{1F6B5}\u{1F3FD}", "Mountain Biker: Medium Skin Tone");
    const mountainBikerMediumDarkSkinTone = new Emoji("\u{1F6B5}\u{1F3FE}", "Mountain Biker: Medium-Dark Skin Tone");
    const mountainBikerDarkSkinTone = new Emoji("\u{1F6B5}\u{1F3FF}", "Mountain Biker: Dark Skin Tone");
    const mountainBikerMale = new Emoji("\u{1F6B5}\u200D\u2642\uFE0F", "Mountain Biker: Male");
    const mountainBikerLightSkinToneMale = new Emoji("\u{1F6B5}\u{1F3FB}\u200D\u2642\uFE0F", "Mountain Biker: Light Skin Tone: Male");
    const mountainBikerMediumLightSkinToneMale = new Emoji("\u{1F6B5}\u{1F3FC}\u200D\u2642\uFE0F", "Mountain Biker: Medium-Light Skin Tone: Male");
    const mountainBikerMediumSkinToneMale = new Emoji("\u{1F6B5}\u{1F3FD}\u200D\u2642\uFE0F", "Mountain Biker: Medium Skin Tone: Male");
    const mountainBikerMediumDarkSkinToneMale = new Emoji("\u{1F6B5}\u{1F3FE}\u200D\u2642\uFE0F", "Mountain Biker: Medium-Dark Skin Tone: Male");
    const mountainBikerDarkSkinToneMale = new Emoji("\u{1F6B5}\u{1F3FF}\u200D\u2642\uFE0F", "Mountain Biker: Dark Skin Tone: Male");
    const mountainBikerFemale = new Emoji("\u{1F6B5}\u200D\u2640\uFE0F", "Mountain Biker: Female");
    const mountainBikerLightSkinToneFemale = new Emoji("\u{1F6B5}\u{1F3FB}\u200D\u2640\uFE0F", "Mountain Biker: Light Skin Tone: Female");
    const mountainBikerMediumLightSkinToneFemale = new Emoji("\u{1F6B5}\u{1F3FC}\u200D\u2640\uFE0F", "Mountain Biker: Medium-Light Skin Tone: Female");
    const mountainBikerMediumSkinToneFemale = new Emoji("\u{1F6B5}\u{1F3FD}\u200D\u2640\uFE0F", "Mountain Biker: Medium Skin Tone: Female");
    const mountainBikerMediumDarkSkinToneFemale = new Emoji("\u{1F6B5}\u{1F3FE}\u200D\u2640\uFE0F", "Mountain Biker: Medium-Dark Skin Tone: Female");
    const mountainBikerDarkSkinToneFemale = new Emoji("\u{1F6B5}\u{1F3FF}\u200D\u2640\uFE0F", "Mountain Biker: Dark Skin Tone: Female");
    const cartwheeler = new Emoji("\u{1F938}", "Cartwheeler");
    const cartwheelerLightSkinTone = new Emoji("\u{1F938}\u{1F3FB}", "Cartwheeler: Light Skin Tone");
    const cartwheelerMediumLightSkinTone = new Emoji("\u{1F938}\u{1F3FC}", "Cartwheeler: Medium-Light Skin Tone");
    const cartwheelerMediumSkinTone = new Emoji("\u{1F938}\u{1F3FD}", "Cartwheeler: Medium Skin Tone");
    const cartwheelerMediumDarkSkinTone = new Emoji("\u{1F938}\u{1F3FE}", "Cartwheeler: Medium-Dark Skin Tone");
    const cartwheelerDarkSkinTone = new Emoji("\u{1F938}\u{1F3FF}", "Cartwheeler: Dark Skin Tone");
    const cartwheelerMale = new Emoji("\u{1F938}\u200D\u2642\uFE0F", "Cartwheeler: Male");
    const cartwheelerLightSkinToneMale = new Emoji("\u{1F938}\u{1F3FB}\u200D\u2642\uFE0F", "Cartwheeler: Light Skin Tone: Male");
    const cartwheelerMediumLightSkinToneMale = new Emoji("\u{1F938}\u{1F3FC}\u200D\u2642\uFE0F", "Cartwheeler: Medium-Light Skin Tone: Male");
    const cartwheelerMediumSkinToneMale = new Emoji("\u{1F938}\u{1F3FD}\u200D\u2642\uFE0F", "Cartwheeler: Medium Skin Tone: Male");
    const cartwheelerMediumDarkSkinToneMale = new Emoji("\u{1F938}\u{1F3FE}\u200D\u2642\uFE0F", "Cartwheeler: Medium-Dark Skin Tone: Male");
    const cartwheelerDarkSkinToneMale = new Emoji("\u{1F938}\u{1F3FF}\u200D\u2642\uFE0F", "Cartwheeler: Dark Skin Tone: Male");
    const cartwheelerFemale = new Emoji("\u{1F938}\u200D\u2640\uFE0F", "Cartwheeler: Female");
    const cartwheelerLightSkinToneFemale = new Emoji("\u{1F938}\u{1F3FB}\u200D\u2640\uFE0F", "Cartwheeler: Light Skin Tone: Female");
    const cartwheelerMediumLightSkinToneFemale = new Emoji("\u{1F938}\u{1F3FC}\u200D\u2640\uFE0F", "Cartwheeler: Medium-Light Skin Tone: Female");
    const cartwheelerMediumSkinToneFemale = new Emoji("\u{1F938}\u{1F3FD}\u200D\u2640\uFE0F", "Cartwheeler: Medium Skin Tone: Female");
    const cartwheelerMediumDarkSkinToneFemale = new Emoji("\u{1F938}\u{1F3FE}\u200D\u2640\uFE0F", "Cartwheeler: Medium-Dark Skin Tone: Female");
    const cartwheelerDarkSkinToneFemale = new Emoji("\u{1F938}\u{1F3FF}\u200D\u2640\uFE0F", "Cartwheeler: Dark Skin Tone: Female");
    const wrestler = new Emoji("\u{1F93C}", "Wrestler");
    const wrestlerMale = new Emoji("\u{1F93C}\u200D\u2642\uFE0F", "Wrestler: Male");
    const wrestlerFemale = new Emoji("\u{1F93C}\u200D\u2640\uFE0F", "Wrestler: Female");
    const waterPoloPlayer = new Emoji("\u{1F93D}", "Water Polo Player");
    const waterPoloPlayerLightSkinTone = new Emoji("\u{1F93D}\u{1F3FB}", "Water Polo Player: Light Skin Tone");
    const waterPoloPlayerMediumLightSkinTone = new Emoji("\u{1F93D}\u{1F3FC}", "Water Polo Player: Medium-Light Skin Tone");
    const waterPoloPlayerMediumSkinTone = new Emoji("\u{1F93D}\u{1F3FD}", "Water Polo Player: Medium Skin Tone");
    const waterPoloPlayerMediumDarkSkinTone = new Emoji("\u{1F93D}\u{1F3FE}", "Water Polo Player: Medium-Dark Skin Tone");
    const waterPoloPlayerDarkSkinTone = new Emoji("\u{1F93D}\u{1F3FF}", "Water Polo Player: Dark Skin Tone");
    const waterPoloPlayerMale = new Emoji("\u{1F93D}\u200D\u2642\uFE0F", "Water Polo Player: Male");
    const waterPoloPlayerLightSkinToneMale = new Emoji("\u{1F93D}\u{1F3FB}\u200D\u2642\uFE0F", "Water Polo Player: Light Skin Tone: Male");
    const waterPoloPlayerMediumLightSkinToneMale = new Emoji("\u{1F93D}\u{1F3FC}\u200D\u2642\uFE0F", "Water Polo Player: Medium-Light Skin Tone: Male");
    const waterPoloPlayerMediumSkinToneMale = new Emoji("\u{1F93D}\u{1F3FD}\u200D\u2642\uFE0F", "Water Polo Player: Medium Skin Tone: Male");
    const waterPoloPlayerMediumDarkSkinToneMale = new Emoji("\u{1F93D}\u{1F3FE}\u200D\u2642\uFE0F", "Water Polo Player: Medium-Dark Skin Tone: Male");
    const waterPoloPlayerDarkSkinToneMale = new Emoji("\u{1F93D}\u{1F3FF}\u200D\u2642\uFE0F", "Water Polo Player: Dark Skin Tone: Male");
    const waterPoloPlayerFemale = new Emoji("\u{1F93D}\u200D\u2640\uFE0F", "Water Polo Player: Female");
    const waterPoloPlayerLightSkinToneFemale = new Emoji("\u{1F93D}\u{1F3FB}\u200D\u2640\uFE0F", "Water Polo Player: Light Skin Tone: Female");
    const waterPoloPlayerMediumLightSkinToneFemale = new Emoji("\u{1F93D}\u{1F3FC}\u200D\u2640\uFE0F", "Water Polo Player: Medium-Light Skin Tone: Female");
    const waterPoloPlayerMediumSkinToneFemale = new Emoji("\u{1F93D}\u{1F3FD}\u200D\u2640\uFE0F", "Water Polo Player: Medium Skin Tone: Female");
    const waterPoloPlayerMediumDarkSkinToneFemale = new Emoji("\u{1F93D}\u{1F3FE}\u200D\u2640\uFE0F", "Water Polo Player: Medium-Dark Skin Tone: Female");
    const waterPoloPlayerDarkSkinToneFemale = new Emoji("\u{1F93D}\u{1F3FF}\u200D\u2640\uFE0F", "Water Polo Player: Dark Skin Tone: Female");
    const handBaller = new Emoji("\u{1F93E}", "Hand Baller");
    const handBallerLightSkinTone = new Emoji("\u{1F93E}\u{1F3FB}", "Hand Baller: Light Skin Tone");
    const handBallerMediumLightSkinTone = new Emoji("\u{1F93E}\u{1F3FC}", "Hand Baller: Medium-Light Skin Tone");
    const handBallerMediumSkinTone = new Emoji("\u{1F93E}\u{1F3FD}", "Hand Baller: Medium Skin Tone");
    const handBallerMediumDarkSkinTone = new Emoji("\u{1F93E}\u{1F3FE}", "Hand Baller: Medium-Dark Skin Tone");
    const handBallerDarkSkinTone = new Emoji("\u{1F93E}\u{1F3FF}", "Hand Baller: Dark Skin Tone");
    const handBallerMale = new Emoji("\u{1F93E}\u200D\u2642\uFE0F", "Hand Baller: Male");
    const handBallerLightSkinToneMale = new Emoji("\u{1F93E}\u{1F3FB}\u200D\u2642\uFE0F", "Hand Baller: Light Skin Tone: Male");
    const handBallerMediumLightSkinToneMale = new Emoji("\u{1F93E}\u{1F3FC}\u200D\u2642\uFE0F", "Hand Baller: Medium-Light Skin Tone: Male");
    const handBallerMediumSkinToneMale = new Emoji("\u{1F93E}\u{1F3FD}\u200D\u2642\uFE0F", "Hand Baller: Medium Skin Tone: Male");
    const handBallerMediumDarkSkinToneMale = new Emoji("\u{1F93E}\u{1F3FE}\u200D\u2642\uFE0F", "Hand Baller: Medium-Dark Skin Tone: Male");
    const handBallerDarkSkinToneMale = new Emoji("\u{1F93E}\u{1F3FF}\u200D\u2642\uFE0F", "Hand Baller: Dark Skin Tone: Male");
    const handBallerFemale = new Emoji("\u{1F93E}\u200D\u2640\uFE0F", "Hand Baller: Female");
    const handBallerLightSkinToneFemale = new Emoji("\u{1F93E}\u{1F3FB}\u200D\u2640\uFE0F", "Hand Baller: Light Skin Tone: Female");
    const handBallerMediumLightSkinToneFemale = new Emoji("\u{1F93E}\u{1F3FC}\u200D\u2640\uFE0F", "Hand Baller: Medium-Light Skin Tone: Female");
    const handBallerMediumSkinToneFemale = new Emoji("\u{1F93E}\u{1F3FD}\u200D\u2640\uFE0F", "Hand Baller: Medium Skin Tone: Female");
    const handBallerMediumDarkSkinToneFemale = new Emoji("\u{1F93E}\u{1F3FE}\u200D\u2640\uFE0F", "Hand Baller: Medium-Dark Skin Tone: Female");
    const handBallerDarkSkinToneFemale = new Emoji("\u{1F93E}\u{1F3FF}\u200D\u2640\uFE0F", "Hand Baller: Dark Skin Tone: Female");
    const inLotusPosition = new Emoji("\u{1F9D8}", "In Lotus Position");
    const inLotusPositionLightSkinTone = new Emoji("\u{1F9D8}\u{1F3FB}", "In Lotus Position: Light Skin Tone");
    const inLotusPositionMediumLightSkinTone = new Emoji("\u{1F9D8}\u{1F3FC}", "In Lotus Position: Medium-Light Skin Tone");
    const inLotusPositionMediumSkinTone = new Emoji("\u{1F9D8}\u{1F3FD}", "In Lotus Position: Medium Skin Tone");
    const inLotusPositionMediumDarkSkinTone = new Emoji("\u{1F9D8}\u{1F3FE}", "In Lotus Position: Medium-Dark Skin Tone");
    const inLotusPositionDarkSkinTone = new Emoji("\u{1F9D8}\u{1F3FF}", "In Lotus Position: Dark Skin Tone");
    const inLotusPositionMale = new Emoji("\u{1F9D8}\u200D\u2642\uFE0F", "In Lotus Position: Male");
    const inLotusPositionLightSkinToneMale = new Emoji("\u{1F9D8}\u{1F3FB}\u200D\u2642\uFE0F", "In Lotus Position: Light Skin Tone: Male");
    const inLotusPositionMediumLightSkinToneMale = new Emoji("\u{1F9D8}\u{1F3FC}\u200D\u2642\uFE0F", "In Lotus Position: Medium-Light Skin Tone: Male");
    const inLotusPositionMediumSkinToneMale = new Emoji("\u{1F9D8}\u{1F3FD}\u200D\u2642\uFE0F", "In Lotus Position: Medium Skin Tone: Male");
    const inLotusPositionMediumDarkSkinToneMale = new Emoji("\u{1F9D8}\u{1F3FE}\u200D\u2642\uFE0F", "In Lotus Position: Medium-Dark Skin Tone: Male");
    const inLotusPositionDarkSkinToneMale = new Emoji("\u{1F9D8}\u{1F3FF}\u200D\u2642\uFE0F", "In Lotus Position: Dark Skin Tone: Male");
    const inLotusPositionFemale = new Emoji("\u{1F9D8}\u200D\u2640\uFE0F", "In Lotus Position: Female");
    const inLotusPositionLightSkinToneFemale = new Emoji("\u{1F9D8}\u{1F3FB}\u200D\u2640\uFE0F", "In Lotus Position: Light Skin Tone: Female");
    const inLotusPositionMediumLightSkinToneFemale = new Emoji("\u{1F9D8}\u{1F3FC}\u200D\u2640\uFE0F", "In Lotus Position: Medium-Light Skin Tone: Female");
    const inLotusPositionMediumSkinToneFemale = new Emoji("\u{1F9D8}\u{1F3FD}\u200D\u2640\uFE0F", "In Lotus Position: Medium Skin Tone: Female");
    const inLotusPositionMediumDarkSkinToneFemale = new Emoji("\u{1F9D8}\u{1F3FE}\u200D\u2640\uFE0F", "In Lotus Position: Medium-Dark Skin Tone: Female");
    const inLotusPositionDarkSkinToneFemale = new Emoji("\u{1F9D8}\u{1F3FF}\u200D\u2640\uFE0F", "In Lotus Position: Dark Skin Tone: Female");
    const inBath = new Emoji("\u{1F6C0}", "In Bath");
    const inBathLightSkinTone = new Emoji("\u{1F6C0}\u{1F3FB}", "In Bath: Light Skin Tone");
    const inBathMediumLightSkinTone = new Emoji("\u{1F6C0}\u{1F3FC}", "In Bath: Medium-Light Skin Tone");
    const inBathMediumSkinTone = new Emoji("\u{1F6C0}\u{1F3FD}", "In Bath: Medium Skin Tone");
    const inBathMediumDarkSkinTone = new Emoji("\u{1F6C0}\u{1F3FE}", "In Bath: Medium-Dark Skin Tone");
    const inBathDarkSkinTone = new Emoji("\u{1F6C0}\u{1F3FF}", "In Bath: Dark Skin Tone");
    const inBed = new Emoji("\u{1F6CC}", "In Bed");
    const inBedLightSkinTone = new Emoji("\u{1F6CC}\u{1F3FB}", "In Bed: Light Skin Tone");
    const inBedMediumLightSkinTone = new Emoji("\u{1F6CC}\u{1F3FC}", "In Bed: Medium-Light Skin Tone");
    const inBedMediumSkinTone = new Emoji("\u{1F6CC}\u{1F3FD}", "In Bed: Medium Skin Tone");
    const inBedMediumDarkSkinTone = new Emoji("\u{1F6CC}\u{1F3FE}", "In Bed: Medium-Dark Skin Tone");
    const inBedDarkSkinTone = new Emoji("\u{1F6CC}\u{1F3FF}", "In Bed: Dark Skin Tone");
    const inSauna = new Emoji("\u{1F9D6}", "In Sauna");
    const inSaunaLightSkinTone = new Emoji("\u{1F9D6}\u{1F3FB}", "In Sauna: Light Skin Tone");
    const inSaunaMediumLightSkinTone = new Emoji("\u{1F9D6}\u{1F3FC}", "In Sauna: Medium-Light Skin Tone");
    const inSaunaMediumSkinTone = new Emoji("\u{1F9D6}\u{1F3FD}", "In Sauna: Medium Skin Tone");
    const inSaunaMediumDarkSkinTone = new Emoji("\u{1F9D6}\u{1F3FE}", "In Sauna: Medium-Dark Skin Tone");
    const inSaunaDarkSkinTone = new Emoji("\u{1F9D6}\u{1F3FF}", "In Sauna: Dark Skin Tone");
    const inSaunaMale = new Emoji("\u{1F9D6}\u200D\u2642\uFE0F", "In Sauna: Male");
    const inSaunaLightSkinToneMale = new Emoji("\u{1F9D6}\u{1F3FB}\u200D\u2642\uFE0F", "In Sauna: Light Skin Tone: Male");
    const inSaunaMediumLightSkinToneMale = new Emoji("\u{1F9D6}\u{1F3FC}\u200D\u2642\uFE0F", "In Sauna: Medium-Light Skin Tone: Male");
    const inSaunaMediumSkinToneMale = new Emoji("\u{1F9D6}\u{1F3FD}\u200D\u2642\uFE0F", "In Sauna: Medium Skin Tone: Male");
    const inSaunaMediumDarkSkinToneMale = new Emoji("\u{1F9D6}\u{1F3FE}\u200D\u2642\uFE0F", "In Sauna: Medium-Dark Skin Tone: Male");
    const inSaunaDarkSkinToneMale = new Emoji("\u{1F9D6}\u{1F3FF}\u200D\u2642\uFE0F", "In Sauna: Dark Skin Tone: Male");
    const inSaunaFemale = new Emoji("\u{1F9D6}\u200D\u2640\uFE0F", "In Sauna: Female");
    const inSaunaLightSkinToneFemale = new Emoji("\u{1F9D6}\u{1F3FB}\u200D\u2640\uFE0F", "In Sauna: Light Skin Tone: Female");
    const inSaunaMediumLightSkinToneFemale = new Emoji("\u{1F9D6}\u{1F3FC}\u200D\u2640\uFE0F", "In Sauna: Medium-Light Skin Tone: Female");
    const inSaunaMediumSkinToneFemale = new Emoji("\u{1F9D6}\u{1F3FD}\u200D\u2640\uFE0F", "In Sauna: Medium Skin Tone: Female");
    const inSaunaMediumDarkSkinToneFemale = new Emoji("\u{1F9D6}\u{1F3FE}\u200D\u2640\uFE0F", "In Sauna: Medium-Dark Skin Tone: Female");
    const inSaunaDarkSkinToneFemale = new Emoji("\u{1F9D6}\u{1F3FF}\u200D\u2640\uFE0F", "In Sauna: Dark Skin Tone: Female");
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
    const grinningSquintingFace = new Emoji("\u{1F606}", "Grinning Squinting Face");
    const smilingFaceWithHalo = new Emoji("\u{1F607}", "Smiling Face with Halo");
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
    const upsideDownFace = new Emoji("\u{1F643}", "Upside-Down Face");
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
    const faceVomiting = new Emoji("\u{1F92E}", "Face Vomiting");
    const explodingHead = new Emoji("\u{1F92F}", "Exploding Head");
    const smilingFaceWithHearts = new Emoji("\u{1F970}", "Smiling Face with Hearts");
    const yawningFace = new Emoji("\u{1F971}", "Yawning Face");
    const partyingFace = new Emoji("\u{1F973}", "Partying Face");
    const woozyFace = new Emoji("\u{1F974}", "Woozy Face");
    const hotFace = new Emoji("\u{1F975}", "Hot Face");
    const coldFace = new Emoji("\u{1F976}", "Cold Face");
    const pleadingFace = new Emoji("\u{1F97A}", "Pleading Face");
    const faceWithMonocle = new Emoji("\u{1F9D0}", "Face with Monocle");
    const skullAndCrossbones = new Emoji("\u2620\uFE0F", "Skull and Crossbones");
    const frowningFace = new Emoji("\u2639\uFE0F", "Frowning Face");
    const smilingFace = new Emoji("\u263A\uFE0F", "Smiling Face");
    const speakingHead = new Emoji("\u{1F5E3}\uFE0F", "Speaking Head");
    const bustInSilhouette = new Emoji("\u{1F464}", "Bust in Silhouette");
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
    const heartExclamation = new Emoji("\u2763\uFE0F", "Heart Exclamation");
    const redHeart = new Emoji("\u2764\uFE0F", "Red Heart");
    const angerSymbol = new Emoji("\u{1F4A2}", "Anger Symbol");
    const bomb = new Emoji("\u{1F4A3}", "Bomb");
    const zzz = new Emoji("\u{1F4A4}", "Zzz");
    const collision = new Emoji("\u{1F4A5}", "Collision");
    const sweatDroplets = new Emoji("\u{1F4A6}", "Sweat Droplets");
    const dashingAway = new Emoji("\u{1F4A8}", "Dashing Away");
    const dizzy = new Emoji("\u{1F4AB}", "Dizzy");
    const speechBalloon = new Emoji("\u{1F4AC}", "Speech Balloon");
    const thoughtBalloon = new Emoji("\u{1F4AD}", "Thought Balloon");
    const hundredPoints = new Emoji("\u{1F4AF}", "Hundred Points");
    const hole = new Emoji("\u{1F573}\uFE0F", "Hole");
    const leftSpeechBubble = new Emoji("\u{1F5E8}\uFE0F", "Left Speech Bubble");
    const rightSpeechBubble = new Emoji("\u{1F5E9}\uFE0F", "Right Speech Bubble");
    const conversationBubbles2 = new Emoji("\u{1F5EA}\uFE0F", "Conversation Bubbles 2");
    const conversationBubbles3 = new Emoji("\u{1F5EB}\uFE0F", "Conversation Bubbles 3");
    const leftThoughtBubble = new Emoji("\u{1F5EC}\uFE0F", "Left Thought Bubble");
    const rightThoughtBubble = new Emoji("\u{1F5ED}\uFE0F", "Right Thought Bubble");
    const leftAngerBubble = new Emoji("\u{1F5EE}\uFE0F", "Left Anger Bubble");
    const rightAngerBubble = new Emoji("\u{1F5EF}\uFE0F", "Right Anger Bubble");
    const angerBubble = new Emoji("\u{1F5F0}\uFE0F", "Anger Bubble");
    const angerBubbleLightning = new Emoji("\u{1F5F1}\uFE0F", "Anger Bubble Lightning");
    const lightningBolt = new Emoji("\u{1F5F2}\uFE0F", "Lightning Bolt");
    const backhandIndexPointingUp = new Emoji("\u{1F446}", "Backhand Index Pointing Up");
    const backhandIndexPointingDown = new Emoji("\u{1F447}", "Backhand Index Pointing Down");
    const backhandIndexPointingLeft = new Emoji("\u{1F448}", "Backhand Index Pointing Left");
    const backhandIndexPointingRight = new Emoji("\u{1F449}", "Backhand Index Pointing Right");
    const oncomingFist = new Emoji("\u{1F44A}", "Oncoming Fist");
    const wavingHand = new Emoji("\u{1F44B}", "Waving Hand");
    const oKHand = new Emoji("\u{1F58F}", "OK Hand");
    const thumbsUp = new Emoji("\u{1F44D}", "Thumbs Up");
    const thumbsDown = new Emoji("\u{1F44E}", "Thumbs Down");
    const clappingHands = new Emoji("\u{1F44F}", "Clapping Hands");
    const openHands = new Emoji("\u{1F450}", "Open Hands");
    const nailPolish = new Emoji("\u{1F485}", "Nail Polish");
    const handWithFingersSplayed = new Emoji("\u{1F590}\uFE0F", "Hand with Fingers Splayed");
    const handWithFingersSplayed2 = new Emoji("\u{1F591}\uFE0F", "Hand with Fingers Splayed 2");
    const thumbsUp2 = new Emoji("\u{1F592}", "Thumbs Up 2");
    const thumbsDown2 = new Emoji("\u{1F593}", "Thumbs Down 2");
    const peaceFingers = new Emoji("\u{1F594}", "Peace Fingers");
    const middleFinger = new Emoji("\u{1F595}", "Middle Finger");
    const vulcanSalute = new Emoji("\u{1F596}", "Vulcan Salute");
    const handPointingDown = new Emoji("\u{1F597}", "Hand Pointing Down");
    const handPointingLeft = new Emoji("\u{1F598}", "Hand Pointing Left");
    const handPointingRight = new Emoji("\u{1F599}", "Hand Pointing Right");
    const handPointingLeft2 = new Emoji("\u{1F59A}", "Hand Pointing Left 2");
    const handPointingRight2 = new Emoji("\u{1F59B}", "Hand Pointing Right 2");
    const indexPointingLeft = new Emoji("\u{1F59C}", "Index Pointing Left");
    const indexPointingRight = new Emoji("\u{1F59D}", "Index Pointing Right");
    const indexPointingUp = new Emoji("\u{1F59E}", "Index Pointing Up");
    const indexPointingDown = new Emoji("\u{1F59F}", "Index Pointing Down");
    const indexPointingUp2 = new Emoji("\u{1F5A0}", "Index Pointing Up 2");
    const indexPointingDown2 = new Emoji("\u{1F5A1}", "Index Pointing Down 2");
    const indexPointingUp3 = new Emoji("\u{1F5A2}", "Index Pointing Up 3");
    const indexPointingDown3 = new Emoji("\u{1F5A3}", "Index Pointing Down 3");
    const raisingHands = new Emoji("\u{1F64C}", "Raising Hands");
    const foldedHands = new Emoji("\u{1F64F}", "Folded Hands");
    const pinchedFingers = new Emoji("\u{1F90C}", "Pinched Fingers");
    const pinchingHand = new Emoji("\u{1F90F}", "Pinching Hand");
    const signOfTheHorns = new Emoji("\u{1F918}", "Sign of the Horns");
    const callMeHand = new Emoji("\u{1F919}", "Call Me Hand");
    const raisedBackOfHand = new Emoji("\u{1F91A}", "Raised Back of Hand");
    const leftFacingFist = new Emoji("\u{1F91B}", "Left-Facing Fist");
    const rightFacingFist = new Emoji("\u{1F91C}", "Right-Facing Fist");
    const handshake = new Emoji("\u{1F91D}", "Handshake");
    const crossedFingers = new Emoji("\u{1F91E}", "Crossed Fingers");
    const loveYouGesture = new Emoji("\u{1F91F}", "Love-You Gesture");
    const palmsUpTogether = new Emoji("\u{1F932}", "Palms Up Together");
    const indexPointingUp4 = new Emoji("\u261D\uFE0F", "Index Pointing Up 4");
    const raisedFist = new Emoji("\u270A", "Raised Fist");
    const raisedHand = new Emoji("\u270B", "Raised Hand");
    const victoryHand = new Emoji("\u270C\uFE0F", "Victory Hand");
    const writingHand = new Emoji("\u270D\uFE0F", "Writing Hand");
    const redCircle = new Emoji("\u{1F534}", "Red Circle");
    const blueCircle = new Emoji("\u{1F535}", "Blue Circle");
    const largeOrangeDiamond = new Emoji("\u{1F536}", "Large Orange Diamond");
    const largeBlueDiamond = new Emoji("\u{1F537}", "Large Blue Diamond");
    const smallOrangeDiamond = new Emoji("\u{1F538}", "Small Orange Diamond");
    const smallBlueDiamond = new Emoji("\u{1F539}", "Small Blue Diamond");
    const redTrianglePointedUp = new Emoji("\u{1F53A}", "Red Triangle Pointed Up");
    const redTrianglePointedDown = new Emoji("\u{1F53B}", "Red Triangle Pointed Down");
    const orangeCircle = new Emoji("\u{1F7E0}", "Orange Circle");
    const yellowCircle = new Emoji("\u{1F7E1}", "Yellow Circle");
    const greenCircle = new Emoji("\u{1F7E2}", "Green Circle");
    const purpleCircle = new Emoji("\u{1F7E3}", "Purple Circle");
    const brownCircle = new Emoji("\u{1F7E4}", "Brown Circle");
    const hollowRedCircle = new Emoji("\u2B55", "Hollow Red Circle");
    const whiteCircle = new Emoji("\u26AA", "White Circle");
    const blackCircle = new Emoji("\u26AB", "Black Circle");
    const redSquare = new Emoji("\u{1F7E5}", "Red Square");
    const blueSquare = new Emoji("\u{1F7E6}", "Blue Square");
    const orangeSquare = new Emoji("\u{1F7E7}", "Orange Square");
    const yellowSquare = new Emoji("\u{1F7E8}", "Yellow Square");
    const greenSquare = new Emoji("\u{1F7E9}", "Green Square");
    const purpleSquare = new Emoji("\u{1F7EA}", "Purple Square");
    const brownSquare = new Emoji("\u{1F7EB}", "Brown Square");
    const blackSquareButton = new Emoji("\u{1F532}", "Black Square Button");
    const whiteSquareButton = new Emoji("\u{1F533}", "White Square Button");
    const blackSmallSquare = new Emoji("\u25AA\uFE0F", "Black Small Square");
    const whiteSmallSquare = new Emoji("\u25AB\uFE0F", "White Small Square");
    const whiteMediumSmallSquare = new Emoji("\u25FD", "White Medium-Small Square");
    const blackMediumSmallSquare = new Emoji("\u25FE", "Black Medium-Small Square");
    const whiteMediumSquare = new Emoji("\u25FB\uFE0F", "White Medium Square");
    const blackMediumSquare = new Emoji("\u25FC\uFE0F", "Black Medium Square");
    const blackLargeSquare = new Emoji("\u2B1B", "Black Large Square");
    const whiteLargeSquare = new Emoji("\u2B1C", "White Large Square");
    const star = new Emoji("\u2B50", "Star");
    const diamondWithADot = new Emoji("\u{1F4A0}", "Diamond with a Dot");
    const eye = new Emoji("\u{1F441}\uFE0F", "Eye");
    const eyeInSpeechBubble = new Emoji("\u{1F441}\uFE0F\u200D\u{1F5E8}\uFE0F", "Eye in Speech Bubble");
    const eyes = new Emoji("\u{1F440}", "Eyes");
    const ear = new Emoji("\u{1F442}", "Ear");
    const nose = new Emoji("\u{1F443}", "Nose");
    const mouth = new Emoji("\u{1F444}", "Mouth");
    const tongue = new Emoji("\u{1F445}", "Tongue");
    const flexedBiceps = new Emoji("\u{1F4AA}", "Flexed Biceps");
    const selfie = new Emoji("\u{1F933}", "Selfie");
    const bone = new Emoji("\u{1F9B4}", "Bone");
    const leg = new Emoji("\u{1F9B5}", "Leg");
    const foot = new Emoji("\u{1F9B6}", "Foot");
    const tooth = new Emoji("\u{1F9B7}", "Tooth");
    const earWithHearingAid = new Emoji("\u{1F9BB}", "Ear with Hearing Aid");
    const mechanicalArm = new Emoji("\u{1F9BE}", "Mechanical Arm");
    const mechanicalLeg = new Emoji("\u{1F9BF}", "Mechanical Leg");
    const anatomicalHeart = new Emoji("\u{1FAC0}", "Anatomical Heart");
    const lungs = new Emoji("\u{1FAC1}", "Lungs");
    const brain = new Emoji("\u{1F9E0}", "Brain");
    const snowflake = new Emoji("\u2744\uFE0F", "Snowflake");
    const rainbow = new Emoji("\u{1F308}", "Rainbow");
    const sunriseOverMountains = new Emoji("\u{1F304}", "Sunrise Over Mountains");
    const sunrise = new Emoji("\u{1F305}", "Sunrise");
    const cityscapeAtDusk = new Emoji("\u{1F306}", "Cityscape at Dusk");
    const sunset = new Emoji("\u{1F307}", "Sunset");
    const nightWithStars = new Emoji("\u{1F303}", "Night with Stars");
    const closedUmbrella = new Emoji("\u{1F302}", "Closed Umbrella");
    const umbrella = new Emoji("\u2602\uFE0F", "Umbrella");
    const umbrellaWithRainDrops = new Emoji("\u2614\uFE0F", "Umbrella with Rain Drops");
    const snowman = new Emoji("\u2603\uFE0F", "Snowman");
    const snowmanWithoutSnow = new Emoji("\u26C4", "Snowman Without Snow");
    const sun = new Emoji("\u2600\uFE0F", "Sun");
    const cloud = new Emoji("\u2601\uFE0F", "Cloud");
    const sunBehindSmallCloud = new Emoji("\u{1F324}\uFE0F", "Sun Behind Small Cloud");
    const sunBehindCloud = new Emoji("\u26C5", "Sun Behind Cloud");
    const sunBehindLargeCloud = new Emoji("\u{1F325}\uFE0F", "Sun Behind Large Cloud");
    const sunBehindRainCloud = new Emoji("\u{1F326}\uFE0F", "Sun Behind Rain Cloud");
    const cloudWithRain = new Emoji("\u{1F327}\uFE0F", "Cloud with Rain");
    const cloudWithSnow = new Emoji("\u{1F328}\uFE0F", "Cloud with Snow");
    const cloudWithLightning = new Emoji("\u{1F329}\uFE0F", "Cloud with Lightning");
    const cloudWithLightningAndRain = new Emoji("\u26C8\uFE0F", "Cloud with Lightning and Rain");
    const cyclone = new Emoji("\u{1F300}", "Cyclone");
    const tornado = new Emoji("\u{1F32A}\uFE0F", "Tornado");
    const windFace = new Emoji("\u{1F32C}\uFE0F", "Wind Face");
    const waterWave = new Emoji("\u{1F30A}", "Water Wave");
    const fog = new Emoji("\u{1F32B}\uFE0F", "Fog");
    const foggy = new Emoji("\u{1F301}", "Foggy");
    const thermometer = new Emoji("\u{1F321}\uFE0F", "Thermometer");
    const cat = new Emoji("\u{1F408}", "Cat");
    const blackCat = new Emoji("\u{1F408}\u200D\u2B1B", "Black Cat");
    const dog = new Emoji("\u{1F415}", "Dog");
    const serviceDog = new Emoji("\u{1F415}\u200D\u{1F9BA}", "Service Dog");
    const bear = new Emoji("\u{1F43B}", "Bear");
    const polarBear = new Emoji("\u{1F43B}\u200D\u2744\uFE0F", "Polar Bear");
    const rat = new Emoji("\u{1F400}", "Rat");
    const mouse = new Emoji("\u{1F401}", "Mouse");
    const ox = new Emoji("\u{1F402}", "Ox");
    const waterBuffalo = new Emoji("\u{1F403}", "Water Buffalo");
    const cow = new Emoji("\u{1F404}", "Cow");
    const tiger = new Emoji("\u{1F405}", "Tiger");
    const leopard = new Emoji("\u{1F406}", "Leopard");
    const rabbit = new Emoji("\u{1F407}", "Rabbit");
    const dragon = new Emoji("\u{1F409}", "Dragon");
    const crocodile = new Emoji("\u{1F40A}", "Crocodile");
    const whale = new Emoji("\u{1F40B}", "Whale");
    const snail = new Emoji("\u{1F40C}", "Snail");
    const snake = new Emoji("\u{1F40D}", "Snake");
    const horse = new Emoji("\u{1F40E}", "Horse");
    const ram = new Emoji("\u{1F40F}", "Ram");
    const goat = new Emoji("\u{1F410}", "Goat");
    const ewe = new Emoji("\u{1F411}", "Ewe");
    const monkey = new Emoji("\u{1F412}", "Monkey");
    const rooster = new Emoji("\u{1F413}", "Rooster");
    const chicken = new Emoji("\u{1F414}", "Chicken");
    const pig = new Emoji("\u{1F416}", "Pig");
    const boar = new Emoji("\u{1F417}", "Boar");
    const elephant = new Emoji("\u{1F418}", "Elephant");
    const octopus = new Emoji("\u{1F419}", "Octopus");
    const spiralShell = new Emoji("\u{1F41A}", "Spiral Shell");
    const bug = new Emoji("\u{1F41B}", "Bug");
    const ant = new Emoji("\u{1F41C}", "Ant");
    const honeybee = new Emoji("\u{1F41D}", "Honeybee");
    const ladyBeetle = new Emoji("\u{1F41E}", "Lady Beetle");
    const fish = new Emoji("\u{1F41F}", "Fish");
    const tropicalFish = new Emoji("\u{1F420}", "Tropical Fish");
    const blowfish = new Emoji("\u{1F421}", "Blowfish");
    const turtle = new Emoji("\u{1F422}", "Turtle");
    const hatchingChick = new Emoji("\u{1F423}", "Hatching Chick");
    const babyChick = new Emoji("\u{1F424}", "Baby Chick");
    const frontFacingBabyChick = new Emoji("\u{1F425}", "Front-Facing Baby Chick");
    const bird = new Emoji("\u{1F426}", "Bird");
    const penguin = new Emoji("\u{1F427}", "Penguin");
    const koala = new Emoji("\u{1F428}", "Koala");
    const poodle = new Emoji("\u{1F429}", "Poodle");
    const camel = new Emoji("\u{1F42A}", "Camel");
    const twoHumpCamel = new Emoji("\u{1F42B}", "Two-Hump Camel");
    const dolphin = new Emoji("\u{1F42C}", "Dolphin");
    const mouseFace = new Emoji("\u{1F42D}", "Mouse Face");
    const cowFace = new Emoji("\u{1F42E}", "Cow Face");
    const tigerFace = new Emoji("\u{1F42F}", "Tiger Face");
    const rabbitFace = new Emoji("\u{1F430}", "Rabbit Face");
    const catFace = new Emoji("\u{1F431}", "Cat Face");
    const dragonFace = new Emoji("\u{1F432}", "Dragon Face");
    const spoutingWhale = new Emoji("\u{1F433}", "Spouting Whale");
    const horseFace = new Emoji("\u{1F434}", "Horse Face");
    const monkeyFace = new Emoji("\u{1F435}", "Monkey Face");
    const dogFace = new Emoji("\u{1F436}", "Dog Face");
    const pigFace = new Emoji("\u{1F437}", "Pig Face");
    const frog = new Emoji("\u{1F438}", "Frog");
    const hamster = new Emoji("\u{1F439}", "Hamster");
    const wolf = new Emoji("\u{1F43A}", "Wolf");
    const panda = new Emoji("\u{1F43C}", "Panda");
    const pigNose = new Emoji("\u{1F43D}", "Pig Nose");
    const pawPrints = new Emoji("\u{1F43E}", "Paw Prints");
    const chipmunk = new Emoji("\u{1F43F}\uFE0F", "Chipmunk");
    const dove = new Emoji("\u{1F54A}\uFE0F", "Dove");
    const spider = new Emoji("\u{1F577}\uFE0F", "Spider");
    const spiderWeb = new Emoji("\u{1F578}\uFE0F", "Spider Web");
    const lion = new Emoji("\u{1F981}", "Lion");
    const scorpion = new Emoji("\u{1F982}", "Scorpion");
    const turkey = new Emoji("\u{1F983}", "Turkey");
    const unicorn = new Emoji("\u{1F984}", "Unicorn");
    const eagle = new Emoji("\u{1F985}", "Eagle");
    const duck = new Emoji("\u{1F986}", "Duck");
    const bat = new Emoji("\u{1F987}", "Bat");
    const shark = new Emoji("\u{1F988}", "Shark");
    const owl = new Emoji("\u{1F989}", "Owl");
    const fox = new Emoji("\u{1F98A}", "Fox");
    const butterfly = new Emoji("\u{1F98B}", "Butterfly");
    const deer = new Emoji("\u{1F98C}", "Deer");
    const gorilla = new Emoji("\u{1F98D}", "Gorilla");
    const lizard = new Emoji("\u{1F98E}", "Lizard");
    const rhinoceros = new Emoji("\u{1F98F}", "Rhinoceros");
    const giraffe = new Emoji("\u{1F992}", "Giraffe");
    const zebra = new Emoji("\u{1F993}", "Zebra");
    const hedgehog = new Emoji("\u{1F994}", "Hedgehog");
    const sauropod = new Emoji("\u{1F995}", "Sauropod");
    const tRex = new Emoji("\u{1F996}", "T-Rex");
    const cricket = new Emoji("\u{1F997}", "Cricket");
    const kangaroo = new Emoji("\u{1F998}", "Kangaroo");
    const llama = new Emoji("\u{1F999}", "Llama");
    const peacock = new Emoji("\u{1F99A}", "Peacock");
    const hippopotamus = new Emoji("\u{1F99B}", "Hippopotamus");
    const parrot = new Emoji("\u{1F99C}", "Parrot");
    const raccoon = new Emoji("\u{1F99D}", "Raccoon");
    const mosquito = new Emoji("\u{1F99F}", "Mosquito");
    const microbe = new Emoji("\u{1F9A0}", "Microbe");
    const badger = new Emoji("\u{1F9A1}", "Badger");
    const swan = new Emoji("\u{1F9A2}", "Swan");
    const sloth = new Emoji("\u{1F9A5}", "Sloth");
    const otter = new Emoji("\u{1F9A6}", "Otter");
    const orangutan = new Emoji("\u{1F9A7}", "Orangutan");
    const skunk = new Emoji("\u{1F9A8}", "Skunk");
    const flamingo = new Emoji("\u{1F9A9}", "Flamingo");
    const guideDog = new Emoji("\u{1F9AE}", "Guide Dog");
    const whiteFlower = new Emoji("\u{1F4AE}", "White Flower");
    const seedling = new Emoji("\u{1F331}", "Seedling");
    const evergreenTree = new Emoji("\u{1F332}", "Evergreen Tree");
    const deciduousTree = new Emoji("\u{1F333}", "Deciduous Tree");
    const palmTree = new Emoji("\u{1F334}", "Palm Tree");
    const cactus = new Emoji("\u{1F335}", "Cactus");
    const tulip = new Emoji("\u{1F337}", "Tulip");
    const cherryBlossom = new Emoji("\u{1F338}", "Cherry Blossom");
    const rose = new Emoji("\u{1F339}", "Rose");
    const hibiscus = new Emoji("\u{1F33A}", "Hibiscus");
    const sunflower = new Emoji("\u{1F33B}", "Sunflower");
    const blossom = new Emoji("\u{1F33C}", "Blossom");
    const herb = new Emoji("\u{1F33F}", "Herb");
    const fourLeafClover = new Emoji("\u{1F340}", "Four Leaf Clover");
    const mapleLeaf = new Emoji("\u{1F341}", "Maple Leaf");
    const fallenLeaf = new Emoji("\u{1F342}", "Fallen Leaf");
    const leafFlutteringInWind = new Emoji("\u{1F343}", "Leaf Fluttering in Wind");
    const rosette = new Emoji("\u{1F3F5}\uFE0F", "Rosette");
    const bouquet = new Emoji("\u{1F490}", "Bouquet");
    const wiltedFlower = new Emoji("\u{1F940}", "Wilted Flower");
    const shamrock = new Emoji("\u2618\uFE0F", "Shamrock");
    const banana = new Emoji("\u{1F34C}", "Banana");
    const hotDog = new Emoji("\u{1F32D}", "Hot Dog");
    const taco = new Emoji("\u{1F32E}", "Taco");
    const burrito = new Emoji("\u{1F32F}", "Burrito");
    const chestnut = new Emoji("\u{1F330}", "Chestnut");
    const hotPepper = new Emoji("\u{1F336}\uFE0F", "Hot Pepper");
    const earOfCorn = new Emoji("\u{1F33D}", "Ear of Corn");
    const mushroom = new Emoji("\u{1F344}", "Mushroom");
    const tomato = new Emoji("\u{1F345}", "Tomato");
    const eggplant = new Emoji("\u{1F346}", "Eggplant");
    const grapes = new Emoji("\u{1F347}", "Grapes");
    const melon = new Emoji("\u{1F348}", "Melon");
    const watermelon = new Emoji("\u{1F349}", "Watermelon");
    const tangerine = new Emoji("\u{1F34A}", "Tangerine");
    const lemon = new Emoji("\u{1F34B}", "Lemon");
    const pineapple = new Emoji("\u{1F34D}", "Pineapple");
    const redApple = new Emoji("\u{1F34E}", "Red Apple");
    const greenApple = new Emoji("\u{1F34F}", "Green Apple");
    const pear = new Emoji("\u{1F350}", "Pear");
    const peach = new Emoji("\u{1F351}", "Peach");
    const cherries = new Emoji("\u{1F352}", "Cherries");
    const strawberry = new Emoji("\u{1F353}", "Strawberry");
    const hamburger = new Emoji("\u{1F354}", "Hamburger");
    const pizza = new Emoji("\u{1F355}", "Pizza");
    const meatOnBone = new Emoji("\u{1F356}", "Meat on Bone");
    const poultryLeg = new Emoji("\u{1F357}", "Poultry Leg");
    const riceCracker = new Emoji("\u{1F358}", "Rice Cracker");
    const riceBall = new Emoji("\u{1F359}", "Rice Ball");
    const cookedRice = new Emoji("\u{1F35A}", "Cooked Rice");
    const curryRice = new Emoji("\u{1F35B}", "Curry Rice");
    const steamingBowl = new Emoji("\u{1F35C}", "Steaming Bowl");
    const spaghetti = new Emoji("\u{1F35D}", "Spaghetti");
    const bread = new Emoji("\u{1F35E}", "Bread");
    const frenchFries = new Emoji("\u{1F35F}", "French Fries");
    const roastedSweetPotato = new Emoji("\u{1F360}", "Roasted Sweet Potato");
    const dango = new Emoji("\u{1F361}", "Dango");
    const oden = new Emoji("\u{1F362}", "Oden");
    const sushi = new Emoji("\u{1F363}", "Sushi");
    const friedShrimp = new Emoji("\u{1F364}", "Fried Shrimp");
    const fishCakeWithSwirl = new Emoji("\u{1F365}", "Fish Cake with Swirl");
    const bentoBox = new Emoji("\u{1F371}", "Bento Box");
    const potOfFood = new Emoji("\u{1F372}", "Pot of Food");
    const popcorn = new Emoji("\u{1F37F}", "Popcorn");
    const croissant = new Emoji("\u{1F950}", "Croissant");
    const avocado = new Emoji("\u{1F951}", "Avocado");
    const cucumber = new Emoji("\u{1F952}", "Cucumber");
    const bacon = new Emoji("\u{1F953}", "Bacon");
    const potato = new Emoji("\u{1F954}", "Potato");
    const carrot = new Emoji("\u{1F955}", "Carrot");
    const baguetteBread = new Emoji("\u{1F956}", "Baguette Bread");
    const greenSalad = new Emoji("\u{1F957}", "Green Salad");
    const shallowPanOfFood = new Emoji("\u{1F958}", "Shallow Pan of Food");
    const stuffedFlatbread = new Emoji("\u{1F959}", "Stuffed Flatbread");
    const egg = new Emoji("\u{1F95A}", "Egg");
    const peanuts = new Emoji("\u{1F95C}", "Peanuts");
    const kiwiFruit = new Emoji("\u{1F95D}", "Kiwi Fruit");
    const pancakes = new Emoji("\u{1F95E}", "Pancakes");
    const dumpling = new Emoji("\u{1F95F}", "Dumpling");
    const fortuneCookie = new Emoji("\u{1F960}", "Fortune Cookie");
    const takeoutBox = new Emoji("\u{1F961}", "Takeout Box");
    const bowlWithSpoon = new Emoji("\u{1F963}", "Bowl with Spoon");
    const coconut = new Emoji("\u{1F965}", "Coconut");
    const broccoli = new Emoji("\u{1F966}", "Broccoli");
    const pretzel = new Emoji("\u{1F968}", "Pretzel");
    const cutOfMeat = new Emoji("\u{1F969}", "Cut of Meat");
    const sandwich = new Emoji("\u{1F96A}", "Sandwich");
    const cannedFood = new Emoji("\u{1F96B}", "Canned Food");
    const leafyGreen = new Emoji("\u{1F96C}", "Leafy Green");
    const mango = new Emoji("\u{1F96D}", "Mango");
    const moonCake = new Emoji("\u{1F96E}", "Moon Cake");
    const bagel = new Emoji("\u{1F96F}", "Bagel");
    const crab = new Emoji("\u{1F980}", "Crab");
    const shrimp = new Emoji("\u{1F990}", "Shrimp");
    const squid = new Emoji("\u{1F991}", "Squid");
    const lobster = new Emoji("\u{1F99E}", "Lobster");
    const oyster = new Emoji("\u{1F9AA}", "Oyster");
    const cheeseWedge = new Emoji("\u{1F9C0}", "Cheese Wedge");
    const salt = new Emoji("\u{1F9C2}", "Salt");
    const garlic = new Emoji("\u{1F9C4}", "Garlic");
    const onion = new Emoji("\u{1F9C5}", "Onion");
    const falafel = new Emoji("\u{1F9C6}", "Falafel");
    const waffle = new Emoji("\u{1F9C7}", "Waffle");
    const butter = new Emoji("\u{1F9C8}", "Butter");
    const softIceCream = new Emoji("\u{1F366}", "Soft Ice Cream");
    const shavedIce = new Emoji("\u{1F367}", "Shaved Ice");
    const iceCream = new Emoji("\u{1F368}", "Ice Cream");
    const doughnut = new Emoji("\u{1F369}", "Doughnut");
    const cookie = new Emoji("\u{1F36A}", "Cookie");
    const chocolateBar = new Emoji("\u{1F36B}", "Chocolate Bar");
    const candy = new Emoji("\u{1F36C}", "Candy");
    const lollipop = new Emoji("\u{1F36D}", "Lollipop");
    const custard = new Emoji("\u{1F36E}", "Custard");
    const honeyPot = new Emoji("\u{1F36F}", "Honey Pot");
    const shortcake = new Emoji("\u{1F370}", "Shortcake");
    const birthdayCake = new Emoji("\u{1F382}", "Birthday Cake");
    const pie = new Emoji("\u{1F967}", "Pie");
    const cupcake = new Emoji("\u{1F9C1}", "Cupcake");
    const teacupWithoutHandle = new Emoji("\u{1F375}", "Teacup Without Handle");
    const sake = new Emoji("\u{1F376}", "Sake");
    const wineGlass = new Emoji("\u{1F377}", "Wine Glass");
    const cocktailGlass = new Emoji("\u{1F378}", "Cocktail Glass");
    const tropicalDrink = new Emoji("\u{1F379}", "Tropical Drink");
    const beerMug = new Emoji("\u{1F37A}", "Beer Mug");
    const clinkingBeerMugs = new Emoji("\u{1F37B}", "Clinking Beer Mugs");
    const babyBottle = new Emoji("\u{1F37C}", "Baby Bottle");
    const bottleWithPoppingCork = new Emoji("\u{1F37E}", "Bottle with Popping Cork");
    const clinkingGlasses = new Emoji("\u{1F942}", "Clinking Glasses");
    const tumblerGlass = new Emoji("\u{1F943}", "Tumbler Glass");
    const glassOfMilk = new Emoji("\u{1F95B}", "Glass of Milk");
    const cupWithStraw = new Emoji("\u{1F964}", "Cup with Straw");
    const beverageBox = new Emoji("\u{1F9C3}", "Beverage Box");
    const mate = new Emoji("\u{1F9C9}", "Mate");
    const ice = new Emoji("\u{1F9CA}", "Ice");
    const hotBeverage = new Emoji("\u2615", "Hot Beverage");
    const forkAndKnife = new Emoji("\u{1F374}", "Fork and Knife");
    const forkAndKnifeWithPlate = new Emoji("\u{1F37D}\uFE0F", "Fork and Knife with Plate");
    const amphora = new Emoji("\u{1F3FA}", "Amphora");
    const kitchenKnife = new Emoji("\u{1F52A}", "Kitchen Knife");
    const spoon = new Emoji("\u{1F944}", "Spoon");
    const chopsticks = new Emoji("\u{1F962}", "Chopsticks");
    const whiteFlag = new Emoji("\u{1F3F3}\uFE0F", "White Flag");
    const rainbowFlag = new Emoji("\u{1F3F3}\uFE0F\u200D\u{1F308}", "Rainbow Flag");
    const transgenderFlag = new Emoji("\u{1F3F3}\uFE0F\u200D\u26A7\uFE0F", "Transgender Flag");
    const blackFlag = new Emoji("\u{1F3F4}", "Black Flag");
    const pirateFlag = new Emoji("\u{1F3F4}\u200D\u2620\uFE0F", "Pirate Flag");
    const crossedFlags = new Emoji("\u{1F38C}", "Crossed Flags");
    const chequeredFlag = new Emoji("\u{1F3C1}", "Chequered Flag");
    const flagEngland = new Emoji("\u{1F3F4}\u{E0067}\u{E0062}\u{E0065}\u{E006E}\u{E0067}\u{E007F}", "Flag: England");
    const flagScotland = new Emoji("\u{1F3F4}\u{E0067}\u{E0062}\u{E0073}\u{E0063}\u{E0074}\u{E007F}", "Flag: Scotland");
    const flagWales = new Emoji("\u{1F3F4}\u{E0067}\u{E0062}\u{E0077}\u{E006C}\u{E0073}\u{E007F}", "Flag: Wales");
    const triangularFlag = new Emoji("\u{1F6A9}", "Triangular Flag");
    const motorcycle = new Emoji("\u{1F3CD}\uFE0F", "Motorcycle");
    const racingCar = new Emoji("\u{1F3CE}\uFE0F", "Racing Car");
    const seat = new Emoji("\u{1F4BA}", "Seat");
    const helicopter = new Emoji("\u{1F681}", "Helicopter");
    const locomotive = new Emoji("\u{1F682}", "Locomotive");
    const railwayCar = new Emoji("\u{1F683}", "Railway Car");
    const highSpeedTrain = new Emoji("\u{1F684}", "High-Speed Train");
    const bulletTrain = new Emoji("\u{1F685}", "Bullet Train");
    const train = new Emoji("\u{1F686}", "Train");
    const metro = new Emoji("\u{1F687}", "Metro");
    const lightRail = new Emoji("\u{1F688}", "Light Rail");
    const station = new Emoji("\u{1F689}", "Station");
    const tram = new Emoji("\u{1F68A}", "Tram");
    const tramCar = new Emoji("\u{1F68B}", "Tram Car");
    const bus = new Emoji("\u{1F68C}", "Bus");
    const oncomingBus = new Emoji("\u{1F68D}", "Oncoming Bus");
    const trolleybus = new Emoji("\u{1F68E}", "Trolleybus");
    const busStop = new Emoji("\u{1F68F}", "Bus Stop");
    const minibus = new Emoji("\u{1F690}", "Minibus");
    const ambulance = new Emoji("\u{1F691}", "Ambulance");
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
    const speedboat = new Emoji("\u{1F6A4}", "Speedboat");
    const horizontalTrafficLight = new Emoji("\u{1F6A5}", "Horizontal Traffic Light");
    const verticalTrafficLight = new Emoji("\u{1F6A6}", "Vertical Traffic Light");
    const construction = new Emoji("\u{1F6A7}", "Construction");
    const bicycle = new Emoji("\u{1F6B2}", "Bicycle");
    const stopSign = new Emoji("\u{1F6D1}", "Stop Sign");
    const oilDrum = new Emoji("\u{1F6E2}\uFE0F", "Oil Drum");
    const motorway = new Emoji("\u{1F6E3}\uFE0F", "Motorway");
    const railwayTrack = new Emoji("\u{1F6E4}\uFE0F", "Railway Track");
    const motorBoat = new Emoji("\u{1F6E5}\uFE0F", "Motor Boat");
    const smallAirplane = new Emoji("\u{1F6E9}\uFE0F", "Small Airplane");
    const airplaneDeparture = new Emoji("\u{1F6EB}", "Airplane Departure");
    const airplaneArrival = new Emoji("\u{1F6EC}", "Airplane Arrival");
    const satellite = new Emoji("\u{1F6F0}\uFE0F", "Satellite");
    const passengerShip = new Emoji("\u{1F6F3}\uFE0F", "Passenger Ship");
    const kickScooter = new Emoji("\u{1F6F4}", "Kick Scooter");
    const motorScooter = new Emoji("\u{1F6F5}", "Motor Scooter");
    const canoe = new Emoji("\u{1F6F6}", "Canoe");
    const flyingSaucer = new Emoji("\u{1F6F8}", "Flying Saucer");
    const skateboard = new Emoji("\u{1F6F9}", "Skateboard");
    const autoRickshaw = new Emoji("\u{1F6FA}", "Auto Rickshaw");
    const parachute = new Emoji("\u{1FA82}", "Parachute");
    const anchor = new Emoji("\u2693", "Anchor");
    const ferry = new Emoji("\u26F4\uFE0F", "Ferry");
    const sailboat = new Emoji("\u26F5", "Sailboat");
    const fuelPump = new Emoji("\u26FD", "Fuel Pump");
    const oneOClock = new Emoji("\u{1F550}", "One O’Clock");
    const twoOClock = new Emoji("\u{1F551}", "Two O’Clock");
    const threeOClock = new Emoji("\u{1F552}", "Three O’Clock");
    const fourOClock = new Emoji("\u{1F553}", "Four O’Clock");
    const fiveOClock = new Emoji("\u{1F554}", "Five O’Clock");
    const sixOClock = new Emoji("\u{1F555}", "Six O’Clock");
    const sevenOClock = new Emoji("\u{1F556}", "Seven O’Clock");
    const eightOClock = new Emoji("\u{1F557}", "Eight O’Clock");
    const nineOClock = new Emoji("\u{1F558}", "Nine O’Clock");
    const tenOClock = new Emoji("\u{1F559}", "Ten O’Clock");
    const elevenOClock = new Emoji("\u{1F55A}", "Eleven O’Clock");
    const twelveOClock = new Emoji("\u{1F55B}", "Twelve O’Clock");
    const oneThirty = new Emoji("\u{1F55C}", "One-Thirty");
    const twoThirty = new Emoji("\u{1F55D}", "Two-Thirty");
    const threeThirty = new Emoji("\u{1F55E}", "Three-Thirty");
    const fourThirty = new Emoji("\u{1F55F}", "Four-Thirty");
    const fiveThirty = new Emoji("\u{1F560}", "Five-Thirty");
    const sixThirty = new Emoji("\u{1F561}", "Six-Thirty");
    const sevenThirty = new Emoji("\u{1F562}", "Seven-Thirty");
    const eightThirty = new Emoji("\u{1F563}", "Eight-Thirty");
    const nineThirty = new Emoji("\u{1F564}", "Nine-Thirty");
    const tenThirty = new Emoji("\u{1F565}", "Ten-Thirty");
    const elevenThirty = new Emoji("\u{1F566}", "Eleven-Thirty");
    const twelveThirty = new Emoji("\u{1F567}", "Twelve-Thirty");
    const mantelpieceClock = new Emoji("\u{1F570}\uFE0F", "Mantelpiece Clock");
    const watch = new Emoji("\u231A", "Watch");
    const alarmClock = new Emoji("\u23F0", "Alarm Clock");
    const stopwatch = new Emoji("\u23F1\uFE0F", "Stopwatch");
    const timerClock = new Emoji("\u23F2\uFE0F", "Timer Clock");
    const hourglassDone = new Emoji("\u231B", "Hourglass Done");
    const hourglassNotDone = new Emoji("\u23F3", "Hourglass Not Done");
    const clockwiseVerticalArrows = new Emoji("\u{1F503}\uFE0F", "Clockwise Vertical Arrows");
    const counterclockwiseArrowsButton = new Emoji("\u{1F504}\uFE0F", "Counterclockwise Arrows Button");
    const leftRightArrow = new Emoji("\u2194\uFE0F", "Left-Right Arrow");
    const upDownArrow = new Emoji("\u2195\uFE0F", "Up-Down Arrow");
    const upLeftArrow = new Emoji("\u2196\uFE0F", "Up-Left Arrow");
    const upRightArrow = new Emoji("\u2197\uFE0F", "Up-Right Arrow");
    const downRightArrow = new Emoji("\u2198\uFE0F", "Down-Right Arrow");
    const downLeftArrow = new Emoji("\u2199\uFE0F", "Down-Left Arrow");
    const rightArrowCurvingLeft = new Emoji("\u21A9\uFE0F", "Right Arrow Curving Left");
    const leftArrowCurvingRight = new Emoji("\u21AA\uFE0F", "Left Arrow Curving Right");
    const rightArrow = new Emoji("\u27A1\uFE0F", "Right Arrow");
    const rightArrowCurvingUp = new Emoji("\u2934\uFE0F", "Right Arrow Curving Up");
    const rightArrowCurvingDown = new Emoji("\u2935\uFE0F", "Right Arrow Curving Down");
    const leftArrow = new Emoji("\u2B05\uFE0F", "Left Arrow");
    const upArrow = new Emoji("\u2B06\uFE0F", "Up Arrow");
    const downArrow = new Emoji("\u2B07\uFE0F", "Down Arrow");
    const cLButton = new Emoji("\u{1F191}", "CL Button");
    const coolButton = new Emoji("\u{1F192}", "Cool Button");
    const freeButton = new Emoji("\u{1F193}", "Free Button");
    const iDButton = new Emoji("\u{1F194}", "ID Button");
    const newButton = new Emoji("\u{1F195}", "New Button");
    const nGButton = new Emoji("\u{1F196}", "NG Button");
    const oKButton = new Emoji("\u{1F197}", "OK Button");
    const sOSButton = new Emoji("\u{1F198}", "SOS Button");
    const upButton = new Emoji("\u{1F199}", "Up! Button");
    const vsButton = new Emoji("\u{1F19A}", "Vs Button");
    const radioButton = new Emoji("\u{1F518}", "Radio Button");
    const backArrow = new Emoji("\u{1F519}", "Back Arrow");
    const endArrow = new Emoji("\u{1F51A}", "End Arrow");
    const onArrow = new Emoji("\u{1F51B}", "On! Arrow");
    const soonArrow = new Emoji("\u{1F51C}", "Soon Arrow");
    const topArrow = new Emoji("\u{1F51D}", "Top Arrow");
    const checkBoxWithCheck = new Emoji("\u2611\uFE0F", "Check Box with Check");
    const inputLatinUppercase = new Emoji("\u{1F520}", "Input Latin Uppercase");
    const inputLatinLowercase = new Emoji("\u{1F521}", "Input Latin Lowercase");
    const inputNumbers = new Emoji("\u{1F522}", "Input Numbers");
    const inputSymbols = new Emoji("\u{1F523}", "Input Symbols");
    const inputLatinLetters = new Emoji("\u{1F524}", "Input Latin Letters");
    const shuffleTracksButton = new Emoji("\u{1F500}", "Shuffle Tracks Button");
    const repeatButton = new Emoji("\u{1F501}", "Repeat Button");
    const repeatSingleButton = new Emoji("\u{1F502}", "Repeat Single Button");
    const upwardsButton = new Emoji("\u{1F53C}", "Upwards Button");
    const downwardsButton = new Emoji("\u{1F53D}", "Downwards Button");
    const playButton = new Emoji("\u25B6\uFE0F", "Play Button");
    const reverseButton = new Emoji("\u25C0\uFE0F", "Reverse Button");
    const ejectButton = new Emoji("\u23CF\uFE0F", "Eject Button");
    const fastForwardButton = new Emoji("\u23E9", "Fast-Forward Button");
    const fastReverseButton = new Emoji("\u23EA", "Fast Reverse Button");
    const fastUpButton = new Emoji("\u23EB", "Fast Up Button");
    const fastDownButton = new Emoji("\u23EC", "Fast Down Button");
    const nextTrackButton = new Emoji("\u23ED\uFE0F", "Next Track Button");
    const lastTrackButton = new Emoji("\u23EE\uFE0F", "Last Track Button");
    const playOrPauseButton = new Emoji("\u23EF\uFE0F", "Play or Pause Button");
    const pauseButton = new Emoji("\u23F8\uFE0F", "Pause Button");
    const stopButton = new Emoji("\u23F9\uFE0F", "Stop Button");
    const recordButton = new Emoji("\u23FA\uFE0F", "Record Button");
    const aries = new Emoji("\u2648", "Aries");
    const taurus = new Emoji("\u2649", "Taurus");
    const gemini = new Emoji("\u264A", "Gemini");
    const cancer = new Emoji("\u264B", "Cancer");
    const leo = new Emoji("\u264C", "Leo");
    const virgo = new Emoji("\u264D", "Virgo");
    const libra = new Emoji("\u264E", "Libra");
    const scorpio = new Emoji("\u264F", "Scorpio");
    const sagittarius = new Emoji("\u2650", "Sagittarius");
    const capricorn = new Emoji("\u2651", "Capricorn");
    const aquarius = new Emoji("\u2652", "Aquarius");
    const pisces = new Emoji("\u2653", "Pisces");
    const ophiuchus = new Emoji("\u26CE", "Ophiuchus");
    const digitZero = new Emoji("\u0030\uFE0F", "Digit Zero");
    const digitOne = new Emoji("\u0031\uFE0F", "Digit One");
    const digitTwo = new Emoji("\u0032\uFE0F", "Digit Two");
    const digitThree = new Emoji("\u0033\uFE0F", "Digit Three");
    const digitFour = new Emoji("\u0034\uFE0F", "Digit Four");
    const digitFive = new Emoji("\u0035\uFE0F", "Digit Five");
    const digitSix = new Emoji("\u0036\uFE0F", "Digit Six");
    const digitSeven = new Emoji("\u0037\uFE0F", "Digit Seven");
    const digitEight = new Emoji("\u0038\uFE0F", "Digit Eight");
    const digitNine = new Emoji("\u0039\uFE0F", "Digit Nine");
    const asterisk = new Emoji("\u002A\uFE0F", "Asterisk");
    const numberSign = new Emoji("\u0023\uFE0F", "Number Sign");
    const keycapDigitZero = new Emoji("\u0030\uFE0F\u20E3", "Keycap Digit Zero");
    const keycapDigitOne = new Emoji("\u0031\uFE0F\u20E3", "Keycap Digit One");
    const keycapDigitTwo = new Emoji("\u0032\uFE0F\u20E3", "Keycap Digit Two");
    const keycapDigitThree = new Emoji("\u0033\uFE0F\u20E3", "Keycap Digit Three");
    const keycapDigitFour = new Emoji("\u0034\uFE0F\u20E3", "Keycap Digit Four");
    const keycapDigitFive = new Emoji("\u0035\uFE0F\u20E3", "Keycap Digit Five");
    const keycapDigitSix = new Emoji("\u0036\uFE0F\u20E3", "Keycap Digit Six");
    const keycapDigitSeven = new Emoji("\u0037\uFE0F\u20E3", "Keycap Digit Seven");
    const keycapDigitEight = new Emoji("\u0038\uFE0F\u20E3", "Keycap Digit Eight");
    const keycapDigitNine = new Emoji("\u0039\uFE0F\u20E3", "Keycap Digit Nine");
    const keycapAsterisk = new Emoji("\u002A\uFE0F\u20E3", "Keycap Asterisk");
    const keycapNumberSign = new Emoji("\u0023\uFE0F\u20E3", "Keycap Number Sign");
    const keycap10 = new Emoji("\u{1F51F}", "Keycap: 10");
    const multiply = new Emoji("\u2716\uFE0F", "Multiply");
    const plus = new Emoji("\u2795", "Plus");
    const minus = new Emoji("\u2796", "Minus");
    const divide = new Emoji("\u2797", "Divide");
    const spadeSuit = new Emoji("\u2660\uFE0F", "Spade Suit");
    const clubSuit = new Emoji("\u2663\uFE0F", "Club Suit");
    const heartSuit = new Emoji("\u2665\uFE0F", "Heart Suit");
    const diamondSuit = new Emoji("\u2666\uFE0F", "Diamond Suit");
    const mahjongRedDragon = new Emoji("\u{1F004}", "Mahjong Red Dragon");
    const joker = new Emoji("\u{1F0CF}", "Joker");
    const directHit = new Emoji("\u{1F3AF}", "Direct Hit");
    const slotMachine = new Emoji("\u{1F3B0}", "Slot Machine");
    const pool8Ball = new Emoji("\u{1F3B1}", "Pool 8 Ball");
    const gameDie = new Emoji("\u{1F3B2}", "Game Die");
    const bowling = new Emoji("\u{1F3B3}", "Bowling");
    const flowerPlayingCards = new Emoji("\u{1F3B4}", "Flower Playing Cards");
    const puzzlePiece = new Emoji("\u{1F9E9}", "Puzzle Piece");
    const chessPawn = new Emoji("\u265F\uFE0F", "Chess Pawn");
    const yoYo = new Emoji("\u{1FA80}", "Yo-Yo");
    const kite = new Emoji("\u{1FA81}", "Kite");
    const runningShirt = new Emoji("\u{1F3BD}", "Running Shirt");
    const tennis = new Emoji("\u{1F3BE}", "Tennis");
    const skis = new Emoji("\u{1F3BF}", "Skis");
    const basketball = new Emoji("\u{1F3C0}", "Basketball");
    const sportsMedal = new Emoji("\u{1F3C5}", "Sports Medal");
    const trophy = new Emoji("\u{1F3C6}", "Trophy");
    const americanFootball = new Emoji("\u{1F3C8}", "American Football");
    const rugbyFootball = new Emoji("\u{1F3C9}", "Rugby Football");
    const cricketGame = new Emoji("\u{1F3CF}", "Cricket Game");
    const volleyball = new Emoji("\u{1F3D0}", "Volleyball");
    const fieldHockey = new Emoji("\u{1F3D1}", "Field Hockey");
    const iceHockey = new Emoji("\u{1F3D2}", "Ice Hockey");
    const pingPong = new Emoji("\u{1F3D3}", "Ping Pong");
    const badminton = new Emoji("\u{1F3F8}", "Badminton");
    const sled = new Emoji("\u{1F6F7}", "Sled");
    const goalNet = new Emoji("\u{1F945}", "Goal Net");
    const medal1stPlace = new Emoji("\u{1F947}", "Medal: 1st Place");
    const medal2ndPlace = new Emoji("\u{1F948}", "Medal: 2nd Place");
    const medal3rdPlace = new Emoji("\u{1F949}", "Medal: 3rd Place");
    const boxingGlove = new Emoji("\u{1F94A}", "Boxing Glove");
    const curlingStone = new Emoji("\u{1F94C}", "Curling Stone");
    const lacrosse = new Emoji("\u{1F94D}", "Lacrosse");
    const softball = new Emoji("\u{1F94E}", "Softball");
    const flyingDisc = new Emoji("\u{1F94F}", "Flying Disc");
    const soccerBall = new Emoji("\u26BD", "Soccer Ball");
    const baseball = new Emoji("\u26BE", "Baseball");
    const iceSkate = new Emoji("\u26F8\uFE0F", "Ice Skate");
    const topHat = new Emoji("\u{1F3A9}", "Top Hat");
    const divingMask = new Emoji("\u{1F93F}", "Diving Mask");
    const womanSHat = new Emoji("\u{1F452}", "Woman’s Hat");
    const glasses = new Emoji("\u{1F453}", "Glasses");
    const sunglasses = new Emoji("\u{1F576}\uFE0F", "Sunglasses");
    const necktie = new Emoji("\u{1F454}", "Necktie");
    const tShirt = new Emoji("\u{1F455}", "T-Shirt");
    const jeans = new Emoji("\u{1F456}", "Jeans");
    const dress = new Emoji("\u{1F457}", "Dress");
    const kimono = new Emoji("\u{1F458}", "Kimono");
    const bikini = new Emoji("\u{1F459}", "Bikini");
    const womanSClothes = new Emoji("\u{1F45A}", "Woman’s Clothes");
    const purse = new Emoji("\u{1F45B}", "Purse");
    const handbag = new Emoji("\u{1F45C}", "Handbag");
    const clutchBag = new Emoji("\u{1F45D}", "Clutch Bag");
    const manSShoe = new Emoji("\u{1F45E}", "Man’s Shoe");
    const runningShoe = new Emoji("\u{1F45F}", "Running Shoe");
    const highHeeledShoe = new Emoji("\u{1F460}", "High-Heeled Shoe");
    const womanSSandal = new Emoji("\u{1F461}", "Woman’s Sandal");
    const womanSBoot = new Emoji("\u{1F462}", "Woman’s Boot");
    const martialArtsUniform = new Emoji("\u{1F94B}", "Martial Arts Uniform");
    const sari = new Emoji("\u{1F97B}", "Sari");
    const labCoat = new Emoji("\u{1F97C}", "Lab Coat");
    const goggles = new Emoji("\u{1F97D}", "Goggles");
    const hikingBoot = new Emoji("\u{1F97E}", "Hiking Boot");
    const flatShoe = new Emoji("\u{1F97F}", "Flat Shoe");
    const billedCap = new Emoji("\u{1F9E2}", "Billed Cap");
    const scarf = new Emoji("\u{1F9E3}", "Scarf");
    const gloves = new Emoji("\u{1F9E4}", "Gloves");
    const coat = new Emoji("\u{1F9E5}", "Coat");
    const socks = new Emoji("\u{1F9E6}", "Socks");
    const nazarAmulet = new Emoji("\u{1F9FF}", "Nazar Amulet");
    const balletShoes = new Emoji("\u{1FA70}", "Ballet Shoes");
    const onePieceSwimsuit = new Emoji("\u{1FA71}", "One-Piece Swimsuit");
    const briefs = new Emoji("\u{1FA72}", "Briefs");
    const shorts = new Emoji("\u{1FA73}", "Shorts");
    const buildingConstruction = new Emoji("\u{1F3D7}\uFE0F", "Building Construction");
    const houses = new Emoji("\u{1F3D8}\uFE0F", "Houses");
    const cityscape = new Emoji("\u{1F3D9}\uFE0F", "Cityscape");
    const derelictHouse = new Emoji("\u{1F3DA}\uFE0F", "Derelict House");
    const classicalBuilding = new Emoji("\u{1F3DB}\uFE0F", "Classical Building");
    const desert = new Emoji("\u{1F3DC}\uFE0F", "Desert");
    const desertIsland = new Emoji("\u{1F3DD}\uFE0F", "Desert Island");
    const nationalPark = new Emoji("\u{1F3DE}\uFE0F", "National Park");
    const stadium = new Emoji("\u{1F3DF}\uFE0F", "Stadium");
    const house = new Emoji("\u{1F3E0}", "House");
    const houseWithGarden = new Emoji("\u{1F3E1}", "House with Garden");
    const officeBuilding = new Emoji("\u{1F3E2}", "Office Building");
    const japanesePostOffice = new Emoji("\u{1F3E3}", "Japanese Post Office");
    const postOffice = new Emoji("\u{1F3E4}", "Post Office");
    const hospital = new Emoji("\u{1F3E5}", "Hospital");
    const bank = new Emoji("\u{1F3E6}", "Bank");
    const aTMSign = new Emoji("\u{1F3E7}", "ATM Sign");
    const hotel = new Emoji("\u{1F3E8}", "Hotel");
    const loveHotel = new Emoji("\u{1F3E9}", "Love Hotel");
    const convenienceStore = new Emoji("\u{1F3EA}", "Convenience Store");
    const departmentStore = new Emoji("\u{1F3EC}", "Department Store");
    const bridgeAtNight = new Emoji("\u{1F309}", "Bridge at Night");
    const fountain = new Emoji("\u26F2", "Fountain");
    const shoppingBags = new Emoji("\u{1F6CD}\uFE0F", "Shopping Bags");
    const receipt = new Emoji("\u{1F9FE}", "Receipt");
    const shoppingCart = new Emoji("\u{1F6D2}", "Shopping Cart");
    const barberPole = new Emoji("\u{1F488}", "Barber Pole");
    const wedding = new Emoji("\u{1F492}", "Wedding");
    const ballotBoxWithBallot = new Emoji("\u{1F5F3}\uFE0F", "Ballot Box with Ballot");
    const musicalScore = new Emoji("\u{1F3BC}", "Musical Score");
    const musicalNotes = new Emoji("\u{1F3B6}", "Musical Notes");
    const musicalNote = new Emoji("\u{1F3B5}", "Musical Note");
    const saxophone = new Emoji("\u{1F3B7}", "Saxophone");
    const guitar = new Emoji("\u{1F3B8}", "Guitar");
    const musicalKeyboard = new Emoji("\u{1F3B9}", "Musical Keyboard");
    const trumpet = new Emoji("\u{1F3BA}", "Trumpet");
    const violin = new Emoji("\u{1F3BB}", "Violin");
    const drum = new Emoji("\u{1F941}", "Drum");
    const banjo = new Emoji("\u{1FA95}", "Banjo");
    const globeShowingAmericas = new Emoji("\u{1F30E}", "Globe Showing Americas");
    const milkyWay = new Emoji("\u{1F30C}", "Milky Way");
    const globeShowingEuropeAfrica = new Emoji("\u{1F30D}", "Globe Showing Europe-Africa");
    const globeShowingAsiaAustralia = new Emoji("\u{1F30F}", "Globe Showing Asia-Australia");
    const globeWithMeridians = new Emoji("\u{1F310}", "Globe with Meridians");
    const newMoon = new Emoji("\u{1F311}", "New Moon");
    const waxingCrescentMoon = new Emoji("\u{1F312}", "Waxing Crescent Moon");
    const firstQuarterMoon = new Emoji("\u{1F313}", "First Quarter Moon");
    const waxingGibbousMoon = new Emoji("\u{1F314}", "Waxing Gibbous Moon");
    const fullMoon = new Emoji("\u{1F315}", "Full Moon");
    const waningGibbousMoon = new Emoji("\u{1F316}", "Waning Gibbous Moon");
    const lastQuarterMoon = new Emoji("\u{1F317}", "Last Quarter Moon");
    const waningCrescentMoon = new Emoji("\u{1F318}", "Waning Crescent Moon");
    const crescentMoon = new Emoji("\u{1F319}", "Crescent Moon");
    const newMoonFace = new Emoji("\u{1F31A}", "New Moon Face");
    const firstQuarterMoonFace = new Emoji("\u{1F31B}", "First Quarter Moon Face");
    const lastQuarterMoonFace = new Emoji("\u{1F31C}", "Last Quarter Moon Face");
    const fullMoonFace = new Emoji("\u{1F31D}", "Full Moon Face");
    const sunWithFace = new Emoji("\u{1F31E}", "Sun with Face");
    const glowingStar = new Emoji("\u{1F31F}", "Glowing Star");
    const shootingStar = new Emoji("\u{1F320}", "Shooting Star");
    const comet = new Emoji("\u2604\uFE0F", "Comet");
    const ringedPlanet = new Emoji("\u{1FA90}", "Ringed Planet");
    const moneyBag = new Emoji("\u{1F4B0}", "Money Bag");
    const currencyExchange = new Emoji("\u{1F4B1}", "Currency Exchange");
    const heavyDollarSign = new Emoji("\u{1F4B2}", "Heavy Dollar Sign");
    const creditCard = new Emoji("\u{1F4B3}", "Credit Card");
    const yenBanknote = new Emoji("\u{1F4B4}", "Yen Banknote");
    const dollarBanknote = new Emoji("\u{1F4B5}", "Dollar Banknote");
    const euroBanknote = new Emoji("\u{1F4B6}", "Euro Banknote");
    const poundBanknote = new Emoji("\u{1F4B7}", "Pound Banknote");
    const moneyWithWings = new Emoji("\u{1F4B8}", "Money with Wings");
    const chartIncreasingWithYen = new Emoji("\u{1F4B9}", "Chart Increasing with Yen");
    const pen = new Emoji("\u{1F58A}\uFE0F", "Pen");
    const fountainPen = new Emoji("\u{1F58B}\uFE0F", "Fountain Pen");
    const paintbrush = new Emoji("\u{1F58C}\uFE0F", "Paintbrush");
    const crayon = new Emoji("\u{1F58D}\uFE0F", "Crayon");
    const pencil = new Emoji("\u270F\uFE0F", "Pencil");
    const blackNib = new Emoji("\u2712\uFE0F", "Black Nib");
    const alembic = new Emoji("\u2697\uFE0F", "Alembic");
    const gear = new Emoji("\u2699\uFE0F", "Gear");
    const atomSymbol = new Emoji("\u269B\uFE0F", "Atom Symbol");
    const keyboard = new Emoji("\u2328\uFE0F", "Keyboard");
    const telephone = new Emoji("\u260E\uFE0F", "Telephone");
    const studioMicrophone = new Emoji("\u{1F399}\uFE0F", "Studio Microphone");
    const levelSlider = new Emoji("\u{1F39A}\uFE0F", "Level Slider");
    const controlKnobs = new Emoji("\u{1F39B}\uFE0F", "Control Knobs");
    const movieCamera = new Emoji("\u{1F3A5}", "Movie Camera");
    const headphone = new Emoji("\u{1F3A7}", "Headphone");
    const videoGame = new Emoji("\u{1F3AE}", "Video Game");
    const lightBulb = new Emoji("\u{1F4A1}", "Light Bulb");
    const computerDisk = new Emoji("\u{1F4BD}", "Computer Disk");
    const floppyDisk = new Emoji("\u{1F4BE}", "Floppy Disk");
    const opticalDisk = new Emoji("\u{1F4BF}", "Optical Disk");
    const dVD = new Emoji("\u{1F4C0}", "DVD");
    const telephoneReceiver = new Emoji("\u{1F4DE}", "Telephone Receiver");
    const pager = new Emoji("\u{1F4DF}", "Pager");
    const faxMachine = new Emoji("\u{1F4E0}", "Fax Machine");
    const satelliteAntenna = new Emoji("\u{1F4E1}", "Satellite Antenna");
    const loudspeaker = new Emoji("\u{1F4E2}", "Loudspeaker");
    const megaphone = new Emoji("\u{1F4E3}", "Megaphone");
    const mobilePhone = new Emoji("\u{1F4F1}", "Mobile Phone");
    const mobilePhoneWithArrow = new Emoji("\u{1F4F2}", "Mobile Phone with Arrow");
    const mobilePhoneVibrating = new Emoji("\u{1F4F3}", "Mobile Phone Vibrating");
    const mobilePhoneOff = new Emoji("\u{1F4F4}", "Mobile Phone Off");
    const noMobilePhone = new Emoji("\u{1F4F5}", "No Mobile Phone");
    const antennaBars = new Emoji("\u{1F4F6}", "Antenna Bars");
    const camera = new Emoji("\u{1F4F7}", "Camera");
    const cameraWithFlash = new Emoji("\u{1F4F8}", "Camera with Flash");
    const videoCamera = new Emoji("\u{1F4F9}", "Video Camera");
    const television = new Emoji("\u{1F4FA}", "Television");
    const radio = new Emoji("\u{1F4FB}", "Radio");
    const videocassette = new Emoji("\u{1F4FC}", "Videocassette");
    const filmProjector = new Emoji("\u{1F4FD}\uFE0F", "Film Projector");
    const dimButton = new Emoji("\u{1F505}", "Dim Button");
    const brightButton = new Emoji("\u{1F506}", "Bright Button");
    const mutedSpeaker = new Emoji("\u{1F507}", "Muted Speaker");
    const speakerLowVolume = new Emoji("\u{1F508}", "Speaker Low Volume");
    const speakerMediumVolume = new Emoji("\u{1F509}", "Speaker Medium Volume");
    const speakerHighVolume = new Emoji("\u{1F50A}", "Speaker High Volume");
    const battery = new Emoji("\u{1F50B}", "Battery");
    const electricPlug = new Emoji("\u{1F50C}", "Electric Plug");
    const magnifyingGlassTiltedLeft = new Emoji("\u{1F50D}", "Magnifying Glass Tilted Left");
    const magnifyingGlassTiltedRight = new Emoji("\u{1F50E}", "Magnifying Glass Tilted Right");
    const lockedWithPen = new Emoji("\u{1F50F}", "Locked with Pen");
    const lockedWithKey = new Emoji("\u{1F510}", "Locked with Key");
    const key = new Emoji("\u{1F511}", "Key");
    const locked = new Emoji("\u{1F512}", "Locked");
    const unlocked = new Emoji("\u{1F513}", "Unlocked");
    const bell = new Emoji("\u{1F514}", "Bell");
    const bellWithSlash = new Emoji("\u{1F515}", "Bell with Slash");
    const bookmark = new Emoji("\u{1F516}", "Bookmark");
    const link = new Emoji("\u{1F517}", "Link");
    const joystick = new Emoji("\u{1F579}\uFE0F", "Joystick");
    const desktopComputer = new Emoji("\u{1F5A5}\uFE0F", "Desktop Computer");
    const printer = new Emoji("\u{1F5A8}\uFE0F", "Printer");
    const computerMouse = new Emoji("\u{1F5B1}\uFE0F", "Computer Mouse");
    const trackball = new Emoji("\u{1F5B2}\uFE0F", "Trackball");
    const cardIndexDividers = new Emoji("\u{1F5C2}", "Card Index Dividers");
    const cardFileBox = new Emoji("\u{1F5C3}", "Card File Box");
    const fileCabinet = new Emoji("\u{1F5C4}", "File Cabinet");
    const wastebasket = new Emoji("\u{1F5D1}", "Wastebasket");
    const spiralNotePad = new Emoji("\u{1F5D2}", "Spiral Note Pad");
    const spiralCalendar = new Emoji("\u{1F5D3}", "Spiral Calendar");
    const compression = new Emoji("\u{1F5DC}", "Compression");
    const oldKey = new Emoji("\u{1F5DD}", "Old Key");
    const outboxTray = new Emoji("\u{1F4E4}", "Outbox Tray");
    const inboxTray = new Emoji("\u{1F4E5}", "Inbox Tray");
    const packageBox = new Emoji("\u{1F4E6}", "Package Box");
    const eMail = new Emoji("\u{1F4E7}", "E-Mail");
    const incomingEnvelope = new Emoji("\u{1F4E8}", "Incoming Envelope");
    const envelopeWithArrow = new Emoji("\u{1F4E9}", "Envelope with Arrow");
    const closedMailboxWithLoweredFlag = new Emoji("\u{1F4EA}", "Closed Mailbox with Lowered Flag");
    const closedMailboxWithRaisedFlag = new Emoji("\u{1F4EB}", "Closed Mailbox with Raised Flag");
    const openMailboxWithRaisedFlag = new Emoji("\u{1F4EC}", "Open Mailbox with Raised Flag");
    const openMailboxWithLoweredFlag = new Emoji("\u{1F4ED}", "Open Mailbox with Lowered Flag");
    const postbox = new Emoji("\u{1F4EE}", "Postbox");
    const postalHorn = new Emoji("\u{1F4EF}", "Postal Horn");
    const ribbon = new Emoji("\u{1F380}", "Ribbon");
    const wrappedGift = new Emoji("\u{1F381}", "Wrapped Gift");
    const jackOLantern = new Emoji("\u{1F383}", "Jack-O-Lantern");
    const christmasTree = new Emoji("\u{1F384}", "Christmas Tree");
    const firecracker = new Emoji("\u{1F9E8}", "Firecracker");
    const fireworks = new Emoji("\u{1F386}", "Fireworks");
    const sparkler = new Emoji("\u{1F387}", "Sparkler");
    const sparkles = new Emoji("\u2728", "Sparkles");
    const sparkle = new Emoji("\u2747\uFE0F", "Sparkle");
    const balloon = new Emoji("\u{1F388}", "Balloon");
    const partyPopper = new Emoji("\u{1F389}", "Party Popper");
    const confettiBall = new Emoji("\u{1F38A}", "Confetti Ball");
    const tanabataTree = new Emoji("\u{1F38B}", "Tanabata Tree");
    const pineDecoration = new Emoji("\u{1F38D}", "Pine Decoration");
    const japaneseDolls = new Emoji("\u{1F38E}", "Japanese Dolls");
    const carpStreamer = new Emoji("\u{1F38F}", "Carp Streamer");
    const windChime = new Emoji("\u{1F390}", "Wind Chime");
    const moonViewingCeremony = new Emoji("\u{1F391}", "Moon Viewing Ceremony");
    const backpack = new Emoji("\u{1F392}", "Backpack");
    const redEnvelope = new Emoji("\u{1F9E7}", "Red Envelope");
    const redPaperLantern = new Emoji("\u{1F3EE}", "Red Paper Lantern");
    const militaryMedal = new Emoji("\u{1F396}\uFE0F", "Military Medal");
    const fishingPole = new Emoji("\u{1F3A3}", "Fishing Pole");
    const flashlight = new Emoji("\u{1F526}", "Flashlight");
    const hammer = new Emoji("\u{1F528}", "Hammer");
    const nutAndBolt = new Emoji("\u{1F529}", "Nut and Bolt");
    const hammerAndWrench = new Emoji("\u{1F6E0}\uFE0F", "Hammer and Wrench");
    const compass = new Emoji("\u{1F9ED}", "Compass");
    const fireExtinguisher = new Emoji("\u{1F9EF}", "Fire Extinguisher");
    const toolbox = new Emoji("\u{1F9F0}", "Toolbox");
    const brick = new Emoji("\u{1F9F1}", "Brick");
    const axe = new Emoji("\u{1FA93}", "Axe");
    const hammerAndPick = new Emoji("\u2692\uFE0F", "Hammer and Pick");
    const pick = new Emoji("\u26CF\uFE0F", "Pick");
    const rescueWorkerSHelmet = new Emoji("\u26D1\uFE0F", "Rescue Worker’s Helmet");
    const chains = new Emoji("\u26D3\uFE0F", "Chains");
    const fileFolder = new Emoji("\u{1F4C1}", "File Folder");
    const openFileFolder = new Emoji("\u{1F4C2}", "Open File Folder");
    const pageWithCurl = new Emoji("\u{1F4C3}", "Page with Curl");
    const pageFacingUp = new Emoji("\u{1F4C4}", "Page Facing Up");
    const calendar = new Emoji("\u{1F4C5}", "Calendar");
    const tearOffCalendar = new Emoji("\u{1F4C6}", "Tear-Off Calendar");
    const cardIndex = new Emoji("\u{1F4C7}", "Card Index");
    const chartIncreasing = new Emoji("\u{1F4C8}", "Chart Increasing");
    const chartDecreasing = new Emoji("\u{1F4C9}", "Chart Decreasing");
    const barChart = new Emoji("\u{1F4CA}", "Bar Chart");
    const clipboard = new Emoji("\u{1F4CB}", "Clipboard");
    const pushpin = new Emoji("\u{1F4CC}", "Pushpin");
    const roundPushpin = new Emoji("\u{1F4CD}", "Round Pushpin");
    const paperclip = new Emoji("\u{1F4CE}", "Paperclip");
    const linkedPaperclips = new Emoji("\u{1F587}\uFE0F", "Linked Paperclips");
    const straightRuler = new Emoji("\u{1F4CF}", "Straight Ruler");
    const triangularRuler = new Emoji("\u{1F4D0}", "Triangular Ruler");
    const bookmarkTabs = new Emoji("\u{1F4D1}", "Bookmark Tabs");
    const ledger = new Emoji("\u{1F4D2}", "Ledger");
    const notebook = new Emoji("\u{1F4D3}", "Notebook");
    const notebookWithDecorativeCover = new Emoji("\u{1F4D4}", "Notebook with Decorative Cover");
    const closedBook = new Emoji("\u{1F4D5}", "Closed Book");
    const openBook = new Emoji("\u{1F4D6}", "Open Book");
    const greenBook = new Emoji("\u{1F4D7}", "Green Book");
    const blueBook = new Emoji("\u{1F4D8}", "Blue Book");
    const orangeBook = new Emoji("\u{1F4D9}", "Orange Book");
    const books = new Emoji("\u{1F4DA}", "Books");
    const nameBadge = new Emoji("\u{1F4DB}", "Name Badge");
    const scroll = new Emoji("\u{1F4DC}", "Scroll");
    const memo = new Emoji("\u{1F4DD}", "Memo");
    const scissors = new Emoji("\u2702\uFE0F", "Scissors");
    const envelope = new Emoji("\u2709\uFE0F", "Envelope");
    const cinema = new Emoji("\u{1F3A6}", "Cinema");
    const noOneUnderEighteen = new Emoji("\u{1F51E}", "No One Under Eighteen");
    const prohibited = new Emoji("\u{1F6AB}", "Prohibited");
    const cigarette = new Emoji("\u{1F6AC}", "Cigarette");
    const noSmoking = new Emoji("\u{1F6AD}", "No Smoking");
    const litterInBinSign = new Emoji("\u{1F6AE}", "Litter in Bin Sign");
    const noLittering = new Emoji("\u{1F6AF}", "No Littering");
    const potableWater = new Emoji("\u{1F6B0}", "Potable Water");
    const nonPotableWater = new Emoji("\u{1F6B1}", "Non-Potable Water");
    const noBicycles = new Emoji("\u{1F6B3}", "No Bicycles");
    const noPedestrians = new Emoji("\u{1F6B7}", "No Pedestrians");
    const childrenCrossing = new Emoji("\u{1F6B8}", "Children Crossing");
    const menSRoom = new Emoji("\u{1F6B9}", "Men’s Room");
    const womenSRoom = new Emoji("\u{1F6BA}", "Women’s Room");
    const restroom = new Emoji("\u{1F6BB}", "Restroom");
    const babySymbol = new Emoji("\u{1F6BC}", "Baby Symbol");
    const waterCloset = new Emoji("\u{1F6BE}", "Water Closet");
    const passportControl = new Emoji("\u{1F6C2}", "Passport Control");
    const customs = new Emoji("\u{1F6C3}", "Customs");
    const baggageClaim = new Emoji("\u{1F6C4}", "Baggage Claim");
    const leftLuggage = new Emoji("\u{1F6C5}", "Left Luggage");
    const parkingButton = new Emoji("\u{1F17F}\uFE0F", "Parking Button");
    const wheelchairSymbol = new Emoji("\u267F", "Wheelchair Symbol");
    const radioactive = new Emoji("\u2622\uFE0F", "Radioactive");
    const biohazard = new Emoji("\u2623\uFE0F", "Biohazard");
    const warning = new Emoji("\u26A0\uFE0F", "Warning");
    const highVoltage = new Emoji("\u26A1", "High Voltage");
    const noEntry = new Emoji("\u26D4", "No Entry");
    const recyclingSymbol = new Emoji("\u267B\uFE0F", "Recycling Symbol");
    const dottedSixPointedStar = new Emoji("\u{1F52F}", "Dotted Six-Pointed Star");
    const starOfDavid = new Emoji("\u2721\uFE0F", "Star of David");
    const om = new Emoji("\u{1F549}\uFE0F", "Om");
    const kaaba = new Emoji("\u{1F54B}", "Kaaba");
    const mosque = new Emoji("\u{1F54C}", "Mosque");
    const synagogue = new Emoji("\u{1F54D}", "Synagogue");
    const menorah = new Emoji("\u{1F54E}", "Menorah");
    const placeOfWorship = new Emoji("\u{1F6D0}", "Place of Worship");
    const hinduTemple = new Emoji("\u{1F6D5}", "Hindu Temple");
    const orthodoxCross = new Emoji("\u2626\uFE0F", "Orthodox Cross");
    const latinCross = new Emoji("\u271D\uFE0F", "Latin Cross");
    const starAndCrescent = new Emoji("\u262A\uFE0F", "Star and Crescent");
    const peaceSymbol = new Emoji("\u262E\uFE0F", "Peace Symbol");
    const yinYang = new Emoji("\u262F\uFE0F", "Yin Yang");
    const wheelOfDharma = new Emoji("\u2638\uFE0F", "Wheel of Dharma");
    const infinity = new Emoji("\u267E\uFE0F", "Infinity");
    const diyaLamp = new Emoji("\u{1FA94}", "Diya Lamp");
    const shintoShrine = new Emoji("\u26E9\uFE0F", "Shinto Shrine");
    const church = new Emoji("\u26EA", "Church");
    const eightPointedStar = new Emoji("\u2734\uFE0F", "Eight-Pointed Star");
    const prayerBeads = new Emoji("\u{1F4FF}", "Prayer Beads");
    const door = new Emoji("\u{1F6AA}", "Door");
    const lipstick = new Emoji("\u{1F484}", "Lipstick");
    const ring = new Emoji("\u{1F48D}", "Ring");
    const gemStone = new Emoji("\u{1F48E}", "Gem Stone");
    const newspaper = new Emoji("\u{1F4F0}", "Newspaper");
    const fire = new Emoji("\u{1F525}", "Fire");
    const pistol = new Emoji("\u{1F52B}", "Pistol");
    const candle = new Emoji("\u{1F56F}\uFE0F", "Candle");
    const framedPicture = new Emoji("\u{1F5BC}\uFE0F", "Framed Picture");
    const rolledUpNewspaper = new Emoji("\u{1F5DE}\uFE0F", "Rolled-Up Newspaper");
    const worldMap = new Emoji("\u{1F5FA}\uFE0F", "World Map");
    const toilet = new Emoji("\u{1F6BD}", "Toilet");
    const shower = new Emoji("\u{1F6BF}", "Shower");
    const bathtub = new Emoji("\u{1F6C1}", "Bathtub");
    const couchAndLamp = new Emoji("\u{1F6CB}\uFE0F", "Couch and Lamp");
    const bed = new Emoji("\u{1F6CF}\uFE0F", "Bed");
    const lotionBottle = new Emoji("\u{1F9F4}", "Lotion Bottle");
    const thread = new Emoji("\u{1F9F5}", "Thread");
    const yarn = new Emoji("\u{1F9F6}", "Yarn");
    const safetyPin = new Emoji("\u{1F9F7}", "Safety Pin");
    const teddyBear = new Emoji("\u{1F9F8}", "Teddy Bear");
    const broom = new Emoji("\u{1F9F9}", "Broom");
    const basket = new Emoji("\u{1F9FA}", "Basket");
    const rollOfPaper = new Emoji("\u{1F9FB}", "Roll of Paper");
    const soap = new Emoji("\u{1F9FC}", "Soap");
    const sponge = new Emoji("\u{1F9FD}", "Sponge");
    const chair = new Emoji("\u{1FA91}", "Chair");
    const razor = new Emoji("\u{1FA92}", "Razor");
    const reminderRibbon = new Emoji("\u{1F397}\uFE0F", "Reminder Ribbon");
    const filmFrames = new Emoji("\u{1F39E}\uFE0F", "Film Frames");
    const admissionTickets = new Emoji("\u{1F39F}\uFE0F", "Admission Tickets");
    const carouselHorse = new Emoji("\u{1F3A0}", "Carousel Horse");
    const ferrisWheel = new Emoji("\u{1F3A1}", "Ferris Wheel");
    const rollerCoaster = new Emoji("\u{1F3A2}", "Roller Coaster");
    const circusTent = new Emoji("\u{1F3AA}", "Circus Tent");
    const ticket = new Emoji("\u{1F3AB}", "Ticket");
    const clapperBoard = new Emoji("\u{1F3AC}", "Clapper Board");
    const performingArts = new Emoji("\u{1F3AD}", "Performing Arts");
    const label = new Emoji("\u{1F3F7}\uFE0F", "Label");
    const volcano = new Emoji("\u{1F30B}", "Volcano");
    const snowCappedMountain = new Emoji("\u{1F3D4}\uFE0F", "Snow-Capped Mountain");
    const mountain = new Emoji("\u26F0\uFE0F", "Mountain");
    const camping = new Emoji("\u{1F3D5}\uFE0F", "Camping");
    const beachWithUmbrella = new Emoji("\u{1F3D6}\uFE0F", "Beach with Umbrella");
    const umbrellaOnGround = new Emoji("\u26F1\uFE0F", "Umbrella on Ground");
    const japaneseCastle = new Emoji("\u{1F3EF}", "Japanese Castle");
    const footprints = new Emoji("\u{1F463}", "Footprints");
    const mountFuji = new Emoji("\u{1F5FB}", "Mount Fuji");
    const tokyoTower = new Emoji("\u{1F5FC}", "Tokyo Tower");
    const statueOfLiberty = new Emoji("\u{1F5FD}", "Statue of Liberty");
    const mapOfJapan = new Emoji("\u{1F5FE}", "Map of Japan");
    const moai = new Emoji("\u{1F5FF}", "Moai");
    const bellhopBell = new Emoji("\u{1F6CE}\uFE0F", "Bellhop Bell");
    const luggage = new Emoji("\u{1F9F3}", "Luggage");
    const flagInHole = new Emoji("\u26F3", "Flag in Hole");
    const tent = new Emoji("\u26FA", "Tent");
    const hotSprings = new Emoji("\u2668\uFE0F", "Hot Springs");
    const castle = new Emoji("\u{1F3F0}", "Castle");
    const bowAndArrow = new Emoji("\u{1F3F9}", "Bow and Arrow");
    const tridentEmblem = new Emoji("\u{1F531}", "Trident Emblem");
    const dagger = new Emoji("\u{1F5E1}\uFE0F", "Dagger");
    const shield = new Emoji("\u{1F6E1}\uFE0F", "Shield");
    const crystalBall = new Emoji("\u{1F52E}", "Crystal Ball");
    const crossedSwords = new Emoji("\u2694\uFE0F", "Crossed Swords");
    const fleurDeLis = new Emoji("\u269C\uFE0F", "Fleur-de-lis");
    const questionMark = new Emoji("\u2753", "Question Mark");
    const squareFourCorners = new Emoji("\u26F6\uFE0F", "Square: Four Corners");
    const droplet = new Emoji("\u{1F4A7}", "Droplet");
    const dropOfBlood = new Emoji("\u{1FA78}", "Drop of Blood");
    const adhesiveBandage = new Emoji("\u{1FA79}", "Adhesive Bandage");
    const stethoscope = new Emoji("\u{1FA7A}", "Stethoscope");
    const syringe = new Emoji("\u{1F489}", "Syringe");
    const pill = new Emoji("\u{1F48A}", "Pill");
    const testTube = new Emoji("\u{1F9EA}", "Test Tube");
    const petriDish = new Emoji("\u{1F9EB}", "Petri Dish");
    const dNA = new Emoji("\u{1F9EC}", "DNA");
    const abacus = new Emoji("\u{1F9EE}", "Abacus");
    const magnet = new Emoji("\u{1F9F2}", "Magnet");
    const telescope = new Emoji("\u{1F52D}", "Telescope");
    const whiteChessKing = new Emoji("\u2654", "White Chess King");
    const whiteChessQueen = new Emoji("\u2655", "White Chess Queen");
    const whiteChessRook = new Emoji("\u2656", "White Chess Rook");
    const whiteChessBishop = new Emoji("\u2657", "White Chess Bishop");
    const whiteChessKnight = new Emoji("\u2658", "White Chess Knight");
    const whiteChessPawn = new Emoji("\u2659", "White Chess Pawn");
    const blackChessKing = new Emoji("\u265A", "Black Chess King");
    const blackChessQueen = new Emoji("\u265B", "Black Chess Queen");
    const blackChessRook = new Emoji("\u265C", "Black Chess Rook");
    const blackChessBishop = new Emoji("\u265D", "Black Chess Bishop");
    const blackChessKnight = new Emoji("\u265E", "Black Chess Knight");
    const blackChessPawn = new Emoji("\u265F", "Black Chess Pawn");

    const allFrowning = [
        frowning,
        frowningLightSkinTone,
        frowningMediumLightSkinTone,
        frowningMediumSkinTone,
        frowningMediumDarkSkinTone,
        frowningDarkSkinTone
    ];
    const allFrowningGroup = new EmojiGroup("\u{1F64D}\uDE4D", "Frowning", ...allFrowning);
    const allFrowningMale = [
        frowningMale,
        frowningLightSkinToneMale,
        frowningMediumLightSkinToneMale,
        frowningMediumSkinToneMale,
        frowningMediumDarkSkinToneMale,
        frowningDarkSkinToneMale
    ];
    const allFrowningMaleGroup = new EmojiGroup("\u{1F64D}\uDE4D\u200D\u2642\uFE0F", "Frowning: Male", ...allFrowningMale);
    const allFrowningFemale = [
        frowningFemale,
        frowningLightSkinToneFemale,
        frowningMediumLightSkinToneFemale,
        frowningMediumSkinToneFemale,
        frowningMediumDarkSkinToneFemale,
        frowningDarkSkinToneFemale
    ];
    const allFrowningFemaleGroup = new EmojiGroup("\u{1F64D}\uDE4D\u200D\u2640\uFE0F", "Frowning: Female", ...allFrowningFemale);
    const allFrowners = [
        allFrowningGroup,
        allFrowningMaleGroup,
        allFrowningFemaleGroup
    ];
    const allFrownersGroup = new EmojiGroup("\u{1F64D}\uDE4D", "Frowning", ...allFrowners);
    const allPouting = [
        pouting,
        poutingLightSkinTone,
        poutingMediumLightSkinTone,
        poutingMediumSkinTone,
        poutingMediumDarkSkinTone,
        poutingDarkSkinTone
    ];
    const allPoutingGroup = new EmojiGroup("\u{1F64E}\uDE4E", "Pouting", ...allPouting);
    const allPoutingMale = [
        poutingMale,
        poutingLightSkinToneMale,
        poutingMediumLightSkinToneMale,
        poutingMediumSkinToneMale,
        poutingMediumDarkSkinToneMale,
        poutingDarkSkinToneMale
    ];
    const allPoutingMaleGroup = new EmojiGroup("\u{1F64E}\uDE4E\u200D\u2642\uFE0F", "Pouting: Male", ...allPoutingMale);
    const allPoutingFemale = [
        poutingFemale,
        poutingLightSkinToneFemale,
        poutingMediumLightSkinToneFemale,
        poutingMediumSkinToneFemale,
        poutingMediumDarkSkinToneFemale,
        poutingDarkSkinToneFemale
    ];
    const allPoutingFemaleGroup = new EmojiGroup("\u{1F64E}\uDE4E\u200D\u2640\uFE0F", "Pouting: Female", ...allPoutingFemale);
    const allPouters = [
        allPoutingGroup,
        allPoutingMaleGroup,
        allPoutingFemaleGroup
    ];
    const allPoutersGroup = new EmojiGroup("\u{1F64E}\uDE4E", "Pouting", ...allPouters);
    const allGesturingNO = [
        gesturingNO,
        gesturingNOLightSkinTone,
        gesturingNOMediumLightSkinTone,
        gesturingNOMediumSkinTone,
        gesturingNOMediumDarkSkinTone,
        gesturingNODarkSkinTone
    ];
    const allGesturingNOGroup = new EmojiGroup("\u{1F645}\uDE45", "Gesturing NO", ...allGesturingNO);
    const allGesturingNOMale = [
        gesturingNOMale,
        gesturingNOLightSkinToneMale,
        gesturingNOMediumLightSkinToneMale,
        gesturingNOMediumSkinToneMale,
        gesturingNOMediumDarkSkinToneMale,
        gesturingNODarkSkinToneMale
    ];
    const allGesturingNOMaleGroup = new EmojiGroup("\u{1F645}\uDE45\u200D\u2642\uFE0F", "Gesturing NO: Male", ...allGesturingNOMale);
    const allGesturingNOFemale = [
        gesturingNOFemale,
        gesturingNOLightSkinToneFemale,
        gesturingNOMediumLightSkinToneFemale,
        gesturingNOMediumSkinToneFemale,
        gesturingNOMediumDarkSkinToneFemale,
        gesturingNODarkSkinToneFemale
    ];
    const allGesturingNOFemaleGroup = new EmojiGroup("\u{1F645}\uDE45\u200D\u2640\uFE0F", "Gesturing NO: Female", ...allGesturingNOFemale);
    const allNoGuesturerersGroup = [
        allGesturingNOGroup,
        allGesturingNOMaleGroup,
        allGesturingNOFemaleGroup
    ];
    const allNoGuesturerersGroupGroup = new EmojiGroup("\u{1F645}\uDE45", "Gesturing NO", ...allNoGuesturerersGroup);
    const allGesturingOK = [
        gesturingOK,
        gesturingOKLightSkinTone,
        gesturingOKMediumLightSkinTone,
        gesturingOKMediumSkinTone,
        gesturingOKMediumDarkSkinTone,
        gesturingOKDarkSkinTone
    ];
    const allGesturingOKGroup = new EmojiGroup("\u{1F646}\uDE46", "Gesturing OK", ...allGesturingOK);
    const allGesturingOKMale = [
        gesturingOKMale,
        gesturingOKLightSkinToneMale,
        gesturingOKMediumLightSkinToneMale,
        gesturingOKMediumSkinToneMale,
        gesturingOKMediumDarkSkinToneMale,
        gesturingOKDarkSkinToneMale
    ];
    const allGesturingOKMaleGroup = new EmojiGroup("\u{1F646}\uDE46\u200D\u2642\uFE0F", "Gesturing OK: Male", ...allGesturingOKMale);
    const allGesturingOKFemale = [
        gesturingOKFemale,
        gesturingOKLightSkinToneFemale,
        gesturingOKMediumLightSkinToneFemale,
        gesturingOKMediumSkinToneFemale,
        gesturingOKMediumDarkSkinToneFemale,
        gesturingOKDarkSkinToneFemale
    ];
    const allGesturingOKFemaleGroup = new EmojiGroup("\u{1F646}\uDE46\u200D\u2640\uFE0F", "Gesturing OK: Female", ...allGesturingOKFemale);
    const allOKGesturerersGroup = [
        allGesturingOKGroup,
        allGesturingOKMaleGroup,
        allGesturingOKFemaleGroup
    ];
    const allOKGesturerersGroupGroup = new EmojiGroup("\u{1F646}\uDE46", "Gesturing OK", ...allOKGesturerersGroup);
    const allTippingHand = [
        tippingHand,
        tippingHandLightSkinTone,
        tippingHandMediumLightSkinTone,
        tippingHandMediumSkinTone,
        tippingHandMediumDarkSkinTone,
        tippingHandDarkSkinTone
    ];
    const allTippingHandGroup = new EmojiGroup("\u{1F481}\uDC81", "Tipping Hand", ...allTippingHand);
    const allTippingHandMale = [
        tippingHandMale,
        tippingHandLightSkinToneMale,
        tippingHandMediumLightSkinToneMale,
        tippingHandMediumSkinToneMale,
        tippingHandMediumDarkSkinToneMale,
        tippingHandDarkSkinToneMale
    ];
    const allTippingHandMaleGroup = new EmojiGroup("\u{1F481}\uDC81\u200D\u2642\uFE0F", "Tipping Hand: Male", ...allTippingHandMale);
    const allTippingHandFemale = [
        tippingHandFemale,
        tippingHandLightSkinToneFemale,
        tippingHandMediumLightSkinToneFemale,
        tippingHandMediumSkinToneFemale,
        tippingHandMediumDarkSkinToneFemale,
        tippingHandDarkSkinToneFemale
    ];
    const allTippingHandFemaleGroup = new EmojiGroup("\u{1F481}\uDC81\u200D\u2640\uFE0F", "Tipping Hand: Female", ...allTippingHandFemale);
    const allHandTippersGroup = [
        allTippingHandGroup,
        allTippingHandMaleGroup,
        allTippingHandFemaleGroup
    ];
    const allHandTippersGroupGroup = new EmojiGroup("\u{1F481}\uDC81", "Tipping Hand", ...allHandTippersGroup);
    const allRaisingHand = [
        raisingHand,
        raisingHandLightSkinTone,
        raisingHandMediumLightSkinTone,
        raisingHandMediumSkinTone,
        raisingHandMediumDarkSkinTone,
        raisingHandDarkSkinTone
    ];
    const allRaisingHandGroup = new EmojiGroup("\u{1F64B}\uDE4B", "Raising Hand", ...allRaisingHand);
    const allRaisingHandMale = [
        raisingHandMale,
        raisingHandLightSkinToneMale,
        raisingHandMediumLightSkinToneMale,
        raisingHandMediumSkinToneMale,
        raisingHandMediumDarkSkinToneMale,
        raisingHandDarkSkinToneMale
    ];
    const allRaisingHandMaleGroup = new EmojiGroup("\u{1F64B}\uDE4B\u200D\u2642\uFE0F", "Raising Hand: Male", ...allRaisingHandMale);
    const allRaisingHandFemale = [
        raisingHandFemale,
        raisingHandLightSkinToneFemale,
        raisingHandMediumLightSkinToneFemale,
        raisingHandMediumSkinToneFemale,
        raisingHandMediumDarkSkinToneFemale,
        raisingHandDarkSkinToneFemale
    ];
    const allRaisingHandFemaleGroup = new EmojiGroup("\u{1F64B}\uDE4B\u200D\u2640\uFE0F", "Raising Hand: Female", ...allRaisingHandFemale);
    const allHandRaisers = [
        allRaisingHandGroup,
        allRaisingHandMaleGroup,
        allRaisingHandFemaleGroup
    ];
    const allHandRaisersGroup = new EmojiGroup("\u{1F64B}\uDE4B", "Raising Hand", ...allHandRaisers);
    const allBowing = [
        bowing,
        bowingLightSkinTone,
        bowingMediumLightSkinTone,
        bowingMediumSkinTone,
        bowingMediumDarkSkinTone,
        bowingDarkSkinTone
    ];
    const allBowingGroup = new EmojiGroup("\u{1F647}\uDE47", "Bowing", ...allBowing);
    const allBowingMale = [
        bowingMale,
        bowingLightSkinToneMale,
        bowingMediumLightSkinToneMale,
        bowingMediumSkinToneMale,
        bowingMediumDarkSkinToneMale,
        bowingDarkSkinToneMale
    ];
    const allBowingMaleGroup = new EmojiGroup("\u{1F647}\uDE47\u200D\u2642\uFE0F", "Bowing: Male", ...allBowingMale);
    const allBowingFemale = [
        bowingFemale,
        bowingLightSkinToneFemale,
        bowingMediumLightSkinToneFemale,
        bowingMediumSkinToneFemale,
        bowingMediumDarkSkinToneFemale,
        bowingDarkSkinToneFemale
    ];
    const allBowingFemaleGroup = new EmojiGroup("\u{1F647}\uDE47\u200D\u2640\uFE0F", "Bowing: Female", ...allBowingFemale);
    const allBowers = [
        allBowingGroup,
        allBowingMaleGroup,
        allBowingFemaleGroup
    ];
    const allBowersGroup = new EmojiGroup("\u{1F647}\uDE47", "Bowing", ...allBowers);
    const allFacepalming = [
        facepalming,
        facepalmingLightSkinTone,
        facepalmingMediumLightSkinTone,
        facepalmingMediumSkinTone,
        facepalmingMediumDarkSkinTone,
        facepalmingDarkSkinTone
    ];
    const allFacepalmingGroup = new EmojiGroup("\u{1F926}\uDD26", "Facepalming", ...allFacepalming);
    const allFacepalmingMale = [
        facepalmingMale,
        facepalmingLightSkinToneMale,
        facepalmingMediumLightSkinToneMale,
        facepalmingMediumSkinToneMale,
        facepalmingMediumDarkSkinToneMale,
        facepalmingDarkSkinToneMale
    ];
    const allFacepalmingMaleGroup = new EmojiGroup("\u{1F926}\uDD26\u200D\u2642\uFE0F", "Facepalming: Male", ...allFacepalmingMale);
    const allFacepalmingFemale = [
        facepalmingFemale,
        facepalmingLightSkinToneFemale,
        facepalmingMediumLightSkinToneFemale,
        facepalmingMediumSkinToneFemale,
        facepalmingMediumDarkSkinToneFemale,
        facepalmingDarkSkinToneFemale
    ];
    const allFacepalmingFemaleGroup = new EmojiGroup("\u{1F926}\uDD26\u200D\u2640\uFE0F", "Facepalming: Female", ...allFacepalmingFemale);
    const allFacepalmers = [
        allFacepalmingGroup,
        allFacepalmingMaleGroup,
        allFacepalmingFemaleGroup
    ];
    const allFacepalmersGroup = new EmojiGroup("\u{1F926}\uDD26", "Facepalming", ...allFacepalmers);
    const allShrugging = [
        shrugging,
        shruggingLightSkinTone,
        shruggingMediumLightSkinTone,
        shruggingMediumSkinTone,
        shruggingMediumDarkSkinTone,
        shruggingDarkSkinTone
    ];
    const allShruggingGroup = new EmojiGroup("\u{1F937}\uDD37", "Shrugging", ...allShrugging);
    const allShruggingMale = [
        shruggingMale,
        shruggingLightSkinToneMale,
        shruggingMediumLightSkinToneMale,
        shruggingMediumSkinToneMale,
        shruggingMediumDarkSkinToneMale,
        shruggingDarkSkinToneMale
    ];
    const allShruggingMaleGroup = new EmojiGroup("\u{1F937}\uDD37\u200D\u2642\uFE0F", "Shrugging: Male", ...allShruggingMale);
    const allShruggingFemale = [
        shruggingFemale,
        shruggingLightSkinToneFemale,
        shruggingMediumLightSkinToneFemale,
        shruggingMediumSkinToneFemale,
        shruggingMediumDarkSkinToneFemale,
        shruggingDarkSkinToneFemale
    ];
    const allShruggingFemaleGroup = new EmojiGroup("\u{1F937}\uDD37\u200D\u2640\uFE0F", "Shrugging: Female", ...allShruggingFemale);
    const allShruggers = [
        allShruggingGroup,
        allShruggingMaleGroup,
        allShruggingFemaleGroup
    ];
    const allShruggersGroup = new EmojiGroup("\u{1F937}\uDD37", "Shrugging", ...allShruggers);
    const allCantHear = [
        cantHear,
        cantHearLightSkinTone,
        cantHearMediumLightSkinTone,
        cantHearMediumSkinTone,
        cantHearMediumDarkSkinTone,
        cantHearDarkSkinTone
    ];
    const allCantHearGroup = new EmojiGroup("\u{1F9CF}\uDDCF", "Can't Hear", ...allCantHear);
    const allCantHearMale = [
        cantHearMale,
        cantHearLightSkinToneMale,
        cantHearMediumLightSkinToneMale,
        cantHearMediumSkinToneMale,
        cantHearMediumDarkSkinToneMale,
        cantHearDarkSkinToneMale
    ];
    const allCantHearMaleGroup = new EmojiGroup("\u{1F9CF}\uDDCF\u200D\u2642\uFE0F", "Can't Hear: Male", ...allCantHearMale);
    const allCantHearFemale = [
        cantHearFemale,
        cantHearLightSkinToneFemale,
        cantHearMediumLightSkinToneFemale,
        cantHearMediumSkinToneFemale,
        cantHearMediumDarkSkinToneFemale,
        cantHearDarkSkinToneFemale
    ];
    const allCantHearFemaleGroup = new EmojiGroup("\u{1F9CF}\uDDCF\u200D\u2640\uFE0F", "Can't Hear: Female", ...allCantHearFemale);
    const allCantHearers = [
        allCantHearGroup,
        allCantHearMaleGroup,
        allCantHearFemaleGroup
    ];
    const allCantHearersGroup = new EmojiGroup("\u{1F9CF}\uDDCF", "Can't Hear", ...allCantHearers);
    const allGettingMassage = [
        gettingMassage,
        gettingMassageLightSkinTone,
        gettingMassageMediumLightSkinTone,
        gettingMassageMediumSkinTone,
        gettingMassageMediumDarkSkinTone,
        gettingMassageDarkSkinTone
    ];
    const allGettingMassageGroup = new EmojiGroup("\u{1F486}\uDC86", "Getting Massage", ...allGettingMassage);
    const allGettingMassageMale = [
        gettingMassageMale,
        gettingMassageLightSkinToneMale,
        gettingMassageMediumLightSkinToneMale,
        gettingMassageMediumSkinToneMale,
        gettingMassageMediumDarkSkinToneMale,
        gettingMassageDarkSkinToneMale
    ];
    const allGettingMassageMaleGroup = new EmojiGroup("\u{1F486}\uDC86\u200D\u2642\uFE0F", "Getting Massage: Male", ...allGettingMassageMale);
    const allGettingMassageFemale = [
        gettingMassageFemale,
        gettingMassageLightSkinToneFemale,
        gettingMassageMediumLightSkinToneFemale,
        gettingMassageMediumSkinToneFemale,
        gettingMassageMediumDarkSkinToneFemale,
        gettingMassageDarkSkinToneFemale
    ];
    const allGettingMassageFemaleGroup = new EmojiGroup("\u{1F486}\uDC86\u200D\u2640\uFE0F", "Getting Massage: Female", ...allGettingMassageFemale);
    const allGettingMassaged = [
        allGettingMassageGroup,
        allGettingMassageMaleGroup,
        allGettingMassageFemaleGroup
    ];
    const allGettingMassagedGroup = new EmojiGroup("\u{1F486}\uDC86", "Getting Massage", ...allGettingMassaged);
    const allGettingHaircut = [
        gettingHaircut,
        gettingHaircutLightSkinTone,
        gettingHaircutMediumLightSkinTone,
        gettingHaircutMediumSkinTone,
        gettingHaircutMediumDarkSkinTone,
        gettingHaircutDarkSkinTone
    ];
    const allGettingHaircutGroup = new EmojiGroup("\u{1F487}\uDC87", "Getting Haircut", ...allGettingHaircut);
    const allGettingHaircutMale = [
        gettingHaircutMale,
        gettingHaircutLightSkinToneMale,
        gettingHaircutMediumLightSkinToneMale,
        gettingHaircutMediumSkinToneMale,
        gettingHaircutMediumDarkSkinToneMale,
        gettingHaircutDarkSkinToneMale
    ];
    const allGettingHaircutMaleGroup = new EmojiGroup("\u{1F487}\uDC87\u200D\u2642\uFE0F", "Getting Haircut: Male", ...allGettingHaircutMale);
    const allGettingHaircutFemale = [
        gettingHaircutFemale,
        gettingHaircutLightSkinToneFemale,
        gettingHaircutMediumLightSkinToneFemale,
        gettingHaircutMediumSkinToneFemale,
        gettingHaircutMediumDarkSkinToneFemale,
        gettingHaircutDarkSkinToneFemale
    ];
    const allGettingHaircutFemaleGroup = new EmojiGroup("\u{1F487}\uDC87\u200D\u2640\uFE0F", "Getting Haircut: Female", ...allGettingHaircutFemale);
    const allHairCutters = [
        allGettingHaircutGroup,
        allGettingHaircutMaleGroup,
        allGettingHaircutFemaleGroup
    ];
    const allHairCuttersGroup = new EmojiGroup("\u{1F487}\uDC87", "Getting Haircut", ...allHairCutters);
    const allConstructionWorker = [
        constructionWorker,
        constructionWorkerLightSkinTone,
        constructionWorkerMediumLightSkinTone,
        constructionWorkerMediumSkinTone,
        constructionWorkerMediumDarkSkinTone,
        constructionWorkerDarkSkinTone
    ];
    const allConstructionWorkerGroup = new EmojiGroup("\u{1F477}\uDC77", "Construction Worker", ...allConstructionWorker);
    const allConstructionWorkerMale = [
        constructionWorkerMale,
        constructionWorkerLightSkinToneMale,
        constructionWorkerMediumLightSkinToneMale,
        constructionWorkerMediumSkinToneMale,
        constructionWorkerMediumDarkSkinToneMale,
        constructionWorkerDarkSkinToneMale
    ];
    const allConstructionWorkerMaleGroup = new EmojiGroup("\u{1F477}\uDC77\u200D\u2642\uFE0F", "Construction Worker: Male", ...allConstructionWorkerMale);
    const allConstructionWorkerFemale = [
        constructionWorkerFemale,
        constructionWorkerLightSkinToneFemale,
        constructionWorkerMediumLightSkinToneFemale,
        constructionWorkerMediumSkinToneFemale,
        constructionWorkerMediumDarkSkinToneFemale,
        constructionWorkerDarkSkinToneFemale
    ];
    const allConstructionWorkerFemaleGroup = new EmojiGroup("\u{1F477}\uDC77\u200D\u2640\uFE0F", "Construction Worker: Female", ...allConstructionWorkerFemale);
    const allConstructionWorkers = [
        allConstructionWorkerGroup,
        allConstructionWorkerMaleGroup,
        allConstructionWorkerFemaleGroup
    ];
    const allConstructionWorkersGroup = new EmojiGroup("\u{1F477}\uDC77", "Construction Worker", ...allConstructionWorkers);
    const allGuard = [
        guard,
        guardLightSkinTone,
        guardMediumLightSkinTone,
        guardMediumSkinTone,
        guardMediumDarkSkinTone,
        guardDarkSkinTone
    ];
    const allGuardGroup = new EmojiGroup("\u{1F482}\uDC82", "Guard", ...allGuard);
    const allGuardMale = [
        guardMale,
        guardLightSkinToneMale,
        guardMediumLightSkinToneMale,
        guardMediumSkinToneMale,
        guardMediumDarkSkinToneMale,
        guardDarkSkinToneMale
    ];
    const allGuardMaleGroup = new EmojiGroup("\u{1F482}\uDC82\u200D\u2642\uFE0F", "Guard: Male", ...allGuardMale);
    const allGuardFemale = [
        guardFemale,
        guardLightSkinToneFemale,
        guardMediumLightSkinToneFemale,
        guardMediumSkinToneFemale,
        guardMediumDarkSkinToneFemale,
        guardDarkSkinToneFemale
    ];
    const allGuardFemaleGroup = new EmojiGroup("\u{1F482}\uDC82\u200D\u2640\uFE0F", "Guard: Female", ...allGuardFemale);
    const allGuards = [
        allGuardGroup,
        allGuardMaleGroup,
        allGuardFemaleGroup
    ];
    const allGuardsGroup = new EmojiGroup("\u{1F482}\uDC82", "Guard", ...allGuards);
    const allSpy = [
        spy,
        spyLightSkinTone,
        spyMediumLightSkinTone,
        spyMediumSkinTone,
        spyMediumDarkSkinTone,
        spyDarkSkinTone
    ];
    const allSpyGroup = new EmojiGroup("\u{1F575}\uDD75", "Spy", ...allSpy);
    const allSpyMale = [
        spyMale,
        spyLightSkinToneMale,
        spyMediumLightSkinToneMale,
        spyMediumSkinToneMale,
        spyMediumDarkSkinToneMale,
        spyDarkSkinToneMale
    ];
    const allSpyMaleGroup = new EmojiGroup("\u{1F575}\uDD75\u200D\u2642\uFE0F", "Spy: Male", ...allSpyMale);
    const allSpyFemale = [
        spyFemale,
        spyLightSkinToneFemale,
        spyMediumLightSkinToneFemale,
        spyMediumSkinToneFemale,
        spyMediumDarkSkinToneFemale,
        spyDarkSkinToneFemale
    ];
    const allSpyFemaleGroup = new EmojiGroup("\u{1F575}\uDD75\u200D\u2640\uFE0F", "Spy: Female", ...allSpyFemale);
    const allSpies = [
        allSpyGroup,
        allSpyMaleGroup,
        allSpyFemaleGroup
    ];
    const allSpiesGroup = new EmojiGroup("\u{1F575}\uDD75", "Spy", ...allSpies);
    const allPolice = [
        police,
        policeLightSkinTone,
        policeMediumLightSkinTone,
        policeMediumSkinTone,
        policeMediumDarkSkinTone,
        policeDarkSkinTone
    ];
    const allPoliceGroup = new EmojiGroup("\u{1F46E}\uDC6E", "Police", ...allPolice);
    const allPoliceMale = [
        policeMale,
        policeLightSkinToneMale,
        policeMediumLightSkinToneMale,
        policeMediumSkinToneMale,
        policeMediumDarkSkinToneMale,
        policeDarkSkinToneMale
    ];
    const allPoliceMaleGroup = new EmojiGroup("\u{1F46E}\uDC6E\u200D\u2642\uFE0F", "Police: Male", ...allPoliceMale);
    const allPoliceFemale = [
        policeFemale,
        policeLightSkinToneFemale,
        policeMediumLightSkinToneFemale,
        policeMediumSkinToneFemale,
        policeMediumDarkSkinToneFemale,
        policeDarkSkinToneFemale
    ];
    const allPoliceFemaleGroup = new EmojiGroup("\u{1F46E}\uDC6E\u200D\u2640\uFE0F", "Police: Female", ...allPoliceFemale);
    const allCops = [
        allPoliceGroup,
        allPoliceMaleGroup,
        allPoliceFemaleGroup
    ];
    new EmojiGroup("\u{1F46E}\uDC6E", "Police", ...allCops);
    const allWearingTurban = [
        wearingTurban,
        wearingTurbanLightSkinTone,
        wearingTurbanMediumLightSkinTone,
        wearingTurbanMediumSkinTone,
        wearingTurbanMediumDarkSkinTone,
        wearingTurbanDarkSkinTone
    ];
    const allWearingTurbanGroup = new EmojiGroup("\u{1F473}\uDC73", "Wearing Turban", ...allWearingTurban);
    const allWearingTurbanMale = [
        wearingTurbanMale,
        wearingTurbanLightSkinToneMale,
        wearingTurbanMediumLightSkinToneMale,
        wearingTurbanMediumSkinToneMale,
        wearingTurbanMediumDarkSkinToneMale,
        wearingTurbanDarkSkinToneMale
    ];
    const allWearingTurbanMaleGroup = new EmojiGroup("\u{1F473}\uDC73\u200D\u2642\uFE0F", "Wearing Turban: Male", ...allWearingTurbanMale);
    const allWearingTurbanFemale = [
        wearingTurbanFemale,
        wearingTurbanLightSkinToneFemale,
        wearingTurbanMediumLightSkinToneFemale,
        wearingTurbanMediumSkinToneFemale,
        wearingTurbanMediumDarkSkinToneFemale,
        wearingTurbanDarkSkinToneFemale
    ];
    const allWearingTurbanFemaleGroup = new EmojiGroup("\u{1F473}\uDC73\u200D\u2640\uFE0F", "Wearing Turban: Female", ...allWearingTurbanFemale);
    const allTurbanWearers = [
        allWearingTurbanGroup,
        allWearingTurbanMaleGroup,
        allWearingTurbanFemaleGroup
    ];
    new EmojiGroup("\u{1F473}\uDC73", "Wearing Turban", ...allTurbanWearers);
    const allSuperhero = [
        superhero,
        superheroLightSkinTone,
        superheroMediumLightSkinTone,
        superheroMediumSkinTone,
        superheroMediumDarkSkinTone,
        superheroDarkSkinTone
    ];
    const allSuperheroGroup = new EmojiGroup("\u{1F9B8}\uDDB8", "Superhero", ...allSuperhero);
    const allSuperheroMale = [
        superheroMale,
        superheroLightSkinToneMale,
        superheroMediumLightSkinToneMale,
        superheroMediumSkinToneMale,
        superheroMediumDarkSkinToneMale,
        superheroDarkSkinToneMale
    ];
    const allSuperheroMaleGroup = new EmojiGroup("\u{1F9B8}\uDDB8\u200D\u2642\uFE0F", "Superhero: Male", ...allSuperheroMale);
    const allSuperheroFemale = [
        superheroFemale,
        superheroLightSkinToneFemale,
        superheroMediumLightSkinToneFemale,
        superheroMediumSkinToneFemale,
        superheroMediumDarkSkinToneFemale,
        superheroDarkSkinToneFemale
    ];
    const allSuperheroFemaleGroup = new EmojiGroup("\u{1F9B8}\uDDB8\u200D\u2640\uFE0F", "Superhero: Female", ...allSuperheroFemale);
    const allSuperheroes = [
        allSuperheroGroup,
        allSuperheroMaleGroup,
        allSuperheroFemaleGroup
    ];
    const allSuperheroesGroup = new EmojiGroup("\u{1F9B8}\uDDB8", "Superhero", ...allSuperheroes);
    const allSupervillain = [
        supervillain,
        supervillainLightSkinTone,
        supervillainMediumLightSkinTone,
        supervillainMediumSkinTone,
        supervillainMediumDarkSkinTone,
        supervillainDarkSkinTone
    ];
    const allSupervillainGroup = new EmojiGroup("\u{1F9B9}\uDDB9", "Supervillain", ...allSupervillain);
    const allSupervillainMale = [
        supervillainMale,
        supervillainLightSkinToneMale,
        supervillainMediumLightSkinToneMale,
        supervillainMediumSkinToneMale,
        supervillainMediumDarkSkinToneMale,
        supervillainDarkSkinToneMale
    ];
    const allSupervillainMaleGroup = new EmojiGroup("\u{1F9B9}\uDDB9\u200D\u2642\uFE0F", "Supervillain: Male", ...allSupervillainMale);
    const allSupervillainFemale = [
        supervillainFemale,
        supervillainLightSkinToneFemale,
        supervillainMediumLightSkinToneFemale,
        supervillainMediumSkinToneFemale,
        supervillainMediumDarkSkinToneFemale,
        supervillainDarkSkinToneFemale
    ];
    const allSupervillainFemaleGroup = new EmojiGroup("\u{1F9B9}\uDDB9\u200D\u2640\uFE0F", "Supervillain: Female", ...allSupervillainFemale);
    const allSupervillains = [
        allSupervillainGroup,
        allSupervillainMaleGroup,
        allSupervillainFemaleGroup
    ];
    const allSupervillainsGroup = new EmojiGroup("\u{1F9B9}\uDDB9", "Supervillain", ...allSupervillains);
    const allMage = [
        mage,
        mageLightSkinTone,
        mageMediumLightSkinTone,
        mageMediumSkinTone,
        mageMediumDarkSkinTone,
        mageDarkSkinTone
    ];
    const allMageGroup = new EmojiGroup("\u{1F9D9}\uDDD9", "Mage", ...allMage);
    const allMageMale = [
        mageMale,
        mageLightSkinToneMale,
        mageMediumLightSkinToneMale,
        mageMediumSkinToneMale,
        mageMediumDarkSkinToneMale,
        mageDarkSkinToneMale
    ];
    const allMageMaleGroup = new EmojiGroup("\u{1F9D9}\uDDD9\u200D\u2642\uFE0F", "Mage: Male", ...allMageMale);
    const allMageFemale = [
        mageFemale,
        mageLightSkinToneFemale,
        mageMediumLightSkinToneFemale,
        mageMediumSkinToneFemale,
        mageMediumDarkSkinToneFemale,
        mageDarkSkinToneFemale
    ];
    const allMageFemaleGroup = new EmojiGroup("\u{1F9D9}\uDDD9\u200D\u2640\uFE0F", "Mage: Female", ...allMageFemale);
    const allMages = [
        allMageGroup,
        allMageMaleGroup,
        allMageFemaleGroup
    ];
    const allMagesGroup = new EmojiGroup("\u{1F9D9}\uDDD9", "Mage", ...allMages);
    const allFairy = [
        fairy,
        fairyLightSkinTone,
        fairyMediumLightSkinTone,
        fairyMediumSkinTone,
        fairyMediumDarkSkinTone,
        fairyDarkSkinTone
    ];
    const allFairyGroup = new EmojiGroup("\u{1F9DA}\uDDDA", "Fairy", ...allFairy);
    const allFairyMale = [
        fairyMale,
        fairyLightSkinToneMale,
        fairyMediumLightSkinToneMale,
        fairyMediumSkinToneMale,
        fairyMediumDarkSkinToneMale,
        fairyDarkSkinToneMale
    ];
    const allFairyMaleGroup = new EmojiGroup("\u{1F9DA}\uDDDA\u200D\u2642\uFE0F", "Fairy: Male", ...allFairyMale);
    const allFairyFemale = [
        fairyFemale,
        fairyLightSkinToneFemale,
        fairyMediumLightSkinToneFemale,
        fairyMediumSkinToneFemale,
        fairyMediumDarkSkinToneFemale,
        fairyDarkSkinToneFemale
    ];
    const allFairyFemaleGroup = new EmojiGroup("\u{1F9DA}\uDDDA\u200D\u2640\uFE0F", "Fairy: Female", ...allFairyFemale);
    const allFairies = [
        allFairyGroup,
        allFairyMaleGroup,
        allFairyFemaleGroup
    ];
    const allFairiesGroup = new EmojiGroup("\u{1F9DA}\uDDDA", "Fairy", ...allFairies);
    const allVampire = [
        vampire,
        vampireLightSkinTone,
        vampireMediumLightSkinTone,
        vampireMediumSkinTone,
        vampireMediumDarkSkinTone,
        vampireDarkSkinTone
    ];
    const allVampireGroup = new EmojiGroup("\u{1F9DB}\uDDDB", "Vampire", ...allVampire);
    const allVampireMale = [
        vampireMale,
        vampireLightSkinToneMale,
        vampireMediumLightSkinToneMale,
        vampireMediumSkinToneMale,
        vampireMediumDarkSkinToneMale,
        vampireDarkSkinToneMale
    ];
    const allVampireMaleGroup = new EmojiGroup("\u{1F9DB}\uDDDB\u200D\u2642\uFE0F", "Vampire: Male", ...allVampireMale);
    const allVampireFemale = [
        vampireFemale,
        vampireLightSkinToneFemale,
        vampireMediumLightSkinToneFemale,
        vampireMediumSkinToneFemale,
        vampireMediumDarkSkinToneFemale,
        vampireDarkSkinToneFemale
    ];
    const allVampireFemaleGroup = new EmojiGroup("\u{1F9DB}\uDDDB\u200D\u2640\uFE0F", "Vampire: Female", ...allVampireFemale);
    const allVampires = [
        allVampireGroup,
        allVampireMaleGroup,
        allVampireFemaleGroup
    ];
    const allVampiresGroup = new EmojiGroup("\u{1F9DB}\uDDDB", "Vampire", ...allVampires);
    const allMerperson = [
        merperson,
        merpersonLightSkinTone,
        merpersonMediumLightSkinTone,
        merpersonMediumSkinTone,
        merpersonMediumDarkSkinTone,
        merpersonDarkSkinTone
    ];
    const allMerpersonGroup = new EmojiGroup("\u{1F9DC}\uDDDC", "Merperson", ...allMerperson);
    const allMerpersonMale = [
        merpersonMale,
        merpersonLightSkinToneMale,
        merpersonMediumLightSkinToneMale,
        merpersonMediumSkinToneMale,
        merpersonMediumDarkSkinToneMale,
        merpersonDarkSkinToneMale
    ];
    const allMerpersonMaleGroup = new EmojiGroup("\u{1F9DC}\uDDDC\u200D\u2642\uFE0F", "Merperson: Male", ...allMerpersonMale);
    const allMerpersonFemale = [
        merpersonFemale,
        merpersonLightSkinToneFemale,
        merpersonMediumLightSkinToneFemale,
        merpersonMediumSkinToneFemale,
        merpersonMediumDarkSkinToneFemale,
        merpersonDarkSkinToneFemale
    ];
    const allMerpersonFemaleGroup = new EmojiGroup("\u{1F9DC}\uDDDC\u200D\u2640\uFE0F", "Merperson: Female", ...allMerpersonFemale);
    const allMerpeople = [
        allMerpersonGroup,
        allMerpersonMaleGroup,
        allMerpersonFemaleGroup
    ];
    const allMerpeopleGroup = new EmojiGroup("\u{1F9DC}\uDDDC", "Merperson", ...allMerpeople);
    const allElf = [
        elf,
        elfLightSkinTone,
        elfMediumLightSkinTone,
        elfMediumSkinTone,
        elfMediumDarkSkinTone,
        elfDarkSkinTone
    ];
    const allElfGroup = new EmojiGroup("\u{1F9DD}\uDDDD", "Elf", ...allElf);
    const allElfMale = [
        elfMale,
        elfLightSkinToneMale,
        elfMediumLightSkinToneMale,
        elfMediumSkinToneMale,
        elfMediumDarkSkinToneMale,
        elfDarkSkinToneMale
    ];
    const allElfMaleGroup = new EmojiGroup("\u{1F9DD}\uDDDD\u200D\u2642\uFE0F", "Elf: Male", ...allElfMale);
    const allElfFemale = [
        elfFemale,
        elfLightSkinToneFemale,
        elfMediumLightSkinToneFemale,
        elfMediumSkinToneFemale,
        elfMediumDarkSkinToneFemale,
        elfDarkSkinToneFemale
    ];
    const allElfFemaleGroup = new EmojiGroup("\u{1F9DD}\uDDDD\u200D\u2640\uFE0F", "Elf: Female", ...allElfFemale);
    const allElves = [
        allElfGroup,
        allElfMaleGroup,
        allElfFemaleGroup
    ];
    const allElvesGroup = new EmojiGroup("\u{1F9DD}\uDDDD", "Elf", ...allElves);
    const allWalking = [
        walking,
        walkingLightSkinTone,
        walkingMediumLightSkinTone,
        walkingMediumSkinTone,
        walkingMediumDarkSkinTone,
        walkingDarkSkinTone
    ];
    const allWalkingGroup = new EmojiGroup("\u{1F6B6}\uDEB6", "Walking", ...allWalking);
    const allWalkingMale = [
        walkingMale,
        walkingLightSkinToneMale,
        walkingMediumLightSkinToneMale,
        walkingMediumSkinToneMale,
        walkingMediumDarkSkinToneMale,
        walkingDarkSkinToneMale
    ];
    const allWalkingMaleGroup = new EmojiGroup("\u{1F6B6}\uDEB6\u200D\u2642\uFE0F", "Walking: Male", ...allWalkingMale);
    const allWalkingFemale = [
        walkingFemale,
        walkingLightSkinToneFemale,
        walkingMediumLightSkinToneFemale,
        walkingMediumSkinToneFemale,
        walkingMediumDarkSkinToneFemale,
        walkingDarkSkinToneFemale
    ];
    const allWalkingFemaleGroup = new EmojiGroup("\u{1F6B6}\uDEB6\u200D\u2640\uFE0F", "Walking: Female", ...allWalkingFemale);
    const allWalkers = [
        allWalkingGroup,
        allWalkingMaleGroup,
        allWalkingFemaleGroup
    ];
    const allWalkersGroup = new EmojiGroup("\u{1F6B6}\uDEB6", "Walking", ...allWalkers);
    const allStanding = [
        standing,
        standingLightSkinTone,
        standingMediumLightSkinTone,
        standingMediumSkinTone,
        standingMediumDarkSkinTone,
        standingDarkSkinTone
    ];
    const allStandingGroup = new EmojiGroup("\u{1F9CD}\uDDCD", "Standing", ...allStanding);
    const allStandingMale = [
        standingMale,
        standingLightSkinToneMale,
        standingMediumLightSkinToneMale,
        standingMediumSkinToneMale,
        standingMediumDarkSkinToneMale,
        standingDarkSkinToneMale
    ];
    const allStandingMaleGroup = new EmojiGroup("\u{1F9CD}\uDDCD\u200D\u2642\uFE0F", "Standing: Male", ...allStandingMale);
    const allStandingFemale = [
        standingFemale,
        standingLightSkinToneFemale,
        standingMediumLightSkinToneFemale,
        standingMediumSkinToneFemale,
        standingMediumDarkSkinToneFemale,
        standingDarkSkinToneFemale
    ];
    const allStandingFemaleGroup = new EmojiGroup("\u{1F9CD}\uDDCD\u200D\u2640\uFE0F", "Standing: Female", ...allStandingFemale);
    const allStanders = [
        allStandingGroup,
        allStandingMaleGroup,
        allStandingFemaleGroup
    ];
    const allStandersGroup = new EmojiGroup("\u{1F9CD}\uDDCD", "Standing", ...allStanders);
    const allKneeling = [
        kneeling,
        kneelingLightSkinTone,
        kneelingMediumLightSkinTone,
        kneelingMediumSkinTone,
        kneelingMediumDarkSkinTone,
        kneelingDarkSkinTone
    ];
    const allKneelingGroup = new EmojiGroup("\u{1F9CE}\uDDCE", "Kneeling", ...allKneeling);
    const allKneelingMale = [
        kneelingMale,
        kneelingLightSkinToneMale,
        kneelingMediumLightSkinToneMale,
        kneelingMediumSkinToneMale,
        kneelingMediumDarkSkinToneMale,
        kneelingDarkSkinToneMale
    ];
    const allKneelingMaleGroup = new EmojiGroup("\u{1F9CE}\uDDCE\u200D\u2642\uFE0F", "Kneeling: Male", ...allKneelingMale);
    const allKneelingFemale = [
        kneelingFemale,
        kneelingLightSkinToneFemale,
        kneelingMediumLightSkinToneFemale,
        kneelingMediumSkinToneFemale,
        kneelingMediumDarkSkinToneFemale,
        kneelingDarkSkinToneFemale
    ];
    const allKneelingFemaleGroup = new EmojiGroup("\u{1F9CE}\uDDCE\u200D\u2640\uFE0F", "Kneeling: Female", ...allKneelingFemale);
    const allKneelers = [
        allKneelingGroup,
        allKneelingMaleGroup,
        allKneelingFemaleGroup
    ];
    const allKneelersGroup = new EmojiGroup("\u{1F9CE}\uDDCE", "Kneeling", ...allKneelers);
    const allRunning = [
        running,
        runningLightSkinTone,
        runningMediumLightSkinTone,
        runningMediumSkinTone,
        runningMediumDarkSkinTone,
        runningDarkSkinTone
    ];
    const allRunningGroup = new EmojiGroup("\u{1F3C3}\uDFC3", "Running", ...allRunning);
    const allRunningMale = [
        runningMale,
        runningLightSkinToneMale,
        runningMediumLightSkinToneMale,
        runningMediumSkinToneMale,
        runningMediumDarkSkinToneMale,
        runningDarkSkinToneMale
    ];
    const allRunningMaleGroup = new EmojiGroup("\u{1F3C3}\uDFC3\u200D\u2642\uFE0F", "Running: Male", ...allRunningMale);
    const allRunningFemale = [
        runningFemale,
        runningLightSkinToneFemale,
        runningMediumLightSkinToneFemale,
        runningMediumSkinToneFemale,
        runningMediumDarkSkinToneFemale,
        runningDarkSkinToneFemale
    ];
    const allRunningFemaleGroup = new EmojiGroup("\u{1F3C3}\uDFC3\u200D\u2640\uFE0F", "Running: Female", ...allRunningFemale);
    const allRunners = [
        allRunningGroup,
        allRunningMaleGroup,
        allRunningFemaleGroup
    ];
    const allRunnersGroup = new EmojiGroup("\u{1F3C3}\uDFC3", "Running", ...allRunners);
    const allGesturing = [
        allFrownersGroup,
        allPoutersGroup,
        allNoGuesturerersGroupGroup,
        allOKGesturerersGroupGroup,
        allHandTippersGroupGroup,
        allHandRaisersGroup,
        allBowersGroup,
        allFacepalmersGroup,
        allShruggersGroup,
        allCantHearersGroup,
        allGettingMassagedGroup,
        allHairCuttersGroup
    ];
    const allGesturingGroup = new EmojiGroup("\u0047\u0065\u0073\u0074\u0075\u0072\u0065\u0073", "Gestures", ...allGesturing);
    const allBaby = [
        baby,
        babyLightSkinTone,
        babyMediumLightSkinTone,
        babyMediumSkinTone,
        babyMediumDarkSkinTone,
        babyDarkSkinTone
    ];
    const allBabyGroup = new EmojiGroup("\u{1F476}\uDC76", "Baby", ...allBaby);
    const allChild = [
        child,
        childLightSkinTone,
        childMediumLightSkinTone,
        childMediumSkinTone,
        childMediumDarkSkinTone,
        childDarkSkinTone
    ];
    const allChildGroup = new EmojiGroup("\u{1F9D2}\uDDD2", "Child", ...allChild);
    const allBoy = [
        boy,
        boyLightSkinTone,
        boyMediumLightSkinTone,
        boyMediumSkinTone,
        boyMediumDarkSkinTone,
        boyDarkSkinTone
    ];
    const allBoyGroup = new EmojiGroup("\u{1F466}\uDC66", "Boy", ...allBoy);
    const allGirl = [
        girl,
        girlLightSkinTone,
        girlMediumLightSkinTone,
        girlMediumSkinTone,
        girlMediumDarkSkinTone,
        girlDarkSkinTone
    ];
    const allGirlGroup = new EmojiGroup("\u{1F467}\uDC67", "Girl", ...allGirl);
    const allChildren = [
        allChildGroup,
        allBoyGroup,
        allGirlGroup
    ];
    const allChildrenGroup = new EmojiGroup("\u{1F9D2}\uDDD2", "Child", ...allChildren);
    const allBlondPerson = [
        blondPerson,
        blondPersonLightSkinTone,
        blondPersonMediumLightSkinTone,
        blondPersonMediumSkinTone,
        blondPersonMediumDarkSkinTone,
        blondPersonDarkSkinTone
    ];
    const allBlondPersonGroup = new EmojiGroup("\u{1F471}\uDC71", "Blond Person", ...allBlondPerson);
    const allBlondPersonMale = [
        blondPersonMale,
        blondPersonLightSkinToneMale,
        blondPersonMediumLightSkinToneMale,
        blondPersonMediumSkinToneMale,
        blondPersonMediumDarkSkinToneMale,
        blondPersonDarkSkinToneMale
    ];
    const allBlondPersonMaleGroup = new EmojiGroup("\u{1F471}\uDC71\u200D\u2642\uFE0F", "Blond Person: Male", ...allBlondPersonMale);
    const allBlondPersonFemale = [
        blondPersonFemale,
        blondPersonLightSkinToneFemale,
        blondPersonMediumLightSkinToneFemale,
        blondPersonMediumSkinToneFemale,
        blondPersonMediumDarkSkinToneFemale,
        blondPersonDarkSkinToneFemale
    ];
    const allBlondPersonFemaleGroup = new EmojiGroup("\u{1F471}\uDC71\u200D\u2640\uFE0F", "Blond Person: Female", ...allBlondPersonFemale);
    const allBlondePeople = [
        allBlondPersonGroup,
        allBlondPersonMaleGroup,
        allBlondPersonFemaleGroup
    ];
    new EmojiGroup("\u{1F471}\uDC71", "Blond Person", ...allBlondePeople);
    const allPerson = [
        person,
        personLightSkinTone,
        personMediumLightSkinTone,
        personMediumSkinTone,
        personMediumDarkSkinTone,
        personDarkSkinTone,
        allBlondPersonGroup,
        allWearingTurbanGroup
    ];
    const allPersonGroup = new EmojiGroup("\u{1F9D1}\uDDD1", "Person", ...allPerson);
    const allBeardedMan = [
        beardedMan,
        beardedManLightSkinTone,
        beardedManMediumLightSkinTone,
        beardedManMediumSkinTone,
        beardedManMediumDarkSkinTone,
        beardedManDarkSkinTone
    ];
    const allBeardedManGroup = new EmojiGroup("\u{1F9D4}\uDDD4", "Bearded Man", ...allBeardedMan);
    const allManWithChineseCap = [
        manWithChineseCap,
        manWithChineseCapLightSkinTone,
        manWithChineseCapMediumLightSkinTone,
        manWithChineseCapMediumSkinTone,
        manWithChineseCapMediumDarkSkinTone,
        manWithChineseCapDarkSkinTone
    ];
    const allManWithChineseCapGroup = new EmojiGroup("\u{1F472}\uDC72", "Man With Chinese Cap", ...allManWithChineseCap);
    const allManInTuxedo = [
        manInTuxedo,
        manInTuxedoLightSkinTone,
        manInTuxedoMediumLightSkinTone,
        manInTuxedoMediumSkinTone,
        manInTuxedoMediumDarkSkinTone,
        manInTuxedoDarkSkinTone
    ];
    const allManInTuxedoGroup = new EmojiGroup("\u{1F935}\uDD35", "Man in Tuxedo", ...allManInTuxedo);
    const allMan = [
        man,
        manLightSkinTone,
        manMediumLightSkinTone,
        manMediumSkinTone,
        manMediumDarkSkinTone,
        manDarkSkinTone
    ];
    const allManGroup = new EmojiGroup("\u{1F468}\uDC68", "Man", ...allMan);
    const allManRedHair = [
        manRedHair,
        manLightSkinToneRedHair,
        manMediumLightSkinToneRedHair,
        manMediumSkinToneRedHair,
        manMediumDarkSkinToneRedHair,
        manDarkSkinToneRedHair
    ];
    const allManRedHairGroup = new EmojiGroup("\u{1F468}\uDC68\u200D\u{1F9B0}\uDDB0", "Man: Red Hair", ...allManRedHair);
    const allManCurlyHair = [
        manCurlyHair,
        manLightSkinToneCurlyHair,
        manMediumLightSkinToneCurlyHair,
        manMediumSkinToneCurlyHair,
        manMediumDarkSkinToneCurlyHair,
        manDarkSkinToneCurlyHair
    ];
    const allManCurlyHairGroup = new EmojiGroup("\u{1F468}\uDC68\u200D\u{1F9B1}\uDDB1", "Man: Curly Hair", ...allManCurlyHair);
    const allManWhiteHair = [
        manWhiteHair,
        manLightSkinToneWhiteHair,
        manMediumLightSkinToneWhiteHair,
        manMediumSkinToneWhiteHair,
        manMediumDarkSkinToneWhiteHair,
        manDarkSkinToneWhiteHair
    ];
    const allManWhiteHairGroup = new EmojiGroup("\u{1F468}\uDC68\u200D\u{1F9B3}\uDDB3", "Man: White Hair", ...allManWhiteHair);
    const allManBald = [
        manBald,
        manLightSkinToneBald,
        manMediumLightSkinToneBald,
        manMediumSkinToneBald,
        manMediumDarkSkinToneBald,
        manDarkSkinToneBald
    ];
    const allManBaldGroup = new EmojiGroup("\u{1F468}\uDC68\u200D\u{1F9B2}\uDDB2", "Man: Bald", ...allManBald);
    const allMen = [
        allManGroup,
        allManRedHairGroup,
        allManCurlyHairGroup,
        allManWhiteHairGroup,
        allManBaldGroup,
        allBlondPersonMaleGroup,
        allBeardedManGroup,
        manInSuitLevitating,
        allManWithChineseCapGroup,
        allWearingTurbanMaleGroup,
        allManInTuxedoGroup
    ];
    const allMenGroup = new EmojiGroup("\u{1F468}\uDC68", "Man", ...allMen);
    const allPregnantWoman = [
        pregnantWoman,
        pregnantWomanLightSkinTone,
        pregnantWomanMediumLightSkinTone,
        pregnantWomanMediumSkinTone,
        pregnantWomanMediumDarkSkinTone,
        pregnantWomanDarkSkinTone
    ];
    const allPregnantWomanGroup = new EmojiGroup("\u{1F930}\uDD30", "Pregnant Woman", ...allPregnantWoman);
    const allBreastFeeding = [
        breastFeeding,
        breastFeedingLightSkinTone,
        breastFeedingMediumLightSkinTone,
        breastFeedingMediumSkinTone,
        breastFeedingMediumDarkSkinTone,
        breastFeedingDarkSkinTone
    ];
    const allBreastFeedingGroup = new EmojiGroup("\u{1F931}\uDD31", "Breast-Feeding", ...allBreastFeeding);
    const allWomanWithHeadscarf = [
        womanWithHeadscarf,
        womanWithHeadscarfLightSkinTone,
        womanWithHeadscarfMediumLightSkinTone,
        womanWithHeadscarfMediumSkinTone,
        womanWithHeadscarfMediumDarkSkinTone,
        womanWithHeadscarfDarkSkinTone
    ];
    const allWomanWithHeadscarfGroup = new EmojiGroup("\u{1F9D5}\uDDD5", "Woman With Headscarf", ...allWomanWithHeadscarf);
    const allBrideWithVeil = [
        brideWithVeil,
        brideWithVeilLightSkinTone,
        brideWithVeilMediumLightSkinTone,
        brideWithVeilMediumSkinTone,
        brideWithVeilMediumDarkSkinTone,
        brideWithVeilDarkSkinTone
    ];
    const allBrideWithVeilGroup = new EmojiGroup("\u{1F470}\uDC70", "Bride With Veil", ...allBrideWithVeil);
    const allWoman = [
        woman,
        womanLightSkinTone,
        womanMediumLightSkinTone,
        womanMediumSkinTone,
        womanMediumDarkSkinTone,
        womanDarkSkinTone
    ];
    const allWomanGroup = new EmojiGroup("\u{1F469}\uDC69", "Woman", ...allWoman);
    const allWomanRedHair = [
        womanRedHair,
        womanLightSkinToneRedHair,
        womanMediumLightSkinToneRedHair,
        womanMediumSkinToneRedHair,
        womanMediumDarkSkinToneRedHair,
        womanDarkSkinToneRedHair
    ];
    const allWomanRedHairGroup = new EmojiGroup("\u{1F469}\uDC69\u200D\u{1F9B0}\uDDB0", "Woman: Red Hair", ...allWomanRedHair);
    const allWomanCurlyHair = [
        womanCurlyHair,
        womanLightSkinToneCurlyHair,
        womanMediumLightSkinToneCurlyHair,
        womanMediumSkinToneCurlyHair,
        womanMediumDarkSkinToneCurlyHair,
        womanDarkSkinToneCurlyHair
    ];
    const allWomanCurlyHairGroup = new EmojiGroup("\u{1F469}\uDC69\u200D\u{1F9B1}\uDDB1", "Woman: Curly Hair", ...allWomanCurlyHair);
    const allWomanWhiteHair = [
        womanWhiteHair,
        womanLightSkinToneWhiteHair,
        womanMediumLightSkinToneWhiteHair,
        womanMediumSkinToneWhiteHair,
        womanMediumDarkSkinToneWhiteHair,
        womanDarkSkinToneWhiteHair
    ];
    const allWomanWhiteHairGroup = new EmojiGroup("\u{1F469}\uDC69\u200D\u{1F9B3}\uDDB3", "Woman: White Hair", ...allWomanWhiteHair);
    const allWomanBald = [
        womanBald,
        womanLightSkinToneBald,
        womanMediumLightSkinToneBald,
        womanMediumSkinToneBald,
        womanMediumDarkSkinToneBald,
        womanDarkSkinToneBald
    ];
    const allWomanBaldGroup = new EmojiGroup("\u{1F469}\uDC69\u200D\u{1F9B2}\uDDB2", "Woman: Bald", ...allWomanBald);
    const allWomen = [
        allWomanGroup,
        allWomanRedHairGroup,
        allWomanCurlyHairGroup,
        allWomanWhiteHairGroup,
        allWomanBaldGroup,
        allBlondPersonFemaleGroup,
        allPregnantWomanGroup,
        allBreastFeedingGroup,
        allWomanWithHeadscarfGroup,
        allWearingTurbanFemaleGroup,
        allBrideWithVeilGroup
    ];
    const allWomenGroup = new EmojiGroup("\u{1F469}\uDC69", "Woman", ...allWomen);
    const allPersons = [
        allPersonGroup,
        allMenGroup,
        allWomenGroup
    ];
    const allPersonsGroup = new EmojiGroup("\u{1F9D1}\uDDD1", "Adult", ...allPersons);
    const allOlderPerson = [
        olderPerson,
        olderPersonLightSkinTone,
        olderPersonMediumLightSkinTone,
        olderPersonMediumSkinTone,
        olderPersonMediumDarkSkinTone,
        olderPersonDarkSkinTone
    ];
    const allOlderPersonGroup = new EmojiGroup("\u{1F9D3}\uDDD3", "Older Person", ...allOlderPerson);
    const allOldMan = [
        oldMan,
        oldManLightSkinTone,
        oldManMediumLightSkinTone,
        oldManMediumSkinTone,
        oldManMediumDarkSkinTone,
        oldManDarkSkinTone
    ];
    const allOldManGroup = new EmojiGroup("\u{1F474}\uDC74", "Old Man", ...allOldMan);
    const allOldWoman = [
        oldWoman,
        oldWomanLightSkinTone,
        oldWomanMediumLightSkinTone,
        oldWomanMediumSkinTone,
        oldWomanMediumDarkSkinTone,
        oldWomanDarkSkinTone
    ];
    const allOldWomanGroup = new EmojiGroup("\u{1F475}\uDC75", "Old Woman", ...allOldWoman);
    const allOlderPersons = [
        allOlderPersonGroup,
        allOldManGroup,
        allOldWomanGroup
    ];
    const allOlderPersonsGroup = new EmojiGroup("\u{1F9D3}\uDDD3", "Older Person", ...allOlderPersons);
    const allManHealthCare = [
        manHealthCare,
        manLightSkinToneHealthCare,
        manMediumLightSkinToneHealthCare,
        manMediumSkinToneHealthCare,
        manMediumDarkSkinToneHealthCare,
        manDarkSkinToneHealthCare
    ];
    const allManHealthCareGroup = new EmojiGroup("\u{1F468}\uDC68\u200D\u2695\uFE0F", "Man: Health Care", ...allManHealthCare);
    const allWomanHealthCare = [
        womanHealthCare,
        womanLightSkinToneHealthCare,
        womanMediumLightSkinToneHealthCare,
        womanMediumSkinToneHealthCare,
        womanMediumDarkSkinToneHealthCare,
        womanDarkSkinToneHealthCare
    ];
    const allWomanHealthCareGroup = new EmojiGroup("\u{1F469}\uDC69\u200D\u2695\uFE0F", "Woman: Health Care", ...allWomanHealthCare);
    const allMedical = [
        medical,
        allManHealthCareGroup,
        allWomanHealthCareGroup
    ];
    const allMedicalGroup = new EmojiGroup("\u2695\uFE0F", "Medical", ...allMedical);
    const allManStudent = [
        manStudent,
        manLightSkinToneStudent,
        manMediumLightSkinToneStudent,
        manMediumSkinToneStudent,
        manMediumDarkSkinToneStudent,
        manDarkSkinToneStudent
    ];
    const allManStudentGroup = new EmojiGroup("\u{1F468}\uDC68\u200D\u{1F393}\uDF93", "Man: Student", ...allManStudent);
    const allWomanStudent = [
        womanStudent,
        womanLightSkinToneStudent,
        womanMediumLightSkinToneStudent,
        womanMediumSkinToneStudent,
        womanMediumDarkSkinToneStudent,
        womanDarkSkinToneStudent
    ];
    const allWomanStudentGroup = new EmojiGroup("\u{1F469}\uDC69\u200D\u{1F393}\uDF93", "Woman: Student", ...allWomanStudent);
    const allGraduationCap = [
        graduationCap,
        allManStudentGroup,
        allWomanStudentGroup
    ];
    const allGraduationCapGroup = new EmojiGroup("\u{1F393}\uDF93", "Graduation Cap", ...allGraduationCap);
    const allManTeacher = [
        manTeacher,
        manLightSkinToneTeacher,
        manMediumLightSkinToneTeacher,
        manMediumSkinToneTeacher,
        manMediumDarkSkinToneTeacher,
        manDarkSkinToneTeacher
    ];
    const allManTeacherGroup = new EmojiGroup("\u{1F468}\uDC68\u200D\u{1F3EB}\uDFEB", "Man: Teacher", ...allManTeacher);
    const allWomanTeacher = [
        womanTeacher,
        womanLightSkinToneTeacher,
        womanMediumLightSkinToneTeacher,
        womanMediumSkinToneTeacher,
        womanMediumDarkSkinToneTeacher,
        womanDarkSkinToneTeacher
    ];
    const allWomanTeacherGroup = new EmojiGroup("\u{1F469}\uDC69\u200D\u{1F3EB}\uDFEB", "Woman: Teacher", ...allWomanTeacher);
    const allSchool = [
        school,
        allManTeacherGroup,
        allWomanTeacherGroup
    ];
    const allSchoolGroup = new EmojiGroup("\u{1F3EB}\uDFEB", "School", ...allSchool);
    const allManJudge = [
        manJudge,
        manLightSkinToneJudge,
        manMediumLightSkinToneJudge,
        manMediumSkinToneJudge,
        manMediumDarkSkinToneJudge,
        manDarkSkinToneJudge
    ];
    const allManJudgeGroup = new EmojiGroup("\u{1F468}\uDC68\u200D\u2696\uFE0F", "Man: Judge", ...allManJudge);
    const allWomanJudge = [
        womanJudge,
        womanLightSkinToneJudge,
        womanMediumLightSkinToneJudge,
        womanMediumSkinToneJudge,
        womanMediumDarkSkinToneJudge,
        womanDarkSkinToneJudge
    ];
    const allWomanJudgeGroup = new EmojiGroup("\u{1F469}\uDC69\u200D\u2696\uFE0F", "Woman: Judge", ...allWomanJudge);
    const allBalanceScale = [
        balanceScale,
        allManJudgeGroup,
        allWomanJudgeGroup
    ];
    const allBalanceScaleGroup = new EmojiGroup("\u2696\uFE0F", "Balance Scale", ...allBalanceScale);
    const allManFarmer = [
        manFarmer,
        manLightSkinToneFarmer,
        manMediumLightSkinToneFarmer,
        manMediumSkinToneFarmer,
        manMediumDarkSkinToneFarmer,
        manDarkSkinToneFarmer
    ];
    const allManFarmerGroup = new EmojiGroup("\u{1F468}\uDC68\u200D\u{1F33E}\uDF3E", "Man: Farmer", ...allManFarmer);
    const allWomanFarmer = [
        womanFarmer,
        womanLightSkinToneFarmer,
        womanMediumLightSkinToneFarmer,
        womanMediumSkinToneFarmer,
        womanMediumDarkSkinToneFarmer,
        womanDarkSkinToneFarmer
    ];
    const allWomanFarmerGroup = new EmojiGroup("\u{1F469}\uDC69\u200D\u{1F33E}\uDF3E", "Woman: Farmer", ...allWomanFarmer);
    const allSheafOfRice = [
        sheafOfRice,
        allManFarmerGroup,
        allWomanFarmerGroup
    ];
    const allSheafOfRiceGroup = new EmojiGroup("\u{1F33E}\uDF3E", "Sheaf of Rice", ...allSheafOfRice);
    const allManCook = [
        manCook,
        manLightSkinToneCook,
        manMediumLightSkinToneCook,
        manMediumSkinToneCook,
        manMediumDarkSkinToneCook,
        manDarkSkinToneCook
    ];
    const allManCookGroup = new EmojiGroup("\u{1F468}\uDC68\u200D\u{1F373}\uDF73", "Man: Cook", ...allManCook);
    const allWomanCook = [
        womanCook,
        womanLightSkinToneCook,
        womanMediumLightSkinToneCook,
        womanMediumSkinToneCook,
        womanMediumDarkSkinToneCook,
        womanDarkSkinToneCook
    ];
    const allWomanCookGroup = new EmojiGroup("\u{1F469}\uDC69\u200D\u{1F373}\uDF73", "Woman: Cook", ...allWomanCook);
    const allCooking = [
        cooking,
        allManCookGroup,
        allWomanCookGroup
    ];
    const allCookingGroup = new EmojiGroup("\u{1F373}\uDF73", "Cooking", ...allCooking);
    const allManMechanic = [
        manMechanic,
        manLightSkinToneMechanic,
        manMediumLightSkinToneMechanic,
        manMediumSkinToneMechanic,
        manMediumDarkSkinToneMechanic,
        manDarkSkinToneMechanic
    ];
    const allManMechanicGroup = new EmojiGroup("\u{1F468}\uDC68\u200D\u{1F527}\uDD27", "Man: Mechanic", ...allManMechanic);
    const allWomanMechanic = [
        womanMechanic,
        womanLightSkinToneMechanic,
        womanMediumLightSkinToneMechanic,
        womanMediumSkinToneMechanic,
        womanMediumDarkSkinToneMechanic,
        womanDarkSkinToneMechanic
    ];
    const allWomanMechanicGroup = new EmojiGroup("\u{1F469}\uDC69\u200D\u{1F527}\uDD27", "Woman: Mechanic", ...allWomanMechanic);
    const allWrench = [
        wrench,
        allManMechanicGroup,
        allWomanMechanicGroup
    ];
    const allWrenchGroup = new EmojiGroup("\u{1F527}\uDD27", "Wrench", ...allWrench);
    const allManFactoryWorker = [
        manFactoryWorker,
        manLightSkinToneFactoryWorker,
        manMediumLightSkinToneFactoryWorker,
        manMediumSkinToneFactoryWorker,
        manMediumDarkSkinToneFactoryWorker,
        manDarkSkinToneFactoryWorker
    ];
    const allManFactoryWorkerGroup = new EmojiGroup("\u{1F468}\uDC68\u200D\u{1F3ED}\uDFED", "Man: Factory Worker", ...allManFactoryWorker);
    const allWomanFactoryWorker = [
        womanFactoryWorker,
        womanLightSkinToneFactoryWorker,
        womanMediumLightSkinToneFactoryWorker,
        womanMediumSkinToneFactoryWorker,
        womanMediumDarkSkinToneFactoryWorker,
        womanDarkSkinToneFactoryWorker
    ];
    const allWomanFactoryWorkerGroup = new EmojiGroup("\u{1F469}\uDC69\u200D\u{1F3ED}\uDFED", "Woman: Factory Worker", ...allWomanFactoryWorker);
    const allFactory = [
        factory,
        allManFactoryWorkerGroup,
        allWomanFactoryWorkerGroup
    ];
    const allFactoryGroup = new EmojiGroup("\u{1F3ED}\uDFED", "Factory", ...allFactory);
    const allManOfficeWorker = [
        manOfficeWorker,
        manLightSkinToneOfficeWorker,
        manMediumLightSkinToneOfficeWorker,
        manMediumSkinToneOfficeWorker,
        manMediumDarkSkinToneOfficeWorker,
        manDarkSkinToneOfficeWorker
    ];
    const allManOfficeWorkerGroup = new EmojiGroup("\u{1F468}\uDC68\u200D\u{1F4BC}\uDCBC", "Man: Office Worker", ...allManOfficeWorker);
    const allWomanOfficeWorker = [
        womanOfficeWorker,
        womanLightSkinToneOfficeWorker,
        womanMediumLightSkinToneOfficeWorker,
        womanMediumSkinToneOfficeWorker,
        womanMediumDarkSkinToneOfficeWorker,
        womanDarkSkinToneOfficeWorker
    ];
    const allWomanOfficeWorkerGroup = new EmojiGroup("\u{1F469}\uDC69\u200D\u{1F4BC}\uDCBC", "Woman: Office Worker", ...allWomanOfficeWorker);
    const allBriefcase = [
        briefcase,
        allManOfficeWorkerGroup,
        allWomanOfficeWorkerGroup
    ];
    const allBriefcaseGroup = new EmojiGroup("\u{1F4BC}\uDCBC", "Briefcase", ...allBriefcase);
    const allManFireFighter = [
        manFireFighter,
        manLightSkinToneFireFighter,
        manMediumLightSkinToneFireFighter,
        manMediumSkinToneFireFighter,
        manMediumDarkSkinToneFireFighter,
        manDarkSkinToneFireFighter
    ];
    const allManFireFighterGroup = new EmojiGroup("\u{1F468}\uDC68\u200D\u{1F692}\uDE92", "Man: Fire Fighter", ...allManFireFighter);
    const allWomanFireFighter = [
        womanFireFighter,
        womanLightSkinToneFireFighter,
        womanMediumLightSkinToneFireFighter,
        womanMediumSkinToneFireFighter,
        womanMediumDarkSkinToneFireFighter,
        womanDarkSkinToneFireFighter
    ];
    const allWomanFireFighterGroup = new EmojiGroup("\u{1F469}\uDC69\u200D\u{1F692}\uDE92", "Woman: Fire Fighter", ...allWomanFireFighter);
    const allFireEngine = [
        fireEngine,
        allManFireFighterGroup,
        allWomanFireFighterGroup
    ];
    const allFireEngineGroup = new EmojiGroup("\u{1F692}\uDE92", "Fire Engine", ...allFireEngine);
    const allManAstronaut = [
        manAstronaut,
        manLightSkinToneAstronaut,
        manMediumLightSkinToneAstronaut,
        manMediumSkinToneAstronaut,
        manMediumDarkSkinToneAstronaut,
        manDarkSkinToneAstronaut
    ];
    const allManAstronautGroup = new EmojiGroup("\u{1F468}\uDC68\u200D\u{1F680}\uDE80", "Man: Astronaut", ...allManAstronaut);
    const allWomanAstronaut = [
        womanAstronaut,
        womanLightSkinToneAstronaut,
        womanMediumLightSkinToneAstronaut,
        womanMediumSkinToneAstronaut,
        womanMediumDarkSkinToneAstronaut,
        womanDarkSkinToneAstronaut
    ];
    const allWomanAstronautGroup = new EmojiGroup("\u{1F469}\uDC69\u200D\u{1F680}\uDE80", "Woman: Astronaut", ...allWomanAstronaut);
    const allRocket = [
        rocket,
        allManAstronautGroup,
        allWomanAstronautGroup
    ];
    const allRocketGroup = new EmojiGroup("\u{1F680}\uDE80", "Rocket", ...allRocket);
    const allManPilot = [
        manPilot,
        manLightSkinTonePilot,
        manMediumLightSkinTonePilot,
        manMediumSkinTonePilot,
        manMediumDarkSkinTonePilot,
        manDarkSkinTonePilot
    ];
    const allManPilotGroup = new EmojiGroup("\u{1F468}\uDC68\u200D\u2708\uFE0F", "Man: Pilot", ...allManPilot);
    const allWomanPilot = [
        womanPilot,
        womanLightSkinTonePilot,
        womanMediumLightSkinTonePilot,
        womanMediumSkinTonePilot,
        womanMediumDarkSkinTonePilot,
        womanDarkSkinTonePilot
    ];
    const allWomanPilotGroup = new EmojiGroup("\u{1F469}\uDC69\u200D\u2708\uFE0F", "Woman: Pilot", ...allWomanPilot);
    const allAirplane = [
        airplane,
        allManPilotGroup,
        allWomanPilotGroup
    ];
    const allAirplaneGroup = new EmojiGroup("\u2708\uFE0F", "Airplane", ...allAirplane);
    const allManArtist = [
        manArtist,
        manLightSkinToneArtist,
        manMediumLightSkinToneArtist,
        manMediumSkinToneArtist,
        manMediumDarkSkinToneArtist,
        manDarkSkinToneArtist
    ];
    const allManArtistGroup = new EmojiGroup("\u{1F468}\uDC68\u200D\u{1F3A8}\uDFA8", "Man: Artist", ...allManArtist);
    const allWomanArtist = [
        womanArtist,
        womanLightSkinToneArtist,
        womanMediumLightSkinToneArtist,
        womanMediumSkinToneArtist,
        womanMediumDarkSkinToneArtist,
        womanDarkSkinToneArtist
    ];
    const allWomanArtistGroup = new EmojiGroup("\u{1F469}\uDC69\u200D\u{1F3A8}\uDFA8", "Woman: Artist", ...allWomanArtist);
    const allArtistPalette = [
        artistPalette,
        allManArtistGroup,
        allWomanArtistGroup
    ];
    const allArtistPaletteGroup = new EmojiGroup("\u{1F3A8}\uDFA8", "Artist Palette", ...allArtistPalette);
    const allManSinger = [
        manSinger,
        manLightSkinToneSinger,
        manMediumLightSkinToneSinger,
        manMediumSkinToneSinger,
        manMediumDarkSkinToneSinger,
        manDarkSkinToneSinger
    ];
    const allManSingerGroup = new EmojiGroup("\u{1F468}\uDC68\u200D\u{1F3A4}\uDFA4", "Man: Singer", ...allManSinger);
    const allWomanSinger = [
        womanSinger,
        womanLightSkinToneSinger,
        womanMediumLightSkinToneSinger,
        womanMediumSkinToneSinger,
        womanMediumDarkSkinToneSinger,
        womanDarkSkinToneSinger
    ];
    const allWomanSingerGroup = new EmojiGroup("\u{1F469}\uDC69\u200D\u{1F3A4}\uDFA4", "Woman: Singer", ...allWomanSinger);
    const allMicrophone = [
        microphone,
        allManSingerGroup,
        allWomanSingerGroup
    ];
    const allMicrophoneGroup = new EmojiGroup("\u{1F3A4}\uDFA4", "Microphone", ...allMicrophone);
    const allManTechnologist = [
        manTechnologist,
        manLightSkinToneTechnologist,
        manMediumLightSkinToneTechnologist,
        manMediumSkinToneTechnologist,
        manMediumDarkSkinToneTechnologist,
        manDarkSkinToneTechnologist
    ];
    const allManTechnologistGroup = new EmojiGroup("\u{1F468}\uDC68\u200D\u{1F4BB}\uDCBB", "Man: Technologist", ...allManTechnologist);
    const allWomanTechnologist = [
        womanTechnologist,
        womanLightSkinToneTechnologist,
        womanMediumLightSkinToneTechnologist,
        womanMediumSkinToneTechnologist,
        womanMediumDarkSkinToneTechnologist,
        womanDarkSkinToneTechnologist
    ];
    const allWomanTechnologistGroup = new EmojiGroup("\u{1F469}\uDC69\u200D\u{1F4BB}\uDCBB", "Woman: Technologist", ...allWomanTechnologist);
    const allLaptop = [
        laptop,
        allManTechnologistGroup,
        allWomanTechnologistGroup
    ];
    const allLaptopGroup = new EmojiGroup("\u{1F4BB}\uDCBB", "Laptop", ...allLaptop);
    const allManScientist = [
        manScientist,
        manLightSkinToneScientist,
        manMediumLightSkinToneScientist,
        manMediumSkinToneScientist,
        manMediumDarkSkinToneScientist,
        manDarkSkinToneScientist
    ];
    const allManScientistGroup = new EmojiGroup("\u{1F468}\uDC68\u200D\u{1F52C}\uDD2C", "Man: Scientist", ...allManScientist);
    const allWomanScientist = [
        womanScientist,
        womanLightSkinToneScientist,
        womanMediumLightSkinToneScientist,
        womanMediumSkinToneScientist,
        womanMediumDarkSkinToneScientist,
        womanDarkSkinToneScientist
    ];
    const allWomanScientistGroup = new EmojiGroup("\u{1F469}\uDC69\u200D\u{1F52C}\uDD2C", "Woman: Scientist", ...allWomanScientist);
    const allMicroscope = [
        microscope,
        allManScientistGroup,
        allWomanScientistGroup
    ];
    const allMicroscopeGroup = new EmojiGroup("\u{1F52C}\uDD2C", "Microscope", ...allMicroscope);
    const allPrince = [
        prince,
        princeLightSkinTone,
        princeMediumLightSkinTone,
        princeMediumSkinTone,
        princeMediumDarkSkinTone,
        princeDarkSkinTone
    ];
    const allPrinceGroup = new EmojiGroup("\u{1F934}\uDD34", "Prince", ...allPrince);
    const allPrincess = [
        princess,
        princessLightSkinTone,
        princessMediumLightSkinTone,
        princessMediumSkinTone,
        princessMediumDarkSkinTone,
        princessDarkSkinTone
    ];
    const allPrincessGroup = new EmojiGroup("\u{1F478}\uDC78", "Princess", ...allPrincess);
    const allRoyalty = [
        crown,
        allPrinceGroup,
        allPrincessGroup
    ];
    const allRoyaltyGroup = new EmojiGroup("\u{1F451}\uDC51", "Crown", ...allRoyalty);
    const allOccupation = [
        allMedicalGroup,
        allGraduationCapGroup,
        allSchoolGroup,
        allBalanceScaleGroup,
        allSheafOfRiceGroup,
        allCookingGroup,
        allWrenchGroup,
        allFactoryGroup,
        allBriefcaseGroup,
        allMicroscopeGroup,
        allLaptopGroup,
        allMicrophoneGroup,
        allArtistPaletteGroup,
        allAirplaneGroup,
        allRocketGroup,
        allFireEngineGroup,
        allSpiesGroup,
        allGuardsGroup,
        allConstructionWorkersGroup,
        allRoyaltyGroup
    ];
    const allOccupationGroup = new EmojiGroup("\u0052\u006F\u006C\u0065\u0073", "Depictions of people working", ...allOccupation);
    const allCherub = [
        cherub,
        cherubLightSkinTone,
        cherubMediumLightSkinTone,
        cherubMediumSkinTone,
        cherubMediumDarkSkinTone,
        cherubDarkSkinTone
    ];
    const allCherubGroup = new EmojiGroup("\u{1F47C}\uDC7C", "Cherub", ...allCherub);
    const allSantaClaus = [
        santaClaus,
        santaClausLightSkinTone,
        santaClausMediumLightSkinTone,
        santaClausMediumSkinTone,
        santaClausMediumDarkSkinTone,
        santaClausDarkSkinTone
    ];
    const allSantaClausGroup = new EmojiGroup("\u{1F385}\uDF85", "Santa Claus", ...allSantaClaus);
    const allMrsClaus = [
        mrsClaus,
        mrsClausLightSkinTone,
        mrsClausMediumLightSkinTone,
        mrsClausMediumSkinTone,
        mrsClausMediumDarkSkinTone,
        mrsClausDarkSkinTone
    ];
    const allMrsClausGroup = new EmojiGroup("\u{1F936}\uDD36", "Mrs. Claus", ...allMrsClaus);
    const allGenie = [
        genie,
        genieMale,
        genieFemale
    ];
    const allGenieGroup = new EmojiGroup("\u{1F9DE}\uDDDE", "Genie", ...allGenie);
    const allZombie = [
        zombie,
        zombieMale,
        zombieFemale
    ];
    const allZombieGroup = new EmojiGroup("\u{1F9DF}\uDDDF", "Zombie", ...allZombie);
    const allFantasy = [
        allCherubGroup,
        allSantaClausGroup,
        allMrsClausGroup,
        allSuperheroesGroup,
        allSupervillainsGroup,
        allMagesGroup,
        allFairiesGroup,
        allVampiresGroup,
        allMerpeopleGroup,
        allElvesGroup,
        allGenieGroup,
        allZombieGroup
    ];
    const allFantasyGroup = new EmojiGroup("\u0046\u0061\u006E\u0074\u0061\u0073\u0079", "Depictions of fantasy characters", ...allFantasy);
    const allManProbing = [
        manProbing,
        manLightSkinToneProbing,
        manMediumLightSkinToneProbing,
        manMediumSkinToneProbing,
        manMediumDarkSkinToneProbing,
        manDarkSkinToneProbing
    ];
    const allManProbingGroup = new EmojiGroup("\u{1F468}\uDC68\u200D\u{1F9AF}\uDDAF", "Man: Probing", ...allManProbing);
    const allWomanProbing = [
        womanProbing,
        womanLightSkinToneProbing,
        womanMediumLightSkinToneProbing,
        womanMediumSkinToneProbing,
        womanMediumDarkSkinToneProbing,
        womanDarkSkinToneProbing
    ];
    const allWomanProbingGroup = new EmojiGroup("\u{1F469}\uDC69\u200D\u{1F9AF}\uDDAF", "Woman: Probing", ...allWomanProbing);
    const allProbingCane = [
        probingCane,
        allManProbingGroup,
        allWomanProbingGroup
    ];
    const allProbingCaneGroup = new EmojiGroup("\u{1F9AF}\uDDAF", "Probing Cane", ...allProbingCane);
    const allManInMotorizedWheelchair = [
        manInMotorizedWheelchair,
        manLightSkinToneInMotorizedWheelchair,
        manMediumLightSkinToneInMotorizedWheelchair,
        manMediumSkinToneInMotorizedWheelchair,
        manMediumDarkSkinToneInMotorizedWheelchair,
        manDarkSkinToneInMotorizedWheelchair
    ];
    const allManInMotorizedWheelchairGroup = new EmojiGroup("\u{1F468}\uDC68\u200D\u{1F9BC}\uDDBC", "Man: In Motorized Wheelchair", ...allManInMotorizedWheelchair);
    const allWomanInMotorizedWheelchair = [
        womanInMotorizedWheelchair,
        womanLightSkinToneInMotorizedWheelchair,
        womanMediumLightSkinToneInMotorizedWheelchair,
        womanMediumSkinToneInMotorizedWheelchair,
        womanMediumDarkSkinToneInMotorizedWheelchair,
        womanDarkSkinToneInMotorizedWheelchair
    ];
    const allWomanInMotorizedWheelchairGroup = new EmojiGroup("\u{1F469}\uDC69\u200D\u{1F9BC}\uDDBC", "Woman: In Motorized Wheelchair", ...allWomanInMotorizedWheelchair);
    const allMotorizedWheelchair = [
        motorizedWheelchair,
        allManInMotorizedWheelchairGroup,
        allWomanInMotorizedWheelchairGroup
    ];
    const allMotorizedWheelchairGroup = new EmojiGroup("\u{1F9BC}\uDDBC", "Motorized Wheelchair", ...allMotorizedWheelchair);
    const allManInManualWheelchair = [
        manInManualWheelchair,
        manLightSkinToneInManualWheelchair,
        manMediumLightSkinToneInManualWheelchair,
        manMediumSkinToneInManualWheelchair,
        manMediumDarkSkinToneInManualWheelchair,
        manDarkSkinToneInManualWheelchair
    ];
    const allManInManualWheelchairGroup = new EmojiGroup("\u{1F468}\uDC68\u200D\u{1F9BD}\uDDBD", "Man: In Manual Wheelchair", ...allManInManualWheelchair);
    const allWomanInManualWheelchair = [
        womanInManualWheelchair,
        womanLightSkinToneInManualWheelchair,
        womanMediumLightSkinToneInManualWheelchair,
        womanMediumSkinToneInManualWheelchair,
        womanMediumDarkSkinToneInManualWheelchair,
        womanDarkSkinToneInManualWheelchair
    ];
    const allWomanInManualWheelchairGroup = new EmojiGroup("\u{1F469}\uDC69\u200D\u{1F9BD}\uDDBD", "Woman: In Manual Wheelchair", ...allWomanInManualWheelchair);
    const allManualWheelchair = [
        manualWheelchair,
        allManInManualWheelchairGroup,
        allWomanInManualWheelchairGroup
    ];
    const allManualWheelchairGroup = new EmojiGroup("\u{1F9BD}\uDDBD", "Manual Wheelchair", ...allManualWheelchair);
    const allManDancing = [
        manDancing,
        manDancingLightSkinTone,
        manDancingMediumLightSkinTone,
        manDancingMediumSkinTone,
        manDancingMediumDarkSkinTone,
        manDancingDarkSkinTone
    ];
    const allManDancingGroup = new EmojiGroup("\u{1F57A}\uDD7A", "Man Dancing", ...allManDancing);
    const allWomanDancing = [
        womanDancing,
        womanDancingLightSkinTone,
        womanDancingMediumLightSkinTone,
        womanDancingMediumSkinTone,
        womanDancingMediumDarkSkinTone,
        womanDancingDarkSkinTone
    ];
    const allWomanDancingGroup = new EmojiGroup("\u{1F483}\uDC83", "Woman Dancing", ...allWomanDancing);
    const allMenDancing = [
        allManDancingGroup,
        allWomanDancingGroup
    ];
    const allMenDancingGroup = new EmojiGroup("\u{1F57A}\uDD7A", "Dancing", ...allMenDancing);
    const allJuggler = [
        juggler,
        jugglerLightSkinTone,
        jugglerMediumLightSkinTone,
        jugglerMediumSkinTone,
        jugglerMediumDarkSkinTone,
        jugglerDarkSkinTone
    ];
    const allJugglerGroup = new EmojiGroup("\u{1F939}\uDD39", "Juggler", ...allJuggler);
    const allJugglerMale = [
        jugglerMale,
        jugglerLightSkinToneMale,
        jugglerMediumLightSkinToneMale,
        jugglerMediumSkinToneMale,
        jugglerMediumDarkSkinToneMale,
        jugglerDarkSkinToneMale
    ];
    const allJugglerMaleGroup = new EmojiGroup("\u{1F939}\uDD39\u200D\u2642\uFE0F", "Juggler: Male", ...allJugglerMale);
    const allJugglerFemale = [
        jugglerFemale,
        jugglerLightSkinToneFemale,
        jugglerMediumLightSkinToneFemale,
        jugglerMediumSkinToneFemale,
        jugglerMediumDarkSkinToneFemale,
        jugglerDarkSkinToneFemale
    ];
    const allJugglerFemaleGroup = new EmojiGroup("\u{1F939}\uDD39\u200D\u2640\uFE0F", "Juggler: Female", ...allJugglerFemale);
    const allJugglers = [
        allJugglerGroup,
        allJugglerMaleGroup,
        allJugglerFemaleGroup
    ];
    const allJugglersGroup = new EmojiGroup("\u{1F939}\uDD39", "Juggler", ...allJugglers);
    const allClimber = [
        climber,
        climberLightSkinTone,
        climberMediumLightSkinTone,
        climberMediumSkinTone,
        climberMediumDarkSkinTone,
        climberDarkSkinTone
    ];
    const allClimberGroup = new EmojiGroup("\u{1F9D7}\uDDD7", "Climber", ...allClimber);
    const allClimberMale = [
        climberMale,
        climberLightSkinToneMale,
        climberMediumLightSkinToneMale,
        climberMediumSkinToneMale,
        climberMediumDarkSkinToneMale,
        climberDarkSkinToneMale
    ];
    const allClimberMaleGroup = new EmojiGroup("\u{1F9D7}\uDDD7\u200D\u2642\uFE0F", "Climber: Male", ...allClimberMale);
    const allClimberFemale = [
        climberFemale,
        climberLightSkinToneFemale,
        climberMediumLightSkinToneFemale,
        climberMediumSkinToneFemale,
        climberMediumDarkSkinToneFemale,
        climberDarkSkinToneFemale
    ];
    const allClimberFemaleGroup = new EmojiGroup("\u{1F9D7}\uDDD7\u200D\u2640\uFE0F", "Climber: Female", ...allClimberFemale);
    const allClimbers = [
        allClimberGroup,
        allClimberMaleGroup,
        allClimberFemaleGroup
    ];
    const allClimbersGroup = new EmojiGroup("\u{1F9D7}\uDDD7", "Climber", ...allClimbers);
    const allJockey = [
        jockey,
        jockeyLightSkinTone,
        jockeyMediumLightSkinTone,
        jockeyMediumSkinTone,
        jockeyMediumDarkSkinTone,
        jockeyDarkSkinTone
    ];
    const allJockeyGroup = new EmojiGroup("\u{1F3C7}\uDFC7", "Jockey", ...allJockey);
    const allSnowboarder = [
        snowboarder,
        snowboarderLightSkinTone,
        snowboarderMediumLightSkinTone,
        snowboarderMediumSkinTone,
        snowboarderMediumDarkSkinTone,
        snowboarderDarkSkinTone
    ];
    const allSnowboarderGroup = new EmojiGroup("\u{1F3C2}\uDFC2", "Snowboarder", ...allSnowboarder);
    const allGolfer = [
        golfer,
        golferLightSkinTone,
        golferMediumLightSkinTone,
        golferMediumSkinTone,
        golferMediumDarkSkinTone,
        golferDarkSkinTone
    ];
    const allGolferGroup = new EmojiGroup("\u{1F3CC}\uDFCC\uFE0F", "Golfer", ...allGolfer);
    const allGolferMale = [
        golferMale,
        golferLightSkinToneMale,
        golferMediumLightSkinToneMale,
        golferMediumSkinToneMale,
        golferMediumDarkSkinToneMale,
        golferDarkSkinToneMale
    ];
    const allGolferMaleGroup = new EmojiGroup("\u{1F3CC}\uDFCC\uFE0F\u200D\u2642\uFE0F", "Golfer: Male", ...allGolferMale);
    const allGolferFemale = [
        golferFemale,
        golferLightSkinToneFemale,
        golferMediumLightSkinToneFemale,
        golferMediumSkinToneFemale,
        golferMediumDarkSkinToneFemale,
        golferDarkSkinToneFemale
    ];
    const allGolferFemaleGroup = new EmojiGroup("\u{1F3CC}\uDFCC\uFE0F\u200D\u2640\uFE0F", "Golfer: Female", ...allGolferFemale);
    const allGolfers = [
        allGolferGroup,
        allGolferMaleGroup,
        allGolferFemaleGroup
    ];
    const allGolfersGroup = new EmojiGroup("\u{1F3CC}\uDFCC\uFE0F", "Golfer", ...allGolfers);
    const allSurfing = [
        surfing,
        surfingLightSkinTone,
        surfingMediumLightSkinTone,
        surfingMediumSkinTone,
        surfingMediumDarkSkinTone,
        surfingDarkSkinTone
    ];
    const allSurfingGroup = new EmojiGroup("\u{1F3C4}\uDFC4", "Surfing", ...allSurfing);
    const allSurfingMale = [
        surfingMale,
        surfingLightSkinToneMale,
        surfingMediumLightSkinToneMale,
        surfingMediumSkinToneMale,
        surfingMediumDarkSkinToneMale,
        surfingDarkSkinToneMale
    ];
    const allSurfingMaleGroup = new EmojiGroup("\u{1F3C4}\uDFC4\u200D\u2642\uFE0F", "Surfing: Male", ...allSurfingMale);
    const allSurfingFemale = [
        surfingFemale,
        surfingLightSkinToneFemale,
        surfingMediumLightSkinToneFemale,
        surfingMediumSkinToneFemale,
        surfingMediumDarkSkinToneFemale,
        surfingDarkSkinToneFemale
    ];
    const allSurfingFemaleGroup = new EmojiGroup("\u{1F3C4}\uDFC4\u200D\u2640\uFE0F", "Surfing: Female", ...allSurfingFemale);
    const allSurfers = [
        allSurfingGroup,
        allSurfingMaleGroup,
        allSurfingFemaleGroup
    ];
    const allSurfersGroup = new EmojiGroup("\u{1F3C4}\uDFC4", "Surfing", ...allSurfers);
    const allRowingBoat = [
        rowingBoat,
        rowingBoatLightSkinTone,
        rowingBoatMediumLightSkinTone,
        rowingBoatMediumSkinTone,
        rowingBoatMediumDarkSkinTone,
        rowingBoatDarkSkinTone
    ];
    const allRowingBoatGroup = new EmojiGroup("\u{1F6A3}\uDEA3", "Rowing Boat", ...allRowingBoat);
    const allRowingBoatMale = [
        rowingBoatMale,
        rowingBoatLightSkinToneMale,
        rowingBoatMediumLightSkinToneMale,
        rowingBoatMediumSkinToneMale,
        rowingBoatMediumDarkSkinToneMale,
        rowingBoatDarkSkinToneMale
    ];
    const allRowingBoatMaleGroup = new EmojiGroup("\u{1F6A3}\uDEA3\u200D\u2642\uFE0F", "Rowing Boat: Male", ...allRowingBoatMale);
    const allRowingBoatFemale = [
        rowingBoatFemale,
        rowingBoatLightSkinToneFemale,
        rowingBoatMediumLightSkinToneFemale,
        rowingBoatMediumSkinToneFemale,
        rowingBoatMediumDarkSkinToneFemale,
        rowingBoatDarkSkinToneFemale
    ];
    const allRowingBoatFemaleGroup = new EmojiGroup("\u{1F6A3}\uDEA3\u200D\u2640\uFE0F", "Rowing Boat: Female", ...allRowingBoatFemale);
    const allBoatRowers = [
        allRowingBoatGroup,
        allRowingBoatMaleGroup,
        allRowingBoatFemaleGroup
    ];
    const allBoatRowersGroup = new EmojiGroup("\u{1F6A3}\uDEA3", "Rowing Boat", ...allBoatRowers);
    const allSwimming = [
        swimming,
        swimmingLightSkinTone,
        swimmingMediumLightSkinTone,
        swimmingMediumSkinTone,
        swimmingMediumDarkSkinTone,
        swimmingDarkSkinTone
    ];
    const allSwimmingGroup = new EmojiGroup("\u{1F3CA}\uDFCA", "Swimming", ...allSwimming);
    const allSwimmingMale = [
        swimmingMale,
        swimmingLightSkinToneMale,
        swimmingMediumLightSkinToneMale,
        swimmingMediumSkinToneMale,
        swimmingMediumDarkSkinToneMale,
        swimmingDarkSkinToneMale
    ];
    const allSwimmingMaleGroup = new EmojiGroup("\u{1F3CA}\uDFCA\u200D\u2642\uFE0F", "Swimming: Male", ...allSwimmingMale);
    const allSwimmingFemale = [
        swimmingFemale,
        swimmingLightSkinToneFemale,
        swimmingMediumLightSkinToneFemale,
        swimmingMediumSkinToneFemale,
        swimmingMediumDarkSkinToneFemale,
        swimmingDarkSkinToneFemale
    ];
    const allSwimmingFemaleGroup = new EmojiGroup("\u{1F3CA}\uDFCA\u200D\u2640\uFE0F", "Swimming: Female", ...allSwimmingFemale);
    const allSwimmers = [
        allSwimmingGroup,
        allSwimmingMaleGroup,
        allSwimmingFemaleGroup
    ];
    const allSwimmersGroup = new EmojiGroup("\u{1F3CA}\uDFCA", "Swimming", ...allSwimmers);
    const allBasketBaller = [
        basketBaller,
        basketBallerLightSkinTone,
        basketBallerMediumLightSkinTone,
        basketBallerMediumSkinTone,
        basketBallerMediumDarkSkinTone,
        basketBallerDarkSkinTone
    ];
    const allBasketBallerGroup = new EmojiGroup("\u26F9\uFE0F", "Basket Baller", ...allBasketBaller);
    const allBasketBallerMale = [
        basketBallerMale,
        basketBallerLightSkinToneMale,
        basketBallerMediumLightSkinToneMale,
        basketBallerMediumSkinToneMale,
        basketBallerMediumDarkSkinToneMale,
        basketBallerDarkSkinToneMale
    ];
    const allBasketBallerMaleGroup = new EmojiGroup("\u26F9\uFE0F\u200D\u2642\uFE0F", "Basket Baller: Male", ...allBasketBallerMale);
    const allBasketBallerFemale = [
        basketBallerFemale,
        basketBallerLightSkinToneFemale,
        basketBallerMediumLightSkinToneFemale,
        basketBallerMediumSkinToneFemale,
        basketBallerMediumDarkSkinToneFemale,
        basketBallerDarkSkinToneFemale
    ];
    const allBasketBallerFemaleGroup = new EmojiGroup("\u26F9\uFE0F\u200D\u2640\uFE0F", "Basket Baller: Female", ...allBasketBallerFemale);
    const allBacketBallPlayers = [
        allBasketBallerGroup,
        allBasketBallerMaleGroup,
        allBasketBallerFemaleGroup
    ];
    const allBacketBallPlayersGroup = new EmojiGroup("\u26F9\uFE0F", "Basket Baller", ...allBacketBallPlayers);
    const allWeightLifter = [
        weightLifter,
        weightLifterLightSkinTone,
        weightLifterMediumLightSkinTone,
        weightLifterMediumSkinTone,
        weightLifterMediumDarkSkinTone,
        weightLifterDarkSkinTone
    ];
    const allWeightLifterGroup = new EmojiGroup("\u{1F3CB}\uDFCB\uFE0F", "Weight Lifter", ...allWeightLifter);
    const allWeightLifterMale = [
        weightLifterMale,
        weightLifterLightSkinToneMale,
        weightLifterMediumLightSkinToneMale,
        weightLifterMediumSkinToneMale,
        weightLifterMediumDarkSkinToneMale,
        weightLifterDarkSkinToneMale
    ];
    const allWeightLifterMaleGroup = new EmojiGroup("\u{1F3CB}\uDFCB\uFE0F\u200D\u2642\uFE0F", "Weight Lifter: Male", ...allWeightLifterMale);
    const allWeightLifterFemale = [
        weightLifterFemale,
        weightLifterLightSkinToneFemale,
        weightLifterMediumLightSkinToneFemale,
        weightLifterMediumSkinToneFemale,
        weightLifterMediumDarkSkinToneFemale,
        weightLifterDarkSkinToneFemale
    ];
    const allWeightLifterFemaleGroup = new EmojiGroup("\u{1F3CB}\uDFCB\uFE0F\u200D\u2640\uFE0F", "Weight Lifter: Female", ...allWeightLifterFemale);
    const allWeightLifters = [
        allWeightLifterGroup,
        allWeightLifterMaleGroup,
        allWeightLifterFemaleGroup
    ];
    const allWeightLiftersGroup = new EmojiGroup("\u{1F3CB}\uDFCB\uFE0F", "Weight Lifter", ...allWeightLifters);
    const allBiker = [
        biker,
        bikerLightSkinTone,
        bikerMediumLightSkinTone,
        bikerMediumSkinTone,
        bikerMediumDarkSkinTone,
        bikerDarkSkinTone
    ];
    const allBikerGroup = new EmojiGroup("\u{1F6B4}\uDEB4", "Biker", ...allBiker);
    const allBikerMale = [
        bikerMale,
        bikerLightSkinToneMale,
        bikerMediumLightSkinToneMale,
        bikerMediumSkinToneMale,
        bikerMediumDarkSkinToneMale,
        bikerDarkSkinToneMale
    ];
    const allBikerMaleGroup = new EmojiGroup("\u{1F6B4}\uDEB4\u200D\u2642\uFE0F", "Biker: Male", ...allBikerMale);
    const allBikerFemale = [
        bikerFemale,
        bikerLightSkinToneFemale,
        bikerMediumLightSkinToneFemale,
        bikerMediumSkinToneFemale,
        bikerMediumDarkSkinToneFemale,
        bikerDarkSkinToneFemale
    ];
    const allBikerFemaleGroup = new EmojiGroup("\u{1F6B4}\uDEB4\u200D\u2640\uFE0F", "Biker: Female", ...allBikerFemale);
    const allBikers = [
        allBikerGroup,
        allBikerMaleGroup,
        allBikerFemaleGroup
    ];
    const allBikersGroup = new EmojiGroup("\u{1F6B4}\uDEB4", "Biker", ...allBikers);
    const allMountainBiker = [
        mountainBiker,
        mountainBikerLightSkinTone,
        mountainBikerMediumLightSkinTone,
        mountainBikerMediumSkinTone,
        mountainBikerMediumDarkSkinTone,
        mountainBikerDarkSkinTone
    ];
    const allMountainBikerGroup = new EmojiGroup("\u{1F6B5}\uDEB5", "Mountain Biker", ...allMountainBiker);
    const allMountainBikerMale = [
        mountainBikerMale,
        mountainBikerLightSkinToneMale,
        mountainBikerMediumLightSkinToneMale,
        mountainBikerMediumSkinToneMale,
        mountainBikerMediumDarkSkinToneMale,
        mountainBikerDarkSkinToneMale
    ];
    const allMountainBikerMaleGroup = new EmojiGroup("\u{1F6B5}\uDEB5\u200D\u2642\uFE0F", "Mountain Biker: Male", ...allMountainBikerMale);
    const allMountainBikerFemale = [
        mountainBikerFemale,
        mountainBikerLightSkinToneFemale,
        mountainBikerMediumLightSkinToneFemale,
        mountainBikerMediumSkinToneFemale,
        mountainBikerMediumDarkSkinToneFemale,
        mountainBikerDarkSkinToneFemale
    ];
    const allMountainBikerFemaleGroup = new EmojiGroup("\u{1F6B5}\uDEB5\u200D\u2640\uFE0F", "Mountain Biker: Female", ...allMountainBikerFemale);
    const allMountainBikers = [
        allMountainBikerGroup,
        allMountainBikerMaleGroup,
        allMountainBikerFemaleGroup
    ];
    const allMountainBikersGroup = new EmojiGroup("\u{1F6B5}\uDEB5", "Mountain Biker", ...allMountainBikers);
    const allCartwheeler = [
        cartwheeler,
        cartwheelerLightSkinTone,
        cartwheelerMediumLightSkinTone,
        cartwheelerMediumSkinTone,
        cartwheelerMediumDarkSkinTone,
        cartwheelerDarkSkinTone
    ];
    const allCartwheelerGroup = new EmojiGroup("\u{1F938}\uDD38", "Cartwheeler", ...allCartwheeler);
    const allCartwheelerMale = [
        cartwheelerMale,
        cartwheelerLightSkinToneMale,
        cartwheelerMediumLightSkinToneMale,
        cartwheelerMediumSkinToneMale,
        cartwheelerMediumDarkSkinToneMale,
        cartwheelerDarkSkinToneMale
    ];
    const allCartwheelerMaleGroup = new EmojiGroup("\u{1F938}\uDD38\u200D\u2642\uFE0F", "Cartwheeler: Male", ...allCartwheelerMale);
    const allCartwheelerFemale = [
        cartwheelerFemale,
        cartwheelerLightSkinToneFemale,
        cartwheelerMediumLightSkinToneFemale,
        cartwheelerMediumSkinToneFemale,
        cartwheelerMediumDarkSkinToneFemale,
        cartwheelerDarkSkinToneFemale
    ];
    const allCartwheelerFemaleGroup = new EmojiGroup("\u{1F938}\uDD38\u200D\u2640\uFE0F", "Cartwheeler: Female", ...allCartwheelerFemale);
    const allCartwheelers = [
        allCartwheelerGroup,
        allCartwheelerMaleGroup,
        allCartwheelerFemaleGroup
    ];
    const allCartwheelersGroup = new EmojiGroup("\u{1F938}\uDD38", "Cartwheeler", ...allCartwheelers);
    const allWrestler = [
        wrestler,
        wrestlerMale,
        wrestlerFemale
    ];
    const allWrestlerGroup = new EmojiGroup("\u{1F93C}\uDD3C", "Wrestler", ...allWrestler);
    const allWaterPoloPlayer = [
        waterPoloPlayer,
        waterPoloPlayerLightSkinTone,
        waterPoloPlayerMediumLightSkinTone,
        waterPoloPlayerMediumSkinTone,
        waterPoloPlayerMediumDarkSkinTone,
        waterPoloPlayerDarkSkinTone
    ];
    const allWaterPoloPlayerGroup = new EmojiGroup("\u{1F93D}\uDD3D", "Water Polo Player", ...allWaterPoloPlayer);
    const allWaterPoloPlayerMale = [
        waterPoloPlayerMale,
        waterPoloPlayerLightSkinToneMale,
        waterPoloPlayerMediumLightSkinToneMale,
        waterPoloPlayerMediumSkinToneMale,
        waterPoloPlayerMediumDarkSkinToneMale,
        waterPoloPlayerDarkSkinToneMale
    ];
    const allWaterPoloPlayerMaleGroup = new EmojiGroup("\u{1F93D}\uDD3D\u200D\u2642\uFE0F", "Water Polo Player: Male", ...allWaterPoloPlayerMale);
    const allWaterPoloPlayerFemale = [
        waterPoloPlayerFemale,
        waterPoloPlayerLightSkinToneFemale,
        waterPoloPlayerMediumLightSkinToneFemale,
        waterPoloPlayerMediumSkinToneFemale,
        waterPoloPlayerMediumDarkSkinToneFemale,
        waterPoloPlayerDarkSkinToneFemale
    ];
    const allWaterPoloPlayerFemaleGroup = new EmojiGroup("\u{1F93D}\uDD3D\u200D\u2640\uFE0F", "Water Polo Player: Female", ...allWaterPoloPlayerFemale);
    const allWaterPoloPlayers = [
        allWaterPoloPlayerGroup,
        allWaterPoloPlayerMaleGroup,
        allWaterPoloPlayerFemaleGroup
    ];
    const allWaterPoloPlayersGroup = new EmojiGroup("\u{1F93D}\uDD3D", "Water Polo Player", ...allWaterPoloPlayers);
    const allHandBaller = [
        handBaller,
        handBallerLightSkinTone,
        handBallerMediumLightSkinTone,
        handBallerMediumSkinTone,
        handBallerMediumDarkSkinTone,
        handBallerDarkSkinTone
    ];
    const allHandBallerGroup = new EmojiGroup("\u{1F93E}\uDD3E", "Hand Baller", ...allHandBaller);
    const allHandBallerMale = [
        handBallerMale,
        handBallerLightSkinToneMale,
        handBallerMediumLightSkinToneMale,
        handBallerMediumSkinToneMale,
        handBallerMediumDarkSkinToneMale,
        handBallerDarkSkinToneMale
    ];
    const allHandBallerMaleGroup = new EmojiGroup("\u{1F93E}\uDD3E\u200D\u2642\uFE0F", "Hand Baller: Male", ...allHandBallerMale);
    const allHandBallerFemale = [
        handBallerFemale,
        handBallerLightSkinToneFemale,
        handBallerMediumLightSkinToneFemale,
        handBallerMediumSkinToneFemale,
        handBallerMediumDarkSkinToneFemale,
        handBallerDarkSkinToneFemale
    ];
    const allHandBallerFemaleGroup = new EmojiGroup("\u{1F93E}\uDD3E\u200D\u2640\uFE0F", "Hand Baller: Female", ...allHandBallerFemale);
    const allHandBallers = [
        allHandBallerGroup,
        allHandBallerMaleGroup,
        allHandBallerFemaleGroup
    ];
    const allHandBallersGroup = new EmojiGroup("\u{1F93E}\uDD3E", "Hand Baller", ...allHandBallers);
    const allInMotion = [
        allWalkersGroup,
        allStandersGroup,
        allKneelersGroup,
        allProbingCaneGroup,
        allMotorizedWheelchairGroup,
        allManualWheelchairGroup,
        allMenDancingGroup,
        allJugglersGroup,
        allClimbersGroup,
        fencer,
        allJockeyGroup,
        skier,
        allSnowboarderGroup,
        allGolfersGroup,
        allSurfersGroup,
        allBoatRowersGroup,
        allSwimmersGroup,
        allRunnersGroup,
        allBacketBallPlayersGroup,
        allWeightLiftersGroup,
        allBikersGroup,
        allMountainBikersGroup,
        allCartwheelersGroup,
        allWrestlerGroup,
        allWaterPoloPlayersGroup,
        allHandBallersGroup
    ];
    const allInMotionGroup = new EmojiGroup("\u0049\u006E\u0020\u004D\u006F\u0074\u0069\u006F\u006E", "Depictions of people in motion", ...allInMotion);
    const allInLotusPosition = [
        inLotusPosition,
        inLotusPositionLightSkinTone,
        inLotusPositionMediumLightSkinTone,
        inLotusPositionMediumSkinTone,
        inLotusPositionMediumDarkSkinTone,
        inLotusPositionDarkSkinTone
    ];
    const allInLotusPositionGroup = new EmojiGroup("\u{1F9D8}\uDDD8", "In Lotus Position", ...allInLotusPosition);
    const allInLotusPositionMale = [
        inLotusPositionMale,
        inLotusPositionLightSkinToneMale,
        inLotusPositionMediumLightSkinToneMale,
        inLotusPositionMediumSkinToneMale,
        inLotusPositionMediumDarkSkinToneMale,
        inLotusPositionDarkSkinToneMale
    ];
    const allInLotusPositionMaleGroup = new EmojiGroup("\u{1F9D8}\uDDD8\u200D\u2642\uFE0F", "In Lotus Position: Male", ...allInLotusPositionMale);
    const allInLotusPositionFemale = [
        inLotusPositionFemale,
        inLotusPositionLightSkinToneFemale,
        inLotusPositionMediumLightSkinToneFemale,
        inLotusPositionMediumSkinToneFemale,
        inLotusPositionMediumDarkSkinToneFemale,
        inLotusPositionDarkSkinToneFemale
    ];
    const allInLotusPositionFemaleGroup = new EmojiGroup("\u{1F9D8}\uDDD8\u200D\u2640\uFE0F", "In Lotus Position: Female", ...allInLotusPositionFemale);
    const allLotusSitters = [
        allInLotusPositionGroup,
        allInLotusPositionMaleGroup,
        allInLotusPositionFemaleGroup
    ];
    const allLotusSittersGroup = new EmojiGroup("\u{1F9D8}\uDDD8", "In Lotus Position", ...allLotusSitters);
    const allInBath = [
        inBath,
        inBathLightSkinTone,
        inBathMediumLightSkinTone,
        inBathMediumSkinTone,
        inBathMediumDarkSkinTone,
        inBathDarkSkinTone
    ];
    const allInBathGroup = new EmojiGroup("\u{1F6C0}\uDEC0", "In Bath", ...allInBath);
    const allInBed = [
        inBed,
        inBedLightSkinTone,
        inBedMediumLightSkinTone,
        inBedMediumSkinTone,
        inBedMediumDarkSkinTone,
        inBedDarkSkinTone
    ];
    const allInBedGroup = new EmojiGroup("\u{1F6CC}\uDECC", "In Bed", ...allInBed);
    const allInSauna = [
        inSauna,
        inSaunaLightSkinTone,
        inSaunaMediumLightSkinTone,
        inSaunaMediumSkinTone,
        inSaunaMediumDarkSkinTone,
        inSaunaDarkSkinTone
    ];
    const allInSaunaGroup = new EmojiGroup("\u{1F9D6}\uDDD6", "In Sauna", ...allInSauna);
    const allInSaunaMale = [
        inSaunaMale,
        inSaunaLightSkinToneMale,
        inSaunaMediumLightSkinToneMale,
        inSaunaMediumSkinToneMale,
        inSaunaMediumDarkSkinToneMale,
        inSaunaDarkSkinToneMale
    ];
    const allInSaunaMaleGroup = new EmojiGroup("\u{1F9D6}\uDDD6\u200D\u2642\uFE0F", "In Sauna: Male", ...allInSaunaMale);
    const allInSaunaFemale = [
        inSaunaFemale,
        inSaunaLightSkinToneFemale,
        inSaunaMediumLightSkinToneFemale,
        inSaunaMediumSkinToneFemale,
        inSaunaMediumDarkSkinToneFemale,
        inSaunaDarkSkinToneFemale
    ];
    const allInSaunaFemaleGroup = new EmojiGroup("\u{1F9D6}\uDDD6\u200D\u2640\uFE0F", "In Sauna: Female", ...allInSaunaFemale);
    const allSauna = [
        allInSaunaGroup,
        allInSaunaMaleGroup,
        allInSaunaFemaleGroup
    ];
    const allSaunaGroup = new EmojiGroup("\u{1F9D6}\uDDD6", "In Sauna", ...allSauna);
    const allResting = [
        allLotusSittersGroup,
        allInBathGroup,
        allInBedGroup,
        allSaunaGroup
    ];
    const allRestingGroup = new EmojiGroup("\u0052\u0065\u0073\u0074\u0069\u006E\u0067", "Depictions of people at rest", ...allResting);
    const allBabies = [
        allBabyGroup,
        allCherubGroup
    ];
    const allBabiesGroup = new EmojiGroup("\u{1F476}\uDC76", "Baby", ...allBabies);
    const allPeople = [
        allBabiesGroup,
        allChildrenGroup,
        allPersonsGroup,
        allOlderPersonsGroup
    ];
    const allPeopleGroup = new EmojiGroup("\u0050\u0065\u006F\u0070\u006C\u0065", "People", ...allPeople);
    const allCharacters = [
        allPeopleGroup,
        allGesturingGroup,
        allInMotionGroup,
        allRestingGroup,
        allOccupationGroup,
        allFantasyGroup
    ];
    new EmojiGroup("\u0041\u006C\u006C\u0020\u0050\u0065\u006F\u0070\u006C\u0065", "All People", ...allCharacters);

    const DEFAULT_TEST_TEXT = "The quick brown fox jumps over the lazy dog";
    const loadedFonts = [];
    function makeFont(style) {
        const fontParts = [];
        if (style.fontStyle && style.fontStyle !== "normal") {
            fontParts.push(style.fontStyle);
        }
        if (style.fontVariant && style.fontVariant !== "normal") {
            fontParts.push(style.fontVariant);
        }
        if (style.fontWeight && style.fontWeight !== "normal") {
            fontParts.push(style.fontWeight);
        }
        fontParts.push(style.fontSize + "px");
        fontParts.push(style.fontFamily);
        return fontParts.join(" ");
    }
    async function loadFont(font, testString = null, onProgress) {
        if (loadedFonts.indexOf(font) === -1) {
            testString = testString || DEFAULT_TEST_TEXT;
            if (onProgress) {
                onProgress(0, 1, font);
            }
            const fonts = await document.fonts.load(font, testString);
            if (onProgress) {
                onProgress(1, 1, font);
            }
            if (fonts.length === 0) {
                console.warn(`Failed to load font "${font}". If this is a system font, just set the object's \`value\` property, instead of calling \`loadFontAndSetText\`.`);
            }
            else {
                loadedFonts.push(font);
            }
        }
    }

    /**
     * Pick a value that is proportionally between two values.
     */
    function lerp(a, b, p) {
        return (1 - p) * a + p * b;
    }

    class TimerTickEvent extends Event {
        constructor() {
            super("tick");
            this.t = 0;
            this.dt = 0;
            this.sdt = 0;
            Object.seal(this);
        }
        copy(evt) {
            this.t = evt.t;
            this.dt = evt.dt;
            this.sdt = evt.sdt;
        }
        set(t, dt) {
            this.t = t;
            this.dt = dt;
            this.sdt = lerp(this.sdt, dt, 0.01);
        }
    }
    class BaseTimer extends TypedEventBase {
        constructor(targetFrameRate) {
            super();
            this._timer = null;
            this._frameTime = Number.MAX_VALUE;
            this._targetFPS = 0;
            this.targetFrameRate = targetFrameRate;
            this._onTick = (t) => {
                const tickEvt = new TimerTickEvent();
                let lt = t;
                this._onTick = (t) => {
                    if (t > lt) {
                        tickEvt.t = t;
                        tickEvt.dt = t - lt;
                        tickEvt.sdt = tickEvt.dt;
                        lt = t;
                        this._onTick = (t) => {
                            let dt = t - lt;
                            if (dt < -1000) {
                                lt = t - this._frameTime;
                                dt = this._frameTime;
                            }
                            if (dt > 0 && dt >= this._frameTime) {
                                tickEvt.set(t, dt);
                                lt = t;
                                this.dispatchEvent(tickEvt);
                            }
                        };
                    }
                };
            };
        }
        restart() {
            this.stop();
            this.start();
        }
        get isRunning() {
            return this._timer != null;
        }
        stop() {
            this._timer = null;
            this.dispatchEvent(new Event("stopped"));
        }
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
            super(120);
        }
        start() {
            const updater = (t) => {
                this._timer = requestAnimationFrame(updater);
                this._onTick(t);
            };
            this._timer = requestAnimationFrame(updater);
        }
        stop() {
            if (this._timer) {
                cancelAnimationFrame(this._timer);
                super.stop();
            }
        }
    }

    const JITSI_HOST = "tele.calla.chat";
    const JVB_HOST = JITSI_HOST;
    const JVB_MUC = "conference." + JITSI_HOST;

    /**
     * A setter functor for HTML element events.
     **/
    class HtmlEvt {
        /**
         * Creates a new setter functor for an HTML element event.
         * @param name - the name of the event to attach to.
         * @param callback - the callback function to use with the event handler.
         * @param opts - additional attach options.
         */
        constructor(name, callback, opts) {
            this.name = name;
            this.callback = callback;
            if (!isFunction(callback)) {
                throw new Error("A function instance is required for this parameter");
            }
            this.opts = opts;
            Object.freeze(this);
        }
        apply(elem) {
            if (isHTMLElement(elem)) {
                this.add(elem);
            }
        }
        /**
         * Add the encapsulate callback as an event listener to the give HTMLElement
         */
        add(elem) {
            elem.addEventListener(this.name, this.callback, this.opts);
        }
        /**
         * Remove the encapsulate callback as an event listener from the give HTMLElement
         */
        remove(elem) {
            elem.removeEventListener(this.name, this.callback);
        }
    }
    function onClick(callback, opts) { return new HtmlEvt("click", callback, opts); }
    function onInput(callback, opts) { return new HtmlEvt("input", callback, opts); }
    function onKeyUp(callback, opts) { return new HtmlEvt("keyup", callback, opts); }
    function onMouseOut(callback, opts) { return new HtmlEvt("mouseout", callback, opts); }
    function onMouseOver(callback, opts) { return new HtmlEvt("mouseover", callback, opts); }

    function isOpenable(obj) {
        return isFunction(obj.isOpen)
            && isFunction(obj.setOpen)
            && isFunction(obj.toggleOpen)
            && isFunction(obj.show)
            && isFunction(obj.hide);
    }
    function isOpen(target) {
        if (isOpenable(target)) {
            return target.isOpen();
        }
        else {
            return target.style.display !== "none";
        }
    }
    /**
     * Sets the element's style's display property to "none"
     * when `v` is false, or `displayType` when `v` is true.
     * @memberof Element
     * @param {boolean} v
     * @param {string} [displayType=""]
     */
    function setOpen(target, v, displayType = "") {
        if (isOpenable(target)) {
            target.setOpen(v, displayType);
        }
        else if (v) {
            show(target, displayType);
        }
        else {
            hide(target);
        }
    }
    function toggleOpen(target, displayType = "") {
        if (isOpenable(target)) {
            target.toggleOpen(displayType);
        }
        else if (isOpen(target)) {
            hide(target, displayType);
        }
        else {
            show(target);
        }
    }
    function show(target, displayType = "") {
        if (isOpenable(target)) {
            target.show();
        }
        else {
            target.style.display = displayType;
        }
    }
    function hide(target, displayType = "") {
        if (isOpenable(target)) {
            target.hide(displayType);
        }
        else {
            target.style.display = "none";
        }
    }
    function isLabelable(obj) {
        return isFunction(obj.updateLabel);
    }
    function updateLabel(target, open, enabledText, disabledText, bothText) {
        bothText = bothText || "";
        if (target.accessKey) {
            bothText += ` <kbd>(ALT+${target.accessKey.toUpperCase()})</kbd>`;
        }
        if (isLabelable(target)) {
            target.updateLabel(open, enabledText, disabledText, bothText);
        }
        else {
            target.innerHTML = (open ? enabledText : disabledText) + bothText;
        }
    }
    function isLockable(obj) {
        return isFunction(obj.setLocked);
    }
    const disabler$4 = disabled(true), enabler$4 = disabled(false);
    function setLocked(target, value) {
        if (isLockable(target)) {
            target.setLocked(value);
        }
        else if (value) {
            disabler$4.apply(target);
        }
        else {
            enabler$4.apply(target);
        }
    }

    const toggleOptionsEvt = new TypedEvent("toggleOptions"), tweetEvt = new TypedEvent("tweet"), leaveEvt = new TypedEvent("leave"), toggleFullscreenEvt = new TypedEvent("toggleFullscreen"), toggleInstructionsEvt = new TypedEvent("toggleInstructions"), toggleUserDirectoryEvt = new TypedEvent("toggleUserDirectory"), toggleAudioEvt$1 = new TypedEvent("toggleAudio"), toggleVideoEvt$2 = new TypedEvent("toggleVideo"), changeDevicesEvt = new TypedEvent("changeDevices"), emoteEvt$1 = new TypedEvent("emote"), selectEmojiEvt = new TypedEvent("selectEmoji"), zoomChangedEvt$1 = new TypedEvent("zoomChanged");
    class ButtonLayer extends TypedEventBase {
        constructor(zoomMin, zoomMax) {
            super();
            this._audioEnabled = true;
            this._videoEnabled = false;
            const changeZoom = (dz) => {
                this.zoom += dz;
                this.dispatchEvent(zoomChangedEvt$1);
            };
            this.element = Div(id("controls"));
            this.element.append(this.optionsButton = Button(id("optionsButton"), title("Show/hide options"), onClick(() => this.dispatchEvent(toggleOptionsEvt)), Run(gear.value), Run("Options")), this.instructionsButton = Button(id("instructionsButton"), title("Show/hide instructions"), onClick(() => this.dispatchEvent(toggleInstructionsEvt)), Run(questionMark.value), Run("Info")), this.shareButton = Button(id("shareButton"), title("Share your current room to twitter"), onClick(() => this.dispatchEvent(tweetEvt)), Img(src("https://cdn2.iconfinder.com/data/icons/minimalism/512/twitter.png"), alt("icon"), role("presentation"), height("25px"), margin("2px auto -2px auto")), Run("Tweet")), this.showUsersButton = Button(id("showUsersButton"), title("View user directory"), onClick(() => this.dispatchEvent(toggleUserDirectoryEvt)), Run(speakingHead.value), Run("Users")), this.fullscreenButton = Button(id("fullscreenButton"), title("Toggle fullscreen"), onClick(() => this.dispatchEvent(toggleFullscreenEvt)), onClick(() => this.isFullscreen = !this.isFullscreen), Run(squareFourCorners.value), Run("Expand")), this.leaveButton = Button(id("leaveButton"), title("Leave the room"), onClick(() => this.dispatchEvent(leaveEvt)), Run(door.value), Run("Leave")), Div(id("toggleAudioControl"), className("comboButton"), this.toggleAudioButton = Button(id("toggleAudioButton"), title("Toggle audio mute/unmute"), onClick(() => this.dispatchEvent(toggleAudioEvt$1)), this.toggleAudioLabel = Run(speakerHighVolume.value), Run("Audio")), this.toggleVideoButton = Button(id("toggleVideoButton"), title("Toggle video mute/unmute"), onClick(() => this.dispatchEvent(toggleVideoEvt$2)), this.toggleVideoLabel = Run(noMobilePhone.value), Run("Video")), this.changeDevicesButton = Button(id("changeDevicesButton"), title("Change devices"), onClick(() => this.dispatchEvent(changeDevicesEvt)), Run(upwardsButton.value), Run("Change"))), Div(id("emojiControl"), className("comboButton"), textAlign("center"), Button(id("emoteButton"), title("Emote"), onClick(() => this.dispatchEvent(emoteEvt$1)), this.emoteButton = Run(whiteFlower.value), Run("Emote")), Button(id("selectEmoteButton"), title("Select Emoji"), onClick(() => this.dispatchEvent(selectEmojiEvt)), Run(upwardsButton.value), Run("Change"))), this.zoomInButton = Button(id("zoomInButton"), title("Zoom in"), onClick(() => changeZoom(0.5)), Run(magnifyingGlassTiltedLeft.value), Run("+")), Div(id("zoomSliderContainer"), this.slider = InputRange(id("zoomSlider"), title("Zoom"), min(zoomMin), max(zoomMax), step(0.1), value("0"), onInput(() => this.dispatchEvent(zoomChangedEvt$1)))), this.zoomOutButton = Button(id("zoomOutButton"), title("Zoom out"), onClick(() => changeZoom(-0.5)), Run(magnifyingGlassTiltedRight.value), Run("-")));
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
            updateLabel(this.fullscreenButton, value, downRightArrow.value, squareFourCorners.value);
        }
        get style() {
            return this.element.style;
        }
        isOpen() {
            return this.style.display !== "none";
        }
        setOpen(v, displayType) {
            this.style.display = v
                ? displayType || ""
                : "none";
        }
        toggleOpen(displayType) {
            this.setOpen(!this.isOpen(), displayType);
        }
        hide() {
            this.setOpen(false);
        }
        show() {
            this.setOpen(true);
        }
        get enabled() {
            return !this.instructionsButton.disabled;
        }
        set enabled(v) {
            const buttons = this.element.querySelectorAll("button");
            for (let i = 0; i < buttons.length; ++i) {
                buttons[i].disabled = !v;
            }
        }
        get audioEnabled() {
            return this._audioEnabled;
        }
        set audioEnabled(value) {
            this._audioEnabled = value;
            updateLabel(this.toggleAudioLabel, value, speakerHighVolume.value, mutedSpeaker.value);
        }
        get videoEnabled() {
            return this._videoEnabled;
        }
        set videoEnabled(value) {
            this._videoEnabled = value;
            updateLabel(this.toggleVideoLabel, value, videoCamera.value, noMobilePhone.value);
        }
        setEmojiButton(emoji) {
            this.emoteButton.innerHTML = emoji.value;
        }
        get zoom() {
            return parseFloat(this.slider.value);
        }
        set zoom(v) {
            this.slider.value = v.toFixed(3);
        }
    }

    /**
     * A pseudo-element that is made out of other elements.
     **/
    class HtmlCustomTag extends EventBase {
        /**
         * Creates a new pseudo-element
         * @param tagName - the type of tag that will contain the elements in the custom tag.
         * @param rest - optional attributes, child elements, and text
         */
        constructor(tagName, ...rest) {
            super();
            this.element = tag(tagName, ...rest);
        }
        /**
         * Gets the ID attribute of the container element.
         **/
        get id() {
            return this.element.id;
        }
        /**
         * Retrieves the desired element for attaching events.
         **/
        get eventTarget() {
            return this.element;
        }
        /**
         * Determine if an event type should be forwarded to the container element.
         */
        isForwardedEvent(_name) {
            return true;
        }
        /**
         * Adds an event listener to the container element.
         * @param name - the name of the event to attach to.
         * @param callback - the callback function to use with the event handler.
         * @param opts - additional attach options.
         */
        addEventListener(name, callback, opts) {
            if (this.isForwardedEvent(name)) {
                this.eventTarget.addEventListener(name, callback, opts);
            }
            else {
                super.addEventListener(name, callback, opts);
            }
        }
        /**
         * Removes an event listener from the container element.
         * @param name - the name of the event to attach to.
         * @param callback - the callback function to use with the event handler.
         */
        removeEventListener(name, callback) {
            if (this.isForwardedEvent(name)) {
                this.eventTarget.removeEventListener(name, callback);
            }
            else {
                super.removeEventListener(name, callback);
            }
        }
        /**
         * Gets the style attribute of the underlying select box.
         */
        get style() {
            return this.element.style;
        }
        get visible() {
            return this.style.display !== null;
        }
        set visible(v) {
            setOpen(this.element, v);
        }
        get tagName() {
            return this.element.tagName;
        }
        get disabled() {
            return false;
        }
        set disabled(_v) {
        }
        /**
         * Moves cursor focus to the underyling element.
         **/
        focus() {
            this.element.focus();
        }
        /**
         * Removes cursor focus from the underlying element.
         **/
        blur() {
            this.element.blur();
        }
    }

    const disabler$3 = disabled(true);
    const enabler$3 = disabled(false);
    /**
     * Creates a select box that can bind to collections
     * @param id - the ID to use for the select box
     * @param noSelectionText - the text to display when no items are available.
     * @param makeID - a function that evalutes a databound item to create an ID for it.
     * @param makeLabel - a function that evalutes a databound item to create a label for it.
     * @param rest - optional attributes, child elements, and text to use on the select element
     */
    function SelectBox(id, noSelectionText, makeID, makeLabel, ...rest) {
        return new SelectBoxTag(id, noSelectionText, makeID, makeLabel, ...rest);
    }
    /**
     * A select box that can be databound to collections.
     **/
    class SelectBoxTag extends HtmlCustomTag {
        /**
         * Creates a select box that can bind to collections
         * @param tagId - the ID to use for the select box.
         * @param noSelectionText - the text to display when no items are available.
         * @param makeID - a function that evalutes a databound item to create an ID for it.
         * @param makeLabel - a function that evalutes a databound item to create a label for it.
         * @param rest - optional attributes, child elements, and text to use on the select element
         */
        constructor(tagId, noSelectionText, makeID, makeLabel, ...rest) {
            super("select", id(tagId), ...rest);
            this._emptySelectionEnabled = false;
            this._values = new Array();
            if (!isFunction(makeID)) {
                throw new Error("makeID parameter must be a Function");
            }
            if (!isFunction(makeLabel)) {
                throw new Error("makeLabel parameter must be a Function");
            }
            this.noSelectionText = noSelectionText;
            this.makeID = (v) => v !== null && makeID(v) || null;
            this.makeLabel = (v) => v !== null && makeLabel(v) || "None";
            this.emptySelectionEnabled = true;
            Object.seal(this);
        }
        render() {
            elementClearChildren(this.element);
            if (this.values.length === 0) {
                this.element.append(Option(this.noSelectionText));
                disabler$3.apply(this.element);
            }
            else {
                if (this.emptySelectionEnabled) {
                    this.element.append(Option(this.noSelectionText));
                }
                for (let v of this.values) {
                    this.element.append(Option(value(this.makeID(v)), this.makeLabel(v)));
                }
                enabler$3.apply(this.element);
            }
        }
        /**
         * Gets whether or not the select box will have a vestigial entry for "no selection" or "null" in the select box.
         **/
        get emptySelectionEnabled() {
            return this._emptySelectionEnabled;
        }
        /**
         * Sets whether or not the select box will have a vestigial entry for "no selection" or "null" in the select box.
         **/
        set emptySelectionEnabled(value) {
            this._emptySelectionEnabled = value;
            this.render();
        }
        /**
         * Gets the collection to which the select box was databound
         **/
        get values() {
            return this._values;
        }
        /**
         * Sets the collection to which the select box will be databound
         **/
        set values(newItems) {
            const curValue = this.selectedValue;
            this._values.splice(0, this._values.length, ...newItems);
            this.render();
            this.selectedValue = curValue;
        }
        /**
         * Returns the collection of HTMLOptionElements that are stored in the select box
         */
        get options() {
            return this.element.options;
        }
        /**
         * Gets the index of the item that is currently selected in the select box.
         * The index is offset by -1 if the select box has `emptySelectionEnabled`
         * set to true, so that the indices returned are always in range of the collection
         * to which the select box was databound
         */
        get selectedIndex() {
            let i = this.element.selectedIndex;
            if (this.emptySelectionEnabled) {
                --i;
            }
            return i;
        }
        /**
         * Sets the index of the item that should be selected in the select box.
         * The index is offset by -1 if the select box has `emptySelectionEnabled`
         * set to true, so that the indices returned are always in range of the collection
         * to which the select box was databound
         */
        set selectedIndex(i) {
            if (this.emptySelectionEnabled) {
                ++i;
            }
            this.element.selectedIndex = i;
        }
        /**
         * Gets the item at `selectedIndex` in the collection to which the select box was databound
         */
        get selectedValue() {
            if (0 <= this.selectedIndex && this.selectedIndex < this.values.length) {
                return this.values[this.selectedIndex];
            }
            else {
                return null;
            }
        }
        /**
         * Gets the index of the given item in the select box's databound collection, then
         * sets that index as the `selectedIndex`.
         */
        set selectedValue(value) {
            this.selectedIndex = this.indexOf(value);
        }
        get selectedText() {
            const opts = this.element.selectedOptions;
            if (opts.length === 1) {
                return opts[0].textContent || opts[0].innerText;
            }
            return "";
        }
        set selectedText(value) {
            const idx = this.values.findIndex(v => value !== null && this.makeLabel(v) === value);
            this.selectedIndex = idx;
        }
        /**
         * Returns the index of the given item in the select box's databound collection.
         */
        indexOf(value) {
            if (isNullOrUndefined(value)) {
                return -1;
            }
            return this.values
                .findIndex((v) => this.makeID(value) === this.makeID(v));
        }
        /**
         * Checks to see if the value exists in the databound collection.
         */
        contains(value) {
            return this.indexOf(value) >= 0.;
        }
    }

    const hiddenEvt = new TypedEvent("hidden"), shownEvt = new TypedEvent("shown");
    class FormDialog extends TypedEventBase {
        constructor(tagId) {
            super();
            this.element = Div(id(tagId));
            this.header = this.element.querySelector(".header");
            this.content = this.element.querySelector(".content");
            this.footer = this.element.querySelector(".footer");
            const closeButton = this.element.querySelector(".dialogTitle > button.closeButton");
            if (closeButton) {
                closeButton.addEventListener("click", () => hide(this));
            }
        }
        isOpen() {
            return this.style.display !== "none";
        }
        setOpen(v, displayType) {
            this.style.display = v
                ? displayType || ""
                : "none";
        }
        toggleOpen(displayType) {
            this.setOpen(!this.isOpen(), displayType);
        }
        get tagName() {
            return this.element.tagName;
        }
        get disabled() {
            return false;
        }
        set disabled(_v) {
        }
        get style() {
            return this.element.style;
        }
        appendChild(child) {
            return this.element.appendChild(child);
        }
        append(...rest) {
            this.element.append(...rest);
        }
        show() {
            show(this.element);
            this.dispatchEvent(shownEvt);
        }
        async showAsync() {
            show(this);
            await once(this, "hidden");
        }
        hide() {
            hide(this.element);
            this.dispatchEvent(hiddenEvt);
        }
    }

    const audioInputChangedEvt = new TypedEvent("audioInputChanged"), audioOutputChangedEvt = new TypedEvent("audioOutputChanged"), videoInputChangedEvt = new TypedEvent("videoInputChanged");
    class DevicesDialog extends FormDialog {
        constructor() {
            super("devices");
            this.videoInputSelect = SelectBox("videoInputDevices", "No video input", d => d.deviceId, d => d.label, onInput(() => this.dispatchEvent(videoInputChangedEvt)));
            this.audioInputSelect = SelectBox("audioInputDevices", "No audio input", d => d.deviceId, d => d.label, onInput(() => this.dispatchEvent(audioInputChangedEvt)));
            this.audioOutputSelect = SelectBox("audioOutputDevices", "No audio output", d => d.deviceId, d => d.label, onInput(() => this.dispatchEvent(audioOutputChangedEvt)));
            this.audioInputDevices = [];
            this.audioOutputDevices = [];
            this.videoInputDevices = [];
            Object.seal(this);
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
    }

    const activities = new EmojiGroup("Activities", "Activities", filmFrames, admissionTickets, carouselHorse, ferrisWheel, rollerCoaster, artistPalette, circusTent, ticket, clapperBoard, performingArts);

    const animals = new EmojiGroup("Animals", "Animals and insects", rat, mouse, ox, waterBuffalo, cow, tiger, leopard, rabbit, cat, blackCat, dragon, crocodile, whale, snail, snake, horse, ram, goat, ewe, monkey, rooster, chicken, dog, serviceDog, pig, boar, elephant, octopus, spiralShell, bug, ant, honeybee, ladyBeetle, fish, tropicalFish, blowfish, turtle, hatchingChick, babyChick, frontFacingBabyChick, bird, penguin, koala, poodle, camel, twoHumpCamel, dolphin, mouseFace, cowFace, tigerFace, rabbitFace, catFace, dragonFace, spoutingWhale, horseFace, monkeyFace, dogFace, pigFace, frog, hamster, wolf, bear, polarBear, panda, pigNose, pawPrints, chipmunk, dove, spider, spiderWeb, lion, scorpion, turkey, unicorn, eagle, duck, bat, shark, owl, fox, butterfly, deer, gorilla, lizard, rhinoceros, giraffe, zebra, hedgehog, sauropod, tRex, cricket, kangaroo, llama, peacock, hippopotamus, parrot, raccoon, mosquito, microbe, badger, swan, 
    //mammoth,
    //dodo,
    sloth, otter, orangutan, skunk, flamingo, 
    //beaver,
    //bison,
    //seal,
    //fly,
    //worm,
    //beetle,
    //cockroach,
    //feather,
    guideDog);

    const arrows = new EmojiGroup("Arrows", "Arrows pointing in different directions", clockwiseVerticalArrows, counterclockwiseArrowsButton, leftRightArrow, upDownArrow, upLeftArrow, upRightArrow, downRightArrow, downLeftArrow, rightArrowCurvingLeft, leftArrowCurvingRight, rightArrow, rightArrowCurvingUp, rightArrowCurvingDown, leftArrow, upArrow, downArrow);

    const astro = new EmojiGroup("Astronomy", "Astronomy", milkyWay, globeShowingEuropeAfrica, globeShowingAmericas, globeShowingAsiaAustralia, globeWithMeridians, newMoon, waxingCrescentMoon, firstQuarterMoon, waxingGibbousMoon, fullMoon, waningGibbousMoon, lastQuarterMoon, waningCrescentMoon, crescentMoon, newMoonFace, firstQuarterMoonFace, lastQuarterMoonFace, fullMoonFace, sunWithFace, glowingStar, shootingStar, comet, ringedPlanet);

    const bodyParts = new EmojiGroup("Body Parts", "General body parts", eyes, eye, eyeInSpeechBubble, ear, nose, mouth, tongue, flexedBiceps, selfie, bone, leg, foot, tooth, earWithHearingAid, mechanicalArm, mechanicalLeg, anatomicalHeart, lungs, brain);

    const buttons = new EmojiGroup("Buttons", "Buttons", cLButton, coolButton, freeButton, iDButton, newButton, nGButton, oKButton, sOSButton, upButton, vsButton, radioButton, backArrow, endArrow, onArrow, soonArrow, topArrow, checkBoxWithCheck, inputLatinUppercase, inputLatinLowercase, inputNumbers, inputSymbols, inputLatinLetters, shuffleTracksButton, repeatButton, repeatSingleButton, upwardsButton, downwardsButton, playButton, pauseButton, reverseButton, ejectButton, fastForwardButton, fastReverseButton, fastUpButton, fastDownButton, nextTrackButton, lastTrackButton, playOrPauseButton, pauseButton, stopButton, recordButton);

    const cartoon = new EmojiGroup("Cartoon", "Cartoon symbols", angerSymbol, bomb, zzz, collision, sweatDroplets, dashingAway, dizzy, speechBalloon, thoughtBalloon, hundredPoints, hole, leftSpeechBubble, rightSpeechBubble, conversationBubbles2, conversationBubbles3, leftThoughtBubble, rightThoughtBubble, leftAngerBubble, rightAngerBubble, angerBubble, angerBubbleLightning, lightningBolt);

    const celebration = new EmojiGroup("Celebration", "Celebration", ribbon, wrappedGift, jackOLantern, christmasTree, firecracker, fireworks, sparkler, sparkles, sparkle, balloon, partyPopper, confettiBall, tanabataTree, pineDecoration, japaneseDolls, carpStreamer, windChime, moonViewingCeremony, backpack, graduationCap, redEnvelope, redPaperLantern, militaryMedal);

    const whiteChessPieces = G(whiteChessKing.value + whiteChessQueen.value + whiteChessRook.value + whiteChessBishop.value + whiteChessKnight.value + whiteChessPawn.value, "White Chess Pieces", {
        width: "auto",
        king: whiteChessKing,
        queen: whiteChessQueen,
        rook: whiteChessRook,
        bishop: whiteChessBishop,
        knight: whiteChessKnight,
        pawn: whiteChessPawn
    });
    const blackChessPieces = G(blackChessKing.value + blackChessQueen.value + blackChessRook.value + blackChessBishop.value + blackChessKnight.value + blackChessPawn.value, "Black Chess Pieces", {
        width: "auto",
        king: blackChessKing,
        queen: blackChessQueen,
        rook: blackChessRook,
        bishop: blackChessBishop,
        knight: blackChessKnight,
        pawn: blackChessPawn
    });
    const chessPawns = G(whiteChessPawn.value + blackChessPawn.value, "Chess Pawns", {
        width: "auto",
        white: whiteChessPawn,
        black: blackChessPawn
    });
    const chessRooks = G(whiteChessRook.value + blackChessRook.value, "Chess Rooks", {
        width: "auto",
        white: whiteChessRook,
        black: blackChessRook
    });
    const chessBishops = G(whiteChessBishop.value + blackChessBishop.value, "Chess Bishops", {
        width: "auto",
        white: whiteChessBishop,
        black: blackChessBishop
    });
    const chessKnights = G(whiteChessKnight.value + blackChessKnight.value, "Chess Knights", {
        width: "auto",
        white: whiteChessKnight,
        black: blackChessKnight
    });
    const chessQueens = G(whiteChessQueen.value + blackChessQueen.value, "Chess Queens", {
        width: "auto",
        white: whiteChessQueen,
        black: blackChessQueen
    });
    const chessKings = G(whiteChessKing.value + blackChessKing.value, "Chess Kings", {
        width: "auto",
        white: whiteChessKing,
        black: blackChessKing
    });
    const chess = G("Chess Pieces", "Chess Pieces", {
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

    const clocks = new EmojiGroup("Clocks", "Time-keeping pieces", oneOClock, twoOClock, threeOClock, fourOClock, fiveOClock, sixOClock, sevenOClock, eightOClock, nineOClock, tenOClock, elevenOClock, twelveOClock, oneThirty, twoThirty, threeThirty, fourThirty, fiveThirty, sixThirty, sevenThirty, eightThirty, nineThirty, tenThirty, elevenThirty, twelveThirty, mantelpieceClock, watch, alarmClock, stopwatch, timerClock, hourglassDone, hourglassNotDone);

    const clothing = new EmojiGroup("Clothing", "Clothing", topHat, divingMask, womanSHat, glasses, sunglasses, necktie, tShirt, jeans, dress, kimono, bikini, womanSClothes, purse, handbag, clutchBag, manSShoe, runningShoe, highHeeledShoe, womanSSandal, womanSBoot, martialArtsUniform, sari, labCoat, goggles, hikingBoot, flatShoe, safetyVest, billedCap, scarf, gloves, coat, socks, nazarAmulet, balletShoes, onePieceSwimsuit, briefs, shorts);

    const dice1 = new Emoji("\u2680", "Dice: Side 1");
    const dice2 = new Emoji("\u2681", "Dice: Side 2");
    const dice3 = new Emoji("\u2682", "Dice: Side 3");
    const dice4 = new Emoji("\u2683", "Dice: Side 4");
    const dice5 = new Emoji("\u2684", "Dice: Side 5");
    const dice6 = new Emoji("\u2685", "Dice: Side 6");
    const dice = new EmojiGroup("Dice", "Dice", dice1, dice2, dice3, dice4, dice5, dice6);

    const faces = G("Faces", "Round emoji faces", {
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
        grinningSquintingFace,
        smilingFaceWithHalo,
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
        upsideDownFace,
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
        faceVomiting,
        explodingHead,
        smilingFaceWithHearts,
        yawningFace,
        //smilingFaceWithTear,
        partyingFace,
        woozyFace,
        hotFace,
        coldFace,
        //disguisedFace,
        pleadingFace,
        faceWithMonocle,
        skullAndCrossbones,
        frowningFace,
        smilingFace,
        speakingHead,
        bustInSilhouette,
    });

    const finance = new EmojiGroup("Finance", "Finance", moneyBag, currencyExchange, heavyDollarSign, creditCard, yenBanknote, dollarBanknote, euroBanknote, poundBanknote, moneyWithWings, 
    //coin,
    chartIncreasingWithYen);

    const flags = new EmojiGroup("Flags", "Basic flags", crossedFlags, chequeredFlag, whiteFlag, rainbowFlag, transgenderFlag, blackFlag, pirateFlag, flagEngland, flagScotland, flagWales, triangularFlag);

    const food = new EmojiGroup("Food", "Food, drink, and utensils", hotDog, taco, burrito, chestnut, hotPepper, earOfCorn, mushroom, tomato, eggplant, grapes, melon, watermelon, tangerine, lemon, banana, pineapple, redApple, greenApple, pear, peach, cherries, strawberry, hamburger, pizza, meatOnBone, poultryLeg, riceCracker, riceBall, cookedRice, curryRice, steamingBowl, spaghetti, bread, frenchFries, roastedSweetPotato, dango, oden, sushi, friedShrimp, fishCakeWithSwirl, bentoBox, potOfFood, cooking, popcorn, croissant, avocado, cucumber, bacon, potato, carrot, baguetteBread, greenSalad, shallowPanOfFood, stuffedFlatbread, egg, peanuts, kiwiFruit, pancakes, dumpling, fortuneCookie, takeoutBox, bowlWithSpoon, coconut, broccoli, pretzel, cutOfMeat, sandwich, cannedFood, leafyGreen, mango, moonCake, bagel, crab, shrimp, squid, lobster, oyster, cheeseWedge, salt, garlic, onion, falafel, waffle, butter, 
    //blueberries,
    //bellPepper,
    //olive,
    //flatbread,
    //tamale,
    //fondue,
    softIceCream, shavedIce, iceCream, doughnut, cookie, chocolateBar, candy, lollipop, custard, honeyPot, shortcake, birthdayCake, pie, cupcake, teacupWithoutHandle, sake, wineGlass, cocktailGlass, tropicalDrink, beerMug, clinkingBeerMugs, babyBottle, bottleWithPoppingCork, clinkingGlasses, tumblerGlass, glassOfMilk, cupWithStraw, beverageBox, mate, ice, 
    //bubbleTea,
    //teapot,
    hotBeverage, forkAndKnife, forkAndKnifeWithPlate, amphora, kitchenKnife, spoon, chopsticks);

    const games = new EmojiGroup("Games", "Games", spadeSuit, clubSuit, heartSuit, diamondSuit, mahjongRedDragon, joker, directHit, slotMachine, pool8Ball, gameDie, bowling, flowerPlayingCards, puzzlePiece, chessPawn, yoYo, 
    //boomerang,
    //nestingDolls,
    kite);

    const hands = new EmojiGroup("Hands", "Hands pointing at things", backhandIndexPointingUp, backhandIndexPointingDown, backhandIndexPointingLeft, backhandIndexPointingRight, oncomingFist, wavingHand, oKHand, thumbsUp, thumbsDown, clappingHands, openHands, nailPolish, handWithFingersSplayed, handWithFingersSplayed2, thumbsUp2, thumbsDown2, peaceFingers, middleFinger, vulcanSalute, handPointingDown, handPointingLeft, handPointingRight, handPointingLeft2, handPointingRight2, indexPointingLeft, indexPointingRight, indexPointingUp, indexPointingDown, indexPointingUp2, indexPointingDown2, indexPointingUp3, indexPointingDown3, raisingHands, foldedHands, pinchedFingers, pinchingHand, signOfTheHorns, callMeHand, raisedBackOfHand, leftFacingFist, rightFacingFist, handshake, crossedFingers, loveYouGesture, palmsUpTogether, indexPointingUp4, raisedFist, raisedHand, victoryHand, writingHand);

    const household = new EmojiGroup("Household", "Household", lipstick, ring, gemStone, newspaper, key, fire, pistol, candle, framedPicture, oldKey, rolledUpNewspaper, worldMap, door, toilet, shower, bathtub, couchAndLamp, bed, lotionBottle, thread, yarn, safetyPin, teddyBear, broom, basket, rollOfPaper, soap, sponge, chair, razor, reminderRibbon);

    const love = G("Love", "Hearts and kisses", {
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
    });

    const mail = new EmojiGroup("Mail", "Mail", outboxTray, inboxTray, packageBox, eMail, incomingEnvelope, envelopeWithArrow, closedMailboxWithLoweredFlag, closedMailboxWithRaisedFlag, openMailboxWithRaisedFlag, openMailboxWithLoweredFlag, postbox, postalHorn);

    const math = new EmojiGroup("Math", "Math", multiply, plus, minus, divide);

    const medieval = new EmojiGroup("Medieval", "Medieval", castle, bowAndArrow, crown, tridentEmblem, dagger, shield, crystalBall, crossedSwords, fleurDeLis);

    const music = new EmojiGroup("Music", "Music", musicalScore, musicalNotes, musicalNote, saxophone, guitar, musicalKeyboard, trumpet, violin, drum, 
    //accordion,
    //longDrum,
    banjo);

    new EmojiGroup("Keycap Digits", "Keycap Digits", keycapDigitZero, keycapDigitOne, keycapDigitTwo, keycapDigitThree, keycapDigitFour, keycapDigitFive, keycapDigitSix, keycapDigitSeven, keycapDigitEight, keycapDigitNine, keycap10);
    const numbers = new EmojiGroup("Numbers", "Numbers", digitZero, digitOne, digitTwo, digitThree, digitFour, digitFive, digitSix, digitSeven, digitEight, digitNine, asterisk, numberSign, keycapDigitZero, keycapDigitOne, keycapDigitTwo, keycapDigitThree, keycapDigitFour, keycapDigitFive, keycapDigitSix, keycapDigitSeven, keycapDigitEight, keycapDigitNine, keycapAsterisk, keycapNumberSign, keycap10);

    const office = new EmojiGroup("Office", "Office", fileFolder, openFileFolder, pageWithCurl, pageFacingUp, calendar, tearOffCalendar, cardIndex, cardIndexDividers, cardFileBox, fileCabinet, wastebasket, spiralNotePad, spiralCalendar, chartIncreasing, chartDecreasing, barChart, clipboard, pushpin, roundPushpin, paperclip, linkedPaperclips, straightRuler, triangularRuler, bookmarkTabs, ledger, notebook, notebookWithDecorativeCover, closedBook, openBook, greenBook, blueBook, orangeBook, books, nameBadge, scroll, memo, scissors, envelope);

    const plants = new EmojiGroup("Plants", "Flowers, trees, and things", seedling, evergreenTree, deciduousTree, palmTree, cactus, tulip, cherryBlossom, rose, hibiscus, sunflower, blossom, sheafOfRice, herb, fourLeafClover, mapleLeaf, fallenLeaf, leafFlutteringInWind, rosette, bouquet, whiteFlower, wiltedFlower, 
    //pottedPlant,
    shamrock);

    const religion = new EmojiGroup("Religion", "Religion", dottedSixPointedStar, starOfDavid, om, kaaba, mosque, synagogue, menorah, placeOfWorship, hinduTemple, orthodoxCross, latinCross, starAndCrescent, peaceSymbol, yinYang, wheelOfDharma, infinity, diyaLamp, shintoShrine, church, eightPointedStar, prayerBeads);

    const science = G("Science", "Science", {
        droplet,
        dropOfBlood,
        adhesiveBandage,
        stethoscope,
        syringe,
        pill,
        microscope,
        testTube,
        petriDish,
        dNA,
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
    });

    const shapes = new EmojiGroup("Shapes", "Colored shapes", redCircle, blueCircle, largeOrangeDiamond, largeBlueDiamond, smallOrangeDiamond, smallBlueDiamond, redTrianglePointedUp, redTrianglePointedDown, orangeCircle, yellowCircle, greenCircle, purpleCircle, brownCircle, hollowRedCircle, whiteCircle, blackCircle, redSquare, blueSquare, orangeSquare, yellowSquare, greenSquare, purpleSquare, brownSquare, blackSquareButton, whiteSquareButton, blackSmallSquare, whiteSmallSquare, whiteMediumSmallSquare, blackMediumSmallSquare, whiteMediumSquare, blackMediumSquare, blackLargeSquare, whiteLargeSquare, star, diamondWithADot);

    const signs = new EmojiGroup("Signs", "Signs", cinema, noMobilePhone, noOneUnderEighteen, prohibited, cigarette, noSmoking, litterInBinSign, noLittering, potableWater, nonPotableWater, noBicycles, noPedestrians, childrenCrossing, menSRoom, womenSRoom, restroom, babySymbol, waterCloset, passportControl, customs, baggageClaim, leftLuggage, parkingButton, wheelchairSymbol, radioactive, biohazard, warning, highVoltage, noEntry, recyclingSymbol, female, male, transgenderSymbol);

    const sportsEquipment = new EmojiGroup("Sports Equipment", "Sports equipment", runningShirt, tennis, skis, basketball, sportsMedal, trophy, americanFootball, rugbyFootball, cricketGame, volleyball, fieldHockey, iceHockey, pingPong, badminton, sled, goalNet, medal1stPlace, medal2ndPlace, medal3rdPlace, boxingGlove, curlingStone, lacrosse, softball, flyingDisc, soccerBall, baseball, iceSkate);

    const tech = new EmojiGroup("Technology", "Technology", joystick, videoGame, lightBulb, laptop, briefcase, computerDisk, floppyDisk, opticalDisk, dVD, desktopComputer, keyboard, printer, computerMouse, trackball, telephone, telephoneReceiver, pager, faxMachine, satelliteAntenna, loudspeaker, megaphone, television, radio, videocassette, filmProjector, studioMicrophone, levelSlider, controlKnobs, microphone, movieCamera, headphone, camera, cameraWithFlash, videoCamera, mobilePhone, mobilePhoneOff, mobilePhoneWithArrow, lockedWithPen, lockedWithKey, locked, unlocked, bell, bellWithSlash, bookmark, link, mobilePhoneVibrating, antennaBars, dimButton, brightButton, mutedSpeaker, speakerLowVolume, speakerMediumVolume, speakerHighVolume, battery, electricPlug);

    const tools = new EmojiGroup("Tools", "Tools", fishingPole, flashlight, wrench, hammer, nutAndBolt, hammerAndWrench, compass, fireExtinguisher, toolbox, brick, axe, hammerAndPick, pick, rescueWorkerSHelmet, chains, compression);

    const town = new EmojiGroup("Town", "Town", buildingConstruction, houses, cityscape, derelictHouse, classicalBuilding, desert, desertIsland, nationalPark, stadium, house, houseWithGarden, officeBuilding, japanesePostOffice, postOffice, hospital, bank, aTMSign, hotel, loveHotel, convenienceStore, school, departmentStore, factory, bridgeAtNight, fountain, shoppingBags, receipt, shoppingCart, barberPole, wedding, ballotBoxWithBallot);

    const travel = new EmojiGroup("Travel", "Travel", label, volcano, snowCappedMountain, mountain, camping, beachWithUmbrella, umbrellaOnGround, japaneseCastle, footprints, mountFuji, tokyoTower, statueOfLiberty, mapOfJapan, moai, bellhopBell, luggage, flagInHole, tent, hotSprings);

    const vehicles = new EmojiGroup("Vehicles", "Things that go", motorcycle, racingCar, seat, rocket, helicopter, locomotive, railwayCar, highSpeedTrain, bulletTrain, train, metro, lightRail, station, tram, tramCar, bus, oncomingBus, trolleybus, busStop, minibus, ambulance, fireEngine, taxi, oncomingTaxi, automobile, oncomingAutomobile, sportUtilityVehicle, deliveryTruck, articulatedLorry, tractor, monorail, mountainRailway, suspensionRailway, mountainCableway, aerialTramway, ship, speedboat, horizontalTrafficLight, verticalTrafficLight, construction, bicycle, stopSign, oilDrum, motorway, railwayTrack, motorBoat, smallAirplane, airplaneDeparture, airplaneArrival, satellite, passengerShip, kickScooter, motorScooter, canoe, flyingSaucer, skateboard, autoRickshaw, 
    //pickupTruck,
    //rollerSkate,
    motorizedWheelchair, manualWheelchair, parachute, anchor, ferry, sailboat, fuelPump, airplane);

    const weather = new EmojiGroup("Weather", "Weather", sunriseOverMountains, sunrise, cityscapeAtDusk, sunset, nightWithStars, closedUmbrella, umbrella, umbrellaWithRainDrops, snowman, snowmanWithoutSnow, sun, cloud, sunBehindSmallCloud, sunBehindCloud, sunBehindLargeCloud, sunBehindRainCloud, cloudWithRain, cloudWithSnow, cloudWithLightning, cloudWithLightningAndRain, snowflake, cyclone, tornado, windFace, waterWave, fog, foggy, rainbow, thermometer);

    const writing = new EmojiGroup("Writing", "Writing", pen, fountainPen, paintbrush, crayon, pencil, blackNib);

    const zodiac = new EmojiGroup("Zodiac", "The symbology of astrology", aries, taurus, gemini, cancer, leo, virgo, libra, scorpio, sagittarius, capricorn, aquarius, pisces, ophiuchus);

    const allIcons = new EmojiGroup("All Icons", "All Icons", faces, love, cartoon, hands, bodyParts, 
    //people,
    //gestures,
    //inMotion,
    //resting,
    //roles,
    //fantasy,
    animals, plants, food, flags, vehicles, clocks, arrows, shapes, buttons, zodiac, chess, dice, math, games, sportsEquipment, clothing, town, music, weather, astro, finance, writing, science, tech, mail, celebration, tools, office, signs, religion, household, activities, travel, medieval, numbers);

    /**
     * Constructs a CSS grid area definition.
     * @param x - the starting horizontal cell for the element.
     * @param y - the starting vertical cell for the element.
     * @param [w] - the number of cells wide the element should cover.
     * @param [h] - the number of cells tall the element should cover.
     */
    function gridPos(x, y, w, h) {
        if (isNullOrUndefined(w)) {
            w = 1;
        }
        if (isNullOrUndefined(h)) {
            h = 1;
        }
        return gridArea(`${y}/${x}/${y + h}/${x + w}`);
    }
    /**
     * Constructs a CSS grid row definition
     * @param y - the starting vertical cell for the element.
     * @param [h] - the number of cells tall the element should cover.
     */
    function row(y, h) {
        if (isNullOrUndefined(h)) {
            h = 1;
        }
        return gridRow(`${y}/${y + h}`);
    }
    const displayGrid = display("grid");
    /**
     * Create the gridTemplateColumns style attribute, with display set to grid.
     */
    function gridColsDef(...cols) {
        return styles(displayGrid, gridTemplateColumns(cols.join(" ")));
    }

    const disabler$2 = disabled(true), enabler$2 = disabled(false);
    class EmojiSelectedEvent extends TypedEvent {
        constructor(emoji) {
            super("emojiSelected");
            this.emoji = emoji;
        }
    }
    const cancelEvt = new TypedEvent("emojiCanceled");
    class EmojiForm extends FormDialog {
        constructor() {
            super("emoji");
            this.header.append(H2("Recent"), this.recent = P("(None)"));
            const previousEmoji = new Array(), allAlts = new Array();
            let selectedEmoji = null, idCounter = 0;
            const closeAll = () => {
                for (let alt of allAlts) {
                    hide(alt);
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
                return new Emoji(left + b.value, a.desc + "/" + b.desc);
            }
            /**
             *
             * @param {EmojiGroup} group
             * @param {HTMLElement} container
             * @param {boolean} isAlts
             */
            const addIconsToContainer = (group, container, isAlts) => {
                const alts = isArray(group) && group
                    || !isArray(group) && group.alts;
                for (let icon of alts) {
                    let subAlts = null;
                    const btn = Button(title(icon.desc), onClick((_evt) => {
                        const evt = _evt;
                        selectedEmoji = selectedEmoji && evt.ctrlKey
                            ? combine(selectedEmoji, icon)
                            : icon;
                        this.preview.innerHTML = `${selectedEmoji.value} - ${selectedEmoji.desc}`;
                        enabler$2.apply(this.confirmButton);
                        if (subAlts) {
                            toggleOpen(subAlts);
                            btn.innerHTML = icon.value + (isOpen(subAlts) ? "-" : "+");
                        }
                    }), icon.value);
                    /** @type {HTMLUListElement|HTMLSpanElement} */
                    let g = null;
                    if (isAlts) {
                        btn.id = `emoji-with-alt-${idCounter++}`;
                        g = UL(LI(btn, Label(htmlFor(btn.id), icon.desc)));
                    }
                    else {
                        g = Span(btn);
                    }
                    if (icon.alts) {
                        subAlts = Div();
                        allAlts.push(subAlts);
                        addIconsToContainer(icon, subAlts, true);
                        hide(subAlts);
                        g.appendChild(subAlts);
                        btn.style.width = "3em";
                        btn.innerHTML += "+";
                    }
                    if (icon.width) {
                        btn.style.width = icon.width;
                    }
                    if (icon.color) {
                        btn.style.color = icon.color;
                    }
                    container.appendChild(g);
                }
            };
            for (let group of Object.values(allIcons)) {
                if (group instanceof EmojiGroup) {
                    const header = H1(), container = P(), headerButton = A(href("javascript:undefined"), title(group.desc), onClick(() => {
                        toggleOpen(container);
                        headerButton.innerHTML = group.value + (isOpen(container) ? " -" : " +");
                    }), group.value + " -");
                    addIconsToContainer(group, container, false);
                    header.appendChild(headerButton);
                    this.content.appendChild(header);
                    this.content.appendChild(container);
                }
            }
            this.footer.append(this.confirmButton = Button(className("confirm"), "OK", onClick(() => {
                const idx = previousEmoji.indexOf(selectedEmoji);
                if (idx === -1) {
                    previousEmoji.push(selectedEmoji);
                    this.recent.innerHTML = "";
                    addIconsToContainer(previousEmoji, this.recent, false);
                }
                this.dispatchEvent(new EmojiSelectedEvent(selectedEmoji));
                hide(this);
            })), Button(className("cancel"), "Cancel", onClick(() => {
                disabler$2.apply(this.confirmButton);
                this.dispatchEvent(cancelEvt);
                hide(this);
            })), this.preview = Span(gridPos(1, 4, 3, 1)));
            disabler$2.apply(this.confirmButton);
            this.selectAsync = () => {
                return new Promise((resolve, reject) => {
                    let yes = null, no = null;
                    const done = () => {
                        this.removeEventListener("emojiSelected", yes);
                        this.removeEventListener("emojiCanceled", no);
                        this.removeEventListener("hidden", no);
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
                    this.addEventListener("hidden", no);
                    closeAll();
                    show(this);
                });
            };
        }
    }

    const loginEvt = new TypedEvent("login");
    class LoginForm extends FormDialog {
        constructor() {
            super("login");
            this._ready = false;
            this._connecting = false;
            this._connected = false;
            this.addEventListener("shown", () => this._ready = true);
            this.roomSelectControl = Div(id("roomSelectorControl"));
            this.roomEntryControl = Div(id("roomEntryControl"));
            const curRooms = new Array();
            const curOpts = this.element.querySelectorAll("#roomSelector option");
            for (let i = 0; i < curOpts.length; ++i) {
                const opt = curOpts[i];
                curRooms.push({
                    ShortName: opt.value,
                    Name: opt.textContent || opt.innerText
                });
            }
            this.roomSelect = SelectBox("roomSelector", "No rooms available", v => v.ShortName, v => v.Name);
            this.roomSelect.addEventListener("input", () => this.validate());
            this.roomSelect.emptySelectionEnabled = false;
            this.roomSelect.values = curRooms;
            this.roomSelect.selectedIndex = 0;
            this.roomInput = InputText(id("roomName"));
            this.roomInput.addEventListener("input", () => this.validate());
            this.roomInput.addEventListener("keypress", (evt) => {
                if (evt.key === "Enter") {
                    if (this.userName.length === 0) {
                        this.userNameInput.focus();
                    }
                    else if (this.email.length === 0) {
                        this.emailInput.focus();
                    }
                }
            });
            this.userNameInput = InputText(id("userName"));
            this.userNameInput.addEventListener("input", () => this.validate());
            this.userNameInput.addEventListener("keypress", (evt) => {
                if (evt.key === "Enter") {
                    if (this.userName.length === 0) {
                        this.userNameInput.focus();
                    }
                    else if (this.roomName.length === 0) {
                        if (this.roomSelectMode) {
                            this.roomSelect.focus();
                        }
                        else {
                            this.roomInput.focus();
                        }
                    }
                }
            });
            this.emailInput = InputEmail(id("email"));
            this.emailInput.addEventListener("keypress", (evt) => {
                if (evt.key === "Enter") {
                    if (this.userName.length === 0) {
                        this.userNameInput.focus();
                    }
                    else if (this.roomName.length === 0) {
                        if (this.roomSelectMode) {
                            this.roomSelect.focus();
                        }
                        else {
                            this.roomInput.focus();
                        }
                    }
                }
            });
            const createRoomButton = Button(id("createNewRoom"));
            createRoomButton.addEventListener("click", () => {
                this.roomSelectMode = false;
            });
            const selectRoomButton = Button(id("selectRoom"));
            selectRoomButton.addEventListener("click", () => {
                this.roomSelectMode = true;
            });
            this.connectButton = Button(id("connect"));
            const checkInput = (evt) => {
                if (!evt.shiftKey
                    && !evt.ctrlKey
                    && !evt.altKey
                    && !evt.metaKey
                    && evt.key === "Enter"
                    && this.userName.length > 0
                    && this.roomName.length > 0) {
                    this.dispatchEvent(loginEvt);
                }
            };
            this.connectButton.addEventListener("click", () => this.dispatchEvent(loginEvt));
            this.roomInput.addEventListener("keypress", checkInput);
            this.userNameInput.addEventListener("keypress", checkInput);
            this.addEventListener("login", () => {
                this.connecting = true;
            });
            this.roomSelectMode = true;
            this.validate();
        }
        validate() {
            const canConnect = this.roomName.length > 0
                && this.userName.length > 0;
            setLocked(this.connectButton, !this.ready
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
        get roomSelectMode() {
            return this.roomSelectControl.style.display !== "none";
        }
        set roomSelectMode(value) {
            setOpen(this.roomSelectControl, value);
            setOpen(this.roomEntryControl, !value);
            if (value) {
                this.roomSelect.selectedValue = { ShortName: this.roomInput.value };
            }
            else if (this.roomSelect.selectedIndex >= 0) {
                this.roomInput.value = this.roomSelect.selectedValue.ShortName;
            }
            this.validate();
        }
        get roomName() {
            const room = this.roomSelectMode
                ? this.roomSelect.selectedValue && this.roomSelect.selectedValue.ShortName
                : this.roomInput.value;
            return room || "";
        }
        set roomName(v) {
            if (v === null
                || v === undefined
                || v.length === 0) {
                v = this.roomSelect.values[0].ShortName;
            }
            this.roomInput.value = v;
            this.roomSelect.selectedValue = { ShortName: v };
            this.roomSelectMode = this.roomSelect.selectedIndex > -1;
            this.validate();
        }
        set userName(value) {
            this.userNameInput.value = value;
            this.validate();
        }
        get userName() {
            return this.userNameInput.value;
        }
        set email(value) {
            this.emailInput.value = value;
        }
        get email() {
            return this.emailInput.value;
        }
        get connectButtonText() {
            return this.connectButton.innerText
                || this.connectButton.textContent;
        }
        set connectButtonText(str) {
            this.connectButton.innerHTML = str;
        }
        get ready() {
            return this._ready;
        }
        set ready(v) {
            this._ready = v;
            this.validate();
        }
        get connecting() {
            return this._connecting;
        }
        set connecting(v) {
            this._connecting = v;
            this.validate();
        }
        get connected() {
            return this._connected;
        }
        set connected(v) {
            this._connected = v;
            this.connecting = false;
        }
    }

    class GamepadButtonEvent extends TypedEvent {
        constructor(type, button) {
            super(type);
            this.button = button;
        }
    }
    class GamepadButtonUpEvent extends GamepadButtonEvent {
        constructor(button) {
            super("gamepadbuttonup", button);
        }
    }
    class GamepadButtonDownEvent extends GamepadButtonEvent {
        constructor(button) {
            super("gamepadbuttondown", button);
        }
    }
    class GamepadAxisEvent extends TypedEvent {
        constructor(type, axis, value) {
            super(type);
            this.axis = axis;
            this.value = value;
        }
    }
    class GamepadAxisMaxedEvent extends GamepadAxisEvent {
        constructor(axis, value) {
            super("gamepadaxismaxed", axis, value);
        }
    }
    class EventedGamepad extends TypedEventBase {
        constructor(pad) {
            super();
            this.lastButtons = new Array();
            this.buttons = new Array();
            this.axes = new Array();
            this.hapticActuators = new Array();
            this.btnDownEvts = new Array();
            this.btnUpEvts = new Array();
            this.btnState = new Array();
            this.axisThresholdMax = 0.9;
            this.axisThresholdMin = 0.1;
            this.axisMaxEvts = new Array();
            this.axisMaxed = new Array();
            this.sticks = new Array();
            this.id = pad.id;
            this.displayId = pad.displayId;
            this.connected = pad.connected;
            this.hand = pad.hand;
            this.pose = pad.pose;
            this._isStick = (a) => a % 2 === 0 && a < pad.axes.length - 1;
            for (let b = 0; b < pad.buttons.length; ++b) {
                this.btnDownEvts[b] = new GamepadButtonDownEvent(b);
                this.btnUpEvts[b] = new GamepadButtonUpEvent(b);
                this.btnState[b] = false;
                this.buttons[b] = pad.buttons[b];
            }
            for (let a = 0; a < pad.axes.length; ++a) {
                this.axisMaxEvts[a] = new GamepadAxisMaxedEvent(a, 0);
                this.axisMaxed[a] = false;
                if (this._isStick(a)) {
                    this.sticks[a / 2] = { x: 0, y: 0 };
                }
                this.axes[a] = pad.axes[a];
            }
            if (pad.hapticActuators != null) {
                for (let h = 0; h < pad.hapticActuators.length; ++h) {
                    this.hapticActuators[h] = pad.hapticActuators[h];
                }
            }
            Object.seal(this);
        }
        update(pad) {
            this.connected = pad.connected;
            this.hand = pad.hand;
            this.pose = pad.pose;
            for (let b = 0; b < pad.buttons.length; ++b) {
                const wasPressed = this.btnState[b], pressed = pad.buttons[b].pressed;
                if (pressed !== wasPressed) {
                    this.btnState[b] = pressed;
                    this.dispatchEvent((pressed
                        ? this.btnDownEvts
                        : this.btnUpEvts)[b]);
                }
                this.lastButtons[b] = this.buttons[b];
                this.buttons[b] = pad.buttons[b];
            }
            for (let a = 0; a < pad.axes.length; ++a) {
                const wasMaxed = this.axisMaxed[a], val = pad.axes[a], dir = Math.sign(val), mag = Math.abs(val), maxed = mag >= this.axisThresholdMax, mined = mag <= this.axisThresholdMin, correctedVal = dir * (maxed ? 1 : (mined ? 0 : mag));
                if (maxed && !wasMaxed) {
                    this.axisMaxEvts[a].value = correctedVal;
                    this.dispatchEvent(this.axisMaxEvts[a]);
                }
                this.axisMaxed[a] = maxed;
                this.axes[a] = correctedVal;
            }
            for (let a = 0; a < this.axes.length - 1; a += 2) {
                const stick = this.sticks[a / 2];
                stick.x = this.axes[a];
                stick.y = this.axes[a + 1];
            }
            if (pad.hapticActuators != null) {
                for (let h = 0; h < pad.hapticActuators.length; ++h) {
                    this.hapticActuators[h] = pad.hapticActuators[h];
                }
            }
        }
    }

    const KEY = "CallaSettings";
    class InputBindingChangedEvent extends Event {
        constructor() {
            super("inputBindingChanged");
        }
    }
    const inputBindingChangedEvt$1 = new InputBindingChangedEvent();
    class InputBinding extends TypedEventBase {
        constructor() {
            super();
            this.bindings = new Map([
                ["keyButtonUp", "ArrowUp"],
                ["keyButtonDown", "ArrowDown"],
                ["keyButtonLeft", "ArrowLeft"],
                ["keyButtonRight", "ArrowRight"],
                ["keyButtonEmote", "e"],
                ["keyButtonToggleAudio", "a"],
                ["keyButtonZoomOut", "["],
                ["keyButtonZoomIn", "]"],
                ["gpAxisLeftRight", 0],
                ["gpAxisUpDown", 1],
                ["gpButtonEmote", 0],
                ["gpButtonToggleAudio", 1],
                ["gpButtonZoomIn", 6],
                ["gpButtonZoomOut", 7],
                ["gpButtonUp", 12],
                ["gpButtonDown", 13],
                ["gpButtonLeft", 14],
                ["gpButtonRight", 15]
            ]);
            for (let id of this.bindings.keys()) {
                Object.defineProperty(this, id, {
                    get: () => this.bindings.get(id),
                    set: (v) => {
                        if (this.bindings.has(id)
                            && v !== this.bindings.get(id)) {
                            this.bindings.set(id, v);
                            this.dispatchEvent(inputBindingChangedEvt$1);
                        }
                    }
                });
            }
            Object.freeze(this);
        }
        get(key) {
            return this.bindings.get(key);
        }
        set(key, value) {
            this.bindings.set(key, value);
        }
        get keyButtonUp() { return this.bindings.get("keyButtonUp"); }
        set keyButtonUp(v) { this.checkedSet("keyButtonUp", v); }
        get keyButtonDown() { return this.bindings.get("keyButtonDown"); }
        set keyButtonDown(v) { this.checkedSet("keyButtonDown", v); }
        get keyButtonLeft() { return this.bindings.get("keyButtonLeft"); }
        set keyButtonLeft(v) { this.checkedSet("keyButtonLeft", v); }
        get keyButtonRight() { return this.bindings.get("keyButtonRight"); }
        set keyButtonRight(v) { this.checkedSet("keyButtonRight", v); }
        get keyButtonEmote() { return this.bindings.get("keyButtonEmote"); }
        set keyButtonEmote(v) { this.checkedSet("keyButtonEmote", v); }
        get keyButtonToggleAudio() { return this.bindings.get("keyButtonToggleAudio"); }
        set keyButtonToggleAudio(v) { this.checkedSet("keyButtonToggleAudio", v); }
        get keyButtonZoomOut() { return this.bindings.get("keyButtonZoomOut"); }
        set keyButtonZoomOut(v) { this.checkedSet("keyButtonZoomOut", v); }
        get keyButtonZoomIn() { return this.bindings.get("keyButtonZoomIn"); }
        set keyButtonZoomIn(v) { this.checkedSet("keyButtonZoomIn", v); }
        get gpAxisLeftRight() { return this.bindings.get("gpAxisLeftRight"); }
        set gpAxisLeftRight(v) { this.checkedSet("gpAxisLeftRight", v); }
        get gpAxisUpDown() { return this.bindings.get("gpAxisUpDown"); }
        set gpAxisUpDown(v) { this.checkedSet("gpAxisUpDown", v); }
        get gpButtonEmote() { return this.bindings.get("gpButtonEmote"); }
        set gpButtonEmote(v) { this.checkedSet("gpButtonEmote", v); }
        get gpButtonToggleAudio() { return this.bindings.get("gpButtonToggleAudio"); }
        set gpButtonToggleAudio(v) { this.checkedSet("gpButtonToggleAudio", v); }
        get gpButtonZoomIn() { return this.bindings.get("gpButtonZoomIn"); }
        set gpButtonZoomIn(v) { this.checkedSet("gpButtonZoomIn", v); }
        get gpButtonZoomOut() { return this.bindings.get("gpButtonZoomOut"); }
        set gpButtonZoomOut(v) { this.checkedSet("gpButtonZoomOut", v); }
        get gpButtonUp() { return this.bindings.get("gpButtonUp"); }
        set gpButtonUp(v) { this.checkedSet("gpButtonUp", v); }
        get gpButtonDown() { return this.bindings.get("gpButtonDown"); }
        set gpButtonDown(v) { this.checkedSet("gpButtonDown", v); }
        get gpButtonLeft() { return this.bindings.get("gpButtonLeft"); }
        set gpButtonLeft(v) { this.checkedSet("gpButtonLeft", v); }
        get gpButtonRight() { return this.bindings.get("gpButtonRight"); }
        set gpButtonRight(v) { this.checkedSet("gpButtonRight", v); }
        checkedSet(key, v) {
            if (this.bindings.has(key)
                && v !== this.bindings.get(key)) {
                this.bindings.set(key, v);
                this.dispatchEvent(inputBindingChangedEvt$1);
            }
        }
        toJSON() {
            return {
                keyButtonUp: this.keyButtonUp,
                keyButtonDown: this.keyButtonDown,
                keyButtonLeft: this.keyButtonLeft,
                keyButtonRight: this.keyButtonRight,
                keyButtonEmote: this.keyButtonEmote,
                keyButtonToggleAudio: this.keyButtonToggleAudio,
                keyButtonZoomOut: this.keyButtonZoomOut,
                keyButtonZoomIn: this.keyButtonZoomIn,
                gpAxisLeftRight: this.gpAxisLeftRight,
                gpAxisUpDown: this.gpAxisUpDown,
                gpButtonEmote: this.gpButtonEmote,
                gpButtonToggleAudio: this.gpButtonToggleAudio,
                gpButtonZoomIn: this.gpButtonZoomIn,
                gpButtonZoomOut: this.gpButtonZoomOut,
                gpButtonUp: this.gpButtonUp,
                gpButtonDown: this.gpButtonDown,
                gpButtonLeft: this.gpButtonLeft,
                gpButtonRight: this.gpButtonRight
            };
        }
        copy(obj) {
            if (obj) {
                this.keyButtonUp = obj.keyButtonUp;
                this.keyButtonDown = obj.keyButtonDown;
                this.keyButtonLeft = obj.keyButtonLeft;
                this.keyButtonRight = obj.keyButtonRight;
                this.keyButtonEmote = obj.keyButtonEmote;
                this.keyButtonToggleAudio = obj.keyButtonToggleAudio;
                this.keyButtonZoomOut = obj.keyButtonZoomOut;
                this.keyButtonZoomIn = obj.keyButtonZoomIn;
                this.gpAxisLeftRight = obj.gpAxisLeftRight;
                this.gpAxisUpDown = obj.gpAxisUpDown;
                this.gpButtonEmote = obj.gpButtonEmote;
                this.gpButtonToggleAudio = obj.gpButtonToggleAudio;
                this.gpButtonZoomIn = obj.gpButtonZoomIn;
                this.gpButtonZoomOut = obj.gpButtonZoomOut;
                this.gpButtonUp = obj.gpButtonUp;
                this.gpButtonDown = obj.gpButtonDown;
                this.gpButtonLeft = obj.gpButtonLeft;
                this.gpButtonRight = obj.gpButtonRight;
            }
        }
        fix(obj) {
            if (!this.bindings.has("keyButtonUp")) {
                this.keyButtonUp = obj.keyButtonUp;
            }
            if (!this.bindings.has("keyButtonDown")) {
                this.keyButtonDown = obj.keyButtonDown;
            }
            if (!this.bindings.has("keyButtonLeft")) {
                this.keyButtonLeft = obj.keyButtonLeft;
            }
            if (!this.bindings.has("keyButtonRight")) {
                this.keyButtonRight = obj.keyButtonRight;
            }
            if (!this.bindings.has("keyButtonEmote")) {
                this.keyButtonEmote = obj.keyButtonEmote;
            }
            if (!this.bindings.has("keyButtonToggleAudio")) {
                this.keyButtonToggleAudio = obj.keyButtonToggleAudio;
            }
            if (!this.bindings.has("keyButtonZoomOut")) {
                this.keyButtonZoomOut = obj.keyButtonZoomOut;
            }
            if (!this.bindings.has("keyButtonZoomIn")) {
                this.keyButtonZoomIn = obj.keyButtonZoomIn;
            }
            if (!this.bindings.has("gpAxisLeftRight")) {
                this.gpAxisLeftRight = obj.gpAxisLeftRight;
            }
            if (!this.bindings.has("gpAxisUpDown")) {
                this.gpAxisUpDown = obj.gpAxisUpDown;
            }
            if (!this.bindings.has("gpButtonEmote")) {
                this.gpButtonEmote = obj.gpButtonEmote;
            }
            if (!this.bindings.has("gpButtonToggleAudio")) {
                this.gpButtonToggleAudio = obj.gpButtonToggleAudio;
            }
            if (!this.bindings.has("gpButtonZoomIn")) {
                this.gpButtonZoomIn = obj.gpButtonZoomIn;
            }
            if (!this.bindings.has("gpButtonZoomOut")) {
                this.gpButtonZoomOut = obj.gpButtonZoomOut;
            }
            if (!this.bindings.has("gpButtonUp")) {
                this.gpButtonUp = obj.gpButtonUp;
            }
            if (!this.bindings.has("gpButtonDown")) {
                this.gpButtonDown = obj.gpButtonDown;
            }
            if (!this.bindings.has("gpButtonLeft")) {
                this.gpButtonLeft = obj.gpButtonLeft;
            }
            if (!this.bindings.has("gpButtonRight")) {
                this.gpButtonRight = obj.gpButtonRight;
            }
        }
    }
    const DEFAULT_INPUT_BINDING = Object.freeze({
        keyButtonUp: "ArrowUp",
        keyButtonDown: "ArrowDown",
        keyButtonLeft: "ArrowLeft",
        keyButtonRight: "ArrowRight",
        keyButtonEmote: "e",
        keyButtonToggleAudio: "a",
        keyButtonZoomOut: "[",
        keyButtonZoomIn: "]",
        gpAxisLeftRight: 0,
        gpAxisUpDown: 1,
        gpButtonEmote: 0,
        gpButtonToggleAudio: 1,
        gpButtonZoomIn: 6,
        gpButtonZoomOut: 7,
        gpButtonUp: 12,
        gpButtonDown: 13,
        gpButtonLeft: 14,
        gpButtonRight: 15
    });
    class Settings {
        constructor() {
            this._drawHearing = false;
            this._audioDistanceMin = 1;
            this._audioDistanceMax = 10;
            this._audioRolloff = 1;
            this._fontSize = 12;
            this._transitionSpeed = 1;
            this._zoom = 1.5;
            this._roomName = "calla";
            this._userName = "";
            this._email = "";
            this._avatarEmoji = null;
            this._avatarURL = null;
            this._gamepadIndex = 0;
            this._inputBinding = new InputBinding();
            this._preferredAudioOutputID = null;
            this._preferredAudioInputID = null;
            this._preferredVideoInputID = null;
            const thisStr = localStorage.getItem(KEY);
            if (thisStr) {
                const obj = JSON.parse(thisStr);
                const inputBindings = obj._inputBinding;
                delete obj._inputBinding;
                Object.assign(this, obj);
                if (this._avatarEmoji
                    && !isString(this._avatarEmoji)) {
                    if ("value" in this._avatarEmoji) {
                        this._avatarEmoji = this._avatarEmoji.value;
                    }
                    else {
                        this._avatarEmoji = null;
                    }
                }
                this.inputBinding = inputBindings;
            }
            this._inputBinding.fix(DEFAULT_INPUT_BINDING);
            if (window.location.hash.length > 0) {
                this.roomName = window.location.hash.substring(1);
            }
            Object.seal(this);
        }
        commit() {
            localStorage.setItem(KEY, JSON.stringify(this));
        }
        get preferredAudioOutputID() {
            return this._preferredAudioOutputID;
        }
        set preferredAudioOutputID(value) {
            if (value !== this.preferredAudioOutputID) {
                this._preferredAudioOutputID = value;
                this.commit();
            }
        }
        get preferredAudioInputID() {
            return this._preferredAudioInputID;
        }
        set preferredAudioInputID(value) {
            if (value !== this.preferredAudioInputID) {
                this._preferredAudioInputID = value;
                this.commit();
            }
        }
        get preferredVideoInputID() {
            return this._preferredVideoInputID;
        }
        set preferredVideoInputID(value) {
            if (value !== this.preferredVideoInputID) {
                this._preferredVideoInputID = value;
                this.commit();
            }
        }
        get transitionSpeed() {
            return this._transitionSpeed;
        }
        set transitionSpeed(value) {
            if (value !== this.transitionSpeed) {
                this._transitionSpeed = value;
                this.commit();
            }
        }
        get drawHearing() {
            return this._drawHearing;
        }
        set drawHearing(value) {
            if (value !== this.drawHearing) {
                this._drawHearing = value;
                this.commit();
            }
        }
        get audioDistanceMin() {
            return this._audioDistanceMin;
        }
        set audioDistanceMin(value) {
            if (value !== this.audioDistanceMin) {
                this._audioDistanceMin = value;
                this.commit();
            }
        }
        get audioDistanceMax() {
            return this._audioDistanceMax;
        }
        set audioDistanceMax(value) {
            if (value !== this.audioDistanceMax) {
                this._audioDistanceMax = value;
                this.commit();
            }
        }
        get audioRolloff() {
            return this._audioRolloff;
        }
        set audioRolloff(value) {
            if (value !== this.audioRolloff) {
                this._audioRolloff = value;
                this.commit();
            }
        }
        get fontSize() {
            return this._fontSize;
        }
        set fontSize(value) {
            if (value !== this.fontSize) {
                this._fontSize = value;
                this.commit();
            }
        }
        get zoom() {
            return this._zoom;
        }
        set zoom(value) {
            if (value !== this.zoom) {
                this._zoom = value;
                this.commit();
            }
        }
        get userName() {
            return this._userName;
        }
        set userName(value) {
            if (value !== this.userName) {
                this._userName = value;
                this.commit();
            }
        }
        get email() {
            return this._email;
        }
        set email(value) {
            if (value !== this.email) {
                this._email = value;
                this.commit();
            }
        }
        get avatarEmoji() {
            return this._avatarEmoji;
        }
        set avatarEmoji(value) {
            if (value !== this.avatarEmoji) {
                this._avatarEmoji = value;
                this.commit();
            }
        }
        get avatarURL() {
            return this._avatarURL;
        }
        set avatarURL(value) {
            if (value !== this.avatarURL) {
                this._avatarURL = value;
                this.commit();
            }
        }
        get roomName() {
            return this._roomName;
        }
        set roomName(value) {
            if (value !== this.roomName) {
                this._roomName = value;
                this.commit();
            }
        }
        get gamepadIndex() {
            return this._gamepadIndex;
        }
        set gamepadIndex(value) {
            if (value !== this.gamepadIndex) {
                this._gamepadIndex = value;
                this.commit();
            }
        }
        get inputBinding() {
            return this._inputBinding.toJSON();
        }
        set inputBinding(value) {
            let hasChanged = false;
            this._inputBinding.addEventListener("inputBindingChanged", (_) => hasChanged = true, { once: true });
            this._inputBinding.copy(value);
            if (hasChanged) {
                this.commit();
            }
        }
    }

    /**
     * Creates an input box that has a label attached to it.
     * @param id - the ID to use for the input box
     * @param inputType - the type to use for the input box (number, text, etc.)
     * @param labelText - the text to display in the label
     * @param rest - optional attributes, child elements, and text to use on the select element
     */
    function LabeledInput(id, inputType, labelText, ...rest) {
        return new LabeledInputTag(id, inputType, labelText, ...rest);
    }
    /**
     * An input box that has a label attached to it.
     **/
    class LabeledInputTag extends HtmlCustomTag {
        /**
         * Creates an input box that has a label attached to it.
         * @param id - the ID to use for the input box
         * @param inputType - the type to use for the input box (number, text, etc.)
         * @param labelText - the text to display in the label
         * @param rest - optional attributes, child elements, and text to use on the select element
         */
        constructor(id, inputType, labelText, ...rest) {
            super("div");
            this.label = Label(htmlFor(id), labelText);
            this.input = Input(type(inputType), ...rest);
            this.element.append(this.label, this.input);
            this.element.style.display = "grid";
            Object.seal(this);
        }
        /**
         * Retrieves the desired element for attaching events.
         **/
        get eventTarget() {
            return this.input;
        }
        /**
         * Gets the value attribute of the input element
         */
        get value() {
            return this.input.value;
        }
        /**
         * Sets the value attribute of the input element
         */
        set value(v) {
            this.input.value = v;
        }
        /**
         * Gets whether or not the input element is checked, if it's a checkbox or radio button.
         */
        get checked() {
            return this.input.checked;
        }
        /**
         * Sets whether or not the input element is checked, if it's a checkbox or radio button.
         */
        set checked(v) {
            this.input.checked = v;
        }
        /**
         * Sets whether or not the input element should be disabled.
         */
        setLocked(value) {
            setLocked(this.input, value);
        }
    }

    const selectEvt = new TypedEvent("select");
    /**
     * Creates a new panel that can be opened with a button click,
     * living in a collection of panels that will be hidden when
     * this panel is opened.
     * @param id - the ID to use for the content element of the option panel
     * @param name - the text to use in the button that triggers displaying the content element
     * @param rest - optional attributes, child elements, and text to use on the content element
     */
    function OptionPanel(id, name, ...rest) {
        return new OptionPanelTag(id, name, ...rest);
    }
    /**
     * A panel and a button that opens it.
     **/
    class OptionPanelTag extends HtmlCustomTag {
        /**
         * Creates a new panel that can be opened with a button click,
         * living in a collection of panels that will be hidden when
         * this panel is opened.
         * @param id - the ID to use for the content element of the option panel
         * @param name - the text to use in the button that triggers displaying the content element
         * @param rest - optional attributes, child elements, and text to use on the content element
         */
        constructor(panelID, name, ...rest) {
            super("div", id(panelID), P(...rest));
            this.button = Button(id(panelID + "Btn"), onClick(() => this.dispatchEvent(selectEvt)), name);
        }
        isForwardedEvent(name) {
            return name !== "select";
        }
        /**
         * Gets whether or not the panel is visible
         **/
        get visible() {
            return super.visible;
        }
        /**
         * Sets whether or not the panel is visible
         **/
        set visible(v) {
            super.visible = v;
            this.button.className = v ? "tabSelected" : "tabUnselected";
            this.element.className = v ? "tabSelected" : "tabUnselected";
        }
    }

    class OptionsFormAvatarURLChangedEvent extends Event {
        constructor() { super("avatarURLChanged"); }
    }
    class OptionsFormGamepadChangedEvent extends Event {
        constructor() { super("gamepadChanged"); }
    }
    class OptionsFormSelectAvatarEvent extends Event {
        constructor() { super("selectAvatar"); }
    }
    class OptionsFormFontSizeChangedEvent extends Event {
        constructor() { super("fontSizeChanged"); }
    }
    class OptionsFormInputBindingChangedEvent extends Event {
        constructor() { super("inputBindingChanged"); }
    }
    class OptionsFormAudioPropertiesChangedEvent extends Event {
        constructor() { super("audioPropertiesChanged"); }
    }
    class OptionsFormToggleDrawHearingEvent extends Event {
        constructor() { super("toggleDrawHearing"); }
    }
    class OptionsFormToggleVideoEvent extends Event {
        constructor() { super("toggleVideo"); }
    }
    class OptionsFormGamepadButtonUpEvent extends Event {
        constructor() {
            super("gamepadButtonUp");
            this.button = 0;
        }
    }
    class OptionsFormGamepadAxisMaxedEvent extends Event {
        constructor() {
            super("gamepadAxisMaxed");
            this.axis = 0;
        }
    }
    const keyWidthStyle = width("7em"), numberWidthStyle = width("3em"), avatarUrlChangedEvt = new OptionsFormAvatarURLChangedEvent(), gamepadChangedEvt = new OptionsFormGamepadChangedEvent(), selectAvatarEvt = new OptionsFormSelectAvatarEvent(), fontSizeChangedEvt = new OptionsFormFontSizeChangedEvent(), inputBindingChangedEvt = new OptionsFormInputBindingChangedEvent(), audioPropsChangedEvt = new OptionsFormAudioPropertiesChangedEvent(), toggleDrawHearingEvt = new OptionsFormToggleDrawHearingEvent(), toggleVideoEvt$1 = new OptionsFormToggleVideoEvent(), gamepadButtonUpEvt = new OptionsFormGamepadButtonUpEvent(), gamepadAxisMaxedEvt = new OptionsFormGamepadAxisMaxedEvent();
    const disabler$1 = disabled(true), enabler$1 = disabled(false);
    class OptionsForm extends FormDialog {
        constructor() {
            super("options");
            this._drawHearing = false;
            this._inputBinding = new InputBinding();
            this.user = null;
            const _ = (evt) => () => this.dispatchEvent(evt);
            const audioPropsChanged = onInput(_(audioPropsChangedEvt));
            const makeKeyboardBinder = (id, label) => {
                const key = LabeledInput(id, "text", label, keyWidthStyle, onKeyUp((evt) => {
                    const keyEvt = evt;
                    if (keyEvt.key !== "Tab"
                        && keyEvt.key !== "Shift") {
                        this._inputBinding.set(id, keyEvt.key);
                        this.dispatchEvent(inputBindingChangedEvt);
                    }
                }));
                key.value = this._inputBinding.get(id).toString();
                return key;
            };
            const makeGamepadButtonBinder = (id, label) => {
                const gp = LabeledInput(id, "text", label, numberWidthStyle);
                this.addEventListener("gamepadButtonUp", (evt) => {
                    if (document.activeElement === gp.input) {
                        this._inputBinding.set(id, evt.button);
                        this.dispatchEvent(inputBindingChangedEvt);
                    }
                });
                gp.value = this._inputBinding.get(id).toString();
                return gp;
            };
            const makeGamepadAxisBinder = (id, label) => {
                const gp = LabeledInput(id, "text", label, numberWidthStyle);
                this.addEventListener("gamepadAxisMaxed", (evt) => {
                    if (document.activeElement === gp.input) {
                        this._inputBinding.set(id, evt.axis);
                        this.dispatchEvent(inputBindingChangedEvt);
                    }
                });
                gp.value = this._inputBinding.get(id).toString();
                return gp;
            };
            const panels = [
                OptionPanel("avatar", "Avatar", Div(Label(htmlFor("selectAvatarEmoji"), "Emoji: "), Button(id("selectAvatarEmoji"), "Select", onClick(_(selectAvatarEvt)))), " or ", Div(Label(htmlFor("setAvatarURL"), "Photo: "), this.avatarURLInput = InputURL(placeHolder("https://example.com/me.png")), Button(id("setAvatarURL"), "Set", onClick(() => {
                    this.avatarURL = this.avatarURLInput.value;
                    this.dispatchEvent(avatarUrlChangedEvt);
                })), this.clearAvatarURLButton = Button(disabled, "Clear", onClick(() => {
                    this.avatarURL = null;
                    this.dispatchEvent(avatarUrlChangedEvt);
                }))), " or ", Div(Label(htmlFor("videoAvatarButton"), "Video: "), this.useVideoAvatarButton = Button(id("videoAvatarButton"), "Use video", onClick(_(toggleVideoEvt$1)))), this.avatarPreview = Canvas(htmlWidth(256), htmlHeight(256))),
                OptionPanel("interface", "Interface", this.fontSizeInput = LabeledInput("fontSize", "number", "Font size: ", value("10"), min(5), max(32), numberWidthStyle, onInput(_(fontSizeChangedEvt))), P(this.drawHearingCheck = LabeledInput("drawHearing", "checkbox", "Draw hearing range: ", onInput(() => {
                    this.drawHearing = !this.drawHearing;
                    this.dispatchEvent(toggleDrawHearingEvt);
                })), this.audioMinInput = LabeledInput("minAudio", "number", "Min: ", value("1"), min(0), max(100), numberWidthStyle, audioPropsChanged), this.audioMaxInput = LabeledInput("maxAudio", "number", "Min: ", value("10"), min(0), max(100), numberWidthStyle, audioPropsChanged), this.audioRolloffInput = LabeledInput("rollof", "number", "Rollof: ", value("1"), min(0.1), max(10), step(0.1), numberWidthStyle, audioPropsChanged))),
                OptionPanel("keyboard", "Keyboard", this.keyButtonUpInput = makeKeyboardBinder("keyButtonUp", "Up: "), this.keyButtonDownInput = makeKeyboardBinder("keyButtonDown", "Down: "), this.keyButtonLeftInput = makeKeyboardBinder("keyButtonLeft", "Left: "), this.keyButtonRightInput = makeKeyboardBinder("keyButtonRight", "Right: "), this.keyButtonEmoteInput = makeKeyboardBinder("keyButtonEmote", "Emote: "), this.keyButtonToggleAudioInput = makeKeyboardBinder("keyButtonToggleAudio", "Toggle audio: "), this.keyButtonZoomInInput = makeKeyboardBinder("keyButtonZoomIn", "Zoom in: "), this.keyButtonZoomOutInput = makeKeyboardBinder("keyButtonZoomOut", "Zoom out: ")),
                OptionPanel("gamepad", "Gamepad", Div(Label(htmlFor("gamepads"), "Use gamepad: "), this.gpSelect = SelectBox("gamepads", "No gamepad", gp => gp.id, gp => gp.id, onInput(_(gamepadChangedEvt)))), this.gpAxisLeftRightInput = makeGamepadAxisBinder("gpAxisLeftRight", "Left/Right axis:"), this.gpAxisUpDownInput = makeGamepadAxisBinder("gpAxisUpDown", "Up/Down axis:"), this.gpButtonUpInput = makeGamepadButtonBinder("gpButtonUp", "Up button: "), this.gpButtonDownInput = makeGamepadButtonBinder("gpButtonDown", "Down button: "), this.gpButtonLeftInput = makeGamepadButtonBinder("gpButtonLeft", "Left button: "), this.gpButtonRightInput = makeGamepadButtonBinder("gpButtonRight", "Right button: "), this.gpButtonEmoteInput = makeGamepadButtonBinder("gpButtonEmote", "Emote button: "), this.gpButtonToggleAudioInput = makeGamepadButtonBinder("gpButtonToggleAudio", "Toggle audio button: "), this.gpButtonZoomInInput = makeGamepadButtonBinder("gpButtonZoomIn", "Zoom in: "), this.gpButtonZoomOutInput = makeGamepadButtonBinder("gpButtonZoomOut", "Zoom out: "))
            ];
            const cols = [];
            for (let i = 0; i < panels.length; ++i) {
                cols[i] = "1fr";
                panels[i].style.gridColumnStart = (i + 1).toFixed(0);
            }
            gridColsDef(...cols).apply(this.header.style);
            this.header.append(...panels.map(p => p.button));
            this.content.append(...panels.map(p => p.element));
            const showPanel = (p) => () => {
                for (let i = 0; i < panels.length; ++i) {
                    panels[i].visible = i === p;
                }
            };
            for (let i = 0; i < panels.length; ++i) {
                panels[i].visible = i === 0;
                panels[i].addEventListener("select", showPanel(i));
            }
            this._inputBinding.addEventListener("inputBindingChanged", () => {
                this.keyButtonUp = this._inputBinding.keyButtonUp;
                this.keyButtonDown = this._inputBinding.keyButtonDown;
                this.keyButtonLeft = this._inputBinding.keyButtonLeft;
                this.keyButtonRight = this._inputBinding.keyButtonRight;
                this.keyButtonEmote = this._inputBinding.keyButtonEmote;
                this.keyButtonToggleAudio = this._inputBinding.keyButtonToggleAudio;
                this.keyButtonZoomOut = this._inputBinding.keyButtonZoomOut;
                this.keyButtonZoomIn = this._inputBinding.keyButtonZoomIn;
                this.gpAxisLeftRight = this._inputBinding.gpAxisLeftRight;
                this.gpAxisUpDown = this._inputBinding.gpAxisUpDown;
                this.gpButtonUp = this._inputBinding.gpButtonUp;
                this.gpButtonDown = this._inputBinding.gpButtonDown;
                this.gpButtonLeft = this._inputBinding.gpButtonLeft;
                this.gpButtonRight = this._inputBinding.gpButtonRight;
                this.gpButtonEmote = this._inputBinding.gpButtonEmote;
                this.gpButtonToggleAudio = this._inputBinding.gpButtonToggleAudio;
                this.gpButtonZoomOut = this._inputBinding.gpButtonZoomOut;
                this.gpButtonZoomIn = this._inputBinding.gpButtonZoomIn;
            });
            this.gamepads = [];
            this._avatarG = this.avatarPreview.getContext("2d");
            Object.seal(this);
        }
        update() {
            if (isOpen(this)) {
                const pad = this.currentGamepad;
                if (pad) {
                    if (this._pad) {
                        this._pad.update(pad);
                    }
                    else {
                        this._pad = new EventedGamepad(pad);
                        this._pad.addEventListener("gamepadbuttonup", (evt) => {
                            gamepadButtonUpEvt.button = evt.button;
                            this.dispatchEvent(gamepadButtonUpEvt);
                        });
                        this._pad.addEventListener("gamepadaxismaxed", (evt) => {
                            gamepadAxisMaxedEvt.axis = evt.axis;
                            this.dispatchEvent(gamepadAxisMaxedEvt);
                        });
                    }
                }
                if (this.user && this.user.avatar) {
                    this._avatarG.clearRect(0, 0, this.avatarPreview.width, this.avatarPreview.height);
                    this.user.avatar.draw(this._avatarG, this.avatarPreview.width, this.avatarPreview.height, true);
                }
            }
        }
        get avatarURL() {
            if (this.avatarURLInput.value.length === 0) {
                return null;
            }
            else {
                return this.avatarURLInput.value;
            }
        }
        set avatarURL(v) {
            if (isString(v)) {
                this.avatarURLInput.value = v;
                enabler$1.apply(this.clearAvatarURLButton);
            }
            else {
                this.avatarURLInput.value = "";
                disabler$1.apply(this.clearAvatarURLButton);
            }
        }
        setAvatarVideo(v) {
            if (v !== null) {
                this.useVideoAvatarButton.innerHTML = "Remove video";
            }
            else {
                this.useVideoAvatarButton.innerHTML = "Use video";
            }
        }
        get inputBinding() {
            return this._inputBinding.toJSON();
        }
        set inputBinding(value) {
            this._inputBinding.copy(value);
        }
        get gamepads() {
            return this.gpSelect.values;
        }
        set gamepads(values) {
            const disable = values.length === 0;
            this.gpSelect.values = values;
            setLocked(this.gpAxisLeftRightInput, disable);
            setLocked(this.gpAxisUpDownInput, disable);
            setLocked(this.gpButtonUpInput, disable);
            setLocked(this.gpButtonDownInput, disable);
            setLocked(this.gpButtonLeftInput, disable);
            setLocked(this.gpButtonRightInput, disable);
            setLocked(this.gpButtonEmoteInput, disable);
            setLocked(this.gpButtonToggleAudioInput, disable);
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
                this.audioMinInput.value = value.toFixed(3);
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
                this.audioMaxInput.value = value.toFixed(3);
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
                this.audioRolloffInput.value = value.toFixed(3);
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
                this.fontSizeInput.value = value.toFixed(3);
            }
        }
        get keyButtonUp() { return this.keyButtonUpInput.value; }
        set keyButtonUp(v) { this.keyButtonUpInput.value = v; }
        get keyButtonDown() { return this.keyButtonDownInput.value; }
        set keyButtonDown(v) { this.keyButtonDownInput.value = v; }
        get keyButtonLeft() { return this.keyButtonLeftInput.value; }
        set keyButtonLeft(v) { this.keyButtonLeftInput.value = v; }
        get keyButtonRight() { return this.keyButtonRightInput.value; }
        set keyButtonRight(v) { this.keyButtonRightInput.value = v; }
        get keyButtonEmote() { return this.keyButtonEmoteInput.value; }
        set keyButtonEmote(v) { this.keyButtonEmoteInput.value = v; }
        get keyButtonToggleAudio() { return this.keyButtonToggleAudioInput.value; }
        set keyButtonToggleAudio(v) { this.keyButtonToggleAudioInput.value = v; }
        get keyButtonZoomOut() { return this.keyButtonZoomOutInput.value; }
        set keyButtonZoomOut(v) { this.keyButtonZoomOutInput.value = v; }
        get keyButtonZoomIn() { return this.keyButtonZoomInInput.value; }
        set keyButtonZoomIn(v) { this.keyButtonZoomInInput.value = v; }
        getInteger(str) {
            if (str && /^\d+$/.test(str)) {
                return parseInt(str, 10);
            }
            else {
                return -1;
            }
        }
        get gpAxisLeftRight() {
            return this.getInteger(this.gpAxisLeftRightInput.value);
        }
        set gpAxisLeftRight(v) {
            if (v) {
                this.gpAxisLeftRightInput.value = v.toFixed(0);
            }
        }
        get gpAxisUpDown() {
            return this.getInteger(this.gpAxisUpDownInput.value);
        }
        set gpAxisUpDown(v) {
            if (v) {
                this.gpAxisUpDownInput.value = v.toFixed(0);
            }
        }
        get gpButtonUp() {
            return this.getInteger(this.gpButtonUpInput.value);
        }
        set gpButtonUp(v) {
            if (v) {
                this.gpButtonUpInput.value = v.toFixed(0);
            }
        }
        get gpButtonDown() {
            return this.getInteger(this.gpButtonDownInput.value);
        }
        set gpButtonDown(v) {
            if (v) {
                this.gpButtonDownInput.value = v.toFixed(0);
            }
        }
        get gpButtonLeft() {
            return this.getInteger(this.gpButtonLeftInput.value);
        }
        set gpButtonLeft(v) {
            if (v) {
                this.gpButtonLeftInput.value = v.toFixed(0);
            }
        }
        get gpButtonRight() {
            return this.getInteger(this.gpButtonRightInput.value);
        }
        set gpButtonRight(v) {
            if (v) {
                this.gpButtonRightInput.value = v.toFixed(0);
            }
        }
        get gpButtonEmote() {
            return this.getInteger(this.gpButtonEmoteInput.value);
        }
        set gpButtonEmote(v) {
            if (v) {
                this.gpButtonEmoteInput.value = v.toFixed(0);
            }
        }
        get gpButtonToggleAudio() {
            return this.getInteger(this.gpButtonToggleAudioInput.value);
        }
        set gpButtonToggleAudio(v) {
            if (v) {
                this.gpButtonToggleAudioInput.value = v.toFixed(0);
            }
        }
        get gpButtonZoomOut() {
            return this.getInteger(this.gpButtonZoomOutInput.value);
        }
        set gpButtonZoomOut(v) {
            if (v) {
                this.gpButtonZoomOutInput.value = v.toFixed(0);
            }
        }
        get gpButtonZoomIn() {
            return this.getInteger(this.gpButtonZoomInInput.value);
        }
        set gpButtonZoomIn(v) {
            if (v) {
                this.gpButtonZoomInInput.value = v.toFixed(0);
            }
        }
    }

    const newRowColor = backgroundColor("lightgreen");
    const hoveredColor = backgroundColor("rgba(65, 255, 202, 0.25)");
    const unhoveredColor = backgroundColor("transparent");
    class UserDirectoryFormWarpToEvent extends Event {
        constructor() {
            super("warpTo");
            this.id = null;
        }
    }
    const warpToEvt = new UserDirectoryFormWarpToEvent();
    const ROW_TIMEOUT = 3000;
    class UserDirectoryForm extends FormDialog {
        constructor() {
            super("users");
            this.roomName = null;
            this.userName = null;
            this.rows = new Map();
            this.users = new Map();
            this.avatarGs = new Map();
            this.lastUser = null;
            this.usersList = Div(id("chatUsers"));
            Object.seal(this);
        }
        async startAsync(roomName, userName) {
            this.roomName = roomName;
            this.userName = userName;
        }
        update() {
            if (isOpen(this)) {
                for (let entries of this.users.entries()) {
                    const [id, user] = entries;
                    if (this.avatarGs.has(id) && user.avatar) {
                        const g = this.avatarGs.get(id);
                        g.clearRect(0, 0, g.canvas.width, g.canvas.height);
                        user.avatar.draw(g, g.canvas.width, g.canvas.height, user.isMe);
                    }
                }
            }
        }
        set(user) {
            const isNew = !this.rows.has(user.id);
            this.delete(user.id);
            const row = this.rows.size + 1;
            if (isNew) {
                const elem = Div(gridPos(1, row, 2, 1), zIndex(-1), newRowColor);
                setTimeout(() => {
                    this.usersList.removeChild(elem);
                }, ROW_TIMEOUT);
                this.usersList.append(elem);
                this.users.set(user.id, user);
                this.avatarGs.set(user.id, Canvas(htmlWidth(32), htmlHeight(32))
                    .getContext("2d"));
            }
            const avatar = this.avatarGs.get(user.id).canvas;
            const trueRow = Div(styles(gridPos(1, row, 2, 1), zIndex(1), unhoveredColor), onMouseOver((_) => {
                hoveredColor.apply(trueRow.style);
            }), onMouseOut(() => unhoveredColor.apply(trueRow.style)), onClick(() => {
                hide(this);
                warpToEvt.id = user.id;
                this.dispatchEvent(warpToEvt);
            }));
            const elems = [
                Div(styles(gridPos(1, row), zIndex(0)), avatar),
                Div(styles(gridPos(2, row), zIndex(0)), user.displayName),
                trueRow
            ];
            this.rows.set(user.id, elems);
            this.usersList.append(...elems);
        }
        delete(userID) {
            if (this.rows.has(userID)) {
                const elems = this.rows.get(userID);
                this.rows.delete(userID);
                for (let elem of elems) {
                    this.usersList.removeChild(elem);
                }
                let rowCount = 1;
                for (let elems of this.rows.values()) {
                    const r = row(rowCount++);
                    for (let elem of elems) {
                        r.apply(elem.style);
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
            const elem = Div(styles(gridPos(1, this.rows.size + 1, 2, 1), backgroundColor("yellow")), ...rest.map(i => i.toString()));
            this.usersList.append(elem);
            setTimeout(() => {
                this.usersList.removeChild(elem);
            }, 5000);
        }
    }

    /**
     * Translate a value out of a range.
     */
    function unproject(v, min, max) {
        return v * (max - min) + min;
    }

    let _getTransform;
    if (!Object.prototype.hasOwnProperty.call(CanvasRenderingContext2D.prototype, "getTransform")
        && Object.prototype.hasOwnProperty.call(CanvasRenderingContext2D.prototype, "mozCurrentTransform")) {
        class MockDOMMatrix {
            constructor(trans) {
                this.a = trans[0];
                this.b = trans[1];
                this.c = trans[2];
                this.d = trans[3];
                this.e = trans[4];
                this.f = trans[5];
            }
            get is2D() {
                return true;
            }
            get isIdentity() {
                return this.a === 1
                    && this.b === 0
                    && this.c === 0
                    && this.d === 1
                    && this.e === 0
                    && this.f === 0;
            }
            transformPoint(p) {
                if (p !== undefined
                    && p.x !== undefined
                    && p.y !== undefined) {
                    return {
                        x: p.x * this.a + p.y * this.c + this.e,
                        y: p.x * this.b + p.y * this.d + this.f
                    };
                }
                else {
                    return null;
                }
            }
        }
        _getTransform = (g) => {
            const mozG = g;
            return new MockDOMMatrix(mozG.mozCurrentTransform);
        };
    }
    else {
        _getTransform = (g) => {
            return g.getTransform();
        };
    }
    function getTransform(g) {
        return _getTransform(g);
    }

    class CanvasImage extends TypedEventBase {
        constructor(width, height) {
            super();
            this.redrawnEvt = new TypedEvent("redrawn");
            this._canvas = createUtilityCanvas(width, height);
            this._g = this.canvas.getContext("2d");
        }
        get canvas() {
            return this._canvas;
        }
        get g() {
            return this._g;
        }
        fillRect(color, x, y, width, height, margin) {
            this.g.fillStyle = color;
            this.g.fillRect(x + margin, y + margin, width - 2 * margin, height - 2 * margin);
        }
        drawText(text, x, y, align) {
            this.g.textAlign = align;
            this.g.strokeText(text, x, y);
            this.g.fillText(text, x, y);
        }
        redraw() {
            if (this.onRedraw()) {
                this.dispatchEvent(this.redrawnEvt);
            }
        }
    }

    class TextImage extends CanvasImage {
        constructor(options) {
            super(10, 10);
            this._minWidth = null;
            this._maxWidth = null;
            this._minHeight = null;
            this._maxHeight = null;
            this._strokeColor = null;
            this._strokeSize = null;
            this._bgColor = null;
            this._value = null;
            this._scale = 1;
            this._fillColor = "black";
            this._textDirection = "horizontal";
            this._wrapWords = true;
            this._fontStyle = "normal";
            this._fontVariant = "normal";
            this._fontWeight = "normal";
            this._fontFamily = "sans-serif";
            this._fontSize = 20;
            this.notReadyEvt = new TypedEvent("notready");
            if (isDefined(options)) {
                if (isDefined(options.minWidth)) {
                    this._minWidth = options.minWidth;
                }
                if (isDefined(options.maxWidth)) {
                    this._maxWidth = options.maxWidth;
                }
                if (isDefined(options.minHeight)) {
                    this._minHeight = options.minHeight;
                }
                if (isDefined(options.maxHeight)) {
                    this._maxHeight = options.maxHeight;
                }
                if (isDefined(options.strokeColor)) {
                    this._strokeColor = options.strokeColor;
                }
                if (isDefined(options.strokeSize)) {
                    this._strokeSize = options.strokeSize;
                }
                if (isDefined(options.bgColor)) {
                    this._bgColor = options.bgColor;
                }
                if (isDefined(options.value)) {
                    this._value = options.value;
                }
                if (isDefined(options.scale)) {
                    this._scale = options.scale;
                }
                if (isDefined(options.fillColor)) {
                    this._fillColor = options.fillColor;
                }
                if (isDefined(options.textDirection)) {
                    this._textDirection = options.textDirection;
                }
                if (isDefined(options.wrapWords)) {
                    this._wrapWords = options.wrapWords;
                }
                if (isDefined(options.fontStyle)) {
                    this._fontStyle = options.fontStyle;
                }
                if (isDefined(options.fontVariant)) {
                    this._fontVariant = options.fontVariant;
                }
                if (isDefined(options.fontWeight)) {
                    this._fontWeight = options.fontWeight;
                }
                if (isDefined(options.fontFamily)) {
                    this._fontFamily = options.fontFamily;
                }
                if (isDefined(options.fontSize)) {
                    this._fontSize = options.fontSize;
                }
                if (isDefined(options.padding)) {
                    this._padding = options.padding;
                }
            }
            if (isNullOrUndefined(this._padding)) {
                this._padding = {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0
                };
            }
        }
        get scale() {
            return this._scale;
        }
        set scale(v) {
            if (this.scale !== v) {
                this._scale = v;
                this.redraw();
            }
        }
        get minWidth() {
            return this._minWidth;
        }
        set minWidth(v) {
            if (this.minWidth !== v) {
                this._minWidth = v;
                this.redraw();
            }
        }
        get maxWidth() {
            return this._maxWidth;
        }
        set maxWidth(v) {
            if (this.maxWidth !== v) {
                this._maxWidth = v;
                this.redraw();
            }
        }
        get minHeight() {
            return this._minHeight;
        }
        set minHeight(v) {
            if (this.minHeight !== v) {
                this._minHeight = v;
                this.redraw();
            }
        }
        get maxHeight() {
            return this._maxHeight;
        }
        set maxHeight(v) {
            if (this.maxHeight !== v) {
                this._maxHeight = v;
                this.redraw();
            }
        }
        get width() {
            return this.canvas.width / this.scale;
        }
        get height() {
            return this.canvas.height / this.scale;
        }
        get padding() {
            return this._padding;
        }
        set padding(v) {
            if (v instanceof Array) {
                throw new Error("Invalid padding");
            }
            if (this.padding.top !== v.top
                || this.padding.right != v.right
                || this.padding.bottom != v.bottom
                || this.padding.left != v.left) {
                this._padding = v;
                this.redraw();
            }
        }
        get wrapWords() {
            return this._wrapWords;
        }
        set wrapWords(v) {
            if (this.wrapWords !== v) {
                this._wrapWords = v;
                this.redraw();
            }
        }
        get textDirection() {
            return this._textDirection;
        }
        set textDirection(v) {
            if (this.textDirection !== v) {
                this._textDirection = v;
                this.redraw();
            }
        }
        get fontStyle() {
            return this._fontStyle;
        }
        set fontStyle(v) {
            if (this.fontStyle !== v) {
                this._fontStyle = v;
                this.redraw();
            }
        }
        get fontVariant() {
            return this._fontVariant;
        }
        set fontVariant(v) {
            if (this.fontVariant !== v) {
                this._fontVariant = v;
                this.redraw();
            }
        }
        get fontWeight() {
            return this._fontWeight;
        }
        set fontWeight(v) {
            if (this.fontWeight !== v) {
                this._fontWeight = v;
                this.redraw();
            }
        }
        get fontSize() {
            return this._fontSize;
        }
        set fontSize(v) {
            if (this.fontSize !== v) {
                this._fontSize = v;
                this.redraw();
            }
        }
        get fontFamily() {
            return this._fontFamily;
        }
        set fontFamily(v) {
            if (this.fontFamily !== v) {
                this._fontFamily = v;
                this.redraw();
            }
        }
        get fillColor() {
            return this._fillColor;
        }
        set fillColor(v) {
            if (this.fillColor !== v) {
                this._fillColor = v;
                this.redraw();
            }
        }
        get strokeColor() {
            return this._strokeColor;
        }
        set strokeColor(v) {
            if (this.strokeColor !== v) {
                this._strokeColor = v;
                this.redraw();
            }
        }
        get strokeSize() {
            return this._strokeSize;
        }
        set strokeSize(v) {
            if (this.strokeSize !== v) {
                this._strokeSize = v;
                this.redraw();
            }
        }
        get bgColor() {
            return this._bgColor;
        }
        set bgColor(v) {
            if (this.bgColor !== v) {
                this._bgColor = v;
                this.redraw();
            }
        }
        get value() {
            return this._value;
        }
        set value(v) {
            if (this.value !== v) {
                this._value = v;
                this.redraw();
            }
        }
        draw(g, x, y) {
            if (this.canvas.width > 0
                && this.canvas.height > 0) {
                g.drawImage(this.canvas, x, y, this.width, this.height);
            }
        }
        split(value) {
            if (this.wrapWords) {
                return value
                    .split(' ')
                    .join('\n')
                    .replace(/\r\n/, '\n')
                    .split('\n');
            }
            else {
                return value
                    .replace(/\r\n/, '\n')
                    .split('\n');
            }
        }
        onRedraw() {
            this.g.clearRect(0, 0, this.canvas.width, this.canvas.height);
            if (this.fontFamily
                && this.fontSize
                && (this.fillColor || (this.strokeColor && this.strokeSize))
                && this.value) {
                const isVertical = this.textDirection && this.textDirection.indexOf("vertical") === 0;
                const autoResize = this.minWidth != null
                    || this.maxWidth != null
                    || this.minHeight != null
                    || this.maxHeight != null;
                const _targetMinWidth = ((this.minWidth || 0) - this.padding.right - this.padding.left) * this.scale;
                const _targetMaxWidth = ((this.maxWidth || 4096) - this.padding.right - this.padding.left) * this.scale;
                const _targetMinHeight = ((this.minHeight || 0) - this.padding.top - this.padding.bottom) * this.scale;
                const _targetMaxHeight = ((this.maxHeight || 4096) - this.padding.top - this.padding.bottom) * this.scale;
                const targetMinWidth = isVertical ? _targetMinHeight : _targetMinWidth;
                const targetMaxWidth = isVertical ? _targetMaxHeight : _targetMaxWidth;
                const targetMinHeight = isVertical ? _targetMinWidth : _targetMinHeight;
                const targetMaxHeight = isVertical ? _targetMaxWidth : _targetMaxHeight;
                const tried = [];
                const lines = this.split(this.value);
                let dx = 0, trueWidth = 0, trueHeight = 0, tooBig = false, tooSmall = false, highFontSize = 10000, lowFontSize = 0, fontSize = clamp(this.fontSize * this.scale, lowFontSize, highFontSize), minFont = null, minFontDelta = Number.MAX_VALUE;
                do {
                    const realFontSize = this.fontSize;
                    this._fontSize = fontSize;
                    const font = makeFont(this);
                    this._fontSize = realFontSize;
                    this.g.textAlign = "center";
                    this.g.textBaseline = "middle";
                    this.g.font = font;
                    trueWidth = 0;
                    trueHeight = 0;
                    for (const line of lines) {
                        const metrics = this.g.measureText(line);
                        trueWidth = Math.max(trueWidth, metrics.width);
                        trueHeight += fontSize;
                        if (isNumber(metrics.actualBoundingBoxLeft)
                            && isNumber(metrics.actualBoundingBoxRight)
                            && isNumber(metrics.actualBoundingBoxAscent)
                            && isNumber(metrics.actualBoundingBoxDescent)) {
                            if (!autoResize) {
                                trueWidth = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;
                                trueHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
                                dx = (metrics.actualBoundingBoxLeft - trueWidth / 2) / 2;
                            }
                        }
                    }
                    if (autoResize) {
                        const dMinWidth = trueWidth - targetMinWidth;
                        const dMaxWidth = trueWidth - targetMaxWidth;
                        const dMinHeight = trueHeight - targetMinHeight;
                        const dMaxHeight = trueHeight - targetMaxHeight;
                        const mdMinWidth = Math.abs(dMinWidth);
                        const mdMaxWidth = Math.abs(dMaxWidth);
                        const mdMinHeight = Math.abs(dMinHeight);
                        const mdMaxHeight = Math.abs(dMaxHeight);
                        tooBig = dMaxWidth > 1 || dMaxHeight > 1;
                        tooSmall = dMinWidth < -1 && dMinHeight < -1;
                        const minDif = Math.min(mdMinWidth, Math.min(mdMaxWidth, Math.min(mdMinHeight, mdMaxHeight)));
                        if (minDif < minFontDelta) {
                            minFontDelta = minDif;
                            minFont = this.g.font;
                        }
                        if ((tooBig || tooSmall)
                            && tried.indexOf(this.g.font) > -1
                            && minFont) {
                            this.g.font = minFont;
                            tooBig = false;
                            tooSmall = false;
                        }
                        if (tooBig) {
                            highFontSize = fontSize;
                            fontSize = (lowFontSize + fontSize) / 2;
                        }
                        else if (tooSmall) {
                            lowFontSize = fontSize;
                            fontSize = (fontSize + highFontSize) / 2;
                        }
                    }
                    tried.push(this.g.font);
                } while (tooBig || tooSmall);
                if (autoResize) {
                    if (trueWidth < targetMinWidth) {
                        trueWidth = targetMinWidth;
                    }
                    else if (trueWidth > targetMaxWidth) {
                        trueWidth = targetMaxWidth;
                    }
                    if (trueHeight < targetMinHeight) {
                        trueHeight = targetMinHeight;
                    }
                    else if (trueHeight > targetMaxHeight) {
                        trueHeight = targetMaxHeight;
                    }
                }
                const newW = trueWidth + this.scale * (this.padding.right + this.padding.left);
                const newH = trueHeight + this.scale * (this.padding.top + this.padding.bottom);
                try {
                    setContextSize(this.g, newW, newH);
                }
                catch (exp) {
                    console.error(exp);
                    throw exp;
                }
                if (this.bgColor) {
                    this.g.fillStyle = this.bgColor;
                    this.g.fillRect(0, 0, this.canvas.width, this.canvas.height);
                }
                else {
                    this.g.clearRect(0, 0, this.canvas.width, this.canvas.height);
                }
                if (this.strokeColor && this.strokeSize) {
                    this.g.lineWidth = this.strokeSize * this.scale;
                    this.g.strokeStyle = this.strokeColor;
                }
                if (this.fillColor) {
                    this.g.fillStyle = this.fillColor;
                }
                const di = 0.5 * (lines.length - 1);
                for (let i = 0; i < lines.length; ++i) {
                    const line = lines[i];
                    const dy = (i - di) * fontSize;
                    const x = dx + this.canvas.width / 2;
                    const y = dy + this.canvas.height / 2;
                    if (this.strokeColor && this.strokeSize) {
                        this.g.strokeText(line, x, y);
                    }
                    if (this.fillColor) {
                        this.g.fillText(line, x, y);
                    }
                }
                if (isVertical) {
                    const canv = createUtilityCanvas(this.canvas.height, this.canvas.width);
                    const g = canv.getContext("2d");
                    if (g) {
                        g.translate(canv.width / 2, canv.height / 2);
                        if (this.textDirection === "vertical"
                            || this.textDirection === "vertical-left") {
                            g.rotate(Math.PI / 2);
                        }
                        else if (this.textDirection === "vertical-right") {
                            g.rotate(-Math.PI / 2);
                        }
                        g.translate(-this.canvas.width / 2, -this.canvas.height / 2);
                        g.drawImage(this.canvas, 0, 0);
                        setContextSize(this.g, canv.width, canv.height);
                    }
                    else {
                        console.warn("Couldn't rotate the TextImage");
                    }
                    this.g.drawImage(canv, 0, 0);
                }
                return true;
            }
            else {
                this.dispatchEvent(this.notReadyEvt);
                return false;
            }
        }
    }

    const EMOJI_LIFE = 3;
    class EmoteEvent extends TypedEvent {
        constructor(emoji) {
            super("emote");
            this.emoji = emoji;
        }
    }
    class Emote {
        constructor(emoji, x, y) {
            this.emoji = emoji;
            this.x = x;
            this.y = y;
            this.life = 1;
            this.width = -1;
            this.emoteText = null;
            this.dx = Math.random() - 0.5;
            this.dy = -Math.random() * 0.5 - 0.5;
            this.emoteText = new TextImage();
            this.emoteText.fontFamily = "Noto Color Emoji";
            this.emoteText.value = emoji.value;
        }
        isDead() {
            return this.life <= 0.01;
        }
        update(dt) {
            this.life -= dt / EMOJI_LIFE;
            this.dx *= 0.99;
            this.dy *= 0.99;
            this.x += this.dx * dt;
            this.y += this.dy * dt;
        }
        drawShadow(g, map) {
            const scale = getTransform(g).a;
            g.save();
            {
                g.shadowColor = "rgba(0, 0, 0, 0.5)";
                g.shadowOffsetX = 3 * scale;
                g.shadowOffsetY = 3 * scale;
                g.shadowBlur = 3 * scale;
                this.drawEmote(g, map);
            }
            g.restore();
        }
        drawEmote(g, map) {
            const oldAlpha = g.globalAlpha, scale = getTransform(g).a;
            g.globalAlpha = this.life;
            this.emoteText.fontSize = map.tileHeight / 2;
            this.emoteText.scale = scale;
            this.emoteText.draw(g, this.x * map.tileWidth - this.width / 2, this.y * map.tileHeight);
            g.globalAlpha = oldAlpha;
        }
    }

    class ScreenPointerEvent extends TypedEvent {
        constructor(type) {
            super(type);
            this.pointerType = null;
            this.pointerID = null;
            this.x = 0;
            this.y = 0;
            this.dx = 0;
            this.dy = 0;
            this.dz = 0;
            this.u = 0;
            this.v = 0;
            this.du = 0;
            this.dv = 0;
            this.buttons = 0;
            this.dragDistance = 0;
            Object.seal(this);
        }
    }
    class InputTypeChangingEvent extends TypedEvent {
        constructor(newInputType) {
            super("inputTypeChanging");
            this.newInputType = newInputType;
            Object.freeze(this);
        }
    }
    class Pointer {
        constructor(evt) {
            if (evt.type !== "wheel") {
                const ptrEvt = evt;
                this.type = ptrEvt.pointerType;
                this.id = ptrEvt.pointerId;
            }
            else {
                this.type = "mouse";
                this.id = 0;
            }
            this.buttons = evt.buttons;
            this.moveDistance = 0;
            this.dragDistance = 0;
            this.x = evt.offsetX;
            this.y = evt.offsetY;
            this.dx = evt.movementX;
            this.dy = evt.movementY;
            Object.seal(this);
        }
    }
    const MAX_DRAG_DISTANCE = 5, pointerDownEvt = new ScreenPointerEvent("pointerdown"), pointerUpEvt = new ScreenPointerEvent("pointerup"), clickEvt = new ScreenPointerEvent("click"), moveEvt = new ScreenPointerEvent("move"), dragEvt = new ScreenPointerEvent("drag");
    class ScreenPointerControls extends TypedEventBase {
        constructor(element) {
            super();
            this.pointers = new Map();
            this.currentInputType = null;
            let canClick = true;
            const dispatch = (evt, pointer, dz) => {
                evt.pointerType = pointer.type;
                evt.pointerID = pointer.id;
                evt.buttons = pointer.buttons;
                evt.x = pointer.x;
                evt.y = pointer.y;
                evt.u = unproject(project(evt.x, 0, element.clientWidth), -1, 1);
                evt.v = unproject(project(evt.y, 0, element.clientHeight), -1, 1);
                evt.dx = pointer.dx;
                evt.dy = pointer.dy;
                evt.dz = dz;
                evt.du = 2 * evt.dx / element.clientWidth;
                evt.dv = 2 * evt.dy / element.clientHeight;
                evt.dragDistance = pointer.dragDistance;
                this.dispatchEvent(evt);
            };
            /**
             * @param pointer - the newest state of the pointer.
             * @returns the pointer state that was replaced, if any.
             */
            const replacePointer = (pointer) => {
                const last = this.pointers.get(pointer.id);
                if (last) {
                    pointer.dragDistance = last.dragDistance;
                    if (document.pointerLockElement) {
                        pointer.x = last.x + pointer.dx;
                        pointer.y = last.y + pointer.dy;
                    }
                }
                pointer.moveDistance = Math.sqrt(pointer.dx * pointer.dx
                    + pointer.dy * pointer.dy);
                this.pointers.set(pointer.id, pointer);
                return last;
            };
            element.addEventListener("wheel", (evt) => {
                if (!evt.shiftKey
                    && !evt.altKey
                    && !evt.ctrlKey
                    && !evt.metaKey) {
                    evt.preventDefault();
                    // Chrome and Firefox report scroll values in completely different ranges.
                    const pointer = new Pointer(evt);
                    replacePointer(pointer);
                    const deltaZ = -evt.deltaY * (isFirefox ? 1 : 0.02);
                    dispatch(moveEvt, pointer, deltaZ);
                }
            }, { passive: false });
            element.addEventListener("pointerdown", (evt) => {
                const oldCount = this.pressCount;
                const pointer = new Pointer(evt);
                replacePointer(pointer);
                const newCount = this.pressCount;
                if (pointer.type !== this.currentInputType) {
                    this.dispatchEvent(new InputTypeChangingEvent(pointer.type));
                    this.currentInputType = pointer.type;
                }
                dispatch(pointerDownEvt, pointer, 0);
                canClick = oldCount === 0
                    && newCount === 1;
            });
            const getPinchZoom = (oldPinchDistance, newPinchDistance) => {
                if (oldPinchDistance !== null
                    && newPinchDistance !== null) {
                    canClick = false;
                    const ddist = newPinchDistance - oldPinchDistance;
                    return ddist / 10;
                }
                return 0;
            };
            element.addEventListener("pointermove", (evt) => {
                const oldPinchDistance = this.pinchDistance, pointer = new Pointer(evt), last = replacePointer(pointer), count = this.pressCount, dz = getPinchZoom(oldPinchDistance, this.pinchDistance);
                dispatch(moveEvt, pointer, dz);
                if (count === 1
                    && pointer.buttons === 1
                    && last && last.buttons === pointer.buttons) {
                    pointer.dragDistance += pointer.moveDistance;
                    if (pointer.dragDistance > MAX_DRAG_DISTANCE) {
                        canClick = false;
                        dispatch(dragEvt, pointer, 0);
                    }
                }
            });
            element.addEventListener("pointerup", (evt) => {
                const pointer = new Pointer(evt), lastPointer = replacePointer(pointer);
                pointer.buttons = lastPointer.buttons;
                dispatch(pointerUpEvt, pointer, 0);
                if (canClick) {
                    dispatch(clickEvt, pointer, 0);
                }
                pointer.dragDistance = 0;
                if (pointer.type === "touch") {
                    this.pointers.delete(pointer.id);
                }
            });
            element.addEventListener("contextmenu", (evt) => {
                evt.preventDefault();
            });
            element.addEventListener("pointercancel", (evt) => {
                if (this.pointers.has(evt.pointerId)) {
                    this.pointers.delete(evt.pointerId);
                }
            });
        }
        get primaryPointer() {
            for (let pointer of this.pointers.values()) {
                return pointer;
            }
            return null;
        }
        getPointerCount(type) {
            let count = 0;
            for (const pointer of this.pointers.values()) {
                if (pointer.type === type) {
                    ++count;
                }
            }
            return count;
        }
        get pressCount() {
            let count = 0;
            for (let pointer of this.pointers.values()) {
                if (pointer.buttons > 0) {
                    ++count;
                }
            }
            return count;
        }
        get pinchDistance() {
            const count = this.pressCount;
            if (count !== 2) {
                return null;
            }
            let a, b;
            for (let pointer of this.pointers.values()) {
                if (pointer.buttons === 1) {
                    if (!a) {
                        a = pointer;
                    }
                    else if (!b) {
                        b = pointer;
                    }
                    else {
                        break;
                    }
                }
            }
            const dx = b.x - a.x, dy = b.y - a.y;
            return Math.sqrt(dx * dx + dy * dy);
        }
    }

    // javascript-astar 0.4.1
    function pathTo(node) {
        let curr = node;
        const path = new Array();
        while (curr.parent) {
            path.unshift(curr);
            curr = curr.parent;
        }
        return path;
    }
    function getHeap() {
        return new BinaryHeap(function (node) {
            return node.f;
        });
    }
    /**
    * Perform an A* Search on a graph given a start and end node.
    */
    function search(graph, start, end, options) {
        graph.cleanDirty();
        options = options || {};
        const heuristic = options.heuristic || heuristics.manhattan;
        const closest = options.closest || false;
        const openHeap = getHeap();
        let closestNode = start; // set the start node to be the closest if required
        start.h = heuristic(start, end);
        graph.markDirty(start);
        openHeap.push(start);
        while (openHeap.size() > 0) {
            // Grab the lowest f(x) to process next.  Heap keeps this sorted for us.
            const currentNode = openHeap.pop();
            // End case -- result has been found, return the traced path.
            if (currentNode === end) {
                return pathTo(currentNode);
            }
            // Normal case -- move currentNode from open to closed, process each of its neighbors.
            currentNode.closed = true;
            // Find all neighbors for the current node.
            const neighbors = graph.neighbors(currentNode);
            for (const neighbor of neighbors) {
                if (neighbor.closed || neighbor.isWall()) {
                    // Not a valid node to process, skip to next neighbor.
                    continue;
                }
                // The g score is the shortest distance from start to current node.
                // We need to check if the path we have arrived at this neighbor is the shortest one we have seen yet.
                const gScore = currentNode.g + neighbor.getCost(currentNode);
                const beenVisited = neighbor.visited;
                if (!beenVisited || gScore < neighbor.g) {
                    // Found an optimal (so far) path to this node.  Take score for node to see how good it is.
                    neighbor.visited = true;
                    neighbor.parent = currentNode;
                    neighbor.h = neighbor.h || heuristic(neighbor, end);
                    neighbor.g = gScore;
                    neighbor.f = neighbor.g + neighbor.h;
                    graph.markDirty(neighbor);
                    if (closest) {
                        // If the neighbour is closer than the current closestNode or if it's equally close but has
                        // a cheaper path than the current closest node then it becomes the closest node
                        if (neighbor.h < closestNode.h || (neighbor.h === closestNode.h && neighbor.g < closestNode.g)) {
                            closestNode = neighbor;
                        }
                    }
                    if (!beenVisited) {
                        // Pushing to heap will put it in proper place based on the 'f' value.
                        openHeap.push(neighbor);
                    }
                    else {
                        // Already seen the node, but since it has been rescored we need to reorder it in the heap
                        openHeap.rescoreElement(neighbor);
                    }
                }
            }
        }
        if (closest) {
            return pathTo(closestNode);
        }
        // No result was found - empty array signifies failure to find path.
        return [];
    }
    // See list of heuristics: http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html
    const heuristics = {
        manhattan(pos0, pos1) {
            const d1 = Math.abs(pos1.x - pos0.x);
            const d2 = Math.abs(pos1.y - pos0.y);
            return d1 + d2;
        },
        diagonal(pos0, pos1) {
            const D = 1;
            const D2 = Math.sqrt(2);
            const d1 = Math.abs(pos1.x - pos0.x);
            const d2 = Math.abs(pos1.y - pos0.y);
            return (D * (d1 + d2)) + ((D2 - (2 * D)) * Math.min(d1, d2));
        }
    };
    function cleanNode(node) {
        node.f = 0;
        node.g = 0;
        node.h = 0;
        node.visited = false;
        node.closed = false;
        node.parent = null;
    }
    /**
     * A graph memory structure
     * @param gridIn 2D array of input weights
     */
    class Graph {
        constructor(gridIn, options) {
            this.dirtyNodes = new Array();
            this.grid = null;
            this.diagonal = true;
            if (options) {
                this.diagonal = options.diagonal !== false;
            }
            this.nodes = new Array();
            this.grid = new Array();
            for (let x = 0; x < gridIn.length; x++) {
                const row = gridIn[x];
                this.grid[x] = new Array(row.length);
                for (let y = 0; y < row.length; y++) {
                    const node = new GridNode(x, y, row[y]);
                    this.grid[x][y] = node;
                    this.nodes.push(node);
                }
            }
            this.init();
        }
        init() {
            arrayClear(this.dirtyNodes);
            for (let i = 0; i < this.nodes.length; i++) {
                cleanNode(this.nodes[i]);
            }
        }
        cleanDirty() {
            for (let i = 0; i < this.dirtyNodes.length; i++) {
                cleanNode(this.dirtyNodes[i]);
            }
            arrayClear(this.dirtyNodes);
        }
        markDirty(node) {
            this.dirtyNodes.push(node);
        }
        neighbors(node) {
            const ret = [];
            const x = node.x;
            const y = node.y;
            const grid = this.grid;
            // West
            if (grid[x - 1] && grid[x - 1][y]) {
                ret.push(grid[x - 1][y]);
            }
            // East
            if (grid[x + 1] && grid[x + 1][y]) {
                ret.push(grid[x + 1][y]);
            }
            // South
            if (grid[x] && grid[x][y - 1]) {
                ret.push(grid[x][y - 1]);
            }
            // North
            if (grid[x] && grid[x][y + 1]) {
                ret.push(grid[x][y + 1]);
            }
            if (this.diagonal) {
                // Southwest
                if (grid[x - 1] && grid[x - 1][y - 1]) {
                    ret.push(grid[x - 1][y - 1]);
                }
                // Southeast
                if (grid[x + 1] && grid[x + 1][y - 1]) {
                    ret.push(grid[x + 1][y - 1]);
                }
                // Northwest
                if (grid[x - 1] && grid[x - 1][y + 1]) {
                    ret.push(grid[x - 1][y + 1]);
                }
                // Northeast
                if (grid[x + 1] && grid[x + 1][y + 1]) {
                    ret.push(grid[x + 1][y + 1]);
                }
            }
            return ret;
        }
        toString() {
            const graphString = [];
            const nodes = this.grid;
            for (let x = 0; x < nodes.length; x++) {
                const rowDebug = [];
                const row = nodes[x];
                for (let y = 0; y < row.length; y++) {
                    rowDebug.push(row[y].weight);
                }
                graphString.push(rowDebug.join(" "));
            }
            return graphString.join("\n");
        }
    }
    class GridNode {
        constructor(x, y, weight) {
            this.x = x;
            this.y = y;
            this.weight = weight;
            this.f = 0;
            this.g = 0;
            this.h = 0;
            this.visited = false;
            this.closed = false;
            this.parent = null;
        }
        toString() {
            return `[${this.x} ${this.y}]`;
        }
        getCost(fromNeighbor) {
            // Take diagonal weight into consideration.
            if (fromNeighbor && fromNeighbor.x != this.x && fromNeighbor.y != this.y) {
                return this.weight * 1.41421;
            }
            return this.weight;
        }
        isWall() {
            return this.weight === 0;
        }
    }
    class BinaryHeap {
        constructor(scoreFunction) {
            this.scoreFunction = scoreFunction;
            this.content = new Array();
        }
        push(element) {
            // Add the new element to the end of the array.
            this.content.push(element);
            // Allow it to sink down.
            this.sinkDown(this.content.length - 1);
        }
        pop() {
            // Store the first element so we can return it later.
            const result = this.content[0];
            // Get the element at the end of the array.
            const end = this.content.pop();
            // If there are any elements left, put the end element at the
            // start, and let it bubble up.
            if (this.content.length > 0) {
                this.content[0] = end;
                this.bubbleUp(0);
            }
            return result;
        }
        remove(node) {
            const i = this.content.indexOf(node);
            // When it is found, the process seen in 'pop' is repeated
            // to fill up the hole.
            const end = this.content.pop();
            if (i !== this.content.length - 1) {
                this.content[i] = end;
                if (this.scoreFunction(end) < this.scoreFunction(node)) {
                    this.sinkDown(i);
                }
                else {
                    this.bubbleUp(i);
                }
            }
        }
        size() {
            return this.content.length;
        }
        rescoreElement(node) {
            this.sinkDown(this.content.indexOf(node));
        }
        sinkDown(n) {
            // Fetch the element that has to be sunk.
            const element = this.content[n];
            // When at 0, an element can not sink any further.
            while (n > 0) {
                // Compute the parent element's index, and fetch it.
                const parentN = ((n + 1) >> 1) - 1;
                const parent = this.content[parentN];
                // Swap the elements if the parent is greater.
                if (this.scoreFunction(element) < this.scoreFunction(parent)) {
                    this.content[parentN] = element;
                    this.content[n] = parent;
                    // Update 'n' to continue at the new position.
                    n = parentN;
                }
                // Found a parent that is less, no need to sink any further.
                else {
                    break;
                }
            }
        }
        bubbleUp(n) {
            // Look up the target element and its score.
            const length = this.content.length;
            const element = this.content[n];
            const elemScore = this.scoreFunction(element);
            while (true) {
                // Compute the indices of the child elements.
                const child2N = (n + 1) << 1;
                const child1N = child2N - 1;
                // This is used to store the new position of the element, if any.
                let swap = null;
                let child1Score;
                // If the first child exists (is inside the array)...
                if (child1N < length) {
                    // Look it up and compute its score.
                    const child1 = this.content[child1N];
                    child1Score = this.scoreFunction(child1);
                    // If the score is less than our element's, we need to swap.
                    if (child1Score < elemScore) {
                        swap = child1N;
                    }
                }
                // Do the same checks for the other child.
                if (child2N < length) {
                    const child2 = this.content[child2N];
                    const child2Score = this.scoreFunction(child2);
                    if (child2Score < (swap === null ? elemScore : child1Score)) {
                        swap = child2N;
                    }
                }
                // If the element needs to be moved, swap it, and continue.
                if (swap !== null) {
                    this.content[n] = this.content[swap];
                    this.content[swap] = element;
                    n = swap;
                }
                // Otherwise, we are done.
                else {
                    break;
                }
            }
        }
    }

    class TileSet {
        constructor(url, fetcher) {
            this.url = url;
            this.fetcher = fetcher;
            this.name = null;
            this.tileWidth = 0;
            this.tileHeight = 0;
            this.tilesPerRow = 0;
            this.tileCount = 0;
            this.image = null;
            this.collision = new Map();
        }
        async load() {
            const tileset = await this.fetcher.getXml(this.url.href);
            const image = tileset.querySelector("image");
            const imageSource = image.getAttribute("source");
            const imageURL = new URL(imageSource, this.url);
            const tiles = tileset.querySelectorAll("tile");
            for (let i = 0; i < tiles.length; ++i) {
                const tile = tiles[i];
                const id = parseInt(tile.getAttribute("id"), 10);
                const collid = tile.querySelector("properties > property[name='Collision']");
                const value = collid.getAttribute("value");
                this.collision.set(id, value === "true");
            }
            this.name = tileset.getAttribute("name");
            this.tileWidth = parseInt(tileset.getAttribute("tilewidth"), 10);
            this.tileHeight = parseInt(tileset.getAttribute("tileheight"), 10);
            this.tileCount = parseInt(tileset.getAttribute("tilecount"), 10);
            this.image = await this.fetcher.getCanvasImage(imageURL.href);
            this.tilesPerRow = Math.floor(this.image.width / this.tileWidth);
        }
        isClear(tile) {
            return !this.collision.get(tile - 1);
        }
        draw(g, tile, x, y) {
            if (tile > 0) {
                const idx = tile - 1, sx = this.tileWidth * (idx % this.tilesPerRow), sy = this.tileHeight * Math.floor(idx / this.tilesPerRow), dx = x * this.tileWidth, dy = y * this.tileHeight;
                g.drawImage(this.image, sx, sy, this.tileWidth, this.tileHeight, dx, dy, this.tileWidth, this.tileHeight);
            }
        }
    }

    class TileMap {
        constructor(tilemapName, fetcher) {
            this.fetcher = fetcher;
            this._tileWidth = 0;
            this._tileHeight = 0;
            this._layers = 0;
            this._width = 0;
            this._height = 0;
            this._offsetX = 0;
            this._offsetY = 0;
            this._layerImages = new Array();
            this._url = null;
            this._tileset = null;
            this._tiles = null;
            this._graph = null;
            this._url = new URL(`data/tilemaps/${tilemapName}.tmx`, document.baseURI);
        }
        async load() {
            const map = await this.fetcher.getXml(this._url.href), width = parseInt(map.getAttribute("width"), 10), height = parseInt(map.getAttribute("height"), 10), tileWidth = parseInt(map.getAttribute("tilewidth"), 10), tileHeight = parseInt(map.getAttribute("tileheight"), 10), tileset = map.querySelector("tileset"), tilesetSource = tileset.getAttribute("source"), layers = Array.from(map.querySelectorAll("layer > data"));
            this._layers = layers.length;
            this._width = width;
            this._height = height;
            this._offsetX = -Math.floor(width / 2);
            this._offsetY = -Math.floor(height / 2);
            this._tileWidth = tileWidth;
            this._tileHeight = tileHeight;
            this._tiles = [];
            for (let i = 0; i < layers.length; ++i) {
                const layer = layers[i];
                const tileIds = layer.innerHTML
                    .replace(" ", "")
                    .replace("\t", "")
                    .replace("\n", "")
                    .replace("\r", "")
                    .split(",")
                    .map(s => parseInt(s, 10)), rows = [];
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
                this._tiles.push(rows);
            }
            this._tileset = new TileSet(new URL(tilesetSource, this._url), this.fetcher);
            await this._tileset.load();
            this._tileWidth = this._tileset.tileWidth;
            this._tileHeight = this._tileset.tileHeight;
            for (let l = 0; l < this._layers; ++l) {
                const img = createUtilityCanvas(this.width * this.tileWidth, this.height * this.tileHeight);
                this._layerImages.push(img);
                const context = img.getContext("2d");
                const layer = this._tiles[l];
                for (let y = 0; y < this.height; ++y) {
                    const row = layer[y];
                    for (let x = 0; x < this.width; ++x) {
                        const tile = row[x];
                        this._tileset.draw(context, tile, x, y);
                    }
                }
            }
            let grid = [];
            for (let row of this._tiles[0]) {
                let gridrow = [];
                for (let tile of row) {
                    if (this._tileset.isClear(tile)) {
                        gridrow.push(1);
                    }
                    else {
                        gridrow.push(0);
                    }
                }
                grid.push(gridrow);
            }
            this._graph = new Graph(grid, { diagonal: true });
        }
        get width() {
            return this._width;
        }
        get height() {
            return this._height;
        }
        get tileWidth() {
            return this._tileWidth;
        }
        get tileHeight() {
            return this._tileHeight;
        }
        isInBounds(x, y) {
            return 0 <= x && x < this.width
                && 0 <= y && y < this.height;
        }
        getGridNode(x, y) {
            x -= this._offsetX;
            y -= this._offsetY;
            x = Math.round(x);
            y = Math.round(y);
            if (this.isInBounds(x, y)) {
                return this._graph.grid[y][x];
            }
            else {
                return null;
            }
        }
        draw(g) {
            g.save();
            {
                g.translate(this._offsetX * this.tileWidth, this._offsetY * this.tileHeight);
                for (let img of this._layerImages) {
                    g.drawImage(img, 0, 0);
                }
            }
            g.restore();
        }
        searchPath(start, end) {
            return search(this._graph, start, end)
                .map(p => {
                return {
                    x: p.y + this._offsetX,
                    y: p.x + this._offsetY
                };
            });
        }
        isClear(x, y, avatar) {
            x -= this._offsetX;
            y -= this._offsetY;
            x = Math.round(x);
            y = Math.round(y);
            return x < 0 || this.width <= x
                || y < 0 || this.height <= y
                || this._tileset && this._tileset.isClear(this._tiles[0][y][x])
                || avatar && avatar.canSwim;
        }
        // Use Bresenham's line algorithm (with integer error)
        // to draw a line through the map, cutting it off if
        // it hits a wall.
        getClearTile(x, y, dx, dy, avatar) {
            const x1 = x + dx, y1 = y + dy, sx = x < x1 ? 1 : -1, sy = y < y1 ? 1 : -1;
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
                    const dy = r - Math.abs(dx);
                    const tx = x + dx;
                    const ty1 = y + dy;
                    const ty2 = y - dy;
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

    /**
     * Types of avatars.
     **/
    var AvatarMode;
    (function (AvatarMode) {
        AvatarMode["None"] = "none";
        AvatarMode["Emoji"] = "emoji";
        AvatarMode["Photo"] = "photo";
        AvatarMode["Video"] = "video";
    })(AvatarMode || (AvatarMode = {}));

    function isSurfer(e) {
        return allSurfersGroup.contains(e)
            || allBoatRowersGroup.contains(e)
            || allSwimmersGroup.contains(e)
            || allMerpeopleGroup.contains(e);
    }

    /**
     * A base class for different types of avatars.
     **/
    class BaseAvatar {
        /**
         * Encapsulates a resource to use as an avatar.
         */
        constructor(mode, canSwim) {
            this.mode = mode;
            this.canSwim = canSwim;
            this.element = createUtilityCanvas(128, 128);
            this.g = this.element.getContext("2d");
        }
        /**
         * Render the avatar at a certain size.
         * @param g - the context to render to
         * @param width - the width the avatar should be rendered at
         * @param height - the height the avatar should be rendered at.
         * @param isMe - whether the avatar is the local user
         */
        draw(g, width, height, _isMe) {
            const aspectRatio = this.element.width / this.element.height, w = aspectRatio > 1 ? width : aspectRatio * height, h = aspectRatio > 1 ? width / aspectRatio : height, dx = (width - w) / 2, dy = (height - h) / 2;
            g.drawImage(this.element, dx, dy, w, h);
        }
    }

    /**
     * An avatar that uses a Unicode emoji as its representation
     **/
    class EmojiAvatar extends BaseAvatar {
        /**
         * Creats a new avatar that uses a Unicode emoji as its representation.
         */
        constructor(emoji) {
            super(AvatarMode.Emoji, isSurfer(emoji));
            this.value = emoji;
            const emojiText = new TextImage();
            emojiText.fillColor = emoji.color || "black";
            emojiText.fontFamily = "Noto Color Emoji";
            emojiText.fontSize = 256;
            emojiText.value = this.value;
            setContextSize(this.g, emojiText.width, emojiText.height);
            emojiText.draw(this.g, 0, 0);
        }
    }

    /**
     * An avatar that uses an Image as its representation.
     **/
    class PhotoAvatar extends BaseAvatar {
        /**
         * Creates a new avatar that uses an Image as its representation.
         */
        constructor(url) {
            super(AvatarMode.Photo, false);
            const img = new Image();
            img.addEventListener("load", () => {
                const offset = (img.width - img.height) / 2, sx = Math.max(0, offset), sy = Math.max(0, -offset), dim = Math.min(img.width, img.height);
                setContextSize(this.g, dim, dim);
                this.g.drawImage(img, sx, sy, dim, dim, 0, 0, dim, dim);
            });
            if (url instanceof URL) {
                this.url = url.href;
            }
            else {
                this.url = url;
            }
            img.src = this.url;
        }
    }

    /**
     * An avatar that uses an HTML Video element as its representation.
     **/
    class VideoAvatar extends BaseAvatar {
        /**
         * Creates a new avatar that uses a MediaStream as its representation.
         */
        constructor(stream) {
            super(AvatarMode.Video, false);
            if (stream instanceof HTMLVideoElement) {
                this.video = stream;
            }
            else if (stream instanceof MediaStream) {
                this.video = Video(autoPlay, playsInline, muted, volume(0), srcObject(stream));
            }
            else {
                throw new Error("Can only create a video avatar from an HTMLVideoElement or MediaStream.");
            }
            if (!isIOS) {
                this.video.play();
                once(this.video, "canplay")
                    .then(() => this.video.play());
            }
        }
        /**
         * Render the avatar at a certain size.
         * @param g - the context to render to
         * @param width - the width the avatar should be rendered at
         * @param height - the height the avatar should be rendered at.
         * @param isMe - whether the avatar is the local user
         */
        draw(g, width, height, isMe) {
            if (this.video.videoWidth > 0
                && this.video.videoHeight > 0) {
                const offset = (this.video.videoWidth - this.video.videoHeight) / 2, sx = Math.max(0, offset), sy = Math.max(0, -offset), dim = Math.min(this.video.videoWidth, this.video.videoHeight);
                setContextSize(this.g, dim, dim);
                this.g.save();
                if (isMe) {
                    this.g.translate(dim, 0);
                    this.g.scale(-1, 1);
                }
                this.g.drawImage(this.video, sx, sy, dim, dim, 0, 0, dim, dim);
                this.g.restore();
            }
            super.draw(g, width, height, isMe);
        }
    }

    class UserMovedEvent extends TypedEvent {
        constructor(id) {
            super("userMoved");
            this.id = id;
            this.x = 0;
            this.y = 0;
        }
    }
    class UserJoinedEvent extends TypedEvent {
        constructor(user) {
            super("userJoined");
            this.user = user;
        }
    }
    const POSITION_REQUEST_DEBOUNCE_TIME = 1, STACKED_USER_OFFSET_X = 5, STACKED_USER_OFFSET_Y = 5, muteAudioIcon = new TextImage(), speakerActivityIcon = new TextImage();
    muteAudioIcon.fontFamily = "Noto Color Emoji";
    muteAudioIcon.value = mutedSpeaker.value;
    speakerActivityIcon.fontFamily = "Noto Color Emoji";
    speakerActivityIcon.value = speakerMediumVolume.value;
    class User extends TypedEventBase {
        constructor(id, displayName, pose, isMe) {
            super();
            this.id = id;
            this.pose = pose;
            this.isMe = isMe;
            this.audioMuted = false;
            this.videoMuted = true;
            this.isActive = false;
            this.stackUserCount = 1;
            this.stackIndex = 0;
            this.stackAvatarHeight = 0;
            this.stackAvatarWidth = 0;
            this.stackOffsetX = 0;
            this.stackOffsetY = 0;
            this.visible = true;
            this._displayName = null;
            this._avatarVideo = null;
            this._avatarImage = null;
            this._avatarEmoji = null;
            this.userMovedEvt = new UserMovedEvent(id);
            this.label = isMe ? "(Me)" : `(${this.id})`;
            this.setAvatarEmoji(bustInSilhouette.value);
            this.lastPositionRequestTime = performance.now() / 1000 - POSITION_REQUEST_DEBOUNCE_TIME;
            this.userNameText = new TextImage();
            this.userNameText.fillColor = "white";
            this.userNameText.fontSize = 128;
            this.displayName = displayName;
            Object.seal(this);
        }
        get x() {
            return this.pose.current.p[0];
        }
        get y() {
            return this.pose.current.p[2];
        }
        get gridX() {
            return this.pose.end.p[0];
        }
        get gridY() {
            return this.pose.end.p[2];
        }
        setAvatar(evt) {
            switch (evt.mode) {
                case AvatarMode.Emoji:
                    this.setAvatarEmoji(evt.avatar);
                    break;
                case AvatarMode.Photo:
                    this.setAvatarImage(evt.avatar);
                    break;
                case AvatarMode.Video:
                    this.setAvatarVideo(evt.avatar);
                    break;
                default: assertNever(evt);
            }
        }
        serialize() {
            return {
                id: this.id,
                avatarMode: this.avatarMode,
                avatarID: this.avatarID
            };
        }
        /**
         * An avatar using a live video.
         **/
        get avatarVideo() {
            return this._avatarVideo;
        }
        /**
         * Set the current video element used as the avatar.
         **/
        setAvatarVideo(stream) {
            if (stream) {
                this._avatarVideo = new VideoAvatar(stream);
            }
            else {
                this._avatarVideo = null;
            }
        }
        /**
         * An avatar using a photo
         **/
        get avatarImage() {
            return this._avatarImage;
        }
        /**
         * Set the URL of the photo to use as an avatar.
         */
        setAvatarImage(url) {
            if (isString(url)
                && url.length > 0) {
                this._avatarImage = new PhotoAvatar(url);
            }
            else {
                this._avatarImage = null;
            }
        }
        /**
         * An avatar using a Unicode emoji.
         **/
        get avatarEmoji() {
            return this._avatarEmoji;
        }
        /**
         * Set the emoji to use as an avatar.
         */
        setAvatarEmoji(emoji) {
            if (emoji) {
                this._avatarEmoji = new EmojiAvatar(emoji);
            }
            else {
                this._avatarEmoji = null;
            }
        }
        /**
         * Returns the type of avatar that is currently active.
         **/
        get avatarMode() {
            if (this._avatarVideo) {
                return AvatarMode.Video;
            }
            else if (this._avatarImage) {
                return AvatarMode.Photo;
            }
            else if (this._avatarEmoji) {
                return AvatarMode.Emoji;
            }
            else {
                return AvatarMode.None;
            }
        }
        /**
         * Returns a serialized representation of the current avatar,
         * if such a representation exists.
         **/
        get avatarID() {
            switch (this.avatarMode) {
                case AvatarMode.Emoji:
                    return this.avatarEmoji.value;
                case AvatarMode.Photo:
                    return this.avatarImage.url;
                case AvatarMode.Video:
                case AvatarMode.None:
                    return null;
                default: assertNever(this.avatarMode);
            }
        }
        /**
         * Returns the current avatar
         **/
        get avatar() {
            switch (this.avatarMode) {
                case AvatarMode.Emoji:
                    return this._avatarEmoji;
                case AvatarMode.Photo:
                    return this._avatarImage;
                case AvatarMode.Video:
                    return this._avatarVideo;
                case AvatarMode.None:
                    return null;
                default: assertNever(this.avatarMode);
            }
        }
        get displayName() {
            return this._displayName || this.label;
        }
        set displayName(name) {
            this._displayName = name;
            this.userNameText.value = this.displayName;
        }
        moveTo(x, y) {
            if (this.isMe) {
                this.userMovedEvt.x = x;
                this.userMovedEvt.y = y;
                this.dispatchEvent(this.userMovedEvt);
            }
        }
        update(map, users) {
            this.stackUserCount = 0;
            this.stackIndex = 0;
            for (let user of users.values()) {
                if (user.gridX === this.gridX
                    && user.gridY === this.gridY) {
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
        drawShadow(g, map) {
            const scale = getTransform(g).a, x = this.x * map.tileWidth, y = this.y * map.tileHeight, t = getTransform(g), p = t.transformPoint({ x, y });
            this.visible = -map.tileWidth <= p.x
                && p.x < g.canvas.width
                && -map.tileHeight <= p.y
                && p.y < g.canvas.height;
            if (this.visible) {
                g.save();
                {
                    g.shadowColor = "rgba(0, 0, 0, 0.5)";
                    g.shadowOffsetX = 3 * scale;
                    g.shadowOffsetY = 3 * scale;
                    g.shadowBlur = 3 * scale;
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
                        const height = this.stackAvatarHeight / 2, scale = getTransform(g).a;
                        speakerActivityIcon.fontSize = height;
                        speakerActivityIcon.scale = scale;
                        speakerActivityIcon.draw(g, this.stackAvatarWidth - speakerActivityIcon.width, 0);
                    }
                }
                g.restore();
            }
        }
        innerDraw(g, map) {
            g.translate(this.x * map.tileWidth + this.stackOffsetX, this.y * map.tileHeight + this.stackOffsetY);
            g.fillStyle = "black";
            g.textBaseline = "top";
            if (this.avatar) {
                this.avatar.draw(g, this.stackAvatarWidth, this.stackAvatarHeight, this.isMe);
            }
            if (this.audioMuted || !this.videoMuted) {
                const height = this.stackAvatarHeight / 2, scale = getTransform(g).a;
                if (this.audioMuted) {
                    muteAudioIcon.fontSize = height;
                    muteAudioIcon.scale = scale;
                    muteAudioIcon.draw(g, this.stackAvatarWidth - muteAudioIcon.width, 0);
                }
            }
        }
        drawName(g, map, fontSize) {
            if (this.visible) {
                const scale = getTransform(g).a;
                g.save();
                {
                    g.translate(this.x * map.tileWidth + this.stackOffsetX, this.y * map.tileHeight + this.stackOffsetY);
                    g.shadowColor = "black";
                    g.shadowOffsetX = 3 * scale;
                    g.shadowOffsetY = 3 * scale;
                    g.shadowBlur = 3 * scale;
                    const textScale = fontSize / this.userNameText.fontSize;
                    g.scale(textScale, textScale);
                    this.userNameText.draw(g, 0, -this.userNameText.height);
                }
                g.restore();
            }
        }
        drawHearingTile(g, map, dx, dy, p) {
            g.save();
            {
                g.translate((this.gridX + dx) * map.tileWidth, (this.gridY + dy) * map.tileHeight);
                g.strokeStyle = `rgba(0, 255, 0, ${(1 - p) / 2})`;
                g.strokeRect(0, 0, map.tileWidth, map.tileHeight);
            }
            g.restore();
        }
        drawHearingRange(g, map, minDist, maxDist) {
            const scale = getTransform(g).a, tw = Math.min(maxDist, Math.ceil(g.canvas.width / (2 * map.tileWidth * scale))), th = Math.min(maxDist, Math.ceil(g.canvas.height / (2 * map.tileHeight * scale)));
            for (let dy = 0; dy < th; ++dy) {
                for (let dx = 0; dx < tw; ++dx) {
                    const dist = Math.sqrt(dx * dx + dy * dy), p = project(dist, minDist, maxDist);
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

    const CAMERA_LERP = 0.01, CAMERA_ZOOM_SHAPE = 2, MOVE_REPEAT = 0.125, gameStartedEvt = new TypedEvent("gameStarted"), gameEndedEvt = new TypedEvent("gameEnded"), zoomChangedEvt = new TypedEvent("zoomChanged"), emojiNeededEvt = new TypedEvent("emojiNeeded"), toggleAudioEvt = new TypedEvent("toggleAudio"), toggleVideoEvt = new TypedEvent("toggleVideo"), userJoinedEvt = new UserJoinedEvent(null), moveEvent = new UserMovedEvent(null), emoteEvt = new EmoteEvent(null);
    /** @type {Map<Game, EventedGamepad>} */
    const gamepads = new Map();
    class Game extends TypedEventBase {
        constructor(fetcher, zoomMin, zoomMax) {
            super();
            this.fetcher = fetcher;
            this.zoomMin = zoomMin;
            this.zoomMax = zoomMax;
            this.waypoints = new Array();
            this.users = new Map();
            this.emotes = new Array();
            this.keys = new Map();
            this.lastMove = Number.MAX_VALUE;
            this.lastWalk = Number.MAX_VALUE;
            this.gridOffsetX = 0;
            this.gridOffsetY = 0;
            this.fontSize = 0;
            this.cameraX = 0;
            this.offsetCameraX = 0;
            this.targetOffsetCameraX = 0;
            this.cameraY = 0;
            this.offsetCameraY = 0;
            this.targetOffsetCameraY = 0;
            this.cameraZ = 1.5;
            this.targetCameraZ = 1.5;
            this.drawHearing = false;
            this.audioDistanceMin = 2;
            this.audioDistanceMax = 10;
            this.rolloff = 5;
            this.lastGamepadIndex = -1;
            this.gamepadIndex = -1;
            this.transitionSpeed = 0.125;
            this.keyboardEnabled = true;
            this.me = null;
            this.map = null;
            this.currentRoomName = null;
            this.currentEmoji = null;
            this.element = Canvas(id("frontBuffer"));
            this.gFront = this.element.getContext("2d");
            this.audioDistanceMin = 2;
            this.audioDistanceMax = 10;
            this.rolloff = 5;
            this.currentEmoji = null;
            this.inputBinding = {
                keyButtonUp: "ArrowUp",
                keyButtonDown: "ArrowDown",
                keyButtonLeft: "ArrowLeft",
                keyButtonRight: "ArrowRight",
                keyButtonEmote: "e",
                keyButtonToggleAudio: "a",
                keyButtonZoomOut: "[",
                keyButtonZoomIn: "]",
                gpAxisLeftRight: 0,
                gpAxisUpDown: 1,
                gpButtonEmote: 0,
                gpButtonToggleAudio: 1,
                gpButtonZoomIn: 6,
                gpButtonZoomOut: 7,
                gpButtonUp: 12,
                gpButtonDown: 13,
                gpButtonLeft: 14,
                gpButtonRight: 15
            };
            this.lastGamepadIndex = -1;
            this.gamepadIndex = -1;
            this.transitionSpeed = 0.125;
            this.keyboardEnabled = true;
            // ============= KEYBOARD =================
            window.addEventListener("keydown", (evt) => {
                this.keys.set(evt.key, evt);
                if (this.keyboardEnabled
                    && !evt.ctrlKey
                    && !evt.altKey
                    && !evt.shiftKey
                    && !evt.metaKey
                    && evt.key === this.inputBinding.keyButtonToggleAudio
                    && !!this.me) {
                    this.toggleMyAudio();
                }
            });
            window.addEventListener("keyup", (evt) => {
                if (this.keys.has(evt.key)) {
                    this.keys.delete(evt.key);
                }
            });
            // ============= KEYBOARD =================
            // ============= POINTERS =================
            this.screenControls = new ScreenPointerControls(this.element);
            this.screenControls.addEventListener("move", (evt) => {
                if (Math.abs(evt.dz) > 0) {
                    this.zoom += evt.dz;
                    this.dispatchEvent(zoomChangedEvt);
                }
            });
            this.screenControls.addEventListener("drag", (evt) => {
                this.targetOffsetCameraX = this.offsetCameraX += evt.dx;
                this.targetOffsetCameraY = this.offsetCameraY += evt.dy;
            });
            this.screenControls.addEventListener("click", (evt) => {
                if (!!this.me) {
                    const tile = this.getTileAt(evt), dx = tile.x - this.me.gridX, dy = tile.y - this.me.gridY;
                    this.moveMeByPath(dx, dy);
                }
            });
            // ============= POINTERS =================
            // ============= ACTION ==================
        }
        get style() {
            return this.element.style;
        }
        updateAudioActivity(id, isActive) {
            this.withUser("update audio activity", id, (user) => {
                user.isActive = isActive;
            });
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
                        emoteEvt.emoji = this.currentEmoji = emoji;
                        this.dispatchEvent(emoteEvt);
                    }
                }
                if (emoji) {
                    this.emotes.push(new Emote(emoji, user.x, user.y));
                }
            }
        }
        getTileAt(cursor) {
            const imageX = cursor.x * devicePixelRatio - this.gridOffsetX - this.offsetCameraX, imageY = cursor.y * devicePixelRatio - this.gridOffsetY - this.offsetCameraY, zoomX = imageX / this.cameraZ, zoomY = imageY / this.cameraZ, mapX = zoomX - this.cameraX, mapY = zoomY - this.cameraY, gridX = mapX / this.map.tileWidth, gridY = mapY / this.map.tileHeight, tile = { x: gridX - 0.5, y: gridY - 0.5 };
            return tile;
        }
        moveMeTo(x, y) {
            if (this.map.isClear(x, y, this.me.avatar)) {
                this.targetOffsetCameraX = 0;
                this.targetOffsetCameraY = 0;
                moveEvent.x = x;
                moveEvent.y = y;
                this.dispatchEvent(moveEvent);
            }
        }
        moveMeBy(dx, dy) {
            const clearTile = this.map.getClearTile(this.me.gridX, this.me.gridY, dx, dy, this.me.avatar);
            this.moveMeTo(clearTile.x, clearTile.y);
        }
        moveMeByPath(dx, dy) {
            arrayClear(this.waypoints);
            const x = this.me.gridX, y = this.me.gridY, start = this.map.getGridNode(x, y), tx = x + dx, ty = y + dy, gx = Math.round(tx), gy = Math.round(ty), ox = tx - gx, oy = ty - gy, end = this.map.getGridNode(tx, ty);
            if (!start || !end) {
                this.moveMeTo(tx, ty);
            }
            else {
                const result = this.map.searchPath(start, end);
                if (result.length === 0) {
                    this.moveMeTo(tx, ty);
                }
                else {
                    for (let point of result) {
                        point.x += ox;
                        point.y += oy;
                    }
                    this.waypoints.push(...result);
                }
            }
        }
        warpMeTo(x, y) {
            const clearTile = this.map.getClearTileNear(x, y, 3, this.me.avatar);
            this.moveMeTo(clearTile.x, clearTile.y);
        }
        visit(id) {
            this.withUser("visit", id, (user) => {
                this.warpMeTo(user.gridX, user.gridY);
            });
        }
        get zoom() {
            const a = project(this.targetCameraZ, this.zoomMin, this.zoomMax), b = Math.pow(a, 1 / CAMERA_ZOOM_SHAPE), c = unproject(b, this.zoomMin, this.zoomMax);
            return c;
        }
        set zoom(v) {
            v = clamp(v, this.zoomMin, this.zoomMax);
            const a = project(v, this.zoomMin, this.zoomMax), b = Math.pow(a, CAMERA_ZOOM_SHAPE), c = unproject(b, this.zoomMin, this.zoomMax);
            this.targetCameraZ = c;
        }
        addUser(id, displayName, pose) {
            if (this.users.has(id)) {
                this.removeUser(id);
            }
            const user = new User(id, displayName, pose, false);
            this.users.set(id, user);
            userJoinedEvt.user = user;
            this.dispatchEvent(userJoinedEvt);
        }
        toggleMyAudio() {
            this.dispatchEvent(toggleAudioEvt);
        }
        toggleMyVideo() {
            this.dispatchEvent(toggleVideoEvt);
        }
        muteUserAudio(id, muted) {
            this.withUser("mute audio", id, (user) => {
                user.audioMuted = muted;
            });
        }
        muteUserVideo(id, muted) {
            this.withUser("mute video", id, (user) => {
                user.videoMuted = muted;
            });
        }
        /**
        * Used to perform on operation when a valid user object is found.
        * @callback withUserCallback
        * @param {User} user
        * @returns {void}
        */
        /**
         * Find a user by id, then perform an operation on it.
         */
        withUser(msg, id, callback, timeout) {
            if (timeout === undefined) {
                timeout = 5000;
            }
            if (id) {
                if (this.users.has(id)) {
                    const user = this.users.get(id);
                    callback(user);
                }
                else {
                    console.warn(`No user "${id}" found to ${msg}. Trying again in a quarter second.`);
                    if (timeout > 0) {
                        setTimeout(this.withUser.bind(this, msg, id, callback, timeout - 250), 250);
                    }
                }
            }
        }
        changeUserName(id, displayName) {
            this.withUser("change user name", id, (user) => {
                user.displayName = displayName;
            });
        }
        removeUser(id) {
            if (this.users.has(id)) {
                this.users.delete(id);
            }
        }
        setAvatarVideo(id, stream) {
            this.withUser("set avatar video", id, (user) => {
                user.setAvatarVideo(stream);
            });
        }
        setAvatarURL(id, url) {
            this.withUser("set avatar image", id, (user) => {
                user.setAvatarImage(url);
            });
        }
        setAvatarEmoji(id, emoji) {
            this.withUser("set avatar emoji", id, (user) => {
                user.setAvatarEmoji(emoji.value);
            });
        }
        async startAsync(id, displayName, pose, avatarURL, roomName) {
            this.currentRoomName = roomName.toLowerCase();
            this.me = new User(id, displayName, pose, true);
            if (isString(avatarURL)) {
                this.me.setAvatarImage(avatarURL);
            }
            this.users.set(id, this.me);
            this.map = new TileMap(this.currentRoomName, this.fetcher);
            let success = false;
            for (let retryCount = 0; retryCount < 2; ++retryCount) {
                try {
                    await this.map.load();
                    success = true;
                }
                catch (exp) {
                    if (retryCount === 0) {
                        console.warn(exp);
                        console.warn("Retrying with default map.");
                        this.map = new TileMap("default", this.fetcher);
                    }
                    else {
                        console.error(exp);
                    }
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
            show(this.element);
            this.resize();
            this.element.focus();
        }
        resize() {
            resizeCanvas(this.element, window.devicePixelRatio);
        }
        end() {
            this.currentRoomName = null;
            this.map = null;
            this.users.clear();
            this.me = null;
            hide(this.element);
            this.dispatchEvent(gameEndedEvt);
        }
        update(dt) {
            if (this.currentRoomName !== null) {
                dt /= 1000;
                this.gridOffsetX = Math.floor(0.5 * this.element.width / this.map.tileWidth) * this.map.tileWidth;
                this.gridOffsetY = Math.floor(0.5 * this.element.height / this.map.tileHeight) * this.map.tileHeight;
                this.lastMove += dt;
                if (this.lastMove >= MOVE_REPEAT) {
                    let dx = 0, dy = 0, dz = 0;
                    if (this.keyboardEnabled) {
                        for (let evt of Object.values(this.keys)) {
                            if (!evt.altKey
                                && !evt.shiftKey
                                && !evt.ctrlKey
                                && !evt.metaKey) {
                                switch (evt.key) {
                                    case this.inputBinding.keyButtonUp:
                                        dy--;
                                        break;
                                    case this.inputBinding.keyButtonDown:
                                        dy++;
                                        break;
                                    case this.inputBinding.keyButtonLeft:
                                        dx--;
                                        break;
                                    case this.inputBinding.keyButtonRight:
                                        dx++;
                                        break;
                                    case this.inputBinding.keyButtonZoomIn:
                                        dz++;
                                        break;
                                    case this.inputBinding.keyButtonZoomOut:
                                        dz--;
                                        break;
                                    case this.inputBinding.keyButtonEmote:
                                        this.emote(this.me.id, this.currentEmoji);
                                        break;
                                }
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
                        dz += 2 * (pad.buttons[this.inputBinding.gpButtonZoomIn].value - pad.buttons[this.inputBinding.gpButtonZoomOut].value);
                        this.targetOffsetCameraX += -50 * Math.round(2 * pad.axes[2]);
                        this.targetOffsetCameraY += -50 * Math.round(2 * pad.axes[3]);
                        this.dispatchEvent(zoomChangedEvt);
                    }
                    dx = clamp(dx, -1, 1);
                    dy = clamp(dy, -1, 1);
                    if (dx !== 0
                        || dy !== 0) {
                        this.moveMeBy(dx, dy);
                        arrayClear(this.waypoints);
                    }
                    if (dz !== 0) {
                        this.zoom += dz;
                        this.dispatchEvent(zoomChangedEvt);
                    }
                    this.lastMove = 0;
                }
                this.lastWalk += dt;
                if (this.lastWalk >= this.transitionSpeed) {
                    if (this.waypoints.length > 0) {
                        const waypoint = this.waypoints.shift();
                        this.moveMeTo(waypoint.x, waypoint.y);
                    }
                    this.lastWalk = 0;
                }
                for (let emote of this.emotes) {
                    emote.update(dt);
                }
                this.emotes = this.emotes.filter(e => !e.isDead());
                for (let user of this.users.values()) {
                    user.update(this.map, this.users);
                }
                this.render();
            }
        }
        render() {
            const targetCameraX = -this.me.x * this.map.tileWidth, targetCameraY = -this.me.y * this.map.tileHeight;
            this.cameraZ = lerp(this.cameraZ, this.targetCameraZ, CAMERA_LERP * this.cameraZ);
            this.cameraX = lerp(this.cameraX, targetCameraX, CAMERA_LERP * this.cameraZ);
            this.cameraY = lerp(this.cameraY, targetCameraY, CAMERA_LERP * this.cameraZ);
            this.offsetCameraX = lerp(this.offsetCameraX, this.targetOffsetCameraX, CAMERA_LERP);
            this.offsetCameraY = lerp(this.offsetCameraY, this.targetOffsetCameraY, CAMERA_LERP);
            this.gFront.resetTransform();
            this.gFront.imageSmoothingEnabled = false;
            this.gFront.clearRect(0, 0, this.element.width, this.element.height);
            this.gFront.save();
            {
                this.gFront.translate(this.gridOffsetX + this.offsetCameraX, this.gridOffsetY + this.offsetCameraY);
                this.gFront.scale(this.cameraZ, this.cameraZ);
                this.gFront.translate(this.cameraX, this.cameraY);
                this.map.draw(this.gFront);
                for (let user of this.users.values()) {
                    user.drawShadow(this.gFront, this.map);
                }
                for (let emote of this.emotes) {
                    emote.drawShadow(this.gFront, this.map);
                }
                for (let user of this.users.values()) {
                    user.drawAvatar(this.gFront, this.map);
                }
                this.drawCursor();
                for (let user of this.users.values()) {
                    user.drawName(this.gFront, this.map, this.fontSize);
                }
                if (this.drawHearing) {
                    this.me.drawHearingRange(this.gFront, this.map, this.audioDistanceMin, this.audioDistanceMax);
                }
                for (let emote of this.emotes) {
                    emote.drawEmote(this.gFront, this.map);
                }
            }
            this.gFront.restore();
        }
        drawCursor() {
            const pointer = this.screenControls.primaryPointer;
            if (pointer) {
                const tile = this.getTileAt(pointer);
                this.gFront.strokeStyle = this.map.isClear(tile.x, tile.y, this.me.avatar)
                    ? "green"
                    : "red";
                this.gFront.strokeRect(tile.x * this.map.tileWidth, tile.y * this.map.tileHeight, this.map.tileWidth, this.map.tileHeight);
            }
        }
    }

    const CAMERA_ZOOM_MIN = 0.5, CAMERA_ZOOM_MAX = 20, settings = new Settings(), fetcher = new Fetcher(), audio = new AudioManager(fetcher, SpatializerType.High), loader = new JitsiOnlyClientLoader(JITSI_HOST, JVB_HOST, JVB_MUC), game = new Game(fetcher, CAMERA_ZOOM_MIN, CAMERA_ZOOM_MAX), login = new LoginForm(), directory = new UserDirectoryForm(), controls = new ButtonLayer(CAMERA_ZOOM_MIN, CAMERA_ZOOM_MAX), devices = new DevicesDialog(), options = new OptionsForm(), instructions = new FormDialog("instructions"), emoji = new EmojiForm(), timer = new RequestAnimationFrameTimer(), disabler = disabled(true), enabler = disabled(false);
    let waitingForEmoji = false;
    async function recordJoin(Name, Email, Room) {
        await fetcher.postObject("/Contacts", { Name, Email, Room }, "application/json");
    }
    async function recordRoom(roomName) {
        return await fetcher.postObjectForText("/Game/Rooms", roomName, "application/json");
    }
    function _showView(view) {
        return () => showView(view);
    }
    function showView(view) {
        if (!waitingForEmoji) {
            hide(login);
            hide(directory);
            hide(options);
            hide(devices);
            hide(emoji);
            hide(instructions);
            show(view);
        }
    }
    async function withEmojiSelection(callback) {
        if (!isOpen(emoji)) {
            waitingForEmoji = true;
            disabler.apply(controls.optionsButton);
            disabler.apply(controls.instructionsButton);
            disabler.apply(controls.changeDevicesButton);
            hide(options);
            const e = await emoji.selectAsync();
            if (e) {
                callback(e);
            }
            enabler.apply(controls.optionsButton);
            enabler.apply(controls.instructionsButton);
            enabler.apply(controls.changeDevicesButton);
            waitingForEmoji = false;
        }
    }
    function refreshGamepads() {
        options.gamepads = navigator.getGamepads();
        options.gamepadIndex = game.gamepadIndex;
    }
    function refreshUser(userID) {
        game.withUser("list user in directory", userID, (user) => directory.set(user));
    }
    (async function () {
        async function selectEmojiAsync() {
            await withEmojiSelection((e) => {
                game.emote(client.localUserID, e);
                controls.setEmojiButton(e);
            });
        }
        function setAudioProperties() {
            client.audio.setAudioProperties(settings.audioDistanceMin = game.audioDistanceMin = options.audioDistanceMin, settings.audioDistanceMax = game.audioDistanceMax = options.audioDistanceMax, settings.audioRolloff = options.audioRolloff, client.audio.algorithm, settings.transitionSpeed);
        }
        await loadFont(makeFont({
            fontFamily: "Noto Color Emoji",
            fontSize: 100
        }));
        const client = await loader.load(fetcher, audio);
        window.addEventListener("gamepadconnected", refreshGamepads);
        window.addEventListener("gamepaddisconnected", refreshGamepads);
        window.addEventListener("resize", () => game.resize());
        controls.addEventListener("toggleOptions", _showView(options));
        controls.addEventListener("toggleInstructions", _showView(instructions));
        controls.addEventListener("toggleUserDirectory", _showView(directory));
        controls.addEventListener("changeDevices", _showView(devices));
        controls.addEventListener("tweet", () => {
            const message = encodeURIComponent(`Join my #TeleParty ${document.location.href}`), url = "https://twitter.com/intent/tweet?text=" + message;
            window.open(url);
        });
        controls.addEventListener("leave", async () => {
            directory.clear();
            await client.leave();
        });
        controls.addEventListener("selectEmoji", selectEmojiAsync);
        controls.addEventListener("emote", () => {
            game.emote(client.localUserID, game.currentEmoji);
        });
        controls.addEventListener("toggleAudio", async () => {
            await client.toggleAudioMuted();
        });
        controls.addEventListener("toggleVideo", async () => {
            await client.toggleVideoMuted();
        });
        controls.addEventListener("zoomChanged", () => {
            settings.zoom = game.zoom = controls.zoom;
        });
        login.addEventListener("login", async () => {
            await client.audio.createClip("join", false, false, false, 0.5, "audio/door-open.mp3");
            await client.audio.createClip("leave", false, false, true, 0.5, "audio/door-close.mp3");
            setAudioProperties();
            let roomName = login.roomName;
            if (!login.roomSelectMode) {
                roomName = await recordRoom(roomName);
            }
            await recordJoin(settings.userName = login.userName, settings.email = login.email, settings.roomName = roomName);
            const title = `Calla - chatting in ${roomName}`;
            const path = `${window.location.pathname}#${roomName}`;
            window.history.replaceState({}, title, path);
            await directory.startAsync(roomName, login.userName);
            await client.join(roomName);
            await client.identify(login.userName);
        });
        options.addEventListener("audioPropertiesChanged", setAudioProperties);
        options.addEventListener("selectAvatar", async () => {
            await withEmojiSelection((e) => {
                settings.avatarEmoji = e.value;
                client.setAvatarEmoji(e);
                game.me.setAvatarEmoji(e.value);
                refreshUser(client.localUserID);
            });
        });
        options.addEventListener("avatarURLChanged", () => {
            settings.avatarURL = options.avatarURL;
            client.setAvatarURL(options.avatarURL);
            game.me.setAvatarImage(options.avatarURL);
            refreshUser(client.localUserID);
        });
        options.addEventListener("toggleDrawHearing", () => {
            settings.drawHearing
                = game.drawHearing
                    = options.drawHearing;
        });
        options.addEventListener("fontSizeChanged", () => {
            settings.fontSize
                = game.fontSize
                    = options.fontSize;
        });
        options.addEventListener("gamepadChanged", () => {
            settings.gamepadIndex
                = game.gamepadIndex
                    = options.gamepadIndex;
        });
        options.addEventListener("inputBindingChanged", () => {
            settings.inputBinding
                = game.inputBinding
                    = options.inputBinding;
        });
        options.addEventListener("toggleVideo", async () => {
            await client.toggleVideoMuted();
        });
        devices.addEventListener("audioInputChanged", async () => {
            const device = devices.currentAudioInputDevice;
            await client.setAudioInputDevice(device);
            settings.preferredAudioInputID = client.preferredAudioInputID;
        });
        devices.addEventListener("audioOutputChanged", async () => {
            const device = devices.currentAudioOutputDevice;
            await client.setAudioOutputDevice(device);
            settings.preferredAudioOutputID = client.preferredAudioOutputID;
        });
        devices.addEventListener("videoInputChanged", async () => {
            const device = devices.currentVideoInputDevice;
            await client.setVideoInputDevice(device);
            settings.preferredVideoInputID = client.preferredVideoInputID;
        });
        game.addEventListener("emojiNeeded", selectEmojiAsync);
        game.addEventListener("emote", (evt) => {
            client.emote(evt.emoji);
        });
        game.addEventListener("userJoined", (evt) => {
            refreshUser(evt.user.id);
        });
        game.addEventListener("toggleAudio", async () => {
            await client.toggleAudioMuted();
            settings.preferredAudioInputID = client.preferredAudioInputID;
        });
        game.addEventListener("toggleVideo", async () => {
            await client.toggleVideoMuted();
            settings.preferredVideoInputID = client.preferredVideoInputID;
        });
        const rawGameStartEmoji = new Emoji(null, "");
        game.addEventListener("gameStarted", () => {
            game.resize();
            hide(login);
            show(controls);
            options.user = game.me;
            controls.enabled = true;
            settings.avatarEmoji = settings.avatarEmoji || allPeopleGroup.random().value;
            rawGameStartEmoji.value = settings.avatarEmoji;
            client.setAvatarEmoji(rawGameStartEmoji);
            game.me.setAvatarEmoji(settings.avatarEmoji);
            refreshUser(client.localUserID);
        });
        game.addEventListener("userMoved", (evt) => {
            client.setLocalPose(evt.x, 0, evt.y, 0, 0, -1, 0, 1, 0);
        });
        game.addEventListener("gameEnded", () => {
            login.connected = false;
            showView(login);
        });
        game.addEventListener("zoomChanged", () => {
            settings.zoom = controls.zoom = game.zoom;
        });
        directory.addEventListener("warpTo", (evt) => {
            game.visit(evt.id);
        });
        client.addEventListener("conferenceJoined", async (evt) => {
            login.connected = true;
            await game.startAsync(evt.id, login.userName, evt.pose, null, login.roomName);
            options.avatarURL = settings.avatarURL;
            client.setAvatarURL(settings.avatarURL);
            game.me.setAvatarImage(settings.avatarURL);
            devices.audioInputDevices = await client.getAudioInputDevices(true);
            devices.audioOutputDevices = await client.getAudioOutputDevices(true);
            devices.videoInputDevices = await client.getVideoInputDevices(true);
            settings.preferredAudioInputID = client.preferredAudioInputID;
            settings.preferredAudioOutputID = client.preferredAudioOutputID;
            settings.preferredVideoInputID = client.preferredVideoInputID;
            devices.currentAudioInputDevice = await client.getCurrentAudioInputDevice();
            devices.currentAudioOutputDevice = await client.getCurrentAudioOutputDevice();
            devices.currentVideoInputDevice = await client.getCurrentVideoInputDevice();
            const audioMuted = client.isAudioMuted;
            game.muteUserAudio(client.localUserID, audioMuted);
            controls.audioEnabled = !audioMuted;
            const videoMuted = client.isVideoMuted;
            game.muteUserVideo(client.localUserID, videoMuted);
            controls.videoEnabled = !videoMuted;
        });
        client.addEventListener("conferenceLeft", () => {
            game.end();
        });
        client.addEventListener("participantJoined", (evt) => {
            client.audio.playClip("join");
            game.addUser(evt.id, evt.displayName, evt.source.pose);
        });
        client.addEventListener("participantLeft", (evt) => {
            client.audio.playClip("leave");
            game.removeUser(evt.id);
            directory.delete(evt.id);
        });
        client.addEventListener("audioAdded", (evt) => refreshUser(evt.id));
        client.addEventListener("audioRemoved", (evt) => refreshUser(evt.id));
        client.addEventListener("videoAdded", (evt) => {
            game.setAvatarVideo(evt.id, evt.stream);
            refreshUser(evt.id);
        });
        client.addEventListener("videoRemoved", (evt) => {
            game.setAvatarVideo(evt.id, null);
            refreshUser(evt.id);
        });
        client.addEventListener("avatarChanged", (evt) => {
            game.setAvatarURL(evt.id, evt.url);
            refreshUser(evt.id);
        });
        client.addEventListener("userNameChanged", (evt) => {
            game.changeUserName(evt.id, evt.displayName);
            refreshUser(evt.id);
        });
        client.addEventListener("audioMuteStatusChanged", async (evt) => {
            if (evt.id === client.localUserID) {
                controls.audioEnabled = !evt.muted;
                devices.currentAudioInputDevice = await client.getCurrentAudioInputDevice();
                settings.preferredAudioInputID = client.preferredAudioInputID;
            }
            game.muteUserAudio(evt.id, evt.muted);
        });
        client.addEventListener("videoMuteStatusChanged", async (evt) => {
            if (evt.id === client.localUserID) {
                controls.videoEnabled = !evt.muted;
                if (evt.muted) {
                    options.setAvatarVideo(null);
                }
                else {
                    options.setAvatarVideo(game.me.avatarVideo.element);
                }
                devices.currentVideoInputDevice = await client.getCurrentVideoInputDevice();
            }
            game.muteUserVideo(evt.id, evt.muted);
            settings.preferredVideoInputID = client.preferredVideoInputID;
        });
        const rawEmoteEmoji = new Emoji(null, "");
        client.addEventListener("emote", (evt) => {
            rawEmoteEmoji.value = evt.emoji;
            game.emote(evt.id, rawEmoteEmoji);
        });
        const rawAvatarEmoji = new Emoji(null, "");
        client.addEventListener("setAvatarEmoji", (evt) => {
            rawAvatarEmoji.value = evt.emoji;
            game.setAvatarEmoji(evt.id, rawAvatarEmoji);
            refreshUser(evt.id);
        });
        client.addEventListener("audioActivity", (evt) => {
            game.updateAudioActivity(evt.id, evt.isActive);
        });
        timer.addEventListener("tick", (evt) => {
            client.update();
            options.update();
            directory.update();
            game.update(evt.dt);
        });
        options.drawHearing = game.drawHearing = settings.drawHearing;
        options.audioDistanceMin = game.audioDistanceMin = settings.audioDistanceMin;
        options.audioDistanceMax = game.audioDistanceMax = settings.audioDistanceMax;
        options.audioRolloff = settings.audioRolloff;
        options.fontSize = game.fontSize = settings.fontSize;
        options.gamepads = navigator.getGamepads();
        options.gamepadIndex = game.gamepadIndex = settings.gamepadIndex;
        options.inputBinding = game.inputBinding = settings.inputBinding;
        controls.zoom = game.zoom = settings.zoom;
        game.cameraZ = game.targetCameraZ;
        game.transitionSpeed = settings.transitionSpeed = 0.5;
        login.userName = settings.userName;
        login.roomName = settings.roomName;
        login.email = settings.email;
        controls.enabled = false;
        showView(login);
        login.ready = true;
        timer.start();
        await client.getMediaPermissions();
        await client.connect();
        Object.assign(window, {
            settings,
            fetcher,
            client,
            game,
            login,
            directory,
            controls,
            devices,
            options,
            emoji,
            instructions
        });
    })();

}());
//# sourceMappingURL=game.js.map
