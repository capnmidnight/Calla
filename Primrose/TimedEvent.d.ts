import { TypedEvent, TypedEventBase } from "kudzu/events/EventBase";
export declare class TimedEvent extends TypedEventBase<{
    tick: TypedEvent<"tick">;
}> {
    cancel: () => any;
    start: () => void;
    private handle;
    constructor(timeout: number);
    get isRunning(): boolean;
}
