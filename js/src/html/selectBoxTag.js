import "../protos.js";
import {
    Option,
    Select,
    clear
} from "./tags.js";
import { HtmlCustomTag } from "./custom.js";
import { isFunction } from "./evts.js";

const _values = new Map();

export class SelectBoxTag extends HtmlCustomTag {
    constructor(noSelectionText, ...rest) {
        super("select", ...rest);

        this.noSelectionText = noSelectionText;

        this.setValues([]);

        Object.seal(this);
    }

    getValues() {
        return _values.get(this);
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

        clear(this.element);
        if (values.length === 0) {
            this.element.append(Option(this.noSelectionText));
            this.element.lock();
        }
        else {
            for (let value of values) {
                this.element.append(Option(toString(value)));
            }
            this.element.unlock();
        }
    }

    get options() {
        return this.element.options;
    }

    get selectedIndex() {
        return this.element.selectedIndex;
    }

    set selectedIndex(i) {
        this.element.selectedIndex = i;
    }

    get selectedValue() {
        if (this.selectedIndex === -1) {
            return null;
        }
        else {
            return _values.get(this)[this.selectedIndex];
        }
    }

    set selectedValue(v) {
        this.selectedIndex = _values.get(this).indexOf(v);
    }

    addEventListener(name, callback, opts) {
        this.element.addEventListener(name, callback, opts);
    }

    removeEventListener(name, callback) {
        this.element.removeEventListener(name, callback);
    }

    setOpen(v) {
        this.element.setOpen(v);
    }

    get style() {
        return this.element.style;
    }
}