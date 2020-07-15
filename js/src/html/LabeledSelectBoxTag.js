import "../protos.js";
import { Label, SelectBox } from "./tags.js";
import { htmlFor, id } from "./attrs.js";
import { HtmlCustomTag } from "./HtmlCustomTag.js";

export class LabeledSelectBoxTag extends HtmlCustomTag {
    /**
     * Creates a select box that can bind to collections, with a label set on the side.
     * @param {string} tagId - the ID to use for the select box.
     * @param {any} labelText - the text to put in the label.
     * @param {string} noSelectionText - the text to display when no items are available.
     * @param {makeItemValueCallback} makeID - a function that evalutes a databound item to create an ID for it.
     * @param {makeItemValueCallback} makeLabel - a function that evalutes a databound item to create a label for it.
     * @param {...TagChild} rest - optional attributes, child elements, and text to use on the select element
     */
    constructor(tagId, labelText, noSelectionText, makeID, makeLabel, ...rest) {
        super("div");

        this.label = Label(
            htmlFor(tagId),
            labelText);

        /** @type {SelectBox} */
        this.select = new SelectBox(noSelectionText, makeID, makeLabel, id(tagId), ...rest);

        this.element.append(
            this.label,
            this.select.element);

        Object.seal(this);
    }

    /**
     * Retrieves the desired element for attaching events.
     * @returns {HTMLElement}
     **/
    get eventTarget() {
        return this.select;
    }

    /**
     * Gets whether or not the select box will have a vestigial entry for "no selection" or "null" in the select box.
     * @type {boolean}
     **/
    get emptySelectionEnabled() {
        return this.select.emptySelectionEnabled;
    }

    /**
     * Sets whether or not the select box will have a vestigial entry for "no selection" or "null" in the select box.
     * @param {boolean} value
     **/
    set emptySelectionEnabled(value) {
        this.select.emptySelectionEnabled = value;
    }

    /**
     * Gets the collection to which the select box was databound
     **/
    get values() {
        return this.select.values;
    }

    /**
     * Sets the collection to which the select box will be databound
     **/
    set values(values) {
        this.select.values = values;
    }

    /**
     * Returns the collection of HTMLOptionElements that are stored in the select box
     * @type {HTMLOptionsCollection}
     */
    get options() {
        return this.select.options;
    }

    /**
     * Gets the index of the item that is currently selected in the select box.
     * The index is offset by -1 if the select box has `emptySelectionEnabled`
     * set to true, so that the indices returned are always in range of the collection
     * to which the select box was databound
     * @type {number}
     */
    get selectedIndex() {
        return this.select.selectedIndex;
    }
    /**
    * Sets the index of the item that should be selected in the select box.
    * The index is offset by -1 if the select box has `emptySelectionEnabled`
    * set to true, so that the indices returned are always in range of the collection
    * to which the select box was databound
    * @param {number} i
    */
    set selectedIndex(i) {
        this.select.selectedIndex = i;
    }

    /**
     * Gets the item at `selectedIndex` in the collection to which the select box was databound
     * @type {any}
     */
    get selectedValue() {
        return this.select.selectedValue;
    }
    /**
    * Gets the index of the given item in the select box's databound collection, then
    * sets that index as the `selectedIndex`.
     * @param {any) value
    */
    set selectedValue(v) {
        this.select.selectedValue = v;
    }

    /**
     * Returns the index of the given item in the select box's databound collection.
     * @param {any} value
     * @returns {number}
     */
    indexOf(value) {
        return this.select.indexOf(value);
    }

    /**
     * Checks to see if the value exists in the databound collection.
     * @param {any} value
     * @returns {boolean}
     */
    contains(value) {
        return this.select.contains(value);
    }
}