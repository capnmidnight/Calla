import { TagChild } from "kudzu/html/tags";
import { HtmlCustomTag } from "./HtmlCustomTag";
/**
 * Creates a string from a list item to use as the item's ID or label in a select box.
 */
declare type makeItemValueCallback<T> = (obj: T) => string;
/**
 * Creates a select box that can bind to collections
 * @param id - the ID to use for the select box
 * @param noSelectionText - the text to display when no items are available.
 * @param makeID - a function that evalutes a databound item to create an ID for it.
 * @param makeLabel - a function that evalutes a databound item to create a label for it.
 * @param rest - optional attributes, child elements, and text to use on the select element
 */
export declare function SelectBox<T>(id: string, noSelectionText: string, makeID: makeItemValueCallback<T>, makeLabel: makeItemValueCallback<T>, ...rest: TagChild[]): SelectBoxTag<T>;
/**
 * A select box that can be databound to collections.
 **/
export declare class SelectBoxTag<T> extends HtmlCustomTag<HTMLSelectElement> {
    private noSelectionText;
    private makeID;
    private makeLabel;
    private _emptySelectionEnabled;
    private _values;
    /**
     * Creates a select box that can bind to collections
     * @param tagId - the ID to use for the select box.
     * @param noSelectionText - the text to display when no items are available.
     * @param makeID - a function that evalutes a databound item to create an ID for it.
     * @param makeLabel - a function that evalutes a databound item to create a label for it.
     * @param rest - optional attributes, child elements, and text to use on the select element
     */
    constructor(tagId: string, noSelectionText: string, makeID: makeItemValueCallback<T>, makeLabel: makeItemValueCallback<T>, ...rest: TagChild[]);
    private render;
    /**
     * Gets whether or not the select box will have a vestigial entry for "no selection" or "null" in the select box.
     **/
    get emptySelectionEnabled(): boolean;
    /**
     * Sets whether or not the select box will have a vestigial entry for "no selection" or "null" in the select box.
     **/
    set emptySelectionEnabled(value: boolean);
    /**
     * Gets the collection to which the select box was databound
     **/
    get values(): T[];
    /**
     * Sets the collection to which the select box will be databound
     **/
    set values(newItems: T[]);
    /**
     * Returns the collection of HTMLOptionElements that are stored in the select box
     */
    get options(): HTMLOptionsCollection;
    /**
     * Gets the index of the item that is currently selected in the select box.
     * The index is offset by -1 if the select box has `emptySelectionEnabled`
     * set to true, so that the indices returned are always in range of the collection
     * to which the select box was databound
     */
    get selectedIndex(): number;
    /**
     * Sets the index of the item that should be selected in the select box.
     * The index is offset by -1 if the select box has `emptySelectionEnabled`
     * set to true, so that the indices returned are always in range of the collection
     * to which the select box was databound
     */
    set selectedIndex(i: number);
    /**
     * Gets the item at `selectedIndex` in the collection to which the select box was databound
     */
    get selectedValue(): T;
    /**
     * Gets the index of the given item in the select box's databound collection, then
     * sets that index as the `selectedIndex`.
     */
    set selectedValue(value: T);
    get selectedText(): string;
    set selectedText(value: string);
    /**
     * Returns the index of the given item in the select box's databound collection.
     */
    indexOf(value: T): number;
    /**
     * Checks to see if the value exists in the databound collection.
     */
    contains(value: T): boolean;
}
export {};
