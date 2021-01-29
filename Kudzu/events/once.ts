import { isGoodNumber, isString } from "../typeChecks";
import { add } from "./add";
import type { ErsatzEventTarget } from "./ErsatzEventTarget";
import type { EventBase, TypedEventBase } from "./EventBase";

/**
 * Wait for a specific event, one time.
 * @param target - the event target.
 * @param resolveEvt - the name of the event that will resolve the Promise this method creates.
 * @param [rejectEvt] - the name of the event that could reject the Promise this method creates.
 * @param [timeout] - the number of milliseconds to wait for the resolveEvt, before rejecting.
 */
export function once<EventBaseT, EventKeyT extends string & keyof EventBaseT, EventT extends Event & EventBaseT[EventKeyT]>(target: TypedEventBase<EventBaseT>, resolveEvt: EventKeyT, rejectEvt?: EventKeyT, timeout?: number): Promise<EventT>;
export function once(target: EventTarget, resolveEvt: string, rejectEvt?: string, timeout?: number): Promise<Event>;
export function once(target: ErsatzEventTarget, resolveEvt: string, rejectEvt?: string, timeout?: number): Promise<unknown>;
export function once(target: (EventBase | EventTarget | ErsatzEventTarget), resolveEvt: string, rejectEvt?: string, timeout?: number): Promise<any> {

    if (timeout == null
        && isGoodNumber(rejectEvt)) {
        timeout = rejectEvt;
        rejectEvt = undefined;
    }

    const hasTimeout = timeout != null;

    return new Promise((resolve: (value: any) => void, reject) => {
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
            const timer = setTimeout(reject, timeout, `'${resolveEvt}' has timed out.`),
                cancel = () => clearTimeout(timer);
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
};