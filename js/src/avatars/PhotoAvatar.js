import { BaseAvatar } from "./BaseAvatar.js";
import { Canvas } from "../html/tags.js";

/**
 * An avatar that uses an Image as its representation.
 **/
export class PhotoAvatar extends BaseAvatar {

    /**
     * Creates a new avatar that uses an Image as its representation.
     * @param {(URL|string)} url
     */
    constructor(url) {
        super(Canvas());

        /** @type {HTMLCanvasElement} */
        this.element = null;

        const img = new Image();
        img.addEventListener("load", (evt) => {
            this.element.width = img.width;
            this.element.height = img.height;
            const g = this.element.getContext("2d");
            g.clearRect(0, 0, img.width, img.height);
            g.imageSmoothingEnabled = false;
            g.drawImage(img, 0, 0);
        });

        /** @type {string} */
        this.url
            = img.src
            = url && url.href || url;
    }

    /**
     * Render the avatar at a certain size.
     * @param {CanvasRenderingContext2D} g
     * @param {number} width
     * @param {number} height
     */
    draw(g, width, height) {
        const offset = (this.element.width - this.element.height) / 2,
            sx = Math.max(0, offset),
            sy = Math.max(0, -offset),
            dim = Math.min(this.element.width, this.element.height);
        g.drawImage(
            this.element,
            sx, sy,
            dim, dim,
            0, 0,
            width, height);
    }
}