import { DebugObject } from "../graphics3d/DebugObject";

export class PlaybackButton extends DebugObject {
    constructor(audioTrack) {
        super(0x00ff00);
        this.name = "play-" + audioTrack.fileName;
    }
}
