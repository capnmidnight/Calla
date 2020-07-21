import { isGoodNumber } from "../math.js";
import { isFunction, isNumber, isString } from "../typeChecks.js";
import { arrayRemoveAt } from "./Array.js";

function add(a, b) {
    return evt => {
        a(evt);
        b(evt);
    };
}

try {
    new window.EventTarget();
} catch (exp) {

    /** @type {WeakMap<EventTarget, Map<string, Listener[]>> */
    const selfs = new WeakMap();

    class Listener {
        /**
         * @param {EventTarget} target
         * @param {Function} listener
         * @param {any} options
         */
        constructor(target, listener, options) {
            this.target = target;
            this.callback = listener;
            this.options = options;
        }
    }

    class EventTarget {
        /**
         * @param {string} type
         * @param {Function} callback
         * @param {any} options
         */
        addEventListener(type, callback, options) {
            if (isFunction(callback)) {
                const self = selfs.get(this);
                if (!self.has(type)) {
                    self.set(type, []);
                }
                const listeners = self.get(type);

                for (let listener of listeners) {
                    if (listener.callback === callback)
                        return;
                }

                listeners.push({
                    target: this,
                    callback,
                    options
                });
            }
        }

        /**
         * @param {string} type
         * @param {Function} callback
         */
        removeEventListener(type, callback) {
            if (isFunction(callback)) {
                const self = selfs.get(this);
                if (self.has(type)) {
                    const listeners = self.get(type),
                        idx = listeners.findIndex(l => l.callback === callback);
                    if (idx >= 0) {
                        arrayRemoveAt(listeners, idx);
                    }
                }
            }
        }

        /**
         * @param {Event} evt
         */
        dispatchEvent(evt) {
            const self = selfs.get(this);
            if (!self.has(evt.type)) {
                return true;
            }
            else {
                const listeners = self.get(evt.type);
                evt.target
                    = evt.currentTarget
                    = this;
                for (let listener of listeners) {
                    if (listener.options && listener.options.once) {
                        this.removeEventListener(evt.type, listener.callback);
                    }
                    listener.callback.call(listener.target, evt);
                }
                evt.target
                    = evt.currentTarget
                    = null;
                return !evt.defaultPrevented;
            }
        }
    }

    window.EventTarget = EventTarget;
}


EventTarget.prototype.once = function (resolveEvt, rejectEvt, timeout) {

    if (timeout === undefined
        && isGoodNumber(rejectEvt)) {
        timeout = rejectEvt;
        rejectEvt = undefined;
    }

    return new Promise((resolve, reject) => {
        const hasResolveEvt = isString(resolveEvt);
        if (hasResolveEvt) {
            const oldResolve = resolve;
            const remove = () => {
                this.removeEventListener(resolveEvt, oldResolve);
            };
            resolve = add(remove, resolve);
            reject = add(remove, reject);
        }

        const hasRejectEvt = isString(rejectEvt);
        if (hasRejectEvt) {
            const oldReject = reject;
            const remove = () => {
                this.removeEventListener(rejectEvt, oldReject);
            };

            resolve = add(remove, resolve);
            reject = add(remove, reject);
        }

        if (isNumber(timeout)) {
            const timer = setTimeout(reject, timeout, `'${resolveEvt}' has timed out.`),
                cancel = () => clearTimeout(timer);
            resolve = add(cancel, resolve);
            reject = add(cancel, reject);
        }

        if (hasResolveEvt) {
            this.addEventListener(resolveEvt, resolve);
        }

        if (hasRejectEvt) {
            this.addEventListener(rejectEvt, () => {
                reject("Rejection event found");
            });
        }
    });
};

EventTarget.prototype.when = function (resolveEvt, filterTest, timeout) {

    if (!isString(resolveEvt)) {
        throw new Error("Filtering tests function is required. Otherwise, use `once`.");
    }

    if (!isFunction(filterTest)) {
        throw new Error("Filtering tests function is required. Otherwise, use `once`.");
    }

    return new Promise((resolve, reject) => {
        const remove = () => {
            this.removeEventListener(resolveEvt, resolve);
        };

        resolve = add(remove, resolve);
        reject = add(remove, reject);

        if (isNumber(timeout)) {
            const timer = setTimeout(reject, timeout, `'${resolveEvt}' has timed out.`),
                cancel = () => clearTimeout(timer);
            resolve = add(cancel, resolve);
            reject = add(cancel, reject);
        }

        this.addEventListener(resolveEvt, resolve);
    });
};

EventTarget.prototype.until = function (untilEvt, callback, test, repeatTimeout, cancelTimeout) {
    return new Promise((resolve, reject) => {
        let timer = null,
            canceller = null;

        const cleanup = () => {
            if (timer !== null) {
                clearTimeout(timer);
            }

            if (canceller !== null) {
                clearTimeout(canceller);
            }

            this.removeEventListener(untilEvt, success);
        }

        function success(evt) {
            if (test(evt)) {
                cleanup();
                resolve(evt);
            }
        }

        this.addEventListener(untilEvt, success);

        if (repeatTimeout !== undefined) {
            if (cancelTimeout !== undefined) {
                canceller = setTimeout(() => {
                    cleanup();
                    reject(`'${untilEvt}' has timed out.`);
                }, cancelTimeout);
            }

            const repeater = () => {
                callback();
                timer = setTimeout(repeater, repeatTimeout);
            }

            timer = setTimeout(repeater, 0);
        }
    });
};

EventTarget.prototype.addEventListeners = function (obj) {
    for (let evtName in obj) {
        let callback = obj[evtName];
        let opts = undefined;
        if (callback instanceof Array) {
            opts = callback[1];
            callback = callback[0];
        }

        this.addEventListener(evtName, callback, opts);
    }
};