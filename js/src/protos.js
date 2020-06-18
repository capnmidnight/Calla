// A few convenience methods for HTML elements.

Element.prototype.isOpen = function () {
    return this.style.display !== "none";
};

Element.prototype.setOpen = function (v, displayType = "") {
    this.style.display = v
        ? displayType
        : "none";
};

Element.prototype.setOpenWithLabel = function (v, label, enabledText, disabledText, bothText, displayType = "") {
    this.setOpen(v, displayType);
    label.updateLabel(this.isOpen(), enabledText, disabledText, bothText);
};

Element.prototype.updateLabel = function (isOpen, enabledText, disabledText, bothText) {
    bothText = bothText || "";
    if (this.accessKey) {
        bothText += ` <kbd>(ALT+${this.accessKey.toUpperCase()})</kbd>`;
    }
    this.innerHTML = (isOpen ? enabledText : disabledText) + bothText;
};

Element.prototype.toggleOpen = function (displayType = "") {
    this.setOpen(!this.isOpen(), displayType);
};

Element.prototype.toggleOpenWithLabel = function (label, enabledText, disabledText, bothText, displayType = "") {
    this.setOpenWithLabel(!this.isOpen(), label, enabledText, disabledText, bothText, displayType);
};

Element.prototype.show = function (displayType = "") {
    this.setOpen(true, displayType);
};

Element.prototype.hide = function () {
    this.setOpen(false);
};

Element.prototype.setLocked = function (value) {
    if (value) {
        this.lock();
    }
    else {
        this.unlock();
    }
};

Element.prototype.lock = function () {
    this.disabled = "disabled";
};

Element.prototype.unlock = function () {
    this.disabled = "";
};

Element.prototype.blinkBorder = function (times, color) {
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

HTMLCanvasElement.prototype.resize = function () {
    this.width = this.clientWidth * devicePixelRatio;
    this.height = this.clientHeight * devicePixelRatio;
};

const oldAddEventListener = HTMLInputElement.prototype.addEventListener;

HTMLInputElement.prototype.addEventListener = function (evtName, func, bubbles) {
    if (evtName === "enter") {
        oldAddEventListener.call(this, "keypress", function (evt) {
            if (evt.key === "Enter") {
                func(evt);
            }
        });
    }
    else {
        oldAddEventListener.call(this, evtName, func, bubbles);
    }
};

Response.prototype.xml = async function () {
    const text = await this.text(),
        parser = new DOMParser(),
        xml = parser.parseFromString(text, "text/xml");

    return xml.documentElement;
};

Array.prototype.random = function (defaultValue) {
    const offset = !!defaultValue ? 1 : 0,
        idx = Math.floor(Math.random() * (this.length + offset)) - offset;
    if (idx < 0) {
        return defaultValue;
    }
    else {
        return this[idx];
    }
};

HTMLSelectElement.prototype.setSelectedValue = function (value) {
    this.value = "";

    if (value !== null
        && value !== undefined) {
        value = value.toString();
        for (let option of this.options) {
            if (option.value === value) {
                this.value = value;
                return;
            }
        }
    }
};

Storage.prototype.getInt = function (name, defaultValue) {
    const n = parseFloat(this.getItem(name));
    if (!Number.isInteger(n)) {
        return defaultValue;
    }

    return n;
};

function add(a, b) {
    return evt => {
        a(evt);
        b(evt);
    };
}

EventTarget.prototype.once = function (resolveEvt, rejectEvt, timeout) {
    return new Promise((resolve, reject) => {
        const hasResolveEvt = resolveEvt !== undefined && resolveEvt !== null,
            removeResolve = () => {
                if (hasResolveEvt) {
                    this.removeEventListener(resolveEvt, resolve);
                }
            },
            hasRejectEvt = rejectEvt !== undefined && rejectEvt !== null,
            removeReject = () => {
                if (hasRejectEvt) {
                    this.removeEventListener(rejectEvt, reject);
                }
            },
            remove = add(removeResolve, removeReject);

        resolve = add(remove, resolve);
        reject = add(remove, reject);

        if (timeout !== undefined
            && timeout !== null) {
            const timer = setTimeout(reject, timeout),
                cancel = () => clearTimeout(timer);
            resolve = add(cancel, resolve);
            reject = add(cancel, reject);
        }

        if (hasResolveEvt) {   
            this.addEventListener(resolveEvt, resolve);
        }

        if (hasRejectEvt) {
            this.addEventListener(rejectEvt, reject);
        }
    });
};