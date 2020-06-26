import { BasePosition } from "./BasePosition.js";

export class WebAudioNodePosition extends BasePosition {
    constructor(node) {
        super();

        this.node = node;
        this.node.positionX.setValueAtTime(0, 0);
        this.node.positionY.setValueAtTime(0, 0);
        this.node.positionZ.setValueAtTime(0, 0);
    }

    get x() {
        return this.node.positionX.value;
    }

    get y() {
        // our 2D position is in X/Y coords, but our 3D position
        // along the horizontal plane is X/Z coords.
        return this.node.positionZ.value;
    }

    setTarget(x, y, t, dt) {
        const time = t + dt;
        // our 2D position is in X/Y coords, but our 3D position
        // along the horizontal plane is X/Z coords.
        this.node.positionX.linearRampToValueAtTime(x, time);
        this.node.positionZ.linearRampToValueAtTime(y, time);
    }
}

