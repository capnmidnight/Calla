String.prototype.firstLetterToUpper = function () {
    return this[0].toLocaleUpperCase()
        + this.substring(1);
};