export interface ErsatzEventTarget {
    addEventListener(evtName: string, handler: Function): void;
    removeEventListener(evtName: string, handler: Function): void;
}
