import { BoxBufferGeometry, Mesh, MeshBasicMaterial, Object3D } from "three";

const cubeGeom = new BoxBufferGeometry(1, 1, 1, 1, 1, 1);
const valueBarMat = new MeshBasicMaterial({ color: 0xc0c0c0 });
const chromeMat = new MeshBasicMaterial({ color: 0xffffff });

function chrome(x, y, z, w, h, d) {
    const chromeMesh = new Mesh(cubeGeom, chromeMat);
    chromeMesh.position.set(x, y, z);
    chromeMesh.scale.set(w, h, d);
    return chromeMesh;
}

const velocity = 0.1;
export class LoadingBar extends Object3D {
    constructor() {
        super();

        this.valueBar = new Mesh(cubeGeom, valueBarMat);
        this.valueBar.position.set(0, 0, 0);
        this.valueBar.scale.set(0, 1, 1);
        this.value = 0;
        this.targetValue = 0;

        const valueBarContainer = new Object3D();
        valueBarContainer.scale.set(1, 0.1, 0.1);
        valueBarContainer.add(this.valueBar);

        this.add(valueBarContainer);

        this.add(chrome(-0.5, 0, -0.05, 0.01, 0.1, 0.01));
        this.add(chrome(-0.5, 0, 0.05, 0.01, 0.1, 0.01));
        this.add(chrome(0.5, 0, -0.05, 0.01, 0.1, 0.01));
        this.add(chrome(0.5, 0, 0.05, 0.01, 0.1, 0.01));

        this.add(chrome(-0.5, -0.05, 0, 0.01, 0.01, 0.1));
        this.add(chrome(0.5, -0.05, 0, 0.01, 0.01, 0.1));
        this.add(chrome(-0.5, 0.05, 0, 0.01, 0.01, 0.1));
        this.add(chrome(0.5, 0.05, 0, 0.01, 0.01, 0.1));

        this.add(chrome(0, -0.05, -0.05, 1, 0.01, 0.01));
        this.add(chrome(0, 0.05, -0.05, 1, 0.01, 0.01));
        this.add(chrome(0, -0.05, 0.05, 1, 0.01, 0.01));
        this.add(chrome(0, 0.05, 0.05, 1, 0.01, 0.01));
    }

    /**
     * @param {number} soFar
     * @param {number} total
     * @param {string?} msg
     */
    onProgress(soFar, total, msg) {
        this.targetValue = soFar / total;
        if (msg) {
            console.log((100 * this.targetValue).toFixed(2) + "%", msg);
        }
    }

    update(dt) {
        if (this.parent.visible) {
            this.value = Math.min(this.targetValue, this.value + velocity * dt);
            this.valueBar.scale.set(this.value, 1, 1);
            this.valueBar.position.x = this.value / 2 - 0.5;
            this.visible = this.value > 0;
        }
    }
}