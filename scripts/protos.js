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