export interface ILogger {
    log(id: string, ...values: any[]): void;
    delete(id: string): void;
    clear(): void;
    addWorker(name: string, worker: Worker): void;
}
export declare enum MessageType {
    Log = "log",
    Delete = "delete",
    Clear = "clear"
}
export declare const KEY = "XXX_QUAKE_LOGGER_XXX";
export interface IWorkerLoggerMessageData {
    key: string;
    method: MessageType;
    id: string;
    values: any[];
}
export declare function isWorkerLoggerMessageData(data: any): data is IWorkerLoggerMessageData;
