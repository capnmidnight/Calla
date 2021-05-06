import { ILogger, IWorkerLoggerMessageData, KEY, MessageType } from "./models";

export class WorkerLogger implements ILogger {

    private msg: IWorkerLoggerMessageData = {
        key: KEY,
        method: null,
        id: null,
        values: null
    };

    private post(method: MessageType, id?: string, ...values: any[]): void {
        this.msg.method = method;
        this.msg.id = id;
        this.msg.values = values;
        self.postMessage(this.msg);
    }

    log(id: string, ...values: any[]): void {
        this.post(MessageType.Log, id, ...values);
    }

    delete(id: string): void {
        this.post(MessageType.Delete, id);
    }

    clear(): void {
        this.post(MessageType.Clear);
    }

    addWorker(_name: string, _worker: Worker): void {
        // no-op
    }
}
