import type { BufferArrayType } from "./Buffer";
import { Buffer } from "./Buffer";

export class BufferArray extends Buffer {
    constructor(gl: WebGL2RenderingContext, usage: string, data: BufferArrayType) {
        super(gl, "array", usage, data);
    }
}
