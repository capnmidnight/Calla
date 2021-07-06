var Calla = (function (exports) {
    'use strict';

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
    function isObject(obj) {
        return isDefined(obj)
            && t(obj, "object", Object);
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
    /**
     * Creates a new array that is sorted by the key extracted
     * by the keySelector callback, not modifying the input array,
     * (unlike JavaScript's own Array.prototype.sort).
     * @param arr
     * @param keySelector
     */
    function arraySortByKey(arr, keySelector) {
        const newArr = new Array();
        for (const obj of arr) {
            arraySortedInsert(newArr, obj, keySelector);
        }
        return newArr;
    }

    /**
     * Removes an item at the given index from an array.
     */
    function arrayRemoveAt(arr, idx) {
        return arr.splice(idx, 1)[0];
    }

    class EventBase {
        listeners = new Map();
        listenerOptions = new Map();
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
        mappedCallbacks = new Map();
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

    /**
     * A setter functor for HTML attributes.
     **/
    class Attr {
        key;
        value;
        bySetAttribute;
        tags;
        /**
         * Creates a new setter functor for HTML Attributes
         * @param key - the attribute name.
         * @param value - the value to set for the attribute.
         * @param tags - the HTML tags that support this attribute.
         */
        constructor(key, value, bySetAttribute, ...tags) {
            this.key = key;
            this.value = value;
            this.bySetAttribute = bySetAttribute;
            this.tags = tags.map(t => t.toLocaleUpperCase());
            Object.freeze(this);
        }
        /**
         * Set the attribute value on an HTMLElement
         * @param elem - the element on which to set the attribute.
         */
        apply(elem) {
            const isDataSet = this.key.startsWith("data-");
            const isValid = this.tags.length === 0
                || this.tags.indexOf(elem.tagName) > -1
                || isDataSet;
            if (!isValid) {
                console.warn(`Element ${elem.tagName} does not support Attribute ${this.key}`);
            }
            else if (isDataSet) {
                const subkey = this.key.substring(5);
                elem.dataset[subkey] = this.value;
            }
            else if (this.key === "style") {
                Object.assign(elem.style, this.value);
            }
            else if (this.bySetAttribute) {
                elem.setAttribute(this.key, this.value);
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
     * The audio or video should play as soon as possible.
      **/
    function autoPlay(value) { return new Attr("autoplay", value, false, "audio", "video"); }
    /**
     * Indicates that the media element should play automatically on iOS.
      **/
    function playsInline(value) { return new Attr("playsInline", value, false, "audio", "video"); }

    class CssProp {
        key;
        value;
        name;
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
        rest;
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
    function color(v) { return new CssProp("color", v); }
    function columnGap(v) { return new CssProp("columnGap", v); }
    function display(v) { return new CssProp("display", v); }
    function fontFamily(v) { return new CssProp("fontFamily", v); }
    function gridAutoFlow(v) { return new CssProp("gridAutoFlow", v); }
    function gridColumn(v) { return new CssProp("gridColumn", v); }
    function height(v) { return new CssProp("height", v); }
    function left(v) { return new CssProp("left", v); }
    function opacity(v) { return new CssProp("opacity", v); }
    function overflow(v) { return new CssProp("overflow", v); }
    function overflowY(v) { return new CssProp("overflowY", v); }
    function padding(v) { return new CssProp("padding", v); }
    function pointerEvents(v) { return new CssProp("pointerEvents", v); }
    function position(v) { return new CssProp("position", v); }
    function top(v) { return new CssProp("top", v); }
    function width(v) { return new CssProp("width", v); }
    function zIndex(v) { return new CssProp("zIndex", v.toFixed(0)); }
    /**
     * A selection of fonts for preferred monospace rendering.
     **/
    function getMonospaceFonts() {
        return "ui-monospace, 'Droid Sans Mono', 'Cascadia Mono', 'Segoe UI Mono', 'Ubuntu Mono', 'Roboto Mono', Menlo, Monaco, Consolas, monospace";
    }
    /**
     * A selection of fonts for preferred monospace rendering.
     **/
    function getMonospaceFamily() {
        return fontFamily(getMonospaceFonts());
    }

    function isErsatzElement(obj) {
        return isObject(obj)
            && "element" in obj
            && obj.element instanceof Node;
    }
    function isErsatzElements(obj) {
        return isObject(obj)
            && "elements" in obj
            && obj.elements instanceof Array;
    }
    function elementSetDisplay(elem, visible, visibleDisplayType = "block") {
        elem.style.display = visible ? visibleDisplayType : "none";
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
            if (attr instanceof Attr) {
                if (attr.key === "id") {
                    elem = document.getElementById(attr.value);
                    break;
                }
                else if (attr.key === "selector") {
                    elem = document.querySelector(attr.value);
                    break;
                }
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
                else if (isErsatzElements(x)) {
                    elem.append(...x.elements);
                }
                else {
                    if (x instanceof Function) {
                        x = x(true);
                    }
                    if (!(x instanceof Attr) || x.key !== "selector") {
                        x.apply(elem);
                    }
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
    function Audio(...rest) { return tag("audio", ...rest); }
    function Div(...rest) { return tag("div", ...rest); }
    /**
     * Creates a text node out of the give input.
     */
    function TextNode(txt) {
        return document.createTextNode(txt);
    }

    /**
     * Indicates whether or not the current browser can change the destination device for audio output.
     **/
    const canChangeAudioOutput = isFunction(HTMLAudioElement.prototype.setSinkId);
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
    class DeviceManagerInputsChangedEvent extends TypedEvent {
        audio;
        video;
        constructor(audio, video) {
            super("inputschanged");
            this.audio = audio;
            this.video = video;
        }
    }
    class DeviceManagerAudioOutputChangedEvent extends TypedEvent {
        device;
        constructor(device) {
            super("audiooutputchanged");
            this.device = device;
        }
    }
    const PREFERRED_AUDIO_OUTPUT_ID_KEY = "calla:preferredAudioOutputID";
    const PREFERRED_AUDIO_INPUT_ID_KEY = "calla:preferredAudioInputID";
    const PREFERRED_VIDEO_INPUT_ID_KEY = "calla:preferredVideoInputID";
    class DeviceManager extends TypedEventBase {
        needsVideoDevice;
        element = null;
        _hasAudioPermission = false;
        get hasAudioPermission() {
            return this._hasAudioPermission;
        }
        _hasVideoPermission = false;
        get hasVideoPermission() {
            return this._hasVideoPermission;
        }
        _currentStream = null;
        get currentStream() {
            return this._currentStream;
        }
        set currentStream(v) {
            if (v !== this.currentStream) {
                if (isDefined(this.currentStream)
                    && this.currentStream.active) {
                    for (const track of this.currentStream.getTracks()) {
                        track.stop();
                    }
                }
                this._currentStream = v;
            }
        }
        constructor(needsVideoDevice = false) {
            super();
            this.needsVideoDevice = needsVideoDevice;
            if (canChangeAudioOutput) {
                this.element = Audio(playsInline, autoPlay, styles(display("none")));
                document.body.appendChild(this.element);
            }
        }
        async setDestination(destination) {
            try {
                if (canChangeAudioOutput && destination.stream !== this.element.srcObject) {
                    this.element.srcObject = destination.stream;
                    const devices = await this.getAudioOutputDevices();
                    const device = arrayScan(devices, (d) => d.deviceId === this.preferredAudioOutputID, (d) => d.deviceId === "default", (d) => d.deviceId.length > 0);
                    if (device) {
                        await this.setAudioOutputDevice(device);
                    }
                    await this.element.play();
                }
            }
            catch (exp) {
                console.error(exp);
            }
        }
        async start() {
            await this.enablePreferredAudioInput();
            await this.enablePreferredVideoInput();
        }
        async enablePreferredAudioInput() {
            const device = await this.getPreferredAudioInput();
            if (device) {
                await this.setAudioInputDevice(device);
            }
        }
        async enablePreferredVideoInput() {
            const device = await this.getPreferredVideoInput();
            if (device) {
                await this.setVideoInputDevice(device);
            }
        }
        get preferredAudioOutputID() {
            if (!canChangeAudioOutput) {
                return null;
            }
            return localStorage.getItem(PREFERRED_AUDIO_OUTPUT_ID_KEY);
        }
        setPreferredAudioOutputID(v) {
            if (canChangeAudioOutput) {
                localStorage.setItem(PREFERRED_AUDIO_OUTPUT_ID_KEY, v);
            }
        }
        get preferredAudioInputID() {
            return localStorage.getItem(PREFERRED_AUDIO_INPUT_ID_KEY);
        }
        setPreferredAudioInputID(v) {
            localStorage.setItem(PREFERRED_AUDIO_INPUT_ID_KEY, v);
        }
        get preferredVideoInputID() {
            return localStorage.getItem(PREFERRED_VIDEO_INPUT_ID_KEY);
        }
        setPreferredVideoInputID(v) {
            localStorage.setItem(PREFERRED_VIDEO_INPUT_ID_KEY, v);
        }
        async getAudioOutputDevices(filterDuplicates = false) {
            if (!canChangeAudioOutput) {
                return [];
            }
            const devices = await this.getAvailableDevices(filterDuplicates);
            return devices && devices.audioOutput || [];
        }
        async getAudioInputDevices(filterDuplicates = false) {
            const devices = await this.getAvailableDevices(filterDuplicates);
            return devices && devices.audioInput || [];
        }
        async getVideoInputDevices(filterDuplicates = false) {
            const devices = await this.getAvailableDevices(filterDuplicates);
            return devices && devices.videoInput || [];
        }
        async getAudioOutputDevice() {
            if (!canChangeAudioOutput) {
                return null;
            }
            const curId = this.element && this.element.sinkId;
            if (isNullOrUndefined(curId)) {
                return null;
            }
            const devices = await this.getAudioOutputDevices(), device = arrayScan(devices, d => d.deviceId === curId);
            return device;
        }
        async getAudioInputDevice() {
            if (isNullOrUndefined(this.currentStream)
                || !this.currentStream.active) {
                return null;
            }
            const curTracks = this.currentStream.getAudioTracks();
            if (curTracks.length === 0) {
                return null;
            }
            const testTrack = curTracks[0];
            const devices = await this.getAudioInputDevices();
            const device = arrayScan(devices, d => testTrack.label === d.label);
            return device;
        }
        async getVideoInputDevice() {
            if (isNullOrUndefined(this.currentStream)
                || !this.currentStream.active) {
                return null;
            }
            const curTracks = this.currentStream.getVideoTracks();
            if (curTracks.length === 0) {
                return null;
            }
            const testTrack = curTracks[0];
            const devices = await this.getVideoInputDevices();
            const device = arrayScan(devices, d => testTrack.label === d.label);
            return device;
        }
        async getPreferredAudioInput() {
            const devices = await this.getAudioInputDevices();
            const device = arrayScan(devices, (d) => d.deviceId === this.preferredAudioInputID, (d) => d.deviceId === "default", (d) => d.deviceId.length > 0);
            return device;
        }
        async getPreferredVideoInput() {
            const devices = await this.getVideoInputDevices();
            const device = arrayScan(devices, (d) => d.deviceId === this.preferredVideoInputID, (d) => this.needsVideoDevice && d.deviceId.length > 0);
            return device;
        }
        async setAudioOutputDevice(device) {
            if (canChangeAudioOutput) {
                if (device.kind !== "audiooutput") {
                    throw new Error(`Device is not an audio output device. Was: ${device.kind}. Label: ${device.label}`);
                }
                this.setPreferredAudioOutputID(device && device.deviceId || null);
                const curDevice = this.element;
                const curDeviceID = curDevice && curDevice.sinkId;
                if (this.preferredAudioOutputID !== curDeviceID) {
                    if (isDefined(this.preferredAudioOutputID)) {
                        await this.element.setSinkId(this.preferredAudioOutputID);
                    }
                    this.dispatchEvent(new DeviceManagerAudioOutputChangedEvent(device));
                }
            }
        }
        async setAudioInputDevice(newAudio) {
            if (newAudio.kind !== "audioinput") {
                throw new Error(`Device is not an audio input device. Was: ${newAudio.kind}. Label: ${newAudio.label}`);
            }
            this.setPreferredAudioInputID(newAudio && newAudio.deviceId || null);
            const curAudio = await this.getAudioInputDevice();
            const curAudioID = curAudio && curAudio.deviceId;
            if (this.preferredAudioInputID !== curAudioID) {
                const curVideo = await this.getVideoInputDevice();
                this.dispatchEvent(new DeviceManagerInputsChangedEvent(newAudio, curVideo));
            }
        }
        async setVideoInputDevice(newVideo) {
            if (newVideo.kind !== "videoinput") {
                throw new Error(`Device is not an video input device. Was: ${newVideo.kind}. Label: ${newVideo.label}`);
            }
            this.setPreferredVideoInputID(newVideo && newVideo.deviceId || null);
            const curVideo = await this.getVideoInputDevice();
            const curVideoID = curVideo && curVideo.deviceId;
            if (this.preferredVideoInputID !== curVideoID) {
                const curAudio = await this.getAudioInputDevice();
                this.dispatchEvent(new DeviceManagerInputsChangedEvent(curAudio, newVideo));
            }
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
        async getDevices() {
            let devices = null;
            for (let i = 0; i < 3; ++i) {
                devices = await navigator.mediaDevices.enumerateDevices();
                for (const device of devices) {
                    if (device.deviceId.length > 0) {
                        if (!this.hasAudioPermission) {
                            this._hasAudioPermission = device.kind === "audioinput"
                                && device.label.length > 0;
                        }
                        if (this.needsVideoDevice && !this.hasVideoPermission) {
                            this._hasVideoPermission = device.kind === "videoinput"
                                && device.label.length > 0;
                        }
                    }
                }
                if (this.hasAudioPermission
                    && (!this.needsVideoDevice || this.hasVideoPermission)) {
                    break;
                }
                try {
                    if (!this.hasAudioPermission
                        || this.needsVideoDevice && !this.hasVideoPermission) {
                        this.currentStream = await navigator.mediaDevices.getUserMedia({
                            audio: this.preferredAudioInputID
                                && { deviceId: this.preferredAudioInputID }
                                || true,
                            video: this.needsVideoDevice
                                && (this.preferredVideoInputID
                                    && { deviceId: this.preferredVideoInputID }
                                    || true)
                                || false
                        });
                    }
                }
                catch (exp) {
                    console.warn(exp);
                }
            }
            devices = arraySortByKey(devices || [], d => d.label);
            return devices;
        }
        async getMediaPermissions() {
            await this.getDevices();
            return {
                audio: this.hasAudioPermission,
                video: this.hasVideoPermission
            };
        }
    }

    class CallaEvent extends Event {
        eventType;
        constructor(eventType) {
            super(eventType);
            this.eventType = eventType;
        }
    }
    class CallaUserEvent extends CallaEvent {
        id;
        constructor(type, id) {
            super(type);
            this.id = id;
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

    var ConnectionState;
    (function (ConnectionState) {
        ConnectionState["Disconnected"] = "Disconnected";
        ConnectionState["Connecting"] = "Connecting";
        ConnectionState["Connected"] = "Connected";
        ConnectionState["Disconnecting"] = "Disconnecting";
    })(ConnectionState || (ConnectionState = {}));

    class BaseMetadataClient extends TypedEventBase {
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
        setLocalPose(px, py, pz, fx, fy, fz, ux, uy, uz) {
            this.callInternal("userPosed", px, py, pz, fx, fy, fz, ux, uy, uz);
        }
        tellLocalPose(userid, px, py, pz, fx, fy, fz, ux, uy, uz) {
            this.callInternalSingle(userid, "userPosed", px, py, pz, fx, fy, fz, ux, uy, uz);
        }
        setLocalPointer(name, px, py, pz, fx, fy, fz, ux, uy, uz) {
            this.callInternal("userPointer", name, px, py, pz, fx, fy, fz, ux, uy, uz);
        }
        setAvatarEmoji(emoji) {
            this.callInternal("setAvatarEmoji", emoji);
        }
        tellAvatarEmoji(userid, emoji) {
            this.callInternalSingle(userid, "setAvatarEmoji", emoji);
        }
        setAvatarURL(url) {
            this.callInternal("setAvatarURL", url);
        }
        tellAvatarURL(userid, url) {
            this.callInternalSingle(userid, "setAvatarURL", url);
        }
        emote(emoji) {
            this.callInternal("emote", emoji);
        }
        chat(text) {
            this.callInternal("chat", text);
        }
    }

    function addLogger(obj, evtName) {
        obj.addEventListener(evtName, (...rest) => {
            if (loggingEnabled) {
                console.log(">== CALLA ==<", evtName, ...rest);
            }
        });
    }
    const DEFAULT_LOCAL_USER_ID = "local-user";
    let loggingEnabled = window.location.hostname === "localhost"
        || /\bdebug\b/.test(window.location.search);
    class BaseTeleconferenceClient extends TypedEventBase {
        _audio;
        needsVideoDevice;
        toggleLogging() {
            loggingEnabled = !loggingEnabled;
        }
        localUserID = null;
        localUserName = null;
        roomName = null;
        fetcher;
        _connectionState = ConnectionState.Disconnected;
        _conferenceState = ConnectionState.Disconnected;
        hasAudioPermission = false;
        hasVideoPermission = false;
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
        constructor(fetcher, _audio, needsVideoDevice = false) {
            super();
            this._audio = _audio;
            this.needsVideoDevice = needsVideoDevice;
            this.fetcher = fetcher;
            this.devices.addEventListener("inputschanged", this.onInputsChanged.bind(this));
            this.addEventListener("serverConnected", this.setConnectionState.bind(this, ConnectionState.Connected));
            this.addEventListener("serverFailed", this.setConnectionState.bind(this, ConnectionState.Disconnected));
            this.addEventListener("serverDisconnected", this.setConnectionState.bind(this, ConnectionState.Disconnected));
            this.addEventListener("conferenceJoined", this.setConferenceState.bind(this, ConnectionState.Connected));
            this.addEventListener("conferenceFailed", this.setConferenceState.bind(this, ConnectionState.Disconnected));
            this.addEventListener("conferenceRestored", this.setConferenceState.bind(this, ConnectionState.Connected));
            this.addEventListener("conferenceLeft", this.setConferenceState.bind(this, ConnectionState.Disconnected));
        }
        get audio() {
            return this._audio;
        }
        get devices() {
            return this._audio.devices;
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

    // NOTE: This field gets overwritten in a build process.
    "chrome" in globalThis && !navigator.userAgent.match("CriOS");
    /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    /Opera/.test(navigator.userAgent);
    /Android/.test(navigator.userAgent);
    /iPad|iPhone|iPod/.test(navigator.platform)
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

    function isModifierless(evt) {
        return !(evt.shiftKey || evt.altKey || evt.ctrlKey || evt.metaKey);
    }

    var MessageType;
    (function (MessageType) {
        MessageType["Log"] = "log";
        MessageType["Delete"] = "delete";
        MessageType["Clear"] = "clear";
    })(MessageType || (MessageType = {}));
    const KEY = "XXX_QUAKE_LOGGER_XXX";
    function isWorkerLoggerMessageData(data) {
        return isDefined(data)
            && "key" in data
            && data.key === KEY;
    }

    function track(a, b) {
        return styles(gridColumn(`${a}/${b}`), getMonospaceFamily());
    }
    class WindowLogger {
        logs = new Map();
        rows = new Map();
        container;
        grid;
        workerCount = 0;
        constructor() {
            this.container = Div(styles(position("fixed"), display("none"), top("0"), left("0"), width("100%"), height("100%"), zIndex(9001), padding("1em"), opacity("0.5"), backgroundColor("black"), color("white"), overflow("hidden"), pointerEvents("none")), this.grid = Div(styles(display("grid"), overflowY("auto"), columnGap("0.5em"), gridAutoFlow("row"))));
            document.body.appendChild(this.container);
            window.addEventListener("keypress", (evt) => {
                if (isModifierless(evt) && evt.key === '`') {
                    elementSetDisplay(this.container, this.container.style.display === "none");
                }
            });
        }
        render() {
            const toRemove = new Array();
            for (const [id, row] of this.rows) {
                if (!this.logs.has(id)) {
                    for (const cell of row) {
                        this.grid.removeChild(cell);
                    }
                    toRemove.push(id);
                }
            }
            for (const id of toRemove) {
                this.rows.delete(id);
            }
            let maxWidth = 0;
            for (const values of this.logs.values()) {
                maxWidth = Math.max(maxWidth, values.length);
            }
            this.grid.style.gridTemplateColumns = `auto repeat(${maxWidth}, 1fr)`;
            for (const [id, values] of this.logs) {
                let row = this.rows.get(id);
                if (!row) {
                    row = [
                        Div(id, track(1, 2)),
                        ...values.map((_, i) => {
                            const isLast = i === values.length - 1;
                            const endTrack = isLast ? -1 : i + 3;
                            const cell = Div(track(i + 2, endTrack));
                            return cell;
                        })
                    ];
                    this.rows.set(id, row);
                    this.grid.append(...row);
                }
                for (let i = 0; i < values.length; ++i) {
                    const value = values[i];
                    const cell = row[i + 1];
                    elementClearChildren(cell);
                    cell.appendChild(TextNode(JSON.stringify(value)));
                }
            }
        }
        log(id, ...values) {
            this.logs.set(id, values);
            this.render();
        }
        delete(id) {
            this.logs.delete(id);
            this.render();
        }
        clear() {
            this.logs.clear();
            this.render();
        }
        addWorker(name, worker) {
            worker.addEventListener("message", (evt) => {
                const slug = `worker:${name || this.workerCount.toFixed(0)}:`;
                if (isWorkerLoggerMessageData(evt.data)) {
                    switch (evt.data.method) {
                        case MessageType.Log:
                            this.log(slug + evt.data.id, ...evt.data.values);
                            break;
                        case MessageType.Delete:
                            this.delete(slug + evt.data.id);
                            break;
                        case MessageType.Clear:
                            for (const key of this.logs.keys()) {
                                if (key.startsWith(slug)) {
                                    this.delete(key);
                                }
                            }
                            break;
                        default:
                            assertNever(evt.data.method);
                    }
                }
            });
            ++this.workerCount;
        }
    }

    const logger = new WindowLogger();
    class Logger {
        log(id, ...values) {
            logger.log(id, ...values);
        }
        delete(id) {
            logger.delete(id);
        }
        clear() {
            logger.clear();
        }
        addWorker(name, worker) {
            logger.addWorker(name, worker);
        }
    }

    /**
     * An Event class for tracking changes to audio activity.
     **/
    class AudioActivityEvent extends Event {
        id = null;
        isActive = false;
        /** Creates a new "audioActivity" event */
        constructor() {
            super("audioActivity");
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
        _fetcher;
        _tele;
        _meta;
        isAudioMuted = null;
        isVideoMuted = null;
        constructor(_fetcher, _tele, _meta) {
            super();
            this._fetcher = _fetcher;
            this._tele = _tele;
            this._meta = _meta;
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
                await this.devices.start();
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
            this._meta.addEventListener("chat", fwd);
            this._meta.addEventListener("emote", fwd);
            this._meta.addEventListener("setAvatarEmoji", fwd);
            this._meta.addEventListener("setAvatarURL", fwd);
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
        get devices() {
            return this._tele.audio.devices;
        }
        disposed = false;
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
            this.audio.setUserPose(this.localUserID, px, py, pz, fx, fy, fz, ux, uy, uz);
            this._meta.setLocalPose(px, py, pz, fx, fy, fz, ux, uy, uz);
        }
        tellLocalPose(userid, px, py, pz, fx, fy, fz, ux, uy, uz) {
            this._meta.tellLocalPose(userid, px, py, pz, fx, fy, fz, ux, uy, uz);
        }
        setLocalPointer(name, px, py, pz, fx, fy, fz, ux, uy, uz) {
            this._meta.setLocalPointer(name, px, py, pz, fx, fy, fz, ux, uy, uz);
        }
        setAvatarEmoji(emoji) {
            this._meta.setAvatarEmoji(emoji);
        }
        tellAvatarEmoji(userid, emoji) {
            this._meta.tellAvatarEmoji(userid, emoji);
        }
        setAvatarURL(url) {
            this._meta.setAvatarURL(url);
        }
        tellAvatarURL(userid, url) {
            this._meta.tellAvatarURL(userid, url);
        }
        emote(emoji) {
            this._meta.emote(emoji);
        }
        chat(text) {
            this._meta.chat(text);
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
            const logger = new Logger();
            logger.log("Calla.join:tele", roomName);
            await this._tele.join(roomName);
            if (this._tele.conferenceState === ConnectionState.Connected) {
                logger.log("Calla.join:meta", roomName);
                await this._meta.join(roomName);
            }
            logger.log("Calla.joined");
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
        async setAudioOutputDevice(device) {
            this.audio.devices.setAudioOutputDevice(device);
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

    var version = "1.0.0";

    console.info(`Calla v${version}.`);

    exports.BaseMetadataClient = BaseMetadataClient;
    exports.BaseTeleconferenceClient = BaseTeleconferenceClient;
    exports.Client = Calla;
    exports.DEFAULT_LOCAL_USER_ID = DEFAULT_LOCAL_USER_ID;
    exports.DeviceManager = DeviceManager;
    exports.DeviceManagerAudioOutputChangedEvent = DeviceManagerAudioOutputChangedEvent;
    exports.DeviceManagerInputsChangedEvent = DeviceManagerInputsChangedEvent;
    exports.addLogger = addLogger;
    exports.canChangeAudioOutput = canChangeAudioOutput;
    exports.version = version;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

}({}));
//# sourceMappingURL=calla.js.map
