import { BackSide } from "../lib/three.js/src/constants";
import { MeshBasicMaterial } from "../lib/three.js/src/materials/MeshBasicMaterial";
import { TexturedMesh } from "./TexturedMesh";

export class AbstractCubeMapView extends TexturedMesh {
    /**
     * @param {import("../lib/three.js").BoxBufferGeometry|import("../lib/three.js").SphereBufferGeometry} geom
     */
    constructor(geom) {
        const mat = new MeshBasicMaterial({ side: BackSide });
        super(geom, mat);
    }
}
