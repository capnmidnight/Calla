import type { IDisposable } from "../using";
import type { BufferArrayType } from "./Buffer";
import { BufferArray } from "./BufferArray";
export declare class Geometry implements IDisposable {
    private vertBuffer;
    private idxBuffer;
    readonly geomType: GLenum;
    readonly elementType: GLenum;
    constructor(gl: WebGL2RenderingContext, vertData: BufferArrayType, idxData: BufferArrayType, type: GLenum);
    private disposed;
    dispose(): void;
    bind(): BufferArray;
    get length(): number;
}
