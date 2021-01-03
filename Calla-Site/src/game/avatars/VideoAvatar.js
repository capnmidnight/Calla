import { once } from "kudzu/events/once";
import { autoPlay, muted, playsInline, srcObject, volume } from "kudzu/html/attrs";
import { setContextSize } from "kudzu/html/canvas";
import { isIOS } from "kudzu/html/flags";
import { Video } from "kudzu/html/tags";
import { AvatarMode } from "./AvatarMode";
import { BaseAvatar, BaseAvatarChangedEvent } from "./BaseAvatar";
export class VideoAvatarChangedEvent extends BaseAvatarChangedEvent {
    constructor(video) {
        super(AvatarMode.Video, video);
    }
}
/**
 * An avatar that uses an HTML Video element as its representation.
 **/
export class VideoAvatar extends BaseAvatar {
    /**
     * Creates a new avatar that uses a MediaStream as its representation.
     */
    constructor(stream) {
        super(AvatarMode.Video, false);
        if (stream instanceof HTMLVideoElement) {
            this.video = stream;
        }
        else if (stream instanceof MediaStream) {
            this.video = Video(autoPlay, playsInline, muted, volume(0), srcObject(stream));
        }
        else {
            throw new Error("Can only create a video avatar from an HTMLVideoElement or MediaStream.");
        }
        if (!isIOS) {
            this.video.play();
            once(this.video, "canplay")
                .then(() => this.video.play());
        }
    }
    /**
     * Render the avatar at a certain size.
     * @param g - the context to render to
     * @param width - the width the avatar should be rendered at
     * @param height - the height the avatar should be rendered at.
     * @param isMe - whether the avatar is the local user
     */
    draw(g, width, height, isMe) {
        if (this.video.videoWidth > 0
            && this.video.videoHeight > 0) {
            const offset = (this.video.videoWidth - this.video.videoHeight) / 2, sx = Math.max(0, offset), sy = Math.max(0, -offset), dim = Math.min(this.video.videoWidth, this.video.videoHeight);
            setContextSize(this.g, dim, dim);
            this.g.save();
            if (isMe) {
                this.g.translate(dim, 0);
                this.g.scale(-1, 1);
            }
            this.g.drawImage(this.video, sx, sy, dim, dim, 0, 0, dim, dim);
            this.g.restore();
        }
        super.draw(g, width, height, isMe);
    }
}
//# sourceMappingURL=VideoAvatar.js.map