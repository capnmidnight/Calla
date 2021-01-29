import type { ErsatzEventTarget } from "./ErsatzEventTarget";
import type { TypedEventBase } from "./EventBase";
/**
 * Wait for a specific event, one time.
 * @param target - the event target.
 * @param resolveEvt - the name of the event that will resolve the Promise this method creates.
 * @param [rejectEvt] - the name of the event that could reject the Promise this method creates.
 * @param [timeout] - the number of milliseconds to wait for the resolveEvt, before rejecting.
 */
export declare function once<EventBaseT, EventKeyT extends string & keyof EventBaseT, EventT extends Event & EventBaseT[EventKeyT]>(target: TypedEventBase<EventBaseT>, resolveEvt: EventKeyT, rejectEvt?: EventKeyT, timeout?: number): Promise<EventT>;
export declare function once(target: EventTarget, resolveEvt: string, rejectEvt?: string, timeout?: number): Promise<Event>;
export declare function once(target: ErsatzEventTarget, resolveEvt: string, rejectEvt?: string, timeout?: number): Promise<unknown>;
