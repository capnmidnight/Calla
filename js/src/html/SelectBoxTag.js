import "../protos.js";
import { HtmlCustomTag } from "./HtmlCustomTag.js";
import { isFunction } from "../events.js";
import { clear, Option } from "./tags.js";
import { value } from "./attrs.js";

const _values = new Map();

export class SelectBoxTag extends HtmlCustomTag {
    constructor(noSelectionText, makeID, makeLabel, ...rest) {
        super("select", ...rest);

        if (!isFunction(makeID)) {
            throw new Error("makeID parameter must be a Function");
        }

        if (!isFunction(makeLabel)) {
            throw new Error("makeLabel parameter must be a Function");
        }

        _values.set(this, []);

        this.noSelectionText = noSelectionText;
        this.makeID = (v) => v !== null && makeID(v) || null;
        this.makeLabel = (v) => v !== null && makeLabel(v) || "None";
        this.emptySelectionEnabled = true;

        Object.seal(this);
    }

    get emptySelectionEnabled() {
        return this._emptySelectionEnabled;
    }

    set emptySelectionEnabled(value) {
        this._emptySelectionEnabled = value;
        this._render();
    }

    get values() {
        return _values.get(this);
    }

    set values(newItems) {
        const curValue = this.selectedValue;
        const values = _values.get(this);
        values.splice(0, values.length, ...newItems);
        this._render();
        this.selectedValue = curValue;
    }

    _render() {
        clear(this.element);
        if (this.values.length === 0) {
            this.element.append(Option(this.noSelectionText));
            this.element.lock();
        }
        else {
            if (this.emptySelectionEnabled) {
                this.element.append(Option(this.noSelectionText));
            }
            for (let v of this.values) {
                this.element.append(
                    Option(
                        value(this.makeID(v)),
                        this.makeLabel(v)));
            }

            this.element.unlock();
        }
    }

    get options() {
        return this.element.options;
    }

    get selectedIndex() {
        let i = this.element.selectedIndex;
        if (this.emptySelectionEnabled) {
            --i;
        }
        return i;
    }

    set selectedIndex(i) {
        if (this.emptySelectionEnabled) {
            ++i;
        }
        this.element.selectedIndex = i;
    }

    get selectedValue() {
        if (0 <= this.selectedIndex && this.selectedIndex < this.values.length) {
            return this.values[this.selectedIndex];
        }
        else {
            return null;
        }
    }

    indexOf(value) {
        return _values.get(this)
            .findIndex(v =>
                value !== null
                && this.makeID(value) === this.makeID(v));
    }

    set selectedValue(value) {
        this.selectedIndex = this.indexOf(value);
    }

    contains(value) {
        return this.indexOf(value) >= 0.
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