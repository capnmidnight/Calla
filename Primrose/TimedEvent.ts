import { TypedEvent, TypedEventBase } from "kudzu/events/EventBase";

export class TimedEvent extends TypedEventBase<{
    tick: TypedEvent<"tick">;
}>{
    cancel: () => any;
    start: () => void;

    private handle: number = null;

    constructor(timeout: number) {
        super();

        const tickEvt = new TypedEvent("tick");

        this.cancel = () => {
            const wasRunning = this.isRunning;
            if (wasRunning) {
                clearTimeout(this.handle);
                this.handle = null;
            }

            return wasRunning;
        };

        const tick = () => {
            this.cancel();
            this.dispatchEvent(tickEvt);
        };

        this.start = () => {
            this.cancel();
            this.handle = setTimeout(tick, timeout);
        };

        Object.freeze(this);
    }

    get isRunning() {
        return this.handle !== null;
    }
}