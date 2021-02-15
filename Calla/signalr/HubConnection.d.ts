import { IConnection } from "./IConnection";
import { IHubProtocol } from "./IHubProtocol";
import { ILogger } from "./ILogger";
import { IRetryPolicy } from "./IRetryPolicy";
import { IStreamResult } from "./Stream";
/** Describes the current state of the {@link HubConnection} to the server. */
export declare enum HubConnectionState {
    /** The hub connection is disconnected. */
    Disconnected = "Disconnected",
    /** The hub connection is connecting. */
    Connecting = "Connecting",
    /** The hub connection is connected. */
    Connected = "Connected",
    /** The hub connection is disconnecting. */
    Disconnecting = "Disconnecting",
    /** The hub connection is reconnecting. */
    Reconnecting = "Reconnecting"
}
/** Represents a connection to a SignalR Hub. */
export declare class HubConnection {
    private readonly cachedPingMessage;
    private readonly connection;
    private readonly logger;
    private readonly reconnectPolicy?;
    private protocol;
    private handshakeProtocol;
    private callbacks;
    private methods;
    private invocationId;
    private closedCallbacks;
    private reconnectingCallbacks;
    private reconnectedCallbacks;
    private receivedHandshakeResponse;
    private handshakeResolver;
    private handshakeRejecter;
    private stopDuringStartError?;
    private connectionState;
    private connectionStarted;
    private startPromise?;
    private stopPromise?;
    private reconnectDelayHandle?;
    private timeoutHandle?;
    private pingServerHandle?;
    /** The server timeout in milliseconds.
     *
     * If this timeout elapses without receiving any messages from the server, the connection will be terminated with an error.
     * The default timeout value is 30,000 milliseconds (30 seconds).
     */
    serverTimeoutInMilliseconds: number;
    /** Default interval at which to ping the server.
     *
     * The default value is 15,000 milliseconds (15 seconds).
     * Allows the server to detect hard disconnects (like when a client unplugs their computer).
     */
    keepAliveIntervalInMilliseconds: number;
    /** @internal */
    static create(connection: IConnection, logger: ILogger, protocol: IHubProtocol, reconnectPolicy?: IRetryPolicy): HubConnection;
    private constructor();
    /** Indicates the state of the {@link HubConnection} to the server. */
    get state(): HubConnectionState;
    /** Represents the connection id of the {@link HubConnection} on the server. The connection id will be null when the connection is either
     *  in the disconnected state or if the negotiation step was skipped.
     */
    get connectionId(): string | null;
    /** Indicates the url of the {@link HubConnection} to the server. */
    get baseUrl(): string;
    /**
     * Sets a new url for the HubConnection. Note that the url can only be changed when the connection is in either the Disconnected or
     * Reconnecting states.
     * @param {string} url The url to connect to.
     */
    set baseUrl(url: string);
    /** Starts the connection.
     *
     * @returns {Promise<void>} A Promise that resolves when the connection has been successfully established, or rejects with an error.
     */
    start(): Promise<void>;
    private startWithStateTransitions;
    private startInternal;
    /** Stops the connection.
     *
     * @returns {Promise<void>} A Promise that resolves when the connection has been successfully terminated, or rejects with an error.
     */
    stop(): Promise<void>;
    private stopInternal;
    /** Invokes a streaming hub method on the server using the specified name and arguments.
     *
     * @typeparam T The type of the items returned by the server.
     * @param {string} methodName The name of the server method to invoke.
     * @param {any[]} args The arguments used to invoke the server method.
     * @returns {IStreamResult<T>} An object that yields results from the server as they are received.
     */
    stream<T = any>(methodName: string, ...args: any[]): IStreamResult<T>;
    private sendMessage;
    /**
     * Sends a js object to the server.
     * @param message The js object to serialize and send.
     */
    private sendWithProtocol;
    /** Invokes a hub method on the server using the specified name and arguments. Does not wait for a response from the receiver.
     *
     * The Promise returned by this method resolves when the client has sent the invocation to the server. The server may still
     * be processing the invocation.
     *
     * @param {string} methodName The name of the server method to invoke.
     * @param {any[]} args The arguments used to invoke the server method.
     * @returns {Promise<void>} A Promise that resolves when the invocation has been successfully sent, or rejects with an error.
     */
    send(methodName: string, ...args: any[]): Promise<void>;
    /** Invokes a hub method on the server using the specified name and arguments.
     *
     * The Promise returned by this method resolves when the server indicates it has finished invoking the method. When the promise
     * resolves, the server has finished invoking the method. If the server method returns a result, it is produced as the result of
     * resolving the Promise.
     *
     * @typeparam T The expected return type.
     * @param {string} methodName The name of the server method to invoke.
     * @param {any[]} args The arguments used to invoke the server method.
     * @returns {Promise<T>} A Promise that resolves with the result of the server method (if any), or rejects with an error.
     */
    invoke<T = any>(methodName: string, ...args: any[]): Promise<T>;
    /** Registers a handler that will be invoked when the hub method with the specified method name is invoked.
     *
     * @param {string} methodName The name of the hub method to define.
     * @param {Function} newMethod The handler that will be raised when the hub method is invoked.
     */
    on(methodName: string, newMethod: (...args: any[]) => void): void;
    /** Removes all handlers for the specified hub method.
     *
     * @param {string} methodName The name of the method to remove handlers for.
     */
    off(methodName: string): void;
    /** Removes the specified handler for the specified hub method.
     *
     * You must pass the exact same Function instance as was previously passed to {@link @microsoft/signalr.HubConnection.on}. Passing a different instance (even if the function
     * body is the same) will not remove the handler.
     *
     * @param {string} methodName The name of the method to remove handlers for.
     * @param {Function} method The handler to remove. This must be the same Function instance as the one passed to {@link @microsoft/signalr.HubConnection.on}.
     */
    off(methodName: string, method: (...args: any[]) => void): void;
    /** Registers a handler that will be invoked when the connection is closed.
     *
     * @param {Function} callback The handler that will be invoked when the connection is closed. Optionally receives a single argument containing the error that caused the connection to close (if any).
     */
    onclose(callback: (error?: Error) => void): void;
    /** Registers a handler that will be invoked when the connection starts reconnecting.
     *
     * @param {Function} callback The handler that will be invoked when the connection starts reconnecting. Optionally receives a single argument containing the error that caused the connection to start reconnecting (if any).
     */
    onreconnecting(callback: (error?: Error) => void): void;
    /** Registers a handler that will be invoked when the connection successfully reconnects.
     *
     * @param {Function} callback The handler that will be invoked when the connection successfully reconnects.
     */
    onreconnected(callback: (connectionId?: string) => void): void;
    private processIncomingData;
    private processHandshakeResponse;
    private resetKeepAliveInterval;
    private resetTimeoutPeriod;
    private serverTimeout;
    private invokeClientMethod;
    private connectionClosed;
    private completeClose;
    private reconnect;
    private getNextRetryDelay;
    private cancelCallbacksWithError;
    private cleanupPingTimer;
    private cleanupTimeout;
    private createInvocation;
    private launchStreams;
    private replaceStreamingParams;
    private isObservable;
    private createStreamInvocation;
    private createCancelInvocation;
    private createStreamItemMessage;
    private createCompletionMessage;
}
