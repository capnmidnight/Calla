import { OptionsForm } from "../../src/forms/OptionsForm.js";
import { GamepadManager } from "../../src/gamepad/GamepadStateManager.js";

const options = new OptionsForm();
document.body.appendChild(options.element);

options.addEventListener("inputBindingChanged", () => {
    console.log(options.inputBinding);
});

options.inputBinding = {
    keyButtonUp: "ArrowLeft"
};

GamepadManager.addEventListener("gamepadconnected", () => {
    options.gamepads = GamepadManager.gamepads;
});

GamepadManager.addEventListener("gamepaddisconnected", () => {
    options.gamepads = GamepadManager.gamepads;
});

(async function () {
    const devices = await navigator.mediaDevices.enumerateDevices();
    options.audioInputDevices = devices.filter(d => d.kind === "audioinput");
    options.audioOutputDevices = devices.filter(d => d.kind === "audiooutput");
    options.videoInputDevices = devices.filter(d => d.kind === "videoinput");
});

async function show() {
    await options.showAsync();
    setTimeout(show, 1000);
}

show();