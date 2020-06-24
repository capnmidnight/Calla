import "./protos.js";

export class CallaEvent extends Event {
    constructor(data) {
        super(data.command);
        Event.clone(this, data.value);
    }
}

export class CallaUserEvent extends CallaEvent {
    constructor(id, data) {
        super(data);
        this.id = id;
    }
}