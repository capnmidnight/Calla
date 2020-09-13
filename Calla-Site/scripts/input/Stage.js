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
     * @param {import("three").WebGLRenderer} renderer
     * @param {import("three").PerspectiveCamera} camera
     */
    constructor(renderer, camera) {
        super();

        this.renderer = renderer;

        this.rotation.copy(camera.rotation);
        this.position.copy(camera.position);
        this.position.y = 0;

        this.camera = camera;

        this.head = new Object3D();
        this.head.position.set(0, defaultAvatarHeight, 0);
        this.head.add(this.camera);

        this.hands = new Object3D();

        this.body = new Object3D();

        this.shoulders = new Object3D();
        this.shoulders.add(this.hands);
        this.shoulders.add(this.body);

        this.presentationPoint = new Object3D();

        this.pitch = 0;
        this.heading = 0;

        this.avatar = new Object3D();
        this.avatar.add(this.head);
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
        viewEuler.setFromQuaternion(dQuat, "YXZ");
        viewEuler.x += this.pitch;
        viewEuler.y += this.heading;

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

        this.pitch = x;
        this.heading = y;
    }

    update() {
        if (this.renderer.xr.isPresenting) {
            const vrCamera = this.renderer.xr.getCamera(this.head);

            const snapHeading = (Math.round(this.heading * 4 / Math.PI) * Math.PI / 4);

            const vrY = vrCamera.position.y;
            const dY = defaultAvatarHeight - vrY;

            this.avatar.rotation.y = snapHeading;;
            this.head.rotation.x = 0;
            this.head.position.set(0, dY, 0);
        }
        else {
            this.avatar.rotation.y = this.heading;
            this.head.rotation.x = this.pitch;
            this.head.position.set(0, defaultAvatarHeight, 0);
        }

        this.avatar.updateMatrixWorld();
        this.head.updateMatrixWorld();
        this.camera.updateMatrixWorld();
    }

    /**
     * @type {Number}
     **/
    get avatarHeight() {
        return this.head.position.y;
    }
}