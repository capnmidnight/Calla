import type { Buffer } from "./Buffer";
import { ManagedWebGLObject } from "./ManagedWebGLObject";

export class AttribLocation extends ManagedWebGLObject<GLintptr> {
    constructor(gl: WebGL2RenderingContext, handle: GLintptr, public name: string) {
        super(gl, handle);
    }

    vertexAttribPointer(elementsPerItem: number, dataType: GLenum, normalized: boolean, stride: number, offset: number) {
        this.gl.vertexAttribPointer(this.handle, elementsPerItem, dataType, normalized, stride, offset);
    }

    enableVertexAttribArray() {
        this.gl.enableVertexAttribArray(this.handle);
    }

    setBuffer(buffer: Buffer, elemsPerItem: number, normalized: boolean, stride: number, offset: number) {
        buffer.bind();
        this.vertexAttribPointer(
            elemsPerItem,
            buffer.dataType,
            normalized,
            stride * buffer.dataSize,
            offset * buffer.dataSize);
        this.enableVertexAttribArray();
    }
}
