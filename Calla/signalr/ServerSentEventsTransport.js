// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
import { LogLevel } from "./ILogger";
import { TransferFormat } from "./ITransport";
import { Arg, getDataDetail, getUserAgentHeader, Platform, sendMessage } from "./Utils";
/** @private */
export class ServerSentEventsTransport {
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
//# sourceMappingURL=ServerSentEventsTransport.js.map