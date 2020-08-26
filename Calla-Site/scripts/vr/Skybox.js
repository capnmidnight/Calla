import { BackSide, BoxBufferGeometry, Mesh, MeshBasicMaterial, Texture } from "three";
import { isString } from "../calla";
import { Img } from "../html/tags";
import { setGeometryUVsForCubemaps } from "./setGeometryUVsForCubemaps";

export class Skybox extends Mesh {
    /**
     *
     * @param {PerspectiveCamera} camera
     */
    constructor(camera) {
        const dim = Math.sqrt(camera.far * camera.far / 3);
        const geom = new BoxBufferGeometry(dim, dim, dim, 1, 1, 1);
        setGeometryUVsForCubemaps(geom);
        const mat = new MeshBasicMaterial({ side: BackSide });
        super(geom, mat);

        this.camera = camera;
        this.isVideo = false;
    }

    /**
     *
     * @param {HTMLImageElement|HTMLCanvasElement|HTMLVideoElement|string} img
     */
    setImage(img) {
        if (isString(img)) {
            img = Img(src(img));
        }

        if (img instanceof HTMLImageElement) {
            img.addEventListener("load", () => this.updateTexture());
        }

        this.material.map = new Texture(img);
    }

    updateTexture() {
        this.material.map.needsUpdate = true;
    }

    update() {
        if (this.isVideo) {
            this.updateTexture();
        }

        this.position.copy(this.camera.position);
    }
}
