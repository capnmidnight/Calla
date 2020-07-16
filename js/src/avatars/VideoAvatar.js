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
     * @param {CanvasRenderingContext2D} g
     * @param {number} width
     * @param {number} height
     */
    draw(g, width, height) {
        if (this.element !== null) {
            const offset = (this.element.videoWidth - this.element.videoHeight) / 2,
                sx = Math.max(0, offset),
                sy = Math.max(0, -offset),
                dim = Math.min(this.element.videoWidth, this.element.videoHeight);
            g.drawImage(
                this.element,
                sx, sy,
                dim, dim,
                0, 0,
                width, height);
        }
    }
}