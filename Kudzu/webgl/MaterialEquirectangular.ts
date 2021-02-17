import type { AttribLocation } from "./AttribLocation";
import type { Geometry } from "./Geometry";
import { Material } from "./Material";
import fragSrc from "./shaders/MaterialEquirectangular.frag";
import vertSrc from "./shaders/MaterialEquirectangular.vert";
import type { Texture } from "./Texture";
import type { UniformLocation } from "./UniformLocation";

export class MaterialEquirectangular extends Material {

    private uTexture: UniformLocation;
    private texture: Texture;

    private aPosition: AttribLocation;

    constructor(gl: WebGL2RenderingContext, texture: Texture, clearBits?: number) {
        super(gl, vertSrc, fragSrc, clearBits);

        this.texture = texture;

        this.aPosition = this.program.getAttribLocation("aPosition");

        this.uTexture = this.program.getUniformLocation("uTexture");
    }

    setGeometry(geom: Geometry) {
        const vertBuffer = geom.bind();
        this.aPosition.setBuffer(vertBuffer, 3, true, 3, 0);
        this.uTexture.setTexture(this.texture, 0);
    }
}
