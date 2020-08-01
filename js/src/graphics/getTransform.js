let _getTransform = null;

if (!Object.prototype.hasOwnProperty.call(CanvasRenderingContext2D.prototype, "getTransform")
    && Object.prototype.hasOwnProperty.call(CanvasRenderingContext2D.prototype, "mozCurrentTransform")) {

    class MockDOMMatrix {
        constructor(trans) {
            this.a = trans[0];
            this.b = trans[1];
            this.c = trans[2];
            this.d = trans[3];
            this.e = trans[4];
            this.f = trans[5];
        }

        get is2D() {
            return true;
        }

        get isIdentity() {
            return this.a === 1
                && this.b === 0
                && this.c === 0
                && this.d === 1
                && this.e === 0
                && this.f === 0;
        }

        transformPoint(p) {
            return {
                x: p.x * this.a + p.y * this.c + this.e,
                y: p.x * this.b + p.y * this.d + this.f
            }
        }
    }

    /**
     * @param {CanvasRenderingContext2D} g
     */
    _getTransform = (g) => {
        return new MockDOMMatrix(g.mozCurrentTransform);
    }
}
else {
    /**
     * @param {CanvasRenderingContext2D} g
     */
    _getTransform = (g) => {
        return getTransform(g);
    }
}

export function getTransform(g) {
    return _getTransform(g);
}