// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
import { SubjectSubscription } from "./Utils";
/** Stream implementation to stream items to the server. */
export class Subject {
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
//# sourceMappingURL=Subject.js.map