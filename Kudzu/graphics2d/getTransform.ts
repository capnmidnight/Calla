import type { Context2D } from "../html/canvas";

let _getTransform: (g: Context2D) => DOMMatrix;

if (!Object.prototype.hasOwnProperty.call(CanvasRenderingContext2D.prototype, "getTransform")
    && Object.prototype.hasOwnProperty.call(CanvasRenderingContext2D.prototype, "mozCurrentTransform")) {

    interface MozCurrentTransformMixin {
        mozCurrentTransform: number[];
    }

    type MozCanvasRenderingContext2D = Context2D
        & MozCurrentTransformMixin;

    class MockDOMMatrix {
        a: number;
        b: number;
        c: number;
        d: number;
        e: number;
        f: number;

        constructor(trans: number[]) {
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

        transformPoint(p?: DOMPointInit) {
            if (p !== undefined
                && p.x !== undefined
                && p.y !== undefined) {
                return {
                    x: p.x * this.a + p.y * this.c + this.e,
                    y: p.x * this.b + p.y * this.d + this.f
                } as DOMPoint
            }
            else {
                return null;
            }
        }
    }

    _getTransform = (g: Context2D) => {
        const mozG = g as MozCanvasRenderingContext2D;
        return new MockDOMMatrix(mozG.mozCurrentTransform) as DOMMatrix;
    }
}
else {
    _getTransform = (g: Context2D) => {
        return g.getTransform();
    }
}

export function getTransform(g: Context2D) {
    return _getTransform(g);
}