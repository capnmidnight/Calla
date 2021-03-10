export declare class EventBase implements EventTarget {
    private listeners;
    private listenerOptions;
    addEventListener(type: string, callback: (evt: Event) => any, options?: boolean | AddEventListenerOptions): void;
    removeEventListener(type: string, callback: (evt: Event) => any): void;
    private removeListener;
    dispatchEvent(evt: Event): boolean;
}
export declare class TypedEvent<T> extends Event {
    constructor(type: T & string);
}
export declare class TypedEventBase<EventsT> extends EventBase {
    private mappedCallbacks;
    addEventListener<K extends keyof EventsT, V extends TypedEvent<K> & EventsT[K]>(type: K & string, callback: (evt: V) => any, options?: boolean | AddEventListenerOptions): void;
    protected checkAddEventListener<T extends Event>(_type: string, _callback: (evt: T) => any): boolean;
    removeEventListener<K extends keyof EventsT, V extends TypedEvent<K> & EventsT[K]>(type: K & string, callback: (evt: V) => any): void;
    dispatchEvent<T extends Event>(evt: T): boolean;
    protected onDispatching<T extends Event>(_evt: T): void;
}
