import type { BufferArrayType } from "./Buffer";
import { Buffer } from "./Buffer";
export declare class BufferArray extends Buffer {
    constructor(gl: WebGL2RenderingContext, usage: string, data: BufferArrayType);
}
