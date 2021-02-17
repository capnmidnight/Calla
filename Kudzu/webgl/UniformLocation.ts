import { ManagedWebGLObject } from "./ManagedWebGLObject";
import type { Texture } from "./Texture";

export class UniformLocation extends ManagedWebGLObject<WebGLUniformLocation> {
    readonly name: string;

    constructor(gl: WebGL2RenderingContext, handle: WebGLUniformLocation, name: string) {
        super(gl, handle);
        this.name = name;
    }

    setMatrix4fv(data: Float32List) {
        this.gl.uniformMatrix4fv(this.handle, false, data);
    }

    setUniform1i(v: number) {
        this.gl.uniform1i(this.handle, v);
    }

    setUniform1f(v: number) {
        this.gl.uniform1f(this.handle, v);
    }

    setTexture(texture: Texture, slot: number) {
        if (slot < 0 || this.gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS <= slot) {
            throw new Error(`Invalid texture slot: ${slot}`);
        }
        this.gl.activeTexture(this.gl.TEXTURE0 + slot);
        texture.bind();
        this.setUniform1i(slot);
    }

}
