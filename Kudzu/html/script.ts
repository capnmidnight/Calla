import { src } from "./attrs";
import { Script } from "./tags";


export function createScript(file: string): void {
    const script = Script(src(file));
    document.body.appendChild(script);
}
