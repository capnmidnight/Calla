HTMLElement.prototype.isOpen = function() {
    return this.style.display !== "none";
};

/**
 * Sets the element's style's display property to "none"
 * when `v` is false, or `displayType` when `v` is true.
 * @memberof Element
 * @param {boolean} v
 * @param {string=""} displayType
 */
HTMLElement.prototype.setOpen = function (v, displayType = "") {
    this.style.display = v
        ? displayType
        : "none";
};

HTMLElement.prototype.setOpenWithLabel = function (v, label, enabledText, disabledText, bothText, displayType = "") {
    this.setOpen(v, displayType);
    label.updateLabel(this.isOpen(), enabledText, disabledText, bothText);
};

HTMLElement.prototype.updateLabel = function (isOpen, enabledText, disabledText, bothText) {
    bothText = bothText || "";
    if (this.accessKey) {
        bothText += ` <kbd>(ALT+${this.accessKey.toUpperCase()})</kbd>`;
    }
    this.innerHTML = (isOpen ? enabledText : disabledText) + bothText;
};

HTMLElement.prototype.toggleOpen = function (displayType = "") {
    this.setOpen(!this.isOpen(), displayType);
};

HTMLElement.prototype.toggleOpenWithLabel = function (label, enabledText, disabledText, bothText, displayType = "") {
    this.setOpenWithLabel(!this.isOpen(), label, enabledText, disabledText, bothText, displayType);
};

HTMLElement.prototype.show = function (displayType = "") {
    this.setOpen(true, displayType);
};

HTMLElement.prototype.hide = function () {
    this.setOpen(false);
};

HTMLElement.prototype.setLocked = function (value) {
    if (value) {
        this.lock();
    }
    else {
        this.unlock();
    }
};

HTMLElement.prototype.lock = function () {
    this.disabled = "disabled";
};

HTMLElement.prototype.unlock = function () {
    this.disabled = "";
};

HTMLElement.prototype.blinkBorder = function (times, color) {
    times = (times || 3) * 2;
    color = color || "rgb(255, 127, 127)";

    let state = false;
    const interval = setInterval(() => {
        state = !state;
        this.style.backgroundColor = state ? color : "";
        --times;
        if (times === 0) {
            clearInterval(interval);
        }
    }, 125);
};

const oldAddEventListener = HTMLInputElement.prototype.addEventListener;

HTMLInputElement.prototype.addEventListener = function (evtName, func, opts) {
    if (evtName === "enter") {
        oldAddEventListener.call(this, "keypress", function (evt) {
            if (evt.key === "Enter") {
                func(evt);
            }
        }, opts);
    }
    else {
        oldAddEventListener.call(this, evtName, func, opts);
    }
};