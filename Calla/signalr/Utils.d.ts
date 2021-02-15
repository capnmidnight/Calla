import { HttpClient } from "./HttpClient";
import { MessageHeaders } from "./IHubProtocol";
import { ILogger, LogLevel } from "./ILogger";
import { IStreamSubscriber, ISubscription } from "./Stream";
import { Subject } from "./Subject";
/** The version of the SignalR client. */
export declare const VERSION: string;
/** @private */
export declare class Arg {
    static isRequired(val: any, name: string): void;
    static isNotEmpty(val: string, name: string): void;
    static isIn(val: any, values: any, name: string): void;
}
/** @private */
export declare class Platform {
    static get isBrowser(): boolean;
    static get isWebWorker(): boolean;
}
/** @private */
export declare function getDataDetail(data: any, includeContent: boolean): string;
/** @private */
export declare function formatArrayBuffer(data: ArrayBuffer): string;
/** @private */
export declare function isArrayBuffer(val: any): val is ArrayBuffer;
/** @private */
export declare function sendMessage(logger: ILogger, transportName: string, httpClient: HttpClient, url: string, accessTokenFactory: (() => string | Promise<string>) | undefined, content: string | ArrayBuffer, logMessageContent: boolean, withCredentials: boolean, defaultHeaders: MessageHeaders): Promise<void>;
/** @private */
export declare function createLogger(logger?: ILogger | LogLevel): ILogger;
/** @private */
export declare class SubjectSubscription<T> implements ISubscription<T> {
    private subject;
    private observer;
    constructor(subject: Subject<T>, observer: IStreamSubscriber<T>);
    dispose(): void;
}
/** @private */
export declare class ConsoleLogger implements ILogger {
    private readonly minimumLogLevel;
    outputConsole: {
        error(message: any): void;
        warn(message: any): void;
        info(message: any): void;
        log(message: any): void;
    };
    constructor(minimumLogLevel: LogLevel);
    log(logLevel: LogLevel, message: string): void;
}
/** @private */
export declare function getUserAgentHeader(): [string, string];
/** @private */
export declare function constructUserAgent(version: string, os: string, runtime: string, runtimeVersion: string | undefined): string;
