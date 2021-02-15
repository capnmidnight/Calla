import { IStreamResult, IStreamSubscriber, ISubscription } from "./Stream";
/** Stream implementation to stream items to the server. */
export declare class Subject<T> implements IStreamResult<T> {
    /** @internal */
    observers: Array<IStreamSubscriber<T>>;
    /** @internal */
    cancelCallback?: () => Promise<void>;
    constructor();
    next(item: T): void;
    error(err: any): void;
    complete(): void;
    subscribe(observer: IStreamSubscriber<T>): ISubscription<T>;
}
