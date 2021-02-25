export class ZoomEvent extends Event {
    constructor(private _dz: number) {
        super("zoom");
        Object.seal(this);
    }

    get dz() {
        return this._dz;
    }
}
