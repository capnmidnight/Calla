import { Shader } from "./Shader";

export class ShaderFragment extends Shader {
    constructor(gl: WebGL2RenderingContext, src: string) {
        super("fragment", gl, src);
    }
}
