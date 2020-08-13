import { EventBase } from "../../../js/src/index.js";

const inputBindingChangedEvt = new Event("inputBindingChanged");

export class InputBinding extends EventBase {
    constructor() {
        super();

        const bindings = new Map([
            ["keyButtonUp", "ArrowUp"],
            ["keyButtonDown", "ArrowDown"],
            ["keyButtonLeft", "ArrowLeft"],
            ["keyButtonRight", "ArrowRight"],
            ["keyButtonEmote", "e"],
            ["keyButtonToggleAudio", "a"],
            ["keyButtonZoomOut", "["],
            ["keyButtonZoomIn", "]"],

            ["gpAxisLeftRight", 0],
            ["gpAxisUpDown", 1],

            ["gpButtonEmote", 0],
            ["gpButtonToggleAudio", 1],
            ["gpButtonZoomIn", 6],
            ["gpButtonZoomOut", 7],
            ["gpButtonUp", 12],
            ["gpButtonDown", 13],
            ["gpButtonLeft", 14],
            ["gpButtonRight", 15]
        ]);

        for (let id of bindings.keys()) {
            Object.defineProperty(this, id, {
                get: () => bindings.get(id),
                set: (v) => {
                    if (bindings.has(id)
                        && v !== bindings.get(id)) {
                        bindings.set(id, v);
                        this.dispatchEvent(inputBindingChangedEvt);
                    }
                }
            });
        }

        this.clone = () => {
            const c = {};
            for (let kp of bindings.entries()) {
                c[kp[0]] = kp[1];
            }
            return c;
        };

        Object.freeze(this);
    }
}