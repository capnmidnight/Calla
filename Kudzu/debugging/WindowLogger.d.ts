import { ILogger } from "./models";
export declare class WindowLogger implements ILogger {
    private logs;
    private rows;
    private container;
    private grid;
    private workerCount;
    constructor();
    private render;
    log(id: string, ...values: any[]): void;
    delete(id: string): void;
    clear(): void;
    addWorker(name: string, worker: Worker): void;
}
