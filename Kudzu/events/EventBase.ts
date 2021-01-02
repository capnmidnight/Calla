import { arrayRemoveAt } from "../arrays/arrayRemoveAt";
import { isFunction } from "../typeChecks";

export class EventBase implements EventTarget {
    private listeners = new Map<string, Function[]>();
    private listenerOptions = new Map<Function, AddEventListenerOptions>();

    addEventListener(type: string, callback: (evt: Event) => any, options?: AddEventListenerOptions): void {
        if (isFunction(callback)) {
            let listeners = this.listeners.get(type);
            if (!listeners) {
                listeners = new Array<Function>();
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

    removeEventListener(type: string, callback: (evt: Event) => any) {
        if (isFunction(callback)) {
            const listeners = this.listeners.get(type);
            if (listeners) {
                this.removeListener(listeners, callback);
            }
        }
    }

    private removeListener(listeners: Function[], callback: Function) {
        const idx = listeners.findIndex(c => c === callback);
        if (idx >= 0) {
            arrayRemoveAt(listeners, idx);
            if (this.listenerOptions.has(callback)) {
                this.listenerOptions.delete(callback);
            }
        }
    }

    dispatchEvent(evt: Event): boolean {
        const listeners = this.listeners.get(evt.type);
        if (listeners) {
            for (const callback of listeners) {
                const options = this.listenerOptions.get(callback);
                if (options && options.once) {
                    this.removeListener(listeners, callback);
                }

                callback.call(this, evt);
            }
        }
        return !evt.defaultPrevented;
    }
}

export class TypedEventBase<EventBaseT> extends EventBase {
    private mappedCallbacks = new Map<Function, (evt: Event) => any>();

    addEventListener<K extends string & keyof EventBaseT>(type: K, callback: (evt: Event & EventBaseT[K]) => any, options?: AddEventListenerOptions): void {
        let mappedCallback = this.mappedCallbacks.get(callback);
        if (mappedCallback == null) {
            mappedCallback = (evt: Event) => callback(evt as Event & EventBaseT[K]);
            this.mappedCallbacks.set(callback, mappedCallback);
        }

        super.addEventListener(type, mappedCallback, options);
    }

    removeEventListener<K extends string & keyof EventBaseT>(type: K, callback: (evt: Event & EventBaseT[K]) => any) {
        const mappedCallback = this.mappedCallbacks.get(callback);
        if (mappedCallback) {
            super.removeEventListener(type, mappedCallback);
        }
    }

    dispatchEvent<K extends string & keyof EventBaseT>(evt: Event & EventBaseT[K]): boolean {
        return super.dispatchEvent(evt);
    }
}