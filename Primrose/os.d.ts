declare class OperatingSystem {
    readonly name: string;
    makeCommand: (evt: KeyboardEvent) => {
        type: string;
        text: string;
        command: string;
    };
    constructor(name: string, pre1: string, pre2: string, redo: string, pre3: string, home: string, end: string, pre5: string, fullHome: string, fullEnd: string);
}
export declare const Windows: OperatingSystem;
export declare const MacOS: OperatingSystem;
export {};
