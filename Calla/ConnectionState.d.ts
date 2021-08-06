export declare enum ConnectionState {
    Disconnected = "Disconnected",
    Connecting = "Connecting",
    Connected = "Connected",
    Disconnecting = "Disconnecting"
}
export declare function settleStateUp(getState: () => ConnectionState, act: () => Promise<void>): Promise<void>;
export declare function settleStateDown(getState: () => ConnectionState, act: () => Promise<void>): Promise<void>;
