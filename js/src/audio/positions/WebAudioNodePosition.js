import { BasePosition } from "./BasePosition.js";
import { InterpolatedPosition } from "./InterpolatedPosition.js";

export class WebAudioNodePosition extends BasePosition {
    constructor(node, forceInterpolation) {
        super();
        this._p = forceInterpolation ? new InterpolatedPosition() : null;
        this.node = node;
        this.node.positionX.setValueAtTime(0, 0);
        this.node.positionY.setValueAtTime(0, 0);
        this.node.positionZ.setValueAtTime(0, 0);
    }

    get x() {
        return this.node.positionX.value;
    }

    get y() {
        return this.node.positionZ.value;
    }

    setTarget(evt, t, dt) {
        if (this._p) {
            this._p.setTarget(evt, t, dt);
        }
        else {
            const time = t + dt;
            // our 2D position is in X/Y coords, but our 3D position
            // along the horizontal plane is X/Z coords.
            this.node.positionX.linearRampToValueAtTime(evt.x, time);
            this.node.positionZ.linearRampToValueAtTime(evt.y, time);
        }
    }

    update(t) {
        if (this._p) {
            this._p.update(t);
            this.node.positionX.linearRampToValueAtTime(this._p.x, 0);
            this.node.positionZ.linearRampToValueAtTime(this._p.y, 0);
        }
    }
}

