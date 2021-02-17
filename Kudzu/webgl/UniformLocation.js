import { ManagedWebGLObject } from "./ManagedWebGLObject";
export class UniformLocation extends ManagedWebGLObject {
    constructor(gl, handle, name) {
        super(gl, handle);
        this.name = name;
    }
    setMatrix4fv(data) {
        this.gl.uniformMatrix4fv(this.handle, false, data);
    }
    setUniform1i(v) {
        this.gl.uniform1i(this.handle, v);
    }
    setUniform1f(v) {
        this.gl.uniform1f(this.handle, v);
    }
    setTexture(texture, slot) {
        if (slot < 0 || this.gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS <= slot) {
            throw new Error(`Invalid texture slot: ${slot}`);
        }
        this.gl.activeTexture(this.gl.TEXTURE0 + slot);
        texture.bind();
        this.setUniform1i(slot);
    }
}
//# sourceMappingURL=UniformLocation.js.map