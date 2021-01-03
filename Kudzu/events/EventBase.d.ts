export declare class EventBase implements EventTarget {
    private listeners;
    private listenerOptions;
    addEventListener(type: string, callback: (evt: Event) => any, options?: AddEventListenerOptions): void;
    removeEventListener(type: string, callback: (evt: Event) => any): void;
    private removeListener;
    dispatchEvent(evt: Event): boolean;
}
export declare class TypedEvent<T extends string> extends Event {
    constructor(type: T);
}
export declare class TypedEventBase<EventsT> extends EventBase {
    private mappedCallbacks;
    addEventListener<K extends string & keyof EventsT>(type: K, callback: (evt: TypedEvent<K> & EventsT[K]) => any, options?: AddEventListenerOptions): void;
    removeEventListener<K extends string & keyof EventsT>(type: K, callback: (evt: TypedEvent<K> & EventsT[K]) => any): void;
}
