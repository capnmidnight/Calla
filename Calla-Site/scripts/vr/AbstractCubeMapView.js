import { BackSide, MeshBasicMaterial } from "three";
import { TexturedMesh } from "./TexturedMesh";

export class AbstractCubeMapView extends TexturedMesh {
    /**
     * @param {BoxBufferGeometry|SphereBufferGeometry} geom
     */
    constructor(geom) {
        const mat = new MeshBasicMaterial({ side: BackSide });
        super(geom, mat);
    }
}
