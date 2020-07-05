import { BaseAvatar } from "./BaseAvatar.js";
import { Canvas } from "../html/tags.js";
import { width, height } from "../html/attrs.js";

export class PhotoAvatar extends BaseAvatar {

    /**
     * 
     * @param {(URL|string)} url
     */
    constructor(url) {
        super();

        /** @type {HTMLCanvasElement} */
        this.image = null;

        const img = new Image();
        img.addEventListener("load", (evt) => {
            this.image = Canvas(
                width(img.width),
                height(img.height));
            const g = this.image.getContext("2d");
            g.clearRect(0, 0, img.width, img.height);
            g.imageSmoothingEnabled = false;
            g.drawImage(img, 0, 0);
        });

        /** @type {string} */
        this.url
            = img.src
            = url && url.href || url;
    }

    draw(g, width, height) {
        if (this.image !== null) {
            const imageWidth = height * this.image.width / this.image.height;
            g.drawImage(
                this.image,
                (width - imageWidth) / 2, 0,
                imageWidth,
                height);
        }
    }
}