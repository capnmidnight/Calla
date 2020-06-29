export class MockAudioContext {
    constructor() {
        this._t = performance.now() / 1000;
    }

    get currentTime() {
        return performance.now() / 1000 - this._t;
    }
}
