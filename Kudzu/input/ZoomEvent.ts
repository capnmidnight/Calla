export class ZoomEvent extends Event {
    dz: number = 0;

    constructor() {
        super("zoom");
        Object.seal(this);
    }

    set(dz: number) {
        this.dz = dz;
    }
}
