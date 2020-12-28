import { isFunction } from "../typeChecks";

export function errorLogger(err: any): void {
    const TK = (globalThis as any).TraceKit;
    if (TK && isFunction(TK.report)) {
        TK.report(err);
    }
    else {
        console.error(err);
    }
}