import { PlaneBufferGeometry } from "three/src/geometries/PlaneGeometry";
import { MeshBasicMaterial } from "three/src/materials/MeshBasicMaterial";
import { Mesh } from "three/src/objects/Mesh";
import { once } from "../calla/events/once";

const completeEvt = { type: "fadeComplete" };

export class Fader extends Mesh {
    /**
     * 
     * @param {import("three").PerspectiveCamera} camera
     * @param {number} t
     * @param {import("three").Color|number} color
     */
    constructor(camera, t = 0.25, color = 0x000000) {
        const geom = new PlaneBufferGeometry(1, 1, 1, 1);
        const mat = new MeshBasicMaterial({ color, opacity: 1, transparent: true });
        super(geom, mat);

        this.material = mat;

        this.speed = 1 / t;
        this.direction = 0;

        camera.add(this);
        this.position.set(0, 0, -0.1);
    }

    get opacity() {
        return this.material.opacity;
    }

    set opacity(v) {
        this.material.opacity = v;
    }

    get isIn() {
        return this.opacity < 1;
    }

    get isOut() {
        return this.opacity > 0;
    }

    async fadeOut() {
        if (this.isIn) {
            this.direction = 1;
            await once(this, "fadeComplete");
        }
    }

    async fadeIn() {
        if (this.isOut) {
            this.direction = -1;
            await once(this, "fadeComplete");
        }
    }

    update(dt) {
        if (this.direction !== 0) {
            const dOpacity = this.direction * this.speed * dt / 1000;
            if (0 <= this.opacity && this.opacity <= 1) {
                this.opacity += dOpacity;
            }

            if (this.direction === 1 && this.opacity > 1
                || this.direction === -1 && this.opacity < 0) {
                this.opacity = (1 + this.direction) / 2;
                this.direction = 0;
                this.dispatchEvent(completeEvt);
            }
        }
    }
}
