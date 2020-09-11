import { AbstractCubeMapView } from "./AbstractCubeMapView";
import { invCube } from "./Cube";

export class Skybox extends AbstractCubeMapView {
    /**
     * @param {import("three").PerspectiveCamera} camera
     */
    constructor(camera) {
        super(invCube);

        this.camera = camera;
        const dim = Math.sqrt(camera.far * camera.far / 3);
        this.scale.set(dim, dim, dim);
    }

    update() {
        super.update();
        this.camera.getWorldPosition(this.position);
    }
}
