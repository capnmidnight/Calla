export function assignAttributes(elem, ...rest) {
    rest.filter(x => !(x instanceof Element)
        && !(x instanceof String)
        && typeof x !== "string")
        .forEach(attr => {
        for (let key in attr) {
            const value = attr[key];
            if (key === "style") {
                for (let subKey in value) {
                    elem[key][subKey] = value[subKey];
                }
            }
            else if (key === "textContent" || key === "innerText") {
                elem.appendChild(document.createTextNode(value));
            }
            else if (key.startsWith("on") && typeof value === "function") {
                elem.addEventListener(key.substring(2), value);
            }
            else if (!(typeof value === "boolean" || value instanceof Boolean)
                || key === "muted") {
                elem[key] = value;
            }
            else if (value) {
                elem.setAttribute(key, "");
            }
            else {
                elem.removeAttribute(key);
            }
        }
    });
}
//# sourceMappingURL=html.js.map