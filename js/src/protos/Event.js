Event.clone = function (target, ...objs) {
    for (let obj of objs) {
        for (let key in obj) {
            if (key !== "isTrusted"
                && !Event.prototype.hasOwnProperty(key)) {
                target[key] = obj[key];
            }
        }
    }

    return target;
};