/**
 * 
 * @param {Function} a
 * @param {Function} b
 */
export function add(a, b) {
    return evt => {
        a(evt);
        b(evt);
    };
}
