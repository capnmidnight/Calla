import { WorkerServer } from "kudzu/workers/WorkerServer";
export declare class LayerWorkerServer extends WorkerServer {
    private layer;
    constructor(self: DedicatedWorkerGlobalScope);
}
