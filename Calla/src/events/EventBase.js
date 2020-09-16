import { arrayRemoveAt } from "../arrays/arrayRemoveAt";
import { isFunction } from "../typeChecks";

export const EventBase = (function () {
    try {
        new window.EventTarget();
        return class EventBase extends EventTarget {
            constructor() {
                super();
            }
        };
    } catch (exp) {

        /** @type {WeakMap<EventBase, Map<string, Listener[]>> */
        const selfs = new WeakMap();

        class Listener {
            /**
             * @param {EventBase} target
             * @param {Function} listener
             * @param {any} options
             */
            constructor(target, listener, options) {
                this.target = target;
                this.callback = listener;
                this.options = options;
            }
        }

        return class EventBase {

            constructor() {
                selfs.set(this, new Map());
            }

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
                    if (!listeners.find(l => l.callback === callback)) {
                        listeners.push({
                            target: this,
                            callback,
                            options
                        });
                    }
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
                    for (let listener of listeners) {
                        if (listener.options && listener.options.once) {
                            this.removeEventListener(evt.type, listener.callback);
                        }
                        listener.callback.call(listener.target, evt);
                    }
                    return !evt.defaultPrevented;
                }
            }
        };
    }

})();