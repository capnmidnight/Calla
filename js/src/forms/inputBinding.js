const inputBindingChangedEvt = new Event("inputbindingchanged");

export class InputBinding extends EventTarget {
    constructor() {
        super();

        const bindings = new Map([
            ["keyButtonUp", "ArrowUp"],
            ["keyButtonDown", "ArrowDown"],
            ["keyButtonLeft", "ArrowLeft"],
            ["keyButtonRight", "ArrowRight"],
            ["keyButtonEmote", "e"],
            ["keyButtonToggleAudio", "a"],

            ["gpButtonUp", 12],
            ["gpButtonDown", 13],
            ["gpButtonLeft", 14],
            ["gpButtonRight", 15],
            ["gpButtonEmote", 0],
            ["gpButtonToggleAudio", 1]
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

        Object.freeze(this);
    }
}