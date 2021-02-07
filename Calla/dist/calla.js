var Calla = (function (exports) {
    'use strict';

    function t(o, s, c) {
        return typeof o === s
            || o instanceof c;
    }
    function isFunction(obj) {
        return t(obj, "function", Function);
    }
    function assertNever(x) {
        throw new Error("Unexpected object: " + x);
    }

    /**
     * Indicates whether or not the current browser can change the destination device for audio output.
     **/
    const canChangeAudioOutput = isFunction(HTMLAudioElement.prototype.setSinkId);

    // Copyright (c) .NET Foundation. All rights reserved.
    // Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
    var __extends = (undefined && undefined.__extends) || (function () {
        var extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /** Error thrown when an HTTP request fails. */
    var HttpError = /** @class */ (function (_super) {
        __extends(HttpError, _super);
        /** Constructs a new instance of {@link @microsoft/signalr.HttpError}.
         *
         * @param {string} errorMessage A descriptive error message.
         * @param {number} statusCode The HTTP status code represented by this error.
         */
        function HttpError(errorMessage, statusCode) {
            var _newTarget = this.constructor;
            var _this = this;
            var trueProto = _newTarget.prototype;
            _this = _super.call(this, errorMessage) || this;
            _this.statusCode = statusCode;
            // Workaround issue in Typescript compiler
            // https://github.com/Microsoft/TypeScript/issues/13965#issuecomment-278570200
            _this.__proto__ = trueProto;
            return _this;
        }
        return HttpError;
    }(Error));
    /** Error thrown when a timeout elapses. */
    var TimeoutError = /** @class */ (function (_super) {
        __extends(TimeoutError, _super);
        /** Constructs a new instance of {@link @microsoft/signalr.TimeoutError}.
         *
         * @param {string} errorMessage A descriptive error message.
         */
        function TimeoutError(errorMessage) {
            var _newTarget = this.constructor;
            if (errorMessage === void 0) { errorMessage = "A timeout occurred."; }
            var _this = this;
            var trueProto = _newTarget.prototype;
            _this = _super.call(this, errorMessage) || this;
            // Workaround issue in Typescript compiler
            // https://github.com/Microsoft/TypeScript/issues/13965#issuecomment-278570200
            _this.__proto__ = trueProto;
            return _this;
        }
        return TimeoutError;
    }(Error));
    /** Error thrown when an action is aborted. */
    var AbortError = /** @class */ (function (_super) {
        __extends(AbortError, _super);
        /** Constructs a new instance of {@link AbortError}.
         *
         * @param {string} errorMessage A descriptive error message.
         */
        function AbortError(errorMessage) {
            var _newTarget = this.constructor;
            if (errorMessage === void 0) { errorMessage = "An abort occurred."; }
            var _this = this;
            var trueProto = _newTarget.prototype;
            _this = _super.call(this, errorMessage) || this;
            // Workaround issue in Typescript compiler
            // https://github.com/Microsoft/TypeScript/issues/13965#issuecomment-278570200
            _this.__proto__ = trueProto;
            return _this;
        }
        return AbortError;
    }(Error));

    // Copyright (c) .NET Foundation. All rights reserved.
    // Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
    var __assign = (undefined && undefined.__assign) || Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    /** Represents an HTTP response. */
    var HttpResponse = /** @class */ (function () {
        function HttpResponse(statusCode, statusText, content) {
            this.statusCode = statusCode;
            this.statusText = statusText;
            this.content = content;
        }
        return HttpResponse;
    }());
    /** Abstraction over an HTTP client.
     *
     * This class provides an abstraction over an HTTP client so that a different implementation can be provided on different platforms.
     */
    var HttpClient = /** @class */ (function () {
        function HttpClient() {
        }
        HttpClient.prototype.get = function (url, options) {
            return this.send(__assign({}, options, { method: "GET", url: url }));
        };
        HttpClient.prototype.post = function (url, options) {
            return this.send(__assign({}, options, { method: "POST", url: url }));
        };
        HttpClient.prototype.delete = function (url, options) {
            return this.send(__assign({}, options, { method: "DELETE", url: url }));
        };
        /** Gets all cookies that apply to the specified URL.
         *
         * @param url The URL that the cookies are valid for.
         * @returns {string} A string containing all the key-value cookie pairs for the specified URL.
         */
        // @ts-ignore
        HttpClient.prototype.getCookieString = function (url) {
            return "";
        };
        return HttpClient;
    }());

    // Copyright (c) .NET Foundation. All rights reserved.
    // Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
    // These values are designed to match the ASP.NET Log Levels since that's the pattern we're emulating here.
    /** Indicates the severity of a log message.
     *
     * Log Levels are ordered in increasing severity. So `Debug` is more severe than `Trace`, etc.
     */
    var LogLevel;
    (function (LogLevel) {
        /** Log level for very low severity diagnostic messages. */
        LogLevel[LogLevel["Trace"] = 0] = "Trace";
        /** Log level for low severity diagnostic messages. */
        LogLevel[LogLevel["Debug"] = 1] = "Debug";
        /** Log level for informational diagnostic messages. */
        LogLevel[LogLevel["Information"] = 2] = "Information";
        /** Log level for diagnostic messages that indicate a non-fatal problem. */
        LogLevel[LogLevel["Warning"] = 3] = "Warning";
        /** Log level for diagnostic messages that indicate a failure in the current operation. */
        LogLevel[LogLevel["Error"] = 4] = "Error";
        /** Log level for diagnostic messages that indicate a failure that will terminate the entire application. */
        LogLevel[LogLevel["Critical"] = 5] = "Critical";
        /** The highest possible log level. Used when configuring logging to indicate that no log messages should be emitted. */
        LogLevel[LogLevel["None"] = 6] = "None";
    })(LogLevel || (LogLevel = {}));

    // Copyright (c) .NET Foundation. All rights reserved.
    // Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
    /** A logger that does nothing when log messages are sent to it. */
    var NullLogger = /** @class */ (function () {
        function NullLogger() {
        }
        /** @inheritDoc */
        // tslint:disable-next-line
        NullLogger.prototype.log = function (_logLevel, _message) {
        };
        /** The singleton instance of the {@link @microsoft/signalr.NullLogger}. */
        NullLogger.instance = new NullLogger();
        return NullLogger;
    }());

    // Copyright (c) .NET Foundation. All rights reserved.
    // Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
    var __assign$1 = (undefined && undefined.__assign) || Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    };
    // Version token that will be replaced by the prepack command
    /** The version of the SignalR client. */
    var VERSION = "5.0.2";
    /** @private */
    var Arg = /** @class */ (function () {
        function Arg() {
        }
        Arg.isRequired = function (val, name) {
            if (val === null || val === undefined) {
                throw new Error("The '" + name + "' argument is required.");
            }
        };
        Arg.isNotEmpty = function (val, name) {
            if (!val || val.match(/^\s*$/)) {
                throw new Error("The '" + name + "' argument should not be empty.");
            }
        };
        Arg.isIn = function (val, values, name) {
            // TypeScript enums have keys for **both** the name and the value of each enum member on the type itself.
            if (!(val in values)) {
                throw new Error("Unknown " + name + " value: " + val + ".");
            }
        };
        return Arg;
    }());
    /** @private */
    var Platform = /** @class */ (function () {
        function Platform() {
        }
        Object.defineProperty(Platform, "isBrowser", {
            get: function () {
                return typeof window === "object";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Platform, "isWebWorker", {
            get: function () {
                return typeof self === "object" && "importScripts" in self;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Platform, "isNode", {
            get: function () {
                return !this.isBrowser && !this.isWebWorker;
            },
            enumerable: true,
            configurable: true
        });
        return Platform;
    }());
    /** @private */
    function getDataDetail(data, includeContent) {
        var detail = "";
        if (isArrayBuffer(data)) {
            detail = "Binary data of length " + data.byteLength;
            if (includeContent) {
                detail += ". Content: '" + formatArrayBuffer(data) + "'";
            }
        }
        else if (typeof data === "string") {
            detail = "String data of length " + data.length;
            if (includeContent) {
                detail += ". Content: '" + data + "'";
            }
        }
        return detail;
    }
    /** @private */
    function formatArrayBuffer(data) {
        var view = new Uint8Array(data);
        // Uint8Array.map only supports returning another Uint8Array?
        var str = "";
        view.forEach(function (num) {
            var pad = num < 16 ? "0" : "";
            str += "0x" + pad + num.toString(16) + " ";
        });
        // Trim of trailing space.
        return str.substr(0, str.length - 1);
    }
    // Also in signalr-protocol-msgpack/Utils.ts
    /** @private */
    function isArrayBuffer(val) {
        return val && typeof ArrayBuffer !== "undefined" &&
            (val instanceof ArrayBuffer ||
                // Sometimes we get an ArrayBuffer that doesn't satisfy instanceof
                (val.constructor && val.constructor.name === "ArrayBuffer"));
    }
    /** @private */
    function sendMessage(logger, transportName, httpClient, url, accessTokenFactory, content, logMessageContent, withCredentials, defaultHeaders) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, headers, token, _b, name, value, responseType, response;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        headers = {};
                        if (!accessTokenFactory) return [3 /*break*/, 2];
                        return [4 /*yield*/, accessTokenFactory()];
                    case 1:
                        token = _c.sent();
                        if (token) {
                            headers = (_a = {},
                                _a["Authorization"] = "Bearer " + token,
                                _a);
                        }
                        _c.label = 2;
                    case 2:
                        _b = getUserAgentHeader(), name = _b[0], value = _b[1];
                        headers[name] = value;
                        logger.log(LogLevel.Trace, "(" + transportName + " transport) sending data. " + getDataDetail(content, logMessageContent) + ".");
                        responseType = isArrayBuffer(content) ? "arraybuffer" : "text";
                        return [4 /*yield*/, httpClient.post(url, {
                                content: content,
                                headers: __assign$1({}, headers, defaultHeaders),
                                responseType: responseType,
                                withCredentials: withCredentials,
                            })];
                    case 3:
                        response = _c.sent();
                        logger.log(LogLevel.Trace, "(" + transportName + " transport) request complete. Response status: " + response.statusCode + ".");
                        return [2 /*return*/];
                }
            });
        });
    }
    /** @private */
    function createLogger(logger) {
        if (logger === undefined) {
            return new ConsoleLogger(LogLevel.Information);
        }
        if (logger === null) {
            return NullLogger.instance;
        }
        if (logger.log) {
            return logger;
        }
        return new ConsoleLogger(logger);
    }
    /** @private */
    var SubjectSubscription = /** @class */ (function () {
        function SubjectSubscription(subject, observer) {
            this.subject = subject;
            this.observer = observer;
        }
        SubjectSubscription.prototype.dispose = function () {
            var index = this.subject.observers.indexOf(this.observer);
            if (index > -1) {
                this.subject.observers.splice(index, 1);
            }
            if (this.subject.observers.length === 0 && this.subject.cancelCallback) {
                this.subject.cancelCallback().catch(function (_) { });
            }
        };
        return SubjectSubscription;
    }());
    /** @private */
    var ConsoleLogger = /** @class */ (function () {
        function ConsoleLogger(minimumLogLevel) {
            this.minimumLogLevel = minimumLogLevel;
            this.outputConsole = console;
        }
        ConsoleLogger.prototype.log = function (logLevel, message) {
            if (logLevel >= this.minimumLogLevel) {
                switch (logLevel) {
                    case LogLevel.Critical:
                    case LogLevel.Error:
                        this.outputConsole.error("[" + new Date().toISOString() + "] " + LogLevel[logLevel] + ": " + message);
                        break;
                    case LogLevel.Warning:
                        this.outputConsole.warn("[" + new Date().toISOString() + "] " + LogLevel[logLevel] + ": " + message);
                        break;
                    case LogLevel.Information:
                        this.outputConsole.info("[" + new Date().toISOString() + "] " + LogLevel[logLevel] + ": " + message);
                        break;
                    default:
                        // console.debug only goes to attached debuggers in Node, so we use console.log for Trace and Debug
                        this.outputConsole.log("[" + new Date().toISOString() + "] " + LogLevel[logLevel] + ": " + message);
                        break;
                }
            }
        };
        return ConsoleLogger;
    }());
    /** @private */
    function getUserAgentHeader() {
        var userAgentHeaderName = "X-SignalR-User-Agent";
        if (Platform.isNode) {
            userAgentHeaderName = "User-Agent";
        }
        return [userAgentHeaderName, constructUserAgent(VERSION, getOsName(), getRuntime(), getRuntimeVersion())];
    }
    /** @private */
    function constructUserAgent(version, os, runtime, runtimeVersion) {
        // Microsoft SignalR/[Version] ([Detailed Version]; [Operating System]; [Runtime]; [Runtime Version])
        var userAgent = "Microsoft SignalR/";
        var majorAndMinor = version.split(".");
        userAgent += majorAndMinor[0] + "." + majorAndMinor[1];
        userAgent += " (" + version + "; ";
        if (os && os !== "") {
            userAgent += os + "; ";
        }
        else {
            userAgent += "Unknown OS; ";
        }
        userAgent += "" + runtime;
        if (runtimeVersion) {
            userAgent += "; " + runtimeVersion;
        }
        else {
            userAgent += "; Unknown Runtime Version";
        }
        userAgent += ")";
        return userAgent;
    }
    function getOsName() {
        if (Platform.isNode) {
            switch (process.platform) {
                case "win32":
                    return "Windows NT";
                case "darwin":
                    return "macOS";
                case "linux":
                    return "Linux";
                default:
                    return process.platform;
            }
        }
        else {
            return "";
        }
    }
    function getRuntimeVersion() {
        if (Platform.isNode) {
            return process.versions.node;
        }
        return undefined;
    }
    function getRuntime() {
        if (Platform.isNode) {
            return "NodeJS";
        }
        else {
            return "Browser";
        }
    }

    // Copyright (c) .NET Foundation. All rights reserved.
    // Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
    var __extends$1 = (undefined && undefined.__extends) || (function () {
        var extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var __assign$2 = (undefined && undefined.__assign) || Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    var __awaiter$1 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    var __generator$1 = (undefined && undefined.__generator) || function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    };
    var FetchHttpClient = /** @class */ (function (_super) {
        __extends$1(FetchHttpClient, _super);
        function FetchHttpClient(logger) {
            var _this = _super.call(this) || this;
            _this.logger = logger;
            if (typeof fetch === "undefined") {
                // In order to ignore the dynamic require in webpack builds we need to do this magic
                // @ts-ignore: TS doesn't know about these names
                var requireFunc = typeof __webpack_require__ === "function" ? __non_webpack_require__ : require;
                // Cookies aren't automatically handled in Node so we need to add a CookieJar to preserve cookies across requests
                _this.jar = new (requireFunc("tough-cookie")).CookieJar();
                _this.fetchType = requireFunc("node-fetch");
                // node-fetch doesn't have a nice API for getting and setting cookies
                // fetch-cookie will wrap a fetch implementation with a default CookieJar or a provided one
                _this.fetchType = requireFunc("fetch-cookie")(_this.fetchType, _this.jar);
                // Node needs EventListener methods on AbortController which our custom polyfill doesn't provide
                _this.abortControllerType = requireFunc("abort-controller");
            }
            else {
                _this.fetchType = fetch.bind(self);
                _this.abortControllerType = AbortController;
            }
            return _this;
        }
        /** @inheritDoc */
        FetchHttpClient.prototype.send = function (request) {
            return __awaiter$1(this, void 0, void 0, function () {
                var abortController, error, timeoutId, msTimeout, response, e_1, content, payload;
                var _this = this;
                return __generator$1(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            // Check that abort was not signaled before calling send
                            if (request.abortSignal && request.abortSignal.aborted) {
                                throw new AbortError();
                            }
                            if (!request.method) {
                                throw new Error("No method defined.");
                            }
                            if (!request.url) {
                                throw new Error("No url defined.");
                            }
                            abortController = new this.abortControllerType();
                            // Hook our abortSignal into the abort controller
                            if (request.abortSignal) {
                                request.abortSignal.onabort = function () {
                                    abortController.abort();
                                    error = new AbortError();
                                };
                            }
                            timeoutId = null;
                            if (request.timeout) {
                                msTimeout = request.timeout;
                                timeoutId = setTimeout(function () {
                                    abortController.abort();
                                    _this.logger.log(LogLevel.Warning, "Timeout from HTTP request.");
                                    error = new TimeoutError();
                                }, msTimeout);
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, 4, 5]);
                            return [4 /*yield*/, this.fetchType(request.url, {
                                    body: request.content,
                                    cache: "no-cache",
                                    credentials: request.withCredentials === true ? "include" : "same-origin",
                                    headers: __assign$2({ "Content-Type": "text/plain;charset=UTF-8", "X-Requested-With": "XMLHttpRequest" }, request.headers),
                                    method: request.method,
                                    mode: "cors",
                                    redirect: "manual",
                                    signal: abortController.signal,
                                })];
                        case 2:
                            response = _a.sent();
                            return [3 /*break*/, 5];
                        case 3:
                            e_1 = _a.sent();
                            if (error) {
                                throw error;
                            }
                            this.logger.log(LogLevel.Warning, "Error from HTTP request. " + e_1 + ".");
                            throw e_1;
                        case 4:
                            if (timeoutId) {
                                clearTimeout(timeoutId);
                            }
                            if (request.abortSignal) {
                                request.abortSignal.onabort = null;
                            }
                            return [7 /*endfinally*/];
                        case 5:
                            if (!response.ok) {
                                throw new HttpError(response.statusText, response.status);
                            }
                            content = deserializeContent(response, request.responseType);
                            return [4 /*yield*/, content];
                        case 6:
                            payload = _a.sent();
                            return [2 /*return*/, new HttpResponse(response.status, response.statusText, payload)];
                    }
                });
            });
        };
        FetchHttpClient.prototype.getCookieString = function (url) {
            var cookies = "";
            if (Platform.isNode && this.jar) {
                // @ts-ignore: unused variable
                this.jar.getCookies(url, function (e, c) { return cookies = c.join("; "); });
            }
            return cookies;
        };
        return FetchHttpClient;
    }(HttpClient));
    function deserializeContent(response, responseType) {
        var content;
        switch (responseType) {
            case "arraybuffer":
                content = response.arrayBuffer();
                break;
            case "text":
                content = response.text();
                break;
            case "blob":
            case "document":
            case "json":
                throw new Error(responseType + " is not supported.");
            default:
                content = response.text();
                break;
        }
        return content;
    }

    // Copyright (c) .NET Foundation. All rights reserved.
    // Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
    var __extends$2 = (undefined && undefined.__extends) || (function () {
        var extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var XhrHttpClient = /** @class */ (function (_super) {
        __extends$2(XhrHttpClient, _super);
        function XhrHttpClient(logger) {
            var _this = _super.call(this) || this;
            _this.logger = logger;
            return _this;
        }
        /** @inheritDoc */
        XhrHttpClient.prototype.send = function (request) {
            var _this = this;
            // Check that abort was not signaled before calling send
            if (request.abortSignal && request.abortSignal.aborted) {
                return Promise.reject(new AbortError());
            }
            if (!request.method) {
                return Promise.reject(new Error("No method defined."));
            }
            if (!request.url) {
                return Promise.reject(new Error("No url defined."));
            }
            return new Promise(function (resolve, reject) {
                var xhr = new XMLHttpRequest();
                xhr.open(request.method, request.url, true);
                xhr.withCredentials = request.withCredentials === undefined ? true : request.withCredentials;
                xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                // Explicitly setting the Content-Type header for React Native on Android platform.
                xhr.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
                var headers = request.headers;
                if (headers) {
                    Object.keys(headers)
                        .forEach(function (header) {
                        xhr.setRequestHeader(header, headers[header]);
                    });
                }
                if (request.responseType) {
                    xhr.responseType = request.responseType;
                }
                if (request.abortSignal) {
                    request.abortSignal.onabort = function () {
                        xhr.abort();
                        reject(new AbortError());
                    };
                }
                if (request.timeout) {
                    xhr.timeout = request.timeout;
                }
                xhr.onload = function () {
                    if (request.abortSignal) {
                        request.abortSignal.onabort = null;
                    }
                    if (xhr.status >= 200 && xhr.status < 300) {
                        resolve(new HttpResponse(xhr.status, xhr.statusText, xhr.response || xhr.responseText));
                    }
                    else {
                        reject(new HttpError(xhr.statusText, xhr.status));
                    }
                };
                xhr.onerror = function () {
                    _this.logger.log(LogLevel.Warning, "Error from HTTP request. " + xhr.status + ": " + xhr.statusText + ".");
                    reject(new HttpError(xhr.statusText, xhr.status));
                };
                xhr.ontimeout = function () {
                    _this.logger.log(LogLevel.Warning, "Timeout from HTTP request.");
                    reject(new TimeoutError());
                };
                xhr.send(request.content || "");
            });
        };
        return XhrHttpClient;
    }(HttpClient));

    // Copyright (c) .NET Foundation. All rights reserved.
    // Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
    var __extends$3 = (undefined && undefined.__extends) || (function () {
        var extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    /** Default implementation of {@link @microsoft/signalr.HttpClient}. */
    var DefaultHttpClient = /** @class */ (function (_super) {
        __extends$3(DefaultHttpClient, _super);
        /** Creates a new instance of the {@link @microsoft/signalr.DefaultHttpClient}, using the provided {@link @microsoft/signalr.ILogger} to log messages. */
        function DefaultHttpClient(logger) {
            var _this = _super.call(this) || this;
            if (typeof fetch !== "undefined" || Platform.isNode) {
                _this.httpClient = new FetchHttpClient(logger);
            }
            else if (typeof XMLHttpRequest !== "undefined") {
                _this.httpClient = new XhrHttpClient(logger);
            }
            else {
                throw new Error("No usable HttpClient found.");
            }
            return _this;
        }
        /** @inheritDoc */
        DefaultHttpClient.prototype.send = function (request) {
            // Check that abort was not signaled before calling send
            if (request.abortSignal && request.abortSignal.aborted) {
                return Promise.reject(new AbortError());
            }
            if (!request.method) {
                return Promise.reject(new Error("No method defined."));
            }
            if (!request.url) {
                return Promise.reject(new Error("No url defined."));
            }
            return this.httpClient.send(request);
        };
        DefaultHttpClient.prototype.getCookieString = function (url) {
            return this.httpClient.getCookieString(url);
        };
        return DefaultHttpClient;
    }(HttpClient));

    // Copyright (c) .NET Foundation. All rights reserved.
    // Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
    // Not exported from index
    /** @private */
    var TextMessageFormat = /** @class */ (function () {
        function TextMessageFormat() {
        }
        TextMessageFormat.write = function (output) {
            return "" + output + TextMessageFormat.RecordSeparator;
        };
        TextMessageFormat.parse = function (input) {
            if (input[input.length - 1] !== TextMessageFormat.RecordSeparator) {
                throw new Error("Message is incomplete.");
            }
            var messages = input.split(TextMessageFormat.RecordSeparator);
            messages.pop();
            return messages;
        };
        TextMessageFormat.RecordSeparatorCode = 0x1e;
        TextMessageFormat.RecordSeparator = String.fromCharCode(TextMessageFormat.RecordSeparatorCode);
        return TextMessageFormat;
    }());

    // Copyright (c) .NET Foundation. All rights reserved.
    /** @private */
    var HandshakeProtocol = /** @class */ (function () {
        function HandshakeProtocol() {
        }
        // Handshake request is always JSON
        HandshakeProtocol.prototype.writeHandshakeRequest = function (handshakeRequest) {
            return TextMessageFormat.write(JSON.stringify(handshakeRequest));
        };
        HandshakeProtocol.prototype.parseHandshakeResponse = function (data) {
            var responseMessage;
            var messageData;
            var remainingData;
            if (isArrayBuffer(data) || (typeof Buffer !== "undefined" && data instanceof Buffer)) {
                // Format is binary but still need to read JSON text from handshake response
                var binaryData = new Uint8Array(data);
                var separatorIndex = binaryData.indexOf(TextMessageFormat.RecordSeparatorCode);
                if (separatorIndex === -1) {
                    throw new Error("Message is incomplete.");
                }
                // content before separator is handshake response
                // optional content after is additional messages
                var responseLength = separatorIndex + 1;
                messageData = String.fromCharCode.apply(null, binaryData.slice(0, responseLength));
                remainingData = (binaryData.byteLength > responseLength) ? binaryData.slice(responseLength).buffer : null;
            }
            else {
                var textData = data;
                var separatorIndex = textData.indexOf(TextMessageFormat.RecordSeparator);
                if (separatorIndex === -1) {
                    throw new Error("Message is incomplete.");
                }
                // content before separator is handshake response
                // optional content after is additional messages
                var responseLength = separatorIndex + 1;
                messageData = textData.substring(0, responseLength);
                remainingData = (textData.length > responseLength) ? textData.substring(responseLength) : null;
            }
            // At this point we should have just the single handshake message
            var messages = TextMessageFormat.parse(messageData);
            var response = JSON.parse(messages[0]);
            if (response.type) {
                throw new Error("Expected a handshake response from the server.");
            }
            responseMessage = response;
            // multiple messages could have arrived with handshake
            // return additional data to be parsed as usual, or null if all parsed
            return [remainingData, responseMessage];
        };
        return HandshakeProtocol;
    }());

    // Copyright (c) .NET Foundation. All rights reserved.
    // Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
    /** Defines the type of a Hub Message. */
    var MessageType;
    (function (MessageType) {
        /** Indicates the message is an Invocation message and implements the {@link @microsoft/signalr.InvocationMessage} interface. */
        MessageType[MessageType["Invocation"] = 1] = "Invocation";
        /** Indicates the message is a StreamItem message and implements the {@link @microsoft/signalr.StreamItemMessage} interface. */
        MessageType[MessageType["StreamItem"] = 2] = "StreamItem";
        /** Indicates the message is a Completion message and implements the {@link @microsoft/signalr.CompletionMessage} interface. */
        MessageType[MessageType["Completion"] = 3] = "Completion";
        /** Indicates the message is a Stream Invocation message and implements the {@link @microsoft/signalr.StreamInvocationMessage} interface. */
        MessageType[MessageType["StreamInvocation"] = 4] = "StreamInvocation";
        /** Indicates the message is a Cancel Invocation message and implements the {@link @microsoft/signalr.CancelInvocationMessage} interface. */
        MessageType[MessageType["CancelInvocation"] = 5] = "CancelInvocation";
        /** Indicates the message is a Ping message and implements the {@link @microsoft/signalr.PingMessage} interface. */
        MessageType[MessageType["Ping"] = 6] = "Ping";
        /** Indicates the message is a Close message and implements the {@link @microsoft/signalr.CloseMessage} interface. */
        MessageType[MessageType["Close"] = 7] = "Close";
    })(MessageType || (MessageType = {}));

    // Copyright (c) .NET Foundation. All rights reserved.
    /** Stream implementation to stream items to the server. */
    var Subject = /** @class */ (function () {
        function Subject() {
            this.observers = [];
        }
        Subject.prototype.next = function (item) {
            for (var _i = 0, _a = this.observers; _i < _a.length; _i++) {
                var observer = _a[_i];
                observer.next(item);
            }
        };
        Subject.prototype.error = function (err) {
            for (var _i = 0, _a = this.observers; _i < _a.length; _i++) {
                var observer = _a[_i];
                if (observer.error) {
                    observer.error(err);
                }
            }
        };
        Subject.prototype.complete = function () {
            for (var _i = 0, _a = this.observers; _i < _a.length; _i++) {
                var observer = _a[_i];
                if (observer.complete) {
                    observer.complete();
                }
            }
        };
        Subject.prototype.subscribe = function (observer) {
            this.observers.push(observer);
            return new SubjectSubscription(this, observer);
        };
        return Subject;
    }());

    // Copyright (c) .NET Foundation. All rights reserved.
    // Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
    var __awaiter$2 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    var __generator$2 = (undefined && undefined.__generator) || function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    };
    var DEFAULT_TIMEOUT_IN_MS = 30 * 1000;
    var DEFAULT_PING_INTERVAL_IN_MS = 15 * 1000;
    /** Describes the current state of the {@link HubConnection} to the server. */
    var HubConnectionState;
    (function (HubConnectionState) {
        /** The hub connection is disconnected. */
        HubConnectionState["Disconnected"] = "Disconnected";
        /** The hub connection is connecting. */
        HubConnectionState["Connecting"] = "Connecting";
        /** The hub connection is connected. */
        HubConnectionState["Connected"] = "Connected";
        /** The hub connection is disconnecting. */
        HubConnectionState["Disconnecting"] = "Disconnecting";
        /** The hub connection is reconnecting. */
        HubConnectionState["Reconnecting"] = "Reconnecting";
    })(HubConnectionState || (HubConnectionState = {}));
    /** Represents a connection to a SignalR Hub. */
    var HubConnection = /** @class */ (function () {
        function HubConnection(connection, logger, protocol, reconnectPolicy) {
            var _this = this;
            Arg.isRequired(connection, "connection");
            Arg.isRequired(logger, "logger");
            Arg.isRequired(protocol, "protocol");
            this.serverTimeoutInMilliseconds = DEFAULT_TIMEOUT_IN_MS;
            this.keepAliveIntervalInMilliseconds = DEFAULT_PING_INTERVAL_IN_MS;
            this.logger = logger;
            this.protocol = protocol;
            this.connection = connection;
            this.reconnectPolicy = reconnectPolicy;
            this.handshakeProtocol = new HandshakeProtocol();
            this.connection.onreceive = function (data) { return _this.processIncomingData(data); };
            this.connection.onclose = function (error) { return _this.connectionClosed(error); };
            this.callbacks = {};
            this.methods = {};
            this.closedCallbacks = [];
            this.reconnectingCallbacks = [];
            this.reconnectedCallbacks = [];
            this.invocationId = 0;
            this.receivedHandshakeResponse = false;
            this.connectionState = HubConnectionState.Disconnected;
            this.connectionStarted = false;
            this.cachedPingMessage = this.protocol.writeMessage({ type: MessageType.Ping });
        }
        /** @internal */
        // Using a public static factory method means we can have a private constructor and an _internal_
        // create method that can be used by HubConnectionBuilder. An "internal" constructor would just
        // be stripped away and the '.d.ts' file would have no constructor, which is interpreted as a
        // public parameter-less constructor.
        HubConnection.create = function (connection, logger, protocol, reconnectPolicy) {
            return new HubConnection(connection, logger, protocol, reconnectPolicy);
        };
        Object.defineProperty(HubConnection.prototype, "state", {
            /** Indicates the state of the {@link HubConnection} to the server. */
            get: function () {
                return this.connectionState;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HubConnection.prototype, "connectionId", {
            /** Represents the connection id of the {@link HubConnection} on the server. The connection id will be null when the connection is either
             *  in the disconnected state or if the negotiation step was skipped.
             */
            get: function () {
                return this.connection ? (this.connection.connectionId || null) : null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HubConnection.prototype, "baseUrl", {
            /** Indicates the url of the {@link HubConnection} to the server. */
            get: function () {
                return this.connection.baseUrl || "";
            },
            /**
             * Sets a new url for the HubConnection. Note that the url can only be changed when the connection is in either the Disconnected or
             * Reconnecting states.
             * @param {string} url The url to connect to.
             */
            set: function (url) {
                if (this.connectionState !== HubConnectionState.Disconnected && this.connectionState !== HubConnectionState.Reconnecting) {
                    throw new Error("The HubConnection must be in the Disconnected or Reconnecting state to change the url.");
                }
                if (!url) {
                    throw new Error("The HubConnection url must be a valid url.");
                }
                this.connection.baseUrl = url;
            },
            enumerable: true,
            configurable: true
        });
        /** Starts the connection.
         *
         * @returns {Promise<void>} A Promise that resolves when the connection has been successfully established, or rejects with an error.
         */
        HubConnection.prototype.start = function () {
            this.startPromise = this.startWithStateTransitions();
            return this.startPromise;
        };
        HubConnection.prototype.startWithStateTransitions = function () {
            return __awaiter$2(this, void 0, void 0, function () {
                var e_1;
                return __generator$2(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (this.connectionState !== HubConnectionState.Disconnected) {
                                return [2 /*return*/, Promise.reject(new Error("Cannot start a HubConnection that is not in the 'Disconnected' state."))];
                            }
                            this.connectionState = HubConnectionState.Connecting;
                            this.logger.log(LogLevel.Debug, "Starting HubConnection.");
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.startInternal()];
                        case 2:
                            _a.sent();
                            this.connectionState = HubConnectionState.Connected;
                            this.connectionStarted = true;
                            this.logger.log(LogLevel.Debug, "HubConnection connected successfully.");
                            return [3 /*break*/, 4];
                        case 3:
                            e_1 = _a.sent();
                            this.connectionState = HubConnectionState.Disconnected;
                            this.logger.log(LogLevel.Debug, "HubConnection failed to start successfully because of error '" + e_1 + "'.");
                            return [2 /*return*/, Promise.reject(e_1)];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        HubConnection.prototype.startInternal = function () {
            return __awaiter$2(this, void 0, void 0, function () {
                var handshakePromise, handshakeRequest, e_2;
                var _this = this;
                return __generator$2(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.stopDuringStartError = undefined;
                            this.receivedHandshakeResponse = false;
                            handshakePromise = new Promise(function (resolve, reject) {
                                _this.handshakeResolver = resolve;
                                _this.handshakeRejecter = reject;
                            });
                            return [4 /*yield*/, this.connection.start(this.protocol.transferFormat)];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, 5, , 7]);
                            handshakeRequest = {
                                protocol: this.protocol.name,
                                version: this.protocol.version,
                            };
                            this.logger.log(LogLevel.Debug, "Sending handshake request.");
                            return [4 /*yield*/, this.sendMessage(this.handshakeProtocol.writeHandshakeRequest(handshakeRequest))];
                        case 3:
                            _a.sent();
                            this.logger.log(LogLevel.Information, "Using HubProtocol '" + this.protocol.name + "'.");
                            // defensively cleanup timeout in case we receive a message from the server before we finish start
                            this.cleanupTimeout();
                            this.resetTimeoutPeriod();
                            this.resetKeepAliveInterval();
                            return [4 /*yield*/, handshakePromise];
                        case 4:
                            _a.sent();
                            // It's important to check the stopDuringStartError instead of just relying on the handshakePromise
                            // being rejected on close, because this continuation can run after both the handshake completed successfully
                            // and the connection was closed.
                            if (this.stopDuringStartError) {
                                // It's important to throw instead of returning a rejected promise, because we don't want to allow any state
                                // transitions to occur between now and the calling code observing the exceptions. Returning a rejected promise
                                // will cause the calling continuation to get scheduled to run later.
                                throw this.stopDuringStartError;
                            }
                            return [3 /*break*/, 7];
                        case 5:
                            e_2 = _a.sent();
                            this.logger.log(LogLevel.Debug, "Hub handshake failed with error '" + e_2 + "' during start(). Stopping HubConnection.");
                            this.cleanupTimeout();
                            this.cleanupPingTimer();
                            // HttpConnection.stop() should not complete until after the onclose callback is invoked.
                            // This will transition the HubConnection to the disconnected state before HttpConnection.stop() completes.
                            return [4 /*yield*/, this.connection.stop(e_2)];
                        case 6:
                            // HttpConnection.stop() should not complete until after the onclose callback is invoked.
                            // This will transition the HubConnection to the disconnected state before HttpConnection.stop() completes.
                            _a.sent();
                            throw e_2;
                        case 7: return [2 /*return*/];
                    }
                });
            });
        };
        /** Stops the connection.
         *
         * @returns {Promise<void>} A Promise that resolves when the connection has been successfully terminated, or rejects with an error.
         */
        HubConnection.prototype.stop = function () {
            return __awaiter$2(this, void 0, void 0, function () {
                var startPromise;
                return __generator$2(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            startPromise = this.startPromise;
                            this.stopPromise = this.stopInternal();
                            return [4 /*yield*/, this.stopPromise];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, 4, , 5]);
                            // Awaiting undefined continues immediately
                            return [4 /*yield*/, startPromise];
                        case 3:
                            // Awaiting undefined continues immediately
                            _a.sent();
                            return [3 /*break*/, 5];
                        case 4:
                            _a.sent();
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        HubConnection.prototype.stopInternal = function (error) {
            if (this.connectionState === HubConnectionState.Disconnected) {
                this.logger.log(LogLevel.Debug, "Call to HubConnection.stop(" + error + ") ignored because it is already in the disconnected state.");
                return Promise.resolve();
            }
            if (this.connectionState === HubConnectionState.Disconnecting) {
                this.logger.log(LogLevel.Debug, "Call to HttpConnection.stop(" + error + ") ignored because the connection is already in the disconnecting state.");
                return this.stopPromise;
            }
            this.connectionState = HubConnectionState.Disconnecting;
            this.logger.log(LogLevel.Debug, "Stopping HubConnection.");
            if (this.reconnectDelayHandle) {
                // We're in a reconnect delay which means the underlying connection is currently already stopped.
                // Just clear the handle to stop the reconnect loop (which no one is waiting on thankfully) and
                // fire the onclose callbacks.
                this.logger.log(LogLevel.Debug, "Connection stopped during reconnect delay. Done reconnecting.");
                clearTimeout(this.reconnectDelayHandle);
                this.reconnectDelayHandle = undefined;
                this.completeClose();
                return Promise.resolve();
            }
            this.cleanupTimeout();
            this.cleanupPingTimer();
            this.stopDuringStartError = error || new Error("The connection was stopped before the hub handshake could complete.");
            // HttpConnection.stop() should not complete until after either HttpConnection.start() fails
            // or the onclose callback is invoked. The onclose callback will transition the HubConnection
            // to the disconnected state if need be before HttpConnection.stop() completes.
            return this.connection.stop(error);
        };
        /** Invokes a streaming hub method on the server using the specified name and arguments.
         *
         * @typeparam T The type of the items returned by the server.
         * @param {string} methodName The name of the server method to invoke.
         * @param {any[]} args The arguments used to invoke the server method.
         * @returns {IStreamResult<T>} An object that yields results from the server as they are received.
         */
        HubConnection.prototype.stream = function (methodName) {
            var _this = this;
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var _a = this.replaceStreamingParams(args), streams = _a[0], streamIds = _a[1];
            var invocationDescriptor = this.createStreamInvocation(methodName, args, streamIds);
            var promiseQueue;
            var subject = new Subject();
            subject.cancelCallback = function () {
                var cancelInvocation = _this.createCancelInvocation(invocationDescriptor.invocationId);
                delete _this.callbacks[invocationDescriptor.invocationId];
                return promiseQueue.then(function () {
                    return _this.sendWithProtocol(cancelInvocation);
                });
            };
            this.callbacks[invocationDescriptor.invocationId] = function (invocationEvent, error) {
                if (error) {
                    subject.error(error);
                    return;
                }
                else if (invocationEvent) {
                    // invocationEvent will not be null when an error is not passed to the callback
                    if (invocationEvent.type === MessageType.Completion) {
                        if (invocationEvent.error) {
                            subject.error(new Error(invocationEvent.error));
                        }
                        else {
                            subject.complete();
                        }
                    }
                    else {
                        subject.next((invocationEvent.item));
                    }
                }
            };
            promiseQueue = this.sendWithProtocol(invocationDescriptor)
                .catch(function (e) {
                subject.error(e);
                delete _this.callbacks[invocationDescriptor.invocationId];
            });
            this.launchStreams(streams, promiseQueue);
            return subject;
        };
        HubConnection.prototype.sendMessage = function (message) {
            this.resetKeepAliveInterval();
            return this.connection.send(message);
        };
        /**
         * Sends a js object to the server.
         * @param message The js object to serialize and send.
         */
        HubConnection.prototype.sendWithProtocol = function (message) {
            return this.sendMessage(this.protocol.writeMessage(message));
        };
        /** Invokes a hub method on the server using the specified name and arguments. Does not wait for a response from the receiver.
         *
         * The Promise returned by this method resolves when the client has sent the invocation to the server. The server may still
         * be processing the invocation.
         *
         * @param {string} methodName The name of the server method to invoke.
         * @param {any[]} args The arguments used to invoke the server method.
         * @returns {Promise<void>} A Promise that resolves when the invocation has been successfully sent, or rejects with an error.
         */
        HubConnection.prototype.send = function (methodName) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var _a = this.replaceStreamingParams(args), streams = _a[0], streamIds = _a[1];
            var sendPromise = this.sendWithProtocol(this.createInvocation(methodName, args, true, streamIds));
            this.launchStreams(streams, sendPromise);
            return sendPromise;
        };
        /** Invokes a hub method on the server using the specified name and arguments.
         *
         * The Promise returned by this method resolves when the server indicates it has finished invoking the method. When the promise
         * resolves, the server has finished invoking the method. If the server method returns a result, it is produced as the result of
         * resolving the Promise.
         *
         * @typeparam T The expected return type.
         * @param {string} methodName The name of the server method to invoke.
         * @param {any[]} args The arguments used to invoke the server method.
         * @returns {Promise<T>} A Promise that resolves with the result of the server method (if any), or rejects with an error.
         */
        HubConnection.prototype.invoke = function (methodName) {
            var _this = this;
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var _a = this.replaceStreamingParams(args), streams = _a[0], streamIds = _a[1];
            var invocationDescriptor = this.createInvocation(methodName, args, false, streamIds);
            var p = new Promise(function (resolve, reject) {
                // invocationId will always have a value for a non-blocking invocation
                _this.callbacks[invocationDescriptor.invocationId] = function (invocationEvent, error) {
                    if (error) {
                        reject(error);
                        return;
                    }
                    else if (invocationEvent) {
                        // invocationEvent will not be null when an error is not passed to the callback
                        if (invocationEvent.type === MessageType.Completion) {
                            if (invocationEvent.error) {
                                reject(new Error(invocationEvent.error));
                            }
                            else {
                                resolve(invocationEvent.result);
                            }
                        }
                        else {
                            reject(new Error("Unexpected message type: " + invocationEvent.type));
                        }
                    }
                };
                var promiseQueue = _this.sendWithProtocol(invocationDescriptor)
                    .catch(function (e) {
                    reject(e);
                    // invocationId will always have a value for a non-blocking invocation
                    delete _this.callbacks[invocationDescriptor.invocationId];
                });
                _this.launchStreams(streams, promiseQueue);
            });
            return p;
        };
        /** Registers a handler that will be invoked when the hub method with the specified method name is invoked.
         *
         * @param {string} methodName The name of the hub method to define.
         * @param {Function} newMethod The handler that will be raised when the hub method is invoked.
         */
        HubConnection.prototype.on = function (methodName, newMethod) {
            if (!methodName || !newMethod) {
                return;
            }
            methodName = methodName.toLowerCase();
            if (!this.methods[methodName]) {
                this.methods[methodName] = [];
            }
            // Preventing adding the same handler multiple times.
            if (this.methods[methodName].indexOf(newMethod) !== -1) {
                return;
            }
            this.methods[methodName].push(newMethod);
        };
        HubConnection.prototype.off = function (methodName, method) {
            if (!methodName) {
                return;
            }
            methodName = methodName.toLowerCase();
            var handlers = this.methods[methodName];
            if (!handlers) {
                return;
            }
            if (method) {
                var removeIdx = handlers.indexOf(method);
                if (removeIdx !== -1) {
                    handlers.splice(removeIdx, 1);
                    if (handlers.length === 0) {
                        delete this.methods[methodName];
                    }
                }
            }
            else {
                delete this.methods[methodName];
            }
        };
        /** Registers a handler that will be invoked when the connection is closed.
         *
         * @param {Function} callback The handler that will be invoked when the connection is closed. Optionally receives a single argument containing the error that caused the connection to close (if any).
         */
        HubConnection.prototype.onclose = function (callback) {
            if (callback) {
                this.closedCallbacks.push(callback);
            }
        };
        /** Registers a handler that will be invoked when the connection starts reconnecting.
         *
         * @param {Function} callback The handler that will be invoked when the connection starts reconnecting. Optionally receives a single argument containing the error that caused the connection to start reconnecting (if any).
         */
        HubConnection.prototype.onreconnecting = function (callback) {
            if (callback) {
                this.reconnectingCallbacks.push(callback);
            }
        };
        /** Registers a handler that will be invoked when the connection successfully reconnects.
         *
         * @param {Function} callback The handler that will be invoked when the connection successfully reconnects.
         */
        HubConnection.prototype.onreconnected = function (callback) {
            if (callback) {
                this.reconnectedCallbacks.push(callback);
            }
        };
        HubConnection.prototype.processIncomingData = function (data) {
            this.cleanupTimeout();
            if (!this.receivedHandshakeResponse) {
                data = this.processHandshakeResponse(data);
                this.receivedHandshakeResponse = true;
            }
            // Data may have all been read when processing handshake response
            if (data) {
                // Parse the messages
                var messages = this.protocol.parseMessages(data, this.logger);
                for (var _i = 0, messages_1 = messages; _i < messages_1.length; _i++) {
                    var message = messages_1[_i];
                    switch (message.type) {
                        case MessageType.Invocation:
                            this.invokeClientMethod(message);
                            break;
                        case MessageType.StreamItem:
                        case MessageType.Completion:
                            var callback = this.callbacks[message.invocationId];
                            if (callback) {
                                if (message.type === MessageType.Completion) {
                                    delete this.callbacks[message.invocationId];
                                }
                                callback(message);
                            }
                            break;
                        case MessageType.Ping:
                            // Don't care about pings
                            break;
                        case MessageType.Close:
                            this.logger.log(LogLevel.Information, "Close message received from server.");
                            var error = message.error ? new Error("Server returned an error on close: " + message.error) : undefined;
                            if (message.allowReconnect === true) {
                                // It feels wrong not to await connection.stop() here, but processIncomingData is called as part of an onreceive callback which is not async,
                                // this is already the behavior for serverTimeout(), and HttpConnection.Stop() should catch and log all possible exceptions.
                                // tslint:disable-next-line:no-floating-promises
                                this.connection.stop(error);
                            }
                            else {
                                // We cannot await stopInternal() here, but subsequent calls to stop() will await this if stopInternal() is still ongoing.
                                this.stopPromise = this.stopInternal(error);
                            }
                            break;
                        default:
                            this.logger.log(LogLevel.Warning, "Invalid message type: " + message.type + ".");
                            break;
                    }
                }
            }
            this.resetTimeoutPeriod();
        };
        HubConnection.prototype.processHandshakeResponse = function (data) {
            var _a;
            var responseMessage;
            var remainingData;
            try {
                _a = this.handshakeProtocol.parseHandshakeResponse(data), remainingData = _a[0], responseMessage = _a[1];
            }
            catch (e) {
                var message = "Error parsing handshake response: " + e;
                this.logger.log(LogLevel.Error, message);
                var error = new Error(message);
                this.handshakeRejecter(error);
                throw error;
            }
            if (responseMessage.error) {
                var message = "Server returned handshake error: " + responseMessage.error;
                this.logger.log(LogLevel.Error, message);
                var error = new Error(message);
                this.handshakeRejecter(error);
                throw error;
            }
            else {
                this.logger.log(LogLevel.Debug, "Server handshake complete.");
            }
            this.handshakeResolver();
            return remainingData;
        };
        HubConnection.prototype.resetKeepAliveInterval = function () {
            var _this = this;
            if (this.connection.features.inherentKeepAlive) {
                return;
            }
            this.cleanupPingTimer();
            this.pingServerHandle = setTimeout(function () { return __awaiter$2(_this, void 0, void 0, function () {
                return __generator$2(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!(this.connectionState === HubConnectionState.Connected)) return [3 /*break*/, 4];
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.sendMessage(this.cachedPingMessage)];
                        case 2:
                            _b.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            _b.sent();
                            // We don't care about the error. It should be seen elsewhere in the client.
                            // The connection is probably in a bad or closed state now, cleanup the timer so it stops triggering
                            this.cleanupPingTimer();
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            }); }, this.keepAliveIntervalInMilliseconds);
        };
        HubConnection.prototype.resetTimeoutPeriod = function () {
            var _this = this;
            if (!this.connection.features || !this.connection.features.inherentKeepAlive) {
                // Set the timeout timer
                this.timeoutHandle = setTimeout(function () { return _this.serverTimeout(); }, this.serverTimeoutInMilliseconds);
            }
        };
        HubConnection.prototype.serverTimeout = function () {
            // The server hasn't talked to us in a while. It doesn't like us anymore ... :(
            // Terminate the connection, but we don't need to wait on the promise. This could trigger reconnecting.
            // tslint:disable-next-line:no-floating-promises
            this.connection.stop(new Error("Server timeout elapsed without receiving a message from the server."));
        };
        HubConnection.prototype.invokeClientMethod = function (invocationMessage) {
            var _this = this;
            var methods = this.methods[invocationMessage.target.toLowerCase()];
            if (methods) {
                try {
                    methods.forEach(function (m) { return m.apply(_this, invocationMessage.arguments); });
                }
                catch (e) {
                    this.logger.log(LogLevel.Error, "A callback for the method " + invocationMessage.target.toLowerCase() + " threw error '" + e + "'.");
                }
                if (invocationMessage.invocationId) {
                    // This is not supported in v1. So we return an error to avoid blocking the server waiting for the response.
                    var message = "Server requested a response, which is not supported in this version of the client.";
                    this.logger.log(LogLevel.Error, message);
                    // We don't want to wait on the stop itself.
                    this.stopPromise = this.stopInternal(new Error(message));
                }
            }
            else {
                this.logger.log(LogLevel.Warning, "No client method with the name '" + invocationMessage.target + "' found.");
            }
        };
        HubConnection.prototype.connectionClosed = function (error) {
            this.logger.log(LogLevel.Debug, "HubConnection.connectionClosed(" + error + ") called while in state " + this.connectionState + ".");
            // Triggering this.handshakeRejecter is insufficient because it could already be resolved without the continuation having run yet.
            this.stopDuringStartError = this.stopDuringStartError || error || new Error("The underlying connection was closed before the hub handshake could complete.");
            // If the handshake is in progress, start will be waiting for the handshake promise, so we complete it.
            // If it has already completed, this should just noop.
            if (this.handshakeResolver) {
                this.handshakeResolver();
            }
            this.cancelCallbacksWithError(error || new Error("Invocation canceled due to the underlying connection being closed."));
            this.cleanupTimeout();
            this.cleanupPingTimer();
            if (this.connectionState === HubConnectionState.Disconnecting) {
                this.completeClose(error);
            }
            else if (this.connectionState === HubConnectionState.Connected && this.reconnectPolicy) {
                // tslint:disable-next-line:no-floating-promises
                this.reconnect(error);
            }
            else if (this.connectionState === HubConnectionState.Connected) {
                this.completeClose(error);
            }
            // If none of the above if conditions were true were called the HubConnection must be in either:
            // 1. The Connecting state in which case the handshakeResolver will complete it and stopDuringStartError will fail it.
            // 2. The Reconnecting state in which case the handshakeResolver will complete it and stopDuringStartError will fail the current reconnect attempt
            //    and potentially continue the reconnect() loop.
            // 3. The Disconnected state in which case we're already done.
        };
        HubConnection.prototype.completeClose = function (error) {
            var _this = this;
            if (this.connectionStarted) {
                this.connectionState = HubConnectionState.Disconnected;
                this.connectionStarted = false;
                try {
                    this.closedCallbacks.forEach(function (c) { return c.apply(_this, [error]); });
                }
                catch (e) {
                    this.logger.log(LogLevel.Error, "An onclose callback called with error '" + error + "' threw error '" + e + "'.");
                }
            }
        };
        HubConnection.prototype.reconnect = function (error) {
            return __awaiter$2(this, void 0, void 0, function () {
                var reconnectStartTime, previousReconnectAttempts, retryError, nextRetryDelay, e_4;
                var _this = this;
                return __generator$2(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            reconnectStartTime = Date.now();
                            previousReconnectAttempts = 0;
                            retryError = error !== undefined ? error : new Error("Attempting to reconnect due to a unknown error.");
                            nextRetryDelay = this.getNextRetryDelay(previousReconnectAttempts++, 0, retryError);
                            if (nextRetryDelay === null) {
                                this.logger.log(LogLevel.Debug, "Connection not reconnecting because the IRetryPolicy returned null on the first reconnect attempt.");
                                this.completeClose(error);
                                return [2 /*return*/];
                            }
                            this.connectionState = HubConnectionState.Reconnecting;
                            if (error) {
                                this.logger.log(LogLevel.Information, "Connection reconnecting because of error '" + error + "'.");
                            }
                            else {
                                this.logger.log(LogLevel.Information, "Connection reconnecting.");
                            }
                            if (this.onreconnecting) {
                                try {
                                    this.reconnectingCallbacks.forEach(function (c) { return c.apply(_this, [error]); });
                                }
                                catch (e) {
                                    this.logger.log(LogLevel.Error, "An onreconnecting callback called with error '" + error + "' threw error '" + e + "'.");
                                }
                                // Exit early if an onreconnecting callback called connection.stop().
                                if (this.connectionState !== HubConnectionState.Reconnecting) {
                                    this.logger.log(LogLevel.Debug, "Connection left the reconnecting state in onreconnecting callback. Done reconnecting.");
                                    return [2 /*return*/];
                                }
                            }
                            _a.label = 1;
                        case 1:
                            if (!(nextRetryDelay !== null)) return [3 /*break*/, 7];
                            this.logger.log(LogLevel.Information, "Reconnect attempt number " + previousReconnectAttempts + " will start in " + nextRetryDelay + " ms.");
                            return [4 /*yield*/, new Promise(function (resolve) {
                                    _this.reconnectDelayHandle = setTimeout(resolve, nextRetryDelay);
                                })];
                        case 2:
                            _a.sent();
                            this.reconnectDelayHandle = undefined;
                            if (this.connectionState !== HubConnectionState.Reconnecting) {
                                this.logger.log(LogLevel.Debug, "Connection left the reconnecting state during reconnect delay. Done reconnecting.");
                                return [2 /*return*/];
                            }
                            _a.label = 3;
                        case 3:
                            _a.trys.push([3, 5, , 6]);
                            return [4 /*yield*/, this.startInternal()];
                        case 4:
                            _a.sent();
                            this.connectionState = HubConnectionState.Connected;
                            this.logger.log(LogLevel.Information, "HubConnection reconnected successfully.");
                            if (this.onreconnected) {
                                try {
                                    this.reconnectedCallbacks.forEach(function (c) { return c.apply(_this, [_this.connection.connectionId]); });
                                }
                                catch (e) {
                                    this.logger.log(LogLevel.Error, "An onreconnected callback called with connectionId '" + this.connection.connectionId + "; threw error '" + e + "'.");
                                }
                            }
                            return [2 /*return*/];
                        case 5:
                            e_4 = _a.sent();
                            this.logger.log(LogLevel.Information, "Reconnect attempt failed because of error '" + e_4 + "'.");
                            if (this.connectionState !== HubConnectionState.Reconnecting) {
                                this.logger.log(LogLevel.Debug, "Connection left the reconnecting state during reconnect attempt. Done reconnecting.");
                                return [2 /*return*/];
                            }
                            retryError = e_4 instanceof Error ? e_4 : new Error(e_4.toString());
                            nextRetryDelay = this.getNextRetryDelay(previousReconnectAttempts++, Date.now() - reconnectStartTime, retryError);
                            return [3 /*break*/, 6];
                        case 6: return [3 /*break*/, 1];
                        case 7:
                            this.logger.log(LogLevel.Information, "Reconnect retries have been exhausted after " + (Date.now() - reconnectStartTime) + " ms and " + previousReconnectAttempts + " failed attempts. Connection disconnecting.");
                            this.completeClose();
                            return [2 /*return*/];
                    }
                });
            });
        };
        HubConnection.prototype.getNextRetryDelay = function (previousRetryCount, elapsedMilliseconds, retryReason) {
            try {
                return this.reconnectPolicy.nextRetryDelayInMilliseconds({
                    elapsedMilliseconds: elapsedMilliseconds,
                    previousRetryCount: previousRetryCount,
                    retryReason: retryReason,
                });
            }
            catch (e) {
                this.logger.log(LogLevel.Error, "IRetryPolicy.nextRetryDelayInMilliseconds(" + previousRetryCount + ", " + elapsedMilliseconds + ") threw error '" + e + "'.");
                return null;
            }
        };
        HubConnection.prototype.cancelCallbacksWithError = function (error) {
            var callbacks = this.callbacks;
            this.callbacks = {};
            Object.keys(callbacks)
                .forEach(function (key) {
                var callback = callbacks[key];
                callback(null, error);
            });
        };
        HubConnection.prototype.cleanupPingTimer = function () {
            if (this.pingServerHandle) {
                clearTimeout(this.pingServerHandle);
            }
        };
        HubConnection.prototype.cleanupTimeout = function () {
            if (this.timeoutHandle) {
                clearTimeout(this.timeoutHandle);
            }
        };
        HubConnection.prototype.createInvocation = function (methodName, args, nonblocking, streamIds) {
            if (nonblocking) {
                if (streamIds.length !== 0) {
                    return {
                        arguments: args,
                        streamIds: streamIds,
                        target: methodName,
                        type: MessageType.Invocation,
                    };
                }
                else {
                    return {
                        arguments: args,
                        target: methodName,
                        type: MessageType.Invocation,
                    };
                }
            }
            else {
                var invocationId = this.invocationId;
                this.invocationId++;
                if (streamIds.length !== 0) {
                    return {
                        arguments: args,
                        invocationId: invocationId.toString(),
                        streamIds: streamIds,
                        target: methodName,
                        type: MessageType.Invocation,
                    };
                }
                else {
                    return {
                        arguments: args,
                        invocationId: invocationId.toString(),
                        target: methodName,
                        type: MessageType.Invocation,
                    };
                }
            }
        };
        HubConnection.prototype.launchStreams = function (streams, promiseQueue) {
            var _this = this;
            if (streams.length === 0) {
                return;
            }
            // Synchronize stream data so they arrive in-order on the server
            if (!promiseQueue) {
                promiseQueue = Promise.resolve();
            }
            var _loop_1 = function (streamId) {
                streams[streamId].subscribe({
                    complete: function () {
                        promiseQueue = promiseQueue.then(function () { return _this.sendWithProtocol(_this.createCompletionMessage(streamId)); });
                    },
                    error: function (err) {
                        var message;
                        if (err instanceof Error) {
                            message = err.message;
                        }
                        else if (err && err.toString) {
                            message = err.toString();
                        }
                        else {
                            message = "Unknown error";
                        }
                        promiseQueue = promiseQueue.then(function () { return _this.sendWithProtocol(_this.createCompletionMessage(streamId, message)); });
                    },
                    next: function (item) {
                        promiseQueue = promiseQueue.then(function () { return _this.sendWithProtocol(_this.createStreamItemMessage(streamId, item)); });
                    },
                });
            };
            // We want to iterate over the keys, since the keys are the stream ids
            // tslint:disable-next-line:forin
            for (var streamId in streams) {
                _loop_1(streamId);
            }
        };
        HubConnection.prototype.replaceStreamingParams = function (args) {
            var streams = [];
            var streamIds = [];
            for (var i = 0; i < args.length; i++) {
                var argument = args[i];
                if (this.isObservable(argument)) {
                    var streamId = this.invocationId;
                    this.invocationId++;
                    // Store the stream for later use
                    streams[streamId] = argument;
                    streamIds.push(streamId.toString());
                    // remove stream from args
                    args.splice(i, 1);
                }
            }
            return [streams, streamIds];
        };
        HubConnection.prototype.isObservable = function (arg) {
            // This allows other stream implementations to just work (like rxjs)
            return arg && arg.subscribe && typeof arg.subscribe === "function";
        };
        HubConnection.prototype.createStreamInvocation = function (methodName, args, streamIds) {
            var invocationId = this.invocationId;
            this.invocationId++;
            if (streamIds.length !== 0) {
                return {
                    arguments: args,
                    invocationId: invocationId.toString(),
                    streamIds: streamIds,
                    target: methodName,
                    type: MessageType.StreamInvocation,
                };
            }
            else {
                return {
                    arguments: args,
                    invocationId: invocationId.toString(),
                    target: methodName,
                    type: MessageType.StreamInvocation,
                };
            }
        };
        HubConnection.prototype.createCancelInvocation = function (id) {
            return {
                invocationId: id,
                type: MessageType.CancelInvocation,
            };
        };
        HubConnection.prototype.createStreamItemMessage = function (id, item) {
            return {
                invocationId: id,
                item: item,
                type: MessageType.StreamItem,
            };
        };
        HubConnection.prototype.createCompletionMessage = function (id, error, result) {
            if (error) {
                return {
                    error: error,
                    invocationId: id,
                    type: MessageType.Completion,
                };
            }
            return {
                invocationId: id,
                result: result,
                type: MessageType.Completion,
            };
        };
        return HubConnection;
    }());

    // Copyright (c) .NET Foundation. All rights reserved.
    // Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
    // 0, 2, 10, 30 second delays before reconnect attempts.
    var DEFAULT_RETRY_DELAYS_IN_MILLISECONDS = [0, 2000, 10000, 30000, null];
    /** @private */
    var DefaultReconnectPolicy = /** @class */ (function () {
        function DefaultReconnectPolicy(retryDelays) {
            this.retryDelays = retryDelays !== undefined ? retryDelays.concat([null]) : DEFAULT_RETRY_DELAYS_IN_MILLISECONDS;
        }
        DefaultReconnectPolicy.prototype.nextRetryDelayInMilliseconds = function (retryContext) {
            return this.retryDelays[retryContext.previousRetryCount];
        };
        return DefaultReconnectPolicy;
    }());

    // Copyright (c) .NET Foundation. All rights reserved.
    // Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
    // This will be treated as a bit flag in the future, so we keep it using power-of-two values.
    /** Specifies a specific HTTP transport type. */
    var HttpTransportType;
    (function (HttpTransportType) {
        /** Specifies no transport preference. */
        HttpTransportType[HttpTransportType["None"] = 0] = "None";
        /** Specifies the WebSockets transport. */
        HttpTransportType[HttpTransportType["WebSockets"] = 1] = "WebSockets";
        /** Specifies the Server-Sent Events transport. */
        HttpTransportType[HttpTransportType["ServerSentEvents"] = 2] = "ServerSentEvents";
        /** Specifies the Long Polling transport. */
        HttpTransportType[HttpTransportType["LongPolling"] = 4] = "LongPolling";
    })(HttpTransportType || (HttpTransportType = {}));
    /** Specifies the transfer format for a connection. */
    var TransferFormat;
    (function (TransferFormat) {
        /** Specifies that only text data will be transmitted over the connection. */
        TransferFormat[TransferFormat["Text"] = 1] = "Text";
        /** Specifies that binary data will be transmitted over the connection. */
        TransferFormat[TransferFormat["Binary"] = 2] = "Binary";
    })(TransferFormat || (TransferFormat = {}));

    // Copyright (c) .NET Foundation. All rights reserved.
    // Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
    // Rough polyfill of https://developer.mozilla.org/en-US/docs/Web/API/AbortController
    // We don't actually ever use the API being polyfilled, we always use the polyfill because
    // it's a very new API right now.
    // Not exported from index.
    /** @private */
    var AbortController$1 = /** @class */ (function () {
        function AbortController() {
            this.isAborted = false;
            this.onabort = null;
        }
        AbortController.prototype.abort = function () {
            if (!this.isAborted) {
                this.isAborted = true;
                if (this.onabort) {
                    this.onabort();
                }
            }
        };
        Object.defineProperty(AbortController.prototype, "signal", {
            get: function () {
                return this;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AbortController.prototype, "aborted", {
            get: function () {
                return this.isAborted;
            },
            enumerable: true,
            configurable: true
        });
        return AbortController;
    }());

    // Copyright (c) .NET Foundation. All rights reserved.
    // Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
    var __assign$3 = (undefined && undefined.__assign) || Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    var __awaiter$3 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    var __generator$3 = (undefined && undefined.__generator) || function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    };
    // Not exported from 'index', this type is internal.
    /** @private */
    var LongPollingTransport = /** @class */ (function () {
        function LongPollingTransport(httpClient, accessTokenFactory, logger, logMessageContent, withCredentials, headers) {
            this.httpClient = httpClient;
            this.accessTokenFactory = accessTokenFactory;
            this.logger = logger;
            this.pollAbort = new AbortController$1();
            this.logMessageContent = logMessageContent;
            this.withCredentials = withCredentials;
            this.headers = headers;
            this.running = false;
            this.onreceive = null;
            this.onclose = null;
        }
        Object.defineProperty(LongPollingTransport.prototype, "pollAborted", {
            // This is an internal type, not exported from 'index' so this is really just internal.
            get: function () {
                return this.pollAbort.aborted;
            },
            enumerable: true,
            configurable: true
        });
        LongPollingTransport.prototype.connect = function (url, transferFormat) {
            return __awaiter$3(this, void 0, void 0, function () {
                var _a, _b, name, value, headers, pollOptions, token, pollUrl, response;
                return __generator$3(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            Arg.isRequired(url, "url");
                            Arg.isRequired(transferFormat, "transferFormat");
                            Arg.isIn(transferFormat, TransferFormat, "transferFormat");
                            this.url = url;
                            this.logger.log(LogLevel.Trace, "(LongPolling transport) Connecting.");
                            // Allow binary format on Node and Browsers that support binary content (indicated by the presence of responseType property)
                            if (transferFormat === TransferFormat.Binary &&
                                (typeof XMLHttpRequest !== "undefined" && typeof new XMLHttpRequest().responseType !== "string")) {
                                throw new Error("Binary protocols over XmlHttpRequest not implementing advanced features are not supported.");
                            }
                            _b = getUserAgentHeader(), name = _b[0], value = _b[1];
                            headers = __assign$3((_a = {}, _a[name] = value, _a), this.headers);
                            pollOptions = {
                                abortSignal: this.pollAbort.signal,
                                headers: headers,
                                timeout: 100000,
                                withCredentials: this.withCredentials,
                            };
                            if (transferFormat === TransferFormat.Binary) {
                                pollOptions.responseType = "arraybuffer";
                            }
                            return [4 /*yield*/, this.getAccessToken()];
                        case 1:
                            token = _c.sent();
                            this.updateHeaderToken(pollOptions, token);
                            pollUrl = url + "&_=" + Date.now();
                            this.logger.log(LogLevel.Trace, "(LongPolling transport) polling: " + pollUrl + ".");
                            return [4 /*yield*/, this.httpClient.get(pollUrl, pollOptions)];
                        case 2:
                            response = _c.sent();
                            if (response.statusCode !== 200) {
                                this.logger.log(LogLevel.Error, "(LongPolling transport) Unexpected response code: " + response.statusCode + ".");
                                // Mark running as false so that the poll immediately ends and runs the close logic
                                this.closeError = new HttpError(response.statusText || "", response.statusCode);
                                this.running = false;
                            }
                            else {
                                this.running = true;
                            }
                            this.receiving = this.poll(this.url, pollOptions);
                            return [2 /*return*/];
                    }
                });
            });
        };
        LongPollingTransport.prototype.getAccessToken = function () {
            return __awaiter$3(this, void 0, void 0, function () {
                return __generator$3(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.accessTokenFactory) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.accessTokenFactory()];
                        case 1: return [2 /*return*/, _a.sent()];
                        case 2: return [2 /*return*/, null];
                    }
                });
            });
        };
        LongPollingTransport.prototype.updateHeaderToken = function (request, token) {
            if (!request.headers) {
                request.headers = {};
            }
            if (token) {
                // tslint:disable-next-line:no-string-literal
                request.headers["Authorization"] = "Bearer " + token;
                return;
            }
            // tslint:disable-next-line:no-string-literal
            if (request.headers["Authorization"]) {
                // tslint:disable-next-line:no-string-literal
                delete request.headers["Authorization"];
            }
        };
        LongPollingTransport.prototype.poll = function (url, pollOptions) {
            return __awaiter$3(this, void 0, void 0, function () {
                var token, pollUrl, response, e_1;
                return __generator$3(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, , 8, 9]);
                            _a.label = 1;
                        case 1:
                            if (!this.running) return [3 /*break*/, 7];
                            return [4 /*yield*/, this.getAccessToken()];
                        case 2:
                            token = _a.sent();
                            this.updateHeaderToken(pollOptions, token);
                            _a.label = 3;
                        case 3:
                            _a.trys.push([3, 5, , 6]);
                            pollUrl = url + "&_=" + Date.now();
                            this.logger.log(LogLevel.Trace, "(LongPolling transport) polling: " + pollUrl + ".");
                            return [4 /*yield*/, this.httpClient.get(pollUrl, pollOptions)];
                        case 4:
                            response = _a.sent();
                            if (response.statusCode === 204) {
                                this.logger.log(LogLevel.Information, "(LongPolling transport) Poll terminated by server.");
                                this.running = false;
                            }
                            else if (response.statusCode !== 200) {
                                this.logger.log(LogLevel.Error, "(LongPolling transport) Unexpected response code: " + response.statusCode + ".");
                                // Unexpected status code
                                this.closeError = new HttpError(response.statusText || "", response.statusCode);
                                this.running = false;
                            }
                            else {
                                // Process the response
                                if (response.content) {
                                    this.logger.log(LogLevel.Trace, "(LongPolling transport) data received. " + getDataDetail(response.content, this.logMessageContent) + ".");
                                    if (this.onreceive) {
                                        this.onreceive(response.content);
                                    }
                                }
                                else {
                                    // This is another way timeout manifest.
                                    this.logger.log(LogLevel.Trace, "(LongPolling transport) Poll timed out, reissuing.");
                                }
                            }
                            return [3 /*break*/, 6];
                        case 5:
                            e_1 = _a.sent();
                            if (!this.running) {
                                // Log but disregard errors that occur after stopping
                                this.logger.log(LogLevel.Trace, "(LongPolling transport) Poll errored after shutdown: " + e_1.message);
                            }
                            else {
                                if (e_1 instanceof TimeoutError) {
                                    // Ignore timeouts and reissue the poll.
                                    this.logger.log(LogLevel.Trace, "(LongPolling transport) Poll timed out, reissuing.");
                                }
                                else {
                                    // Close the connection with the error as the result.
                                    this.closeError = e_1;
                                    this.running = false;
                                }
                            }
                            return [3 /*break*/, 6];
                        case 6: return [3 /*break*/, 1];
                        case 7: return [3 /*break*/, 9];
                        case 8:
                            this.logger.log(LogLevel.Trace, "(LongPolling transport) Polling complete.");
                            // We will reach here with pollAborted==false when the server returned a response causing the transport to stop.
                            // If pollAborted==true then client initiated the stop and the stop method will raise the close event after DELETE is sent.
                            if (!this.pollAborted) {
                                this.raiseOnClose();
                            }
                            return [7 /*endfinally*/];
                        case 9: return [2 /*return*/];
                    }
                });
            });
        };
        LongPollingTransport.prototype.send = function (data) {
            return __awaiter$3(this, void 0, void 0, function () {
                return __generator$3(this, function (_a) {
                    if (!this.running) {
                        return [2 /*return*/, Promise.reject(new Error("Cannot send until the transport is connected"))];
                    }
                    return [2 /*return*/, sendMessage(this.logger, "LongPolling", this.httpClient, this.url, this.accessTokenFactory, data, this.logMessageContent, this.withCredentials, this.headers)];
                });
            });
        };
        LongPollingTransport.prototype.stop = function () {
            return __awaiter$3(this, void 0, void 0, function () {
                var headers, _a, name_1, value, deleteOptions, token;
                return __generator$3(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            this.logger.log(LogLevel.Trace, "(LongPolling transport) Stopping polling.");
                            // Tell receiving loop to stop, abort any current request, and then wait for it to finish
                            this.running = false;
                            this.pollAbort.abort();
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, , 5, 6]);
                            return [4 /*yield*/, this.receiving];
                        case 2:
                            _b.sent();
                            // Send DELETE to clean up long polling on the server
                            this.logger.log(LogLevel.Trace, "(LongPolling transport) sending DELETE request to " + this.url + ".");
                            headers = {};
                            _a = getUserAgentHeader(), name_1 = _a[0], value = _a[1];
                            headers[name_1] = value;
                            deleteOptions = {
                                headers: __assign$3({}, headers, this.headers),
                                withCredentials: this.withCredentials,
                            };
                            return [4 /*yield*/, this.getAccessToken()];
                        case 3:
                            token = _b.sent();
                            this.updateHeaderToken(deleteOptions, token);
                            return [4 /*yield*/, this.httpClient.delete(this.url, deleteOptions)];
                        case 4:
                            _b.sent();
                            this.logger.log(LogLevel.Trace, "(LongPolling transport) DELETE request sent.");
                            return [3 /*break*/, 6];
                        case 5:
                            this.logger.log(LogLevel.Trace, "(LongPolling transport) Stop finished.");
                            // Raise close event here instead of in polling
                            // It needs to happen after the DELETE request is sent
                            this.raiseOnClose();
                            return [7 /*endfinally*/];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        LongPollingTransport.prototype.raiseOnClose = function () {
            if (this.onclose) {
                var logMessage = "(LongPolling transport) Firing onclose event.";
                if (this.closeError) {
                    logMessage += " Error: " + this.closeError;
                }
                this.logger.log(LogLevel.Trace, logMessage);
                this.onclose(this.closeError);
            }
        };
        return LongPollingTransport;
    }());

    // Copyright (c) .NET Foundation. All rights reserved.
    // Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
    var __assign$4 = (undefined && undefined.__assign) || Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    var __awaiter$4 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    var __generator$4 = (undefined && undefined.__generator) || function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    };
    /** @private */
    var ServerSentEventsTransport = /** @class */ (function () {
        function ServerSentEventsTransport(httpClient, accessTokenFactory, logger, logMessageContent, eventSourceConstructor, withCredentials, headers) {
            this.httpClient = httpClient;
            this.accessTokenFactory = accessTokenFactory;
            this.logger = logger;
            this.logMessageContent = logMessageContent;
            this.withCredentials = withCredentials;
            this.eventSourceConstructor = eventSourceConstructor;
            this.headers = headers;
            this.onreceive = null;
            this.onclose = null;
        }
        ServerSentEventsTransport.prototype.connect = function (url, transferFormat) {
            return __awaiter$4(this, void 0, void 0, function () {
                var token;
                var _this = this;
                return __generator$4(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            Arg.isRequired(url, "url");
                            Arg.isRequired(transferFormat, "transferFormat");
                            Arg.isIn(transferFormat, TransferFormat, "transferFormat");
                            this.logger.log(LogLevel.Trace, "(SSE transport) Connecting.");
                            // set url before accessTokenFactory because this.url is only for send and we set the auth header instead of the query string for send
                            this.url = url;
                            if (!this.accessTokenFactory) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.accessTokenFactory()];
                        case 1:
                            token = _a.sent();
                            if (token) {
                                url += (url.indexOf("?") < 0 ? "?" : "&") + ("access_token=" + encodeURIComponent(token));
                            }
                            _a.label = 2;
                        case 2: return [2 /*return*/, new Promise(function (resolve, reject) {
                                var opened = false;
                                if (transferFormat !== TransferFormat.Text) {
                                    reject(new Error("The Server-Sent Events transport only supports the 'Text' transfer format"));
                                    return;
                                }
                                var eventSource;
                                if (Platform.isBrowser || Platform.isWebWorker) {
                                    eventSource = new _this.eventSourceConstructor(url, { withCredentials: _this.withCredentials });
                                }
                                else {
                                    // Non-browser passes cookies via the dictionary
                                    var cookies = _this.httpClient.getCookieString(url);
                                    var headers = {};
                                    headers.Cookie = cookies;
                                    var _a = getUserAgentHeader(), name_1 = _a[0], value = _a[1];
                                    headers[name_1] = value;
                                    eventSource = new _this.eventSourceConstructor(url, { withCredentials: _this.withCredentials, headers: __assign$4({}, headers, _this.headers) });
                                }
                                try {
                                    eventSource.onmessage = function (e) {
                                        if (_this.onreceive) {
                                            try {
                                                _this.logger.log(LogLevel.Trace, "(SSE transport) data received. " + getDataDetail(e.data, _this.logMessageContent) + ".");
                                                _this.onreceive(e.data);
                                            }
                                            catch (error) {
                                                _this.close(error);
                                                return;
                                            }
                                        }
                                    };
                                    eventSource.onerror = function (e) {
                                        var error = new Error(e.data || "Error occurred");
                                        if (opened) {
                                            _this.close(error);
                                        }
                                        else {
                                            reject(error);
                                        }
                                    };
                                    eventSource.onopen = function () {
                                        _this.logger.log(LogLevel.Information, "SSE connected to " + _this.url);
                                        _this.eventSource = eventSource;
                                        opened = true;
                                        resolve();
                                    };
                                }
                                catch (e) {
                                    reject(e);
                                    return;
                                }
                            })];
                    }
                });
            });
        };
        ServerSentEventsTransport.prototype.send = function (data) {
            return __awaiter$4(this, void 0, void 0, function () {
                return __generator$4(this, function (_a) {
                    if (!this.eventSource) {
                        return [2 /*return*/, Promise.reject(new Error("Cannot send until the transport is connected"))];
                    }
                    return [2 /*return*/, sendMessage(this.logger, "SSE", this.httpClient, this.url, this.accessTokenFactory, data, this.logMessageContent, this.withCredentials, this.headers)];
                });
            });
        };
        ServerSentEventsTransport.prototype.stop = function () {
            this.close();
            return Promise.resolve();
        };
        ServerSentEventsTransport.prototype.close = function (e) {
            if (this.eventSource) {
                this.eventSource.close();
                this.eventSource = undefined;
                if (this.onclose) {
                    this.onclose(e);
                }
            }
        };
        return ServerSentEventsTransport;
    }());

    // Copyright (c) .NET Foundation. All rights reserved.
    // Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
    var __assign$5 = (undefined && undefined.__assign) || Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    var __awaiter$5 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    var __generator$5 = (undefined && undefined.__generator) || function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    };
    /** @private */
    var WebSocketTransport = /** @class */ (function () {
        function WebSocketTransport(httpClient, accessTokenFactory, logger, logMessageContent, webSocketConstructor, headers) {
            this.logger = logger;
            this.accessTokenFactory = accessTokenFactory;
            this.logMessageContent = logMessageContent;
            this.webSocketConstructor = webSocketConstructor;
            this.httpClient = httpClient;
            this.onreceive = null;
            this.onclose = null;
            this.headers = headers;
        }
        WebSocketTransport.prototype.connect = function (url, transferFormat) {
            return __awaiter$5(this, void 0, void 0, function () {
                var token;
                var _this = this;
                return __generator$5(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            Arg.isRequired(url, "url");
                            Arg.isRequired(transferFormat, "transferFormat");
                            Arg.isIn(transferFormat, TransferFormat, "transferFormat");
                            this.logger.log(LogLevel.Trace, "(WebSockets transport) Connecting.");
                            if (!this.accessTokenFactory) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.accessTokenFactory()];
                        case 1:
                            token = _a.sent();
                            if (token) {
                                url += (url.indexOf("?") < 0 ? "?" : "&") + ("access_token=" + encodeURIComponent(token));
                            }
                            _a.label = 2;
                        case 2: return [2 /*return*/, new Promise(function (resolve, reject) {
                                url = url.replace(/^http/, "ws");
                                var webSocket;
                                var cookies = _this.httpClient.getCookieString(url);
                                var opened = false;
                                if (Platform.isNode) {
                                    var headers = {};
                                    var _a = getUserAgentHeader(), name_1 = _a[0], value = _a[1];
                                    headers[name_1] = value;
                                    if (cookies) {
                                        headers["Cookie"] = "" + cookies;
                                    }
                                    // Only pass headers when in non-browser environments
                                    webSocket = new _this.webSocketConstructor(url, undefined, {
                                        headers: __assign$5({}, headers, _this.headers),
                                    });
                                }
                                if (!webSocket) {
                                    // Chrome is not happy with passing 'undefined' as protocol
                                    webSocket = new _this.webSocketConstructor(url);
                                }
                                if (transferFormat === TransferFormat.Binary) {
                                    webSocket.binaryType = "arraybuffer";
                                }
                                // tslint:disable-next-line:variable-name
                                webSocket.onopen = function (_event) {
                                    _this.logger.log(LogLevel.Information, "WebSocket connected to " + url + ".");
                                    _this.webSocket = webSocket;
                                    opened = true;
                                    resolve();
                                };
                                webSocket.onerror = function (event) {
                                    var error = null;
                                    // ErrorEvent is a browser only type we need to check if the type exists before using it
                                    if (typeof ErrorEvent !== "undefined" && event instanceof ErrorEvent) {
                                        error = event.error;
                                    }
                                    else {
                                        error = new Error("There was an error with the transport.");
                                    }
                                    reject(error);
                                };
                                webSocket.onmessage = function (message) {
                                    _this.logger.log(LogLevel.Trace, "(WebSockets transport) data received. " + getDataDetail(message.data, _this.logMessageContent) + ".");
                                    if (_this.onreceive) {
                                        try {
                                            _this.onreceive(message.data);
                                        }
                                        catch (error) {
                                            _this.close(error);
                                            return;
                                        }
                                    }
                                };
                                webSocket.onclose = function (event) {
                                    // Don't call close handler if connection was never established
                                    // We'll reject the connect call instead
                                    if (opened) {
                                        _this.close(event);
                                    }
                                    else {
                                        var error = null;
                                        // ErrorEvent is a browser only type we need to check if the type exists before using it
                                        if (typeof ErrorEvent !== "undefined" && event instanceof ErrorEvent) {
                                            error = event.error;
                                        }
                                        else {
                                            error = new Error("There was an error with the transport.");
                                        }
                                        reject(error);
                                    }
                                };
                            })];
                    }
                });
            });
        };
        WebSocketTransport.prototype.send = function (data) {
            if (this.webSocket && this.webSocket.readyState === this.webSocketConstructor.OPEN) {
                this.logger.log(LogLevel.Trace, "(WebSockets transport) sending data. " + getDataDetail(data, this.logMessageContent) + ".");
                this.webSocket.send(data);
                return Promise.resolve();
            }
            return Promise.reject("WebSocket is not in the OPEN state");
        };
        WebSocketTransport.prototype.stop = function () {
            if (this.webSocket) {
                // Manually invoke onclose callback inline so we know the HttpConnection was closed properly before returning
                // This also solves an issue where websocket.onclose could take 18+ seconds to trigger during network disconnects
                this.close(undefined);
            }
            return Promise.resolve();
        };
        WebSocketTransport.prototype.close = function (event) {
            // webSocket will be null if the transport did not start successfully
            if (this.webSocket) {
                // Clear websocket handlers because we are considering the socket closed now
                this.webSocket.onclose = function () { };
                this.webSocket.onmessage = function () { };
                this.webSocket.onerror = function () { };
                this.webSocket.close();
                this.webSocket = undefined;
            }
            this.logger.log(LogLevel.Trace, "(WebSockets transport) socket closed.");
            if (this.onclose) {
                if (this.isCloseEvent(event) && (event.wasClean === false || event.code !== 1000)) {
                    this.onclose(new Error("WebSocket closed with status code: " + event.code + " (" + event.reason + ")."));
                }
                else if (event instanceof Error) {
                    this.onclose(event);
                }
                else {
                    this.onclose();
                }
            }
        };
        WebSocketTransport.prototype.isCloseEvent = function (event) {
            return event && typeof event.wasClean === "boolean" && typeof event.code === "number";
        };
        return WebSocketTransport;
    }());

    // Copyright (c) .NET Foundation. All rights reserved.
    // Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
    var __assign$6 = (undefined && undefined.__assign) || Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    var __awaiter$6 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    var __generator$6 = (undefined && undefined.__generator) || function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    };
    var MAX_REDIRECTS = 100;
    /** @private */
    var HttpConnection = /** @class */ (function () {
        function HttpConnection(url, options) {
            if (options === void 0) { options = {}; }
            this.features = {};
            this.negotiateVersion = 1;
            Arg.isRequired(url, "url");
            this.logger = createLogger(options.logger);
            this.baseUrl = this.resolveUrl(url);
            options = options || {};
            options.logMessageContent = options.logMessageContent === undefined ? false : options.logMessageContent;
            if (typeof options.withCredentials === "boolean" || options.withCredentials === undefined) {
                options.withCredentials = options.withCredentials === undefined ? true : options.withCredentials;
            }
            else {
                throw new Error("withCredentials option was not a 'boolean' or 'undefined' value");
            }
            var webSocketModule = null;
            var eventSourceModule = null;
            if (Platform.isNode && typeof require !== "undefined") {
                // In order to ignore the dynamic require in webpack builds we need to do this magic
                // @ts-ignore: TS doesn't know about these names
                var requireFunc = typeof __webpack_require__ === "function" ? __non_webpack_require__ : require;
                webSocketModule = requireFunc("ws");
                eventSourceModule = requireFunc("eventsource");
            }
            if (!Platform.isNode && typeof WebSocket !== "undefined" && !options.WebSocket) {
                options.WebSocket = WebSocket;
            }
            else if (Platform.isNode && !options.WebSocket) {
                if (webSocketModule) {
                    options.WebSocket = webSocketModule;
                }
            }
            if (!Platform.isNode && typeof EventSource !== "undefined" && !options.EventSource) {
                options.EventSource = EventSource;
            }
            else if (Platform.isNode && !options.EventSource) {
                if (typeof eventSourceModule !== "undefined") {
                    options.EventSource = eventSourceModule;
                }
            }
            this.httpClient = options.httpClient || new DefaultHttpClient(this.logger);
            this.connectionState = "Disconnected" /* Disconnected */;
            this.connectionStarted = false;
            this.options = options;
            this.onreceive = null;
            this.onclose = null;
        }
        HttpConnection.prototype.start = function (transferFormat) {
            return __awaiter$6(this, void 0, void 0, function () {
                var message, message;
                return __generator$6(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            transferFormat = transferFormat || TransferFormat.Binary;
                            Arg.isIn(transferFormat, TransferFormat, "transferFormat");
                            this.logger.log(LogLevel.Debug, "Starting connection with transfer format '" + TransferFormat[transferFormat] + "'.");
                            if (this.connectionState !== "Disconnected" /* Disconnected */) {
                                return [2 /*return*/, Promise.reject(new Error("Cannot start an HttpConnection that is not in the 'Disconnected' state."))];
                            }
                            this.connectionState = "Connecting" /* Connecting */;
                            this.startInternalPromise = this.startInternal(transferFormat);
                            return [4 /*yield*/, this.startInternalPromise];
                        case 1:
                            _a.sent();
                            if (!(this.connectionState === "Disconnecting" /* Disconnecting */)) return [3 /*break*/, 3];
                            message = "Failed to start the HttpConnection before stop() was called.";
                            this.logger.log(LogLevel.Error, message);
                            // We cannot await stopPromise inside startInternal since stopInternal awaits the startInternalPromise.
                            return [4 /*yield*/, this.stopPromise];
                        case 2:
                            // We cannot await stopPromise inside startInternal since stopInternal awaits the startInternalPromise.
                            _a.sent();
                            return [2 /*return*/, Promise.reject(new Error(message))];
                        case 3:
                            if (this.connectionState !== "Connected" /* Connected */) {
                                message = "HttpConnection.startInternal completed gracefully but didn't enter the connection into the connected state!";
                                this.logger.log(LogLevel.Error, message);
                                return [2 /*return*/, Promise.reject(new Error(message))];
                            }
                            _a.label = 4;
                        case 4:
                            this.connectionStarted = true;
                            return [2 /*return*/];
                    }
                });
            });
        };
        HttpConnection.prototype.send = function (data) {
            if (this.connectionState !== "Connected" /* Connected */) {
                return Promise.reject(new Error("Cannot send data if the connection is not in the 'Connected' State."));
            }
            if (!this.sendQueue) {
                this.sendQueue = new TransportSendQueue(this.transport);
            }
            // Transport will not be null if state is connected
            return this.sendQueue.send(data);
        };
        HttpConnection.prototype.stop = function (error) {
            return __awaiter$6(this, void 0, void 0, function () {
                var _this = this;
                return __generator$6(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (this.connectionState === "Disconnected" /* Disconnected */) {
                                this.logger.log(LogLevel.Debug, "Call to HttpConnection.stop(" + error + ") ignored because the connection is already in the disconnected state.");
                                return [2 /*return*/, Promise.resolve()];
                            }
                            if (this.connectionState === "Disconnecting" /* Disconnecting */) {
                                this.logger.log(LogLevel.Debug, "Call to HttpConnection.stop(" + error + ") ignored because the connection is already in the disconnecting state.");
                                return [2 /*return*/, this.stopPromise];
                            }
                            this.connectionState = "Disconnecting" /* Disconnecting */;
                            this.stopPromise = new Promise(function (resolve) {
                                // Don't complete stop() until stopConnection() completes.
                                _this.stopPromiseResolver = resolve;
                            });
                            // stopInternal should never throw so just observe it.
                            return [4 /*yield*/, this.stopInternal(error)];
                        case 1:
                            // stopInternal should never throw so just observe it.
                            _a.sent();
                            return [4 /*yield*/, this.stopPromise];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        HttpConnection.prototype.stopInternal = function (error) {
            return __awaiter$6(this, void 0, void 0, function () {
                var e_2;
                return __generator$6(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            // Set error as soon as possible otherwise there is a race between
                            // the transport closing and providing an error and the error from a close message
                            // We would prefer the close message error.
                            this.stopError = error;
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.startInternalPromise];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 4:
                            if (!this.transport) return [3 /*break*/, 9];
                            _a.label = 5;
                        case 5:
                            _a.trys.push([5, 7, , 8]);
                            return [4 /*yield*/, this.transport.stop()];
                        case 6:
                            _a.sent();
                            return [3 /*break*/, 8];
                        case 7:
                            e_2 = _a.sent();
                            this.logger.log(LogLevel.Error, "HttpConnection.transport.stop() threw error '" + e_2 + "'.");
                            this.stopConnection();
                            return [3 /*break*/, 8];
                        case 8:
                            this.transport = undefined;
                            return [3 /*break*/, 10];
                        case 9:
                            this.logger.log(LogLevel.Debug, "HttpConnection.transport is undefined in HttpConnection.stop() because start() failed.");
                            this.stopConnection();
                            _a.label = 10;
                        case 10: return [2 /*return*/];
                    }
                });
            });
        };
        HttpConnection.prototype.startInternal = function (transferFormat) {
            return __awaiter$6(this, void 0, void 0, function () {
                var url, negotiateResponse, redirects, _loop_1, this_1, e_3;
                return __generator$6(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            url = this.baseUrl;
                            this.accessTokenFactory = this.options.accessTokenFactory;
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 12, , 13]);
                            if (!this.options.skipNegotiation) return [3 /*break*/, 5];
                            if (!(this.options.transport === HttpTransportType.WebSockets)) return [3 /*break*/, 3];
                            // No need to add a connection ID in this case
                            this.transport = this.constructTransport(HttpTransportType.WebSockets);
                            // We should just call connect directly in this case.
                            // No fallback or negotiate in this case.
                            return [4 /*yield*/, this.startTransport(url, transferFormat)];
                        case 2:
                            // We should just call connect directly in this case.
                            // No fallback or negotiate in this case.
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 3: throw new Error("Negotiation can only be skipped when using the WebSocket transport directly.");
                        case 4: return [3 /*break*/, 11];
                        case 5:
                            negotiateResponse = null;
                            redirects = 0;
                            _loop_1 = function () {
                                var accessToken_1;
                                return __generator$6(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this_1.getNegotiationResponse(url)];
                                        case 1:
                                            negotiateResponse = _a.sent();
                                            // the user tries to stop the connection when it is being started
                                            if (this_1.connectionState === "Disconnecting" /* Disconnecting */ || this_1.connectionState === "Disconnected" /* Disconnected */) {
                                                throw new Error("The connection was stopped during negotiation.");
                                            }
                                            if (negotiateResponse.error) {
                                                throw new Error(negotiateResponse.error);
                                            }
                                            if (negotiateResponse.ProtocolVersion) {
                                                throw new Error("Detected a connection attempt to an ASP.NET SignalR Server. This client only supports connecting to an ASP.NET Core SignalR Server. See https://aka.ms/signalr-core-differences for details.");
                                            }
                                            if (negotiateResponse.url) {
                                                url = negotiateResponse.url;
                                            }
                                            if (negotiateResponse.accessToken) {
                                                accessToken_1 = negotiateResponse.accessToken;
                                                this_1.accessTokenFactory = function () { return accessToken_1; };
                                            }
                                            redirects++;
                                            return [2 /*return*/];
                                    }
                                });
                            };
                            this_1 = this;
                            _a.label = 6;
                        case 6: return [5 /*yield**/, _loop_1()];
                        case 7:
                            _a.sent();
                            _a.label = 8;
                        case 8:
                            if (negotiateResponse.url && redirects < MAX_REDIRECTS) return [3 /*break*/, 6];
                            _a.label = 9;
                        case 9:
                            if (redirects === MAX_REDIRECTS && negotiateResponse.url) {
                                throw new Error("Negotiate redirection limit exceeded.");
                            }
                            return [4 /*yield*/, this.createTransport(url, this.options.transport, negotiateResponse, transferFormat)];
                        case 10:
                            _a.sent();
                            _a.label = 11;
                        case 11:
                            if (this.transport instanceof LongPollingTransport) {
                                this.features.inherentKeepAlive = true;
                            }
                            if (this.connectionState === "Connecting" /* Connecting */) {
                                // Ensure the connection transitions to the connected state prior to completing this.startInternalPromise.
                                // start() will handle the case when stop was called and startInternal exits still in the disconnecting state.
                                this.logger.log(LogLevel.Debug, "The HttpConnection connected successfully.");
                                this.connectionState = "Connected" /* Connected */;
                            }
                            return [3 /*break*/, 13];
                        case 12:
                            e_3 = _a.sent();
                            this.logger.log(LogLevel.Error, "Failed to start the connection: " + e_3);
                            this.connectionState = "Disconnected" /* Disconnected */;
                            this.transport = undefined;
                            return [2 /*return*/, Promise.reject(e_3)];
                        case 13: return [2 /*return*/];
                    }
                });
            });
        };
        HttpConnection.prototype.getNegotiationResponse = function (url) {
            return __awaiter$6(this, void 0, void 0, function () {
                var headers, token, _a, name, value, negotiateUrl, response, negotiateResponse, e_4;
                return __generator$6(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            headers = {};
                            if (!this.accessTokenFactory) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.accessTokenFactory()];
                        case 1:
                            token = _b.sent();
                            if (token) {
                                headers["Authorization"] = "Bearer " + token;
                            }
                            _b.label = 2;
                        case 2:
                            _a = getUserAgentHeader(), name = _a[0], value = _a[1];
                            headers[name] = value;
                            negotiateUrl = this.resolveNegotiateUrl(url);
                            this.logger.log(LogLevel.Debug, "Sending negotiation request: " + negotiateUrl + ".");
                            _b.label = 3;
                        case 3:
                            _b.trys.push([3, 5, , 6]);
                            return [4 /*yield*/, this.httpClient.post(negotiateUrl, {
                                    content: "",
                                    headers: __assign$6({}, headers, this.options.headers),
                                    withCredentials: this.options.withCredentials,
                                })];
                        case 4:
                            response = _b.sent();
                            if (response.statusCode !== 200) {
                                return [2 /*return*/, Promise.reject(new Error("Unexpected status code returned from negotiate '" + response.statusCode + "'"))];
                            }
                            negotiateResponse = JSON.parse(response.content);
                            if (!negotiateResponse.negotiateVersion || negotiateResponse.negotiateVersion < 1) {
                                // Negotiate version 0 doesn't use connectionToken
                                // So we set it equal to connectionId so all our logic can use connectionToken without being aware of the negotiate version
                                negotiateResponse.connectionToken = negotiateResponse.connectionId;
                            }
                            return [2 /*return*/, negotiateResponse];
                        case 5:
                            e_4 = _b.sent();
                            this.logger.log(LogLevel.Error, "Failed to complete negotiation with the server: " + e_4);
                            return [2 /*return*/, Promise.reject(e_4)];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        HttpConnection.prototype.createConnectUrl = function (url, connectionToken) {
            if (!connectionToken) {
                return url;
            }
            return url + (url.indexOf("?") === -1 ? "?" : "&") + ("id=" + connectionToken);
        };
        HttpConnection.prototype.createTransport = function (url, requestedTransport, negotiateResponse, requestedTransferFormat) {
            return __awaiter$6(this, void 0, void 0, function () {
                var connectUrl, transportExceptions, transports, negotiate, _i, transports_1, endpoint, transportOrError, ex_1, ex_2, message;
                return __generator$6(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            connectUrl = this.createConnectUrl(url, negotiateResponse.connectionToken);
                            if (!this.isITransport(requestedTransport)) return [3 /*break*/, 2];
                            this.logger.log(LogLevel.Debug, "Connection was provided an instance of ITransport, using that directly.");
                            this.transport = requestedTransport;
                            return [4 /*yield*/, this.startTransport(connectUrl, requestedTransferFormat)];
                        case 1:
                            _a.sent();
                            this.connectionId = negotiateResponse.connectionId;
                            return [2 /*return*/];
                        case 2:
                            transportExceptions = [];
                            transports = negotiateResponse.availableTransports || [];
                            negotiate = negotiateResponse;
                            _i = 0, transports_1 = transports;
                            _a.label = 3;
                        case 3:
                            if (!(_i < transports_1.length)) return [3 /*break*/, 13];
                            endpoint = transports_1[_i];
                            transportOrError = this.resolveTransportOrError(endpoint, requestedTransport, requestedTransferFormat);
                            if (!(transportOrError instanceof Error)) return [3 /*break*/, 4];
                            // Store the error and continue, we don't want to cause a re-negotiate in these cases
                            transportExceptions.push(endpoint.transport + " failed: " + transportOrError);
                            return [3 /*break*/, 12];
                        case 4:
                            if (!this.isITransport(transportOrError)) return [3 /*break*/, 12];
                            this.transport = transportOrError;
                            if (!!negotiate) return [3 /*break*/, 9];
                            _a.label = 5;
                        case 5:
                            _a.trys.push([5, 7, , 8]);
                            return [4 /*yield*/, this.getNegotiationResponse(url)];
                        case 6:
                            negotiate = _a.sent();
                            return [3 /*break*/, 8];
                        case 7:
                            ex_1 = _a.sent();
                            return [2 /*return*/, Promise.reject(ex_1)];
                        case 8:
                            connectUrl = this.createConnectUrl(url, negotiate.connectionToken);
                            _a.label = 9;
                        case 9:
                            _a.trys.push([9, 11, , 12]);
                            return [4 /*yield*/, this.startTransport(connectUrl, requestedTransferFormat)];
                        case 10:
                            _a.sent();
                            this.connectionId = negotiate.connectionId;
                            return [2 /*return*/];
                        case 11:
                            ex_2 = _a.sent();
                            this.logger.log(LogLevel.Error, "Failed to start the transport '" + endpoint.transport + "': " + ex_2);
                            negotiate = undefined;
                            transportExceptions.push(endpoint.transport + " failed: " + ex_2);
                            if (this.connectionState !== "Connecting" /* Connecting */) {
                                message = "Failed to select transport before stop() was called.";
                                this.logger.log(LogLevel.Debug, message);
                                return [2 /*return*/, Promise.reject(new Error(message))];
                            }
                            return [3 /*break*/, 12];
                        case 12:
                            _i++;
                            return [3 /*break*/, 3];
                        case 13:
                            if (transportExceptions.length > 0) {
                                return [2 /*return*/, Promise.reject(new Error("Unable to connect to the server with any of the available transports. " + transportExceptions.join(" ")))];
                            }
                            return [2 /*return*/, Promise.reject(new Error("None of the transports supported by the client are supported by the server."))];
                    }
                });
            });
        };
        HttpConnection.prototype.constructTransport = function (transport) {
            switch (transport) {
                case HttpTransportType.WebSockets:
                    if (!this.options.WebSocket) {
                        throw new Error("'WebSocket' is not supported in your environment.");
                    }
                    return new WebSocketTransport(this.httpClient, this.accessTokenFactory, this.logger, this.options.logMessageContent || false, this.options.WebSocket, this.options.headers || {});
                case HttpTransportType.ServerSentEvents:
                    if (!this.options.EventSource) {
                        throw new Error("'EventSource' is not supported in your environment.");
                    }
                    return new ServerSentEventsTransport(this.httpClient, this.accessTokenFactory, this.logger, this.options.logMessageContent || false, this.options.EventSource, this.options.withCredentials, this.options.headers || {});
                case HttpTransportType.LongPolling:
                    return new LongPollingTransport(this.httpClient, this.accessTokenFactory, this.logger, this.options.logMessageContent || false, this.options.withCredentials, this.options.headers || {});
                default:
                    throw new Error("Unknown transport: " + transport + ".");
            }
        };
        HttpConnection.prototype.startTransport = function (url, transferFormat) {
            var _this = this;
            this.transport.onreceive = this.onreceive;
            this.transport.onclose = function (e) { return _this.stopConnection(e); };
            return this.transport.connect(url, transferFormat);
        };
        HttpConnection.prototype.resolveTransportOrError = function (endpoint, requestedTransport, requestedTransferFormat) {
            var transport = HttpTransportType[endpoint.transport];
            if (transport === null || transport === undefined) {
                this.logger.log(LogLevel.Debug, "Skipping transport '" + endpoint.transport + "' because it is not supported by this client.");
                return new Error("Skipping transport '" + endpoint.transport + "' because it is not supported by this client.");
            }
            else {
                if (transportMatches(requestedTransport, transport)) {
                    var transferFormats = endpoint.transferFormats.map(function (s) { return TransferFormat[s]; });
                    if (transferFormats.indexOf(requestedTransferFormat) >= 0) {
                        if ((transport === HttpTransportType.WebSockets && !this.options.WebSocket) ||
                            (transport === HttpTransportType.ServerSentEvents && !this.options.EventSource)) {
                            this.logger.log(LogLevel.Debug, "Skipping transport '" + HttpTransportType[transport] + "' because it is not supported in your environment.'");
                            return new Error("'" + HttpTransportType[transport] + "' is not supported in your environment.");
                        }
                        else {
                            this.logger.log(LogLevel.Debug, "Selecting transport '" + HttpTransportType[transport] + "'.");
                            try {
                                return this.constructTransport(transport);
                            }
                            catch (ex) {
                                return ex;
                            }
                        }
                    }
                    else {
                        this.logger.log(LogLevel.Debug, "Skipping transport '" + HttpTransportType[transport] + "' because it does not support the requested transfer format '" + TransferFormat[requestedTransferFormat] + "'.");
                        return new Error("'" + HttpTransportType[transport] + "' does not support " + TransferFormat[requestedTransferFormat] + ".");
                    }
                }
                else {
                    this.logger.log(LogLevel.Debug, "Skipping transport '" + HttpTransportType[transport] + "' because it was disabled by the client.");
                    return new Error("'" + HttpTransportType[transport] + "' is disabled by the client.");
                }
            }
        };
        HttpConnection.prototype.isITransport = function (transport) {
            return transport && typeof (transport) === "object" && "connect" in transport;
        };
        HttpConnection.prototype.stopConnection = function (error) {
            var _this = this;
            this.logger.log(LogLevel.Debug, "HttpConnection.stopConnection(" + error + ") called while in state " + this.connectionState + ".");
            this.transport = undefined;
            // If we have a stopError, it takes precedence over the error from the transport
            error = this.stopError || error;
            this.stopError = undefined;
            if (this.connectionState === "Disconnected" /* Disconnected */) {
                this.logger.log(LogLevel.Debug, "Call to HttpConnection.stopConnection(" + error + ") was ignored because the connection is already in the disconnected state.");
                return;
            }
            if (this.connectionState === "Connecting" /* Connecting */) {
                this.logger.log(LogLevel.Warning, "Call to HttpConnection.stopConnection(" + error + ") was ignored because the connection is still in the connecting state.");
                throw new Error("HttpConnection.stopConnection(" + error + ") was called while the connection is still in the connecting state.");
            }
            if (this.connectionState === "Disconnecting" /* Disconnecting */) {
                // A call to stop() induced this call to stopConnection and needs to be completed.
                // Any stop() awaiters will be scheduled to continue after the onclose callback fires.
                this.stopPromiseResolver();
            }
            if (error) {
                this.logger.log(LogLevel.Error, "Connection disconnected with error '" + error + "'.");
            }
            else {
                this.logger.log(LogLevel.Information, "Connection disconnected.");
            }
            if (this.sendQueue) {
                this.sendQueue.stop().catch(function (e) {
                    _this.logger.log(LogLevel.Error, "TransportSendQueue.stop() threw error '" + e + "'.");
                });
                this.sendQueue = undefined;
            }
            this.connectionId = undefined;
            this.connectionState = "Disconnected" /* Disconnected */;
            if (this.connectionStarted) {
                this.connectionStarted = false;
                try {
                    if (this.onclose) {
                        this.onclose(error);
                    }
                }
                catch (e) {
                    this.logger.log(LogLevel.Error, "HttpConnection.onclose(" + error + ") threw error '" + e + "'.");
                }
            }
        };
        HttpConnection.prototype.resolveUrl = function (url) {
            // startsWith is not supported in IE
            if (url.lastIndexOf("https://", 0) === 0 || url.lastIndexOf("http://", 0) === 0) {
                return url;
            }
            if (!Platform.isBrowser || !window.document) {
                throw new Error("Cannot resolve '" + url + "'.");
            }
            // Setting the url to the href propery of an anchor tag handles normalization
            // for us. There are 3 main cases.
            // 1. Relative path normalization e.g "b" -> "http://localhost:5000/a/b"
            // 2. Absolute path normalization e.g "/a/b" -> "http://localhost:5000/a/b"
            // 3. Networkpath reference normalization e.g "//localhost:5000/a/b" -> "http://localhost:5000/a/b"
            var aTag = window.document.createElement("a");
            aTag.href = url;
            this.logger.log(LogLevel.Information, "Normalizing '" + url + "' to '" + aTag.href + "'.");
            return aTag.href;
        };
        HttpConnection.prototype.resolveNegotiateUrl = function (url) {
            var index = url.indexOf("?");
            var negotiateUrl = url.substring(0, index === -1 ? url.length : index);
            if (negotiateUrl[negotiateUrl.length - 1] !== "/") {
                negotiateUrl += "/";
            }
            negotiateUrl += "negotiate";
            negotiateUrl += index === -1 ? "" : url.substring(index);
            if (negotiateUrl.indexOf("negotiateVersion") === -1) {
                negotiateUrl += index === -1 ? "?" : "&";
                negotiateUrl += "negotiateVersion=" + this.negotiateVersion;
            }
            return negotiateUrl;
        };
        return HttpConnection;
    }());
    function transportMatches(requestedTransport, actualTransport) {
        return !requestedTransport || ((actualTransport & requestedTransport) !== 0);
    }
    /** @private */
    var TransportSendQueue = /** @class */ (function () {
        function TransportSendQueue(transport) {
            this.transport = transport;
            this.buffer = [];
            this.executing = true;
            this.sendBufferedData = new PromiseSource();
            this.transportResult = new PromiseSource();
            this.sendLoopPromise = this.sendLoop();
        }
        TransportSendQueue.prototype.send = function (data) {
            this.bufferData(data);
            if (!this.transportResult) {
                this.transportResult = new PromiseSource();
            }
            return this.transportResult.promise;
        };
        TransportSendQueue.prototype.stop = function () {
            this.executing = false;
            this.sendBufferedData.resolve();
            return this.sendLoopPromise;
        };
        TransportSendQueue.prototype.bufferData = function (data) {
            if (this.buffer.length && typeof (this.buffer[0]) !== typeof (data)) {
                throw new Error("Expected data to be of type " + typeof (this.buffer) + " but was of type " + typeof (data));
            }
            this.buffer.push(data);
            this.sendBufferedData.resolve();
        };
        TransportSendQueue.prototype.sendLoop = function () {
            return __awaiter$6(this, void 0, void 0, function () {
                var transportResult, data, error_1;
                return __generator$6(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            return [4 /*yield*/, this.sendBufferedData.promise];
                        case 1:
                            _a.sent();
                            if (!this.executing) {
                                if (this.transportResult) {
                                    this.transportResult.reject("Connection stopped.");
                                }
                                return [3 /*break*/, 6];
                            }
                            this.sendBufferedData = new PromiseSource();
                            transportResult = this.transportResult;
                            this.transportResult = undefined;
                            data = typeof (this.buffer[0]) === "string" ?
                                this.buffer.join("") :
                                TransportSendQueue.concatBuffers(this.buffer);
                            this.buffer.length = 0;
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, 4, , 5]);
                            return [4 /*yield*/, this.transport.send(data)];
                        case 3:
                            _a.sent();
                            transportResult.resolve();
                            return [3 /*break*/, 5];
                        case 4:
                            error_1 = _a.sent();
                            transportResult.reject(error_1);
                            return [3 /*break*/, 5];
                        case 5: return [3 /*break*/, 0];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        TransportSendQueue.concatBuffers = function (arrayBuffers) {
            var totalLength = arrayBuffers.map(function (b) { return b.byteLength; }).reduce(function (a, b) { return a + b; });
            var result = new Uint8Array(totalLength);
            var offset = 0;
            for (var _i = 0, arrayBuffers_1 = arrayBuffers; _i < arrayBuffers_1.length; _i++) {
                var item = arrayBuffers_1[_i];
                result.set(new Uint8Array(item), offset);
                offset += item.byteLength;
            }
            return result.buffer;
        };
        return TransportSendQueue;
    }());
    var PromiseSource = /** @class */ (function () {
        function PromiseSource() {
            var _this = this;
            this.promise = new Promise(function (resolve, reject) {
                var _a;
                return _a = [resolve, reject], _this.resolver = _a[0], _this.rejecter = _a[1], _a;
            });
        }
        PromiseSource.prototype.resolve = function () {
            this.resolver();
        };
        PromiseSource.prototype.reject = function (reason) {
            this.rejecter(reason);
        };
        return PromiseSource;
    }());

    // Copyright (c) .NET Foundation. All rights reserved.
    var JSON_HUB_PROTOCOL_NAME = "json";
    /** Implements the JSON Hub Protocol. */
    var JsonHubProtocol = /** @class */ (function () {
        function JsonHubProtocol() {
            /** @inheritDoc */
            this.name = JSON_HUB_PROTOCOL_NAME;
            /** @inheritDoc */
            this.version = 1;
            /** @inheritDoc */
            this.transferFormat = TransferFormat.Text;
        }
        /** Creates an array of {@link @microsoft/signalr.HubMessage} objects from the specified serialized representation.
         *
         * @param {string} input A string containing the serialized representation.
         * @param {ILogger} logger A logger that will be used to log messages that occur during parsing.
         */
        JsonHubProtocol.prototype.parseMessages = function (input, logger) {
            // The interface does allow "ArrayBuffer" to be passed in, but this implementation does not. So let's throw a useful error.
            if (typeof input !== "string") {
                throw new Error("Invalid input for JSON hub protocol. Expected a string.");
            }
            if (!input) {
                return [];
            }
            if (logger === null) {
                logger = NullLogger.instance;
            }
            // Parse the messages
            var messages = TextMessageFormat.parse(input);
            var hubMessages = [];
            for (var _i = 0, messages_1 = messages; _i < messages_1.length; _i++) {
                var message = messages_1[_i];
                var parsedMessage = JSON.parse(message);
                if (typeof parsedMessage.type !== "number") {
                    throw new Error("Invalid payload.");
                }
                switch (parsedMessage.type) {
                    case MessageType.Invocation:
                        this.isInvocationMessage(parsedMessage);
                        break;
                    case MessageType.StreamItem:
                        this.isStreamItemMessage(parsedMessage);
                        break;
                    case MessageType.Completion:
                        this.isCompletionMessage(parsedMessage);
                        break;
                    case MessageType.Ping:
                        // Single value, no need to validate
                        break;
                    case MessageType.Close:
                        // All optional values, no need to validate
                        break;
                    default:
                        // Future protocol changes can add message types, old clients can ignore them
                        logger.log(LogLevel.Information, "Unknown message type '" + parsedMessage.type + "' ignored.");
                        continue;
                }
                hubMessages.push(parsedMessage);
            }
            return hubMessages;
        };
        /** Writes the specified {@link @microsoft/signalr.HubMessage} to a string and returns it.
         *
         * @param {HubMessage} message The message to write.
         * @returns {string} A string containing the serialized representation of the message.
         */
        JsonHubProtocol.prototype.writeMessage = function (message) {
            return TextMessageFormat.write(JSON.stringify(message));
        };
        JsonHubProtocol.prototype.isInvocationMessage = function (message) {
            this.assertNotEmptyString(message.target, "Invalid payload for Invocation message.");
            if (message.invocationId !== undefined) {
                this.assertNotEmptyString(message.invocationId, "Invalid payload for Invocation message.");
            }
        };
        JsonHubProtocol.prototype.isStreamItemMessage = function (message) {
            this.assertNotEmptyString(message.invocationId, "Invalid payload for StreamItem message.");
            if (message.item === undefined) {
                throw new Error("Invalid payload for StreamItem message.");
            }
        };
        JsonHubProtocol.prototype.isCompletionMessage = function (message) {
            if (message.result && message.error) {
                throw new Error("Invalid payload for Completion message.");
            }
            if (!message.result && message.error) {
                this.assertNotEmptyString(message.error, "Invalid payload for Completion message.");
            }
            this.assertNotEmptyString(message.invocationId, "Invalid payload for Completion message.");
        };
        JsonHubProtocol.prototype.assertNotEmptyString = function (value, errorMessage) {
            if (typeof value !== "string" || value === "") {
                throw new Error(errorMessage);
            }
        };
        return JsonHubProtocol;
    }());

    // Copyright (c) .NET Foundation. All rights reserved.
    // Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
    var __assign$7 = (undefined && undefined.__assign) || Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    // tslint:disable:object-literal-sort-keys
    var LogLevelNameMapping = {
        trace: LogLevel.Trace,
        debug: LogLevel.Debug,
        info: LogLevel.Information,
        information: LogLevel.Information,
        warn: LogLevel.Warning,
        warning: LogLevel.Warning,
        error: LogLevel.Error,
        critical: LogLevel.Critical,
        none: LogLevel.None,
    };
    function parseLogLevel(name) {
        // Case-insensitive matching via lower-casing
        // Yes, I know case-folding is a complicated problem in Unicode, but we only support
        // the ASCII strings defined in LogLevelNameMapping anyway, so it's fine -anurse.
        var mapping = LogLevelNameMapping[name.toLowerCase()];
        if (typeof mapping !== "undefined") {
            return mapping;
        }
        else {
            throw new Error("Unknown log level: " + name);
        }
    }
    /** A builder for configuring {@link @microsoft/signalr.HubConnection} instances. */
    var HubConnectionBuilder = /** @class */ (function () {
        function HubConnectionBuilder() {
        }
        HubConnectionBuilder.prototype.configureLogging = function (logging) {
            Arg.isRequired(logging, "logging");
            if (isLogger(logging)) {
                this.logger = logging;
            }
            else if (typeof logging === "string") {
                var logLevel = parseLogLevel(logging);
                this.logger = new ConsoleLogger(logLevel);
            }
            else {
                this.logger = new ConsoleLogger(logging);
            }
            return this;
        };
        HubConnectionBuilder.prototype.withUrl = function (url, transportTypeOrOptions) {
            Arg.isRequired(url, "url");
            Arg.isNotEmpty(url, "url");
            this.url = url;
            // Flow-typing knows where it's at. Since HttpTransportType is a number and IHttpConnectionOptions is guaranteed
            // to be an object, we know (as does TypeScript) this comparison is all we need to figure out which overload was called.
            if (typeof transportTypeOrOptions === "object") {
                this.httpConnectionOptions = __assign$7({}, this.httpConnectionOptions, transportTypeOrOptions);
            }
            else {
                this.httpConnectionOptions = __assign$7({}, this.httpConnectionOptions, { transport: transportTypeOrOptions });
            }
            return this;
        };
        /** Configures the {@link @microsoft/signalr.HubConnection} to use the specified Hub Protocol.
         *
         * @param {IHubProtocol} protocol The {@link @microsoft/signalr.IHubProtocol} implementation to use.
         */
        HubConnectionBuilder.prototype.withHubProtocol = function (protocol) {
            Arg.isRequired(protocol, "protocol");
            this.protocol = protocol;
            return this;
        };
        HubConnectionBuilder.prototype.withAutomaticReconnect = function (retryDelaysOrReconnectPolicy) {
            if (this.reconnectPolicy) {
                throw new Error("A reconnectPolicy has already been set.");
            }
            if (!retryDelaysOrReconnectPolicy) {
                this.reconnectPolicy = new DefaultReconnectPolicy();
            }
            else if (Array.isArray(retryDelaysOrReconnectPolicy)) {
                this.reconnectPolicy = new DefaultReconnectPolicy(retryDelaysOrReconnectPolicy);
            }
            else {
                this.reconnectPolicy = retryDelaysOrReconnectPolicy;
            }
            return this;
        };
        /** Creates a {@link @microsoft/signalr.HubConnection} from the configuration options specified in this builder.
         *
         * @returns {HubConnection} The configured {@link @microsoft/signalr.HubConnection}.
         */
        HubConnectionBuilder.prototype.build = function () {
            // If httpConnectionOptions has a logger, use it. Otherwise, override it with the one
            // provided to configureLogger
            var httpConnectionOptions = this.httpConnectionOptions || {};
            // If it's 'null', the user **explicitly** asked for null, don't mess with it.
            if (httpConnectionOptions.logger === undefined) {
                // If our logger is undefined or null, that's OK, the HttpConnection constructor will handle it.
                httpConnectionOptions.logger = this.logger;
            }
            // Now create the connection
            if (!this.url) {
                throw new Error("The 'HubConnectionBuilder.withUrl' method must be called before building the connection.");
            }
            var connection = new HttpConnection(this.url, httpConnectionOptions);
            return HubConnection.create(connection, this.logger || NullLogger.instance, this.protocol || new JsonHubProtocol(), this.reconnectPolicy);
        };
        return HubConnectionBuilder;
    }());
    function isLogger(logger) {
        return logger.log !== undefined;
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
    class CallaUserEvent extends CallaEvent {
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

    /**
     * Removes an item at the given index from an array.
     */
    function arrayRemoveAt(arr, idx) {
        return arr.splice(idx, 1)[0];
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
                    if (options && options.once) {
                        this.removeListener(listeners, callback);
                    }
                    callback.call(this, evt);
                }
            }
            return !evt.defaultPrevented;
        }
    }
    class TypedEventBase extends EventBase {
        constructor() {
            super(...arguments);
            this.mappedCallbacks = new Map();
        }
        addEventListener(type, callback, options) {
            let mappedCallback = this.mappedCallbacks.get(callback);
            if (mappedCallback == null) {
                mappedCallback = (evt) => callback(evt);
                this.mappedCallbacks.set(callback, mappedCallback);
            }
            super.addEventListener(type, mappedCallback, options);
        }
        removeEventListener(type, callback) {
            const mappedCallback = this.mappedCallbacks.get(callback);
            if (mappedCallback) {
                super.removeEventListener(type, mappedCallback);
            }
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

    class SignalRMetadataClient extends BaseMetadataClient {
        constructor(signalRPath) {
            super(50);
            this.lastRoom = null;
            this.lastUserID = null;
            this.currentRoom = null;
            this.currentUserID = null;
            this.hub = new HubConnectionBuilder()
                .withUrl(signalRPath, HttpTransportType.WebSockets)
                .build();
            this.hub.onclose(() => {
                this.lastRoom = null;
                this.lastUserID = null;
            });
            this.hub.on("userPosed", (fromUserID, px, py, pz, fx, fy, fz, ux, uy, uz) => {
                this.dispatchEvent(new CallaUserPosedEvent(fromUserID, px, py, pz, fx, fy, fz, ux, uy, uz));
            });
            this.hub.on("userPointer", (fromUserID, name, px, py, pz, fx, fy, fz, ux, uy, uz) => {
                this.dispatchEvent(new CallaUserPointerEvent(fromUserID, name, px, py, pz, fx, fy, fz, ux, uy, uz));
            });
            this.hub.on("avatarChanged", (fromUserID, url) => {
                this.dispatchEvent(new CallaAvatarChangedEvent(fromUserID, url));
            });
            this.hub.on("emote", (fromUserID, emoji) => {
                this.dispatchEvent(new CallaEmoteEvent(fromUserID, emoji));
            });
            this.hub.on("setAvatarEmoji", (fromUserID, emoji) => {
                this.dispatchEvent(new CallaEmojiAvatarEvent(fromUserID, emoji));
            });
            this.hub.on("chat", (fromUserID, text) => {
                this.dispatchEvent(new CallaChatEvent(fromUserID, text));
            });
        }
        get metadataState() {
            switch (this.hub.state) {
                case HubConnectionState.Connected: return ConnectionState.Connected;
                case HubConnectionState.Connecting:
                case HubConnectionState.Reconnecting: return ConnectionState.Connecting;
                case HubConnectionState.Disconnected: return ConnectionState.Disconnected;
                case HubConnectionState.Disconnecting: return ConnectionState.Disconnecting;
                default: assertNever(this.hub.state);
            }
        }
        async maybeStart() {
            if (this.metadataState === ConnectionState.Connecting) {
                await waitFor(() => this.metadataState === ConnectionState.Connected);
            }
            else {
                if (this.metadataState === ConnectionState.Disconnecting) {
                    await waitFor(() => this.metadataState === ConnectionState.Disconnected);
                }
                if (this.metadataState === ConnectionState.Disconnected) {
                    await this.hub.start();
                }
            }
        }
        async maybeJoin() {
            await this.maybeStart();
            if (this.currentRoom !== this.lastRoom) {
                await this.maybeLeave();
                if (this.currentRoom && this.isConnected) {
                    this.lastRoom = this.currentRoom;
                    await this.hub.invoke("join", this.currentRoom);
                }
            }
        }
        async maybeIdentify() {
            await this.maybeJoin();
            if (this.currentUserID
                && this.currentUserID !== this.lastUserID
                && this.isConnected) {
                this.lastUserID = this.currentUserID;
                await this.hub.invoke("identify", this.currentUserID);
            }
        }
        async maybeLeave() {
            if (this.isConnected) {
                await this.hub.invoke("leave");
            }
        }
        async maybeDisconnect() {
            if (this.metadataState === ConnectionState.Disconnecting) {
                await waitFor(() => this.metadataState === ConnectionState.Disconnected);
            }
            else {
                if (this.metadataState === ConnectionState.Connecting) {
                    await waitFor(() => this.metadataState === ConnectionState.Connected);
                }
                if (this.metadataState === ConnectionState.Connected) {
                    await this.hub.stop();
                }
            }
        }
        async connect() {
            await this.maybeStart();
        }
        async join(roomName) {
            this.currentRoom = roomName;
            await this.maybeJoin();
        }
        async identify(userID) {
            this.currentUserID = userID;
            await this.maybeJoin();
            await this.maybeIdentify();
        }
        async leave() {
            await this.maybeLeave();
            this.currentUserID
                = this.lastUserID
                    = this.currentRoom
                        = this.lastRoom
                            = null;
        }
        async disconnect() {
            await this.maybeDisconnect();
            this.currentUserID
                = this.lastUserID
                    = this.currentRoom
                        = this.lastRoom
                            = null;
        }
        async callInternal(command, toUserID, ...args) {
            await this.maybeIdentify();
            if (this.isConnected) {
                await this.hub.invoke(command, toUserID, ...args);
            }
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
        dispatchEvent(evt) {
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
            return super.dispatchEvent(evt);
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
            const fwd = this.dispatchEvent.bind(this);
            this._tele.addEventListener("serverConnected", fwd);
            this._tele.addEventListener("serverDisconnected", fwd);
            this._tele.addEventListener("serverFailed", fwd);
            this._tele.addEventListener("conferenceFailed", fwd);
            this._tele.addEventListener("conferenceRestored", fwd);
            this._tele.addEventListener("audioMuteStatusChanged", fwd);
            this._tele.addEventListener("videoMuteStatusChanged", fwd);
            this._tele.addEventListener("conferenceJoined", async (evt) => {
                const user = this.audio.createLocalUser(evt.id);
                evt.pose = user.pose;
                this.dispatchEvent(evt);
                await this.setPreferredDevices();
            });
            this._tele.addEventListener("conferenceLeft", (evt) => {
                this.audio.createLocalUser(evt.id);
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
            this.leave();
            this.disconnect();
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

    var version = "1.0.0";

    console.info(`Calla v${version}.`);

    exports.BaseMetadataClient = BaseMetadataClient;
    exports.BaseTeleconferenceClient = BaseTeleconferenceClient;
    exports.Client = Calla;
    exports.DEFAULT_LOCAL_USER_ID = DEFAULT_LOCAL_USER_ID;
    exports.SignalRMetadataClient = SignalRMetadataClient;
    exports.addLogger = addLogger;
    exports.canChangeAudioOutput = canChangeAudioOutput;
    exports.version = version;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

}({}));
//# sourceMappingURL=calla.js.map
