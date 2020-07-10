function hax(parent, name, label, creator) {
    parent[name] = function (...rest) {
        const value = creator(rest);
        const params = rest.map(JSON.stringify).join(", ");
        console.log("HAAAAX", label, "(", params, ") -> ", value);
        return value;
    };
}

export function haxFunction(parent, name, label) {
    const oldFunction = parent[name];
    hax(parent, name, "call " + (label || name),
        function (rest) {
            if (this === undefined) {
                return oldFunction.apply(parent, rest);
            }
            else {
                return oldFunction.apply(this, rest);
            }
        });
}

let haxCounter = 0;

export function haxClass(parent, OldClass, methods) {

    const ctor = `constructor(...rest) {
        super(...rest);
        const params = rest.map(JSON.stringify).join(", ");
        console.log("HAAAAX", "create", "${OldClass.name}", "(", params, ")");
    }`;

    const meths = [];

    for (let method of methods) {
        meths.push(`${method}(...rest) {
        const value = super.${method}(...rest);
        const params = rest.map(JSON.stringify).join(", ");
        if(value === undefined) {
            console.log("HAAAAX", "call", "${OldClass.name}::${method}", "(", params, ")");
        }
        else {
            console.log("HAAAAX", "call", "${OldClass.name}::${method}", "(", params, ") -> ", value);
        }
        return value;
    }`);
    }

    const script = `return class Hax${Date.now()}${haxCounter++} extends ${OldClass.name} {
    ${ctor}
    ${meths.join("\n    ")}
}`;

    parent[OldClass.name] = (new Function(script))();
}