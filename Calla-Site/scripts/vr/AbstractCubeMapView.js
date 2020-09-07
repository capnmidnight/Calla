import { BackSide } from "three/src/constants";
import { MeshBasicMaterial } from "three/src/materials/MeshBasicMaterial";
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
