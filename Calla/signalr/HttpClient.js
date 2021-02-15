// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
/** Represents an HTTP response. */
export class HttpResponse {
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
export class HttpClient {
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
//# sourceMappingURL=HttpClient.js.map