import { BoxBufferGeometry } from "three";
import { AbstractCubeMapView } from "./AbstractCubeMapView";
import { setGeometryUVsForCubemaps } from "./setGeometryUVsForCubemaps";

export class Skybox extends AbstractCubeMapView {
    /**
     * @param {PerspectiveCamera} camera
     */
    constructor(camera) {
        const dim = Math.sqrt(camera.far * camera.far / 3);
        const geom = new BoxBufferGeometry(dim, dim, dim, 1, 1, 1);
        setGeometryUVsForCubemaps(geom);
        super(geom);

        this.camera = camera;
    }

    update() {
        super.update();
        this.position.copy(this.camera.position);
    }
}
