import { OptionsForm } from "../../src/forms/optionsForm.js";
const options = new OptionsForm();
document.body.appendChild(options.element);
async function show() {
    const confirmed = await options.showAsync();
    console.log(confirmed);
    setTimeout(show, 1000);
}
show();