import { EventedGamepad } from "./EventedGamepad.js";

const gamepadConnectedEvt = Object.assign(new Event("gamepadconnected"), {
    gamepad: null
}),
    gamepadDisconnectedEvt = Object.assign(new Event("gamepaddisconnected"), {
        gamepad: null
    });

/** @type {Map.<string, EventedGamepad>} */
const gamepads = new Map();

const anyButtonDownEvt = Object.assign(new Event("gamepadbuttondown"), { button: -1 }),
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
        
        window.addEventListener("gamepadconnected", (/** @type {GamepadEvent} */ evt) => {
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

    /** @type {string[]} */
    get gamepadIDs() {
        return [...gamepads.keys()];
    }

    /** @type {EventedGamepad[]} */
    get gamepads() {
        return [...gamepads.values()];
    }

    /**
     * 
     * @param {string} id
     * @returns {EventedGamepad}
     */
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
            gamepad._update(pad);
        }
    }
}

requestAnimationFrame(update);

