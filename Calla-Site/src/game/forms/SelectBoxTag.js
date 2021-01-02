import { disabled, id, value } from "kudzu/html/attrs";
import { elementClearChildren, Option } from "kudzu/html/tags";
import { isFunction } from "kudzu/typeChecks";
import { HtmlCustomTag } from "./HtmlCustomTag";
const disabler = disabled(true);
const enabler = disabled(false);
/**
 * Creates a select box that can bind to collections
 * @param id - the ID to use for the select box
 * @param noSelectionText - the text to display when no items are available.
 * @param makeID - a function that evalutes a databound item to create an ID for it.
 * @param makeLabel - a function that evalutes a databound item to create a label for it.
 * @param rest - optional attributes, child elements, and text to use on the select element
 */
export function SelectBox(id, noSelectionText, makeID, makeLabel, ...rest) {
    return new SelectBoxTag(id, noSelectionText, makeID, makeLabel, ...rest);
}
/**
 * A select box that can be databound to collections.
 **/
export class SelectBoxTag extends HtmlCustomTag {
    /**
     * Creates a select box that can bind to collections
     * @param tagId - the ID to use for the select box.
     * @param noSelectionText - the text to display when no items are available.
     * @param makeID - a function that evalutes a databound item to create an ID for it.
     * @param makeLabel - a function that evalutes a databound item to create a label for it.
     * @param rest - optional attributes, child elements, and text to use on the select element
     */
    constructor(tagId, noSelectionText, makeID, makeLabel, ...rest) {
        super("select", id(tagId), ...rest);
        this._emptySelectionEnabled = false;
        this._values = new Array();
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
    render() {
        elementClearChildren(this.element);
        if (this.values.length === 0) {
            this.element.append(Option(this.noSelectionText));
            disabler.apply(this.element);
        }
        else {
            if (this.emptySelectionEnabled) {
                this.element.append(Option(this.noSelectionText));
            }
            for (let v of this.values) {
                this.element.append(Option(value(this.makeID(v)), this.makeLabel(v)));
            }
            enabler.apply(this.element);
        }
    }
    /**
     * Gets whether or not the select box will have a vestigial entry for "no selection" or "null" in the select box.
     **/
    get emptySelectionEnabled() {
        return this._emptySelectionEnabled;
    }
    /**
     * Sets whether or not the select box will have a vestigial entry for "no selection" or "null" in the select box.
     **/
    set emptySelectionEnabled(value) {
        this._emptySelectionEnabled = value;
        this.render();
    }
    /**
     * Gets the collection to which the select box was databound
     **/
    get values() {
        return this._values;
    }
    /**
     * Sets the collection to which the select box will be databound
     **/
    set values(newItems) {
        const curValue = this.selectedValue;
        this._values.splice(0, this._values.length, ...newItems);
        this.render();
        this.selectedValue = curValue;
    }
    /**
     * Returns the collection of HTMLOptionElements that are stored in the select box
     */
    get options() {
        return this.element.options;
    }
    /**
     * Gets the index of the item that is currently selected in the select box.
     * The index is offset by -1 if the select box has `emptySelectionEnabled`
     * set to true, so that the indices returned are always in range of the collection
     * to which the select box was databound
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
     */
    set selectedIndex(i) {
        if (this.emptySelectionEnabled) {
            ++i;
        }
        this.element.selectedIndex = i;
    }
    /**
     * Gets the item at `selectedIndex` in the collection to which the select box was databound
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
     */
    set selectedValue(value) {
        this.selectedIndex = this.indexOf(value);
    }
    get selectedText() {
        const opts = this.element.selectedOptions;
        if (opts.length === 1) {
            return opts[0].textContent || opts[0].innerText;
        }
        return "";
    }
    set selectedText(value) {
        const idx = this.values.findIndex(v => value !== null && this.makeLabel(v) === value);
        this.selectedIndex = idx;
    }
    /**
     * Returns the index of the given item in the select box's databound collection.
     */
    indexOf(value) {
        return this.values
            .findIndex((v) => value !== null && this.makeID(value) === this.makeID(v));
    }
    /**
     * Checks to see if the value exists in the databound collection.
     */
    contains(value) {
        return this.indexOf(value) >= 0.;
    }
}
//# sourceMappingURL=SelectBoxTag.js.map