// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
import { LogLevel } from "./ILogger";
import { TransferFormat } from "./ITransport";
import { Arg, getDataDetail } from "./Utils";
/** @private */
export class WebSocketTransport {
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
//# sourceMappingURL=WebSocketTransport.js.map