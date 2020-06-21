import "../protos.js";
import { Label, SelectBox } from "./tags.js";
import { htmlFor, id } from "./attrs.js";
import { HtmlCustomTag } from "./custom.js";

export class LabeledSelectBoxTag extends HtmlCustomTag {
    constructor(tagId, labelText, noSelectionText, ...rest) {
        super("div");

        this.noSelectionText = noSelectionText;

        this.label = Label(
            htmlFor(tagId),
            labelText);

        this.select = new SelectBox(id(tagId), ...rest);

        this.element.append(
            this.label,
            this.select.element);

        this.setValues([]);

        Object.seal(this);
    }

    getValues() {
        return this.select.getValues();
    }

    setValues(newItems, toString = null) {
        this.select.setValues(newItems, toString);
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
        this.selectedValue = v;
    }

    addEventListener(name, callback, opts) {
        this.select.addEventListener(name, callback, opts);
    }

    removeEventListener(name, callback) {
        this.select.removeEventListener(name, callback);
    }
}