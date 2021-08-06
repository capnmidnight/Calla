import { waitFor } from "kudzu/events/waitFor";
export var ConnectionState;
(function (ConnectionState) {
    ConnectionState["Disconnected"] = "Disconnected";
    ConnectionState["Connecting"] = "Connecting";
    ConnectionState["Connected"] = "Connected";
    ConnectionState["Disconnecting"] = "Disconnecting";
})(ConnectionState || (ConnectionState = {}));
async function settleState(getState, act, target, movingToTarget, leavingTarget, antiTarget) {
    if (getState() === movingToTarget) {
        await waitFor(() => getState() === target);
    }
    else {
        if (getState() === leavingTarget) {
            await waitFor(() => getState() === antiTarget);
        }
        if (getState() === antiTarget) {
            await act();
        }
    }
}
export function settleStateUp(getState, act) {
    return settleState(getState, act, ConnectionState.Connected, ConnectionState.Connecting, ConnectionState.Disconnecting, ConnectionState.Disconnected);
}
export function settleStateDown(getState, act) {
    return settleState(getState, act, ConnectionState.Disconnected, ConnectionState.Disconnecting, ConnectionState.Connecting, ConnectionState.Connected);
}
//# sourceMappingURL=ConnectionState.js.map