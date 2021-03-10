import { arrayRemoveAt } from "../arrays/arrayRemoveAt";
import { isBoolean, isDefined, isFunction } from "../typeChecks";
export class EventBase {
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
                if (isDefined(options)
                    && !isBoolean(options)
                    && options.once) {
                    this.removeListener(listeners, callback);
                }
                callback.call(this, evt);
            }
        }
        return !evt.defaultPrevented;
    }
}
export class TypedEvent extends Event {
    constructor(type) {
        super(type);
    }
}
export class TypedEventBase extends EventBase {
    constructor() {
        super(...arguments);
        this.mappedCallbacks = new Map();
    }
    addEventListener(type, callback, options) {
        if (this.checkAddEventListener(type, callback)) {
            let mappedCallback = this.mappedCallbacks.get(callback);
            if (mappedCallback == null) {
                mappedCallback = (evt) => callback(evt);
                this.mappedCallbacks.set(callback, mappedCallback);
            }
            super.addEventListener(type, mappedCallback, options);
        }
    }
    checkAddEventListener(_type, _callback) {
        return true;
    }
    removeEventListener(type, callback) {
        const mappedCallback = this.mappedCallbacks.get(callback);
        if (mappedCallback) {
            super.removeEventListener(type, mappedCallback);
        }
    }
    dispatchEvent(evt) {
        this.onDispatching(evt);
        return super.dispatchEvent(evt);
    }
    onDispatching(_evt) { }
}
//# sourceMappingURL=EventBase.js.map