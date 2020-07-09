import { BaseAvatar } from "./BaseAvatar.js";
import { Canvas } from "../html/tags.js";
import { width, height } from "../html/attrs.js";

export class PhotoAvatar extends BaseAvatar {

    /**
     * 
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
     * 
     * @param {CanvasRenderingContext2D} g
     * @param {any} width
     * @param {any} height
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