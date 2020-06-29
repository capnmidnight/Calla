import { WebAudioNodePosition } from "./WebAudioNodePosition.js";

export class WebAudioNewListenerPosition extends WebAudioNodePosition {
    constructor(node) {
        super(node);
        this.node.forwardX.setValueAtTime(0, 0);
        this.node.forwardY.setValueAtTime(0, 0);
        this.node.forwardZ.setValueAtTime(-1, 0);
        this.node.upX.setValueAtTime(0, 0);
        this.node.upY.setValueAtTime(1, 0);
        this.node.upZ.setValueAtTime(0, 0);
    }
}
