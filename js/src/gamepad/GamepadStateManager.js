import { EventedGamepad } from "./EventedGamepad";

const gamepadConnectedEvt = Object.assign(new Event("gamepadconnected"), {
    gamepad: null
}),
    gamepadDisconnectedEvt = Object.assign(new Event("gamepaddisconnected"), {
        gamepad: null
    }),

    gamepads = new Map(),
    anyButtonDownEvt = Object.assign(new Event("gamepadbuttondown"), { button: 0 }),
    anyButtonUpEvt = Object.assign(new Event("gamepadbuttonup"), { button: 0 });

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

        window.addEventListener("gamepadconnected", (evt) => {
            const pad = evt.gamepad,
                gamepad = new EventedGamepad(pad);
            gamepad.addEventListener("gamepadbuttondown", onAnyButtonDown);
            gamepad.addEventListener("gamepadbuttonup", onAnyButtonUp);
            gamepads.set(pad.id, gamepad);
            gamepadConnectedEvt.gamepad = gamepad;
            this.dispatchEvent(gamepadConnectedEvt);
        });

        window.addEventListener("gamepaddisconnected", (evt) => {
            const gamepad = gamepads.get(pad.id);
            gamepads.delete(pad.id);
            gamepad.removeEventListener("gamepadbuttondown", onAnyButtonDown);
            gamepad.removeEventListener("gamepadbuttonup", onAnyButtonUp);
            gamepadDisconnectedEvt.gamepad = gamepad;
            this.dispatchEvent(gamepadDisconnectedEvt);
            gamepad.dispose();
        });

        Object.freeze(this);
    }

    get gamepadIDs() {
        return gamepads.keys();
    }

    get gamepads() {
        return gamepads.values();
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

