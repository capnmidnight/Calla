import "../protos.js";
import { Input, Label } from "./tags.js";
import { htmlFor, type } from "./attrs.js";
import { HtmlCustomTag } from "./custom.js";

export class LabeledInputTag extends HtmlCustomTag {
    constructor(id, inputType, labelText, ...rest) {
        super("div");

        this.label = Label(
            htmlFor(id),
            labelText);

        this.input = Input(
            type(inputType),
            ...rest);

        this.element.append(
            this.label,
            this.input);

        Object.seal(this);
    }

    addEventListener(name, callback, opts) {
        this.input.addEventListener(name, callback, opts);
    }

    removeEventListener(name, callback) {
        this.input.removeEventListener(name, callback);
    }

    async once(resolveEvt, rejectEvt, timeout) {
        return await this.input.once(resolveEvt, rejectEvt, timeout);
    }

    get value() {
        return this.input.value;
    }

    set value(v) {
        this.input.value = v;
    }

    get checked() {
        return this.input.checked;
    }

    set checked(v) {
        this.input.checked = v;
    }
}