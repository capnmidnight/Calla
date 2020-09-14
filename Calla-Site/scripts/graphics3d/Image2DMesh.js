import { plane } from "./Plane";
import { solid } from "./solid";
import { TexturedMesh } from "./TexturedMesh";

export class Image2DMesh extends TexturedMesh {
    /**
     * @param {string} name
     * @param {(import("three").MeshBasicMaterialParameters|import("three").MeshStandardMaterialParameters)?} materialOptions
     */
    constructor(name, materialOptions) {
        super(plane, solid(Object.assign(
            { transparent: true, opacity: 1 },
            materialOptions,
            { name })));

        if (name) {
            this.name = name;
        }
    }
}
