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
            this.video.play();
            const videoWidth = height * this.video.videoWidth / this.video.videoHeight;
            g.drawImage(
                this.video,
                (width - videoWidth) / 2, 0,
                videoWidth,
                height);
        }
    }
}