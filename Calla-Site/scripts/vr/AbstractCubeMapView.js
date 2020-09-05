import { BackSide, MeshBasicMaterial } from "three";
import { TexturedMesh } from "./TexturedMesh";

export class AbstractCubeMapView extends TexturedMesh {
    /**
     * @param {import("three").BoxBufferGeometry|import("three").SphereBufferGeometry} geom
     */
    constructor(geom) {
        const mat = new MeshBasicMaterial({ side: BackSide });
        super(geom, mat);
    }
}
