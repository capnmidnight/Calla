/**
 * 
 * @param {EventBase|EventTarget} target
 * @param {any} obj
 */
export function addEventListeners(target, obj) {
    for (let evtName in obj) {
        let callback = obj[evtName];
        let opts = undefined;
        if (callback instanceof Array) {
            opts = callback[1];
            callback = callback[0];
        }

        target.addEventListener(evtName, callback, opts);
    }
};