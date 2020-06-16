import "./protos.js";
import {
    Label,
    Option,
    Select,
    clear
} from "./htmltags.js";
import { htmlFor } from "./htmlattrs.js";
import { HtmlCustomTag } from "./htmlcustom.js";
import { isFunction } from "./htmlevts.js";

const _values = new Map();

export class LabeledSelectTag extends HtmlCustomTag {
    constructor(id, labelText, noSelectionText, ...rest) {
        super();

        this.noSelectionText = noSelectionText;

        this.label = Label(
            htmlFor(id),
            labelText);

        this.select = Select(...rest);

        this.element.append(
            this.label,
            this.select);

        this.setValues([]);

        Object.seal(this);
    }

    getValues() {
        return _values.get(this).slice();
    }

    setValues(newItems, toString = null) {
        if (toString === null
            || toString === undefined) {
            toString = (o) => o.toString();
        }

        if (!isFunction(toString)) {
            throw new Error("toString parameter must be a Function");
        }

        if (!_values.has(this)) {
            _values.set(this, []);
        }

        const values = _values.get(this);
        values.splice(0, values.length, ...newItems);

        clear(this.select);
        if (values.length === 0) {
            this.select.append(Option(this.noSelectionText));
            this.select.lock();
        }
        else {
            for (let value of values) {
                this.select.append(Option(toString(value)));
            }
            this.select.unlock();
        }
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
        return this.values[this.selectedIndex];
    }

    set selectedValue(v) {
        this.selectedIndex = this.values.indexOf(v);
    }

    addEventListener(name, callback) {
        this.select.addEventListener(name, callback);
    }

    removeEventListener(name, callback) {
        this.select.removeEventListener(name, callback);
    }
}