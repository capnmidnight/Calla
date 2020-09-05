import { Raycaster } from "three";
import { arrayClear, EventBase } from "../calla";

class EventSystemEvent extends Event {
    /**
     * @param {String} type
     * @param {import("three").Object3D} obj
     */
    constructor(type, obj) {
        super(type);
        this.object = obj;
    }
}

export class EventSystem extends EventBase {
    /**
     * @param {import("three").PerspectiveCamera} camera
     * @param {import("three").Object3D} inputLayer
     * @param {import("./ScreenPointerControls").ScreenPointerControls} screenPointers
     */
    constructor(camera, inputLayer, screenPointers) {
        super();

        const raycaster = new Raycaster();
        /** @type {import("three").Intersection[]} */
        const hits = [];
        const raycast = (evt) => {
            let pointer = null;

            if (screenPointers.isPointerLocked
                && evt.pointerType === "mouse") {
                pointer = { x: 0, y: 0 };
            }
            else {
                pointer = { x: evt.u, y: evt.v };
            }

            raycaster.setFromCamera(pointer, camera);

            arrayClear(hits);
            raycaster.intersectObject(inputLayer, true, hits);

            let curObj = null;
            for (let hit of hits) {
                if (hit.object
                    && hit.object._listeners
                    && hit.object._listeners.click
                    && hit.object._listeners.click.length) {
                    curObj = hit.object;
                }
            }

            return curObj;
        };

        /** @type {Map<Number, import("three").Object3D>} */
        const hovers = new Map();
        screenPointers.addEventListener("move", (evt) => {
            const lastObj = hovers.get(evt.pointerID);
            const curObj = raycast(evt);
            if (curObj != lastObj) {
                if (lastObj) {
                    hovers.delete(evt.pointerID);
                    lastObj.dispatchEvent({ type: "exit" });
                    this.dispatchEvent(new EventSystemEvent("exit", lastObj));
                }

                if (curObj) {
                    hovers.set(evt.pointerID, curObj);
                    curObj.dispatchEvent({ type: "enter" });
                    this.dispatchEvent(new EventSystemEvent("enter", curObj));
                }
            }
        });

        screenPointers.addEventListener("click", (evt) => {
            const curObj = raycast(evt);
            if (curObj) {
                curObj.dispatchEvent({ type: "click" });
            }
        });
    }
}