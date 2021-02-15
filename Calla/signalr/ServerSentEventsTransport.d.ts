import { HttpClient } from "./HttpClient";
import { MessageHeaders } from "./IHubProtocol";
import { ILogger } from "./ILogger";
import { ITransport, TransferFormat } from "./ITransport";
import { EventSourceConstructor } from "./Polyfills";
/** @private */
export declare class ServerSentEventsTransport implements ITransport {
    private readonly httpClient;
    private readonly accessTokenFactory;
    private readonly logger;
    private readonly logMessageContent;
    private readonly withCredentials;
    private readonly eventSourceConstructor;
    private eventSource?;
    private url?;
    private headers;
    onreceive: ((data: string | ArrayBuffer) => void) | null;
    onclose: ((error?: Error) => void) | null;
    constructor(httpClient: HttpClient, accessTokenFactory: (() => string | Promise<string>) | undefined, logger: ILogger, logMessageContent: boolean, eventSourceConstructor: EventSourceConstructor, withCredentials: boolean, headers: MessageHeaders);
    connect(url: string, transferFormat: TransferFormat): Promise<void>;
    send(data: any): Promise<void>;
    stop(): Promise<void>;
    private close;
}
