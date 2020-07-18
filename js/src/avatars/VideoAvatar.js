import { BaseAvatar } from "./BaseAvatar.js";

/**
 * An avatar that uses an HTML Video element as its representation.
 **/
export class VideoAvatar extends BaseAvatar {
    /**
     * Creates a new avatar that uses an HTML Video element as its representation.
     * @param {HTMLVideoElement} video
     */
    constructor(video) {
        super(video);
        this.element.play();
        this.element
            .once("canplay")
            .then(() => this.element.play());
    }

    /**
     * Render the avatar at a certain size.
     * @param {CanvasRenderingContext2D} g - the context to render to
     * @param {number} width - the width the avatar should be rendered at
     * @param {number} height - the height the avatar should be rendered at.
     * @param {boolean} isMe - whether the avatar is the local user
     */
    draw(g, width, height, isMe) {
        if (this.element !== null) {
            const offset = (this.element.videoWidth - this.element.videoHeight) / 2,
                sx = Math.max(0, offset),
                sy = Math.max(0, -offset),
                dim = Math.min(this.element.videoWidth, this.element.videoHeight),
                hWidth = width / 2;

            g.save();
            {
                g.translate(hWidth, 0);
                if (isMe) {
                    g.scale(-1, 1);
                }
                g.drawImage(
                    this.element,
                    sx, sy,
                    dim, dim,
                    -hWidth, 0,
                    width, height);
            }
            g.restore();
        }
    }
}