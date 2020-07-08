import { BaseAvatar } from "./BaseAvatar.js";

export class VideoAvatar extends BaseAvatar {
    /**
     * 
     * @param {HTMLVideoElement} video
     */
    constructor(video) {
        super();
        this.video = video;
        this.video.play();
        this.video
            .once("canplay")
            .then(() => this.video.play());
    }

    draw(g, width, height) {
        if (this.video !== null) {
            const offset = (this.video.videoWidth - this.video.videoHeight) / 2,
                sx = Math.max(0, offset),
                sy = Math.max(0, -offset),
                dim = Math.min(this.video.videoWidth, this.video.videoHeight);
            g.drawImage(
                this.video,
                sx, sy,
                dim, dim,
                0, 0,
                width, height);
        }
    }
}