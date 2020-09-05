import { isFunction, isNumber, isString } from "../typeChecks";
import { add } from "./add";

/**
 * 
 * @param {import("./EventBase").EventBase|EventTarget} target
 * @param {string} resolveEvt
 * @param {Function} filterTest
 * @param {number?} timeout
 */
export function when(target, resolveEvt, filterTest, timeout) {

    if (!isString(resolveEvt)) {
        throw new Error("Need an event name on which to resolve the operation.");
    }

    if (!isFunction(filterTest)) {
        throw new Error("Filtering tests function is required. Otherwise, use `once`.");
    }

    return new Promise((resolve, reject) => {
        const remove = () => {
            target.removeEventListener(resolveEvt, resolve);
        };

        resolve = add(remove, resolve);
        reject = add(remove, reject);

        if (isNumber(timeout)) {
            const timer = setTimeout(reject, timeout, `'${resolveEvt}' has timed out.`),
                cancel = () => clearTimeout(timer);
            resolve = add(cancel, resolve);
            reject = add(cancel, reject);
        }

        target.addEventListener(resolveEvt, resolve);
    });
}