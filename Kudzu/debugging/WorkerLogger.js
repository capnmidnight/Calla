import { KEY, MessageType } from "./models";
export class WorkerLogger {
    constructor() {
        this.msg = {
            key: KEY,
            method: null,
            id: null,
            values: null
        };
    }
    post(method, id, ...values) {
        this.msg.method = method;
        this.msg.id = id;
        this.msg.values = values;
        self.postMessage(this.msg);
    }
    log(id, ...values) {
        this.post(MessageType.Log, id, ...values);
    }
    delete(id) {
        this.post(MessageType.Delete, id);
    }
    clear() {
        this.post(MessageType.Clear);
    }
    addWorker(_name, _worker) {
        // no-op
    }
}
//# sourceMappingURL=WorkerLogger.js.map