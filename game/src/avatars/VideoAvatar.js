import { once } from "../../lib/Calla.js";
import { autoPlay, muted, playsInline, srcObject, volume } from "../html/attrs.js";
import { setContextSize } from "../html/canvas.js";
import { isIOS } from "../html/flags.js";
import { Video } from "../html/tags.js";
import { BaseAvatar } from "./BaseAvatar.js";

/**
 * An avatar that uses an HTML Video element as its representation.
 **/
export class VideoAvatar extends BaseAvatar {
    /**
     * Creates a new avatar that uses a MediaStream as its representation.
     * @param {MediaStream|HTMLVideoElement} stream
     */
    constructor(stream) {
        super(false);

        let video = null;
        if (stream instanceof HTMLVideoElement) {
            video = stream;
        }
        else if (stream instanceof MediaStream) {
            video = Video(
                autoPlay,
                playsInline,
                muted,
                volume(0),
                srcObject(stream));
        }
        else {
            throw new Error("Can only create a video avatar from an HTMLVideoElement or MediaStream.");
        }

        this.video = video;

        if (!isIOS) {
            video.play();
            once(video, "canplay")
                .then(() => video.play());
        }
    }

    /**
     * Render the avatar at a certain size.
     * @param {CanvasRenderingContext2D} g - the context to render to
     * @param {number} width - the width the avatar should be rendered at
     * @param {number} height - the height the avatar should be rendered at.
     * @param {boolean} isMe - whether the avatar is the local user
     */
    draw(g, width, height, isMe) {
        if (this.video.videoWidth > 0
            && this.video.videoHeight > 0) {
            const offset = (this.video.videoWidth - this.video.videoHeight) / 2,
                sx = Math.max(0, offset),
                sy = Math.max(0, -offset),
                dim = Math.min(this.video.videoWidth, this.video.videoHeight);
            setContextSize(this.g, dim, dim);
            this.g.save();
            if (isMe) {
                this.g.translate(dim, 0);
                this.g.scale(-1, 1);
            }
            this.g.drawImage(
                this.video,
                sx, sy,
                dim, dim,
                0, 0,
                dim, dim)
            this.g.restore();
        }

        super.draw(g, width, height, isMe);
    }
}