import { src } from "./attrs";
import { Script } from "./tags";
export function createScript(file) {
    const script = Script(src(file));
    document.body.appendChild(script);
}
//# sourceMappingURL=script.js.map