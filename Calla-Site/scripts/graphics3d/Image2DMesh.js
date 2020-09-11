import { PlaneBufferGeometry } from "three/src/geometries/PlaneGeometry";
import { MeshBasicMaterial } from "three/src/materials/MeshBasicMaterial";
import { TexturedMesh } from "./TexturedMesh";

const geom = new PlaneBufferGeometry(1, 1, 1, 1);

export class Image2DMesh extends TexturedMesh {
    constructor() {
        const mat = new MeshBasicMaterial({ transparent: true });
        super(geom, mat);
    }
}
