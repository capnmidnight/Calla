"use strict";

// A few convenience methods for HTML elements.

Element.prototype.show = function () {
    this.style.display = "";
};

Element.prototype.hide = function () {
    this.style.display = "none";
};

Element.prototype.lock = function () {
    this.disabled = "disabled";
};

Element.prototype.unlock = function () {
    this.disabled = "";
};

(function () {
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
})();