import { plane } from "./Plane";
import { solid } from "./solid";
import { TexturedMesh } from "./TexturedMesh";

export class Image2DMesh extends TexturedMesh {
    /**
     * @param {string} name
     */
    constructor(name) {
        super(plane, solid({ name, transparent: true }));
        this.name = name;
    }
}
