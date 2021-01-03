import type { TagChild } from "kudzu/html/tags";
import { HtmlCustomTag } from "./HtmlCustomTag";
/**
 * Creates an input box that has a label attached to it.
 * @param id - the ID to use for the input box
 * @param inputType - the type to use for the input box (number, text, etc.)
 * @param labelText - the text to display in the label
 * @param rest - optional attributes, child elements, and text to use on the select element
 */
export declare function LabeledInput(id: string, inputType: string, labelText: string, ...rest: TagChild[]): LabeledInputTag;
/**
 * An input box that has a label attached to it.
 **/
export declare class LabeledInputTag extends HtmlCustomTag<HTMLDivElement> {
    private label;
    input: HTMLInputElement;
    /**
     * Creates an input box that has a label attached to it.
     * @param id - the ID to use for the input box
     * @param inputType - the type to use for the input box (number, text, etc.)
     * @param labelText - the text to display in the label
     * @param rest - optional attributes, child elements, and text to use on the select element
     */
    constructor(id: string, inputType: string, labelText: string, ...rest: TagChild[]);
    /**
     * Retrieves the desired element for attaching events.
     **/
    get eventTarget(): HTMLInputElement;
    /**
     * Gets the value attribute of the input element
     */
    get value(): string;
    /**
     * Sets the value attribute of the input element
     */
    set value(v: string);
    /**
     * Gets whether or not the input element is checked, if it's a checkbox or radio button.
     */
    get checked(): boolean;
    /**
     * Sets whether or not the input element is checked, if it's a checkbox or radio button.
     */
    set checked(v: boolean);
    /**
     * Sets whether or not the input element should be disabled.
     */
    setLocked(value: boolean): void;
}
