import type { IDisposable } from "../using";
import { ManagedWebGLObject } from "./ManagedWebGLObject";
export declare abstract class ManagedWebGLResource<PointerT> extends ManagedWebGLObject<PointerT> implements IDisposable {
    constructor(gl: WebGL2RenderingContext, handle: PointerT);
    abstract dispose(): void;
}
