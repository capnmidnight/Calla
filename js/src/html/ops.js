import { disabled } from "./attrs.js";

export function isOpen(target) {
    if (target.isOpen) {
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
    if (target.setOpen) {
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
    if (target.updateLabel) {
        target.updateLabel(open, enabledText, disabledText, bothText);
    }
    else {
        target.innerHTML = (open ? enabledText : disabledText) + bothText;
    }
}

export function toggleOpen(target, displayType = "") {
    if (target.toggleOpen) {
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
    if (target.show) {
        target.show();
    }
    else {
        target.style.display = displayType;
    }
}

export function hide(target) {
    if (target.hide) {
        target.hide();
    }
    else {
        target.style.display = "none";
    }
};

const disabler = disabled(true),
    enabler = disabled(false);

export function setLocked(target, value) {
    if (target.setLocked) {
        target.setLocked(value);
    }
    else if (value) {
        disabler.apply(target);
    }
    else {
        enabler.apply(target);
    }
};