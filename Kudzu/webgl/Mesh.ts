import { mat4 } from "gl-matrix";
import type { Camera } from "./Camera";
import type { Geometry } from "./Geometry";
import type { Material } from "./Material";

export class Mesh {
    private gl: WebGL2RenderingContext;
    private material: Material;
    private geom: Geometry;

    model: mat4;

    constructor(gl: WebGL2RenderingContext, material: Material, geom: Geometry) {
        this.gl = gl;
        this.material = material;
        this.geom = geom;

        this.model = mat4.create();
    }

    draw(cam: Camera) {
        this.material.use();
        this.material.setCamera(cam);
        this.material.setModel(this.model);
        this.material.setGeometry(this.geom);
        this.material.clear();
        this.gl.drawElements(this.geom.geomType, this.geom.length, this.geom.elementType, 0);
    }
}
