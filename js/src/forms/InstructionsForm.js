import { FormDialog } from "./FormDialog.js";
import { instructions } from "./instructions.js";
import { Button } from "../html/tags.js";
import { onClick } from "../html/evts.js";
import { style, systemFont } from "../html/attrs.js";

export class InstructionsForm extends FormDialog {

    constructor() {
        super("instructions", "Instructions");

        this.content.append(...instructions());

        this.footer.append(
            this.confirmButton = Button(
                systemFont,
                style({ gridArea: "4/2" }),
                "Close",
                onClick(() => this.hide())));
    }

    async showAsync() {
        this.show();
        await this.confirmButton.once("click");
        return false;
    }
}