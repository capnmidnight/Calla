import "./protos.js";

export function copy(dest, evt) {
    for (let key in dest) {
        dest[key] = null;
        if (evt[key] !== undefined) {
            dest[key] = evt[key];
        }
    }

    return dest;
};

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