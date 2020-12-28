export class ZoomEvent extends Event {
    constructor() {
        super("zoom");
        this.dz = 0;
        Object.seal(this);
    }
    set(dz) {
        this.dz = dz;
    }
}
//# sourceMappingURL=ZoomEvent.js.map