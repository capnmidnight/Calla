import type { AttribLocation } from "./AttribLocation";
import type { Geometry } from "./Geometry";
import { Material } from "./Material";
import fragSrc from "./shaders/MaterialFlatTexture.frag";
import vertSrc from "./shaders/MaterialFlatTexture.vert";
import type { Texture } from "./Texture";
import type { UniformLocation } from "./UniformLocation";

export class MaterialFlatTexture extends Material {

    private uTexture: UniformLocation;
    private texture: Texture;

    private aPosition: AttribLocation;
    private aColor: AttribLocation;
    private aUV: AttribLocation;

    constructor(gl: WebGL2RenderingContext, texture: Texture, clearBits?: number) {
        super(gl, vertSrc, fragSrc, clearBits);

        this.texture = texture;

        this.aPosition = this.program.getAttribLocation("aPosition");
        this.aColor = this.program.getAttribLocation("aColor");
        this.aUV = this.program.getAttribLocation("aUV");

        this.uTexture = this.program.getUniformLocation("uTexture");
    }

    setGeometry(geom: Geometry) {
        const vertBuffer = geom.bind();
        this.aPosition.setBuffer(vertBuffer, 3, false, 8, 0);
        this.aColor.setBuffer(vertBuffer, 3, false, 8, 3);
        this.aUV.setBuffer(vertBuffer, 2, true, 8, 6);
        this.uTexture.setTexture(this.texture, 0);
    }
}
