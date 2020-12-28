import { src } from "../html/attrs";
import { Script } from "../html/tags";


export function createScript(file: string): void {
    const script = Script(src(file));
    document.body.appendChild(script);
}
