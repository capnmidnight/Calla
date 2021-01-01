export declare class EventBase implements EventTarget {
    private listeners;
    private options;
    addEventListener(type: string, callback: (evt: Event) => any, options?: AddEventListenerOptions): void;
    removeEventListener(type: string, callback: (evt: Event) => any): void;
    private removeListener;
    dispatchEvent(evt: Event): boolean;
}
export declare class TypedEventBase<EventBaseT> extends EventBase {
    private mappedCallbacks;
    addEventListener<K extends string & keyof EventBaseT>(type: K, callback: (evt: Event & EventBaseT[K]) => any, options?: AddEventListenerOptions): void;
    removeEventListener<K extends string & keyof EventBaseT>(type: K, callback: (evt: Event & EventBaseT[K]) => any): void;
    dispatchEvent<K extends string & keyof EventBaseT>(evt: Event & EventBaseT[K]): boolean;
}
