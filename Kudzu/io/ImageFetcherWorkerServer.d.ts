import { WorkerServer } from "../workers/WorkerServer";
import { ImageFetcher } from "./ImageFetcher";
export declare class ImageFetcherWorkerServer extends WorkerServer {
    constructor(self: DedicatedWorkerGlobalScope);
}
export declare function addImageFetcherMethods(server: WorkerServer, fetcher: ImageFetcher): void;
