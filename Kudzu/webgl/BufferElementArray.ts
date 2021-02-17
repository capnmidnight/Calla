import type { BufferArrayType } from "./Buffer";
import { Buffer } from "./Buffer";

export class BufferElementArray extends Buffer {
    constructor(gl: WebGL2RenderingContext, usage: string, data: BufferArrayType) {
        super(gl, "element-array", usage, data);
    }
}
