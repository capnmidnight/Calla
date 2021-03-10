import { arrayRemoveAt } from "../arrays/arrayRemoveAt";
import { isBoolean, isDefined, isFunction } from "../typeChecks";

export class EventBase implements EventTarget {
    private listeners = new Map<string, Function[]>();
    private listenerOptions = new Map<Function, boolean | AddEventListenerOptions>();

    addEventListener(type: string, callback: (evt: Event) => any, options?: boolean | AddEventListenerOptions): void {
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

export class TypedEvent<T> extends Event {
    constructor(type: T & string) {
        super(type);
    }
}

export class TypedEventBase<EventsT> extends EventBase {
    private mappedCallbacks = new Map<Function, (evt: Event) => any>();

    addEventListener<K extends keyof EventsT, V extends TypedEvent<K> & EventsT[K]>(type: K & string, callback: (evt: V) => any, options?: boolean | AddEventListenerOptions): void {
        if (this.checkAddEventListener(type, callback)) {
            let mappedCallback = this.mappedCallbacks.get(callback);
            if (mappedCallback == null) {
                mappedCallback = (evt: Event) => callback(evt as V);
                this.mappedCallbacks.set(callback, mappedCallback);
            }

            super.addEventListener(type, mappedCallback, options);
        }
    }

    protected checkAddEventListener<T extends Event>(_type: string, _callback: (evt: T) => any): boolean {
        return true;
    }

    removeEventListener<K extends keyof EventsT, V extends TypedEvent<K> & EventsT[K]>(type: K & string, callback: (evt: V) => any) {
        const mappedCallback = this.mappedCallbacks.get(callback);
        if (mappedCallback) {
            super.removeEventListener(type, mappedCallback);
        }
    }

    dispatchEvent<T extends Event>(evt: T): boolean {
        this.onDispatching(evt);
        return super.dispatchEvent(evt);
    }

    protected onDispatching<T extends Event>(_evt: T) { }
}