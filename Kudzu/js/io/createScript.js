import { src } from "../html/attrs";
import { Script } from "../html/tags";
export function createScript(file) {
    const script = Script(src(file));
    document.body.appendChild(script);
}
//# sourceMappingURL=createScript.js.map