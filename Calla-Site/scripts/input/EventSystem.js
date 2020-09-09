import { Raycaster } from "three/src/core/Raycaster";
import { arrayClear } from "../calla/arrays/arrayClear";
import { EventBase } from "../calla/events/EventBase";

export class EventSystemEvent extends Event {
    /**
     * @param {String} type
     * @param {import("three").Intersection} obj
     */
    constructor(type, obj) {
        super(type);
        this.hit = obj;
    }
}

export class EventSystem extends EventBase {
    /**
     * @param {import("three").PerspectiveCamera} camera
     * @param {import("three").Object3D} inputLayer
     * @param {...import("./ScreenPointerControls").ScreenPointerControls} screenPointer
     */
    constructor(camera, inputLayer, ...pointers) {
        super();

        const raycaster = new Raycaster();

        /** @type {Map<Number, import("three").Intersection>} */
        const hovers = new Map();

        /** @type {import("three").Intersection[]} */
        const hits = [];

        /**
         * @param {import("./ScreenPointerControls").ScreenPointerEvent} evt
         * @returns {import("three").Intersection}
         */
        const raycast = (evt) => {
            const pointer = { x: evt.u, y: evt.v };
            raycaster.setFromCamera(pointer, camera);

            arrayClear(hits);
            raycaster.intersectObject(inputLayer, true, hits);

            /** @type {import("three").Intersection} */
            let curHit = null;
            for (let hit of hits) {
                if (hit.object
                    && hit.object._listeners
                    && hit.object._listeners.click
                    && hit.object._listeners.click.length) {
                    curHit = hit;
                }
            }

            return curHit;
        };

        /**
         * @param {import("./ScreenPointerControls").ScreenPointerEvent} evt
         */
        const onMove = (evt) => {
            const lastHit = hovers.get(evt.pointerID);
            const curHit = raycast(evt);
            if ((curHit && curHit.object) != (lastHit && lastHit.object)) {
                if (lastHit && lastHit.object) {
                    hovers.delete(evt.pointerID);
                    lastHit.object.dispatchEvent({ type: "exit" });
                    this.dispatchEvent(new EventSystemEvent("exit", lastHit));
                }

                if (curHit && curHit.object) {
                    hovers.set(evt.pointerID, curHit);
                    curHit.object.dispatchEvent({ type: "enter" });
                    this.dispatchEvent(new EventSystemEvent("enter", curHit));
                }
            }
        };

        /**
         * @param {import("./ScreenPointerControls").ScreenPointerEvent} evt
         */
        const onClick = (evt) => {
            const curHit = raycast(evt);
            if (curHit && curHit.object) {
                curHit.object.dispatchEvent({ type: "click" });
            }
        };

        for (let pointer of pointers) {
            pointer.addEventListener("move", onMove);
            pointer.addEventListener("click", onClick);
        }
    }
}