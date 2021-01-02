import { isFunction } from "kudzu/typeChecks";
import { disabled } from "kudzu/html/attrs";
export function isOpenable(obj) {
    return isFunction(obj.isOpen)
        && isFunction(obj.setOpen)
        && isFunction(obj.updateLabel)
        && isFunction(obj.toggleOpen)
        && isFunction(obj.show)
        && isFunction(obj.hide)
        && isFunction(obj.setLocked);
}
export function isOpen(target) {
    if (isOpenable(target)) {
        return target.isOpen();
    }
    else {
        return target.style.display !== "none";
    }
}
/**
 * Sets the element's style's display property to "none"
 * when `v` is false, or `displayType` when `v` is true.
 * @memberof Element
 * @param {boolean} v
 * @param {string} [displayType=""]
 */
export function setOpen(target, v, displayType = "") {
    if (isOpenable(target)) {
        target.setOpen(v, displayType);
    }
    else if (v) {
        show(target, displayType);
    }
    else {
        hide(target);
    }
}
export function updateLabel(target, open, enabledText, disabledText, bothText) {
    bothText = bothText || "";
    if (target.accessKey) {
        bothText += ` <kbd>(ALT+${target.accessKey.toUpperCase()})</kbd>`;
    }
    if (isOpenable(target)) {
        target.updateLabel(open, enabledText, disabledText, bothText);
    }
    else {
        target.innerHTML = (open ? enabledText : disabledText) + bothText;
    }
}
export function toggleOpen(target, displayType = "") {
    if (isOpenable(target)) {
        target.toggleOpen(displayType);
    }
    else if (isOpen(target)) {
        hide(target, displayType);
    }
    else {
        show(target);
    }
}
export function show(target, displayType = "") {
    if (isOpenable(target)) {
        target.show();
    }
    else {
        target.style.display = displayType;
    }
}
export function hide(target, displayType = "") {
    if (isOpenable(target)) {
        target.hide(displayType);
    }
    else {
        target.style.display = "none";
    }
}
;
const disabler = disabled(true), enabler = disabled(false);
export function setLocked(target, value) {
    if (isOpenable(target)) {
        target.setLocked(value);
    }
    else if (value) {
        disabler.apply(target);
    }
    else {
        enabler.apply(target);
    }
}
;
//# sourceMappingURL=ops.js.map