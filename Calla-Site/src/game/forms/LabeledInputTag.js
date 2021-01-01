import { htmlFor, type } from "./attrs";
import { HtmlCustomTag } from "./HtmlCustomTag";
import { setLocked } from "./ops";
import { Input, Label } from "./tags";
/**
 * Creates an input box that has a label attached to it.
 * @param {string} id - the ID to use for the input box
 * @param {string} inputType - the type to use for the input box (number, text, etc.)
 * @param {string} labelText - the text to display in the label
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text to use on the select element
 * @returns {LabeledInputTag}
 */
export function LabeledInput(id, inputType, labelText, ...rest) {
    return new LabeledInputTag(id, inputType, labelText, ...rest);
}
/**
 * An input box that has a label attached to it.
 **/
export class LabeledInputTag extends HtmlCustomTag {
    /**
     * Creates an input box that has a label attached to it.
     * @param {string} id - the ID to use for the input box
     * @param {string} inputType - the type to use for the input box (number, text, etc.)
     * @param {string} labelText - the text to display in the label
     * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text to use on the select element
     */
    constructor(id, inputType, labelText, ...rest) {
        super("div");
        this.label = Label(htmlFor(id), labelText);
        this.input = Input(type(inputType), ...rest);
        this.element.append(this.label, this.input);
        this.element.style.display = "grid";
        Object.seal(this);
    }
    /**
     * Retrieves the desired element for attaching events.
     * @returns {HTMLElement}
     **/
    get eventTarget() {
        return this.input;
    }
    /**
     * Gets the value attribute of the input element
     * @type {string}
     */
    get value() {
        return this.input.value;
    }
    /**
     * Sets the value attribute of the input element
     * @param {string} v
     */
    set value(v) {
        this.input.value = v;
    }
    /**
     * Gets whether or not the input element is checked, if it's a checkbox or radio button.
     * @type {boolean}
     */
    get checked() {
        return this.input.checked;
    }
    /**
     * Sets whether or not the input element is checked, if it's a checkbox or radio button.
     * @param {boolean} v
     */
    set checked(v) {
        this.input.checked = v;
    }
    /**
     * Sets whether or not the input element should be disabled.
     * @param {boolean} value
     */
    setLocked(value) {
        setLocked(this.input, value);
    }
}
//# sourceMappingURL=LabeledInputTag.js.map