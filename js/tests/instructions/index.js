import { InstructionsForm } from "../../src/forms/InstructionsForm.js";

const instructions = new InstructionsForm();
document.body.appendChild(instructions.element);

async function show() {
    await instructions.showAsync();
    setTimeout(show, 1000);
}

show();