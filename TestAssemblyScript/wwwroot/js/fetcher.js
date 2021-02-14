var WorkerMethodMessageType;
(function (WorkerMethodMessageType) {
    WorkerMethodMessageType["Error"] = "error";
    WorkerMethodMessageType["Progress"] = "progress";
    WorkerMethodMessageType["Return"] = "return";
    WorkerMethodMessageType["ReturnValue"] = "returnValue";
})(WorkerMethodMessageType || (WorkerMethodMessageType = {}));
class WorkerServer {
    /**
     * Creates a new worker thread method call listener.
     * @param self - the worker scope in which to listen.
     */
    constructor(self) {
        this.self = self;
        this.methods = new Map();
        this.self.onmessage = (evt) => {
            const data = evt.data;
            const method = this.methods.get(data.methodName);
            if (method) {
                method(data.taskID, ...data.params);
            }
            else {
                this.onError(data.taskID, "method not found: " + data.methodName);
            }
        };
        this.add("methodExists", async (methodName) => this.methods.has(methodName));
    }
    /**
     * Report an error back to the calling thread.
     * @param taskID - the invocation ID of the method that errored.
     * @param errorMessage - what happened?
     */
    onError(taskID, errorMessage) {
        this.self.postMessage({
            taskID,
            methodName: WorkerMethodMessageType.Error,
            errorMessage
        });
    }
    /**
     * Report progress through long-running invocations.
     * @param taskID - the invocation ID of the method that is updating.
     * @param soFar - how much of the process we've gone through.
     * @param total - the total amount we need to go through.
     * @param msg - an optional message to include as part of the progress update.
     */
    onProgress(taskID, soFar, total, msg) {
        this.self.postMessage({
            taskID,
            methodName: WorkerMethodMessageType.Progress,
            soFar,
            total,
            msg
        });
    }
    /**
     * Return the results back to the invoker.
     * @param taskID - the invocation ID of the method that has completed.
     * @param returnValue - the (optional) value that is being returned.
     * @param transferables - an (optional) array of values that appear in the return value that should be transfered back to the calling thread, rather than copied.
     */
    onReturn(taskID, returnValue, transferables) {
        if (returnValue === undefined) {
            this.self.postMessage({
                taskID,
                methodName: WorkerMethodMessageType.Return
            });
        }
        else if (transferables === undefined) {
            this.self.postMessage({
                taskID,
                methodName: WorkerMethodMessageType.ReturnValue,
                returnValue
            });
        }
        else {
            this.self.postMessage({
                taskID,
                methodName: WorkerMethodMessageType.ReturnValue,
                returnValue
            }, transferables);
        }
    }
    /**
     * Registers a function call for cross-thread invocation.
     * @param methodName - the name of the method to use during invocations.
     * @param asyncFunc - the function to execute when the method is invoked.
     * @param transferReturnValue - an (optional) function that reports on which values in the `returnValue` should be transfered instead of copied.
     */
    add(methodName, asyncFunc, transferReturnValue) {
        this.methods.set(methodName, async (taskID, ...params) => {
            // If your invocable functions don't report progress, this can be safely ignored.
            const onProgress = (soFar, total, msg) => {
                this.onProgress(taskID, soFar, total, msg);
            };
            try {
                // Even functions returning void and functions returning bare, unPromised values, can be awaited.
                // This creates a convenient fallback where we don't have to consider the exact return type of the function.
                const returnValue = await asyncFunc(...params, onProgress);
                if (returnValue === undefined) {
                    this.onReturn(taskID);
                }
                else {
                    if (transferReturnValue) {
                        const transferables = transferReturnValue(returnValue);
                        this.onReturn(taskID, returnValue, transferables);
                    }
                    else {
                        this.onReturn(taskID, returnValue);
                    }
                }
            }
            catch (exp) {
                this.onError(taskID, exp.message);
            }
        });
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

function t(o, s, c) {
    return typeof o === s
        || o instanceof c;
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
function isDate(obj) {
    return obj instanceof Date;
}
function isHTMLElement(obj) {
    return obj instanceof HTMLElement;
}
/**
 * Check a value to see if it is of a number type
 * and is not the special NaN value.
 */
function isGoodNumber(obj) {
    return isNumber(obj)
        && !Number.isNaN(obj);
}
function isNullOrUndefined(obj) {
    return obj === null
        || obj === undefined;
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
 * The URL of the embeddable content.
  **/
function src(value) { return new Attr("src", value, "audio", "embed", "iframe", "img", "input", "script", "source", "track", "video"); }

function hasNode(obj) {
    return !isNullOrUndefined(obj)
        && !isString(obj)
        && !isNumber(obj)
        && !isBoolean(obj)
        && !isDate(obj)
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
            if (isString(x)
                || isNumber(x)
                || isBoolean(x)
                || x instanceof Date
                || x instanceof Node
                || hasNode(x)) {
                if (hasNode(x)) {
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
function Script(...rest) { return tag("script", ...rest); }

function createScript(file) {
    const script = Script(src(file));
    document.body.appendChild(script);
}

function splitProgress(onProgress, weights) {
    let subProgressWeights;
    if (isNumber(weights)) {
        subProgressWeights = new Array(weights);
        for (let i = 0; i < subProgressWeights.length; ++i) {
            subProgressWeights[i] = 1 / weights;
        }
    }
    else {
        subProgressWeights = weights;
    }
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

class Fetcher {
    normalizeOnProgress(headerMap, onProgress) {
        if (isNullOrUndefined(onProgress)
            && headerMap instanceof Function) {
            onProgress = headerMap;
        }
        return onProgress;
    }
    normalizeHeaderMap(headerMap) {
        if (headerMap instanceof Map) {
            return headerMap;
        }
        return undefined;
    }
    async getResponse(path, headerMap) {
        const headers = {};
        if (headerMap) {
            for (const pair of headerMap.entries()) {
                headers[pair[0]] = pair[1];
            }
        }
        return await this.readRequestResponse(path, fetch(path, {
            headers
        }));
    }
    async postObjectForResponse(path, obj, headerMap) {
        const headers = {};
        if (!(obj instanceof FormData)) {
            headers["Content-Type"] = "application/json";
        }
        if (headerMap) {
            for (const pair of headerMap.entries()) {
                headers[pair[0]] = pair[1];
            }
        }
        const body = obj instanceof FormData
            ? obj
            : JSON.stringify(obj);
        return await this.readRequestResponse(path, fetch(path, {
            method: "POST",
            headers,
            body
        }));
    }
    async readRequestResponse(path, request) {
        const response = await request;
        if (!response.ok) {
            let message = response.statusText;
            if (response.body) {
                message += " ";
                message += await response.text();
                message = message.trim();
            }
            throw new Error(`[${response.status}] - ${message} . Path ${path}`);
        }
        return response;
    }
    async readResponseBuffer(path, response, onProgress) {
        const contentType = response.headers.get("Content-Type");
        if (!contentType) {
            throw new Error("Server did not provide a content type");
        }
        let contentLength = 1;
        const contentLengthStr = response.headers.get("Content-Length");
        if (!contentLengthStr) {
            console.warn(`Server did not provide a content length header. Path: ${path}`);
        }
        else {
            contentLength = parseInt(contentLengthStr, 10);
            if (!isGoodNumber(contentLength)) {
                console.warn(`Server did not provide a valid content length header. Value: ${contentLengthStr}, Path: ${path}`);
                contentLength = 1;
            }
        }
        const hasContentLength = isGoodNumber(contentLength);
        if (!hasContentLength) {
            contentLength = 1;
        }
        if (!response.body) {
            throw new Error("No response body!");
        }
        const reader = response.body.getReader();
        const values = [];
        let receivedLength = 0;
        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                break;
            }
            if (value) {
                values.push(value);
                receivedLength += value.length;
                if (onProgress) {
                    onProgress(receivedLength, Math.max(receivedLength, contentLength), path);
                }
            }
        }
        const buffer = new ArrayBuffer(receivedLength);
        const array = new Uint8Array(buffer);
        receivedLength = 0;
        for (const value of values) {
            array.set(value, receivedLength);
            receivedLength += value.length;
        }
        if (onProgress) {
            onProgress(1, 1, path);
        }
        return { buffer, contentType };
    }
    async _getBuffer(path, headerMap, onProgress) {
        onProgress = this.normalizeOnProgress(headerMap, onProgress);
        headerMap = this.normalizeHeaderMap(headerMap);
        const response = await this.getResponse(path, headerMap);
        return await this.readResponseBuffer(path, response, onProgress);
    }
    async getBuffer(path, headerMap, onProgress) {
        return await this._getBuffer(path, headerMap, onProgress);
    }
    async _postObjectForBuffer(path, obj, headerMap, onProgress) {
        onProgress = this.normalizeOnProgress(headerMap, onProgress);
        headerMap = this.normalizeHeaderMap(headerMap);
        const response = await this.postObjectForResponse(path, obj, headerMap);
        return await this.readResponseBuffer(path, response, onProgress);
    }
    async postObjectForBuffer(path, obj, headerMap, onProgress) {
        return await this._postObjectForBuffer(path, obj, headerMap, onProgress);
    }
    async _getBlob(path, headerMap, onProgress) {
        onProgress = this.normalizeOnProgress(headerMap, onProgress);
        headerMap = this.normalizeHeaderMap(headerMap);
        const { buffer, contentType } = await this._getBuffer(path, headerMap, onProgress);
        return new Blob([buffer], { type: contentType });
    }
    async getBlob(path, headerMap, onProgress) {
        return this._getBlob(path, headerMap, onProgress);
    }
    async _postObjectForBlob(path, obj, headerMap, onProgress) {
        onProgress = this.normalizeOnProgress(headerMap, onProgress);
        headerMap = this.normalizeHeaderMap(headerMap);
        const { buffer, contentType } = await this._postObjectForBuffer(path, obj, headerMap, onProgress);
        return new Blob([buffer], { type: contentType });
    }
    async postObjectForBlob(path, obj, headerMap, onProgress) {
        return this._postObjectForBlob(path, obj, headerMap, onProgress);
    }
    async _getFile(path, headerMap, onProgress) {
        onProgress = this.normalizeOnProgress(headerMap, onProgress);
        headerMap = this.normalizeHeaderMap(headerMap);
        const blob = await this._getBlob(path, headerMap, onProgress);
        return URL.createObjectURL(blob);
    }
    async getFile(path, headerMap, onProgress) {
        return await this._getFile(path, headerMap, onProgress);
    }
    async _postObjectForFile(path, obj, headerMap, onProgress) {
        onProgress = this.normalizeOnProgress(headerMap, onProgress);
        headerMap = this.normalizeHeaderMap(headerMap);
        const blob = await this._postObjectForBlob(path, obj, headerMap, onProgress);
        return URL.createObjectURL(blob);
    }
    async postObjectForFile(path, obj, headerMap, onProgress) {
        return await this._postObjectForFile(path, obj, headerMap, onProgress);
    }
    readBufferText(buffer) {
        const decoder = new TextDecoder("utf-8");
        const text = decoder.decode(buffer);
        return text;
    }
    async _getText(path, headerMap, onProgress) {
        onProgress = this.normalizeOnProgress(headerMap, onProgress);
        headerMap = this.normalizeHeaderMap(headerMap);
        const { buffer } = await this._getBuffer(path, headerMap, onProgress);
        return this.readBufferText(buffer);
    }
    async getText(path, headerMap, onProgress) {
        return await this._getText(path, headerMap, onProgress);
    }
    async _postObjectForText(path, obj, headerMap, onProgress) {
        onProgress = this.normalizeOnProgress(headerMap, onProgress);
        headerMap = this.normalizeHeaderMap(headerMap);
        const { buffer } = await this._postObjectForBuffer(path, obj, headerMap, onProgress);
        return this.readBufferText(buffer);
    }
    async postObjectForText(path, obj, headerMap, onProgress) {
        return await this._postObjectForText(path, obj, headerMap, onProgress);
    }
    setDefaultAcceptType(headerMap, type) {
        if (!headerMap) {
            headerMap = new Map();
        }
        if (!headerMap.has("Accept")) {
            headerMap.set("Accept", type);
        }
        return headerMap;
    }
    async _getObject(path, headerMap, onProgress) {
        onProgress = this.normalizeOnProgress(headerMap, onProgress);
        headerMap = this.normalizeHeaderMap(headerMap);
        headerMap = this.setDefaultAcceptType(headerMap, "application/json");
        const text = await this._getText(path, headerMap, onProgress);
        return JSON.parse(text);
    }
    async getObject(path, headerMap, onProgress) {
        return await this._getObject(path, headerMap, onProgress);
    }
    async _postObjectForObject(path, obj, headerMap, onProgress) {
        onProgress = this.normalizeOnProgress(headerMap, onProgress);
        headerMap = this.normalizeHeaderMap(headerMap);
        headerMap = this.setDefaultAcceptType(headerMap, "application/json");
        const text = await this._postObjectForText(path, obj, headerMap, onProgress);
        return JSON.parse(text);
    }
    async postObjectForObject(path, obj, headerMap, onProgress) {
        return await this._postObjectForObject(path, obj, headerMap, onProgress);
    }
    async postObject(path, obj, headerMap, onProgress) {
        onProgress = this.normalizeOnProgress(headerMap, onProgress);
        headerMap = this.normalizeHeaderMap(headerMap);
        if (onProgress instanceof Function) {
            const [upProg, downProg] = splitProgress(onProgress, 2);
            let headers = headerMap;
            const xhr = new XMLHttpRequest();
            function makeTask(name, target, onProgress, skipLoading, prevTask) {
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
                        onProgress(evt.loaded, evt.total, name);
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
            const upload = makeTask("uploading", xhr.upload, upProg, false, Promise.resolve());
            const download = makeTask("saving", xhr, downProg, true, upload);
            xhr.open("POST", path);
            if (headers) {
                for (const [key, value] of headers) {
                    xhr.setRequestHeader(key, value);
                }
            }
            if (obj instanceof FormData) {
                xhr.send(obj);
            }
            else {
                const json = JSON.stringify(obj);
                xhr.send(json);
            }
            await upload;
            await download;
        }
        else {
            await this.postObjectForResponse(path, obj, headerMap);
        }
    }
    readTextXml(text) {
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, "text/xml");
        return xml.documentElement;
    }
    async _getXml(path, headerMap, onProgress) {
        onProgress = this.normalizeOnProgress(headerMap, onProgress);
        headerMap = this.normalizeHeaderMap(headerMap);
        const text = await this._getText(path, headerMap, onProgress);
        return this.readTextXml(text);
    }
    async getXml(path, headerMap, onProgress) {
        return await this._getXml(path, headerMap, onProgress);
    }
    async postObjectForXml(path, obj, headerMap, onProgress) {
        const text = await this._postObjectForText(path, obj, headerMap, onProgress);
        return this.readTextXml(text);
    }
    async loadScript(path, test, onProgress) {
        if (!test()) {
            const scriptLoadTask = waitFor(test);
            const file = await this.getFile(path, onProgress);
            createScript(file);
            await scriptLoadTask;
        }
        else if (onProgress) {
            onProgress(1, 1, "skip");
        }
    }
    async getWASM(path, imports, onProgress) {
        const wasmBuffer = await this.getBuffer(path, onProgress);
        if (wasmBuffer.contentType !== "application/wasm") {
            throw new Error("Server did not respond with WASM file. Was: " + wasmBuffer.contentType);
        }
        const wasmModule = await WebAssembly.instantiate(wasmBuffer.buffer, imports);
        return wasmModule.instance.exports;
    }
}

class FetcherWorkerServer extends WorkerServer {
    constructor(self) {
        super(self);
        const fetcher = new Fetcher();
        this.add("getBuffer", (path, headerMap, onProgress) => fetcher.getBuffer(path, headerMap, onProgress), (parts) => [parts.buffer]);
        this.add("postObjectForBuffer", (path, obj, headerMap, onProgress) => fetcher.postObjectForBuffer(path, obj, headerMap, onProgress), (parts) => [parts.buffer]);
        this.add("getObject", (path, headerMap, onProgress) => fetcher.getObject(path, headerMap, onProgress));
        this.add("postObjectForObject", (path, obj, headerMap, onProgress) => fetcher.postObjectForObject(path, obj, headerMap, onProgress));
        this.add("getFile", (path, headerMap, onProgress) => fetcher.getFile(path, headerMap, onProgress));
        this.add("postObjectForFile", (path, obj, headerMap, onProgress) => fetcher.postObjectForFile(path, obj, headerMap, onProgress));
    }
}

globalThis.server = new FetcherWorkerServer(globalThis);
//# sourceMappingURL=fetcher.js.map
