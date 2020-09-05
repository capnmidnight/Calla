import { isFunction } from "./typeChecks";

export function errorLogger(err) {
    if (window.TraceKit && isFunction(window.TraceKit.report)) {
        window.TraceKit.report(err);
    }
    else {
        console.error(err);
    }
}