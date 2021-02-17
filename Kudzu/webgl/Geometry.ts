import type { IDisposable } from "../using";
import type { BufferArrayType } from "./Buffer";
import { BufferArray } from "./BufferArray";
import { BufferElementArray } from "./BufferElementArray";

export class Geometry implements IDisposable {
    private vertBuffer: BufferArray;
    private idxBuffer: BufferArray;

    readonly geomType: GLenum;
    readonly elementType: GLenum;

    constructor(gl: WebGL2RenderingContext, vertData: BufferArrayType, idxData: BufferArrayType, type: GLenum) {
        if (idxData instanceof Uint8Array) {
            this.elementType = gl.UNSIGNED_BYTE;
        }
        else if (idxData instanceof Uint16Array) {
            this.elementType = gl.UNSIGNED_SHORT;
        }
        else {
            throw new Error("Unsupported index data type");
        }

        this.vertBuffer = new BufferArray(gl, "static-draw", vertData);
        this.idxBuffer = new BufferElementArray(gl, "static-draw", idxData);
        this.geomType = type;
    }

    private disposed = false;
    dispose(): void {
        if (!this.disposed) {
            this.idxBuffer.dispose();
            this.vertBuffer.dispose();
            this.disposed = true;
        }
    }

    bind() {
        this.vertBuffer.bind();
        this.idxBuffer.bind();
        return this.vertBuffer;
    }

    get length() {
        return this.idxBuffer.length;
    }
}
