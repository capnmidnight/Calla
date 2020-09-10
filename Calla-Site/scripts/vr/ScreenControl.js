import { href, id } from "../html/attrs";
import { cssWidth, display, left, textDecoration } from "../html/css";
import { A, Button } from "../html/tags";
import { EventBase } from "../calla/events/EventBase";

function stylizeElement(element) {
    element.style.position = "absolute";
    element.style.bottom = "20px";
    element.style.padding = "12px 6px";
    element.style.border = "1px solid #fff";
    element.style.borderRadius = "4px";
    element.style.background = "rgba(0,0,0,0.1)";
    element.style.color = "#fff";
    element.style.font = "normal 13px sans-serif";
    element.style.textAlign = "center";
    element.style.opacity = "0.5";
    element.style.outline = "none";
    element.style.zIndex = "999";
}

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
     */
    constructor(renderer) {
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
                    this.dispatchEvent(new SessionStartedEvt(session, type));
                };

                const onSessionEnded = () => {
                    currentSession.removeEventListener("end", onSessionEnded);
                    this.element.textContent = ("ENTER " + name).trim();
                    currentSession = null;
                    this.dispatchEvent(sessionEndedEvt);
                };

                this.element.style.display = "";
                this.element.style.cursor = "pointer";
                this.element.style.left = "calc(50% - 50px)";
                this.element.style.width = "100px";
                this.element.textContent = ("ENTER " + name).trim();

                this.element.addEventListener("pointerenter", () => {
                    this.element.style.opacity = "1.0";
                });
                this.element.addEventListener("pointerleave", () => {
                    this.element.style.opacity = "0.5";
                });

                this.toggle = async () => {
                    if (currentSession === null) {
                        // WebXR"s requestReferenceSpace only works if the corresponding feature
                        // was requested at session creation time. For simplicity, just ask for
                        // the interesting ones as optional features, but be aware that the
                        // requestReferenceSpace call will fail if it turns out to be unavailable.
                        // ("local" is always available for immersive sessions and doesn"t need to
                        // be requested separately.)
                        const session = await navigator.xr.requestSession(type, sessionInit);
                        onSessionStarted(session);
                    } else {
                        currentSession.end();
                    }
                };

                this.element.addEventListener("click", this.toggle);
            };

            function showEnterVR() {
                showButton("VR", "immersive-vr", "local-floor", { optionalFeatures: ["local-floor", "bounded-floor", "hand-tracking"] });
            }

            function showEnterAR() {
                showButton("AR", "immserive-ar", "local-floor");
            }

            function showEnterInline() {
                showButton("", "inline", "viewer");
            }

            const showWebXRNotFound = () => {
                disableButton();
                this.element.textContent = "VR NOT SUPPORTED";
            };

            const disableButton = () => {
                this.element.style.display = "";
                this.element.style.cursor = "auto";
                this.element.style.left = "calc(50% - 75px)";
                this.element.style.width = "150px";
                this.element.onmouseenter = null;
                this.element.onmouseleave = null;
                this.element.onclick = null;
            }

            (async function () {
                if (await navigator.xr.isSessionSupported("immersive-vr")) {
                    showEnterVR();
                }
                else if (await navigator.xr.isSessionSupported("immersive-ar")) {
                    showEnterAR();
                }
                else if (await navigator.xr.isSessionSupported("inline")) {
                    showEnterInline();
                }
                else {
                    showWebXRNotFound();
                }
            })();
        }

        stylizeElement(this.element);
    }
}