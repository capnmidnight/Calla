import type { IDisposable } from "../using";
import { ManagedWebGLObject } from "./ManagedWebGLObject";

export abstract class ManagedWebGLResource<PointerT>
    extends ManagedWebGLObject<PointerT>
    implements IDisposable {
    constructor(gl: WebGL2RenderingContext, handle: PointerT) {
        super(gl, handle);
    }

    abstract dispose(): void;
}