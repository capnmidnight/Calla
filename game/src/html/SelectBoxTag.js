import { isFunction } from "../../lib/Calla.js";
import { disabled, value } from "./attrs.js";
import { HtmlCustomTag } from "./HtmlCustomTag.js";
import { clear, Option } from "./tags.js";

const disabler = disabled(true),
    enabler = disabled(false);

/** @type {WeakMap<SelectBoxTag, any[]>} */
const values = new WeakMap();

function render(self) {
    clear(self.element);
    if (self.values.length === 0) {
        self.element.append(Option(self.noSelectionText));
        disabler.apply(self.element);
    }
    else {
        if (self.emptySelectionEnabled) {
            self.element.append(Option(self.noSelectionText));
        }
        for (let v of self.values) {
            self.element.append(
                Option(
                    value(self.makeID(v)),
                    self.makeLabel(v)));
        }

        enabler.apply(self.element);
    }
}

/**
 * A select box that can be databound to collections.
 **/
export class SelectBoxTag extends HtmlCustomTag {

    /**
     * Creates a select box that can bind to collections
     * @param {string} noSelectionText - the text to display when no items are available.
     * @param {makeItemValueCallback} makeID - a function that evalutes a databound item to create an ID for it.
     * @param {makeItemValueCallback} makeLabel - a function that evalutes a databound item to create a label for it.
     * @param {...TagChild} rest - optional attributes, child elements, and text to use on the select element
     */
    constructor(noSelectionText, makeID, makeLabel, ...rest) {
        super("select", ...rest);

        if (!isFunction(makeID)) {
            throw new Error("makeID parameter must be a Function");
        }

        if (!isFunction(makeLabel)) {
            throw new Error("makeLabel parameter must be a Function");
        }

        this.noSelectionText = noSelectionText;
        this.makeID = (v) => v !== null && makeID(v) || null;
        this.makeLabel = (v) => v !== null && makeLabel(v) || "None";
        this.emptySelectionEnabled = true;

        Object.seal(this);
    }

    /**
     * Gets whether or not the select box will have a vestigial entry for "no selection" or "null" in the select box.
     * @type {boolean}
     **/
    get emptySelectionEnabled() {
        return this._emptySelectionEnabled;
    }

    /**
     * Sets whether or not the select box will have a vestigial entry for "no selection" or "null" in the select box.
     * @param {boolean} value
     **/
    set emptySelectionEnabled(value) {
        this._emptySelectionEnabled = value;
        render(this);
    }

    /**
     * Gets the collection to which the select box was databound
     **/
    get values() {
        if (!values.has(this)) {
            values.set(this, []);
        }
        return values.get(this);
    }

    /**
     * Sets the collection to which the select box will be databound
     **/
    set values(newItems) {
        const curValue = this.selectedValue;
        const values = this.values;
        values.splice(0, values.length, ...newItems);
        render(this);
        this.selectedValue = curValue;
    }

    /**
     * Returns the collection of HTMLOptionElements that are stored in the select box
     * @type {HTMLOptionsCollection}
     */
    get options() {
        return this.element.options;
    }

    /**
     * Gets the index of the item that is currently selected in the select box.
     * The index is offset by -1 if the select box has `emptySelectionEnabled`
     * set to true, so that the indices returned are always in range of the collection
     * to which the select box was databound
     * @type {number}
     */
    get selectedIndex() {
        let i = this.element.selectedIndex;
        if (this.emptySelectionEnabled) {
            --i;
        }
        return i;
    }

    /**
     * Sets the index of the item that should be selected in the select box.
     * The index is offset by -1 if the select box has `emptySelectionEnabled`
     * set to true, so that the indices returned are always in range of the collection
     * to which the select box was databound
     * @param {number} i
     */
    set selectedIndex(i) {
        if (this.emptySelectionEnabled) {
            ++i;
        }
        this.element.selectedIndex = i;
    }

    /**
     * Gets the item at `selectedIndex` in the collection to which the select box was databound
     * @type {any}
     */
    get selectedValue() {
        if (0 <= this.selectedIndex && this.selectedIndex < this.values.length) {
            return this.values[this.selectedIndex];
        }
        else {
            return null;
        }
    }

    /**
     * Gets the index of the given item in the select box's databound collection, then
     * sets that index as the `selectedIndex`.
     * @param {any) value
     */
    set selectedValue(value) {
        this.selectedIndex = this.indexOf(value);
    }

    /**
     * Returns the index of the given item in the select box's databound collection.
     * @param {any} value
     * @returns {number}
     */
    indexOf(value) {
        return this.values
            .findIndex(v =>
                value !== null
                && this.makeID(value) === this.makeID(v));
    }

    /**
     * Checks to see if the value exists in the databound collection.
     * @param {any} value
     * @returns {boolean}
     */
    contains(value) {
        return this.indexOf(value) >= 0.
    }
}