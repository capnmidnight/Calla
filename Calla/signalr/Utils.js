// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
import { LogLevel } from "./ILogger";
import { NullLogger } from "./Loggers";
// Version token that will be replaced by the prepack command
/** The version of the SignalR client. */
export const VERSION = "0.0.0-DEV_BUILD";
/** @private */
export class Arg {
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
export class Platform {
    static get isBrowser() {
        return typeof window === "object";
    }
    static get isWebWorker() {
        return typeof self === "object" && "importScripts" in self;
    }
}
/** @private */
export function getDataDetail(data, includeContent) {
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
export function formatArrayBuffer(data) {
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
export function isArrayBuffer(val) {
    return val && typeof ArrayBuffer !== "undefined" &&
        (val instanceof ArrayBuffer ||
            // Sometimes we get an ArrayBuffer that doesn't satisfy instanceof
            (val.constructor && val.constructor.name === "ArrayBuffer"));
}
/** @private */
export async function sendMessage(logger, transportName, httpClient, url, accessTokenFactory, content, logMessageContent, withCredentials, defaultHeaders) {
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
export function createLogger(logger) {
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
export class SubjectSubscription {
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
export class ConsoleLogger {
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
export function getUserAgentHeader() {
    let userAgentHeaderName = "X-SignalR-User-Agent";
    return [userAgentHeaderName, constructUserAgent(VERSION, getOsName(), getRuntime(), getRuntimeVersion())];
}
/** @private */
export function constructUserAgent(version, os, runtime, runtimeVersion) {
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
//# sourceMappingURL=Utils.js.map