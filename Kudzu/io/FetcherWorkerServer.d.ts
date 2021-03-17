import { WorkerServer } from "../workers/WorkerServer";
import { Fetcher } from "./Fetcher";
export declare class FetcherWorkerServer extends WorkerServer {
    constructor(self: DedicatedWorkerGlobalScope);
}
export declare function addFetcherMethods(server: WorkerServer, fetcher: Fetcher): void;
