export class MockAudioContext {
    constructor() {
        this._t = Date.now() / 1000;
    }
    get currentTime() {
        return Date.now() / 1000 - this._t;
    }
}
