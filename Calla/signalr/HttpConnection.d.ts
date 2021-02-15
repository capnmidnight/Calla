import { IConnection } from "./IConnection";
import { IHttpConnectionOptions } from "./IHttpConnectionOptions";
import { HttpTransportType, ITransport, TransferFormat } from "./ITransport";
/** @private */
export interface INegotiateResponse {
    connectionId?: string;
    connectionToken?: string;
    negotiateVersion?: number;
    availableTransports?: IAvailableTransport[];
    url?: string;
    accessToken?: string;
    error?: string;
}
/** @private */
export interface IAvailableTransport {
    transport: keyof typeof HttpTransportType;
    transferFormats: Array<keyof typeof TransferFormat>;
}
/** @private */
export declare class HttpConnection implements IConnection {
    private connectionState;
    private connectionStarted;
    private readonly httpClient;
    private readonly logger;
    private readonly options;
    private transport?;
    private startInternalPromise?;
    private stopPromise?;
    private stopPromiseResolver;
    private stopError?;
    private accessTokenFactory?;
    private sendQueue?;
    readonly features: any;
    baseUrl: string;
    connectionId?: string;
    onreceive: ((data: string | ArrayBuffer) => void) | null;
    onclose: ((e?: Error) => void) | null;
    private readonly negotiateVersion;
    constructor(url: string, options?: IHttpConnectionOptions);
    start(): Promise<void>;
    start(transferFormat: TransferFormat): Promise<void>;
    send(data: string | ArrayBuffer): Promise<void>;
    stop(error?: Error): Promise<void>;
    private stopInternal;
    private startInternal;
    private getNegotiationResponse;
    private createConnectUrl;
    private createTransport;
    private constructTransport;
    private startTransport;
    private resolveTransportOrError;
    private isITransport;
    private stopConnection;
    private resolveUrl;
    private resolveNegotiateUrl;
}
/** @private */
export declare class TransportSendQueue {
    private readonly transport;
    private buffer;
    private sendBufferedData;
    private executing;
    private transportResult?;
    private sendLoopPromise;
    constructor(transport: ITransport);
    send(data: string | ArrayBuffer): Promise<void>;
    stop(): Promise<void>;
    private bufferData;
    private sendLoop;
    private static concatBuffers;
}
