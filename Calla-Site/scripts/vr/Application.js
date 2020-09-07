import { AmbientLight, Color, Object3D, PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { EventBase } from "../calla";
import { CameraControl } from "../input/CameraControl";
import { EventSystem } from "../input/EventSystem";
import { ScreenPointerControls } from "../input/ScreenPointerControls";
import { Stage } from "../input/Stage";
import { RequestAnimationFrameTimer } from "../timers/RequestAnimationFrameTimer";
import { Fader } from "./Fader";
import { LoadingBar } from "./LoadingBar";
import { Skybox } from "./Skybox";

const visibleBackground = new Color(0x606060);
const invisibleBackground = new Color(0x000000);

export class Application extends EventBase {
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
        this.fadeDepth = 0;

        this.skybox = new Skybox(this.camera);
        this.skybox.visible = false;
        this.showSkybox = false;

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

        this.loadingBar = new LoadingBar();
        this.loadingBar.position.set(0, 1.5, -2);

        this.transition = new Object3D();
        this.transition.name = "Transition";
        this.transition.visible = false;
        this.transition.add(this.loadingBar);

        this.scene = new Scene();
        this.scene.background = visibleBackground;
        this.scene.add(this.background);
        this.scene.add(this.foreground);
        this.scene.add(this.transition);

        const resize = () => {
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
        };
        window.addEventListener("resize", resize);
        resize();

        this.controls = new ScreenPointerControls(this.renderer.domElement);

        this.cameraControl = new CameraControl(this.camera, this.stage, this.controls);

        const scales = new Map();
        this.eventSystem = new EventSystem(this.camera, this.foreground, this.controls);
        this.eventSystem.addEventListener("enter", (evt) => {
            if (!scales.has(evt.object)) {
                scales.set(evt.object, evt.object.scale.clone());
            }
            evt.object.scale.multiplyScalar(1.1);
        });

        this.eventSystem.addEventListener("exit", (evt) => {
            evt.object.scale.copy(scales.get(evt.object));
        });

        const update = (evt) => {
            if (!this.showSkybox) {
                this.skybox.visible = false;
            }
            this.skybox.update();
            this.loadingBar.update(evt.sdt);
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

    async fadeOut() {
        console.log("fade out", this.fadeDepth);
        ++this.fadeDepth;
        if (this.fadeDepth === 1) {
            console.log("fading out");
            await this.fader.fadeOut();
            this.skybox.visible = false;
            this.scene.background = invisibleBackground;
            this.foreground.visible = false;
            this.transition.visible = true;
            this.loadingBar.onProgress(0, 1);
            await this.fader.fadeIn();
        }
    }

    async fadeIn() {
        console.log("fade in", this.fadeDepth);
        --this.fadeDepth;
        if (this.fadeDepth === 0) {
            console.log("fading in");
            await this.fader.fadeOut();
            this.skybox.visible = this.showSkybox;
            this.scene.background = visibleBackground;
            this.foreground.visible = true;
            this.transition.visible = false;
            await this.fader.fadeIn();
        }
    }

    /**
     * @param {number} soFar
     * @param {number} total
     * @param {string?} msg
     */
    onProgress(soFar, total, msg) {
        this.loadingBar.onProgress(soFar, total, msg);
    }
}