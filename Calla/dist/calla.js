var Calla = (function (exports) {
    'use strict';

    function t(o, s, c) {
        return typeof o === s
            || o instanceof c;
    }
    function isFunction(obj) {
        return t(obj, "function", Function);
    }
    function assertNever(x, msg) {
        throw new Error((msg || "Unexpected object: ") + x);
    }

    /**
     * Indicates whether or not the current browser can change the destination device for audio output.
     **/
    const canChangeAudioOutput = isFunction(HTMLAudioElement.prototype.setSinkId);

    // Copyright (c) .NET Foundation. All rights reserved.
    // Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
    // Not exported from index
    /** @private */
    class TextMessageFormat {
        static write(output) {
            return `${output}${TextMessageFormat.RecordSeparator}`;
        }
        static parse(input) {
            if (input[input.length - 1] !== TextMessageFormat.RecordSeparator) {
                throw new Error("Message is incomplete.");
            }
            const messages = input.split(TextMessageFormat.RecordSeparator);
            messages.pop();
            return messages;
        }
    }
    TextMessageFormat.RecordSeparatorCode = 0x1e;
    TextMessageFormat.RecordSeparator = String.fromCharCode(TextMessageFormat.RecordSeparatorCode);

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
    class NullLogger {
        constructor() { }
        /** @inheritDoc */
        // tslint:disable-next-line
        log(_logLevel, _message) {
        }
    }
    /** The singleton instance of the {@link @microsoft/signalr.NullLogger}. */
    NullLogger.instance = new NullLogger();

    // Copyright (c) .NET Foundation. All rights reserved.
    // Version token that will be replaced by the prepack command
    /** The version of the SignalR client. */
    const VERSION = "0.0.0-DEV_BUILD";
    /** @private */
    class Arg {
        static isRequired(val, name) {
            if (val === null || val === undefined) {
                throw new Error(`The '${name}' argument is required.`);
            }
        }
        static isNotEmpty(val, name) {
            if (!val || val.match(/^\s*$/)) {
                throw new Error(`The '${name}' argument should not be empty.`);
            }
        }
        static isIn(val, values, name) {
            // TypeScript enums have keys for **both** the name and the value of each enum member on the type itself.
            if (!(val in values)) {
                throw new Error(`Unknown ${name} value: ${val}.`);
            }
        }
    }
    /** @private */
    class Platform {
        static get isBrowser() {
            return typeof window === "object";
        }
        static get isWebWorker() {
            return typeof self === "object" && "importScripts" in self;
        }
    }
    /** @private */
    function getDataDetail(data, includeContent) {
        let detail = "";
        if (isArrayBuffer(data)) {
            detail = `Binary data of length ${data.byteLength}`;
            if (includeContent) {
                detail += `. Content: '${formatArrayBuffer(data)}'`;
            }
        }
        else if (typeof data === "string") {
            detail = `String data of length ${data.length}`;
            if (includeContent) {
                detail += `. Content: '${data}'`;
            }
        }
        return detail;
    }
    /** @private */
    function formatArrayBuffer(data) {
        const view = new Uint8Array(data);
        // Uint8Array.map only supports returning another Uint8Array?
        let str = "";
        view.forEach((num) => {
            const pad = num < 16 ? "0" : "";
            str += `0x${pad}${num.toString(16)} `;
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
    async function sendMessage(logger, transportName, httpClient, url, accessTokenFactory, content, logMessageContent, withCredentials, defaultHeaders) {
        let headers = {};
        if (accessTokenFactory) {
            const token = await accessTokenFactory();
            if (token) {
                headers = {
                    ["Authorization"]: `Bearer ${token}`,
                };
            }
        }
        const [name, value] = getUserAgentHeader();
        headers[name] = value;
        logger.log(LogLevel.Trace, `(${transportName} transport) sending data. ${getDataDetail(content, logMessageContent)}.`);
        const responseType = isArrayBuffer(content) ? "arraybuffer" : "text";
        const response = await httpClient.post(url, {
            content,
            headers: { ...headers, ...defaultHeaders },
            responseType,
            withCredentials,
        });
        logger.log(LogLevel.Trace, `(${transportName} transport) request complete. Response status: ${response.statusCode}.`);
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
    class SubjectSubscription {
        constructor(subject, observer) {
            this.subject = subject;
            this.observer = observer;
        }
        dispose() {
            const index = this.subject.observers.indexOf(this.observer);
            if (index > -1) {
                this.subject.observers.splice(index, 1);
            }
            if (this.subject.observers.length === 0 && this.subject.cancelCallback) {
                this.subject.cancelCallback().catch((_) => { });
            }
        }
    }
    /** @private */
    class ConsoleLogger {
        constructor(minimumLogLevel) {
            this.minimumLogLevel = minimumLogLevel;
            this.outputConsole = console;
        }
        log(logLevel, message) {
            if (logLevel >= this.minimumLogLevel) {
                switch (logLevel) {
                    case LogLevel.Critical:
                    case LogLevel.Error:
                        this.outputConsole.error(`[${new Date().toISOString()}] ${LogLevel[logLevel]}: ${message}`);
                        break;
                    case LogLevel.Warning:
                        this.outputConsole.warn(`[${new Date().toISOString()}] ${LogLevel[logLevel]}: ${message}`);
                        break;
                    case LogLevel.Information:
                        this.outputConsole.info(`[${new Date().toISOString()}] ${LogLevel[logLevel]}: ${message}`);
                        break;
                    default:
                        // console.debug only goes to attached debuggers in Node, so we use console.log for Trace and Debug
                        this.outputConsole.log(`[${new Date().toISOString()}] ${LogLevel[logLevel]}: ${message}`);
                        break;
                }
            }
        }
    }
    /** @private */
    function getUserAgentHeader() {
        let userAgentHeaderName = "X-SignalR-User-Agent";
        return [userAgentHeaderName, constructUserAgent(VERSION, getOsName(), getRuntime(), getRuntimeVersion())];
    }
    /** @private */
    function constructUserAgent(version, os, runtime, runtimeVersion) {
        // Microsoft SignalR/[Version] ([Detailed Version]; [Operating System]; [Runtime]; [Runtime Version])
        let userAgent = "Microsoft SignalR/";
        const majorAndMinor = version.split(".");
        userAgent += `${majorAndMinor[0]}.${majorAndMinor[1]}`;
        userAgent += ` (${version}; `;
        if (os && os !== "") {
            userAgent += `${os}; `;
        }
        else {
            userAgent += "Unknown OS; ";
        }
        userAgent += `${runtime}`;
        if (runtimeVersion) {
            userAgent += `; ${runtimeVersion}`;
        }
        else {
            userAgent += "; Unknown Runtime Version";
        }
        userAgent += ")";
        return userAgent;
    }
    function getOsName() {
        return navigator.platform;
    }
    function getRuntimeVersion() {
        return undefined;
    }
    function getRuntime() {
        return "Browser";
    }

    // Copyright (c) .NET Foundation. All rights reserved.
    /** @private */
    class HandshakeProtocol {
        // Handshake request is always JSON
        writeHandshakeRequest(handshakeRequest) {
            return TextMessageFormat.write(JSON.stringify(handshakeRequest));
        }
        parseHandshakeResponse(data) {
            let responseMessage;
            let messageData;
            let remainingData;
            if (isArrayBuffer(data)) {
                // Format is binary but still need to read JSON text from handshake response
                const binaryData = new Uint8Array(data);
                const separatorIndex = binaryData.indexOf(TextMessageFormat.RecordSeparatorCode);
                if (separatorIndex === -1) {
                    throw new Error("Message is incomplete.");
                }
                // content before separator is handshake response
                // optional content after is additional messages
                const responseLength = separatorIndex + 1;
                messageData = String.fromCharCode.apply(null, binaryData.slice(0, responseLength));
                remainingData = (binaryData.byteLength > responseLength) ? binaryData.slice(responseLength).buffer : null;
            }
            else {
                const textData = data;
                const separatorIndex = textData.indexOf(TextMessageFormat.RecordSeparator);
                if (separatorIndex === -1) {
                    throw new Error("Message is incomplete.");
                }
                // content before separator is handshake response
                // optional content after is additional messages
                const responseLength = separatorIndex + 1;
                messageData = textData.substring(0, responseLength);
                remainingData = (textData.length > responseLength) ? textData.substring(responseLength) : null;
            }
            // At this point we should have just the single handshake message
            const messages = TextMessageFormat.parse(messageData);
            const response = JSON.parse(messages[0]);
            if (response.type) {
                throw new Error("Expected a handshake response from the server.");
            }
            responseMessage = response;
            // multiple messages could have arrived with handshake
            // return additional data to be parsed as usual, or null if all parsed
            return [remainingData, responseMessage];
        }
    }

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
    class Subject {
        constructor() {
            this.observers = [];
        }
        next(item) {
            for (const observer of this.observers) {
                observer.next(item);
            }
        }
        error(err) {
            for (const observer of this.observers) {
                if (observer.error) {
                    observer.error(err);
                }
            }
        }
        complete() {
            for (const observer of this.observers) {
                if (observer.complete) {
                    observer.complete();
                }
            }
        }
        subscribe(observer) {
            this.observers.push(observer);
            return new SubjectSubscription(this, observer);
        }
    }

    // Copyright (c) .NET Foundation. All rights reserved.
    const DEFAULT_TIMEOUT_IN_MS = 30 * 1000;
    const DEFAULT_PING_INTERVAL_IN_MS = 15 * 1000;
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
    class HubConnection {
        constructor(connection, logger, protocol, reconnectPolicy) {
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
            this.connection.onreceive = (data) => this.processIncomingData(data);
            this.connection.onclose = (error) => this.connectionClosed(error);
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
        static create(connection, logger, protocol, reconnectPolicy) {
            return new HubConnection(connection, logger, protocol, reconnectPolicy);
        }
        /** Indicates the state of the {@link HubConnection} to the server. */
        get state() {
            return this.connectionState;
        }
        /** Represents the connection id of the {@link HubConnection} on the server. The connection id will be null when the connection is either
         *  in the disconnected state or if the negotiation step was skipped.
         */
        get connectionId() {
            return this.connection ? (this.connection.connectionId || null) : null;
        }
        /** Indicates the url of the {@link HubConnection} to the server. */
        get baseUrl() {
            return this.connection.baseUrl || "";
        }
        /**
         * Sets a new url for the HubConnection. Note that the url can only be changed when the connection is in either the Disconnected or
         * Reconnecting states.
         * @param {string} url The url to connect to.
         */
        set baseUrl(url) {
            if (this.connectionState !== HubConnectionState.Disconnected && this.connectionState !== HubConnectionState.Reconnecting) {
                throw new Error("The HubConnection must be in the Disconnected or Reconnecting state to change the url.");
            }
            if (!url) {
                throw new Error("The HubConnection url must be a valid url.");
            }
            this.connection.baseUrl = url;
        }
        /** Starts the connection.
         *
         * @returns {Promise<void>} A Promise that resolves when the connection has been successfully established, or rejects with an error.
         */
        start() {
            this.startPromise = this.startWithStateTransitions();
            return this.startPromise;
        }
        async startWithStateTransitions() {
            if (this.connectionState !== HubConnectionState.Disconnected) {
                return Promise.reject(new Error("Cannot start a HubConnection that is not in the 'Disconnected' state."));
            }
            this.connectionState = HubConnectionState.Connecting;
            this.logger.log(LogLevel.Debug, "Starting HubConnection.");
            try {
                await this.startInternal();
                this.connectionState = HubConnectionState.Connected;
                this.connectionStarted = true;
                this.logger.log(LogLevel.Debug, "HubConnection connected successfully.");
            }
            catch (e) {
                this.connectionState = HubConnectionState.Disconnected;
                this.logger.log(LogLevel.Debug, `HubConnection failed to start successfully because of error '${e}'.`);
                return Promise.reject(e);
            }
        }
        async startInternal() {
            this.stopDuringStartError = undefined;
            this.receivedHandshakeResponse = false;
            // Set up the promise before any connection is (re)started otherwise it could race with received messages
            const handshakePromise = new Promise((resolve, reject) => {
                this.handshakeResolver = resolve;
                this.handshakeRejecter = reject;
            });
            await this.connection.start(this.protocol.transferFormat);
            try {
                const handshakeRequest = {
                    protocol: this.protocol.name,
                    version: this.protocol.version,
                };
                this.logger.log(LogLevel.Debug, "Sending handshake request.");
                await this.sendMessage(this.handshakeProtocol.writeHandshakeRequest(handshakeRequest));
                this.logger.log(LogLevel.Information, `Using HubProtocol '${this.protocol.name}'.`);
                // defensively cleanup timeout in case we receive a message from the server before we finish start
                this.cleanupTimeout();
                this.resetTimeoutPeriod();
                this.resetKeepAliveInterval();
                await handshakePromise;
                // It's important to check the stopDuringStartError instead of just relying on the handshakePromise
                // being rejected on close, because this continuation can run after both the handshake completed successfully
                // and the connection was closed.
                if (this.stopDuringStartError) {
                    // It's important to throw instead of returning a rejected promise, because we don't want to allow any state
                    // transitions to occur between now and the calling code observing the exceptions. Returning a rejected promise
                    // will cause the calling continuation to get scheduled to run later.
                    throw this.stopDuringStartError;
                }
            }
            catch (e) {
                this.logger.log(LogLevel.Debug, `Hub handshake failed with error '${e}' during start(). Stopping HubConnection.`);
                this.cleanupTimeout();
                this.cleanupPingTimer();
                // HttpConnection.stop() should not complete until after the onclose callback is invoked.
                // This will transition the HubConnection to the disconnected state before HttpConnection.stop() completes.
                await this.connection.stop(e);
                throw e;
            }
        }
        /** Stops the connection.
         *
         * @returns {Promise<void>} A Promise that resolves when the connection has been successfully terminated, or rejects with an error.
         */
        async stop() {
            // Capture the start promise before the connection might be restarted in an onclose callback.
            const startPromise = this.startPromise;
            this.stopPromise = this.stopInternal();
            await this.stopPromise;
            try {
                // Awaiting undefined continues immediately
                await startPromise;
            }
            catch (e) {
                // This exception is returned to the user as a rejected Promise from the start method.
            }
        }
        stopInternal(error) {
            if (this.connectionState === HubConnectionState.Disconnected) {
                this.logger.log(LogLevel.Debug, `Call to HubConnection.stop(${error}) ignored because it is already in the disconnected state.`);
                return Promise.resolve();
            }
            if (this.connectionState === HubConnectionState.Disconnecting) {
                this.logger.log(LogLevel.Debug, `Call to HttpConnection.stop(${error}) ignored because the connection is already in the disconnecting state.`);
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
        }
        /** Invokes a streaming hub method on the server using the specified name and arguments.
         *
         * @typeparam T The type of the items returned by the server.
         * @param {string} methodName The name of the server method to invoke.
         * @param {any[]} args The arguments used to invoke the server method.
         * @returns {IStreamResult<T>} An object that yields results from the server as they are received.
         */
        stream(methodName, ...args) {
            const [streams, streamIds] = this.replaceStreamingParams(args);
            const invocationDescriptor = this.createStreamInvocation(methodName, args, streamIds);
            let promiseQueue;
            const subject = new Subject();
            subject.cancelCallback = () => {
                const cancelInvocation = this.createCancelInvocation(invocationDescriptor.invocationId);
                delete this.callbacks[invocationDescriptor.invocationId];
                return promiseQueue.then(() => {
                    return this.sendWithProtocol(cancelInvocation);
                });
            };
            this.callbacks[invocationDescriptor.invocationId] = (invocationEvent, error) => {
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
                .catch((e) => {
                subject.error(e);
                delete this.callbacks[invocationDescriptor.invocationId];
            });
            this.launchStreams(streams, promiseQueue);
            return subject;
        }
        sendMessage(message) {
            this.resetKeepAliveInterval();
            return this.connection.send(message);
        }
        /**
         * Sends a js object to the server.
         * @param message The js object to serialize and send.
         */
        sendWithProtocol(message) {
            return this.sendMessage(this.protocol.writeMessage(message));
        }
        /** Invokes a hub method on the server using the specified name and arguments. Does not wait for a response from the receiver.
         *
         * The Promise returned by this method resolves when the client has sent the invocation to the server. The server may still
         * be processing the invocation.
         *
         * @param {string} methodName The name of the server method to invoke.
         * @param {any[]} args The arguments used to invoke the server method.
         * @returns {Promise<void>} A Promise that resolves when the invocation has been successfully sent, or rejects with an error.
         */
        send(methodName, ...args) {
            const [streams, streamIds] = this.replaceStreamingParams(args);
            const sendPromise = this.sendWithProtocol(this.createInvocation(methodName, args, true, streamIds));
            this.launchStreams(streams, sendPromise);
            return sendPromise;
        }
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
        invoke(methodName, ...args) {
            const [streams, streamIds] = this.replaceStreamingParams(args);
            const invocationDescriptor = this.createInvocation(methodName, args, false, streamIds);
            const p = new Promise((resolve, reject) => {
                // invocationId will always have a value for a non-blocking invocation
                this.callbacks[invocationDescriptor.invocationId] = (invocationEvent, error) => {
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
                            reject(new Error(`Unexpected message type: ${invocationEvent.type}`));
                        }
                    }
                };
                const promiseQueue = this.sendWithProtocol(invocationDescriptor)
                    .catch((e) => {
                    reject(e);
                    // invocationId will always have a value for a non-blocking invocation
                    delete this.callbacks[invocationDescriptor.invocationId];
                });
                this.launchStreams(streams, promiseQueue);
            });
            return p;
        }
        /** Registers a handler that will be invoked when the hub method with the specified method name is invoked.
         *
         * @param {string} methodName The name of the hub method to define.
         * @param {Function} newMethod The handler that will be raised when the hub method is invoked.
         */
        on(methodName, newMethod) {
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
        }
        off(methodName, method) {
            if (!methodName) {
                return;
            }
            methodName = methodName.toLowerCase();
            const handlers = this.methods[methodName];
            if (!handlers) {
                return;
            }
            if (method) {
                const removeIdx = handlers.indexOf(method);
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
        }
        /** Registers a handler that will be invoked when the connection is closed.
         *
         * @param {Function} callback The handler that will be invoked when the connection is closed. Optionally receives a single argument containing the error that caused the connection to close (if any).
         */
        onclose(callback) {
            if (callback) {
                this.closedCallbacks.push(callback);
            }
        }
        /** Registers a handler that will be invoked when the connection starts reconnecting.
         *
         * @param {Function} callback The handler that will be invoked when the connection starts reconnecting. Optionally receives a single argument containing the error that caused the connection to start reconnecting (if any).
         */
        onreconnecting(callback) {
            if (callback) {
                this.reconnectingCallbacks.push(callback);
            }
        }
        /** Registers a handler that will be invoked when the connection successfully reconnects.
         *
         * @param {Function} callback The handler that will be invoked when the connection successfully reconnects.
         */
        onreconnected(callback) {
            if (callback) {
                this.reconnectedCallbacks.push(callback);
            }
        }
        processIncomingData(data) {
            this.cleanupTimeout();
            if (!this.receivedHandshakeResponse) {
                data = this.processHandshakeResponse(data);
                this.receivedHandshakeResponse = true;
            }
            // Data may have all been read when processing handshake response
            if (data) {
                // Parse the messages
                const messages = this.protocol.parseMessages(data, this.logger);
                for (const message of messages) {
                    switch (message.type) {
                        case MessageType.Invocation:
                            this.invokeClientMethod(message);
                            break;
                        case MessageType.StreamItem:
                        case MessageType.Completion:
                            const callback = this.callbacks[message.invocationId];
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
                            const error = message.error ? new Error("Server returned an error on close: " + message.error) : undefined;
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
                            this.logger.log(LogLevel.Warning, `Invalid message type: ${message.type}.`);
                            break;
                    }
                }
            }
            this.resetTimeoutPeriod();
        }
        processHandshakeResponse(data) {
            let responseMessage;
            let remainingData;
            try {
                [remainingData, responseMessage] = this.handshakeProtocol.parseHandshakeResponse(data);
            }
            catch (e) {
                const message = "Error parsing handshake response: " + e;
                this.logger.log(LogLevel.Error, message);
                const error = new Error(message);
                this.handshakeRejecter(error);
                throw error;
            }
            if (responseMessage.error) {
                const message = "Server returned handshake error: " + responseMessage.error;
                this.logger.log(LogLevel.Error, message);
                const error = new Error(message);
                this.handshakeRejecter(error);
                throw error;
            }
            else {
                this.logger.log(LogLevel.Debug, "Server handshake complete.");
            }
            this.handshakeResolver();
            return remainingData;
        }
        resetKeepAliveInterval() {
            if (this.connection.features.inherentKeepAlive) {
                return;
            }
            this.cleanupPingTimer();
            this.pingServerHandle = setTimeout(async () => {
                if (this.connectionState === HubConnectionState.Connected) {
                    try {
                        await this.sendMessage(this.cachedPingMessage);
                    }
                    catch {
                        // We don't care about the error. It should be seen elsewhere in the client.
                        // The connection is probably in a bad or closed state now, cleanup the timer so it stops triggering
                        this.cleanupPingTimer();
                    }
                }
            }, this.keepAliveIntervalInMilliseconds);
        }
        resetTimeoutPeriod() {
            if (!this.connection.features || !this.connection.features.inherentKeepAlive) {
                // Set the timeout timer
                this.timeoutHandle = setTimeout(() => this.serverTimeout(), this.serverTimeoutInMilliseconds);
            }
        }
        serverTimeout() {
            // The server hasn't talked to us in a while. It doesn't like us anymore ... :(
            // Terminate the connection, but we don't need to wait on the promise. This could trigger reconnecting.
            // tslint:disable-next-line:no-floating-promises
            this.connection.stop(new Error("Server timeout elapsed without receiving a message from the server."));
        }
        invokeClientMethod(invocationMessage) {
            const methods = this.methods[invocationMessage.target.toLowerCase()];
            if (methods) {
                try {
                    methods.forEach((m) => m.apply(this, invocationMessage.arguments));
                }
                catch (e) {
                    this.logger.log(LogLevel.Error, `A callback for the method ${invocationMessage.target.toLowerCase()} threw error '${e}'.`);
                }
                if (invocationMessage.invocationId) {
                    // This is not supported in v1. So we return an error to avoid blocking the server waiting for the response.
                    const message = "Server requested a response, which is not supported in this version of the client.";
                    this.logger.log(LogLevel.Error, message);
                    // We don't want to wait on the stop itself.
                    this.stopPromise = this.stopInternal(new Error(message));
                }
            }
            else {
                this.logger.log(LogLevel.Warning, `No client method with the name '${invocationMessage.target}' found.`);
            }
        }
        connectionClosed(error) {
            this.logger.log(LogLevel.Debug, `HubConnection.connectionClosed(${error}) called while in state ${this.connectionState}.`);
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
        }
        completeClose(error) {
            if (this.connectionStarted) {
                this.connectionState = HubConnectionState.Disconnected;
                this.connectionStarted = false;
                try {
                    this.closedCallbacks.forEach((c) => c.apply(this, [error]));
                }
                catch (e) {
                    this.logger.log(LogLevel.Error, `An onclose callback called with error '${error}' threw error '${e}'.`);
                }
            }
        }
        async reconnect(error) {
            const reconnectStartTime = Date.now();
            let previousReconnectAttempts = 0;
            let retryError = error !== undefined ? error : new Error("Attempting to reconnect due to a unknown error.");
            let nextRetryDelay = this.getNextRetryDelay(previousReconnectAttempts++, 0, retryError);
            if (nextRetryDelay === null) {
                this.logger.log(LogLevel.Debug, "Connection not reconnecting because the IRetryPolicy returned null on the first reconnect attempt.");
                this.completeClose(error);
                return;
            }
            this.connectionState = HubConnectionState.Reconnecting;
            if (error) {
                this.logger.log(LogLevel.Information, `Connection reconnecting because of error '${error}'.`);
            }
            else {
                this.logger.log(LogLevel.Information, "Connection reconnecting.");
            }
            if (this.onreconnecting) {
                try {
                    this.reconnectingCallbacks.forEach((c) => c.apply(this, [error]));
                }
                catch (e) {
                    this.logger.log(LogLevel.Error, `An onreconnecting callback called with error '${error}' threw error '${e}'.`);
                }
                // Exit early if an onreconnecting callback called connection.stop().
                if (this.connectionState !== HubConnectionState.Reconnecting) {
                    this.logger.log(LogLevel.Debug, "Connection left the reconnecting state in onreconnecting callback. Done reconnecting.");
                    return;
                }
            }
            while (nextRetryDelay !== null) {
                this.logger.log(LogLevel.Information, `Reconnect attempt number ${previousReconnectAttempts} will start in ${nextRetryDelay} ms.`);
                await new Promise((resolve) => {
                    this.reconnectDelayHandle = setTimeout(resolve, nextRetryDelay);
                });
                this.reconnectDelayHandle = undefined;
                if (this.connectionState !== HubConnectionState.Reconnecting) {
                    this.logger.log(LogLevel.Debug, "Connection left the reconnecting state during reconnect delay. Done reconnecting.");
                    return;
                }
                try {
                    await this.startInternal();
                    this.connectionState = HubConnectionState.Connected;
                    this.logger.log(LogLevel.Information, "HubConnection reconnected successfully.");
                    if (this.onreconnected) {
                        try {
                            this.reconnectedCallbacks.forEach((c) => c.apply(this, [this.connection.connectionId]));
                        }
                        catch (e) {
                            this.logger.log(LogLevel.Error, `An onreconnected callback called with connectionId '${this.connection.connectionId}; threw error '${e}'.`);
                        }
                    }
                    return;
                }
                catch (e) {
                    this.logger.log(LogLevel.Information, `Reconnect attempt failed because of error '${e}'.`);
                    if (this.connectionState !== HubConnectionState.Reconnecting) {
                        this.logger.log(LogLevel.Debug, "Connection left the reconnecting state during reconnect attempt. Done reconnecting.");
                        return;
                    }
                    retryError = e instanceof Error ? e : new Error(e.toString());
                    nextRetryDelay = this.getNextRetryDelay(previousReconnectAttempts++, Date.now() - reconnectStartTime, retryError);
                }
            }
            this.logger.log(LogLevel.Information, `Reconnect retries have been exhausted after ${Date.now() - reconnectStartTime} ms and ${previousReconnectAttempts} failed attempts. Connection disconnecting.`);
            this.completeClose();
        }
        getNextRetryDelay(previousRetryCount, elapsedMilliseconds, retryReason) {
            try {
                return this.reconnectPolicy.nextRetryDelayInMilliseconds({
                    elapsedMilliseconds,
                    previousRetryCount,
                    retryReason,
                });
            }
            catch (e) {
                this.logger.log(LogLevel.Error, `IRetryPolicy.nextRetryDelayInMilliseconds(${previousRetryCount}, ${elapsedMilliseconds}) threw error '${e}'.`);
                return null;
            }
        }
        cancelCallbacksWithError(error) {
            const callbacks = this.callbacks;
            this.callbacks = {};
            Object.keys(callbacks)
                .forEach((key) => {
                const callback = callbacks[key];
                callback(null, error);
            });
        }
        cleanupPingTimer() {
            if (this.pingServerHandle) {
                clearTimeout(this.pingServerHandle);
            }
        }
        cleanupTimeout() {
            if (this.timeoutHandle) {
                clearTimeout(this.timeoutHandle);
            }
        }
        createInvocation(methodName, args, nonblocking, streamIds) {
            if (nonblocking) {
                if (streamIds.length !== 0) {
                    return {
                        arguments: args,
                        streamIds,
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
                const invocationId = this.invocationId;
                this.invocationId++;
                if (streamIds.length !== 0) {
                    return {
                        arguments: args,
                        invocationId: invocationId.toString(),
                        streamIds,
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
        }
        launchStreams(streams, promiseQueue) {
            if (streams.length === 0) {
                return;
            }
            // Synchronize stream data so they arrive in-order on the server
            if (!promiseQueue) {
                promiseQueue = Promise.resolve();
            }
            // We want to iterate over the keys, since the keys are the stream ids
            // tslint:disable-next-line:forin
            for (const streamId in streams) {
                streams[streamId].subscribe({
                    complete: () => {
                        promiseQueue = promiseQueue.then(() => this.sendWithProtocol(this.createCompletionMessage(streamId)));
                    },
                    error: (err) => {
                        let message;
                        if (err instanceof Error) {
                            message = err.message;
                        }
                        else if (err && err.toString) {
                            message = err.toString();
                        }
                        else {
                            message = "Unknown error";
                        }
                        promiseQueue = promiseQueue.then(() => this.sendWithProtocol(this.createCompletionMessage(streamId, message)));
                    },
                    next: (item) => {
                        promiseQueue = promiseQueue.then(() => this.sendWithProtocol(this.createStreamItemMessage(streamId, item)));
                    },
                });
            }
        }
        replaceStreamingParams(args) {
            const streams = [];
            const streamIds = [];
            for (let i = 0; i < args.length; i++) {
                const argument = args[i];
                if (this.isObservable(argument)) {
                    const streamId = this.invocationId;
                    this.invocationId++;
                    // Store the stream for later use
                    streams[streamId] = argument;
                    streamIds.push(streamId.toString());
                    // remove stream from args
                    args.splice(i, 1);
                }
            }
            return [streams, streamIds];
        }
        isObservable(arg) {
            // This allows other stream implementations to just work (like rxjs)
            return arg && arg.subscribe && typeof arg.subscribe === "function";
        }
        createStreamInvocation(methodName, args, streamIds) {
            const invocationId = this.invocationId;
            this.invocationId++;
            if (streamIds.length !== 0) {
                return {
                    arguments: args,
                    invocationId: invocationId.toString(),
                    streamIds,
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
        }
        createCancelInvocation(id) {
            return {
                invocationId: id,
                type: MessageType.CancelInvocation,
            };
        }
        createStreamItemMessage(id, item) {
            return {
                invocationId: id,
                item,
                type: MessageType.StreamItem,
            };
        }
        createCompletionMessage(id, error, result) {
            if (error) {
                return {
                    error,
                    invocationId: id,
                    type: MessageType.Completion,
                };
            }
            return {
                invocationId: id,
                result,
                type: MessageType.Completion,
            };
        }
    }

    // Copyright (c) .NET Foundation. All rights reserved.
    // Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
    // 0, 2, 10, 30 second delays before reconnect attempts.
    const DEFAULT_RETRY_DELAYS_IN_MILLISECONDS = [0, 2000, 10000, 30000, null];
    /** @private */
    class DefaultReconnectPolicy {
        constructor(retryDelays) {
            this.retryDelays = retryDelays !== undefined ? [...retryDelays, null] : DEFAULT_RETRY_DELAYS_IN_MILLISECONDS;
        }
        nextRetryDelayInMilliseconds(retryContext) {
            return this.retryDelays[retryContext.previousRetryCount];
        }
    }

    // Copyright (c) .NET Foundation. All rights reserved.
    // Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
    /** Error thrown when an HTTP request fails. */
    class HttpError extends Error {
        /** Constructs a new instance of {@link @microsoft/signalr.HttpError}.
         *
         * @param {string} errorMessage A descriptive error message.
         * @param {number} statusCode The HTTP status code represented by this error.
         */
        constructor(errorMessage, statusCode) {
            const trueProto = new.target.prototype;
            super(errorMessage);
            this.statusCode = statusCode;
            // Workaround issue in Typescript compiler
            // https://github.com/Microsoft/TypeScript/issues/13965#issuecomment-278570200
            this.__proto__ = trueProto;
        }
    }
    /** Error thrown when a timeout elapses. */
    class TimeoutError extends Error {
        /** Constructs a new instance of {@link @microsoft/signalr.TimeoutError}.
         *
         * @param {string} errorMessage A descriptive error message.
         */
        constructor(errorMessage = "A timeout occurred.") {
            const trueProto = new.target.prototype;
            super(errorMessage);
            // Workaround issue in Typescript compiler
            // https://github.com/Microsoft/TypeScript/issues/13965#issuecomment-278570200
            this.__proto__ = trueProto;
        }
    }
    /** Error thrown when an action is aborted. */
    class AbortError extends Error {
        /** Constructs a new instance of {@link AbortError}.
         *
         * @param {string} errorMessage A descriptive error message.
         */
        constructor(errorMessage = "An abort occurred.") {
            const trueProto = new.target.prototype;
            super(errorMessage);
            // Workaround issue in Typescript compiler
            // https://github.com/Microsoft/TypeScript/issues/13965#issuecomment-278570200
            this.__proto__ = trueProto;
        }
    }

    // Copyright (c) .NET Foundation. All rights reserved.
    // Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
    /** Represents an HTTP response. */
    class HttpResponse {
        constructor(statusCode, statusText, content) {
            this.statusCode = statusCode;
            this.statusText = statusText;
            this.content = content;
        }
    }
    /** Abstraction over an HTTP client.
     *
     * This class provides an abstraction over an HTTP client so that a different implementation can be provided on different platforms.
     */
    class HttpClient {
        get(url, options) {
            return this.send({
                ...options,
                method: "GET",
                url,
            });
        }
        post(url, options) {
            return this.send({
                ...options,
                method: "POST",
                url,
            });
        }
        delete(url, options) {
            return this.send({
                ...options,
                method: "DELETE",
                url,
            });
        }
    }

    // Copyright (c) .NET Foundation. All rights reserved.
    class FetchHttpClient extends HttpClient {
        constructor(logger) {
            super();
            this.logger = logger;
            if (typeof fetch === "undefined") {
                // In order to ignore the dynamic require in webpack builds we need to do this magic
                // @ts-ignore: TS doesn't know about these names
                const requireFunc = typeof __webpack_require__ === "function" ? __non_webpack_require__ : require;
                // Cookies aren't automatically handled in Node so we need to add a CookieJar to preserve cookies across requests
                this.jar = new (requireFunc("tough-cookie")).CookieJar();
                this.fetchType = requireFunc("node-fetch");
                // node-fetch doesn't have a nice API for getting and setting cookies
                // fetch-cookie will wrap a fetch implementation with a default CookieJar or a provided one
                this.fetchType = requireFunc("fetch-cookie")(this.fetchType, this.jar);
                // Node needs EventListener methods on AbortController which our custom polyfill doesn't provide
                this.abortControllerType = requireFunc("abort-controller");
            }
            else {
                this.fetchType = fetch.bind(self);
                this.abortControllerType = AbortController;
            }
        }
        /** @inheritDoc */
        async send(request) {
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
            const abortController = new this.abortControllerType();
            let error;
            // Hook our abortSignal into the abort controller
            if (request.abortSignal) {
                request.abortSignal.onabort = () => {
                    abortController.abort();
                    error = new AbortError();
                };
            }
            // If a timeout has been passed in, setup a timeout to call abort
            // Type needs to be any to fit window.setTimeout and NodeJS.setTimeout
            let timeoutId = null;
            if (request.timeout) {
                const msTimeout = request.timeout;
                timeoutId = setTimeout(() => {
                    abortController.abort();
                    this.logger.log(LogLevel.Warning, `Timeout from HTTP request.`);
                    error = new TimeoutError();
                }, msTimeout);
            }
            let response;
            try {
                response = await this.fetchType(request.url, {
                    body: request.content,
                    cache: "no-cache",
                    credentials: request.withCredentials === true ? "include" : "same-origin",
                    headers: {
                        "Content-Type": "text/plain;charset=UTF-8",
                        "X-Requested-With": "XMLHttpRequest",
                        ...request.headers,
                    },
                    method: request.method,
                    mode: "cors",
                    redirect: "manual",
                    signal: abortController.signal,
                });
            }
            catch (e) {
                if (error) {
                    throw error;
                }
                this.logger.log(LogLevel.Warning, `Error from HTTP request. ${e}.`);
                throw e;
            }
            finally {
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }
                if (request.abortSignal) {
                    request.abortSignal.onabort = null;
                }
            }
            if (!response.ok) {
                throw new HttpError(response.statusText, response.status);
            }
            const content = deserializeContent(response, request.responseType);
            const payload = await content;
            return new HttpResponse(response.status, response.statusText, payload);
        }
    }
    function deserializeContent(response, responseType) {
        let content;
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
                throw new Error(`${responseType} is not supported.`);
            default:
                content = response.text();
                break;
        }
        return content;
    }

    // Copyright (c) .NET Foundation. All rights reserved.
    class XhrHttpClient extends HttpClient {
        constructor(logger) {
            super();
            this.logger = logger;
        }
        /** @inheritDoc */
        send(request) {
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
            return new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open(request.method, request.url, true);
                xhr.withCredentials = request.withCredentials === undefined ? true : request.withCredentials;
                xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                // Explicitly setting the Content-Type header for React Native on Android platform.
                xhr.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
                const headers = request.headers;
                if (headers) {
                    Object.keys(headers)
                        .forEach((header) => {
                        xhr.setRequestHeader(header, headers[header]);
                    });
                }
                if (request.responseType) {
                    xhr.responseType = request.responseType;
                }
                if (request.abortSignal) {
                    request.abortSignal.onabort = () => {
                        xhr.abort();
                        reject(new AbortError());
                    };
                }
                if (request.timeout) {
                    xhr.timeout = request.timeout;
                }
                xhr.onload = () => {
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
                xhr.onerror = () => {
                    this.logger.log(LogLevel.Warning, `Error from HTTP request. ${xhr.status}: ${xhr.statusText}.`);
                    reject(new HttpError(xhr.statusText, xhr.status));
                };
                xhr.ontimeout = () => {
                    this.logger.log(LogLevel.Warning, `Timeout from HTTP request.`);
                    reject(new TimeoutError());
                };
                xhr.send(request.content || "");
            });
        }
    }

    // Copyright (c) .NET Foundation. All rights reserved.
    /** Default implementation of {@link @microsoft/signalr.HttpClient}. */
    class DefaultHttpClient extends HttpClient {
        /** Creates a new instance of the {@link @microsoft/signalr.DefaultHttpClient}, using the provided {@link @microsoft/signalr.ILogger} to log messages. */
        constructor(logger) {
            super();
            if (typeof fetch !== "undefined") {
                this.httpClient = new FetchHttpClient(logger);
            }
            else if (typeof XMLHttpRequest !== "undefined") {
                this.httpClient = new XhrHttpClient(logger);
            }
            else {
                throw new Error("No usable HttpClient found.");
            }
        }
        /** @inheritDoc */
        send(request) {
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
        }
    }

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
    class AbortController$1 {
        constructor() {
            this.isAborted = false;
            this.onabort = null;
        }
        abort() {
            if (!this.isAborted) {
                this.isAborted = true;
                if (this.onabort) {
                    this.onabort();
                }
            }
        }
        get signal() {
            return this;
        }
        get aborted() {
            return this.isAborted;
        }
    }

    // Copyright (c) .NET Foundation. All rights reserved.
    // Not exported from 'index', this type is internal.
    /** @private */
    class LongPollingTransport {
        constructor(httpClient, accessTokenFactory, logger, logMessageContent, withCredentials, headers) {
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
        // This is an internal type, not exported from 'index' so this is really just internal.
        get pollAborted() {
            return this.pollAbort.aborted;
        }
        async connect(url, transferFormat) {
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
            const [name, value] = getUserAgentHeader();
            const headers = { [name]: value, ...this.headers };
            const pollOptions = {
                abortSignal: this.pollAbort.signal,
                headers,
                timeout: 100000,
                withCredentials: this.withCredentials,
            };
            if (transferFormat === TransferFormat.Binary) {
                pollOptions.responseType = "arraybuffer";
            }
            const token = await this.getAccessToken();
            this.updateHeaderToken(pollOptions, token);
            // Make initial long polling request
            // Server uses first long polling request to finish initializing connection and it returns without data
            const pollUrl = `${url}&_=${Date.now()}`;
            this.logger.log(LogLevel.Trace, `(LongPolling transport) polling: ${pollUrl}.`);
            const response = await this.httpClient.get(pollUrl, pollOptions);
            if (response.statusCode !== 200) {
                this.logger.log(LogLevel.Error, `(LongPolling transport) Unexpected response code: ${response.statusCode}.`);
                // Mark running as false so that the poll immediately ends and runs the close logic
                this.closeError = new HttpError(response.statusText || "", response.statusCode);
                this.running = false;
            }
            else {
                this.running = true;
            }
            this.receiving = this.poll(this.url, pollOptions);
        }
        async getAccessToken() {
            if (this.accessTokenFactory) {
                return await this.accessTokenFactory();
            }
            return null;
        }
        updateHeaderToken(request, token) {
            if (!request.headers) {
                request.headers = {};
            }
            if (token) {
                // tslint:disable-next-line:no-string-literal
                request.headers["Authorization"] = `Bearer ${token}`;
                return;
            }
            // tslint:disable-next-line:no-string-literal
            if (request.headers["Authorization"]) {
                // tslint:disable-next-line:no-string-literal
                delete request.headers["Authorization"];
            }
        }
        async poll(url, pollOptions) {
            try {
                while (this.running) {
                    // We have to get the access token on each poll, in case it changes
                    const token = await this.getAccessToken();
                    this.updateHeaderToken(pollOptions, token);
                    try {
                        const pollUrl = `${url}&_=${Date.now()}`;
                        this.logger.log(LogLevel.Trace, `(LongPolling transport) polling: ${pollUrl}.`);
                        const response = await this.httpClient.get(pollUrl, pollOptions);
                        if (response.statusCode === 204) {
                            this.logger.log(LogLevel.Information, "(LongPolling transport) Poll terminated by server.");
                            this.running = false;
                        }
                        else if (response.statusCode !== 200) {
                            this.logger.log(LogLevel.Error, `(LongPolling transport) Unexpected response code: ${response.statusCode}.`);
                            // Unexpected status code
                            this.closeError = new HttpError(response.statusText || "", response.statusCode);
                            this.running = false;
                        }
                        else {
                            // Process the response
                            if (response.content) {
                                this.logger.log(LogLevel.Trace, `(LongPolling transport) data received. ${getDataDetail(response.content, this.logMessageContent)}.`);
                                if (this.onreceive) {
                                    this.onreceive(response.content);
                                }
                            }
                            else {
                                // This is another way timeout manifest.
                                this.logger.log(LogLevel.Trace, "(LongPolling transport) Poll timed out, reissuing.");
                            }
                        }
                    }
                    catch (e) {
                        if (!this.running) {
                            // Log but disregard errors that occur after stopping
                            this.logger.log(LogLevel.Trace, `(LongPolling transport) Poll errored after shutdown: ${e.message}`);
                        }
                        else {
                            if (e instanceof TimeoutError) {
                                // Ignore timeouts and reissue the poll.
                                this.logger.log(LogLevel.Trace, "(LongPolling transport) Poll timed out, reissuing.");
                            }
                            else {
                                // Close the connection with the error as the result.
                                this.closeError = e;
                                this.running = false;
                            }
                        }
                    }
                }
            }
            finally {
                this.logger.log(LogLevel.Trace, "(LongPolling transport) Polling complete.");
                // We will reach here with pollAborted==false when the server returned a response causing the transport to stop.
                // If pollAborted==true then client initiated the stop and the stop method will raise the close event after DELETE is sent.
                if (!this.pollAborted) {
                    this.raiseOnClose();
                }
            }
        }
        async send(data) {
            if (!this.running) {
                return Promise.reject(new Error("Cannot send until the transport is connected"));
            }
            return sendMessage(this.logger, "LongPolling", this.httpClient, this.url, this.accessTokenFactory, data, this.logMessageContent, this.withCredentials, this.headers);
        }
        async stop() {
            this.logger.log(LogLevel.Trace, "(LongPolling transport) Stopping polling.");
            // Tell receiving loop to stop, abort any current request, and then wait for it to finish
            this.running = false;
            this.pollAbort.abort();
            try {
                await this.receiving;
                // Send DELETE to clean up long polling on the server
                this.logger.log(LogLevel.Trace, `(LongPolling transport) sending DELETE request to ${this.url}.`);
                const headers = {};
                const [name, value] = getUserAgentHeader();
                headers[name] = value;
                const deleteOptions = {
                    headers: { ...headers, ...this.headers },
                    withCredentials: this.withCredentials,
                };
                const token = await this.getAccessToken();
                this.updateHeaderToken(deleteOptions, token);
                await this.httpClient.delete(this.url, deleteOptions);
                this.logger.log(LogLevel.Trace, "(LongPolling transport) DELETE request sent.");
            }
            finally {
                this.logger.log(LogLevel.Trace, "(LongPolling transport) Stop finished.");
                // Raise close event here instead of in polling
                // It needs to happen after the DELETE request is sent
                this.raiseOnClose();
            }
        }
        raiseOnClose() {
            if (this.onclose) {
                let logMessage = "(LongPolling transport) Firing onclose event.";
                if (this.closeError) {
                    logMessage += " Error: " + this.closeError;
                }
                this.logger.log(LogLevel.Trace, logMessage);
                this.onclose(this.closeError);
            }
        }
    }

    // Copyright (c) .NET Foundation. All rights reserved.
    /** @private */
    class ServerSentEventsTransport {
        constructor(httpClient, accessTokenFactory, logger, logMessageContent, eventSourceConstructor, withCredentials, headers) {
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
        async connect(url, transferFormat) {
            Arg.isRequired(url, "url");
            Arg.isRequired(transferFormat, "transferFormat");
            Arg.isIn(transferFormat, TransferFormat, "transferFormat");
            this.logger.log(LogLevel.Trace, "(SSE transport) Connecting.");
            // set url before accessTokenFactory because this.url is only for send and we set the auth header instead of the query string for send
            this.url = url;
            if (this.accessTokenFactory) {
                const token = await this.accessTokenFactory();
                if (token) {
                    url += (url.indexOf("?") < 0 ? "?" : "&") + `access_token=${encodeURIComponent(token)}`;
                }
            }
            return new Promise((resolve, reject) => {
                let opened = false;
                if (transferFormat !== TransferFormat.Text) {
                    reject(new Error("The Server-Sent Events transport only supports the 'Text' transfer format"));
                    return;
                }
                let eventSource;
                if (Platform.isBrowser || Platform.isWebWorker) {
                    eventSource = new this.eventSourceConstructor(url, { withCredentials: this.withCredentials });
                }
                else {
                    // Non-browser passes cookies via the dictionary
                    const headers = {};
                    const [name, value] = getUserAgentHeader();
                    headers[name] = value;
                    eventSource = new this.eventSourceConstructor(url, { withCredentials: this.withCredentials, headers: { ...headers, ...this.headers } });
                }
                try {
                    eventSource.onmessage = (e) => {
                        if (this.onreceive) {
                            try {
                                this.logger.log(LogLevel.Trace, `(SSE transport) data received. ${getDataDetail(e.data, this.logMessageContent)}.`);
                                this.onreceive(e.data);
                            }
                            catch (error) {
                                this.close(error);
                                return;
                            }
                        }
                    };
                    eventSource.onerror = (e) => {
                        const error = new Error(e.data || "Error occurred");
                        if (opened) {
                            this.close(error);
                        }
                        else {
                            reject(error);
                        }
                    };
                    eventSource.onopen = () => {
                        this.logger.log(LogLevel.Information, `SSE connected to ${this.url}`);
                        this.eventSource = eventSource;
                        opened = true;
                        resolve();
                    };
                }
                catch (e) {
                    reject(e);
                    return;
                }
            });
        }
        async send(data) {
            if (!this.eventSource) {
                return Promise.reject(new Error("Cannot send until the transport is connected"));
            }
            return sendMessage(this.logger, "SSE", this.httpClient, this.url, this.accessTokenFactory, data, this.logMessageContent, this.withCredentials, this.headers);
        }
        stop() {
            this.close();
            return Promise.resolve();
        }
        close(e) {
            if (this.eventSource) {
                this.eventSource.close();
                this.eventSource = undefined;
                if (this.onclose) {
                    this.onclose(e);
                }
            }
        }
    }

    // Copyright (c) .NET Foundation. All rights reserved.
    /** @private */
    class WebSocketTransport {
        constructor(accessTokenFactory, logger, logMessageContent, webSocketConstructor) {
            this.logger = logger;
            this.accessTokenFactory = accessTokenFactory;
            this.logMessageContent = logMessageContent;
            this.webSocketConstructor = webSocketConstructor;
            this.onreceive = null;
            this.onclose = null;
        }
        async connect(url, transferFormat) {
            Arg.isRequired(url, "url");
            Arg.isRequired(transferFormat, "transferFormat");
            Arg.isIn(transferFormat, TransferFormat, "transferFormat");
            this.logger.log(LogLevel.Trace, "(WebSockets transport) Connecting.");
            if (this.accessTokenFactory) {
                const token = await this.accessTokenFactory();
                if (token) {
                    url += (url.indexOf("?") < 0 ? "?" : "&") + `access_token=${encodeURIComponent(token)}`;
                }
            }
            return new Promise((resolve, reject) => {
                url = url.replace(/^http/, "ws");
                let webSocket;
                let opened = false;
                if (!webSocket) {
                    // Chrome is not happy with passing 'undefined' as protocol
                    webSocket = new this.webSocketConstructor(url);
                }
                if (transferFormat === TransferFormat.Binary) {
                    webSocket.binaryType = "arraybuffer";
                }
                // tslint:disable-next-line:variable-name
                webSocket.onopen = (_event) => {
                    this.logger.log(LogLevel.Information, `WebSocket connected to ${url}.`);
                    this.webSocket = webSocket;
                    opened = true;
                    resolve();
                };
                webSocket.onerror = (event) => {
                    let error = null;
                    // ErrorEvent is a browser only type we need to check if the type exists before using it
                    if (typeof ErrorEvent !== "undefined" && event instanceof ErrorEvent) {
                        error = event.error;
                    }
                    else {
                        error = new Error("There was an error with the transport.");
                    }
                    reject(error);
                };
                webSocket.onmessage = (message) => {
                    this.logger.log(LogLevel.Trace, `(WebSockets transport) data received. ${getDataDetail(message.data, this.logMessageContent)}.`);
                    if (this.onreceive) {
                        try {
                            this.onreceive(message.data);
                        }
                        catch (error) {
                            this.close(error);
                            return;
                        }
                    }
                };
                webSocket.onclose = (event) => {
                    // Don't call close handler if connection was never established
                    // We'll reject the connect call instead
                    if (opened) {
                        this.close(event);
                    }
                    else {
                        let error = null;
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
            });
        }
        send(data) {
            if (this.webSocket && this.webSocket.readyState === this.webSocketConstructor.OPEN) {
                this.logger.log(LogLevel.Trace, `(WebSockets transport) sending data. ${getDataDetail(data, this.logMessageContent)}.`);
                this.webSocket.send(data);
                return Promise.resolve();
            }
            return Promise.reject("WebSocket is not in the OPEN state");
        }
        stop() {
            if (this.webSocket) {
                // Manually invoke onclose callback inline so we know the HttpConnection was closed properly before returning
                // This also solves an issue where websocket.onclose could take 18+ seconds to trigger during network disconnects
                this.close(undefined);
            }
            return Promise.resolve();
        }
        close(event) {
            // webSocket will be null if the transport did not start successfully
            if (this.webSocket) {
                // Clear websocket handlers because we are considering the socket closed now
                this.webSocket.onclose = () => { };
                this.webSocket.onmessage = () => { };
                this.webSocket.onerror = () => { };
                this.webSocket.close();
                this.webSocket = undefined;
            }
            this.logger.log(LogLevel.Trace, "(WebSockets transport) socket closed.");
            if (this.onclose) {
                if (this.isCloseEvent(event) && (event.wasClean === false || event.code !== 1000)) {
                    this.onclose(new Error(`WebSocket closed with status code: ${event.code} (${event.reason}).`));
                }
                else if (event instanceof Error) {
                    this.onclose(event);
                }
                else {
                    this.onclose();
                }
            }
        }
        isCloseEvent(event) {
            return event && typeof event.wasClean === "boolean" && typeof event.code === "number";
        }
    }

    // Copyright (c) .NET Foundation. All rights reserved.
    const MAX_REDIRECTS = 100;
    /** @private */
    class HttpConnection {
        constructor(url, options = {}) {
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
            if (typeof WebSocket !== "undefined" && !options.WebSocket) {
                options.WebSocket = WebSocket;
            }
            if (typeof EventSource !== "undefined" && !options.EventSource) {
                options.EventSource = EventSource;
            }
            this.httpClient = options.httpClient || new DefaultHttpClient(this.logger);
            this.connectionState = "Disconnected" /* Disconnected */;
            this.connectionStarted = false;
            this.options = options;
            this.onreceive = null;
            this.onclose = null;
        }
        async start(transferFormat) {
            transferFormat = transferFormat || TransferFormat.Binary;
            Arg.isIn(transferFormat, TransferFormat, "transferFormat");
            this.logger.log(LogLevel.Debug, `Starting connection with transfer format '${TransferFormat[transferFormat]}'.`);
            if (this.connectionState !== "Disconnected" /* Disconnected */) {
                return Promise.reject(new Error("Cannot start an HttpConnection that is not in the 'Disconnected' state."));
            }
            this.connectionState = "Connecting" /* Connecting */;
            this.startInternalPromise = this.startInternal(transferFormat);
            await this.startInternalPromise;
            // The TypeScript compiler thinks that connectionState must be Connecting here. The TypeScript compiler is wrong.
            if (this.connectionState === "Disconnecting" /* Disconnecting */) {
                // stop() was called and transitioned the client into the Disconnecting state.
                const message = "Failed to start the HttpConnection before stop() was called.";
                this.logger.log(LogLevel.Error, message);
                // We cannot await stopPromise inside startInternal since stopInternal awaits the startInternalPromise.
                await this.stopPromise;
                return Promise.reject(new Error(message));
            }
            else if (this.connectionState !== "Connected" /* Connected */) {
                // stop() was called and transitioned the client into the Disconnecting state.
                const message = "HttpConnection.startInternal completed gracefully but didn't enter the connection into the connected state!";
                this.logger.log(LogLevel.Error, message);
                return Promise.reject(new Error(message));
            }
            this.connectionStarted = true;
        }
        send(data) {
            if (this.connectionState !== "Connected" /* Connected */) {
                return Promise.reject(new Error("Cannot send data if the connection is not in the 'Connected' State."));
            }
            if (!this.sendQueue) {
                this.sendQueue = new TransportSendQueue(this.transport);
            }
            // Transport will not be null if state is connected
            return this.sendQueue.send(data);
        }
        async stop(error) {
            if (this.connectionState === "Disconnected" /* Disconnected */) {
                this.logger.log(LogLevel.Debug, `Call to HttpConnection.stop(${error}) ignored because the connection is already in the disconnected state.`);
                return Promise.resolve();
            }
            if (this.connectionState === "Disconnecting" /* Disconnecting */) {
                this.logger.log(LogLevel.Debug, `Call to HttpConnection.stop(${error}) ignored because the connection is already in the disconnecting state.`);
                return this.stopPromise;
            }
            this.connectionState = "Disconnecting" /* Disconnecting */;
            this.stopPromise = new Promise((resolve) => {
                // Don't complete stop() until stopConnection() completes.
                this.stopPromiseResolver = resolve;
            });
            // stopInternal should never throw so just observe it.
            await this.stopInternal(error);
            await this.stopPromise;
        }
        async stopInternal(error) {
            // Set error as soon as possible otherwise there is a race between
            // the transport closing and providing an error and the error from a close message
            // We would prefer the close message error.
            this.stopError = error;
            try {
                await this.startInternalPromise;
            }
            catch (e) {
                // This exception is returned to the user as a rejected Promise from the start method.
            }
            // The transport's onclose will trigger stopConnection which will run our onclose event.
            // The transport should always be set if currently connected. If it wasn't set, it's likely because
            // stop was called during start() and start() failed.
            if (this.transport) {
                try {
                    await this.transport.stop();
                }
                catch (e) {
                    this.logger.log(LogLevel.Error, `HttpConnection.transport.stop() threw error '${e}'.`);
                    this.stopConnection();
                }
                this.transport = undefined;
            }
            else {
                this.logger.log(LogLevel.Debug, "HttpConnection.transport is undefined in HttpConnection.stop() because start() failed.");
                this.stopConnection();
            }
        }
        async startInternal(transferFormat) {
            // Store the original base url and the access token factory since they may change
            // as part of negotiating
            let url = this.baseUrl;
            this.accessTokenFactory = this.options.accessTokenFactory;
            try {
                if (this.options.skipNegotiation) {
                    if (this.options.transport === HttpTransportType.WebSockets) {
                        // No need to add a connection ID in this case
                        this.transport = this.constructTransport(HttpTransportType.WebSockets);
                        // We should just call connect directly in this case.
                        // No fallback or negotiate in this case.
                        await this.startTransport(url, transferFormat);
                    }
                    else {
                        throw new Error("Negotiation can only be skipped when using the WebSocket transport directly.");
                    }
                }
                else {
                    let negotiateResponse = null;
                    let redirects = 0;
                    do {
                        negotiateResponse = await this.getNegotiationResponse(url);
                        // the user tries to stop the connection when it is being started
                        if (this.connectionState === "Disconnecting" /* Disconnecting */ || this.connectionState === "Disconnected" /* Disconnected */) {
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
                            // Replace the current access token factory with one that uses
                            // the returned access token
                            const accessToken = negotiateResponse.accessToken;
                            this.accessTokenFactory = () => accessToken;
                        }
                        redirects++;
                    } while (negotiateResponse.url && redirects < MAX_REDIRECTS);
                    if (redirects === MAX_REDIRECTS && negotiateResponse.url) {
                        throw new Error("Negotiate redirection limit exceeded.");
                    }
                    await this.createTransport(url, this.options.transport, negotiateResponse, transferFormat);
                }
                if (this.transport instanceof LongPollingTransport) {
                    this.features.inherentKeepAlive = true;
                }
                if (this.connectionState === "Connecting" /* Connecting */) {
                    // Ensure the connection transitions to the connected state prior to completing this.startInternalPromise.
                    // start() will handle the case when stop was called and startInternal exits still in the disconnecting state.
                    this.logger.log(LogLevel.Debug, "The HttpConnection connected successfully.");
                    this.connectionState = "Connected" /* Connected */;
                }
                // stop() is waiting on us via this.startInternalPromise so keep this.transport around so it can clean up.
                // This is the only case startInternal can exit in neither the connected nor disconnected state because stopConnection()
                // will transition to the disconnected state. start() will wait for the transition using the stopPromise.
            }
            catch (e) {
                this.logger.log(LogLevel.Error, "Failed to start the connection: " + e);
                this.connectionState = "Disconnected" /* Disconnected */;
                this.transport = undefined;
                return Promise.reject(e);
            }
        }
        async getNegotiationResponse(url) {
            const headers = {};
            if (this.accessTokenFactory) {
                const token = await this.accessTokenFactory();
                if (token) {
                    headers[`Authorization`] = `Bearer ${token}`;
                }
            }
            const [name, value] = getUserAgentHeader();
            headers[name] = value;
            const negotiateUrl = this.resolveNegotiateUrl(url);
            this.logger.log(LogLevel.Debug, `Sending negotiation request: ${negotiateUrl}.`);
            try {
                const response = await this.httpClient.post(negotiateUrl, {
                    content: "",
                    headers: { ...headers, ...this.options.headers },
                    withCredentials: this.options.withCredentials,
                });
                if (response.statusCode !== 200) {
                    return Promise.reject(new Error(`Unexpected status code returned from negotiate '${response.statusCode}'`));
                }
                const negotiateResponse = JSON.parse(response.content);
                if (!negotiateResponse.negotiateVersion || negotiateResponse.negotiateVersion < 1) {
                    // Negotiate version 0 doesn't use connectionToken
                    // So we set it equal to connectionId so all our logic can use connectionToken without being aware of the negotiate version
                    negotiateResponse.connectionToken = negotiateResponse.connectionId;
                }
                return negotiateResponse;
            }
            catch (e) {
                this.logger.log(LogLevel.Error, "Failed to complete negotiation with the server: " + e);
                return Promise.reject(e);
            }
        }
        createConnectUrl(url, connectionToken) {
            if (!connectionToken) {
                return url;
            }
            return url + (url.indexOf("?") === -1 ? "?" : "&") + `id=${connectionToken}`;
        }
        async createTransport(url, requestedTransport, negotiateResponse, requestedTransferFormat) {
            let connectUrl = this.createConnectUrl(url, negotiateResponse.connectionToken);
            if (this.isITransport(requestedTransport)) {
                this.logger.log(LogLevel.Debug, "Connection was provided an instance of ITransport, using that directly.");
                this.transport = requestedTransport;
                await this.startTransport(connectUrl, requestedTransferFormat);
                this.connectionId = negotiateResponse.connectionId;
                return;
            }
            const transportExceptions = [];
            const transports = negotiateResponse.availableTransports || [];
            let negotiate = negotiateResponse;
            for (const endpoint of transports) {
                const transportOrError = this.resolveTransportOrError(endpoint, requestedTransport, requestedTransferFormat);
                if (transportOrError instanceof Error) {
                    // Store the error and continue, we don't want to cause a re-negotiate in these cases
                    transportExceptions.push(`${endpoint.transport} failed: ${transportOrError}`);
                }
                else if (this.isITransport(transportOrError)) {
                    this.transport = transportOrError;
                    if (!negotiate) {
                        try {
                            negotiate = await this.getNegotiationResponse(url);
                        }
                        catch (ex) {
                            return Promise.reject(ex);
                        }
                        connectUrl = this.createConnectUrl(url, negotiate.connectionToken);
                    }
                    try {
                        await this.startTransport(connectUrl, requestedTransferFormat);
                        this.connectionId = negotiate.connectionId;
                        return;
                    }
                    catch (ex) {
                        this.logger.log(LogLevel.Error, `Failed to start the transport '${endpoint.transport}': ${ex}`);
                        negotiate = undefined;
                        transportExceptions.push(`${endpoint.transport} failed: ${ex}`);
                        if (this.connectionState !== "Connecting" /* Connecting */) {
                            const message = "Failed to select transport before stop() was called.";
                            this.logger.log(LogLevel.Debug, message);
                            return Promise.reject(new Error(message));
                        }
                    }
                }
            }
            if (transportExceptions.length > 0) {
                return Promise.reject(new Error(`Unable to connect to the server with any of the available transports. ${transportExceptions.join(" ")}`));
            }
            return Promise.reject(new Error("None of the transports supported by the client are supported by the server."));
        }
        constructTransport(transport) {
            switch (transport) {
                case HttpTransportType.WebSockets:
                    if (!this.options.WebSocket) {
                        throw new Error("'WebSocket' is not supported in your environment.");
                    }
                    return new WebSocketTransport(this.accessTokenFactory, this.logger, this.options.logMessageContent || false, this.options.WebSocket);
                case HttpTransportType.ServerSentEvents:
                    if (!this.options.EventSource) {
                        throw new Error("'EventSource' is not supported in your environment.");
                    }
                    return new ServerSentEventsTransport(this.httpClient, this.accessTokenFactory, this.logger, this.options.logMessageContent || false, this.options.EventSource, this.options.withCredentials, this.options.headers || {});
                case HttpTransportType.LongPolling:
                    return new LongPollingTransport(this.httpClient, this.accessTokenFactory, this.logger, this.options.logMessageContent || false, this.options.withCredentials, this.options.headers || {});
                default:
                    throw new Error(`Unknown transport: ${transport}.`);
            }
        }
        startTransport(url, transferFormat) {
            this.transport.onreceive = this.onreceive;
            this.transport.onclose = (e) => this.stopConnection(e);
            return this.transport.connect(url, transferFormat);
        }
        resolveTransportOrError(endpoint, requestedTransport, requestedTransferFormat) {
            const transport = HttpTransportType[endpoint.transport];
            if (transport === null || transport === undefined) {
                this.logger.log(LogLevel.Debug, `Skipping transport '${endpoint.transport}' because it is not supported by this client.`);
                return new Error(`Skipping transport '${endpoint.transport}' because it is not supported by this client.`);
            }
            else {
                if (transportMatches(requestedTransport, transport)) {
                    const transferFormats = endpoint.transferFormats.map((s) => TransferFormat[s]);
                    if (transferFormats.indexOf(requestedTransferFormat) >= 0) {
                        if ((transport === HttpTransportType.WebSockets && !this.options.WebSocket) ||
                            (transport === HttpTransportType.ServerSentEvents && !this.options.EventSource)) {
                            this.logger.log(LogLevel.Debug, `Skipping transport '${HttpTransportType[transport]}' because it is not supported in your environment.'`);
                            return new Error(`'${HttpTransportType[transport]}' is not supported in your environment.`);
                        }
                        else {
                            this.logger.log(LogLevel.Debug, `Selecting transport '${HttpTransportType[transport]}'.`);
                            try {
                                return this.constructTransport(transport);
                            }
                            catch (ex) {
                                return ex;
                            }
                        }
                    }
                    else {
                        this.logger.log(LogLevel.Debug, `Skipping transport '${HttpTransportType[transport]}' because it does not support the requested transfer format '${TransferFormat[requestedTransferFormat]}'.`);
                        return new Error(`'${HttpTransportType[transport]}' does not support ${TransferFormat[requestedTransferFormat]}.`);
                    }
                }
                else {
                    this.logger.log(LogLevel.Debug, `Skipping transport '${HttpTransportType[transport]}' because it was disabled by the client.`);
                    return new Error(`'${HttpTransportType[transport]}' is disabled by the client.`);
                }
            }
        }
        isITransport(transport) {
            return transport && typeof (transport) === "object" && "connect" in transport;
        }
        stopConnection(error) {
            this.logger.log(LogLevel.Debug, `HttpConnection.stopConnection(${error}) called while in state ${this.connectionState}.`);
            this.transport = undefined;
            // If we have a stopError, it takes precedence over the error from the transport
            error = this.stopError || error;
            this.stopError = undefined;
            if (this.connectionState === "Disconnected" /* Disconnected */) {
                this.logger.log(LogLevel.Debug, `Call to HttpConnection.stopConnection(${error}) was ignored because the connection is already in the disconnected state.`);
                return;
            }
            if (this.connectionState === "Connecting" /* Connecting */) {
                this.logger.log(LogLevel.Warning, `Call to HttpConnection.stopConnection(${error}) was ignored because the connection is still in the connecting state.`);
                throw new Error(`HttpConnection.stopConnection(${error}) was called while the connection is still in the connecting state.`);
            }
            if (this.connectionState === "Disconnecting" /* Disconnecting */) {
                // A call to stop() induced this call to stopConnection and needs to be completed.
                // Any stop() awaiters will be scheduled to continue after the onclose callback fires.
                this.stopPromiseResolver();
            }
            if (error) {
                this.logger.log(LogLevel.Error, `Connection disconnected with error '${error}'.`);
            }
            else {
                this.logger.log(LogLevel.Information, "Connection disconnected.");
            }
            if (this.sendQueue) {
                this.sendQueue.stop().catch((e) => {
                    this.logger.log(LogLevel.Error, `TransportSendQueue.stop() threw error '${e}'.`);
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
                    this.logger.log(LogLevel.Error, `HttpConnection.onclose(${error}) threw error '${e}'.`);
                }
            }
        }
        resolveUrl(url) {
            // startsWith is not supported in IE
            if (url.lastIndexOf("https://", 0) === 0 || url.lastIndexOf("http://", 0) === 0) {
                return url;
            }
            if (!Platform.isBrowser || !window.document) {
                throw new Error(`Cannot resolve '${url}'.`);
            }
            // Setting the url to the href propery of an anchor tag handles normalization
            // for us. There are 3 main cases.
            // 1. Relative path normalization e.g "b" -> "http://localhost:5000/a/b"
            // 2. Absolute path normalization e.g "/a/b" -> "http://localhost:5000/a/b"
            // 3. Networkpath reference normalization e.g "//localhost:5000/a/b" -> "http://localhost:5000/a/b"
            const aTag = window.document.createElement("a");
            aTag.href = url;
            this.logger.log(LogLevel.Information, `Normalizing '${url}' to '${aTag.href}'.`);
            return aTag.href;
        }
        resolveNegotiateUrl(url) {
            const index = url.indexOf("?");
            let negotiateUrl = url.substring(0, index === -1 ? url.length : index);
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
        }
    }
    function transportMatches(requestedTransport, actualTransport) {
        return !requestedTransport || ((actualTransport & requestedTransport) !== 0);
    }
    /** @private */
    class TransportSendQueue {
        constructor(transport) {
            this.transport = transport;
            this.buffer = [];
            this.executing = true;
            this.sendBufferedData = new PromiseSource();
            this.transportResult = new PromiseSource();
            this.sendLoopPromise = this.sendLoop();
        }
        send(data) {
            this.bufferData(data);
            if (!this.transportResult) {
                this.transportResult = new PromiseSource();
            }
            return this.transportResult.promise;
        }
        stop() {
            this.executing = false;
            this.sendBufferedData.resolve();
            return this.sendLoopPromise;
        }
        bufferData(data) {
            if (this.buffer.length && typeof (this.buffer[0]) !== typeof (data)) {
                throw new Error(`Expected data to be of type ${typeof (this.buffer)} but was of type ${typeof (data)}`);
            }
            this.buffer.push(data);
            this.sendBufferedData.resolve();
        }
        async sendLoop() {
            while (true) {
                await this.sendBufferedData.promise;
                if (!this.executing) {
                    if (this.transportResult) {
                        this.transportResult.reject("Connection stopped.");
                    }
                    break;
                }
                this.sendBufferedData = new PromiseSource();
                const transportResult = this.transportResult;
                this.transportResult = undefined;
                const data = typeof (this.buffer[0]) === "string" ?
                    this.buffer.join("") :
                    TransportSendQueue.concatBuffers(this.buffer);
                this.buffer.length = 0;
                try {
                    await this.transport.send(data);
                    transportResult.resolve();
                }
                catch (error) {
                    transportResult.reject(error);
                }
            }
        }
        static concatBuffers(arrayBuffers) {
            const totalLength = arrayBuffers.map((b) => b.byteLength).reduce((a, b) => a + b);
            const result = new Uint8Array(totalLength);
            let offset = 0;
            for (const item of arrayBuffers) {
                result.set(new Uint8Array(item), offset);
                offset += item.byteLength;
            }
            return result.buffer;
        }
    }
    class PromiseSource {
        constructor() {
            this.promise = new Promise((resolve, reject) => [this.resolver, this.rejecter] = [resolve, reject]);
        }
        resolve() {
            this.resolver();
        }
        reject(reason) {
            this.rejecter(reason);
        }
    }

    // Copyright (c) .NET Foundation. All rights reserved.
    const JSON_HUB_PROTOCOL_NAME = "json";
    /** Implements the JSON Hub Protocol. */
    class JsonHubProtocol {
        constructor() {
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
        parseMessages(input, logger) {
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
            const messages = TextMessageFormat.parse(input);
            const hubMessages = [];
            for (const message of messages) {
                const parsedMessage = JSON.parse(message);
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
        }
        /** Writes the specified {@link @microsoft/signalr.HubMessage} to a string and returns it.
         *
         * @param {HubMessage} message The message to write.
         * @returns {string} A string containing the serialized representation of the message.
         */
        writeMessage(message) {
            return TextMessageFormat.write(JSON.stringify(message));
        }
        isInvocationMessage(message) {
            this.assertNotEmptyString(message.target, "Invalid payload for Invocation message.");
            if (message.invocationId !== undefined) {
                this.assertNotEmptyString(message.invocationId, "Invalid payload for Invocation message.");
            }
        }
        isStreamItemMessage(message) {
            this.assertNotEmptyString(message.invocationId, "Invalid payload for StreamItem message.");
            if (message.item === undefined) {
                throw new Error("Invalid payload for StreamItem message.");
            }
        }
        isCompletionMessage(message) {
            if (message.result && message.error) {
                throw new Error("Invalid payload for Completion message.");
            }
            if (!message.result && message.error) {
                this.assertNotEmptyString(message.error, "Invalid payload for Completion message.");
            }
            this.assertNotEmptyString(message.invocationId, "Invalid payload for Completion message.");
        }
        assertNotEmptyString(value, errorMessage) {
            if (typeof value !== "string" || value === "") {
                throw new Error(errorMessage);
            }
        }
    }

    // Copyright (c) .NET Foundation. All rights reserved.
    // tslint:disable:object-literal-sort-keys
    const LogLevelNameMapping = {
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
        const mapping = LogLevelNameMapping[name.toLowerCase()];
        if (typeof mapping !== "undefined") {
            return mapping;
        }
        else {
            throw new Error(`Unknown log level: ${name}`);
        }
    }
    /** A builder for configuring {@link @microsoft/signalr.HubConnection} instances. */
    class HubConnectionBuilder {
        configureLogging(logging) {
            Arg.isRequired(logging, "logging");
            if (isLogger(logging)) {
                this.logger = logging;
            }
            else if (typeof logging === "string") {
                const logLevel = parseLogLevel(logging);
                this.logger = new ConsoleLogger(logLevel);
            }
            else {
                this.logger = new ConsoleLogger(logging);
            }
            return this;
        }
        withUrl(url, transportTypeOrOptions) {
            Arg.isRequired(url, "url");
            Arg.isNotEmpty(url, "url");
            this.url = url;
            // Flow-typing knows where it's at. Since HttpTransportType is a number and IHttpConnectionOptions is guaranteed
            // to be an object, we know (as does TypeScript) this comparison is all we need to figure out which overload was called.
            if (typeof transportTypeOrOptions === "object") {
                this.httpConnectionOptions = { ...this.httpConnectionOptions, ...transportTypeOrOptions };
            }
            else {
                this.httpConnectionOptions = {
                    ...this.httpConnectionOptions,
                    transport: transportTypeOrOptions,
                };
            }
            return this;
        }
        /** Configures the {@link @microsoft/signalr.HubConnection} to use the specified Hub Protocol.
         *
         * @param {IHubProtocol} protocol The {@link @microsoft/signalr.IHubProtocol} implementation to use.
         */
        withHubProtocol(protocol) {
            Arg.isRequired(protocol, "protocol");
            this.protocol = protocol;
            return this;
        }
        withAutomaticReconnect(retryDelaysOrReconnectPolicy) {
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
        }
        /** Creates a {@link @microsoft/signalr.HubConnection} from the configuration options specified in this builder.
         *
         * @returns {HubConnection} The configured {@link @microsoft/signalr.HubConnection}.
         */
        build() {
            // If httpConnectionOptions has a logger, use it. Otherwise, override it with the one
            // provided to configureLogger
            const httpConnectionOptions = this.httpConnectionOptions || {};
            // If it's 'null', the user **explicitly** asked for null, don't mess with it.
            if (httpConnectionOptions.logger === undefined) {
                // If our logger is undefined or null, that's OK, the HttpConnection constructor will handle it.
                httpConnectionOptions.logger = this.logger;
            }
            // Now create the connection
            if (!this.url) {
                throw new Error("The 'HubConnectionBuilder.withUrl' method must be called before building the connection.");
            }
            const connection = new HttpConnection(this.url, httpConnectionOptions);
            return HubConnection.create(connection, this.logger || NullLogger.instance, this.protocol || new JsonHubProtocol(), this.reconnectPolicy);
        }
    }
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
