import { isWorker } from "../html/flags";
import { WindowLogger } from "./WindowLogger";
import { WorkerLogger } from "./WorkerLogger";
const logger = isWorker
    ? new WorkerLogger()
    : new WindowLogger();
export class Logger {
    log(id, ...values) {
        logger.log(id, ...values);
    }
    delete(id) {
        logger.delete(id);
    }
    clear() {
        logger.clear();
    }
    addWorker(name, worker) {
        logger.addWorker(name, worker);
    }
}
//# sourceMappingURL=Logger.js.map