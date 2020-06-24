export class CallaEvent extends Event {
    constructor(data) {
        super(data.command);
        Object.assign(this, data.value);
    }
}

export class CallaUserEvent extends CallaEvent {
    constructor(id, data) {
        super(data);
        this.id = id;
    }
}