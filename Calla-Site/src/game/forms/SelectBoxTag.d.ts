import { HtmlCustomTag } from "./HtmlCustomTag";
/**
 * Creates a string from a list item to use as the item's ID or label in a select box.
 * @callback makeItemValueCallback
 * @param {any} obj - the object
 * @returns {string}
 */
/**
 * Creates a select box that can bind to collections
 * @param {string} id - the ID to use for the select box
 * @param {string} noSelectionText - the text to display when no items are available.
 * @param {makeItemValueCallback} makeID - a function that evalutes a databound item to create an ID for it.
 * @param {makeItemValueCallback} makeLabel - a function that evalutes a databound item to create a label for it.
 * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text to use on the select element
 * @returns {SelectBoxTag}
 */
export declare function SelectBox(id: any, noSelectionText: any, makeID: any, makeLabel: any, ...rest: any[]): SelectBoxTag;
/**
 * A select box that can be databound to collections.
 **/
export declare class SelectBoxTag extends HtmlCustomTag {
    /**
     * Creates a select box that can bind to collections
     * @param {string} tagId - the ID to use for the select box.
     * @param {string} noSelectionText - the text to display when no items are available.
     * @param {makeItemValueCallback} makeID - a function that evalutes a databound item to create an ID for it.
     * @param {makeItemValueCallback} makeLabel - a function that evalutes a databound item to create a label for it.
     * @param {...import("./tag").TagChild} rest - optional attributes, child elements, and text to use on the select element
     */
    constructor(tagId: any, noSelectionText: any, makeID: any, makeLabel: any, ...rest: any[]);
    /**
     * Gets whether or not the select box will have a vestigial entry for "no selection" or "null" in the select box.
     * @type {boolean}
     **/
    get emptySelectionEnabled(): any;
    /**
     * Sets whether or not the select box will have a vestigial entry for "no selection" or "null" in the select box.
     * @param {boolean} value
     **/
    set emptySelectionEnabled(value: any);
    /**
     * Gets the collection to which the select box was databound
     **/
    get values(): any;
    /**
     * Sets the collection to which the select box will be databound
     **/
    set values(newItems: any);
    /**
     * Returns the collection of HTMLOptionElements that are stored in the select box
     * @type {HTMLOptionsCollection}
     */
    get options(): any;
    /**
     * Gets the index of the item that is currently selected in the select box.
     * The index is offset by -1 if the select box has `emptySelectionEnabled`
     * set to true, so that the indices returned are always in range of the collection
     * to which the select box was databound
     * @type {number}
     */
    get selectedIndex(): any;
    /**
     * Sets the index of the item that should be selected in the select box.
     * The index is offset by -1 if the select box has `emptySelectionEnabled`
     * set to true, so that the indices returned are always in range of the collection
     * to which the select box was databound
     * @param {number} i
     */
    set selectedIndex(i: any);
    /**
     * Gets the item at `selectedIndex` in the collection to which the select box was databound
     * @type {any}
     */
    get selectedValue(): any;
    /**
     * Gets the index of the given item in the select box's databound collection, then
     * sets that index as the `selectedIndex`.
     * @param {any) value
     */
    set selectedValue(value: any);
    get selectedText(): any;
    set selectedText(value: any);
    /**
     * Returns the index of the given item in the select box's databound collection.
     * @param {any} value
     * @returns {number}
     */
    indexOf(value: any): any;
    /**
     * Checks to see if the value exists in the databound collection.
     * @param {any} value
     * @returns {boolean}
     */
    contains(value: any): boolean;
}
