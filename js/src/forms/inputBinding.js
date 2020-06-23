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

        const gpStates = [],
            gpDownEvts = [],
            gpUpEvts = [],
            gpChecker = () => {
                requestAnimationFrame(gpChecker);
                const gamepads = navigator.getGamepads();
                for (let g = 0; g < gamepads.length; ++g) {
                    if (gamepads[g] !== null) {
                        if (g <= gpStates.length) {
                            gpStates[g] = [];
                        }
                        const gamepad = gamepads[g],
                            states = gpStates[g];
                        for (let b = 0; b < gamepad.buttons.length; ++b) {
                            const lastState = states[b],
                                state = gamepad.buttons[b].pressed;
                            if (state !== lastState) {
                                states[b] = state;
                                if (gpDownEvts.length <= b) {
                                    gpDownEvts[b] = Object.assign(new Event("gamepadbuttondown"), { button: b });
                                }

                                if (gpUpEvts.length <= b) {
                                    gpUpEvts[b] = Object.assign(new Event("gamepadbuttonup"), { button: b });
                                }

                                this.dispatchEvent(state ? gpDownEvts[b] : gpUpEvts[b]);
                            }
                        }
                    }
                }
            }

        requestAnimationFrame(gpChecker);

        Object.freeze(this);
    }
}