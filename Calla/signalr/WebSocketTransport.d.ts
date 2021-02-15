import { ILogger } from "./ILogger";
import { ITransport, TransferFormat } from "./ITransport";
import { WebSocketConstructor } from "./Polyfills";
/** @private */
export declare class WebSocketTransport implements ITransport {
    private readonly logger;
    private readonly accessTokenFactory;
    private readonly logMessageContent;
    private readonly webSocketConstructor;
    private webSocket?;
    onreceive: ((data: string | ArrayBuffer) => void) | null;
    onclose: ((error?: Error) => void) | null;
    constructor(accessTokenFactory: (() => string | Promise<string>) | undefined, logger: ILogger, logMessageContent: boolean, webSocketConstructor: WebSocketConstructor);
    connect(url: string, transferFormat: TransferFormat): Promise<void>;
    send(data: any): Promise<void>;
    stop(): Promise<void>;
    private close;
    private isCloseEvent;
}
