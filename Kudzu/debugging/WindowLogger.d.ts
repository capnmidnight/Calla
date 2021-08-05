import { ErsatzElement } from "../html/tags";
import { ILogger } from "./models";
export declare class WindowLogger implements ILogger, ErsatzElement {
    private logs;
    private rows;
    readonly element: HTMLElement;
    private grid;
    private workerCount;
    constructor();
    private render;
    log(id: string, ...values: any[]): void;
    delete(id: string): void;
    clear(): void;
    addWorker(name: string, worker: Worker): void;
}
