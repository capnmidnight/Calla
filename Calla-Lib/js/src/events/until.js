import { EventBase } from "./EventBase.js";

/**
 * 
 * @param {EventBase|EventTarget} target
 * @param {string} untilEvt
 * @param {Function} callback
 * @param {Function} test
 * @param {number?} repeatTimeout
 * @param {number?} cancelTimeout
 */
export function until(target, untilEvt, callback, test, repeatTimeout, cancelTimeout) {
    return new Promise((resolve, reject) => {
        let timer = null,
            canceller = null;

        const cleanup = () => {
            if (timer !== null) {
                clearTimeout(timer);
            }

            if (canceller !== null) {
                clearTimeout(canceller);
            }

            target.removeEventListener(untilEvt, success);
        }

        function success(evt) {
            if (test(evt)) {
                cleanup();
                resolve(evt);
            }
        }

        target.addEventListener(untilEvt, success);

        if (repeatTimeout !== undefined) {
            if (cancelTimeout !== undefined) {
                canceller = setTimeout(() => {
                    cleanup();
                    reject(`'${untilEvt}' has timed out.`);
                }, cancelTimeout);
            }

            const repeater = () => {
                callback();
                timer = setTimeout(repeater, repeatTimeout);
            }

            timer = setTimeout(repeater, 0);
        }
    });
};