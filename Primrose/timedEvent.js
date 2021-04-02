import { TypedEvent, TypedEventBase } from "kudzu/events/EventBase";
export class TimedEvent extends TypedEventBase {
    constructor(timeout) {
        super();
        this.handle = null;
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
//# sourceMappingURL=TimedEvent.js.map