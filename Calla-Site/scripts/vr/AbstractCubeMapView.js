import { BackSide, Mesh, MeshBasicMaterial, Texture } from "three";
import { isString, once } from "../calla";
import { src } from "../html/attrs";
import { Img } from "../html/tags";

export class AbstractCubeMapView extends Mesh {
    /**
     * @param {BoxBufferGeometry|SphereBufferGeometry} geom
     */
    constructor(geom) {
        const mat = new MeshBasicMaterial({ side: BackSide });
        super(geom, mat);
        this.isVideo = false;
    }

    /**
     *
     * @param {HTMLImageElement|HTMLCanvasElement|HTMLVideoElement|string|Texture} img
     */
    async setImage(img) {
        if (isString(img)) {
            img = Img(src(img));
        }

        if (img instanceof HTMLImageElement && !img.complete) {
            await once(img, "load", "error", 10000);
        }

        if (!(img instanceof Texture)) {
            img = new Texture(img);
        }

        this.material.map = img;
        img = this.material.map.image;
        console.log(img);
        this.isVideo = img instanceof HTMLVideoElement;
        this.updateTexture();
    }

    updateTexture() {
        if (this.material && this.material.map) {
            this.material.map.needsUpdate = true;
        }
    }

    update() {
        if (this.isVideo) {
            this.updateTexture();
        }
    }
}
