import { MeshBasicMaterial, PlaneBufferGeometry } from "three";
import { TexturedMesh } from "./TexturedMesh";

const geom = new PlaneBufferGeometry(1, 1, 1, 1);

export class Image2DMesh extends TexturedMesh {
    constructor() {
        const mat = new MeshBasicMaterial({ transparent: true });
        super(geom, mat);
    }
}
