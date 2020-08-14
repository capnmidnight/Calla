import { isFunction } from "./typeChecks.js";

export function errorLogger(err) {
    if (window.TraceKit && isFunction(window.TraceKit.report)) {
        window.TraceKit.report(err);
    }
    else {
        console.error(err);
    }
}