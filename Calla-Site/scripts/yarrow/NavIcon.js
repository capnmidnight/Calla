import { DebugObject } from "../graphics3d/DebugObject";

export class NavIcon extends DebugObject {
    /**
     * @param {Object3D} from
     * @param {Object3D} to
     */
    constructor(from, to) {
        super(0xff0000);
        this.name = `nav-from-${from.name}-to-${to.name}`;
        this.position.copy(to.position);
        this.position.sub(from.position);
        this.position.y = 0;
        this.position.normalize();
        this.position.multiplyScalar(1.5);
        this.position.y += 1;
    }
}
