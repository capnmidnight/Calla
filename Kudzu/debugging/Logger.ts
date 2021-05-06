import { isWorker } from "../html/flags";
import { ILogger } from "./models";
import { WindowLogger } from "./WindowLogger";
import { WorkerLogger } from "./WorkerLogger";

const logger: ILogger = isWorker
    ? new WorkerLogger()
    : new WindowLogger();

export class Logger implements ILogger {

    log(id: string, ...values: any[]): void {
        logger.log(id, ...values);
    }

    delete(id: string): void {
        logger.delete(id);
    }

    clear(): void {
        logger.clear();
    }

    addWorker(name: string, worker: Worker): void {
        logger.addWorker(name, worker);
    }
}

