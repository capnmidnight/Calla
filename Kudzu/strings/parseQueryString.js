export function parseQueryString(query) {
    const fields = new Map();
    if (query[0] === '?') {
        query = query.substring(1);
    }
    const pairs = query.split('&');
    for (const pair of pairs) {
        let key = null, value = null;
        if (pair.indexOf('=') > -1) {
            const parts = pair.split('=');
            key = parts[0];
            value = parts[1];
        }
        else {
            key = pair;
            value = "true";
        }
        fields.set(key, value);
    }
    return fields;
}
//# sourceMappingURL=parseQueryString.js.map