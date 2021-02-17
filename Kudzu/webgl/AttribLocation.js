import { ManagedWebGLObject } from "./ManagedWebGLObject";
export class AttribLocation extends ManagedWebGLObject {
    constructor(gl, handle, name) {
        super(gl, handle);
        this.name = name;
    }
    vertexAttribPointer(elementsPerItem, dataType, normalized, stride, offset) {
        this.gl.vertexAttribPointer(this.handle, elementsPerItem, dataType, normalized, stride, offset);
    }
    enableVertexAttribArray() {
        this.gl.enableVertexAttribArray(this.handle);
    }
    setBuffer(buffer, elemsPerItem, normalized, stride, offset) {
        buffer.bind();
        this.vertexAttribPointer(elemsPerItem, buffer.dataType, normalized, stride * buffer.dataSize, offset * buffer.dataSize);
        this.enableVertexAttribArray();
    }
}
//# sourceMappingURL=AttribLocation.js.map