import { AmbientLight, Color, Object3D, PerspectiveCamera, Raycaster, Scene, WebGLRenderer } from "three";
import { arrayClear, EventBase } from "../calla";
import { CameraControl } from "../input/CameraControl";
import { ScreenPointerControls } from "../input/ScreenPointerControls";
import { Stage } from "../input/Stage";
import { RequestAnimationFrameTimer } from "../timers/RequestAnimationFrameTimer";
import { Fader } from "./Fader";
import { Skybox } from "./Skybox";

export class ThreeJSApplication extends EventBase {
    constructor() {
        super();

        this.renderer = new WebGLRenderer({
            canvas: document.getElementById("frontBuffer"),
            powerPreference: "high-performance",
            precision: "highp",
            antialias: true,
            depth: true,
            stencil: true,
            premultipliedAlpha: true,
            logarithmicDepthBuffer: true,
            alpha: false,
            preserveDrawingBuffer: false
        });
        this.renderer.setPixelRatio(window.devicePixelRatio);

        this.camera = new PerspectiveCamera(50, 1, 0.01, 1000);

        this.fader = new Fader(this.camera);

        this.skybox = new Skybox(this.camera);
        this.skybox.visible = false;

        this.stage = new Stage(this.camera);
        this.stage.position.set(0, 0, 0);

        this.light = new AmbientLight(0xffffff, 1);

        this.background = new Object3D();
        this.background.name = "Background";
        this.background.add(this.light);
        this.background.add(this.skybox);
        this.background.add(this.stage);

        this.foreground = new Object3D();
        this.foreground.name = "Foreground";

        this.scene = new Scene();
        this.scene.background = new Color(0x606060);
        this.scene.add(this.background);
        this.scene.add(this.foreground);

        const resize = () => {
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
        };
        window.addEventListener("resize", resize);
        resize();

        this.controls = new ScreenPointerControls(this.renderer.domElement);

        this.raycaster = new Raycaster();
        let lastObj = null;
        this.controls.addEventListener("move", (evt) => {
            let pointer = null;

            if (this.controls.isPointerLocked) {
                pointer = { x: 0, y: 0 };
            }
            else {
                pointer = { x: evt.u, y: evt.v };
            }

            this.raycaster.setFromCamera(pointer, this.camera);
        });

        this.controls.addEventListener("click", () => {
            if (lastObj) {
                lastObj.dispatchEvent({ type: "click" });
            }
        });

        this.cameraControl = new CameraControl(this.camera, this.stage, this.controls);
        this.cameraControl.controlMode = CameraControl.Mode.MouseLocked;

        const scales = new Map();
        const hits = [];
        const update = (evt) => {
            this.skybox.update();

            arrayClear(hits);
            this.raycaster.intersectObject(this.foreground, true, hits);

            let curObj = null;
            for (let hit of hits) {
                if (hit.object
                    && hit.object._listeners
                    && hit.object._listeners.click
                    && hit.object._listeners.click.length) {
                    curObj = hit.object;
                }
            }

            if (curObj !== lastObj) {

                if (lastObj && scales.has(lastObj)) {
                    lastObj.scale.fromArray(scales.get(lastObj));
                }

                if (curObj) {
                    if (!scales.has(curObj)) {
                        scales.set(curObj, curObj.scale.toArray());
                    }
                    curObj.scale.multiplyScalar(1.1);
                }

                lastObj = curObj;
            }

            this.fader.update(evt.sdt);
            this.renderer.render(this.scene, this.camera);
        };
        this.timer = new RequestAnimationFrameTimer();
        this.timer.addEventListener("tick", update);

        window.app = this;
    }

    start() {
        this.timer.start();
        this.dispatchEvent(new Event("started"));
    }

    clearScene() {
        this.dispatchEvent(new Event("sceneclearing"));
        this.foreground.remove(...this.foreground.children);
    }
}