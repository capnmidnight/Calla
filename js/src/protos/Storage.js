Storage.prototype.getInt = function (name, defaultValue) {
    const s = this.getItem(name);
    if (s === null) {
        return defaultValue;
    }

    const n = parseInt(s, 10);
    if (!Number.isInteger(n)) {
        return defaultValue;
    }

    return n;
};