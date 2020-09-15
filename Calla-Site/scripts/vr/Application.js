import { AudioManager } from "../calla/audio/AudioManager";
import { EventBase } from "../calla/events/EventBase";
import { Fader } from "../graphics3d/Fader";
import { LoadingBar } from "../graphics3d/LoadingBar";
import { Skybox } from "../graphics3d/Skybox";
import { CameraControl } from "../input/CameraControl";
import { CursorControl } from "../input/CursorControl";
import { EventSystem } from "../input/EventSystem";
import { ScreenPointerControls } from "../input/ScreenPointerControls";
import { Stage } from "../input/Stage";
import { UISystem } from "../input/UISystem";
import { PerspectiveCamera } from "../lib/three.js/src/cameras/PerspectiveCamera";
import { Object3D } from "../lib/three.js/src/core/Object3D";
import { AmbientLight } from "../lib/three.js/src/lights/AmbientLight";
import { DirectionalLight } from "../lib/three.js/src/lights/DirectionalLight";
import { Color } from "../lib/three.js/src/math/Color";
import { WebGLRenderer } from "../lib/three.js/src/renderers/WebGLRenderer";
import { Scene } from "../lib/three.js/src/scenes/Scene";
import { ThreeJSTimer } from "../timers/ThreeJSTimer";
import { CallaAudioListener } from "./CallaAudioListener";
import { ScreenControl } from "./ScreenControl";
import { TimerTickEvent } from "../timers/BaseTimer";

const visibleBackground = new Color(0x606060);
const invisibleBackground = new Color(0x000000);

const updateEvt = new TimerTickEvent();

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
        this.renderer.xr.enabled = true;

        this.audio = new AudioManager();
        this.listener = new CallaAudioListener(this.audio);

        this.camera = new PerspectiveCamera(50, 1, 0.01, 1000);
        this.camera.add(this.listener);

        this.fader = new Fader(this.camera);
        this.fadeDepth = 0;

        this.skybox = new Skybox(this.camera);
        this.skybox.visible = false;
        this.showSkybox = false;

        this.stage = new Stage(this.renderer, this.camera);
        this.stage.position.set(0, 0, 0);

        this.sun = new DirectionalLight(0xffffff, 0.5);
        this.sun.position.set(0, 1, 1);
        this.sun.lookAt(0, 0, 0);

        this.ambient = new AmbientLight(0xffffff, 0.5);

        this.background = new Object3D();
        this.background.name = "Background";
        this.background.add(this.sun);
        this.background.add(this.ambient);
        this.background.add(this.skybox);
        this.background.add(this.stage);

        this.menu = new Object3D();
        this.menu.name = "Menu";

        this.foreground = new Object3D();
        this.foreground.name = "Foreground";
        this.foreground.add(this.menu);

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

        this.cursors = new CursorControl(this.renderer.domElement);

        this.controls = new ScreenPointerControls(this.renderer.domElement);

        this.cameraControl = new CameraControl(this.camera, this.stage, this.controls, this.cursors);

        this.screenControl = new ScreenControl(this.renderer, this.camera, false);
        this.screenControl.addEventListener("sessionstarted", () => {
            this.cursors.lockPointer();
        });
        document.body.append(this.screenControl.element);

        this.eventSystem = new EventSystem(this.renderer, this.camera, this.cursors, this.background, this.foreground, this.controls);
        this.uiSystem = new UISystem(this.eventSystem);

        /**
         * @param {import("../timers/BaseTimer").TimerTickEvent} evt
         */
        const update = (evt) => {
            updateEvt.copy(evt);
            this.dispatchEvent(updateEvt);

            if (!this.showSkybox) {
                this.skybox.visible = false;
            }

            this.audio.update();
            this.stage.update();
            this.cameraControl.update();
            this.skybox.update();
            this.loadingBar.update(evt.sdt);
            this.fader.update(evt.sdt);

            this.stage.presentationPoint.getWorldPosition(this.transition.position);
            this.stage.presentationPoint.getWorldQuaternion(this.transition.quaternion);

            this.menu.position.copy(this.transition.position);
            this.menu.quaternion.copy(this.transition.quaternion);

            this.renderer.render(this.scene, this.camera);
        };

        this.timer = new ThreeJSTimer(this.renderer);
        this.timer.addEventListener("tick", update);

        window.app = this;
    }

    start() {
        this.timer.start();
        this.dispatchEvent(new Event("started"));
    }

    clearScene() {
        this.dispatchEvent(new Event("sceneclearing"));
        this.menu.remove(...this.menu.children);
        this.foreground.remove(...this.foreground.children);
        this.foreground.add(this.menu);
    }

    async fadeOut() {
        ++this.fadeDepth;
        if (this.fadeDepth === 1) {
            await this.fader.fadeOut();
            this.skybox.visible = false;
            this.stage.grid.visible = false;
            this.scene.background = invisibleBackground;
            this.foreground.visible = false;
            this.transition.visible = true;
            this.loadingBar.onProgress(0, 1);
            await this.fader.fadeIn();
        }
    }

    async fadeIn() {
        --this.fadeDepth;
        if (this.fadeDepth === 0) {
            await this.fader.fadeOut();
            this.skybox.visible = this.showSkybox;
            this.stage.grid.visible = true;
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