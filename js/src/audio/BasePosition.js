
export class BasePosition {
    get x() {
        throw new Error("Not implemented in base class.");
    }

    get y() {
        throw new Error("Not implemented in base class.");
    }

    setTarget(x, y, t, dt) {
        throw new Error("Not implemented in base class.");
    }

    update(t) {
    }
}

