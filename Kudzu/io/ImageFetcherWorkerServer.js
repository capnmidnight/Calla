import { WorkerServer } from "../workers/WorkerServer";
import { addFetcherMethods } from "./FetcherWorkerServer";
import { ImageFetcher } from "./ImageFetcher";
export class ImageFetcherWorkerServer extends WorkerServer {
    constructor(self) {
        super(self);
        const fetcher = new ImageFetcher();
        addFetcherMethods(this, fetcher);
        addImageFetcherMethods(this, fetcher);
    }
}
export function addImageFetcherMethods(server, fetcher) {
}
//# sourceMappingURL=ImageFetcherWorkerServer.js.map