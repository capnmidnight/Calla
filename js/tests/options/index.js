import { OptionsForm } from "../../src/forms/optionsForm.js";
const options = new OptionsForm();
document.body.appendChild(options.element);

options.addEventListener("inputbindingchanged", () => {
    console.log(options.inputBinding);
});

options.inputBinding = {
    keyButtonUp: "ArrowLeft"
};

async function show() {
    const confirmed = await options.showAsync();
    console.log(confirmed);
    setTimeout(show, 1000);
}
show();