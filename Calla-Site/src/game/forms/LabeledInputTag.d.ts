import { HtmlCustomTag } from "./HtmlCustomTag";
/**
 * Creates an input box that has a label attached to it.
 * @param {string} id - the ID to use for the input box
 * @param {string} inputType - the type to use for the input box (number, text, etc.)
 * @param {string} labelText - the text to display in the label
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text to use on the select element
 * @returns {LabeledInputTag}
 */
export declare function LabeledInput(id: any, inputType: any, labelText: any, ...rest: any[]): LabeledInputTag;
/**
 * An input box that has a label attached to it.
 **/
export declare class LabeledInputTag extends HtmlCustomTag {
    /**
     * Creates an input box that has a label attached to it.
     * @param {string} id - the ID to use for the input box
     * @param {string} inputType - the type to use for the input box (number, text, etc.)
     * @param {string} labelText - the text to display in the label
     * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text to use on the select element
     */
    constructor(id: any, inputType: any, labelText: any, ...rest: any[]);
    /**
     * Retrieves the desired element for attaching events.
     * @returns {HTMLElement}
     **/
    get eventTarget(): any;
    /**
     * Gets the value attribute of the input element
     * @type {string}
     */
    get value(): any;
    /**
     * Sets the value attribute of the input element
     * @param {string} v
     */
    set value(v: any);
    /**
     * Gets whether or not the input element is checked, if it's a checkbox or radio button.
     * @type {boolean}
     */
    get checked(): any;
    /**
     * Sets whether or not the input element is checked, if it's a checkbox or radio button.
     * @param {boolean} v
     */
    set checked(v: any);
    /**
     * Sets whether or not the input element should be disabled.
     * @param {boolean} value
     */
    setLocked(value: any): void;
}
