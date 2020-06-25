import "../protos.js";
import { Label, SelectBox } from "./tags.js";
import { htmlFor, id } from "./attrs.js";
import { HtmlCustomTag } from "./custom.js";

export class LabeledSelectBoxTag extends HtmlCustomTag {
    constructor(tagId, labelText, noSelectionText, makeID, makeLabel, ...rest) {
        super("div");

        this.label = Label(
            htmlFor(tagId),
            labelText);

        this.select = new SelectBox(noSelectionText, makeID, makeLabel, id(tagId), ...rest);

        this.element.append(
            this.label,
            this.select.element);

        Object.seal(this);
    }

    get emptySelectionEnabled() {
        return this.select.emptySelectionEnabled;
    }

    set emptySelectionEnabled(value) {
        this.select.emptySelectionEnabled = value;
    }

    get values() {
        return this.select.values;
    }

    set values(values) {
        this.select.values = values;
    }

    get options() {
        return this.select.options;
    }

    get selectedIndex() {
        return this.select.selectedIndex;
    }

    set selectedIndex(i) {
        this.select.selectedIndex = i;
    }

    get selectedValue() {
        return this.select.selectedValue;
    }

    set selectedValue(v) {
        this.select.selectedValue = v;
    }

    addEventListener(name, callback, opts) {
        this.select.addEventListener(name, callback, opts);
    }

    removeEventListener(name, callback) {
        this.select.removeEventListener(name, callback);
    }
}