// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
import { AbortError, HttpError, TimeoutError } from "./Errors";
import { HttpClient, HttpResponse } from "./HttpClient";
import { LogLevel } from "./ILogger";
export class FetchHttpClient extends HttpClient {
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
//# sourceMappingURL=FetchHttpClient.js.map