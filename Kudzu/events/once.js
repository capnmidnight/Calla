import { isGoodNumber, isString } from "../typeChecks";
import { add } from "./add";
export function once(target, resolveEvt, rejectEvt, timeout) {
    if (timeout == null
        && isGoodNumber(rejectEvt)) {
        timeout = rejectEvt;
        rejectEvt = undefined;
    }
    const hasTimeout = timeout != null;
    return new Promise((resolve, reject) => {
        const remove = () => {
            target.removeEventListener(resolveEvt, resolve);
        };
        resolve = add(remove, resolve);
        reject = add(remove, reject);
        if (isString(rejectEvt)) {
            const rejectEvt2 = rejectEvt;
            const remove = () => {
                target.removeEventListener(rejectEvt2, reject);
            };
            resolve = add(remove, resolve);
            reject = add(remove, reject);
        }
        if (hasTimeout) {
            const timer = setTimeout(reject, timeout, `'${resolveEvt}' has timed out.`), cancel = () => clearTimeout(timer);
            resolve = add(cancel, resolve);
            reject = add(cancel, reject);
        }
        target.addEventListener(resolveEvt, resolve);
        if (isString(rejectEvt)) {
            target.addEventListener(rejectEvt, () => {
                reject("Rejection event found");
            });
        }
    });
}
;
//# sourceMappingURL=once.js.map