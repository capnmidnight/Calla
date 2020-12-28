import { isFunction } from "../typeChecks";
export function errorLogger(err) {
    const TK = globalThis.TraceKit;
    if (TK && isFunction(TK.report)) {
        TK.report(err);
    }
    else {
        console.error(err);
    }
}
//# sourceMappingURL=errorLogger.js.map