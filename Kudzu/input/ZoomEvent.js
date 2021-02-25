export class ZoomEvent extends Event {
    constructor(_dz) {
        super("zoom");
        this._dz = _dz;
        Object.seal(this);
    }
    get dz() {
        return this._dz;
    }
}
//# sourceMappingURL=ZoomEvent.js.map