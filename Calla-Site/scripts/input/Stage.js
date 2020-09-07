import { Object3D } from "three/src/core/Object3D";
import { Euler } from "three/src/math/Euler";
import { Quaternion } from "three/src/math/Quaternion";
import { clamp } from "../calla/math/clamp";

/**
 * When running on systems that do not understand the relationship between the camera and 
 * the ground (marker-tracking AR, 3DOF VR), this is the height that is used for the camera 
 * off of the ground. 1.75 meters is about 5 feet 9 inches.
 **/
const defaultAvatarHeight = 1.75,
    viewEuler = new Euler(),
    viewQuat = new Quaternion();

export class Stage extends Object3D {
    /**
     * @param {import("three").PerspectiveCamera} camera
     */
    constructor(camera) {
        super();

        this.rotation.copy(camera.rotation);
        this.position.copy(camera.position);
        this.position.y = 0;

        this.camera = camera;
        this.camera.position.set(0, 0, 0);
        this.camera.rotation.set(0, 0, 0);

        this.neck = new Object3D();
        this.neck.rotation.set(0, 0, 0);
        this.neck.position.set(0, 0.1, 0);
        this.neck.add(this.camera);

        this.pivot = new Object3D();
        this.pivot.rotation.set(0, 0, 0);
        this.pivot.position.set(0, defaultAvatarHeight - 0.1, 0);
        this.pivot.add(this.neck);

        this.hands = new Object3D();

        this.body = new Object3D();

        this.shoulders = new Object3D();
        this.shoulders.add(this.hands);
        this.shoulders.add(this.body);

        this.presentationPoint = new Object3D();

        this.avatar = new Object3D();
        this.avatar.rotation.set(0, 0, 0);
        this.avatar.position.set(0, 0, 0);
        this.avatar.add(this.pivot);
        this.avatar.add(this.shoulders);
        this.avatar.add(this.presentationPoint);

        this.add(this.avatar);
    }

    /**
     * @param {Quaternion} dQuat
     * @param {Number} minX
     * @param {Number} maxX
     */
    rotateView(dQuat, minX = -Math.PI, maxX = Math.PI) {
        const x = this.pivot.rotation.x;
        const y = this.avatar.rotation.y;

        viewEuler.setFromQuaternion(dQuat, "YXZ");
        viewEuler.x += x;
        viewEuler.y += y;

        viewQuat.setFromEuler(viewEuler);

        this.setViewRotation(viewQuat, minX, maxX);
    }

    /**
     * @param {Quaternion} quat
     * @param {Number} minX
     * @param {Number} maxX
     */
    setViewRotation(quat, minX = -Math.PI, maxX = Math.PI) {
        viewEuler.setFromQuaternion(quat, "YXZ");

        let { x, y } = viewEuler;

        if (x > Math.PI) {
            x -= 2 * Math.PI;
        }
        x = clamp(x, minX, maxX);

        this.avatar.rotation.y = y;
        this.avatar.updateMatrixWorld();

        this.pivot.rotation.x = x;
        this.pivot.updateMatrixWorld();
    }

    /**
     * @param {import("three/src/math/Vector3").Vector3} pos
     * @param {import("three/src/math/Vector3").Vector3} fwd
     * @param {import("three/src/math/Vector3").Vector3} up
     */
    getCameraPose(pos, fwd, up) {
        this.camera.getWorldPosition(pos);
        this.camera.getWorldQuaternion(viewQuat);
        fwd.set(0, 0, -1).applyQuaternion(viewQuat);
        up.set(0, 1, 0).applyQuaternion(viewQuat);
    }

    /**
     * @type {Number}
     **/
    get avatarHeight() {
        return this.camera.position.y;
    }
}