import { EventBase } from "../calla/events/EventBase";
import { href, id } from "../html/attrs";
import { cssWidth, display, left, textDecoration } from "../html/css";
import { A, Button } from "../html/tags";

export class SessionStartedEvt extends Event {
    /**
     * @param {XRSession} session
     * @param {string} sessionType
     */
    constructor(session, sessionType) {
        super("sessionstarted");
        this.session = session;
        this.sessionType = sessionType

        Object.freeze(this);
    }
}

const sessionEndedEvt = Object.seal(new Event("sessionended"));

export class ScreenControl extends EventBase {

    /**
     * @param {import("three").WebGLRenderer} renderer
     * @param {import("three").PerspectiveCamera} camera
     * @param {boolean} enableAR
     */
    constructor(renderer, camera, enableAR) {
        super();

        if (!("xr" in navigator)) {
            const insecure = window.isSecureContext === false;
            this.element = A(
                href(insecure
                    ? document.location.href.replace(/^http:/, "https:")
                    : "https://immersiveweb.dev/"),
                insecure
                    ? "WEBXR NEEDS HTTPS"
                    : "WEBXR NOT AVAILABLE",
                left("calc(50% - 90px)"),
                cssWidth("180px"),
                textDecoration("none"));
        }
        else {
            this.element = Button(
                id("VRButton"),
                display("none"));

            const showButton = (name, type, referenceSpaceType, sessionInit) => {
                let currentSession = null;
                const onSessionStarted = (session) => {
                    session.addEventListener("end", onSessionEnded);
                    renderer.xr.setReferenceSpaceType(referenceSpaceType);
                    renderer.xr.setSession(session);
                    this.element.textContent = ("EXIT " + name).trim();
                    currentSession = session;
                    if (type === "inline") {
                        camera.fov = evt.session.renderState.inlineVerticalFieldOfView * 180 / Math.PI;
                    }
                    this.dispatchEvent(new SessionStartedEvt(session, type));
                };

                const onSessionEnded = () => {
                    currentSession.removeEventListener("end", onSessionEnded);
                    this.element.textContent = ("ENTER " + name).trim();
                    currentSession = null;
                    if (type === "inline") {
                        camera.fov = 50;
                    }
                    this.dispatchEvent(sessionEndedEvt);
                };

                this.element.style.display = "";
                this.element.style.cursor = "pointer";
                this.element.style.left = "calc(50% - 50px)";
                this.element.style.width = "100px";
                this.element.textContent = ("ENTER " + name).trim();

                this.toggle = async () => {
                    if (currentSession === null) {
                        if (name === "FULLSCREEN") {
                            await renderer.domElement.requestFullscreen({
                                navigationUI: "show"
                            });
                        }
                        else {

                            // WebXR"s requestReferenceSpace only works if the corresponding feature
                            // was requested at session creation time. For simplicity, just ask for
                            // the interesting ones as optional features, but be aware that the
                            // requestReferenceSpace call will fail if it turns out to be unavailable.
                            // ("local" is always available for immersive sessions and doesn"t need to
                            // be requested separately.)
                            const session = await navigator.xr.requestSession(type, sessionInit);
                            onSessionStarted(session);
                        }
                    }
                    else {
                        if (name === "FULLSCREEN") {
                            await document.exitFullscreen();
                        }
                        else {
                            currentSession.end();
                        }
                    }
                };

                this.element.addEventListener("click", this.toggle);
            };

            const onPointerEnter = () => {
                this.element.style.opacity = "1.0";
            };

            const onPointerLeave = () => {
                this.element.style.opacity = "0.5";
            };

            this.element.addEventListener("pointerenter", onPointerEnter);
            this.element.addEventListener("pointerleave", onPointerLeave);

            (async () => {
                if (enableAR && await navigator.xr.isSessionSupported("immersive-ar")) {
                    showButton("AR", "immserive-ar", "local-floor");
                }
                else if (await navigator.xr.isSessionSupported("immersive-vr")) {
                    showButton("VR", "immersive-vr", "local", { optionalFeatures: ["local", "local-floor", "bounded-floor", "hand-tracking"] });
                }
                else {
                    showButton("FULLSCREEN");
                }
            })();
        }

        this.element.style.position = "absolute";
        this.element.style.bottom = "20px";
        this.element.style.padding = "12px 6px";
        this.element.style.border = "1px solid #fff";
        this.element.style.borderRadius = "4px";
        this.element.style.background = "rgba(0,0,0,0.1)";
        this.element.style.color = "#fff";
        this.element.style.font = "normal 13px sans-serif";
        this.element.style.textAlign = "center";
        this.element.style.opacity = "0.5";
        this.element.style.outline = "none";
        this.element.style.zIndex = "999";

        const resize = async () => {
            if (!renderer.xr.isPresenting) {
                renderer.setSize(window.innerWidth, window.innerHeight);
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
            }
        };
        window.addEventListener("resize", resize);
        resize();
    }

    get isFullscreen() {
        return document.fullscreen;
    }
}