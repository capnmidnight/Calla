import { mat4 } from "gl-matrix";
export class Mesh {
    constructor(gl, material, geom) {
        this.gl = gl;
        this.material = material;
        this.geom = geom;
        this.model = mat4.create();
    }
    draw(cam) {
        this.material.use();
        this.material.setCamera(cam);
        this.material.setModel(this.model);
        this.material.setGeometry(this.geom);
        this.material.clear();
        this.gl.drawElements(this.geom.geomType, this.geom.length, this.geom.elementType, 0);
    }
}
//# sourceMappingURL=Mesh.js.map