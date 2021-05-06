import { ILogger } from "./models";
export declare class WorkerLogger implements ILogger {
    private msg;
    private post;
    log(id: string, ...values: any[]): void;
    delete(id: string): void;
    clear(): void;
    addWorker(_name: string, _worker: Worker): void;
}
