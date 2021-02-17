import type { Buffer } from "./Buffer";
import { ManagedWebGLObject } from "./ManagedWebGLObject";
export declare class AttribLocation extends ManagedWebGLObject<GLintptr> {
    name: string;
    constructor(gl: WebGL2RenderingContext, handle: GLintptr, name: string);
    vertexAttribPointer(elementsPerItem: number, dataType: GLenum, normalized: boolean, stride: number, offset: number): void;
    enableVertexAttribArray(): void;
    setBuffer(buffer: Buffer, elemsPerItem: number, normalized: boolean, stride: number, offset: number): void;
}
