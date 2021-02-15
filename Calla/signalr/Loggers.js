// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
/** A logger that does nothing when log messages are sent to it. */
export class NullLogger {
    constructor() { }
    /** @inheritDoc */
    // tslint:disable-next-line
    log(_logLevel, _message) {
    }
}
/** The singleton instance of the {@link @microsoft/signalr.NullLogger}. */
NullLogger.instance = new NullLogger();
//# sourceMappingURL=Loggers.js.map