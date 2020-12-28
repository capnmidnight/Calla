import { isGoodNumber, isString } from "../typeChecks";
import { add } from "./add";
export function once(target, resolveEvt, rejectEvt, timeout) {
    if (timeout == null
        && isGoodNumber(rejectEvt)) {
        timeout = rejectEvt;
        rejectEvt = undefined;
    }
    const hasResolveEvt = isString(resolveEvt);
    const hasRejectEvt = isString(rejectEvt);
    const hasTimeout = timeout != null;
    return new Promise((resolve, reject) => {
        if (hasResolveEvt) {
            const remove = () => {
                target.removeEventListener(resolveEvt, resolve);
            };
            resolve = add(remove, resolve);
            reject = add(remove, reject);
        }
        if (hasRejectEvt) {
            const remove = () => {
                target.removeEventListener(rejectEvt, reject);
            };
            resolve = add(remove, resolve);
            reject = add(remove, reject);
        }
        if (hasTimeout) {
            const timer = setTimeout(reject, timeout, `'${resolveEvt}' has timed out.`), cancel = () => clearTimeout(timer);
            resolve = add(cancel, resolve);
            reject = add(cancel, reject);
        }
        if (hasResolveEvt) {
            target.addEventListener(resolveEvt, resolve);
        }
        if (hasRejectEvt) {
            target.addEventListener(rejectEvt, () => {
                reject("Rejection event found");
            });
        }
    });
}
;
//# sourceMappingURL=once.js.map