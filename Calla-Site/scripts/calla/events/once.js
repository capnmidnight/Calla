import { isGoodNumber, isNumber, isString } from "../typeChecks";
import { add } from "./add";

/**
 * Wait for a specific event, one time.
 * @param {import("./EventBase").EventBase|EventTarget} target - the event target.
 * @param {string} resolveEvt - the name of the event that will resolve the Promise this method creates.
 * @param {string} rejectEvt - the name of the event that could reject the Promise this method creates.
 * @param {number} timeout - the number of milliseconds to wait for the resolveEvt, before rejecting.
 */
export function once(target, resolveEvt, rejectEvt, timeout) {

    if (timeout === undefined
        && isGoodNumber(rejectEvt)) {
        timeout = rejectEvt;
        rejectEvt = undefined;
    }

    return new Promise((resolve, reject) => {
        const hasResolveEvt = isString(resolveEvt);
        if (hasResolveEvt) {
            const oldResolve = resolve;
            const remove = () => {
                target.removeEventListener(resolveEvt, oldResolve);
            };
            resolve = add(remove, resolve);
            reject = add(remove, reject);
        }

        const hasRejectEvt = isString(rejectEvt);
        if (hasRejectEvt) {
            const oldReject = reject;
            const remove = () => {
                target.removeEventListener(rejectEvt, oldReject);
            };

            resolve = add(remove, resolve);
            reject = add(remove, reject);
        }

        if (isNumber(timeout)) {
            const timer = setTimeout(reject, timeout, `'${resolveEvt}' has timed out.`),
                cancel = () => clearTimeout(timer);
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
};