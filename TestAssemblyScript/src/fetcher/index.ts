import { FetcherWorkerServer } from "kudzu/io/FetcherWorkerServer";
(globalThis as any).server = new FetcherWorkerServer((globalThis as any) as DedicatedWorkerGlobalScope);