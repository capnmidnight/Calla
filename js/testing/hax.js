function hax(parent, name, label, creator) {
    parent[name] = function (...rest) {
        const value = creator(rest);
        console.log("HAAAAX", label, "(", ...rest, ") -> ", value);
        return value;
    };
}

function execFunction(parent, func, rest) {
    if (this === undefined) {
        return func.apply(parent, rest);
    }
    else {
        return func.apply(this, rest);
    }
}

export function haxFunction(parent, name, label) {
    const oldFunction = parent[name];
    hax(parent, name, "call " + (label || name),
        function (rest) {
            const params = ["HAAAAX", "call", label, "(", ...rest, ")"],
                success = (value) => console.log(...params, "->", value),
                failure = (exp) => console.error(...params, "->", exp);
            try {
                const value = execFunction(this, oldFunction, rest);

                if (value === undefined) {
                    console.log(...params);
                }
                else {
                    success(value);
                    if (value instanceof Promise) {
                        value.then(success)
                            .catch(failure);
                    }
                }

                return value;
            }
            catch (exp) {
                failure(exp);
                throw exp;
            }
        });
}

export function haxMethod(parent, name) {
    const oldMethod = parent.prototype[name];
    const label = `${parent.name}::${name}`;
    parent.prototype[name] = function (...rest) {
        const params = ["HAAAAX", "call", label, "(", ...rest, ")"],
            success = (value) => console.log(...params, "->", value),
            failure = (exp) => console.error(...params, "->", exp);
        try {
            const value = oldMethod.apply(this, rest);

            if (value === undefined) {
                console.log(...params);
            }
            else {
                success(value);
                if (value instanceof Promise) {
                    value.then(success)
                        .catch(failure);
                }
            }

            return value;
        }
        catch (exp) {
            failure(exp);
            throw exp;
        }
    }
}

let haxCounter = 0;

export function haxClass(parent, OldClass, methods) {

    const ctor = `constructor(...rest) {
        super(...rest);
        console.log("HAAAAX", "create", "${OldClass.name}", "(", ...rest, ")");
    }`;

    const script = `return class Hax${Date.now()}${haxCounter++} extends ${OldClass.name} {
    ${ctor}
}`;

    parent[OldClass.name] = (new Function(script))();

    if (methods !== undefined) {
        for (let method of methods) {
            haxMethod(OldClass, method);
        }
    }
}