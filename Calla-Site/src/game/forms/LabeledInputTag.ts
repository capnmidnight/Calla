import { htmlFor, type } from "kudzu/html/attrs";
import type { TagChild } from "kudzu/html/tags";
import { Input, Label } from "kudzu/html/tags";
import { HtmlCustomTag } from "./HtmlCustomTag";
import { setLocked } from "./ops";

/**
 * Creates an input box that has a label attached to it.
 * @param id - the ID to use for the input box
 * @param inputType - the type to use for the input box (number, text, etc.)
 * @param labelText - the text to display in the label
 * @param rest - optional attributes, child elements, and text to use on the select element
 */
export function LabeledInput(id: string, inputType: string, labelText: string, ...rest: TagChild[]) {
    return new LabeledInputTag(id, inputType, labelText, ...rest);
}

/**
 * An input box that has a label attached to it.
 **/
export class LabeledInputTag extends HtmlCustomTag<HTMLDivElement> {

    private label: HTMLLabelElement;
    input: HTMLInputElement;

    /**
     * Creates an input box that has a label attached to it.
     * @param id - the ID to use for the input box
     * @param inputType - the type to use for the input box (number, text, etc.)
     * @param labelText - the text to display in the label
     * @param rest - optional attributes, child elements, and text to use on the select element
     */
    constructor(id: string, inputType: string, labelText: string, ...rest: TagChild[]) {
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

        this.element.style.display = "grid";


        Object.seal(this);
    }

    /**
     * Retrieves the desired element for attaching events.
     **/
    get eventTarget() {
        return this.input;
    }

    /**
     * Gets the value attribute of the input element
     */
    get value(): string {
        return this.input.value;
    }

    /**
     * Sets the value attribute of the input element
     */
    set value(v: string) {
        this.input.value = v;
    }

    /**
     * Gets whether or not the input element is checked, if it's a checkbox or radio button.
     */
    get checked(): boolean {
        return this.input.checked;
    }

    /**
     * Sets whether or not the input element is checked, if it's a checkbox or radio button.
     */
    set checked(v: boolean) {
        this.input.checked = v;
    }

    /**
     * Sets whether or not the input element should be disabled.
     */
    setLocked(value: boolean) {
        setLocked(this.input, value);
    }
}