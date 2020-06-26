import { EventedGamepad } from "./EventedGamepad.js";

const gamepadConnectedEvt = Object.assign(new Event("gamepadconnected"), {
    gamepad: null
}),
    gamepadDisconnectedEvt = Object.assign(new Event("gamepaddisconnected"), {
        gamepad: null
    }),

    gamepads = new Map(),
    anyButtonDownEvt = Object.assign(new Event("gamepadbuttondown"), { button: -1 }),
    anyButtonUpEvt = Object.assign(new Event("gamepadbuttonup"), { button: -1 }),
    anyAxisMaxedEvt = Object.assign(new Event("gamepadaxismaxed"), { axis: -1 });

class GamepadStateManager extends EventTarget {
    constructor() {
        super();

        const onAnyButtonDown = (evt) => {
            anyButtonDownEvt.button = evt.button;
            this.dispatchEvent(anyButtonDownEvt);
        };

        const onAnyButtonUp = (evt) => {
            anyButtonUpEvt.button = evt.button;
            this.dispatchEvent(anyButtonUpEvt);
        };

        const onAnyAxisMaxed = (evt) => {
            anyAxisMaxedEvt.axis = evt.axis;
            this.dispatchEvent(anyAxisMaxedEvt);
        };

        window.addEventListener("gamepadconnected", (evt) => {
            const pad = evt.gamepad,
                gamepad = new EventedGamepad(pad);
            gamepad.addEventListener("gamepadbuttondown", onAnyButtonDown);
            gamepad.addEventListener("gamepadbuttonup", onAnyButtonUp);
            gamepad.addEventListener("gamepadaxismaxed", onAnyAxisMaxed);
            gamepads.set(pad.id, gamepad);
            gamepadConnectedEvt.gamepad = gamepad;
            this.dispatchEvent(gamepadConnectedEvt);
        });

        window.addEventListener("gamepaddisconnected", (evt) => {
            const id = evt.gamepad.id,
                gamepad = gamepads.get(id);
            gamepads.delete(id);
            gamepad.removeEventListener("gamepadbuttondown", onAnyButtonDown);
            gamepad.removeEventListener("gamepadbuttonup", onAnyButtonUp);
            gamepad.removeEventListener("gamepadaxismaxed", onAnyAxisMaxed);
            gamepadDisconnectedEvt.gamepad = gamepad;
            this.dispatchEvent(gamepadDisconnectedEvt);
            gamepad.dispose();
        });

        Object.freeze(this);
    }

    get gamepadIDs() {
        return [...gamepads.keys()];
    }

    get gamepads() {
        return [...gamepads.values()];
    }

    get(id) {
        return gamepads.get(id);
    }
}

export const GamepadManager = new GamepadStateManager();


function update() {
    requestAnimationFrame(update);
    const pads = navigator.getGamepads();
    for (let pad of pads) {
        if (pad !== null
            && gamepads.has(pad.id)) {
            const gamepad = gamepads.get(pad.id);
            gamepad.update(pad);
        }
    }
}

requestAnimationFrame(update);

