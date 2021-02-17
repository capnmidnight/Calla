import { isPowerOf2 } from "../math/powerOf2";
import { ManagedWebGLResource } from "./ManagedWebGLResource";
export class Texture extends ManagedWebGLResource {
    constructor(gl, image, pixelType = gl.RGBA, componentType = gl.UNSIGNED_BYTE) {
        super(gl, gl.createTexture());
        this.disposed = false;
        this.bind();
        gl.texImage2D(gl.TEXTURE_2D, 0, pixelType, image.width, image.height, 0, pixelType, componentType, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
            gl.generateMipmap(gl.TEXTURE_2D);
        }
    }
    bind() {
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.handle);
    }
    dispose() {
        if (!this.disposed) {
            this.gl.deleteTexture(this.handle);
            this.disposed = true;
        }
    }
}
//# sourceMappingURL=Texture.js.map