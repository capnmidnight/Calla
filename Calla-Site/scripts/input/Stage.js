import { PerspectiveCamera, Object3D, Vector3, Quaternion, Euler } from "three";

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
     * @param {PerspectiveCamera} camera
     */
    constructor(camera) {
        super();

        this.rotation.copy(camera.rotation);
        this.position.copy(camera.position);
        this.position.y = 0;

        this.avatar = new Object3D();
        this.add(this.avatar);
        this.avatar.rotation.set(0, 0, 0);
        this.avatar.position.set(0, 0, 0);

        this.pivot = new Object3D();
        this.avatar.add(this.pivot);
        this.pivot.rotation.set(0, 0, 0);
        this.pivot.position.set(0, defaultAvatarHeight - 0.1, 0);

        this.neck = new Object3D();
        this.pivot.add(this.neck);
        this.neck.rotation.set(0, 0, 0);
        this.neck.position.set(0, 0.1, 0);

        this.camera = camera;
        this.neck.add(this.camera);
        this.camera.position.set(0, 0, 0);
        this.camera.rotation.set(0, 0, 0);

        this.shoulders = new Object3D();
        this.avatar.add(this.shoulders);

        this.hands = new Object3D();
        this.shoulders.add(this.hands);

        this.body = new Object3D();
        this.shoulders.add(this.body);
    }

    /**
     * @param {Quaternion} dQuat
     * @param {Number} minX
     * @param {Number} maxX
     */
    rotateView(dQuat, minX = -Math.PI, maxX = Math.PI) {
        viewEuler.setFromQuaternion(dQuat, "YXZ");
        const { x, y } = viewEuler;

        this.pivot.getWorldQuaternion(viewQuat);
        viewEuler.setFromQuaternion(viewQuat, "YXZ");
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
        if (viewEuler.x > Math.PI) {
            viewEuler.x -= 2 * Math.PI;
        }
        viewEuler.x = Math.max(minX, Math.min(maxX, viewEuler.x));

        quat.setFromEuler(viewEuler);
        this.pivot.quaternion.copy(quat);
    }

    /**
     * @type {Number}
     **/
    get avatarHeight() {
        return this.camera.position.y;
    }
}