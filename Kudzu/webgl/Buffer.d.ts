import { ManagedWebGLResource } from "./ManagedWebGLResource";
export declare type BufferArrayType = Int8Array | Uint8Array | Uint8ClampedArray | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array;
export declare class Buffer extends ManagedWebGLResource<WebGLBuffer> {
    private type;
    private usage;
    readonly length: number;
    readonly dataSize: number;
    readonly dataType: GLenum;
    constructor(gl: WebGL2RenderingContext, type: string, usage: string, data: BufferArrayType, dataType?: number, dataSize?: number);
    private disposed;
    dispose(): void;
    bind(): void;
}
