import { Material } from "./Material";
import fragSrc from "./shaders/MaterialEquirectangular.frag";
import vertSrc from "./shaders/MaterialEquirectangular.vert";
export class MaterialEquirectangular extends Material {
    constructor(gl, texture, clearBits) {
        super(gl, vertSrc, fragSrc, clearBits);
        this.texture = texture;
        this.aPosition = this.program.getAttribLocation("aPosition");
        this.uTexture = this.program.getUniformLocation("uTexture");
    }
    setGeometry(geom) {
        const vertBuffer = geom.bind();
        this.aPosition.setBuffer(vertBuffer, 3, true, 3, 0);
        this.uTexture.setTexture(this.texture, 0);
    }
}
//# sourceMappingURL=MaterialEquirectangular.js.map