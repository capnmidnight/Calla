import { Object3D } from "three/src/core/Object3D";
import { DebugObject } from "../graphics3d/DebugObject";

const marker = new DebugObject(0xff0000);

export class NavIcon extends Object3D {
    /**
     * @param {Object3D} from
     * @param {Object3D} to
     */
    constructor(from, to) {
        super();

        this.name = `nav-from-${from.name}-to-${to.name}`;
        this.position.copy(to.position);
        this.position.sub(from.position);
        this.position.y = 0;
        this.position.normalize();
        this.position.multiplyScalar(1.5);
        this.position.y += 1;

        const icon = marker.clone();
        const fwdClick = (evt) => this.dispatchEvent(evt);
        icon.addEventListener("click", fwdClick);
        icon.children.forEach(c => c.addEventListener("click", fwdClick));
        icon.addEventListener("drag", console.log);

        this.add(icon);

    }
}
